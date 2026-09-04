// src/lib/sanity.ts
import { createClient } from 'next-sanity';
import { createImageUrlBuilder } from '@sanity/image-url';

function cleanEnv(val: string | undefined): string | undefined {
  if (!val) return val;
  return val.split('\n')[0].trim();
}

export const client = createClient({
  projectId: cleanEnv(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) ?? 'your-project-id',
  dataset: cleanEnv(process.env.NEXT_PUBLIC_SANITY_DATASET) ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
});

const builder = createImageUrlBuilder(client);

export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}

// ─── QUERIES ────────────────────────────────────────────────────────────────

export async function getAllPosts() {
  try {
    return await client.fetch(`
      *[_type == "post"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        category,
        publishedAt,
        "imageUrl": mainImage.asset->url,
        audioUrl,
        author->{ _id, name, "imageUrl": image.asset->url }
      }
    `, {}, { next: { tags: ['post'] } });
  } catch (err) {
    console.error("Sanity fetch error (getAllPosts):", err);
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  try {
    return await client.fetch(
      `*[_type == "post" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        excerpt,
        body,
        category,
        publishedAt,
        "imageUrl": mainImage.asset->url,
        audioUrl,
        author->{ _id, name, bio, "imageUrl": image.asset->url }
      }`,
      { slug }
    );
  } catch (err) {
    console.error("Sanity fetch error (getPostBySlug):", err);
    return null;
  }
}

export async function getPostsByCategory(category: string) {
  try {
    return await client.fetch(
      `*[_type == "post" && category == $category] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        category,
        publishedAt,
        "imageUrl": mainImage.asset->url
      }`,
      { category }
    );
  } catch (err) {
    console.error("Sanity fetch error (getPostsByCategory):", err);
    return [];
  }
}

export async function getFeaturedPosts(limit = 3) {
  try {
    return await client.fetch(`
      *[_type == "post"] | order(publishedAt desc) [0...$limit] {
        _id,
        title,
        slug,
        excerpt,
        category,
        publishedAt,
        "imageUrl": mainImage.asset->url,
        audioUrl
      }
    `, { limit });
  } catch (err) {
    console.error("Sanity fetch error (getFeaturedPosts):", err);
    return [];
  }
}

export async function getAllProducts() {
  try {
    return await client.fetch(`
      *[_type == "product"] | order(_createdAt desc) {
        _id,
        title,
        description,
        price,
        type,
        "imageUrl": image.asset->url,
        checkoutUrl,
        featured
      }
    `);
  } catch (err) {
    console.error("Sanity fetch error (getAllProducts):", err);
    return [];
  }
}

export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const slugs = await client.fetch(`
      *[_type == "post"] { "slug": slug.current }
    `);
    return slugs.map((s: { slug: string }) => s.slug);
  } catch (err) {
    console.error("Sanity fetch error (getAllPostSlugs):", err);
    return [];
  }
}

export async function getCommentsForPost(postId: string) {
  try {
    return await client.fetch(`
      *[_type == "comment" && post._ref == $postId && approved == true] | order(createdAt desc) {
        _id,
        name,
        text,
        createdAt,
        userImage,
        isAnonymous
      }
    `, { postId });
  } catch (err) {
    console.error("Sanity fetch error (getCommentsForPost):", err);
    return [];
  }
}
