import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://nilceia.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      /* Regra geral — todos os crawlers */
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/studio/'],
      },
      /* GPTBot (OpenAI / ChatGPT) — permitido explicitamente */
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/studio/'],
      },
      /* Claude-Web (Anthropic) — permitido */
      {
        userAgent: 'Claude-Web',
        allow: '/',
        disallow: ['/api/', '/admin/', '/studio/'],
      },
      /* PerplexityBot — permitido */
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/studio/'],
      },
      /* Google-Extended (Gemini / Bard training) — permitido */
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/api/', '/admin/', '/studio/'],
      },
      /* CCBot (Common Crawl — base de treino de vários LLMs) — permitido */
      {
        userAgent: 'CCBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/studio/'],
      },
      /* cohere-ai — permitido */
      {
        userAgent: 'cohere-ai',
        allow: '/',
        disallow: ['/api/', '/admin/', '/studio/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}

