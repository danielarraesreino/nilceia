/**
 * scripts/normalize-titles.ts
 *
 * Normaliza títulos dos posts importados do Blogger.
 * Converte MAIÚSCULAS → Title Case (mais legível)
 *
 * Uso:
 *   npx ts-node --project tsconfig.scripts.json scripts/normalize-titles.ts --dry-run
 *   npx ts-node --project tsconfig.scripts.json scripts/normalize-titles.ts
 */

import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import { resolve } from 'node:path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const DRY_RUN = process.argv.includes('--dry-run');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-01-01',
});

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
}

// Utilities
function isAllCaps(text: string): boolean {
  return /^[A-ZÀÁÂÃÄÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝŸÇ\s\-\.!?,:;()]+$/.test(text) && text.length > 5;
}

function toTitleCase(text: string): string {
  // Palavras que devem permanecer minúsculas (exceto na primeira)
  const lowercaseWords = new Set([
    'a', 'o', 'e', 'é', 'que', 'de', 'da', 'do', 'das', 'dos',
    'para', 'por', 'em', 'na', 'no', 'nas', 'nos', 'com', 'sem',
    'à', 'às', 'um', 'uma', 'uns', 'umas', 'ou', 'entre', 'se',
  ]);

  return text
    .toLowerCase()
    .split(' ')
    .map((word, idx) => {
      if (idx === 0) {
        // Primeira palavra sempre maiúscula
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      if (lowercaseWords.has(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 96);
}

async function normalizePostTitles() {
  console.log('📚 Normalizando títulos de posts...\n');

  try {
    // Busca todos os posts
    const posts = await client.fetch<Post[]>(
      `*[_type == "post"] | order(publishedAt desc) {
        _id,
        title,
        slug
      }`
    );

    console.log(`Total de posts: ${posts.length}\n`);

    let updated = 0;
    let skipped = 0;

    for (const post of posts) {
      if (!isAllCaps(post.title)) {
        skipped++;
        continue;
      }

      const newTitle = toTitleCase(post.title);
      const newSlug = generateSlug(newTitle);

      console.log(`[${updated + 1}/${posts.length}] Normalizando:
  Antes: "${post.title}"
  Depois: "${newTitle}"
  Slug: ${post.slug.current} → ${newSlug}`);

      if (!DRY_RUN) {
        await client
          .patch(post._id)
          .set({
            title: newTitle,
            slug: { _type: 'slug', current: newSlug },
          })
          .commit()
          .catch((err) => {
            console.error(`  ❌ Erro ao atualizar: ${err.message}`);
          });

        // Rate limiting
        await new Promise((r) => setTimeout(r, 100));
      }

      updated++;
    }

    console.log(`\n${'─'.repeat(60)}`);
    console.log('📊 RESUMO');
    console.log('─'.repeat(60));
    console.log(`Atualizados: ${updated}`);
    console.log(`Ignorados (já OK): ${skipped}`);
    console.log(`Total: ${updated + skipped}`);

    if (DRY_RUN) {
      console.log('\n[DRY-RUN] Nenhum dado foi gravado.');
      console.log('Execute sem --dry-run para normalizar realmente.\n');
    } else {
      console.log('\n✅ Títulos normalizados com sucesso!\n');
    }
  } catch (err) {
    console.error(
      `❌ Erro fatal: ${err instanceof Error ? err.message : String(err)}`
    );
    process.exit(1);
  }
}

normalizePostTitles();
