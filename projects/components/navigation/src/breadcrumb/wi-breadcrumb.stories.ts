import type { Meta, StoryObj } from '@storybook/angular-vite';
import { applicationConfig, moduleMetadata } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { provideWiIcons } from '@wiloc/ui/icon';
import { homeOutline } from '@wiloc/ui/icon/heroicons';

import {
  getBreadcrumbDemoCopy,
  type BreadcrumbDemoCopy,
  type StorybookLocale,
} from '../../../.storybook/locale';
import { WiBreadcrumbComponent } from '../public-api';
import type { WiBreadcrumbItem } from './wi-breadcrumb.types';

interface WiBreadcrumbStoryArgs {
  itemClick: ReturnType<typeof fn>;
}

function localeFromGlobals(globals: { locale?: string } | undefined): StorybookLocale {
  return globals?.locale === 'en' ? 'en' : 'es';
}

function breadcrumbCopy(globals: { locale?: string } | undefined): BreadcrumbDemoCopy {
  return getBreadcrumbDemoCopy(localeFromGlobals(globals));
}

function trailItems(copy: BreadcrumbDemoCopy): readonly WiBreadcrumbItem[] {
  return [
    { id: 'home', label: copy.home, href: '/', icon: 'home', iconOnly: true },
    { id: 'admin', label: copy.section, href: '/administration' },
    { id: 'users', label: copy.current },
  ];
}

const meta: Meta<WiBreadcrumbStoryArgs> = {
  title: 'Navigation/WiBreadcrumb',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Migas de pan. **Textos, rutas e iconos los pasa la app** en \`items: { id, label, href?, icon?, iconOnly? }[]\`.
El último ítem es la página actual (pastilla \`bg-primary\`, \`aria-current="page"\`).
La lista es una cápsula con \`border-outline\` + \`bg-surface-container\`.

- \`href\` en ancestros: enlace. Clic izquierdo sin modificadores emite \`itemClick\` (SPA / Router en la app).
- \`iconOnly\`: icono visible y \`label\` como nombre accesible (home).
- En viewport estrecho (~320px) la lista hace wrap (\`flex-wrap\`, \`min-w-0\`).

Events: \`itemClick\`. Labels de demo vía toolbar **Locale** (ES/EN).
        `,
      },
    },
  },
  decorators: [
    applicationConfig({
      providers: [
        provideWiIcons({
          home: { outline: homeOutline },
        }),
      ],
    }),
    moduleMetadata({
      imports: [WiBreadcrumbComponent],
    }),
  ],
  argTypes: {
    itemClick: {
      action: 'itemClick',
      description: 'Clic en un ancestro con href (la app navega con el Router)',
      table: { category: 'Events' },
      control: false,
    },
  },
  args: {
    itemClick: fn(),
  },
};

export default meta;
type Story = StoryObj<WiBreadcrumbStoryArgs>;

function demoProps(args: WiBreadcrumbStoryArgs, globals: { locale?: string } | undefined) {
  const copy = breadcrumbCopy(globals);
  return {
    ...args,
    items: trailItems(copy),
    ariaLabel: copy.ariaLabel,
  };
}

export const Default: Story = {
  render: (args, { globals }) => ({
    props: demoProps(args, globals),
    template: `
      <wi-breadcrumb
        [items]="items"
        [aria-label]="ariaLabel"
        (itemClick)="itemClick($event)"
      />
    `,
  }),
};

export const TextOnly: Story = {
  name: 'Sin icono de inicio',
  parameters: {
    docs: {
      description: {
        story: 'Todos los segmentos con label visible. El icono es opcional; lo aporta la app.',
      },
    },
  },
  render: (args, { globals }) => {
    const copy = breadcrumbCopy(globals);
    return {
      props: {
        ...args,
        items: [
          { id: 'home', label: copy.home, href: '/' },
          { id: 'admin', label: copy.section, href: '/administration' },
          { id: 'users', label: copy.current },
        ] satisfies WiBreadcrumbItem[],
        ariaLabel: copy.ariaLabel,
      },
      template: `
        <wi-breadcrumb
          [items]="items"
          [aria-label]="ariaLabel"
          (itemClick)="itemClick($event)"
        />
      `,
    };
  },
};

export const LongLabels: Story = {
  name: 'Etiquetas largas',
  parameters: {
    docs: {
      description: {
        story:
          'Labels largos truncan (`truncate` + `title`). A ~320px la lista refluja con `flex-wrap`.',
      },
    },
  },
  render: (args, { globals }) => {
    const copy = breadcrumbCopy(globals);
    return {
      props: {
        ...args,
        items: [
          { id: 'home', label: copy.home, href: '/', icon: 'home', iconOnly: true },
          { id: 'admin', label: copy.section, href: '/administration' },
          { id: 'long', label: copy.longCurrent },
        ] satisfies WiBreadcrumbItem[],
        ariaLabel: copy.ariaLabel,
      },
      template: `
        <div class="w-full min-w-0 max-w-xs">
          <wi-breadcrumb
            [items]="items"
            [aria-label]="ariaLabel"
            (itemClick)="itemClick($event)"
          />
        </div>
      `,
    };
  },
};

export const ManyItems: Story = {
  name: 'Varios niveles',
  parameters: {
    docs: {
      description: {
        story: 'Cuatro niveles: wrap en contenedor estrecho. El último sigue siendo la pastilla.',
      },
    },
  },
  render: (args, { globals }) => {
    const copy = breadcrumbCopy(globals);
    return {
      props: {
        ...args,
        items: [
          { id: 'home', label: copy.home, href: '/', icon: 'home', iconOnly: true },
          { id: 'admin', label: copy.section, href: '/administration' },
          { id: 'users', label: copy.current, href: '/administration/users' },
          { id: 'detail', label: copy.extra },
        ] satisfies WiBreadcrumbItem[],
        ariaLabel: copy.ariaLabel,
      },
      template: `
        <div class="w-full min-w-0 max-w-[20rem]">
          <wi-breadcrumb
            [items]="items"
            [aria-label]="ariaLabel"
            (itemClick)="itemClick($event)"
          />
        </div>
      `,
    };
  },
};

export const DarkMode: Story = {
  name: 'Dark mode',
  parameters: {
    docs: {
      description: {
        story:
          'Cápsula `border-outline` + `bg-surface-container`; pastilla `bg-primary` / `text-on-primary` vía tokens en `.wi-dark`.',
      },
    },
  },
  render: (args, { globals }) => ({
    props: demoProps(args, globals),
    template: `
      <div class="wi-dark w-full min-w-0 rounded-control bg-background p-4 text-on-background sm:p-6">
        <wi-breadcrumb
          [items]="items"
          [aria-label]="ariaLabel"
          (itemClick)="itemClick($event)"
        />
      </div>
    `,
  }),
};
