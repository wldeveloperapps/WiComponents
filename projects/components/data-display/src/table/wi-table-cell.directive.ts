import { Directive, inject, input, TemplateRef } from '@angular/core';

import type { WiTableCellContext } from './wi-column.types';

/**
 * Template de celda por `columnId`.
 *
 * ```html
 * <ng-template [wiTableCell]="'name'" let-row let-value="value">
 *   <strong>{{ value }}</strong>
 * </ng-template>
 * ```
 */
@Directive({
  selector: 'ng-template[wiTableCell]',
})
export class WiTableCellDirective {
  readonly wiTableCell = input.required<string>();
  readonly templateRef = inject(TemplateRef<WiTableCellContext>);
}
