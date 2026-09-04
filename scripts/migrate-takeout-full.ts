import { createClient } from '@sanity/client';
import { XMLParser } from 'fast-xml-parser';
import * as dotenv from 'dotenv';
import { resolve, join } from 'node:path';
import { readFileSync, existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const DRY_RUN = process.argv.includes('--dry-run');

const TAKEOUT_DIR = '/home/dan/Documentos/nilblog/Takeout/Blogger';
const FEED_PATH = join(TAKEOUT_DIR, 'Blogs/Reflexões Interioranas/feed.atom');
const ALBUMS_DIR = join(TAKEOUT_DIR, 'Albums');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'qf5spdw9',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-01-01',
});

function normalizeTitle(value: string): string {
  if (!value) return '';
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function generateSlug(title: string): string {
  if (!title) return 'post-sem-titulo-' + Date.now();
  return normalizeTitle(title).replace(/\s+/g, '-').slice(0, 96);
}

// Convert HTML to Portable Text (simplified for this script, just blocks of text)
// A more complete HTML to block converter can be used if needed, but for now we just use a basic text block
function simpleHtmlToPortableText(html: string) {
  if (!html) return [];
  // Strip tags and split by double breaks
  const text = html.replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>|<\/div>/gi, '\n\n').replace(/<[^>]+>/g, '');
  const paragraphs = text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
  
  return paragraphs.map(p => ({
    _type: 'block',
    style: 'normal',
    children: [{ _type: 'span', marks: [], text: p }]
  }));
}

async function getTakeoutImages() {
  const images = [];
  try {
    const folders = await readdir(ALBUMS_DIR, { withFileTypes: true });
    for (const folder of folders) {
      if (folder.isDirectory()) {
        const folderPath = join(ALBUMS_DIR, folder.name);
        const files = await readdir(folderPath);
        for (const file of files) {
          if (!file.endsWith('.json') && !file.includes('(')) {
            const jsonPath = join(folderPath, file + '.json');
            try {
              const jsonContent = JSON.parse(readFileSync(jsonPath, 'utf8'));
              let timestampMs = Number(jsonContent.creationTimestampMs);
              if (isNaN(timestampMs) && jsonContent.photoTakenTime?.timestamp) {
                 timestampMs = Number(jsonContent.photoTakenTime.timestamp) * 1000;
              }
              if (!isNaN(timestampMs)) {
                images.push({
                  path: join(folderPath, file),
                  filename: file,
                  date: new Date(timestampMs),
                });
              }
            } catch (e) {}
          }
        }
      }
    }
  } catch (err) {}
  return images;
}

async function uploadLocalImageToSanity(localPath: string, title: string): Promise<string | null> {
  try {
    const buffer = readFileSync(localPath);
    const ext = localPath.split('.').pop() || 'jpg';
    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'image';
    const asset = await client.assets.upload('image', buffer, {
      filename: `${safeTitle.slice(0, 80)}.${ext}`,
    });
    return asset._id;
  } catch (err) {
    return null;
  }
}

async function main() {
  console.log('📸 Lendo feed e imagens do Takeout...');
  
  const images = await getTakeoutImages();
  
  const xml = readFileSync(FEED_PATH, 'utf-8');
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
  const data = parser.parse(xml) as any;
  const entries = Array.isArray(data?.feed?.entry) ? data.feed.entry : [data?.feed?.entry].filter(Boolean);

  // Fetch existing posts
  const existingPosts = await client.fetch(`*[_type == "post"] { _id, title, publishedAt, slug, mainImage }`);
  const existingTitles = new Set(existingPosts.map((p: any) => normalizeTitle(p.title)));

  let newPostsCount = 0;
  let imagesLinked = 0;

  for (const entry of entries) {
    // Only process posts
    if (entry['blogger:type'] !== 'POST') continue;

    const title = String(entry.title?.['#text'] || entry.title || '').trim();
    if (!title) continue;

    const normTitle = normalizeTitle(title);
    const publishedAt = entry.published;
    
    let sanityPost = existingPosts.find((p: any) => normalizeTitle(p.title) === normTitle);

    if (!sanityPost) {
      if (!DRY_RUN) {
        console.log(`+ Criando post faltando: "${title}"`);
        const contentHtml = String(entry.content?.['#text'] || entry.content || '');
        const body = simpleHtmlToPortableText(contentHtml);
        
        sanityPost = await client.create({
          _type: 'post',
          title,
          slug: { _type: 'slug', current: generateSlug(title) },
          publishedAt: publishedAt,
          body: body.length > 0 ? body : [{ _type: 'block', style: 'normal', children: [{ _type: 'span', marks: [], text: 'Conteúdo vazio' }] }],
          category: 'geral'
        });
        newPostsCount++;
      } else {
        console.log(`[DRY-RUN] Criaria post: "${title}"`);
        sanityPost = { _id: 'dry-run', title, publishedAt };
      }
    }

    // Now link image if it doesn't have one
    if (sanityPost && !sanityPost.mainImage?.asset?._ref && publishedAt) {
      const postDate = new Date(publishedAt);
      let closestImage = null;
      let minDiff = Infinity;
      
      for (const img of images) {
        const diff = Math.abs(img.date.getTime() - postDate.getTime());
        if (diff < minDiff) {
          minDiff = diff;
          closestImage = img;
        }
      }

      if (closestImage && minDiff < 604800000) {
        console.log(`  -> Linkando imagem: ${closestImage.filename} ao post "${title}"`);
        if (!DRY_RUN && sanityPost._id !== 'dry-run') {
          const assetId = await uploadLocalImageToSanity(closestImage.path, title);
          if (assetId) {
            await client.patch(sanityPost._id).set({
              mainImage: {
                _type: 'image',
                asset: { _type: 'reference', _ref: assetId },
              },
            }).commit();
            imagesLinked++;
          }
        } else {
          imagesLinked++;
        }
      }
    }
  }

  console.log('\n--- RESUMO ---');
  console.log(`Novos posts importados: ${newPostsCount}`);
  console.log(`Imagens vinculadas: ${imagesLinked}`);
}

main().catch(console.error);
