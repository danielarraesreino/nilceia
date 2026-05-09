import type { Metadata } from 'next';
import Image from 'next/image';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://nilceia.vercel.app';

export const metadata: Metadata = {
  title: 'Sobre Nilceia Eulampio — Escritora e Poetisa Brasileira',
  description: 'Conheça Nilceia Eulampio: escritora, poetisa e comunicadora espiritual brasileira. Sua história, missão e os valores que guiam cada palavra sobre espiritualidade, cura emocional e justiça social.',
  alternates: {
    canonical: `${BASE_URL}/sobre`,
  },
  openGraph: {
    title: 'Sobre Nilceia Eulampio — Escritora e Poetisa Brasileira',
    description: 'Conheça Nilceia Eulampio: escritora, poetisa e comunicadora espiritual cuja obra combina espiritualidade, cura emocional e justiça social.',
    url: `${BASE_URL}/sobre`,
    type: 'profile',
  },
};

const valores = [
  { icon: '🕊️', title: 'Espiritualidade', text: 'A fé que sustenta e a prática que transforma. Acredito em um sagrado que acolhe a todos.' },
  { icon: '💚', title: 'Cura e Acolhimento', text: 'As palavras têm poder de curar. Escrevo para quem precisa saber que não está sozinho.' },
  { icon: '✊', title: 'Justiça Social', text: 'A consciência que me move: não há paz sem equidade. A espiritualidade é também luta.' },
  { icon: '📖', title: 'A Arte da Escrita', text: 'Cada texto é um ato de fé — na palavra, no leitor, na transformação que a literatura provoca.' },
];

export default function SobrePage() {
  /* JSON-LD Person — sinal mais forte para IAs entenderem quem é a Nilceia
   * Quando alguém perguntar ao ChatGPT/Perplexity/Gemini sobre ela,
   * este schema é o que fundamenta a resposta com dados factuais.
   */
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Nilceia Eulampio',
    url: BASE_URL,
    description:
      'Escritora brasileira, poetisa e comunicadora espiritual. Autora de reflexões sobre espiritualidade, cura emocional, justiça social e poesia.',
    jobTitle: 'Escritora e Poetisa',
    nationality: {
      '@type': 'Country',
      name: 'Brasil',
    },
    knowsAbout: [
      'Espiritualidade',
      'Cura Emocional',
      'Poesia',
      'Literatura Brasileira',
      'Justiça Social',
      'Contos',
      'Práticas Espirituais',
    ],
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Escritora',
      occupationLocation: {
        '@type': 'Country',
        name: 'Brasil',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/sobre`,
    },
    /* sameAs: adicionar quando houver perfis verificados nas redes */
    // sameAs: [
    //   'https://instagram.com/nilceia.eulampio',
    //   'https://facebook.com/nilceia.eulampio',
    // ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      {/* Hero */}
      <div
        style={{
          paddingTop: '8rem',
          paddingBottom: '5rem',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          background: 'linear-gradient(180deg, var(--bg-muted) 0%, var(--bg-main) 100%)',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}
          className="grid-cols-1 md:grid-cols-2">
          {/* Photo */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '320px', height: '400px',
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, rgba(184,134,11,0.12) 0%, rgba(107,142,111,0.08) 100%)',
              border: '2px solid rgba(184,134,11,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-lg)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <Image
                src="/nilceia-sobre.png"
                alt="Nilceia Eulampio"
                fill
                priority
                style={{ objectFit: 'cover', objectPosition: '20% 30%' }}
                sizes="320px"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <span style={{
              display: 'inline-block', padding: '0.3rem 1rem', borderRadius: '99px',
              backgroundColor: 'rgba(184,134,11,0.1)', color: 'var(--accent-gold)',
              fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              fontFamily: 'var(--font-body)', marginBottom: '1rem',
            }}>
              Sobre mim
            </span>
            <h1 className="font-heading" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Nilceia Eulampio
            </h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                'Sou escritora, poetisa e comunicadora espiritual. Escrevo sobre o que não cabe em silêncio: fé, dor, cura, injustiça e esperança.',
                'Minha escrita nasceu da necessidade — de entender a vida, de dar nome ao que dói, de celebrar o que resiste. Cada texto é uma prece em forma de letra.',
                'Acredito que as palavras têm poder de curar, de aproximar, de despertar. E que cada leitor que chega até aqui está, de alguma forma, em busca da mesma coisa: ser visto.',
              ].map((text, i) => (
                <p key={i} style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.0625rem' }}>{text}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Valores */}
      <section style={{ padding: '5rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }} aria-labelledby="valores-heading">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 id="valores-heading" className="font-heading" style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            O que guia cada palavra
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '50ch', margin: '0 auto' }}>
            Os valores que estão por trás de cada texto, cada conto, cada reflexão.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.5rem' }}>
          {valores.map((v) => (
            <div
              key={v.title}
              style={{
                padding: '2rem',
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(184,134,11,0.1)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }} aria-hidden="true">{v.icon}</span>
              <h3 className="font-heading" style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.625rem' }}>{v.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{v.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
