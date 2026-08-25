export type WiSelectSize = 'sm' | 'md' | 'lg';

/** Compara el valor de una opción con el valor seleccionado del form. */
export type WiSelectCompareWith<T = unknown> = (
  optionValue: T,
  selectedValue: T | null | undefined,
) => boolean;

/** Contexto del template de ítem (`ng-template wiSelectItem`). */
export interface WiSelectItemContext<TOption = unknown, TValue = unknown> {
  $implicit: TOption;
  option: TOption;
  value: TValue;
}

/** Contexto del template del valor seleccionado (`ng-template wiSelectSelected`). */
export interface WiSelectSelectedContext<TValue = unknown> {
  $implicit: TValue;
  value: TValue;
}
