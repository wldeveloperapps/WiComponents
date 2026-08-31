/**
 * Registry seed for @wiloc/ui-mcp (paquete previsto en packages/wiloc-ui-mcp).
 * Documenta solo API pública — no Spartan ni rutas internas.
 */
export const wiBreadcrumbRegistryEntry = {
  name: 'breadcrumb',
  selector: 'wi-breadcrumb',
  entryPoint: '@wiloc/ui/navigation',
  status: 'experimental' as const,
  exports: ['WiBreadcrumbComponent', 'WiBreadcrumbItem'],
  inputs: [
    {
      name: 'items',
      type: 'readonly WiBreadcrumbItem[]',
      default: '[]',
      description:
        'Segmentos — los define la app: id, label (i18n), href opcional, icon (provideWiIcons), iconOnly. El último es la página actual. La librería no hardcodea textos, rutas ni el icono de inicio.',
    },
    {
      name: 'ariaLabel',
      type: 'string | undefined',
      default: undefined,
      description: 'Nombre accesible de la nav (alias aria-label). Localizable desde la app.',
    },
  ],
  outputs: [
    {
      name: 'itemClick',
      type: 'WiBreadcrumbItem',
      description:
        'Clic en un ancestro con href. Clic izquierdo sin modificadores evita la navegación nativa para que la app use el Router. Ctrl/clic medio abre el href. Enlaces http(s)/mailto/tel navegan de forma nativa.',
    },
  ],
  parts: [
    {
      selector: 'wi-breadcrumb',
      description: 'Contenedor; items / ariaLabel; exportAs wiBreadcrumb',
    },
    { selector: 'nav.wi-breadcrumb__nav', description: 'Landmark de navegación' },
    {
      selector: 'ol.wi-breadcrumb__list',
      description: 'Cápsula: border-outline-variant + degradado surface-container-lowest → low',
    },
    { selector: 'a.wi-breadcrumb__link', description: 'Ancestro con href' },
    {
      selector: 'span.wi-breadcrumb__current',
      description: 'Página actual (pastilla); aria-current=page',
    },
  ],
  keyboard: ['Tab', 'Enter (enlace nativo)'],
  a11yNotes:
    'nav con aria-label de la app. Lista ol. El último ítem es span con aria-current=page (no es enlace). iconOnly usa label como aria-label del enlace. Separadores decorativos (aria-hidden). Iconos wi-icon sin label (decorativos).',
  example: {
    import: `import { WiBreadcrumbComponent, type WiBreadcrumbItem } from '@wiloc/ui/navigation';
import { provideWiIcons } from '@wiloc/ui/icon';
import { homeOutline } from '@wiloc/ui/icon/heroicons';`,
    template: `<wi-breadcrumb
  [items]="items"
  ariaLabel="Migas"
  (itemClick)="onCrumb($event)"
/>`,
  },
} as const;
