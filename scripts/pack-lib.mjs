import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const distComponents = resolve(root, 'dist/components');

execSync('pnpm build:lib', { cwd: root, stdio: 'inherit' });

const pkg = JSON.parse(readFileSync(resolve(distComponents, 'package.json'), 'utf8'));

execSync('pnpm pack --pack-destination ..', {
  cwd: distComponents,
  stdio: 'inherit',
});

const tgz = `dist/wiloc-ui-${pkg.version}.tgz`;
console.log(`\nPacked @wiloc/ui@${pkg.version} -> ${tgz}`);
