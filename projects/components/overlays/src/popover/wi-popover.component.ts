import { DOCUMENT } from '@angular/common';
import {
  booleanAttribute,
  Component,
  computed,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  model,
  signal,
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

import { bindOutsidePointerDismiss } from '../outside-pointer-dismiss';
import { WI_POPOVER_SIZE } from './wi-popover.tokens';
import type { WiPopoverSize, WiPopoverState } from './wi-popover.types';

const PANEL_BASE_CLASSES = 'wi-popover__pane';

const CONTENT_BASE_CLASSES = [
  'wi-popover__content',
  'relative',
  'flex',
  'min-w-0',
  'w-full',
  'flex-col',
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

const SIZE_WIDTH_CLASSES: Record<WiPopoverSize, string> = {
  sm: 'w-[min(calc(100vw-2rem),18rem)]',
  md: 'w-[min(calc(100vw-2rem),24rem)]',
};

function panelClassesForSize(size: WiPopoverSize): string {
  return [PANEL_BASE_CLASSES, SIZE_WIDTH_CLASSES[size]].join(' ');
}

let triggerIdSequence = 0;
let titleIdSequence = 0;
let descriptionIdSequence = 0;

/**
 * Overlay no modal anclado al trigger (`wi-popover`).
 *
 * Composición: trigger + portal con header / title / description / content.
 * Sin backdrop; cierra con Escape y clic fuera. Un overlay CDK anidado (p. ej. `wi-select`)
 * no cuenta como "fuera". Brain (CDK) gestiona portal, foco y restore; la API pública no
 * expone tipos Spartan.
 *
 * Para listas de acciones usar `wi-menu`. Para confirmación compacta, `wi-confirm-popup`.
 *
 * ```html
 * <wi-popover>
 *   <wi-button type="button" wiPopoverTrigger>Abrir</wi-button>
 *   <ng-template wiPopoverPortal>
 *     <wi-popover-content>
 *       <wi-popover-header>
 *         <wi-popover-title>Título</wi-popover-title>
 *         <wi-popover-description>Descripción</wi-popover-description>
 *       </wi-popover-header>
 *       <wi-button type="button" wiPopoverClose>Cerrar</wi-button>
 *     </wi-popover-content>
 *   </ng-template>
 * </wi-popover>
 * ```
 */
@Component({
  selector: 'wi-popover',
  exportAs: 'wiPopover',
  providers: [
    {
      provide: WI_POPOVER_SIZE,
      useFactory: () => inject(WiPopoverComponent).size,
    },
    provideBrnPopoverConfig({ align: 'center', sideOffset: 8, offsetX: 0 }),
    provideBrnPopoverDefaultOptions({
      ...BRN_POPOVER_OVERLAY_DEFAULT_OPTIONS,
      hasBackdrop: false,
      // El outside-click lo filtra `bindOutsidePointerDismiss` (overlays CDK anidados).
      closeOnOutsidePointerEvents: false,
      disableClose: false,
      autoFocus: true,
      role: 'dialog',
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
        'autoFocus',
      ],
      outputs: ['closed', 'stateChanged'],
    },
  ],
  host: {
    class: 'wi-popover contents',
  },
  template: `<ng-content />`,
})
export class WiPopoverComponent {
  private readonly brn = inject(BrnPopover);
  private readonly document = inject(DOCUMENT);
  private readonly host = inject(ElementRef<HTMLElement>);
  private origin: HTMLElement | undefined;

  /** Estado controlado (two-way). Preferible abrir vía trigger para anclar al origen. */
  readonly state = model<WiPopoverState>('closed');

  /** Ancho del panel: sm → 18rem, md → 24rem. */
  readonly size = input<WiPopoverSize>('sm');

  /**
   * Cierra al clic fuera del panel y de overlays CDK anidados (p. ej. `wi-select`).
   * El trigger / origen no cuenta como fuera (el toggle cierra sin reabrir).
   */
  readonly closeOnOutsidePointerEvents = input(true, { transform: booleanAttribute });

  /**
   * Nombre accesible del panel cuando no hay `wi-popover-title`.
   * Lo aporta la app (i18n).
   */
  readonly ariaLabel = input<string | undefined>(undefined);

  /** Id del overlay (Brain); útil para `aria-controls` del trigger. */
  readonly overlayId = computed(() => this.brn.id());

  private readonly titleId = signal<string | null>(null);
  private readonly descriptionId = signal<string | null>(null);

  constructor() {
    effect(() => {
      const desired = this.state();
      untracked(() => {
        const actual = this.brn.stateComputed();
        if (desired === 'open' && actual !== 'open') {
          this.brn.open();
        } else if (desired === 'closed' && actual === 'open') {
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
      const labelledBy = this.titleId();
      const describedBy = this.descriptionId();
      const ariaLabel = this.ariaLabel();
      untracked(() => {
        if (!open) {
          return;
        }
        queueMicrotask(() => {
          const pane = this.document.getElementById(this.brn.id());
          if (!pane) {
            return;
          }
          pane.setAttribute('aria-modal', 'false');
          if (labelledBy) {
            pane.setAttribute('aria-labelledby', labelledBy);
            pane.removeAttribute('aria-label');
          } else if (ariaLabel) {
            pane.setAttribute('aria-label', ariaLabel);
            pane.removeAttribute('aria-labelledby');
          }
          if (describedBy) {
            pane.setAttribute('aria-describedby', describedBy);
          } else {
            pane.removeAttribute('aria-describedby');
          }
        });
      });
    });

    bindOutsidePointerDismiss({
      document: this.document,
      isOpen: () => this.brn.stateComputed() === 'open',
      enabled: () => this.closeOnOutsidePointerEvents(),
      overlayId: () => this.brn.id(),
      isInsideHost: (target) =>
        this.host.nativeElement.contains(target) || (this.origin?.contains(target) ?? false),
      close: () => this.close(),
    });
  }

  /**
   * Abre el popover. Si se pasa `origin`, ancla el panel a ese elemento
   * (el trigger lo hace automáticamente).
   *
   * El origen debe fijarse **antes** de `open()`: sin él Brain centra el panel
   * en el viewport en lugar de anclarlo al trigger.
   */
  open(origin?: HTMLElement): void {
    if (origin) {
      this.brn.setOrigin(origin);
      this.origin = origin;
    }
    // Abrir en el mismo turno que setOrigin (no solo vía effect de `state`).
    this.brn.open();
    this.state.set('open');
  }

  close(result?: unknown): void {
    this.brn.close(result);
    this.state.set('closed');
  }

  /** @internal */
  registerTitleId(id: string | null): void {
    this.titleId.set(id);
  }

  /** @internal */
  registerDescriptionId(id: string | null): void {
    this.descriptionId.set(id);
  }
}

/**
 * Registra el template del panel (`ng-template` o `*wiPopoverPortal`).
 * El `panelClass` del pane CDK sigue el `size` de `wi-popover` de forma reactiva.
 *
 * @example
 * ```html
 * <ng-template wiPopoverPortal>
 *   <wi-popover-content>...</wi-popover-content>
 * </ng-template>
 * ```
 */
@Directive({
  selector: '[wiPopoverPortal]',
})
export class WiPopoverPortalDirective {
  private readonly popover = inject(WiPopoverComponent);
  private readonly overlay = inject(BrnOverlay);
  private readonly template = inject(TemplateRef);

  readonly context = input<Record<string, unknown> | undefined>(undefined);

  private readonly panelClass = computed(() => panelClassesForSize(this.popover.size()));

  private readonly contextSignal = computed(() => this.context());

  constructor() {
    this.overlay.registerContent(this.template, this.contextSignal, this.panelClass);
  }
}

/**
 * Abre o cierra el popover anclado al host al hacer click.
 *
 * @example
 * ```html
 * <wi-button wiPopoverTrigger>Abrir</wi-button>
 * <button type="button" [wiPopoverTriggerFor]="popover">Abrir</button>
 * ```
 */
@Directive({
  selector:
    'button[wiPopoverTrigger], [wiPopoverTrigger], button[wiPopoverTriggerFor], [wiPopoverTriggerFor]',
  exportAs: 'wiPopoverTrigger',
  host: {
    '[id]': 'id()',
    '(click)': 'toggle()',
    'aria-haspopup': 'dialog',
    '[attr.aria-expanded]': "state() === 'open' ? 'true' : 'false'",
    '[attr.data-state]': 'state()',
    '[attr.aria-controls]': 'overlayId()',
    '[attr.type]': 'type()',
  },
})
export class WiPopoverTriggerDirective {
  private readonly host = inject(ElementRef<HTMLElement>, { host: true });
  private readonly injectedPopover = inject(WiPopoverComponent, { optional: true });
  private readonly brnOverlay = inject(BrnOverlay, { optional: true });

  readonly id = input(`wi-popover-trigger-${++triggerIdSequence}`);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly wiPopoverTriggerFor = input<WiPopoverComponent | undefined>(undefined);

  protected readonly state = computed(
    () => this.resolvePopover()?.state() ?? this.brnOverlay?.stateComputed() ?? 'closed',
  );

  protected readonly overlayId = computed(() => {
    const popover = this.resolvePopover();
    if (popover) {
      return popover.overlayId();
    }
    return this.brnOverlay?.id() ?? null;
  });

  private resolvePopover(): WiPopoverComponent | null {
    return this.wiPopoverTriggerFor() ?? this.injectedPopover ?? null;
  }

  /** Ancla medible: el `button` interno de `wi-button`, o el host nativo. */
  private resolveAnchor(): HTMLElement {
    const host = this.host.nativeElement;
    if (host.tagName === 'BUTTON') {
      return host;
    }
    return host.querySelector('button') ?? host;
  }

  toggle(): void {
    const anchor = this.resolveAnchor();
    const popover = this.resolvePopover();
    if (popover) {
      if (popover.state() === 'open') {
        popover.close();
        return;
      }
      popover.open(anchor);
      return;
    }
    this.brnOverlay?.setOrigin(anchor);
    this.brnOverlay?.toggle();
  }
}

/**
 * Cierra el popover al hacer click (nativo o host de `wi-button`).
 */
@Directive({
  selector: 'button[wiPopoverClose], [wiPopoverClose]',
  host: {
    '(click)': 'close()',
  },
})
export class WiPopoverCloseDirective {
  private readonly popover = inject(WiPopoverComponent, { optional: true });
  private readonly overlay = inject(BrnOverlay, { optional: true });

  close(): void {
    if (this.popover) {
      this.popover.close();
      return;
    }
    this.overlay?.close();
  }
}

@Component({
  selector: 'wi-popover-content',
  host: {
    'data-slot': 'popover-content',
    '[attr.data-state]': 'state()',
    '[class]': 'classes()',
  },
  template: `<ng-content />`,
})
export class WiPopoverContentComponent {
  private readonly overlay = inject(BrnOverlay, { optional: true });
  private readonly sizeFromPopover = inject(WI_POPOVER_SIZE, { optional: true });

  /** Anula el size del root cuando se define en el panel. */
  readonly size = input<WiPopoverSize | null>(null);

  protected readonly state = computed(() => this.overlay?.stateComputed() ?? 'closed');

  protected readonly classes = computed(() => {
    const size = this.size() ?? this.sizeFromPopover?.() ?? 'sm';
    return [CONTENT_BASE_CLASSES, SIZE_WIDTH_CLASSES[size]].join(' ');
  });
}

@Component({
  selector: 'wi-popover-header',
  host: {
    'data-slot': 'popover-header',
    class: 'wi-popover__header flex min-w-0 flex-col gap-1 text-start',
  },
  template: `<ng-content />`,
})
export class WiPopoverHeaderComponent {}

@Component({
  selector: 'wi-popover-title',
  host: {
    '[id]': 'domId',
    'data-slot': 'popover-title',
    class: 'wi-popover__title text-sm leading-none font-semibold text-on-surface',
  },
  template: `<ng-content />`,
})
export class WiPopoverTitleComponent {
  private readonly popover = inject(WiPopoverComponent, { optional: true });
  protected readonly domId = `wi-popover-title-${++titleIdSequence}`;

  constructor() {
    this.popover?.registerTitleId(this.domId);
    inject(DestroyRef).onDestroy(() => this.popover?.registerTitleId(null));
  }
}

@Component({
  selector: 'wi-popover-description',
  host: {
    '[id]': 'domId',
    'data-slot': 'popover-description',
    class: 'wi-popover__description text-sm text-on-surface-variant',
  },
  template: `<ng-content />`,
})
export class WiPopoverDescriptionComponent {
  private readonly popover = inject(WiPopoverComponent, { optional: true });
  protected readonly domId = `wi-popover-description-${++descriptionIdSequence}`;

  constructor() {
    this.popover?.registerDescriptionId(this.domId);
    inject(DestroyRef).onDestroy(() => this.popover?.registerDescriptionId(null));
  }
}
