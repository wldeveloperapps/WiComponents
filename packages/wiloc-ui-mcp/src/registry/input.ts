/**
 * Registry seed for @wiloc/ui-mcp (paquete previsto en packages/wiloc-ui-mcp).
 * Documenta solo API pública — no Spartan ni rutas internas.
 */
export const wiInputRegistryEntry = {
  name: 'input',
  selector: 'wi-input',
  entryPoint: '@wiloc/ui/forms',
  status: 'experimental' as const,
  exports: ['WiInputComponent', 'WiInputSize', 'WiInputType'],
  inputs: [
    {
      name: 'value',
      type: 'string (model)',
      default: "''",
      description: 'Valor del control; compatible con Signal Forms ([formField]) y two-way binding',
    },
    {
      name: 'size',
      type: 'WiInputSize',
      default: 'md',
      description: 'Tamaño: sm | md | lg',
    },
    {
      name: 'type',
      type: 'WiInputType',
      default: 'text',
      description: 'type nativo: text | email | password | search | tel | url | number',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: "''",
      description: 'Placeholder visible',
    },
    {
      name: 'id',
      type: 'string | undefined',
      default: 'auto (wi-input-N)',
      description: 'id del input nativo para asociar labels',
    },
    {
      name: 'name',
      type: 'string',
      default: "''",
      description: 'name nativo / nombre de campo Signal Forms',
    },
    {
      name: 'autocomplete',
      type: 'string | null',
      default: null,
      description: 'autocomplete nativo',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      description: 'Deshabilita el input',
    },
    {
      name: 'readonly',
      type: 'boolean',
      default: false,
      description: 'Solo lectura',
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
      description: 'Marca el campo como requerido (attr + aria-required)',
    },
    {
      name: 'ariaLabel',
      type: 'string | null',
      default: null,
      description: 'Nombre accesible cuando no hay label visible asociado',
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
      description: 'Emite en blur (Signal Forms: touched / debounce blur)',
    },
  ],
  variants: [],
  keyboard: ['Tab', 'character input'],
  a11yNotes:
    'Input nativo. Asociar label vía id, o ariaLabel. Errores/hints vía ariaDescribedBy (texto de la app). invalid expone aria-invalid. placeholder/ariaLabel son i18n de la app; @wiloc/ui no incluye diccionarios.',
  example: {
    import: `import { WiInputComponent } from '@wiloc/ui/forms';`,
    template: `<!-- i18n: strings desde la app -->
<label for="email">Correo</label>
<wi-input id="email" type="email" placeholder="correo@ejemplo.com" />`,
  },
} as const;
