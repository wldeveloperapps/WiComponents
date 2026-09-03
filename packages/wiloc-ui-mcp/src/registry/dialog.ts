/**
 * Registry seed for @wiloc/ui-mcp (paquete previsto en packages/wiloc-ui-mcp).
 * Documenta solo API pública — no Spartan ni rutas internas.
 */
export const wiDialogRegistryEntry = {
  name: 'dialog',
  selector: 'wi-dialog',
  entryPoint: '@wiloc/ui/overlays',
  status: 'experimental' as const,
  exports: [
    'WiDialogComponent',
    'WiDialogTriggerDirective',
    'WiDialogPortalDirective',
    'WiDialogCloseDirective',
    'WiDialogContentComponent',
    'WiDialogHeaderComponent',
    'WiDialogTitleComponent',
    'WiDialogDescriptionComponent',
    'WiDialogFooterComponent',
    'WiDialogSize',
    'WiDialogState',
    'WiOverlaysI18n',
    'provideWiOverlaysI18n',
  ],
  inputs: [
    {
      name: 'state',
      type: "WiDialogState ('open' | 'closed')",
      default: 'closed',
      description: 'Estado controlado (model two-way). Alternativa: wiDialogTrigger / open()',
    },
    {
      name: 'size',
      type: 'WiDialogSize',
      default: 'md',
      description:
        'Ancho del panel centrado: sm (24rem) | md (32rem) | lg (42rem), con tope calc(100vw-2rem) en viewports estrechos.',
    },
    {
      name: 'disableClose',
      type: 'boolean',
      default: false,
      description: 'Bloquea cierre por Escape y backdrop (Brain acopla ambos)',
    },
    {
      name: 'showCloseButton',
      type: 'boolean',
      default: true,
      description: 'En wi-dialog-content: muestra el botón X (requiere icono x-mark registrado)',
    },
    {
      name: 'closeLabel',
      type: 'string | undefined',
      default: 'undefined → provideWiOverlaysI18n.dialogCloseLabel (Close)',
      description: 'aria-label del botón X; preferir provideWiOverlaysI18n a nivel app',
    },
  ],
  outputs: [
    { name: 'closed', type: 'unknown', description: 'Se emite al cerrar (resultado opcional)' },
    {
      name: 'stateChanged',
      type: 'WiDialogState',
      description: 'Se emite cuando el estado pasa a open o closed',
    },
  ],
  variants: [],
  parts: [
    {
      selector: '[wiDialogTrigger]',
      description: 'Abre el dialog al click (o wiDialogTriggerFor)',
    },
    { selector: '[wiDialogPortal]', description: 'Marca el ng-template / *portal del panel' },
    { selector: '[wiDialogClose]', description: 'Cierra el dialog al click' },
    { selector: 'wi-dialog-content', description: 'Panel visual (tokens + size + close opcional)' },
    { selector: 'wi-dialog-header', description: 'Cabecera (título / descripción)' },
    { selector: 'wi-dialog-title', description: 'Título accesible (aria-labelledby)' },
    { selector: 'wi-dialog-description', description: 'Descripción (aria-describedby)' },
    { selector: 'wi-dialog-footer', description: 'Acciones; stack en móvil' },
  ],
  keyboard: [
    'Escape cierra (si disableClose es false)',
    'Tab / Shift+Tab ciclan el foco dentro del dialog',
    'Focus trap y restore focus al cerrar',
  ],
  a11yNotes:
    'role=dialog + aria-modal. Título vía wi-dialog-title. El botón X es icon-only: provideWiOverlaysI18n.dialogCloseLabel o closeLabel. Registrar provideWiIcons({ "x-mark": … }) si showCloseButton. Overlays portaled heredan .wi-dark del documento.',
  example: {
    import: `import {
  WiDialogCloseDirective,
  WiDialogComponent,
  WiDialogContentComponent,
  WiDialogDescriptionComponent,
  WiDialogFooterComponent,
  WiDialogHeaderComponent,
  WiDialogPortalDirective,
  WiDialogTitleComponent,
  WiDialogTriggerDirective,
  provideWiOverlaysI18n,
} from '@wiloc/ui/overlays';

provideWiOverlaysI18n({ dialogCloseLabel: () => 'Cerrar' });`,
    template: `<wi-dialog size="md">
  <button wiButton type="button" wiDialogTrigger>Abrir</button>
  <ng-template wiDialogPortal>
    <wi-dialog-content>
      <wi-dialog-header>
        <wi-dialog-title>Título</wi-dialog-title>
        <wi-dialog-description>Descripción</wi-dialog-description>
      </wi-dialog-header>
      <wi-dialog-footer>
        <button wiButton type="button" variant="secondary" wiDialogClose>Cancelar</button>
        <button wiButton type="button" wiDialogClose>Guardar</button>
      </wi-dialog-footer>
    </wi-dialog-content>
  </ng-template>
</wi-dialog>`,
  },
} as const;
