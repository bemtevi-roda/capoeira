import type { APIRoute } from 'astro';
import { appManifestResponse } from '../lib/app-manifest';

// Web app manifest, generated so every URL follows the configured `base`.
export const GET: APIRoute = () => appManifestResponse('he');
