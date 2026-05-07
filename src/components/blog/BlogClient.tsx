'use client';

import { useState, useMemo } from 'react';
import PostCard from '@/components/blog/PostCard';
import CategoryFilter from '@/components/blog/CategoryFilter';
import type { Post, PostCategory } from '@/types';

interface BlogClientProps {
  initialPosts?: Post[];
}

export default function BlogClient({ initialPosts = [] }: BlogClientProps) {
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
