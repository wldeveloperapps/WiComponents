import {
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';

import { WiButtonDirective } from '@wiloc/ui/button';

import {
  isFileAccepted,
  isFileWithinSize,
  type WiFileUploadRejection,
  type WiFileUploadSize,
} from './wi-file-upload.types';

const FILENAME_CLASSES = [
  'wi-file-upload__filename',
  'min-w-0',
  'flex-1',
  'truncate',
  'text-sm',
  'text-on-surface-variant',
].join(' ');

let nextFileUploadId = 0;

/**
 * Selector de archivos con disparo explícito de subida (`wi-file-upload`).
 *
 * - No realiza HTTP: la app recibe `files` y el evento `upload`.
 * - `accept` filtra el diálogo nativo y valida en cliente; `maxFileSize` (bytes) limita el tamaño.
 * - Rechazos vía `reject` (la app traduce el mensaje). Sin copy hardcodeado.
 */
@Component({
  selector: 'wi-file-upload',
  imports: [WiButtonDirective],
  host: {
    class: 'wi-file-upload flex w-full min-w-0',
    role: 'group',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-describedby]': 'ariaDescribedBy()',
    '[attr.aria-invalid]': 'invalid() || null',
    '[attr.aria-required]': 'required() || null',
    '[attr.aria-disabled]': 'disabled() || null',
  },
  template: `
    <input
      #fileInput
      class="sr-only"
      type="file"
      tabindex="-1"
      aria-hidden="true"
      [attr.id]="resolvedId()"
      [attr.name]="name() || null"
      [attr.accept]="accept() || null"
      [attr.required]="required() || null"
      [multiple]="multiple()"
      [disabled]="disabled()"
      (change)="onNativeChange($event)"
    />
    <div
      class="wi-file-upload__row flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center"
    >
      <div class="wi-file-upload__picker flex min-w-0 flex-1 items-center gap-3">
        <button wiButton
          class="wi-file-upload__choose"
          type="button"
          variant="outline"
          [size]="size()"
          [disabled]="disabled()"
          (click)="openFilePicker()"
        >
          {{ chooseLabel() }}
        </button>
        <span [class]="FILENAME_CLASSES" [attr.title]="filenameTitle()" aria-live="polite">
          {{ filenameText() }}
        </span>
      </div>
      @if (showUpload()) {
        <button wiButton
          class="wi-file-upload__upload sm:ms-auto"
          type="button"
          variant="primary"
          [size]="size()"
          [disabled]="isUploadDisabled()"
          [loading]="uploadLoading()"
          (click)="onUpload()"
        >
          {{ uploadLabel() }}
        </button>
      }
    </div>
  `,
})
export class WiFileUploadComponent {
  protected readonly FILENAME_CLASSES = FILENAME_CLASSES;

  /** Archivos válidos seleccionados (two-way). La app los envía al backend. */
  readonly files = model<readonly File[]>([]);

  readonly size = input<WiFileUploadSize>('md');
  /**
   * Tipos aceptados (mismo formato que el atributo HTML `accept`):
   * `.xlsx,.csv`, `image/*`, `application/pdf`. Vacío = cualquiera.
   */
  readonly accept = input('');
  /** Tamaño máximo por archivo en bytes. `null` / ≤0 = sin límite. */
  readonly maxFileSize = input<number | null>(null);
  readonly id = input<string | undefined>(undefined);
  readonly name = input('');
  readonly chooseLabel = input('');
  readonly emptyLabel = input('');
  readonly uploadLabel = input('');
  readonly ariaLabel = input<string | null>(null);
  readonly ariaDescribedBy = input<string | null>(null);

  readonly multiple = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly showUpload = input(true, { transform: booleanAttribute });
  readonly uploadLoading = input(false, { transform: booleanAttribute });

  /** Emite los archivos válidos cuando el usuario pulsa Subir. */
  readonly upload = output<readonly File[]>();

  /** Emite al confirmar una selección (touched), aunque haya rechazos. */
  readonly touch = output<void>();

  /**
   * Archivos rechazados por tipo o tamaño.
   * La app muestra el mensaje (i18n); la librería no hardcodea copy.
   */
  readonly reject = output<readonly WiFileUploadRejection[]>();

  private readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');
  private readonly generatedId = `wi-file-upload-${++nextFileUploadId}`;

  protected readonly resolvedId = computed(() => this.id() ?? this.generatedId);

  protected readonly filenameText = computed(() => {
    const selected = this.files();
    if (selected.length === 0) {
      return this.emptyLabel();
    }
    return selected.map((file) => file.name).join(', ');
  });

  protected readonly filenameTitle = computed(() => {
    const text = this.filenameText();
    return text || null;
  });

  protected readonly isUploadDisabled = computed(
    () => this.disabled() || this.files().length === 0,
  );

  protected openFilePicker(): void {
    if (this.disabled()) {
      return;
    }
    this.fileInput().nativeElement.click();
  }

  protected onNativeChange(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const picked = inputEl.files ? Array.from(inputEl.files) : [];
    const { accepted, rejected } = this.partitionFiles(picked);

    this.files.set(accepted);
    this.touch.emit();
    if (rejected.length > 0) {
      this.reject.emit(rejected);
    }
    inputEl.value = '';
  }

  protected onUpload(): void {
    if (this.isUploadDisabled()) {
      return;
    }
    this.upload.emit(this.files());
  }

  private partitionFiles(picked: readonly File[]): {
    accepted: File[];
    rejected: WiFileUploadRejection[];
  } {
    const accepted: File[] = [];
    const rejected: WiFileUploadRejection[] = [];
    const accept = this.accept();
    const maxFileSize = this.maxFileSize();

    for (const file of picked) {
      if (!isFileAccepted(file, accept)) {
        rejected.push({ file, reason: 'type' });
        continue;
      }
      if (!isFileWithinSize(file, maxFileSize)) {
        rejected.push({ file, reason: 'size' });
        continue;
      }
      accepted.push(file);
    }

    return { accepted, rejected };
  }
}
