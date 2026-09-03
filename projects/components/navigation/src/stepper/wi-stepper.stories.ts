import { Component, input, output, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { applicationConfig, moduleMetadata } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { WiButtonDirective } from '@wiloc/ui/button';
import { provideWiIcons } from '@wiloc/ui/icon';
import {
  keyOutline,
  listBulletOutline,
  squares2x2Outline,
  userOutline,
} from '@wiloc/ui/icon/heroicons';

import {
  getStepperDemoCopy,
  type StepperDemoCopy,
  type StorybookLocale,
} from '../../../.storybook/locale';
import { WiStepperComponent, WiStepperPanelDirective } from '../public-api';
import type { WiStepperOrientation, WiStepperStep } from './wi-stepper.types';

interface WiStepperStoryArgs {
  orientation: WiStepperOrientation;
  linear: boolean;
  valueChange: ReturnType<typeof fn>;
}

function localeFromGlobals(globals: { locale?: string } | undefined): StorybookLocale {
  return globals?.locale === 'en' ? 'en' : 'es';
}

function stepperCopy(globals: { locale?: string } | undefined): StepperDemoCopy {
  return getStepperDemoCopy(localeFromGlobals(globals));
}

@Component({
  selector: 'wi-stepper-demo',
  imports: [WiStepperComponent, WiStepperPanelDirective, WiButtonDirective],
  template: `
    <div class="flex w-full min-w-0 max-w-3xl flex-col gap-3">
      <p class="text-sm text-on-surface-variant">{{ hint() }}</p>
      <wi-stepper
        #stepper
        class="w-full rounded-control border border-outline-variant bg-surface p-4 sm:p-6"
        [steps]="steps()"
        [value]="value()"
        [orientation]="orientation()"
        [linear]="linear()"
        [aria-label]="ariaLabel()"
        (valueChange)="onValueChange($event)"
      >
        @for (step of steps(); track step.id) {
          <div
            [wiStepperPanel]="step.id"
            class="flex min-h-40 min-w-0 flex-col justify-between gap-6"
          >
            <p class="text-sm text-on-surface">{{ bodyOf(step.id) }}</p>
            <div class="flex flex-wrap gap-2">
              @if (!isFirst()) {
                <button wiButton
                  type="button"
                  variant="outline"
                  size="sm"
                  (click)="stepper.selectPrevious()"
                >
                  {{ back() }}
                </button>
              }
              @if (!isLast()) {
                <button wiButton type="button" size="sm" (click)="stepper.selectNext()">
                  {{ next() }}
                </button>
              }
            </div>
          </div>
        }
      </wi-stepper>
    </div>
  `,
})
class WiStepperDemoComponent {
  readonly steps = input.required<readonly WiStepperStep[]>();
  readonly bodies = input.required<Readonly<Record<string, string>>>();
  readonly hint = input.required<string>();
  readonly next = input.required<string>();
  readonly back = input.required<string>();
  readonly ariaLabel = input.required<string>();
  readonly orientation = input<WiStepperOrientation>('vertical');
  readonly linear = input(true);
  readonly valueChange = output<string>();

  protected readonly value = signal('');

  protected bodyOf(id: string): string {
    return this.bodies()[id] ?? '';
  }

  protected isFirst(): boolean {
    return this.steps()[0]?.id === (this.value() || this.steps()[0]?.id);
  }

  protected isLast(): boolean {
    const steps = this.steps();
    const current = this.value() || steps[0]?.id;
    return steps[steps.length - 1]?.id === current;
  }

  protected onValueChange(id: string): void {
    this.value.set(id);
    this.valueChange.emit(id);
  }
}

const meta: Meta<WiStepperStoryArgs> = {
  title: 'Navigation/WiStepper',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Wizard / progreso. **Textos e iconos los pasa la app** en \`steps: { id, label, icon }[]\`
(\`icon\` registrado con \`provideWiIcons\`). El contenido de cada paso es proyección
(\`[wiStepperPanel]\`); Back / Next / submit no van en la librería.

- \`orientation\`: \`vertical\` (default, nav a la izquierda desde 36rem de contenedor) o \`horizontal\`.
- \`linear\` (default \`true\`): la nav no salta a futuros; \`selectNext()\` / \`selectPrevious()\` sí (botones de la app).
- Paso actual: círculo \`bg-primary\`. Completados y pendientes: círculo muted (sin check de producto).

Events: \`valueChange\`. Labels de demo vía toolbar **Locale** (ES/EN).
        `,
      },
    },
  },
  decorators: [
    applicationConfig({
      providers: [
        provideWiIcons({
          user: { outline: userOutline },
          'squares-2x2': { outline: squares2x2Outline },
          key: { outline: keyOutline },
          'list-bullet': { outline: listBulletOutline },
        }),
      ],
    }),
    moduleMetadata({
      imports: [WiStepperDemoComponent, WiStepperComponent, WiStepperPanelDirective],
    }),
  ],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'] satisfies WiStepperOrientation[],
    },
    linear: { control: 'boolean' },
    valueChange: {
      action: 'valueChange',
      description: 'Cambio del paso activo (two-way con `value`)',
      table: { category: 'Events' },
      control: false,
    },
  },
  args: {
    orientation: 'vertical',
    linear: true,
    valueChange: fn(),
  },
};

export default meta;
type Story = StoryObj<WiStepperStoryArgs>;

function demoProps(args: WiStepperStoryArgs, globals: { locale?: string } | undefined) {
  const copy = stepperCopy(globals);
  return {
    ...args,
    steps: copy.steps.map(({ id, icon, label }) => ({ id, icon, label })),
    bodies: Object.fromEntries(copy.steps.map((step) => [step.id, step.body])),
    hint: copy.hint,
    next: copy.next,
    back: copy.back,
    ariaLabel: copy.ariaLabel,
  };
}

export const Default: Story = {
  name: 'Vertical (lineal)',
  render: (args, { globals }) => ({
    props: demoProps(args, globals),
    template: `
      <wi-stepper-demo
        [steps]="steps"
        [bodies]="bodies"
        [hint]="hint"
        [next]="next"
        [back]="back"
        [ariaLabel]="ariaLabel"
        [orientation]="orientation"
        [linear]="linear"
        (valueChange)="valueChange($event)"
      />
    `,
  }),
};

export const Horizontal: Story = {
  args: { orientation: 'horizontal', linear: false },
  render: (args, { globals }) => ({
    props: demoProps(args, globals),
    template: `
      <wi-stepper-demo
        [steps]="steps"
        [bodies]="bodies"
        [hint]="hint"
        [next]="next"
        [back]="back"
        [ariaLabel]="ariaLabel"
        [orientation]="orientation"
        [linear]="linear"
        (valueChange)="valueChange($event)"
      />
    `,
  }),
};

export const NonLinear: Story = {
  name: 'No lineal',
  args: { linear: false },
  parameters: {
    docs: {
      description: {
        story: 'Sin `linear`, cualquier paso no `disabled` se puede seleccionar desde la nav.',
      },
    },
  },
  render: (args, { globals }) => ({
    props: demoProps(args, globals),
    template: `
      <wi-stepper-demo
        [steps]="steps"
        [bodies]="bodies"
        [hint]="hint"
        [next]="next"
        [back]="back"
        [ariaLabel]="ariaLabel"
        [orientation]="orientation"
        [linear]="linear"
        (valueChange)="valueChange($event)"
      />
    `,
  }),
};

export const DisabledStep: Story = {
  render: (args, { globals }) => {
    const copy = stepperCopy(globals);
    const steps = copy.steps.map(({ id, icon, label }, index) => ({
      id,
      icon,
      label,
      disabled: index === 2,
    }));
    return {
      props: {
        ...demoProps(args, globals),
        steps,
        linear: false,
      },
      template: `
        <wi-stepper-demo
          [steps]="steps"
          [bodies]="bodies"
          [hint]="hint"
          [next]="next"
          [back]="back"
          [ariaLabel]="ariaLabel"
          orientation="vertical"
          [linear]="false"
          (valueChange)="valueChange($event)"
        />
      `,
    };
  },
};

export const LongLabels: Story = {
  render: (args, { globals }) => {
    const copy = stepperCopy(globals);
    const steps = copy.steps.map((step, index) => ({
      id: step.id,
      icon: step.icon,
      label: index === 1 ? copy.longLabel : step.label,
    }));
    return {
      props: {
        ...demoProps(args, globals),
        steps,
      },
      template: `
        <wi-stepper-demo
          [steps]="steps"
          [bodies]="bodies"
          [hint]="hint"
          [next]="next"
          [back]="back"
          [ariaLabel]="ariaLabel"
          [orientation]="orientation"
          [linear]="linear"
          (valueChange)="valueChange($event)"
        />
      `,
    };
  },
};

export const DarkMode: Story = {
  render: (args, { globals }) => ({
    props: demoProps(args, globals),
    template: `
      <div class="wi-dark w-full min-w-0 rounded-control bg-background p-4 sm:p-6">
        <wi-stepper-demo
          [steps]="steps"
          [bodies]="bodies"
          [hint]="hint"
          [next]="next"
          [back]="back"
          [ariaLabel]="ariaLabel"
          [orientation]="orientation"
          [linear]="linear"
          (valueChange)="valueChange($event)"
        />
      </div>
    `,
  }),
};

export const Responsive: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Padre ~320px: container query (36rem del propio `wi-stepper`, no el viewport). En vertical la nav se apila encima del panel; labels con wrap (`wrap-break-word`, `min-w-0`).',
      },
    },
  },
  render: (args, { globals }) => ({
    props: demoProps(args, globals),
    template: `
      <div class="w-[320px] max-w-full rounded-control border border-outline-variant p-3">
        <wi-stepper-demo
          [steps]="steps"
          [bodies]="bodies"
          [hint]="hint"
          [next]="next"
          [back]="back"
          [ariaLabel]="ariaLabel"
          orientation="vertical"
          [linear]="linear"
          (valueChange)="valueChange($event)"
        />
      </div>
    `,
  }),
};
