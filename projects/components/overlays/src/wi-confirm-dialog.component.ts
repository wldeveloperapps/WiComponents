import {
  booleanAttribute,
  Component,
  computed,
  Directive,
  effect,
  inject,
  input,
  model,
  output,
  TemplateRef,
  untracked,
} from '@angular/core';
import {
  BRN_ALERT_DIALOG_DEFAULT_OPTIONS,
  BrnAlertDialog,
  BrnAlertDialogDescription,
  BrnAlertDialogOverlay,
  BrnAlertDialogTitle,
} from '@spartan-ng/brain/alert-dialog';
import { BrnDialog, provideBrnDialogDefaultOptions } from '@spartan-ng/brain/dialog';
import { WiButtonComponent } from '@wiloc/ui/button';

import type {
  WiConfirmDialogConfirmVariant,
  WiConfirmDialogSize,
  WiConfirmDialogState,
} from './wi-confirm-dialog.types';
import { injectWiOverlaysI18n } from './wi-overlays.i18n';

const OVERLAY_CLASSES = [
  'wi-confirm-dialog__overlay',
  'bg-on-background/50',
  'data-[state=open]:animate-in',
  'data-[state=closed]:animate-out',
  'data-[state=closed]:fade-out-0',
  'data-[state=open]:fade-in-0',
].join(' ');

const PANEL_BASE_CLASSES = 'wi-confirm-dialog__pane';

const CONTENT_BASE_CLASSES = [
  'wi-confirm-dialog__content',
  'relative',
  'grid',
  'w-full',
  'gap-4',
  'rounded-control-lg',
  'border',
  'border-outline-variant',
  'bg-surface',
  'p-6',
  'text-sm',
  'text-on-surface',
  'shadow-lg',
  'outline-none',
  'data-[state=open]:animate-in',
  'data-[state=closed]:animate-out',
  'data-[state=closed]:fade-out-0',
  'data-[state=open]:fade-in-0',
  'data-[state=closed]:zoom-out-95',
  'data-[state=open]:zoom-in-95',
].join(' ');

const SIZE_WIDTH_CLASSES: Record<WiConfirmDialogSize, string> = {
  sm: 'w-[min(calc(100vw-2rem),24rem)]',
  md: 'w-[min(calc(100vw-2rem),32rem)]',
};

function panelClassesForSize(size: WiConfirmDialogSize): string {
  return [PANEL_BASE_CLASSES, SIZE_WIDTH_CLASSES[size]].join(' ');
}

let triggerIdSequence = 0;

/**
 * Overlay (backdrop) del confirm dialog. Uso interno de `wi-confirm-dialog`.
 */
@Directive({
  selector: '[wiConfirmDialogOverlay]',
  hostDirectives: [
    {
      directive: BrnAlertDialogOverlay,
      inputs: ['class'],
    },
  ],
})
export class WiConfirmDialogOverlayDirective {}

/**
 * Registra el template del panel. Uso interno de `wi-confirm-dialog`.
 */
@Directive({
  selector: '[wiConfirmDialogPortal]',
})
export class WiConfirmDialogPortalDirective {
  private readonly confirm = inject(WiConfirmDialogComponent);
  private readonly brn = inject(BrnDialog);
  private readonly template = inject(TemplateRef);

  private readonly panelClass = computed(() => panelClassesForSize(this.confirm.size()));

  constructor() {
    this.brn.registerContent(
      this.template,
      computed(() => undefined),
      this.panelClass,
    );
  }
}

/**
 * Abre el confirm dialog al hacer click.
 *
 * @example
 * ```html
 * <wi-button wiConfirmDialogTrigger>Eliminar</wi-button>
 * <button type="button" [wiConfirmDialogTriggerFor]="confirm">Eliminar</button>
 * ```
 */
@Directive({
  selector:
    'button[wiConfirmDialogTrigger], [wiConfirmDialogTrigger], button[wiConfirmDialogTriggerFor], [wiConfirmDialogTriggerFor]',
  exportAs: 'wiConfirmDialogTrigger',
  host: {
    '[id]': 'id()',
    '(click)': 'open()',
    'aria-haspopup': 'dialog',
    '[attr.aria-expanded]': "state() === 'open' ? 'true' : 'false'",
    '[attr.data-state]': 'state()',
    '[attr.aria-controls]': 'dialogId()',
    '[attr.type]': 'type()',
  },
})
export class WiConfirmDialogTriggerDirective {
  private readonly injectedConfirm = inject(WiConfirmDialogComponent, { optional: true });
  private readonly brnDialog = inject(BrnDialog, { optional: true });

  readonly id = input(`wi-confirm-dialog-trigger-${++triggerIdSequence}`);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly wiConfirmDialogTriggerFor = input<WiConfirmDialogComponent | undefined>(undefined);

  protected readonly state = computed(
    () => this.resolveConfirm()?.state() ?? this.brnDialog?.stateComputed() ?? 'closed',
  );

  protected readonly dialogId = computed(() => {
    const confirm = this.resolveConfirm();
    if (confirm) {
      return confirm.dialogId();
    }
    return this.brnDialog?.id() ?? null;
  });

  private resolveConfirm(): WiConfirmDialogComponent | null {
    return this.wiConfirmDialogTriggerFor() ?? this.injectedConfirm ?? null;
  }

  open(): void {
    const confirm = this.resolveConfirm();
    if (confirm) {
      confirm.open();
      return;
    }
    this.brnDialog?.open();
  }
}

/**
 * Diálogo de confirmación compacto (`wi-confirm-dialog`).
 *
 * Pattern sobre alert-dialog: título / descripción / cancelar / confirmar.
 * Los textos los aporta la app (i18n). Brain gestiona portal, foco y `role=alertdialog`.
 * Por defecto no cierra con Escape ni backdrop (`disableClose`).
 *
 * ```html
 * <wi-confirm-dialog
 *   title="Eliminar sitio"
 *   description="Esta acción no se puede deshacer."
 *   confirmLabel="Eliminar"
 *   cancelLabel="Cancelar"
 *   confirmVariant="danger"
 *   (confirmed)="onConfirm()"
 *   (cancelled)="onCancel()"
 * >
 *   <wi-button type="button" wiConfirmDialogTrigger>Eliminar</wi-button>
 * </wi-confirm-dialog>
 * ```
 */
@Component({
  selector: 'wi-confirm-dialog',
  exportAs: 'wiConfirmDialog',
  imports: [
    WiConfirmDialogOverlayDirective,
    WiConfirmDialogPortalDirective,
    BrnAlertDialogTitle,
    BrnAlertDialogDescription,
    WiButtonComponent,
  ],
  providers: [
    provideBrnDialogDefaultOptions({
      ...BRN_ALERT_DIALOG_DEFAULT_OPTIONS,
      hasBackdrop: true,
      closeOnOutsidePointerEvents: false,
      restoreFocus: true,
      autoFocus: 'first-tabbable',
    }),
  ],
  hostDirectives: [
    {
      directive: BrnAlertDialog,
      inputs: ['id', 'disableClose'],
      outputs: ['closed', 'stateChanged'],
    },
  ],
  host: {
    class: 'wi-confirm-dialog contents',
  },
  template: `
    <div wiConfirmDialogOverlay [class]="overlayClasses"></div>
    <ng-content />

    <ng-template wiConfirmDialogPortal>
      <div
        data-slot="confirm-dialog-content"
        [attr.data-state]="panelState()"
        [class]="contentClasses()"
      >
        <div
          data-slot="confirm-dialog-header"
          class="wi-confirm-dialog__header flex flex-col gap-1 text-start"
        >
          <h2
            brnAlertDialogTitle
            data-slot="confirm-dialog-title"
            class="wi-confirm-dialog__title text-base leading-none font-semibold text-on-surface"
          >
            {{ title() }}
          </h2>
          @if (description()) {
            <p
              brnAlertDialogDescription
              data-slot="confirm-dialog-description"
              class="wi-confirm-dialog__description text-sm text-on-surface-variant"
            >
              {{ description() }}
            </p>
          }
        </div>

        <div
          data-slot="confirm-dialog-footer"
          class="wi-confirm-dialog__footer flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-2"
        >
          @if (showCancel()) {
            <wi-button
              type="button"
              variant="secondary"
              [disabled]="loading()"
              (click)="onCancel()"
            >
              {{ resolvedCancelLabel() }}
            </wi-button>
          }
          <wi-button
            type="button"
            [variant]="confirmVariant()"
            [loading]="loading()"
            (click)="onConfirm()"
          >
            {{ confirmLabel() }}
          </wi-button>
        </div>
      </div>
    </ng-template>
  `,
})
export class WiConfirmDialogComponent {
  private readonly brn = inject(BrnDialog);
  private readonly overlaysI18n = injectWiOverlaysI18n();

  /** Estado controlado (two-way). */
  readonly state = model<WiConfirmDialogState>('closed');

  /** Ancho del panel: sm → 24rem, md → 32rem. */
  readonly size = input<WiConfirmDialogSize>('sm');

  /** Título accesible (obligatorio; lo aporta la app). */
  readonly title = input.required<string>();

  /** Descripción opcional. */
  readonly description = input<string | undefined>(undefined);

  /** Label del botón de confirmación (obligatorio; lo aporta la app). */
  readonly confirmLabel = input.required<string>();

  /** Override de `provideWiOverlaysI18n` (`confirmCancelLabel`). */
  readonly cancelLabel = input<string | undefined>(undefined);

  /** Variante visual del botón de confirmación. */
  readonly confirmVariant = input<WiConfirmDialogConfirmVariant>('primary');

  /** Muestra el botón de cancelar. */
  readonly showCancel = input(true, { transform: booleanAttribute });

  /** Estado de carga en la acción de confirmar (deshabilita cancelar). */
  readonly loading = input(false, { transform: booleanAttribute });

  /** Se emite al pulsar confirmar (antes de cerrar). */
  readonly confirmed = output<void>();

  /** Se emite al pulsar cancelar (antes de cerrar). */
  readonly cancelled = output<void>();

  /** Id del dialog (Brain); útil para `aria-controls` del trigger. */
  readonly dialogId = computed(() => this.brn.id());

  protected readonly overlayClasses = OVERLAY_CLASSES;

  protected readonly panelState = computed(() => this.brn.stateComputed());

  protected readonly resolvedCancelLabel = computed(
    () => this.cancelLabel() ?? this.overlaysI18n.confirmCancelLabel(),
  );

  protected readonly contentClasses = computed(() => {
    const size = this.size();
    return [CONTENT_BASE_CLASSES, SIZE_WIDTH_CLASSES[size]].join(' ');
  });

  constructor() {
    effect(() => {
      const desired = this.state();
      untracked(() => {
        if (desired === 'open') {
          this.brn.open();
        } else {
          this.brn.close();
        }
      });
    });

    effect(() => {
      const actual = this.brn.stateComputed();
      untracked(() => {
        if (this.state() !== actual) {
          this.state.set(actual);
        }
      });
    });
  }

  open(): void {
    this.state.set('open');
  }

  close(result?: unknown): void {
    this.brn.close(result);
  }

  protected onConfirm(): void {
    if (this.loading()) {
      return;
    }
    this.confirmed.emit();
    this.brn.close('confirmed');
  }

  protected onCancel(): void {
    if (this.loading()) {
      return;
    }
    this.cancelled.emit();
    this.brn.close('cancelled');
  }
}
