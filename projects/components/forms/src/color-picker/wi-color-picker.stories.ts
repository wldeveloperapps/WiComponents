import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { WiColorPickerComponent, type WiColorPickerLabels } from '../public-api';

type WiColorPickerStoryArgs = WiColorPickerComponent & {
  valueChange: ReturnType<typeof fn>;
  touch: ReturnType<typeof fn>;
};

const hideFromDocs = { table: { disable: true }, control: false } as const;

const hiddenInternals: Record<string, typeof hideFromDocs> = {
  document: hideFromDocs,
  destroyRef: hideFromDocs,
  popover: hideFromDocs,
  triggerRef: hideFromDocs,
  generatedId: hideFromDocs,
  cvaDisabled: hideFromDocs,
  hsv: hideFromDocs,
  hexDraft: hideFromDocs,
  paletteDrag: hideFromDocs,
  onChange: hideFromDocs,
  onTouched: hideFromDocs,
  panelClasses: hideFromDocs,
  hexInputClasses: hideFromDocs,
  resolvedId: hideFromDocs,
  dialogTitleId: hideFromDocs,
  hexLabelId: hideFromDocs,
  isDisabled: hideFromDocs,
  popoverState: hideFromDocs,
  overlayId: hideFromDocs,
  labelledBy: hideFromDocs,
  describedBy: hideFromDocs,
  labelsResolved: hideFromDocs,
  triggerAriaLabel: hideFromDocs,
  hasValue: hideFromDocs,
  triggerClasses: hideFromDocs,
  swatchClasses: hideFromDocs,
  hueCss: hideFromDocs,
  paletteValueText: hideFromDocs,
  writeValue: hideFromDocs,
  registerOnChange: hideFromDocs,
  registerOnTouched: hideFromDocs,
  setDisabledState: hideFromDocs,
  focus: hideFromDocs,
  onClosed: hideFromDocs,
  onPalettePointerDown: hideFromDocs,
  onPaletteKeydown: hideFromDocs,
  onHueInput: hideFromDocs,
  onHexInput: hideFromDocs,
  onHexBlur: hideFromDocs,
  syncFromValue: hideFromDocs,
  paintFromPointer: hideFromDocs,
  paint: hideFromDocs,
  commitHex: hideFromDocs,
  reflectHex: hideFromDocs,
  clear: hideFromDocs,
  eyeDropperReady: hideFromDocs,
  picking: hideFromDocs,
  alive: hideFromDocs,
  onEyeDropper: hideFromDocs,
  eyedropperClasses: hideFromDocs,
};

const DEMO_LABELS: WiColorPickerLabels = {
  dialog: 'Elegir color',
  palette: 'Saturación y brillo',
  hue: 'Tono',
  hex: 'Hexadecimal',
  empty: 'Sin color',
  eyedropper: 'Cuentagotas',
};

const meta: Meta<WiColorPickerStoryArgs> = {
  title: 'Forms/WiColorPicker',
  component: WiColorPickerComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: {
      include: [
        'value',
        'size',
        'id',
        'placeholder',
        'disabled',
        'invalid',
        'required',
        'ariaLabel',
        'ariaLabelledBy',
        'ariaDescribedBy',
        'labels',
      ],
    },
    docs: {
      description: {
        component: `
Color **libre**. El valor es un hex opaco (\`#rrggbb\`), no un token y no un id de \`wi-accent-picker\`.

No sigue \`.wi-dark\`: el color elegido es un dato que guarda la app. Para la identidad de una entidad (el mismo id en claro y en oscuro) sigue \`wi-accent-picker\` y \`[wiAccent]\`.

El panel tiene un plano de saturación y brillo, un tono y un campo hexadecimal. \`#rgb\` se normaliza a \`#rrggbb\` al salir del campo. No hay canal alfa.

El cuentagotas usa la API \`EyeDropper\` del navegador. El botón solo aparece en Chromium (Chrome, Edge) con \`https\` o \`localhost\`. En Firefox y Safari no se pinta. Cancelar con Escape no cambia el valor. El nombre accesible es \`labels.eyedropper\`.

\`labels\` son los nombres accesibles (i18n de la app). El trigger necesita \`ariaLabel\` o \`ariaLabelledBy\`. Events: \`valueChange\`, \`touch\` (al cerrar el panel).
        `,
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [WiColorPickerComponent, ReactiveFormsModule],
    }),
  ],
  argTypes: {
    value: { control: 'text' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    id: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    required: { control: 'boolean' },
    ariaLabel: { control: 'text' },
    ariaLabelledBy: { control: 'text' },
    ariaDescribedBy: { control: 'text' },
    labels: { control: 'object' },
    valueChange: {
      action: 'valueChange',
      description: 'Se emite al elegir un color',
      table: { category: 'Events' },
      control: false,
    },
    touch: {
      action: 'touch',
      description: 'Se emite al cerrar el panel (Signal Forms / touched)',
      table: { category: 'Events' },
      control: false,
    },
    ...hiddenInternals,
  },
  args: {
    value: '#32628d',
    size: 'md',
    id: '',
    placeholder: 'Elige un color',
    disabled: false,
    invalid: false,
    required: false,
    ariaLabel: 'Color',
    ariaLabelledBy: '',
    ariaDescribedBy: '',
    labels: DEMO_LABELS,
    valueChange: fn(),
    touch: fn(),
  },
};

export default meta;
type Story = StoryObj<WiColorPickerStoryArgs>;

const pickerBindings = `
  [value]="value"
  (valueChange)="value = $event; valueChange($event)"
  [size]="size"
  [id]="id || undefined"
  [placeholder]="placeholder"
  [disabled]="disabled"
  [invalid]="invalid"
  [required]="required"
  [ariaLabel]="ariaLabel"
  [ariaLabelledBy]="ariaLabelledBy || null"
  [ariaDescribedBy]="ariaDescribedBy || null"
  [labels]="labels"
  (touch)="touch()"
`;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="w-64 max-w-full">
        <wi-color-picker ${pickerBindings} />
      </div>
    `,
  }),
};

export const Empty: Story = {
  args: {
    value: null,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="w-64 max-w-full">
        <wi-color-picker ${pickerBindings} />
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex w-64 max-w-full flex-col gap-3">
        <wi-color-picker size="sm" ariaLabel="Pequeño" [labels]="labels" value="#32628d" (valueChange)="valueChange($event)" (touch)="touch()" />
        <wi-color-picker size="md" ariaLabel="Mediano" [labels]="labels" value="#32628d" (valueChange)="valueChange($event)" (touch)="touch()" />
        <wi-color-picker size="lg" ariaLabel="Grande" [labels]="labels" value="#32628d" (valueChange)="valueChange($event)" (touch)="touch()" />
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex w-64 max-w-full flex-col gap-3">
        <wi-color-picker disabled ariaLabel="Sin color" placeholder="Elige un color" [labels]="labels" (valueChange)="valueChange($event)" (touch)="touch()" />
        <wi-color-picker disabled value="#6d28d9" ariaLabel="Con color" [labels]="labels" (valueChange)="valueChange($event)" (touch)="touch()" />
      </div>
    `,
  }),
};

export const Invalid: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex w-64 max-w-full flex-col gap-2">
        <span id="mark-color-label" class="text-sm font-medium text-on-surface">Color</span>
        <wi-color-picker
          invalid
          required
          placeholder="Elige un color"
          ariaLabelledBy="mark-color-label"
          ariaDescribedBy="mark-color-error"
          [labels]="labels"
          (valueChange)="valueChange($event)"
          (touch)="touch()"
        />
        <p id="mark-color-error" class="m-0 text-sm text-error" role="alert">Elige un color.</p>
      </div>
    `,
  }),
};

export const WithReactiveForms: Story = {
  render: (args) => {
    const form = new FormGroup({
      color: new FormControl<string | null>(null, {
        validators: [Validators.required],
      }),
    });

    return {
      props: {
        ...args,
        form,
        submit: () => {
          form.controls.color.markAsTouched();
        },
      },
      template: `
        <form class="flex w-64 max-w-full flex-col gap-3" [formGroup]="form" (ngSubmit)="submit()">
          <span id="form-color-label" class="text-sm font-medium text-on-surface">Color de la marca</span>
          <wi-color-picker
            formControlName="color"
            required
            placeholder="Elige un color"
            ariaLabelledBy="form-color-label"
            ariaDescribedBy="form-color-error"
            [labels]="labels"
            [invalid]="form.controls.color.invalid && form.controls.color.touched"
            (valueChange)="valueChange($event)"
            (touch)="touch()"
          />
          @if (form.controls.color.invalid && form.controls.color.touched) {
            <p id="form-color-error" class="m-0 text-sm text-error" role="alert">Elige un color.</p>
          }
          <p class="m-0 font-mono text-sm text-on-surface-variant">{{ form.controls.color.value || 'Sin color' }}</p>
          <button type="submit" class="w-fit text-sm text-primary">Guardar</button>
        </form>
      `,
    };
  },
};

export const DarkMode: Story = {
  globals: {
    theme: 'dark',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="wi-dark flex w-64 max-w-full flex-col gap-3 rounded-control bg-background p-4 text-on-background">
        <wi-color-picker
          value="#6d28d9"
          ariaLabel="Color"
          placeholder="Elige un color"
          [labels]="labels"
          (valueChange)="valueChange($event)"
          (touch)="touch()"
        />
        <wi-color-picker
          ariaLabel="Sin color"
          placeholder="Elige un color"
          [labels]="labels"
          (valueChange)="valueChange($event)"
          (touch)="touch()"
        />
      </div>
    `,
  }),
};

export const Responsive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'En ~320px el trigger ocupa el ancho del campo (`w-full`, `min-w-0`) y el panel no pasa de `16rem` ni de `100vw - 2rem`. El hex largo se trunca.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="w-64 max-w-full">
        <wi-color-picker ${pickerBindings} />
      </div>
    `,
  }),
};
