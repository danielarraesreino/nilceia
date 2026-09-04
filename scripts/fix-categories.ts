import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import { resolve } from 'node:path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'qf5spdw9',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-01-01',
});

async function main() {
  const posts = await client.fetch(`*[_type == "post" && category == "geral"] { _id }`);
  console.log(`Encontrados ${posts.length} posts com categoria 'geral'. Corrigindo para 'Reflexões'...`);
  
  for (const post of posts) {
    await client.patch(post._id).set({ category: 'Reflexões' }).commit();
  }
  console.log('✅ Correção concluída!');
}

main().catch(console.error);
