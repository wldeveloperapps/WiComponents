/**
 * Registry seed for @wiloc/ui-mcp (paquete previsto en packages/wiloc-ui-mcp).
 * Documenta solo API pública — no Spartan ni rutas internas.
 */
export const wiChipRegistryEntry = {
  name: 'chip',
  selector: 'wi-chip',
  entryPoint: '@wiloc/ui/data-display',
  status: 'experimental' as const,
  exports: ['WiChipComponent', 'WiChipVariant', 'WiChipSize', 'WiChipRadius'],
  inputs: [
    {
      name: 'variant',
      type: 'WiChipVariant',
      default: 'neutral',
      description:
        'Apariencia semántica si no está selected: neutral | primary | secondary | success | warning | danger',
    },
    {
      name: 'size',
      type: 'WiChipSize',
      default: 'sm',
      description: 'Tamaño: sm (text-xs px-2 py-1, tags) | md (selección)',
    },
    {
      name: 'radius',
      type: 'WiChipRadius',
      default: 'control',
      description: 'Radio: control (rounded-control) | full (píldora)',
    },
    {
      name: 'selected',
      type: 'boolean',
      default: false,
      description:
        'Apariencia de elegido (success). La app controla el valor; no hay toggle interno',
    },
    {
      name: 'clickable',
      type: 'boolean',
      default: false,
      description: 'Host como botón (role=button, aria-pressed). Emite clicked',
    },
    {
      name: 'removable',
      type: 'boolean',
      default: false,
      description: 'Muestra el aspa para quitar el chip',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      description: 'Deshabilita clic/aspa y atenúa el chip',
    },
    {
      name: 'removeLabel',
      type: 'string',
      default: 'Quitar',
      description: 'Nombre accesible del aspa (aria-label). Localizable desde la app vía i18n',
    },
    {
      name: 'ariaLabel',
      type: 'string | null',
      default: null,
      description: 'Nombre accesible del chip (alias aria-label)',
    },
  ],
  outputs: [
    {
      name: 'removed',
      type: 'void',
      description: 'Se emite al pulsar el aspa (no se emite si disabled)',
    },
    {
      name: 'clicked',
      type: 'void',
      description: 'Se emite al activar un chip clickable (no se emite si disabled)',
    },
  ],
  variants: ['neutral', 'primary', 'secondary', 'success', 'warning', 'danger'],
  parts: [],
  keyboard: ['Tab', 'Enter', 'Space'],
  a11yNotes:
    'Presentacional salvo clickable o removable. clickable: role=button + aria-pressed; Enter/Space. El aspa es un button nativo con removeLabel; el clic del aspa no emite clicked. Iconos proyectados son decorativos si no llevan label. Texto largo se trunca. No hardcodear copy de producto.',
  example: {
    import: `import { WiChipComponent } from '@wiloc/ui/data-display';`,
    template: `<wi-chip>User</wi-chip>
<wi-chip radius="full">Píldora</wi-chip>
<wi-chip clickable [selected]="selected" (clicked)="toggle()">
  Cliente web
</wi-chip>`,
  },
} as const;
