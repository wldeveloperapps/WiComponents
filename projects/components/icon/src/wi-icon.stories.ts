import type { Meta, StoryObj } from '@storybook/angular-vite';
import { applicationConfig, moduleMetadata } from '@storybook/angular-vite';

import { provideWiIcons, WiIconComponent, type WiIconGlyph } from './public-api';
import { WI_HEROICONS_CURATED } from '../heroicons/src/curated';
import { homeOutline } from '../heroicons/src/home';

/**
 * Ejemplo de icono custom de app (derivado de workericon.svg).
 * Vive en Storybook como demo; en producción iría en la app consumidora.
 */
const workerIcon: WiIconGlyph = {
  viewBox: '0 0 32 32',
  nodes: [
    {
      tag: 'path',
      attrs: {
        d: 'M29.7,23.3L28,21.6V20c0-3.3-1.3-6.2-3.5-8.5L23,18.2c-0.1,0.5-0.5,0.8-1,0.8c-0.1,0-0.1,0-0.2,0c-0.5-0.1-0.9-0.7-0.8-1.2l2-8.9c0-0.3-0.2-0.7-0.5-0.8c-4-2-8.9-2-12.9,0C9.2,8.3,9,8.6,9,8.9l2,8.9c0.1,0.5-0.2,1.1-0.8,1.2c-0.1,0-0.1,0-0.2,0c-0.5,0-0.9-0.3-1-0.8l-1.5-6.7C5.3,13.8,4,16.7,4,20v1.6l-1.7,1.7C2,23.6,1.9,24,2.1,24.4C2.2,24.8,2.6,25,3,25h26c0.4,0,0.8-0.2,0.9-0.6C30.1,24,30,23.6,29.7,23.3z',
      },
    },
  ],
};

const meta: Meta<WiIconComponent> = {
  title: 'Icon/WiIcon',
  component: WiIconComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### Cómo usarlo en la app

1. **Registrar** glifos con \`provideWiIcons\` en \`app.config\` (o providers del feature).
2. **Renderizar** \`<wi-icon name="…">\` — el \`name\` debe coincidir con la clave registrada.
3. Oficiales: importa de \`@wldeveloperapps/ui/icon/heroicons\` **solo** los que uses.
4. Custom: define un \`WiIconGlyph\` en la app y regístralo igual (ver story **Custom Icon**).
5. Catálogo completo: story **Catalog** ({{COUNT}} nombres oficiales).

\`\`\`ts
import { provideWiIcons, WiIconComponent } from '@wldeveloperapps/ui/icon';
import { trashOutline, trashSolid } from '@wldeveloperapps/ui/icon/heroicons';

provideWiIcons({
  trash: { outline: trashOutline, solid: trashSolid },
});
\`\`\`

\`\`\`html
<wi-icon name="trash" />
<wi-icon name="trash" variant="solid" class="text-error" />
\`\`\`

**No** uses \`WI_HEROICONS_CURATED\` en apps (es para Storybook). **No** importes el paquete npm \`heroicons\`.
Color: \`currentColor\` / clases en el host. A11y: sin \`label\` → decorativo; con \`label\` → nombre accesible; botón solo-icono → \`aria-label\` en el botón.
        `.replace('{{COUNT}}', String(Object.keys(WI_HEROICONS_CURATED).length)),
      },
    },
    controls: {
      include: ['name', 'variant', 'size', 'label'],
    },
  },
  decorators: [
    applicationConfig({
      providers: [
        provideWiIcons(WI_HEROICONS_CURATED),
        provideWiIcons({
          worker: { solid: workerIcon },
        }),
      ],
    }),
    moduleMetadata({
      imports: [WiIconComponent],
    }),
  ],
  argTypes: {
    name: {
      control: 'text',
      description: 'Clave registrada con provideWiIcons (oficial o custom)',
    },
    variant: {
      control: 'select',
      options: ['outline', 'solid'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    label: {
      control: 'text',
      description: 'null → decorativo; con texto → role=img + aria-label',
    },
  },
  args: {
    name: 'home',
    variant: 'outline',
    size: 'lg',
    label: '',
  },
};

export default meta;
type Story = StoryObj<WiIconComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display:flex;align-items:center;gap:12px;font:16px/1.4 system-ui;color:#111;">
        <wi-icon [name]="name" [variant]="variant" [size]="size" [label]="label" />
        <span>{{ name }} ({{ variant }})</span>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;align-items:flex-end;gap:1.5rem;color:#111;">
        <div style="text-align:center;font:12px system-ui;">
          <wi-icon name="home" size="xs" /><div>xs</div>
        </div>
        <div style="text-align:center;font:12px system-ui;">
          <wi-icon name="home" size="sm" /><div>sm</div>
        </div>
        <div style="text-align:center;font:12px system-ui;">
          <wi-icon name="home" size="md" /><div>md</div>
        </div>
        <div style="text-align:center;font:12px system-ui;">
          <wi-icon name="home" size="lg" /><div>lg</div>
        </div>
        <div style="text-align:center;font:12px system-ui;">
          <wi-icon name="home" size="xl" /><div>xl</div>
        </div>
      </div>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;align-items:center;gap:2rem;font:16px/1.4 system-ui;color:#111;">
        <div style="display:flex;align-items:center;gap:12px;">
          <wi-icon name="trash" variant="outline" size="xl" />
          <span>outline</span>
        </div>
        <div style="display:flex;align-items:center;gap:12px;">
          <wi-icon name="trash" variant="solid" size="xl" />
          <span>solid</span>
        </div>
      </div>
    `,
  }),
};

export const Colors: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:1rem;color:#111;">
        <wi-icon name="trash" style="color:#dc2626" size="lg" />
        <wi-icon name="check" style="color:#16a34a" size="lg" />
        <wi-icon name="information-circle" style="color:#2563eb" size="lg" />
      </div>
    `,
  }),
};

export const AccessibleLabel: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Con `label`: el SVG expone `role="img"` + `aria-label` (icono con significado propio).',
      },
    },
  },
  args: {
    name: 'exclamation-triangle',
    label: 'Advertencia',
    variant: 'solid',
    size: 'lg',
  },
};

export const InsideButton: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Sin `label`: el icono es decorativo (`aria-hidden`). El significado lo aporta el texto del botón.',
      },
    },
  },
  render: () => ({
    template: `
      <button type="button" style="display:inline-flex;align-items:center;gap:0.5rem;">
        <wi-icon name="plus" />
        Crear usuario
      </button>
    `,
  }),
};

export const IconOnlyButton: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Botón solo-icono: el nombre accesible va en el **botón** (`aria-label`). El `wi-icon` sigue sin `label` (decorativo).',
      },
    },
  },
  render: () => ({
    template: `
      <button type="button" aria-label="Eliminar usuario" style="display:inline-flex;padding:0.5rem;">
        <wi-icon name="trash" />
      </button>
    `,
  }),
};

export const CustomIcon: Story = {
  parameters: {
    docs: {
      description: {
        story: `
Icono **custom de la app** (no viene de Heroicons). En la app consumidora:

\`\`\`ts
import { provideWiIcons, type WiIconGlyph } from '@wldeveloperapps/ui/icon';

const worker: WiIconGlyph = {
  viewBox: '0 0 32 32',
  nodes: [{ tag: 'path', attrs: { d: '…' } }],
};

provideWiIcons({
  worker: { solid: worker },
});
\`\`\`

\`\`\`html
<wi-icon name="worker" variant="solid" label="Trabajador" />
\`\`\`

Misma API que los oficiales. Tags permitidos: path, circle, rect, line, polyline, polygon, g.
        `,
      },
    },
  },
  args: {
    name: 'worker',
    variant: 'solid',
    size: 'xl',
    label: 'Trabajador',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="display:flex;flex-direction:column;align-items:center;gap:12px;font:14px/1.4 system-ui;color:#111;max-width:28rem;text-align:center;">
        <wi-icon [name]="name" [variant]="variant" [size]="size" [label]="label" />
        <span>
          Custom de app: <code>worker</code> — registrado con
          <code>provideWiIcons</code> en la app, no en el paquete heroicons.
        </span>
      </div>
    `,
  }),
};

export const MissingIcon: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Nombre no registrado: no renderiza nada (warning en desarrollo).',
      },
    },
  },
  args: {
    name: 'not-registered',
  },
};

export const MissingVariant: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Si pides `solid` y solo hay `outline`, hace fallback a la otra variante (warning en desarrollo).',
      },
    },
  },
  decorators: [
    applicationConfig({
      providers: [
        provideWiIcons({
          'outline-only': { outline: homeOutline },
        }),
      ],
    }),
  ],
  args: {
    name: 'outline-only',
    variant: 'solid',
  },
};

const catalogNames = Object.keys(WI_HEROICONS_CURATED).sort((a, b) => a.localeCompare(b));

/** Rejilla del catálogo oficial generado (outline + solid). */
export const Catalog: Story = {
  parameters: {
    layout: 'padded',
    controls: { disable: true },
    docs: {
      description: {
        story: `
Lista **completa** del catálogo oficial (\`@wldeveloperapps/ui/icon/heroicons\`).
Cada celda muestra outline | solid y el \`name\` a registrar.

En la app **no** registres todo el set: importa el glifo concreto y pásalo a \`provideWiIcons\`.

\`\`\`ts
import { eyeOutline, eyeSlashOutline } from '@wldeveloperapps/ui/icon/heroicons';

provideWiIcons({
  eye: { outline: eyeOutline },
  'eye-slash': { outline: eyeSlashOutline },
});
\`\`\`
        `,
      },
    },
  },
  render: () => ({
    props: { names: catalogNames },
    template: `
      <div style="font:14px/1.4 system-ui;color:#111;">
        <p style="margin:0 0 0.5rem;">
          Catálogo oficial: <strong>{{ names.length }}</strong> iconos (outline | solid).
        </p>
        <p style="margin:0 0 1rem;color:#4b5563;">
          Copia el <code>name</code> de la celda → importa
          <code>…Outline</code> / <code>…Solid</code> desde
          <code>@wldeveloperapps/ui/icon/heroicons</code> →
          <code>provideWiIcons</code> con esa clave.
          Custom de app: ver story <strong>Custom Icon</strong>.
        </p>
        <div
          style="
            display:grid;
            grid-template-columns:repeat(auto-fill,minmax(140px,1fr));
            gap:12px;
          "
        >
          @for (name of names; track name) {
            <div
              style="
                display:flex;
                flex-direction:column;
                align-items:center;
                gap:8px;
                padding:12px;
                border:1px solid #e5e7eb;
                border-radius:8px;
              "
            >
              <div style="display:flex;gap:12px;align-items:center;">
                <wi-icon [name]="name" variant="outline" size="lg" />
                <wi-icon [name]="name" variant="solid" size="lg" />
              </div>
              <code style="font-size:11px;word-break:break-all;text-align:center;">
                {{ name }}
              </code>
            </div>
          }
        </div>
      </div>
    `,
  }),
};
