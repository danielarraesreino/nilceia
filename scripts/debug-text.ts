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
  const posts = await client.fetch(`*[_type == "post"] | order(publishedAt desc)[0...1]`);
  if (posts.length > 0) {
    const post = posts[0];
    console.log(`Title: ${post.title}`);
    post.body.slice(0, 5).forEach((b: any, i: number) => {
      console.log(`Block ${i} [${b.style}]:`, b.children?.map((c: any) => c.text).join(''));
    });
  }
}
run();
