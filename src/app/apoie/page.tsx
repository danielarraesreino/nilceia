import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Apoie este trabalho — Nilceia Eulampio',
  description: 'Ajude a manter este espaço de reflexão, cura e poesia no ar. Seu apoio permite que mais pessoas sejam alcançadas.',
};

export default function ApoiePage() {
  return (
    <>
      <div
        style={{
          paddingTop: '8rem',
          paddingBottom: '5rem',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          background: 'linear-gradient(180deg, var(--bg-muted) 0%, var(--bg-main) 100%)',
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }} aria-hidden="true">💛</span>
          
          <h1 className="font-heading" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Apoie este trabalho
          </h1>
          
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2.5rem' }}>
            Este espaço nasceu para ser um refúgio. A escrita, para mim, é uma missão de acolhimento e cura. Se as minhas palavras já tocaram o seu coração e você deseja ajudar a manter este projeto vivo, considere fazer uma contribuição voluntária.
          </p>

          <div style={{ 
            backgroundColor: 'var(--bg-card)', 
            padding: '2.5rem', 
            borderRadius: 'var(--radius-lg)', 
            border: '1px solid rgba(184,134,11,0.2)',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '3rem'
          }}>
            <h2 className="font-heading" style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
              Contribuição via PIX
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Você pode apoiar com qualquer valor utilizando a chave PIX abaixo:
            </p>
            <div style={{ 
              backgroundColor: 'rgba(184,134,11,0.05)', 
              padding: '1rem', 
              borderRadius: 'var(--radius-md)',
              border: '2px dashed rgba(184,134,11,0.3)',
              display: 'inline-block',
              fontFamily: 'monospace',
              fontSize: '1.125rem',
              color: 'var(--accent-gold)',
              fontWeight: 700,
              letterSpacing: '0.05em'
            }}>
              apoio@nilceia.com.br
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
              (Chave e-mail ilustrativa)
            </p>
          </div>

          <Link
            href="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600,
              fontFamily: 'var(--font-body)',
            }}
          >
            ← Voltar para o início
          </Link>
        </div>
      </div>
    </>
  );
}
