'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TimeSlotPickerProps {
  slots: string[];
  selectedSlot: string | null;
  onSelectSlot: (slot: string) => void;
  isLoading: boolean;
}

export function TimeSlotPicker({ slots, selectedSlot, onSelectSlot, isLoading }: TimeSlotPickerProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-gold)]"></div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        Nenhum horário disponível para este dia. Por favor, escolha outra data.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
      {slots.map((slot, idx) => {
        const isSelected = selectedSlot === slot;
        return (
          <motion.button
            key={slot}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onSelectSlot(slot)}
            className={cn(
              "py-3 px-4 rounded-lg font-medium border transition-all text-sm",
              "hover:border-[var(--accent-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)]",
              isSelected 
                ? "bg-[var(--accent-gold)] border-[var(--accent-gold)] text-white shadow-md"
                : "bg-white border-gray-200 text-gray-700"
            )}
            aria-label={`Selecionar horário ${slot}`}
            aria-pressed={isSelected}
          >
            {slot}
          </motion.button>
        );
      })}
    </div>
  );
}
