var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// worker/auth.js
var COOKIE_NAME = "pits_admin";
var SESSION_MS = 1e3 * 60 * 60 * 12;
async function hmac(secret, message) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
__name(hmac, "hmac");
async function createSessionCookie(env) {
  const expires = Date.now() + SESSION_MS;
  const signature = await hmac(env.ADMIN_SECRET, String(expires));
  const value = `${expires}.${signature}`;
  const secure = env.ENVIRONMENT === "dev" ? "" : " Secure;";
  return `${COOKIE_NAME}=${value}; HttpOnly;${secure} SameSite=Strict; Path=/; Max-Age=${SESSION_MS / 1e3}`;
}
__name(createSessionCookie, "createSessionCookie");
function clearSessionCookie() {
  return `${COOKIE_NAME}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`;
}
__name(clearSessionCookie, "clearSessionCookie");
async function isAuthenticated(request, env) {
  const cookieHeader = request.headers.get("Cookie") || "";
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match) return false;
  const [expiresStr, signature] = match[1].split(".");
  const expires = Number(expiresStr);
  if (!expires || !signature || Date.now() > expires) return false;
  const expected = await hmac(env.ADMIN_SECRET, expiresStr);
  return expected === signature;
}
__name(isAuthenticated, "isAuthenticated");

// worker/stripe.js
var STRIPE_API = "https://api.stripe.com/v1";
function toFormBody(params, prefix = "") {
  const pairs = [];
  for (const [key, value] of Object.entries(params)) {
    const fullKey = prefix ? `${prefix}[${key}]` : key;
    if (value === void 0 || value === null) continue;
    if (typeof value === "object" && !Array.isArray(value)) {
      pairs.push(...toFormBody(value, fullKey));
    } else if (Array.isArray(value)) {
      value.forEach((item, i) => {
        if (typeof item === "object") {
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
__name(toFormBody, "toFormBody");
async function createCheckoutSession(secretKey, { className, optionTitle, priceCents, quantity, successUrl, cancelUrl, metadata }) {
  const productName = optionTitle && optionTitle !== className ? `${className} \u2014 ${optionTitle}` : className;
  const body = toFormBody({
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
    custom_fields: [
      {
        key: "full_name",
        label: { type: "custom", custom: "Full Name" },
        type: "text"
      }
    ],
    line_items: [
      {
        quantity: quantity || 1,
        price_data: {
          currency: "usd",
          unit_amount: priceCents,
          product_data: { name: productName }
        }
      }
    ]
  }).join("&");
  const res = await fetch(`${STRIPE_API}/checkout/sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || "Stripe request failed");
  }
  return data;
}
__name(createCheckoutSession, "createCheckoutSession");
async function verifyWebhookSignature(rawBody, signatureHeader, webhookSecret) {
  if (!signatureHeader) throw new Error("Missing Stripe-Signature header");
  const parts = Object.fromEntries(
    signatureHeader.split(",").map((pair) => pair.split("="))
  );
  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) throw new Error("Malformed Stripe-Signature header");
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(webhookSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${rawBody}`));
  const expected = [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
  if (expected !== signature) throw new Error("Signature mismatch");
  const ageSeconds = Date.now() / 1e3 - Number(timestamp);
  if (ageSeconds > 60 * 10) throw new Error("Webhook timestamp too old");
  return JSON.parse(rawBody);
}
__name(verifyWebhookSignature, "verifyWebhookSignature");

// worker/pricing.js
var DOLLAR_AMOUNT_PATTERN = /^\d+(?:\.\d{1,2})?$/;
function dollarsToCents(value) {
  const normalized = typeof value === "string" || typeof value === "number" ? String(value).trim() : "";
  if (!DOLLAR_AMOUNT_PATTERN.test(normalized)) return null;
  const [wholeDollars, fractionalDollars = ""] = normalized.split(".");
  const cents = Number(wholeDollars) * 100 + Number(fractionalDollars.padEnd(2, "0"));
  return Number.isSafeInteger(cents) && cents > 0 ? cents : null;
}
__name(dollarsToCents, "dollarsToCents");
function centsToDollarInput(cents) {
  if (!Number.isSafeInteger(cents) || cents < 0) return "";
  return (cents / 100).toFixed(2);
}
__name(centsToDollarInput, "centsToDollarInput");
function formatPrice(cents) {
  if (!Number.isSafeInteger(cents) || cents < 0) return "";
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}
__name(formatPrice, "formatPrice");

// worker/seo.js
var BUSINESS_NAME = "Painting Outside The Lines Studio";
var DEFAULT_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "140 Main Street",
  addressLocality: "Pennington Gap",
  addressRegion: "VA",
  postalCode: "24277",
  addressCountry: "US"
};
function slugify(value) {
  return String(value || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "class";
}
__name(slugify, "slugify");
function eventPath(classItem) {
  return `/events/${classItem.id}/${slugify(classItem.title)}`;
}
__name(eventPath, "eventPath");
function escapeHtml(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
__name(escapeHtml, "escapeHtml");
function escapeXml(value) {
  return escapeHtml(value);
}
__name(escapeXml, "escapeXml");
function safeJsonLd(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
__name(safeJsonLd, "safeJsonLd");
function normalizeDateTimeLocal(value) {
  if (value === null || value === void 0 || value === "") return null;
  const normalized = String(value).trim();
  const match = normalized.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!match) return void 0;
  const [, year, month, day, hour, minute] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute)));
  if (date.getUTCFullYear() !== Number(year) || date.getUTCMonth() + 1 !== Number(month) || date.getUTCDate() !== Number(day) || date.getUTCHours() !== Number(hour) || date.getUTCMinutes() !== Number(minute)) {
    return void 0;
  }
  return normalized;
}
__name(normalizeDateTimeLocal, "normalizeDateTimeLocal");
function canonicalRedirect(requestUrl, siteUrl, hostHeader = "") {
  const requestHost = String(hostHeader).split(":")[0].toLowerCase();
  if (requestHost === "localhost" || requestHost === "127.0.0.1" || requestHost === "[::1]") return null;
  const requested = new URL(requestUrl);
  const canonical = new URL(siteUrl);
  const isApex = requested.hostname === canonical.hostname;
  const isWww = requested.hostname === `www.${canonical.hostname}`;
  if (!isWww && !(isApex && requested.protocol !== canonical.protocol)) return null;
  const destination = new URL(requested.pathname + requested.search, canonical.origin);
  return destination.toString();
}
__name(canonicalRedirect, "canonicalRedirect");
function formatLocalDateTime(value) {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!match) return null;
  const [, year, month, day, hour, minute] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute)));
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}
__name(formatLocalDateTime, "formatLocalDateTime");
function localDateTimeWithOffset(value) {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!match) return value;
  const [, year, month, day, hour, minute] = match;
  const guess = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute)));
  const offsetName = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    timeZoneName: "longOffset"
  }).formatToParts(guess).find((part) => part.type === "timeZoneName")?.value;
  const offset = offsetName?.replace("GMT", "");
  return `${value}:00${offset || "-05:00"}`;
}
__name(localDateTimeWithOffset, "localDateTimeWithOffset");
function descriptionFor(classItem) {
  const raw = classItem.description || `Join us for ${classItem.title}, a guided creative experience in Pennington Gap, Virginia.`;
  return raw.length <= 155 ? raw : `${raw.slice(0, 152).trimEnd()}\u2026`;
}
__name(descriptionFor, "descriptionFor");
function absoluteImage(siteUrl, key) {
  return key ? `${siteUrl}/images/${encodeURIComponent(key)}` : `${siteUrl}/PaintingInsideTheStudio.png`;
}
__name(absoluteImage, "absoluteImage");
function addressFor(classItem) {
  if (!classItem.location_name) return DEFAULT_ADDRESS;
  return {
    "@type": "PostalAddress",
    streetAddress: classItem.location_street,
    addressLocality: classItem.location_city,
    addressRegion: classItem.location_region,
    postalCode: classItem.location_postal,
    addressCountry: "US"
  };
}
__name(addressFor, "addressFor");
function venueFor(classItem) {
  return {
    "@type": "Place",
    name: classItem.location_name || BUSINESS_NAME,
    address: addressFor(classItem)
  };
}
__name(venueFor, "venueFor");
function schemaFor(classItem, options, canonicalUrl, image) {
  const offers = options.map((option) => ({
    "@type": "Offer",
    name: option.title,
    url: canonicalUrl,
    price: (option.price_cents / 100).toFixed(2),
    priceCurrency: "USD",
    availability: classItem.booked ? "https://schema.org/SoldOut" : "https://schema.org/InStock"
  }));
  const organizer = {
    "@type": "Organization",
    name: BUSINESS_NAME,
    url: new URL("/", canonicalUrl).toString()
  };
  if (classItem.start_at) {
    return {
      "@context": "https://schema.org",
      "@type": "Event",
      name: classItem.title,
      description: classItem.description,
      image: [image],
      startDate: localDateTimeWithOffset(classItem.start_at),
      ...classItem.end_at ? { endDate: localDateTimeWithOffset(classItem.end_at) } : {},
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: venueFor(classItem),
      offers,
      organizer,
      url: canonicalUrl
    };
  }
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: classItem.title,
    description: classItem.description,
    image,
    url: canonicalUrl,
    provider: {
      "@type": "LocalBusiness",
      name: BUSINESS_NAME,
      address: DEFAULT_ADDRESS
    },
    offers
  };
}
__name(schemaFor, "schemaFor");
function renderEventPage(classItem, options, siteUrl) {
  const siteOrigin = new URL(siteUrl).origin;
  const canonicalUrl = `${siteOrigin}${eventPath(classItem)}`;
  const imageKey = classItem.image_key || options.find((option) => option.image_key)?.image_key;
  const image = absoluteImage(siteOrigin, imageKey);
  const description = descriptionFor(classItem);
  const title = `${classItem.title} in Pennington Gap, VA`;
  const dateLabel = formatLocalDateTime(classItem.start_at);
  const endLabel = formatLocalDateTime(classItem.end_at);
  const venueName = classItem.location_name || BUSINESS_NAME;
  const address = addressFor(classItem);
  const eventSchema = schemaFor(classItem, options, canonicalUrl, image);
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteOrigin}/` },
      { "@type": "ListItem", position: 2, name: "Classes & Events", item: `${siteOrigin}/#classes` },
      { "@type": "ListItem", position: 3, name: classItem.title, item: canonicalUrl }
    ]
  };
  const optionMarkup = options.map((option) => `
            <li>
              <span>${escapeHtml(option.title)}</span>
              <strong>${escapeHtml(`$${(option.price_cents / 100).toFixed(option.price_cents % 100 ? 2 : 0)}`)}</strong>
            </li>`).join("");
  const scheduleMarkup = dateLabel ? `<time datetime="${escapeHtml(localDateTimeWithOffset(classItem.start_at))}">${escapeHtml(dateLabel)}</time>${endLabel ? ` to <time datetime="${escapeHtml(localDateTimeWithOffset(classItem.end_at))}">${escapeHtml(endLabel)}</time>` : ""}` : escapeHtml(classItem.schedule || "Contact the studio for the next available date.");
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
    <link rel="icon" type="image/png" href="/PaintingInsideTheStudio.png">
    <link rel="apple-touch-icon" href="/PaintingInsideTheStudio.png">
    <link rel="manifest" href="/site.webmanifest">
    <meta name="theme-color" content="#111111">
    <meta property="og:type" content="${classItem.start_at ? "event" : "website"}">
    <meta property="og:site_name" content="${BUSINESS_NAME}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
    <meta property="og:image" content="${escapeHtml(image)}">
    <meta property="og:image:alt" content="${escapeHtml(classItem.image_alt || `${classItem.title} at ${BUSINESS_NAME}`)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${escapeHtml(image)}">
    <script type="application/ld+json">${safeJsonLd(eventSchema)}<\/script>
    <script type="application/ld+json">${safeJsonLd(breadcrumbSchema)}<\/script>
    <style>
      :root{color-scheme:light}*{box-sizing:border-box}body{margin:0;background:#f6f3ee;color:#161616;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.55}a{color:inherit}.nav,.page,.footer{width:min(100% - 2rem,64rem);margin:auto}.nav{display:flex;justify-content:space-between;align-items:center;padding:1.25rem 0}.nav a{text-decoration:none}.brand{font-weight:700}.page{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(18rem,.7fr);gap:3rem;padding:4rem 0 6rem}.eyebrow{text-transform:uppercase;letter-spacing:.12em;font-size:.75rem;font-weight:700;color:#6b645c}h1{font-size:clamp(2.5rem,8vw,5.5rem);letter-spacing:-.05em;line-height:.95;margin:.6rem 0 1.5rem}.lede{font-size:1.2rem;max-width:42rem}.details{margin:2rem 0;padding:1.5rem 0;border-block:1px solid #d7d0c7}.details p{margin:.5rem 0}.card{background:#fff;padding:1.5rem;border-radius:1.25rem;box-shadow:0 16px 45px rgba(0,0,0,.09)}.card img{width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:.8rem}.card ul{list-style:none;padding:0;margin:1.25rem 0}.card li{display:flex;justify-content:space-between;gap:1rem;padding:.75rem 0;border-bottom:1px solid #eee}.button{display:inline-flex;justify-content:center;width:100%;padding:.85rem 1rem;border-radius:999px;background:#111;color:#fff;text-decoration:none;font-weight:700}.footer{padding:2rem 0;border-top:1px solid #d7d0c7}@media(max-width:760px){.page{grid-template-columns:1fr;padding-top:2.5rem;gap:2rem}.nav{align-items:flex-start;gap:1rem}.nav a:last-child{text-align:right}}
    </style>
  </head>
  <body>
    <header class="nav"><a class="brand" href="/">${BUSINESS_NAME}</a><a href="/#classes">All classes &amp; events</a></header>
    <main class="page">
      <article>
        <p class="eyebrow">Painting class / Pennington Gap, Virginia</p>
        <h1>${escapeHtml(classItem.title)}</h1>
        <p class="lede">${escapeHtml(classItem.description || description)}</p>
        <section class="details" aria-label="Class details">
          <p><strong>When:</strong> ${scheduleMarkup}</p>
          <p><strong>Where:</strong> ${escapeHtml(venueName)}, ${escapeHtml(address.streetAddress)}, ${escapeHtml(address.addressLocality)}, ${escapeHtml(address.addressRegion)} ${escapeHtml(address.postalCode)}</p>
          <p><strong>What is included:</strong> Guided instruction and all painting supplies.</p>
        </section>
        <p>No painting experience is needed. Our instructor will guide you step by step so you can relax, create, and take home something you are proud of.</p>
      </article>
      <aside class="card" aria-label="Registration options">
        <img src="${escapeHtml(image)}" width="1032" height="1032" alt="${escapeHtml(classItem.image_alt || `${classItem.title} project`)}">
        <h2>${classItem.booked ? "Currently sold out" : "Choose your project"}</h2>
        <ul>${optionMarkup}</ul>
        <a class="button" href="/#classes">${classItem.booked ? "See other classes" : "Register on the class list"}</a>
      </aside>
    </main>
    <footer class="footer"><p>${BUSINESS_NAME} \xB7 140 Main Street, Pennington Gap, VA 24277 \xB7 <a href="tel:+12766908848">(276) 690-8848</a></p></footer>
  </body>
</html>`;
}
__name(renderEventPage, "renderEventPage");
function renderSitemap(classes, siteUrl) {
  const siteOrigin = new URL(siteUrl).origin;
  const staticUrls = [
    { path: "/", lastmod: "2026-08-20" },
    { path: "/journal/", lastmod: "2026-08-20" }
  ];
  const classUrls = classes.map((classItem) => ({
    path: eventPath(classItem),
    lastmod: String(classItem.updated_at || classItem.created_at || "").slice(0, 10) || null
  }));
  const entries = [...staticUrls, ...classUrls].map(({ path, lastmod }) => `  <url>
    <loc>${escapeXml(`${siteOrigin}${path}`)}</loc>${lastmod ? `
    <lastmod>${escapeXml(lastmod)}</lastmod>` : ""}
  </url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}
__name(renderSitemap, "renderSitemap");

// worker/index.js
var JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8" };
function json(data, init = {}) {
  return new Response(JSON.stringify(data), { headers: JSON_HEADERS, ...init });
}
__name(json, "json");
function imageUrl(key) {
  return key ? `/images/${key}` : null;
}
__name(imageUrl, "imageUrl");
async function requireAuth(request, env) {
  if (!await isAuthenticated(request, env)) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
__name(requireAuth, "requireAuth");
async function handleGetClasses(env) {
  const { results: classRows } = await env.DB.prepare(
    "SELECT * FROM classes ORDER BY sort_order ASC, id ASC"
  ).all();
  const { results: optionRows } = await env.DB.prepare(
    "SELECT * FROM class_options ORDER BY sort_order ASC, id ASC"
  ).all();
  const optionsByClass = /* @__PURE__ */ new Map();
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
        "@type": "PostalAddress",
        streetAddress: c.location_street,
        addressLocality: c.location_city,
        addressRegion: c.location_region,
        postalCode: c.location_postal,
        addressCountry: "US"
      }
    } : null,
    options: optionsByClass.get(c.id) || []
  }));
  return json(classes);
}
__name(handleGetClasses, "handleGetClasses");
async function handleCheckout(request, env) {
  const { optionId, quantity } = await request.json().catch(() => ({}));
  if (!optionId) return json({ error: "optionId is required" }, { status: 400 });
  const qty = Math.min(Math.max(Math.round(Number(quantity) || 1), 1), 20);
  const option = await env.DB.prepare(
    "SELECT class_options.*, classes.title AS class_title FROM class_options JOIN classes ON classes.id = class_options.class_id WHERE class_options.id = ?"
  ).bind(optionId).first();
  if (!option) return json({ error: "Option not found" }, { status: 404 });
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
__name(handleCheckout, "handleCheckout");
async function handleAdminLogin(request, env) {
  const { password } = await request.json().catch(() => ({}));
  if (!password || password !== env.ADMIN_PASSWORD) {
    return json({ error: "Incorrect password" }, { status: 401 });
  }
  const cookie = await createSessionCookie(env);
  return json({ ok: true }, { headers: { "Set-Cookie": cookie } });
}
__name(handleAdminLogin, "handleAdminLogin");
function handleAdminLogout() {
  return json({ ok: true }, { headers: { "Set-Cookie": clearSessionCookie() } });
}
__name(handleAdminLogout, "handleAdminLogout");
async function handleAdminGetClasses(env) {
  const { results: classRows } = await env.DB.prepare(
    "SELECT * FROM classes ORDER BY sort_order ASC, id ASC"
  ).all();
  const { results: optionRows } = await env.DB.prepare(
    "SELECT * FROM class_options ORDER BY sort_order ASC, id ASC"
  ).all();
  const optionsByClass = /* @__PURE__ */ new Map();
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
__name(handleAdminGetClasses, "handleAdminGetClasses");
function normalizeOptions(options) {
  if (!Array.isArray(options) || options.length === 0) return null;
  const normalized = options.map((opt) => {
    const title = typeof opt?.title === "string" ? opt.title.trim() : "";
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
__name(normalizeOptions, "normalizeOptions");
function normalizeClassDates(body) {
  const startAt = normalizeDateTimeLocal(body.startAt);
  const endAt = normalizeDateTimeLocal(body.endAt);
  if (startAt === void 0 || endAt === void 0) return null;
  if (endAt && !startAt) return null;
  if (startAt && endAt && endAt <= startAt) return null;
  return { startAt, endAt };
}
__name(normalizeClassDates, "normalizeClassDates");
async function upsertOptions(env, classId, options, replace) {
  if (replace) {
    await env.DB.prepare("DELETE FROM class_options WHERE class_id = ?").bind(classId).run();
  }
  for (let i = 0; i < options.length; i++) {
    const opt = options[i];
    await env.DB.prepare(
      "INSERT INTO class_options (class_id, title, price_cents, image_key, alt, sort_order) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(classId, opt.title, opt.priceCents, opt.imageKey, opt.alt, i).run();
  }
}
__name(upsertOptions, "upsertOptions");
async function handleAdminCreateClass(request, env) {
  const body = await request.json().catch(() => null);
  const options = normalizeOptions(body?.options);
  const dates = body ? normalizeClassDates(body) : null;
  if (!body || !body.title?.trim() || !options || !dates) {
    return json({ error: "A title, valid event dates, and at least one option with a valid dollar price are required" }, { status: 400 });
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
    body.gradient || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
__name(handleAdminCreateClass, "handleAdminCreateClass");
async function handleAdminUpdateClass(request, env, id) {
  const body = await request.json().catch(() => null);
  if (!body) return json({ error: "Invalid body" }, { status: 400 });
  const options = normalizeOptions(body.options);
  const dates = normalizeClassDates(body);
  if (!body.title?.trim() || !options || !dates) {
    return json({ error: "A title, valid event dates, and at least one option with a valid dollar price are required" }, { status: 400 });
  }
  const existing = await env.DB.prepare("SELECT id FROM classes WHERE id = ?").bind(id).first();
  if (!existing) return json({ error: "Class not found" }, { status: 404 });
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
    body.gradient || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
__name(handleAdminUpdateClass, "handleAdminUpdateClass");
async function handleAdminDeleteClass(env, id) {
  await env.DB.prepare("DELETE FROM classes WHERE id = ?").bind(id).run();
  return json({ ok: true });
}
__name(handleAdminDeleteClass, "handleAdminDeleteClass");
async function handleAdminUpload(request, env) {
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || typeof file === "string") {
    return json({ error: "No file uploaded" }, { status: 400 });
  }
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const key = `${crypto.randomUUID()}.${ext}`;
  await env.IMAGES.put(key, file.stream(), {
    httpMetadata: { contentType: file.type || "application/octet-stream" }
  });
  return json({ key, url: imageUrl(key) }, { status: 201 });
}
__name(handleAdminUpload, "handleAdminUpload");
async function handleServeImage(env, key) {
  const object = await env.IMAGES.get(key);
  if (!object) return new Response("Not found", { status: 404 });
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  return new Response(object.body, { headers });
}
__name(handleServeImage, "handleServeImage");
async function handleStripeWebhook(request, env) {
  const rawBody = await request.text();
  let event;
  try {
    event = await verifyWebhookSignature(rawBody, request.headers.get("Stripe-Signature"), env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return json({ error: err.message }, { status: 400 });
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const metadata = session.metadata || {};
    const fullNameField = (session.custom_fields || []).find((f) => f.key === "full_name");
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
      session.currency || "usd",
      metadata.quantity ? Number(metadata.quantity) : 1,
      customerName,
      session.customer_details?.email || null,
      session.payment_status || null
    ).run();
  }
  return json({ received: true });
}
__name(handleStripeWebhook, "handleStripeWebhook");
async function handleAdminGetOrders(env) {
  const { results } = await env.DB.prepare(
    "SELECT * FROM orders ORDER BY created_at DESC LIMIT 500"
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
__name(handleAdminGetOrders, "handleAdminGetOrders");
async function handleEventPage(request, env, id, requestedSlug) {
  const classItem = await env.DB.prepare("SELECT * FROM classes WHERE id = ?").bind(id).first();
  if (!classItem) {
    return new Response("Class or event not found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex" }
    });
  }
  const canonicalPath = eventPath(classItem);
  if (requestedSlug !== slugify(classItem.title) || new URL(request.url).pathname !== canonicalPath) {
    const siteOrigin = new URL(env.SITE_URL || request.url).origin;
    return Response.redirect(`${siteOrigin}${canonicalPath}`, 301);
  }
  const { results: options } = await env.DB.prepare(
    "SELECT * FROM class_options WHERE class_id = ? ORDER BY sort_order ASC, id ASC"
  ).bind(id).all();
  const html = renderEventPage(classItem, options, env.SITE_URL || new URL(request.url).origin);
  return new Response(request.method === "HEAD" ? null : html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300"
    }
  });
}
__name(handleEventPage, "handleEventPage");
async function handleSitemap(request, env) {
  const { results } = await env.DB.prepare(
    "SELECT id, title, created_at, updated_at FROM classes ORDER BY sort_order ASC, id ASC"
  ).all();
  const sitemap = renderSitemap(results, env.SITE_URL || new URL(request.url).origin);
  return new Response(request.method === "HEAD" ? null : sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300"
    }
  });
}
__name(handleSitemap, "handleSitemap");
var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;
    const redirect = env.SITE_URL && request.cf?.colo ? canonicalRedirect(request.url, env.SITE_URL, request.headers.get("host")) : null;
    if (redirect) return Response.redirect(redirect, 301);
    try {
      if (pathname === "/sitemap.xml" && (request.method === "GET" || request.method === "HEAD")) {
        return await handleSitemap(request, env);
      }
      const eventMatch = pathname.match(/^\/events\/(\d+)\/([a-z0-9-]+)\/?$/);
      if (eventMatch && (request.method === "GET" || request.method === "HEAD")) {
        return await handleEventPage(request, env, Number(eventMatch[1]), eventMatch[2]);
      }
      if (pathname === "/api/classes" && request.method === "GET") {
        return await handleGetClasses(env);
      }
      if (pathname === "/api/checkout" && request.method === "POST") {
        return await handleCheckout(request, env);
      }
      if (pathname === "/api/stripe-webhook" && request.method === "POST") {
        return await handleStripeWebhook(request, env);
      }
      if (pathname === "/api/admin/login" && request.method === "POST") {
        return await handleAdminLogin(request, env);
      }
      if (pathname === "/api/admin/logout" && request.method === "POST") {
        return handleAdminLogout();
      }
      if (pathname.startsWith("/api/admin/")) {
        const unauthorized = await requireAuth(request, env);
        if (unauthorized) return unauthorized;
        if (pathname === "/api/admin/classes" && request.method === "GET") {
          return await handleAdminGetClasses(env);
        }
        if (pathname === "/api/admin/classes" && request.method === "POST") {
          return await handleAdminCreateClass(request, env);
        }
        const classMatch = pathname.match(/^\/api\/admin\/classes\/(\d+)$/);
        if (classMatch && request.method === "PUT") {
          return await handleAdminUpdateClass(request, env, Number(classMatch[1]));
        }
        if (classMatch && request.method === "DELETE") {
          return await handleAdminDeleteClass(env, Number(classMatch[1]));
        }
        if (pathname === "/api/admin/upload" && request.method === "POST") {
          return await handleAdminUpload(request, env);
        }
        if (pathname === "/api/admin/orders" && request.method === "GET") {
          return await handleAdminGetOrders(env);
        }
      }
      const imageMatch = pathname.match(/^\/images\/([\w.-]+)$/);
      if (imageMatch && (request.method === "GET" || request.method === "HEAD")) {
        return await handleServeImage(env, imageMatch[1]);
      }
    } catch (err) {
      return json({ error: err.message || "Server error" }, { status: 500 });
    }
    return env.ASSETS.fetch(request);
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    const body = JSON.stringify(error);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-YRHnTL/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-YRHnTL/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
