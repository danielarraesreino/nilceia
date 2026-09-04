'use client';

import Link from 'next/link';
import type { Post, PostCategory } from '@/types';
import { formatDateShort } from '@/lib/utils';
import { getFallbackBlogImage } from '@/lib/blog-visuals';

interface PostCardProps {
  post: Pick<Post, '_id' | 'title' | 'slug' | 'excerpt' | 'category' | 'publishedAt' | 'imageUrl' | 'audioUrl' | 'readingTime'>;
  featured?: boolean;
}

const categoryColors: Record<PostCategory, { bg: string; text: string }> = {
  'Espiritualidade':  { bg: '#FFF3CD', text: '#856404' },
  'Cura Emocional':   { bg: '#D1ECF1', text: '#0C5460' },
  'Contos':           { bg: '#F8D7DA', text: '#721C24' },
  'Justiça Social':   { bg: '#D4EDDA', text: '#155724' },
  'Poesia':           { bg: '#E2D9F3', text: '#4A2D8A' },
  'Reflexões':        { bg: '#FDE8D8', text: '#7A3B1E' },
  'Assédio Moral':    { bg: '#FADBD8', text: '#7B241C' },
  'Mulheres - Lutas Sociais': { bg: '#F3D9E8', text: '#8A2D64' },
};

export default function PostCard({ post, featured = false }: PostCardProps) {
  const { title, slug, excerpt, category, publishedAt, imageUrl, audioUrl, readingTime } = post;
  const catStyle = categoryColors[category as PostCategory] ?? { bg: '#F5EFE6', text: '#5D4E3F' };
  const resolvedImageUrl = imageUrl || getFallbackBlogImage(category, title);

  return (
    <article
      style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid rgba(184,134,11,0.1)',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(184,134,11,0.25)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(184,134,11,0.1)';
      }}
    >
      {/* Image */}
      <Link href={`/blog/${slug.current}`} tabIndex={-1} aria-hidden="true">
        <div style={{ height: featured ? '14rem' : '11rem', overflow: 'hidden', position: 'relative' }}>
          <img
            src={resolvedImageUrl}
            alt={title}
            loading="lazy"
            decoding="async"
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
          />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top, rgba(44,36,27,0.3), transparent)' }} />
        </div>
      </Link>

      {/* Content */}
      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span
            style={{
              padding: '0.2rem 0.75rem',
              borderRadius: '99px',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              backgroundColor: catStyle.bg,
              color: catStyle.text,
              fontFamily: 'var(--font-body)',
            }}
          >
            {category}
          </span>

          <time
            dateTime={publishedAt}
            style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}
          >
            {formatDateShort(publishedAt)}
          </time>

          {readingTime && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
              · {readingTime} min
            </span>
          )}

          {audioUrl && (
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-green)', fontFamily: 'var(--font-body)' }}>
              🎧 áudio
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={`/blog/${slug.current}`}>
          <h3
            className="font-heading"
            style={{
              fontSize: featured ? '1.3125rem' : '1.125rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              lineHeight: 1.35,
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent-gold)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; }}
          >
            {title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            flex: 1,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {excerpt?.trim() || ''}
        </p>

        {/* CTA */}
        <Link
          href={`/blog/${slug.current}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: 700,
            color: 'var(--accent-gold)',
            fontFamily: 'var(--font-body)',
            marginTop: 'auto',
            paddingTop: '0.5rem',
            borderTop: '1px solid rgba(184,134,11,0.1)',
            transition: 'gap 0.2s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.gap = '0.625rem'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.gap = '0.375rem'; }}
          aria-label={`Ler reflexão: ${title}`}
        >
          Ler reflexão
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
