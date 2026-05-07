/**
 * scripts/clean-broken-html.ts
 *
 * Limpa resquícios de HTML quebrado (ex: span id="...", /span>, div>)
 * que ficaram nos textos dos posts devido à falha do regex na migração.
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Faltam variáveis de ambiente do Sanity (.env.local)");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-03-01',
  useCdn: false,
  token,
});

function cleanText(text: string): string {
  let cleaned = text;
  // Remove tags quebradas comuns que perderam o '<'
  const brokenTagRegex = /\/?(span|div|u|font|br|center|tbody|tr|td|table|strike|s|sub|sup)(\s+[^>]+)?>/gi;
  cleaned = cleaned.replace(brokenTagRegex, '');
  
  // Limpa também se houver '<' no começo (caso a tag tenha sobrevivido inteira)
  const fullTagRegex = /<\/?(span|div|u|font|br|center|tbody|tr|td|table|strike|s|sub|sup)(\s+[^>]+)?>/gi;
  cleaned = cleaned.replace(fullTagRegex, '');

  return cleaned;
}

async function run() {
  console.log("=== INICIANDO LIMPEZA DE HTML QUEBRADO ===");
  
  const posts = await client.fetch(`*[_type == "post" && defined(body)]`);
  console.log(`${posts.length} posts encontrados para análise.`);

  let updatedCount = 0;
  const transaction = client.transaction();

  for (const post of posts) {
    let modified = false;
    const newBody = JSON.parse(JSON.stringify(post.body));

    for (const block of newBody) {
      if (block._type === 'block' && Array.isArray(block.children)) {
        for (const child of block.children) {
          if (child._type === 'span' && typeof child.text === 'string') {
            const originalText = child.text;
            const newText = cleanText(originalText);
            
            if (originalText !== newText) {
              child.text = newText;
              modified = true;
            }
          }
        }
      }
    }

    if (modified) {
      transaction.patch(post._id, p => p.set({ body: newBody }));
      updatedCount++;
    }

    if (updatedCount > 0 && updatedCount % 50 === 0) {
      await transaction.commit();
      console.log(`✅ ${updatedCount} posts limpos...`);
      transaction.reset();
    }
  }

  if (updatedCount % 50 !== 0) {
    await transaction.commit();
  }

  console.log(`✅ Concluído! ${updatedCount} posts foram limpos e atualizados no Sanity.`);
}

run().catch(console.error);
