/**
 * Registry seed for @wiloc/ui-mcp.
 * Documenta solo API pública — no @angular/aria ni rutas internas.
 */
export const wiListboxRegistryEntry = {
  name: 'listbox',
  selector: 'wi-listbox',
  entryPoint: '@wiloc/ui/forms',
  status: 'experimental' as const,
  exports: [
    'WiListboxComponent',
    'WiListboxItemDirective',
    'WiListboxSize',
    'WiListboxCompareWith',
    'WiListboxItemContext',
  ],
  inputs: [
    {
      name: 'value',
      type: 'unknown (model)',
      default: 'null (single) / [] (multiple)',
      description:
        'Valor del control. Single: T | null. Multiple: T[]. Compatible con Signal Forms ([formField]) y two-way binding',
    },
    {
      name: 'multiple',
      type: 'boolean',
      default: false,
      description: 'Activa selección múltiple. Tratar como estático (cambia la forma del valor)',
    },
    {
      name: 'options',
      type: 'readonly unknown[]',
      default: '[]',
      description: 'Lista de opciones (primitivos u objetos)',
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
      type: 'WiListboxCompareWith',
      default: 'Object.is',
      description: 'Compara valores de opción con el valor seleccionado',
    },
    {
      name: 'size',
      type: 'WiListboxSize',
      default: 'md',
      description: 'Tamaño: sm | md | lg',
    },
    {
      name: 'emptyText',
      type: 'string',
      default: "''",
      description: 'Texto cuando options está vacío (inyectable / i18n app)',
    },
    {
      name: 'id',
      type: 'string | undefined',
      default: 'auto (wi-listbox-N)',
      description: 'id del listbox para asociar labels',
    },
    {
      name: 'name',
      type: 'string',
      default: "''",
      description: 'name de campo',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      description: 'Deshabilita el listbox',
    },
    {
      name: 'invalid',
      type: 'boolean',
      default: false,
      description: 'Estado inválido (borde/focus error)',
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
      description: 'Nombre accesible cuando no hay label visible asociado',
    },
    {
      name: 'ariaLabelledBy',
      type: 'string | null',
      default: null,
      description: 'ID del elemento que etiqueta el listbox',
    },
    {
      name: 'ariaDescribedBy',
      type: 'string | null',
      default: null,
      description: 'IDs de hint/error asociados (aria-describedby)',
    },
    {
      name: 'itemTemplate',
      type: 'TemplateRef<WiListboxItemContext> | undefined',
      default: undefined,
      description: 'Template de ítem por input; alternativa a ng-template wiListboxItem',
    },
  ],
  outputs: [
    {
      name: 'touch',
      type: 'void',
      description: 'Emite en blur o al cambiar el valor (Signal Forms: touched)',
    },
  ],
  variants: [],
  keyboard: ['Tab', 'ArrowUp/ArrowDown', 'Home/End', 'Space/Enter (seleccionar)', 'typeahead'],
  a11yNotes:
    'role=listbox + option. Asociar label vía id, ariaLabel o ariaLabelledBy. Lista siempre visible con scroll interno (max-h). Textos i18n (emptyText, ariaLabel) los provee la app; @wiloc/ui no incluye diccionarios. Sin filtro ni virtual scroll en este MVP.',
  example: {
    import: `import { WiListboxComponent } from '@wiloc/ui/forms';`,
    template: `<!-- i18n: strings desde la app -->
<wi-listbox
  multiple
  [(value)]="roles"
  [options]="options"
  optionLabel="name"
  optionValue="id"
  emptyText="Sin opciones"
  ariaLabel="Roles"
/>`,
  },
} as const;
