import assert from 'node:assert/strict';
import test from 'node:test';
import {
  LANGUAGE_PREFERENCE_KEY,
  isStoredLocale,
  readLanguagePreference,
  saveLanguagePreference,
  type StoredLocale,
} from './language-preference.ts';

test('language preference accepts only supported locales', () => {
  assert.equal(isStoredLocale('he'), true);
  assert.equal(isStoredLocale('en'), true);
  assert.equal(isStoredLocale('fr'), false);
  assert.equal(isStoredLocale(null), false);
});

test('language preference can be saved and read', () => {
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  };

  saveLanguagePreference(storage, 'en');
  assert.equal(readLanguagePreference(storage), 'en');
  assert.equal(values.get(LANGUAGE_PREFERENCE_KEY), 'en');
});

test('language preference ignores invalid stored values', () => {
  const storage = {
    getItem: () => 'fr',
  };
  assert.equal(readLanguagePreference(storage), undefined);
});

test('language preference reads the legacy lang key', () => {
  const storage = {
    getItem: (key: string) => key === 'lang' ? 'en' : null,
  };
  assert.equal(readLanguagePreference(storage), 'en');
});

test('stored locale type covers the supported languages', () => {
  const locales: StoredLocale[] = ['he', 'en'];
  assert.deepEqual(locales, ['he', 'en']);
});
