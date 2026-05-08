import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@sanity/client';

export async function POST(req: Request) {
  try {
    const sanityWriteClient = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fallback',
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      apiVersion: '2024-01-01',
      useCdn: false,
      token: process.env.SANITY_WRITE_TOKEN,
    });
    let body: { email?: string; source?: string } = {};
    const contentType = req.headers.get('content-type') || '';

    try {
      if (contentType.includes('application/json')) {
        body = await req.json();
      } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
        const formData = await req.formData();
        body = {
          email: formData.get('email') as string,
          source: formData.get('source') as string,
        };
      } else {
        // Tentar JSON como fallback
        body = await req.json();
      }
    } catch (err) {
      console.error('[Newsletter API] Error parsing body:', err);
      return NextResponse.json(
        { message: 'Requisição inválida. Envie os dados corretamente.' },
        { status: 400 }
      );
    }

    const { email, source = 'homepage' } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ message: 'E-mail inválido.' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // ── 1. Verificar duplicata no Sanity ──────────────────────────────
    const existing = await sanityWriteClient.fetch(
      `*[_type == "subscriber" && email == $email][0]._id`,
      { email: normalizedEmail }
    );

    if (existing) {
      return NextResponse.json(
        { message: 'Este e-mail já está inscrito. Obrigada! 💛' },
        { status: 200 }
      );
    }

    // ── 2. Salvar no Sanity ───────────────────────────────────────────
    await sanityWriteClient.create({
      _type: 'subscriber',
      email: normalizedEmail,
      subscribedAt: new Date().toISOString(),
      confirmed: true,
      source: typeof source === 'string' ? source : 'homepage',
    });

    // ── 3. Enviar e-mail de boas-vindas via Resend ────────────────────
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey && resendApiKey.trim() !== '') {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: 'Nilceia Eulampio <no-reply@nilceia.com.br>',
        to: normalizedEmail,
        subject: '💛 Bem-vinda ao círculo de palavras da Nilceia',
        html: `
          <!DOCTYPE html>
          <html lang="pt-BR">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Bem-vinda!</title>
          </head>
          <body style="margin:0;padding:0;background:#FDF9F3;font-family:'Georgia',serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#FDF9F3;padding:40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(44,36,27,0.08);">
                    
                    <!-- Header dourado -->
                    <tr>
                      <td style="background:linear-gradient(135deg,#2C241B 0%,#3D2F24 100%);padding:40px 40px 32px;text-align:center;">
                        <p style="color:#B8860B;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 16px;font-family:sans-serif;">
                          NILCEIA EULAMPIO
                        </p>
                        <h1 style="color:#FDF9F3;font-size:28px;font-weight:700;margin:0;line-height:1.3;">
                          Que alegria ter você aqui 💛
                        </h1>
                      </td>
                    </tr>

                    <!-- Conteúdo -->
                    <tr>
                      <td style="padding:40px;">
                        <p style="color:#5D4E3F;font-size:17px;line-height:1.8;margin:0 0 20px;">
                          Olá!
                        </p>
                        <p style="color:#5D4E3F;font-size:17px;line-height:1.8;margin:0 0 20px;">
                          Sua inscrição foi confirmada. A partir de agora, você faz parte do meu círculo de palavras — um espaço íntimo onde compartilho reflexões sobre espiritualidade, cura emocional, poesia e justiça social.
                        </p>
                        <p style="color:#5D4E3F;font-size:17px;line-height:1.8;margin:0 0 32px;">
                          Toda semana, você receberá textos escritos com cuidado e intenção, direto no seu e-mail. Sem spam. Apenas palavras que quero que cheguem até você.
                        </p>

                        <!-- CTA -->
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center">
                              <a href="https://nilceia.vercel.app/blog"
                                style="display:inline-block;padding:14px 32px;background:#B8860B;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700;font-size:15px;font-family:sans-serif;letter-spacing:0.02em;">
                                Ler as reflexões →
                              </a>
                            </td>
                          </tr>
                        </table>

                        <!-- Citação -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:36px;">
                          <tr>
                            <td style="border-left:3px solid #B8860B;padding:16px 20px;background:#FDF9F3;border-radius:0 8px 8px 0;">
                              <p style="color:#B8860B;font-size:18px;font-style:italic;margin:0;line-height:1.6;">
                                "A escrita é oração em forma de letra."
                              </p>
                              <p style="color:#9C8475;font-size:13px;margin:8px 0 0;font-family:sans-serif;">
                                — Nilceia Eulampio
                              </p>
                            </td>
                          </tr>
                        </table>

                        <p style="color:#9C8475;font-size:14px;line-height:1.7;margin:32px 0 0;">
                          Com amor e gratidão,<br/>
                          <strong style="color:#2C241B;">Nilceia Eulampio</strong><br/>
                          <span style="font-style:italic;">Escritora · Poetisa · Voz Espiritual</span>
                        </p>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background:#F5EFE6;padding:20px 40px;text-align:center;">
                        <p style="color:#9C8475;font-size:12px;margin:0;font-family:sans-serif;line-height:1.6;">
                          Você está recebendo este e-mail porque se inscreveu em nilceia.vercel.app.<br/>
                          Para cancelar a inscrição, responda este e-mail com o assunto "Cancelar".
                        </p>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      });
    }

    return NextResponse.json({
      message: 'Inscrito com sucesso! Verifique seu e-mail para a mensagem de boas-vindas. 💛',
    });
  } catch (err) {
    console.error('[Newsletter route] Erro inesperado:', err);
    return NextResponse.json(
      { message: 'Erro interno no servidor. Tente novamente.' },
      { status: 500 }
    );
  }
}
