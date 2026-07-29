import {
  booleanAttribute,
  Component,
  computed,
  Directive,
  effect,
  inject,
  input,
  model,
  TemplateRef,
  untracked,
} from '@angular/core';
import {
  BrnDialog,
  BrnDialogClose,
  BrnDialogDescription,
  BrnDialogOverlay,
  BrnDialogRef,
  BrnDialogTitle,
  provideBrnDialogDefaultOptions,
} from '@spartan-ng/brain/dialog';
import { WiButtonComponent } from '@wiloc/ui/button';
import { WiIconComponent } from '@wiloc/ui/icon';

import { WI_DIALOG_SIZE } from './wi-dialog.tokens';
import type { WiDialogSize, WiDialogState } from './wi-dialog.types';

const OVERLAY_CLASSES = [
  'wi-dialog__overlay',
  'bg-on-background/50',
  'data-[state=open]:animate-in',
  'data-[state=closed]:animate-out',
  'data-[state=closed]:fade-out-0',
  'data-[state=open]:fade-in-0',
].join(' ');

/** Pane CDK: ancho concreto (sin `w-full`) para que el position strategy centre bien. */
const PANEL_BASE_CLASSES = 'wi-dialog__pane';

const CONTENT_BASE_CLASSES = [
  'wi-dialog__content',
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

/** Anchos fijos (no solo max-w): el pane toma tamaño y CDK lo centra. */
const SIZE_WIDTH_CLASSES: Record<WiDialogSize, string> = {
  sm: 'w-[min(calc(100vw-2rem),24rem)]',
  md: 'w-[min(calc(100vw-2rem),32rem)]',
  lg: 'w-[min(calc(100vw-2rem),42rem)]',
};

function panelClassesForSize(size: WiDialogSize): string {
  return [PANEL_BASE_CLASSES, SIZE_WIDTH_CLASSES[size]].join(' ');
}

let triggerIdSequence = 0;

/**
 * Overlay (backdrop) del dialog. Registra clases en Brain; no se usa fuera de `wi-dialog`.
 */
@Directive({
  selector: '[wiDialogOverlay]',
  hostDirectives: [
    {
      directive: BrnDialogOverlay,
      inputs: ['class'],
    },
  ],
})
export class WiDialogOverlayDirective {}

/**
 * Cierra el dialog al hacer click (nativo o host de `wi-button`).
 */
@Directive({
  selector: 'button[wiDialogClose], [wiDialogClose]',
  hostDirectives: [BrnDialogClose],
})
export class WiDialogCloseDirective {}

/**
 * Dialog modal del design system (`wi-dialog`).
 *
 * Composición: trigger + portal con header / title / description / content / footer.
 * Brain (CDK) gestiona portal, foco, Escape y restore focus; la API pública no expone tipos Spartan.
 *
 * El icono `x-mark` del botón cerrar debe registrarse con `provideWiIcons` en la app.
 */
@Component({
  selector: 'wi-dialog',
  exportAs: 'wiDialog',
  imports: [WiDialogOverlayDirective],
  providers: [
    {
      provide: WI_DIALOG_SIZE,
      useFactory: () => inject(WiDialogComponent).size,
    },
    provideBrnDialogDefaultOptions({
      hasBackdrop: true,
      closeOnOutsidePointerEvents: false,
      restoreFocus: true,
      autoFocus: 'first-tabbable',
    }),
  ],
  hostDirectives: [
    {
      directive: BrnDialog,
      inputs: ['id', 'disableClose', 'hasBackdrop', 'closeOnOutsidePointerEvents'],
      outputs: ['closed', 'stateChanged'],
    },
  ],
  host: {
    class: 'wi-dialog contents',
  },
  template: `
    <div wiDialogOverlay [class]="overlayClasses"></div>
    <ng-content />
  `,
})
export class WiDialogComponent {
  private readonly brn = inject(BrnDialog);

  /** Estado controlado (two-way). */
  readonly state = model<WiDialogState>('closed');

  /** Ancho del panel: sm → max-w-sm, md → max-w-lg, lg → max-w-2xl. */
  readonly size = input<WiDialogSize>('md');

  /** Id del dialog (Brain); útil para `aria-controls` del trigger. */
  readonly dialogId = computed(() => this.brn.id());

  protected readonly overlayClasses = OVERLAY_CLASSES;

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
}

/**
 * Registra el template del panel (`ng-template` o `*wiDialogPortal`).
 * El `panelClass` del pane CDK sigue el `size` de `wi-dialog` de forma reactiva.
 *
 * @example
 * ```html
 * <ng-template wiDialogPortal>
 *   <wi-dialog-content>...</wi-dialog-content>
 * </ng-template>
 * ```
 */
@Directive({
  selector: '[wiDialogPortal]',
})
export class WiDialogPortalDirective {
  private readonly dialog = inject(WiDialogComponent);
  private readonly brn = inject(BrnDialog);
  private readonly template = inject(TemplateRef);

  readonly context = input<Record<string, unknown> | undefined>(undefined);

  private readonly panelClass = computed(() => panelClassesForSize(this.dialog.size()));

  private readonly contextSignal = computed(() => this.context());

  constructor() {
    this.brn.registerContent(this.template, this.contextSignal, this.panelClass);
  }
}

/**
 * Abre el dialog al hacer click.
 *
 * @example
 * ```html
 * <wi-button wiDialogTrigger>Abrir</wi-button>
 * <button type="button" [wiDialogTriggerFor]="dialog">Abrir</button>
 * ```
 */
@Directive({
  selector:
    'button[wiDialogTrigger], [wiDialogTrigger], button[wiDialogTriggerFor], [wiDialogTriggerFor]',
  exportAs: 'wiDialogTrigger',
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
export class WiDialogTriggerDirective {
  private readonly injectedDialog = inject(WiDialogComponent, { optional: true });
  private readonly brnDialog = inject(BrnDialog, { optional: true });

  readonly id = input(`wi-dialog-trigger-${++triggerIdSequence}`);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly wiDialogTriggerFor = input<WiDialogComponent | undefined>(undefined);

  protected readonly state = computed(
    () => this.resolveDialog()?.state() ?? this.brnDialog?.stateComputed() ?? 'closed',
  );

  protected readonly dialogId = computed(() => {
    const dialog = this.resolveDialog();
    if (dialog) {
      return dialog.dialogId();
    }
    return this.brnDialog?.id() ?? null;
  });

  private resolveDialog(): WiDialogComponent | null {
    return this.wiDialogTriggerFor() ?? this.injectedDialog ?? null;
  }

  open(): void {
    const dialog = this.resolveDialog();
    if (dialog) {
      dialog.open();
      return;
    }
    this.brnDialog?.open();
  }
}

@Component({
  selector: 'wi-dialog-content',
  imports: [WiButtonComponent, WiIconComponent, WiDialogCloseDirective],
  host: {
    'data-slot': 'dialog-content',
    '[attr.data-state]': 'state()',
    '[class]': 'classes()',
  },
  template: `
    <ng-content />

    @if (showCloseButton()) {
      <wi-button
        type="button"
        variant="ghost"
        size="sm"
        iconOnly
        class="wi-dialog__close absolute inset-e-4 top-4"
        wiDialogClose
        [ariaLabel]="closeLabel()"
      >
        <wi-icon name="x-mark" size="sm" />
      </wi-button>
    }
  `,
})
export class WiDialogContentComponent {
  private readonly dialogRef = inject(BrnDialogRef, { optional: true });
  private readonly sizeFromDialog = inject(WI_DIALOG_SIZE, { optional: true });

  /** Anula el size del root cuando se define en el panel. */
  readonly size = input<WiDialogSize | null>(null);

  readonly showCloseButton = input(true, { transform: booleanAttribute });

  /** Nombre accesible del botón cerrar (la app puede i18n). */
  readonly closeLabel = input('Cerrar');

  protected readonly state = computed(() => this.dialogRef?.state() ?? 'closed');

  protected readonly classes = computed(() => {
    const size = this.size() ?? this.sizeFromDialog?.() ?? 'md';
    return [CONTENT_BASE_CLASSES, SIZE_WIDTH_CLASSES[size]].join(' ');
  });
}

@Component({
  selector: 'wi-dialog-header',
  host: {
    'data-slot': 'dialog-header',
    class: 'wi-dialog__header flex flex-col gap-1 text-start',
  },
  template: `<ng-content />`,
})
export class WiDialogHeaderComponent {}

@Component({
  selector: 'wi-dialog-title',
  hostDirectives: [BrnDialogTitle],
  host: {
    'data-slot': 'dialog-title',
    class: 'wi-dialog__title text-base leading-none font-semibold text-on-surface',
  },
  template: `<ng-content />`,
})
export class WiDialogTitleComponent {}

@Component({
  selector: 'wi-dialog-description',
  hostDirectives: [BrnDialogDescription],
  host: {
    'data-slot': 'dialog-description',
    class: 'wi-dialog__description text-sm text-on-surface-variant',
  },
  template: `<ng-content />`,
})
export class WiDialogDescriptionComponent {}

@Component({
  selector: 'wi-dialog-footer',
  host: {
    'data-slot': 'dialog-footer',
    class: 'wi-dialog__footer flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-2',
  },
  template: `<ng-content />`,
})
export class WiDialogFooterComponent {}
