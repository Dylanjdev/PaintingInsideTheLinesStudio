-- One-time, idempotent repair for prices repeatedly multiplied by 100 by the
-- previous admin editor. Each current inflated value is included in the WHERE
-- clause so a price changed after this audit will not be overwritten.
UPDATE class_options SET price_cents = 3500 WHERE id = 64 AND price_cents = 3500000000;
UPDATE class_options SET price_cents = 6500 WHERE id = 65 AND price_cents = 6500000000;
UPDATE class_options SET price_cents = 6500 WHERE id = 66 AND price_cents = 6500000000;
UPDATE class_options SET price_cents = 6500 WHERE id = 67 AND price_cents = 6500000000;
UPDATE class_options SET price_cents = 6500 WHERE id = 58 AND price_cents = 6500000000;
UPDATE class_options SET price_cents = 6500 WHERE id = 71 AND price_cents = 65000000;
UPDATE class_options SET price_cents = 5000 WHERE id = 68 AND price_cents = 50000000;
UPDATE class_options SET price_cents = 4500 WHERE id = 69 AND price_cents = 45000000;
UPDATE class_options SET price_cents = 6500 WHERE id = 70 AND price_cents = 65000000;
UPDATE class_options SET price_cents = 3500 WHERE id = 59 AND price_cents = 35000000;
UPDATE class_options SET price_cents = 3500 WHERE id = 60 AND price_cents = 35000000;
UPDATE class_options SET price_cents = 3500 WHERE id = 61 AND price_cents = 35000000;
UPDATE class_options SET price_cents = 1500 WHERE id = 72 AND price_cents = 150000000000;
UPDATE class_options SET price_cents = 2000 WHERE id = 73 AND price_cents = 20000000000;
