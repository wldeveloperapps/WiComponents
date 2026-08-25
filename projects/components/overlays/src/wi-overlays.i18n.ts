import { inject, InjectionToken, type Provider } from '@angular/core';

/**
 * Locale / chrome i18n de overlays (`wi-dialog`, `wi-confirm-dialog`, `wi-confirm-popup`, `wi-toaster`, …).
 * Sin diccionarios de producto: la app provee el copy.
 */
export interface WiOverlaysI18n {
  dialogCloseLabel: () => string;
  /** Label por defecto del botón cancelar en `wi-confirm-dialog` / `wi-confirm-popup`. */
  confirmCancelLabel: () => string;
  /** `aria-label` del botón cerrar de cada toast (`wi-toaster`). */
  toastCloseLabel: () => string;
  /**
   * Prefijo del `aria-label` de la región de notificaciones.
   * Se concatena con el hotkey (p. ej. `Notificaciones Alt+T`).
   */
  toastRegionLabel: () => string;
}

const defaultOverlaysI18n: WiOverlaysI18n = {
  dialogCloseLabel: () => 'Close',
  confirmCancelLabel: () => 'Cancel',
  toastCloseLabel: () => 'Close toast',
  toastRegionLabel: () => 'Notifications',
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
 *   toastCloseLabel: () => 'Cerrar notificación',
 *   toastRegionLabel: () => 'Notificaciones',
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
