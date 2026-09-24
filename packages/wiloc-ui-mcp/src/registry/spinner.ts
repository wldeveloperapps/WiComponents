/**
 * Registry seed for @wldeveloperapps/ui-mcp (paquete previsto en packages/wiloc-ui-mcp).
 * Documenta solo API pública — no Spartan ni rutas internas.
 */
export const wiSpinnerRegistryEntry = {
  name: 'spinner',
  selector: 'wi-spinner',
  entryPoint: '@wldeveloperapps/ui/data-display',
  status: 'experimental' as const,
  exports: ['WiSpinnerComponent', 'WiSpinnerSize'],
  inputs: [
    {
      name: 'size',
      type: 'WiSpinnerSize',
      default: 'md',
      description: 'Tamaño del indicador: sm | md | lg',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      default: 'Cargando',
      description: 'Nombre accesible (alias aria-label). Localizable desde la app vía i18n',
    },
  ],
  outputs: [],
  variants: [],
  parts: [],
  keyboard: [],
  a11yNotes:
    'role="status" + aria-label. Color vía currentColor (hereda del padre). Animación con motion-safe: (respeta prefers-reduced-motion). En layouts de carga, se puede complementar con aria-busy en el contenedor.',
  limits: [
    'Si omites ariaLabel el anunciado es "Cargando" (role=status): no queda decorativo.',
    'No sustituye el estado vacío de otra pantalla ni es un skeleton.',
    'No acepta valor ni porcentaje. El color hereda currentColor.',
  ],
  requires: ['Ningún provider ni CSS extra.'],
  example: {
    import: `import { WiSpinnerComponent } from '@wldeveloperapps/ui/data-display';`,
    template: `<div class="text-primary" aria-busy="true">
  <wi-spinner size="lg" ariaLabel="Cargando datos" />
</div>`,
  },
} as const;
