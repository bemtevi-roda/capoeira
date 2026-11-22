import type { APIRoute } from 'astro';
import { appManifestResponse } from '../lib/app-manifest';

export const GET: APIRoute = () => appManifestResponse('en');
