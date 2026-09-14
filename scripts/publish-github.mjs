import { existsSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

/**
 * @param {string} version
 * @returns {string}
 */
function distTag(version) {
  if (version.includes('-alpha')) {
    return 'alpha';
  }
  if (version.includes('-beta')) {
    return 'beta';
  }
  if (version.includes('-rc')) {
    return 'rc';
  }
  return 'latest';
}

const root = resolve(import.meta.dirname, '..');
const uiDir = resolve(root, 'dist/components');
const mcpDir = resolve(root, 'packages/wiloc-ui-mcp');
const uiPkgPath = resolve(uiDir, 'package.json');
const mcpPkgPath = resolve(mcpDir, 'package.json');

if (!existsSync(uiPkgPath)) {
  throw new Error('Falta dist/components. Ejecuta `pnpm build:lib` antes de publicar.');
}

if (!existsSync(resolve(mcpDir, 'dist/index.js'))) {
  throw new Error('Falta packages/wiloc-ui-mcp/dist. Ejecuta `pnpm build:mcp` antes de publicar.');
}

const uiPkg = JSON.parse(readFileSync(uiPkgPath, 'utf8'));
const mcpPkg = JSON.parse(readFileSync(mcpPkgPath, 'utf8'));

if (uiPkg.version !== mcpPkg.version) {
  throw new Error(
    `Versiones desalineadas: ${uiPkg.name}@${uiPkg.version} vs ${mcpPkg.name}@${mcpPkg.version}`,
  );
}

const refType = process.env.GITHUB_REF_TYPE;
const refName = process.env.GITHUB_REF_NAME;
if (refType === 'tag') {
  const expected = `v${uiPkg.version}`;
  if (refName !== expected) {
    throw new Error(`El tag ${refName} no coincide con la versión del paquete (${expected}).`);
  }
}

const tag = distTag(uiPkg.version);

execSync(`pnpm publish --no-git-checks --tag ${tag}`, {
  cwd: uiDir,
  stdio: 'inherit',
});

execSync(`pnpm publish --no-git-checks --tag ${tag}`, {
  cwd: mcpDir,
  stdio: 'inherit',
});

console.log(`\nPublished ${uiPkg.name}@${uiPkg.version} and ${mcpPkg.name}@${mcpPkg.version} (tag ${tag})`);
