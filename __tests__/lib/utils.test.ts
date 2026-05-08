/**
 * 🧪 O Tester — Sprint 2
 * Testes unitários para src/lib/utils.ts
 *
 * Cobre:
 *  - cn(): fusão de classes CSS
 *  - formatDate(): formatação longa em pt-BR
 *  - formatDateShort(): formatação curta em pt-BR
 *  - calculateReadingTime(): cálculo de tempo de leitura
 *  - formatCurrency(): formatação de moeda BRL
 *  - slugify(): conversão de texto em slug URL-safe
 */

import {
  cn,
  formatDate,
  formatDateShort,
  calculateReadingTime,
  formatCurrency,
  slugify,
} from '@/lib/utils';

// ── cn() ────────────────────────────────────────────────────────────────────

describe('cn()', () => {
  it('combina classes simples', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('ignora valores falsy', () => {
    expect(cn('foo', false, undefined, null, 'bar')).toBe('foo bar');
  });

  it('resolve conflitos do tailwind (último vence)', () => {
    // tailwind-merge: p-4 e p-2 — o último deve prevalecer
    expect(cn('p-4', 'p-2')).toBe('p-2');
  });

  it('suporta arrays e objetos condicionais (clsx)', () => {
    expect(cn(['foo', 'bar'], { baz: true, qux: false })).toBe('foo bar baz');
  });

  it('retorna string vazia quando nenhuma classe é passada', () => {
    expect(cn()).toBe('');
  });
});

// ── formatDate() ─────────────────────────────────────────────────────────────

describe('formatDate()', () => {
  it('formata data ISO no formato longo pt-BR', () => {
    // Usar data sem 'Z' para evitar offset de timezone (UTC vs local)
    expect(formatDate('2026-04-28')).toMatch(/28 de abril de 2026/);
  });

  it('formata 1 de janeiro corretamente', () => {
    expect(formatDate('2026-01-01')).toMatch(/1 de janeiro de 2026/);
  });

  it('retorna a string original quando a data é inválida', () => {
    expect(formatDate('data-invalida')).toBe('data-invalida');
  });

  it('retorna a string original para string vazia', () => {
    expect(formatDate('')).toBe('');
  });
});

// ── formatDateShort() ────────────────────────────────────────────────────────

describe('formatDateShort()', () => {
  it('formata data no formato curto pt-BR', () => {
    // Usar data sem 'Z' para evitar offset de timezone
    const result = formatDateShort('2026-04-28');
    expect(result).toMatch(/28/);
    expect(result).toMatch(/2026/);
  });

  it('retorna a string original quando a data é inválida', () => {
    expect(formatDateShort('nao-e-data')).toBe('nao-e-data');
  });
});

// ── calculateReadingTime() ───────────────────────────────────────────────────

describe('calculateReadingTime()', () => {
  it('retorna 1 para conteúdo vazio', () => {
    expect(calculateReadingTime('')).toBe(1);
  });

  it('retorna 1 para conteúdo com menos de 200 palavras', () => {
    const content = 'palavra '.repeat(100).trim();
    expect(calculateReadingTime(content)).toBe(1);
  });

  it('calcula corretamente para 400 palavras (2 min)', () => {
    const content = 'palavra '.repeat(400).trim();
    expect(calculateReadingTime(content)).toBe(2);
  });

  it('calcula corretamente para 600 palavras (3 min)', () => {
    const content = 'palavra '.repeat(600).trim();
    expect(calculateReadingTime(content)).toBe(3);
  });

  it('arredonda para cima: 201 palavras = 2 min', () => {
    const content = 'palavra '.repeat(201).trim();
    expect(calculateReadingTime(content)).toBe(2);
  });

  it('retorna 1 para texto com uma única palavra', () => {
    expect(calculateReadingTime('palavra')).toBe(1);
  });
});

// ── formatCurrency() ─────────────────────────────────────────────────────────

describe('formatCurrency()', () => {
  it('formata zero como R$ 0,00', () => {
    expect(formatCurrency(0)).toMatch(/R\$\s*0[,.]00/);
  });

  it('formata valor positivo com símbolo R$', () => {
    const result = formatCurrency(29.9);
    expect(result).toMatch(/R\$/);
    expect(result).toMatch(/29/);
  });

  it('formata valor grande com separador de milhar', () => {
    const result = formatCurrency(1000);
    // "R$ 1.000,00" ou "R$1.000,00" dependendo do ambiente
    expect(result).toMatch(/1[.,]000/);
  });

  it('formata valor negativo', () => {
    const result = formatCurrency(-10);
    expect(result).toMatch(/-/);
  });
});

// ── slugify() ────────────────────────────────────────────────────────────────

describe('slugify()', () => {
  it('converte espaços em hífens', () => {
    expect(slugify('meu titulo')).toBe('meu-titulo');
  });

  it('remove acentos (NFD)', () => {
    expect(slugify('ação')).toBe('acao');
    expect(slugify('coração')).toBe('coracao');
  });

  it('converte para minúsculas', () => {
    expect(slugify('Título Com Maiúsculas')).toBe('titulo-com-maiusculas');
  });

  it('remove caracteres especiais', () => {
    expect(slugify('texto (com) especiais!')).toBe('texto-com-especiais');
  });

  it('colapsa múltiplos hífens em um', () => {
    expect(slugify('duplo  espaço')).toBe('duplo-espaco');
  });

  it('remove hífens no início e fim', () => {
    expect(slugify('  texto  ')).toBe('texto');
  });

  it('mantém números', () => {
    expect(slugify('post 2026')).toBe('post-2026');
  });

  it('retorna string vazia para input vazio', () => {
    expect(slugify('')).toBe('');
  });
});
