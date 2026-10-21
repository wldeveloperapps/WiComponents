/**
 * Registry seed for @wldeveloperapps/ui-mcp.
 * Documenta solo API pública — no Spartan ni rutas internas.
 */
export const wiAccentPickerRegistryEntry = {
  name: 'accent-picker',
  selector: 'wi-accent-picker',
  entryPoint: '@wldeveloperapps/ui/forms',
  status: 'stable' as const,
  exports: [
    'WiAccentPickerComponent',
    'WiAccentDirective',
    'WiAccent',
    'WiAccentPickerSize',
    'WiAccentTone',
    'WiAccentLabels',
    'WI_ACCENTS',
    'isWiAccent',
  ],
  inputs: [
    {
      name: 'value',
      type: 'WiAccent | null (model)',
      default: 'null',
      description:
        'Id de la paleta (blue, teal, green, amber, orange, red, purple, pink, slate). No es un color. Compatible con Signal Forms ([formField]) y two-way binding',
    },
    {
      name: 'accents',
      type: 'readonly WiAccent[]',
      default: 'WI_ACCENTS',
      description: 'Subconjunto de la paleta, en el orden visible. Ids desconocidos se ignoran',
    },
    {
      name: 'accentLabels',
      type: 'WiAccentLabels',
      default: '{}',
      description:
        'Nombre accesible de cada muestra. Lo pone la app (i18n). Si falta un id, se usa el propio id',
    },
    {
      name: 'size',
      type: 'WiAccentPickerSize',
      default: 'md',
      description: 'Tamaño de la muestra: sm | md | lg',
    },
    {
      name: 'id',
      type: 'string | undefined',
      default: 'auto (wi-accent-picker-N)',
      description: 'id del grupo. Cada radio queda en `{id}-{accent}`',
    },
    {
      name: 'name',
      type: 'string',
      default: "'' (genera uno único)",
      description: 'name nativo del grupo de radios. Si se informa, tiene que ser único por picker',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      description: 'Deshabilita todas las muestras',
    },
    {
      name: 'invalid',
      type: 'boolean',
      default: false,
      description: 'Estado inválido (anillo error)',
    },
    {
      name: 'required',
      type: 'boolean',
      default: false,
      description: 'Marca el grupo como requerido',
    },
    {
      name: 'ariaLabel',
      type: 'string | null',
      default: null,
      description: 'Nombre accesible del grupo cuando no hay un texto visible asociado',
    },
    {
      name: 'ariaLabelledBy',
      type: 'string | null',
      default: null,
      description: 'ID del elemento que etiqueta el grupo. Si está, no se usa ariaLabel',
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
      description: 'Emite cuando el foco sale del grupo (Signal Forms: touched)',
    },
  ],
  parts: [
    {
      selector: '[wiAccent]',
      description:
        'Directiva que pinta el acento en el host. Input wiAccent: WiAccent | null. Input wiAccentTone: icon (defecto, solo color) | container (fondo tintado) | solid (fondo del acento). null no pinta',
    },
  ],
  variants: ['icon', 'container', 'solid'],
  keyboard: ['Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'],
  a11yNotes:
    'role=radiogroup. Cada muestra es un radio con nombre accesible (accentLabels o el id). El grupo necesita ariaLabel o ariaLabelledBy. El anillo de foco y de selección usa el token ring, o error si invalid. El color de la muestra es el token del acento, distinto en claro y en oscuro. No es un color picker libre.',
  limits: [
    'No acepta un color libre (hex, rgb, input type=color). El valor es un id de WiAccent.',
    'No recibe pares light/dark. El tema lo resuelven --wi-color-accent-* en :root y .wi-dark.',
    'No usa error, warning ni success. Esos tokens son estado, no identidad de entidad.',
    'No trae textos de producto. El nombre de cada muestra sale de accentLabels (la app) o del id.',
    'No elige ni pinta el icono. La app guarda el id y lo aplica con [wiAccent] en wi-icon o en su pastilla. Tamaño y radio de la pastilla los pone la app.',
    'accents solo puede recortar la paleta, no añadir colores.',
  ],
  requires: [
    'Tokens de @wldeveloperapps/ui/styles/tokens.css (incluyen --wi-color-accent-*). No hace falta un CSS extra ni mapearlos en @theme.',
    'Ningún provider propio. Para el icono teñido: wi-icon y provideWiIcons en la app.',
  ],
  example: {
    import: `import { WiAccentDirective, WiAccentPickerComponent, type WiAccent } from '@wldeveloperapps/ui/forms';
import { WiIconComponent } from '@wldeveloperapps/ui/icon';`,
    template: `<!-- accent: WiAccent | null lo guarda la app. accentLabels viene del i18n. -->
<span id="entity-color-label">Color</span>
<wi-accent-picker
  [(value)]="accent"
  ariaLabelledBy="entity-color-label"
  [accentLabels]="accentLabels"
/>
<span
  class="inline-flex size-10 items-center justify-center rounded-full"
  [wiAccent]="accent"
  wiAccentTone="container"
>
  <wi-icon name="cube" />
</span>`,
  },
} as const;
