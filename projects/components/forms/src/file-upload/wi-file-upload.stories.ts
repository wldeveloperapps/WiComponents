import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { WiFileUploadComponent } from '../public-api';

type WiFileUploadStoryArgs = WiFileUploadComponent & {
  filesChange: ReturnType<typeof fn>;
  upload: ReturnType<typeof fn>;
  touch: ReturnType<typeof fn>;
  reject: ReturnType<typeof fn>;
};

const meta: Meta<WiFileUploadStoryArgs> = {
  title: 'Forms/WiFileUpload',
  component: WiFileUploadComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Selector de archivos con botón de subida explícito. `accept` (tipos) + `maxFileSize` (bytes) validan en cliente; rechazos vía `reject` (i18n en la app). No hace HTTP. En ~320px la fila se apila. Events: `filesChange`, `upload`, `touch`, `reject`.',
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [WiFileUploadComponent],
    }),
  ],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    accept: { control: 'text' },
    maxFileSize: { control: 'number' },
    chooseLabel: { control: 'text' },
    emptyLabel: { control: 'text' },
    uploadLabel: { control: 'text' },
    multiple: { control: 'boolean' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    required: { control: 'boolean' },
    showUpload: { control: 'boolean' },
    uploadLoading: { control: 'boolean' },
    ariaLabel: { control: 'text' },
    filesChange: {
      action: 'filesChange',
      description: 'Se emite al cambiar los archivos seleccionados (solo válidos)',
      table: { category: 'Events' },
      control: false,
    },
    upload: {
      action: 'upload',
      description: 'Se emite al pulsar Subir (la app envía el archivo)',
      table: { category: 'Events' },
      control: false,
    },
    touch: {
      action: 'touch',
      description: 'Se emite al confirmar una selección',
      table: { category: 'Events' },
      control: false,
    },
    reject: {
      action: 'reject',
      description: 'Archivos rechazados por tipo (`type`) o tamaño (`size`)',
      table: { category: 'Events' },
      control: false,
    },
  },
  args: {
    size: 'md',
    accept: '.xlsx,.csv',
    maxFileSize: null,
    chooseLabel: 'Elegir archivo',
    emptyLabel: 'Ningún archivo seleccionado',
    uploadLabel: 'Subir',
    multiple: false,
    disabled: false,
    invalid: false,
    required: false,
    showUpload: true,
    uploadLoading: false,
    ariaLabel: 'Archivo',
    filesChange: fn(),
    upload: fn(),
    touch: fn(),
    reject: fn(),
  },
};

export default meta;
type Story = StoryObj<WiFileUploadStoryArgs>;

const BINDINGS = `
  [size]="size"
  [accept]="accept"
  [maxFileSize]="maxFileSize"
  [chooseLabel]="chooseLabel"
  [emptyLabel]="emptyLabel"
  [uploadLabel]="uploadLabel"
  [multiple]="multiple"
  [disabled]="disabled"
  [invalid]="invalid"
  [required]="required"
  [showUpload]="showUpload"
  [uploadLoading]="uploadLoading"
  [ariaLabel]="ariaLabel"
  (filesChange)="filesChange($event)"
  (upload)="upload($event)"
  (touch)="touch()"
  (reject)="reject($event)"
`;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="w-full min-w-0 max-w-xl">
        <wi-file-upload ${BINDINGS} />
      </div>
    `,
  }),
};

export const Multiple: Story = {
  render: (args) => ({
    props: {
      ...args,
      multiple: true,
      chooseLabel: 'Elegir archivos',
      accept: '.xlsx,.csv,text/csv',
    },
    template: `
      <div class="w-full min-w-0 max-w-xl">
        <wi-file-upload ${BINDINGS} />
      </div>
    `,
  }),
};

export const Constraints: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`accept=".xlsx,.csv"` + `maxFileSize` 1 MiB. Archivos inválidos no entran en `files` y se emiten en `reject` (Actions). El mensaje de error lo pinta la app.',
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      accept: '.xlsx,.csv',
      maxFileSize: 1024 * 1024,
    },
    template: `
      <div class="w-full min-w-0 max-w-xl">
        <wi-file-upload ${BINDINGS} />
        <p class="mt-2 text-sm text-on-surface-variant">
          Solo .xlsx / .csv · máx. 1&nbsp;MiB. Rechazos en el panel Actions.
        </p>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex w-full min-w-0 max-w-xl flex-col gap-4">
        <wi-file-upload
          size="sm"
          chooseLabel="Elegir archivo"
          emptyLabel="Ningún archivo seleccionado"
          uploadLabel="Subir"
          ariaLabel="Small"
          (filesChange)="filesChange($event)"
          (upload)="upload($event)"
          (touch)="touch()"
          (reject)="reject($event)"
        />
        <wi-file-upload
          size="md"
          chooseLabel="Elegir archivo"
          emptyLabel="Ningún archivo seleccionado"
          uploadLabel="Subir"
          ariaLabel="Medium"
          (filesChange)="filesChange($event)"
          (upload)="upload($event)"
          (touch)="touch()"
          (reject)="reject($event)"
        />
        <wi-file-upload
          size="lg"
          chooseLabel="Elegir archivo"
          emptyLabel="Ningún archivo seleccionado"
          uploadLabel="Subir"
          ariaLabel="Large"
          (filesChange)="filesChange($event)"
          (upload)="upload($event)"
          (touch)="touch()"
          (reject)="reject($event)"
        />
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: (args) => ({
    props: {
      ...args,
      disabled: true,
    },
    template: `
      <div class="w-full min-w-0 max-w-xl">
        <wi-file-upload ${BINDINGS} />
      </div>
    `,
  }),
};

export const Loading: Story = {
  render: (args) => ({
    props: {
      ...args,
      uploadLoading: true,
    },
    template: `
      <div class="w-full min-w-0 max-w-xl">
        <wi-file-upload ${BINDINGS} />
      </div>
    `,
  }),
};

export const WithoutUploadButton: Story = {
  render: (args) => ({
    props: {
      ...args,
      showUpload: false,
    },
    template: `
      <div class="w-full min-w-0 max-w-xl">
        <wi-file-upload ${BINDINGS} />
      </div>
    `,
  }),
};

export const Invalid: Story = {
  render: (args) => ({
    props: {
      ...args,
      invalid: true,
      required: true,
      ariaDescribedBy: 'file-hint-invalid',
    },
    template: `
      <div class="w-full min-w-0 max-w-xl">
        <wi-file-upload ${BINDINGS} />
        <p id="file-hint-invalid" class="mt-2 text-sm text-error" role="alert">
          Selecciona un archivo.
        </p>
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
      <div class="flex w-full min-w-0 max-w-xl flex-col gap-4 p-6">
        <wi-file-upload ${BINDINGS} />
        <wi-file-upload
          disabled
          chooseLabel="Elegir archivo"
          emptyLabel="Ningún archivo seleccionado"
          uploadLabel="Subir"
          ariaLabel="Deshabilitado"
          (filesChange)="filesChange($event)"
          (upload)="upload($event)"
          (touch)="touch()"
          (reject)="reject($event)"
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
          'A ~320px la fila se apila (botón Subir debajo). A partir de `sm` queda en una sola línea con el nombre truncado (`min-w-0`).',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="w-[320px] min-w-0 max-w-full">
        <wi-file-upload ${BINDINGS} />
      </div>
    `,
  }),
};
