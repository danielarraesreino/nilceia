const { createClient } = require('@sanity/client');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const client = createClient({
  projectId: 'qf5spdw9',
  dataset: 'production',
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

function addKeysToBlocks(blocks) {
  let hasChanges = false;
  if (!Array.isArray(blocks)) return { hasChanges, newBlocks: blocks };

  const newBlocks = JSON.parse(JSON.stringify(blocks));

  for (const block of newBlocks) {
    if (!block._key) {
      block._key = crypto.randomUUID().replace(/-/g, '').substring(0, 12);
      hasChanges = true;
    }
    
    if (block.children && Array.isArray(block.children)) {
      for (const child of block.children) {
        if (!child._key) {
          child._key = crypto.randomUUID().replace(/-/g, '').substring(0, 12);
          hasChanges = true;
        }
      }
    }
  }

  return { hasChanges, newBlocks };
}

async function main() {
  console.log("Buscando todos os posts para adicionar as _keys...");
  const posts = await client.fetch(`*[_type == "post"] { _id, title, body }`);
  
  let fixedCount = 0;

  for (const post of posts) {
    if (!post.body) continue;
    
    const { hasChanges, newBlocks } = addKeysToBlocks(post.body);
    
    if (hasChanges) {
      console.log(`Adicionando chaves no post: "${post.title}"`);
      try {
        await client.patch(post._id).set({ body: newBlocks }).commit();
        fixedCount++;
      } catch (e) {
        console.error(`Erro ao salvar post ${post._id}:`, e.message);
      }
    }
  }

  console.log(`Concluído! ${fixedCount} posts foram consertados no Sanity.`);
}

main().catch(console.error);
