/**
 * Registry seed for @wiloc/ui-mcp.
 * Documenta solo API pública — no Spartan ni rutas internas.
 */
export const wiSwitchRegistryEntry = {
  name: 'switch',
  selector: 'wi-switch',
  entryPoint: '@wiloc/ui/forms',
  status: 'experimental' as const,
  exports: ['WiSwitchComponent', 'WiSwitchSize'],
  inputs: [
    {
      name: 'value',
      type: 'boolean (model)',
      default: 'false',
      description: 'Valor del control; compatible con Signal Forms ([formField]) y two-way binding',
    },
    {
      name: 'size',
      type: 'WiSwitchSize',
      default: 'md',
      description: 'Tamaño: sm | md | lg',
    },
    {
      name: 'id',
      type: 'string | undefined',
      default: 'auto (wi-switch-N)',
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
      description: 'Deshabilita el interruptor',
    },
    {
      name: 'invalid',
      type: 'boolean',
      default: false,
      description: 'Estado inválido (colores error)',
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
      description: 'ID del elemento que etiqueta el interruptor',
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
    'Rol switch con aria-checked true|false. Asociar label vía wrapping <label>, for/id, o ariaLabel. Errores/hints vía ariaDescribedBy (texto de la app). invalid aplica estado visual de error. Copy i18n desde la app.',
  example: {
    import: `import { WiSwitchComponent } from '@wiloc/ui/forms';`,
    template: `<!-- i18n: strings desde la app -->
<label class="flex items-center justify-between gap-3">
  <span>Notificaciones</span>
  <wi-switch [(value)]="notificationsEnabled" />
</label>`,
  },
} as const;
