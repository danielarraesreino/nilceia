import type { Metadata } from 'next';
import { formatCurrency } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Livros & Infoprodutos',
  description: 'E-books, planners e reflexões em formato digital por Nilceia Eulampio. Conteúdo que transforma.',
};

const products = [
  {
    id: 'ebook-luto',
    icon: '📕',
    type: 'E-book',
    title: 'Quando o Luto Não Tem Palavras',
    description: 'Um guia espiritual e emocional para atravessar a dor da perda. Com reflexões, exercícios de escrita terapêutica e orações.',
    price: 37,
    checkoutUrl: 'https://hotmart.com',
    featured: true,
    testimonial: { name: 'Maria S.', text: 'Esse livro me encontrou quando eu mais precisava. Cada página parecia escrita para mim.' },
  },
  {
    id: 'planner-fe',
    icon: '📗',
    type: 'Planner',
    title: 'Planner da Fé: 90 Dias com Intenção',
    description: 'Um planejador espiritual para organizar sua vida com propósito. Inclui espaços para gratidão, intenções e versículos.',
    price: 27,
    checkoutUrl: 'https://hotmart.com',
    featured: false,
    testimonial: { name: 'Ana C.', text: 'Mudou minha manhã. Comecei a acordar com mais leveza e clareza.' },
  },
  {
    id: 'conto-gratis',
    icon: '🎁',
    type: 'Grátis',
    title: 'A Menina do Balanço — Conto',
    description: 'O conto que deu origem ao projeto. Baixe gratuitamente ao se inscrever na newsletter.',
    price: 0,
    checkoutUrl: '/#newsletter-form',
    featured: false,
    testimonial: null,
  },
];

export default function LojaPage() {
  return (
    <>
      <style>{`
        .product-btn { transition: opacity 0.2s; display: inline-block; }
        .product-btn:hover { opacity: 0.82; }
      `}</style>

      <div style={{
        paddingTop: '8rem', paddingBottom: '4rem', paddingLeft: '1.5rem', paddingRight: '1.5rem',
        background: 'linear-gradient(180deg, var(--bg-muted) 0%, var(--bg-main) 100%)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <span style={{
            display: 'inline-block', padding: '0.3rem 1rem', borderRadius: '99px',
            backgroundColor: 'rgba(184,134,11,0.1)', color: 'var(--accent-gold)',
            fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            fontFamily: 'var(--font-body)', marginBottom: '1rem',
          }}>Livros & Infoprodutos</span>
          <h1 className="font-heading" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Leve a Nilceia para casa 📚
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', lineHeight: 1.7 }}>
            E-books, planners e conteúdos digitais para aprofundar sua jornada de cura e espiritualidade.
          </p>
        </div>
      </div>

      <section aria-labelledby="products-heading" style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 1.5rem 6rem' }}>
        <h2 id="products-heading" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>Produtos disponíveis</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {products.map((p) => (
            <article
              key={p.id}
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                border: p.featured ? '2px solid var(--accent-gold)' : '1px solid rgba(184,134,11,0.12)',
                boxShadow: p.featured ? '0 8px 32px rgba(184,134,11,0.15)' : 'var(--shadow-sm)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              {p.featured && (
                <div style={{
                  position: 'absolute', top: '1rem', right: '1rem',
                  padding: '0.2rem 0.75rem', borderRadius: '99px',
                  backgroundColor: 'var(--accent-gold)', color: '#fff',
                  fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                }}>
                  ⭐ Destaque
                </div>
              )}

              <div style={{ padding: '2rem', flex: 1 }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }} aria-hidden="true">{p.icon}</div>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-body)' }}>
                  {p.type}
                </span>
                <h3 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0.5rem 0 0.75rem' }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  {p.description}
                </p>

                {p.testimonial && (
                  <blockquote style={{
                    borderLeft: '3px solid var(--accent-gold)', paddingLeft: '1rem',
                    marginBottom: '1.5rem', fontStyle: 'italic', fontSize: '0.875rem',
                    color: 'var(--text-secondary)', fontFamily: 'var(--font-heading)',
                  }}>
                    &ldquo;{p.testimonial.text}&rdquo;
                    <footer style={{ marginTop: '0.375rem', fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'normal', fontFamily: 'var(--font-body)' }}>
                      — {p.testimonial.name}
                    </footer>
                  </blockquote>
                )}
              </div>

              <div style={{ padding: '1.25rem 2rem', borderTop: '1px solid rgba(184,134,11,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  {p.price === 0 ? (
                    <span className="font-heading" style={{ fontSize: '1.375rem', color: 'var(--accent-green)', fontWeight: 700 }}>Grátis</span>
                  ) : (
                    <span className="font-heading" style={{ fontSize: '1.375rem', color: 'var(--text-primary)', fontWeight: 700 }}>{formatCurrency(p.price)}</span>
                  )}
                </div>
                <a
                  href={p.checkoutUrl}
                  target={p.price > 0 ? '_blank' : undefined}
                  rel={p.price > 0 ? 'noopener noreferrer' : undefined}
                  id={`buy-${p.id}`}
                  className="product-btn"
                  style={{
                    padding: '0.625rem 1.5rem',
                    backgroundColor: p.price === 0 ? 'var(--accent-green)' : 'var(--accent-gold)',
                    color: '#fff',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {p.price === 0 ? 'Baixar grátis' : 'Quero este →'}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
