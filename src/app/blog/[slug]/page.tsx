import type { Metadata } from 'next';
import Link from 'next/link';
import ReadingProgress from '@/components/blog/ReadingProgress';
import { formatDate } from '@/lib/utils';

// Static sample — replace with `getPostBySlug(slug)` when Sanity is configured
const SAMPLE_POST = {
  _id: '1',
  title: 'O silêncio que antecede a cura: uma meditação sobre o luto',
  slug: { current: 'silencio-que-antecede-a-cura' },
  excerpt: 'Existe um silêncio que machuca. Aquele que vem depois de uma perda e preenche cada canto da casa com a ausência de alguém. Mas existe outro silêncio — o que prepara o terreno para o novo.',
  category: 'Cura Emocional',
  publishedAt: '2026-04-28T00:00:00Z',
  readingTime: 5,
  content: `
Existe um silêncio que machuca. Aquele que vem depois de uma perda e preenche cada canto da casa com a ausência de alguém. Um silêncio que grita. Que pesa.

Mas existe outro silêncio. Aquele que antecede a cura.

## O luto não é fraqueza

A cultura que nos criou ensinou que chorar é sinal de fraqueza, que se mover rapidamente após uma perda é sinal de força. Mentira. Uma das mentiras mais cruéis que carregamos.

O luto tem seu próprio tempo. Ele não obedece calendários, não respeita prazo de validade. Ele simplesmente *é*.

> "Não há atalho para o luto. Só há o caminho através dele."

## Aprender a sentar com a dor

O que descobri, em anos de escuta e de estudo da alma humana, é que a dor só passa quando a encontramos de frente. Quando paramos de correr.

Sentar com a dor não significa desistir. Significa honrar o que foi. Significa dizer: *você importou*.

## O silêncio que prepara o terreno

Depois de muito choro, chega um silêncio diferente. Mais suave. Não é ausência de dor — é presença de si mesma. É o terreno preparado para o novo.

É nesse silêncio que começamos a ouvir, de novo, a nossa própria voz.

E ela ainda tem muita coisa a dizer.
  `,
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  // TODO: const post = await getPostBySlug(slug);
  const post = SAMPLE_POST;

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: ['Nilceia Eulampio'],
      tags: [post.category],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  // TODO: const post = await getPostBySlug(slug);
  const post = SAMPLE_POST;

  if (!post) {
    return (
      <div style={{ paddingTop: '10rem', textAlign: 'center' }}>
        <h1 className="font-heading" style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Post não encontrado</h1>
        <Link href="/blog" style={{ color: 'var(--accent-gold)', marginTop: '1rem', display: 'inline-block' }}>← Voltar ao blog</Link>
      </div>
    );
  }

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
        </div>
      </header>

      {/* Article body */}
      <article style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 1.5rem 6rem' }}>
        <div
          className="prose-nilceia"
          dangerouslySetInnerHTML={{ __html: post.content.replace(/\n\n/g, '</p><p>').replace(/^## (.+)$/gm, '</p><h2>$1</h2><p>').replace(/> (.+)/gm, '<blockquote>$1</blockquote>').replace(/\*(.+?)\*/g, '<em>$1</em>').replace(/^<\/p>/, '').replace(/<p><\/p>/g, '') }}
        />

        {/* Share section */}
        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(184,134,11,0.15)', textAlign: 'center' }}>
          <p className="font-heading" style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', fontStyle: 'italic' }}>
            Este texto tocou seu coração? Compartilhe com alguém. 💛
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'Compartilhar no WhatsApp', icon: '📱', color: '#25D366', href: `https://wa.me/?text=${encodeURIComponent(post.title)}` },
              { label: 'Compartilhar no Twitter', icon: '🐦', color: '#1DA1F2', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}` },
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
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <Link href="/blog" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontFamily: 'var(--font-body)' }}>
            ← Ler mais reflexões
          </Link>
        </div>
      </article>
    </>
  );
}
