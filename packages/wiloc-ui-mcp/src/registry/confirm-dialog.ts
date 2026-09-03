/**
 * Registry seed for @wiloc/ui-mcp (paquete previsto en packages/wiloc-ui-mcp).
 * Documenta solo API pública — no Spartan ni rutas internas.
 */
export const wiConfirmDialogRegistryEntry = {
  name: 'confirm-dialog',
  selector: 'wi-confirm-dialog',
  entryPoint: '@wiloc/ui/overlays',
  status: 'experimental' as const,
  exports: [
    'WiConfirmDialogComponent',
    'WiConfirmDialogTriggerDirective',
    'WiConfirmDialogSize',
    'WiConfirmDialogState',
    'WiConfirmDialogConfirmVariant',
    'WiOverlaysI18n',
    'provideWiOverlaysI18n',
  ],
  inputs: [
    {
      name: 'state',
      type: "WiConfirmDialogState ('open' | 'closed')",
      default: 'closed',
      description:
        'Estado controlado (model two-way). Alternativa: wiConfirmDialogTrigger / open()',
    },
    {
      name: 'size',
      type: 'WiConfirmDialogSize',
      default: 'sm',
      description:
        'Ancho del panel centrado: sm (24rem) | md (32rem), con tope calc(100vw-2rem) en viewports estrechos.',
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
      type: "WiConfirmDialogConfirmVariant ('primary' | 'danger')",
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
      default: 'true (alert-dialog)',
      description: 'Por defecto true: no cierra con Escape / backdrop',
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
      description: 'Se emite al pulsar cancelar (antes de cerrar)',
    },
    {
      name: 'closed',
      type: "'confirmed' | 'cancelled' | unknown",
      description: 'Se emite al cerrar (resultado de la acción)',
    },
    {
      name: 'stateChanged',
      type: 'WiConfirmDialogState',
      description: 'Se emite cuando el estado pasa a open o closed',
    },
  ],
  variants: [],
  parts: [
    {
      selector: '[wiConfirmDialogTrigger]',
      description: 'Abre el confirm al click (o wiConfirmDialogTriggerFor)',
    },
  ],
  keyboard: [
    'Escape no cierra por defecto (disableClose / alertdialog)',
    'Tab / Shift+Tab ciclan el foco dentro del dialog',
    'Focus trap y restore focus al cerrar',
  ],
  a11yNotes:
    'role=alertdialog + aria-modal. Título vía title (aria-labelledby). Descripción opcional (aria-describedby). Sin botón X: la decisión es confirmar o cancelar. Overlays portaled heredan .wi-dark del documento.',
  example: {
    import: `import {
  WiConfirmDialogComponent,
  WiConfirmDialogTriggerDirective,
  provideWiOverlaysI18n,
} from '@wiloc/ui/overlays';
import { WiButtonDirective } from '@wiloc/ui/button';

provideWiOverlaysI18n({ confirmCancelLabel: () => 'Cancelar' });`,
    template: `<wi-confirm-dialog
  title="Eliminar sitio"
  description="Esta acción no se puede deshacer."
  confirmLabel="Eliminar"
  confirmVariant="danger"
  (confirmed)="onConfirm()"
  (cancelled)="onCancel()"
>
  <button wiButton type="button" variant="danger" wiConfirmDialogTrigger>Eliminar</button>
</wi-confirm-dialog>`,
  },
} as const;
