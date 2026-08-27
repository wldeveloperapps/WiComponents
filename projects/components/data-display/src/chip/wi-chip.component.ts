import { booleanAttribute, Component, input, output } from '@angular/core';

import type { WiChipSize, WiChipVariant } from './wi-chip.types';

const REMOVE_CLASSES = [
  'wi-chip__remove',
  'inline-flex',
  'size-4',
  'shrink-0',
  'items-center',
  'justify-center',
  'rounded-control',
  'transition-colors',
  'outline-none',
  'hover:bg-current/15',
  'focus-visible:ring-2',
  'focus-visible:ring-ring',
  'focus-visible:ring-offset-1',
  'focus-visible:ring-offset-background',
  'disabled:pointer-events-none',
  'disabled:opacity-50',
].join(' ');

/**
 * Etiqueta compacta (`wi-chip`) para tags, estados, filtros y selección.
 *
 * - Variantes semánticas vía tokens (`neutral` | `primary` | `secondary` | `success` | `warning` | `danger`).
 * - Tamaños: `sm` (default, `text-xs px-2 py-1`) | `md`.
 * - `selected` aplica apariencia de elegido (success); el check se proyecta desde la app.
 * - `clickable` convierte el host en botón (`aria-pressed`); `clicked` no muta `selected`.
 * - Contenido proyectado (texto y/o `wi-icon`); el copy lo aporta la app.
 *
 * ```html
 * <wi-chip>User</wi-chip>
 * <wi-chip variant="success">Operativo</wi-chip>
 * <wi-chip clickable [selected]="on" (clicked)="toggle()">
 *   Aplicación
 *   @if (on) {
 *     <wi-icon name="check" size="xs" />
 *   }
 * </wi-chip>
 * ```
 */
@Component({
  selector: 'wi-chip',
  host: {
    'data-slot': 'chip',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-appearance]': 'selected() ? "selected" : "default"',
    '[attr.data-removable]': 'removable()',
    '[attr.data-clickable]': 'clickable()',
    '[attr.data-selected]': 'selected() || null',
    '[attr.data-disabled]': 'disabled() || null',
    '[attr.role]': 'clickable() ? "button" : null',
    '[attr.tabindex]': 'clickable() && !disabled() ? 0 : null',
    '[attr.aria-pressed]': 'clickable() ? (selected() ? "true" : "false") : null',
    '[attr.aria-disabled]': 'clickable() && disabled() ? true : null',
    '[attr.aria-label]': 'ariaLabel()',
    '(click)': 'onHostActivate($event)',
    '(keydown.enter)': 'onHostActivate($event)',
    '(keydown.space)': 'onHostActivate($event)',
    class:
      'wi-chip inline-flex max-w-full min-w-0 shrink-0 items-center rounded-control whitespace-nowrap select-none data-[appearance=default]:data-[variant=neutral]:bg-surface-variant data-[appearance=default]:data-[variant=neutral]:text-on-surface-variant data-[appearance=default]:data-[variant=primary]:bg-primary-container data-[appearance=default]:data-[variant=primary]:text-on-primary-container data-[appearance=default]:data-[variant=secondary]:bg-secondary-container data-[appearance=default]:data-[variant=secondary]:text-on-secondary-container data-[appearance=default]:data-[variant=success]:bg-success data-[appearance=default]:data-[variant=success]:text-on-success data-[appearance=default]:data-[variant=warning]:bg-warning data-[appearance=default]:data-[variant=warning]:text-on-warning data-[appearance=default]:data-[variant=danger]:bg-error data-[appearance=default]:data-[variant=danger]:text-on-error data-[appearance=selected]:bg-success data-[appearance=selected]:text-on-success data-[size=sm]:gap-1 data-[size=sm]:px-2 data-[size=sm]:py-1 data-[size=sm]:text-xs data-[size=md]:gap-2 data-[size=md]:px-3 data-[size=md]:py-2 data-[size=md]:text-sm data-[clickable=true]:cursor-pointer data-[clickable=true]:transition-colors data-[clickable=true]:outline-none data-[clickable=true]:focus-visible:ring-2 data-[clickable=true]:focus-visible:ring-ring data-[clickable=true]:focus-visible:ring-offset-2 data-[clickable=true]:focus-visible:ring-offset-background data-[clickable=true]:data-[appearance=default]:hover:bg-outline-variant data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
  },
  template: `
    <span class="wi-chip__label inline-flex min-w-0 items-center gap-1 truncate">
      <ng-content />
    </span>
    @if (removable()) {
      <button
        type="button"
        [class]="removeClasses"
        [disabled]="disabled()"
        [attr.aria-label]="removeLabel()"
        (click)="onRemove($event)"
      >
        <svg
          class="size-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    }
  `,
})
export class WiChipComponent {
  /** Apariencia semántica (ignorada visualmente si `selected`). */
  readonly variant = input<WiChipVariant>('neutral');

  /** Tamaño del chip. */
  readonly size = input<WiChipSize>('sm');

  /** Estado elegido (p. ej. aplicación asignada). No muta solo; la app controla el valor. */
  readonly selected = input(false, { transform: booleanAttribute });

  /** El host es activable (teclado + clic). */
  readonly clickable = input(false, { transform: booleanAttribute });

  /** Muestra el aspa para quitar el chip. */
  readonly removable = input(false, { transform: booleanAttribute });

  /** Deshabilita clic/aspa y atenúa el chip. */
  readonly disabled = input(false, { transform: booleanAttribute });

  /**
   * Nombre accesible del aspa. La app debe localizarlo (p. ej. vía i18n).
   */
  readonly removeLabel = input('Quitar');

  /** Nombre accesible del chip (útil si el contenido no basta). */
  readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });

  /** Se emite al pulsar el aspa (no se emite si `disabled`). */
  readonly removed = output<void>();

  /** Se emite al activar un chip `clickable` (no se emite si `disabled`). */
  readonly clicked = output<void>();

  protected readonly removeClasses = REMOVE_CLASSES;

  protected onHostActivate(event: Event): void {
    if (!this.clickable() || this.disabled()) {
      return;
    }
    if (event instanceof KeyboardEvent) {
      event.preventDefault();
    }
    this.clicked.emit();
  }

  protected onRemove(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.disabled()) {
      return;
    }
    this.removed.emit();
  }
}
