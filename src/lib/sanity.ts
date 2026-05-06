// src/lib/sanity.ts
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
});

const builder = imageUrlBuilder(client);

export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}

// ─── QUERIES ────────────────────────────────────────────────────────────────

export async function getAllPosts() {
  return client.fetch(`
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
  `);
}

export async function getPostBySlug(slug: string) {
  return client.fetch(
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
}

export async function getPostsByCategory(category: string) {
  return client.fetch(
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
}

export async function getFeaturedPosts(limit = 3) {
  return client.fetch(`
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
}

export async function getAllProducts() {
  return client.fetch(`
    *[_type == "product"] | order(_createdAt desc) {
      _id,
      title,
      description,
      price,
      type,
      "imageUrl": image.asset->url,
      checkoutUrl,
      featured,
      testimonials
    }
  `);
}

export async function getAllPostSlugs(): Promise<string[]> {
  const slugs = await client.fetch(`
    *[_type == "post"] { "slug": slug.current }
  `);
  return slugs.map((s: { slug: string }) => s.slug);
}
