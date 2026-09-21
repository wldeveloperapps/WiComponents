import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  applyWiConnectedOverlayPatch,
  findOverflowAncestors,
} from '../../core/src/overlay/wi-connected-overlay';

@Component({
  template: `<span>panel</span>`,
})
class OverlayPanelStub {}

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

    it('repositions on nested overflow scroll and removes listeners on dispose', () => {
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

      scroller.dispatchEvent(new Event('scroll'));
      expect(updateSpy).toHaveBeenCalled();

      const callsAfterScroll = updateSpy.mock.calls.length;
      ref.dispose();
      scroller.dispatchEvent(new Event('scroll'));
      expect(updateSpy.mock.calls.length).toBe(callsAfterScroll);

      scroller.remove();
    });
  });
});
