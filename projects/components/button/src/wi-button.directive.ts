import {
  booleanAttribute,
  computed,
  Directive,
  ElementRef,
  HOST_TAG_NAME,
  inject,
  input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

import type { WiButtonSize, WiButtonType, WiButtonVariant } from './wi-button.types';

const HOST_CLASSES = [
  'wi-button',
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
  'data-[disabled]:pointer-events-none',
  'data-[disabled]:opacity-50',
  'before:pointer-events-none',
  'before:hidden',
  "before:content-['']",
  'before:size-4',
  'before:shrink-0',
  'before:rounded-full',
  'before:border-2',
  'before:border-current',
  'before:border-t-transparent',
  'data-[loading]:before:block',
  'motion-safe:data-[loading]:before:animate-spin',
  'data-[variant=primary]:bg-primary',
  'data-[variant=primary]:text-on-primary',
  'data-[variant=primary]:hover:bg-primary/90',
  'data-[variant=secondary]:bg-surface-container',
  'data-[variant=secondary]:text-on-surface-variant',
  'data-[variant=secondary]:hover:bg-surface-container-high',
  'data-[variant=secondary]:hover:text-on-surface-variant',
  'data-[variant=danger]:bg-error',
  'data-[variant=danger]:text-on-error',
  'data-[variant=danger]:hover:bg-error/90',
  'data-[variant=ghost]:bg-transparent',
  'data-[variant=ghost]:text-on-surface',
  'data-[variant=ghost]:hover:bg-surface-variant',
  'data-[variant=outline]:border',
  'data-[variant=outline]:border-outline-variant',
  'data-[variant=outline]:bg-transparent',
  'data-[variant=outline]:text-on-surface',
  'data-[variant=outline]:hover:bg-surface-variant',
  'data-[size=sm]:h-control-sm',
  'data-[size=sm]:px-3',
  'data-[size=sm]:text-sm',
  'data-[size=md]:h-control-md',
  'data-[size=md]:px-4',
  'data-[size=md]:text-sm',
  'data-[size=lg]:h-control-lg',
  'data-[size=lg]:px-6',
  'data-[size=lg]:text-base',
  'data-[icon-only]:px-0',
  'data-[icon-only]:data-[size=sm]:w-8',
  'data-[icon-only]:data-[size=md]:w-10',
  'data-[icon-only]:data-[size=lg]:w-12',
].join(' ');

/**
 * Apariencia de botón del design system (`button[wiButton]`, `a[wiButton]`).
 *
 * - Directivas sobre el elemento nativo: acción → `<button>`; navegación → `<a href>` / `routerLink`.
 * - Variantes y tamaños vía tokens semánticos.
 * - `loading` deshabilita el control, expone `aria-busy` y muestra un spinner CSS.
 * - En `<a>`, `disabled` / `loading` usan `aria-disabled` + `tabindex="-1"` (no existe `disabled` nativo).
 * - Icon-only: `iconOnly` + `ariaLabel` (o `aria-label` nativo).
 *
 * ```html
 * <button wiButton type="button" variant="primary">Guardar</button>
 * <a wiButton variant="outline" routerLink="/settings">Ajustes</a>
 * ```
 */
@Directive({
  selector: 'button[wiButton], a[wiButton]',
  exportAs: 'wiButton',
  host: {
    'data-slot': 'button',
    '[class]': 'hostClasses',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-icon-only]': 'iconOnly() || null',
    '[attr.data-loading]': 'loading() || null',
    '[attr.data-disabled]': 'isDisabled() || null',
    '[attr.type]': 'isAnchor ? null : type()',
    '[attr.disabled]': 'isAnchor ? null : isDisabled() || null',
    '[attr.aria-busy]': 'loading() || null',
    '[attr.aria-disabled]': 'isDisabled() || null',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.tabindex]': 'isAnchor && isDisabled() ? -1 : null',
  },
})
export class WiButtonDirective {
  protected readonly isAnchor = inject(HOST_TAG_NAME) === 'a';
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly hostClasses = HOST_CLASSES;

  readonly variant = input<WiButtonVariant>('primary');
  readonly size = input<WiButtonSize>('md');
  /** Solo aplica en `<button>`. En enlaces se ignora. */
  readonly type = input<WiButtonType>('button');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly iconOnly = input(false, { transform: booleanAttribute });
  /** Nombre accesible; especialmente útil con `iconOnly`. */
  readonly ariaLabel = input<string | null>(null);

  protected readonly isDisabled = computed(() => this.disabled() || this.loading());

  constructor() {
    if (!this.isAnchor) {
      return;
    }

    fromEvent(this.elementRef.nativeElement, 'click', { capture: true })
      .pipe(
        filter(() => this.isDisabled()),
        takeUntilDestroyed(),
      )
      .subscribe((event: Event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
      });
  }
}
