import { toast as brnToast } from '@spartan-ng/brain/sonner';

import type { WiToastId, WiToastOptions, WiToastPromiseMessages } from './wi-toast.types';

type BrnExternalToast = NonNullable<Parameters<typeof brnToast>[1]>;

function mapOptions(options?: WiToastOptions): BrnExternalToast | undefined {
  if (!options) {
    return undefined;
  }

  const {
    id,
    description,
    duration,
    dismissible,
    closeButton,
    important,
    position,
    action,
    cancel,
    onDismiss,
    onAutoClose,
  } = options;

  return {
    id,
    description,
    duration,
    dismissible,
    closeButton,
    important,
    position,
    action,
    cancel,
    onDismiss: onDismiss ? (t) => onDismiss(t.id) : undefined,
    onAutoClose: onAutoClose ? (t) => onAutoClose(t.id) : undefined,
  };
}

function createToast(message: string, options?: WiToastOptions): WiToastId {
  return brnToast(message, mapOptions(options));
}

/**
 * API imperativa de toasts (`wiToast`).
 *
 * Requiere un `<wi-toaster />` montado una vez (p. ej. en el root de la app).
 * No clona `MessageService` de Prime: API propia tipada.
 *
 * ```ts
 * wiToast('Guardado');
 * wiToast.success('Listo', { description: 'El registro se actualizó' });
 * wiToast.error('Error', { important: true });
 * const id = wiToast.loading('Guardando…');
 * wiToast.dismiss(id);
 * ```
 */
export const wiToast = Object.assign(createToast, {
  message: (message: string, options?: WiToastOptions): WiToastId =>
    brnToast.message(message, mapOptions(options)),

  success: (message: string, options?: WiToastOptions): WiToastId =>
    brnToast.success(message, mapOptions(options)),

  info: (message: string, options?: WiToastOptions): WiToastId =>
    brnToast.info(message, mapOptions(options)),

  warning: (message: string, options?: WiToastOptions): WiToastId =>
    brnToast.warning(message, mapOptions(options)),

  error: (message: string, options?: WiToastOptions): WiToastId =>
    brnToast.error(message, mapOptions(options)),

  loading: (message: string, options?: WiToastOptions): WiToastId =>
    brnToast.loading(message, mapOptions(options)),

  /**
   * Toast ligado a una promesa (loading → success | error).
   * Los textos los aporta la app.
   */
  promise: <T>(
    promise: Promise<T> | (() => Promise<T>),
    messages: WiToastPromiseMessages<T> & WiToastOptions,
  ): WiToastId | undefined => {
    const { loading, success, error, ...options } = messages;

    return brnToast.promise(promise, {
      ...mapOptions(options),
      loading,
      success,
      error,
    });
  },

  /** Cierra un toast por id, o todos si no se pasa id. */
  dismiss: (id?: WiToastId): WiToastId | undefined => brnToast.dismiss(id),
});
