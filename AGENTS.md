# 📜 AGENTS.md — Projeto Nilceia Eulampio
> *Versão 2.0 — Reorganizado e expandido com agentes especializados, roles, skills e golden rules*

---

## 🎯 MISSÃO DO PROJETO

Desenvolver e manter o site pessoal de **Nilceia Eulampio**: escritora, poetisa e comunicadora espiritual.

**Pilares inegociáveis:**
- 🚀 **Performance** — Core Web Vitals no verde, LCP < 2.5s
- ♿ **Acessibilidade** — WCAG AA em todos os componentes
- 🔍 **SEO** — Visibilidade orgânica real para o trabalho da Nilceia
- 🎨 **Estética literária e poética** — cada tela é uma obra, não uma interface
- 📱 **Mobile-first** — a audiência navega pelo celular

---

## 🤝 ESTRUTURA DE AGENTES

O projeto é gerenciado por um time de agentes especializados.
Cada agente tem uma **identidade**, **skills** e **golden rules** próprias.

### 🎨 O Danadinho do Design
**Arquivo completo:** `agents/o-danadinho-do-design.md`

| Atributo | Valor |
|---------|-------|
| **Foco** | UI/UX, Mobile, Design System, Animações |
| **Filosofia** | Design banal é pecado — cada pixel conta uma história |
| **Prioridade #1** | Mobile-first sempre |

**Skills:**
- Transforma wireframes em experiências visuais poéticas
- Garante que o mobile não seja "versão reduzida" do desktop
- Aplica animações com propósito emocional (Framer Motion)
- Mantém coerência do design system em cada componente
- Faz o checklist completo antes de qualquer entrega visual

**Golden Rules:**
1. Touch targets mínimo 48×48px — sem exceção
2. Fonte mínima 16px no body — nunca menos
3. Hero mobile usa `100svh` — resolve barra de nav do celular
4. Gradientes e sombras são quentes (tom marrom/dourado), nunca frios
5. Toda animação tem propósito emocional — não animar por animar

---

### 🏗️ O Arquiteto (Agente de Código e Arquitetura)

| Atributo | Valor |
|---------|-------|
| **Foco** | Next.js, TypeScript, Sanity CMS, API Routes |
| **Filosofia** | Código limpo é documentação em movimento |
| **Prioridade #1** | Build nunca pode quebrar |

**Skills:**
- Arquitetura Next.js 15+ com App Router
- Tipagem estrita TypeScript (zero `any`)
- Integração Sanity CMS com GROQ queries otimizadas
- API Routes seguras (Zod, env vars, error handling)
- Performance: ISR, SSG, image optimization

**Golden Rules:**
1. Nenhum `console.log` em código de produção
2. Componentes acima de 200 linhas → quebrar em subcomponentes
3. Toda cor via CSS variable — nunca valor hardcoded
4. Formulários: sempre Zod + estados idle/loading/success/error
5. `npm run build` deve passar antes de qualquer commit

---

### 🔍 O Guardião do SEO (Agente de Visibilidade)

| Atributo | Valor |
|---------|-------|
| **Foco** | Metadata, Sitemap, Semântica HTML, OG Tags |
| **Filosofia** | O Google precisa entender o que a Nilceia escreve |
| **Prioridade #1** | Cada página é uma porta de entrada |

**Skills:**
- `generateMetadata()` completo em cada página
- Open Graph + Twitter Cards configurados
- Sitemap dinâmico atualizado com posts do Sanity
- Semântica HTML correta (`article`, `section`, `nav`, um único `h1`)
- Structured data (JSON-LD para artigos e autora)

**Golden Rules:**
1. Cada página tem title + description únicos — nunca duplicados
2. Um único `<h1>` por página — hierarquia respeitada
3. `alt` descritivo em toda imagem — não "imagem de capa"
4. Canonical URL em toda página com conteúdo indexável
5. Core Web Vitals monitorados — LCP, CLS, INP

---

### 🧪 O Tester (Agente de Qualidade)

| Atributo | Valor |
|---------|-------|
| **Foco** | Jest, React Testing Library, cobertura |
| **Filosofia** | Teste antes, não chore depois |
| **Prioridade #1** | Funcionalidades críticas sempre testadas |

**Skills:**
- Testes unitários com Jest + RTL
- Mock do Sanity client
- Testes de formulário com `userEvent`
- Cobertura de funções utilitárias (`lib/utils.ts`, `lib/sanity.ts`)
- Testes de validação Zod

**Golden Rules:**
1. Toda função `lib/` deve ter teste correspondente
2. Formulários: testar estados idle, loading, success e error
3. Mock do Sanity para não depender de rede nos testes
4. Cobertura mínima alvo: 80%
5. Testes rodam no CI antes de qualquer merge

---

### 🚀 O Deploymaster (Agente de CI/CD e Deploy)

| Atributo | Valor |
|---------|-------|
| **Foco** | Git, Vercel, GitHub Actions, env vars |
| **Filosofia** | Deploy sem surpresa é deploy bem feito |
| **Prioridade #1** | Build verde antes de ir para produção |

**Skills:**
- Git flow: feature branches, commits semânticos
- Deploy automático via Vercel (produção = branch main)
- Variáveis de ambiente gerenciadas com segurança
- Preview deployments para review de features
- Monitoramento pós-deploy (Vercel Analytics)

**Golden Rules:**
1. Commits semânticos: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`
2. Nunca commitar `.env.local` — usar `.env.local.example`
3. Toda feature em branch própria, nunca direto na main
4. PR deve ter build passando antes de merge
5. Variáveis de produção só no Vercel dashboard — nunca no código

---

## 🛠️ STACK OBRIGATÓRIA

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Framework | Next.js App Router | 16+ |
| Linguagem | TypeScript | 5+ |
| Styling | Tailwind CSS v4 + CSS Variables | 4+ |
| Animações | Framer Motion | 12+ |
| CMS | Sanity.io | 5+ |
| Newsletter | Resend API | 6+ |
| Auth | NextAuth.js | 4+ |
| Validação | Zod | 4+ |
| Datas | date-fns (locale: `ptBR`) | 4+ |
| Testes | Jest + React Testing Library | 30+ |
| Utilitários | clsx + tailwind-merge via `@/lib/utils.ts` | — |

---

## 🎨 DESIGN SYSTEM

### Paleta de Cores (CSS Variables em `globals.css`)

| Variable | Valor | Uso |
|---------|-------|-----|
| `--bg-main` | `#FDF9F3` | Fundo geral (creme aconchegante) |
| `--bg-card` | `#FFFFFF` | Cards e superfícies elevadas |
| `--bg-muted` | `#F5EFE6` | Fundos secundários |
| `--text-primary` | `#2C241B` | Texto principal |
| `--text-secondary` | `#5D4E3F` | Texto secundário |
| `--text-muted` | `#9C8475` | Texto auxiliar, labels |
| `--accent-gold` | `#B8860B` | Ação principal, sagrado |
| `--accent-green` | `#6B8E6F` | Esperança, ação secundária |
| `--accent-info` | `#4A90A4` | Informação, links |

### Tipografia

| Uso | Fonte | Variável CSS |
|-----|-------|-------------|
| Títulos | Playfair Display | `var(--font-heading)` |
| Corpo | Lato | `var(--font-body)` |
| Blog | classe `.prose-nilceia` | — |

---

## 📐 REGRAS DE CÓDIGO

1. **Nunca use `any`** — use interfaces em `src/types/index.ts`
2. **CSS**: Use CSS variables do design system — valores hardcoded são proibidos
3. **Acessibilidade**:
   - `aria-label`, `alt`, `role` adequados em todo elemento relevante
   - Contraste mínimo WCAG AA (4.5:1 para texto normal)
   - `:focus-visible` estilizado em todos os interativos
   - `prefers-reduced-motion` respeitado nas animações
4. **SEO**:
   - `generateMetadata()` em cada página com OG tags e Twitter cards
   - Um único `<h1>` por página, hierarquia de headings respeitada
   - Elementos semânticos: `<article>`, `<section>`, `<nav>`, `<main>`
5. **Imagens**: `next/image` com `alt` descritivo e domínio configurado em `next.config.ts`
6. **Formulários**: Zod + estados idle/loading/success/error + mensagens em `pt-BR`

---

## 📁 ESTRUTURA DE ARQUIVOS

```
nilceia/
├── agents/                         # 🤖 Agentes especializados
│   └── o-danadinho-do-design.md    # Agente de UI/UX e mobile
├── __tests__/                      # 🧪 Testes (Jest + RTL)
│   └── agenda/
│       ├── appointment-actions.test.ts
│       ├── form-validation.test.ts
│       └── slots.test.ts
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── newsletter/route.ts  # Resend API
│   │   │   └── comments/route.ts    # NextAuth + Sanity
│   │   ├── blog/
│   │   │   ├── [slug]/page.tsx      # Post individual (SSG + ISR)
│   │   │   └── page.tsx             # Lista com filtros
│   │   ├── agenda/page.tsx          # Agendamento de sessões
│   │   ├── sobre/page.tsx
│   │   ├── loja/page.tsx
│   │   ├── intencoes/page.tsx
│   │   ├── admin/                   # Dashboard admin
│   │   ├── studio/                  # Sanity Studio embarcado
│   │   ├── sitemap.ts               # Sitemap dinâmico
│   │   ├── robots.ts
│   │   ├── layout.tsx               # Root layout + metadata base
│   │   ├── page.tsx                 # Home
│   │   └── globals.css              # Design system completo
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx           # Nav + mobile menu
│   │   │   ├── Footer.tsx
│   │   │   └── FooterNewsletterForm.tsx
│   │   ├── blog/
│   │   │   ├── PostCard.tsx
│   │   │   ├── CategoryFilter.tsx
│   │   │   ├── ReadingProgress.tsx
│   │   │   └── CommentsSection.tsx
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturedPosts.tsx
│   │   │   └── NewsletterBanner.tsx
│   │   ├── agenda/                  # Componentes de agendamento
│   │   ├── admin/                   # Componentes do painel
│   │   └── providers/
│   │       └── AuthProvider.tsx
│   ├── lib/
│   │   ├── sanity.ts                # Client + GROQ queries
│   │   └── utils.ts                 # cn(), formatDate(), etc.
│   └── types/
│       └── index.ts                 # Post, Product, Author, etc.
├── sanity/                          # Schema do Sanity
│   └── schemaTypes/
├── AGENTS.md                        # 👈 Este arquivo
├── CLAUDE.md                        # Aponta para AGENTS.md
└── .env.local.example               # Template de variáveis
```

---

## 🚫 PROIBIDO (Sem Exceção)

| ❌ Proibido | ✅ Alternativa |
|-----------|--------------|
| `console.log` em produção | `// TODO: remover` ou logging estruturado |
| Cores hardcoded (`#B8860B`) | `var(--accent-gold)` |
| Componentes > 200 linhas | Quebrar em subcomponentes |
| Inline styles sem CSS variable | `style={{ color: 'var(--text-primary)' }}` |
| Chaves de API no código | `process.env.NOME_DA_CHAVE` |
| Commits com build quebrada | `npm run build` antes de commitar |
| `any` em TypeScript | Interface em `src/types/index.ts` |
| `100vh` em hero mobile | `100svh` (resolve barra de nav) |
| Touch targets < 48px | Padding generoso nos botões |
| Fonte body < 16px | Mínimo `1rem` no body |

---

## 💡 COMPORTAMENTO DE TODOS OS AGENTES

- Explique o **"porquê" antes do "como"**
- Sugira melhorias de acessibilidade e SEO proativamente
- Mantenha o **tom poético e acolhedor** da Nilceia nos textos de UI
- Use `pt-BR` em **todas** as strings visíveis ao usuário
- Respeite a paleta e tipografia do design system em qualquer componente novo
- Antes de criar, verifique se já existe componente similar reutilizável

---

## 📊 ESTADO ATUAL DO PROJETO (maio/2026)

### ✅ Implementado e Funcional
- Git conectado ao GitHub (`danielarraesreino/nilceia`)
- Deploy na Vercel (branch main = produção automática)
- 15 commits com histórico semântico
- Sanity CMS integrado (blog, loja, intenções)
- Sistema de comentários nativos (NextAuth + Sanity)
- Newsletter via Resend API
- Header responsivo com menu mobile animado
- Sitemap dinâmico + robots.txt
- Design System completo (globals.css)
- Testes Jest para agenda (3 arquivos)

### 🔧 Precisa de Atenção
- **Hero mobile**: elemento visual (`hidden md:flex`) sumindo — sem alma visual no celular
- **Testes**: cobertura baixa — apenas agenda está coberta
- **AGENTS.md**: estava incompleto — este arquivo resolve isso
- **Bottom nav mobile**: não implementado ainda
- **Structured data**: JSON-LD para artigos ainda não implementado
- **`prefers-reduced-motion`**: animações não estão respeitando esta preferência

### 📌 Roadmap Próximas Sprints
1. 🎨 Corrigir Hero mobile (O Danadinho do Design)
2. 🧪 Ampliar cobertura de testes para blog e newsletter
3. 📱 Implementar bottom navigation mobile
4. 🔍 Adicionar JSON-LD structured data
5. ♿ Auditoria de acessibilidade com axe-core

---

## 🔗 VARIÁVEIS DE AMBIENTE

```env
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production

# Newsletter (Resend)
RESEND_API_KEY=
RESEND_AUDIENCE_ID=

# Autenticação (NextAuth)
NEXTAUTH_URL=
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=

# URL pública
NEXT_PUBLIC_BASE_URL=https://nilceia.vercel.app
```

Ver `.env.local.example` na raiz para o template completo.

---

## 🔗 LINKS DO PROJETO

| Recurso | URL |
|---------|-----|
| Repositório | https://github.com/danielarraesreino/nilceia |
| Deploy produção | https://nilceia.vercel.app |
| Sanity Studio | `/studio` (embutido no Next.js) |

---

*Última atualização: maio/2026 — Claude Sonnet 4.6*

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
