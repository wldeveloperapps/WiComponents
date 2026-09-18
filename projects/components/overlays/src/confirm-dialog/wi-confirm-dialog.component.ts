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
import { WiButtonDirective } from '@wldeveloperapps/ui/button';

import { bindWiConfirmationHost } from '../confirmation/wi-confirmation-host';
import type {
  WiConfirmDialogConfirmVariant,
  WiConfirmDialogSize,
  WiConfirmDialogState,
} from './wi-confirm-dialog.types';
import { injectWiOverlaysI18n } from '../wi-overlays.i18n';

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
 * <button wiButton wiConfirmDialogTrigger>Eliminar</button>
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
 * Dos modos:
 * 1. Declarativo (trigger + inputs + outputs).
 * 2. Imperativo vía `WiConfirmationService.confirm()` + host montado
 *    (`<wi-confirm-dialog />` o con `key`).
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
 *   <button wiButton type="button" wiConfirmDialogTrigger>Eliminar</button>
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
    WiButtonDirective,
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
            {{ resolvedTitle() }}
          </h2>
          @if (resolvedDescription()) {
            <p
              brnAlertDialogDescription
              data-slot="confirm-dialog-description"
              class="wi-confirm-dialog__description text-sm text-on-surface-variant"
            >
              {{ resolvedDescription() }}
            </p>
          }
        </div>

        <div
          data-slot="confirm-dialog-footer"
          class="wi-confirm-dialog__footer flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-2"
        >
          @if (resolvedShowCancel()) {
            <button wiButton
              type="button"
              variant="secondary"
              [disabled]="loading()"
              (click)="onCancel()"
            >
              {{ chromeCancelLabel() }}
            </button>
          }
          <button wiButton
            type="button"
            [variant]="resolvedConfirmVariant()"
            [loading]="loading()"
            (click)="onConfirm()"
          >
            {{ resolvedConfirmLabel() }}
          </button>
        </div>
      </div>
    </ng-template>
  `,
})
export class WiConfirmDialogComponent {
  private readonly brn = inject(BrnDialog);
  private readonly overlaysI18n = injectWiOverlaysI18n();

  /**
   * Key para `WiConfirmationService`. Sin key: recibe peticiones sin key y sin `target`.
   */
  readonly key = input<string | undefined>(undefined);

  /** Estado controlado (two-way). */
  readonly state = model<WiConfirmDialogState>('closed');

  /** Ancho del panel: sm → 24rem, md → 32rem. */
  readonly size = input<WiConfirmDialogSize>('sm');

  /**
   * Título accesible. Obligatorio en modo trigger; en modo servicio llega vía `confirm()`.
   */
  readonly title = input<string | undefined>(undefined);

  /** Descripción opcional. */
  readonly description = input<string | undefined>(undefined);

  /**
   * Label del botón de confirmación. Obligatorio en modo trigger; vía servicio en `confirm()`.
   */
  readonly confirmLabel = input<string | undefined>(undefined);

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

  private readonly confirmation = bindWiConfirmationHost({
    kind: 'dialog',
    key: this.key,
    title: this.title,
    description: this.description,
    confirmLabel: this.confirmLabel,
    cancelLabel: this.cancelLabel,
    confirmVariant: this.confirmVariant,
    showCancel: this.showCancel,
    openFromRequest: () => this.open(),
    closeOverlay: () => this.close(),
  });

  protected readonly resolvedTitle = this.confirmation.resolvedTitle;
  protected readonly resolvedDescription = this.confirmation.resolvedDescription;
  protected readonly resolvedConfirmLabel = this.confirmation.resolvedConfirmLabel;
  protected readonly resolvedConfirmVariant = this.confirmation.resolvedConfirmVariant;
  protected readonly resolvedShowCancel = this.confirmation.resolvedShowCancel;

  protected readonly chromeCancelLabel = computed(
    () =>
      this.confirmation.resolvedCancelLabelOverride() ??
      this.overlaysI18n.confirmCancelLabel(),
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
        if (actual === 'closed') {
          this.confirmation.dismissIfActive();
        }
      });
    });
  }

  open(): void {
    this.state.set('open');
    // Forzar apertura si el model ya era 'open' (p. ej. reemplazo de petición).
    this.brn.open();
  }

  close(result?: unknown): void {
    this.brn.close(result);
  }

  protected onConfirm(): void {
    if (this.loading()) {
      return;
    }
    this.confirmed.emit();
    if (this.confirmation.activeRequest()) {
      this.confirmation.settle('confirmed');
      return;
    }
    this.brn.close('confirmed');
  }

  protected onCancel(): void {
    if (this.loading()) {
      return;
    }
    this.cancelled.emit();
    if (this.confirmation.activeRequest()) {
      this.confirmation.settle('cancelled');
      return;
    }
    this.brn.close('cancelled');
  }
}
