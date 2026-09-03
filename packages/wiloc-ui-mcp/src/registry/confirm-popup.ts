/**
 * Registry seed for @wiloc/ui-mcp (paquete previsto en packages/wiloc-ui-mcp).
 * Documenta solo API pública — no Spartan ni rutas internas.
 */
export const wiConfirmPopupRegistryEntry = {
  name: 'confirm-popup',
  selector: 'wi-confirm-popup',
  entryPoint: '@wiloc/ui/overlays',
  status: 'experimental' as const,
  exports: [
    'WiConfirmPopupComponent',
    'WiConfirmPopupTriggerDirective',
    'WiConfirmPopupAlign',
    'WiConfirmPopupSize',
    'WiConfirmPopupState',
    'WiConfirmPopupConfirmVariant',
    'WiOverlaysI18n',
    'provideWiOverlaysI18n',
  ],
  inputs: [
    {
      name: 'state',
      type: "WiConfirmPopupState ('open' | 'closed')",
      default: 'closed',
      description:
        'Estado controlado (model two-way). Preferible wiConfirmPopupTrigger / open(origin) para anclar al trigger',
    },
    {
      name: 'size',
      type: 'WiConfirmPopupSize',
      default: 'sm',
      description:
        'Ancho del panel anclado: sm (18rem) | md (24rem), con tope calc(100vw-2rem) en viewports estrechos.',
    },
    {
      name: 'align',
      type: "WiConfirmPopupAlign ('start' | 'center' | 'end')",
      default: 'center',
      description: 'Alineación horizontal del popup respecto al trigger',
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
      name: 'title',
      type: 'string (required)',
      default: '—',
      description: 'Título accesible; lo aporta la app (i18n de producto)',
    },
    {
      name: 'description',
      type: 'string | undefined',
      default: 'undefined',
      description: 'Descripción opcional bajo el título',
    },
    {
      name: 'confirmLabel',
      type: 'string (required)',
      default: '—',
      description: 'Label del botón de confirmación (app / i18n)',
    },
    {
      name: 'cancelLabel',
      type: 'string | undefined',
      default: 'undefined → provideWiOverlaysI18n.confirmCancelLabel (Cancel)',
      description: 'Override del label de cancelar; preferir provideWiOverlaysI18n a nivel app',
    },
    {
      name: 'confirmVariant',
      type: "WiConfirmPopupConfirmVariant ('primary' | 'danger')",
      default: 'primary',
      description: 'Variante visual del botón de confirmación',
    },
    {
      name: 'showCancel',
      type: 'boolean',
      default: 'true',
      description: 'Muestra el botón de cancelar',
    },
    {
      name: 'loading',
      type: 'boolean',
      default: 'false',
      description: 'Loading en confirmar; deshabilita cancelar y bloquea acciones',
    },
    {
      name: 'disableClose',
      type: 'boolean',
      default: 'false',
      description: 'Si true, no cierra con Escape. Por defecto false (popup dismissible)',
    },
    {
      name: 'closeOnOutsidePointerEvents',
      type: 'boolean',
      default: 'true',
      description:
        'Cierra al clic fuera del panel. Un overlay CDK anidado no cuenta como fuera.',
    },
  ],
  outputs: [
    {
      name: 'confirmed',
      type: 'void',
      description: 'Se emite al pulsar confirmar (antes de cerrar)',
    },
    {
      name: 'cancelled',
      type: 'void',
      description:
        'Se emite al pulsar cancelar (antes de cerrar). Escape / clic fuera no emiten cancelled',
    },
    {
      name: 'closed',
      type: "'confirmed' | 'cancelled' | unknown",
      description: 'Se emite al cerrar (resultado de la acción o dismiss)',
    },
    {
      name: 'stateChanged',
      type: 'WiConfirmPopupState',
      description: 'Se emite cuando el estado pasa a open o closed',
    },
  ],
  variants: [],
  parts: [
    {
      selector: '[wiConfirmPopupTrigger]',
      description: 'Abre el confirm anclado al host (o wiConfirmPopupTriggerFor)',
    },
  ],
  keyboard: [
    'Escape cierra por defecto (disableClose=false)',
    'Tab / Shift+Tab entre botones del panel',
    'Clic fuera cierra (closeOnOutsidePointerEvents); overlays CDK anidados no cuentan como fuera',
    'Focus al primer tabbable al abrir; restore al trigger al cerrar',
  ],
  a11yNotes:
    'role=alertdialog en el pane (sin backdrop / aria-modal=false). Título vía title (aria-labelledby). Descripción opcional (aria-describedby). Anclado al trigger; sin modal a pantalla completa. Un overlay CDK anidado no cierra el popup. Overlays portaled heredan .wi-dark del documento.',
  example: {
    import: `import {
  WiConfirmPopupComponent,
  WiConfirmPopupTriggerDirective,
  provideWiOverlaysI18n,
} from '@wiloc/ui/overlays';
import { WiButtonComponent } from '@wiloc/ui/button';

provideWiOverlaysI18n({ confirmCancelLabel: () => 'Cancelar' });`,
    template: `<wi-confirm-popup
  title="Eliminar fila"
  description="Esta acción no se puede deshacer."
  confirmLabel="Eliminar"
  confirmVariant="danger"
  (confirmed)="onConfirm()"
  (cancelled)="onCancel()"
>
  <wi-button type="button" variant="danger" wiConfirmPopupTrigger>Eliminar</wi-button>
</wi-confirm-popup>`,
  },
} as const;
