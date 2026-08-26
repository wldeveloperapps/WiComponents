/**
 * Registry seed for @wiloc/ui-mcp (paquete previsto en packages/wiloc-ui-mcp).
 * Documenta solo API pública — no Spartan ni rutas internas.
 */
export const wiStepperRegistryEntry = {
  name: 'stepper',
  selector: 'wi-stepper',
  entryPoint: '@wiloc/ui/navigation',
  status: 'experimental' as const,
  exports: [
    'WiStepperComponent',
    'WiStepperPanelDirective',
    'WiStepperStep',
    'WiStepperOrientation',
    'WiStepperStepState',
  ],
  inputs: [
    {
      name: 'steps',
      type: 'readonly WiStepperStep[]',
      default: '[]',
      description:
        'Pasos de la nav — los define la app: id, label (i18n), icon (provideWiIcons), disabled opcional. La librería no hardcodea textos ni iconos.',
    },
    {
      name: 'value',
      type: 'string (model)',
      default: "''",
      description:
        'Id del paso activo (two-way). Si no coincide con ningún paso, se muestra el primero.',
    },
    {
      name: 'orientation',
      type: "WiStepperOrientation ('vertical' | 'horizontal')",
      default: 'vertical',
      description:
        'vertical: nav a la izquierda cuando el stepper tiene ≥36rem (container query); apilada si el contenedor es estrecho. horizontal: nav arriba.',
    },
    {
      name: 'linear',
      type: 'boolean',
      default: true,
      description:
        'Si true, la nav no permite saltar a pasos futuros (sí volver). selectNext/selectPrevious no están limitados.',
    },
    {
      name: 'ariaLabel',
      type: 'string | undefined',
      default: undefined,
      description: 'Nombre accesible de la nav (alias aria-label). Localizable desde la app.',
    },
    {
      name: 'wiStepperPanel',
      type: 'string',
      default: undefined,
      description: 'En [wiStepperPanel]: id del paso cuyo contenido se proyecta.',
    },
  ],
  outputs: [
    {
      name: 'valueChange',
      type: 'string',
      description: 'Cambio del paso activo (pair con value)',
    },
  ],
  variants: [{ name: 'orientation', values: ['vertical', 'horizontal'] }],
  parts: [
    {
      selector: 'wi-stepper',
      description: 'Contenedor; steps / value / orientation / linear; exportAs wiStepper',
    },
    { selector: 'nav.wi-stepper__nav', description: 'Lista de pasos (ol de botones)' },
    {
      selector: 'button.wi-stepper__trigger',
      description: 'Trigger del paso; aria-current=step en el activo',
    },
    {
      selector: '[wiStepperPanel]',
      description: 'Panel (role=region); hidden si no es el paso activo',
    },
  ],
  keyboard: [
    {
      key: 'ArrowDown / ArrowUp (vertical) o ArrowRight / ArrowLeft (horizontal)',
      description: 'Mueve y activa el siguiente / anterior paso seleccionable',
    },
    { key: 'Home / End', description: 'Primer / último paso seleccionable' },
    { key: 'Enter / Space', description: 'Activa el paso enfocado (botón nativo)' },
  ],
  a11yNotes:
    'nav con aria-label de la app. Cada trigger es button; el actual tiene aria-current=step. Iconos decorativos (wi-icon sin label). Paneles role=region + aria-labelledby al label del paso. En linear, los futuros tienen aria-disabled (mismo estilo muted que los completados, sin opacity de disabled nativo). Back/Next/submit: la app, no la librería.',
  example: {
    import: `import { WiStepperComponent, WiStepperPanelDirective, type WiStepperStep } from '@wiloc/ui/navigation';
import { provideWiIcons } from '@wiloc/ui/icon';`,
    template: `<wi-stepper
  #stepper="wiStepper"
  [steps]="steps"
  [(value)]="active"
  orientation="vertical"
  linear
  ariaLabel="Alta"
>
  <div wiStepperPanel="details">
    <!-- formulario de la app -->
    <button type="button" (click)="stepper.selectNext()">Siguiente</button>
  </div>
  <div wiStepperPanel="apps">…</div>
</wi-stepper>`,
  },
} as const;
