/**
 * Registry seed for @wiloc/ui-mcp.
 * Documenta solo API pública — no Heroicons ni rutas internas.
 */
export const wiIconRegistryEntry = {
  name: 'icon',
  selector: 'wi-icon',
  entryPoint: '@wiloc/ui/icon',
  status: 'experimental' as const,
  exports: [
    'WiIconComponent',
    'provideWiIcons',
    'WI_ICONS',
    'WiIconDefinition',
    'WiIconGlyph',
    'WiIconName',
    'WiIconRegistry',
    'WiIconSize',
    'WiIconVariant',
    'WiSvgNode',
    'WiSvgTag',
  ],
  inputs: [
    {
      name: 'name',
      type: 'string',
      default: 'required',
      description: 'Nombre registrado con provideWiIcons. Permite iconos custom de la app',
    },
    {
      name: 'variant',
      type: "WiIconVariant ('outline' | 'solid')",
      default: 'outline',
      description: 'Si la variante pedida no existe, usa la otra (warning en desarrollo)',
    },
    {
      name: 'size',
      type: "WiIconSize ('xs' | 'sm' | 'md' | 'lg' | 'xl')",
      default: 'md',
      description: 'Tamaño tipográfico (clases Tailwind estáticas + width/height del SVG)',
    },
    {
      name: 'label',
      type: 'string | null',
      default: null,
      description:
        'null → decorativo (aria-hidden). Con texto → role=img + aria-label. Color vía currentColor',
    },
  ],
  outputs: [],
  variants: ['outline', 'solid'],
  keyboard: [],
  a11yNotes:
    'Sin label es decorativo. Con label expone nombre accesible. No uses PrimeIcons ni <i class="pi-*">. Catálogo oficial: @wiloc/ui/icon/heroicons (subconjunto). Custom: WiIconGlyph + provideWiIcons.',
  example: {
    import: `import { provideWiIcons, WiIconComponent } from '@wiloc/ui/icon';
import { homeOutline, trashOutline, trashSolid } from '@wiloc/ui/icon/heroicons';

provideWiIcons({
  home: { outline: homeOutline },
  trash: { outline: trashOutline, solid: trashSolid },
});`,
    template: `<wi-icon name="home" />
<wi-icon name="trash" variant="solid" class="text-error" />
<wi-icon name="exclamation-triangle" label="Advertencia" />`,
  },
} as const;
