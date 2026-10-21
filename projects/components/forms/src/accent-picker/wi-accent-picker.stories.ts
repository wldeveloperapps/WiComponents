import { NgTemplateOutlet } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, output } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { applicationConfig, moduleMetadata } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { provideWiIcons, WiIconComponent } from '@wldeveloperapps/ui/icon';
import { cubeOutline } from '@wldeveloperapps/ui/icon/heroicons';

import {
  WI_ACCENTS,
  WiAccentDirective,
  WiAccentPickerComponent,
  type WiAccent,
  type WiAccentLabels,
} from '../public-api';

type WiAccentPickerStoryArgs = WiAccentPickerComponent & {
  valueChange: ReturnType<typeof fn>;
  touch: ReturnType<typeof fn>;
};

const hideFromDocs = { table: { disable: true }, control: false } as const;

const hiddenInternals: Record<string, typeof hideFromDocs> = {
  cvaDisabled: hideFromDocs,
  onChange: hideFromDocs,
  onTouched: hideFromDocs,
  generatedId: hideFromDocs,
  generatedName: hideFromDocs,
  resolvedId: hideFromDocs,
  groupName: hideFromDocs,
  isDisabled: hideFromDocs,
  visibleAccents: hideFromDocs,
  labelledBy: hideFromDocs,
  describedBy: hideFromDocs,
  groupAriaLabel: hideFromDocs,
  optionClasses: hideFromDocs,
  swatchClasses: hideFromDocs,
  labelFor: hideFromDocs,
  swatchBackground: hideFromDocs,
  optionId: hideFromDocs,
  writeValue: hideFromDocs,
  registerOnChange: hideFromDocs,
  registerOnTouched: hideFromDocs,
  setDisabledState: hideFromDocs,
  onSelect: hideFromDocs,
  onOptionBlur: hideFromDocs,
};

const DEMO_LABELS: WiAccentLabels = {
  blue: 'Azul',
  teal: 'Verde azulado',
  green: 'Verde',
  amber: 'Ámbar',
  orange: 'Naranja',
  red: 'Rojo',
  purple: 'Morado',
  pink: 'Rosa',
  slate: 'Pizarra',
};

/**
 * CSS que la app copia en su hoja global, después de `tokens.css`.
 * En el canvas se aplica solo dentro de `.client-palette` para no pisar otras historias.
 */
const CLIENT_ACCENT_CSS = `:root {
  --wi-color-accent-teal: #6d28d9;
  --wi-color-on-accent-teal: #ffffff;
  --wi-color-accent-teal-container: #ede9fe;
  --wi-color-on-accent-teal-container: #3b0764;
}

.wi-dark {
  --wi-color-accent-teal: #ddd6fe;
  --wi-color-on-accent-teal: #2e1065;
  --wi-color-accent-teal-container: #3b0764;
  --wi-color-on-accent-teal-container: #ede9fe;
}`;

/**
 * Demo de Storybook. No es API pública.
 * Muestra el mismo id con los tokens de la librería y con el CSS de la app.
 */
@Component({
  selector: 'wi-sb-accent-client-css',
  imports: [NgTemplateOutlet, WiAccentPickerComponent, WiAccentDirective, WiIconComponent],
  host: {
    class: 'block w-full max-w-5xl min-w-0 text-on-surface',
  },
  styles: [
    `
      .client-palette {
        --wi-color-accent-teal: #6d28d9;
        --wi-color-on-accent-teal: #ffffff;
        --wi-color-accent-teal-container: #ede9fe;
        --wi-color-on-accent-teal-container: #3b0764;
      }

      .wi-dark .client-palette {
        --wi-color-accent-teal: #ddd6fe;
        --wi-color-on-accent-teal: #2e1065;
        --wi-color-accent-teal-container: #3b0764;
        --wi-color-on-accent-teal-container: #ede9fe;
      }
    `,
  ],
  template: `
    <div class="flex flex-col gap-6">
      <header class="max-w-3xl space-y-2">
        <h2 class="text-base font-semibold text-on-surface">CSS de la app</h2>
        <p class="m-0 text-sm text-on-surface-variant">
          Cada tipo guarda un id (<code>teal</code>, <code>blue</code>…). El icono de ese tipo usa
          <code>[wiAccent]</code>. Los hex van en <code>src/styles.css</code> de la app, después de
          importar <code>tokens.css</code>. Cuatro variables por id, en <code>:root</code> y en
          <code>.wi-dark</code>. Si no pisas un id, se queda el de la librería.
        </p>
      </header>

      <section class="space-y-3">
        <h3 class="text-sm font-semibold text-on-surface">Claro</h3>
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <article class="min-w-0 space-y-3 rounded-control border border-outline-variant p-4">
            <h4 class="m-0 text-sm font-medium">Tokens de la librería</h4>
            <ng-container
              [ngTemplateOutlet]="sample"
              [ngTemplateOutletContext]="{ groupLabel: 'Teal de la librería, claro' }"
            />
          </article>
          <article
            class="client-palette min-w-0 space-y-3 rounded-control border border-outline-variant p-4"
          >
            <h4 class="m-0 text-sm font-medium">Mismo id, CSS de la app</h4>
            <ng-container
              [ngTemplateOutlet]="sample"
              [ngTemplateOutletContext]="{ groupLabel: 'Teal redefinido por la app, claro' }"
            />
          </article>
        </div>
      </section>

      <section class="wi-dark space-y-3 rounded-control bg-background p-4 text-on-background">
        <h3 class="text-sm font-semibold">Oscuro</h3>
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <article class="min-w-0 space-y-3 rounded-control border border-outline-variant p-4">
            <h4 class="m-0 text-sm font-medium">Tokens de la librería</h4>
            <ng-container
              [ngTemplateOutlet]="sample"
              [ngTemplateOutletContext]="{ groupLabel: 'Teal de la librería, oscuro' }"
            />
          </article>
          <article
            class="client-palette min-w-0 space-y-3 rounded-control border border-outline-variant p-4"
          >
            <h4 class="m-0 text-sm font-medium">Mismo id, CSS de la app</h4>
            <ng-container
              [ngTemplateOutlet]="sample"
              [ngTemplateOutletContext]="{ groupLabel: 'Teal redefinido por la app, oscuro' }"
            />
          </article>
        </div>
      </section>

      <section class="max-w-3xl space-y-2">
        <h3 class="text-sm font-semibold text-on-surface">Qué copiar</h3>
        <p class="m-0 text-sm text-on-surface-variant">
          En el canvas el override vive en una clase para no cambiar el resto de historias. En la
          app el selector es <code>:root</code> y <code>.wi-dark</code>, como abajo. El ejemplo solo
          cambia <code>teal</code>; el patrón es el mismo para <code>blue</code>,
          <code>green</code>, <code>amber</code>, <code>orange</code>, <code>red</code>,
          <code>purple</code>, <code>pink</code> y <code>slate</code>.
        </p>
        <pre
          class="m-0 overflow-x-auto rounded-control border border-outline-variant bg-surface-container-low p-4 text-xs text-on-surface"
          >{{ css }}</pre>
        <ul class="m-0 list-disc space-y-1 pl-5 text-sm text-on-surface-variant">
          <li><code>--wi-color-accent-&#123;id&#125;</code> color del icono y de la muestra.</li>
          <li><code>--wi-color-on-accent-&#123;id&#125;</code> contenido sobre el color sólido.</li>
          <li><code>--wi-color-accent-&#123;id&#125;-container</code> fondo tintado.</li>
          <li><code>--wi-color-on-accent-&#123;id&#125;-container</code> icono sobre ese fondo.</li>
        </ul>
      </section>
    </div>

    <ng-template #sample let-groupLabel="groupLabel">
      <wi-accent-picker
        [value]="'teal'"
        [accentLabels]="labels"
        [ariaLabel]="groupLabel"
        (valueChange)="valueChange.emit($event)"
        (touch)="touch.emit()"
      />
      <div class="flex flex-wrap items-center gap-3">
        <wi-icon name="cube" size="lg" wiAccent="teal" />
        <span
          class="inline-flex size-10 items-center justify-center rounded-full"
          wiAccent="teal"
          wiAccentTone="container"
        >
          <wi-icon name="cube" />
        </span>
        <span
          class="inline-flex size-10 items-center justify-center rounded-full"
          wiAccent="teal"
          wiAccentTone="solid"
        >
          <wi-icon name="cube" />
        </span>
      </div>
    </ng-template>
  `,
})
class AccentClientCssDemoComponent {
  readonly valueChange = output<WiAccent | null>();
  readonly touch = output<void>();
  protected readonly labels = DEMO_LABELS;
  protected readonly css = CLIENT_ACCENT_CSS;
}

const meta: Meta<WiAccentPickerStoryArgs> = {
  title: 'Forms/WiAccentPicker',
  component: WiAccentPickerComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: {
      include: [
        'value',
        'accents',
        'accentLabels',
        'size',
        'id',
        'name',
        'disabled',
        'invalid',
        'required',
        'ariaLabel',
        'ariaLabelledBy',
        'ariaDescribedBy',
      ],
    },
    docs: {
      description: {
        component: `
Color de un **tipo**. La app asigna un id de esta paleta a cada tipo y pinta el icono de ese tipo con el mismo id. El tipo, el icono y los textos los pone la app.

El componente se llama acento (\`wi-accent-picker\`, \`[wiAccent]\`) porque es un rol de la paleta. El valor es un id (\`WiAccent\`: \`blue\`, \`teal\`, \`green\`, \`amber\`, \`orange\`, \`red\`, \`purple\`, \`pink\`, \`slate\`), no un hex.

Los matices de claro y oscuro van en el CSS global de la app (\`:root\` y \`.wi-dark\`), no en el componente. Historia **CSS de la app**: mismo id \`teal\` con los tokens de la librería y con un override de ejemplo.

Para pintar el icono:

- \`wiAccentTone="icon"\` (defecto): tiñe el glifo.
- \`wiAccentTone="container"\`: pastilla tintada. La app pone tamaño y radio.
- \`wiAccentTone="solid"\`: fondo del acento.

\`accentLabels\` son los nombres accesibles (i18n de la app). Si faltan, se usa el id. El grupo necesita \`ariaLabel\` o \`ariaLabelledBy\`.

No usa \`error\` / \`warning\` / \`success\`: esos tokens son estado, no el color de un tipo. Events: \`valueChange\`, \`touch\`.
        `,
      },
    },
  },
  decorators: [
    applicationConfig({
      providers: [
        provideWiIcons({
          cube: { outline: cubeOutline },
        }),
      ],
    }),
    moduleMetadata({
      imports: [
        WiAccentPickerComponent,
        WiAccentDirective,
        WiIconComponent,
        ReactiveFormsModule,
        AccentClientCssDemoComponent,
      ],
    }),
  ],
  argTypes: {
    value: {
      control: 'select',
      options: [null, ...WI_ACCENTS],
    },
    accents: { control: 'object' },
    accentLabels: { control: 'object' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    required: { control: 'boolean' },
    id: { control: 'text' },
    name: { control: 'text' },
    ariaLabel: { control: 'text' },
    ariaLabelledBy: { control: 'text' },
    ariaDescribedBy: { control: 'text' },
    valueChange: {
      action: 'valueChange',
      description: 'Se emite al elegir un acento',
      table: { category: 'Events' },
      control: false,
    },
    touch: {
      action: 'touch',
      description: 'Se emite al salir del grupo (Signal Forms / touched)',
      table: { category: 'Events' },
      control: false,
    },
    ...hiddenInternals,
  },
  args: {
    value: null,
    accents: [...WI_ACCENTS],
    accentLabels: DEMO_LABELS,
    size: 'md',
    disabled: false,
    invalid: false,
    required: false,
    id: '',
    name: '',
    ariaLabel: 'Color de la entidad',
    ariaLabelledBy: '',
    ariaDescribedBy: '',
    valueChange: fn(),
    touch: fn(),
  },
};

export default meta;
type Story = StoryObj<WiAccentPickerStoryArgs>;

const pickerBindings = `
  [value]="value"
  (valueChange)="value = $event; valueChange($event)"
  [accents]="accents"
  [accentLabels]="accentLabels"
  [size]="size"
  [id]="id || undefined"
  [name]="name"
  [disabled]="disabled"
  [invalid]="invalid"
  [required]="required"
  [ariaLabel]="ariaLabel"
  [ariaLabelledBy]="ariaLabelledBy || null"
  [ariaDescribedBy]="ariaDescribedBy || null"
  (touch)="touch()"
`;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<wi-accent-picker ${pickerBindings} />`,
  }),
};

export const Sizes: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex min-w-0 flex-col gap-4">
        <wi-accent-picker size="sm" ariaLabel="Pequeño" [accentLabels]="accentLabels" [value]="'teal'" (valueChange)="valueChange($event)" (touch)="touch()" />
        <wi-accent-picker size="md" ariaLabel="Mediano" [accentLabels]="accentLabels" [value]="'teal'" (valueChange)="valueChange($event)" (touch)="touch()" />
        <wi-accent-picker size="lg" ariaLabel="Grande" [accentLabels]="accentLabels" [value]="'teal'" (valueChange)="valueChange($event)" (touch)="touch()" />
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex min-w-0 flex-col gap-4">
        <wi-accent-picker disabled ariaLabel="Sin selección" [accentLabels]="accentLabels" (valueChange)="valueChange($event)" (touch)="touch()" />
        <wi-accent-picker disabled [value]="'purple'" ariaLabel="Con selección" [accentLabels]="accentLabels" (valueChange)="valueChange($event)" (touch)="touch()" />
      </div>
    `,
  }),
};

export const Invalid: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex min-w-0 max-w-xs flex-col gap-2">
        <span id="accent-label" class="text-sm font-medium text-on-surface">Color</span>
        <wi-accent-picker
          invalid
          required
          ariaLabelledBy="accent-label"
          ariaDescribedBy="accent-error"
          [accentLabels]="accentLabels"
          (valueChange)="valueChange($event)"
          (touch)="touch()"
        />
        <p id="accent-error" class="m-0 text-sm text-error" role="alert">Elige un color.</p>
      </div>
    `,
  }),
};

export const Subset: Story = {
  render: (args) => ({
    props: {
      ...args,
      subset: ['blue', 'teal', 'amber', 'slate'] as const satisfies readonly WiAccent[],
    },
    template: `
      <wi-accent-picker
        ariaLabel="Colores disponibles"
        [accents]="subset"
        [accentLabels]="accentLabels"
        [value]="'amber'"
        (valueChange)="valueChange($event)"
        (touch)="touch()"
      />
    `,
  }),
};

export const WithIcon: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex min-w-0 max-w-sm flex-col gap-4">
        <wi-accent-picker ${pickerBindings} />
        @if (value) {
          <div class="flex flex-wrap items-center gap-3 text-on-surface">
            <wi-icon name="cube" size="lg" [wiAccent]="value" />
            <span
              class="inline-flex size-10 items-center justify-center rounded-full"
              [wiAccent]="value"
              wiAccentTone="container"
            >
              <wi-icon name="cube" />
            </span>
            <span
              class="inline-flex size-10 items-center justify-center rounded-full"
              [wiAccent]="value"
              wiAccentTone="solid"
            >
              <wi-icon name="cube" />
            </span>
          </div>
        } @else {
          <p class="m-0 text-sm text-on-surface-variant">Elige un acento para ver el icono.</p>
        }
      </div>
    `,
  }),
};

export const WithReactiveForms: Story = {
  render: (args) => {
    const form = new FormGroup({
      accent: new FormControl<WiAccent | null>(null, {
        validators: [Validators.required],
      }),
    });

    return {
      props: {
        ...args,
        form,
        submit: () => {
          form.controls.accent.markAsTouched();
        },
      },
      template: `
        <form class="flex min-w-0 max-w-sm flex-col gap-3" [formGroup]="form" (ngSubmit)="submit()">
          <span id="entity-accent-label" class="text-sm font-medium text-on-surface">Color de la entidad</span>
          <wi-accent-picker
            formControlName="accent"
            required
            ariaLabelledBy="entity-accent-label"
            ariaDescribedBy="entity-accent-error"
            [accentLabels]="accentLabels"
            [invalid]="form.controls.accent.invalid && form.controls.accent.touched"
            (valueChange)="valueChange($event)"
            (touch)="touch()"
          />
          @if (form.controls.accent.invalid && form.controls.accent.touched) {
            <p id="entity-accent-error" class="m-0 text-sm text-error" role="alert">Elige un color.</p>
          }
          @if (form.controls.accent.value) {
            <span
              class="inline-flex size-10 items-center justify-center rounded-full"
              [wiAccent]="form.controls.accent.value"
              wiAccentTone="container"
            >
              <wi-icon name="cube" />
            </span>
          }
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
      <div class="wi-dark flex min-w-0 max-w-sm flex-col gap-4 rounded-control bg-background p-4 text-on-background">
        <wi-accent-picker
          [value]="'teal'"
          ariaLabel="Color de la entidad"
          [accentLabels]="accentLabels"
          (valueChange)="valueChange($event)"
          (touch)="touch()"
        />
        <div class="flex flex-wrap items-center gap-3">
          <wi-icon name="cube" size="lg" wiAccent="teal" />
          <span
            class="inline-flex size-10 items-center justify-center rounded-full"
            wiAccent="teal"
            wiAccentTone="container"
          >
            <wi-icon name="cube" />
          </span>
          <span
            class="inline-flex size-10 items-center justify-center rounded-full"
            wiAccent="teal"
            wiAccentTone="solid"
          >
            <wi-icon name="cube" />
          </span>
        </div>
      </div>
    `,
  }),
};

export const ClientCss: Story = {
  name: 'CSS de la app',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Dónde pone la app los colores. El tipo guarda el id (`teal`). El CSS global redefine `--wi-color-accent-teal` y las tres variables de contraste, en `:root` y en `.wi-dark`. El canvas compara el token de la librería con ese override; el bloque de abajo es el CSS a copiar en `src/styles.css`, después de `tokens.css`.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <wi-sb-accent-client-css
        (valueChange)="valueChange($event)"
        (touch)="touch()"
      />
    `,
  }),
};

export const Responsive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'En ~320px las muestras pasan a otra fila (`flex-wrap`, `max-w-full`). No hay ancho fijo.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="w-full max-w-[16rem]">
        <wi-accent-picker ${pickerBindings} />
      </div>
    `,
  }),
};
