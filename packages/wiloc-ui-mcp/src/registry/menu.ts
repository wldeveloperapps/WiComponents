/**
 * Registry seed for @wiloc/ui-mcp (paquete previsto en packages/wiloc-ui-mcp).
 * Documenta solo API pública — no Spartan ni rutas internas.
 */
export const wiMenuRegistryEntry = {
  name: 'menu',
  selector: 'wi-menu',
  entryPoint: '@wiloc/ui/overlays',
  status: 'experimental' as const,
  exports: [
    'WiMenuComponent',
    'WiMenuTriggerDirective',
    'WiMenuGroupComponent',
    'WiMenuLabelComponent',
    'WiMenuItemDirective',
    'WiMenuRadioDirective',
    'WiMenuSeparatorComponent',
    'WiMenuAlign',
    'WiMenuSide',
    'WiMenuItemVariant',
  ],
  inputs: [
    {
      name: 'wiMenuTrigger',
      type: 'TemplateRef',
      default: undefined,
      description: 'En el trigger: plantilla del panel (ng-template con wi-menu)',
    },
    {
      name: 'align',
      type: "WiMenuAlign ('start' | 'center' | 'end')",
      default: 'start',
      description: 'Alineación del panel respecto al trigger',
    },
    {
      name: 'side',
      type: "WiMenuSide ('top' | 'bottom' | 'left' | 'right')",
      default: 'bottom',
      description: 'Lado preferido del panel (puede hacer flip si no cabe)',
    },
    {
      name: 'sideOffset',
      type: 'number',
      default: 1,
      description: 'En wi-menu: separación en unidades de spacing respecto al trigger',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      description: 'En wiMenuItem / wiMenuRadio: deshabilita el ítem',
    },
    {
      name: 'variant',
      type: "WiMenuItemVariant ('default' | 'danger')",
      default: 'default',
      description: 'En wiMenuItem: variante visual',
    },
    {
      name: 'checked',
      type: 'boolean',
      default: false,
      description: 'En wiMenuRadio: si la opción está seleccionada',
    },
    {
      name: 'keepOpen',
      type: 'boolean',
      default: false,
      description: 'En wiMenuRadio: no cerrar el menú al seleccionar',
    },
  ],
  outputs: [
    {
      name: 'opened',
      type: 'void',
      description: 'En el trigger: se emite al abrir el menú',
    },
    {
      name: 'closed',
      type: 'void',
      description: 'En el trigger: se emite al cerrar el menú',
    },
    {
      name: 'triggered',
      type: 'void',
      description: 'En wiMenuItem / wiMenuRadio: se emite al activar el ítem',
    },
  ],
  variants: [{ name: 'item.variant', values: ['default', 'danger'] }],
  parts: [
    {
      selector: '[wiMenuTrigger]',
      description: 'Abre el menú; preferible en button nativo o wi-button con nombre accesible',
    },
    { selector: 'wi-menu', description: 'Panel popup (tokens + teclado CDK)' },
    { selector: 'wi-menu-label', description: 'Cabecera / etiqueta de sección' },
    { selector: 'wi-menu-group', description: 'Grupo de ítems (p. ej. radios)' },
    { selector: '[wiMenuItem]', description: 'Ítem de acción' },
    { selector: '[wiMenuRadio]', description: 'Ítem de selección única' },
    { selector: 'wi-menu-separator', description: 'Separador visual' },
  ],
  keyboard: [
    'Enter / Space en el trigger abre el menú',
    'Arrow Up / Arrow Down navegan ítems',
    'Home / End van al primer / último ítem',
    'Enter / Space activan el ítem enfocado',
    'Escape cierra y restaura el foco al trigger',
  ],
  a11yNotes:
    'role=menu en el panel; menuitem / menuitemradio en ítems. El trigger debe tener nombre accesible (texto o aria-label), sobre todo si es icon-only. Overlays portaled heredan .wi-dark del documento.',
  example: {
    import: `import {
  WiMenuComponent,
  WiMenuItemDirective,
  WiMenuLabelComponent,
  WiMenuRadioDirective,
  WiMenuTriggerDirective,
} from '@wiloc/ui/overlays';`,
    template: `<button type="button" [wiMenuTrigger]="menu" aria-label="Asset Types">
  Filtrar
</button>
<ng-template #menu>
  <wi-menu>
    <wi-menu-label>Asset Types</wi-menu-label>
    <button type="button" wiMenuRadio [checked]="selected() === 'all'" (triggered)="selected.set('all')">
      All
    </button>
    <button type="button" wiMenuRadio [checked]="selected() === 'adhoc'" (triggered)="selected.set('adhoc')">
      Adhoc
    </button>
  </wi-menu>
</ng-template>`,
  },
} as const;
