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
  const posts = await client.fetch(`*[_type == "post" && title match "O DESAFIO DO ENFRENTAMENTO*"]`);
  if (posts.length > 0) {
    const post = posts[0];
    console.log(JSON.stringify(post.body.slice(0, 10), null, 2));
  } else {
    console.log("Not found.");
  }
}
run();
