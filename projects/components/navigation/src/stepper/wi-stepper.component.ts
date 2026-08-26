import {
  booleanAttribute,
  Component,
  computed,
  Directive,
  ElementRef,
  forwardRef,
  inject,
  InjectionToken,
  input,
  model,
} from '@angular/core';
import { WiIconComponent } from '@wiloc/ui/icon';

import type { WiStepperOrientation, WiStepperStep, WiStepperStepState } from './wi-stepper.types';

/** Token interno: los paneles proyectados inyectan el stepper. No exportar. */
const WI_STEPPER = new InjectionToken<WiStepperComponent>('WI_STEPPER');

const HOST_BASE_CLASSES = 'wi-stepper block w-full min-w-0';

const LAYOUT_ORIENTATION_CLASSES: Record<WiStepperOrientation, string> = {
  vertical: 'wi-stepper__layout wi-stepper__layout--vertical',
  horizontal: 'wi-stepper__layout wi-stepper__layout--horizontal',
};

const NAV_ORIENTATION_CLASSES: Record<WiStepperOrientation, string> = {
  vertical: 'wi-stepper__nav w-full min-w-0 shrink-0',
  horizontal: 'wi-stepper__nav w-full min-w-0',
};

const LIST_ORIENTATION_CLASSES: Record<WiStepperOrientation, string> = {
  vertical: 'wi-stepper__list m-0 flex list-none flex-col p-0',
  horizontal: 'wi-stepper__list m-0 flex min-w-0 list-none p-0',
};

const TRIGGER_BASE_CLASSES = [
  'wi-stepper__trigger',
  'flex',
  'min-w-0',
  'rounded-control',
  'text-start',
  'outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-ring',
  'focus-visible:ring-offset-2',
  'focus-visible:ring-offset-background',
  'disabled:pointer-events-none',
  'disabled:opacity-50',
].join(' ');

const TRIGGER_ORIENTATION_CLASSES: Record<WiStepperOrientation, string> = {
  vertical: 'w-full grid grid-cols-[2.5rem_1fr] items-start gap-x-3',
  horizontal: 'flex-col items-center gap-2 text-center',
};

const INDICATOR_BASE_CLASSES = [
  'wi-stepper__indicator',
  'inline-flex',
  'size-10',
  'shrink-0',
  'items-center',
  'justify-center',
  'rounded-full',
  'border',
  'transition-colors',
].join(' ');

const INDICATOR_CURRENT_CLASSES = 'border-primary bg-primary text-on-primary';
const INDICATOR_INACTIVE_CLASSES =
  'border-outline-variant bg-surface-variant text-on-surface-variant';

const LABEL_CURRENT_CLASSES = 'font-semibold text-on-surface';
const LABEL_INACTIVE_CLASSES = 'font-medium text-on-surface-variant';

let nextStepperId = 0;

interface WiStepperStepView {
  readonly step: WiStepperStep;
  readonly index: number;
  readonly state: WiStepperStepState;
  readonly current: boolean;
  readonly selectable: boolean;
  readonly last: boolean;
  readonly triggerClass: string;
  readonly indicatorClass: string;
  readonly labelClass: string;
}

/**
 * Stepper de progreso (`wi-stepper`).
 *
 * Los pasos los define la app: `{ id, label, icon }`. El contenido de cada paso
 * se proyecta con `[wiStepperPanel]="id"`. Back / Next / submit viven en la app.
 *
 * ```html
 * <wi-stepper [steps]="steps" [(value)]="active" orientation="vertical" linear>
 *   <div wiStepperPanel="details">…</div>
 * </wi-stepper>
 * ```
 */
@Component({
  selector: 'wi-stepper',
  exportAs: 'wiStepper',
  imports: [WiIconComponent],
  styleUrl: './wi-stepper.css',
  providers: [{ provide: WI_STEPPER, useExisting: forwardRef(() => WiStepperComponent) }],
  host: {
    'data-slot': 'stepper',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-linear]': 'linear() ? "" : null',
    '[style.--wi-stepper-count]': 'stepCount()',
    '[class]': 'hostClasses()',
  },
  template: `
    <div [class]="layoutClasses()">
      <nav
        [class]="navClasses()"
        [attr.aria-label]="ariaLabel() || null"
        tabindex="-1"
        (keydown)="onNavKeydown($event)"
      >
        <ol [class]="listClasses()">
          @for (item of viewSteps(); track item.step.id) {
            <li
              class="wi-stepper__item"
              [attr.data-state]="item.state"
              [attr.data-step-id]="item.step.id"
            >
              <button
                type="button"
                [id]="stepTriggerId(item.step.id)"
                [class]="item.triggerClass"
                [disabled]="!!item.step.disabled"
                [attr.tabindex]="item.selectable ? null : -1"
                [attr.aria-disabled]="item.selectable ? null : true"
                [attr.aria-current]="item.current ? 'step' : null"
                [attr.aria-controls]="stepPanelId(item.step.id)"
                [attr.data-state]="item.state"
                (click)="select(item.step.id)"
              >
                <span [class]="item.indicatorClass" aria-hidden="true">
                  <wi-icon [name]="item.step.icon" size="sm" />
                </span>
                <span
                  [id]="stepLabelId(item.step.id)"
                  class="wi-stepper__label min-w-0 self-center text-sm wrap-break-word"
                  [class]="item.labelClass"
                >
                  {{ item.step.label }}
                </span>
              </button>
            </li>
          }
        </ol>
      </nav>
      <div class="wi-stepper__panels min-h-0 min-w-0 flex-1">
        <ng-content />
      </div>
    </div>
  `,
})
export class WiStepperComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  /** Identificador estable para asociar triggers y paneles. */
  readonly stepperId = `wi-stepper-${++nextStepperId}`;

  /** Pasos que renderiza la nav. Label e icono los aporta la app. */
  readonly steps = input<readonly WiStepperStep[]>([]);

  /** Id del paso actual (two-way). Si no coincide con ningún paso, se usa el primero. */
  readonly value = model<string>('');

  /** `vertical` (wizard) o `horizontal`. */
  readonly orientation = input<WiStepperOrientation>('vertical');

  /**
   * En `true`, la nav no permite saltar a pasos futuros (sí volver atrás).
   * `selectNext()` / `selectPrevious()` no están limitados: los usa la app (Next/Back).
   */
  readonly linear = input(true, { transform: booleanAttribute });

  /** Nombre accesible de la nav (localizable en la app). */
  readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' });

  protected readonly hostClasses = computed(() => HOST_BASE_CLASSES);

  protected readonly stepCount = computed(() => Math.max(this.steps().length, 1));

  protected readonly layoutClasses = computed(() => LAYOUT_ORIENTATION_CLASSES[this.orientation()]);

  protected readonly navClasses = computed(() => NAV_ORIENTATION_CLASSES[this.orientation()]);

  protected readonly listClasses = computed(() => LIST_ORIENTATION_CLASSES[this.orientation()]);

  protected readonly activeId = computed(() => {
    const steps = this.steps();
    const value = this.value();
    if (value && steps.some((step) => step.id === value)) {
      return value;
    }
    return steps[0]?.id ?? '';
  });

  protected readonly viewSteps = computed((): readonly WiStepperStepView[] => {
    const steps = this.steps();
    const activeId = this.activeId();
    const activeIndex = steps.findIndex((step) => step.id === activeId);
    const linear = this.linear();
    const orientation = this.orientation();
    const triggerClass = `${TRIGGER_BASE_CLASSES} ${TRIGGER_ORIENTATION_CLASSES[orientation]}`;

    return steps.map((step, index) => {
      let state: WiStepperStepState = 'upcoming';
      if (index === activeIndex) {
        state = 'current';
      } else if (index < activeIndex) {
        state = 'complete';
      }
      const current = state === 'current';
      const selectable = !step.disabled && (!linear || index <= activeIndex);
      return {
        step,
        index,
        state,
        current,
        selectable,
        last: index === steps.length - 1,
        triggerClass,
        indicatorClass: `${INDICATOR_BASE_CLASSES} ${current ? INDICATOR_CURRENT_CLASSES : INDICATOR_INACTIVE_CLASSES}`,
        labelClass: current ? LABEL_CURRENT_CLASSES : LABEL_INACTIVE_CLASSES,
      };
    });
  });

  /** Activa un paso si no está deshabilitado y, en lineal, no es futuro. */
  select(id: string): boolean {
    const item = this.viewSteps().find((step) => step.step.id === id);
    if (!item?.selectable) {
      return false;
    }
    this.value.set(id);
    return true;
  }

  /** Avanza al siguiente paso no deshabilitado. Para el botón Next de la app. */
  selectNext(): boolean {
    return this.selectByOffset(1);
  }

  /** Retrocede al paso anterior no deshabilitado. Para el botón Back de la app. */
  selectPrevious(): boolean {
    return this.selectByOffset(-1);
  }

  protected stepTriggerId(stepId: string): string {
    return `${this.stepperId}-step-${stepId}`;
  }

  protected stepLabelId(stepId: string): string {
    return `${this.stepperId}-label-${stepId}`;
  }

  stepPanelId(stepId: string): string {
    return `${this.stepperId}-panel-${stepId}`;
  }

  isActive(stepId: string): boolean {
    return this.activeId() === stepId;
  }

  protected onNavKeydown(event: KeyboardEvent): void {
    const vertical = this.orientation() === 'vertical';
    const nextKey = vertical ? 'ArrowDown' : 'ArrowRight';
    const prevKey = vertical ? 'ArrowUp' : 'ArrowLeft';
    const keys = [nextKey, prevKey, 'Home', 'End'];
    if (!keys.includes(event.key)) {
      return;
    }

    const selectable = this.viewSteps().filter((item) => item.selectable);
    if (selectable.length === 0) {
      return;
    }

    const currentId = this.activeId();
    const currentIndex = selectable.findIndex((item) => item.step.id === currentId);
    let nextIndex: number;

    switch (event.key) {
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = selectable.length - 1;
        break;
      case nextKey:
        nextIndex = currentIndex >= selectable.length - 1 ? 0 : currentIndex + 1;
        break;
      case prevKey:
        nextIndex = currentIndex <= 0 ? selectable.length - 1 : currentIndex - 1;
        break;
      default:
        return;
    }

    const next = selectable[nextIndex];
    if (!next) {
      return;
    }

    event.preventDefault();
    this.select(next.step.id);
    this.focusTrigger(next.step.id);
  }

  private selectByOffset(offset: number): boolean {
    const steps = this.steps();
    const activeIndex = steps.findIndex((step) => step.id === this.activeId());
    if (activeIndex < 0) {
      return false;
    }
    const direction = offset > 0 ? 1 : -1;
    for (let i = activeIndex + direction; i >= 0 && i < steps.length; i += direction) {
      const step = steps[i];
      if (step && !step.disabled) {
        this.value.set(step.id);
        return true;
      }
    }
    return false;
  }

  private focusTrigger(stepId: string): void {
    queueMicrotask(() => {
      const root = this.elementRef.nativeElement;
      const trigger = root.querySelector(`#${this.stepTriggerId(stepId)}`);
      if (trigger instanceof HTMLButtonElement) {
        trigger.focus();
      }
    });
  }
}

/**
 * Panel de contenido asociado a un paso (`[wiStepperPanel]="id"`).
 * El copy y los controles (formularios, Back/Next) los aporta la app.
 */
@Directive({
  selector: '[wiStepperPanel]',
  exportAs: 'wiStepperPanel',
  host: {
    class: 'wi-stepper__panel min-w-0',
    '[id]': 'panelId()',
    '[hidden]': '!active()',
    '[attr.data-state]': 'active() ? "active" : "inactive"',
    '[attr.role]': '"region"',
    '[attr.aria-labelledby]': 'labelId()',
  },
})
export class WiStepperPanelDirective {
  private readonly stepper = inject(WI_STEPPER);

  /** Id del paso al que pertenece este panel. */
  readonly wiStepperPanel = input.required<string>();

  protected readonly active = computed(() => this.stepper.isActive(this.wiStepperPanel()));

  protected readonly panelId = computed(() => this.stepper.stepPanelId(this.wiStepperPanel()));

  protected readonly labelId = computed(
    () => `${this.stepper.stepperId}-label-${this.wiStepperPanel()}`,
  );
}
