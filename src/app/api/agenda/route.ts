import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity';
import { generateAvailableSlots } from '@/lib/agenda';
import { appointmentSchema } from '@/lib/validation';
import { Resend } from 'resend';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    if (!date) {
      return NextResponse.json({ error: 'Data não informada' }, { status: 400 });
    }

    // Busca agendamentos para a data que não estejam cancelados
    const query = `*[_type == "appointment" && date == $date && status != "cancelled"] { startTime }`;
    const booked = await client.fetch(query, { date });
    const bookedSlots = booked.map((b: { startTime: string }) => b.startTime);

    // Considera o timezone local no momento de gerar slots (usando T00:00:00 para forçar meia-noite local ou UTC)
    // Para simplificar, vamos criar a data no formato ISO
    const [year, month, day] = date.split('-');
    const localDate = new Date(Number(year), Number(month) - 1, Number(day));

    const slots = generateAvailableSlots(localDate, bookedSlots);
    return NextResponse.json({ slots });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = appointmentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', issues: result.error.issues },
        { status: 400 }
      );
    }

    const data = result.data;

    // Verifica conflitos no Sanity
    const query = `*[_type == "appointment" && date == $date && startTime == $startTime && status != "cancelled"]`;
    const existing = await client.fetch(query, { date: data.date, startTime: data.startTime });

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Horário já reservado por outra pessoa.' }, { status: 409 });
    }

    // Instancia o client com token de escrita
    const writeClient = client.withConfig({ token: process.env.SANITY_WRITE_TOKEN });

    await writeClient.create({
      _type: 'appointment',
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      sessionType: data.sessionType,
      date: data.date,
      startTime: data.startTime,
      notes: data.notes || '',
      status: 'pending',
    });

    // Dispara e-mail
    // Dica: Configure seu domínio verificado no Resend e altere o "from".
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'Nilceia Eulampio <onboarding@resend.dev>',
        to: [data.clientEmail],
        subject: 'Seu espaço foi reservado com carinho',
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #2C241B; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FDF9F3;">
            <h2 style="color: #B8860B; font-family: Georgia, serif;">Olá, ${data.clientName}.</h2>
            <p>Seu pedido de sessão <strong>${data.sessionType === 'online' ? 'Online' : 'Presencial'}</strong> para o dia <strong>${data.date.split('-').reverse().join('/')}</strong> às <strong>${data.startTime}</strong> foi recebido em nosso espaço seguro.</p>
            <p>Este momento de cuidado foi reservado para você. Em breve, entraremos em contato para confirmar os próximos passos e enviar as informações de acesso.</p>
            <br/>
            <p>Com carinho,<br/><strong>Nilceia Eulampio</strong></p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
