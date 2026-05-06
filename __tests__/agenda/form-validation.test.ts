import { appointmentSchema } from '@/lib/validation';

describe('Appointment Schema Validation', () => {
  it('should validate a correct payload', () => {
    const payload = {
      clientName: 'João da Silva',
      clientEmail: 'joao@example.com',
      sessionType: 'online',
      date: '2024-05-10',
      startTime: '14:00',
      notes: 'Primeira vez',
      acceptTerms: true,
    };
    
    const result = appointmentSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it('should fail if acceptTerms is false', () => {
    const payload = {
      clientName: 'João da Silva',
      clientEmail: 'joao@example.com',
      sessionType: 'online',
      date: '2024-05-10',
      startTime: '14:00',
      acceptTerms: false,
    };
    
    const result = appointmentSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('obrigatório concordar');
    }
  });

  it('should fail on invalid email', () => {
    const payload = {
      clientName: 'João',
      clientEmail: 'invalid-email',
      sessionType: 'online',
      date: '2024-05-10',
      startTime: '14:00',
      acceptTerms: true,
    };
    
    const result = appointmentSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });
});
