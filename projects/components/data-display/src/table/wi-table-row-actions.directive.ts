import { Directive, inject, TemplateRef } from '@angular/core';

export interface WiTableRowActionsContext<T = unknown> {
  $implicit: T;
  row: T;
}

/**
 * Acciones por fila (columna leading).
 *
 * ```html
 * <ng-template wiTableRowActions let-row>
 *   <button type="button" [attr.aria-label]="'Acciones ' + row.id">…</button>
 * </ng-template>
 * ```
 */
@Directive({
  selector: 'ng-template[wiTableRowActions]',
})
export class WiTableRowActionsDirective {
  readonly templateRef = inject(TemplateRef<WiTableRowActionsContext>);
}
