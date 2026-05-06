# 📜 AGENTS.md — Projeto Nilceia Eulampio

## 🎯 MISSÃO
Desenvolver e manter o site pessoal de Nilceia Eulampio: escritora, poetisa e comunicadora espiritual.
O site prioriza **performance**, **acessibilidade (WCAG AA)**, **SEO** e uma **estética literária e poética**.

---

## 🛠️ STACK OBRIGATÓRIA

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 15+ (App Router, TypeScript) |
| Styling | Tailwind CSS v4 + CSS Variables customizadas (`globals.css`) |
| Animações | Framer Motion 11+ |
| CMS | Sanity.io (`@sanity/client`, `next-sanity`) |
| Newsletter | ConvertKit API v3 |
| Validação | Zod |
| Datas | date-fns (locale: `ptBR`) |
| Utilitários | clsx + tailwind-merge via `@/lib/utils.ts` |

---

## 🎨 DESIGN SYSTEM

Paleta de cores definida em `src/app/globals.css` como CSS variables:
- `--bg-main`: `#FDF9F3` (fundo creme)
- `--text-primary`: `#2C241B`
- `--accent-gold`: `#B8860B` (ação principal)
- `--accent-green`: `#6B8E6F` (ação secundária/esperança)

Fontes:
- **Títulos**: Playfair Display (serifada, literária) → `font-family: var(--font-heading)`
- **Corpo**: Lato (sans-serif, leitura) → `font-family: var(--font-body)`
- **Prosa**: classe `.prose-nilceia` para conteúdo de posts

---

## 📐 REGRAS DE CÓDIGO

1. **Nunca use `any`** — use interfaces em `src/types/index.ts`
2. **CSS**: Use CSS variables do design system, não valores hardcoded
3. **Acessibilidade**:
   - Sempre inclua `aria-label`, `alt`, `role` adequados
   - Contraste mínimo WCAG AA (4.5:1 para texto normal)
   - Navegação por teclado em todos os componentes interativos
4. **SEO**:
   - Use `generateMetadata()` em cada página com OG tags e Twitter cards
   - Semântica HTML correta: um `<h1>` por página, `<article>`, `<section>`, `<nav>`
5. **Imagens**: Use `next/image` para imagens do Sanity, com domínio configurado em `next.config.ts`
6. **Formulários**: Sempre valide com Zod. Sempre inclua estados: idle/loading/success/error

---

## 🧪 TESTES (Fase futura)

- Jest + React Testing Library
- Cobertura mínima alvo: 80%
- Mock do Sanity client em testes com `jest.mock('@/lib/sanity')`
- Testes de formulário com `userEvent` para simular interação real

---

## 📁 ESTRUTURA DE ARQUIVOS

```
src/
├── app/
│   ├── api/newsletter/route.ts   # ConvertKit API
│   ├── blog/[slug]/page.tsx      # Post individual (SSG + generateMetadata)
│   ├── blog/page.tsx             # Lista com filtros
│   ├── sobre/page.tsx
│   ├── loja/page.tsx
│   ├── intencoes/page.tsx
│   ├── contato/page.tsx
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── layout.tsx                # Root layout + metadata base
│   ├── page.tsx                  # Home
│   └── globals.css               # Design system
├── components/
│   ├── layout/Header.tsx
│   ├── layout/Footer.tsx
│   ├── blog/PostCard.tsx
│   ├── blog/CategoryFilter.tsx
│   ├── blog/ReadingProgress.tsx
│   └── home/HeroSection.tsx, FeaturedPosts.tsx, NewsletterBanner.tsx
├── lib/
│   ├── sanity.ts                 # Client + GROQ queries
│   └── utils.ts                  # cn(), formatDate(), etc.
└── types/index.ts                # Post, Product, Author, etc.
```

---

## 🚫 PROIBIDO

- `console.log` em código de produção
- Valores hardcoded de cores fora das CSS variables
- Componentes acima de 200 linhas (quebre em subcomponentes)
- Inline styles sem justificativa (use CSS variables)
- Chaves de API no código — sempre via `process.env`
- Commits sem a build passando (`npm run build`)

---

## 💡 COMPORTAMENTO DO AGENTE

- Sempre explique o "porquê" antes do "como"
- Sugira melhorias de acessibilidade e SEO proativamente
- Mantenha o **tom poético e acolhedor** da Nilceia nos textos de UI (CTAs, labels, mensagens de erro)
- Use `pt-BR` em todas as strings visíveis ao usuário
- Respeite a paleta e tipografia do design system em qualquer novo componente

---

## 🔗 VARIÁVEIS DE AMBIENTE NECESSÁRIAS

Ver `.env.local.example` na raiz do projeto.

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
CONVERTKIT_API_KEY=
CONVERTKIT_FORM_ID=
NEXT_PUBLIC_BASE_URL=https://nilceia.vercel.app
```
