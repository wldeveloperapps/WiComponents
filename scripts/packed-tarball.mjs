/**
 * Filename produced by `pnpm pack` / `npm pack` for a package.json.
 * `@scope/name` @ `1.2.3` → `scope-name-1.2.3.tgz`
 *
 * @param {{ name: string; version: string }} pkg
 * @returns {string}
 */
export function packedTarballFileName(pkg) {
  const id = String(pkg.name).replace(/^@/, '').replaceAll('/', '-');
  return `${id}-${pkg.version}.tgz`;
}
