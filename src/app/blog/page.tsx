import type { Metadata } from 'next';
import BlogClient from '@/components/blog/BlogClient';
import { getAllPosts } from '@/lib/sanity';

export const metadata: Metadata = {
  title: 'Blog & Reflexões',
  description: 'Textos sobre espiritualidade, cura emocional, contos e justiça social por Nilceia Eulampio.',
  openGraph: {
    title: 'Blog & Reflexões — Nilceia Eulampio',
    description: 'Textos sobre espiritualidade, cura emocional, contos e justiça social.',
    type: 'website',
  },
};

export const revalidate = 3600; // revalida a cada 1 hora

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <>
      {/* Page header */}
      <div
        style={{
          paddingTop: '8rem',
          paddingBottom: '4rem',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          background: 'linear-gradient(180deg, var(--bg-muted) 0%, var(--bg-main) 100%)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <span style={{
            display: 'inline-block', padding: '0.3rem 1rem', borderRadius: '99px',
            backgroundColor: 'rgba(184,134,11,0.1)', color: 'var(--accent-gold)',
            fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            fontFamily: 'var(--font-body)', marginBottom: '1rem',
          }}>
            Blog & Reflexões
          </span>
          <h1 className="font-heading" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Palavras para o seu caminho
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            Textos sobre espiritualidade, cura emocional, contos e justiça social. Leia no seu ritmo.
          </p>
        </div>
      </div>

      {/* Interactive content (Client Component) com dados reais do Sanity */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <BlogClient initialPosts={posts} />
      </div>
    </>
  );
}
