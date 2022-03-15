import { dirname, fromFileUrl } from 'https://deno.land/std@0.129.0/path/mod.ts';
export { dirname, fromFileUrl, join } from 'https://deno.land/std@0.129.0/path/mod.ts';
export { serve } from 'https://deno.land/std@0.129.0/http/server.ts';

export const __dirname = dirname(fromFileUrl(import.meta.url));
