import { NextResponse } from 'next/server';

// ConvertKit API integration
// Docs: https://developers.convertkit.com/#add-subscriber-to-a-form
export async function POST(req: Request) {
  try {
    let body: { email?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { message: 'Requisição inválida. Envie um JSON com o campo "email".' },
        { status: 400 }
      );
    }

    const { email } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ message: 'E-mail inválido.' }, { status: 400 });
    }

    const apiKey = process.env.CONVERTKIT_API_KEY;
    const formId = process.env.CONVERTKIT_FORM_ID;

    if (!apiKey || !formId || apiKey.trim() === '' || formId.trim() === '') {
      console.warn('[Newsletter] CONVERTKIT_API_KEY ou CONVERTKIT_FORM_ID não configurados.');
      if (process.env.NODE_ENV !== 'production') {
        return NextResponse.json({ message: 'OK (modo dev — ConvertKit não configurado)' });
      }
      return NextResponse.json(
        { message: 'Serviço de newsletter não configurado no momento.' },
        { status: 503 }
      );
    }

    const ckRes = await fetch(
      `https://api.convertkit.com/v3/forms/${formId.trim()}/subscribe`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ api_key: apiKey.trim(), email }),
      }
    );

    if (!ckRes.ok) {
      let errDetail: unknown;
      try {
        errDetail = await ckRes.json();
      } catch {
        errDetail = await ckRes.text();
      }
      console.error('[ConvertKit Error]', errDetail);
      return NextResponse.json(
        { message: 'Não foi possível inscrever. Tente novamente mais tarde.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Inscrito com sucesso! Verifique seu e-mail. 💛' });
  } catch (err) {
    console.error('[Newsletter route] Erro inesperado:', err);
    return NextResponse.json(
      { message: 'Erro interno no servidor. Tente novamente.' },
      { status: 500 }
    );
  }
}
