import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-03-01',
  useCdn: false,
});

async function run() {
  const posts = await client.fetch(`*[_type == "post"]`);
  const found = posts.filter((p: any) => JSON.stringify(p).includes('docs-internal-guid'));
  console.log(`Found: ${found.length}`);
  if (found.length > 0) {
    const p = found[0];
    const s = JSON.stringify(p, null, 2);
    const lines = s.split('\n');
    const idx = lines.findIndex(l => l.includes('docs-internal-guid'));
    console.log(`Post: ${p.title}`);
    console.log(lines.slice(Math.max(0, idx - 5), idx + 5).join('\n'));
  }
}
run();
