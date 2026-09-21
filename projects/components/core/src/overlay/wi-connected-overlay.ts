import {
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef,
  type PositionStrategy,
} from '@angular/cdk/overlay';
import { ApplicationRef, ElementRef, type Injector } from '@angular/core';

const SCROLLABLE_OVERFLOW = new Set(['auto', 'scroll', 'overlay']);
const PATCHED = Symbol.for('wi.connectedOverlay.patched');
const STACKING_STYLE_ID = 'wi-connected-overlay-stacking';

/** CDK overlay-prebuilt: sin esto, al salir del top-layer el panel queda bajo cards / overflow. */
const STACKING_CSS = `
.cdk-overlay-container {
  position: fixed;
  z-index: 1000;
  pointer-events: none;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
.cdk-overlay-container:empty {
  display: none;
}
.cdk-overlay-pane {
  position: absolute;
  pointer-events: auto;
  box-sizing: border-box;
  display: flex;
  max-width: 100%;
  max-height: 100%;
  z-index: 1000;
}
.cdk-overlay-connected-position-bounding-box {
  position: absolute;
  z-index: 1000;
}
`;

interface PatchFlag {
  [PATCHED]?: boolean;
}

const boundOverlays = new WeakMap<OverlayRef, () => void>();

function isScrollableOverflow(value: string): boolean {
  return SCROLLABLE_OVERFLOW.has(value);
}

/**
 * Ancestros con `overflow: auto | scroll | overlay`.
 * No incluye `documentElement` / `body`: el scroll de ventana ya lo cubre CDK.
 */
export function findOverflowAncestors(origin: Element): HTMLElement[] {
  const ancestors: HTMLElement[] = [];
  if (typeof getComputedStyle !== 'function') {
    return ancestors;
  }

  let current = origin.parentElement;
  while (current) {
    const root = current.ownerDocument.documentElement;
    const body = current.ownerDocument.body;
    if (current === root || current === body) {
      break;
    }
    const style = getComputedStyle(current);
    if (
      isScrollableOverflow(style.overflowY) ||
      isScrollableOverflow(style.overflowX) ||
      isScrollableOverflow(style.overflow)
    ) {
      ancestors.push(current);
    }
    current = current.parentElement;
  }

  return ancestors;
}

function isFlexibleConnectedPositionStrategy(
  strategy: PositionStrategy | undefined | null,
): strategy is FlexibleConnectedPositionStrategy {
  return (
    !!strategy &&
    typeof (strategy as FlexibleConnectedPositionStrategy).withScrollableContainers ===
      'function' &&
    typeof (strategy as FlexibleConnectedPositionStrategy).setOrigin === 'function'
  );
}

function originElementFromStrategy(
  strategy: FlexibleConnectedPositionStrategy,
): HTMLElement | null {
  const origin = (strategy as FlexibleConnectedPositionStrategy & { _origin?: unknown })._origin;
  if (origin instanceof HTMLElement) {
    return origin;
  }
  if (typeof origin === 'object' && origin !== null && 'nativeElement' in origin) {
    const element = (origin as ElementRef<unknown>).nativeElement;
    return element instanceof HTMLElement ? element : null;
  }
  return null;
}

function ensureOverlayStackingStyles(): void {
  if (typeof document === 'undefined' || document.getElementById(STACKING_STYLE_ID)) {
    return;
  }
  const style = document.createElement('style');
  style.id = STACKING_STYLE_ID;
  style.textContent = STACKING_CSS;
  document.head.appendChild(style);
}

function withConnectedOverlayDefaults(config?: OverlayConfig): OverlayConfig | undefined {
  if (!config || !isFlexibleConnectedPositionStrategy(config.positionStrategy)) {
    return config;
  }
  return { ...config, usePopover: false };
}

function disablePopoverLayer(overlayRef: OverlayRef): void {
  const config = overlayRef.getConfig();
  config.usePopover = false;

  const host = overlayRef.hostElement;
  if (!host) {
    return;
  }

  if (typeof host.hidePopover === 'function' && host.hasAttribute('popover')) {
    try {
      host.hidePopover();
    } catch {
      // Aún no está abierto como popover.
    }
    host.removeAttribute('popover');
  }
  host.classList.remove('cdk-overlay-popover');
}

function bindConnectedOverlay(overlayRef: OverlayRef): void {
  boundOverlays.get(overlayRef)?.();

  const strategy = overlayRef.getConfig().positionStrategy;
  if (!isFlexibleConnectedPositionStrategy(strategy)) {
    return;
  }

  disablePopoverLayer(overlayRef);

  const origin = originElementFromStrategy(strategy);
  if (!origin) {
    return;
  }

  const ancestors = findOverflowAncestors(origin);
  if (ancestors.length === 0) {
    return;
  }

  strategy.withScrollableContainers(
    ancestors.map((element) => ({
      getElementRef: () => new ElementRef(element),
    })) as Parameters<FlexibleConnectedPositionStrategy['withScrollableContainers']>[0],
  );

  const cleanups: (() => void)[] = [];
  for (const element of ancestors) {
    const onScroll = (): void => {
      overlayRef.updatePosition();
    };
    element.addEventListener('scroll', onScroll, { passive: true });
    cleanups.push(() => element.removeEventListener('scroll', onScroll));
  }

  const dispose = (): void => {
    for (const cleanup of cleanups) {
      cleanup();
    }
    boundOverlays.delete(overlayRef);
  };
  boundOverlays.set(overlayRef, dispose);

  const subscription = overlayRef.detachments().subscribe(() => {
    subscription.unsubscribe();
    dispose();
  });
}

/**
 * Intercepta overlays CDK anclados a un origen:
 * - `usePopover: false` (el panel no salta al top-layer; stacking CDK z-index 1000).
 * - Reposiciona al hacer scroll en overflow anidado (no solo window / `cdkScrollable`).
 *
 * Lo invocan los componentes Wi de overlay; las apps no tienen que parchear Overlay ni
 * poner `cdkScrollable` en cada contenedor.
 */
export function applyWiConnectedOverlayPatch(): void {
  const overlayProto = Overlay.prototype as Overlay & PatchFlag;
  if (overlayProto[PATCHED]) {
    return;
  }
  overlayProto[PATCHED] = true;
  ensureOverlayStackingStyles();

  const originalCreate = Overlay.prototype.create;
  Overlay.prototype.create = function (this: Overlay, config?: OverlayConfig): OverlayRef {
    return originalCreate.call(this, withConnectedOverlayDefaults(config));
  };

  const originalAttach = OverlayRef.prototype.attach;
  OverlayRef.prototype.attach = function (
    this: OverlayRef,
    portal: Parameters<OverlayRef['attach']>[0],
  ) {
    const connected = isFlexibleConnectedPositionStrategy(this.getConfig().positionStrategy);
    if (connected) {
      bindConnectedOverlay(this);
    }

    const result = originalAttach.call(this, portal);

    if (connected) {
      queueMicrotask(() => {
        if (!this.hasAttached()) {
          return;
        }
        const injector = (this as unknown as { _injector?: Injector })._injector;
        injector?.get(ApplicationRef, null, { optional: true })?.tick();
        this.updatePosition();
      });
    }

    return result;
  };
}
