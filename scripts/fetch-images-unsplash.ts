/**
 * scripts/fetch-images-unsplash.ts
 *
 * Busca imagens do Unsplash por categoria de post e adiciona aos posts
 * Funciona em batch — bem mais rápido que manual
 *
 * Uso:
 *   UNSPLASH_API_KEY=xxxxx npx ts-node --project tsconfig.scripts.json scripts/fetch-images-unsplash.ts --dry-run
 *   UNSPLASH_API_KEY=xxxxx npx ts-node --project tsconfig.scripts.json scripts/fetch-images-unsplash.ts
 */

import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import { resolve } from 'node:path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const DRY_RUN = process.argv.includes('--dry-run');
const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY;

if (!UNSPLASH_API_KEY) {
  console.error('❌ UNSPLASH_API_KEY não configurada em .env.local');
  console.error('   Obtenha em: https://unsplash.com/developers');
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-01-01',
});

interface Post {
  _id: string;
  title: string;
  category: string;
  slug: { current: string };
  mainImage?: { asset: { _ref: string } };
}

// Mapa de categoria → palavras-chave Unsplash
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Espiritualidade: ['spirituality', 'meditation', 'peace', 'light'],
  Reflexões: ['contemplation', 'thinking', 'philosophy', 'nature'],
  'Cura Emocional': ['healing', 'wellness', 'serenity', 'nature'],
  Contos: ['storytelling', 'book', 'narrative', 'reading'],
  'Justiça Social': ['social-justice', 'community', 'equality', 'hands'],
  Poesia: ['poetry', 'literature', 'art', 'writing'],
  'Mulheres - Lutas Sociais': ['women', 'equality', 'strength', 'community'],
  'Assédio Moral': ['workplace', 'stress', 'health', 'support'],
};

async function fetchImageFromUnsplash(
  category: string,
  title: string
): Promise<string | null> {
  try {
    // Usa keywords da categoria + palavras-chave do título
    const keywords = CATEGORY_KEYWORDS[category] || ['reflection'];
    const query = keywords[Math.floor(Math.random() * keywords.length)];

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=1&client_id=${UNSPLASH_API_KEY}`,
      { headers: { Accept: 'application/json' } }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data: any = await response.json();

    if (!data.results || data.results.length === 0) {
      return null;
    }

    return data.results[0].urls.regular; // URL regular image
  } catch (err) {
    console.error(`  ⚠️  Erro ao buscar imagem: ${err}`);
    return null;
  }
}

async function uploadImageToSanity(imageUrl: string): Promise<string | null> {
  try {
    // Baixa a imagem e faz upload direto para Sanity
    const imageResponse = await fetch(imageUrl);
    const buffer = Buffer.from(await imageResponse.arrayBuffer());

    const asset = await client.assets.upload('image', buffer, {
      filename: `unsplash-${Date.now()}.jpg`,
    });

    return asset._id;
  } catch (err) {
    console.error(`  ⚠️  Erro ao upload: ${err}`);
    return null;
  }
}

async function addImageToPost(
  postId: string,
  assetId: string
): Promise<boolean> {
  try {
    await client
      .patch(postId)
      .set({
        mainImage: {
          _type: 'image',
          asset: { _type: 'reference', _ref: assetId },
        },
      })
      .commit();

    return true;
  } catch (err) {
    console.error(`  ❌ Erro ao atualizar post: ${err}`);
    return false;
  }
}

async function main() {
  console.log('🖼️  Buscando e adicionando imagens do Unsplash...\n');

  try {
    // Busca posts sem imagem
    const posts = await client.fetch<Post[]>(
      `*[_type == "post" && !defined(mainImage)] | order(publishedAt desc) {
        _id,
        title,
        category,
        slug
      }`
    );

    console.log(`📊 Encontrados: ${posts.length} posts sem imagem\n`);

    let updated = 0;
    let skipped = 0;

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      const idx = i + 1;

      console.log(`[${idx}/${posts.length}] ${post.title.slice(0, 50)}...`);
      console.log(`  Categoria: ${post.category}`);

      // Busca imagem
      const imageUrl = await fetchImageFromUnsplash(post.category, post.title);
      if (!imageUrl) {
        console.log(`  ⏭️  Ignorado: nenhuma imagem encontrada`);
        skipped++;
        continue;
      }

      if (DRY_RUN) {
        console.log(`  [DRY-RUN] Imagem encontrada:`);
        console.log(`  ${imageUrl}`);
        updated++;
        continue;
      }

      // Upload para Sanity
      const assetId = await uploadImageToSanity(imageUrl);
      if (!assetId) {
        console.log(`  ❌ Falha no upload`);
        skipped++;
        continue;
      }

      // Adiciona ao post
      const success = await addImageToPost(post._id, assetId);
      if (success) {
        console.log(`  ✅ Imagem adicionada`);
        updated++;
      } else {
        skipped++;
      }

      // Rate limiting (2 req/sec para Unsplash)
      await new Promise((r) => setTimeout(r, 500));
    }

    console.log(`\n${'─'.repeat(60)}`);
    console.log('📊 RESUMO');
    console.log('─'.repeat(60));
    console.log(`Atualizados: ${updated}`);
    console.log(`Ignorados: ${skipped}`);
    console.log(`Total: ${updated + skipped}`);

    if (DRY_RUN) {
      console.log('\n[DRY-RUN] Nenhuma imagem foi realmente adicionada.');
      console.log('Execute sem --dry-run para adicionar realmente.\n');
    } else {
      console.log('\n✅ Imagens adicionadas com sucesso!\n');
    }
  } catch (err) {
    console.error(
      `❌ Erro fatal: ${err instanceof Error ? err.message : String(err)}`
    );
    process.exit(1);
  }
}

main();
