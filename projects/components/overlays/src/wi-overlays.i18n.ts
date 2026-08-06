import { inject, InjectionToken, type Provider } from '@angular/core';

/**
 * Locale / chrome i18n de overlays (`wi-dialog`, …).
 * Sin diccionarios de producto: la app provee el copy.
 */
export interface WiOverlaysI18n {
  dialogCloseLabel: () => string;
}

const defaultOverlaysI18n: WiOverlaysI18n = {
  dialogCloseLabel: () => 'Close',
};

const WI_OVERLAYS_I18N = new InjectionToken<WiOverlaysI18n>('WI_OVERLAYS_I18N');

/**
 * Provee labels de overlays (app i18n).
 *
 * @example
 * ```ts
 * provideWiOverlaysI18n({
 *   dialogCloseLabel: () => 'Cerrar',
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
