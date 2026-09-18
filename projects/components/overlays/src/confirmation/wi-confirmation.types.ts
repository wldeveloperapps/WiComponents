/**
 * Tipos públicos del bus de confirmación (`WiConfirmationService`).
 * Nombres Wi (no aliases PrimeNG).
 */

/** Variante del botón de confirmación (subset de `WiButtonVariant`). */
export type WiConfirmationConfirmVariant = 'primary' | 'danger';

/** Resultado de una petición de confirmación. */
export type WiConfirmationResult = 'confirmed' | 'cancelled' | 'dismissed';

/**
 * Petición que envía la app a `WiConfirmationService.confirm()`.
 *
 * Monta un host visual (`wi-confirm-dialog` o `wi-confirm-popup`) que escuche
 * por `key` (o el default según `target`).
 */
export interface WiConfirmation {
  /** Enruta la petición al host con la misma key. Sin key: dialogs (sin target) o popups (con target). */
  key?: string;
  /** Origen de anclaje; obligatorio para `wi-confirm-popup`. */
  target?: EventTarget | HTMLElement | null;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel?: string;
  confirmVariant?: WiConfirmationConfirmVariant;
  showCancel?: boolean;
  accept?: () => void | Promise<void>;
  reject?: () => void;
}

/**
 * Petición activa con id interno. Los hosts leen el copy desde aquí.
 * @internal exportado para tipar el mapa del servicio; no fabricar en la app.
 */
export interface WiConfirmationRequest extends WiConfirmation {
  readonly requestId: number;
  /** Key resuelta (incluye sentinel interno cuando la app no pasó key). */
  readonly resolvedKey: string;
}
