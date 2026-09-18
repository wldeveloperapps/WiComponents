import { Directionality } from '@angular/cdk/bidi';
import { Component, inject, input } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { applicationConfig, moduleMetadata } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { WiButtonDirective } from '../../../button/src/public-api';
import type { WiConfirmDialogConfirmVariant, WiConfirmDialogSize } from './wi-confirm-dialog.types';
import {
  WiConfirmationService,
  WiConfirmDialogComponent,
  WiConfirmDialogTriggerDirective,
  provideWiOverlaysI18n,
} from '../public-api';

interface WiConfirmDialogStoryArgs {
  key: string;
  size: WiConfirmDialogSize;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  confirmVariant: WiConfirmDialogConfirmVariant;
  showCancel: boolean;
  loading: boolean;
  confirmed: ReturnType<typeof fn>;
  cancelled: ReturnType<typeof fn>;
  closed: ReturnType<typeof fn>;
  stateChanged: ReturnType<typeof fn>;
}

const hideFromDocs = { table: { disable: true }, control: false } as const;

const hiddenConfirmDialogInternals: Record<string, typeof hideFromDocs> = {
  brn: hideFromDocs,
  overlaysI18n: hideFromDocs,
  confirmation: hideFromDocs,
  resolvedTitle: hideFromDocs,
  resolvedDescription: hideFromDocs,
  resolvedConfirmLabel: hideFromDocs,
  resolvedConfirmVariant: hideFromDocs,
  resolvedShowCancel: hideFromDocs,
  chromeCancelLabel: hideFromDocs,
  contentClasses: hideFromDocs,
  overlayClasses: hideFromDocs,
  panelState: hideFromDocs,
  dialogId: hideFromDocs,
  open: hideFromDocs,
  close: hideFromDocs,
  onConfirm: hideFromDocs,
  onCancel: hideFromDocs,
};

const SERVICE_USAGE_SOURCE = `import { Component, inject } from '@angular/core';
import {
  WiConfirmationService,
  WiConfirmDialogComponent,
  WiConfirmPopupComponent,
} from '@wldeveloperapps/ui/overlays';
import { WiButtonDirective } from '@wldeveloperapps/ui/button';

@Component({
  selector: 'app-shell',
  imports: [WiConfirmDialogComponent, WiConfirmPopupComponent, WiButtonDirective],
  template: \`
    <!-- Hosts en el root (una vez). Sin key = caso típico. -->
    <wi-confirm-dialog />
    <wi-confirm-popup />

    <button wiButton type="button" variant="danger" (click)="deleteItem()">
      Eliminar (abre dialog)
    </button>
  \`,
})
export class AppShell {
  private readonly confirmation = inject(WiConfirmationService);

  // Sin target → WiConfirmationService abre el dialog
  deleteItem(): void {
    void this.confirmation.confirm({
      title: 'Eliminar sitio',
      description: 'Esta acción no se puede deshacer.',
      confirmLabel: 'Eliminar',
      confirmVariant: 'danger',
      accept: () => this.delete(),
      reject: () => {},
    });
  }

  private delete(): void {
    // lógica de la app
  }
}
`;

/**
 * Demo de Storybook = mismo patrón que la app (host + servicio).
 * `onAccept` / `onReject` solo alimentan el panel Actions; en la app van a tu lógica.
 */
@Component({
  selector: 'wi-confirm-dialog-via-service-demo',
  imports: [WiConfirmDialogComponent, WiButtonDirective],
  template: `
    <wi-confirm-dialog />

    <button wiButton type="button" variant="danger" (click)="deleteItem()">
      Eliminar sitio
    </button>
  `,
})
class ConfirmDialogViaServiceDemo {
  private readonly confirmation = inject(WiConfirmationService);

  readonly onAccept = input<() => void>(() => undefined);
  readonly onReject = input<() => void>(() => undefined);

  deleteItem(): void {
    void this.confirmation.confirm({
      title: 'Eliminar sitio',
      description: 'Esta acción no se puede deshacer.',
      confirmLabel: 'Eliminar',
      confirmVariant: 'danger',
      accept: this.onAccept(),
      reject: this.onReject(),
    });
  }
}

const SERVICE_KEY_USAGE_SOURCE = `import { Component, inject } from '@angular/core';
import {
  WiConfirmationService,
  WiConfirmDialogComponent,
} from '@wldeveloperapps/ui/overlays';
import { WiButtonDirective } from '@wldeveloperapps/ui/button';

@Component({
  selector: 'app-shell',
  imports: [WiConfirmDialogComponent, WiButtonDirective],
  template: \`
    <!-- Dos hosts: cada uno solo reacciona a su key -->
    <wi-confirm-dialog key="delete-site" />
    <wi-confirm-dialog key="delete-user" />

    <button wiButton type="button" variant="danger" (click)="deleteSite()">
      Eliminar sitio
    </button>
    <button wiButton type="button" variant="danger" (click)="deleteUser()">
      Eliminar usuario
    </button>
  \`,
})
export class AppShell {
  private readonly confirmation = inject(WiConfirmationService);

  deleteSite(): void {
    void this.confirmation.confirm({
      key: 'delete-site', // abre solo el host con key="delete-site"
      title: 'Eliminar sitio',
      description: 'Se perderán los datos del sitio.',
      confirmLabel: 'Eliminar',
      confirmVariant: 'danger',
      accept: () => this.deleteSiteEntity(),
    });
  }

  deleteUser(): void {
    void this.confirmation.confirm({
      key: 'delete-user', // abre solo el host con key="delete-user"
      title: 'Eliminar usuario',
      description: 'El usuario no podrá iniciar sesión.',
      confirmLabel: 'Eliminar',
      confirmVariant: 'danger',
      accept: () => this.deleteUserEntity(),
    });
  }

  private deleteSiteEntity(): void {}
  private deleteUserEntity(): void {}
}
`;

@Component({
  selector: 'wi-confirm-dialog-via-service-key-demo',
  imports: [WiConfirmDialogComponent, WiButtonDirective],
  template: `
    <div class="flex flex-col gap-4">
      <wi-confirm-dialog key="delete-site" />
      <wi-confirm-dialog key="delete-user" />

      <div class="flex flex-wrap gap-2">
        <button wiButton type="button" variant="danger" (click)="deleteSite()">
          Eliminar sitio
        </button>
        <button wiButton type="button" variant="danger" (click)="deleteUser()">
          Eliminar usuario
        </button>
      </div>
    </div>
  `,
})
class ConfirmDialogViaServiceKeyDemo {
  private readonly confirmation = inject(WiConfirmationService);

  readonly onAccept = input<() => void>(() => undefined);
  readonly onReject = input<() => void>(() => undefined);

  deleteSite(): void {
    void this.confirmation.confirm({
      key: 'delete-site',
      title: 'Eliminar sitio',
      description: 'Se perderán los datos del sitio.',
      confirmLabel: 'Eliminar',
      confirmVariant: 'danger',
      accept: this.onAccept(),
      reject: this.onReject(),
    });
  }

  deleteUser(): void {
    void this.confirmation.confirm({
      key: 'delete-user',
      title: 'Eliminar usuario',
      description: 'El usuario no podrá iniciar sesión.',
      confirmLabel: 'Eliminar',
      confirmVariant: 'danger',
      accept: this.onAccept(),
      reject: this.onReject(),
    });
  }
}

const confirmImports = [
  WiConfirmDialogComponent,
  WiConfirmDialogTriggerDirective,
  WiButtonDirective,
  ConfirmDialogViaServiceDemo,
  ConfirmDialogViaServiceKeyDemo,
];

const meta: Meta<WiConfirmDialogStoryArgs> = {
  title: 'Overlays/WiConfirmDialog',
  component: WiConfirmDialogComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: {
      include: [
        'key',
        'state',
        'size',
        'title',
        'description',
        'confirmLabel',
        'cancelLabel',
        'confirmVariant',
        'showCancel',
        'loading',
      ],
    },
    docs: {
      description: {
        component: `
Diálogo de confirmación compacto (\`wi-confirm-dialog\`).

## Modo declarativo (trigger)

- API: \`title\`, \`description?\`, \`confirmLabel\`, \`cancelLabel?\`, \`confirmVariant\` (\`primary\` | \`danger\`), \`size\` (\`sm\` | \`md\`), \`loading\`, \`showCancel\`, \`key?\`.
- Apertura: \`wiConfirmDialogTrigger\` o \`[(state)]\` / \`open()\`.
- Events: \`confirmed\`, \`cancelled\`, \`stateChanged\`, \`closed\`.

## Modo servicio (\`WiConfirmationService\`) — recomendado

Monta los hosts **una vez** en el root / layout:

\`\`\`html
<wi-confirm-dialog />
<wi-confirm-popup />
\`\`\`

Luego, en cualquier sitio de la app, solo usas el servicio. **Sin \`key\`, elige dialog vs popup según \`target\`:**

| \`confirm({...})\` | Qué abre |
| --- | --- |
| **Sin** \`target\` | \`wi-confirm-dialog\` |
| **Con** \`target\` (HTMLElement) | \`wi-confirm-popup\` (anclado a ese elemento) |

\`\`\`ts
// Dialog (modal centrado) — sin target
this.confirmation.confirm({
  title: 'Eliminar',
  confirmLabel: 'Eliminar',
  confirmVariant: 'danger',
  accept: () => this.delete(),
});

// Popup (anclado) — con target
this.confirmation.confirm({
  target: event.currentTarget as HTMLElement,
  title: 'Eliminar',
  confirmLabel: 'Eliminar',
  confirmVariant: 'danger',
  accept: () => this.delete(),
});
\`\`\`

\`key\` es **opcional**: solo si montas varios dialogs (o varios popups) y necesitas dirigir a uno concreto. Ver story ViaServiceKey.

- A11y: \`role=alertdialog\`; por defecto no cierra con Escape / backdrop (\`disableClose\`).
- Copy: textos desde la app (inputs o \`confirm()\`); chrome cancel vía \`provideWiOverlaysI18n({ confirmCancelLabel })\`.
- Responsive: footer apila en viewport estrecho. Comprobar ~320px.
        `,
      },
    },
  },
  decorators: [
    applicationConfig({
      providers: [
        Directionality,
        provideWiOverlaysI18n({
          confirmCancelLabel: () => 'Cancelar',
        }),
      ],
    }),
    moduleMetadata({
      imports: confirmImports,
    }),
  ],
  argTypes: {
    ...hiddenConfirmDialogInternals,
    key: {
      control: 'text',
      table: { category: 'Service' },
      description: 'Key para WiConfirmationService',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      table: { category: 'Dialog' },
    },
    title: {
      control: 'text',
      table: { category: 'Content' },
    },
    description: {
      control: 'text',
      table: { category: 'Content' },
    },
    confirmLabel: {
      control: 'text',
      table: { category: 'Content' },
    },
    cancelLabel: {
      control: 'text',
      table: { category: 'Content' },
    },
    confirmVariant: {
      control: 'select',
      options: ['primary', 'danger'],
      table: { category: 'Content' },
    },
    showCancel: {
      control: 'boolean',
      table: { category: 'Content' },
    },
    loading: {
      control: 'boolean',
      table: { category: 'Content' },
    },
    confirmed: {
      action: 'confirmed',
      description: 'Se emite al pulsar confirmar',
      table: { category: 'Events' },
      control: false,
    },
    cancelled: {
      action: 'cancelled',
      description: 'Se emite al pulsar cancelar',
      table: { category: 'Events' },
      control: false,
    },
    closed: {
      action: 'closed',
      description: "Se emite al cerrar ('confirmed' | 'cancelled')",
      table: { category: 'Events' },
      control: false,
    },
    stateChanged: {
      action: 'stateChanged',
      description: "Se emite cuando el estado pasa a 'open' o 'closed'",
      table: { category: 'Events' },
      control: false,
    },
  },
  args: {
    key: '',
    size: 'sm',
    title: 'Eliminar sitio',
    description: 'Esta acción no se puede deshacer. Se perderán los datos asociados.',
    confirmLabel: 'Eliminar',
    cancelLabel: 'Cancelar',
    confirmVariant: 'danger',
    showCancel: true,
    loading: false,
    confirmed: fn(),
    cancelled: fn(),
    closed: fn(),
    stateChanged: fn(),
  },
};

export default meta;
type Story = StoryObj<WiConfirmDialogStoryArgs>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <wi-confirm-dialog
        [size]="size"
        [title]="title"
        [description]="description"
        [confirmLabel]="confirmLabel"
        [cancelLabel]="cancelLabel"
        [confirmVariant]="confirmVariant"
        [showCancel]="showCancel"
        [loading]="loading"
        (confirmed)="confirmed()"
        (cancelled)="cancelled()"
        (closed)="closed($event)"
        (stateChanged)="stateChanged($event)"
      >
        <button wiButton type="button" variant="danger" wiConfirmDialogTrigger>Eliminar sitio</button>
      </wi-confirm-dialog>
    `,
  }),
};

export const PrimaryConfirm: Story = {
  args: {
    title: 'Publicar cambios',
    description: 'Los cambios serán visibles para todos los usuarios del sitio.',
    confirmLabel: 'Publicar',
    confirmVariant: 'primary',
  },
  render: (args) => ({
    props: args,
    template: `
      <wi-confirm-dialog
        [size]="size"
        [title]="title"
        [description]="description"
        [confirmLabel]="confirmLabel"
        [cancelLabel]="cancelLabel"
        [confirmVariant]="confirmVariant"
        (confirmed)="confirmed()"
        (cancelled)="cancelled()"
        (closed)="closed($event)"
        (stateChanged)="stateChanged($event)"
      >
        <button wiButton type="button" wiConfirmDialogTrigger>Publicar</button>
      </wi-confirm-dialog>
    `,
  }),
};

export const WithoutDescription: Story = {
  args: {
    title: '¿Continuar?',
    description: '',
    confirmLabel: 'Continuar',
    confirmVariant: 'primary',
  },
  render: (args) => ({
    props: args,
    template: `
      <wi-confirm-dialog
        [title]="title"
        [confirmLabel]="confirmLabel"
        [cancelLabel]="cancelLabel"
        [confirmVariant]="confirmVariant"
        (confirmed)="confirmed()"
        (cancelled)="cancelled()"
        (closed)="closed($event)"
        (stateChanged)="stateChanged($event)"
      >
        <button wiButton type="button" wiConfirmDialogTrigger>Continuar</button>
      </wi-confirm-dialog>
    `,
  }),
};

export const Loading: Story = {
  args: {
    loading: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <wi-confirm-dialog
        [title]="title"
        [description]="description"
        [confirmLabel]="confirmLabel"
        [cancelLabel]="cancelLabel"
        [confirmVariant]="confirmVariant"
        [loading]="loading"
        (confirmed)="confirmed()"
        (cancelled)="cancelled()"
        (closed)="closed($event)"
        (stateChanged)="stateChanged($event)"
      >
        <button wiButton type="button" variant="danger" wiConfirmDialogTrigger>Eliminar (loading)</button>
      </wi-confirm-dialog>
    `,
  }),
};

export const WithoutCancel: Story = {
  args: {
    showCancel: false,
    title: 'Acción requerida',
    description: 'Debes confirmar para continuar.',
    confirmLabel: 'Entendido',
    confirmVariant: 'primary',
  },
  render: (args) => ({
    props: args,
    template: `
      <wi-confirm-dialog
        [title]="title"
        [description]="description"
        [confirmLabel]="confirmLabel"
        [confirmVariant]="confirmVariant"
        [showCancel]="showCancel"
        (confirmed)="confirmed()"
        (cancelled)="cancelled()"
        (closed)="closed($event)"
        (stateChanged)="stateChanged($event)"
      >
        <button wiButton type="button" wiConfirmDialogTrigger>Abrir</button>
      </wi-confirm-dialog>
    `,
  }),
};

export const DarkMode: Story = {
  globals: {
    theme: 'dark',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-8">
        <wi-confirm-dialog
          [title]="title"
          [description]="description"
          [confirmLabel]="confirmLabel"
          [cancelLabel]="cancelLabel"
          [confirmVariant]="confirmVariant"
          (confirmed)="confirmed()"
          (cancelled)="cancelled()"
          (closed)="closed($event)"
          (stateChanged)="stateChanged($event)"
        >
          <button wiButton type="button" variant="danger" wiConfirmDialogTrigger>Eliminar (dark)</button>
        </wi-confirm-dialog>
      </div>
    `,
  }),
};

export const NarrowViewport: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    docs: {
      description: {
        story:
          'Footer en columna invertida bajo `sm`. Comprobar legibilidad ~320–400px sin overflow horizontal indebido.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="w-full max-w-90">
        <wi-confirm-dialog
          size="sm"
          [title]="title"
          [description]="description"
          [confirmLabel]="confirmLabel"
          [cancelLabel]="cancelLabel"
          [confirmVariant]="confirmVariant"
          (confirmed)="confirmed()"
          (cancelled)="cancelled()"
          (closed)="closed($event)"
          (stateChanged)="stateChanged($event)"
        >
          <button wiButton type="button" class="w-full" variant="danger" wiConfirmDialogTrigger>
            Eliminar (estrecho)
          </button>
        </wi-confirm-dialog>
      </div>
    `,
  }),
};

export const ViaService: Story = {
  parameters: {
    docs: {
      description: {
        story: `
Caso típico: hosts en el root **sin** \`key\`.

- \`confirm({...})\` **sin** \`target\` → abre este dialog.
- Si pasas \`target\`, abriría el popup (ver WiConfirmPopup → ViaService).

El copy y \`accept\`/\`reject\` van en la petición, no en el host.
        `,
      },
      source: {
        type: 'code',
        language: 'ts',
        code: SERVICE_USAGE_SOURCE,
      },
    },
  },
  render: (args) => ({
    props: {
      onAccept: args.confirmed,
      onReject: args.cancelled,
    },
    template: `
      <wi-confirm-dialog-via-service-demo
        [onAccept]="onAccept"
        [onReject]="onReject"
      />
    `,
  }),
};

export const ViaServiceKey: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Opcional.** Solo si necesitas **varios** \`wi-confirm-dialog\` a la vez.

Sin \`key\`, dialog vs popup se decide por \`target\` (ver ViaService).  
Con \`key\`, eliges **cuál** dialog de varios:

\`confirm({ key: 'delete-site' })\` → solo el host \`key="delete-site"\`.

Si te basta un dialog en el root, **no uses key**.
        `,
      },
      source: {
        type: 'code',
        language: 'ts',
        code: SERVICE_KEY_USAGE_SOURCE,
      },
    },
  },
  render: (args) => ({
    props: {
      onAccept: args.confirmed,
      onReject: args.cancelled,
    },
    template: `
      <wi-confirm-dialog-via-service-key-demo
        [onAccept]="onAccept"
        [onReject]="onReject"
      />
    `,
  }),
};
