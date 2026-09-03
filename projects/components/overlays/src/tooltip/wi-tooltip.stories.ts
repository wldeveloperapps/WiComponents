import { Directionality } from '@angular/cdk/bidi';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { applicationConfig, moduleMetadata } from '@storybook/angular-vite';

import { WiButtonDirective } from '../../../button/src/public-api';
import { trashOutline } from '../../../icon/heroicons/src/trash';
import { provideWiIcons, WiIconComponent } from '../../../icon/src/public-api';
import { provideWiTooltipGroup, WiTooltipDirective } from '../public-api';

const meta: Meta = {
  title: 'Overlays/WiTooltip',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Tooltip complementario vía \`"wiTooltip"\` (string o \`TemplateRef\`).

- Hover y focus en el **host** (preferir el control nativo o un host con caja CSS).
- No usar como única fuente de información crítica: en icon-only el nombre accesible va en el botón (\`aria-label\` / \`ariaLabel\`).
- **Host con caja CSS (obligatorio):** el overlay se ancla con \`getBoundingClientRect()\` del elemento que lleva \`[wiTooltip]\`. Si ese elemento usa \`display: contents\` (u otro modo sin caja), el tip aparece en **(0,0)**. Aplica a wrappers custom, no solo a botones. Ver story **HostMustHaveBox**.
- \`wi-button\` usa host \`inline-flex\` (medible): se puede poner \`[wiTooltip]\` directamente en \`<button wiButton>\`.
- Responsive: cerca del borde del viewport el overlay hace flip (\`top\` ↔ \`bottom\`, etc.).
        `,
      },
    },
  },
  decorators: [
    applicationConfig({
      providers: [
        Directionality,
        provideWiIcons({
          trash: { outline: trashOutline },
        }),
      ],
    }),
    moduleMetadata({
      imports: [WiTooltipDirective, WiButtonDirective, WiIconComponent],
    }),
  ],
  argTypes: {
    wiTooltip: { control: 'text' },
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    showDelay: { control: 'number' },
    hideDelay: { control: 'number' },
    tooltipDisabled: { control: 'boolean' },
  },
  args: {
    wiTooltip: 'Acción de ejemplo',
    position: 'top',
    showDelay: 150,
    hideDelay: 100,
    tooltipDisabled: false,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <button
        type="button"
        class="rounded-control bg-primary px-4 py-2 text-sm text-on-primary"
        [wiTooltip]="wiTooltip"
        [position]="position"
        [showDelay]="showDelay"
        [hideDelay]="hideDelay"
        [tooltipDisabled]="tooltipDisabled"
      >
        Hover o focus
      </button>
    `,
  }),
};

export const Positions: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center justify-center gap-4 p-8">
        <button type="button" class="rounded-control border border-outline-variant px-3 py-2 text-sm text-on-surface" wiTooltip="Arriba" position="top">top</button>
        <button type="button" class="rounded-control border border-outline-variant px-3 py-2 text-sm text-on-surface" wiTooltip="Abajo" position="bottom">bottom</button>
        <button type="button" class="rounded-control border border-outline-variant px-3 py-2 text-sm text-on-surface" wiTooltip="Izquierda" position="left">left</button>
        <button type="button" class="rounded-control border border-outline-variant px-3 py-2 text-sm text-on-surface" wiTooltip="Derecha" position="right">right</button>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <button
        type="button"
        class="rounded-control border border-outline-variant px-3 py-2 text-sm text-on-surface"
        wiTooltip="No debería verse"
        [tooltipDisabled]="true"
      >
        Tooltip deshabilitado
      </button>
    `,
  }),
};

export const Delays: Story = {
  render: () => ({
    template: `
      <button
        type="button"
        class="rounded-control border border-outline-variant px-3 py-2 text-sm text-on-surface"
        wiTooltip="Aparece tras 600 ms"
        [showDelay]="600"
        [hideDelay]="200"
      >
        Delay largo
      </button>
    `,
  }),
};

export const IconOnly: Story = {
  render: () => ({
    template: `
      <button wiButton
        type="button"
        variant="danger"
        iconOnly
        ariaLabel="Eliminar"
        wiTooltip="Eliminar"
        position="top"
        [showDelay]="0"
        [hideDelay]="0"
      >
        <wi-icon name="trash" />
      </button>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          '`[wiTooltip]` en `<button wiButton>` (host `inline-flex`). El nombre accesible sigue en `ariaLabel`.',
      },
    },
  },
};

export const HostMustHaveBox: Story = {
  name: 'Host must have CSS box',
  parameters: {
    docs: {
      description: {
        story: `
El ancla del overlay es el **elemento que lleva** \`[wiTooltip]\`.

| Host | Resultado |
| --- | --- |
| \`<button>\`, \`<a>\`, \`inline-flex\`, etc. (con caja) | Tip junto al control |
| \`display: contents\` / sin caja | Tip en la esquina (0,0) |

**Incorrecto** (demo del fallo — no copiar en producción):

\`\`\`html
<span class="contents" wiTooltip="Mal">
  <button type="button">Sin caja en el host</button>
</span>
\`\`\`

**Correcto:**

\`\`\`html
<button type="button" wiTooltip="Bien">Nativo</button>
<!-- o -->
<button wiButton wiTooltip="Bien" ariaLabel="…">…</button>
\`\`\`

Si un componente propio usa \`contents\` en el host y necesita tooltip/popover, o bien quita \`contents\`, o aplica la directiva a un hijo/wrapper que sí genere caja.
        `,
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-6 text-sm text-on-surface">
        <div class="flex flex-wrap items-center gap-3">
          <span class="text-on-surface-variant">Correcto (caja):</span>
          <button
            type="button"
            class="rounded-control border border-outline-variant px-3 py-2"
            wiTooltip="Anclado al botón"
            [showDelay]="0"
            [hideDelay]="0"
          >
            Con caja
          </button>
          <button wiButton
            type="button"
            variant="outline"
            wiTooltip="Anclado a wi-button"
            [showDelay]="0"
            [hideDelay]="0"
          >
            wi-button
          </button>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <span class="text-on-surface-variant">Incorrecto (contents → 0,0):</span>
          <span class="contents" wiTooltip="Aparece arriba a la izquierda" [showDelay]="0" [hideDelay]="0">
            <button type="button" class="rounded-control border border-error px-3 py-2 text-error">
              Host sin caja
            </button>
          </span>
        </div>
        <p class="max-w-md text-xs text-on-surface-variant">
          Hover en “Host sin caja” para ver el tip mal posicionado. No uses este patrón en apps.
        </p>
      </div>
    `,
  }),
};

export const DarkMode: Story = {
  globals: {
    theme: 'dark',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Tooltip con `inverse-surface` (fondo oscuro + texto claro en light y dark). Contraste estable; la flecha es un diamante solapado al borde.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="p-8">
        <button
          type="button"
          class="rounded-control bg-primary px-4 py-2 text-sm text-on-primary"
          wiTooltip="Tooltip en modo oscuro"
          position="bottom"
          [showDelay]="0"
          [hideDelay]="0"
        >
          Dark mode
        </button>
      </div>
    `,
  }),
};

export const GroupSkipDelay: Story = {
  decorators: [
    applicationConfig({
      providers: [Directionality, provideWiTooltipGroup({ skipDelayDuration: 800 })],
    }),
  ],
  render: () => ({
    template: `
      <div class="flex flex-wrap gap-3">
        <button type="button" class="rounded-control border border-outline-variant px-3 py-2 text-sm" wiTooltip="Uno" [showDelay]="200" [hideDelay]="0">Uno</button>
        <button type="button" class="rounded-control border border-outline-variant px-3 py-2 text-sm" wiTooltip="Dos" [showDelay]="200" [hideDelay]="0">Dos</button>
        <button type="button" class="rounded-control border border-outline-variant px-3 py-2 text-sm" wiTooltip="Tres" [showDelay]="200" [hideDelay]="0">Tres</button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Con `provideWiTooltipGroup`, tras el primero el siguiente abre al instante dentro de la ventana de skip-delay.',
      },
    },
  },
};

export const NearViewportEdge: Story = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'En viewport estrecho (~320px) el tooltip preferido `top` puede hacer flip a `bottom` si no cabe.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex min-h-40 items-start justify-center p-2">
        <button
          type="button"
          class="rounded-control border border-outline-variant px-3 py-2 text-sm text-on-surface"
          wiTooltip="Texto largo que necesita espacio cerca del borde superior del viewport"
          position="top"
          [showDelay]="0"
          [hideDelay]="0"
        >
          Cerca del borde
        </button>
      </div>
    `,
  }),
};
