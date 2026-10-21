/**
 * Registry seed for @wldeveloperapps/ui-mcp.
 * Documenta solo API pública — no Spartan ni rutas internas.
 */
export const wiColorPickerRegistryEntry = {
  name: 'color-picker',
  selector: 'wi-color-picker',
  entryPoint: '@wldeveloperapps/ui/forms',
  status: 'stable' as const,
  exports: [
    'WiColorPickerComponent',
    'WiColorPickerSize',
    'WiColorPickerLabels',
    'normalizeWiColor',
    'isWiColor',
  ],
  inputs: [
    {
      name: 'value',
      type: 'string | null (model)',
      default: 'null',
      description:
        'Hex opaco normalizado #rrggbb, o null. #rgb y el hex sin almohadilla se normalizan. No es un id de acento ni un token. Compatible con Signal Forms ([formField]) y two-way binding',
    },
    {
      name: 'size',
      type: 'WiColorPickerSize',
      default: 'md',
      description: 'Tamaño del trigger: sm | md | lg',
    },
    {
      name: 'id',
      type: 'string | undefined',
      default: 'auto (wi-color-picker-N)',
      description:
        'id del trigger. El título del panel queda en `{id}-title` y el hex en `{id}-hex`',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: "''",
      description: 'Texto del trigger cuando no hay color. Lo pone la app',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      description: 'Deshabilita el trigger y el panel',
    },
    {
      name: 'invalid',
      type: 'boolean',
      default: false,
      description: 'Estado inválido (borde error)',
    },
    {
      name: 'required',
      type: 'boolean',
      default: false,
      description: 'Marca el trigger como requerido',
    },
    {
      name: 'ariaLabel',
      type: 'string | null',
      default: null,
      description:
        'Nombre accesible del trigger cuando no hay un texto visible asociado. Si falta, se usa labels.dialog',
    },
    {
      name: 'ariaLabelledBy',
      type: 'string | null',
      default: null,
      description: 'ID del elemento que etiqueta el trigger. Si está, no se usa ariaLabel',
    },
    {
      name: 'ariaDescribedBy',
      type: 'string | null',
      default: null,
      description: 'IDs de hint/error asociados (aria-describedby)',
    },
    {
      name: 'labels',
      type: 'WiColorPickerLabels',
      default: '{}',
      description:
        'Nombres del diálogo, el plano, el tono, el campo hex, el vacío y el cuentagotas. Los pone la app (i18n). Si falta uno, queda el nombre técnico en inglés',
    },
  ],
  outputs: [
    {
      name: 'touch',
      type: 'void',
      description: 'Emite cuando se cierra el panel (Signal Forms: touched)',
    },
  ],
  keyboard: [
    'Tab',
    'Shift+Tab',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Home',
    'End',
    'PageUp',
    'PageDown',
    'Escape',
  ],
  a11yNotes:
    'El trigger es un botón con aria-haspopup=dialog y aria-expanded. El panel es un diálogo con nombre (labels.dialog). El plano es un slider: izquierda/derecha cambian la saturación, arriba/abajo el brillo, Shift salta de 10 en 10, Home/End y PageUp/PageDown van a los extremos. El tono es un range nativo. El hex tiene etiqueta visible. El cuentagotas, si el navegador lo tiene, es un botón con labels.eyedropper; Escape cancela la muestra y no cambia el valor. El trigger necesita ariaLabel o ariaLabelledBy. El color elegido no cambia en oscuro.',
  limits: [
    'Guarda un hex opaco (#rrggbb). No acepta alfa, nombres CSS (red) ni un id de WiAccent.',
    'No sigue .wi-dark y no lee tokens. El color es un dato; el chrome sí usa tokens.',
    'No sustituye a wi-accent-picker. La identidad de entidad (icono que cambia en claro y oscuro) sigue siendo el id de acento y [wiAccent].',
    'No pinta otro elemento. La app aplica el hex donde corresponda.',
    'No trae una paleta de muestras ni textos de producto. Los nombres salen de labels y el placeholder, del input.',
    'No es <input type="color">.',
    'El cuentagotas es la API EyeDropper. Solo Chromium (Chrome, Edge y derivados), en https o localhost, y solo tras un click. Firefox y Safari no la tienen: el botón no se pinta. No funciona en el servidor. Cancelar (Escape) o un fallo del navegador no cambian el valor.',
  ],
  requires: [
    'Tokens de @wldeveloperapps/ui/styles/tokens.css para el chrome (superficie, borde, anillo). El hex elegido no sale de esos tokens.',
    'Ningún provider propio ni CSS extra.',
  ],
  example: {
    import: `import { WiColorPickerComponent, type WiColorPickerLabels } from '@wldeveloperapps/ui/forms';`,
    template: `<!-- color: string | null. La app guarda el #rrggbb. labels viene del i18n. -->
<span id="mark-color-label">Color</span>
<wi-color-picker
  [(value)]="color"
  ariaLabelledBy="mark-color-label"
  placeholder="Elige un color"
  [labels]="colorLabels"
/>`,
  },
} as const;
