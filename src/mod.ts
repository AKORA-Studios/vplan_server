import './config.ts'; //Load env variables

import { getCommits, initRepo } from './git.ts';
import { config } from './config.ts';
import { serve } from './deps.ts';

if (config.PROD) console.log('Started', new Date().toLocaleString());
await initRepo();

if (!config.PROD) console.log('✅ - Repo up to date');

function isTimestamp(str: string) {
    return /\d+/.test(str);
}

const handler = async (request: Request): Promise<Response> => {
    const searchParams = new URLSearchParams(request.url.split('?')[1]);
    console.log(searchParams);
    const rawTimestamp = searchParams.get('timestamp'),
        rawBefore = searchParams.get('before'),
        rawAfter = searchParams.get('after');

    let before = 0,
        after = 0;

    if (rawTimestamp) {
        if (!isTimestamp(rawTimestamp)) {
            return new Response('Invalid Timestamp', { status: 400 });
        }

        before = Number(rawTimestamp);
        after = before - 1000 * 60 * 60 * 24 * 7; // One Week before
    } else if (rawBefore && rawAfter) {
        if (!isTimestamp(rawBefore)) {
            return new Response('Invalid beginning Timestamp', { status: 400 });
        } else if (!isTimestamp(rawAfter)) {
            return new Response('Invalid ending Timestamp', { status: 400 });
        }

        before = Number(rawAfter);
        after = Number(rawBefore);
    } else {
        return new Response('Missing parameters', { status: 400 });
    }

    return new Response(JSON.stringify(await getCommits(before, after)), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);
await serve(handler, { port: config.PORT });

//
//
//
//
//
//
//
//
//
//
export function stop(err?: Error) {
    console.log('Stopping');
    //push();
    if (err) throw Error;
    Deno.exit();
}

Deno.addSignalListener('SIGQUIT', () => {
    console.log('SIGQUIT');
    stop();
});

Deno.addSignalListener('SIGTERM', () => {
    console.log('SIGTERM');
    stop();
});
