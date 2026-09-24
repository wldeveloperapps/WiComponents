import type { WiIconGlyph, WiSvgNode, WiSvgTag } from './wi-icon.types';

const SVG_TAGS = new Set<string>(['path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'g']);

const PAINT_ATTRS = [
  'fill',
  'fill-rule',
  'clip-rule',
  'stroke',
  'stroke-width',
  'stroke-linecap',
  'stroke-linejoin',
  'opacity',
  'transform',
] as const;

const ATTRS_BY_TAG: Record<WiSvgTag, ReadonlySet<string>> = {
  path: new Set([...PAINT_ATTRS, 'd']),
  circle: new Set([
    'cx',
    'cy',
    'r',
    'fill',
    'stroke',
    'stroke-width',
    'stroke-linecap',
    'stroke-linejoin',
    'opacity',
    'transform',
  ]),
  rect: new Set([
    'x',
    'y',
    'width',
    'height',
    'rx',
    'ry',
    'fill',
    'stroke',
    'stroke-width',
    'stroke-linecap',
    'stroke-linejoin',
    'opacity',
    'transform',
  ]),
  line: new Set([
    'x1',
    'y1',
    'x2',
    'y2',
    'stroke',
    'stroke-width',
    'stroke-linecap',
    'opacity',
    'transform',
  ]),
  polyline: new Set([
    'points',
    'fill',
    'stroke',
    'stroke-width',
    'stroke-linecap',
    'stroke-linejoin',
    'opacity',
    'transform',
  ]),
  polygon: new Set([
    'points',
    'fill',
    'stroke',
    'stroke-width',
    'stroke-linecap',
    'stroke-linejoin',
    'opacity',
    'transform',
  ]),
  g: new Set(PAINT_ATTRS),
};

const ROOT_ATTRS = new Set([
  'viewBox',
  'fill',
  'stroke',
  'stroke-width',
  'stroke-linecap',
  'stroke-linejoin',
]);

const DEFAULT_VIEW_BOX = '0 0 24 24';

/** Glifo externo listo para la plantilla de `wi-icon`. */
export interface WiParsedExternalIcon {
  readonly glyph: WiIconGlyph;
  readonly rootFill: string | null;
  readonly rootStroke: string | null;
  readonly rootStrokeWidth: string | null;
  readonly rootStrokeLinecap: string | null;
  readonly rootStrokeLinejoin: string | null;
}

interface RawNode {
  readonly tag: WiSvgTag;
  readonly attrs: Record<string, string>;
  readonly children?: readonly RawNode[];
}

interface XmlName {
  readonly value: string;
  readonly next: number;
}

interface XmlAttrs {
  readonly attrs: Record<string, string>;
  readonly next: number;
  readonly selfClosing: boolean;
}

/**
 * Traduce el texto de un SVG a `WiIconGlyph` sin `DOMParser` ni `document`.
 * Descarta etiquetas fuera de la allowlist y atributos que la plantilla no pinta.
 */
export function parseExternalSvg(
  source: string,
  preserveColors: boolean,
): WiParsedExternalIcon | null {
  const openAt = findSvgOpen(source);
  if (openAt < 0) {
    return null;
  }

  const root = readAttrs(source, openAt + 4);
  if (!root) {
    return null;
  }

  const rootAttrs = pickAttrs(root.attrs, ROOT_ATTRS);
  let nodes: readonly RawNode[] = [];

  if (!root.selfClosing) {
    const children = parseChildren(source, root.next, 'svg');
    if (!children) {
      return null;
    }
    nodes = children.nodes;
  }

  const viewBox = rootAttrs['viewBox']?.trim() || DEFAULT_VIEW_BOX;
  const fill = present(rootAttrs['fill']);
  const stroke = present(rootAttrs['stroke']);
  const rootFill = rootPaint(fill, preserveColors);
  const rootStroke = rootStrokePaint(stroke, preserveColors);

  return {
    glyph: {
      viewBox,
      nodes: mapNodes(nodes, rootFill.inherited, rootStroke.inherited, preserveColors),
      ...(preserveColors ? { preserveColors: true } : {}),
    },
    rootFill: rootFill.rendered,
    rootStroke: rootStroke.rendered,
    rootStrokeWidth: present(rootAttrs['stroke-width']),
    rootStrokeLinecap: present(rootAttrs['stroke-linecap']),
    rootStrokeLinejoin: present(rootAttrs['stroke-linejoin']),
  };
}

/** Ruta de la app o URL `http`/`https`. Rechaza otros esquemas (`javascript:`, `data:`, …). */
export function isAllowedIconSrc(src: string): boolean {
  if (!src || src.startsWith('//') || hasControlChar(src)) {
    return false;
  }

  const scheme = /^([a-zA-Z][a-zA-Z0-9+.-]*):/.exec(src);
  if (!scheme) {
    return true;
  }

  const protocol = scheme[1]?.toLowerCase();
  return protocol === 'http' || protocol === 'https';
}

function hasControlChar(value: string): boolean {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code <= 31 || code === 127) {
      return true;
    }
  }
  return false;
}

function findSvgOpen(source: string): number {
  const lower = source.toLowerCase();
  let from = 0;

  while (from < lower.length) {
    const at = lower.indexOf('<svg', from);
    if (at < 0) {
      return -1;
    }
    const next = source[at + 4];
    if (next === undefined || /[\s>/]/.test(next)) {
      return at;
    }
    from = at + 4;
  }

  return -1;
}

function parseChildren(
  source: string,
  start: number,
  parent: string,
): { nodes: RawNode[]; next: number } | null {
  const nodes: RawNode[] = [];
  let i = start;

  while (i < source.length) {
    const lt = source.indexOf('<', i);
    if (lt < 0) {
      return null;
    }

    const marker = source[lt + 1];
    if (
      marker !== undefined &&
      marker !== '/' &&
      marker !== '!' &&
      marker !== '?' &&
      !/[A-Za-z]/.test(marker)
    ) {
      i = lt + 1;
      continue;
    }

    if (source.startsWith('<!--', lt)) {
      const end = source.indexOf('-->', lt + 4);
      if (end < 0) {
        return null;
      }
      i = end + 3;
      continue;
    }

    if (source.startsWith('<?', lt)) {
      const end = source.indexOf('?>', lt + 2);
      if (end < 0) {
        return null;
      }
      i = end + 2;
      continue;
    }

    if (source.startsWith('<!', lt)) {
      const end = source.indexOf('>', lt + 2);
      if (end < 0) {
        return null;
      }
      i = end + 1;
      continue;
    }

    if (source.startsWith('</', lt)) {
      const name = readXmlName(source, lt + 2);
      if (!name) {
        return null;
      }
      const end = skipToTagEnd(source, name.next);
      if (end < 0) {
        return null;
      }
      if (localTag(name.value) !== parent) {
        return null;
      }
      return { nodes, next: end };
    }

    const name = readXmlName(source, lt + 1);
    if (!name) {
      return null;
    }
    const tag = localTag(name.value);
    const rest = readAttrs(source, name.next);
    if (!rest) {
      return null;
    }

    if (!SVG_TAGS.has(tag)) {
      i = rest.selfClosing ? rest.next : skipNested(source, rest.next, tag);
      if (i < 0) {
        return null;
      }
      continue;
    }

    const svgTag = tag as WiSvgTag;
    const attrs = pickAttrs(rest.attrs, ATTRS_BY_TAG[svgTag]);

    if (rest.selfClosing || svgTag !== 'g') {
      if (!rest.selfClosing) {
        const skipped = skipNested(source, rest.next, tag);
        if (skipped < 0) {
          return null;
        }
        i = skipped;
      } else {
        i = rest.next;
      }
      nodes.push({ tag: svgTag, attrs });
      continue;
    }

    const inner = parseChildren(source, rest.next, tag);
    if (!inner) {
      return null;
    }
    nodes.push(
      inner.nodes.length ? { tag: svgTag, attrs, children: inner.nodes } : { tag: svgTag, attrs },
    );
    i = inner.next;
  }

  return null;
}

function skipNested(source: string, start: number, tag: string): number {
  let depth = 1;
  let i = start;

  while (i < source.length && depth > 0) {
    const lt = source.indexOf('<', i);
    if (lt < 0) {
      return -1;
    }

    const marker = source[lt + 1];
    if (
      marker !== undefined &&
      marker !== '/' &&
      marker !== '!' &&
      marker !== '?' &&
      !/[A-Za-z]/.test(marker)
    ) {
      i = lt + 1;
      continue;
    }

    if (source.startsWith('<!--', lt)) {
      const end = source.indexOf('-->', lt + 4);
      if (end < 0) {
        return -1;
      }
      i = end + 3;
      continue;
    }

    if (source.startsWith('<?', lt)) {
      const end = source.indexOf('?>', lt + 2);
      if (end < 0) {
        return -1;
      }
      i = end + 2;
      continue;
    }

    if (source.startsWith('<!', lt)) {
      const end = source.indexOf('>', lt + 2);
      if (end < 0) {
        return -1;
      }
      i = end + 1;
      continue;
    }

    const closing = marker === '/';
    const name = readXmlName(source, closing ? lt + 2 : lt + 1);
    if (!name) {
      return -1;
    }

    if (closing) {
      const end = skipToTagEnd(source, name.next);
      if (end < 0) {
        return -1;
      }
      if (localTag(name.value) === tag) {
        depth -= 1;
      }
      i = end;
      continue;
    }

    const rest = readAttrs(source, name.next);
    if (!rest) {
      return -1;
    }
    if (localTag(name.value) === tag && !rest.selfClosing) {
      depth += 1;
    }
    i = rest.next;
  }

  return depth === 0 ? i : -1;
}

function isXmlNameChar(char: string): boolean {
  return (
    char !== ' ' &&
    char !== '\t' &&
    char !== '\n' &&
    char !== '\r' &&
    char !== '\f' &&
    char !== '=' &&
    char !== '/' &&
    char !== '>' &&
    char !== '"' &&
    char !== "'"
  );
}

function readXmlName(source: string, start: number): XmlName | null {
  let i = start;
  while (i < source.length && isXmlNameChar(source[i] ?? '')) {
    i += 1;
  }
  if (i === start) {
    return null;
  }
  return { value: source.slice(start, i), next: i };
}

function readAttrs(source: string, start: number): XmlAttrs | null {
  const attrs: Record<string, string> = {};
  let i = start;

  while (i < source.length) {
    while (i < source.length && /\s/.test(source[i] ?? '')) {
      i += 1;
    }
    if (i >= source.length) {
      return null;
    }
    if (source.startsWith('/>', i)) {
      return { attrs, next: i + 2, selfClosing: true };
    }
    if (source[i] === '>') {
      return { attrs, next: i + 1, selfClosing: false };
    }

    const name = readXmlName(source, i);
    if (!name) {
      return null;
    }
    i = name.next;
    while (i < source.length && /\s/.test(source[i] ?? '')) {
      i += 1;
    }

    let value = '';
    if (source[i] === '=') {
      i += 1;
      while (i < source.length && /\s/.test(source[i] ?? '')) {
        i += 1;
      }
      const quote = source[i];
      if (quote === '"' || quote === "'") {
        const valueStart = i + 1;
        const valueEnd = source.indexOf(quote, valueStart);
        if (valueEnd < 0) {
          return null;
        }
        value = decodeEntities(source.slice(valueStart, valueEnd));
        i = valueEnd + 1;
      } else {
        const valueStart = i;
        while (i < source.length && !/[\s>]/.test(source[i] ?? '') && source[i] !== '/') {
          i += 1;
        }
        value = decodeEntities(source.slice(valueStart, i));
      }
    }

    const key = canonicalAttr(name.value);
    if (key) {
      attrs[key] = value;
    }
  }

  return null;
}

function skipToTagEnd(source: string, start: number): number {
  let i = start;
  while (i < source.length && /\s/.test(source[i] ?? '')) {
    i += 1;
  }
  return source[i] === '>' ? i + 1 : -1;
}

function localTag(raw: string): string {
  const colon = raw.lastIndexOf(':');
  return (colon >= 0 ? raw.slice(colon + 1) : raw).toLowerCase();
}

function canonicalAttr(raw: string): string | null {
  const colon = raw.lastIndexOf(':');
  const local = (colon >= 0 ? raw.slice(colon + 1) : raw).toLowerCase();
  if (!local || local.startsWith('on') || local === 'style' || local === 'href') {
    return null;
  }
  return local === 'viewbox' ? 'viewBox' : local;
}

function pickAttrs(
  attrs: Readonly<Record<string, string>>,
  allowed: ReadonlySet<string>,
): Record<string, string> {
  const picked: Record<string, string> = {};
  for (const [key, value] of Object.entries(attrs)) {
    if (allowed.has(key)) {
      picked[key] = value;
    }
  }
  return picked;
}

function decodeEntities(value: string): string {
  return value.replace(/&(#x[0-9a-fA-F]+|#\d+|amp|lt|gt|quot|apos);/g, (match, entity: string) => {
    switch (entity) {
      case 'amp':
        return '&';
      case 'lt':
        return '<';
      case 'gt':
        return '>';
      case 'quot':
        return '"';
      case 'apos':
        return "'";
      default: {
        const code = entity.startsWith('#x')
          ? Number.parseInt(entity.slice(2), 16)
          : Number.parseInt(entity.slice(1), 10);
        if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) {
          return match;
        }
        return String.fromCodePoint(code);
      }
    }
  });
}

function present(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function normalizePaint(value: string): string {
  const lower = value.trim().toLowerCase();
  if (lower === 'none') {
    return 'none';
  }
  if (lower === 'transparent') {
    return 'transparent';
  }
  if (lower === 'currentcolor') {
    return 'currentColor';
  }
  return 'currentColor';
}

function isPainting(value: string): boolean {
  const lower = value.trim().toLowerCase();
  return lower !== 'none' && lower !== 'transparent';
}

function rootPaint(
  fill: string | null,
  preserveColors: boolean,
): { rendered: string | null; inherited: string | null } {
  if (!fill) {
    return { rendered: null, inherited: null };
  }
  if (preserveColors) {
    return { rendered: fill, inherited: fill };
  }

  const normalized = normalizePaint(fill);
  if (!isPainting(normalized)) {
    return { rendered: normalized, inherited: normalized };
  }

  // Un fill de color en el <svg> raíz rellenaría los iconos de trazo.
  return { rendered: null, inherited: 'currentColor' };
}

function rootStrokePaint(
  stroke: string | null,
  preserveColors: boolean,
): { rendered: string | null; inherited: string | null } {
  if (!stroke) {
    return { rendered: null, inherited: null };
  }
  if (preserveColors) {
    return { rendered: stroke, inherited: stroke };
  }

  const normalized = normalizePaint(stroke);
  if (!isPainting(normalized)) {
    return { rendered: normalized === 'transparent' ? 'transparent' : null, inherited: normalized };
  }

  return { rendered: 'currentColor', inherited: 'currentColor' };
}

function mapNodes(
  nodes: readonly RawNode[],
  inheritedFill: string | null,
  inheritedStroke: string | null,
  preserveColors: boolean,
): WiSvgNode[] {
  return nodes.map((node) => {
    const attrs: Record<string, string> = { ...node.attrs };
    const ownFill = attrs['fill'];
    const ownStroke = attrs['stroke'];
    const nextFill =
      ownFill !== undefined ? (preserveColors ? ownFill : normalizePaint(ownFill)) : inheritedFill;
    const nextStroke =
      ownStroke !== undefined
        ? preserveColors
          ? ownStroke
          : normalizePaint(ownStroke)
        : inheritedStroke;

    if (ownFill !== undefined) {
      attrs['fill'] = preserveColors ? ownFill : normalizePaint(ownFill);
    } else if (!preserveColors && node.tag !== 'g' && inheritedFill && isPainting(inheritedFill)) {
      attrs['fill'] = 'currentColor';
    }

    if (ownStroke !== undefined) {
      attrs['stroke'] = preserveColors ? ownStroke : normalizePaint(ownStroke);
    } else if (
      !preserveColors &&
      node.tag !== 'g' &&
      inheritedStroke &&
      isPainting(inheritedStroke)
    ) {
      attrs['stroke'] = 'currentColor';
    }

    const children = node.children?.length
      ? mapNodes(node.children, nextFill, nextStroke, preserveColors)
      : undefined;

    return children?.length ? { tag: node.tag, attrs, children } : { tag: node.tag, attrs };
  });
}
