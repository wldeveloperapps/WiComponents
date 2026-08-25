import { Directionality } from '@angular/cdk/bidi';
import { Component, computed, input, output, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { applicationConfig, moduleMetadata } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { WiButtonComponent } from '../../../button/src/public-api';
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

interface AssetTypeOption {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly colour: string | null;
}

interface AssetAttributeOption {
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

const ASSET_TYPES: readonly AssetTypeOption[] = [
  { id: 'all', label: 'All', icon: 'squares-2x2', colour: null },
  { id: 'adhoc', label: 'Adhoc', icon: 'user', colour: '#3b82f6' },
  { id: 'jv', label: 'JV', icon: 'users', colour: '#14b8a6' },
  { id: 'subcontractor', label: 'Subcontractor', icon: 'identification', colour: '#ef4444' },
  { id: 'vehicle', label: 'Vehicle', icon: 'cube', colour: '#22c55e' },
  { id: 'supplier', label: 'Supplier', icon: 'archive-box', colour: '#a3a30f' },
];

const ASSET_ATTRIBUTES: readonly AssetAttributeOption[] = [
  { id: 'disciplines', label: 'Disciplines', icon: 'folder' },
  { id: 'company', label: 'Company', icon: 'home' },
  { id: 'sub-designation', label: 'Sub designation', icon: 'document' },
  { id: 'nationality', label: 'Nationality', icon: 'flag' },
  { id: 'designation', label: 'Designation', icon: 'pencil' },
  { id: 'status', label: 'Status', icon: 'check-circle' },
  { id: 'worker-type', label: 'Worker Type', icon: 'cog-6-tooth' },
];

@Component({
  selector: 'wi-menu-asset-types-demo',
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
        class="inline-flex h-control-sm w-8 items-center justify-center rounded-xl border border-outline bg-transparent text-on-surface outline-none transition-colors hover:bg-surface-variant focus-visible:ring-2 focus-visible:ring-ring"
        [wiMenuTrigger]="assetTypesMenu"
        [align]="align()"
        [side]="side()"
        (opened)="opened.emit()"
        (closed)="closed.emit()"
        [wiTooltip]="selected().label"
        position="bottom"
        [showDelay]="300"
        [attr.aria-label]="'Asset Types: ' + selected().label"
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

      <ng-template #assetTypesMenu>
        <wi-menu [sideOffset]="sideOffset()">
          <wi-menu-label>Asset Types</wi-menu-label>
          <wi-menu-group>
            @for (item of assetTypes; track item.id) {
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
class AssetTypesDemoComponent {
  readonly align = input<WiMenuAlign>('start');
  readonly side = input<WiMenuSide>('bottom');
  readonly sideOffset = input(1);

  readonly opened = output<void>();
  readonly closed = output<void>();
  readonly changed = output<string>();

  protected readonly assetTypes = ASSET_TYPES;
  protected readonly selectedId = signal('all');
  protected readonly selected = computed(
    () => ASSET_TYPES.find((item) => item.id === this.selectedId()) ?? ASSET_TYPES[0],
  );

  protected select(item: AssetTypeOption): void {
    this.selectedId.set(item.id);
    this.changed.emit(item.id);
  }
}

@Component({
  selector: 'wi-menu-asset-attributes-demo',
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
        class="inline-flex h-control-sm w-8 items-center justify-center rounded-xl border border-outline bg-transparent text-primary outline-none transition-colors hover:bg-surface-variant focus-visible:ring-2 focus-visible:ring-ring"
        [wiMenuTrigger]="attributesMenu"
        [align]="align()"
        [side]="side()"
        (opened)="opened.emit()"
        (closed)="closed.emit()"
        [wiTooltip]="selected().label"
        position="bottom"
        [showDelay]="300"
        [attr.aria-label]="'Asset Attributes: ' + selected().label"
      >
        <wi-icon [name]="selected().icon" size="md" />
      </button>

      <ng-template #attributesMenu>
        <wi-menu [sideOffset]="sideOffset()">
          <wi-menu-label>Asset Attributes</wi-menu-label>
          <wi-menu-group>
            @for (item of attributes; track item.id) {
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
class AssetAttributesDemoComponent {
  readonly align = input<WiMenuAlign>('start');
  readonly side = input<WiMenuSide>('bottom');
  readonly sideOffset = input(1);

  readonly opened = output<void>();
  readonly closed = output<void>();
  readonly changed = output<string>();

  protected readonly attributes = ASSET_ATTRIBUTES;
  protected readonly selectedId = signal('disciplines');
  protected readonly selected = computed(
    () => ASSET_ATTRIBUTES.find((item) => item.id === this.selectedId()) ?? ASSET_ATTRIBUTES[0],
  );

  protected select(item: AssetAttributeOption): void {
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
  WiButtonComponent,
  WiIconComponent,
  AssetTypesDemoComponent,
  AssetAttributesDemoComponent,
];

const meta: Meta<WiMenuStoryArgs> = {
  title: 'Overlays/WiMenu',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Menú popup por composición (\`[wiMenuTrigger]\` + \`wi-menu\` + ítems).

- Apertura: \`'button' [wiMenuTrigger]="menuTemplate"\`.
- Panel: \`ng-template\` → \`<wi-menu>\` (portal CDK a body).
- Ítems: \`wiMenuItem\` (acción) o \`wiMenuRadio\` (selección única; el trigger puede reflejar la opción).
- Posición: \`align\` (\`start|center|end\`) y \`side\` (\`top|bottom|left|right\`).
- Responsive: el panel limita ancho en viewport estrecho (\`max-w-[min(100vw-2rem,20rem)]\`). Comprobar ~320px.
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
      control: 'text',
      description: 'Texto de la cabecera (wi-menu-label)',
      table: { category: 'Content' },
    },
    showSeparator: {
      control: 'boolean',
      description: 'Muestra el separador antes de la acción danger',
      table: { category: 'Content' },
    },
    dangerVariant: {
      name: 'variant (danger item)',
      control: 'select',
      options: ['default', 'danger'],
      description: 'Variante del ítem Eliminar',
      table: { category: 'Item' },
    },
    itemDisabled: {
      control: 'boolean',
      description: 'Deshabilita el ítem Duplicar',
      table: { category: 'Item' },
    },
    opened: {
      action: 'opened',
      description: 'Se emite al abrir el menú',
      table: { category: 'Events' },
      control: false,
    },
    closed: {
      action: 'closed',
      description: 'Se emite al cerrar el menú',
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
      description: 'Se emite al cambiar la selección (wiMenuRadio / filtros)',
      table: { category: 'Events' },
      control: false,
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
  argTypes: {
    changed: { table: { disable: true } },
  },
  render: (args) => ({
    props: args,
    template: `
      <wi-button
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
      </wi-button>
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

export const AssetTypes: Story = {
  name: 'Asset Types (filter)',
  argTypes: {
    label: { table: { disable: true } },
    showSeparator: { table: { disable: true } },
    dangerVariant: { table: { disable: true } },
    itemDisabled: { table: { disable: true } },
    triggered: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        story: `
Filtro tipo dashboard: el trigger muestra el icono/color de la opción seleccionada.
En viewport estrecho (~320px) las etiquetas pueden hacer wrap (\`whitespace-normal\`).
Events: \`opened\`, \`closed\`, \`changed\` (id seleccionado).
        `,
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <wi-menu-asset-types-demo
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

export const AssetAttributes: Story = {
  name: 'Asset Attributes (flat icons)',
  argTypes: {
    label: { table: { disable: true } },
    showSeparator: { table: { disable: true } },
    dangerVariant: { table: { disable: true } },
    itemDisabled: { table: { disable: true } },
    triggered: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        story: `
Menú de atributos: iconos planos en \`text-primary\` (sin chip de color).
El trigger muestra solo el icono de la opción activa, centrado en el botón.
Events: \`opened\`, \`closed\`, \`changed\` (id seleccionado).
        `,
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <wi-menu-asset-attributes-demo
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

export const WithWiButton: Story = {
  argTypes: {
    label: { table: { disable: true } },
    showSeparator: { table: { disable: true } },
    dangerVariant: { table: { disable: true } },
    itemDisabled: { table: { disable: true } },
    changed: { table: { disable: true } },
  },
  render: (args) => ({
    props: args,
    template: `
      <wi-button
        type="button"
        variant="outline"
        size="sm"
        [wiMenuTrigger]="menu"
        [align]="align"
        [side]="side"
        (opened)="opened()"
        (closed)="closed()"
      >
        Más opciones
      </wi-button>
      <ng-template #menu>
        <wi-menu [sideOffset]="sideOffset">
          <button type="button" wiMenuItem (triggered)="triggered('profile')">Perfil</button>
          <button type="button" wiMenuItem (triggered)="triggered('settings')">Ajustes</button>
        </wi-menu>
      </ng-template>
    `,
  }),
};

export const DisabledItem: Story = {
  args: {
    itemDisabled: true,
  },
  argTypes: {
    label: { table: { disable: true } },
    showSeparator: { table: { disable: true } },
    dangerVariant: { table: { disable: true } },
    changed: { table: { disable: true } },
  },
  render: (args) => ({
    props: args,
    template: `
      <button
        type="button"
        class="rounded-control border border-outline px-3 py-1.5 text-sm"
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
