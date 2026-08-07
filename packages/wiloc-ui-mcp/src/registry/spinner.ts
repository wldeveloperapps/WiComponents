/**
 * Registry seed for @wiloc/ui-mcp (paquete previsto en packages/wiloc-ui-mcp).
 * Documenta solo API pública — no Spartan ni rutas internas.
 */
export const wiSpinnerRegistryEntry = {
  name: 'spinner',
  selector: 'wi-spinner',
  entryPoint: '@wiloc/ui/data-display',
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
  example: {
    import: `import { WiSpinnerComponent } from '@wiloc/ui/data-display';`,
    template: `<div class="text-primary" aria-busy="true">
  <wi-spinner size="lg" ariaLabel="Cargando datos" />
</div>`,
  },
} as const;
