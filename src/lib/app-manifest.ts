import { LANGUAGES, type Locale } from '../data/i18n';
import { SITE_TEXT } from '../data/site';

export function appManifestResponse(locale: Locale): Response {
  const base = import.meta.env.BASE_URL;
  const site = SITE_TEXT[locale];
  const manifest = {
    id: base,
    name: site.title,
    short_name: site.shortTitle,
    description: site.description,
    lang: LANGUAGES[locale].lang,
    start_url: base,
    scope: base,
    display: 'standalone',
    theme_color: '#87ceeb',
    background_color: '#fff6e3',
    icons: [
      { src: `${base}icon-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: `${base}icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: `${base}icon-maskable-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: `${base}favicon.svg`, sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
  };
  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { 'Content-Type': 'application/manifest+json' },
  });
}
