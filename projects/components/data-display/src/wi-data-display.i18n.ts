import { inject, InjectionToken, type Provider } from '@angular/core';

import type { WiFilterOperator } from './table/wi-column.types';
import { WI_DEFAULT_FILTER_OPERATORS } from './table/wi-column.types';

/**
 * Locale / chrome i18n de data-display (`wi-table`, paginación, columnas).
 * Sin diccionarios de producto: la app provee el copy.
 */
export interface WiDataDisplayI18n {
  emptyMessage: () => string;
  tableAriaLabel: () => string;
  paginationAriaLabel: () => string;
  previousLabel: () => string;
  nextLabel: () => string;
  filterPlaceholder: () => string;
  selectPlaceholder: () => string;
  filterOperatorAriaLabel: () => string;
  /** Aria del control de filtro; `{header}` = cabecera de columna. */
  filterAriaLabel: (header: string) => string;
  /** Plantilla: `{visible}` y `{total}`. */
  columnVisibilitySummary: () => string;
  columnVisibilityMenuLabel: () => string;
  columnVisibilityAriaLabel: () => string;
  /** Plantilla: `{count}`. */
  resultCountTemplate: () => string;
  rowActionsHeader: () => string;
  /** Cabecera oculta visualmente de la columna chevron. */
  expandColumnHeader: () => string;
  /** Aria del botón para abrir el panel de columnas colapsadas. */
  expandRowAriaLabel: () => string;
  /** Aria del botón para cerrar el panel. */
  collapseRowAriaLabel: () => string;
  filterOperators: () => readonly { value: WiFilterOperator; label: string }[];
}

const defaultDataDisplayI18n: WiDataDisplayI18n = {
  emptyMessage: () => 'No data',
  tableAriaLabel: () => 'Data table',
  paginationAriaLabel: () => 'Pagination',
  previousLabel: () => 'Previous',
  nextLabel: () => 'Next',
  filterPlaceholder: () => 'Type to search',
  selectPlaceholder: () => 'Select one',
  filterOperatorAriaLabel: () => 'Filter operator',
  filterAriaLabel: (header) => `Filter ${header}`,
  columnVisibilitySummary: () => '{visible} of {total} columns visible',
  columnVisibilityMenuLabel: () => 'Columns',
  columnVisibilityAriaLabel: () => 'Column visibility',
  resultCountTemplate: () => '{count} results',
  rowActionsHeader: () => 'Actions',
  expandColumnHeader: () => 'More',
  expandRowAriaLabel: () => 'Show hidden columns',
  collapseRowAriaLabel: () => 'Hide extra columns',
  filterOperators: () => WI_DEFAULT_FILTER_OPERATORS,
};

const WI_DATA_DISPLAY_I18N = new InjectionToken<WiDataDisplayI18n>('WI_DATA_DISPLAY_I18N');

/**
 * Provee labels de tabla / paginación / columnas (app i18n).
 *
 * @example
 * ```ts
 * provideWiDataDisplayI18n({
 *   previousLabel: () => 'Anterior',
 *   nextLabel: () => 'Siguiente',
 *   emptyMessage: () => 'No hay datos',
 *   filterAriaLabel: (header) => `Filtrar ${header}`,
 *   filterOperators: () => [
 *     { value: 'contains', label: 'Contiene' },
 *     // …
 *   ],
 * })
 * ```
 */
export function provideWiDataDisplayI18n(configuration?: Partial<WiDataDisplayI18n>): Provider {
  return {
    provide: WI_DATA_DISPLAY_I18N,
    useValue: {
      ...defaultDataDisplayI18n,
      ...configuration,
    } satisfies WiDataDisplayI18n,
  };
}

/** @internal */
export function injectWiDataDisplayI18n(): WiDataDisplayI18n {
  return inject(WI_DATA_DISPLAY_I18N, { optional: true }) ?? defaultDataDisplayI18n;
}
