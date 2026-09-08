/**
 * Registry seed for @wiloc/ui-mcp (paquete previsto en packages/wiloc-ui-mcp).
 * Documenta solo API pública — no Spartan ni rutas internas.
 */
export const wiCardRegistryEntry = {
  name: 'card',
  selector: 'wi-card',
  entryPoint: '@wiloc/ui/data-display',
  status: 'experimental' as const,
  exports: [
    'WiCardComponent',
    'WiCardHeaderComponent',
    'WiCardTitleComponent',
    'WiCardDescriptionComponent',
    'WiCardActionComponent',
    'WiCardContentComponent',
    'WiCardFooterComponent',
    'WiCardSize',
  ],
  inputs: [
    {
      name: 'size',
      type: 'WiCardSize',
      default: 'md',
      description:
        'Layout: sm (host py-3 + gap-2; header/content px-3) | md (host py-4 + gap-2; header/content px-4) | none (flush: py-0 + gap-0, header/content/footer sin padding; lo pone la app). WiCardSize = sm | md | none. class del consumidor se fusiona y gana conflictos de utilities (p-0, overflow-visible, flex en el header) sin !important',
    },
  ],
  outputs: [],
  variants: [],
  parts: [
    {
      selector: 'wi-card-header',
      description:
        'Zona superior (título, descripción, acción). Por defecto grid + px; class del consumidor (flex, px-4 py-3, bg-primary) gana. size=none sin padding',
    },
    {
      selector: 'wi-card-title',
      description: 'Título tipográfico del card (hereda color del padre)',
    },
    { selector: 'wi-card-description', description: 'Texto de apoyo bajo el título' },
    { selector: 'wi-card-action', description: 'Acción alineada al header (p. ej. botón)' },
    {
      selector: 'wi-card-content',
      description:
        'Cuerpo principal proyectado. size md/sm aplica px; size=none sin padding. class se fusiona (p-0, flex-1)',
    },
    { selector: 'wi-card-footer', description: 'Pie con borde superior (acciones)' },
  ],
  keyboard: [],
  a11yNotes:
    'Contenedor presentacional. No es interactivo por sí mismo. El nombre accesible de acciones va en los controles hijos (botones, enlaces). Preferir headings semánticos dentro de wi-card-title cuando el card sea una sección. overflow-hidden no va por defecto (recorta menús); en header tintado a borde, añadir overflow-hidden en el card para el radio.',
  example: {
    import: `import {
  WiCardActionComponent,
  WiCardComponent,
  WiCardContentComponent,
  WiCardDescriptionComponent,
  WiCardFooterComponent,
  WiCardHeaderComponent,
  WiCardTitleComponent,
} from '@wiloc/ui/data-display';`,
    template: `<wi-card>
  <wi-card-header>
    <wi-card-title>Resumen</wi-card-title>
    <wi-card-description>Estado del sitio</wi-card-description>
  </wi-card-header>
  <wi-card-content>Contenido</wi-card-content>
  <wi-card-footer>Acciones</wi-card-footer>
</wi-card>

<!-- Panel flush (dashboard): size=none, sin !important ni CSS de app -->
<wi-card size="none" class="flex h-full min-h-0 flex-col overflow-hidden">
  <wi-card-header class="flex items-center bg-primary px-4 py-3 text-on-primary">
    <wi-card-title>Zona</wi-card-title>
    <wi-card-action>…</wi-card-action>
  </wi-card-header>
  <wi-card-content class="flex min-h-0 flex-1 flex-col p-0">
    <!-- chart -->
  </wi-card-content>
</wi-card>`,
  },
} as const;
