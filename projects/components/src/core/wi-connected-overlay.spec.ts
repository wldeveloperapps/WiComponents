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

function polyfillPopoverApi(): void {
  const proto = HTMLElement.prototype as HTMLElement & {
    showPopover?: () => void;
    hidePopover?: () => void;
  };
  if (typeof proto.showPopover !== 'function') {
    proto.showPopover = (): void => undefined;
  }
  if (typeof proto.hidePopover !== 'function') {
    proto.hidePopover = (): void => undefined;
  }
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
