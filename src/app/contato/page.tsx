import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contato — Nilceia Eulampio',
  description: 'Entre em contato para parcerias, palestras, sessões de escuta ou apenas para deixar uma mensagem carinhosa.',
};

export default function ContatoPage() {
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
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }} aria-hidden="true">💌</span>
            <h1 className="font-heading" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Fale Comigo
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              Seja para uma parceria, um convite para palestras, dúvidas sobre as sessões ou apenas para compartilhar como um texto tocou você, eu vou adorar ler.
            </p>
          </div>

          <div style={{ 
            backgroundColor: 'var(--bg-card)', 
            padding: '2.5rem', 
            borderRadius: 'var(--radius-lg)', 
            border: '1px solid rgba(107,142,111,0.2)',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '3rem'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h3 className="font-heading" style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>E-mail</h3>
                <a href="mailto:contato@nilceia.com.br" style={{ color: 'var(--accent-green)', fontWeight: 600, fontSize: '1.125rem' }}>
                  contato@nilceia.com.br
                </a>
              </div>
              
              <div>
                <h3 className="font-heading" style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Redes Sociais</h3>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>Instagram</a>
                  <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>Facebook</a>
                  <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>YouTube</a>
                </div>
              </div>

              <div>
                <h3 className="font-heading" style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Sessões de Escuta</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  Se você precisa de um atendimento focado, agende um horário.
                </p>
                <Link href="/agenda" style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>
                  Ir para Agendamentos →
                </Link>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
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
      </div>
    </>
  );
}
