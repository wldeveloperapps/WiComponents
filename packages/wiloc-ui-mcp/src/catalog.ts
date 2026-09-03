import * as registry from './registry/index.js';
import type { WiCatalogItem, WiCatalogKind, WiEntryPointInfo, WiRegistryEntry } from './types.js';

/** Patterns reutilizables (no primitivos de un solo control). */
const PATTERN_NAMES = new Set(['picklist', 'file-upload', 'stepper']);

const SPARTAN_LEAK = /@spartan-ng|\bBrn[A-Z]|\bHlm[A-Z]/;

export const WI_PACKAGE_VERSION = '0.1.0-alpha.1';

export const WI_ENTRY_POINTS: readonly WiEntryPointInfo[] = [
  {
    entryPoint: '@wiloc/ui/core',
    description: 'Tokens de tema: WI_DARK_CLASS, WI_COLOR_TOKEN_PREFIX',
  },
  { entryPoint: '@wiloc/ui/button', description: 'button[wiButton], a[wiButton]' },
  {
    entryPoint: '@wiloc/ui/forms',
    description: 'Input, otp, checkbox, switch, select, listbox, picklist, datepicker, file-upload',
  },
  { entryPoint: '@wiloc/ui/data-display', description: 'Table, card, chip, skeleton, spinner' },
  { entryPoint: '@wiloc/ui/icon', description: 'wi-icon + provideWiIcons' },
  {
    entryPoint: '@wiloc/ui/icon/heroicons',
    description: 'Glifos Heroicons curados (importar solo los usados)',
  },
  {
    entryPoint: '@wiloc/ui/overlays',
    description: 'Dialog, toast, confirm, menu, popover, tooltip, speed-dial',
  },
  { entryPoint: '@wiloc/ui/navigation', description: 'Tabs, stepper, breadcrumb' },
  {
    entryPoint: '@wiloc/ui/styles/tokens.css',
    description: 'Variables CSS --wi-color-* y .wi-dark',
  },
  {
    entryPoint: '@wiloc/ui/styles/tabs.css',
    description: 'Layout/scroll de wi-tabs (importar si usas tabs)',
  },
  {
    entryPoint: '@wiloc/ui/styles/toast.css',
    description: 'Estilos del toaster (importar si usas toast)',
  },
];

export const WI_CATALOG: readonly WiCatalogItem[] = Object.values(registry).map((entry) =>
  toCatalogItem(entry as WiRegistryEntry),
);

export function toCatalogItem(entry: WiRegistryEntry): WiCatalogItem {
  return {
    ...entry,
    kind: PATTERN_NAMES.has(entry.name) ? 'pattern' : 'component',
  };
}

export function listCatalog(kind: WiCatalogKind | 'all' = 'all'): readonly WiCatalogItem[] {
  if (kind === 'all') {
    return WI_CATALOG;
  }
  return WI_CATALOG.filter((item) => item.kind === kind);
}

export function getCatalogItem(name: string): WiCatalogItem | undefined {
  const needle = name.trim().toLowerCase();
  return WI_CATALOG.find((item) => {
    const selector = item.selector.toLowerCase();
    return (
      item.name === needle ||
      selector === needle ||
      selector === `wi-${needle}` ||
      needle === `wi-${item.name}`
    );
  });
}

export interface WiSearchHit {
  readonly item: WiCatalogItem;
  readonly score: number;
}

export function searchCatalog(query: string, limit = 10): readonly WiSearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return WI_CATALOG.slice(0, limit).map((item) => ({ item, score: 0 }));
  }

  const hits: WiSearchHit[] = [];
  for (const item of WI_CATALOG) {
    const score = scoreItem(item, q);
    if (score > 0) {
      hits.push({ item, score });
    }
  }

  hits.sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name));
  return hits.slice(0, limit);
}

function scoreItem(item: WiCatalogItem, q: string): number {
  if (item.name === q || item.selector === q) {
    return 100;
  }
  if (item.name.startsWith(q) || item.selector.startsWith(q)) {
    return 80;
  }
  if (item.name.includes(q) || item.selector.includes(q)) {
    return 60;
  }
  if (item.entryPoint.toLowerCase().includes(q)) {
    return 40;
  }
  if (item.exports.some((name) => name.toLowerCase().includes(q))) {
    return 35;
  }
  const blob = `${item.a11yNotes} ${item.example.import} ${item.example.template}`.toLowerCase();
  if (blob.includes(q)) {
    return 15;
  }
  return 0;
}

/** Texto del catálogo para auditoría: no debe filtrar Spartan. */
export function catalogPublicText(): string {
  return JSON.stringify(WI_CATALOG);
}

export function findSpartanLeaks(text: string = catalogPublicText()): readonly string[] {
  const matches = text.match(new RegExp(SPARTAN_LEAK, 'g'));
  return matches ? [...new Set(matches)] : [];
}

export function summarizeItem(item: WiCatalogItem) {
  return {
    name: item.name,
    kind: item.kind,
    selector: item.selector,
    entryPoint: item.entryPoint,
    status: item.status,
  };
}
