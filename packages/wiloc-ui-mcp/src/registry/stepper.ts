/**
 * Registry seed for @wldeveloperapps/ui-mcp (paquete previsto en packages/wiloc-ui-mcp).
 * Documenta solo API pública — no Spartan ni rutas internas.
 */
export const wiStepperRegistryEntry = {
  name: 'stepper',
  selector: 'wi-stepper',
  entryPoint: '@wldeveloperapps/ui/navigation',
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
        'Pasos de la nav. Cada WiStepperStep es { id, label, icon, disabled? }. icon es un name registrado con provideWiIcons. El contenido del paso no va en el step.',
    },
    {
      name: 'value',
      type: 'string (model)',
      default: "''",
      description:
        'Id del paso activo (two-way), el mismo id de WiStepperStep y de [wiStepperPanel]. No es un índice. Si no coincide con ningún paso, se muestra el primero.',
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
  limits: [
    'value es el id del paso, no un índice ni el label.',
    'El contenido es un panel proyectado [wiStepperPanel]="id", no un string del step.',
    'No trae Anterior, Siguiente ni submit. La app llama selectNext y selectPrevious. linear no limita selectNext.',
  ],
  requires: [
    'Si algún paso lleva icon, provideWiIcons con ese name. Sin iconos, ningún provider ni CSS extra.',
  ],
  example: {
    import: `import { WiStepperComponent, WiStepperPanelDirective, type WiStepperStep } from '@wldeveloperapps/ui/navigation';
import { provideWiIcons } from '@wldeveloperapps/ui/icon';`,
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
