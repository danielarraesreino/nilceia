'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
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
          <nav aria-label="Navegação principal" className="hidden md:flex items-center gap-1">
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
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  (e.target as HTMLAnchorElement).style.color = 'var(--accent-gold)';
                  (e.target as HTMLAnchorElement).style.backgroundColor = 'rgba(184,134,11,0.08)';
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
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
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { (e.target as HTMLAnchorElement).style.backgroundColor = 'var(--accent-gold-light)'; (e.target as HTMLAnchorElement).style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { (e.target as HTMLAnchorElement).style.backgroundColor = 'var(--accent-gold)'; (e.target as HTMLAnchorElement).style.transform = 'translateY(0)'; }}
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
            className="flex md:hidden flex-col justify-center items-center gap-[6px] w-10 h-10 rounded-full hover:bg-gold/5 transition-colors z-[60]"
          >
            <motion.span 
              animate={{ 
                rotate: menuOpen ? 45 : 0, 
                y: menuOpen ? 8 : 0 
              }} 
              style={{ display: 'block', width: 22, height: 2, backgroundColor: 'var(--text-primary)', borderRadius: 2 }} 
            />
            <motion.span 
              animate={{ 
                opacity: menuOpen ? 0 : 1, 
                x: menuOpen ? -10 : 0 
              }} 
              style={{ display: 'block', width: 22, height: 2, backgroundColor: 'var(--text-primary)', borderRadius: 2 }} 
            />
            <motion.span 
              animate={{ 
                rotate: menuOpen ? -45 : 0, 
                y: menuOpen ? -8 : 0 
              }} 
              style={{ display: 'block', width: 22, height: 2, backgroundColor: 'var(--text-primary)', borderRadius: 2 }} 
            />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 40,
                backgroundColor: 'rgba(44,36,27,0.4)',
                backdropFilter: 'blur(4px)',
              }}
            />
            
            <motion.div
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navegação"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '85%',
                maxWidth: '320px',
                zIndex: 55,
                backgroundColor: 'var(--bg-main)',
                boxShadow: '-4px 0 24px rgba(44,36,27,0.15)',
                padding: '5rem 1.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                overflowY: 'auto',
              }}
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + (i * 0.05) }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'block',
                      padding: '0.875rem 0',
                      borderBottom: '1px solid rgba(184,134,11,0.08)',
                      fontSize: '1.125rem',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.4 }}
                style={{ marginTop: 'auto', paddingTop: '2rem' }}
              >
                <Link
                  href="/apoie"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'block',
                    padding: '1rem',
                    backgroundColor: 'var(--accent-gold)',
                    color: '#fff',
                    borderRadius: 'var(--radius-sm)',
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: '0.9375rem',
                    fontFamily: 'var(--font-body)',
                    boxShadow: '0 4px 12px rgba(184,134,11,0.2)',
                  }}
                >
                  💛 Apoie este trabalho
                </Link>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
