'use client';

import Link from 'next/link';
import PostCard from '@/components/blog/PostCard';
import type { Post } from '@/types';

// Static sample data for MVP (replace with Sanity query when configured)
const samplePosts: Post[] = [
  {
    _id: '1',
    title: 'O silêncio que antecede a cura: uma meditação sobre o luto',
    slug: { current: 'silencio-que-antecede-a-cura' },
    excerpt: 'Existe um silêncio que machuca. Aquele que vem depois de uma perda e preenche cada canto da casa com a ausência de alguém. Mas existe outro silêncio — o que prepara o terreno para o novo.',
    body: [],
    category: 'Cura Emocional',
    publishedAt: '2026-04-28T00:00:00Z',
    readingTime: 5,
  },
  {
    _id: '2',
    title: 'A menina que carregava o céu na mochila',
    slug: { current: 'menina-que-carregava-o-ceu' },
    excerpt: 'Era uma vez uma menina que não cabia nos sonhos dos outros. Seus pés eram grandes demais para os sapatos que lhe davam, e seus olhos enxergavam longe demais para as janelas que abriam para ela.',
    body: [],
    category: 'Contos',
    publishedAt: '2026-04-14T00:00:00Z',
    readingTime: 8,
  },
  {
    _id: '3',
    title: 'Orar com o corpo: práticas espirituais para tempos difíceis',
    slug: { current: 'orar-com-o-corpo' },
    excerpt: 'Quando as palavras secam na garganta e a mente não encontra mais frases para dirigir ao sagrado, o corpo ainda sabe orar. Aprenda a rezar com os pés na terra.',
    body: [],
    category: 'Espiritualidade',
    publishedAt: '2026-04-01T00:00:00Z',
    readingTime: 6,
    audioUrl: 'https://example.com/audio.mp3',
  },
];

interface FeaturedPostsProps {
  posts?: Post[];
}

export default function FeaturedPosts({ posts = samplePosts }: FeaturedPostsProps) {
  return (
    <section
      aria-labelledby="featured-posts-heading"
      style={{
        padding: '6rem 1.5rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <style>{`
        .featured-cta { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.875rem 2.5rem; border: 1.5px solid var(--accent-gold); border-radius: var(--radius-sm); color: var(--accent-gold); font-weight: 700; font-size: 0.9375rem; font-family: var(--font-body); transition: all 0.2s; }
        .featured-cta:hover { background-color: var(--accent-gold); color: #fff; }
      `}</style>
      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <span style={{
          display: 'inline-block',
          padding: '0.3rem 1rem',
          borderRadius: '99px',
          backgroundColor: 'rgba(184,134,11,0.1)',
          color: 'var(--accent-gold)',
          fontSize: '0.78rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-body)',
          marginBottom: '1rem',
        }}>
          Reflexões recentes
        </span>
        <h2
          id="featured-posts-heading"
          className="font-heading"
          style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}
        >
          Textos para o seu caminho
        </h2>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '52ch', margin: '0 auto' }}>
          Palavras que acolhem, questionam e transformam. Escolha um tema e mergulhe.
        </p>
      </div>

      {/* Post grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.75rem',
        marginBottom: '3rem',
      }}>
        {posts.map((post, i) => (
          <div
            key={post._id}
            style={{
              opacity: 0,
              animation: `fadeInUp 0.6s ease both`,
              animationDelay: `${i * 0.12}s`,
              animationFillMode: 'both',
            }}
          >
            <PostCard post={post} featured={i === 0} />
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center' }}>
        <Link
          href="/blog"
          id="featured-posts-see-all"
          className="featured-cta"
        >
          Ver todas as reflexões
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
