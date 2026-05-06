'use server';

import { client } from '@/lib/sanity';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  if (!token || token.value !== process.env.ADMIN_TOKEN) {
    throw new Error('Acesso não autorizado');
  }
}

export async function updateAppointmentStatus(id: string, newStatus: 'confirmed' | 'cancelled' | 'pending') {
  await requireAdmin();

  try {
    const writeClient = client.withConfig({ token: process.env.SANITY_WRITE_TOKEN });
    
    await writeClient
      .patch(id)
      .set({ status: newStatus })
      .commit();

    // Revalida a página de admin para mostrar os novos dados
    revalidatePath('/admin/agenda');
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao atualizar status' };
  }
}
