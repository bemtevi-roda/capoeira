export const LANGUAGE_PREFERENCE_KEY = 'preferredLocale';
const LEGACY_LANGUAGE_PREFERENCE_KEY = 'lang';

export type StoredLocale = 'he' | 'en' | 'pt';

export function isStoredLocale(value: unknown): value is StoredLocale {
  return value === 'he' || value === 'en' || value === 'pt';
}

export function readLanguagePreference(storage: Pick<Storage, 'getItem'>): StoredLocale | undefined {
  try {
    const value = storage.getItem(LANGUAGE_PREFERENCE_KEY);
    if (isStoredLocale(value)) return value;
    const legacyValue = storage.getItem(LEGACY_LANGUAGE_PREFERENCE_KEY);
    return isStoredLocale(legacyValue) ? legacyValue : undefined;
  } catch {
    return undefined;
  }
}

export function saveLanguagePreference(storage: Pick<Storage, 'setItem'>, locale: StoredLocale): void {
  try {
    storage.setItem(LANGUAGE_PREFERENCE_KEY, locale);
  } catch {}
}
