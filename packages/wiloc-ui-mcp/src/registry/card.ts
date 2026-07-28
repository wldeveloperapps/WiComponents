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
        'Padding interno vía clases estáticas: sm (0.75rem / p-3) | md (1rem / p-4). Gap entre secciones fijo (0.5rem / gap-2)',
    },
  ],
  outputs: [],
  variants: [],
  parts: [
    { selector: 'wi-card-header', description: 'Zona superior (título, descripción, acción)' },
    { selector: 'wi-card-title', description: 'Título tipográfico del card' },
    { selector: 'wi-card-description', description: 'Texto de apoyo bajo el título' },
    { selector: 'wi-card-action', description: 'Acción alineada al header (p. ej. botón)' },
    { selector: 'wi-card-content', description: 'Cuerpo principal proyectado' },
    { selector: 'wi-card-footer', description: 'Pie con borde superior (acciones)' },
  ],
  keyboard: [],
  a11yNotes:
    'Contenedor presentacional. No es interactivo por sí mismo. El nombre accesible de acciones va en los controles hijos (botones, enlaces). Preferir headings semánticos dentro de wi-card-title cuando el card sea una sección.',
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
</wi-card>`,
  },
} as const;
