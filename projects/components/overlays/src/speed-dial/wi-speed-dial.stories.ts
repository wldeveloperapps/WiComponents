import { Component, input, output, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { applicationConfig, moduleMetadata } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import {
  getSpeedDialDemoCopy,
  type SpeedDialDemoCopy,
  type StorybookLocale,
} from '../../../.storybook/locale';
import {
  WiCardComponent,
  WiCardContentComponent,
  WiCardFooterComponent,
  WiCardHeaderComponent,
  WiCardTitleComponent,
} from '@wiloc/ui/data-display';
import { provideWiIcons } from '@wiloc/ui/icon';
import {
  arrowPathOutline,
  calendarOutline,
  ellipsisVerticalOutline,
  squares2x2Outline,
  trashOutline,
  xMarkOutline,
} from '@wiloc/ui/icon/heroicons';

import { WiSpeedDialComponent } from './wi-speed-dial.component';
import type { WiSpeedDialDirection, WiSpeedDialItem } from './wi-speed-dial.types';

interface WiSpeedDialStoryArgs {
  direction: WiSpeedDialDirection;
  disabled: boolean;
  closeOnSelect: boolean;
  tooltips: boolean;
  triggerIcon: string;
  itemClick: ReturnType<typeof fn>;
}

function localeFromGlobals(globals: { locale?: string } | undefined): StorybookLocale {
  return globals?.locale === 'en' ? 'en' : 'es';
}

function speedDialCopy(globals: { locale?: string } | undefined): SpeedDialDemoCopy {
  return getSpeedDialDemoCopy(localeFromGlobals(globals));
}

/** Demo interactivo: clic abre; labels vía toolbar Locale. */
@Component({
  selector: 'wi-speed-dial-demo',
  imports: [WiSpeedDialComponent],
  template: `
    <div class="flex flex-col items-center gap-3">
      <p class="text-sm text-on-surface-variant">{{ hint() }}</p>
      <wi-speed-dial
        [items]="items()"
        [direction]="direction()"
        [disabled]="disabled()"
        [closeOnSelect]="closeOnSelect()"
        [tooltips]="tooltips()"
        [ariaLabel]="ariaLabel()"
        [triggerIcon]="triggerIcon()"
        (itemClick)="onItem($event)"
      />
      @if (lastAction(); as action) {
        <p class="text-xs text-on-surface">{{ lastActionPrefix() }}: {{ action.id }}</p>
      }
    </div>
  `,
})
class WiSpeedDialDemoComponent {
  readonly items = input.required<readonly WiSpeedDialItem[]>();
  readonly hint = input.required<string>();
  readonly lastActionPrefix = input.required<string>();
  readonly direction = input<WiSpeedDialDirection>('left');
  readonly disabled = input(false);
  readonly closeOnSelect = input(true);
  readonly tooltips = input(true);
  readonly ariaLabel = input.required<string>();
  readonly triggerIcon = input('ellipsis-vertical');
  readonly itemClick = output<WiSpeedDialItem>();

  protected readonly lastAction = signal<WiSpeedDialItem | null>(null);

  protected onItem(item: WiSpeedDialItem): void {
    this.lastAction.set(item);
    this.itemClick.emit(item);
  }
}

/** Dos cards con sets distintos; copy según Locale. */
@Component({
  selector: 'wi-speed-dial-cards-demo',
  imports: [
    WiSpeedDialComponent,
    WiCardComponent,
    WiCardHeaderComponent,
    WiCardTitleComponent,
    WiCardContentComponent,
    WiCardFooterComponent,
  ],
  template: `
    <div class="flex w-full max-w-lg flex-col gap-4">
      <p class="text-sm text-on-surface-variant">{{ hint() }}</p>

      <wi-card>
        <wi-card-header>
          <wi-card-title>{{ cardATitle() }}</wi-card-title>
        </wi-card-header>
        <wi-card-content>
          <p class="text-sm text-on-surface-variant">{{ cardABody() }}</p>
        </wi-card-content>
        <wi-card-footer class="flex items-center justify-between gap-3">
          <span class="text-xs text-on-surface-variant">{{ updatedLabel() }}</span>
          <wi-speed-dial
            [items]="actionsA()"
            [open]="openA()"
            (openChange)="openA.set($event)"
            direction="left"
            [ariaLabel]="ariaLabelA()"
            (itemClick)="itemClick.emit($event)"
          />
        </wi-card-footer>
      </wi-card>

      <wi-card>
        <wi-card-header>
          <wi-card-title>{{ cardBTitle() }}</wi-card-title>
        </wi-card-header>
        <wi-card-content>
          <p class="text-sm text-on-surface-variant">{{ cardBBody() }}</p>
        </wi-card-content>
        <wi-card-footer class="flex items-center justify-between gap-3">
          <span class="text-xs text-on-surface-variant">{{ updatedLabel() }}</span>
          <wi-speed-dial
            [items]="actionsB()"
            [open]="openB()"
            (openChange)="openB.set($event)"
            direction="left"
            [ariaLabel]="ariaLabelB()"
            (itemClick)="itemClick.emit($event)"
          />
        </wi-card-footer>
      </wi-card>
    </div>
  `,
})
class WiSpeedDialCardsDemoComponent {
  readonly hint = input.required<string>();
  readonly cardATitle = input.required<string>();
  readonly cardABody = input.required<string>();
  readonly cardBTitle = input.required<string>();
  readonly cardBBody = input.required<string>();
  readonly updatedLabel = input.required<string>();
  readonly ariaLabelA = input.required<string>();
  readonly ariaLabelB = input.required<string>();
  readonly actionsA = input.required<readonly WiSpeedDialItem[]>();
  readonly actionsB = input.required<readonly WiSpeedDialItem[]>();
  readonly openA = signal(true);
  readonly openB = signal(false);
  readonly itemClick = output<WiSpeedDialItem>();
}

const meta: Meta<WiSpeedDialStoryArgs> = {
  title: 'Overlays/WiSpeedDial',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### Cómo funciona

1. **Cerrado:** solo se ve el icono de tres puntos.
2. **Clic en el icono:** aparecen las acciones de \`items\`.
3. **Clic en una acción:** se emite \`itemClick\` con \`{ id, icon, label }\`.

Labels de demo vía toolbar **Locale** (ES/EN). En la app el copy lo aporta i18n; \`@wiloc/ui\` no trae diccionarios.
Por defecto cada acción muestra tooltip con \`item.label\` (\`[tooltips]="false"\` para desactivar).
        `,
      },
    },
  },
  decorators: [
    applicationConfig({
      providers: [
        provideWiIcons({
          'ellipsis-vertical': { outline: ellipsisVerticalOutline },
          'arrow-path': { outline: arrowPathOutline },
          calendar: { outline: calendarOutline },
          trash: { outline: trashOutline },
          'squares-2x2': { outline: squares2x2Outline },
          'x-mark': { outline: xMarkOutline },
        }),
      ],
    }),
    moduleMetadata({
      imports: [WiSpeedDialDemoComponent, WiSpeedDialCardsDemoComponent, WiSpeedDialComponent],
    }),
  ],
  argTypes: {
    direction: {
      control: 'select',
      options: ['left', 'right', 'up', 'down'] satisfies WiSpeedDialDirection[],
    },
    disabled: { control: 'boolean' },
    closeOnSelect: { control: 'boolean' },
    tooltips: { control: 'boolean' },
    triggerIcon: { control: 'text' },
    itemClick: {
      action: 'itemClick',
      table: { category: 'Events' },
      control: false,
    },
  },
  args: {
    direction: 'left',
    disabled: false,
    closeOnSelect: true,
    tooltips: true,
    triggerIcon: 'ellipsis-vertical',
    itemClick: fn(),
  },
};

export default meta;
type Story = StoryObj<WiSpeedDialStoryArgs>;

export const Default: Story = {
  render: (args, { globals }) => {
    const t = speedDialCopy(globals);
    return {
      props: {
        ...args,
        items: t.actionsA,
        hint: t.hintClick,
        lastActionPrefix: t.lastActionPrefix,
        ariaLabel: t.ariaLabel,
      },
      template: `
      <wi-speed-dial-demo
        [items]="items"
        [hint]="hint"
        [lastActionPrefix]="lastActionPrefix"
        [direction]="direction"
        [disabled]="disabled"
        [closeOnSelect]="closeOnSelect"
        [tooltips]="tooltips"
        [ariaLabel]="ariaLabel"
        [triggerIcon]="triggerIcon"
        (itemClick)="itemClick($event)"
      />
    `,
    };
  },
};

export const Directions: Story = {
  render: (args, { globals }) => {
    const t = speedDialCopy(globals);
    return {
      props: {
        ...args,
        items: t.actionsA,
        ariaLabelLeft: t.ariaLabelLeft,
        ariaLabelRight: t.ariaLabelRight,
        ariaLabelUp: t.ariaLabelUp,
        ariaLabelDown: t.ariaLabelDown,
      },
      template: `
      <div class="grid min-h-80 grid-cols-2 place-items-center gap-16 p-12">
        <div class="flex min-h-28 min-w-40 flex-col items-center justify-center gap-2">
          <span class="text-xs text-on-surface-variant">left</span>
          <wi-speed-dial
            [items]="items"
            direction="left"
            [ariaLabel]="ariaLabelLeft"
            (itemClick)="itemClick($event)"
          />
        </div>
        <div class="flex min-h-28 min-w-40 flex-col items-center justify-center gap-2">
          <span class="text-xs text-on-surface-variant">right</span>
          <wi-speed-dial
            [items]="items"
            direction="right"
            [ariaLabel]="ariaLabelRight"
            (itemClick)="itemClick($event)"
          />
        </div>
        <div class="flex min-h-28 min-w-40 flex-col items-center justify-center gap-2">
          <span class="text-xs text-on-surface-variant">up</span>
          <wi-speed-dial
            [items]="items"
            direction="up"
            [ariaLabel]="ariaLabelUp"
            (itemClick)="itemClick($event)"
          />
        </div>
        <div class="flex min-h-28 min-w-40 flex-col items-center justify-center gap-2">
          <span class="text-xs text-on-surface-variant">down</span>
          <wi-speed-dial
            [items]="items"
            direction="down"
            [ariaLabel]="ariaLabelDown"
            (itemClick)="itemClick($event)"
          />
        </div>
      </div>
    `,
    };
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args, { globals }) => {
    const t = speedDialCopy(globals);
    return {
      props: {
        ...args,
        items: t.actionsA,
        hint: t.hintClick,
        lastActionPrefix: t.lastActionPrefix,
        ariaLabel: t.ariaLabel,
      },
      template: `
      <wi-speed-dial-demo
        [items]="items"
        [hint]="hint"
        [lastActionPrefix]="lastActionPrefix"
        [disabled]="disabled"
        [ariaLabel]="ariaLabel"
        (itemClick)="itemClick($event)"
      />
    `,
    };
  },
};

export const RecipeCardRow: Story = {
  name: 'Recipe / Card row',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Card A empieza abierta; Card B cerrada. Labels según toolbar Locale. Cada card tiene su propio `items`.',
      },
    },
  },
  render: (args, { globals }) => {
    const t = speedDialCopy(globals);
    return {
      props: {
        ...args,
        hint: t.hintCards,
        cardATitle: t.cardATitle,
        cardABody: t.cardABody,
        cardBTitle: t.cardBTitle,
        cardBBody: t.cardBBody,
        updatedLabel: t.updatedLabel,
        ariaLabelA: t.ariaLabelA,
        ariaLabelB: t.ariaLabelB,
        actionsA: t.actionsA,
        actionsB: t.actionsB,
      },
      template: `
      <wi-speed-dial-cards-demo
        [hint]="hint"
        [cardATitle]="cardATitle"
        [cardABody]="cardABody"
        [cardBTitle]="cardBTitle"
        [cardBBody]="cardBBody"
        [updatedLabel]="updatedLabel"
        [ariaLabelA]="ariaLabelA"
        [ariaLabelB]="ariaLabelB"
        [actionsA]="actionsA"
        [actionsB]="actionsB"
        (itemClick)="itemClick($event)"
      />
    `,
    };
  },
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  render: (args, { globals }) => {
    const t = speedDialCopy(globals);
    return {
      props: {
        ...args,
        items: t.actionsA,
        hint: t.hintClick,
        lastActionPrefix: t.lastActionPrefix,
        ariaLabel: t.ariaLabel,
      },
      template: `
      <div class="rounded-control bg-background p-6 text-on-surface">
        <wi-speed-dial-demo
          [items]="items"
          [hint]="hint"
          [lastActionPrefix]="lastActionPrefix"
          [ariaLabel]="ariaLabel"
          (itemClick)="itemClick($event)"
        />
      </div>
    `,
    };
  },
};
