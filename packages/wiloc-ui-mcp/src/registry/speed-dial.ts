/**
 * Registry seed for @wldeveloperapps/ui-mcp (paquete previsto en packages/wiloc-ui-mcp).
 * Documenta solo API pública — no Spartan ni rutas internas.
 */
export const wiSpeedDialRegistryEntry = {
  name: 'speed-dial',
  selector: 'wi-speed-dial',
  entryPoint: '@wldeveloperapps/ui/overlays',
  status: 'experimental' as const,
  exports: ['WiSpeedDialComponent', 'WiSpeedDialItem', 'WiSpeedDialDirection'],
  inputs: [
    {
      name: 'items',
      type: 'readonly WiSpeedDialItem[]',
      default: '[]',
      description:
        'Acciones al abrir. Cada WiSpeedDialItem es { id, icon, label, disabled? }. icon es un name registrado con provideWiIcons, no una clase CSS. Distinto set por instancia.',
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
      description: 'Icono del trigger cerrado: un name registrado con provideWiIcons, no una clase CSS',
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
    'Trigger con aria-expanded + aria-haspopup. Abierto: botón X (closeLabel / dialogCloseLabel) + acciones. Cada acción es botón con aria-label (item.label). Tooltip complementario vía wiTooltip (no sustituye aria-label). Cierre por X, Escape, clic fuera y scroll fuera del host. Iconos decorativos vía wi-icon sin label.',
  limits: [
    'items[].icon y triggerIcon son names registrados con provideWiIcons, no clases CSS ni PrimeIcons.',
    'itemClick no ejecuta la acción: emite el WiSpeedDialItem y la app continúa.',
    'No es un wi-menu ni un grupo de botones sueltos.',
  ],
  requires: [
    'provideWiIcons con triggerIcon (ellipsis-vertical por defecto) y el icon de cada item.',
    'provideWiOverlaysI18n para el cierre (dialogCloseLabel), o closeLabel en la instancia.',
  ],
  example: {
    import: `import { WiSpeedDialComponent, type WiSpeedDialItem } from '@wldeveloperapps/ui/overlays';
import { provideWiIcons } from '@wldeveloperapps/ui/icon';`,
    template: `<wi-speed-dial
  [items]="actions"
  direction="left"
  ariaLabel="Acciones del activo"
  (itemClick)="onAction($event)"
/>`,
  },
} as const;
