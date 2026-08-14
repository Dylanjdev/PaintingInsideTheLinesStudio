// Minimal Stripe REST client using fetch (works in the Workers runtime).
const STRIPE_API = 'https://api.stripe.com/v1';

function toFormBody(params, prefix = '') {
  const pairs = [];
  for (const [key, value] of Object.entries(params)) {
    const fullKey = prefix ? `${prefix}[${key}]` : key;
    if (value === undefined || value === null) continue;
    if (typeof value === 'object' && !Array.isArray(value)) {
      pairs.push(...toFormBody(value, fullKey));
    } else if (Array.isArray(value)) {
      value.forEach((item, i) => {
        if (typeof item === 'object') {
          pairs.push(...toFormBody(item, `${fullKey}[${i}]`));
        } else {
          pairs.push(`${encodeURIComponent(`${fullKey}[${i}]`)}=${encodeURIComponent(item)}`);
        }
      });
    } else {
      pairs.push(`${encodeURIComponent(fullKey)}=${encodeURIComponent(value)}`);
    }
  }
  return pairs;
}

export async function createCheckoutSession(secretKey, { className, optionTitle, priceCents, quantity, successUrl, cancelUrl, metadata }) {
  const productName = optionTitle && optionTitle !== className
    ? `${className} — ${optionTitle}`
    : className;

  const body = toFormBody({
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
    custom_fields: [
      {
        key: 'full_name',
        label: { type: 'custom', custom: 'Full Name' },
        type: 'text'
      }
    ],
    line_items: [
      {
        quantity: quantity || 1,
        price_data: {
          currency: 'usd',
          unit_amount: priceCents,
          product_data: { name: productName }
        }
      }
    ]
  }).join('&');

  const res = await fetch(`${STRIPE_API}/checkout/sessions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || 'Stripe request failed');
  }
  return data;
}

// Verifies a Stripe webhook signature (HMAC-SHA256 over "timestamp.payload") and
// returns the parsed event, or throws if the signature is missing/invalid/stale.
export async function verifyWebhookSignature(rawBody, signatureHeader, webhookSecret) {
  if (!signatureHeader) throw new Error('Missing Stripe-Signature header');

  const parts = Object.fromEntries(
    signatureHeader.split(',').map((pair) => pair.split('='))
  );
  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) throw new Error('Malformed Stripe-Signature header');

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(webhookSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${timestamp}.${rawBody}`));
  const expected = [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');

  if (expected !== signature) throw new Error('Signature mismatch');

  const ageSeconds = Date.now() / 1000 - Number(timestamp);
  if (ageSeconds > 60 * 10) throw new Error('Webhook timestamp too old');

  return JSON.parse(rawBody);
}

