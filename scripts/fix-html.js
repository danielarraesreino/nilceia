const { createClient } = require('@sanity/client');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const client = createClient({
  projectId: 'qf5spdw9',
  dataset: 'production',
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

function decodeHtml(html) {
  if (typeof html !== 'string') return html;
  return html
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function traverseAndFixBlocks(blocks) {
  let hasChanges = false;
  const newBlocks = JSON.parse(JSON.stringify(blocks)); // deep copy

  if (!Array.isArray(newBlocks)) return { hasChanges, newBlocks };

  for (const block of newBlocks) {
    if (block.children && Array.isArray(block.children)) {
      for (const child of block.children) {
        if (child.text && typeof child.text === 'string') {
          const decoded = decodeHtml(child.text);
          if (decoded !== child.text) {
            child.text = decoded;
            hasChanges = true;
          }
        }
      }
    }
  }

  return { hasChanges, newBlocks };
}

async function main() {
  console.log("Buscando todos os posts para corrigir HTML vazado...");
  const posts = await client.fetch(`*[_type == "post"] { _id, title, body }`);
  
  let fixedCount = 0;

  for (const post of posts) {
    if (!post.body) continue;
    
    const { hasChanges, newBlocks } = traverseAndFixBlocks(post.body);
    
    if (hasChanges) {
      console.log(`Corrigindo HTML no post: "${post.title}" (${post._id})`);
      try {
        await client.patch(post._id).set({ body: newBlocks }).commit();
        fixedCount++;
      } catch (e) {
        console.error(`Erro ao salvar post ${post._id}:`, e.message);
      }
    }
  }

  console.log(`Concluído! ${fixedCount} posts foram corrigidos e higienizados no Sanity.`);
}

main().catch(console.error);
