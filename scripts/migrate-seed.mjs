// One-time migration: uploads existing class images to R2 and seeds D1 with
// the classes/options that used to be hardcoded in App.jsx.
// Run with: node scripts/migrate-seed.mjs [--remote]
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const remote = process.argv.includes('--remote') ? '--remote' : '--local';
const assetsDir = path.resolve('src/assets');

const images = [
  ['ladiesnightbluetruck.webp', 'ladiesnightbluetruck.webp'],
  ['ladiesnightchicken.webp', 'ladiesnightchicken.webp'],
  ['ladiesnightbootsdirty.webp', 'ladiesnightbootsdirty.webp'],
  ['ladiesnighthighlanderpurple.webp', 'ladiesnighthighlanderpurple.webp'],
  ['ladiesnighthighlandersunflower.webp', 'ladiesnighthighlandersunflower.webp'],
  ['cupofsunshine.webp', 'cupofsunshine.webp'],
  ['cactus.webp', 'cactus.webp'],
  ['barn.webp', 'barn.webp'],
  ['fence.webp', 'fence.webp'],
  ['springbird.webp', 'springbird.webp'],
  ['crushedglasschristmas.webp', 'crushedglasschristmas.webp'],
  ['sled.webp', 'sled.webp'],
  ['welcome.webp', 'welcome.webp'],
  ['11seasons.webp', '11seasons.webp'],
  ['rwb.webp', 'rwb.webp'],
  ['sand.webp', 'sand.webp'],
  ['slime.webp', 'slime.webp'],
  ['highlander.webp', 'highlander.webp'],
  ['cross crushed glass.webp', 'crushedglasscross.webp'],
  ['crushedglassflag.webp', 'crushedglassflag.webp'],
  ['CuttingBoard.webp', 'cuttingboard.webp'],
  ['sunflower.webp', 'sunflower.webp'],
  ['crushedglasscat.webp', 'crushedglasscat.webp'],
  ['crushedglassflowers.webp', 'crushedglassflowers.webp'],
  ['crushedglasshummingbird.webp', 'crushedglasshummingbird.webp'],
  ['beachblockparty.webp', 'beachblockparty.webp']
];

console.log(`Uploading ${images.length} images to R2 (${remote})...`);
for (const [srcName, key] of images) {
  const filePath = path.join(assetsDir, srcName);
  if (!fs.existsSync(filePath)) {
    console.warn(`  skip (missing): ${srcName}`);
    continue;
  }
  execFileSync('npx', ['wrangler', 'r2', 'object', 'put', `pits-images/${key}`, '--file', filePath, remote], {
    stdio: 'inherit'
  });
}

// title, description, schedule, gradient, darkText, featured, imageKey, imageAlt, bookingCta, location, options[]
const classes = [
  {
    title: 'Painting, Minigolf, laser tag',
    description: 'Day of fun lets help brighten up the space at Appalachian Asenso Mini Golf and Laser Tag in Pennington Gap, VA.',
    schedule: 'Jun 16, 2026 06:00pm - 08:00pm',
    featured: true,
    gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    options: [{ title: 'Painting, Minigolf, laser tag', priceCents: 3500 }]
  },
  {
    title: 'Ladies Night',
    description: 'An evening of art, laughter, and connection. Every Thursday at our Pennington Gap studio.',
    schedule: 'Every Thursday • 6:00 – 8:00 PM',
    featured: true,
    bookingCta: 'Choose Your Painting →',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    options: [
      { title: 'Blue Truck', priceCents: 3500, imageKey: 'ladiesnightbluetruck.webp', alt: 'Blue Truck Ladies Night painting' },
      { title: 'Chicken', priceCents: 3500, imageKey: 'ladiesnightchicken.webp', alt: 'Chicken Ladies Night painting' },
      { title: 'Boots Dirty', priceCents: 3500, imageKey: 'ladiesnightbootsdirty.webp', alt: 'Boots Dirty Ladies Night painting' },
      { title: 'High Lander Purple Flowers', priceCents: 3500, imageKey: 'ladiesnighthighlanderpurple.webp', alt: 'High Lander Purple Flowers Ladies Night painting' },
      { title: 'Highlander Sunflower', priceCents: 3500, imageKey: 'ladiesnighthighlandersunflower.webp', alt: 'Highlander Sunflower Ladies Night painting' },
      { title: 'Cup of Sunshine', priceCents: 3500, imageKey: 'cupofsunshine.webp', alt: 'Cup of Sunshine Ladies Night painting' },
      { title: 'Cactus', priceCents: 3500, imageKey: 'cactus.webp', alt: 'Cactus Ladies Night painting' },
      { title: 'Barn', priceCents: 3500, imageKey: 'barn.webp', alt: 'Barn Ladies Night painting' },
      { title: 'Fence', priceCents: 3500, imageKey: 'fence.webp', alt: 'Fence Ladies Night painting' },
      { title: 'Spring Bird', priceCents: 3500, imageKey: 'springbird.webp', alt: 'Spring Bird Ladies Night painting' }
    ]
  },
  {
    title: 'Crushed Glass',
    description: 'Choose between a 6 inch sunflower, 12 inch cat, 12 inch flowers, or 18 inch hummingbird in this guided crushed glass workshop.',
    schedule: 'Jul 25, 2026 04:00pm - 07:00pm',
    featured: true,
    bookingCta: 'Choose Your Project →',
    gradient: 'linear-gradient(135deg, #7f7fd5 0%, #86a8e7 50%, #91eae4 100%)',
    options: [
      { title: '6 inch Sunflower', priceCents: 3500, imageKey: 'sunflower.webp', alt: '6 inch sunflower crushed glass class project' },
      { title: '12 inch Cat', priceCents: 6500, imageKey: 'crushedglasscat.webp', alt: '12 inch cat crushed glass class project' },
      { title: '12 inch Flowers', priceCents: 6500, imageKey: 'crushedglassflowers.webp', alt: '12 inch flowers crushed glass class project' },
      { title: '18 inch Hummingbird', priceCents: 6500, imageKey: 'crushedglasshummingbird.webp', alt: '18 inch hummingbird crushed glass class project' }
    ]
  },
  {
    title: 'Crushed Glass Christmas Tree',
    description: 'Create a festive crushed glass Christmas tree with sparkle, texture, and guided studio instruction.',
    schedule: 'Jul 11, 2026 04:00pm - 07:00pm',
    featured: true,
    imageKey: 'crushedglasschristmas.webp',
    imageAlt: 'Crushed Glass Christmas Tree class project',
    gradient: 'linear-gradient(135deg, #0f766e 0%, #16a34a 50%, #dc2626 100%)',
    options: [{ title: 'Crushed Glass Christmas Tree', priceCents: 6500 }]
  },
  {
    title: 'Crushed Glass Cross',
    description: 'Create an Old Rugged Cross crushed glass project with guided studio instruction. $65 per person.',
    schedule: 'Aug 29, 2026 04:00pm - 07:00pm',
    featured: true,
    imageKey: 'crushedglasscross.webp',
    imageAlt: 'Old Rugged Cross crushed glass class project',
    gradient: 'linear-gradient(135deg, #334155 0%, #8b5e34 52%, #dbeafe 100%)',
    options: [{ title: 'Crushed Glass Cross', priceCents: 6500 }]
  },
  {
    title: 'Red, White & Blue Crushed Glass',
    description: 'Create a patriotic red, white, and blue crushed glass flag project with guided studio instruction. $65 per person.',
    schedule: 'Aug 15, 2026 04:00pm - 07:00pm',
    featured: true,
    imageKey: 'crushedglassflag.webp',
    imageAlt: 'Red, white, and blue crushed glass flag class project',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #ffffff 48%, #dc2626 100%)',
    darkText: true,
    options: [{ title: 'Red, White & Blue Crushed Glass', priceCents: 6500 }]
  },
  {
    title: 'Paint a Sled',
    description: 'Paint a seasonal sled project in a guided studio class. $50 per person.',
    schedule: 'Jul 18, 2026 04:00pm - 07:00pm',
    featured: true,
    imageKey: 'sled.webp',
    imageAlt: 'Paint a Sled class project',
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #b45309 50%, #facc15 100%)',
    options: [{ title: 'Paint a Sled', priceCents: 5000 }]
  },
  {
    title: 'Door Hanger Paint Party',
    description: 'Choose between an 18 inch Welcome Sign or an 11 Seasons Hanger in this guided paint party.',
    schedule: 'Jun 20, 2026 04:00pm - 06:00pm',
    featured: true,
    bookingCta: 'Choose Your Door Hanger →',
    gradient: 'linear-gradient(135deg, #065f46 0%, #0f766e 45%, #f59e0b 100%)',
    options: [
      { title: '18 inch Welcome Sign', priceCents: 4500, imageKey: 'welcome.webp', alt: '18 inch Welcome Sign door hanger project' },
      { title: '11 Seasons Hanger', priceCents: 6500, imageKey: '11seasons.webp', alt: '11 Seasons Hanger door hanger project' }
    ]
  },
  {
    title: 'Red White & Blue Paint Party',
    description: 'Create a patriotic red, white, and blue project in this guided paint party. $55 per person.',
    schedule: 'May 30, 2026 04:00pm - 06:00pm',
    featured: true,
    imageKey: 'rwb.webp',
    imageAlt: 'Red White and Blue Paint Party project',
    darkText: true,
    gradient: 'linear-gradient(135deg, #1d4ed8 0%, #ffffff 50%, #dc2626 100%)',
    options: [{ title: 'Red White & Blue Paint Party', priceCents: 5500 }]
  },
  {
    title: 'Slime & Sand Fun',
    description: 'Choose between a colorful sand bottle or a hands-on slime project in this creative workshop.',
    schedule: 'Jul 25, 2026 04:00pm - 06:00pm',
    featured: true,
    bookingCta: 'Choose Your Project →',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #84cc16 50%, #f97316 100%)',
    options: [
      { title: 'Sand Bottle', priceCents: 1500, imageKey: 'sand.webp', alt: 'Sand Bottle project' },
      { title: 'Slime', priceCents: 2000, imageKey: 'slime.webp', alt: 'Slime project' }
    ]
  },
  {
    title: 'Paint a Cutting Board',
    description: 'Pick your design and enjoy ice cream while you paint a cutting board at Small Town Scoops. All supplies included, no experience needed.',
    schedule: 'Jul 24, 2026 06:00pm - 08:00pm',
    featured: true,
    bookingCta: 'Choose Your Design →',
    darkText: true,
    imageKey: 'cuttingboard.webp',
    imageAlt: 'Paint a Cutting Board class flyer with bird and chicken design options',
    locationName: 'Small Town Scoops',
    locationStreet: '179 Chappell Dr Ste 202',
    locationCity: 'Jonesville',
    locationRegion: 'VA',
    locationPostal: '24263',
    gradient: 'linear-gradient(135deg, #f8fafc 0%, #f0b7a4 48%, #5f6f52 100%)',
    options: [
      { title: 'Humming Bird', priceCents: 3500, alt: 'Humming Bird cutting board design option' },
      { title: 'Chicken', priceCents: 3500, alt: 'Chicken cutting board design option' },
      { title: 'Cardinal', priceCents: 3500, alt: 'Cardinal cutting board design option' }
    ]
  },
  {
    title: 'Beach Block Party',
    description: 'Make colorful sand art or stretchy slime at this fun, hands-on beach-themed block party.',
    schedule: 'Aug 8, 2026 06:00pm - 08:00pm',
    featured: true,
    bookingCta: 'Choose Your Activity →',
    darkText: true,
    imageKey: 'beachblockparty.webp',
    imageAlt: 'Beach Block Party flyer featuring sand art and slime activities',
    gradient: 'linear-gradient(135deg, #fef3c7 0%, #22d3ee 48%, #fb7185 100%)',
    options: [
      { title: 'Beach Block Party Sand Art', priceCents: 1500 },
      { title: 'Beach Block Party Slime', priceCents: 2000 }
    ]
  },
  {
    title: 'Highlander Cow Paint Party',
    description: 'Paint a Highlander cow set against a patriotic American flag-inspired background, finished with bright floral details.',
    schedule: '2:30 PM - 4:30 PM',
    featured: true,
    imageKey: 'highlander.webp',
    imageAlt: 'Highlander cow painting with an American flag background and flowers',
    gradient: 'linear-gradient(135deg, #991b1b 0%, #ffffff 48%, #1e3a8a 100%)',
    darkText: true,
    options: [{ title: 'Highlander Cow Paint Party', priceCents: 5500 }]
  }
];

function esc(value) {
  if (value === undefined || value === null) return 'NULL';
  return `'${String(value).replace(/'/g, "''")}'`;
}

let sql = '';
classes.forEach((c, index) => {
  const classId = index + 1;
  sql += `INSERT INTO classes (id, title, description, schedule, location_name, location_street, location_city, location_region, location_postal, gradient, dark_text, featured, image_key, image_alt, booking_cta, sort_order)
VALUES (${classId}, ${esc(c.title)}, ${esc(c.description)}, ${esc(c.schedule)}, ${esc(c.locationName)}, ${esc(c.locationStreet)}, ${esc(c.locationCity)}, ${esc(c.locationRegion)}, ${esc(c.locationPostal)}, ${esc(c.gradient)}, ${c.darkText ? 1 : 0}, ${c.featured ? 1 : 0}, ${esc(c.imageKey)}, ${esc(c.imageAlt)}, ${esc(c.bookingCta)}, ${index});\n`;
  c.options.forEach((opt, i) => {
    sql += `INSERT INTO class_options (class_id, title, price_cents, image_key, alt, sort_order)
VALUES (${classId}, ${esc(opt.title)}, ${opt.priceCents}, ${esc(opt.imageKey)}, ${esc(opt.alt)}, ${i});\n`;
  });
});

const sqlPath = path.resolve('worker/seed.sql');
fs.writeFileSync(sqlPath, sql);
console.log(`Wrote ${sqlPath}, executing against D1 (${remote})...`);
execFileSync('npx', ['wrangler', 'd1', 'execute', 'pits-db', remote, '--file', sqlPath], { stdio: 'inherit' });
console.log('Done.');
