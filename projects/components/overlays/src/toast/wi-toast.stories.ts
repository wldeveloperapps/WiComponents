import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { WiButtonDirective } from '@wldeveloperapps/ui/button';

import {
  getToastDemoCopy,
  type StorybookLocale,
  type ToastDemoCopy,
} from '../../../.storybook/locale';
import { wiToast } from './wi-toast';
import type { WiToastPosition, WiToastTheme } from './wi-toast.types';
import { WiToastComponent } from './wi-toast.component';

interface StoryArgs {
  position: WiToastPosition;
  richColors: boolean;
  closeButton: boolean;
  duration: number;
  theme: WiToastTheme;
  invert: boolean;
  expand: boolean;
  visibleToasts: number;
  offset: string | number | null;
  hotKey: string[];
  actionClick: ReturnType<typeof fn>;
}

const hideFromDocs = { table: { disable: true }, control: false } as const;

/** Internos de `WiToastComponent` que autodocs extrae como Properties / Methods. */
const hiddenToastInternals: Record<string, typeof hideFromDocs> = {
  destroyRef: hideFromDocs,
  document: hideFromDocs,
  documentTheme: hideFromDocs,
  overlay: hideFromDocs,
  overlayRef: hideFromDocs,
  overlaysI18n: hideFromDocs,
  platformId: hideFromDocs,
  portalTpl: hideFromDocs,
  resolvedTheme: hideFromDocs,
  toastOptions: hideFromDocs,
  tokenStyle: hideFromDocs,
  viewContainerRef: hideFromDocs,
  applyChromeI18n: hideFromDocs,
  attachOverlay: hideFromDocs,
  syncDocumentTheme: hideFromDocs,
};

const USAGE_SOURCE = `import { inject } from '@angular/core';
import { WiToast, WiToastComponent, wiToast } from '@wldeveloperapps/ui/overlays';

// <router-outlet />
// <wi-toast />

wiToast.success('Guardado', { description: 'El registro se actualizó' });
inject(WiToast).error('Error', { important: true });
`;

function localeFromGlobals(globals: { locale?: string } | undefined): StorybookLocale {
  return globals?.locale === 'en' ? 'en' : 'es';
}

function toastCopy(globals: { locale?: string } | undefined): ToastDemoCopy {
  return getToastDemoCopy(localeFromGlobals(globals));
}

/**
 * Canvas: monta `wi-toast` + demo.
 * Docs: aviso (el card de autodocs no puede anclar overlays al viewport).
 * Copy de demo: toolbar Locale (ES/EN) vía `getToastDemoCopy` — no hardcodear idioma.
 */
const toastDecorator = (
  storyFn: () => { template?: string; props?: Record<string, unknown> },
  context: { viewMode?: string; globals?: { locale?: string } },
) => {
  const copy = toastCopy(context.globals);

  if (context.viewMode === 'docs') {
    return {
      props: { docsNotice: copy.docsNotice },
      template: `
        <div
          class="mx-auto max-w-xl rounded-control-lg border border-outline-variant bg-surface p-4 text-on-surface"
          data-slot="toast-docs-notice"
        >
          <p class="text-sm leading-relaxed text-on-surface-variant">{{ docsNotice }}</p>
        </div>
      `,
    };
  }

  const story = storyFn();
  return {
    ...story,
    props: story.props,
    template: `
      <wi-toast
        [position]="position"
        [theme]="theme"
        [richColors]="richColors"
        [closeButton]="closeButton"
        [duration]="duration"
        [invert]="invert"
        [expand]="expand"
        [visibleToasts]="visibleToasts"
        [offset]="offset"
        [hotKey]="hotKey"
      />
      ${story.template ?? ''}
    `,
  };
};

const meta: Meta<StoryArgs> = {
  title: 'Overlays/WiToast',
  component: WiToastComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: {
      include: [
        'position',
        'theme',
        'duration',
        'closeButton',
        'richColors',
        'expand',
        'visibleToasts',
        'offset',
        'invert',
        'hotKey',
      ],
    },
    docs: {
      source: {
        type: 'code',
        language: 'ts',
        code: USAGE_SOURCE,
      },
      description: {
        component: `
Notificaciones globales. Monta \`<wi-toast />\` **una vez** en el root y dispara cada toast por código.

## \`<wi-toast />\`

Importar estilos: \`@wldeveloperapps/ui/styles/toast.css\` (o \`styles/index.css\`).

\`\`\`html
<router-outlet />
<wi-toast />
\`\`\`

La tabla es la API de \`<wi-toast />\`: solo inputs. El componente no tiene outputs ni métodos públicos.

## \`wiToast\` / \`inject(WiToast)\`

Misma API; el servicio encaja mejor en DI y tests.

\`\`\`ts
import { inject } from '@angular/core';
import { WiToast, wiToast } from '@wldeveloperapps/ui/overlays';

wiToast.success('Guardado', { description: 'El registro se actualizó' });
inject(WiToast).error('Error', { important: true });
\`\`\`

Métodos: \`show\` / \`message\`, \`success\`, \`info\`, \`warning\`, \`error\`, \`loading\`, \`promise\`, \`dismiss\`.
Opciones por toast (\`WiToastOptions\`): \`description\`, \`duration\`, \`action\`, \`cancel\`, \`important\`, \`position\`, …

## i18n

- Texto de cada toast: la app (i18n de producto).
- Aria del botón cerrar y de la región: \`provideWiOverlaysI18n\` (\`toastCloseLabel\`, \`toastRegionLabel\`).
- Tema \`auto\`: sigue \`.wi-dark\` en \`<html>\`.

Las demos interactivas están en **Canvas** (el preview de Docs no ancla el overlay al viewport).
        `,
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [WiToastComponent, WiButtonDirective],
    }),
    toastDecorator,
  ],
  argTypes: {
    position: {
      control: 'select',
      options: [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ] satisfies WiToastPosition[],
      description: 'Esquina del viewport. Default `top-right`.',
    },
    theme: {
      control: 'select',
      options: ['auto', 'light', 'dark', 'system'] satisfies WiToastTheme[],
      description: '`auto` (recomendado) sigue `.wi-dark` en `<html>`.',
    },
    richColors: {
      control: 'boolean',
      description: 'Colores semánticos en success / error / warning / info.',
    },
    closeButton: {
      control: 'boolean',
      description: 'Botón cerrar en todos los toasts.',
    },
    duration: {
      control: 'number',
      description: 'Duración por defecto (ms). Cada toast puede sustituirla.',
    },
    invert: {
      control: 'boolean',
      description: 'Invierte el contraste del toast respecto al tema.',
    },
    expand: {
      control: 'boolean',
      description: 'Apila toasts uno debajo de otro (`false` = stack colapsado).',
    },
    visibleToasts: {
      control: 'number',
      description: 'Máximo de toasts visibles a la vez (el resto queda en cola).',
    },
    offset: {
      control: false,
      description: 'Offset desde el borde del viewport.',
    },
    hotKey: {
      control: false,
      description: 'Atajo para enfocar el área de notificaciones. Default Alt+T.',
    },
    actionClick: hideFromDocs,
    ...hiddenToastInternals,
  },
  args: {
    position: 'top-right',
    theme: 'auto',
    richColors: false,
    closeButton: true,
    duration: 4000,
    invert: false,
    expand: true,
    visibleToasts: 5,
    offset: null,
    hotKey: ['altKey', 'KeyT'],
    actionClick: fn(),
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

const canvasShell = (inner: string) => `
  <div class="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background p-6 text-on-surface">
    ${inner}
  </div>
`;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Monta `<wi-toast />` y dispara un toast con `wiToast(...)` o `inject(WiToast)`.',
      },
    },
  },
  render: (args, { globals }) => {
    const copy = toastCopy(globals);
    return {
      props: {
        ...args,
        showButton: copy.showButton,
        show: () => wiToast(copy.eventCreated, { duration: args.duration }),
      },
      template: canvasShell(`
        <button wiButton type="button" (click)="show()">{{ showButton }}</button>
      `),
    };
  },
};

export const Variants: Story = {
  tags: ['!autodocs'],
  args: { richColors: true },
  render: (args, { globals }) => {
    const copy = toastCopy(globals);
    return {
      props: {
        ...args,
        ...copy,
        showDefault: () => wiToast(copy.defaultMessage),
        showSuccess: () => wiToast.success(copy.success),
        showInfo: () => wiToast.info(copy.info),
        showWarning: () => wiToast.warning(copy.warning),
        showError: () => wiToast.error(copy.error, { important: true }),
        showLoading: () => {
          const id = wiToast.loading(copy.loading, { duration: Number.POSITIVE_INFINITY });
          setTimeout(() => wiToast.success(copy.loadingDone, { id }), 1500);
        },
      },
      template: canvasShell(`
        <div class="flex flex-wrap justify-center gap-2">
          <button wiButton type="button" variant="secondary" (click)="showDefault()">Default</button>
          <button wiButton type="button" (click)="showSuccess()">Success</button>
          <button wiButton type="button" variant="secondary" (click)="showInfo()">Info</button>
          <button wiButton type="button" variant="secondary" (click)="showWarning()">Warning</button>
          <button wiButton type="button" variant="danger" (click)="showError()">Error</button>
          <button wiButton type="button" variant="outline" (click)="showLoading()">{{ loadingButton }}</button>
        </div>
      `),
    };
  },
};

export const WithDescriptionAndAction: Story = {
  name: 'With description / action',
  tags: ['!autodocs'],
  argTypes: {
    actionClick: {
      action: 'actionClick',
      description: 'Demo: clic en la acción del toast (no es un output de `wi-toast`).',
      table: { category: 'Events' },
      control: false,
    },
  },
  render: (args, { globals }) => {
    const copy = toastCopy(globals);
    return {
      props: {
        ...args,
        withActionButton: copy.withActionButton,
        show: () =>
          wiToast.success(copy.changesSaved, {
            description: copy.changesDescription,
            action: {
              label: copy.undo,
              onClick: (event) => {
                event.preventDefault();
                args.actionClick(event);
                wiToast(copy.undone);
              },
            },
            cancel: { label: copy.close },
          }),
      },
      template: canvasShell(`
        <button wiButton type="button" (click)="show()">{{ withActionButton }}</button>
      `),
    };
  },
};

export const Positions: Story = {
  tags: ['!autodocs'],
  render: (args, { globals }) => {
    const copy = toastCopy(globals);
    return {
      props: {
        ...args,
        show: (position: WiToastPosition) =>
          wiToast(`${copy.positionPrefix}: ${position}`, { position, duration: 2500 }),
      },
      template: canvasShell(`
        <div class="grid max-w-md grid-cols-2 gap-2 sm:grid-cols-3">
          <button wiButton type="button" size="sm" variant="secondary" (click)="show('top-left')">Top left</button>
          <button wiButton type="button" size="sm" variant="secondary" (click)="show('top-center')">Top center</button>
          <button wiButton type="button" size="sm" variant="secondary" (click)="show('top-right')">Top right</button>
          <button wiButton type="button" size="sm" variant="secondary" (click)="show('bottom-left')">Bottom left</button>
          <button wiButton type="button" size="sm" variant="secondary" (click)="show('bottom-center')">Bottom center</button>
          <button wiButton type="button" size="sm" variant="secondary" (click)="show('bottom-right')">Bottom right</button>
        </div>
      `),
    };
  },
};

export const Stacked: Story = {
  name: 'Stacked (varios a la vez)',
  tags: ['!autodocs'],
  render: (args, { globals }) => {
    const copy = toastCopy(globals);
    return {
      props: {
        ...args,
        stackedButton: copy.stackedButton,
        showMany: () => {
          wiToast.success(copy.first);
          wiToast.info(copy.second);
          wiToast.warning(copy.third);
          wiToast.error(copy.fourth);
        },
      },
      template: canvasShell(`
        <button wiButton type="button" (click)="showMany()">{{ stackedButton }}</button>
      `),
    };
  },
};

export const PromiseToast: Story = {
  name: 'Promise',
  tags: ['!autodocs'],
  render: (args, { globals }) => {
    const copy = toastCopy(globals);
    return {
      props: {
        ...args,
        promiseButton: copy.promiseButton,
        run: () => {
          wiToast.promise(
            () => new Promise<string>((resolve) => setTimeout(() => resolve('ok'), 1200)),
            {
              loading: copy.promiseLoading,
              success: copy.promiseSuccess,
              error: copy.promiseError,
            },
          );
        },
      },
      template: canvasShell(`
        <button wiButton type="button" (click)="run()">{{ promiseButton }}</button>
      `),
    };
  },
};

/** Solo Canvas: fija toolbar Light. */
export const LightMode: Story = {
  name: 'Light mode',
  tags: ['!autodocs'],
  globals: { theme: 'light' },
  args: { theme: 'auto', richColors: true },
  render: (args, { globals }) => {
    const copy = toastCopy(globals);
    return {
      props: {
        ...args,
        lightButton: copy.lightButton,
        show: () =>
          wiToast.success(copy.lightTitle, {
            description: copy.lightDescription,
          }),
      },
      template: canvasShell(`
        <button wiButton type="button" (click)="show()">{{ lightButton }}</button>
      `),
    };
  },
};

/** Solo Canvas: fija toolbar Dark. */
export const DarkMode: Story = {
  name: 'Dark mode',
  tags: ['!autodocs'],
  globals: { theme: 'dark' },
  args: { theme: 'auto', richColors: true },
  render: (args, { globals }) => {
    const copy = toastCopy(globals);
    return {
      props: {
        ...args,
        darkButton: copy.darkButton,
        show: () =>
          wiToast.success(copy.darkTitle, {
            description: copy.darkDescription,
          }),
      },
      template: canvasShell(`
        <button wiButton type="button" (click)="show()">{{ darkButton }}</button>
      `),
    };
  },
};
