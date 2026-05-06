'use client';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getAvailableDays } from '@/lib/agenda';
import { useMemo } from 'react';

interface CalendarGridProps {
  onSelectDate: (date: Date) => void;
  selectedDate: Date | null;
}

export function CalendarGrid({ onSelectDate, selectedDate }: CalendarGridProps) {
  // Generate 15 business days for simplicity
  const days = useMemo(() => getAvailableDays(new Date(), 15), []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {days.map((day, idx) => {
        const isSelected = selectedDate?.toDateString() === day.toDateString();
        
        return (
          <motion.button
            key={day.toISOString()}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onSelectDate(day)}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
              "hover:border-[var(--accent-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)]",
              isSelected 
                ? "border-[var(--accent-gold)] bg-[var(--accent-gold)]/10 text-[var(--accent-gold)]"
                : "border-gray-200 bg-white text-gray-700"
            )}
            aria-label={`Selecionar dia ${format(day, "dd 'de' MMMM", { locale: ptBR })}`}
            aria-pressed={isSelected}
          >
            <span className="text-sm font-medium uppercase tracking-wider mb-1">
              {format(day, 'EEE', { locale: ptBR })}
            </span>
            <span className="text-2xl font-bold font-[var(--font-heading)]">
              {format(day, 'dd', { locale: ptBR })}
            </span>
            <span className="text-xs mt-1">
              {format(day, 'MMM', { locale: ptBR })}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
