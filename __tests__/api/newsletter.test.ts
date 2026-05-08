/**
 * 🧪 O Tester — Sprint 2
 * Testes para src/app/api/newsletter/route.ts
 *
 * Estratégia: mock do Sanity client e do Resend para isolar a lógica de negócio.
 * Testa os 4 cenários principais do fluxo de newsletter:
 *  - Sucesso: e-mail novo, salvo no Sanity
 *  - Duplicata: e-mail já existente
 *  - E-mail inválido
 *  - Erro interno do servidor
 */

import { NextResponse } from 'next/server';

// ── Mocks ───────────────────────────────────────────────────────────────────

// Mock Sanity client
const mockFetch = jest.fn();
const mockCreate = jest.fn();

jest.mock('@sanity/client', () => ({
  createClient: jest.fn(() => ({
    fetch: mockFetch,
    create: mockCreate,
  })),
}));

// Mock Resend — evita chamadas reais de e-mail nos testes
const mockSend = jest.fn().mockResolvedValue({ id: 'mock-email-id' });
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: mockSend },
  })),
}));

// ── Helper: cria um Request simulado ────────────────────────────────────────

function makeRequest(body: object, contentType = 'application/json'): Request {
  return new Request('http://localhost/api/newsletter', {
    method: 'POST',
    headers: { 'Content-Type': contentType },
    body: JSON.stringify(body),
  });
}

// ── Importar a route depois dos mocks (ordem importa!) ──────────────────────

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { POST } = require('@/app/api/newsletter/route');

// ── Testes ──────────────────────────────────────────────────────────────────

describe('POST /api/newsletter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Variáveis de ambiente simuladas
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project';
    process.env.NEXT_PUBLIC_SANITY_DATASET = 'production';
    process.env.RESEND_API_KEY = 'test-resend-key';
  });

  // ── Cenário: sucesso ──────────────────────────────────────────────────────

  it('retorna 200 e salva no Sanity para e-mail novo', async () => {
    // Sanity não encontra o e-mail (não existe cadastro)
    mockFetch.mockResolvedValueOnce(null);
    // Sanity cria com sucesso
    mockCreate.mockResolvedValueOnce({ _id: 'new-doc-id' });

    const req = makeRequest({ email: 'novo@exemplo.com' });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toMatch(/sucesso/i);

    // Verificar que o Sanity foi chamado com os dados corretos
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        _type: 'subscriber',
        email: 'novo@exemplo.com',
        confirmed: true,
      })
    );
  });

  it('normaliza o e-mail para minúsculas', async () => {
    mockFetch.mockResolvedValueOnce(null);
    mockCreate.mockResolvedValueOnce({ _id: 'new-doc-id' });

    const req = makeRequest({ email: 'MAIUSCULO@EXEMPLO.COM' });
    await POST(req);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'maiusculo@exemplo.com' })
    );
  });

  // ── Cenário: e-mail duplicado ─────────────────────────────────────────────

  it('retorna 200 com mensagem de já inscrito quando e-mail já existe', async () => {
    // Sanity encontra o e-mail (já cadastrado)
    mockFetch.mockResolvedValueOnce('existing-doc-id');

    const req = makeRequest({ email: 'existente@exemplo.com' });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toMatch(/já está inscrito/i);
    // Não deve criar novo documento
    expect(mockCreate).not.toHaveBeenCalled();
  });

  // ── Cenário: e-mail inválido ──────────────────────────────────────────────

  it('retorna 400 para e-mail sem @', async () => {
    const req = makeRequest({ email: 'emailsemarroba' });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.message).toMatch(/inválido/i);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('retorna 400 para campo email ausente', async () => {
    const req = makeRequest({ nome: 'Sem email' });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
  });

  it('retorna 400 para string vazia', async () => {
    const req = makeRequest({ email: '' });
    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  // ── Cenário: erro interno ─────────────────────────────────────────────────

  it('retorna 500 quando o Sanity lança exceção inesperada', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Sanity connection failed'));

    const req = makeRequest({ email: 'teste@exemplo.com' });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.message).toMatch(/erro interno/i);
  });

  // ── Comportamento do Resend ───────────────────────────────────────────────

  it('chama o Resend para enviar e-mail de boas-vindas no sucesso', async () => {
    mockFetch.mockResolvedValueOnce(null);
    mockCreate.mockResolvedValueOnce({ _id: 'new-doc-id' });

    const req = makeRequest({ email: 'novo@exemplo.com' });
    await POST(req);

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'novo@exemplo.com',
      })
    );
  });

  it('não chama o Resend quando RESEND_API_KEY está ausente', async () => {
    delete process.env.RESEND_API_KEY;
    mockFetch.mockResolvedValueOnce(null);
    mockCreate.mockResolvedValueOnce({ _id: 'new-doc-id' });

    const req = makeRequest({ email: 'novo@exemplo.com' });
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(mockSend).not.toHaveBeenCalled();
  });
});
