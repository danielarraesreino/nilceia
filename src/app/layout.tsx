import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';
import AuthProvider from '@/components/providers/AuthProvider';
import { Analytics } from '@vercel/analytics/react';

const getCleanBaseUrl = () => {
  const rawUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://nilceia.vercel.app';
  const cleanUrl = rawUrl.split('\n').find(line => line.trim().startsWith('http')) || 'https://nilceia.vercel.app';
  return cleanUrl.trim();
};

export const metadata: Metadata = {
  metadataBase: new URL(getCleanBaseUrl()),
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
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Nilceia Eulampio — Escritora e Poetisa',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nilceia Eulampio — Escritora e Poetisa',
    description: 'Textos que tocam a alma.',
    images: ['/og-default.png'],
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
        <AuthProvider>
          <Header />
          {/* pb-16 md:pb-0 — espaço para o BottomNav no mobile (56px + margem) */}
          <main id="main-content" className="pb-16 md:pb-0">{children}</main>
          <Footer />
          <BottomNav />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
