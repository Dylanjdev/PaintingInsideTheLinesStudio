CREATE TABLE IF NOT EXISTS classes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  schedule TEXT,
  location_name TEXT,
  location_street TEXT,
  location_city TEXT,
  location_region TEXT,
  location_postal TEXT,
  gradient TEXT,
  dark_text INTEGER NOT NULL DEFAULT 0,
  featured INTEGER NOT NULL DEFAULT 0,
  image_key TEXT,
  image_alt TEXT,
  booking_cta TEXT,
  booked INTEGER NOT NULL DEFAULT 0,
  booked_message TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS class_options (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  image_key TEXT,
  alt TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_class_options_class_id ON class_options(class_id);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stripe_session_id TEXT NOT NULL UNIQUE,
  class_id INTEGER,
  class_option_id INTEGER,
  class_title TEXT,
  option_title TEXT,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  quantity INTEGER NOT NULL DEFAULT 1,
  customer_name TEXT,
  customer_email TEXT,
  payment_status TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
