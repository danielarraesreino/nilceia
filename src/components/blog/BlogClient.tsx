'use client';

import { useState, useMemo } from 'react';
import PostCard from '@/components/blog/PostCard';
import CategoryFilter from '@/components/blog/CategoryFilter';
import type { Post, PostCategory } from '@/types';

const SAMPLE_POSTS: Post[] = [
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
    excerpt: 'Quando as palavras secam na garganta e a mente não encontra mais frases para dirigir ao sagrado, o corpo ainda sabe orar.',
    body: [],
    category: 'Espiritualidade',
    publishedAt: '2026-04-01T00:00:00Z',
    readingTime: 6,
    audioUrl: 'https://example.com/audio.mp3',
  },
  {
    _id: '4',
    title: 'Carta para as mulheres que aprendem a dizer não',
    slug: { current: 'carta-mulheres-que-dizem-nao' },
    excerpt: 'Querida, você não precisa pedir desculpas por ocupar espaço. Seus limites são sagrados — eles são os primeiros atos de amor por si mesma.',
    body: [],
    category: 'Cura Emocional',
    publishedAt: '2026-03-20T00:00:00Z',
    readingTime: 4,
  },
  {
    _id: '5',
    title: 'O salário que a faxineira nunca vai receber',
    slug: { current: 'salario-que-a-faxineira-nunca-vai-receber' },
    excerpt: 'Uma reflexão sobre o trabalho invisível, a dignidade que o dinheiro não compra e a injustiça que normalizamos com um sorriso.',
    body: [],
    category: 'Justiça Social',
    publishedAt: '2026-03-08T00:00:00Z',
    readingTime: 7,
  },
  {
    _id: '6',
    title: 'Verso para o mar que carregou nossa gente',
    slug: { current: 'verso-para-o-mar' },
    excerpt: 'Um poema sobre diáspora, saudade e a memória que viaja dentro do sangue de quem nunca conheceu a terra dos ancestrais.',
    body: [],
    category: 'Poesia',
    publishedAt: '2026-02-28T00:00:00Z',
    readingTime: 3,
  },
];

interface BlogClientProps {
  initialPosts?: Post[];
}

export default function BlogClient({ initialPosts = SAMPLE_POSTS }: BlogClientProps) {
  const [selected, setSelected] = useState<PostCategory | 'Todos'>('Todos');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let posts = initialPosts;
    if (selected !== 'Todos') {
      posts = posts.filter((p) => p.category === selected);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      posts = posts.filter(
        (p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
      );
    }
    return posts;
  }, [selected, search, initialPosts]);

  return (
    <>
      {/* Search */}
      <div style={{ position: 'relative', maxWidth: '420px', margin: '0 auto' }}>
        <span
          style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '1rem' }}
          aria-hidden="true"
        >
          🔍
        </span>
        <input
          id="blog-search"
          type="search"
          placeholder="Buscar reflexões…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Buscar reflexões"
          style={{
            width: '100%',
            padding: '0.75rem 1rem 0.75rem 2.75rem',
            borderRadius: 'var(--radius-sm)',
            border: '1.5px solid rgba(184,134,11,0.2)',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-primary)',
            fontSize: '0.9375rem',
            fontFamily: 'var(--font-body)',
            outline: 'none',
          }}
        />
      </div>

      {/* Filters */}
      <div style={{ marginBottom: '2.5rem', marginTop: '2.5rem' }}>
        <CategoryFilter selected={selected} onChange={setSelected} />
      </div>

      {/* Results count */}
      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', marginBottom: '1.75rem' }}>
        {filtered.length === 0
          ? 'Nenhuma reflexão encontrada.'
          : `${filtered.length} reflexã${filtered.length !== 1 ? 'ões' : 'o'} encontrada${filtered.length !== 1 ? 's' : ''}`}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.75rem' }}>
          {filtered.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🔍</span>
          <p className="font-heading" style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>Nenhuma reflexão encontrada</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
            Tente outro termo ou categoria.
          </p>
        </div>
      )}
    </>
  );
}
