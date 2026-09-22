/**
 * Registry seed for @wldeveloperapps/ui-mcp (paquete previsto en packages/wiloc-ui-mcp).
 * Documenta solo API pública — no Spartan ni rutas internas.
 */
export const wiInputRegistryEntry = {
  name: 'input',
  selector: 'wi-input',
  entryPoint: '@wldeveloperapps/ui/forms',
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
      description:
        'autocomplete nativo. El desplegable del navegador se ancla al viewport (se despega en overflow interno). En shells con scroll interno usar "off".',
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
      name: 'passwordToggle',
      type: 'boolean',
      default: true,
      description: 'Botón de revelar/ocultar cuando type="password"',
    },
    {
      name: 'showPasswordLabel',
      type: 'string',
      default: "'Show password'",
      description: 'aria-label del botón cuando la contraseña está oculta (i18n de la app)',
    },
    {
      name: 'hidePasswordLabel',
      type: 'string',
      default: "'Hide password'",
      description: 'aria-label del botón cuando la contraseña está visible (i18n de la app)',
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
  keyboard: ['Tab', 'character input', 'Enter/Space on password toggle'],
  a11yNotes:
    'Input nativo. Asociar label vía id, o ariaLabel. Errores/hints vía ariaDescribedBy (texto de la app). invalid expone aria-invalid. Con type=password el botón de revelar usa showPasswordLabel/hidePasswordLabel, aria-pressed y aria-controls. placeholder/ariaLabel/labels del toggle son i18n de la app; @wldeveloperapps/ui no incluye diccionarios.',
  example: {
    import: `import { WiInputComponent } from '@wldeveloperapps/ui/forms';`,
    template: `<!-- i18n: strings desde la app -->
<label for="email">Correo</label>
<wi-input id="email" type="email" placeholder="correo@ejemplo.com" />
<label for="password">Contraseña</label>
<wi-input
  id="password"
  type="password"
  showPasswordLabel="Mostrar contraseña"
  hidePasswordLabel="Ocultar contraseña"
/>`,
  },
} as const;
