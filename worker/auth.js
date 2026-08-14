// Signed-cookie admin auth (HMAC-SHA256 over an expiry timestamp).
const COOKIE_NAME = 'pits_admin';
const SESSION_MS = 1000 * 60 * 60 * 12; // 12 hours

async function hmac(secret, message) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function createSessionCookie(env) {
  const expires = Date.now() + SESSION_MS;
  const signature = await hmac(env.ADMIN_SECRET, String(expires));
  const value = `${expires}.${signature}`;
  const secure = env.ENVIRONMENT === 'dev' ? '' : ' Secure;';
  return `${COOKIE_NAME}=${value}; HttpOnly;${secure} SameSite=Strict; Path=/; Max-Age=${SESSION_MS / 1000}`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`;
}

export async function isAuthenticated(request, env) {
  const cookieHeader = request.headers.get('Cookie') || '';
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match) return false;

  const [expiresStr, signature] = match[1].split('.');
  const expires = Number(expiresStr);
  if (!expires || !signature || Date.now() > expires) return false;

  const expected = await hmac(env.ADMIN_SECRET, expiresStr);
  return expected === signature;
}
