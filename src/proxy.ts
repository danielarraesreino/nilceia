import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protege a rota /admin/agenda e filhas
  if (path.startsWith('/admin/agenda')) {
    const adminAuthCookie = request.cookies.get('admin_token');

    // Se não há cookie e não forneceu via searchParams
    if (!adminAuthCookie) {
      // Allow legacy search params just in case, but prefer cookie
      const tokenQuery = request.nextUrl.searchParams.get('token');
      if (tokenQuery && tokenQuery === process.env.ADMIN_TOKEN) {
        // Redireciona para salvar o cookie
        const response = NextResponse.redirect(new URL('/admin/agenda', request.url));
        response.cookies.set('admin_token', tokenQuery, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7, // 1 semana
        });
        return response;
      }
      
      // Redireciona para o login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Se tem cookie, verifica se é válido
    if (adminAuthCookie.value !== process.env.ADMIN_TOKEN) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_token');
      return response;
    }
  }

  // Protege a tela de login de quem já está logado
  if (path.startsWith('/admin/login')) {
    const adminAuthCookie = request.cookies.get('admin_token');
    if (adminAuthCookie && adminAuthCookie.value === process.env.ADMIN_TOKEN) {
      return NextResponse.redirect(new URL('/admin/agenda', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
