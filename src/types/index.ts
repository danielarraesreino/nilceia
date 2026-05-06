// src/types/index.ts

export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  body: PortableTextBlock[];
  category: PostCategory;
  publishedAt: string;
  imageUrl?: string;
  audioUrl?: string;
  author?: Author;
  readingTime?: number; // in minutes
}

export interface Author {
  _id: string;
  name: string;
  bio?: string;
  imageUrl?: string;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  type: 'ebook' | 'planner' | 'course' | 'other';
  imageUrl?: string;
  checkoutUrl: string;
  featured?: boolean;
  testimonials?: Testimonial[];
}

export interface Testimonial {
  name: string;
  text: string;
  rating: number;
}

export interface Intention {
  _id?: string;
  name: string;
  text: string;
  createdAt?: string;
}

export type PostCategory =
  | 'Espiritualidade'
  | 'Cura Emocional'
  | 'Contos'
  | 'Justiça Social'
  | 'Poesia'
  | 'Reflexões';

export type PortableTextBlock = {
  _type: string;
  _key: string;
  children?: Array<{ _key: string; _type: string; text: string; marks?: string[] }>;
  style?: string;
  markDefs?: Array<{ _key: string; _type: string; href?: string }>;
};
