import { InputModalityDetector } from '@angular/cdk/a11y';
import type { NumberInput } from '@angular/cdk/coercion';
import {
  CdkMenu,
  CdkMenuGroup,
  CdkMenuItem,
  CdkMenuItemRadio,
  CdkMenuItemSelectable,
  CdkMenuTrigger,
} from '@angular/cdk/menu';
import {
  booleanAttribute,
  computed,
  Directive,
  effect,
  ElementRef,
  forwardRef,
  HOST_TAG_NAME,
  inject,
  input,
  numberAttribute,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  createMenuPosition,
  deriveMenuSideFromTransformOrigin,
  MENU_SIDE,
  type MenuAlign,
  type MenuSide,
} from '@spartan-ng/brain/core';

import type { WiMenuAlign, WiMenuItemVariant, WiMenuSide } from './wi-menu.types';

const MENU_CONTENT_CLASSES = [
  'wi-menu',
  'z-50',
  'min-w-fit',
  'w-auto',
  'max-w-[min(100vw-2rem,20rem)]',
  'overflow-x-hidden',
  'overflow-y-auto',
  'rounded-control',
  'border',
  'border-outline-variant',
  'bg-surface',
  'p-2',
  'text-sm',
  'text-on-surface',
  'shadow-md',
  'outline-none',
  'my-[--spacing(var(--side-offset))]',
  'data-[state=open]:animate-in',
  'data-[state=closed]:animate-out',
  'data-[state=closed]:fade-out-0',
  'data-[state=open]:fade-in-0',
  'data-[state=closed]:zoom-out-95',
  'data-[state=open]:zoom-in-95',
  'data-[side=bottom]:slide-in-from-top-2',
  'data-[side=left]:slide-in-from-right-2',
  'data-[side=right]:slide-in-from-left-2',
  'data-[side=top]:slide-in-from-bottom-2',
].join(' ');

const MENU_ITEM_BASE_CLASSES = [
  'wi-menu__item',
  'relative',
  'flex',
  'w-full',
  'cursor-default',
  'items-center',
  'gap-2',
  'rounded-control-sm',
  'px-3',
  'py-2',
  'text-sm',
  'outline-hidden',
  'select-none',
  'transition-colors',
  'hover:bg-surface-variant',
  'focus:bg-surface-variant',
  'data-disabled:pointer-events-none',
  'data-disabled:opacity-50',
].join(' ');

const MENU_ITEM_VARIANT_CLASSES: Record<WiMenuItemVariant, string> = {
  default: 'text-on-surface',
  danger:
    'text-error hover:bg-error-container hover:text-on-error-container focus:bg-error-container focus:text-on-error-container',
};

const MENU_RADIO_CLASSES = [
  MENU_ITEM_BASE_CLASSES,
  'wi-menu__radio',
  'text-on-surface',
  'data-checked:bg-surface-variant',
].join(' ');

const MENU_LABEL_CLASSES = [
  'wi-menu__label',
  'block',
  'px-3',
  'py-1.5',
  'text-xs',
  'font-medium',
  'text-on-surface-variant',
].join(' ');

const MENU_SEPARATOR_CLASSES = [
  'wi-menu__separator',
  'my-1',
  '-mx-1',
  'h-px',
  'bg-outline-variant',
].join(' ');

/**
 * Mueve el foco DOM al ítem bajo el puntero (comportamiento tipo Radix/shadcn).
 * CDK solo mueve el foco con teclado; sin esto puede haber doble highlight.
 */
@Directive({
  selector: '[wiMenuFocusOnHover]',
  host: {
    '(mouseenter)': 'focusOnHover()',
  },
})
export class WiMenuFocusOnHoverDirective {
  private readonly menuItem = inject(CdkMenuItem, { self: true });
  private readonly parentMenu = inject(CdkMenu, { optional: true });
  private readonly inputModality = inject(InputModalityDetector);

  protected focusOnHover(): void {
    if (this.inputModality.mostRecentModality === 'touch' || this.menuItem.disabled) {
      return;
    }
    this.parentMenu?.setActiveMenuItem(this.menuItem);
  }
}

/**
 * Abre un menú popup a partir de un `ng-template`.
 *
 * Preferible en un `<button>` nativo (o `wi-button`) con nombre accesible.
 *
 * @example
 * ```html
 * <button type="button" [wiMenuTrigger]="menu" aria-label="Acciones">Abrir</button>
 * <ng-template #menu>
 *   <wi-menu>...</wi-menu>
 * </ng-template>
 * ```
 */
@Directive({
  selector: 'button[wiMenuTrigger], [wiMenuTrigger]',
  exportAs: 'wiMenuTrigger',
  providers: [{ provide: MENU_SIDE, useExisting: forwardRef(() => WiMenuTriggerDirective) }],
  hostDirectives: [
    {
      directive: CdkMenuTrigger,
      inputs: ['cdkMenuTriggerFor: wiMenuTrigger', 'cdkMenuTriggerData: wiMenuTriggerData'],
      outputs: ['cdkMenuOpened: opened', 'cdkMenuClosed: closed'],
    },
  ],
  host: {
    class: 'wi-menu-trigger',
    'data-slot': 'menu-trigger',
  },
})
export class WiMenuTriggerDirective {
  private readonly cdkTrigger = inject(CdkMenuTrigger, { host: true });

  /** Alineación horizontal/vertical relativa al trigger. */
  readonly align = input<WiMenuAlign>('start');
  /** Lado preferido del panel. */
  readonly side = input<WiMenuSide>('bottom');

  private readonly menuPosition = computed(() =>
    createMenuPosition(this.align() as MenuAlign, this.side() as MenuSide),
  );

  constructor() {
    const trigger = this.cdkTrigger as CdkMenuTrigger & {
      transformOriginSelector?: string;
    };
    trigger.transformOriginSelector = '[data-slot="menu"]';

    effect(() => {
      this.cdkTrigger.menuPosition = this.menuPosition();
    });
  }
}

/**
 * Panel del menú popup (`wi-menu`). Contiene label, ítems, radios y separadores.
 *
 * CDK Menu gestiona teclado, foco y cierre; la API pública no expone tipos Spartan/CDK.
 */
@Directive({
  selector: 'wi-menu, [wiMenu]',
  hostDirectives: [CdkMenu],
  host: {
    '[class]': 'hostClasses',
    'data-slot': 'menu',
    '[attr.data-state]': 'state()',
    '[attr.data-side]': 'resolvedSide()',
    '[style.--side-offset]': 'sideOffset()',
  },
})
export class WiMenuComponent {
  private readonly host = inject(CdkMenu);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly menuSide = inject(MENU_SIDE, { optional: true });

  protected readonly hostClasses = MENU_CONTENT_CLASSES;
  protected readonly state = signal<'open' | 'closed'>('open');
  protected readonly resolvedSide = signal<WiMenuSide>(
    (this.menuSide?.side() as WiMenuSide | undefined) ?? 'bottom',
  );

  /** Separación en unidades de spacing respecto al trigger. */
  readonly sideOffset = input<number, NumberInput>(1, { transform: numberAttribute });

  constructor() {
    const preferred = (this.menuSide?.side() as WiMenuSide | undefined) ?? 'bottom';
    setTimeout(() => {
      this.resolvedSide.set(
        deriveMenuSideFromTransformOrigin(
          this.elementRef.nativeElement.style.transformOrigin,
          preferred as MenuSide,
        ) as WiMenuSide,
      );
    });

    this.host.closed.pipe(takeUntilDestroyed()).subscribe(() => this.state.set('closed'));
  }
}

/** Agrupa ítems (p. ej. radios de selección única). */
@Directive({
  selector: 'wi-menu-group, [wiMenuGroup]',
  hostDirectives: [CdkMenuGroup],
  host: {
    class: 'wi-menu__group block',
    'data-slot': 'menu-group',
  },
})
export class WiMenuGroupComponent {}

/** Etiqueta no interactiva (cabecera de sección). */
@Directive({
  selector: 'wi-menu-label, [wiMenuLabel]',
  host: {
    '[class]': 'hostClasses',
    'data-slot': 'menu-label',
  },
})
export class WiMenuLabelComponent {
  protected readonly hostClasses = MENU_LABEL_CLASSES;
}

/** Separador visual entre grupos. */
@Directive({
  selector: 'wi-menu-separator, [wiMenuSeparator]',
  host: {
    '[class]': 'hostClasses',
    'data-slot': 'menu-separator',
    role: 'separator',
    'aria-orientation': 'horizontal',
  },
})
export class WiMenuSeparatorComponent {
  protected readonly hostClasses = MENU_SEPARATOR_CLASSES;
}

/**
 * Ítem de acción del menú. Usar en `<button>`.
 *
 * @example
 * ```html
 * <button type="button" wiMenuItem (triggered)="onEdit()">Editar</button>
 * ```
 */
@Directive({
  selector: 'button[wiMenuItem], [wiMenuItem]',
  hostDirectives: [
    {
      directive: CdkMenuItem,
      inputs: ['cdkMenuItemDisabled: disabled'],
      outputs: ['cdkMenuItemTriggered: triggered'],
    },
    WiMenuFocusOnHoverDirective,
  ],
  host: {
    '[class]': 'classes()',
    'data-slot': 'menu-item',
    '[attr.disabled]': 'isButton && disabled() ? "" : null',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.data-variant]': 'variant()',
  },
})
export class WiMenuItemDirective {
  protected readonly isButton = inject(HOST_TAG_NAME) === 'button';

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly variant = input<WiMenuItemVariant>('default');

  protected readonly classes = computed(() =>
    [MENU_ITEM_BASE_CLASSES, MENU_ITEM_VARIANT_CLASSES[this.variant()]].join(' '),
  );
}

/** @internal Bridge CDK radio con `keepOpen` configurable. */
@Directive({
  selector: '[wiMenuRadioCdk]',
  providers: [
    { provide: CdkMenuItemRadio, useExisting: WiMenuRadioCdkDirective },
    { provide: CdkMenuItemSelectable, useExisting: WiMenuRadioCdkDirective },
    { provide: CdkMenuItem, useExisting: CdkMenuItemSelectable },
  ],
})
export class WiMenuRadioCdkDirective extends CdkMenuItemRadio {
  readonly keepOpen = input(false, { transform: booleanAttribute });

  override trigger(options?: { keepOpen: boolean }): void {
    super.trigger({ ...options, keepOpen: this.keepOpen() });
  }
}

/**
 * Ítem radio (selección única dentro del menú / grupo).
 * Ideal para filtros donde el trigger refleja la opción activa.
 *
 * @example
 * ```html
 * <button
 *   type="button"
 *   wiMenuRadio
 *   [checked]="selected() === 'adhoc'"
 *   (triggered)="selected.set('adhoc')"
 * >
 *   Adhoc
 * </button>
 * ```
 */
@Directive({
  selector: 'button[wiMenuRadio], [wiMenuRadio]',
  hostDirectives: [
    {
      directive: WiMenuRadioCdkDirective,
      inputs: ['cdkMenuItemDisabled: disabled', 'cdkMenuItemChecked: checked', 'keepOpen'],
      outputs: ['cdkMenuItemTriggered: triggered'],
    },
    WiMenuFocusOnHoverDirective,
  ],
  host: {
    '[class]': 'hostClasses',
    'data-slot': 'menu-radio',
    '[attr.data-disabled]': 'cdkItem.disabled ? "" : null',
    '[attr.data-checked]': 'cdkItem.checked ? "" : null',
  },
})
export class WiMenuRadioDirective {
  protected readonly hostClasses = MENU_RADIO_CLASSES;
  protected readonly cdkItem = inject(WiMenuRadioCdkDirective);
}
