import { NextRequest, NextResponse } from 'next/server';

const BACKEND = 'https://teamtaskmanagerassignment-production.up.railway.app';

async function handler(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const backendUrl = `${BACKEND}/${path.join('/')}`;

  // Forward the search params too
  const { search } = new URL(req.url);
  const targetUrl = search ? `${backendUrl}${search}` : backendUrl;

  const headers = new Headers();
  // Forward auth header if present
  const auth = req.headers.get('authorization');
  console.log('[proxy] method:', req.method, 'url:', targetUrl, 'auth:', auth ? 'present' : 'MISSING');
  if (auth) headers.set('authorization', auth);
  headers.set('content-type', req.headers.get('content-type') ?? 'application/json');

  const fetchOptions: RequestInit = {
    method: req.method,
    headers,
    redirect: 'follow',
    // Don't send body for GET/HEAD/OPTIONS
    ...(req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS'
      ? { body: await req.text() }
      : {}),
  };

  try {
    const res = await fetch(targetUrl, fetchOptions);
    const data = await res.text();

    return new NextResponse(data, {
      status: res.status,
      headers: { 'content-type': res.headers.get('content-type') ?? 'application/json' },
    });
  } catch (err) {
    console.error('[proxy] fetch failed:', err);
    return NextResponse.json({ detail: 'Proxy error — backend unreachable' }, { status: 502 });
  }
}

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const DELETE = handler;
export const OPTIONS = handler;
