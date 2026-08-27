export type WiRegistryStatus = 'stable' | 'experimental' | 'deprecated';

export type WiCatalogKind = 'component' | 'pattern';

export interface WiRegistryField {
  readonly name: string;
  readonly type: string;
  readonly default?: unknown;
  readonly description: string;
}

export type WiRegistryVariant = string | { readonly name: string; readonly description?: string };

export interface WiRegistryPart {
  readonly selector: string;
  readonly description: string;
}

export interface WiRegistryExample {
  readonly import: string;
  readonly template: string;
}

export interface WiRegistryEntry {
  readonly name: string;
  readonly selector: string;
  readonly entryPoint: string;
  readonly status: WiRegistryStatus;
  readonly exports: readonly string[];
  readonly inputs: readonly WiRegistryField[];
  readonly outputs: readonly WiRegistryField[];
  readonly variants?: readonly WiRegistryVariant[];
  readonly parts?: readonly WiRegistryPart[];
  readonly i18n?: unknown;
  readonly keyboard: readonly string[];
  readonly a11yNotes: string;
  readonly example: WiRegistryExample;
}

export interface WiCatalogItem extends WiRegistryEntry {
  readonly kind: WiCatalogKind;
}

export interface WiEntryPointInfo {
  readonly entryPoint: string;
  readonly description: string;
}

export interface WiDocsTopic {
  readonly id: string;
  readonly title: string;
  readonly body: string;
}
