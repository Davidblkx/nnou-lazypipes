import { dirname, fromFileUrl } from 'jsr:@std/path';

function readReleaseType(): 'major' | 'minor' | 'patch' {
    const rType = Deno.args[1];
    if (rType !== 'major' && rType !== 'minor' && rType !== 'patch') {
        throw new Error('Invalid release type');
    }

    return rType;
}

function buildDenoConfigPath(): string {
    const scriptsFolder = dirname(fromFileUrl(import.meta.url));
    return `${dirname(scriptsFolder)}/deno.json`;
}

type DenoConfig = {
    version?: string;
};

function calcNextVersion(stringVersion: string): string {
    const parts = stringVersion.split('.').map(Number);
    if (parts.length !== 3) {
        throw new Error('Invalid version: does not have 3 parts');
    }

    let [major, minor, patch] = parts;

    if (releaseType === 'major') {
        major++;
        minor = 0;
        patch = 0;
    } else if (releaseType === 'minor') {
        minor++;
        patch = 0;
    } else {
        patch++;
    }

    return `${major}.${minor}.${patch}`;
}

const releaseType = readReleaseType();
console.log(`Creating a ${releaseType} release`);

const configFile = buildDenoConfigPath();
console.log(`Reading config from ${configFile}`);
const denoSource = Deno.readTextFileSync(configFile);
const denoConfig: DenoConfig = JSON.parse(denoSource);

const version = denoConfig?.version;
if (typeof version !== 'string') {
    throw new Error('Invalid version: is not a string');
}

const nextVersion = calcNextVersion(version);
console.log(`Updating version from ${version} to ${nextVersion}`);

const sourceToken = `"version": "${version}"`;
const targetToken = `"version": "${nextVersion}"`;

const newSource = denoSource.replace(sourceToken, targetToken);
Deno.writeTextFileSync(configFile, newSource);

console.log('Config file updated successfully!');

const work = [
    new Deno.Command('git', {
        args: ['add', configFile],
    }),
    new Deno.Command('git', {
        args: ['commit', '-m', `Release ${nextVersion}`],
    }),
    new Deno.Command('git', {
        args: ['tag', `v${nextVersion}`],
    }),
    new Deno.Command('git', {
        args: ['push'],
    }),
    new Deno.Command('git', {
        args: ['push', '--tags'],
    }),
];

for (const cmd of work) {
    const out = await cmd.output();
    if (!out.success) {
        console.error(out.stderr);
        Deno.exit(1);
    }
}
