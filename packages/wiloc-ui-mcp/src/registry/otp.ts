/**
 * Registry seed for @wiloc/ui-mcp.
 * Documenta solo API pública — no Spartan ni rutas internas.
 */
export const wiOtpRegistryEntry = {
  name: 'otp',
  selector: 'wi-otp',
  entryPoint: '@wiloc/ui/forms',
  status: 'experimental' as const,
  exports: ['WiOtpComponent', 'WiOtpSize', 'WiOtpInputMode', 'WiOtpAutocomplete'],
  inputs: [
    {
      name: 'value',
      type: 'string (model)',
      default: "''",
      description: 'Valor del control; compatible con Signal Forms ([formField]) y two-way binding',
    },
    {
      name: 'length',
      type: 'number',
      default: '6',
      description: 'Número de casillas (login típico: 6)',
    },
    {
      name: 'size',
      type: 'WiOtpSize',
      default: 'md',
      description: 'Tamaño de casilla: sm | md | lg',
    },
    {
      name: 'inputMode',
      type: 'WiOtpInputMode',
      default: 'numeric',
      description:
        'Teclado virtual: numeric | text | tel. En numeric/tel se recortan caracteres no dígito',
    },
    {
      name: 'autocomplete',
      type: 'WiOtpAutocomplete',
      default: 'one-time-code',
      description: 'autocomplete nativo: one-time-code | off',
    },
    {
      name: 'id',
      type: 'string | undefined',
      default: 'auto (wi-otp-N)',
      description: 'id del input nativo para asociar labels',
    },
    {
      name: 'name',
      type: 'string',
      default: "''",
      description: 'name nativo / nombre de campo Signal Forms',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      description: 'Deshabilita el control',
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
      description: 'Estado inválido (aria-invalid + borde error en casillas)',
    },
    {
      name: 'required',
      type: 'boolean',
      default: false,
      description: 'Marca el campo como requerido (attr + aria-required)',
    },
    {
      name: 'autofocus',
      type: 'boolean',
      default: false,
      description: 'Enfoca el input al inicializar (navegador; no en SSR)',
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
      description: 'id del label visible asociado',
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
      name: 'valueChange',
      type: 'string',
      description: 'Se emite al cambiar el valor (model value)',
    },
    {
      name: 'completed',
      type: 'string',
      description: 'Se emite cuando el valor alcanza length (teclado o pegado)',
    },
    {
      name: 'touch',
      type: 'void',
      description: 'Emite en blur (Signal Forms: touched / debounce blur)',
    },
  ],
  variants: [],
  keyboard: ['Tab', 'character input', 'Backspace', 'paste'],
  a11yNotes:
    'Un único input nativo (autocomplete one-time-code) con casillas visuales. Asociar label vía id o ariaLabel. Errores/hints vía ariaDescribedBy (texto de la app). En numeric/tel se aceptan solo dígitos; el pegado recorta espacios y guiones. invalid expone aria-invalid. En contenedor estrecho las casillas hacen wrap.',
  example: {
    import: `import { WiOtpComponent } from '@wiloc/ui/forms';`,
    template: `<!-- i18n: strings desde la app -->
<label for="login-otp">Código de verificación</label>
<wi-otp id="login-otp" [(value)]="code" (completed)="submit($event)" />`,
  },
} as const;
