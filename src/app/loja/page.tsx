import type { Metadata } from 'next';
import { formatCurrency } from '@/lib/utils';
import { client } from '@/lib/sanity';

export const metadata: Metadata = {
  title: 'Livros & Infoprodutos',
  description: 'E-books, planners e reflexões em formato digital por Nilceia Eulampio. Conteúdo que transforma.',
};

export const revalidate = 3600; // revalidate at most every hour

export default async function LojaPage() {
  const query = `*[_type == "product"] | order(featured desc, _createdAt desc) {
    _id,
    title,
    description,
    price,
    type,
    checkoutUrl,
    featured,
    "imageUrl": imageUrl.asset->url
  }`;

  const products = await client.fetch(query);

  const typeIcons: Record<string, string> = {
    ebook: '📕',
    planner: '📗',
    course: '🎓',
    other: '🎁',
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'ebook': return 'E-book';
      case 'planner': return 'Planner';
      case 'course': return 'Curso / Mentoria';
      default: return 'Outro';
    }
  };

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
        {products.length === 0 ? (
           <div className="text-center py-12 text-gray-500">
             Nenhum produto disponível no momento. Volte em breve!
           </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {products.map((p: any) => (
              <article
                key={p._id}
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
                    zIndex: 10
                  }}>
                    ⭐ Destaque
                  </div>
                )}

                {p.imageUrl && (
                  <div style={{ width: '100%', height: '200px', backgroundColor: '#f3f4f6', position: 'relative' }}>
                    <img src={p.imageUrl} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}

                <div style={{ padding: '2rem', flex: 1 }}>
                  {!p.imageUrl && <div style={{ fontSize: '3rem', marginBottom: '1rem' }} aria-hidden="true">{typeIcons[p.type] || '🎁'}</div>}
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-body)' }}>
                    {getTypeLabel(p.type)}
                  </span>
                  <h3 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0.5rem 0 0.75rem' }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                    {p.description}
                  </p>
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
                    id={`buy-${p._id}`}
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
        )}
      </section>
    </>
  );
}
