const { createClient } = require('@sanity/client');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error('ERRO: SANITY_WRITE_TOKEN não encontrado em .env.local');
  process.exit(1);
}

const client = createClient({
  projectId: 'qf5spdw9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: token,
  useCdn: false,
});

const ALESSANDRO_AUTHOR_ID = 'WlQi0L45SAS7jwvJmFYmmD';

function makeBlock(text) {
  return {
    _type: 'block',
    _key: crypto.randomBytes(6).toString('hex'),
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: crypto.randomBytes(6).toString('hex'),
        text: text,
        marks: [],
      },
    ],
  };
}

async function run() {
  const jsonPath = path.resolve(__dirname, '../DOCUMENTAÇÃO VIVA/EXTRACOES_WHATSAPP/posts_alessandro_extraidos.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('Arquivo JSON não encontrado:', jsonPath);
    process.exit(1);
  }

  const posts = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`Carregados ${posts.length} textos autorais para publicação...`);

  // Gerar datas escalonadas entre 10 de junho de 2026 e 15 de setembro de 2026
  const startDate = new Date('2026-06-10T10:00:00Z').getTime();
  const endDate = new Date('2026-09-15T18:00:00Z').getTime();
  const step = (endDate - startDate) / (posts.length || 1);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < posts.length; i++) {
    const p = posts[i];
    const pubDate = new Date(startDate + i * step).toISOString();
    const docId = `post-alessandro-wa-${p.slug.slice(0, 40)}`;

    const bodyBlocks = p.paragraphs.map((para) => makeBlock(para));

    // Garantir que excerpt tem no máximo 195 caracteres
    let excerpt = p.excerpt || '';
    if (excerpt.length > 195) {
      excerpt = excerpt.substring(0, 192).trim() + '...';
    }

    const doc = {
      _id: docId,
      _type: 'post',
      title: p.title,
      slug: { _type: 'slug', current: p.slug },
      author: {
        _type: 'reference',
        _ref: ALESSANDRO_AUTHOR_ID,
      },
      category: p.category,
      excerpt: excerpt,
      readingTime: p.readingTime || 3,
      publishedAt: pubDate,
      body: bodyBlocks,
    };

    try {
      await client.createOrReplace(doc);
      successCount++;
      console.log(`[${i + 1}/${posts.length}] ✅ "${p.title.slice(0, 50)}" publicado (${docId})`);
    } catch (err) {
      errorCount++;
      console.error(`[${i + 1}/${posts.length}] ❌ Erro ao publicar "${p.title}":`, err.message);
    }
  }

  console.log(`\n--- Publicação Concluída: ${successCount} sucessos, ${errorCount} erros ---`);
}

run();
