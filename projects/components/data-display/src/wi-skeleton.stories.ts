import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';

import {
  WiCardComponent,
  WiCardContentComponent,
  WiCardHeaderComponent,
  WiSkeletonComponent,
} from './public-api';

const meta: Meta<WiSkeletonComponent> = {
  title: 'Data display/WiSkeleton',
  component: WiSkeletonComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Placeholder de carga mientras llega el contenido.

- API: \`shape\` (\`rectangle\` | \`circle\`), \`size\` / \`width\` / \`height\` (CSS length), \`animated\`.
- Tokens: \`bg-surface-variant\` + pulse con \`motion-safe:\` (respeta reduced-motion).
- A11y: \`aria-hidden="true"\`; en layouts de carga, poner \`aria-busy\` en el contenedor padre.
- Story **Recipe\\*** = composición de layout, no inputs nuevos.

### Dimensiones (\`size\` / \`width\` / \`height\`)

Prioridad: **\`size\` gana siempre** sobre \`width\` y \`height\`. Si defines \`size\`, los otros dos se ignoran.

| Situación | Ancho | Alto |
| --- | --- | --- |
| Solo defaults (\`rectangle\`) | \`100%\` | \`1rem\` |
| Solo \`width\` / \`height\` | el valor indicado | el valor indicado |
| \`size\` definido | \`size\` | \`size\` |
| \`circle\` sin dimensiones | \`2.5rem\` | \`2.5rem\` |
| \`circle\` + solo \`width\` o solo \`height\` | ese valor en ambos ejes | ese valor en ambos ejes |

**Cuándo usar cada uno**

- \`size\` → cuadrado o círculo (avatar, icono).
- \`width\` + \`height\` → rectángulo libre (línea de texto, bloque).
- No combines \`size\` con \`width\`/\`height\` en la misma instancia: si pones \`size\`, los otros no tienen efecto.
- En Docs, para probar \`width\`/\`height\`, deja el control \`size\` vacío.
        `,
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        WiCardComponent,
        WiCardContentComponent,
        WiCardHeaderComponent,
        WiSkeletonComponent,
      ],
    }),
  ],
  argTypes: {
    shape: {
      control: 'select',
      options: ['rectangle', 'circle'],
      description: 'Forma del placeholder: `rectangle` | `circle`.',
    },
    size: {
      control: 'text',
      description:
        'Lado del cuadrado/círculo (CSS length). Si se define, fija width y height e ignora esos inputs.',
    },
    width: {
      control: 'text',
      description:
        'Ancho (CSS length). Solo aplica si `size` no está definido. Default rectangle: `100%`.',
    },
    height: {
      control: 'text',
      description:
        'Alto (CSS length). Solo aplica si `size` no está definido. Default rectangle: `1rem`.',
    },
    animated: {
      control: 'boolean',
      description: 'Animación pulse (`motion-safe:`; respeta reduced-motion).',
    },
  },
  args: {
    shape: 'rectangle',
    animated: true,
  },
};

export default meta;
type Story = StoryObj<WiSkeletonComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="w-64">
        <wi-skeleton
          [shape]="shape"
          [size]="size"
          [width]="width"
          [height]="height"
          [animated]="animated"
        />
      </div>
    `,
  }),
};

export const Shapes: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap items-end gap-6">
        <div class="flex w-40 flex-col gap-2">
          <span class="text-xs text-on-surface-variant">Rectangle</span>
          <wi-skeleton />
          <wi-skeleton width="8rem" />
          <wi-skeleton width="5rem" height="2rem" />
        </div>
        <div class="flex flex-col gap-2">
          <span class="text-xs text-on-surface-variant">Circle</span>
          <div class="flex items-center gap-3">
            <wi-skeleton shape="circle" size="2rem" />
            <wi-skeleton shape="circle" size="2.5rem" />
            <wi-skeleton shape="circle" size="3.5rem" />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <span class="text-xs text-on-surface-variant">Square</span>
          <div class="flex items-center gap-3">
            <wi-skeleton size="2rem" />
            <wi-skeleton size="2.5rem" />
            <wi-skeleton size="3.5rem" />
          </div>
        </div>
      </div>
    `,
  }),
};

export const WithoutAnimation: Story = {
  render: () => ({
    template: `
      <div class="flex w-64 flex-col gap-2">
        <wi-skeleton [animated]="false" />
        <wi-skeleton width="75%" [animated]="false" />
        <wi-skeleton width="50%" [animated]="false" />
      </div>
    `,
  }),
};

/** Lista tipo fila (app): avatar + líneas de texto. */
export const RecipeList: Story = {
  name: 'Recipe / List',
  parameters: {
    docs: {
      description: {
        story:
          'Composición de filas de lista con skeleton. El layout lo arma la app; `aria-busy` va en el contenedor.',
      },
    },
  },
  render: () => ({
    template: `
      <ul class="flex w-80 flex-col gap-4" aria-busy="true" aria-label="Cargando listado">
        @for (i of [1, 2, 3]; track i) {
          <li class="flex items-center gap-3">
            <wi-skeleton shape="circle" size="2.5rem" />
            <div class="flex min-w-0 flex-1 flex-col gap-2">
              <wi-skeleton width="70%" />
              <wi-skeleton width="45%" height="0.75rem" />
            </div>
          </li>
        }
      </ul>
    `,
  }),
};

/** Card de carga (app). */
export const RecipeCard: Story = {
  name: 'Recipe / Card',
  parameters: {
    docs: {
      description: {
        story: 'Card con placeholders mientras cargan título y cuerpo.',
      },
    },
  },
  render: () => ({
    template: `
      <wi-card class="w-80" aria-busy="true">
        <wi-card-header>
          <div class="flex flex-col gap-2">
            <wi-skeleton width="60%" height="1.25rem" />
            <wi-skeleton width="90%" height="0.75rem" />
          </div>
        </wi-card-header>
        <wi-card-content>
          <div class="flex flex-col gap-2">
            <wi-skeleton height="6rem" />
            <wi-skeleton />
            <wi-skeleton width="80%" />
          </div>
        </wi-card-content>
      </wi-card>
    `,
  }),
};

export const DarkMode: Story = {
  globals: {
    theme: 'dark',
  },
  render: () => ({
    template: `
      <div class="flex w-72 flex-col gap-3 rounded-control bg-background p-4">
        <wi-skeleton />
        <wi-skeleton width="80%" />
        <div class="flex items-center gap-3">
          <wi-skeleton shape="circle" size="2.5rem" />
          <div class="flex min-w-0 flex-1 flex-col gap-2">
            <wi-skeleton width="65%" />
            <wi-skeleton width="40%" height="0.75rem" />
          </div>
        </div>
      </div>
    `,
  }),
};
