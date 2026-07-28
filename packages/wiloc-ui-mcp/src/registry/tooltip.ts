/**
 * Registry seed for @wiloc/ui-mcp (paquete previsto en packages/wiloc-ui-mcp).
 * Documenta solo API pública — no Spartan ni rutas internas.
 */
export const wiTooltipRegistryEntry = {
  name: 'tooltip',
  selector: '[wiTooltip]',
  entryPoint: '@wiloc/ui/overlays',
  status: 'experimental' as const,
  exports: [
    'WiTooltipDirective',
    'WiTooltipPosition',
    'WiTooltipGroupOptions',
    'provideWiTooltipGroup',
  ],
  inputs: [
    {
      name: 'wiTooltip',
      type: 'string | TemplateRef<void> | null',
      default: null,
      description: 'Contenido del tooltip (texto o plantilla). Vacío o null no muestra tip.',
    },
    {
      name: 'position',
      type: 'WiTooltipPosition',
      default: 'top',
      description: 'Posición preferida: top | bottom | left | right (puede hacer flip si no cabe)',
    },
    {
      name: 'showDelay',
      type: 'number',
      default: 150,
      description: 'Ms antes de mostrar',
    },
    {
      name: 'hideDelay',
      type: 'number',
      default: 100,
      description: 'Ms antes de ocultar',
    },
    {
      name: 'tooltipDisabled',
      type: 'boolean',
      default: false,
      description: 'Desactiva el tooltip (no confundir con disabled nativo del botón)',
    },
  ],
  outputs: [
    { name: 'show', type: 'void', description: 'Se emite al mostrar el tooltip' },
    { name: 'hide', type: 'void', description: 'Se emite al iniciar el cierre' },
  ],
  variants: [],
  keyboard: ['Tab (focus muestra el tip en el host focusable)'],
  a11yNotes:
    'Complementario: no usar como única fuente de información crítica. En icon-only el nombre accesible va en el botón (aria-label). Al abrir, el host recibe aria-describedby apuntando a role=tooltip. El host de [wiTooltip] debe generar caja CSS (evitar display:contents → tip en 0,0). wi-button usa inline-flex y admite [wiTooltip] en el host. En táctil el soporte hover es limitado.',
  example: {
    import: `import { WiTooltipDirective } from '@wiloc/ui/overlays';`,
    template: `<wi-button
  type="button"
  variant="danger"
  iconOnly
  ariaLabel="Eliminar"
  wiTooltip="Eliminar"
>
  <wi-icon name="trash" />
</wi-button>`,
  },
} as const;
