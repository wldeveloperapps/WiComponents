import { Directionality } from '@angular/cdk/bidi';
import { Component, inject, input } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { applicationConfig, moduleMetadata } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { WiButtonDirective } from '../../../button/src/public-api';
import type {
  WiConfirmPopupAlign,
  WiConfirmPopupConfirmVariant,
  WiConfirmPopupSize,
} from './wi-confirm-popup.types';
import {
  WiConfirmationService,
  WiConfirmPopupComponent,
  WiConfirmPopupTriggerDirective,
} from '../public-api';

interface WiConfirmPopupStoryArgs {
  key: string;
  size: WiConfirmPopupSize;
  align: WiConfirmPopupAlign;
  sideOffset: number;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  confirmVariant: WiConfirmPopupConfirmVariant;
  showCancel: boolean;
  loading: boolean;
  confirmed: ReturnType<typeof fn>;
  cancelled: ReturnType<typeof fn>;
  closed: ReturnType<typeof fn>;
  stateChanged: ReturnType<typeof fn>;
}

const hideFromDocs = { table: { disable: true }, control: false } as const;

const hiddenConfirmPopupInternals: Record<string, typeof hideFromDocs> = {
  brn: hideFromDocs,
  document: hideFromDocs,
  host: hideFromDocs,
  overlaysI18n: hideFromDocs,
  origin: hideFromDocs,
  confirmation: hideFromDocs,
  titleDomId: hideFromDocs,
  descriptionDomId: hideFromDocs,
  resolvedTitle: hideFromDocs,
  resolvedDescription: hideFromDocs,
  resolvedConfirmLabel: hideFromDocs,
  resolvedConfirmVariant: hideFromDocs,
  resolvedShowCancel: hideFromDocs,
  chromeCancelLabel: hideFromDocs,
  contentClasses: hideFromDocs,
  panelState: hideFromDocs,
  overlayId: hideFromDocs,
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

    <button wiButton type="button" variant="danger" (click)="deleteRow($event)">
      Eliminar (abre popup anclado)
    </button>
  \`,
})
export class AppShell {
  private readonly confirmation = inject(WiConfirmationService);

  // Con target → WiConfirmationService abre el popup (anclado al botón)
  deleteRow(event: Event): void {
    void this.confirmation.confirm({
      target: event.currentTarget as HTMLElement,
      title: 'Eliminar fila',
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
 * Demo de Storybook = mismo patrón que la app (host + servicio + target).
 * `onAccept` / `onReject` solo alimentan Actions; en la app van a tu lógica.
 */
@Component({
  selector: 'wi-confirm-popup-via-service-demo',
  imports: [WiConfirmPopupComponent, WiButtonDirective],
  template: `
    <wi-confirm-popup />

    <button wiButton type="button" variant="danger" (click)="deleteRow($event)">
      Eliminar fila
    </button>
  `,
})
class ConfirmPopupViaServiceDemo {
  private readonly confirmation = inject(WiConfirmationService);

  readonly onAccept = input<() => void>(() => undefined);
  readonly onReject = input<() => void>(() => undefined);

  deleteRow(event: Event): void {
    void this.confirmation.confirm({
      target: event.currentTarget as HTMLElement,
      title: 'Eliminar fila',
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
  WiConfirmPopupComponent,
} from '@wldeveloperapps/ui/overlays';
import { WiButtonDirective } from '@wldeveloperapps/ui/button';

@Component({
  selector: 'app-shell',
  imports: [WiConfirmPopupComponent, WiButtonDirective],
  template: \`
    <wi-confirm-popup key="delete-row" />
    <wi-confirm-popup key="archive-row" />

    <button wiButton type="button" variant="danger" (click)="deleteRow($event)">
      Eliminar
    </button>
    <button wiButton type="button" (click)="archiveRow($event)">
      Archivar
    </button>
  \`,
})
export class AppShell {
  private readonly confirmation = inject(WiConfirmationService);

  deleteRow(event: Event): void {
    void this.confirmation.confirm({
      key: 'delete-row',
      target: event.currentTarget as HTMLElement,
      title: 'Eliminar fila',
      confirmLabel: 'Eliminar',
      confirmVariant: 'danger',
      accept: () => this.delete(),
    });
  }

  archiveRow(event: Event): void {
    void this.confirmation.confirm({
      key: 'archive-row',
      target: event.currentTarget as HTMLElement,
      title: 'Archivar fila',
      confirmLabel: 'Archivar',
      accept: () => this.archive(),
    });
  }

  private delete(): void {}
  private archive(): void {}
}
`;

const SERVICE_TABLE_USAGE_SOURCE = `import { Component, inject } from '@angular/core';
import {
  WiConfirmationService,
  WiConfirmPopupComponent,
} from '@wldeveloperapps/ui/overlays';
import { WiButtonDirective } from '@wldeveloperapps/ui/button';

@Component({
  selector: 'app-row-list',
  imports: [WiConfirmPopupComponent, WiButtonDirective],
  template: \`
    <!-- Un solo host para todas las filas -->
    <wi-confirm-popup key="row-delete" align="end" />

    @for (row of rows; track row.id) {
      <div class="flex items-center justify-between gap-4 border-b px-4 py-3 last:border-b-0">
        <span class="text-sm">{{ row.label }}</span>
        <button wiButton type="button" size="sm" variant="danger" (click)="deleteRow($event, row)">
          Eliminar
        </button>
      </div>
    }
  \`,
})
export class RowListComponent {
  private readonly confirmation = inject(WiConfirmationService);

  readonly rows = [
    { id: 'a', label: 'Fila A' },
    { id: 'b', label: 'Fila B' },
    { id: 'c', label: 'Fila C' },
  ];

  deleteRow(event: Event, row: { id: string; label: string }): void {
    void this.confirmation.confirm({
      key: 'row-delete',
      target: event.currentTarget as HTMLElement,
      title: \`Eliminar \${row.label}\`,
      description: 'Esta acción no se puede deshacer.',
      confirmLabel: 'Eliminar',
      confirmVariant: 'danger',
      accept: () => this.remove(row.id),
    });
  }

  private remove(_id: string): void {}
}
`;

@Component({
  selector: 'wi-confirm-popup-via-service-key-demo',
  imports: [WiConfirmPopupComponent, WiButtonDirective],
  template: `
    <div class="flex flex-col gap-4">
      <wi-confirm-popup key="delete-row" />
      <wi-confirm-popup key="archive-row" />

      <div class="flex flex-wrap gap-2">
        <button wiButton type="button" variant="danger" (click)="deleteRow($event)">
          Eliminar
        </button>
        <button wiButton type="button" (click)="archiveRow($event)">
          Archivar
        </button>
      </div>
    </div>
  `,
})
class ConfirmPopupViaServiceKeyDemo {
  private readonly confirmation = inject(WiConfirmationService);

  readonly onAccept = input<() => void>(() => undefined);
  readonly onReject = input<() => void>(() => undefined);

  deleteRow(event: Event): void {
    void this.confirmation.confirm({
      key: 'delete-row',
      target: event.currentTarget as HTMLElement,
      title: 'Eliminar fila',
      description: 'No se puede deshacer.',
      confirmLabel: 'Eliminar',
      confirmVariant: 'danger',
      accept: this.onAccept(),
      reject: this.onReject(),
    });
  }

  archiveRow(event: Event): void {
    void this.confirmation.confirm({
      key: 'archive-row',
      target: event.currentTarget as HTMLElement,
      title: 'Archivar fila',
      description: 'Podrás restaurarla más tarde.',
      confirmLabel: 'Archivar',
      confirmVariant: 'primary',
      accept: this.onAccept(),
      reject: this.onReject(),
    });
  }
}

@Component({
  selector: 'wi-confirm-popup-table-service-demo',
  imports: [WiConfirmPopupComponent, WiButtonDirective],
  template: `
    <!-- Un solo host para todas las filas -->
    <wi-confirm-popup key="row-delete" align="end" />

    <div class="w-full max-w-md overflow-hidden rounded-control border border-outline-variant">
      @for (site of sites; track site) {
        <div
          class="flex items-center justify-between gap-4 border-b border-outline-variant px-4 py-3 last:border-b-0"
        >
          <span class="text-sm text-on-surface">{{ site }}</span>
          <button
            wiButton
            type="button"
            size="sm"
            variant="danger"
            (click)="deleteRow($event, site)"
          >
            Eliminar
          </button>
        </div>
      }
    </div>
  `,
})
class ConfirmPopupTableServiceDemo {
  private readonly confirmation = inject(WiConfirmationService);

  readonly sites = ['Sitio A', 'Sitio B', 'Sitio C'];
  readonly onAccept = input<() => void>(() => undefined);
  readonly onReject = input<() => void>(() => undefined);

  deleteRow(event: Event, site: string): void {
    void this.confirmation.confirm({
      key: 'row-delete',
      target: event.currentTarget as HTMLElement,
      title: `Eliminar ${site}`,
      description: 'Esta acción no se puede deshacer.',
      confirmLabel: 'Eliminar',
      confirmVariant: 'danger',
      accept: this.onAccept(),
      reject: this.onReject(),
    });
  }
}

const confirmImports = [
  WiConfirmPopupComponent,
  WiConfirmPopupTriggerDirective,
  WiButtonDirective,
  ConfirmPopupViaServiceDemo,
  ConfirmPopupViaServiceKeyDemo,
  ConfirmPopupTableServiceDemo,
];

const meta: Meta<WiConfirmPopupStoryArgs> = {
  title: 'Overlays/WiConfirmPopup',
  component: WiConfirmPopupComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: {
      include: [
        'key',
        'state',
        'size',
        'align',
        'sideOffset',
        'offsetX',
        'title',
        'description',
        'confirmLabel',
        'cancelLabel',
        'confirmVariant',
        'showCancel',
        'loading',
        'closeOnOutsidePointerEvents',
      ],
    },
    docs: {
      description: {
        component: `
Confirmación compacta anclada al trigger (\`wi-confirm-popup\`).

## Modo declarativo (trigger)

- API: \`title\`, \`description?\`, \`confirmLabel\`, \`cancelLabel?\`, \`confirmVariant\` (\`primary\` | \`danger\`), \`size\` (\`sm\` | \`md\`), \`align\`, \`sideOffset\`, \`loading\`, \`showCancel\`, \`key?\`.
- Apertura: \`wiConfirmPopupTrigger\` (ancla al host) o \`open(origin)\` / \`[(state)]\`.
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
| **Sin** \`target\` | \`wi-confirm-dialog\` (modal centrado) |
| **Con** \`target\` (HTMLElement) | \`wi-confirm-popup\` (anclado a ese elemento) |

\`\`\`ts
// Popup — obligatorio pasar target
this.confirmation.confirm({
  target: event.currentTarget as HTMLElement,
  title: 'Eliminar',
  confirmLabel: 'Eliminar',
  confirmVariant: 'danger',
  accept: () => this.delete(),
});
\`\`\`

\`key\` es **opcional**: solo si montas varios popups (o varios dialogs) y necesitas dirigir a uno concreto. Ver ViaServiceKey / ViaServiceTable.

Escape / clic fuera → \`'dismissed'\` (no llama \`reject\`).

- A11y: \`role=alertdialog\` sin backdrop; cierra con Escape y clic fuera. Un overlay CDK anidado no cierra el popup.
- Diferencia vs \`wi-confirm-dialog\`: popup contextual anclado; dialog modal centrado.
- Copy: textos desde la app; chrome cancel vía \`provideWiOverlaysI18n({ confirmCancelLabel })\`.
        `,
      },
    },
  },
  decorators: [
    applicationConfig({
      providers: [Directionality],
    }),
    moduleMetadata({
      imports: confirmImports,
    }),
  ],
  argTypes: {
    ...hiddenConfirmPopupInternals,
    key: {
      control: 'text',
      table: { category: 'Service' },
      description: 'Key para WiConfirmationService',
    },
    state: {
      control: 'select',
      options: ['open', 'closed'],
      table: { category: 'Popup' },
      description: "Model `open` | `closed`",
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      table: { category: 'Popup' },
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
      table: { category: 'Popup' },
    },
    sideOffset: {
      control: 'number',
      table: { category: 'Popup' },
    },
    offsetX: {
      control: 'number',
      table: { category: 'Popup' },
      description: 'Desplazamiento horizontal del panel',
    },
    closeOnOutsidePointerEvents: {
      control: 'boolean',
      table: { category: 'Popup' },
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
      description: "Se emite al cerrar ('confirmed' | 'cancelled' | 'dismissed')",
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
    state: 'closed',
    size: 'sm',
    align: 'center',
    sideOffset: 8,
    offsetX: 0,
    closeOnOutsidePointerEvents: true,
    title: 'Eliminar fila',
    description: 'Esta acción no se puede deshacer.',
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
type Story = StoryObj<WiConfirmPopupStoryArgs>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <wi-confirm-popup
        [(state)]="state"
        [size]="size"
        [align]="align"
        [sideOffset]="sideOffset"
        [offsetX]="offsetX"
        [closeOnOutsidePointerEvents]="closeOnOutsidePointerEvents"
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
        <button wiButton type="button" variant="danger" wiConfirmPopupTrigger>Eliminar</button>
      </wi-confirm-popup>
    `,
  }),
};

export const PrimaryConfirm: Story = {
  args: {
    title: 'Publicar cambios',
    description: 'Los cambios serán visibles de inmediato.',
    confirmLabel: 'Publicar',
    confirmVariant: 'primary',
  },
  render: (args) => ({
    props: args,
    template: `
      <wi-confirm-popup
        [size]="size"
        [align]="align"
        [sideOffset]="sideOffset"
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
        <button wiButton type="button" wiConfirmPopupTrigger>Publicar</button>
      </wi-confirm-popup>
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
      <wi-confirm-popup
        [title]="title"
        [confirmLabel]="confirmLabel"
        [cancelLabel]="cancelLabel"
        [confirmVariant]="confirmVariant"
        (confirmed)="confirmed()"
        (cancelled)="cancelled()"
        (closed)="closed($event)"
        (stateChanged)="stateChanged($event)"
      >
        <button wiButton type="button" wiConfirmPopupTrigger>Continuar</button>
      </wi-confirm-popup>
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
      <wi-confirm-popup
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
        <button wiButton type="button" variant="danger" wiConfirmPopupTrigger>Eliminar (loading)</button>
      </wi-confirm-popup>
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
      <wi-confirm-popup
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
        <button wiButton type="button" wiConfirmPopupTrigger>Abrir</button>
      </wi-confirm-popup>
    `,
  }),
};

export const InTableRow: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Uso típico declarativo: un popup por fila. Para un solo host compartido, ver ViaServiceTable.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="w-full max-w-md overflow-hidden rounded-control border border-outline-variant">
        <div class="flex items-center justify-between gap-4 border-b border-outline-variant px-4 py-3">
          <span class="text-sm text-on-surface">Sitio A</span>
          <wi-confirm-popup
            [title]="title"
            [description]="description"
            [confirmLabel]="confirmLabel"
            [cancelLabel]="cancelLabel"
            [confirmVariant]="confirmVariant"
            align="end"
            (confirmed)="confirmed()"
            (cancelled)="cancelled()"
            (closed)="closed($event)"
            (stateChanged)="stateChanged($event)"
          >
            <button wiButton type="button" size="sm" variant="danger" wiConfirmPopupTrigger>Eliminar</button>
          </wi-confirm-popup>
        </div>
        <div class="flex items-center justify-between gap-4 px-4 py-3">
          <span class="text-sm text-on-surface">Sitio B</span>
          <wi-confirm-popup
            title="Eliminar Sitio B"
            description="Esta acción no se puede deshacer."
            confirmLabel="Eliminar"
            confirmVariant="danger"
            align="end"
            (confirmed)="confirmed()"
            (cancelled)="cancelled()"
            (closed)="closed($event)"
            (stateChanged)="stateChanged($event)"
          >
            <button wiButton type="button" size="sm" variant="danger" wiConfirmPopupTrigger>Eliminar</button>
          </wi-confirm-popup>
        </div>
      </div>
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
      <div class="wi-dark p-8 bg-background text-on-background">
        <wi-confirm-popup
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
          <button wiButton type="button" variant="danger" wiConfirmPopupTrigger>Eliminar (dark)</button>
        </wi-confirm-popup>
      </div>
    `,
  }),
};

export const NarrowViewport: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    docs: {
      description: {
        story: 'Panel con tope calc(100vw-2rem). Footer en columna invertida bajo sm.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="w-full max-w-90">
        <wi-confirm-popup
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
          <button wiButton type="button" class="w-full" variant="danger" wiConfirmPopupTrigger>
            Eliminar (estrecho)
          </button>
        </wi-confirm-popup>
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

- \`confirm({ target })\` → abre este **popup** anclado al elemento.
- \`confirm({...})\` **sin** \`target\` → abriría el dialog (ver WiConfirmDialog → ViaService).

\`target\` es obligatorio para el popup (sirve para anclar y para que el servicio sepa que no es un dialog).
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
      <wi-confirm-popup-via-service-demo
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
**Opcional.** Solo si necesitas **varios** \`wi-confirm-popup\` a la vez.

Sin \`key\`, dialog vs popup se decide por \`target\` (ver ViaService).  
Con \`key\` + \`target\`, eliges **cuál** popup de varios.

Si te basta un popup en el root, **no uses key**.
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
      <wi-confirm-popup-via-service-key-demo
        [onAccept]="onAccept"
        [onReject]="onReject"
      />
    `,
  }),
};

export const ViaServiceTable: Story = {
  parameters: {
    docs: {
      description: {
        story: `
Un solo host en el root para **todas** las filas (no un popup por fila).

Aquí usamos \`key="row-delete"\` solo como nombre del host compartido; lo importante es \`target\` en cada \`confirm()\` para anclar al botón de la fila.

Contrasta con InTableRow (modo declarativo: un popup por fila).
        `,
      },
      source: {
        type: 'code',
        language: 'ts',
        code: SERVICE_TABLE_USAGE_SOURCE,
      },
    },
  },
  render: (args) => ({
    props: {
      onAccept: args.confirmed,
      onReject: args.cancelled,
    },
    template: `
      <wi-confirm-popup-table-service-demo
        [onAccept]="onAccept"
        [onReject]="onReject"
      />
    `,
  }),
};
