import test from 'node:test';
import assert from 'node:assert/strict';
import { centsToDollarInput, dollarsToCents, formatPrice } from './pricing.js';

test('converts dollar input to integer cents exactly once', () => {
  assert.equal(dollarsToCents('35'), 3500);
  assert.equal(dollarsToCents('35.5'), 3550);
  assert.equal(dollarsToCents('35.50'), 3550);
  assert.equal(dollarsToCents(65), 6500);
});

test('rejects invalid dollar input', () => {
  assert.equal(dollarsToCents(''), null);
  assert.equal(dollarsToCents('0'), null);
  assert.equal(dollarsToCents('-1'), null);
  assert.equal(dollarsToCents('35.999'), null);
  assert.equal(dollarsToCents('$35'), null);
  assert.equal(dollarsToCents(Number.POSITIVE_INFINITY), null);
});

test('formats stored cents for editing and display', () => {
  assert.equal(centsToDollarInput(3500), '35.00');
  assert.equal(centsToDollarInput(3550), '35.50');
  assert.equal(formatPrice(3500), '$35');
  assert.equal(formatPrice(3550), '$35.50');
});
