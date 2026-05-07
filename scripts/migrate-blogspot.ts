/**
 * scripts/migrate-blogspot.ts
 *
 * Migração de posts do Blogger/Blogspot para o Sanity CMS.
 * Converte HTML do Blogger para Portable Text nativamente (sem deps extras).
 *
 * Uso:
 *   # Preview sem gravar (recomendado na primeira vez):
 *   npx ts-node --project tsconfig.scripts.json scripts/migrate-blogspot.ts --dry-run
 *
 *   # Migração real:
 *   npx ts-node --project tsconfig.scripts.json scripts/migrate-blogspot.ts
 *
 * Pré-requisitos:
 *   1. Exporte seu blog em: Configurações do Blogger → Gerenciar blog → Fazer backup do conteúdo
 *   2. Salve o arquivo como `blogger-export.xml` na raiz do projeto
 *   3. Certifique-se que SANITY_WRITE_TOKEN e NEXT_PUBLIC_SANITY_PROJECT_ID estão no .env.local
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createClient, type SanityClient } from '@sanity/client';
import { XMLParser } from 'fast-xml-parser';
import * as dotenv from 'dotenv';

// ─── Carregar variáveis de ambiente ──────────────────────────────────────────
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

// ─── Flags de execução ────────────────────────────────────────────────────────
const DRY_RUN = process.argv.includes('--dry-run');
const LIMIT = (() => {
  const idx = process.argv.indexOf('--limit');
  if (idx !== -1 && process.argv[idx + 1]) return parseInt(process.argv[idx + 1], 10);
  return Infinity;
})();
const XML_PATH = resolve(process.cwd(), 'blogger-export.xml');

// ─── Tipos estritos (sem `any`) ───────────────────────────────────────────────

type PostCategory =
  | 'Espiritualidade'
  | 'Cura Emocional'
  | 'Contos'
  | 'Justiça Social'
  | 'Assédio Moral'
  | 'Mulheres - Lutas Sociais'
  | 'Poesia'
  | 'Reflexões';

interface BloggerCategory {
  '@_scheme': string;
  '@_term': string;
}

interface BloggerLink {
  '@_rel': string;
  '@_type'?: string;
  '@_href': string;
}

interface BloggerEntry {
  id: string;
  published: string;
  updated: string;
  title: string | { '#text': string };
  content: string | { '#text': string };
  category: BloggerCategory | BloggerCategory[];
  link: BloggerLink | BloggerLink[];
}

interface BloggerFeed {
  feed: {
    entry: BloggerEntry[];
  };
}

// Tipos Portable Text compatíveis com Sanity v5
interface PortableTextSpan {
  _type: 'span';
  _key: string;
  text: string;
  marks: string[];
}

interface PortableTextMarkDef {
  _key: string;
  _type: 'link';
  href: string;
}

interface PortableTextBlock {
  _type: 'block';
  _key: string;
  style: 'normal' | 'h2' | 'h3' | 'h4' | 'blockquote';
  markDefs: PortableTextMarkDef[];
  children: PortableTextSpan[];
}

interface SanityPostDraft {
  _type: 'post';
  _id: string;
  title: string;
  slug: { _type: 'slug'; current: string };
  excerpt: string;
  category: PostCategory;
  publishedAt: string;
  readingTime: number;
  body: PortableTextBlock[];
}

interface MigrationResult {
  title: string;
  slug: string;
  status: 'created' | 'skipped' | 'error';
  reason?: string;
}

// ─── Mapeamento de categorias Blogger → Sanity ───────────────────────────────
const CATEGORY_MAP: Record<string, PostCategory> = {
  espiritualidade: 'Espiritualidade',
  espiritual: 'Espiritualidade',
  fé: 'Espiritualidade',
  fe: 'Espiritualidade',
  oração: 'Espiritualidade',
  oracao: 'Espiritualidade',
  'cura emocional': 'Cura Emocional',
  emocional: 'Cura Emocional',
  autoconhecimento: 'Cura Emocional',
  'saúde mental': 'Cura Emocional',
  'saude mental': 'Cura Emocional',
  terapia: 'Cura Emocional',
  luto: 'Cura Emocional',
  trauma: 'Cura Emocional',
  contos: 'Contos',
  conto: 'Contos',
  crônica: 'Contos',
  cronica: 'Contos',
  ficção: 'Contos',
  ficcao: 'Contos',
  história: 'Contos',
  historia: 'Contos',
  'justiça social': 'Justiça Social',
  'justica social': 'Justiça Social',
  direitos: 'Justiça Social',
  racismo: 'Justiça Social',
  desigualdade: 'Justiça Social',
  'assédio moral': 'Assédio Moral',
  'assedio moral': 'Assédio Moral',
  assédio: 'Assédio Moral',
  assedio: 'Assédio Moral',
  mulheres: 'Mulheres - Lutas Sociais',
  feminismo: 'Mulheres - Lutas Sociais',
  'lutas sociais': 'Mulheres - Lutas Sociais',
  gênero: 'Mulheres - Lutas Sociais',
  genero: 'Mulheres - Lutas Sociais',
  poesia: 'Poesia',
  poema: 'Poesia',
  verso: 'Poesia',
  versos: 'Poesia',
  poemas: 'Poesia',
  reflexões: 'Reflexões',
  reflexoes: 'Reflexões',
  reflexão: 'Reflexões',
  reflexao: 'Reflexões',
  pensamentos: 'Reflexões',
};

const DEFAULT_CATEGORY: PostCategory = 'Reflexões';

// ─── Utilitários ─────────────────────────────────────────────────────────────

let keyCounter = 0;
function nextKey(prefix: string): string {
  return `${prefix}-${++keyCounter}`;
}

/** Slug seguro: lowercase, sem acentos, hifenizado, máx 96 chars. */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 96);
}

/** Extrai texto puro do HTML (decodifica entidades básicas). */
function htmlToText(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/** Excerpt: primeiros ~160 caracteres de texto limpo. */
function extractExcerpt(html: string, maxLength = 160): string {
  const text = htmlToText(html);
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + '…';
}

/** Estimativa de tempo de leitura (200 palavras/min). */
function estimateReadingTime(html: string): number {
  const wordCount = htmlToText(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

/** Mapeia categorias do Blogger para o enum do Sanity. */
function mapCategory(raw: BloggerCategory | BloggerCategory[]): PostCategory {
  const categories = Array.isArray(raw) ? raw : [raw];
  for (const cat of categories) {
    const term = cat['@_term'];
    if (!term || term.startsWith('http://schemas.google.com/')) continue;
    const key = term.toLowerCase().trim();
    if (CATEGORY_MAP[key]) return CATEGORY_MAP[key];
    // correspondência parcial
    for (const [mapKey, mapVal] of Object.entries(CATEGORY_MAP)) {
      if (key.includes(mapKey) || mapKey.includes(key)) return mapVal;
    }
  }
  return DEFAULT_CATEGORY;
}

/** ID determinístico para idempotência (re-execuções seguras). */
function generateSanityId(bloggerId: string): string {
  const clean = bloggerId.replace(/[^a-zA-Z0-9]/g, '').slice(-24);
  return `blogger-${clean}`;
}

/** Filtra apenas posts publicados (exclui comentários, drafts, templates). */
function isPublishedPost(entry: BloggerEntry): boolean {
  const links = Array.isArray(entry.link) ? entry.link : [entry.link ?? []];
  const hasAlternate = links.some(
    (l) => l['@_rel'] === 'alternate' && l['@_type'] === 'text/html'
  );
  const id = entry.id ?? '';
  const isComment = id.includes('.comment-');
  const isSettings = id.includes('settings') || id.includes('template');
  return hasAlternate && !isComment && !isSettings;
}

/** Extrai string de campos do Blogger que podem ser objeto ou string. */
function extractString(value: string | { '#text': string } | undefined): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value['#text'] ?? '';
}

// ─── Conversor HTML → Portable Text ──────────────────────────────────────────
// Implementação nativa sem dependências externas.
// Suporta: p, h2, h3, h4, blockquote, ul/ol, li, b/strong, i/em, a, br.

interface ParsedNode {
  tag: string;
  attrs: Record<string, string>;
  content: string;
  children: ParsedNode[];
}

/** Limpa o HTML antes de converter (remove scripts, iframes, estilos). */
function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+style="[^"]*"/gi, '')
    .replace(/\s+class="[^"]*"/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<div>/gi, '<p>')
    .replace(/<\/div>/gi, '</p>');
}

/** Extrai o texto interno de uma tag HTML simples. */
function innerText(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

/** Extrai o atributo href de uma tag <a>. */
function extractHref(openTag: string): string {
  const match = /href="([^"]+)"/.exec(openTag);
  return match ? match[1] : '';
}

/** Converte um fragmento HTML inline em PortableTextSpans. */
function parseInline(html: string, markDefs: PortableTextMarkDef[]): PortableTextSpan[] {
  const spans: PortableTextSpan[] = [];

  // Regex para capturar tags inline: <strong>, <b>, <em>, <i>, <a href="...">
  const inlineRe = /(<(strong|b|em|i|a)([^>]*)>([\s\S]*?)<\/\2>)|([^<]+)/gi;
  let match: RegExpExecArray | null;

  while ((match = inlineRe.exec(html)) !== null) {
    if (match[5] !== undefined) {
      // Texto puro
      const text = match[5]
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"');
      if (text) {
        spans.push({ _type: 'span', _key: nextKey('span'), text, marks: [] });
      }
    } else if (match[2]) {
      const tag = match[2].toLowerCase();
      const attrs = match[3] ?? '';
      const inner = match[4] ?? '';
      const marks: string[] = [];

      if (tag === 'strong' || tag === 'b') marks.push('strong');
      if (tag === 'em' || tag === 'i') marks.push('em');

      if (tag === 'a') {
        const href = extractHref(`<a${attrs}>`);
        if (href) {
          const markKey = nextKey('link');
          markDefs.push({ _key: markKey, _type: 'link', href });
          marks.push(markKey);
        }
      }

      const text = innerText(inner)
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&');

      if (text) {
        spans.push({ _type: 'span', _key: nextKey('span'), text, marks });
      }
    }
  }

  return spans.length > 0 ? spans : [
    { _type: 'span', _key: nextKey('span'), text: innerText(html), marks: [] },
  ];
}

/** Converte HTML completo em blocos Portable Text. */
function htmlToPortableText(rawHtml: string): PortableTextBlock[] {
  const html = sanitizeHtml(rawHtml);
  const blocks: PortableTextBlock[] = [];

  // Captura tags de bloco e texto entre elas
  const blockRe = /<(h[2-4]|blockquote|p|li)([^>]*)>([\s\S]*?)<\/\1>|([^<\n]+)/gi;
  let match: RegExpExecArray | null;

  while ((match = blockRe.exec(html)) !== null) {
    if (match[4] !== undefined) {
      // Texto solto (fora de tags) → parágrafo
      const text = match[4].replace(/\s+/g, ' ').trim();
      if (!text) continue;
      blocks.push({
        _type: 'block',
        _key: nextKey('block'),
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: nextKey('span'), text, marks: [] }],
      });
      continue;
    }

    const tag = (match[1] ?? '').toLowerCase();
    const inner = match[3] ?? '';

    if (!inner.replace(/<[^>]+>/g, '').trim()) continue; // ignora blocos vazios

    const markDefs: PortableTextMarkDef[] = [];
    const children = parseInline(inner, markDefs);

    let style: PortableTextBlock['style'] = 'normal';
    if (tag === 'h2') style = 'h2';
    else if (tag === 'h3') style = 'h3';
    else if (tag === 'h4') style = 'h4';
    else if (tag === 'blockquote') style = 'blockquote';

    blocks.push({
      _type: 'block',
      _key: nextKey('block'),
      style,
      markDefs,
      children,
    });
  }

  // Garante pelo menos um bloco vazio se não gerou nada
  if (blocks.length === 0) {
    const text = htmlToText(rawHtml);
    blocks.push({
      _type: 'block',
      _key: nextKey('block'),
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: nextKey('span'), text: text || '(conteúdo não convertido)', marks: [] }],
    });
  }

  return blocks;
}

// ─── Log colorido ─────────────────────────────────────────────────────────────
const log = {
  info: (msg: string) => process.stdout.write(`\x1b[36m[INFO]\x1b[0m ${msg}\n`),
  success: (msg: string) => process.stdout.write(`\x1b[32m[OK]\x1b[0m ${msg}\n`),
  warn: (msg: string) => process.stdout.write(`\x1b[33m[AVISO]\x1b[0m ${msg}\n`),
  error: (msg: string) => process.stdout.write(`\x1b[31m[ERRO]\x1b[0m ${msg}\n`),
  dry: (msg: string) => process.stdout.write(`\x1b[35m[DRY-RUN]\x1b[0m ${msg}\n`),
};

// ─── Migração principal ───────────────────────────────────────────────────────
async function migrate(): Promise<void> {
  // Validar ambiente
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
  const token = process.env.SANITY_WRITE_TOKEN;

  if (!projectId) {
    log.error('NEXT_PUBLIC_SANITY_PROJECT_ID não definido no .env.local');
    process.exit(1);
  }
  if (!token && !DRY_RUN) {
    log.error('SANITY_WRITE_TOKEN não definido no .env.local');
    log.error('Gere um token em: sanity.io/manage → projeto → API → Tokens');
    process.exit(1);
  }

  const client: SanityClient = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    token: token ?? 'dry-run-no-token',
    useCdn: false,
  });

  // Ler XML
  log.info(`Lendo: ${XML_PATH}`);
  let xmlContent: string;
  try {
    xmlContent = readFileSync(XML_PATH, 'utf-8');
  } catch {
    log.error(`Arquivo não encontrado: ${XML_PATH}`);
    log.error('Exporte em: Configurações do Blogger → Gerenciar blog → Fazer backup do conteúdo');
    process.exit(1);
  }

  // Parsear XML
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    isArray: (name) => ['entry', 'link', 'category'].includes(name),
    textNodeName: '#text',
  });

  let feed: BloggerFeed;
  try {
    feed = parser.parse(xmlContent) as BloggerFeed;
  } catch (err) {
    log.error(`Falha ao parsear XML: ${String(err)}`);
    process.exit(1);
  }

  const allEntries = feed?.feed?.entry ?? [];
  log.info(`Entries no XML: ${allEntries.length}`);

  // Filtrar posts publicados
  const posts = allEntries.filter(isPublishedPost).slice(0, LIMIT);
  log.info(`Posts publicados: ${posts.length}${LIMIT < Infinity ? ` (limitado a ${LIMIT})` : ''}`);

  if (posts.length === 0) {
    log.warn('Nenhum post encontrado. Verifique o arquivo XML.');
    process.exit(0);
  }

  if (DRY_RUN) {
    log.dry('Modo DRY-RUN — nenhum dado será gravado.\n');
  }

  // Processar posts
  const results: MigrationResult[] = [];
  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const [index, entry] of posts.entries()) {
    const pfx = `[${index + 1}/${posts.length}]`;

    const title = extractString(entry.title);
    const html = extractString(entry.content);
    const slug = generateSlug(title);

    log.info(`${pfx} "${title}"`);

    if (!title.trim()) {
      log.warn(`${pfx} Ignorado: título vazio`);
      results.push({ title: '(sem título)', slug, status: 'skipped', reason: 'título vazio' });
      skipped++;
      continue;
    }

    if (!html.trim()) {
      log.warn(`${pfx} Ignorado: conteúdo vazio`);
      results.push({ title, slug, status: 'skipped', reason: 'conteúdo vazio' });
      skipped++;
      continue;
    }

    const doc: SanityPostDraft = {
      _type: 'post',
      _id: generateSanityId(entry.id ?? `index-${index}`),
      title,
      slug: { _type: 'slug', current: slug },
      excerpt: extractExcerpt(html),
      category: mapCategory(entry.category ?? []),
      publishedAt: entry.published ?? new Date().toISOString(),
      readingTime: estimateReadingTime(html),
      body: htmlToPortableText(html),
    };

    if (DRY_RUN) {
      log.dry(`${pfx} Documento:`);
      log.dry(`  _id:         ${doc._id}`);
      log.dry(`  slug:        ${doc.slug.current}`);
      log.dry(`  category:    ${doc.category}`);
      log.dry(`  publishedAt: ${doc.publishedAt}`);
      log.dry(`  readingTime: ${doc.readingTime} min`);
      log.dry(`  body blocks: ${doc.body.length}`);
      log.dry(`  excerpt:     ${doc.excerpt.slice(0, 70)}…\n`);
      results.push({ title, slug, status: 'created' });
      created++;
      continue;
    }

    try {
      await client.createOrReplace(doc);
      log.success(`${pfx} Criado: /blog/${slug}`);
      results.push({ title, slug, status: 'created' });
      created++;
      // Rate limiting gentil para a API do Sanity
      await new Promise((r) => setTimeout(r, 200));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      log.error(`${pfx} Falha: ${msg}`);
      results.push({ title, slug, status: 'error', reason: msg });
      errors++;
    }
  }

  // Relatório final
  const div = '─'.repeat(60);
  process.stdout.write(`\n${div}\n`);
  process.stdout.write('\x1b[1mRELATÓRIO DE MIGRAÇÃO\x1b[0m\n');
  process.stdout.write(`${div}\n`);
  process.stdout.write(`Posts processados : ${posts.length}\n`);
  process.stdout.write(`✅ Criados        : ${created}\n`);
  process.stdout.write(`⏭️  Ignorados      : ${skipped}\n`);
  process.stdout.write(`❌ Erros          : ${errors}\n`);

  if (errors > 0) {
    process.stdout.write('\n\x1b[31mPosts com erro:\x1b[0m\n');
    results
      .filter((r) => r.status === 'error')
      .forEach((r) => process.stdout.write(`  • ${r.title}: ${r.reason ?? ''}\n`));
  }

  if (DRY_RUN) {
    process.stdout.write('\n\x1b[35m[DRY-RUN]\x1b[0m Nenhum dado foi gravado.\n');
    process.stdout.write('Execute sem --dry-run para a migração real.\n');
  } else if (created > 0) {
    process.stdout.write('\n\x1b[32mMigração concluída!\x1b[0m\n');
    process.stdout.write('Próximos passos:\n');
    process.stdout.write('  [ ] Revisar categorias no Sanity Studio (/studio)\n');
    process.stdout.write('  [ ] Adicionar imagens de capa manualmente\n');
    process.stdout.write('  [ ] Revisar excerpts (máx 200 chars para o Google)\n');
    process.stdout.write('  [ ] Vincular o Autor "Nilceia Eulampio" em cada post\n');
    process.stdout.write('  [ ] Verificar slugs únicos (sem duplicatas)\n');
  }

  process.stdout.write(`${div}\n\n`);
  if (errors > 0) process.exit(1);
}

migrate().catch((err: unknown) => {
  log.error(`Erro fatal: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
