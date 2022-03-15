import config from './config.ts';
import { __dirname, join } from './deps.ts';

export const gitPath = join(__dirname, '../git');

function execGit(...args: string[]) {
    return Deno.run({
        cmd: ['git', ...args],
        cwd: gitPath,
    })
        .status()
        .catch();
}

function cloneGit() {
    return execGit('clone', '--sparse', '--depth=1', config.GIT_URL, gitPath);
}

export async function initRepo() {
    //Pull if already cloned
    const { success } = await execGit('pull');

    if (!success) {
        const { success } = await cloneGit();
        if (!success) {
            Deno.removeSync(gitPath, { recursive: true });
            const { success } = await cloneGit();
            if (!success) {
                throw new Error('Git Failed');
            }
        }
    }
}

export async function getCommits(before: number, after: number) {
    const p = Deno.run({
        cmd: [
            'log',
            '--follow',
            '--pretty="%H-%at"',
            '--',
            '.\vplan.json',
            `--before=${before + 1}`,
            `--after=${after - 1}`,
        ],
        stdout: 'piped',
        cwd: gitPath,
    });

    const [_, output] = await Promise.all([p.status(), p.output()]);
    const lines = new TextDecoder().decode(output).split('\n');
    return lines.map((l) => ({
        hash: l.split('-')[0],
        url: `${config.GIT_URL}/raw/commit/${l.split('-')[0]}/vplan.json`,
        timestamp: Number(l.split('-')[1]),
    }));
}
