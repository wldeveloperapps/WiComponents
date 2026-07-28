import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const consumer = resolve(root, 'apps/e2e-consumer');

execSync('node scripts/pack-lib.mjs', { cwd: root, stdio: 'inherit' });

const pkg = JSON.parse(readFileSync(resolve(root, 'dist/components/package.json'), 'utf8'));
const tgz = resolve(root, `dist/wiloc-ui-${pkg.version}.tgz`);

execSync(`pnpm add "${tgz}"`, {
  cwd: consumer,
  stdio: 'inherit',
  shell: true,
});

console.log(`\nSynced apps/e2e-consumer with ${tgz}`);
