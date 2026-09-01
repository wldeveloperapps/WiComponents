import { DOCUMENT } from '@angular/common';
import {
  booleanAttribute,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { WiIconComponent } from '@wiloc/ui/icon';

import type { WiSpeedDialDirection, WiSpeedDialItem } from './wi-speed-dial.types';
import { WiTooltipDirective } from '../tooltip/wi-tooltip.directive';
import { injectWiOverlaysI18n } from '../wi-overlays.i18n';

const TRIGGER_CLASSES = [
  'inline-flex',
  'size-8',
  'shrink-0',
  'items-center',
  'justify-center',
  'rounded-full',
  'text-on-surface-variant',
  'transition-colors',
  'outline-none',
  'hover:bg-surface-variant',
  'focus-visible:ring-2',
  'focus-visible:ring-ring',
  'focus-visible:ring-offset-2',
  'focus-visible:ring-offset-background',
  'disabled:pointer-events-none',
  'disabled:opacity-50',
].join(' ');

const ACTION_CLASSES = [
  'inline-flex',
  'size-8',
  'shrink-0',
  'items-center',
  'justify-center',
  'rounded-full',
  'text-on-surface-variant',
  'transition-colors',
  'outline-none',
  'hover:bg-surface-variant',
  'hover:text-on-surface',
  'focus-visible:ring-2',
  'focus-visible:ring-ring',
  'focus-visible:ring-offset-2',
  'focus-visible:ring-offset-background',
  'disabled:pointer-events-none',
  'disabled:opacity-50',
].join(' ');

const TOOLBAR_BASE_CLASSES = [
  'inline-flex',
  'items-center',
  'gap-0.5',
  'text-on-surface-variant',
].join(' ');

const DIRECTION_TOOLBAR_CLASSES: Record<WiSpeedDialDirection, string> = {
  left: 'flex-row',
  right: 'flex-row',
  up: 'flex-col-reverse',
  down: 'flex-col',
};

/**
 * Speed dial de acciones compactas (`wi-speed-dial`).
 *
 * 1. Cerrado → se ve el botón de tres puntos.
 * 2. Clic → se muestran las acciones de `items` y un botón X para cerrar.
 * 3. Clic en una acción → emite `itemClick` (la app decide qué hacer).
 * 4. Clic en X, Escape o fuera → cierra el dial.
 *
 * Cada acción icon-only muestra tooltip con `item.label` (desactivable con
 * `[tooltips]="false"`). El nombre accesible sigue en `aria-label`.
 *
 * ```html
 * <wi-speed-dial [items]="actions" (itemClick)="onAction($event)" />
 * ```
 */
@Component({
  selector: 'wi-speed-dial',
  imports: [WiIconComponent, WiTooltipDirective],
  host: {
    'data-slot': 'speed-dial',
    '[attr.data-state]': 'open() ? "open" : "closed"',
    '[attr.data-direction]': 'direction()',
    class: 'wi-speed-dial relative inline-flex',
  },
  template: `
    @if (!open()) {
      <button
        type="button"
        [class]="triggerClasses"
        [disabled]="disabled() || !hasItems()"
        [attr.aria-label]="ariaLabel()"
        [attr.aria-expanded]="false"
        [attr.aria-haspopup]="'true'"
        [wiTooltip]="tooltips() ? ariaLabel() : null"
        position="top"
        (click)="openDial($event)"
      >
        <wi-icon [name]="triggerIcon()" size="sm" />
      </button>
    } @else {
      <div
        role="toolbar"
        tabindex="-1"
        [attr.aria-label]="ariaLabel()"
        [class]="toolbarClasses()"
        (keydown)="onToolbarKeydown($event)"
      >
        <button
          type="button"
          [class]="triggerClasses"
          [attr.aria-label]="resolvedCloseLabel()"
          [attr.aria-expanded]="true"
          [attr.aria-haspopup]="'true'"
          data-speed-dial-close
          [wiTooltip]="tooltips() ? resolvedCloseLabel() : null"
          position="top"
          (click)="closeDial($event)"
        >
          <wi-icon name="x-mark" size="sm" />
        </button>
        @for (item of items(); track item.id; let i = $index) {
          <button
            type="button"
            [class]="actionClasses"
            [disabled]="disabled() || !!item.disabled"
            [attr.aria-label]="item.label"
            [attr.data-item-id]="item.id"
            [attr.tabindex]="i === 0 ? 0 : -1"
            [wiTooltip]="tooltips() ? item.label : null"
            position="top"
            (click)="onItemClick($event, item)"
          >
            <wi-icon [name]="item.icon" size="sm" />
          </button>
        }
      </div>
    }
  `,
})
export class WiSpeedDialComponent {
  private readonly document = inject(DOCUMENT);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly overlaysI18n = injectWiOverlaysI18n();

  /** Acciones al abrir. Las define la app: `{ id, icon, label }`. */
  readonly items = input<readonly WiSpeedDialItem[]>([]);

  /** Dirección del despliegue. */
  readonly direction = input<WiSpeedDialDirection>('left');

  /** Abierto / cerrado (two-way). */
  readonly open = model(false);

  /** Deshabilita trigger y acciones. */
  readonly disabled = input(false, { transform: booleanAttribute });

  /** Cierra al elegir una acción. */
  readonly closeOnSelect = input(true, { transform: booleanAttribute });

  /**
   * Muestra `[wiTooltip]` con el label en trigger y acciones.
   * El `aria-label` sigue siendo el nombre accesible.
   */
  readonly tooltips = input(true, { transform: booleanAttribute });

  /** Nombre accesible (localizable en la app). */
  readonly ariaLabel = input('Acciones', { alias: 'aria-label' });

  /** Icono del trigger cerrado. */
  readonly triggerIcon = input('ellipsis-vertical');

  /** `aria-label` del botón X. Default: `provideWiOverlaysI18n().dialogCloseLabel`. */
  readonly closeLabel = input<string | undefined>(undefined);

  /** La app escucha esto para ejecutar la acción (`$event.id`). */
  readonly itemClick = output<WiSpeedDialItem>();

  protected readonly triggerClasses = TRIGGER_CLASSES;
  protected readonly actionClasses = ACTION_CLASSES;

  protected readonly hasItems = computed(() => this.items().length > 0);

  protected readonly resolvedCloseLabel = computed(
    () => this.closeLabel() ?? this.overlaysI18n.dialogCloseLabel(),
  );

  protected readonly toolbarClasses = computed(
    () => `${TOOLBAR_BASE_CLASSES} ${DIRECTION_TOOLBAR_CLASSES[this.direction()]}`,
  );

  constructor() {
    effect((onCleanup) => {
      if (!this.open() || this.disabled()) {
        return;
      }

      // Ignorar gestos del mismo tick / Storybook al montar abierto.
      const openedAt = Date.now();

      const onPointerDown = (event: Event): void => {
        if (Date.now() - openedAt < 150) {
          return;
        }
        const target = event.target;
        if (!(target instanceof Node)) {
          return;
        }
        if (!this.elementRef.nativeElement.contains(target)) {
          this.open.set(false);
        }
      };

      const onKeyDown = (event: KeyboardEvent): void => {
        if (event.key === 'Escape') {
          event.preventDefault();
          this.open.set(false);
          this.focusTrigger();
        }
      };

      const timerId = this.document.defaultView?.setTimeout(() => {
        this.document.addEventListener('pointerdown', onPointerDown, true);
        this.document.addEventListener('keydown', onKeyDown);
      }, 0);

      onCleanup(() => {
        if (timerId !== undefined) {
          this.document.defaultView?.clearTimeout(timerId);
        }
        this.document.removeEventListener('pointerdown', onPointerDown, true);
        this.document.removeEventListener('keydown', onKeyDown);
      });
    });
  }

  protected openDial(event: Event): void {
    event.stopPropagation();
    if (this.disabled() || !this.hasItems()) {
      return;
    }
    this.open.set(true);
    queueMicrotask(() => this.focusFirstAction());
  }

  protected closeDial(event: Event): void {
    event.stopPropagation();
    this.open.set(false);
    this.focusTrigger();
  }

  protected onItemClick(event: Event, item: WiSpeedDialItem): void {
    event.stopPropagation();
    if (this.disabled() || item.disabled) {
      return;
    }
    this.itemClick.emit(item);
    if (this.closeOnSelect()) {
      this.open.set(false);
    }
  }

  protected onToolbarKeydown(event: KeyboardEvent): void {
    const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
    if (!keys.includes(event.key)) {
      return;
    }

    const buttons = this.actionButtons();
    if (buttons.length === 0) {
      return;
    }

    const currentIndex = buttons.findIndex((button) => button === this.document.activeElement);
    const horizontal = this.direction() === 'left' || this.direction() === 'right';
    let nextIndex = currentIndex < 0 ? 0 : currentIndex;

    switch (event.key) {
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = buttons.length - 1;
        break;
      case 'ArrowLeft':
        if (horizontal) {
          nextIndex = currentIndex <= 0 ? buttons.length - 1 : currentIndex - 1;
        }
        break;
      case 'ArrowRight':
        if (horizontal) {
          nextIndex = currentIndex >= buttons.length - 1 ? 0 : currentIndex + 1;
        }
        break;
      case 'ArrowUp':
        if (!horizontal) {
          nextIndex = currentIndex <= 0 ? buttons.length - 1 : currentIndex - 1;
        }
        break;
      case 'ArrowDown':
        if (!horizontal) {
          nextIndex = currentIndex >= buttons.length - 1 ? 0 : currentIndex + 1;
        }
        break;
      default:
        return;
    }

    event.preventDefault();
    buttons.forEach((button, index) => {
      button.tabIndex = index === nextIndex ? 0 : -1;
    });
    buttons[nextIndex]?.focus();
  }

  private actionButtons(): HTMLButtonElement[] {
    const root = this.elementRef.nativeElement as HTMLElement;
    return Array.from(root.querySelectorAll('[role="toolbar"] button')) as HTMLButtonElement[];
  }

  private focusFirstAction(): void {
    const root = this.elementRef.nativeElement as HTMLElement;
    (root.querySelector('[data-item-id]') as HTMLButtonElement | null)?.focus();
  }

  private focusTrigger(): void {
    queueMicrotask(() => {
      const root = this.elementRef.nativeElement as HTMLElement;
      root.querySelector('button')?.focus();
    });
  }
}
