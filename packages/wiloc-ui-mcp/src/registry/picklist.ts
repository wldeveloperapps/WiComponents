/**
 * Registry seed for @wiloc/ui-mcp.
 * Documenta solo API pública — no @angular/aria ni rutas internas.
 */
export const wiPicklistRegistryEntry = {
  name: 'picklist',
  selector: 'wi-picklist',
  entryPoint: '@wiloc/ui/forms',
  status: 'experimental' as const,
  exports: [
    'WiPicklistComponent',
    'WiPicklistItemDirective',
    'WiPicklistSize',
    'WiPicklistCompareWith',
    'WiPicklistItemContext',
  ],
  inputs: [
    {
      name: 'value',
      type: 'unknown[] (model)',
      default: '[]',
      description:
        'Valores asignados (lista destino). Compatible con Signal Forms ([formField]) y two-way binding',
    },
    {
      name: 'options',
      type: 'readonly unknown[]',
      default: '[]',
      description: 'Universo de opciones. El origen se deriva: options menos value',
    },
    {
      name: 'optionLabel',
      type: 'string | undefined',
      default: undefined,
      description: 'Clave de objeto para el texto visible; omitir si la opción es primitiva',
    },
    {
      name: 'optionValue',
      type: 'string | undefined',
      default: undefined,
      description:
        'Clave de objeto para el valor del form; si se omite, el valor es la opción entera',
    },
    {
      name: 'compareWith',
      type: 'WiPicklistCompareWith',
      default: 'Object.is',
      description: 'Compara valores de opción con los asignados',
    },
    {
      name: 'size',
      type: 'WiPicklistSize',
      default: 'md',
      description: 'Tamaño: sm | md | lg (listas y botones)',
    },
    {
      name: 'sourceHeader',
      type: 'string',
      default: "''",
      description: 'Título visible de la lista origen (i18n de la app)',
    },
    {
      name: 'targetHeader',
      type: 'string',
      default: "''",
      description: 'Título visible de la lista destino (i18n de la app)',
    },
    {
      name: 'sourceEmptyText',
      type: 'string',
      default: "''",
      description: 'Texto cuando no hay disponibles (i18n de la app)',
    },
    {
      name: 'targetEmptyText',
      type: 'string',
      default: "''",
      description: 'Texto cuando no hay asignados (i18n de la app)',
    },
    {
      name: 'sourceAriaLabel',
      type: 'string | null',
      default: null,
      description: 'Nombre accesible de la lista origen si no hay sourceHeader',
    },
    {
      name: 'targetAriaLabel',
      type: 'string | null',
      default: null,
      description: 'Nombre accesible de la lista destino si no hay targetHeader',
    },
    {
      name: 'moveToTargetLabel',
      type: 'string',
      default: "''",
      description: 'aria-label del botón mover seleccionados a destino (i18n)',
    },
    {
      name: 'moveAllToTargetLabel',
      type: 'string',
      default: "''",
      description: 'aria-label del botón mover todos a destino (i18n)',
    },
    {
      name: 'moveToSourceLabel',
      type: 'string',
      default: "''",
      description: 'aria-label del botón quitar seleccionados del destino (i18n)',
    },
    {
      name: 'moveAllToSourceLabel',
      type: 'string',
      default: "''",
      description: 'aria-label del botón quitar todos del destino (i18n)',
    },
    {
      name: 'showMoveAll',
      type: 'boolean',
      default: true,
      description: 'Muestra los botones de mover / quitar todos',
    },
    {
      name: 'id',
      type: 'string | undefined',
      default: 'auto (wi-picklist-N)',
      description: 'id base; las listas usan {id}-source y {id}-target',
    },
    {
      name: 'name',
      type: 'string',
      default: "''",
      description: 'name de campo (lista destino)',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      description: 'Deshabilita listas y botones de transferencia',
    },
    {
      name: 'invalid',
      type: 'boolean',
      default: false,
      description: 'Estado inválido (grupo + lista destino)',
    },
    {
      name: 'required',
      type: 'boolean',
      default: false,
      description: 'Marca el campo como requerido (aria-required)',
    },
    {
      name: 'ariaLabel',
      type: 'string | null',
      default: null,
      description: 'Nombre accesible del grupo cuando no hay label visible asociado',
    },
    {
      name: 'ariaDescribedBy',
      type: 'string | null',
      default: null,
      description: 'IDs de hint/error asociados (aria-describedby)',
    },
    {
      name: 'itemTemplate',
      type: 'TemplateRef<WiPicklistItemContext> | undefined',
      default: undefined,
      description:
        'Template de ítem por input; alternativa a ng-template wiPicklistItem. Puede renderizar un componente de la app (tarjeta, acordeón, etc.)',
    },
  ],
  outputs: [
    {
      name: 'valueChange',
      type: 'unknown[]',
      description: 'Se emite al cambiar los asignados (model value)',
    },
    {
      name: 'touch',
      type: 'void',
      description: 'Emite al interactuar con las listas o al transferir (Signal Forms: touched)',
    },
  ],
  variants: [],
  keyboard: [
    'Tab',
    'ArrowUp/ArrowDown (dentro de cada lista)',
    'Space/Enter (seleccionar ítem)',
    'Enter/Space (botones de transferencia)',
  ],
  a11yNotes:
    'Grupo con dos listbox (origen y destino) y botones icon-only. Cada botón exige aria-label (moveToTargetLabel, etc.). Los headers visibles etiquetan las listas vía aria-labelledby. En contenedor estrecho (~320px, container query) el layout se apila y las flechas rotan. Textos i18n los provee la app. Sin filtro, drag-and-drop ni reorder en este MVP.',
  example: {
    import: `import { WiPicklistComponent, WiPicklistItemDirective } from '@wiloc/ui/forms';`,
    template: `<!-- i18n + tarjeta de ítem: el componente lo define la app -->
<wi-picklist
  [(value)]="assignedIds"
  [options]="members"
  optionLabel="name"
  optionValue="id"
  sourceHeader="Disponibles"
  targetHeader="Asignados"
  sourceEmptyText="Sin disponibles"
  targetEmptyText="Sin asignados"
  moveToTargetLabel="Mover a asignados"
  moveAllToTargetLabel="Mover todos"
  moveToSourceLabel="Quitar de asignados"
  moveAllToSourceLabel="Quitar todos"
  ariaLabel="Miembros del grupo"
>
  <ng-template wiPicklistItem let-option>
    <app-member-card [member]="option" />
  </ng-template>
</wi-picklist>`,
  },
} as const;
