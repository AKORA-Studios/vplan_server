import config from './config.ts';
import { __dirname, join } from './deps.ts';

export const gitPath = join(__dirname, '../git');

function execGit(...args: string[]) {
    return Deno.run({
        cmd: ['git', ...args],
        cwd: gitPath,
    }).status();
}

function cloneGit() {
    return execGit('clone', '--sparse', '--depth=1 ', config.GIT_URL, gitPath);
}

export async function initRepo() {
    //Pull if already cloned
    await execGit(
        'config',
        `lfs.${config.GIT_URL}.git/info/lfs.locksverify`,
        'true',
    );
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
    return await execGit('A', before + '', after + '');
}
