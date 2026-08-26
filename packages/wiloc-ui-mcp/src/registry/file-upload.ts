/**
 * Registry seed for @wiloc/ui-mcp.
 * Documenta solo API pública — no Spartan ni rutas internas.
 */
export const wiFileUploadRegistryEntry = {
  name: 'file-upload',
  selector: 'wi-file-upload',
  entryPoint: '@wiloc/ui/forms',
  status: 'experimental' as const,
  exports: [
    'WiFileUploadComponent',
    'WiFileUploadSize',
    'WiFileUploadRejectReason',
    'WiFileUploadRejection',
    'isFileAccepted',
    'isFileWithinSize',
  ],
  inputs: [
    {
      name: 'files',
      type: 'readonly File[] (model)',
      default: '[]',
      description: 'Archivos válidos seleccionados; two-way binding. La app envía el HTTP',
    },
    {
      name: 'size',
      type: 'WiFileUploadSize',
      default: 'md',
      description: 'Tamaño visual del control: sm | md | lg',
    },
    {
      name: 'accept',
      type: 'string',
      default: "''",
      description:
        'Tipos aceptados (formato HTML accept): .xlsx,.csv | image/* | application/pdf. Vacío = cualquiera. Filtra el diálogo nativo y valida en cliente',
    },
    {
      name: 'maxFileSize',
      type: 'number | null',
      default: null,
      description: 'Tamaño máximo por archivo en bytes. null / ≤0 = sin límite',
    },
    {
      name: 'multiple',
      type: 'boolean',
      default: false,
      description: 'Permite seleccionar varios archivos',
    },
    {
      name: 'chooseLabel',
      type: 'string',
      default: "''",
      description: 'Texto del botón Elegir (i18n de la app)',
    },
    {
      name: 'emptyLabel',
      type: 'string',
      default: "''",
      description: 'Texto cuando no hay archivo seleccionado (i18n de la app)',
    },
    {
      name: 'uploadLabel',
      type: 'string',
      default: "''",
      description: 'Texto del botón Subir (i18n de la app)',
    },
    {
      name: 'showUpload',
      type: 'boolean',
      default: true,
      description: 'Muestra el botón Subir. Si es false, la app dispara la subida por su cuenta',
    },
    {
      name: 'uploadLoading',
      type: 'boolean',
      default: false,
      description: 'Estado loading del botón Subir (aria-busy)',
    },
    {
      name: 'id',
      type: 'string | undefined',
      default: 'auto (wi-file-upload-N)',
      description: 'id del input nativo para asociar labels',
    },
    {
      name: 'name',
      type: 'string',
      default: "''",
      description: 'name nativo del input file',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      description: 'Deshabilita elegir y subir',
    },
    {
      name: 'invalid',
      type: 'boolean',
      default: false,
      description: 'Estado inválido (aria-invalid en el grupo)',
    },
    {
      name: 'required',
      type: 'boolean',
      default: false,
      description: 'Marca el campo como requerido (attr + aria-required)',
    },
    {
      name: 'ariaLabel',
      type: 'string | null',
      default: null,
      description: 'Nombre accesible del grupo cuando no hay label visible asociado',
    },
    {
      name: 'ariaDescribedBy',
      type: 'string | null',
      default: null,
      description: 'IDs de hint/error asociados (aria-describedby)',
    },
  ],
  outputs: [
    {
      name: 'filesChange',
      type: 'readonly File[]',
      description: 'Se emite al cambiar la selección válida (model files)',
    },
    {
      name: 'upload',
      type: 'readonly File[]',
      description: 'Se emite al pulsar Subir. La app realiza el POST; la librería no hace HTTP',
    },
    {
      name: 'touch',
      type: 'void',
      description: 'Se emite al confirmar una selección (también si hay rechazos)',
    },
    {
      name: 'reject',
      type: 'readonly WiFileUploadRejection[]',
      description:
        'Archivos rechazados: reason "type" (accept) o "size" (maxFileSize). La app traduce el mensaje',
    },
  ],
  variants: [],
  keyboard: ['Tab', 'Enter', 'Space'],
  a11yNotes:
    'Grupo con botón Elegir (abre el diálogo nativo) y botón Subir. El input file está oculto (sr-only) y fuera de tab. Asociar label vía id o ariaLabel. emptyLabel se anuncia con aria-live. chooseLabel/emptyLabel/uploadLabel/ariaLabel son i18n de la app. Errores de tipo/tamaño: escuchar reject y pintar mensaje propio (no hay copy en la librería).',
  example: {
    import: `import { WiFileUploadComponent, type WiFileUploadRejection } from '@wiloc/ui/forms';`,
    template: `<!-- i18n + HTTP en la app -->
<wi-file-upload
  id="import-file"
  accept=".xlsx,.csv"
  [maxFileSize]="1024 * 1024"
  [chooseLabel]="t.chooseFile"
  [emptyLabel]="t.noFileChosen"
  [uploadLabel]="t.upload"
  [ariaLabel]="t.fileAria"
  [(files)]="files"
  [uploadLoading]="uploading"
  (upload)="onUpload($event)"
  (reject)="onReject($event)"
/>`,
  },
} as const;
