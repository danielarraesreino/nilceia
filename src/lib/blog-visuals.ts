import type { PostCategory } from '@/types';

const categoryPalette: Record<PostCategory, { start: string; end: string; accent: string; icon: string; label: string }> = {
  'Espiritualidade': { start: '#F5EFE6', end: '#D7C7A5', accent: '#B8860B', icon: '✦', label: 'Espiritualidade' },
  'Cura Emocional': { start: '#F3F8F7', end: '#CFE4DF', accent: '#4A90A4', icon: '♡', label: 'Cura Emocional' },
  Contos: { start: '#FAF2EB', end: '#E6C9A8', accent: '#A46D4E', icon: '❧', label: 'Contos' },
  'Justiça Social': { start: '#EEF8F1', end: '#CFE8D5', accent: '#6B8E6F', icon: '✊', label: 'Justiça Social' },
  Poesia: { start: '#F5F0FA', end: '#DCD3F2', accent: '#7858A9', icon: '✿', label: 'Poesia' },
  Reflexões: { start: '#FDF9F3', end: '#E8DAC0', accent: '#B8860B', icon: '❀', label: 'Reflexões' },
  'Assédio Moral': { start: '#FDF4F1', end: '#ECCDCA', accent: '#B85C4A', icon: '⚑', label: 'Assédio Moral' },
  'Mulheres - Lutas Sociais': { start: '#F9F1F6', end: '#E8D3E4', accent: '#8A2D64', icon: '✧', label: 'Mulheres - Lutas Sociais' },
};

const fallbackPalette = categoryPalette.Reflexões;

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function normalizeTitle(title: string) {
  return title.replace(/\s+/g, ' ').trim();
}

export function getFallbackBlogImage(category: PostCategory | string | undefined, title: string) {
  const resolvedCategory = (category && category in categoryPalette) ? category as PostCategory : 'Reflexões';
  const palette = categoryPalette[resolvedCategory] ?? fallbackPalette;
  const cleanTitle = normalizeTitle(title) || 'Reflexão';
  const shortTitle = cleanTitle.length > 34 ? `${cleanTitle.slice(0, 31).trim()}…` : cleanTitle;
  const safeCategory = escapeXml(palette.label);
  const safeTitle = escapeXml(shortTitle);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${palette.start}"/>
          <stop offset="100%" stop-color="${palette.end}"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="700" rx="28" fill="url(#bg)"/>
      <circle cx="1030" cy="120" r="170" fill="${palette.accent}" opacity="0.12"/>
      <circle cx="160" cy="610" r="220" fill="#FDF9F3" opacity="0.28"/>
      <path d="M90 560C240 430 330 420 420 470C520 525 595 575 700 560C865 537 930 375 1090 360V700H90V560Z" fill="${palette.accent}" opacity="0.16"/>
      <text x="86" y="150" fill="#2C241B" font-family="Georgia, serif" font-size="30" font-weight="700" letter-spacing="5">${palette.icon} ${safeCategory}</text>
      <text x="86" y="365" fill="#2C241B" font-family="Georgia, serif" font-size="64" font-weight="700">${safeTitle}</text>
      <text x="86" y="620" fill="#5D4E3F" font-family="Arial, sans-serif" font-size="24" font-weight="600" letter-spacing="2">NILCEIA EULAMPIO</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
