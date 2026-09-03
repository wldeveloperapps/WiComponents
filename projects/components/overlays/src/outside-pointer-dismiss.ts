import { isPlatformBrowser } from '@angular/common';
import { DestroyRef, inject, PLATFORM_ID } from '@angular/core';

/**
 * Cierre por clic fuera que ignora overlays CDK anidados (panes hermanos en
 * `.cdk-overlay-container`, p. ej. `wi-select` dentro de un popover).
 *
 * Brain/CDK tratan esos panes como "fuera" del overlay padre. El criterio se
 * decide en `pointerdown` (capture) para sobrevivir si el overlay hijo se
 * destruye en el mismo gesto (seleccionar una opción).
 *
 * @internal
 */
export function bindOutsidePointerDismiss(options: {
  document: Document;
  isOpen: () => boolean;
  enabled: () => boolean;
  overlayId: () => string;
  isInsideHost: (target: Node) => boolean;
  close: () => void;
}): void {
  if (!isPlatformBrowser(inject(PLATFORM_ID))) {
    return;
  }

  const destroyRef = inject(DestroyRef);
  // Hasta ver un pointerdown fuera, no cerrar (click sintético sin pointerdown).
  let pointerDownWasInside = true;

  const onPointerDown = (event: PointerEvent): void => {
    if (!options.isOpen() || !options.enabled()) {
      return;
    }
    pointerDownWasInside = isInsideDismissGuard(event.target, options);
  };

  const onClick = (): void => {
    const skip = pointerDownWasInside;
    pointerDownWasInside = true;
    if (skip || !options.isOpen() || !options.enabled()) {
      return;
    }
    options.close();
  };

  options.document.addEventListener('pointerdown', onPointerDown, true);
  options.document.addEventListener('click', onClick, true);
  destroyRef.onDestroy(() => {
    options.document.removeEventListener('pointerdown', onPointerDown, true);
    options.document.removeEventListener('click', onClick, true);
  });
}

function isInsideDismissGuard(
  target: EventTarget | null,
  options: {
    document: Document;
    overlayId: () => string;
    isInsideHost: (target: Node) => boolean;
  },
): boolean {
  if (!(target instanceof Node)) {
    return false;
  }
  if (options.isInsideHost(target)) {
    return true;
  }
  const ourPane = options.document.getElementById(options.overlayId());
  if (ourPane?.contains(target)) {
    return true;
  }
  const pane = target instanceof Element ? target.closest('.cdk-overlay-pane') : null;
  return pane !== null && pane !== ourPane;
}
