import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canonicalRedirect,
  escapeHtml,
  eventPath,
  normalizeDateTimeLocal,
  renderEventPage,
  renderSitemap,
  safeJsonLd,
  slugify
} from './seo.js';

test('slugifies class titles into stable paths', () => {
  assert.equal(slugify('Red, White & Blue Crushed Glass'), 'red-white-and-blue-crushed-glass');
  assert.equal(eventPath({ id: 12, title: 'Sand & Slime' }), '/events/12/sand-and-slime');
});

test('validates browser datetime-local values', () => {
  assert.equal(normalizeDateTimeLocal('2026-09-05T16:00'), '2026-09-05T16:00');
  assert.equal(normalizeDateTimeLocal(''), null);
  assert.equal(normalizeDateTimeLocal('2026-02-30T16:00'), undefined);
  assert.equal(normalizeDateTimeLocal('Sept 5 at 4pm'), undefined);
});

test('redirects only canonical host variants', () => {
  const site = 'https://paintingoutsidethelinesstudios.com';
  assert.equal(
    canonicalRedirect('http://paintingoutsidethelinesstudios.com/classes?q=1', site),
    'https://paintingoutsidethelinesstudios.com/classes?q=1'
  );
  assert.equal(
    canonicalRedirect('https://www.paintingoutsidethelinesstudios.com/journal/', site),
    'https://paintingoutsidethelinesstudios.com/journal/'
  );
  assert.equal(canonicalRedirect('https://paintingoutsidethelinesstudios.com/', site), null);
  assert.equal(canonicalRedirect('http://localhost:8787/', site), null);
  assert.equal(canonicalRedirect('http://paintingoutsidethelinesstudios.com/', site, 'localhost:8787'), null);
});

test('escapes markup and JSON script endings', () => {
  assert.equal(escapeHtml('<script>"x" & y</script>'), '&lt;script&gt;&quot;x&quot; &amp; y&lt;/script&gt;');
  assert.doesNotMatch(safeJsonLd({ name: '</script>' }), /</);
});

test('renders a unique indexable event page and sitemap entry', () => {
  const classItem = {
    id: 3,
    title: 'Crushed Glass',
    description: 'A guided workshop.',
    start_at: '2026-09-05T16:00',
    end_at: '2026-09-05T19:00',
    schedule: 'September 5, 4–7 PM',
    booked: 0,
    created_at: '2026-08-01 10:00:00',
    updated_at: '2026-08-20 10:00:00'
  };
  const options = [{ title: 'Sunflower', price_cents: 3500, image_key: null }];
  const page = renderEventPage(classItem, options, 'https://paintingoutsidethelinesstudios.com');
  assert.match(page, /<link rel="canonical" href="https:\/\/paintingoutsidethelinesstudios\.com\/events\/3\/crushed-glass">/);
  assert.match(page, /"@type":"Event"/);
  assert.match(page, /"startDate":"2026-09-05T16:00:00-04:00"/);
  assert.match(page, /\$35/);

  const sitemap = renderSitemap([classItem], 'https://paintingoutsidethelinesstudios.com');
  assert.match(sitemap, /events\/3\/crushed-glass/);
  assert.match(sitemap, /2026-08-20/);
});
