'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * O Danadinho do Design — Bottom Navigation Mobile
 * 
 * Por que bottom nav e não só o hamburger menu?
 * - O polegar humano alcança naturalmente a parte inferior da tela
 * - Os 4 destinos mais importantes ficam a 1 toque de distância
 * - Experiência comparável a apps nativos (Instagram, YouTube)
 * - Complementa (não substitui) o menu hamburger com todas as páginas
 * 
 * Touch target mínimo: 48×48px — regra de ouro de acessibilidade mobile
 */

const bottomNavItems = [
  { href: '/',         label: 'Início',  icon: '🏠' },
  { href: '/blog',     label: 'Blog',    icon: '📖' },
  { href: '/agenda',   label: 'Agendar', icon: '🗓️' },
  { href: '/intencoes',label: 'Orar',    icon: '🙏' },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  // Não exibir no Sanity Studio embutido
  if (pathname.startsWith('/studio')) return null;
  // Não exibir no admin
  if (pathname.startsWith('/admin')) return null;

  return (
    <nav
      aria-label="Navegação rápida mobile"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 45,
        backgroundColor: 'rgba(253,249,243,0.97)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(184,134,11,0.15)',
        boxShadow: '0 -4px 16px rgba(44,36,27,0.08)',
        /* Garante que o nav não sobe em cima do conteúdo no iOS */
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
      className="flex md:hidden"
    >
      <ul
        style={{
          display: 'flex',
          width: '100%',
          margin: 0,
          padding: 0,
          listStyle: 'none',
        }}
      >
        {bottomNavItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <li key={item.href} style={{ flex: 1 }}>
              <Link
                href={item.href}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  /* Mínimo 48px de altura — golden rule de touch target */
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.2rem',
                  paddingTop: '0.625rem',
                  paddingBottom: '0.625rem',
                  minHeight: '56px',
                  position: 'relative',
                  transition: 'opacity 0.15s ease',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                {/* Indicator bar when active */}
                {isActive && (
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '20%',
                      right: '20%',
                      height: '2px',
                      backgroundColor: 'var(--accent-gold)',
                      borderRadius: '0 0 2px 2px',
                    }}
                  />
                )}

                <span
                  aria-hidden="true"
                  style={{
                    fontSize: '1.375rem',
                    lineHeight: 1,
                    filter: isActive ? 'none' : 'grayscale(40%) opacity(0.65)',
                    transition: 'filter 0.15s ease',
                  }}
                >
                  {item.icon}
                </span>

                <span
                  style={{
                    fontSize: '0.625rem',
                    fontFamily: 'var(--font-body)',
                    fontWeight: isActive ? 700 : 400,
                    color: isActive ? 'var(--accent-gold)' : 'var(--text-muted)',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    transition: 'color 0.15s ease',
                    lineHeight: 1,
                  }}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
