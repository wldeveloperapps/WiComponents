import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  applyWiConnectedOverlayPatch,
  findOverflowAncestors,
  resolveScrollPolicy,
} from '../../core/src/overlay/wi-connected-overlay';

@Component({
  template: `<span>panel</span>`,
})
class OverlayPanelStub {}

@Component({
  template: `<div class="wi-menu"><button type="button">Item</button></div>`,
})
class MenuPanelStub {}

@Component({
  template: `<div class="wi-select__panel" role="listbox"><div>Option</div></div>`,
})
class SelectPanelStub {}

@Component({
  template: `<div class="wi-datepicker__panel"><div role="grid">Calendar</div></div>`,
})
class DatepickerPanelStub {}

const TOP_LAYER_PATCHED = Symbol.for('wi.connectedOverlay.spec.topLayer');
const openPopovers = new WeakSet<Element>();
const modalDialogs = new WeakSet<Element>();

interface TopLayerFlag {
  [TOP_LAYER_PATCHED]?: boolean;
}

/**
 * jsdom no implementa Popover API ni `:popover-open` / `dialog:modal`.
 * El polyfill marca el estado abierto para que `closest` resuelva como en el navegador.
 */
function polyfillPopoverApi(): void {
  const elementProto = Element.prototype as Element & TopLayerFlag;
  if (!elementProto[TOP_LAYER_PATCHED]) {
    elementProto[TOP_LAYER_PATCHED] = true;
    const nativeMatches = Element.prototype.matches;
    const nativeClosest = Element.prototype.closest;

    const matches: (this: Element, selector: string) => boolean = function (
      this: Element,
      selector: string,
    ): boolean {
      if (selector === ':popover-open') {
        return openPopovers.has(this) || safeNativeMatches(nativeMatches, this, selector);
      }
      if (selector === 'dialog:modal') {
        return modalDialogs.has(this) || safeNativeMatches(nativeMatches, this, selector);
      }
      return nativeMatches.call(this, selector);
    };
    Element.prototype.matches = matches as typeof Element.prototype.matches;

    const closest: (this: Element, selector: string) => Element | null = function (
      this: Element,
      selector: string,
    ): Element | null {
      if (selector === ':popover-open' || selector === 'dialog:modal') {
        let current: Element | null = this;
        while (current) {
          if (current.matches(selector)) {
            return current;
          }
          current = current.parentElement;
        }
        return null;
      }
      return nativeClosest.call(this, selector);
    };
    Element.prototype.closest = closest as typeof Element.prototype.closest;
  }

  const htmlProto = HTMLElement.prototype as HTMLElement & {
    showPopover?: () => void;
    hidePopover?: () => void;
  };
  if (typeof htmlProto.showPopover !== 'function') {
    htmlProto.showPopover = function (this: HTMLElement): void {
      if (!this.hasAttribute('popover')) {
        throw new DOMException('Not a popover element', 'InvalidStateError');
      }
      if (openPopovers.has(this)) {
        throw new DOMException('Popover already open', 'InvalidStateError');
      }
      openPopovers.add(this);
    };
  }
  if (typeof htmlProto.hidePopover !== 'function') {
    htmlProto.hidePopover = function (this: HTMLElement): void {
      if (!openPopovers.has(this)) {
        throw new DOMException('Popover not open', 'InvalidStateError');
      }
      openPopovers.delete(this);
    };
  }

  const dialogProto = HTMLDialogElement.prototype as HTMLDialogElement & {
    showModal?: () => void;
  };
  if (typeof dialogProto.showModal !== 'function') {
    dialogProto.showModal = function (this: HTMLDialogElement): void {
      this.setAttribute('open', '');
      modalDialogs.add(this);
    };
  }
}

function safeNativeMatches(
  nativeMatches: (selector: string) => boolean,
  element: Element,
  selector: string,
): boolean {
  try {
    return nativeMatches.call(element, selector);
  } catch {
    return false;
  }
}

function openPopoverHost(): HTMLElement {
  const host = document.createElement('div');
  host.setAttribute('popover', 'manual');
  document.body.appendChild(host);
  host.showPopover();
  return host;
}

function connectedOverlay(overlay: Overlay, origin: HTMLElement) {
  return overlay.create({
    positionStrategy: overlay
      .position()
      .flexibleConnectedTo(origin)
      .withPositions([
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
      ]),
  });
}

function flushMicrotasks(): Promise<void> {
  return Promise.resolve();
}

/** Espera el softDetach (~140ms) + margen. */
function waitForSoftClose(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 220));
}

describe('wi-connected-overlay', () => {
  beforeAll(() => {
    polyfillPopoverApi();
    applyWiConnectedOverlayPatch();
  });

  describe('findOverflowAncestors', () => {
    it('detects overflow auto|scroll|overlay and skips hidden, body and html', () => {
      const outer = document.createElement('div');
      outer.style.overflow = 'hidden';
      const scroller = document.createElement('div');
      scroller.style.overflowY = 'auto';
      const nested = document.createElement('div');
      nested.style.overflow = 'scroll';
      const origin = document.createElement('button');

      document.body.appendChild(outer);
      outer.appendChild(scroller);
      scroller.appendChild(nested);
      nested.appendChild(origin);

      const ancestors = findOverflowAncestors(origin);
      expect(ancestors).toEqual([nested, scroller]);

      outer.remove();
    });
  });

  describe('resolveScrollPolicy', () => {
    it('closes for select, menu and tooltip panels', () => {
      const menu = document.createElement('div');
      menu.className = 'wi-menu';
      expect(resolveScrollPolicy(menu)).toBe('close');

      const select = document.createElement('div');
      select.innerHTML = '<div class="wi-select__panel"></div>';
      expect(resolveScrollPolicy(select)).toBe('close');

      const tooltip = document.createElement('div');
      tooltip.innerHTML = '<div class="wi-tooltip"></div>';
      expect(resolveScrollPolicy(tooltip)).toBe('close');
    });

    it('repositions for datepicker, date-range, popover, confirm-popup and unknown', () => {
      for (const className of [
        'wi-datepicker__panel',
        'wi-date-range__panel',
        'wi-popover__pane',
        'wi-confirm-popup__pane',
        'unknown-panel',
      ]) {
        const el = document.createElement('div');
        el.className = className;
        expect(resolveScrollPolicy(el)).toBe('reposition');
      }
      expect(resolveScrollPolicy(null)).toBe('reposition');
    });
  });

  describe('Overlay patch', () => {
    let overlay: Overlay;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      overlay = TestBed.inject(Overlay);
    });

    afterEach(() => {
      document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
    });

    it('sets usePopover false on connected overlays and skips top-layer chrome', () => {
      const origin = document.createElement('button');
      document.body.appendChild(origin);

      const ref = overlay.create({
        positionStrategy: overlay
          .position()
          .flexibleConnectedTo(origin)
          .withPositions([
            { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
          ]),
      });

      expect(ref.getConfig().usePopover).toBe(false);
      expect(ref.hostElement.hasAttribute('popover')).toBe(false);
      expect(ref.hostElement.classList.contains('cdk-overlay-popover')).toBe(false);

      const container = document.querySelector('.cdk-overlay-container');
      expect(container).toBeTruthy();
      expect(getComputedStyle(container as HTMLElement).position).toBe('fixed');
      expect(getComputedStyle(container as HTMLElement).zIndex).toBe('1000');

      ref.dispose();
      origin.remove();
    });

    it('leaves global overlays on the default popover path', () => {
      const ref = overlay.create({
        positionStrategy: overlay.position().global().centerHorizontally().centerVertically(),
      });

      expect(ref.getConfig().usePopover).toBe(true);
      expect(ref.hostElement.getAttribute('popover')).toBe('manual');
      expect(ref.hostElement.classList.contains('cdk-overlay-popover')).toBe(true);

      ref.dispose();
    });

    it('keeps usePopover when the origin is inside an open popover and leaves the parent open on dispose', async () => {
      const parent = openPopoverHost();
      const origin = document.createElement('button');
      parent.appendChild(origin);
      expect(parent.matches(':popover-open')).toBe(true);

      const ref = connectedOverlay(overlay, origin);
      expect(ref.getConfig().usePopover).toBe(true);
      expect(ref.hostElement.getAttribute('popover')).toBe('manual');
      expect(ref.hostElement.classList.contains('cdk-overlay-popover')).toBe(true);

      ref.attach(new ComponentPortal(SelectPanelStub));
      await flushMicrotasks();

      expect(ref.getConfig().usePopover).toBe(true);
      expect(ref.hostElement.hasAttribute('popover')).toBe(true);
      expect(ref.hostElement.getAttribute('popover')).toBe('manual');
      expect(ref.hostElement.classList.contains('cdk-overlay-popover')).toBe(true);
      expect(parent.matches(':popover-open')).toBe(true);

      const container = document.querySelector('.cdk-overlay-container');
      expect(getComputedStyle(container as HTMLElement).zIndex).toBe('1000');

      ref.dispose();
      expect(parent.matches(':popover-open')).toBe(true);

      parent.remove();
    });

    it('keeps usePopover when the origin is inside a modal dialog', () => {
      const dialog = document.createElement('dialog');
      const origin = document.createElement('button');
      dialog.appendChild(origin);
      document.body.appendChild(dialog);
      dialog.showModal();
      expect(origin.closest('dialog:modal')).toBe(dialog);

      const ref = connectedOverlay(overlay, origin);
      expect(ref.getConfig().usePopover).toBe(true);
      expect(ref.hostElement.getAttribute('popover')).toBe('manual');
      expect(ref.hostElement.classList.contains('cdk-overlay-popover')).toBe(true);

      ref.dispose();
      expect(origin.closest('dialog:modal')).toBe(dialog);
      dialog.remove();
    });

    it('detaches select panels on scroll when the origin is inside an open popover', async () => {
      const parent = openPopoverHost();
      const scroller = document.createElement('div');
      scroller.style.overflow = 'auto';
      scroller.style.height = '80px';
      const origin = document.createElement('button');
      scroller.appendChild(origin);
      parent.appendChild(scroller);

      const ref = connectedOverlay(overlay, origin);
      expect(ref.getConfig().usePopover).toBe(true);

      ref.attach(new ComponentPortal(SelectPanelStub));
      await flushMicrotasks();
      expect(ref.hasAttached()).toBe(true);

      scroller.dispatchEvent(new Event('scroll'));
      await waitForSoftClose();
      expect(ref.hasAttached()).toBe(false);
      expect(parent.matches(':popover-open')).toBe(true);

      parent.remove();
    });

    it('repositions datepicker panels on scroll when the origin is inside an open popover', async () => {
      const parent = openPopoverHost();
      const scroller = document.createElement('div');
      scroller.style.overflow = 'auto';
      scroller.style.height = '80px';
      const origin = document.createElement('button');
      scroller.appendChild(origin);
      parent.appendChild(scroller);

      const ref = connectedOverlay(overlay, origin);
      expect(ref.getConfig().usePopover).toBe(true);

      const updateSpy = vi.spyOn(ref, 'updatePosition');
      const detachSpy = vi.spyOn(ref, 'detach');
      ref.attach(new ComponentPortal(DatepickerPanelStub));
      await flushMicrotasks();

      scroller.dispatchEvent(new Event('scroll'));
      expect(updateSpy).toHaveBeenCalled();
      expect(detachSpy).not.toHaveBeenCalled();
      expect(ref.hasAttached()).toBe(true);
      expect(parent.matches(':popover-open')).toBe(true);

      ref.dispose();
      expect(parent.matches(':popover-open')).toBe(true);
      parent.remove();
    });

    it('repositions datepicker panels on nested overflow scroll and removes listeners on dispose', async () => {
      const scroller = document.createElement('div');
      scroller.style.overflow = 'auto';
      scroller.style.height = '80px';
      const origin = document.createElement('button');
      scroller.appendChild(origin);
      document.body.appendChild(scroller);

      const ref = overlay.create({
        positionStrategy: overlay
          .position()
          .flexibleConnectedTo(origin)
          .withPositions([
            { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
          ]),
      });

      const updateSpy = vi.spyOn(ref, 'updatePosition');
      const detachSpy = vi.spyOn(ref, 'detach');
      ref.attach(new ComponentPortal(DatepickerPanelStub));
      await flushMicrotasks();

      scroller.dispatchEvent(new Event('scroll'));
      expect(updateSpy).toHaveBeenCalled();
      expect(detachSpy).not.toHaveBeenCalled();

      const callsAfterScroll = updateSpy.mock.calls.length;
      ref.dispose();
      scroller.dispatchEvent(new Event('scroll'));
      expect(updateSpy.mock.calls.length).toBe(callsAfterScroll);

      scroller.remove();
    });

    it('detaches menu panels on nested overflow scroll outside the pane', async () => {
      const scroller = document.createElement('div');
      scroller.style.overflow = 'auto';
      scroller.style.height = '80px';
      const origin = document.createElement('button');
      scroller.appendChild(origin);
      document.body.appendChild(scroller);

      const ref = overlay.create({
        positionStrategy: overlay
          .position()
          .flexibleConnectedTo(origin)
          .withPositions([
            { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
          ]),
      });

      ref.attach(new ComponentPortal(MenuPanelStub));
      await flushMicrotasks();
      expect(ref.hasAttached()).toBe(true);

      scroller.dispatchEvent(new Event('scroll'));
      await waitForSoftClose();
      expect(ref.hasAttached()).toBe(false);

      scroller.remove();
    });

    it('detaches select panels on nested overflow scroll outside the pane', async () => {
      const scroller = document.createElement('div');
      scroller.style.overflow = 'auto';
      scroller.style.height = '80px';
      const origin = document.createElement('button');
      scroller.appendChild(origin);
      document.body.appendChild(scroller);

      const ref = overlay.create({
        positionStrategy: overlay
          .position()
          .flexibleConnectedTo(origin)
          .withPositions([
            { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
          ]),
      });

      ref.attach(new ComponentPortal(SelectPanelStub));
      await flushMicrotasks();
      expect(ref.hasAttached()).toBe(true);

      scroller.dispatchEvent(new Event('scroll'));
      await waitForSoftClose();
      expect(ref.hasAttached()).toBe(false);

      scroller.remove();
    });

    it('prevents wheel default on non-scrollable close panels so behind scroller does not move', async () => {
      const scroller = document.createElement('div');
      scroller.style.overflow = 'auto';
      scroller.style.height = '80px';
      const origin = document.createElement('button');
      scroller.appendChild(origin);
      document.body.appendChild(scroller);

      const ref = overlay.create({
        positionStrategy: overlay
          .position()
          .flexibleConnectedTo(origin)
          .withPositions([
            { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
          ]),
      });

      ref.attach(new ComponentPortal(MenuPanelStub));
      await flushMicrotasks();

      const pane = ref.overlayElement;
      const wheel = new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: 40 });
      pane.dispatchEvent(wheel);
      expect(wheel.defaultPrevented).toBe(true);
      expect(ref.hasAttached()).toBe(true);

      ref.dispose();
      scroller.remove();
    });

    it('removes close listeners after dispose so later scroll does not throw', async () => {
      const scroller = document.createElement('div');
      scroller.style.overflow = 'auto';
      scroller.style.height = '80px';
      const origin = document.createElement('button');
      scroller.appendChild(origin);
      document.body.appendChild(scroller);

      const ref = overlay.create({
        positionStrategy: overlay
          .position()
          .flexibleConnectedTo(origin)
          .withPositions([
            { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
          ]),
      });

      ref.attach(new ComponentPortal(MenuPanelStub));
      await flushMicrotasks();
      ref.dispose();

      expect(() => scroller.dispatchEvent(new Event('scroll'))).not.toThrow();

      scroller.remove();
    });

    it('binds reposition listeners for panels without a close class', async () => {
      const scroller = document.createElement('div');
      scroller.style.overflow = 'auto';
      scroller.style.height = '80px';
      const origin = document.createElement('button');
      scroller.appendChild(origin);
      document.body.appendChild(scroller);

      const ref = overlay.create({
        positionStrategy: overlay
          .position()
          .flexibleConnectedTo(origin)
          .withPositions([
            { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
          ]),
      });

      const updateSpy = vi.spyOn(ref, 'updatePosition');
      ref.attach(new ComponentPortal(OverlayPanelStub));
      await flushMicrotasks();

      scroller.dispatchEvent(new Event('scroll'));
      expect(updateSpy).toHaveBeenCalled();
      expect(ref.hasAttached()).toBe(true);

      ref.dispose();
      scroller.remove();
    });
  });
});
