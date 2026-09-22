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

/**
 * Selectores Wi de paneles transitorios: al scroll fuera del pane se cierran.
 * Datepicker / date-range / popover / confirm-popup siguen reposicionando.
 */
const CLOSE_ON_SCROLL_SELECTORS = ['.wi-select__panel', '.wi-menu', '.wi-tooltip'] as const;

/**
 * CDK overlay-prebuilt: sin esto, al salir del top-layer el panel queda bajo cards / overflow.
 * Capas de app: header/migas `z-index: 10` (< 1000); overlay `1000`; sidebar `1100`.
 */
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

type ScrollPolicy = 'close' | 'reposition';

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

/** Clasifica el pane Wi: select/menu/tooltip cierran; el resto reposiciona. */
export function resolveScrollPolicy(paneRoot: Element | null | undefined): ScrollPolicy {
  if (!paneRoot || typeof paneRoot.querySelector !== 'function') {
    return 'reposition';
  }
  for (const selector of CLOSE_ON_SCROLL_SELECTORS) {
    if (
      (paneRoot instanceof Element && paneRoot.matches(selector)) ||
      paneRoot.querySelector(selector)
    ) {
      return 'close';
    }
  }
  return 'reposition';
}

function eventTargetInside(root: Element | null, event: Event): boolean {
  const target = event.target;
  return !!root && target instanceof Node && root.contains(target);
}

function canScrollElement(element: HTMLElement): boolean {
  return (
    element.scrollHeight > element.clientHeight + 1 ||
    element.scrollWidth > element.clientWidth + 1
  );
}

function paneCanScroll(pane: HTMLElement): boolean {
  if (canScrollElement(pane)) {
    return true;
  }
  const scrollables = pane.querySelectorAll<HTMLElement>('*');
  for (const el of scrollables) {
    if (canScrollElement(el)) {
      return true;
    }
  }
  return false;
}

const CLOSE_ANIMATION_MS = 140;

function prefersReducedMotion(doc: Document): boolean {
  const view = doc.defaultView;
  return !!view?.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
}

/**
 * Cierre suave: dispara `data-state=closed` (animate-out del menú) + fade/scale corto,
 * luego `detach`. Sin animación si no hay Web Animations o reduced-motion.
 */
function softDetach(overlayRef: OverlayRef): void {
  if (!overlayRef.hasAttached()) {
    return;
  }

  const pane = overlayRef.overlayElement as HTMLElement | null;
  if (!pane) {
    overlayRef.detach();
    return;
  }
  if (pane.dataset['wiClosing'] === '1') {
    return;
  }

  pane.dataset['wiClosing'] = '1';
  pane.style.pointerEvents = 'none';

  for (const el of pane.querySelectorAll('[data-state="open"]')) {
    el.setAttribute('data-state', 'closed');
  }
  if (pane.getAttribute('data-state') === 'open') {
    pane.setAttribute('data-state', 'closed');
  }

  const finish = (): void => {
    if (overlayRef.hasAttached()) {
      overlayRef.detach();
    }
  };

  if (prefersReducedMotion(pane.ownerDocument) || typeof pane.animate !== 'function') {
    finish();
    return;
  }

  const animation = pane.animate(
    [
      { opacity: 1, transform: 'scale(1)' },
      { opacity: 0, transform: 'scale(0.96)' },
    ],
    { duration: CLOSE_ANIMATION_MS, easing: 'ease-out', fill: 'forwards' },
  );

  void animation.finished.then(finish, finish);
  // Fallback si `finished` no resuelve (entornos raros).
  pane.ownerDocument.defaultView?.setTimeout(finish, CLOSE_ANIMATION_MS + 40);
}

/**
 * Enlace post-attach: política close (select/menu/tooltip) o reposition (calendarios, popover…).
 * Close: scroll de ancestors/ventana fuera del pane → softDetach; wheel interno no cierra.
 */
function bindConnectedOverlayAfterAttach(overlayRef: OverlayRef): void {
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
  if (ancestors.length > 0) {
    strategy.withScrollableContainers(
      ancestors.map((element) => ({
        getElementRef: () => new ElementRef(element),
      })) as Parameters<FlexibleConnectedPositionStrategy['withScrollableContainers']>[0],
    );
  }

  const pane = overlayRef.overlayElement as HTMLElement | null;
  const policy = resolveScrollPolicy(pane);
  const cleanups: (() => void)[] = [];

  if (policy === 'close') {
    const closeOutside = (event: Event): void => {
      if (!overlayRef.hasAttached()) {
        return;
      }
      if (eventTargetInside(pane, event)) {
        return;
      }
      softDetach(overlayRef);
    };

    for (const element of ancestors) {
      element.addEventListener('scroll', closeOutside, { passive: true });
      cleanups.push(() => element.removeEventListener('scroll', closeOutside));
    }

    const view = origin.ownerDocument.defaultView;
    if (view) {
      view.addEventListener('scroll', closeOutside, { passive: true, capture: true });
      cleanups.push(() => view.removeEventListener('scroll', closeOutside, true));
    }

    if (pane) {
      const onWheel = (event: WheelEvent): void => {
        if (!eventTargetInside(pane, event)) {
          return;
        }
        if (!paneCanScroll(pane)) {
          event.preventDefault();
        }
      };
      pane.addEventListener('wheel', onWheel, { passive: false });
      cleanups.push(() => pane.removeEventListener('wheel', onWheel));
    }

    if (typeof IntersectionObserver === 'function') {
      const root = ancestors[0] ?? null;
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry || entry.intersectionRatio > 0 || !overlayRef.hasAttached()) {
            return;
          }
          softDetach(overlayRef);
        },
        { root, threshold: 0 },
      );
      observer.observe(origin);
      cleanups.push(() => observer.disconnect());
    }
  } else if (ancestors.length > 0) {
    for (const element of ancestors) {
      const onScroll = (): void => {
        overlayRef.updatePosition();
      };
      element.addEventListener('scroll', onScroll, { passive: true });
      cleanups.push(() => element.removeEventListener('scroll', onScroll));
    }
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
 * Pre-attach: solo quita top-layer Popover API. El scroll se enlaza tras attach
 * (cuando el pane ya tiene clases Wi para la política close/reposition).
 */
function prepareConnectedOverlay(overlayRef: OverlayRef): void {
  const strategy = overlayRef.getConfig().positionStrategy;
  if (!isFlexibleConnectedPositionStrategy(strategy)) {
    return;
  }
  disablePopoverLayer(overlayRef);
}

/**
 * Intercepta overlays CDK anclados a un origen:
 * - `usePopover: false` (el panel no salta al top-layer; stacking CDK z-index 1000:
 *   encima de header/migas a 10, debajo del sidebar a 1100).
 * - Select / menú / tooltip: cierran al scroll fuera del pane (overflow anidado o ventana).
 * - Datepicker / date-range / popover / confirm-popup: reposicionan en overflow anidado.
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
      prepareConnectedOverlay(this);
    }

    const result = originalAttach.call(this, portal);

    if (connected) {
      queueMicrotask(() => {
        if (!this.hasAttached()) {
          return;
        }
        const injector = (this as unknown as { _injector?: Injector })._injector;
        injector?.get(ApplicationRef, null, { optional: true })?.tick();
        bindConnectedOverlayAfterAttach(this);
        this.updatePosition();
      });
    }

    return result;
  };
}
