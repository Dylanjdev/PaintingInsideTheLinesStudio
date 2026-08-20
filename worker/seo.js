const BUSINESS_NAME = 'Painting Outside The Lines Studio';
const DEFAULT_ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: '140 Main Street',
  addressLocality: 'Pennington Gap',
  addressRegion: 'VA',
  postalCode: '24277',
  addressCountry: 'US'
};

export function slugify(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'class';
}

export function eventPath(classItem) {
  return `/events/${classItem.id}/${slugify(classItem.title)}`;
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function escapeXml(value) {
  return escapeHtml(value);
}

export function safeJsonLd(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function normalizeDateTimeLocal(value) {
  if (value === null || value === undefined || value === '') return null;
  const normalized = String(value).trim();
  const match = normalized.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!match) return undefined;

  const [, year, month, day, hour, minute] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute)));
  if (
    date.getUTCFullYear() !== Number(year) ||
    date.getUTCMonth() + 1 !== Number(month) ||
    date.getUTCDate() !== Number(day) ||
    date.getUTCHours() !== Number(hour) ||
    date.getUTCMinutes() !== Number(minute)
  ) {
    return undefined;
  }

  return normalized;
}

export function canonicalRedirect(requestUrl, siteUrl, hostHeader = '') {
  const requestHost = String(hostHeader).split(':')[0].toLowerCase();
  if (requestHost === 'localhost' || requestHost === '127.0.0.1' || requestHost === '[::1]') return null;
  const requested = new URL(requestUrl);
  const canonical = new URL(siteUrl);
  const isApex = requested.hostname === canonical.hostname;
  const isWww = requested.hostname === `www.${canonical.hostname}`;

  if (!isWww && !(isApex && requested.protocol !== canonical.protocol)) return null;

  const destination = new URL(requested.pathname + requested.search, canonical.origin);
  return destination.toString();
}

function formatLocalDateTime(value) {
  const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!match) return null;
  const [, year, month, day, hour, minute] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute)));
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date);
}

function localDateTimeWithOffset(value) {
  const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!match) return value;
  const [, year, month, day, hour, minute] = match;
  const guess = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute)));
  const offsetName = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    timeZoneName: 'longOffset'
  }).formatToParts(guess).find((part) => part.type === 'timeZoneName')?.value;
  const offset = offsetName?.replace('GMT', '');
  return `${value}:00${offset || '-05:00'}`;
}

function descriptionFor(classItem) {
  const raw = classItem.description || `Join us for ${classItem.title}, a guided creative experience in Pennington Gap, Virginia.`;
  return raw.length <= 155 ? raw : `${raw.slice(0, 152).trimEnd()}…`;
}

function absoluteImage(siteUrl, key) {
  return key ? `${siteUrl}/images/${encodeURIComponent(key)}` : `${siteUrl}/PaintingInsideTheStudio.png`;
}

function addressFor(classItem) {
  if (!classItem.location_name) return DEFAULT_ADDRESS;
  return {
    '@type': 'PostalAddress',
    streetAddress: classItem.location_street,
    addressLocality: classItem.location_city,
    addressRegion: classItem.location_region,
    postalCode: classItem.location_postal,
    addressCountry: 'US'
  };
}

function venueFor(classItem) {
  return {
    '@type': 'Place',
    name: classItem.location_name || BUSINESS_NAME,
    address: addressFor(classItem)
  };
}

function schemaFor(classItem, options, canonicalUrl, image) {
  const offers = options.map((option) => ({
    '@type': 'Offer',
    name: option.title,
    url: canonicalUrl,
    price: (option.price_cents / 100).toFixed(2),
    priceCurrency: 'USD',
    availability: classItem.booked ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock'
  }));

  const organizer = {
    '@type': 'Organization',
    name: BUSINESS_NAME,
    url: new URL('/', canonicalUrl).toString()
  };

  if (classItem.start_at) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: classItem.title,
      description: classItem.description,
      image: [image],
      startDate: localDateTimeWithOffset(classItem.start_at),
      ...(classItem.end_at ? { endDate: localDateTimeWithOffset(classItem.end_at) } : {}),
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: venueFor(classItem),
      offers,
      organizer,
      url: canonicalUrl
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: classItem.title,
    description: classItem.description,
    image,
    url: canonicalUrl,
    provider: {
      '@type': 'LocalBusiness',
      name: BUSINESS_NAME,
      address: DEFAULT_ADDRESS
    },
    offers
  };
}

export function renderEventPage(classItem, options, siteUrl) {
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
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteOrigin}/` },
      { '@type': 'ListItem', position: 2, name: 'Classes & Events', item: `${siteOrigin}/#classes` },
      { '@type': 'ListItem', position: 3, name: classItem.title, item: canonicalUrl }
    ]
  };
  const optionMarkup = options.map((option) => `
            <li>
              <span>${escapeHtml(option.title)}</span>
              <strong>${escapeHtml(`$${(option.price_cents / 100).toFixed(option.price_cents % 100 ? 2 : 0)}`)}</strong>
            </li>`).join('');
  const scheduleMarkup = dateLabel
    ? `<time datetime="${escapeHtml(localDateTimeWithOffset(classItem.start_at))}">${escapeHtml(dateLabel)}</time>${endLabel ? ` to <time datetime="${escapeHtml(localDateTimeWithOffset(classItem.end_at))}">${escapeHtml(endLabel)}</time>` : ''}`
    : escapeHtml(classItem.schedule || 'Contact the studio for the next available date.');

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
    <meta property="og:type" content="${classItem.start_at ? 'event' : 'website'}">
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
    <script type="application/ld+json">${safeJsonLd(eventSchema)}</script>
    <script type="application/ld+json">${safeJsonLd(breadcrumbSchema)}</script>
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
        <h2>${classItem.booked ? 'Currently sold out' : 'Choose your project'}</h2>
        <ul>${optionMarkup}</ul>
        <a class="button" href="/#classes">${classItem.booked ? 'See other classes' : 'Register on the class list'}</a>
      </aside>
    </main>
    <footer class="footer"><p>${BUSINESS_NAME} · 140 Main Street, Pennington Gap, VA 24277 · <a href="tel:+12766908848">(276) 690-8848</a></p></footer>
  </body>
</html>`;
}

export function renderSitemap(classes, siteUrl) {
  const siteOrigin = new URL(siteUrl).origin;
  const staticUrls = [
    { path: '/', lastmod: '2026-08-20' },
    { path: '/journal/', lastmod: '2026-08-20' }
  ];
  const classUrls = classes.map((classItem) => ({
    path: eventPath(classItem),
    lastmod: String(classItem.updated_at || classItem.created_at || '').slice(0, 10) || null
  }));
  const entries = [...staticUrls, ...classUrls].map(({ path, lastmod }) => `  <url>\n    <loc>${escapeXml(`${siteOrigin}${path}`)}</loc>${lastmod ? `\n    <lastmod>${escapeXml(lastmod)}</lastmod>` : ''}\n  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}
