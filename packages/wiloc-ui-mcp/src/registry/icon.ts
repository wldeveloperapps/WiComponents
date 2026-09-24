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
      type: 'WiIconName | null',
      default: null,
      description:
        'Nombre registrado con provideWiIcons (oficial o custom de la app). Opcional si usas src. Sin registro → no renderiza (warning en dev). Exactamente uno de name o src',
    },
    {
      name: 'src',
      type: 'string | null',
      default: null,
      description:
        'Ruta de la app (assets/images/gate-open.svg) o URL http(s) de un SVG. No se registra en provideWiIcons. Requiere provideHttpClient(). Solo SVG',
    },
    {
      name: 'variant',
      type: "WiIconVariant ('outline' | 'solid')",
      default: 'outline',
      description:
        'Solo aplica a name. Si la variante pedida no existe, usa la otra (warning en desarrollo). Con src se ignora',
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
        'null → decorativo (aria-hidden). Con texto → role=img + aria-label. Igual con name y con src. Color vía currentColor / class en el host',
    },
    {
      name: 'preserveColors',
      type: 'boolean',
      default: false,
      description:
        'Solo src. false: fill/stroke de color pasan a currentColor (fill=none se conserva; no se pone fill=currentColor en el svg raíz). true: equivale a WiIconGlyph.preserveColors',
    },
  ],
  outputs: [],
  variants: ['outline', 'solid'],
  keyboard: [],
  a11yNotes:
    'Sin label es decorativo (aria-hidden). Con label: role=img + aria-label. Igual por name o por src. Botón solo-icono: aria-label en el botón, no solo en wi-icon. No uses PrimeIcons ni <i class="pi-*">. Catálogo oficial: importar glifos de @wldeveloperapps/ui/icon/heroicons y registrar con provideWiIcons (no uses WI_HEROICONS_CURATED en apps). Custom tipado: WiIconGlyph + provideWiIcons. SVG suelto: input src + provideHttpClient(), sin <img> ni innerHTML.',
  example: {
    import: `import { provideHttpClient } from '@angular/common/http';
import { provideWiIcons, WiIconComponent, type WiIconGlyph } from '@wldeveloperapps/ui/icon';
import { homeOutline, trashOutline, trashSolid } from '@wldeveloperapps/ui/icon/heroicons';

provideHttpClient();

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
<wi-icon src="assets/images/gate-open.svg" class="text-success" />
<wi-icon [src]="asset.urlIcon" size="sm" />
<wi-icon src="assets/images/logo.svg" [preserveColors]="true" />

<button type="button" aria-label="Eliminar" wiButton iconOnly>
  <wi-icon name="trash" />
</button>`,
  },
} as const;
