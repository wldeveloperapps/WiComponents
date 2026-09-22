/**
 * Registry seed for @wldeveloperapps/ui-mcp.
 * Documenta solo API pública — no rutas internas ni WI_HEROICONS_CURATED (solo Storybook).
 */
export const wiIconRegistryEntry = {
  name: 'icon',
  selector: 'wi-icon',
  entryPoint: '@wldeveloperapps/ui/icon',
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
      description:
        'Nombre registrado con provideWiIcons (oficial o custom de la app). Sin registro → no renderiza (warning en dev)',
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
        'null → decorativo (aria-hidden). Con texto → role=img + aria-label. Color vía currentColor / class en el host',
    },
  ],
  outputs: [],
  variants: ['outline', 'solid'],
  keyboard: [],
  a11yNotes:
    'Sin label es decorativo. Con label expone nombre accesible. Botón solo-icono: aria-label en el botón, no solo en wi-icon. No uses PrimeIcons ni <i class="pi-*">. Catálogo oficial: importar glifos de @wldeveloperapps/ui/icon/heroicons y registrar con provideWiIcons (no uses WI_HEROICONS_CURATED en apps). Custom: define WiIconGlyph en la app + provideWiIcons.',
  example: {
    import: `import { provideWiIcons, WiIconComponent, type WiIconGlyph } from '@wldeveloperapps/ui/icon';
import { homeOutline, trashOutline, trashSolid } from '@wldeveloperapps/ui/icon/heroicons';

// 1) Oficiales: importa SOLO los glifos que uses (tree shaking)
provideWiIcons({
  home: { outline: homeOutline },
  trash: { outline: trashOutline, solid: trashSolid },
});

// 2) Custom de la app (mismo provideWiIcons; el nombre es libre)
const brandMark: WiIconGlyph = {
  viewBox: '0 0 24 24',
  nodes: [{ tag: 'path', attrs: { d: 'M12 2 2 22h20L12 2Z' } }],
};
provideWiIcons({
  'brand-mark': { solid: brandMark },
});`,
    template: `<!-- Tras registrar en app.config / providers -->
<wi-icon name="home" />
<wi-icon name="trash" variant="solid" class="text-error" />
<wi-icon name="exclamation-triangle" label="Advertencia" />
<wi-icon name="brand-mark" variant="solid" label="Marca" />

<button type="button" aria-label="Eliminar" wiButton iconOnly>
  <wi-icon name="trash" />
</button>`,
  },
} as const;
