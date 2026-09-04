import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import { resolve, join } from 'node:path';
import { readFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const ALBUMS_DIR = '/home/dan/Documentos/nilblog/Takeout/Blogger/Albums';
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'qf5spdw9',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-01-01',
});

async function getTakeoutImages() {
  const images = [];
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
          } catch (e) {
          }
        }
      }
    }
  }
  return images;
}

async function main() {
  const images = await getTakeoutImages();
  
  const posts = await client.fetch(`*[_type == "post" && !defined(mainImage.asset)] { _id, title, publishedAt }`);
  console.log("Posts sem imagem:", posts.length);

  for (const post of posts) {
    if (!post.publishedAt) continue;
    const postDate = new Date(post.publishedAt);
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
      console.log(`[MATCH] Post: "${post.title}" (${postDate.toISOString()}) <-> Img: ${closestImage.filename} (${closestImage.date.toISOString()}) Diff: ${Math.round(minDiff / 1000 / 60 / 60)}h`);
    }
  }
}
main();
