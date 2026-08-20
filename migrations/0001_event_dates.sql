ALTER TABLE classes ADD COLUMN start_at TEXT;
ALTER TABLE classes ADD COLUMN end_at TEXT;
ALTER TABLE classes ADD COLUMN updated_at TEXT;

UPDATE classes SET updated_at = created_at WHERE updated_at IS NULL;

UPDATE classes
SET start_at = '2026-09-05T16:00', end_at = '2026-09-05T19:00'
WHERE id = 3 AND title = 'Crushed Glass';

UPDATE classes
SET start_at = '2026-09-26T16:00', end_at = '2026-09-26T19:00'
WHERE id = 4 AND title = 'Crushed Glass Christmas Tree';

UPDATE classes
SET start_at = '2026-08-29T16:00', end_at = '2026-08-29T19:00'
WHERE id = 5 AND title = 'Crushed Glass Cross';
