import { getReleaseStatus } from '../../src/data/releaseStatus';

interface ReleaseStatusContext {
  request: Request;
}

export async function onRequest(context: ReleaseStatusContext): Promise<Response> {
  if (context.request.method !== 'GET') {
    return jsonResponse(
      { ok: false, message: 'Method not allowed.' },
      { status: 405, headers: { Allow: 'GET' } },
    );
  }

  const status = await getReleaseStatus();

  return jsonResponse(status, {
    headers: {
      'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
    },
  });
}

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json; charset=utf-8');

  return new Response(JSON.stringify(body), {
    ...init,
    headers,
  });
}
