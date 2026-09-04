/**
 * 🧪 O Tester — Sprint 2
 * Testes para src/components/blog/PostCard.tsx
 *
 * Testa renderização, acessibilidade e interatividade do card de post.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostCard from '@/components/blog/PostCard';
import type { Post } from '@/types';

// ── Mock de next/link (não roda App Router nos testes) ───────────────────────

jest.mock('next/link', () => {
  const MockLink = ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// ── Mock do formatDateShort ──────────────────────────────────────────────────

jest.mock('@/lib/utils', () => ({
  formatDateShort: jest.fn(() => '28 abr 2026'),
}));

// ── Fixture de post ──────────────────────────────────────────────────────────

const basePost: Pick<Post, '_id' | 'title' | 'slug' | 'excerpt' | 'category' | 'publishedAt' | 'imageUrl' | 'audioUrl' | 'readingTime'> = {
  _id: 'test-1',
  title: 'O silêncio que antecede a cura',
  slug: { current: 'silencio-que-antecede-a-cura' },
  excerpt: 'Existe um silêncio que machuca. Aquele que vem depois de uma perda.',
  category: 'Cura Emocional',
  publishedAt: '2026-04-28T00:00:00Z',
  readingTime: 5,
};

// ── Testes ───────────────────────────────────────────────────────────────────

describe('PostCard', () => {

  // ── Renderização básica ──────────────────────────────────────────────────

  it('renderiza o título do post', () => {
    render(<PostCard post={basePost} />);
    expect(screen.getByText('O silêncio que antecede a cura')).toBeInTheDocument();
  });

  it('renderiza o excerpt do post', () => {
    render(<PostCard post={basePost} />);
    expect(screen.getByText(/Existe um silêncio que machuca/)).toBeInTheDocument();
  });

  it('renderiza a categoria com badge', () => {
    render(<PostCard post={basePost} />);
    expect(screen.getByText('Cura Emocional')).toBeInTheDocument();
  });

  it('renderiza a data formatada', () => {
    render(<PostCard post={basePost} />);
    expect(screen.getByText('28 abr 2026')).toBeInTheDocument();
  });

  it('renderiza o tempo de leitura quando fornecido', () => {
    render(<PostCard post={basePost} />);
    expect(screen.getByText(/5 min/)).toBeInTheDocument();
  });

  it('não renderiza o tempo de leitura quando ausente', () => {
    const post = { ...basePost, readingTime: undefined };
    render(<PostCard post={post} />);
    expect(screen.queryByText(/min/)).not.toBeInTheDocument();
  });

  // ── Acessibilidade ───────────────────────────────────────────────────────

  it('usa elemento <article> para semântica correta', () => {
    const { container } = render(<PostCard post={basePost} />);
    expect(container.querySelector('article')).toBeInTheDocument();
  });

  it('CTA "Ler reflexão" tem aria-label descritivo', () => {
    render(<PostCard post={basePost} />);
    const cta = screen.getByRole('link', { name: /ler reflexão: o silêncio que antecede a cura/i });
    expect(cta).toBeInTheDocument();
  });

  it('links apontam para o slug correto', () => {
    render(<PostCard post={basePost} />);
    const links = screen.getAllByRole('link');
    const hrefs = links.map((l) => l.getAttribute('href'));
    expect(hrefs).toContain('/blog/silencio-que-antecede-a-cura');
  });

  // ── Imagem ───────────────────────────────────────────────────────────────

  it('renderiza uma imagem editorial de fallback quando imageUrl está ausente', () => {
    render(<PostCard post={basePost} />);
    const img = document.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', 'O silêncio que antecede a cura');
    expect(img?.getAttribute('src')).toContain('data:image/svg+xml');
  });

  it('renderiza imagem com alt quando imageUrl está presente', () => {
    const post = { ...basePost, imageUrl: 'https://example.com/image.jpg' };
    const { container } = render(<PostCard post={post} />);
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', 'O silêncio que antecede a cura');
  });

  // ── Badge de áudio ───────────────────────────────────────────────────────

  it('exibe badge de áudio quando audioUrl está presente', () => {
    const post = { ...basePost, audioUrl: 'https://example.com/audio.mp3' };
    render(<PostCard post={post} />);
    expect(screen.getByText(/áudio/i)).toBeInTheDocument();
  });

  it('não exibe badge de áudio quando audioUrl está ausente', () => {
    render(<PostCard post={basePost} />);
    expect(screen.queryByText(/áudio/i)).not.toBeInTheDocument();
  });

  // ── Prop featured ────────────────────────────────────────────────────────

  it('renderiza sem erro no modo featured', () => {
    expect(() => render(<PostCard post={basePost} featured={true} />)).not.toThrow();
  });

  // ── Categoria desconhecida ───────────────────────────────────────────────

  it('usa estilo fallback para categoria desconhecida sem crash', () => {
    const post = { ...basePost, category: 'Categoria Nova' as Post['category'] };
    expect(() => render(<PostCard post={post} />)).not.toThrow();
    expect(screen.getByText('Categoria Nova')).toBeInTheDocument();
  });
});
