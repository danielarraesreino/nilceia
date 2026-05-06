'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import { z } from 'zod';

const intentionSchema = z.object({
  name: z.string().min(2, 'Nome muito curto').max(60),
  text: z.string().min(10, 'Escreva pelo menos 10 caracteres').max(500, 'Máximo 500 caracteres'),
});

type FormState = 'idle' | 'loading' | 'success' | 'error';

const sampleIntentions = [
  { name: 'Maria', text: 'Ore pela cura da minha mãe. Ela está lutando com coragem.', date: '2026-04-28' },
  { name: 'João', text: 'Peço orações pelo meu casamento. Estamos atravessando um momento difícil.', date: '2026-04-25' },
  { name: 'Ana', text: 'Gratidão pela vida que retornou. Ore por todos que ainda esperam.', date: '2026-04-22' },
];

export default function IntencoesPage() {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [state, setState] = useState<FormState>('idle');
  const [errors, setErrors] = useState<{ name?: string; text?: string }>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const result = intentionSchema.safeParse({ name, text });
    if (!result.success) {
      const fieldErrors: { name?: string; text?: string } = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as 'name' | 'text';
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setState('loading');
    // TODO: POST to API route / Sanity
    await new Promise((r) => setTimeout(r, 1200)); // simulate
    setState('success');
    setName('');
    setText('');
  }

  return (
    <>
      {/* Header */}
      <div style={{
        paddingTop: '8rem', paddingBottom: '4rem', paddingLeft: '1.5rem', paddingRight: '1.5rem',
        background: 'linear-gradient(180deg, var(--bg-muted) 0%, var(--bg-main) 100%)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }} aria-hidden="true">🙏</span>
          <h1 className="font-heading" style={{ fontSize: 'clamp(1.875rem, 4vw, 2.75rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Ore Comigo
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', lineHeight: 1.75 }}>
            Deixe aqui sua intenção de oração. Eu levo cada pedido comigo em silêncio e em oração. Você não está sozinho.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem 6rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}
        className="grid-cols-1 md:grid-cols-2">

        {/* Form */}
        <section aria-labelledby="intention-form-heading">
          <h2 id="intention-form-heading" className="font-heading" style={{ fontSize: '1.375rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
            Envie sua intenção
          </h2>

          {state === 'success' ? (
            <div role="alert" style={{
              padding: '2rem', borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(107,142,111,0.1)', border: '1px solid rgba(107,142,111,0.3)',
              textAlign: 'center',
            }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>🕊️</span>
              <p className="font-heading" style={{ fontSize: '1.125rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Intenção recebida com amor.
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
                Obrigada por confiar. Estarei com você em oração.
              </p>
              <button
                onClick={() => setState('idle')}
                style={{ marginTop: '1.25rem', color: 'var(--accent-gold)', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
              >
                Enviar outra intenção
              </button>
            </div>
          ) : (
            <form id="intention-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label htmlFor="intention-name" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem', fontFamily: 'var(--font-body)' }}>
                  Seu nome *
                </label>
                <input
                  id="intention-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Como posso te chamar?"
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  aria-invalid={!!errors.name}
                  style={{
                    width: '100%', padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: `1.5px solid ${errors.name ? '#C62828' : 'rgba(184,134,11,0.2)'}`,
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: '1rem', fontFamily: 'var(--font-body)', outline: 'none',
                  }}
                />
                {errors.name && <p id="name-error" role="alert" style={{ color: '#C62828', fontSize: '0.8rem', marginTop: '0.25rem', fontFamily: 'var(--font-body)' }}>{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="intention-text" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem', fontFamily: 'var(--font-body)' }}>
                  Sua intenção *
                </label>
                <textarea
                  id="intention-text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Escreva sua intenção de oração aqui…"
                  rows={5}
                  maxLength={500}
                  aria-describedby={errors.text ? 'text-error' : 'text-counter'}
                  aria-invalid={!!errors.text}
                  style={{
                    width: '100%', padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: `1.5px solid ${errors.text ? '#C62828' : 'rgba(184,134,11,0.2)'}`,
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: '1rem', fontFamily: 'var(--font-body)', outline: 'none',
                    resize: 'vertical', lineHeight: 1.6,
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                  {errors.text
                    ? <p id="text-error" role="alert" style={{ color: '#C62828', fontSize: '0.8rem', fontFamily: 'var(--font-body)' }}>{errors.text}</p>
                    : <span id="text-counter" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>{text.length}/500</span>
                  }
                </div>
              </div>

              <button
                type="submit"
                disabled={state === 'loading'}
                aria-busy={state === 'loading'}
                style={{
                  padding: '0.875rem',
                  backgroundColor: 'var(--accent-gold)',
                  color: '#fff',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: state === 'loading' ? 'wait' : 'pointer',
                  fontFamily: 'var(--font-body)',
                  opacity: state === 'loading' ? 0.75 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                {state === 'loading' ? 'Enviando…' : '🙏 Enviar intenção'}
              </button>
            </form>
          )}
        </section>

        {/* Mural */}
        <section aria-labelledby="mural-heading">
          <h2 id="mural-heading" className="font-heading" style={{ fontSize: '1.375rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
            Mural de intenções
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {sampleIntentions.map((intent, i) => (
              <div
                key={i}
                style={{
                  padding: '1.25rem',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(184,134,11,0.1)',
                  borderLeft: '3px solid var(--accent-gold)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.65, fontStyle: 'italic', marginBottom: '0.625rem', fontFamily: 'var(--font-heading)' }}>
                  &ldquo;{intent.text}&rdquo;
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>— {intent.name}</span>
                  <time dateTime={intent.date} style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>{intent.date}</time>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
