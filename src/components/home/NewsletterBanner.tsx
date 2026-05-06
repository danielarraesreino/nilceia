'use client';

import { useState } from 'react';

type FormState = 'idle' | 'loading' | 'success' | 'error';

export default function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setState('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setState('success');
        setEmail('');
      } else {
        const data = await res.json();
        setErrorMsg(data.message ?? 'Algo deu errado. Tente novamente.');
        setState('error');
      }
    } catch {
      setErrorMsg('Não foi possível conectar. Tente novamente.');
      setState('error');
    }
  }

  return (
    <section
      aria-labelledby="newsletter-heading"
      style={{
        background: 'linear-gradient(135deg, var(--text-primary) 0%, #3D2F24 100%)',
        padding: '5rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* BG decoration */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,134,11,0.2) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(107,142,111,0.15) 0%, transparent 70%)' }} />
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>

        <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }} aria-hidden="true">💌</span>

        <h2
          id="newsletter-heading"
          className="font-heading"
          style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', color: '#FDF9F3', marginBottom: '0.75rem', fontWeight: 700 }}
        >
          Receba reflexões toda semana
        </h2>

        <p style={{ color: 'rgba(245,239,230,0.75)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
          Junte-se a mais de 5.000 leitores que recebem textos que tocam a alma direto no e-mail.
        </p>
        <p style={{ color: 'var(--accent-gold)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '2rem', fontFamily: 'var(--font-body)' }}>
          🎁 Bônus: baixe grátis o conto &ldquo;A Menina do Balanço&rdquo; ao se inscrever
        </p>

        {state === 'success' ? (
          <div
            role="alert"
            style={{
              padding: '1.5rem',
              backgroundColor: 'rgba(107,142,111,0.2)',
              border: '1px solid rgba(107,142,111,0.4)',
              borderRadius: 'var(--radius-md)',
              color: '#A5D6A7',
              fontSize: '1rem',
              fontFamily: 'var(--font-body)',
            }}
          >
            ✅ Ótimo! Verifique sua caixa de entrada para confirmar o cadastro. Seu conto já está a caminho!
          </div>
        ) : (
          <form
            id="newsletter-form"
            onSubmit={handleSubmit}
            style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <label htmlFor="newsletter-email" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
              Seu e-mail
            </label>
            <input
              id="newsletter-email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              disabled={state === 'loading'}
              style={{
                flex: '1 1 240px',
                padding: '0.875rem 1.25rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255,255,255,0.15)',
                backgroundColor: 'rgba(255,255,255,0.08)',
                color: '#FDF9F3',
                fontSize: '1rem',
                outline: 'none',
                fontFamily: 'var(--font-body)',
                maxWidth: '320px',
              }}
            />
            <button
              type="submit"
              disabled={state === 'loading'}
              aria-busy={state === 'loading'}
              style={{
                padding: '0.875rem 2rem',
                backgroundColor: 'var(--accent-gold)',
                color: '#fff',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: state === 'loading' ? 'wait' : 'pointer',
                fontFamily: 'var(--font-body)',
                transition: 'opacity 0.2s',
                opacity: state === 'loading' ? 0.7 : 1,
              }}
            >
              {state === 'loading' ? 'Enviando…' : 'Quero receber ✨'}
            </button>
          </form>
        )}

        {state === 'error' && (
          <p role="alert" style={{ marginTop: '0.75rem', color: '#F48FB1', fontSize: '0.875rem', fontFamily: 'var(--font-body)' }}>
            ❌ {errorMsg}
          </p>
        )}

        <p style={{ marginTop: '1.25rem', fontSize: '0.8rem', color: 'rgba(245,239,230,0.4)', fontFamily: 'var(--font-body)' }}>
          Sem spam. Cancele quando quiser. 🔒
        </p>
      </div>
    </section>
  );
}
