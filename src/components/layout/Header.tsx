'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/',          label: 'Início' },
  { href: '/blog',      label: 'Blog' },
  { href: '/loja',      label: 'Livros & Infoprodutos' },
  { href: '/agenda',    label: 'Agendar Sessão' },
  { href: '/sobre',     label: 'Sobre' },
  { href: '/intencoes', label: 'Ore Comigo' },
  { href: '/contato',   label: 'Contato' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: 'all 0.3s ease',
          backgroundColor: isScrolled ? 'rgba(253,249,243,0.95)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(12px)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(184,134,11,0.15)' : '1px solid transparent',
          boxShadow: isScrolled ? 'var(--shadow-sm)' : 'none',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4.5rem' }}>

          {/* Logo */}
          <Link href="/" aria-label="Nilceia Eulampio — Página inicial" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span className="font-heading" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Nilceia Eulampio
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 400 }}>
              escritora · poetisa
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="Navegação principal" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            className="hidden md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: '0.5rem 0.875rem',
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  color: 'var(--text-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'all 0.2s ease',
                  fontFamily: 'var(--font-body)',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLAnchorElement).style.color = 'var(--accent-gold)';
                  (e.target as HTMLAnchorElement).style.backgroundColor = 'rgba(184,134,11,0.08)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLAnchorElement).style.color = 'var(--text-secondary)';
                  (e.target as HTMLAnchorElement).style.backgroundColor = 'transparent';
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/apoie"
              id="header-cta-btn"
              style={{
                marginLeft: '0.5rem',
                padding: '0.5rem 1.25rem',
                backgroundColor: 'var(--accent-gold)',
                color: '#fff',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.875rem',
                fontWeight: 700,
                fontFamily: 'var(--font-body)',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(184,134,11,0.3)',
              }}
              onMouseEnter={(e) => { (e.target as HTMLAnchorElement).style.backgroundColor = 'var(--accent-gold-light)'; (e.target as HTMLAnchorElement).style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { (e.target as HTMLAnchorElement).style.backgroundColor = 'var(--accent-gold)'; (e.target as HTMLAnchorElement).style.transform = 'translateY(0)'; }}
            >
              Apoie este trabalho
            </Link>
          </nav>

          {/* Mobile Hamburger */}
          <button
            id="mobile-menu-toggle"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '0.5rem', cursor: 'pointer', background: 'none', border: 'none' }}
            className="md:hidden"
          >
            <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 11 : 0 }} style={{ display: 'block', width: 24, height: 2, backgroundColor: 'var(--text-primary)', borderRadius: 2 }} />
            <motion.span animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }} style={{ display: 'block', width: 24, height: 2, backgroundColor: 'var(--text-primary)', borderRadius: 2 }} />
            <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -11 : 0 }} style={{ display: 'block', width: 24, height: 2, backgroundColor: 'var(--text-primary)', borderRadius: 2 }} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              top: '4.5rem',
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 40,
              backgroundColor: 'var(--bg-main)',
              padding: '2rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              overflowY: 'auto',
            }}
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'block',
                    padding: '1rem 0',
                    borderBottom: '1px solid rgba(184,134,11,0.12)',
                    fontSize: '1.25rem',
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <Link
                href="/apoie"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'block',
                  marginTop: '1.5rem',
                  padding: '1rem',
                  backgroundColor: 'var(--accent-gold)',
                  color: '#fff',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: '1rem',
                  fontFamily: 'var(--font-body)',
                }}
              >
                💛 Apoie este trabalho
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
