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
  const posts = await client.fetch(`*[_type == "post" && title match "Inspiração*"] { title, publishedAt }`);
  console.log(posts);
}
main();
