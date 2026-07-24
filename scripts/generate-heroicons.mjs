/**
 * Genera WiIconGlyph desde SVG oficiales de Heroicons (MIT).
 * Uso: npm run generate:icons (heroicons solo para generar, no es peer).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'projects/components/icon/heroicons/src');

const ICONS = [
  'adjustments-horizontal',
  'archive-box',
  'arrow-down-circle',
  'arrow-down-tray',
  'arrow-left',
  'arrow-path',
  'arrow-right',
  'arrow-right-on-rectangle',
  'arrow-up-tray',
  'arrow-uturn-left',
  'arrows-up-down',
  'backward',
  'bars-3',
  'bars-arrow-down',
  'bars-arrow-up',
  'bell',
  'bell-slash',
  'calendar',
  'chart-bar',
  'chart-pie',
  'check',
  'check-circle',
  'chevron-double-left',
  'chevron-double-right',
  'chevron-down',
  'chevron-left',
  'chevron-right',
  'chevron-up',
  'clock',
  'cloud',
  'cloud-arrow-down',
  'cloud-arrow-up',
  'cog-6-tooth',
  'cpu-chip',
  'cube',
  'document',
  'ellipsis-vertical',
  'envelope',
  'exclamation-circle',
  'exclamation-triangle',
  'eye',
  'flag',
  'folder',
  'forward',
  'funnel',
  'home',
  'identification',
  'inbox',
  'information-circle',
  'key',
  'list-bullet',
  'lock-closed',
  'lock-open',
  'magnifying-glass',
  'map',
  'map-pin',
  'megaphone',
  'minus',
  'moon',
  'paper-airplane',
  'pause',
  'pencil',
  'phone',
  'play',
  'plus',
  'plus-circle',
  'shield-check',
  'speaker-wave',
  'speaker-x-mark',
  'squares-2x2',
  'stop',
  'sun',
  'table-cells',
  'trash',
  'user',
  'user-plus',
  'users',
  'x-circle',
  'x-mark',
];

const ALLOWED_TAGS = new Set(['path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'g']);
const ALLOWED_ATTRS = new Set([
  'd',
  'cx',
  'cy',
  'r',
  'x',
  'y',
  'width',
  'height',
  'rx',
  'ry',
  'x1',
  'y1',
  'x2',
  'y2',
  'points',
  'fill',
  'fill-rule',
  'clip-rule',
  'stroke',
  'stroke-width',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-dasharray',
  'opacity',
  'transform',
]);

function parseSvg(svg) {
  const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch?.[1] ?? '0 0 24 24';
  const nodes = [];

  const tagRegex =
    /<(path|circle|rect|line|polyline|polygon|g)(\s[^>]*)?(?:\/>|>([\s\S]*?)<\/\1>)/g;
  let match;
  while ((match = tagRegex.exec(svg)) !== null) {
    const tag = match[1];
    if (!ALLOWED_TAGS.has(tag)) {
      continue;
    }
    const attrString = match[2] ?? '';
    const attrs = {};
    const attrRegex = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)="([^"]*)"/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attrString)) !== null) {
      const name = attrMatch[1];
      if (ALLOWED_ATTRS.has(name)) {
        attrs[name] = attrMatch[2];
      }
    }
    nodes.push({ tag, attrs });
  }

  return { viewBox, nodes };
}

function toTsLiteral(value, indent = 0) {
  const pad = '  '.repeat(indent);
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '[]';
    }
    const items = value.map((item) => toTsLiteral(item, indent + 1)).join(',\n');
    return `[\n${items},\n${pad}]`;
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value)
      .map(([k, v]) => {
        const key = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(k) ? k : JSON.stringify(k);
        return `${pad}  ${key}: ${toTsLiteral(v, indent + 1)}`;
      })
      .join(',\n');
    return `{\n${entries},\n${pad}}`;
  }
  return JSON.stringify(value);
}

function toCamelCase(name) {
  return name
    .split('-')
    .map((part, index) => (index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join('');
}

function readIcon(name, variant) {
  const path = join(root, 'node_modules/heroicons/24', variant, `${name}.svg`);
  if (!existsSync(path)) {
    throw new Error(`Missing Heroicons file: ${path}`);
  }
  return parseSvg(readFileSync(path, 'utf8'));
}

mkdirSync(outDir, { recursive: true });

const exportNames = [];

for (const name of ICONS) {
  const camel = toCamelCase(name);
  const outlineName = `${camel}Outline`;
  const solidName = `${camel}Solid`;
  const outline = readIcon(name, 'outline');
  const solid = readIcon(name, 'solid');

  const content = `/* Auto-generated from Heroicons v2. Do not edit by hand. */
import type { WiIconGlyph } from '@wiloc/ui/icon';

/** Heroicons 24/outline/${name} */
export const ${outlineName}: WiIconGlyph = ${toTsLiteral(outline)};

/** Heroicons 24/solid/${name} */
export const ${solidName}: WiIconGlyph = ${toTsLiteral(solid)};
`;

  writeFileSync(join(outDir, `${name}.ts`), content, 'utf8');
  exportNames.push({ name, outlineName, solidName });
}

const publicApi = `/* Auto-generated from Heroicons v2. Do not edit by hand. */
${exportNames.map((e) => `export { ${e.outlineName}, ${e.solidName} } from './${e.name}';`).join('\n')}
`;

writeFileSync(join(outDir, 'public-api.ts'), publicApi, 'utf8');

const registryHelper = `/* Auto-generated. INTERNAL / Storybook only — not part of the public API.
 * Apps must import individual glyphs and pass them to provideWiIcons.
 */
import type { WiIconRegistry } from '@wiloc/ui/icon';
${exportNames
  .map((e) => `import { ${e.outlineName}, ${e.solidName} } from './${e.name}';`)
  .join('\n')}

/**
 * Mapa de conveniencia para Storybook y demos locales.
 * No exportar desde public-api: registrar todo el set anula el tree shaking.
 */
export const WI_HEROICONS_CURATED: WiIconRegistry = {
${exportNames
  .map(
    (e) =>
      `  '${e.name}': { outline: ${e.outlineName}, solid: ${e.solidName} },`,
  )
  .join('\n')}
};
`;

writeFileSync(join(outDir, 'curated.ts'), registryHelper, 'utf8');

console.log(`Generated ${ICONS.length} icons in ${outDir}`);
