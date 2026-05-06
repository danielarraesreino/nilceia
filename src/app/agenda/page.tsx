'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarGrid } from '@/components/agenda/CalendarGrid';
import { TimeSlotPicker } from '@/components/agenda/TimeSlotPicker';
import { BookingForm } from '@/components/agenda/BookingForm';
import { AppointmentSuccess } from '@/components/agenda/AppointmentSuccess';
import { format } from 'date-fns';

export default function AgendaPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Fetch slots whenever the date changes
  useEffect(() => {
    if (!selectedDate) return;
    
    let isMounted = true;
    const fetchSlots = async () => {
      setIsLoadingSlots(true);
      setAvailableSlots([]);
      setSelectedSlot(null);

      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const res = await fetch(`/api/agenda?date=${dateStr}`);
        if (!res.ok) throw new Error('Falha ao buscar horários');
        
        const data = await res.json();
        if (isMounted) {
          setAvailableSlots(data.slots || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setIsLoadingSlots(false);
      }
    };

    fetchSlots();

    return () => { isMounted = false; };
  }, [selectedDate]);

  const handleNextStep = () => {
    if (step === 1 && selectedDate) setStep(2);
    else if (step === 2 && selectedSlot) setStep(3);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {step < 4 && (
          <div className="text-center mb-10">
            <h1 className="text-4xl font-[var(--font-heading)] text-[var(--text-primary)] mb-4">
              Agende sua Sessão
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Escolha um momento de cuidado. Sua sessão será um espaço seguro de escuta e acolhimento.
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100"
            >
              <h2 className="text-xl font-medium mb-6">1. Selecione o Dia</h2>
              <CalendarGrid 
                selectedDate={selectedDate} 
                onSelectDate={(date) => {
                  setSelectedDate(date);
                  // Optionally auto-advance
                  // setStep(2); 
                }} 
              />
              
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleNextStep}
                  disabled={!selectedDate}
                  className="bg-[var(--accent-gold)] text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50 transition-colors"
                >
                  Continuar
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100"
            >
              <h2 className="text-xl font-medium mb-6">
                2. Selecione o Horário para o dia {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : ''}
              </h2>
              
              <TimeSlotPicker 
                slots={availableSlots}
                selectedSlot={selectedSlot}
                onSelectSlot={setSelectedSlot}
                isLoading={isLoadingSlots}
              />

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors border"
                >
                  Voltar
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={!selectedSlot}
                  className="bg-[var(--accent-gold)] text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50 transition-colors"
                >
                  Continuar
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && selectedDate && selectedSlot && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <BookingForm 
                date={format(selectedDate, 'yyyy-MM-dd')}
                time={selectedSlot}
                onCancel={() => setStep(2)}
                onSuccess={() => setStep(4)}
              />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <AppointmentSuccess />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
