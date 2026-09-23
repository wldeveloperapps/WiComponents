import { Directionality } from '@angular/cdk/bidi';
import { Component, computed, input, output, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { applicationConfig, moduleMetadata } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { WiButtonDirective } from '../../../button/src/public-api';
import { archiveBoxOutline } from '../../../icon/heroicons/src/archive-box';
import { checkCircleOutline } from '../../../icon/heroicons/src/check-circle';
import { cog6ToothOutline } from '../../../icon/heroicons/src/cog-6-tooth';
import { cubeOutline } from '../../../icon/heroicons/src/cube';
import { documentOutline } from '../../../icon/heroicons/src/document';
import { flagOutline } from '../../../icon/heroicons/src/flag';
import { folderOutline } from '../../../icon/heroicons/src/folder';
import { homeOutline } from '../../../icon/heroicons/src/home';
import { identificationOutline } from '../../../icon/heroicons/src/identification';
import { pencilOutline } from '../../../icon/heroicons/src/pencil';
import { squares2x2Outline } from '../../../icon/heroicons/src/squares-2x2';
import { trashOutline } from '../../../icon/heroicons/src/trash';
import { userOutline } from '../../../icon/heroicons/src/user';
import { usersOutline } from '../../../icon/heroicons/src/users';
import { provideWiIcons, WiIconComponent } from '../../../icon/src/public-api';
import type { WiMenuAlign, WiMenuItemVariant, WiMenuSide } from './wi-menu.types';
import {
  WiMenuComponent,
  WiMenuGroupComponent,
  WiMenuItemDirective,
  WiMenuLabelComponent,
  WiMenuRadioDirective,
  WiMenuSeparatorComponent,
  WiMenuTriggerDirective,
  WiTooltipDirective,
} from '../public-api';

interface ScopeFilterOption {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly colour: string | null;
}

interface CategoryFilterOption {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
}

interface WiMenuStoryArgs {
  align: WiMenuAlign;
  side: WiMenuSide;
  sideOffset: number;
  label: string;
  showSeparator: boolean;
  dangerVariant: WiMenuItemVariant;
  itemDisabled: boolean;
  opened: ReturnType<typeof fn>;
  closed: ReturnType<typeof fn>;
  triggered: ReturnType<typeof fn>;
  changed: ReturnType<typeof fn>;
}

const SCOPE_FILTER_OPTIONS: readonly ScopeFilterOption[] = [
  { id: 'all', label: 'Todos', icon: 'squares-2x2', colour: null },
  { id: 'group-a', label: 'Grupo A', icon: 'user', colour: '#3b82f6' },
  { id: 'group-b', label: 'Grupo B', icon: 'users', colour: '#14b8a6' },
  { id: 'group-c', label: 'Grupo C', icon: 'identification', colour: '#ef4444' },
  { id: 'group-d', label: 'Grupo D', icon: 'cube', colour: '#22c55e' },
  { id: 'group-e', label: 'Grupo E', icon: 'archive-box', colour: '#a3a30f' },
];

const CATEGORY_FILTER_OPTIONS: readonly CategoryFilterOption[] = [
  { id: 'cat-1', label: 'Categoría uno', icon: 'folder' },
  { id: 'cat-2', label: 'Categoría dos', icon: 'home' },
  { id: 'cat-3', label: 'Categoría tres', icon: 'document' },
  { id: 'cat-4', label: 'Categoría cuatro', icon: 'flag' },
  { id: 'cat-5', label: 'Categoría cinco', icon: 'pencil' },
  { id: 'cat-6', label: 'Categoría seis', icon: 'check-circle' },
  { id: 'cat-7', label: 'Categoría siete', icon: 'cog-6-tooth' },
];

const storyHelperArgType = { table: { disable: true }, control: false } as const;

@Component({
  selector: 'wi-menu-filter-menu-demo',
  imports: [
    WiMenuTriggerDirective,
    WiMenuComponent,
    WiMenuLabelComponent,
    WiMenuGroupComponent,
    WiMenuRadioDirective,
    WiTooltipDirective,
    WiIconComponent,
  ],
  template: `
    <div class="flex flex-wrap items-center gap-2">
      <button
        type="button"
        class="inline-flex h-control-sm w-8 items-center justify-center rounded-xl border border-outline-variant bg-transparent text-on-surface outline-none transition-colors hover:bg-surface-variant focus-visible:ring-2 focus-visible:ring-ring"
        [wiMenuTrigger]="scopeMenu"
        [align]="align()"
        [side]="side()"
        (opened)="opened.emit()"
        (closed)="closed.emit()"
        [wiTooltip]="selected().label"
        position="bottom"
        [showDelay]="300"
        [attr.aria-label]="'Ámbito: ' + selected().label"
      >
        <span
          class="inline-flex size-6 items-center justify-center rounded-xl text-white [&_svg]:block"
          [class.bg-surface-variant]="!selected().colour"
          [class.text-on-surface]="!selected().colour"
          [style.background-color]="selected().colour"
        >
          <wi-icon [name]="selected().icon" size="sm" />
        </span>
      </button>

      <ng-template #scopeMenu>
        <wi-menu [sideOffset]="sideOffset()">
          <wi-menu-label>Ámbito</wi-menu-label>
          <wi-menu-group>
            @for (item of options; track item.id) {
              <button
                type="button"
                wiMenuRadio
                [checked]="selectedId() === item.id"
                (triggered)="select(item)"
              >
                <span
                  class="inline-flex size-6 shrink-0 items-center justify-center rounded-full text-white [&_svg]:block"
                  [class.bg-surface-variant]="!item.colour"
                  [class.text-on-surface]="!item.colour"
                  [style.background-color]="item.colour"
                >
                  <wi-icon [name]="item.icon" size="xs" />
                </span>
                <span class="min-w-0 whitespace-normal md:whitespace-nowrap">{{ item.label }}</span>
              </button>
            }
          </wi-menu-group>
        </wi-menu>
      </ng-template>
    </div>
  `,
})
class FilterMenuDemoComponent {
  readonly align = input<WiMenuAlign>('start');
  readonly side = input<WiMenuSide>('bottom');
  readonly sideOffset = input(1);

  readonly opened = output<void>();
  readonly closed = output<void>();
  readonly changed = output<string>();

  protected readonly options = SCOPE_FILTER_OPTIONS;
  protected readonly selectedId = signal('all');
  protected readonly selected = computed(
    () => SCOPE_FILTER_OPTIONS.find((item) => item.id === this.selectedId()) ?? SCOPE_FILTER_OPTIONS[0],
  );

  protected select(item: ScopeFilterOption): void {
    this.selectedId.set(item.id);
    this.changed.emit(item.id);
  }
}

@Component({
  selector: 'wi-menu-radio-filter-demo',
  imports: [
    WiMenuTriggerDirective,
    WiMenuComponent,
    WiMenuLabelComponent,
    WiMenuGroupComponent,
    WiMenuRadioDirective,
    WiTooltipDirective,
    WiIconComponent,
  ],
  template: `
    <div class="flex flex-wrap items-center gap-2">
      <button
        type="button"
        class="inline-flex h-control-sm w-8 items-center justify-center rounded-xl border border-outline-variant bg-transparent text-primary outline-none transition-colors hover:bg-surface-variant focus-visible:ring-2 focus-visible:ring-ring"
        [wiMenuTrigger]="categoryMenu"
        [align]="align()"
        [side]="side()"
        (opened)="opened.emit()"
        (closed)="closed.emit()"
        [wiTooltip]="selected().label"
        position="bottom"
        [showDelay]="300"
        [attr.aria-label]="'Filtro: ' + selected().label"
      >
        <wi-icon [name]="selected().icon" size="md" />
      </button>

      <ng-template #categoryMenu>
        <wi-menu [sideOffset]="sideOffset()">
          <wi-menu-label>Categoría</wi-menu-label>
          <wi-menu-group>
            @for (item of options; track item.id) {
              <button
                type="button"
                wiMenuRadio
                [checked]="selectedId() === item.id"
                (triggered)="select(item)"
              >
                <wi-icon [name]="item.icon" size="sm" class="text-primary" />
                <span class="min-w-0 whitespace-normal md:whitespace-nowrap">{{ item.label }}</span>
              </button>
            }
          </wi-menu-group>
        </wi-menu>
      </ng-template>
    </div>
  `,
})
class RadioFilterDemoComponent {
  readonly align = input<WiMenuAlign>('start');
  readonly side = input<WiMenuSide>('bottom');
  readonly sideOffset = input(1);

  readonly opened = output<void>();
  readonly closed = output<void>();
  readonly changed = output<string>();

  protected readonly options = CATEGORY_FILTER_OPTIONS;
  protected readonly selectedId = signal('cat-1');
  protected readonly selected = computed(
    () =>
      CATEGORY_FILTER_OPTIONS.find((item) => item.id === this.selectedId()) ??
      CATEGORY_FILTER_OPTIONS[0],
  );

  protected select(item: CategoryFilterOption): void {
    this.selectedId.set(item.id);
    this.changed.emit(item.id);
  }
}

const menuImports = [
  WiMenuTriggerDirective,
  WiMenuComponent,
  WiMenuGroupComponent,
  WiMenuLabelComponent,
  WiMenuItemDirective,
  WiMenuRadioDirective,
  WiMenuSeparatorComponent,
  WiTooltipDirective,
  WiButtonDirective,
  WiIconComponent,
  FilterMenuDemoComponent,
  RadioFilterDemoComponent,
];

const meta: Meta<WiMenuStoryArgs> = {
  title: 'Overlays/WiMenu',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: {
      include: ['align', 'side', 'sideOffset', 'opened', 'closed', 'triggered'],
    },
    docs: {
      description: {
        component: `
Menú popup por composición (\`[wiMenuTrigger]\` + \`wi-menu\` + ítems).

- Apertura: \`'button' [wiMenuTrigger]="menuTemplate"\`.
- Panel: \`ng-template\` → \`<wi-menu>\` (portal CDK a body).
- Ítems: \`wiMenuItem\` (acción) o \`wiMenuRadio\` (selección única; el trigger puede reflejar la opción).
- Posición: \`align\` (\`start|center|end\`) y \`side\` (\`top|bottom|left|right\`) en el trigger; \`sideOffset\` en \`wi-menu\`.
- Responsive: el panel limita ancho en viewport estrecho (\`max-w-[min(100vw-2rem,20rem)]\`). Comprobar ~320px.

Events del trigger: \`opened\`, \`closed\`. Los ítems emiten \`triggered\` (acción) vía directiva; no hay output \`changed\` en la librería.
        `,
      },
    },
  },
  decorators: [
    applicationConfig({
      providers: [
        Directionality,
        provideWiIcons({
          'squares-2x2': { outline: squares2x2Outline },
          user: { outline: userOutline },
          users: { outline: usersOutline },
          identification: { outline: identificationOutline },
          cube: { outline: cubeOutline },
          'archive-box': { outline: archiveBoxOutline },
          trash: { outline: trashOutline },
          folder: { outline: folderOutline },
          home: { outline: homeOutline },
          document: { outline: documentOutline },
          flag: { outline: flagOutline },
          pencil: { outline: pencilOutline },
          'check-circle': { outline: checkCircleOutline },
          'cog-6-tooth': { outline: cog6ToothOutline },
        }),
      ],
    }),
    moduleMetadata({
      imports: menuImports,
    }),
  ],
  argTypes: {
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: 'Alineación del panel respecto al trigger',
      table: { category: 'Trigger' },
    },
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Lado preferido del panel',
      table: { category: 'Trigger' },
    },
    sideOffset: {
      control: { type: 'number', min: 0, max: 12, step: 1 },
      description: 'Separación del panel respecto al trigger',
      table: { category: 'Menu' },
    },
    label: {
      ...storyHelperArgType,
      description: 'Solo demo Default: texto de wi-menu-label',
    },
    showSeparator: {
      ...storyHelperArgType,
      description: 'Solo demo Default: separador antes del ítem danger',
    },
    dangerVariant: {
      ...storyHelperArgType,
      description: 'Solo demo Default: variante del ítem Eliminar',
    },
    itemDisabled: {
      ...storyHelperArgType,
      description: 'Solo demo Default / DisabledItem',
    },
    opened: {
      action: 'opened',
      description: 'Se emite al abrir el menú (trigger)',
      table: { category: 'Events' },
      control: false,
    },
    closed: {
      action: 'closed',
      description: 'Se emite al cerrar el menú (trigger)',
      table: { category: 'Events' },
      control: false,
    },
    triggered: {
      action: 'triggered',
      description: 'Se emite al activar un wiMenuItem',
      table: { category: 'Events' },
      control: false,
    },
    changed: {
      action: 'changed',
      description: 'Solo demos FilterMenu / RadioFilter: id seleccionado (no es API de wi-menu)',
      ...storyHelperArgType,
    },
  },
  args: {
    align: 'start',
    side: 'bottom',
    sideOffset: 1,
    label: 'Acciones',
    showSeparator: true,
    dangerVariant: 'danger',
    itemDisabled: false,
    opened: fn(),
    closed: fn(),
    triggered: fn(),
    changed: fn(),
  },
};

export default meta;
type Story = StoryObj<WiMenuStoryArgs>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <button wiButton
        type="button"
        variant="outline"
        size="sm"
        [wiMenuTrigger]="menu"
        [align]="align"
        [side]="side"
        (opened)="opened()"
        (closed)="closed()"
      >
        Abrir menú
      </button>
      <ng-template #menu>
        <wi-menu [sideOffset]="sideOffset">
          <wi-menu-label>{{ label }}</wi-menu-label>
          <button type="button" wiMenuItem (triggered)="triggered('edit')">Editar</button>
          <button type="button" wiMenuItem [disabled]="itemDisabled" (triggered)="triggered('duplicate')">
            Duplicar
          </button>
          @if (showSeparator) {
            <wi-menu-separator />
          }
          <button type="button" wiMenuItem [variant]="dangerVariant" (triggered)="triggered('delete')">
            <wi-icon name="trash" size="sm" />
            Eliminar
          </button>
        </wi-menu>
      </ng-template>
    `,
  }),
};

export const FilterMenu: Story = {
  name: 'FilterMenu',
  parameters: {
    docs: {
      description: {
        story: `
Filtro con \`wiMenuRadio\`: el trigger refleja icono/color de la opción activa.
En viewport estrecho (~320px) las etiquetas pueden hacer wrap (\`whitespace-normal\`).

Events del **trigger**: \`opened\`, \`closed\`. \`changed\` es output del componente de demo al seleccionar (no de \`wi-menu\`).
        `,
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <wi-menu-filter-menu-demo
        [align]="align"
        [side]="side"
        [sideOffset]="sideOffset"
        (opened)="opened()"
        (closed)="closed()"
        (changed)="changed($event)"
      />
    `,
  }),
};

export const RadioFilter: Story = {
  name: 'RadioFilter',
  parameters: {
    docs: {
      description: {
        story: `
Menú de categorías: iconos planos en \`text-primary\` (sin chip de color).
El trigger muestra solo el icono de la opción activa.

Events del **trigger**: \`opened\`, \`closed\`. \`changed\` es del demo (id seleccionado), no API del menú.
        `,
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <wi-menu-radio-filter-demo
        [align]="align"
        [side]="side"
        [sideOffset]="sideOffset"
        (opened)="opened()"
        (closed)="closed()"
        (changed)="changed($event)"
      />
    `,
  }),
};

export const DisabledItem: Story = {
  args: {
    itemDisabled: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <button
        type="button"
        class="rounded-control border border-outline-variant px-3 py-1.5 text-sm"
        [wiMenuTrigger]="menu"
        [align]="align"
        [side]="side"
        (opened)="opened()"
        (closed)="closed()"
      >
        Abrir
      </button>
      <ng-template #menu>
        <wi-menu [sideOffset]="sideOffset">
          <button type="button" wiMenuItem (triggered)="triggered('available')">Disponible</button>
          <button
            type="button"
            wiMenuItem
            [disabled]="itemDisabled"
            (triggered)="triggered('unavailable')"
          >
            No disponible
          </button>
        </wi-menu>
      </ng-template>
    `,
  }),
};

export const DarkMode: Story = {
  globals: {
    theme: 'dark',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="wi-dark rounded-control bg-background p-6 text-on-background">
        <button wiButton
          type="button"
          variant="outline"
          size="sm"
          [wiMenuTrigger]="menu"
          [align]="align"
          [side]="side"
          (opened)="opened()"
          (closed)="closed()"
        >
          Abrir menú
        </button>
        <ng-template #menu>
          <wi-menu [sideOffset]="sideOffset">
            <wi-menu-label>{{ label }}</wi-menu-label>
            <button type="button" wiMenuItem (triggered)="triggered('edit')">Editar</button>
            <button type="button" wiMenuItem (triggered)="triggered('duplicate')">Duplicar</button>
            <wi-menu-separator />
            <button type="button" wiMenuItem variant="danger" (triggered)="triggered('delete')">
              <wi-icon name="trash" size="sm" />
              Eliminar
            </button>
          </wi-menu>
        </ng-template>
      </div>
    `,
  }),
};
