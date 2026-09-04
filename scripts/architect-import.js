const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const { JSDOM } = require('jsdom');
const { htmlToBlocks } = require('@portabletext/block-tools');
const { createClient } = require('@sanity/client');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Cliente Sanity
const client = createClient({
  projectId: 'qf5spdw9',
  dataset: 'production',
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

// Remove todos os posts atuais (LIMPEZA TOTAL)
async function wipeExistingPosts() {
  console.log('Deletando todos os posts atuais do Sanity...');
  await client.delete({ query: '*[_type == "post"]' });
  console.log('Posts antigos apagados.');
}

// Faz o download de uma imagem e joga pro Sanity
async function uploadImageToSanity(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    const asset = await client.assets.upload('image', Buffer.from(buffer), {
      filename: path.basename(new URL(url).pathname) || 'image.jpg'
    });
    return asset._id; // 'image-xxxxxxxxxxxx-1234x1234-jpg'
  } catch (e) {
    console.error(`Falha ao subir imagem ${url}:`, e.message);
    return null;
  }
}

async function main() {
  const xmlFile = path.join(__dirname, '../blogger-export.xml');
  if (!fs.existsSync(xmlFile)) {
    console.error("Arquivo blogger-export.xml não encontrado!");
    return;
  }

  await wipeExistingPosts();

  console.log('Lendo XML do Blogger...');
  const xmlData = fs.readFileSync(xmlFile, 'utf8');
  
  const parser = new xml2js.Parser({ explicitArray: false });
  const result = await parser.parseStringPromise(xmlData);
  
  let entries = result.feed.entry;
  if (!Array.isArray(entries)) entries = [entries];
  
  const postsToImport = [];

  for (const entry of entries) {
    // Só queremos posts reais
    if (entry['blogger:type'] !== 'POST') continue;
    if (entry['blogger:status'] !== 'LIVE') continue;

    // Se é um post, vamos extrair os dados
    const title = typeof entry.title === 'string' ? entry.title : (entry.title?._ || 'Sem título');
    const publishedAt = entry.published;
    
    // As labels (tags) do Blogger
    let category = 'Reflexões'; // default
    const cats = Array.isArray(entry.category) ? entry.category : (entry.category ? [entry.category] : []);
    const labelCats = cats.filter(c => c && c.$ && c.$.scheme === 'http://www.blogger.com/atom/ns#');
    if (labelCats.length > 0) {
      category = labelCats[0].$.term;
    }

    // Conteúdo HTML
    let htmlContent = entry.content?._ || entry.content || '';

    // Filtra HTML: O Blogger tem &nbsp;
    htmlContent = htmlContent.replace(/&nbsp;/g, ' ');

    // Dom parse para extrair a 1ª imagem e apagar as <img> do HTML (para não poluir o corpo)
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;
    
    let mainImageUrl = null;
    const images = document.querySelectorAll('img');
    if (images.length > 0) {
      mainImageUrl = images[0].src;
      // Remove todas as imagens do HTML pq usaremos capa nativa
      images.forEach(img => {
        // Se ela estava dentro de um link, remove o link também
        if (img.parentElement && img.parentElement.tagName === 'A') {
          img.parentElement.remove();
        } else {
          img.remove();
        }
      });
    }

    // Pega o html limpo
    const cleanHtml = document.body.innerHTML;

    // Converte para blocos PortableText puros do Sanity de forma robusta e limpa
    const portableTextBlocks = [];
    
    // Fallback: se não tiver elementos, cria um P
    if (document.body.children.length === 0 && document.body.textContent.trim()) {
      portableTextBlocks.push({
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', marks: [], text: document.body.textContent.trim() }]
      });
    } else {
      for (const el of document.body.children) {
        const text = el.textContent.trim();
        if (!text) continue;
        
        let style = 'normal';
        if (el.tagName === 'H1' || el.tagName === 'H2') style = 'h2';
        else if (el.tagName === 'H3') style = 'h3';
        else if (el.tagName === 'H4') style = 'h4';
        else if (el.tagName === 'BLOCKQUOTE') style = 'blockquote';
        
        portableTextBlocks.push({
          _type: 'block',
          style,
          children: [{ _type: 'span', marks: [], text }]
        });
      }
    }

    // Cria um resumo do post limpo de html
    const textContent = document.body.textContent || '';
    const excerpt = textContent.replace(/\s+/g, ' ').substring(0, 190) + '...';

    postsToImport.push({
      _type: 'post',
      title,
      slug: {
        _type: 'slug',
        current: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 96).replace(/^-+|-+$/g, '') || `post-${Date.now()}`
      },
      category,
      excerpt,
      publishedAt,
      body: portableTextBlocks,
      _bloggerImageUrl: mainImageUrl // temporário para fazer upload
    });
  }

  console.log(`Encontrados ${postsToImport.length} posts no Blogger. Iniciando migração...`);

  let imported = 0;
  for (const doc of postsToImport) {
    console.log(`\nImportando: ${doc.title}`);
    
    if (doc._bloggerImageUrl) {
      console.log(`- Resgatando imagem de capa do Google...`);
      const assetId = await uploadImageToSanity(doc._bloggerImageUrl);
      if (assetId) {
        doc.mainImage = {
          _type: 'image',
          asset: { _type: 'reference', _ref: assetId }
        };
      }
    }
    
    // Remove o temp attr
    delete doc._bloggerImageUrl;

    try {
      await client.create(doc);
      imported++;
      console.log(`✅ Salvo no Sanity!`);
    } catch (e) {
      console.error(`❌ Erro ao salvar post:`, e.message);
    }
  }

  console.log(`\nImportação 2.0 concluída! ${imported} posts criados com sucesso!`);
}

main().catch(console.error);
