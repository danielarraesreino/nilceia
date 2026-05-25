import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody(
      req,
      process.env.SANITY_REVALIDATE_SECRET
    );

    if (!isValidSignature) {
      return new Response('Invalid signature', { status: 401 });
    }

    if (!body?._type) {
      return new Response('Bad Request', { status: 400 });
    }

    revalidateTag(body._type);
    
    if (body._type === 'post') {
        revalidateTag('post');
    }

    return NextResponse.json({ status: 200, revalidated: true });
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
}
