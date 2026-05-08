import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    const sanityWriteClient = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fallback',
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      apiVersion: '2024-01-01',
      useCdn: false,
      token: process.env.SANITY_WRITE_TOKEN,
    });

    const body = await req.json();
    const { postId, text, name: anonName, email: anonEmail } = body;

    if (!postId || !text) {
      return NextResponse.json({ message: 'Dados incompletos.' }, { status: 400 });
    }

    let commentData: any = {
      _type: 'comment',
      post: {
        _type: 'reference',
        _ref: postId,
      },
      text: text,
      createdAt: new Date().toISOString(),
    };

    if (session?.user) {
      // Usuário logado via Rede Social
      commentData.name = session.user.name;
      commentData.email = session.user.email;
      commentData.userImage = session.user.image;
      commentData.isAnonymous = false;
      commentData.approved = true; // Auto-aprovado se estiver logado
    } else {
      // Usuário anônimo
      if (!anonName) {
        return NextResponse.json({ message: 'Nome é obrigatório para comentários anônimos.' }, { status: 400 });
      }
      commentData.name = anonName;
      commentData.email = anonEmail;
      commentData.isAnonymous = true;
      commentData.approved = false; // Requer moderação
    }

    await sanityWriteClient.create(commentData);

    return NextResponse.json({
      message: commentData.approved 
        ? 'Comentário publicado com sucesso!' 
        : 'Comentário enviado! Aparecerá após a moderação. 💛',
    });
  } catch (err) {
    console.error('[Comments API] Erro:', err);
    return NextResponse.json(
      { message: 'Erro interno no servidor. Tente novamente.' },
      { status: 500 }
    );
  }
}
