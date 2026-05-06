import { NextResponse } from 'next/server';

// ConvertKit API integration
// Docs: https://developers.convertkit.com/#add-subscriber-to-a-form
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ message: 'E-mail inválido.' }, { status: 400 });
    }

    const apiKey = process.env.CONVERTKIT_API_KEY;
    const formId = process.env.CONVERTKIT_FORM_ID;

    if (!apiKey || !formId) {
      console.warn('[Newsletter] CONVERTKIT_API_KEY or CONVERTKIT_FORM_ID not set.');
      // Return success in development so UI can be tested
      if (process.env.NODE_ENV !== 'production') {
        return NextResponse.json({ message: 'OK (dev mode — ConvertKit not configured)' });
      }
      return NextResponse.json({ message: 'Serviço de newsletter não configurado.' }, { status: 503 });
    }

    const ckRes = await fetch(
      `https://api.convertkit.com/v3/forms/${formId}/subscribe`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ api_key: apiKey, email }),
      }
    );

    if (!ckRes.ok) {
      const err = await ckRes.json();
      console.error('[ConvertKit]', err);
      return NextResponse.json({ message: 'Não foi possível inscrever. Tente novamente.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Inscrito com sucesso!' });
  } catch (err) {
    console.error('[Newsletter route]', err);
    return NextResponse.json({ message: 'Erro interno. Tente novamente.' }, { status: 500 });
  }
}
