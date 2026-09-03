import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { WiButtonDirective } from '@wiloc/ui/button';

import {
  getToastDemoCopy,
  type StorybookLocale,
  type ToastDemoCopy,
} from '../../../.storybook/locale';
import { wiToast } from './wi-toast';
import type { WiToastPosition, WiToastTheme } from './wi-toast.types';
import { WiToasterComponent } from './wi-toaster.component';

interface StoryArgs {
  position: WiToastPosition;
  richColors: boolean;
  closeButton: boolean;
  duration: number;
  theme: WiToastTheme;
  actionClick: ReturnType<typeof fn>;
}

function localeFromGlobals(globals: { locale?: string } | undefined): StorybookLocale {
  return globals?.locale === 'en' ? 'en' : 'es';
}

function toastCopy(globals: { locale?: string } | undefined): ToastDemoCopy {
  return getToastDemoCopy(localeFromGlobals(globals));
}

/**
 * Canvas: monta `wi-toaster` + demo.
 * Docs: aviso (el card de autodocs no puede anclar overlays al viewport).
 * Copy de demo: toolbar Locale (ES/EN) vía `getToastDemoCopy` — no hardcodear idioma.
 */
const toasterDecorator = (
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
      <wi-toaster
        [position]="position"
        [theme]="theme"
        [richColors]="richColors"
        [closeButton]="closeButton"
        [duration]="duration"
      />
      ${story.template ?? ''}
    `,
  };
};

const meta: Meta<StoryArgs> = {
  title: 'Overlays/WiToast',
  component: WiToasterComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Notificaciones toast (API propia \`WiToast*\`).

- Montar \`<wi-toaster />\` **una vez** en el root de la app.
- Viewport vía CDK Overlay en \`document.body\` → esquina del **viewport** (\`top-right\` por defecto).
- Tema \`auto\`: sigue \`.wi-dark\` en \`<html>\` (toolbar **Tema**).
- Chrome a11y: \`provideWiOverlaysI18n\` (\`toastCloseLabel\`, \`toastRegionLabel\`).
- Copy de producto: la app (toolbar **Locale** en Storybook simula ES/EN).
- **Demos interactivas solo en Canvas**.
- Disparar: \`wiToast\` / \`inject(WiToast)\`.
        `,
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [WiToasterComponent, WiButtonDirective],
    }),
    toasterDecorator,
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
    },
    theme: {
      control: 'select',
      options: ['auto', 'light', 'dark', 'system'] satisfies WiToastTheme[],
      description: '`auto` sigue toolbar Tema (`.wi-dark`).',
    },
    richColors: { control: 'boolean' },
    closeButton: { control: 'boolean' },
    duration: { control: 'number' },
    actionClick: {
      action: 'actionClick',
      table: { category: 'Events' },
      control: false,
    },
  },
  args: {
    position: 'top-right',
    theme: 'auto',
    richColors: false,
    closeButton: true,
    duration: 4000,
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
