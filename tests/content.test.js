import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { translations, menu, whatsappUrl } from '../src/content.js';

test('every translatable HTML string has an English translation', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const keys = [...html.matchAll(/data-(?:i18n|alt|label|placeholder)="([^"]+)"/g)].map((match) => match[1]);
  for (const key of keys) assert.ok(translations.en[key], `Missing translation: ${key}`);
});

test('WhatsApp link preserves Unicode, punctuation and line breaks', () => {
  const url = new URL(whatsappUrl(' Léa & Max ', ' Torte für 4? 🍰\nDanke! ', 'de'));
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/4915122224583');
  assert.equal(url.searchParams.get('text'), 'Hallo Svetlana Cakes & Café, ich bin Léa & Max.\n\nTorte für 4? 🍰\nDanke!');
  assert.match(new URL(whatsappUrl('Sam', 'Hello', 'en')).searchParams.get('text'), /^Hello Svetlana Cakes & Café, my name is Sam\./);
});

test('both languages include all menu categories without inferred prices', () => {
  for (const language of ['de', 'en']) {
    assert.equal(menu[language].sweet.length, 4);
    assert.equal(menu[language].drinks.length, 4);
    assert.equal(JSON.stringify(menu[language]).includes('€'), false);
  }
});
