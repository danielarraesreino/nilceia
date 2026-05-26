import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<any>(
      req,
      process.env.SANITY_REVALIDATE_SECRET
    );

    if (!isValidSignature) {
      return new Response('Invalid signature', { status: 401 });
    }

    if (!body?._type) {
      return new Response('Bad Request', { status: 400 });
    }

    revalidateTag(body._type, 'default');
    
    if (body._type === 'post') {
        revalidateTag('post', 'default');
    }

    return NextResponse.json({ status: 200, revalidated: true });
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
}
