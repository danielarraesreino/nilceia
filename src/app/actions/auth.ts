'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginWithToken(prevState: any, formData: FormData) {
  const token = formData.get('token') as string;
  
  if (token === process.env.ADMIN_TOKEN) {
    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    
    redirect('/admin/agenda');
  } else {
    return { error: 'Senha incorreta.' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
  redirect('/admin/login');
}
