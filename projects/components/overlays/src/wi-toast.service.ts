import { Service } from '@angular/core';

import { wiToast } from './wi-toast';
import type { WiToastId, WiToastOptions, WiToastPromiseMessages } from './wi-toast.types';

/**
 * Servicio inyectable del toast (misma API que `wiToast`).
 *
 * Preferible en DI / tests; la función `wiToast` sirve en handlers sueltos.
 * Requiere `<wi-toaster />` en el árbol de la app.
 */
@Service()
export class WiToast {
  show(message: string, options?: WiToastOptions): WiToastId {
    return wiToast(message, options);
  }

  message(message: string, options?: WiToastOptions): WiToastId {
    return wiToast.message(message, options);
  }

  success(message: string, options?: WiToastOptions): WiToastId {
    return wiToast.success(message, options);
  }

  info(message: string, options?: WiToastOptions): WiToastId {
    return wiToast.info(message, options);
  }

  warning(message: string, options?: WiToastOptions): WiToastId {
    return wiToast.warning(message, options);
  }

  error(message: string, options?: WiToastOptions): WiToastId {
    return wiToast.error(message, options);
  }

  loading(message: string, options?: WiToastOptions): WiToastId {
    return wiToast.loading(message, options);
  }

  promise<T>(
    promise: Promise<T> | (() => Promise<T>),
    messages: WiToastPromiseMessages<T> & WiToastOptions,
  ): WiToastId | undefined {
    return wiToast.promise(promise, messages);
  }

  dismiss(id?: WiToastId): WiToastId | undefined {
    return wiToast.dismiss(id);
  }
}
