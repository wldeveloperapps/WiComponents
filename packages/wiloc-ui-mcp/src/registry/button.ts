/**
 * Registry seed for @wiloc/ui-mcp (paquete previsto en packages/wiloc-ui-mcp).
 * Documenta solo API pública — no Spartan ni rutas internas.
 */
export const wiButtonRegistryEntry = {
  name: 'button',
  selector: 'button[wiButton], a[wiButton]',
  entryPoint: '@wiloc/ui/button',
  status: 'experimental' as const,
  exports: ['WiButtonDirective', 'WiButtonVariant', 'WiButtonSize', 'WiButtonType'],
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
      description: 'type nativo de <button>: button | submit | reset. Ignorado en <a>',
    },
    {
      name: 'loading',
      type: 'boolean',
      default: false,
      description: 'Muestra spinner CSS, deshabilita el control y pone aria-busy',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      description:
        'Deshabilita el control. En <a> usa aria-disabled + tabindex=-1 (no hay disabled nativo)',
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
  keyboard: ['Tab', 'Enter', 'Space (solo button nativo)'],
  a11yNotes:
    'Directiva sobre el nativo: button para acciones, a[href]/routerLink para navegación. No poner role=button en el enlace. iconOnly: ariaLabel. loading: aria-busy. En <a> disabled no es nativo: aria-disabled + tabindex=-1 + preventDefault.',
  example: {
    import: `import { WiButtonDirective } from '@wiloc/ui/button';`,
    template: `<button wiButton type="button" variant="primary">Guardar</button>
<a wiButton variant="outline" href="/settings">Ajustes</a>`,
  },
} as const;
