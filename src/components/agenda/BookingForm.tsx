'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { appointmentSchema, AppointmentPayload } from '@/lib/validation';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface BookingFormProps {
  date: string;
  time: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function BookingForm({ date, time, onSuccess, onCancel }: BookingFormProps) {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    sessionType: 'online',
    notes: '',
    acceptTerms: false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
    // Clear error for field
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    
    const payload: AppointmentPayload = {
      ...formData,
      date,
      startTime: time,
    } as AppointmentPayload;

    const validation = appointmentSchema.safeParse(payload);
    
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach(issue => {
        if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/agenda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setApiError(result.error || 'Ocorreu um erro ao processar o agendamento.');
      } else {
        onSuccess();
      }
    } catch (err) {
      setApiError('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[var(--bg-main)]"
      onSubmit={handleSubmit}
    >
      <h3 className="text-2xl font-[var(--font-heading)] mb-6 text-[var(--text-primary)]">
        Finalizar Reserva
      </h3>

      <div className="mb-6 p-4 bg-[var(--bg-main)] rounded-lg text-sm">
        <p>Você está agendando para: <strong>{date.split('-').reverse().join('/')} às {time}</strong></p>
      </div>

      {apiError && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{apiError}</p>
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium mb-1">Seu Nome *</label>
          <input
            id="clientName"
            name="clientName"
            type="text"
            value={formData.clientName}
            onChange={handleChange}
            className={cn(
              "w-full px-4 py-3 rounded-lg border bg-white focus:ring-2 focus:ring-[var(--accent-gold)] outline-none transition-all",
              errors.clientName ? "border-red-500" : "border-gray-300"
            )}
            placeholder="Como gostaria de ser chamado(a)?"
            aria-invalid={!!errors.clientName}
          />
          {errors.clientName && <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>}
        </div>

        <div>
          <label htmlFor="clientEmail" className="block text-sm font-medium mb-1">E-mail *</label>
          <input
            id="clientEmail"
            name="clientEmail"
            type="email"
            value={formData.clientEmail}
            onChange={handleChange}
            className={cn(
              "w-full px-4 py-3 rounded-lg border bg-white focus:ring-2 focus:ring-[var(--accent-gold)] outline-none transition-all",
              errors.clientEmail ? "border-red-500" : "border-gray-300"
            )}
            placeholder="Seu melhor e-mail para contato"
            aria-invalid={!!errors.clientEmail}
          />
          {errors.clientEmail && <p className="text-red-500 text-xs mt-1">{errors.clientEmail}</p>}
        </div>

        <div>
          <label htmlFor="sessionType" className="block text-sm font-medium mb-1">Tipo de Sessão *</label>
          <select
            id="sessionType"
            name="sessionType"
            value={formData.sessionType}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-[var(--accent-gold)] outline-none transition-all"
          >
            <option value="online">Online</option>
            <option value="presencial">Presencial (Campinas/SP)</option>
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-1">Observações (opcional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-[var(--accent-gold)] outline-none transition-all"
            placeholder="Há algo que gostaria que eu soubesse antes?"
          />
        </div>

        <div className="flex items-start gap-3 mt-6">
          <input
            id="acceptTerms"
            name="acceptTerms"
            type="checkbox"
            checked={formData.acceptTerms}
            onChange={handleChange}
            className="mt-1 w-5 h-5 rounded border-gray-300 text-[var(--accent-gold)] focus:ring-[var(--accent-gold)]"
          />
          <label htmlFor="acceptTerms" className="text-sm text-gray-600">
            Concordo com a Política de Privacidade e o uso dos meus dados apenas para fins de agendamento e contato, em conformidade com a LGPD.
          </label>
        </div>
        {errors.acceptTerms && <p className="text-red-500 text-xs mt-1">{errors.acceptTerms}</p>}
      </div>

      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
        >
          Voltar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-[var(--accent-gold)] hover:bg-[#9a6e06] text-white px-6 py-3 rounded-lg font-medium transition-colors flex justify-center items-center disabled:opacity-70"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Reservando...
            </span>
          ) : (
            'Confirmar Reserva'
          )}
        </button>
      </div>
    </motion.form>
  );
}
