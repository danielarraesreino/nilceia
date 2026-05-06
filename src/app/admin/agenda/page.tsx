import { client } from '@/lib/sanity';
import { AppointmentRow } from '@/components/admin/AppointmentRow';
import { StatCard } from '@/components/admin/StatCard';
import { CalendarCheck, Clock, Users, LogOut } from 'lucide-react';
import { logout } from '@/app/actions/auth';
import { startOfMonth, endOfMonth, format } from 'date-fns';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Dashboard - Nilceia',
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  // Busca todos os agendamentos, ordenando pelos mais recentes primeiro ou próximos dependendo da visão.
  const query = `
    *[_type == "appointment"] | order(date desc, startTime desc) {
      _id,
      clientName,
      clientEmail,
      sessionType,
      date,
      startTime,
      status,
      notes,
      _createdAt
    }
  `;
  
  const appointments = await client.fetch(query);

  // Calcula estatísticas
  const currentMonthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');
  const currentMonthEnd = format(endOfMonth(new Date()), 'yyyy-MM-dd');

  const pendingCount = appointments.filter((a: any) => a.status === 'pending').length;
  const confirmedCount = appointments.filter((a: any) => a.status === 'confirmed').length;
  
  // Unique patients based on email (simplified)
  const uniquePatients = new Set(appointments.map((a: any) => a.clientEmail)).size;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] pb-12">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center mb-8 shadow-sm">
        <h1 className="text-xl font-[var(--font-heading)] font-bold text-[var(--accent-gold)]">
          Nilceia Eulampio
        </h1>
        <form action={logout}>
          <button type="submit" className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors">
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </form>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h2 className="text-3xl font-[var(--font-heading)] text-[var(--text-primary)]">
            Visão Geral
          </h2>
          <p className="text-gray-600">Acompanhe e gerencie seus agendamentos.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard 
            title="Aguardando Confirmação" 
            value={pendingCount} 
            icon={<Clock className="w-6 h-6" />} 
          />
          <StatCard 
            title="Sessões Confirmadas" 
            value={confirmedCount} 
            icon={<CalendarCheck className="w-6 h-6" />} 
            trend="Totais"
          />
          <StatCard 
            title="Pacientes Únicos" 
            value={uniquePatients} 
            icon={<Users className="w-6 h-6" />} 
          />
        </div>

        <div className="bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/20 p-6 rounded-2xl mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Gestão de Conteúdo (Blog & Site)</h3>
            <p className="text-sm text-gray-600 mt-1">
              Escreva novos textos, atualize a loja e modifique as configurações gerais do site utilizando o Estúdio Visual.
            </p>
          </div>
          <a 
            href="/studio" 
            target="_blank" 
            rel="noopener noreferrer"
            className="whitespace-nowrap px-6 py-3 bg-[var(--accent-gold)] text-white rounded-lg font-medium hover:bg-[#9a6e06] transition-colors"
          >
            Acessar Sanity Studio
          </a>
        </div>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-medium text-gray-900">Todos os Agendamentos</h3>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-sm">
                    <th className="px-6 py-4 font-medium text-gray-700">Paciente</th>
                    <th className="px-6 py-4 font-medium text-gray-700">Data e Hora</th>
                    <th className="px-6 py-4 font-medium text-gray-700">Tipo</th>
                    <th className="px-6 py-4 font-medium text-gray-700">Status</th>
                    <th className="px-6 py-4 font-medium text-gray-700">Observações</th>
                    <th className="px-6 py-4 font-medium text-gray-700 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        Nenhum agendamento encontrado no sistema.
                      </td>
                    </tr>
                  ) : (
                    appointments.map((appt: any) => (
                      <AppointmentRow key={appt._id} appt={appt} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
