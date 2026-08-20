import { createSessionCookie, clearSessionCookie, isAuthenticated } from './auth.js';
import { createCheckoutSession, verifyWebhookSignature } from './stripe.js';
import { centsToDollarInput, dollarsToCents, formatPrice } from './pricing.js';
import {
  canonicalRedirect,
  eventPath,
  normalizeDateTimeLocal,
  renderEventPage,
  renderSitemap,
  slugify
} from './seo.js';

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' };

function json(data, init = {}) {
  return new Response(JSON.stringify(data), { headers: JSON_HEADERS, ...init });
}

function imageUrl(key) {
  return key ? `/images/${key}` : null;
}

async function requireAuth(request, env) {
  if (!(await isAuthenticated(request, env))) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

// ─── Public: list classes + their options ───
async function handleGetClasses(env) {
  const { results: classRows } = await env.DB.prepare(
    'SELECT * FROM classes ORDER BY sort_order ASC, id ASC'
  ).all();

  const { results: optionRows } = await env.DB.prepare(
    'SELECT * FROM class_options ORDER BY sort_order ASC, id ASC'
  ).all();

  const optionsByClass = new Map();
  for (const opt of optionRows) {
    const list = optionsByClass.get(opt.class_id) || [];
    list.push({
      id: opt.id,
      title: opt.title,
      priceCents: opt.price_cents,
      price: formatPrice(opt.price_cents),
      image: imageUrl(opt.image_key),
      alt: opt.alt
    });
    optionsByClass.set(opt.class_id, list);
  }

  const classes = classRows.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    schedule: c.schedule,
    startAt: c.start_at,
    endAt: c.end_at,
    detailsUrl: eventPath(c),
    gradient: c.gradient,
    darkText: !!c.dark_text,
    featured: !!c.featured,
    bookingCta: c.booking_cta,
    booked: !!c.booked,
    bookedMessage: c.booked_message,
    image: imageUrl(c.image_key),
    imageAlt: c.image_alt,
    location: c.location_name ? {
      name: c.location_name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: c.location_street,
        addressLocality: c.location_city,
        addressRegion: c.location_region,
        postalCode: c.location_postal,
        addressCountry: 'US'
      }
    } : null,
    options: optionsByClass.get(c.id) || []
  }));

  return json(classes);
}

// ─── Public: create a Stripe Checkout session for one option ───
async function handleCheckout(request, env) {
  const { optionId, quantity } = await request.json().catch(() => ({}));
  if (!optionId) return json({ error: 'optionId is required' }, { status: 400 });

  const qty = Math.min(Math.max(Math.round(Number(quantity) || 1), 1), 20);

  const option = await env.DB.prepare(
    'SELECT class_options.*, classes.title AS class_title FROM class_options JOIN classes ON classes.id = class_options.class_id WHERE class_options.id = ?'
  ).bind(optionId).first();

  if (!option) return json({ error: 'Option not found' }, { status: 404 });

  const siteUrl = env.SITE_URL || new URL(request.url).origin;

  try {
    const session = await createCheckoutSession(env.STRIPE_SECRET_KEY, {
      className: option.class_title,
      optionTitle: option.title,
      priceCents: option.price_cents,
      quantity: qty,
      successUrl: `${siteUrl}/?checkout=success#classes`,
      cancelUrl: `${siteUrl}/?checkout=cancelled#classes`,
      metadata: {
        classId: String(option.class_id),
        classOptionId: String(option.id),
        classTitle: option.class_title,
        optionTitle: option.title,
        quantity: String(qty)
      }
    });
    return json({ url: session.url });
  } catch (err) {
    return json({ error: err.message }, { status: 502 });
  }
}

// ─── Admin: login/logout ───
async function handleAdminLogin(request, env) {
  const { password } = await request.json().catch(() => ({}));
  if (!password || password !== env.ADMIN_PASSWORD) {
    return json({ error: 'Incorrect password' }, { status: 401 });
  }
  const cookie = await createSessionCookie(env);
  return json({ ok: true }, { headers: { 'Set-Cookie': cookie } });
}

function handleAdminLogout() {
  return json({ ok: true }, { headers: { 'Set-Cookie': clearSessionCookie() } });
}

// ─── Admin: full class CRUD ───
async function handleAdminGetClasses(env) {
  const { results: classRows } = await env.DB.prepare(
    'SELECT * FROM classes ORDER BY sort_order ASC, id ASC'
  ).all();
  const { results: optionRows } = await env.DB.prepare(
    'SELECT * FROM class_options ORDER BY sort_order ASC, id ASC'
  ).all();

  const optionsByClass = new Map();
  for (const opt of optionRows) {
    const list = optionsByClass.get(opt.class_id) || [];
    list.push({
      id: opt.id,
      title: opt.title,
      priceDollars: centsToDollarInput(opt.price_cents),
      image: imageUrl(opt.image_key),
      imageKey: opt.image_key,
      alt: opt.alt,
      sortOrder: opt.sort_order
    });
    optionsByClass.set(opt.class_id, list);
  }

  const classes = classRows.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    schedule: c.schedule,
    startAt: c.start_at,
    endAt: c.end_at,
    gradient: c.gradient,
    darkText: !!c.dark_text,
    featured: !!c.featured,
    bookingCta: c.booking_cta,
    booked: !!c.booked,
    bookedMessage: c.booked_message,
    image: imageUrl(c.image_key),
    imageKey: c.image_key,
    imageAlt: c.image_alt,
    locationName: c.location_name,
    locationStreet: c.location_street,
    locationCity: c.location_city,
    locationRegion: c.location_region,
    locationPostal: c.location_postal,
    sortOrder: c.sort_order,
    options: optionsByClass.get(c.id) || []
  }));

  return json(classes);
}

function normalizeOptions(options) {
  if (!Array.isArray(options) || options.length === 0) return null;

  const normalized = options.map((opt) => {
    const title = typeof opt?.title === 'string' ? opt.title.trim() : '';
    const priceCents = dollarsToCents(opt?.priceDollars);
    if (!title || priceCents === null) return null;

    return {
      title,
      priceCents,
      imageKey: opt.imageKey || null,
      alt: opt.alt || null
    };
  });

  return normalized.some((opt) => opt === null) ? null : normalized;
}

function normalizeClassDates(body) {
  const startAt = normalizeDateTimeLocal(body.startAt);
  const endAt = normalizeDateTimeLocal(body.endAt);
  if (startAt === undefined || endAt === undefined) return null;
  if (endAt && !startAt) return null;
  if (startAt && endAt && endAt <= startAt) return null;
  return { startAt, endAt };
}

async function upsertOptions(env, classId, options, replace) {
  if (replace) {
    await env.DB.prepare('DELETE FROM class_options WHERE class_id = ?').bind(classId).run();
  }
  for (let i = 0; i < options.length; i++) {
    const opt = options[i];
    await env.DB.prepare(
      'INSERT INTO class_options (class_id, title, price_cents, image_key, alt, sort_order) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(classId, opt.title, opt.priceCents, opt.imageKey, opt.alt, i).run();
  }
}

async function handleAdminCreateClass(request, env) {
  const body = await request.json().catch(() => null);
  const options = normalizeOptions(body?.options);
  const dates = body ? normalizeClassDates(body) : null;
  if (!body || !body.title?.trim() || !options || !dates) {
    return json({ error: 'A title, valid event dates, and at least one option with a valid dollar price are required' }, { status: 400 });
  }

  const result = await env.DB.prepare(
    `INSERT INTO classes
      (title, description, schedule, start_at, end_at, location_name, location_street, location_city, location_region,
       location_postal, gradient, dark_text, featured, image_key, image_alt, booking_cta, booked, booked_message,
       sort_order, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
  ).bind(
    body.title.trim(),
    body.description || null,
    body.schedule || null,
    dates.startAt,
    dates.endAt,
    body.locationName || null,
    body.locationStreet || null,
    body.locationCity || null,
    body.locationRegion || null,
    body.locationPostal || null,
    body.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    body.darkText ? 1 : 0,
    body.featured ? 1 : 0,
    body.imageKey || null,
    body.imageAlt || null,
    body.bookingCta || null,
    body.booked ? 1 : 0,
    body.bookedMessage || null,
    Number.isFinite(body.sortOrder) ? body.sortOrder : 0
  ).run();

  const classId = result.meta.last_row_id;
  await upsertOptions(env, classId, options, false);

  return json({ id: classId }, { status: 201 });
}

async function handleAdminUpdateClass(request, env, id) {
  const body = await request.json().catch(() => null);
  if (!body) return json({ error: 'Invalid body' }, { status: 400 });

  const options = normalizeOptions(body.options);
  const dates = normalizeClassDates(body);
  if (!body.title?.trim() || !options || !dates) {
    return json({ error: 'A title, valid event dates, and at least one option with a valid dollar price are required' }, { status: 400 });
  }

  const existing = await env.DB.prepare('SELECT id FROM classes WHERE id = ?').bind(id).first();
  if (!existing) return json({ error: 'Class not found' }, { status: 404 });

  await env.DB.prepare(
    `UPDATE classes SET
      title = ?, description = ?, schedule = ?, start_at = ?, end_at = ?, location_name = ?, location_street = ?,
      location_city = ?, location_region = ?, location_postal = ?, gradient = ?, dark_text = ?,
      featured = ?, image_key = ?, image_alt = ?, booking_cta = ?, booked = ?, booked_message = ?, sort_order = ?,
      updated_at = datetime('now')
     WHERE id = ?`
  ).bind(
    body.title.trim(),
    body.description || null,
    body.schedule || null,
    dates.startAt,
    dates.endAt,
    body.locationName || null,
    body.locationStreet || null,
    body.locationCity || null,
    body.locationRegion || null,
    body.locationPostal || null,
    body.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    body.darkText ? 1 : 0,
    body.featured ? 1 : 0,
    body.imageKey || null,
    body.imageAlt || null,
    body.bookingCta || null,
    body.booked ? 1 : 0,
    body.bookedMessage || null,
    Number.isFinite(body.sortOrder) ? body.sortOrder : 0,
    id
  ).run();

  await upsertOptions(env, id, options, true);

  return json({ ok: true });
}

async function handleAdminDeleteClass(env, id) {
  await env.DB.prepare('DELETE FROM classes WHERE id = ?').bind(id).run();
  return json({ ok: true });
}

// ─── Admin: image upload to R2 ───
async function handleAdminUpload(request, env) {
  const form = await request.formData().catch(() => null);
  const file = form?.get('file');
  if (!file || typeof file === 'string') {
    return json({ error: 'No file uploaded' }, { status: 400 });
  }

  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const key = `${crypto.randomUUID()}.${ext}`;

  await env.IMAGES.put(key, file.stream(), {
    httpMetadata: { contentType: file.type || 'application/octet-stream' }
  });

  return json({ key, url: imageUrl(key) }, { status: 201 });
}

// ─── Serve uploaded images from R2 ───
async function handleServeImage(env, key) {
  const object = await env.IMAGES.get(key);
  if (!object) return new Response('Not found', { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  return new Response(object.body, { headers });
}

// ─── Stripe webhook: record completed checkouts as orders ───
async function handleStripeWebhook(request, env) {
  const rawBody = await request.text();
  let event;
  try {
    event = await verifyWebhookSignature(rawBody, request.headers.get('Stripe-Signature'), env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return json({ error: err.message }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const metadata = session.metadata || {};
    const fullNameField = (session.custom_fields || []).find((f) => f.key === 'full_name');
    const customerName = fullNameField?.text?.value || session.customer_details?.name || null;

    await env.DB.prepare(
      `INSERT INTO orders
        (stripe_session_id, class_id, class_option_id, class_title, option_title, amount_cents, currency, quantity, customer_name, customer_email, payment_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (stripe_session_id) DO NOTHING`
    ).bind(
      session.id,
      metadata.classId ? Number(metadata.classId) : null,
      metadata.classOptionId ? Number(metadata.classOptionId) : null,
      metadata.classTitle || null,
      metadata.optionTitle || null,
      session.amount_total ?? 0,
      session.currency || 'usd',
      metadata.quantity ? Number(metadata.quantity) : 1,
      customerName,
      session.customer_details?.email || null,
      session.payment_status || null
    ).run();
  }

  return json({ received: true });
}

// ─── Admin: list completed orders ───
async function handleAdminGetOrders(env) {
  const { results } = await env.DB.prepare(
    'SELECT * FROM orders ORDER BY created_at DESC LIMIT 500'
  ).all();

  const orders = results.map((o) => ({
    id: o.id,
    classTitle: o.class_title,
    optionTitle: o.option_title,
    quantity: o.quantity,
    amount: `$${(o.amount_cents / 100).toFixed(2)}`,
    customerName: o.customer_name,
    customerEmail: o.customer_email,
    paymentStatus: o.payment_status,
    createdAt: o.created_at
  }));

  return json(orders);
}

async function handleEventPage(request, env, id, requestedSlug) {
  const classItem = await env.DB.prepare('SELECT * FROM classes WHERE id = ?').bind(id).first();
  if (!classItem) {
    return new Response('Class or event not found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Robots-Tag': 'noindex' }
    });
  }

  const canonicalPath = eventPath(classItem);
  if (requestedSlug !== slugify(classItem.title) || new URL(request.url).pathname !== canonicalPath) {
    const siteOrigin = new URL(env.SITE_URL || request.url).origin;
    return Response.redirect(`${siteOrigin}${canonicalPath}`, 301);
  }

  const { results: options } = await env.DB.prepare(
    'SELECT * FROM class_options WHERE class_id = ? ORDER BY sort_order ASC, id ASC'
  ).bind(id).all();
  const html = renderEventPage(classItem, options, env.SITE_URL || new URL(request.url).origin);

  return new Response(request.method === 'HEAD' ? null : html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300'
    }
  });
}

async function handleSitemap(request, env) {
  const { results } = await env.DB.prepare(
    'SELECT id, title, created_at, updated_at FROM classes ORDER BY sort_order ASC, id ASC'
  ).all();
  const sitemap = renderSitemap(results, env.SITE_URL || new URL(request.url).origin);
  return new Response(request.method === 'HEAD' ? null : sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300'
    }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    const redirect = env.SITE_URL && request.cf?.colo
      ? canonicalRedirect(request.url, env.SITE_URL, request.headers.get('host'))
      : null;
    if (redirect) return Response.redirect(redirect, 301);

    try {
      if (pathname === '/sitemap.xml' && (request.method === 'GET' || request.method === 'HEAD')) {
        return await handleSitemap(request, env);
      }

      const eventMatch = pathname.match(/^\/events\/(\d+)\/([a-z0-9-]+)\/?$/);
      if (eventMatch && (request.method === 'GET' || request.method === 'HEAD')) {
        return await handleEventPage(request, env, Number(eventMatch[1]), eventMatch[2]);
      }

      if (pathname === '/api/classes' && request.method === 'GET') {
        return await handleGetClasses(env);
      }

      if (pathname === '/api/checkout' && request.method === 'POST') {
        return await handleCheckout(request, env);
      }

      if (pathname === '/api/stripe-webhook' && request.method === 'POST') {
        return await handleStripeWebhook(request, env);
      }

      if (pathname === '/api/admin/login' && request.method === 'POST') {
        return await handleAdminLogin(request, env);
      }

      if (pathname === '/api/admin/logout' && request.method === 'POST') {
        return handleAdminLogout();
      }

      if (pathname.startsWith('/api/admin/')) {
        const unauthorized = await requireAuth(request, env);
        if (unauthorized) return unauthorized;

        if (pathname === '/api/admin/classes' && request.method === 'GET') {
          return await handleAdminGetClasses(env);
        }
        if (pathname === '/api/admin/classes' && request.method === 'POST') {
          return await handleAdminCreateClass(request, env);
        }
        const classMatch = pathname.match(/^\/api\/admin\/classes\/(\d+)$/);
        if (classMatch && request.method === 'PUT') {
          return await handleAdminUpdateClass(request, env, Number(classMatch[1]));
        }
        if (classMatch && request.method === 'DELETE') {
          return await handleAdminDeleteClass(env, Number(classMatch[1]));
        }
        if (pathname === '/api/admin/upload' && request.method === 'POST') {
          return await handleAdminUpload(request, env);
        }
        if (pathname === '/api/admin/orders' && request.method === 'GET') {
          return await handleAdminGetOrders(env);
        }
      }

      const imageMatch = pathname.match(/^\/images\/([\w.-]+)$/);
      if (imageMatch && (request.method === 'GET' || request.method === 'HEAD')) {
        return await handleServeImage(env, imageMatch[1]);
      }
    } catch (err) {
      return json({ error: err.message || 'Server error' }, { status: 500 });
    }

    // Fall back to the built static site (React app) / admin page.
    return env.ASSETS.fetch(request);
  }
};
