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

async function main() {
  console.log("Limpando audioUrl de todos os posts...");
  const posts = await client.fetch(`*[_type == "post" && defined(audioUrl)] { _id, audioUrl }`);
  
  for (const post of posts) {
    console.log(`Limpando post ${post._id}`);
    await client.patch(post._id).unset(['audioUrl']).commit();
    
    // (Opcional) apagar o asset antigo
    if (post.audioUrl) {
      // Extrair o asset id da URL: https://cdn.sanity.io/files/qf5spdw9/production/assetid.mp3
      const match = post.audioUrl.match(/files\/qf5spdw9\/production\/([^.]+)\.mp3/);
      if (match && match[1]) {
        try {
          await client.delete(`file-${match[1]}-mp3`);
          console.log(`Asset ${match[1]} deletado.`);
        } catch (e) {
          console.log(`Erro ao deletar asset ${match[1]}:`, e.message);
        }
      }
    }
  }
  console.log("Limpeza concluída.");
}

main().catch(console.error);
