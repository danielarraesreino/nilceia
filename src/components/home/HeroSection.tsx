'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section
      aria-label="Apresentação"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '4.5rem',
      }}
    >
      {/* Background decorative elements */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '10%', right: '5%', width: '500px', height: '500px',
          borderRadius: '50%', opacity: 0.12,
          background: 'radial-gradient(circle, var(--accent-gold) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '2%', width: '350px', height: '350px',
          borderRadius: '50%', opacity: 0.08,
          background: 'radial-gradient(circle, var(--accent-green) 0%, transparent 70%)',
        }} />
        {/* Decorative lines */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.04 }} xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="var(--accent-gold)" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', width: '100%' }}
        className="grid-cols-1 md:grid-cols-2">

        {/* Text side */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <span style={{
              display: 'inline-block',
              padding: '0.35rem 1rem',
              borderRadius: '99px',
              backgroundColor: 'rgba(184,134,11,0.1)',
              border: '1px solid rgba(184,134,11,0.25)',
              color: 'var(--accent-gold)',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-body)',
              marginBottom: '1.5rem',
            }}>
              Escritora · Poetisa · Voz Espiritual
            </span>
          </motion.div>

          <motion.h1
            className="font-heading"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            style={{ fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: '1.5rem', color: 'var(--text-primary)' }}
          >
            Palavras que{' '}
            <span className="gradient-text">tocam a alma</span>{' '}
            e movem o coração
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '2rem', maxWidth: '50ch' }}
          >
            Reflexões sobre espiritualidade, cura emocional e justiça social. Textos que acolhem, questionam e transformam.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
          >
            <Link
              href="/agenda"
              id="hero-cta-agenda"
              style={{
                padding: '0.875rem 2rem',
                backgroundColor: 'var(--accent-green)',
                color: '#fff',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '1rem',
                fontFamily: 'var(--font-body)',
                boxShadow: '0 4px 16px rgba(107,142,111,0.3)',
                transition: 'all 0.2s',
                display: 'inline-block',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 24px rgba(107,142,111,0.4)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 16px rgba(107,142,111,0.3)'; }}
            >
              Agendar Sessão 🗓️
            </Link>
            <Link
              href="/blog"
              id="hero-cta-blog"
              style={{
                padding: '0.875rem 2rem',
                backgroundColor: 'var(--accent-gold)',
                color: '#fff',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '1rem',
                fontFamily: 'var(--font-body)',
                boxShadow: '0 4px 16px rgba(184,134,11,0.3)',
                transition: 'all 0.2s',
                display: 'inline-block',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 24px rgba(184,134,11,0.4)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 16px rgba(184,134,11,0.3)'; }}
            >
              Ler reflexões ✨
            </Link>
            <Link
              href="/sobre"
              id="hero-cta-sobre"
              style={{
                padding: '0.875rem 2rem',
                backgroundColor: 'transparent',
                color: 'var(--text-primary)',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '1rem',
                fontFamily: 'var(--font-body)',
                border: '1.5px solid rgba(44,36,27,0.2)',
                transition: 'all 0.2s',
                display: 'inline-block',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--accent-gold)'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent-gold)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(44,36,27,0.2)'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)'; }}
            >
              Conhecer a Nilceia
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ display: 'flex', gap: '2.5rem', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(184,134,11,0.15)', flexWrap: 'wrap' }}
          >
            {[
              { value: '200+', label: 'Reflexões publicadas' },
              { value: '5k+', label: 'Leitores mensais' },
              { value: '3', label: 'E-books publicados' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-heading" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-gold)' }}>{stat.value}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Visual side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}
          className="hidden md:flex"
        >
          {/* Photo placeholder / frame */}
          <div
            style={{
              width: '380px', height: '480px',
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, rgba(184,134,11,0.15) 0%, rgba(107,142,111,0.1) 100%)',
              border: '2px solid rgba(184,134,11,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div className="animate-float" style={{ fontSize: '5rem', marginBottom: '1rem' }}>📖</div>
              <p className="font-heading" style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                &ldquo;A escrita é oração em forma de letra.&rdquo;
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', marginTop: '0.5rem' }}>— Nilceia Eulampio</p>
            </div>
            {/* Corner decorations */}
            <div style={{ position: 'absolute', top: 16, left: 16, width: 40, height: 40, borderTop: '2px solid var(--accent-gold)', borderLeft: '2px solid var(--accent-gold)', borderRadius: '4px 0 0 0', opacity: 0.6 }} />
            <div style={{ position: 'absolute', bottom: 16, right: 16, width: 40, height: 40, borderBottom: '2px solid var(--accent-gold)', borderRight: '2px solid var(--accent-gold)', borderRadius: '0 0 4px 0', opacity: 0.6 }} />
          </div>

          {/* Floating badge */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
            style={{
              position: 'absolute', bottom: '2rem', left: '-2rem',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              padding: '0.875rem 1.25rem',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid rgba(184,134,11,0.15)',
              minWidth: '170px',
            }}
          >
            <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>🙏</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>Ore comigo</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Envie sua intenção</div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
        aria-hidden="true"
      >
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Explorar</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ width: 1, height: 32, backgroundColor: 'var(--accent-gold)', opacity: 0.5 }} />
      </motion.div>
    </section>
  );
}
