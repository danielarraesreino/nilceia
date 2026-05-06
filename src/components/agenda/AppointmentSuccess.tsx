'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export function AppointmentSuccess() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-xl mx-auto text-center py-12 px-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="flex justify-center mb-6"
      >
        <CheckCircle2 className="w-24 h-24 text-[var(--accent-green)]" />
      </motion.div>
      
      <h2 className="text-3xl font-[var(--font-heading)] text-[var(--text-primary)] mb-4">
        Seu espaço foi reservado com carinho
      </h2>
      
      <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
        Enviamos um e-mail com os detalhes do seu agendamento. 
        Em breve, entrarei em contato para confirmar os próximos passos.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          href="/"
          className="px-8 py-3 bg-[var(--accent-gold)] text-white rounded-lg font-medium hover:bg-[#9a6e06] transition-colors"
        >
          Voltar ao Início
        </Link>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 border border-[var(--accent-gold)] text-[var(--accent-gold)] rounded-lg font-medium hover:bg-[var(--accent-gold)]/5 transition-colors"
        >
          Novo Agendamento
        </button>
      </div>
    </motion.div>
  );
}
