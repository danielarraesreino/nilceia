import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import { resolve } from 'node:path';
dotenv.config({ path: resolve(process.cwd(), '.env.local') });
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'qf5spdw9',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
});
async function main() {
  const posts = await client.fetch(`*[_type == "post"] { title, publishedAt }`);
  const posts2122 = posts.filter((p: any) => p.publishedAt && (p.publishedAt.startsWith('2021') || p.publishedAt.startsWith('2022')));
  console.log("Posts 2021-2022:", posts2122.length);
  for(const p of posts2122) {
    console.log(p.publishedAt, p.title);
  }
}
main();
