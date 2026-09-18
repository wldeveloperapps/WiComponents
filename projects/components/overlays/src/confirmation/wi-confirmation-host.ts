import { isPlatformBrowser } from '@angular/common';
import {
  computed,
  DestroyRef,
  inject,
  type InputSignal,
  type InputSignalWithTransform,
  PLATFORM_ID,
  type Signal,
} from '@angular/core';

import {
  WiConfirmationService,
  type WiConfirmationHostKind,
} from './wi-confirmation.service';
import type { WiConfirmationRequest, WiConfirmationResult } from './wi-confirmation.types';

type BooleanInput = InputSignal<boolean> | InputSignalWithTransform<boolean, unknown>;

/** @internal API compartida entre dialog y popup para el bus de confirmación. */
export interface WiConfirmationHostBindings {
  readonly activeRequest: Signal<WiConfirmationRequest | undefined>;
  readonly resolvedTitle: Signal<string>;
  readonly resolvedDescription: Signal<string | undefined>;
  readonly resolvedConfirmLabel: Signal<string>;
  readonly resolvedCancelLabelOverride: Signal<string | undefined>;
  readonly resolvedConfirmVariant: Signal<'primary' | 'danger'>;
  readonly resolvedShowCancel: Signal<boolean>;
  /** Confirmar / cancelar / dismiss desde el visual. */
  settle(result: WiConfirmationResult): void;
  /**
   * Cuando el overlay pasa a closed sin haber pasado por confirm/cancel
   * (Escape, clic fuera, etc.), descarta la petición activa.
   */
  dismissIfActive(): void;
}

/**
 * Registra el host en `WiConfirmationService` y expone copy resuelto (request ?? inputs).
 * @internal
 */
export function bindWiConfirmationHost(options: {
  kind: WiConfirmationHostKind;
  key: InputSignal<string | undefined>;
  title: InputSignal<string | undefined>;
  description: InputSignal<string | undefined>;
  confirmLabel: InputSignal<string | undefined>;
  cancelLabel: InputSignal<string | undefined>;
  confirmVariant: InputSignal<'primary' | 'danger'>;
  showCancel: BooleanInput;
  openFromRequest: (request: WiConfirmationRequest) => void;
  closeOverlay: () => void;
}): WiConfirmationHostBindings {
  const service = inject(WiConfirmationService);
  const destroyRef = inject(DestroyRef);
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  const activeRequest = computed(() => service.activeRequestFor(options.key()));

  const resolvedTitle = computed(
    () => activeRequest()?.title ?? options.title() ?? '',
  );
  const resolvedDescription = computed(
    () => activeRequest()?.description ?? options.description(),
  );
  const resolvedConfirmLabel = computed(
    () => activeRequest()?.confirmLabel ?? options.confirmLabel() ?? '',
  );
  const resolvedCancelLabelOverride = computed(
    () => activeRequest()?.cancelLabel ?? options.cancelLabel(),
  );
  const resolvedConfirmVariant = computed(
    () => activeRequest()?.confirmVariant ?? options.confirmVariant(),
  );
  const resolvedShowCancel = computed(() => {
    const fromRequest = activeRequest()?.showCancel;
    return fromRequest !== undefined ? fromRequest : options.showCancel();
  });

  /** Evita settle duplicado tras confirm/cancel. */
  let handledRequestId: number | undefined;

  const unregister = service.registerHost({
    kind: options.kind,
    key: () => options.key(),
    open: (request) => {
      if (!isBrowser) {
        return;
      }
      handledRequestId = undefined;
      options.openFromRequest(request);
    },
    close: () => options.closeOverlay(),
  });

  destroyRef.onDestroy(() => {
    unregister();
  });

  function settle(result: WiConfirmationResult): void {
    const request = activeRequest();
    if (!request) {
      options.closeOverlay();
      return;
    }
    if (handledRequestId === request.requestId) {
      return;
    }
    handledRequestId = request.requestId;
    // El servicio cierra los hosts al settle; no hace falta closeOverlay aquí.
    service.settleFromHost(request.resolvedKey, request.requestId, result);
  }

  function dismissIfActive(): void {
    const request = activeRequest();
    if (!request || handledRequestId === request.requestId) {
      return;
    }
    handledRequestId = request.requestId;
    service.settleFromHost(request.resolvedKey, request.requestId, 'dismissed');
  }

  return {
    activeRequest,
    resolvedTitle,
    resolvedDescription,
    resolvedConfirmLabel,
    resolvedCancelLabelOverride,
    resolvedConfirmVariant,
    resolvedShowCancel,
    settle,
    dismissIfActive,
  };
}
