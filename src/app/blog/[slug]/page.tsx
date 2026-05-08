import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import ReadingProgress from '@/components/blog/ReadingProgress';
import CommentsSection from '@/components/blog/CommentsSection';
import { getPostBySlug, getAllPostSlugs, urlFor, getCommentsForPost } from '@/lib/sanity';
import { formatDate } from '@/lib/utils';
import type { PortableTextBlock } from '@/types';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Gera as rotas estáticas para todos os posts no build
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Metadata dinâmica com Open Graph e Twitter Card
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: 'Post não encontrado' };
  }

  const ogImage = post.imageUrl
    ? post.imageUrl
    : '/og-default.png';

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author?.name ?? 'Nilceia Eulampio'],
      tags: [post.category],
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
  };
}

// Componentes customizados para o Portable Text (estilo literário/poético)
const portableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p style={{ marginBottom: '1.5rem', lineHeight: 1.85 }}>{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="font-heading" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: '2.5rem 0 1rem' }}>{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="font-heading" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: '2rem 0 0.75rem' }}>{children}</h3>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote style={{
        borderLeft: '4px solid var(--accent-gold)',
        paddingLeft: '1.5rem',
        margin: '2rem 0',
        color: 'var(--text-secondary)',
        fontStyle: 'italic',
        fontSize: '1.1rem',
        lineHeight: 1.8,
      }}>{children}</blockquote>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em style={{ fontStyle: 'italic', color: 'var(--accent-gold)' }}>{children}</em>
    ),
    link: ({ value, children }: { value?: { href: string }; children?: React.ReactNode }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer"
        style={{ color: 'var(--accent-gold)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', listStyleType: 'disc' }}>{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', listStyleType: 'decimal' }}>{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li style={{ marginBottom: '0.5rem', lineHeight: 1.75 }}>{children}</li>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <li style={{ marginBottom: '0.5rem', lineHeight: 1.75 }}>{children}</li>
    ),
  },
};

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const initialComments = await getCommentsForPost(post._id);
  const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${slug}`;

  return (
    <>
      <ReadingProgress />

      {/* Article header */}
      <header
        style={{
          paddingTop: '7rem',
          paddingBottom: '3rem',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          background: 'linear-gradient(180deg, var(--bg-muted) 0%, var(--bg-main) 100%)',
        }}
      >
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <Link
            href="/blog"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              color: 'var(--accent-gold)', fontSize: '0.875rem', fontWeight: 600,
              fontFamily: 'var(--font-body)', marginBottom: '2rem',
            }}
          >
            ← Todas as reflexões
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <span style={{
              padding: '0.25rem 0.875rem', borderRadius: '99px',
              backgroundColor: 'rgba(184,134,11,0.1)', color: 'var(--accent-gold)',
              fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
              fontFamily: 'var(--font-body)',
            }}>
              {post.category}
            </span>
            <time dateTime={post.publishedAt} style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
              {formatDate(post.publishedAt)}
            </time>
            {post.readingTime && (
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
                · {post.readingTime} min de leitura
              </span>
            )}
          </div>

          <h1 className="font-heading" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.625rem)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25, marginBottom: '1.25rem' }}>
            {post.title}
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {post.excerpt}
          </p>

          {/* Imagem de capa */}
          {post.imageUrl && (
            <div style={{ marginTop: '2.5rem', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <img
                src={post.imageUrl}
                alt={`Imagem de capa: ${post.title}`}
                style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', display: 'block' }}
              />
            </div>
          )}
        </div>
      </header>

      {/* Article body com Portable Text */}
      <article style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 1.5rem 6rem' }}>
        <div className="prose-nilceia">
          {post.body && post.body.length > 0 ? (
            <PortableText
              value={post.body as PortableTextBlock[]}
              components={portableTextComponents}
            />
          ) : (
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
              Conteúdo em breve...
            </p>
          )}
        </div>

        {/* Autor */}
        {post.author && (
          <div style={{
            marginTop: '3rem', padding: '1.5rem 2rem',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(184,134,11,0.12)',
            display: 'flex', alignItems: 'center', gap: '1.25rem',
          }}>
            {post.author.imageUrl && (
              <img
                src={post.author.imageUrl}
                alt={post.author.name}
                style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
              />
            )}
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', marginBottom: '0.25rem' }}>Escrito por</p>
              <p className="font-heading" style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{post.author.name}</p>
              {post.author.bio && (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.6 }}>{post.author.bio}</p>
              )}
            </div>
          </div>
        )}

        {/* Share section */}
        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(184,134,11,0.15)', textAlign: 'center' }}>
          <p className="font-heading" style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', fontStyle: 'italic' }}>
            Este texto tocou seu coração? Compartilhe com alguém. 💛
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'Compartilhar no WhatsApp', icon: '📱', color: '#25D366', href: `https://wa.me/?text=${encodeURIComponent(post.title + ' ' + shareUrl)}` },
              { label: 'Compartilhar no Twitter', icon: '🐦', color: '#1DA1F2', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}` },
            ].map((btn) => (
              <a
                key={btn.label}
                href={btn.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={btn.label}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.625rem 1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `1.5px solid ${btn.color}`,
                  color: btn.color,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                  transition: 'all 0.2s',
                }}
              >
                <span aria-hidden="true">{btn.icon}</span>
                Compartilhar
              </a>
            ))}
          </div>
        </div>

        {/* Back link */}
        <div style={{ marginTop: '3rem', textAlign: 'center', marginBottom: '4rem' }}>
          <Link href="/blog" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontFamily: 'var(--font-body)' }}>
            ← Ler mais reflexões
          </Link>
        </div>

        {/* Seção de Comentários */}
        <CommentsSection postId={post._id} initialComments={initialComments} />
      </article>
    </>
  );
}
