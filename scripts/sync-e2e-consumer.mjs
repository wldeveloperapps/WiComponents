import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { packedTarballFileName } from './packed-tarball.mjs';

const root = resolve(import.meta.dirname, '..');
const consumer = resolve(root, 'apps/e2e-consumer');

execSync('node scripts/pack-lib.mjs', { cwd: root, stdio: 'inherit' });

const pkg = JSON.parse(readFileSync(resolve(root, 'dist/components/package.json'), 'utf8'));
const tgzName = packedTarballFileName(pkg);
const spec = `file:../../dist/${tgzName}`;

execSync(`pnpm add "${spec}"`, {
  cwd: consumer,
  stdio: 'inherit',
  shell: true,
});

console.log(`\nSynced apps/e2e-consumer with ${spec}`);
