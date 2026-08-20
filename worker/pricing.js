const DOLLAR_AMOUNT_PATTERN = /^\d+(?:\.\d{1,2})?$/;

export function dollarsToCents(value) {
  const normalized = typeof value === 'string' || typeof value === 'number'
    ? String(value).trim()
    : '';

  if (!DOLLAR_AMOUNT_PATTERN.test(normalized)) return null;

  const [wholeDollars, fractionalDollars = ''] = normalized.split('.');
  const cents = Number(wholeDollars) * 100 + Number(fractionalDollars.padEnd(2, '0'));

  return Number.isSafeInteger(cents) && cents > 0 ? cents : null;
}

export function centsToDollarInput(cents) {
  if (!Number.isSafeInteger(cents) || cents < 0) return '';
  return (cents / 100).toFixed(2);
}

export function formatPrice(cents) {
  if (!Number.isSafeInteger(cents) || cents < 0) return '';
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}
