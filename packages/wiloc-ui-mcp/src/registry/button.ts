/**
 * Registry seed for @wiloc/ui-mcp (paquete previsto en packages/wiloc-ui-mcp).
 * Documenta solo API pública — no Spartan ni rutas internas.
 */
export const wiButtonRegistryEntry = {
  name: 'button',
  selector: 'wi-button',
  entryPoint: '@wiloc/ui/button',
  status: 'experimental' as const,
  exports: ['WiButtonComponent', 'WiButtonVariant', 'WiButtonSize', 'WiButtonType'],
  inputs: [
    {
      name: 'variant',
      type: 'WiButtonVariant',
      default: 'primary',
      description: 'Apariencia visual: primary | secondary | danger | ghost | outline',
    },
    {
      name: 'size',
      type: 'WiButtonSize',
      default: 'md',
      description: 'Tamaño: sm | md | lg',
    },
    {
      name: 'type',
      type: 'WiButtonType',
      default: 'button',
      description: 'type nativo del button: button | submit | reset',
    },
    {
      name: 'loading',
      type: 'boolean',
      default: false,
      description: 'Muestra spinner, deshabilita el control y pone aria-busy',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      description: 'Deshabilita el botón',
    },
    {
      name: 'iconOnly',
      type: 'boolean',
      default: false,
      description: 'Layout cuadrado para botones solo-icono',
    },
    {
      name: 'ariaLabel',
      type: 'string | null',
      default: null,
      description: 'Nombre accesible (recomendado con iconOnly)',
    },
  ],
  outputs: [],
  variants: ['primary', 'secondary', 'danger', 'ghost', 'outline'],
  keyboard: ['Tab', 'Enter', 'Space'],
  a11yNotes:
    'Botón nativo. Con iconOnly proporcionar ariaLabel. loading expone aria-busy y deshabilita el control.',
  example: {
    import: `import { WiButtonComponent } from '@wiloc/ui/button';`,
    template: `<wi-button variant="primary">Guardar</wi-button>`,
  },
} as const;
