interface Env {
  BUTTONDOWN_API_KEY?: string;
  BUTTONDOWN_CONTEXT?: string;
}

interface SubscribeContext {
  request: Request;
  env: Env;
}

interface SubscribePayload {
  email?: unknown;
  source?: unknown;
  referrer?: unknown;
  company?: unknown;
}

const BUTTONDOWN_SUBSCRIBERS_URL =
  'https://api.buttondown.com/v1/subscribers';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUCCESS_MESSAGE = 'Check your email to confirm your subscription.';
const INVALID_EMAIL_MESSAGE = 'Enter a valid email address.';
const NOT_CONFIGURED_MESSAGE = 'Newsletter signup is not configured yet.';
const UNAVAILABLE_MESSAGE = 'Newsletter signup is unavailable right now.';

export async function onRequest(context: SubscribeContext): Promise<Response> {
  if (context.request.method !== 'POST') {
    return jsonResponse(
      { ok: false, message: 'Method not allowed.' },
      { status: 405, headers: { Allow: 'POST' } },
    );
  }

  const payload = await readPayload(context.request);
  const honeypot = textValue(payload.company);

  if (honeypot.length > 0) {
    return jsonResponse({ ok: true, message: SUCCESS_MESSAGE });
  }

  const email = textValue(payload.email).toLowerCase();

  if (!EMAIL_PATTERN.test(email)) {
    return jsonResponse(
      { ok: false, message: INVALID_EMAIL_MESSAGE },
      { status: 400 },
    );
  }

  const apiKey = context.env.BUTTONDOWN_API_KEY?.trim();

  if (!apiKey) {
    return jsonResponse(
      { ok: false, message: NOT_CONFIGURED_MESSAGE },
      { status: 500 },
    );
  }

  const source = normalizeSource(payload.source);
  const referrerUrl =
    textValue(payload.referrer) || context.request.headers.get('Referer') || '';
  const ipAddress = context.request.headers.get('CF-Connecting-IP') || '';

  const buttondownPayload: Record<string, unknown> = {
    email_address: email,
    tags: ['ultraviolet', 'website', `source:${source}`],
    metadata: {
      site: 'ultraviolet-lang.org',
      source,
    },
  };

  if (referrerUrl) {
    buttondownPayload.referrer_url = referrerUrl;
  }

  if (ipAddress) {
    buttondownPayload.ip_address = ipAddress;
  }

  try {
    const headers = new Headers({
      Authorization: `Token ${apiKey}`,
      'Content-Type': 'application/json',
      'X-Buttondown-Collision-Behavior': 'add',
    });
    const buttondownContext = context.env.BUTTONDOWN_CONTEXT?.trim();

    if (buttondownContext) {
      headers.set('Buttondown-Context', buttondownContext);
    }

    const response = await fetch(BUTTONDOWN_SUBSCRIBERS_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(buttondownPayload),
    });

    if (response.ok) {
      return jsonResponse({ ok: true, message: SUCCESS_MESSAGE });
    }

    const bodyText = await response.text();

    if (isDuplicateResponse(response.status, bodyText)) {
      return jsonResponse({ ok: true, message: SUCCESS_MESSAGE });
    }

    console.error('Buttondown subscriber create failed', {
      status: response.status,
      body: bodyText,
    });

    return jsonResponse(
      { ok: false, message: UNAVAILABLE_MESSAGE },
      { status: 502 },
    );
  } catch (error) {
    console.error('Buttondown subscriber create errored', error);

    return jsonResponse(
      { ok: false, message: UNAVAILABLE_MESSAGE },
      { status: 502 },
    );
  }
}

async function readPayload(request: Request): Promise<SubscribePayload> {
  const contentType = request.headers.get('Content-Type') || '';

  if (contentType.includes('application/json')) {
    try {
      return (await request.json()) as SubscribePayload;
    } catch {
      return {};
    }
  }

  if (
    contentType.includes('application/x-www-form-urlencoded') ||
    contentType.includes('multipart/form-data')
  ) {
    const formData = await request.formData();
    return Object.fromEntries(formData.entries()) as SubscribePayload;
  }

  return {};
}

function textValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeSource(value: unknown): string {
  const source = textValue(value)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);

  return source || 'unknown';
}

function isDuplicateResponse(status: number, bodyText: string): boolean {
  if (status !== 400 && status !== 409) {
    return false;
  }

  return /already|duplicate|exist|conflict/i.test(bodyText);
}

function jsonResponse(
  body: Record<string, unknown>,
  init: ResponseInit = {},
): Response {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('Cache-Control', 'no-store');

  return new Response(JSON.stringify(body), {
    ...init,
    headers,
  });
}
