export type WiPicklistSize = 'sm' | 'md' | 'lg';

/** Compara el valor de una opción con un valor asignado (`value`). */
export type WiPicklistCompareWith<T = unknown> = (
  optionValue: T,
  selectedValue: T | null | undefined,
) => boolean;

/** Contexto del template de ítem (`ng-template wiPicklistItem`). */
export interface WiPicklistItemContext<TOption = unknown, TValue = unknown> {
  $implicit: TOption;
  option: TOption;
  value: TValue;
  selected: boolean;
}
