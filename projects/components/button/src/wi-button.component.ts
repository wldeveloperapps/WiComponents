import { booleanAttribute, Component, computed, input } from '@angular/core';

import type { WiButtonSize, WiButtonType, WiButtonVariant } from './wi-button.types';

const BASE_CLASSES = [
  'inline-flex',
  'shrink-0',
  'items-center',
  'justify-center',
  'gap-2',
  'whitespace-nowrap',
  'rounded-control',
  'font-medium',
  'transition-colors',
  'outline-none',
  'select-none',
  'focus-visible:ring-2',
  'focus-visible:ring-ring',
  'focus-visible:ring-offset-2',
  'focus-visible:ring-offset-background',
  'disabled:pointer-events-none',
  'disabled:opacity-50',
].join(' ');

const VARIANT_CLASSES: Record<WiButtonVariant, string> = {
  primary: 'bg-primary text-on-primary hover:bg-primary/90',
  secondary: 'bg-secondary text-on-secondary hover:bg-secondary/90',
  danger: 'bg-error text-on-error hover:bg-error/90',
  ghost: 'bg-transparent text-on-surface hover:bg-surface-variant',
  outline: 'border border-outline bg-transparent text-on-surface hover:bg-surface-variant',
};

const SIZE_CLASSES: Record<WiButtonSize, string> = {
  sm: 'h-control-sm px-3 text-sm',
  md: 'h-control-md px-4 text-sm',
  lg: 'h-control-lg px-6 text-base',
};

const ICON_ONLY_SIZE_CLASSES: Record<WiButtonSize, string> = {
  sm: 'h-control-sm w-8 px-0',
  md: 'h-control-md w-10 px-0',
  lg: 'h-control-lg w-12 px-0',
};

/**
 * Botón del design system (`wi-button`).
 *
 * - Variantes y tamaños vía tokens semánticos.
 * - `loading` deshabilita el control y expone `aria-busy`.
 * - Icon-only: usar `iconOnly` + `ariaLabel` (o texto accesible en el contenido).
 */
@Component({
  selector: 'wi-button',
  host: {
    class: 'wi-button contents',
  },
  template: `
    <button
      [attr.type]="type()"
      [class]="classes()"
      [disabled]="isDisabled()"
      [attr.aria-busy]="loading() || null"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-disabled]="isDisabled() || null"
    >
      @if (loading()) {
        <svg class="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      }
      <ng-content />
    </button>
  `,
})
export class WiButtonComponent {
  readonly variant = input<WiButtonVariant>('primary');
  readonly size = input<WiButtonSize>('md');
  readonly type = input<WiButtonType>('button');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly iconOnly = input(false, { transform: booleanAttribute });
  /** Nombre accesible; especialmente útil con `iconOnly`. */
  readonly ariaLabel = input<string | null>(null);

  protected readonly isDisabled = computed(() => this.disabled() || this.loading());

  protected readonly classes = computed(() => {
    const sizeClasses = this.iconOnly()
      ? ICON_ONLY_SIZE_CLASSES[this.size()]
      : SIZE_CLASSES[this.size()];

    return [BASE_CLASSES, VARIANT_CLASSES[this.variant()], sizeClasses].join(' ');
  });
}
