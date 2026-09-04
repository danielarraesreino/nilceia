/**
 * scripts/fetch-original-blogspot-images.ts
 *
 * Busca as imagens reais dos posts no Blogspot original e
 * associa ao campo mainImage do Sanity.
 *
 * Uso:
 *   npx ts-node --project tsconfig.scripts.json scripts/fetch-original-blogspot-images.ts --dry-run
 *   npx ts-node --project tsconfig.scripts.json scripts/fetch-original-blogspot-images.ts
 */

import { createClient } from '@sanity/client';
import { XMLParser } from 'fast-xml-parser';
import * as dotenv from 'dotenv';
import { resolve } from 'node:path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const DRY_RUN = process.argv.includes('--dry-run');
const BLOGSPOT_FEED = 'https://nilceiaeulampio.blogspot.com/feeds/posts/default?alt=rss';

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

interface FeedItem {
  title?: string;
  link?: string | string[];
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

function selectOriginalArticleUrl(item: FeedItem): string | null {
  if (!item.link) return null;

  const links = Array.isArray(item.link) ? item.link : [item.link];
  const preferred = links.find((l) => typeof l === 'string' && l.includes('blogspot.com'));
  return preferred ? String(preferred) : null;
}

function extractImageCandidates(html: string): string[] {
  const candidates = Array.from(
    html.matchAll(/https?:\/\/[^\s"'<>]+\.(?:png|jpe?g|webp|gif|avif)(?:\?[^\s"'<>]*)?/gi)
  ).map((m) => m[0]);

  return candidates.filter((url) => {
    const lower = url.toLowerCase();
    return (
      lower.includes('blogger.googleusercontent.com') ||
      lower.includes('1.bp.blogspot.com') ||
      lower.includes('2.bp.blogspot.com') ||
      lower.includes('3.bp.blogspot.com') ||
      lower.includes('4.bp.blogspot.com')
    ) && !lower.includes('icon18_edit_allbkg') && !lower.includes('watermark') && !lower.includes('post_background');
  });
}

async function fetchBlogspotFeed(): Promise<Map<string, string>> {
  const res = await fetch(BLOGSPOT_FEED);
  if (!res.ok) {
    throw new Error(`Feed fetch failed: ${res.status} ${res.statusText}`);
  }

  const xml = await res.text();
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
  const data = parser.parse(xml) as any;
  const items: FeedItem[] = Array.isArray(data?.rss?.channel?.item) ? data.rss.channel.item : [data?.rss?.channel?.item].filter(Boolean);

  const map = new Map<string, string>();
  for (const item of items) {
    const title = String(item.title || '').trim();
    const link = selectOriginalArticleUrl(item);
    if (!title || !link) continue;
    map.set(normalizeTitle(title), link);
  }

  return map;
}

async function fetchArticleImage(postUrl: string): Promise<string | null> {
  const res = await fetch(postUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });
  if (!res.ok) {
    return null;
  }
  const html = await res.text();
  const candidates = extractImageCandidates(html);
  return candidates[0] ?? null;
}

async function uploadImageToSanity(imageUrl: string, title: string): Promise<string | null> {
  const res = await fetch(imageUrl);
  if (!res.ok) {
    return null;
  }

  const arrayBuffer = await res.arrayBuffer();
  const bytes = Buffer.from(arrayBuffer);
  const asset = await client.assets.upload('image', bytes, {
    filename: `${normalizeTitle(title).slice(0, 80)}.jpg`,
  });

  return asset._id;
}

async function main() {
  console.log('📸 Buscando imagens reais dos posts no Blogspot original...');

  const titleToUrl = await fetchBlogspotFeed();
  console.log(`📊 ${titleToUrl.size} links de posts no feed original`);

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

    const originalUrl = titleToUrl.get(normalizeTitle(post.title));
    if (!originalUrl) {
      console.log(`[${i + 1}/${posts.length}] ${post.title} — sem URL no feed original`);
      skipped++;
      continue;
    }

    console.log(`[${i + 1}/${posts.length}] ${post.title} — buscando imagem real...`);

    const imageUrl = await fetchArticleImage(originalUrl);
    if (!imageUrl) {
      console.log(`  ⏭️ sem imagem no artigo`);
      skipped++;
      continue;
    }

    console.log(`  ✅ imagem encontrada: ${imageUrl}`);

    if (DRY_RUN) {
      updated++;
      continue;
    }

    const assetId = await uploadImageToSanity(imageUrl, post.title);
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
    console.log('\n✅ Imagens originais do Blogspot foram anexadas ao Sanity.');
  }
}

main().catch((err) => {
  console.error('❌ Erro fatal:', err instanceof Error ? err.message : String(err));
  process.exit(1);
});
