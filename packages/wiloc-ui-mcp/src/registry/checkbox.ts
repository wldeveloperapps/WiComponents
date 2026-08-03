/**
 * Registry seed for @wiloc/ui-mcp.
 * Documenta solo API pública — no Spartan ni rutas internas.
 */
export const wiCheckboxRegistryEntry = {
  name: 'checkbox',
  selector: 'wi-checkbox',
  entryPoint: '@wiloc/ui/forms',
  status: 'experimental' as const,
  exports: ['WiCheckboxComponent', 'WiCheckboxSize'],
  inputs: [
    {
      name: 'value',
      type: 'boolean (model)',
      default: 'false',
      description: 'Valor del control; compatible con Signal Forms ([formField]) y two-way binding',
    },
    {
      name: 'indeterminate',
      type: 'boolean (model)',
      default: 'false',
      description:
        'Estado indeterminado (p. ej. seleccionar todo con selección parcial). Al interactuar pasa a checked',
    },
    {
      name: 'size',
      type: 'WiCheckboxSize',
      default: 'md',
      description: 'Tamaño: sm | md | lg',
    },
    {
      name: 'id',
      type: 'string | undefined',
      default: 'auto (wi-checkbox-N)',
      description: 'id del control para asociar labels',
    },
    {
      name: 'name',
      type: 'string',
      default: "''",
      description: 'name nativo / nombre de campo',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      description: 'Deshabilita el checkbox',
    },
    {
      name: 'invalid',
      type: 'boolean',
      default: false,
      description: 'Estado inválido (borde/fondo error)',
    },
    {
      name: 'required',
      type: 'boolean',
      default: false,
      description: 'Marca el campo como requerido',
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
      description: 'ID del elemento que etiqueta el checkbox',
    },
    {
      name: 'ariaDescribedBy',
      type: 'string | null',
      default: null,
      description: 'IDs de hint/error asociados (aria-describedby)',
    },
  ],
  outputs: [
    {
      name: 'touch',
      type: 'void',
      description: 'Emite en blur / interacción (Signal Forms: touched)',
    },
  ],
  variants: [],
  keyboard: ['Tab', 'Space', 'Enter'],
  a11yNotes:
    'Rol checkbox con aria-checked true|false|mixed. Asociar label vía wrapping <label>, for/id, o ariaLabel. Errores/hints vía ariaDescribedBy (texto de la app). invalid aplica estado visual de error. Copy i18n desde la app.',
  example: {
    import: `import { WiCheckboxComponent } from '@wiloc/ui/forms';`,
    template: `<!-- i18n: strings desde la app -->
<label class="flex items-center gap-2">
  <wi-checkbox [(value)]="accepted" />
  <span>Acepto los términos</span>
</label>`,
  },
} as const;
