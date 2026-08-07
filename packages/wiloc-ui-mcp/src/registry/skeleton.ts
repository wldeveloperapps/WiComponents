/**
 * Registry seed for @wiloc/ui-mcp (paquete previsto en packages/wiloc-ui-mcp).
 * Documenta solo API pública — no Spartan ni rutas internas.
 */
export const wiSkeletonRegistryEntry = {
  name: 'skeleton',
  selector: 'wi-skeleton',
  entryPoint: '@wiloc/ui/data-display',
  status: 'experimental' as const,
  exports: ['WiSkeletonComponent', 'WiSkeletonShape'],
  inputs: [
    {
      name: 'shape',
      type: 'WiSkeletonShape',
      default: 'rectangle',
      description: 'Forma del placeholder: rectangle | circle',
    },
    {
      name: 'size',
      type: 'string | undefined',
      default: 'undefined',
      description: 'Lado del cuadrado/círculo (CSS length). Si se define, fija width y height',
    },
    {
      name: 'width',
      type: 'string | undefined',
      default: '100% (rectangle) / 2.5rem (circle sin size)',
      description: 'Ancho CSS length',
    },
    {
      name: 'height',
      type: 'string | undefined',
      default: '1rem (rectangle) / 2.5rem (circle sin size)',
      description: 'Alto CSS length',
    },
    {
      name: 'animated',
      type: 'boolean',
      default: 'true',
      description: 'Animación pulse; usa motion-safe: (respeta prefers-reduced-motion)',
    },
  ],
  outputs: [],
  variants: [],
  parts: [],
  keyboard: [],
  a11yNotes:
    'Presentacional con aria-hidden="true". En layouts de carga, poner aria-busy (y opcionalmente aria-label) en el contenedor padre que agrupa los skeletons.',
  example: {
    import: `import { WiSkeletonComponent } from '@wiloc/ui/data-display';`,
    template: `<div aria-busy="true" aria-label="Cargando">
  <wi-skeleton shape="circle" size="2.5rem" />
  <wi-skeleton width="70%" />
  <wi-skeleton width="45%" height="0.75rem" />
</div>`,
  },
} as const;
