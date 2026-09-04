# Nilceia — Site Pessoal / Blog (Nilceia Eulampio)

## Identificação
- Tipo: Landing page / site pessoal de cliente (White-label não aplicável — é um projeto autoral único, não um template reutilizável para outros clientes)
- Stack técnica: Next.js 16 (App Router) + React 19 + TypeScript, Tailwind CSS v4, Framer Motion, Sanity CMS (headless, com Studio embutido em `/studio`), NextAuth v4 (Google/Facebook), Resend (e-mail/newsletter), Jest + React Testing Library, deploy via Vercel
- Última modificação relevante: 23/06/2026 (commit `24feea4` — "feat(studio): ativa media library e enriquece editor de postagens")

## Status
- Maturidade: funcional (em produção na Vercel, com histórico de commits ativo e roadmap documentado em AGENTS.md)
- Tem autenticação? Parcial — NextAuth configurado com Google e Facebook, usado para o sistema de comentários do blog e para login de admin (`/admin/login`); não há controle de papéis/permissões granular além de um `ADMIN_TOKEN`
- Tem billing/pagamento? Não diretamente — a "loja" (`/loja`) é um catálogo de produtos (e-books, planners, cursos) que redireciona via `checkoutUrl` para plataformas externas (Hotmart, Kiwify etc.); a página `/apoie` recebe doações via chave PIX estática, sem gateway de pagamento integrado
- Tem multi-tenancy? Não aplicável — projeto de conteúdo único para uma única autora/cliente
- Tem testes? Parcial — Jest configurado, mas cobertura concentrada apenas no módulo de agendamento (`__tests__/agenda/*`), newsletter e alguns componentes/utils; o próprio AGENTS.md registra "cobertura baixa" como pendência
- Tem documentação de deploy? Não — README.md é o boilerplate padrão do `create-next-app` (sem instruções específicas de deploy do projeto); há workflow de CI em `.github/workflows/ci.yml` e menção a deploy automático via Vercel (branch main) no AGENTS.md, mas sem runbook formal

## Resumo funcional
Site institucional/blog pessoal de Nilceia Eulampio (escritora, poetisa e comunicadora espiritual), construído em Next.js com CMS Sanity para gerenciar posts de blog, produtos de uma "loja" (e-books, planners, cursos vendidos em plataformas externas), intenções/orações e um sistema de agendamento de sessões. Inclui newsletter via Resend, comentários autenticados via NextAuth (Google/Facebook), painel administrativo simples e uma página de apoio/doação via PIX. O projeto migrou conteúdo de um blog antigo do Blogspot (há um script `migrate-blogspot.ts` e um XML de exportação de 2.2MB na raiz).

## Gaps para empacotamento comercial
- Sem branding configurável: cores, tipografia e textos estão hardcoded para a identidade da Nilceia (paleta, fontes Playfair/Lato, tom "poético"), não há camada de white-label/tema por cliente
- README genérico do `create-next-app` — falta documentação real de setup, variáveis de ambiente, arquitetura e deploy voltada a terceiros
- Sem onboarding/admin self-service: o painel `/admin` é mínimo (agenda + login), sem gestão de conteúdo fora do Sanity Studio
- Sem pagamento integrado de verdade — depende 100% de links externos (Hotmart/Kiwify) e PIX manual, o que limita reuso como produto SaaS
- Cobertura de testes baixa e concentrada em um único módulo (agenda); risco alto para regressões em blog, loja e comentários
- Segredos de auth com fallback inseguro em código (`lib/auth.ts` usa `"placeholder_..."` e `"fallback_secret_for_development"` como default quando env vars faltam) — problema de segurança se for reaproveitado sem revisão
- Arquivos de artefatos/ferramentas de desenvolvimento (`.claude-flow/`, `.swarm/`, `ruvector.db`, `tsconfig.tsbuildinfo`, `coverage/`) presentes na raiz do repo, sugerindo necessidade de limpeza antes de qualquer entrega/handoff
- Sem testes de acessibilidade automatizados apesar de ser pilar declarado (auditoria com axe-core listada como pendência no roadmap)

## Análise comercial (estimativa)
- Modelo de venda sugerido: licença white-label + manutenção anual (tem CMS via Sanity, auth, mais complexo que landing estática)
- Público comprador provável: profissionais liberais/pequenos negócios que precisam de site com CMS e agenda
- Faixa de preço sugerida (BRL): R$2.000-5.000 setup + R$100-200/mês manutenção
- Esforço estimado até venda-ready: médio — corrigir fallback de secrets inseguro em auth.ts, limpar artefatos dev do repo

## Observações
- Dependências externas de terceiros: Sanity.io (CMS/hosting de conteúdo), Resend (envio de e-mail/newsletter), Google e Facebook OAuth (login), Vercel (hospedagem/analytics), plataformas de checkout externas (Hotmart/Kiwify, referenciadas no schema `product.checkoutUrl`), chave PIX estática para doações
- Repositório GitHub referenciado em AGENTS.md: `danielarraesreino/nilceia`; deploy de produção em `https://nilceia.vercel.app`
- O projeto documenta um sistema interno de "agentes especializados" (AGENTS.md) simulando papéis de equipe (design, arquitetura, SEO, testes, deploy) como guia de desenvolvimento com Claude — não é infraestrutura de produto, é apenas convenção de trabalho documentada
- Pasta `.next/` (build) e artefatos de ferramentas (`.claude-flow`, `.swarm`, `ruvector.db`) foram ignorados/desconsiderados nesta análise por não serem código-fonte
