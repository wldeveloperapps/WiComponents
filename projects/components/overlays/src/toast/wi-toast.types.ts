/**
 * Tipos públicos del toast (`wiToast` / `wi-toaster`).
 * No reexportan APIs de Spartan.
 */

export type WiToastId = number | string;

export type WiToastPosition =
  'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export type WiToastTheme = 'light' | 'dark' | 'system' | 'auto';

export interface WiToastAction {
  label: string;
  onClick: (event: MouseEvent) => void;
}

export interface WiToastCancel {
  label: string;
  onClick?: () => void;
}

/**
 * Opciones por toast. El copy (título / descripción / labels) lo aporta la app (i18n).
 */
export interface WiToastOptions {
  id?: WiToastId;
  description?: string;
  /** Ms hasta auto-cierre. Default del toaster (4000). */
  duration?: number;
  /** Si `false`, no se puede descartar por swipe / botón. Default `true`. */
  dismissible?: boolean;
  /** Override del close button del toaster para este toast. */
  closeButton?: boolean;
  /** `aria-live="assertive"` cuando es crítico. Default `false`. */
  important?: boolean;
  position?: WiToastPosition;
  action?: WiToastAction;
  cancel?: WiToastCancel;
  onDismiss?: (id: WiToastId) => void;
  onAutoClose?: (id: WiToastId) => void;
}

export interface WiToastPromiseMessages<T = unknown> {
  loading: string;
  success: string | ((data: T) => string);
  error: string | ((error: unknown) => string);
}
