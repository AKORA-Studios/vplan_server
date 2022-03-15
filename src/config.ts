const isDev = Deno.env.get('NODE_ENV') === 'development',
    isProd = Deno.env.get('NODE_ENV') === 'production';

export const config = {
    NODE_ENV: Deno.env.get('NODE_ENV') as
        | 'development'
        | 'production'
        | undefined,
    GIT_URL: Deno.env.get('GIT_URL')!,
    PORT: Number(Deno.env.get('PORT')) ?? 3000,
    DEV: isDev,
    PROD: isProd,
};

if (!config.GIT_URL) throw new Error('GIT_URL missing');

export default config;
