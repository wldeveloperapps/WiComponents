import { isDevMode, Service, signal } from '@angular/core';

import type {
  WiConfirmation,
  WiConfirmationRequest,
  WiConfirmationResult,
} from './wi-confirmation.types';

/** Sentinel interno cuando la app no pasa `key`. No es API pública. */
export const WI_CONFIRMATION_DEFAULT_KEY = '__wi_default__';

/** Kind del host visual que se registra en el servicio. */
export type WiConfirmationHostKind = 'dialog' | 'popup';

/** @internal */
export interface WiConfirmationHostRegistration {
  readonly kind: WiConfirmationHostKind;
  /** Key del host; `undefined` → default. */
  readonly key: () => string | undefined;
  readonly open: (request: WiConfirmationRequest) => void;
  readonly close: () => void;
}

interface PendingConfirmation {
  readonly request: WiConfirmationRequest;
  readonly resolve: (result: WiConfirmationResult) => void;
  readonly accept?: () => void | Promise<void>;
  readonly reject?: () => void;
}

let requestIdSequence = 0;

function resolveTarget(target: EventTarget | HTMLElement | null | undefined): HTMLElement | null {
  if (!target || !(target instanceof HTMLElement)) {
    return null;
  }
  return target;
}

function warn(message: string): void {
  if (isDevMode()) {
    console.warn(`[WiConfirmationService] ${message}`);
  }
}

/**
 * Servicio único de confirmación (dialog modal o popup anclado).
 *
 * Monta un host en el árbol:
 * ```html
 * <wi-confirm-dialog />
 * <!-- o -->
 * <wi-confirm-popup key="delete-item" />
 * ```
 *
 * ```ts
 * inject(WiConfirmationService).confirm({
 *   key: 'delete-item',
 *   target: event.currentTarget as HTMLElement,
 *   title: 'Eliminar',
 *   confirmLabel: 'Eliminar',
 *   confirmVariant: 'danger',
 *   accept: () => this.delete(),
 * });
 * ```
 */
@Service()
export class WiConfirmationService {
  private readonly hosts: WiConfirmationHostRegistration[] = [];
  private readonly pending = new Map<string, PendingConfirmation>();

  /** Mapa key → petición activa (zoneless-friendly). */
  private readonly activeByKey = signal<ReadonlyMap<string, WiConfirmationRequest>>(new Map());

  /**
   * Emite una petición de confirmación. El host visual correspondiente abre el overlay.
   * Una nueva petición con la misma key descarta la anterior como `'dismissed'`.
   */
  confirm(confirmation: WiConfirmation): Promise<WiConfirmationResult> {
    const target = resolveTarget(confirmation.target ?? null);
    const resolvedKey = confirmation.key ?? WI_CONFIRMATION_DEFAULT_KEY;
    const requestId = ++requestIdSequence;

    const request: WiConfirmationRequest = {
      ...confirmation,
      target,
      requestId,
      resolvedKey,
    };

    const matches = this.findHosts(request, target);

    if (matches.length === 0) {
      warn(
        confirmation.key
          ? `No host registered for key "${confirmation.key}". Mount <wi-confirm-dialog key="…" /> or <wi-confirm-popup key="…" />.`
          : target
            ? 'No popup host without key registered. Mount <wi-confirm-popup /> or pass key.'
            : 'No dialog host without key registered. Mount <wi-confirm-dialog /> or pass key.',
      );
      return Promise.resolve('dismissed');
    }

    if (matches.length > 1) {
      warn(
        `Multiple hosts match key "${resolvedKey === WI_CONFIRMATION_DEFAULT_KEY ? '(default)' : resolvedKey}". Using the last registered.`,
      );
    }

    const host = matches[matches.length - 1]!;

    if (host.kind === 'popup' && !target) {
      warn('Popup confirmation requires a target HTMLElement.');
      return Promise.resolve('dismissed');
    }

    if (!request.title || !request.confirmLabel) {
      warn('Confirmation requires title and confirmLabel.');
      return Promise.resolve('dismissed');
    }

    this.dismissPending(resolvedKey, 'dismissed');

    return new Promise<WiConfirmationResult>((resolve) => {
      this.pending.set(resolvedKey, {
        request,
        resolve,
        accept: confirmation.accept,
        reject: confirmation.reject,
      });
      this.patchActive(resolvedKey, request);
      host.open(request);
    });
  }

  /**
   * Cierra la petición activa de `key` (o la default) sin ejecutar `accept`/`reject`.
   * Resultado por defecto: `'dismissed'`.
   */
  close(key?: string, result: WiConfirmationResult = 'dismissed'): void {
    const resolvedKey = key ?? WI_CONFIRMATION_DEFAULT_KEY;
    const pending = this.pending.get(resolvedKey);
    if (!pending) {
      return;
    }
    this.settle(resolvedKey, result, { skipCallbacks: result === 'dismissed' });
  }

  /**
   * El host visual llama al confirmar / cancelar / dismiss del overlay.
   * @internal
   */
  settleFromHost(
    resolvedKey: string,
    requestId: number,
    result: WiConfirmationResult,
  ): void {
    const pending = this.pending.get(resolvedKey);
    if (!pending || pending.request.requestId !== requestId) {
      return;
    }
    this.settle(resolvedKey, result, {
      skipCallbacks: result === 'dismissed',
    });
  }

  /**
   * Registra un host visual. Devuelve función de unregister.
   * @internal
   */
  registerHost(registration: WiConfirmationHostRegistration): () => void {
    this.hosts.push(registration);
    return () => {
      const index = this.hosts.indexOf(registration);
      if (index >= 0) {
        this.hosts.splice(index, 1);
      }
      const hostKey = registration.key() ?? WI_CONFIRMATION_DEFAULT_KEY;
      const pending = this.pending.get(hostKey);
      if (pending) {
        // Host destruido con overlay abierto: dismiss.
        this.settle(hostKey, 'dismissed', { skipCallbacks: true });
      }
    };
  }

  /**
   * Petición activa para un host (por su key input).
   * @internal
   */
  activeRequestFor(hostKey: string | undefined): WiConfirmationRequest | undefined {
    const resolved = hostKey ?? WI_CONFIRMATION_DEFAULT_KEY;
    return this.activeByKey().get(resolved);
  }

  private findHosts(
    request: WiConfirmationRequest,
    target: HTMLElement | null,
  ): WiConfirmationHostRegistration[] {
    if (request.key !== undefined) {
      return this.hosts.filter((host) => host.key() === request.key);
    }

    // Sin key: dialogs si no hay target; popups si hay target.
    if (target) {
      return this.hosts.filter((host) => host.kind === 'popup' && host.key() === undefined);
    }
    return this.hosts.filter((host) => host.kind === 'dialog' && host.key() === undefined);
  }

  private dismissPending(resolvedKey: string, result: WiConfirmationResult): void {
    if (!this.pending.has(resolvedKey)) {
      return;
    }
    this.settle(resolvedKey, result, { skipCallbacks: true });
  }

  private settle(
    resolvedKey: string,
    result: WiConfirmationResult,
    options: { skipCallbacks: boolean },
  ): void {
    const pending = this.pending.get(resolvedKey);
    if (!pending) {
      return;
    }
    this.pending.delete(resolvedKey);
    this.patchActive(resolvedKey, undefined);

    for (const host of this.hosts) {
      const hostKey = host.key() ?? WI_CONFIRMATION_DEFAULT_KEY;
      if (hostKey === resolvedKey) {
        host.close();
      }
    }

    if (!options.skipCallbacks) {
      if (result === 'confirmed') {
        void pending.accept?.();
      } else if (result === 'cancelled') {
        pending.reject?.();
      }
    }

    pending.resolve(result);
  }

  private patchActive(resolvedKey: string, request: WiConfirmationRequest | undefined): void {
    const next = new Map(this.activeByKey());
    if (request) {
      next.set(resolvedKey, request);
    } else {
      next.delete(resolvedKey);
    }
    this.activeByKey.set(next);
  }
}
