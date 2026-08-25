export type WiListboxSize = 'sm' | 'md' | 'lg';

/** Compara el valor de una opción con el valor seleccionado del form. */
export type WiListboxCompareWith<T = unknown> = (
  optionValue: T,
  selectedValue: T | null | undefined,
) => boolean;

/** Contexto del template de ítem (`ng-template wiListboxItem`). */
export interface WiListboxItemContext<TOption = unknown, TValue = unknown> {
  $implicit: TOption;
  option: TOption;
  value: TValue;
  selected: boolean;
}
