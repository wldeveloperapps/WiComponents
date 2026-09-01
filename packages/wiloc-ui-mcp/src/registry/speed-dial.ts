/**
 * Registry seed for @wiloc/ui-mcp (paquete previsto en packages/wiloc-ui-mcp).
 * Documenta solo API pública — no Spartan ni rutas internas.
 */
export const wiSpeedDialRegistryEntry = {
  name: 'speed-dial',
  selector: 'wi-speed-dial',
  entryPoint: '@wiloc/ui/overlays',
  status: 'experimental' as const,
  exports: ['WiSpeedDialComponent', 'WiSpeedDialItem', 'WiSpeedDialDirection'],
  inputs: [
    {
      name: 'items',
      type: 'readonly WiSpeedDialItem[]',
      default: '[]',
      description:
        'Acciones al abrir — las define la app: id, icon (provideWiIcons), label accesible, disabled opcional. Distinto set por instancia/fila.',
    },
    {
      name: 'direction',
      type: "WiSpeedDialDirection ('up' | 'down' | 'left' | 'right')",
      default: 'left',
      description: 'Dirección del despliegue respecto al ancla',
    },
    {
      name: 'open',
      type: 'boolean (model)',
      default: false,
      description: 'Estado abierto (two-way)',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      description: 'Deshabilita trigger y acciones',
    },
    {
      name: 'closeOnSelect',
      type: 'boolean',
      default: true,
      description: 'Cierra al seleccionar una acción',
    },
    {
      name: 'tooltips',
      type: 'boolean',
      default: true,
      description: 'Muestra wiTooltip con item.label en acciones (y ariaLabel en el trigger)',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      default: 'Acciones',
      description: 'Nombre accesible (alias aria-label). Localizable desde la app',
    },
    {
      name: 'closeLabel',
      type: 'string | undefined',
      default: 'undefined → provideWiOverlaysI18n().dialogCloseLabel',
      description: 'aria-label del botón X que cierra el dial',
    },
    {
      name: 'triggerIcon',
      type: 'string',
      default: 'ellipsis-vertical',
      description: 'Icono del trigger cerrado (registrado con provideWiIcons)',
    },
  ],
  outputs: [
    {
      name: 'itemClick',
      type: 'WiSpeedDialItem',
      description: 'Se emite al activar una acción',
    },
    {
      name: 'openChange',
      type: 'boolean',
      description: 'Cambio del model open',
    },
  ],
  variants: [],
  parts: [
    { selector: 'button[aria-expanded="false"]', description: 'Trigger cerrado (icon-only)' },
    { selector: 'button[data-speed-dial-close]', description: 'Botón X para cerrar el dial abierto' },
    { selector: '[role=toolbar]', description: 'Barra de acciones abierta (X + items)' },
  ],
  keyboard: [
    { key: 'Enter / Space', description: 'Abre el dial desde el trigger' },
    { key: 'Escape', description: 'Cierra el dial' },
    {
      key: 'ArrowLeft / ArrowRight (o Up / Down)',
      description: 'Navega entre acciones según direction',
    },
    { key: 'Home / End', description: 'Primera / última acción' },
  ],
  a11yNotes:
    'Trigger con aria-expanded + aria-haspopup. Abierto: botón X (closeLabel / dialogCloseLabel) + acciones. Cada acción es botón con aria-label (item.label). Tooltip complementario vía wiTooltip (no sustituye aria-label). Cierre por X, Escape y clic fuera. Iconos decorativos vía wi-icon sin label.',
  example: {
    import: `import { WiSpeedDialComponent, type WiSpeedDialItem } from '@wiloc/ui/overlays';
import { provideWiIcons } from '@wiloc/ui/icon';`,
    template: `<wi-speed-dial
  [items]="actions"
  direction="left"
  ariaLabel="Acciones del activo"
  (itemClick)="onAction($event)"
/>`,
  },
} as const;
