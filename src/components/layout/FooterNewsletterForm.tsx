'use client';

import { useState } from 'react';

export default function FooterNewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer' }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setEmail('');
        setMessage(data.message || 'Inscrito com sucesso! 💛');
      } else {
        setStatus('error');
        setMessage(data.message || 'Algo deu errado. Tente novamente.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Erro de conexão. Tente novamente.');
    }
  }

  if (status === 'success') {
    return (
      <div style={{ color: '#FDF9F3', fontSize: '0.9375rem', padding: '0.75rem', backgroundColor: 'rgba(107,142,111,0.2)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(107,142,111,0.3)' }}>
        {message}
      </div>
    );
  }

  return (
    <form
      id="footer-newsletter-form"
      onSubmit={handleSubmit}
      style={{ display: 'flex', gap: '0.75rem', maxWidth: '420px', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}
    >
      <input
        type="email"
        name="email"
        id="footer-email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="seu@email.com"
        required
        disabled={status === 'loading'}
        aria-label="Seu endereço de e-mail"
        style={{
          flex: '1 1 220px',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(184,134,11,0.3)',
          backgroundColor: 'rgba(255,255,255,0.08)',
          color: '#FDF9F3',
          fontSize: '0.9375rem',
          outline: 'none',
        }}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: 'var(--accent-gold)',
          color: '#fff',
          borderRadius: 'var(--radius-sm)',
          border: 'none',
          fontWeight: 700,
          fontSize: '0.9375rem',
          cursor: status === 'loading' ? 'wait' : 'pointer',
          whiteSpace: 'nowrap',
          opacity: status === 'loading' ? 0.7 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        {status === 'loading' ? 'Enviando...' : 'Quero receber ✨'}
      </button>
      {status === 'error' && (
        <p style={{ color: '#F48FB1', fontSize: '0.8125rem', width: '100%', marginTop: '0.5rem' }}>
          {message}
        </p>
      )}
    </form>
  );
}
