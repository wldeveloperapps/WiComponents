import { inject, InjectionToken, type Provider } from '@angular/core';

/**
 * Locale / chrome i18n de overlays (`wi-dialog`, `wi-confirm-dialog`, …).
 * Sin diccionarios de producto: la app provee el copy.
 */
export interface WiOverlaysI18n {
  dialogCloseLabel: () => string;
  /** Label por defecto del botón cancelar en `wi-confirm-dialog`. */
  confirmCancelLabel: () => string;
}

const defaultOverlaysI18n: WiOverlaysI18n = {
  dialogCloseLabel: () => 'Close',
  confirmCancelLabel: () => 'Cancel',
};

const WI_OVERLAYS_I18N = new InjectionToken<WiOverlaysI18n>('WI_OVERLAYS_I18N');

/**
 * Provee labels de overlays (app i18n).
 *
 * @example
 * ```ts
 * provideWiOverlaysI18n({
 *   dialogCloseLabel: () => 'Cerrar',
 *   confirmCancelLabel: () => 'Cancelar',
 * })
 * ```
 */
export function provideWiOverlaysI18n(configuration?: Partial<WiOverlaysI18n>): Provider {
  return {
    provide: WI_OVERLAYS_I18N,
    useValue: {
      ...defaultOverlaysI18n,
      ...configuration,
    } satisfies WiOverlaysI18n,
  };
}

/** @internal */
export function injectWiOverlaysI18n(): WiOverlaysI18n {
  return inject(WI_OVERLAYS_I18N, { optional: true }) ?? defaultOverlaysI18n;
}
