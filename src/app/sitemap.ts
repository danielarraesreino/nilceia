import type { MetadataRoute } from 'next';

// TODO: Replace with getAllPostSlugs() from Sanity when configured
const STATIC_SLUGS = [
  'silencio-que-antecede-a-cura',
  'menina-que-carregava-o-ceu',
  'orar-com-o-corpo',
  'carta-mulheres-que-dizem-nao',
  'salario-que-a-faxineira-nunca-vai-receber',
  'verso-para-o-mar',
];

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://nilceia.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/sobre`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/loja`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/intencoes`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/contato`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  const postRoutes: MetadataRoute.Sitemap = STATIC_SLUGS.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...postRoutes];
}
