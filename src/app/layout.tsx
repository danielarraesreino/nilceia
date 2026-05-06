import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    template: '%s | Nilceia Eulampio',
    default: 'Nilceia Eulampio — Escritora, Poetisa e Voz Espiritual',
  },
  description:
    'Textos que tocam a alma. Reflexões sobre espiritualidade, cura emocional, contos e justiça social por Nilceia Eulampio.',
  keywords: ['espiritualidade', 'cura emocional', 'poesia', 'reflexões', 'contos', 'Nilceia Eulampio'],
  authors: [{ name: 'Nilceia Eulampio' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Nilceia Eulampio',
    title: 'Nilceia Eulampio — Escritora, Poetisa e Voz Espiritual',
    description: 'Textos que tocam a alma. Reflexões sobre espiritualidade, cura emocional, contos e justiça social.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nilceia Eulampio — Escritora e Poetisa',
    description: 'Textos que tocam a alma.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
