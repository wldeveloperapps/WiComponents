/**
 * Registry seed for @wiloc/ui-mcp (paquete previsto en packages/wiloc-ui-mcp).
 * Documenta solo API pública — no Spartan ni rutas internas.
 */
export const wiTabsRegistryEntry = {
  name: 'tabs',
  selector: 'wi-tabs',
  entryPoint: '@wiloc/ui/navigation',
  status: 'experimental' as const,
  exports: [
    'WiTabsComponent',
    'WiTabsListComponent',
    'WiTabsTriggerDirective',
    'WiTabsContentDirective',
    'WiTabsContentLazyDirective',
    'WiTabsOrientation',
    'WiTabsActivationMode',
    'WiTabsListVariant',
    'WiTabsSize',
  ],
  inputs: [
    {
      name: 'value',
      type: 'string | undefined',
      default: undefined,
      description: 'Clave de la pestaña activa (two-way con valueChange)',
    },
    {
      name: 'orientation',
      type: "WiTabsOrientation ('horizontal' | 'vertical')",
      default: 'horizontal',
      description: 'Orientación del tablist',
    },
    {
      name: 'activationMode',
      type: "WiTabsActivationMode ('automatic' | 'manual')",
      default: 'automatic',
      description: 'automatic: activa al enfocar; manual: solo con click / Enter / Space',
    },
    {
      name: 'variant',
      type: "WiTabsListVariant ('segmented' | 'line')",
      default: 'segmented',
      description: 'En wi-tabs-list: segmented = select-button; line = subrayado',
    },
    {
      name: 'size',
      type: "WiTabsSize ('sm' | 'md')",
      default: 'md',
      description: 'En wi-tabs-list: altura de los triggers',
    },
    {
      name: 'wiTabsTrigger',
      type: 'string',
      default: undefined,
      description: 'En button[wiTabsTrigger]: clave de la pestaña',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      description: 'En button[wiTabsTrigger]: deshabilita el trigger',
    },
    {
      name: 'wiTabsContent',
      type: 'string',
      default: undefined,
      description: 'En [wiTabsContent]: clave del panel (opcional si solo se filtra)',
    },
  ],
  outputs: [
    {
      name: 'valueChange',
      type: 'string | undefined',
      description: 'Cambio de pestaña activa (pair con value)',
    },
    {
      name: 'tabActivated',
      type: 'string',
      description: 'Se emite con la clave al activar una pestaña',
    },
  ],
  variants: [
    { name: 'list.variant', values: ['segmented', 'line'] },
    { name: 'list.size', values: ['sm', 'md'] },
  ],
  parts: [
    {
      selector: 'wi-tabs / [wiTabs]',
      description: 'Contenedor; value / orientation / activationMode',
    },
    {
      selector: 'wi-tabs-list',
      description: 'Tablist; variant segmented|line, size sm|md; scroll en .wi-tabs__viewport',
    },
    {
      selector: 'button[wiTabsTrigger]',
      description: 'Trigger (role=tab); texto o aria-label obligatorio',
    },
    { selector: '[wiTabsContent]', description: 'Panel (role=tabpanel); opcional' },
    {
      selector: 'ng-template[wiTabsContentLazy]',
      description: 'Contenido lazy dentro de un panel',
    },
  ],
  keyboard: [
    'Arrow Left / Right (horizontal) o Up / Down (vertical) mueven el foco entre triggers',
    'Home / End van al primer / último trigger',
    'Enter / Space activan (siempre; en automatic el foco también activa)',
    'Tab sale del tablist hacia el panel o el siguiente control',
  ],
  a11yNotes:
    'role=tablist / tab / tabpanel. Copy de títulos/paneles: solo la app (proyección). `wi-tabs` / lista a ancho del padre; scroll/scrollbar de tokens en `.wi-tabs__viewport`.',
  example: {
    import: `import {
  WiTabsContentDirective,
  WiTabsComponent,
  WiTabsListComponent,
  WiTabsTriggerDirective,
} from '@wiloc/ui/navigation';`,
    template: `<wi-tabs [(value)]="activeId">
  <wi-tabs-list>
    @for (tab of tabs; track tab.id) {
      <button type="button" [wiTabsTrigger]="tab.id">{{ tab.label }}</button>
    }
  </wi-tabs-list>
  @for (tab of tabs; track tab.id) {
    <div [wiTabsContent]="tab.id">{{ tab.body }}</div>
  }
</wi-tabs>`,
  },
};
