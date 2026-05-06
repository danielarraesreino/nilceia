'use client';

import { useTransition, useState } from 'react';
import { updateAppointmentStatus } from '@/app/actions/appointment';
import { format, parseISO } from 'date-fns';
import { Check, X, Clock, Loader2 } from 'lucide-react';

interface AppointmentRowProps {
  appt: any; // Ideally we would define a full TS interface
}

export function AppointmentRow({ appt }: AppointmentRowProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  
  const statusLabels: Record<string, string> = {
    pending: 'Pendente',
    confirmed: 'Confirmado',
    cancelled: 'Cancelado',
  };

  const isPast = new Date(`${appt.date}T${appt.startTime}`) < new Date();

  const handleStatusChange = (newStatus: 'confirmed' | 'cancelled' | 'pending') => {
    setError('');
    startTransition(async () => {
      const result = await updateAppointmentStatus(appt._id, newStatus);
      if (!result.success) {
        setError(result.error || 'Erro ao atualizar');
      }
    });
  };

  return (
    <tr className={isPast ? 'opacity-60 bg-gray-50' : 'hover:bg-gray-50/50 transition-colors'}>
      <td className="px-6 py-4">
        <div className="font-medium text-gray-900">{appt.clientName}</div>
        <div className="text-sm text-gray-500">{appt.clientEmail}</div>
      </td>
      <td className="px-6 py-4">
        <div className="font-medium">
          {format(parseISO(appt.date), 'dd/MM/yyyy')}
        </div>
        <div className="text-sm text-gray-500">{appt.startTime}</div>
      </td>
      <td className="px-6 py-4 capitalize text-sm">
        {appt.sessionType}
      </td>
      <td className="px-6 py-4">
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5 ${statusColors[appt.status] || 'bg-gray-100 text-gray-800'}`}>
          {appt.status === 'pending' && <Clock className="w-3 h-3" />}
          {appt.status === 'confirmed' && <Check className="w-3 h-3" />}
          {appt.status === 'cancelled' && <X className="w-3 h-3" />}
          {statusLabels[appt.status] || appt.status}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
        {appt.notes || '-'}
      </td>
      <td className="px-6 py-4 text-right">
        {error && <div className="text-xs text-red-500 mb-1">{error}</div>}
        <div className="flex justify-end gap-2">
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          ) : (
            <>
              {appt.status !== 'confirmed' && !isPast && (
                <button
                  onClick={() => handleStatusChange('confirmed')}
                  className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded transition-colors"
                  title="Confirmar"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
              {appt.status !== 'cancelled' && (
                <button
                  onClick={() => handleStatusChange('cancelled')}
                  className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded transition-colors"
                  title="Cancelar"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
