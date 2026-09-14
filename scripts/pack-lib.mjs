import { existsSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

import { packedTarballFileName } from './packed-tarball.mjs';

const root = resolve(import.meta.dirname, '..');
const distComponents = resolve(root, 'dist/components');

execSync('pnpm build:lib', { cwd: root, stdio: 'inherit' });

const pkg = JSON.parse(readFileSync(resolve(distComponents, 'package.json'), 'utf8'));

execSync('pnpm pack --pack-destination ..', {
  cwd: distComponents,
  stdio: 'inherit',
});

const tgzName = packedTarballFileName(pkg);
const tgz = resolve(root, 'dist', tgzName);

if (!existsSync(tgz)) {
  throw new Error(`Expected packed tarball at ${tgz}`);
}

console.log(`\nPacked ${pkg.name}@${pkg.version} -> dist/${tgzName}`);
