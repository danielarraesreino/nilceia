import Link from 'next/link';
import FooterNewsletterForm from './FooterNewsletterForm';

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com', icon: '📷' },
  { label: 'WhatsApp', href: 'https://wa.me/5500000000000', icon: '💬' },
  { label: 'YouTube', href: 'https://youtube.com', icon: '🎥' },
];

const footerLinks = [
  { label: 'Política de Privacidade', href: '/privacidade' },
  { label: 'Termos de Uso', href: '/termos' },
  { label: 'Parcerias', href: '/contato' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: 'var(--text-primary)',
        color: '#F5EFE6',
        paddingTop: '4rem',
        paddingBottom: '2rem',
      }}
      aria-label="Rodapé do site"
    >
      <style>{`
        .footer-link { color: rgba(245,239,230,0.85); font-size: 0.875rem; transition: color 0.2s; display: block; padding: 0.25rem 0; min-height: 2rem; }
        .footer-link:hover { color: #FDF9F3; }
        .footer-legal-link { font-size: 0.8125rem; color: rgba(245,239,230,0.7); transition: color 0.2s; padding: 0.25rem 0; display: inline-block; }
        .footer-legal-link:hover { color: rgba(245,239,230,1); }
        /* Touch target mínimo 44px — golden rule mobile */
        .footer-social { display: flex; align-items: center; justify-content: center; width: 2.75rem; height: 2.75rem; min-width: 44px; min-height: 44px; border-radius: 50%; background: rgba(184,134,11,0.25); font-size: 1.125rem; transition: background 0.2s; }
        .footer-social:hover { background: rgba(184,134,11,0.5); }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Newsletter Strip */}
        <div
          style={{
            backgroundColor: 'rgba(184,134,11,0.15)',
            border: '1px solid rgba(184,134,11,0.25)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
            marginBottom: '3rem',
            textAlign: 'center',
          }}
        >
          <h2 className="font-heading" style={{ fontSize: '1.75rem', color: '#FDF9F3', marginBottom: '0.5rem' }}>
            Receba reflexões toda semana 💌
          </h2>
          <p style={{ color: 'rgba(245,239,230,0.85)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
            Junte-se a centenas de leitores que recebem textos que tocam a alma direto no e-mail.
          </p>
          <FooterNewsletterForm />
        </div>

        {/* 3-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>

          {/* Brand */}
          <div>
            <h3 className="font-heading" style={{ fontSize: '1.375rem', color: '#FDF9F3', marginBottom: '0.75rem' }}>
              Nilceia Eulampio
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'rgba(245,239,230,0.85)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Escritora, poetisa e comunicadora espiritual. Palavras que curam, que questionam e que aproximam.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="footer-social"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ fontSize: '0.8125rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: '1rem', fontFamily: 'var(--font-body)' }}>
              Navegar
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {[
                { href: '/blog', label: 'Blog & Reflexões' },
                { href: '/loja', label: 'Livros & Infoprodutos' },
                { href: '/sobre', label: 'Sobre a Nilceia' },
                { href: '/intencoes', label: 'Ore Comigo' },
                { href: '/apoie', label: 'Apoie este trabalho' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="footer-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Frase */}
          <div>
            <h4 style={{ fontSize: '0.8125rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: '1rem', fontFamily: 'var(--font-body)' }}>
              Uma palavra
            </h4>
            <blockquote className="font-heading" style={{ fontSize: '1.0625rem', fontStyle: 'italic', color: 'rgba(245,239,230,0.95)', lineHeight: 1.7, margin: 0 }}>
              &ldquo;As palavras que guardamos dentro de nós também precisam de luz para florescer.&rdquo;
            </blockquote>
            <p style={{ fontSize: '0.8125rem', color: 'var(--accent-gold)', marginTop: '0.75rem' }}>
              — Nilceia Eulampio
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(245,239,230,0.1)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'center' }}>
          <p style={{ fontSize: '0.8125rem', color: 'rgba(245,239,230,0.7)' }}>
            © {currentYear} Nilceia Eulampio. Todos os direitos reservados.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {footerLinks.map((l) => (
              <Link key={l.href} href={l.href} className="footer-legal-link">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
