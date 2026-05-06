'use client';

import { useActionState } from 'react';
import { loginWithToken } from '@/app/actions/auth';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginWithToken, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md text-center"
      >
        <div className="w-16 h-16 bg-[var(--accent-gold)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-[var(--accent-gold)]" />
        </div>
        
        <h1 className="text-2xl font-[var(--font-heading)] text-[var(--text-primary)] mb-2">
          Acesso Restrito
        </h1>
        <p className="text-gray-500 mb-8">
          Por favor, insira a senha administrativa para gerenciar os agendamentos.
        </p>

        <form action={formAction} className="space-y-6">
          <div>
            <input
              type="password"
              name="token"
              placeholder="Senha de Acesso"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-[var(--accent-gold)] outline-none transition-all text-center tracking-widest"
              required
            />
            {state?.error && (
              <p className="text-red-500 text-sm mt-2">{state.error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[var(--accent-gold)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#9a6e06] transition-colors disabled:opacity-70 flex justify-center items-center"
          >
            {isPending ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Acessar Painel'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
