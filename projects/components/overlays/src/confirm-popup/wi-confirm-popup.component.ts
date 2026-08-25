import {
  booleanAttribute,
  Component,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  model,
  output,
  TemplateRef,
  untracked,
} from '@angular/core';
import { BrnOverlay } from '@spartan-ng/brain/overlay';
import {
  BRN_POPOVER_OVERLAY_DEFAULT_OPTIONS,
  BrnPopover,
  provideBrnPopoverConfig,
  provideBrnPopoverDefaultOptions,
} from '@spartan-ng/brain/popover';
import { WiButtonComponent } from '@wiloc/ui/button';

import { injectWiOverlaysI18n } from '../wi-overlays.i18n';
import type {
  WiConfirmPopupConfirmVariant,
  WiConfirmPopupSize,
  WiConfirmPopupState,
} from './wi-confirm-popup.types';

const PANEL_BASE_CLASSES = 'wi-confirm-popup__pane';

const CONTENT_BASE_CLASSES = [
  'wi-confirm-popup__content',
  'relative',
  'grid',
  'w-full',
  'gap-3',
  'rounded-control',
  'border',
  'border-outline-variant',
  'bg-surface',
  'p-4',
  'text-sm',
  'text-on-surface',
  'shadow-md',
  'outline-none',
  'data-[state=open]:animate-in',
  'data-[state=closed]:animate-out',
  'data-[state=closed]:fade-out-0',
  'data-[state=open]:fade-in-0',
  'data-[state=closed]:zoom-out-95',
  'data-[state=open]:zoom-in-95',
].join(' ');

const SIZE_WIDTH_CLASSES: Record<WiConfirmPopupSize, string> = {
  sm: 'w-[min(calc(100vw-2rem),18rem)]',
  md: 'w-[min(calc(100vw-2rem),24rem)]',
};

function panelClassesForSize(size: WiConfirmPopupSize): string {
  return [PANEL_BASE_CLASSES, SIZE_WIDTH_CLASSES[size]].join(' ');
}

let triggerIdSequence = 0;
let titleIdSequence = 0;

/**
 * Registra el template del panel. Uso interno de `wi-confirm-popup`.
 */
@Directive({
  selector: '[wiConfirmPopupPortal]',
})
export class WiConfirmPopupPortalDirective {
  private readonly confirm = inject(WiConfirmPopupComponent);
  private readonly overlay = inject(BrnOverlay);
  private readonly template = inject(TemplateRef);

  private readonly panelClass = computed(() => panelClassesForSize(this.confirm.size()));

  constructor() {
    this.overlay.registerContent(
      this.template,
      computed(() => undefined),
      this.panelClass,
    );
  }
}

/**
 * Abre el confirm popup anclado al host al hacer click.
 *
 * @example
 * ```html
 * <wi-button wiConfirmPopupTrigger>Eliminar</wi-button>
 * <button type="button" [wiConfirmPopupTriggerFor]="confirm">Eliminar</button>
 * ```
 */
@Directive({
  selector:
    'button[wiConfirmPopupTrigger], [wiConfirmPopupTrigger], button[wiConfirmPopupTriggerFor], [wiConfirmPopupTriggerFor]',
  exportAs: 'wiConfirmPopupTrigger',
  host: {
    '[id]': 'id()',
    '(click)': 'open()',
    'aria-haspopup': 'dialog',
    '[attr.aria-expanded]': "state() === 'open' ? 'true' : 'false'",
    '[attr.data-state]': 'state()',
    '[attr.aria-controls]': 'overlayId()',
    '[attr.type]': 'type()',
  },
})
export class WiConfirmPopupTriggerDirective {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly injectedConfirm = inject(WiConfirmPopupComponent, { optional: true });
  private readonly brnOverlay = inject(BrnOverlay, { optional: true });

  readonly id = input(`wi-confirm-popup-trigger-${++triggerIdSequence}`);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly wiConfirmPopupTriggerFor = input<WiConfirmPopupComponent | undefined>(undefined);

  protected readonly state = computed(
    () => this.resolveConfirm()?.state() ?? this.brnOverlay?.stateComputed() ?? 'closed',
  );

  protected readonly overlayId = computed(() => {
    const confirm = this.resolveConfirm();
    if (confirm) {
      return confirm.overlayId();
    }
    return this.brnOverlay?.id() ?? null;
  });

  private resolveConfirm(): WiConfirmPopupComponent | null {
    return this.wiConfirmPopupTriggerFor() ?? this.injectedConfirm ?? null;
  }

  open(): void {
    const confirm = this.resolveConfirm();
    if (confirm) {
      confirm.open(this.host.nativeElement);
      return;
    }
    this.brnOverlay?.setOrigin(this.host.nativeElement);
    this.brnOverlay?.open();
  }
}

/**
 * Confirmación compacta anclada al trigger (`wi-confirm-popup`).
 *
 * Pattern sobre popover: título / descripción / cancelar / confirmar, sin backdrop modal.
 * Cierra con Escape y clic fuera. Los textos los aporta la app (i18n).
 *
 * ```html
 * <wi-confirm-popup
 *   title="Eliminar sitio"
 *   description="Esta acción no se puede deshacer."
 *   confirmLabel="Eliminar"
 *   confirmVariant="danger"
 *   (confirmed)="onConfirm()"
 *   (cancelled)="onCancel()"
 * >
 *   <wi-button type="button" wiConfirmPopupTrigger>Eliminar</wi-button>
 * </wi-confirm-popup>
 * ```
 */
@Component({
  selector: 'wi-confirm-popup',
  exportAs: 'wiConfirmPopup',
  imports: [WiConfirmPopupPortalDirective, WiButtonComponent],
  providers: [
    provideBrnPopoverConfig({ align: 'center', sideOffset: 8, offsetX: 0 }),
    provideBrnPopoverDefaultOptions({
      ...BRN_POPOVER_OVERLAY_DEFAULT_OPTIONS,
      hasBackdrop: false,
      closeOnOutsidePointerEvents: true,
      disableClose: false,
      autoFocus: true,
      role: 'alertdialog',
      scrollStrategy: 'reposition',
    }),
  ],
  hostDirectives: [
    {
      directive: BrnPopover,
      inputs: [
        'id',
        'align',
        'sideOffset',
        'offsetX',
        'disableClose',
        'closeOnOutsidePointerEvents',
      ],
      outputs: ['closed', 'stateChanged'],
    },
  ],

  host: {
    class: 'wi-confirm-popup contents',
  },
  template: `
    <ng-content />

    <ng-template wiConfirmPopupPortal>
      <div
        data-slot="confirm-popup-content"
        role="presentation"
        [attr.data-state]="panelState()"
        [attr.aria-labelledby]="titleDomId"
        [attr.aria-describedby]="description() ? descriptionDomId : null"
        [class]="contentClasses()"
      >
        <div
          data-slot="confirm-popup-header"
          class="wi-confirm-popup__header flex flex-col gap-1 text-start"
        >
          <h2
            [id]="titleDomId"
            data-slot="confirm-popup-title"
            class="wi-confirm-popup__title text-sm leading-none font-semibold text-on-surface"
          >
            {{ title() }}
          </h2>
          @if (description()) {
            <p
              [id]="descriptionDomId"
              data-slot="confirm-popup-description"
              class="wi-confirm-popup__description text-sm text-on-surface-variant"
            >
              {{ description() }}
            </p>
          }
        </div>

        <div
          data-slot="confirm-popup-footer"
          class="wi-confirm-popup__footer flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-2"
        >
          @if (showCancel()) {
            <wi-button
              type="button"
              variant="secondary"
              size="sm"
              [disabled]="loading()"
              (click)="onCancel()"
            >
              {{ resolvedCancelLabel() }}
            </wi-button>
          }
          <wi-button
            type="button"
            size="sm"
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
export class WiConfirmPopupComponent {
  private readonly brn = inject(BrnPopover);
  private readonly overlaysI18n = injectWiOverlaysI18n();

  protected readonly titleDomId = `wi-confirm-popup-title-${++titleIdSequence}`;
  protected readonly descriptionDomId = `wi-confirm-popup-description-${titleIdSequence}`;

  /** Estado controlado (two-way). Preferible abrir vía trigger para anclar al origen. */
  readonly state = model<WiConfirmPopupState>('closed');

  /** Ancho del panel: sm → 18rem, md → 24rem. */
  readonly size = input<WiConfirmPopupSize>('sm');

  /** Título accesible (obligatorio; lo aporta la app). */
  readonly title = input.required<string>();

  /** Descripción opcional. */
  readonly description = input<string | undefined>(undefined);

  /** Label del botón de confirmación (obligatorio; lo aporta la app). */
  readonly confirmLabel = input.required<string>();

  /** Override de `provideWiOverlaysI18n` (`confirmCancelLabel`). */
  readonly cancelLabel = input<string | undefined>(undefined);

  /** Variante visual del botón de confirmación. */
  readonly confirmVariant = input<WiConfirmPopupConfirmVariant>('primary');

  /** Muestra el botón de cancelar. */
  readonly showCancel = input(true, { transform: booleanAttribute });

  /** Estado de carga en la acción de confirmar (deshabilita cancelar). */
  readonly loading = input(false, { transform: booleanAttribute });

  /** Se emite al pulsar confirmar (antes de cerrar). */
  readonly confirmed = output<void>();

  /** Se emite al pulsar cancelar (antes de cerrar). */
  readonly cancelled = output<void>();

  /** Id del overlay (Brain); útil para `aria-controls` del trigger. */
  readonly overlayId = computed(() => this.brn.id());

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

    effect(() => {
      const open = this.brn.stateComputed() === 'open';
      const labelledBy = this.titleDomId;
      const describedBy = this.description() ? this.descriptionDomId : null;
      untracked(() => {
        if (!open) {
          return;
        }
        queueMicrotask(() => {
          const pane = document.getElementById(this.brn.id());
          if (!pane) {
            return;
          }
          pane.setAttribute('aria-labelledby', labelledBy);
          if (describedBy) {
            pane.setAttribute('aria-describedby', describedBy);
          } else {
            pane.removeAttribute('aria-describedby');
          }
          pane.setAttribute('aria-modal', 'false');
        });
      });
    });
  }

  /**
   * Abre el popup. Si se pasa `origin`, ancla el panel a ese elemento
   * (el trigger lo hace automáticamente).
   */
  open(origin?: HTMLElement): void {
    if (origin) {
      this.brn.setOrigin(origin);
    }
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
