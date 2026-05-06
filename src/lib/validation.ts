import { z } from 'zod';

export const appointmentSchema = z.object({
  clientName: z.string().min(3, { message: 'Nome deve ter no mínimo 3 caracteres.' }),
  clientEmail: z.string().email({ message: 'E-mail inválido.' }),
  sessionType: z.enum(['online', 'presencial'], { message: 'Tipo de sessão inválido.' }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Data inválida.' }),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, { message: 'Horário inválido.' }),
  notes: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'É obrigatório concordar com a Política de Privacidade.',
  }),
});

export type AppointmentPayload = z.infer<typeof appointmentSchema>;
