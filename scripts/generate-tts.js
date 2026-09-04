// scripts/generate-tts.js
const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// 1. Configurações
const SANITY_PROJECT_ID = 'qf5spdw9';
const SANITY_DATASET = 'production';
const SANITY_TOKEN = process.env.SANITY_WRITE_TOKEN; // Precisa da permissão de escrita
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;

if (!SANITY_TOKEN || !NVIDIA_API_KEY) {
  console.error("ERRO: Configure SANITY_WRITE_TOKEN e NVIDIA_API_KEY no seu ambiente.");
  process.exit(1);
}

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

function decodeHtml(html) {
  return html
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags se tiver vazado algum
    .replace(/\s+/g, ' ') // normaliza espaços múltiplos
    .trim();
}

async function extractTextFromBlocks(blocks) {
  if (!blocks || !Array.isArray(blocks)) return '';
  const rawText = blocks
    .map(block => {
      if (block._type !== 'block' || !block.children) return '';
      return block.children.map(child => child.text).join('');
    })
    .join('\n\n');
  
  return decodeHtml(rawText);
}

const { execSync } = require('child_process');

async function generateAudio(text, postId) {
  console.log(`Gerando áudio para o post ${postId}... (Isso pode demorar alguns segundos)`);
  
  const textFile = path.join(__dirname, `${postId}.txt`);
  const wavFile = path.join(__dirname, `${postId}.wav`);
  
  fs.writeFileSync(textFile, text);
  
  try {
    // Chama o script python passando os caminhos
    const out = execSync(`source ${path.join(__dirname, '../venv/bin/activate')} && python3 ${path.join(__dirname, 'tts.py')} "${wavFile}" "${textFile}"`, {
      shell: '/bin/bash',
      env: { ...process.env, NVIDIA_API_KEY: process.env.NVIDIA_API_KEY }
    });
    console.log(out.toString());
    
    if (fs.existsSync(wavFile)) {
      const buffer = fs.readFileSync(wavFile);
      // Cleanup
      fs.unlinkSync(textFile);
      fs.unlinkSync(wavFile);
      return buffer;
    }
  } catch (e) {
    console.error(`Erro ao rodar python script para o post ${postId}:`, e.message);
    if (e.stdout) console.error("Stdout:", e.stdout.toString());
    if (e.stderr) console.error("Stderr:", e.stderr.toString());
  }
  
  if (fs.existsSync(textFile)) fs.unlinkSync(textFile);
  if (fs.existsSync(wavFile)) fs.unlinkSync(wavFile);
  return null;
}

async function main() {
  console.log("Buscando posts sem áudio no Sanity...");
  const posts = await client.fetch(`*[_type == "post" && !defined(audioUrl)] { _id, title, body }`);
  
  if (posts.length === 0) {
    console.log("Todos os posts já possuem áudio gerado!");
    return;
  }

  console.log(`Encontrados ${posts.length} post(s) sem áudio.`);

  for (const post of posts) {
    console.log(`\nProcessando: "${post.title}"`);
    const plainText = await extractTextFromBlocks(post.body);
    
    if (!plainText.trim()) {
      console.log("Post sem texto, pulando...");
      continue;
    }

    // Limita o texto se for gigantesco, para não dar timeout (opcional)
    const textToSynthesize = plainText.length > 3000 ? plainText.substring(0, 3000) + "..." : plainText;

    const audioBuffer = await generateAudio(textToSynthesize, post._id);
    if (!audioBuffer) continue;

    console.log("Áudio gerado com sucesso! Fazendo upload pro Sanity Assets...");
    
    try {
      const asset = await client.assets.upload('file', audioBuffer, {
        filename: `${post._id}-tts.mp3`,
        contentType: 'audio/mpeg'
      });
      
      console.log(`Upload completo. URL: ${asset.url}`);
      console.log("Atualizando o documento do post...");
      
      await client.patch(post._id).set({ audioUrl: asset.url }).commit();
      console.log(`✅ Post "${post.title}" atualizado com sucesso!`);
    } catch (err) {
      console.error(`Erro ao salvar no Sanity: ${err.message}`);
    }
  }
}

main().catch(console.error);
