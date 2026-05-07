/**
 * scripts/seed-sanity-data.ts
 *
 * Seed Sanity with initial data:
 * 1. Cria 6 produtos
 * 2. Cria 6 autores (Nilceia + 5 convidados)
 * 3. Faz upload de imagens genéricas (placeholders) e as vincula a posts sem imagem de capa
 * 4. Atribui os posts importados à Nilceia
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

async function uploadPlaceholderImage(seed: string) {
  console.log(`Baixando imagem placeholder (${seed})...`);
  const res = await fetch(`https://picsum.photos/seed/${seed}/800/600`);
  const buffer = await res.arrayBuffer();
  console.log(`Fazendo upload da imagem (${seed}) para o Sanity...`);
  const asset = await client.assets.upload('image', Buffer.from(buffer), {
    filename: `placeholder-${seed}.jpg`,
  });
  return asset._id;
}

const AUTHORS = [
  { name: "Nilceia Eulampio", bio: "Escritora, poetisa e comunicadora espiritual." },
  { name: "Maria Silva", bio: "Psicóloga especialista em cura emocional." },
  { name: "João Cordeiro", bio: "Teólogo e pesquisador de espiritualidade." },
  { name: "Ana Beatriz", bio: "Poetisa e ativista pelos direitos das mulheres." },
  { name: "Carlos Eduardo", bio: "Sociólogo com foco em justiça social." },
  { name: "Luciana Martins", bio: "Escritora de contos e crônicas." }
];

const PRODUCTS = [
  {
    title: "E-book: Caminhos da Cura",
    description: "Um guia prático para cura emocional e espiritual.",
    price: 39.90,
    type: "ebook",
    checkoutUrl: "https://pay.hotmart.com/exemplo1",
    featured: true
  },
  {
    title: "Planner da Alma 2026",
    description: "Organize seus dias com propósito e reflexão.",
    price: 59.90,
    type: "planner",
    checkoutUrl: "https://pay.hotmart.com/exemplo2",
    featured: true
  },
  {
    title: "Mentoria: Encontrando a Paz",
    description: "Sessão individual de aconselhamento espiritual.",
    price: 199.90,
    type: "course",
    checkoutUrl: "https://pay.hotmart.com/exemplo3",
    featured: false
  },
  {
    title: "E-book: Poesias de Outono",
    description: "Coletânea de poemas sobre a transição da vida.",
    price: 29.90,
    type: "ebook",
    checkoutUrl: "https://pay.hotmart.com/exemplo4",
    featured: false
  },
  {
    title: "Caderno de Gratidão",
    description: "Um espaço diário para cultivar bons sentimentos.",
    price: 49.90,
    type: "planner",
    checkoutUrl: "https://pay.hotmart.com/exemplo5",
    featured: false
  },
  {
    title: "Curso: Introdução à Espiritualidade",
    description: "Aprenda os fundamentos para uma vida conectada.",
    price: 149.90,
    type: "course",
    checkoutUrl: "https://pay.hotmart.com/exemplo6",
    featured: false
  }
];

async function run() {
  try {
    console.log("=== INICIANDO SEED DO BANCO ===");

    // 1. Criar Autores
    const authorIds: string[] = [];
    console.log(`\nCriando ${AUTHORS.length} autores...`);
    for (const author of AUTHORS) {
      const doc = {
        _type: 'author',
        name: author.name,
        bio: author.bio
      };
      const created = await client.create(doc);
      console.log(`✅ Autor criado: ${created.name}`);
      authorIds.push(created._id);
    }
    const nilceiaId = authorIds[0];

    // 2. Criar Produtos
    console.log(`\nCriando ${PRODUCTS.length} produtos...`);
    for (const prod of PRODUCTS) {
      const imgId = await uploadPlaceholderImage(`prod-${prod.title.replace(/\s/g, '')}`);
      const doc = {
        _type: 'product',
        title: prod.title,
        description: prod.description,
        price: prod.price,
        type: prod.type,
        checkoutUrl: prod.checkoutUrl,
        featured: prod.featured,
        imageUrl: {
          _type: 'image',
          asset: { _type: 'reference', _ref: imgId }
        }
      };
      await client.create(doc);
      console.log(`✅ Produto criado: ${doc.title}`);
    }

    // 3. Atualizar Posts (Author + Imagens)
    console.log("\nBuscando posts sem autor ou sem imagem de capa...");
    const posts = await client.fetch(`*[_type == "post" && (!defined(author) || !defined(mainImage))]`);
    console.log(`${posts.length} posts precisam de atualização.`);

    if (posts.length > 0) {
      // Faz upload de 5 imagens placeholders para distribuir entre os posts
      const postPlaceholders = [];
      for (let i = 1; i <= 5; i++) {
        const id = await uploadPlaceholderImage(`post-bg-${i}`);
        postPlaceholders.push(id);
      }

      console.log("\nAtualizando posts no Sanity (isso pode demorar um pouco)...");
      const transaction = client.transaction();
      
      let count = 0;
      for (const post of posts) {
        const patch: any = {};
        if (!post.author) {
          patch.author = { _type: 'reference', _ref: nilceiaId };
        }
        if (!post.mainImage) {
          const randomImage = postPlaceholders[Math.floor(Math.random() * postPlaceholders.length)];
          patch.mainImage = {
            _type: 'image',
            asset: { _type: 'reference', _ref: randomImage }
          };
        }
        
        transaction.patch(post._id, p => p.set(patch));
        count++;

        // Commit a cada 50 updates para não sobrecarregar
        if (count % 50 === 0) {
          await transaction.commit();
          console.log(`✅ Atualizados ${count} posts...`);
          // Reinicia a transação
          transaction.reset();
        }
      }
      
      // Commit final
      if (count % 50 !== 0) {
        await transaction.commit();
        console.log(`✅ Atualizados ${count} posts (Final).`);
      }
    }

    console.log("\n🎉 SEED CONCLUÍDO COM SUCESSO!");

  } catch (err) {
    console.error("Erro durante o seed:", err);
  }
}

run();
