/**
 * Registry seed for @wiloc/ui-mcp (paquete previsto en packages/wiloc-ui-mcp).
 * Documenta solo API pública — no Spartan ni rutas internas.
 */
export const wiSelectRegistryEntry = {
  name: 'select',
  selector: 'wi-select',
  entryPoint: '@wiloc/ui/forms',
  status: 'experimental' as const,
  exports: [
    'WiSelectComponent',
    'WiSelectItemDirective',
    'WiSelectSelectedDirective',
    'WiSelectSize',
    'WiSelectCompareWith',
    'WiSelectItemContext',
    'WiSelectSelectedContext',
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
      type: 'WiSelectCompareWith',
      default: 'Object.is',
      description: 'Compara valores de opción con el valor seleccionado',
    },
    {
      name: 'size',
      type: 'WiSelectSize',
      default: 'md',
      description: 'Tamaño: sm | md | lg',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: "''",
      description: 'Texto cuando no hay selección',
    },
    {
      name: 'emptyText',
      type: 'string',
      default: "''",
      description: 'Texto cuando options está vacío (inyectable / i18n app)',
    },
    {
      name: 'clearable',
      type: 'boolean',
      default: false,
      description: 'Muestra botón para limpiar la selección',
    },
    {
      name: 'clearLabel',
      type: 'string',
      default: 'Clear',
      description: 'aria-label del botón clear (inyectable / i18n app)',
    },
    {
      name: 'id',
      type: 'string | undefined',
      default: 'auto (wi-select-N)',
      description: 'id del trigger para asociar labels',
    },
    {
      name: 'name',
      type: 'string',
      default: "''",
      description: 'name del control / Signal Forms',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      description: 'Deshabilita el select',
    },
    {
      name: 'invalid',
      type: 'boolean',
      default: false,
      description: 'Estado inválido (aria-invalid + borde error)',
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
      description: 'Nombre accesible del trigger',
    },
    {
      name: 'ariaDescribedBy',
      type: 'string | null',
      default: null,
      description: 'IDs de hint/error asociados (aria-describedby)',
    },
    {
      name: 'itemTemplate',
      type: 'TemplateRef | undefined',
      default: undefined,
      description: 'Template de ítem; alternativa a ng-template wiSelectItem',
    },
    {
      name: 'selectedTemplate',
      type: 'TemplateRef | undefined',
      default: undefined,
      description: 'Template del valor seleccionado; alternativa a ng-template wiSelectSelected',
    },
  ],
  outputs: [
    {
      name: 'touch',
      type: 'void',
      description: 'Emite al cerrar el panel o al limpiar (Signal Forms: touched)',
    },
  ],
  variants: [],
  keyboard: [
    'Tab',
    'Enter',
    'Space/ArrowDown/ArrowUp (abrir)',
    'ArrowUp/ArrowDown (navegar)',
    'Home/End',
    'Escape (cerrar)',
    'typeahead',
  ],
  a11yNotes:
    'Trigger role=combobox + listbox. Asociar label vía id o ariaLabel. Errores/hints vía ariaDescribedBy. invalid expone aria-invalid. clearLabel obligatorio si clearable. Requiere CSS de overlays CDK/Spartan en la app.',
  example: {
    import: `import { WiSelectComponent } from '@wiloc/ui/forms';`,
    template: `<wi-select
  [(value)]="siteId"
  [options]="sites"
  optionLabel="name"
  optionValue="id"
  placeholder="Selecciona…"
  ariaLabel="Sitio"
  clearable
  clearLabel="Limpiar"
/>`,
  },
} as const;
