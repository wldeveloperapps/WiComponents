/**
 * Registry seed for @wiloc/ui-mcp (paquete previsto en packages/wiloc-ui-mcp).
 * Documenta solo API pública — no Spartan ni rutas internas.
 */
export const wiPopoverRegistryEntry = {
  name: 'popover',
  selector: 'wi-popover',
  entryPoint: '@wiloc/ui/overlays',
  status: 'experimental' as const,
  exports: [
    'WiPopoverComponent',
    'WiPopoverTriggerDirective',
    'WiPopoverPortalDirective',
    'WiPopoverCloseDirective',
    'WiPopoverContentComponent',
    'WiPopoverHeaderComponent',
    'WiPopoverTitleComponent',
    'WiPopoverDescriptionComponent',
    'WiPopoverAlign',
    'WiPopoverSize',
    'WiPopoverState',
  ],
  inputs: [
    {
      name: 'state',
      type: "WiPopoverState ('open' | 'closed')",
      default: 'closed',
      description:
        'Estado controlado (model two-way). Preferible wiPopoverTrigger / open(origin) para anclar al trigger',
    },
    {
      name: 'size',
      type: 'WiPopoverSize',
      default: 'sm',
      description:
        'Ancho del panel anclado: sm (18rem) | md (24rem), con tope calc(100vw-2rem) en viewports estrechos.',
    },
    {
      name: 'align',
      type: "WiPopoverAlign ('start' | 'center' | 'end')",
      default: 'center',
      description: 'Alineación horizontal del panel respecto al trigger',
    },
    {
      name: 'sideOffset',
      type: 'number',
      default: '8',
      description: 'Separación vertical respecto al trigger (px)',
    },
    {
      name: 'offsetX',
      type: 'number',
      default: '0',
      description: 'Desplazamiento horizontal adicional (px)',
    },
    {
      name: 'ariaLabel',
      type: 'string | undefined',
      default: 'undefined',
      description:
        'Nombre accesible del panel cuando no hay wi-popover-title. Lo aporta la app (i18n).',
    },
    {
      name: 'autoFocus',
      type: 'boolean',
      default: 'true',
      description: 'Mueve el foco al primer tabbable del panel al abrir',
    },
    {
      name: 'disableClose',
      type: 'boolean',
      default: 'false',
      description: 'Si true, no cierra con Escape. Por defecto false (dismissible)',
    },
    {
      name: 'closeOnOutsidePointerEvents',
      type: 'boolean',
      default: 'true',
      description:
        'Cierra al clic fuera del panel. Un overlay CDK anidado (wi-select, datepicker, tooltip, otro popover) no cuenta como fuera.',
    },
  ],
  outputs: [
    {
      name: 'closed',
      type: 'unknown',
      description: 'Se emite al cerrar (resultado opcional)',
    },
    {
      name: 'stateChanged',
      type: 'WiPopoverState',
      description: 'Se emite cuando el estado pasa a open o closed',
    },
  ],
  variants: [],
  parts: [
    {
      selector: '[wiPopoverTrigger]',
      description: 'Abre o cierra el popover anclado al host (o wiPopoverTriggerFor)',
    },
    { selector: '[wiPopoverPortal]', description: 'Marca el ng-template / *portal del panel' },
    { selector: '[wiPopoverClose]', description: 'Cierra el popover al click' },
    { selector: 'wi-popover-content', description: 'Panel visual (tokens + size)' },
    { selector: 'wi-popover-header', description: 'Cabecera (título / descripción)' },
    { selector: 'wi-popover-title', description: 'Título accesible (aria-labelledby)' },
    { selector: 'wi-popover-description', description: 'Descripción (aria-describedby)' },
  ],
  keyboard: [
    'Escape cierra por defecto (disableClose=false)',
    'Tab / Shift+Tab entre controles del panel',
    'Clic fuera cierra (closeOnOutsidePointerEvents); overlays CDK anidados no cuentan como fuera',
    'Clic en el trigger hace toggle',
    'Focus al primer tabbable al abrir; restore al trigger al cerrar',
  ],
  a11yNotes:
    'role=dialog en el pane (sin backdrop / aria-modal=false). Título vía wi-popover-title (aria-labelledby) o ariaLabel. Descripción opcional (aria-describedby). Anclado al trigger; no sustituye a wi-menu ni a wi-confirm-popup. Un overlay CDK anidado (p. ej. wi-select en el panel) no cierra el popover. Overlays portaled heredan .wi-dark del documento.',
  example: {
    import: `import {
  WiPopoverCloseDirective,
  WiPopoverComponent,
  WiPopoverContentComponent,
  WiPopoverDescriptionComponent,
  WiPopoverHeaderComponent,
  WiPopoverPortalDirective,
  WiPopoverTitleComponent,
  WiPopoverTriggerDirective,
} from '@wiloc/ui/overlays';
import { WiButtonDirective } from '@wiloc/ui/button';`,
    template: `<wi-popover>
  <button wiButton type="button" wiPopoverTrigger>Abrir</button>
  <ng-template wiPopoverPortal>
    <wi-popover-content>
      <wi-popover-header>
        <wi-popover-title>Detalles</wi-popover-title>
        <wi-popover-description>Contenido aportado por la app.</wi-popover-description>
      </wi-popover-header>
      <button wiButton type="button" variant="secondary" wiPopoverClose>Cerrar</button>
    </wi-popover-content>
  </ng-template>
</wi-popover>`,
  },
} as const;
