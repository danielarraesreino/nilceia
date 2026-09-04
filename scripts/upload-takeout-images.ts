/**
 * scripts/upload-takeout-images.ts
 *
 * Lê o feed.atom local do Takeout do Blogger, mapeia os títulos dos posts
 * para os nomes dos arquivos de imagem e faz upload dos arquivos locais
 * da pasta do Takeout para o Sanity.
 *
 * Uso:
 *   npx ts-node --project tsconfig.scripts.json scripts/upload-takeout-images.ts
 */

import { createClient } from '@sanity/client';
import { XMLParser } from 'fast-xml-parser';
import * as dotenv from 'dotenv';
import { resolve, join } from 'node:path';
import { readFileSync, existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const DRY_RUN = process.argv.includes('--dry-run');

// Caminhos do Takeout local
const TAKEOUT_DIR = '/home/dan/Documentos/nilblog/Takeout/Blogger';
const FEED_PATH = join(TAKEOUT_DIR, 'Blogs/Reflexões Interioranas/feed.atom');
const ALBUMS_DIR = join(TAKEOUT_DIR, 'Albums');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-01-01',
});

interface PostSanity {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: { asset?: { _ref?: string } } | null;
}

function normalizeTitle(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractImageFilenames(html: string): string[] {
  if (!html) return [];
  const urls = Array.from(
    html.matchAll(/https?:\/\/[^\s"'<>]+\.(?:png|jpe?g|webp|gif|avif)(?:\?[^\s"'<>]*)?/gi)
  ).map((m) => m[0]);

  return urls
    .map(url => {
      try {
        const parts = url.split('/');
        return parts[parts.length - 1];
      } catch {
        return null;
      }
    })
    .filter(Boolean) as string[];
}

async function findImageInTakeout(filename: string): Promise<string | null> {
  try {
    const folders = await readdir(ALBUMS_DIR, { withFileTypes: true });
    for (const folder of folders) {
      if (folder.isDirectory()) {
        const folderPath = join(ALBUMS_DIR, folder.name);
        const files = await readdir(folderPath);
        if (files.includes(filename)) {
          return join(folderPath, filename);
        }
        const baseName = filename.replace(/\.(png|jpe?g|gif)$/i, '');
        const matchedFile = files.find(f => f.includes(baseName) && !f.endsWith('.json'));
        if (matchedFile) {
           return join(folderPath, matchedFile);
        }
      }
    }
  } catch (err) {
    console.error('Erro ao ler pastas do Takeout:', err);
  }
  return null;
}

async function uploadLocalImageToSanity(localPath: string, title: string): Promise<string | null> {
  try {
    const buffer = readFileSync(localPath);
    const ext = localPath.split('.').pop() || 'jpg';
    const asset = await client.assets.upload('image', buffer, {
      filename: `${normalizeTitle(title).slice(0, 80)}.${ext}`,
    });
    return asset._id;
  } catch (err) {
    console.error(`Falha ao fazer upload de ${localPath}`, err);
    return null;
  }
}

async function main() {
  console.log('📸 Lendo feed.atom local do Takeout...');
  
  if (!existsSync(FEED_PATH)) {
    throw new Error(`Feed local não encontrado em: ${FEED_PATH}`);
  }

  const xml = readFileSync(FEED_PATH, 'utf-8');
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
  const data = parser.parse(xml) as any;
  const entries = Array.isArray(data?.feed?.entry) ? data.feed.entry : [data?.feed?.entry].filter(Boolean);

  const titleToImageNames = new Map<string, string[]>();
  
  for (const entry of entries) {
    const title = String(entry.title?.['#text'] || entry.title || '').trim();
    const content = String(entry.content?.['#text'] || entry.content || '');
    if (!title || !content) continue;
    
    const filenames = extractImageFilenames(content);
    if (filenames.length > 0) {
      titleToImageNames.set(normalizeTitle(title), filenames);
    }
  }

  console.log(`📊 ${titleToImageNames.size} posts com imagens encontrados no feed local`);

  const posts = await client.fetch<PostSanity[]>(`*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage
  }`);

  let updated = 0;
  let skipped = 0;

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    if (post.mainImage && post.mainImage.asset && post.mainImage.asset._ref) {
      console.log(`[${i + 1}/${posts.length}] ${post.title} — já tem imagem`);
      continue;
    }

    const imageNames = titleToImageNames.get(normalizeTitle(post.title));
    if (!imageNames || imageNames.length === 0) {
      console.log(`[${i + 1}/${posts.length}] ${post.title} — sem imagens no feed original`);
      skipped++;
      continue;
    }

    console.log(`[${i + 1}/${posts.length}] ${post.title} — procurando ${imageNames[0]} no Takeout...`);

    const localImagePath = await findImageInTakeout(imageNames[0]);
    
    if (!localImagePath) {
      console.log(`  ⏭️ imagem não encontrada fisicamente no Takeout (${imageNames[0]})`);
      skipped++;
      continue;
    }

    console.log(`  ✅ imagem local encontrada: ${localImagePath}`);

    if (DRY_RUN) {
      updated++;
      continue;
    }

    const assetId = await uploadLocalImageToSanity(localImagePath, post.title);
    if (!assetId) {
      console.log('  ❌ falha ao subir imagem para Sanity');
      skipped++;
      continue;
    }

    await client.patch(post._id).set({
      mainImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: assetId,
        },
      },
    }).commit();

    updated++;
    await new Promise((resolve) => setTimeout(resolve, 400));
  }

  console.log('\n' + '─'.repeat(60));
  console.log('📊 RESUMO');
  console.log('─'.repeat(60));
  console.log(`Atualizadas: ${updated}`);
  console.log(`Ignoradas: ${skipped}`);
  console.log(`Total: ${posts.length}`);

  if (DRY_RUN) {
    console.log('\n[DRY-RUN] Nenhuma imagem foi realemnte adicionada.');
  } else {
    console.log('\n✅ Imagens do Takeout foram anexadas ao Sanity.');
  }
}

main().catch((err) => {
  console.error('❌ Erro fatal:', err instanceof Error ? err.message : String(err));
  process.exit(1);
});
