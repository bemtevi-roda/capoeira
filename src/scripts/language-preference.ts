import {
  isStoredLocale,
  readLanguagePreference,
  saveLanguagePreference,
  type StoredLocale,
} from '../lib/language-preference';

const current = document.documentElement.dataset.locale;
if (isStoredLocale(current) && document.documentElement.dataset.languagePreference === 'true') {
  const remembered = readLanguagePreference(localStorage);
  if (!remembered) {
    saveLanguagePreference(localStorage, current);
  } else if (remembered !== current) {
    const link = document.querySelector<HTMLAnchorElement>(`[data-lang="${remembered}"]`);
    if (link) {
      location.replace(link.href.split(/[?#]/)[0] + location.search + location.hash);
    }
  }
}

export function setPreferredLanguage(locale: StoredLocale): void {
  saveLanguagePreference(localStorage, locale);
}
