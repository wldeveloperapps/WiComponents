import { Component, computed, Directive, input, ViewEncapsulation } from '@angular/core';
import {
  BrnTabs,
  BrnTabsContent,
  BrnTabsContentLazy,
  BrnTabsList,
  BrnTabsTrigger,
} from '@spartan-ng/brain/tabs';

import type { WiTabsListVariant, WiTabsSize } from './wi-tabs.types';

const TABS_HOST_CLASSES =
  'wi-tabs group/tabs flex w-full max-w-full min-w-0 gap-2 data-[orientation=horizontal]:flex-col data-[orientation=vertical]:items-stretch';

/**
 * Shell de la lista: siempre `width: 100%` del padre (ver `styles/tabs.css`).
 * Fondo / padding van en `.wi-tabs__viewport` para mantener track compacto + scroll interno.
 */
const LIST_HOST_CLASSES =
  'wi-tabs__list group/tabs-list max-w-full min-w-0 text-on-surface-variant group-data-[orientation=vertical]/tabs:w-fit group-data-[orientation=vertical]/tabs:self-stretch';

const VIEWPORT_VARIANT_CLASSES: Record<WiTabsListVariant, string> = {
  segmented: 'rounded-control bg-surface-variant p-2',
  line: 'rounded-none bg-transparent p-0',
};

const TRIGGER_HOST_CLASSES =
  'wi-tabs__trigger relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-control px-2 font-medium transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start group-data-[size=sm]/tabs-list:h-6 group-data-[size=sm]/tabs-list:text-xs group-data-[size=md]/tabs-list:h-7 group-data-[size=md]/tabs-list:text-xs group-data-[size=md]/tabs-list:sm:h-8 group-data-[size=md]/tabs-list:sm:text-sm group-data-[size=md]/tabs-list:sm:px-3 text-on-surface-variant hover:text-on-surface data-[state=active]:bg-primary data-[state=active]:text-on-primary group-data-[variant=line]/tabs-list:rounded-none group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:text-on-surface group-data-[variant=line]/tabs-list:after:absolute group-data-[variant=line]/tabs-list:after:bg-primary group-data-[variant=line]/tabs-list:after:opacity-0 group-data-[variant=line]/tabs-list:after:transition-opacity group-data-[variant=line]/tabs-list:group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[variant=line]/tabs-list:group-data-[orientation=horizontal]/tabs:after:bottom-0 group-data-[variant=line]/tabs-list:group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[variant=line]/tabs-list:group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[variant=line]/tabs-list:group-data-[orientation=vertical]/tabs:after:start-0 group-data-[variant=line]/tabs-list:group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100';

const CONTENT_HOST_CLASSES =
  'wi-tabs__content min-h-0 min-w-0 flex-1 basis-0 self-stretch overflow-auto text-sm text-on-surface outline-none';

/**
 * Contenedor de pestañas (`wi-tabs` / `[wiTabs]`).
 *
 * Responsive propio (`wi-tabs.css`): `max-width: 100%`, scroll + scrollbar en `.wi-tabs__viewport`,
 * tipografía densa bajo `40rem` de viewport.
 */
@Component({
  selector: 'wi-tabs, [wiTabs]',
  exportAs: 'wiTabs',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './wi-tabs.css',
  hostDirectives: [
    {
      directive: BrnTabs,
      inputs: ['orientation', 'activationMode', 'brnTabs: value'],
      outputs: ['tabActivated', 'brnTabsChange: valueChange'],
    },
  ],
  host: {
    class: TABS_HOST_CLASSES,
    'data-slot': 'tabs',
  },
  template: `<ng-content />`,
})
export class WiTabsComponent {}

/**
 * Lista de triggers (`wi-tabs-list`).
 * Scroll horizontal siempre en `.wi-tabs__viewport` (estilos en `wi-tabs.css`).
 */
@Component({
  selector: 'wi-tabs-list',
  exportAs: 'wiTabsList',
  hostDirectives: [BrnTabsList],
  host: {
    'data-slot': 'tabs-list',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[class]': 'hostClasses()',
  },
  template: `
    <div [class]="viewportClasses()">
      <ng-content />
    </div>
  `,
})
export class WiTabsListComponent {
  readonly variant = input<WiTabsListVariant>('segmented');
  readonly size = input<WiTabsSize>('md');

  protected readonly hostClasses = computed(() => LIST_HOST_CLASSES);

  protected readonly viewportClasses = computed(
    () =>
      `wi-tabs__viewport group-data-[orientation=vertical]/tabs:flex-col ${VIEWPORT_VARIANT_CLASSES[this.variant()]}`,
  );
}
/**
 * Trigger de pestaña. Debe ser un `button` nativo con nombre accesible (texto o `aria-label`).
 */
@Directive({
  selector: 'button[wiTabsTrigger]',
  exportAs: 'wiTabsTrigger',
  hostDirectives: [
    {
      directive: BrnTabsTrigger,
      inputs: ['brnTabsTrigger: wiTabsTrigger', 'disabled'],
    },
  ],
  host: {
    class: TRIGGER_HOST_CLASSES,
    'data-slot': 'tabs-trigger',
  },
})
export class WiTabsTriggerDirective {}

/**
 * Panel asociado a un trigger (`[wiTabsContent]="key"`). Opcional si solo se usa la lista como filtro.
 */
@Directive({
  selector: '[wiTabsContent]',
  exportAs: 'wiTabsContent',
  hostDirectives: [
    {
      directive: BrnTabsContent,
      inputs: ['brnTabsContent: wiTabsContent'],
    },
  ],
  host: {
    class: CONTENT_HOST_CLASSES,
    'data-slot': 'tabs-content',
  },
})
export class WiTabsContentDirective {}

/**
 * Contenido lazy: se instancia la primera vez que la pestaña se activa.
 */
@Directive({
  selector: 'ng-template[wiTabsContentLazy]',
  hostDirectives: [BrnTabsContentLazy],
})
export class WiTabsContentLazyDirective {}
