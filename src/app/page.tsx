import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import FeaturedPosts from '@/components/home/FeaturedPosts';
import NewsletterBanner from '@/components/home/NewsletterBanner';
import Link from 'next/link';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://nilceia.vercel.app';

export const metadata: Metadata = {
  title: 'Nilceia Eulampio — Escritora, Poetisa e Voz Espiritual',
  description:
    'Reflexões sobre espiritualidade, cura emocional, contos e justiça social. Textos que tocam a alma por Nilceia Eulampio.',
};

const categories = [
  { icon: '🕊️', label: 'Espiritualidade', href: '/blog?cat=Espiritualidade', desc: 'Fé, oração e experiências sagradas' },
  { icon: '💚', label: 'Cura Emocional', href: '/blog?cat=Cura+Emocional', desc: 'Luto, trauma e recomeços' },
  { icon: '📖', label: 'Contos', href: '/blog?cat=Contos', desc: 'Narrativas que ensinam e encantam' },
  { icon: '✊', label: 'Justiça Social', href: '/blog?cat=Justiça+Social', desc: 'Vozes que precisam ser ouvidas' },
];

export default function HomePage() {
  /* JSON-LD WebSite + Person — apresenta a Nilceia para IAs na página principal
   * ChatGPT, Perplexity, Claude e Gemini indexam esta página.
   * O WebSite schema habilita o Google Sitelinks Searchbox.
   * O Person schema cria uma "entidade" no grafo de conhecimento das IAs.
   */
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Nilceia Eulampio',
    alternateName: 'Nilceia Eulampio — Escritora e Poetisa',
    url: BASE_URL,
    description:
      'Site oficial de Nilceia Eulampio: escritora, poetisa e comunicadora espiritual brasileira. Reflexões sobre espiritualidade, cura emocional, justiça social e poesia.',
    inLanguage: 'pt-BR',
    author: {
      '@type': 'Person',
      name: 'Nilceia Eulampio',
      url: `${BASE_URL}/sobre`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${BASE_URL}/sobre#nilceia-eulampio`,
    name: 'Nilceia Eulampio',
    url: BASE_URL,
    description:
      'Escritora brasileira, poetisa e comunicadora espiritual. Autora de reflexões sobre espiritualidade, cura emocional, justiça social e poesia.',
    jobTitle: 'Escritora e Poetisa',
    nationality: { '@type': 'Country', name: 'Brasil' },
    knowsAbout: [
      'Espiritualidade',
      'Cura Emocional',
      'Poesia',
      'Literatura Brasileira',
      'Justiça Social',
    ],
    mainEntityOfPage: `${BASE_URL}/sobre`,
  };

  return (
    <>
      {/* JSON-LD: Identidade da Nilceia para IAs e Google Knowledge Graph */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <style>{`
        .cat-card { 
          display: flex; flex-direction: column; gap: 0.5rem; padding: 1.5rem;
          background-color: var(--bg-card); border-radius: var(--radius-md);
          border: 1px solid rgba(184,134,11,0.1); box-shadow: var(--shadow-sm);
          transition: all 0.25s; text-decoration: none;
        }
        .cat-card:hover {
          border-color: rgba(184,134,11,0.35); transform: translateY(-3px); box-shadow: var(--shadow-md);
        }
        .apoio-btn {
          display: inline-block; padding: 0.875rem 2.5rem;
          background-color: var(--accent-green); color: #fff;
          border-radius: var(--radius-sm); font-weight: 700; font-size: 1rem;
          font-family: var(--font-body);
          box-shadow: 0 4px 16px rgba(107,142,111,0.35); transition: all 0.2s;
        }
        .apoio-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(107,142,111,0.45); }
      `}</style>

      <HeroSection />

      {/* Category pills section */}
      <section
        aria-labelledby="categories-heading"
        style={{ padding: '3rem 1.5rem', backgroundColor: 'var(--bg-muted)' }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2
            id="categories-heading"
            className="font-heading"
            style={{ fontSize: '1.5rem', textAlign: 'center', color: 'var(--text-primary)', marginBottom: '2rem' }}
          >
            Explore por tema
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {categories.map((cat) => (
              <Link key={cat.label} href={cat.href} className="cat-card">
                <span style={{ fontSize: '1.75rem' }} aria-hidden="true">{cat.icon}</span>
                <span className="font-heading" style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--text-primary)' }}>{cat.label}</span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>{cat.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FeaturedPosts />

      {/* Quote section */}
      <section
        style={{
          padding: '5rem 1.5rem',
          background: 'linear-gradient(180deg, var(--bg-muted) 0%, var(--bg-main) 100%)',
          textAlign: 'center',
        }}
        aria-label="Citação em destaque"
      >
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div className="divider-ornament" style={{ marginBottom: '2rem' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Palavra do dia</span>
          </div>
          <blockquote className="font-heading" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>
            &ldquo;Escrever é um ato de coragem. Publicar é um ato de fé. Tocar alguém é graça.&rdquo;
          </blockquote>
          <footer style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--accent-gold)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
            — Nilceia Eulampio
          </footer>
        </div>
      </section>

      <NewsletterBanner />

      {/* Apoio CTA */}
      <section style={{ padding: '4rem 1.5rem', textAlign: 'center' }} aria-labelledby="apoio-heading">
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <h2 id="apoio-heading" className="font-heading" style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Este trabalho vive do seu apoio 💛
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.7 }}>
            Se algum texto tocou sua vida, considere apoiar este projeto. Cada contribuição mantém a escrita viva e gratuita.
          </p>
          <Link href="/apoie" id="home-apoio-btn" className="apoio-btn">
            Apoiar este trabalho 🌱
          </Link>
        </div>
      </section>
    </>
  );
}
