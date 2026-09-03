import { Directionality } from '@angular/cdk/bidi';
import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { WiButtonDirective } from '../../button/src/public-api';
import {
  WiPopoverCloseDirective,
  WiPopoverComponent,
  WiPopoverContentComponent,
  WiPopoverDescriptionComponent,
  WiPopoverHeaderComponent,
  WiPopoverPortalDirective,
  WiPopoverTitleComponent,
  WiPopoverTriggerDirective,
} from '../../overlays/src/popover/wi-popover.component';
import type { WiPopoverSize } from '../../overlays/src/popover/wi-popover.types';

@Component({
  selector: 'wi-popover-host',
  imports: [
    WiPopoverComponent,
    WiPopoverTriggerDirective,
    WiPopoverPortalDirective,
    WiPopoverCloseDirective,
    WiPopoverContentComponent,
    WiPopoverHeaderComponent,
    WiPopoverTitleComponent,
    WiPopoverDescriptionComponent,
    WiButtonDirective,
  ],
  template: `
    <wi-popover [size]="size()" [ariaLabel]="ariaLabel()" [disableClose]="disableClose()">
      <button wiButton type="button" wiPopoverTrigger>Abrir</button>
      <ng-template wiPopoverPortal>
        <wi-popover-content>
          <wi-popover-header>
            <wi-popover-title>Título de prueba</wi-popover-title>
            <wi-popover-description>Descripción de prueba</wi-popover-description>
          </wi-popover-header>
          <p>Cuerpo</p>
          <button wiButton type="button" wiPopoverClose>Cerrar</button>
        </wi-popover-content>
      </ng-template>
    </wi-popover>
  `,
})
class PopoverHostComponent {
  readonly size = signal<WiPopoverSize>('sm');
  readonly ariaLabel = signal<string | undefined>(undefined);
  readonly disableClose = signal(false);
}

@Component({
  selector: 'wi-popover-label-host',
  imports: [
    WiPopoverComponent,
    WiPopoverTriggerDirective,
    WiPopoverPortalDirective,
    WiPopoverCloseDirective,
    WiPopoverContentComponent,
    WiButtonDirective,
  ],
  template: `
    <wi-popover ariaLabel="Filtros rápidos">
      <button wiButton type="button" wiPopoverTrigger>Abrir</button>
      <ng-template wiPopoverPortal>
        <wi-popover-content>
          <p>Sin título</p>
          <button wiButton type="button" wiPopoverClose>Cerrar</button>
        </wi-popover-content>
      </ng-template>
    </wi-popover>
  `,
})
class PopoverAriaLabelHostComponent {}

describe('WiPopoverComponent', () => {
  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
    document.querySelectorAll('[data-wi-nested-overlay-stub]').forEach((el) => el.remove());
  });

  function panel(): Element | null {
    return document.querySelector('[data-slot="popover-content"]');
  }

  function popoverTitle(): Element | null {
    return document.querySelector('[data-slot="popover-title"]');
  }

  async function waitForPanel(present: boolean): Promise<void> {
    const deadline = Date.now() + 2000;
    while (Date.now() < deadline) {
      const found = panel();
      if (present ? found : !found) {
        return;
      }
      await new Promise((r) => setTimeout(r, 20));
    }
    expect(!!panel()).toBe(present);
  }

  function pointerClick(target: Element): void {
    target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  }

  describe('default host', () => {
    let fixture: ComponentFixture<PopoverHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [PopoverHostComponent],
        providers: [Directionality],
      }).compileComponents();

      fixture = TestBed.createComponent(PopoverHostComponent);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    function trigger(): HTMLElement {
      return fixture.nativeElement.querySelector('[wiPopoverTrigger]');
    }

    it('constructs closed without a panel (SSR-safe init path)', () => {
      expect(trigger()).toBeTruthy();
      expect(panel()).toBeNull();
      expect(fixture.nativeElement.querySelector('wi-popover')).toBeTruthy();
    });

    it('opens on trigger click and shows accessible title and description', async () => {
      trigger().click();
      fixture.detectChanges();
      await waitForPanel(true);

      expect(panel()?.className).toContain('w-[min(calc(100vw-2rem),18rem)]');
      expect(popoverTitle()?.textContent).toContain('Título de prueba');
      expect(document.querySelector('[data-slot="popover-description"]')?.textContent).toContain(
        'Descripción de prueba',
      );
      expect(document.querySelector('.cdk-overlay-backdrop')).toBeNull();
    });

    it('sets dialog role and labelledby on the overlay pane', async () => {
      trigger().click();
      fixture.detectChanges();
      await waitForPanel(true);
      await new Promise((r) => setTimeout(r, 0));

      const pane = document.querySelector('.cdk-overlay-pane');
      expect(pane?.getAttribute('role')).toBe('dialog');
      expect(pane?.getAttribute('aria-modal')).toBe('false');
      expect(pane?.getAttribute('aria-labelledby')).toBe(popoverTitle()?.id);
    });

    it('applies size classes on the panel', async () => {
      fixture.componentInstance.size.set('md');
      fixture.detectChanges();

      trigger().click();
      fixture.detectChanges();
      await waitForPanel(true);

      expect(document.querySelector('.cdk-overlay-pane')?.className).toContain(
        'w-[min(calc(100vw-2rem),24rem)]',
      );
    });

    it('exposes aria-expanded on the trigger', async () => {
      expect(trigger().getAttribute('aria-expanded')).toBe('false');
      expect(trigger().getAttribute('aria-haspopup')).toBe('dialog');

      trigger().click();
      fixture.detectChanges();
      await waitForPanel(true);

      expect(trigger().getAttribute('aria-expanded')).toBe('true');
    });

    it('anchors the overlay pane below the trigger (not viewport-centered)', async () => {
      const triggerEl = trigger();
      triggerEl.click();
      fixture.detectChanges();
      await waitForPanel(true);

      const pane = document.querySelector('.cdk-overlay-pane') as HTMLElement | null;
      expect(pane).toBeTruthy();

      const triggerRect = triggerEl.getBoundingClientRect();
      const paneRect = pane!.getBoundingClientRect();
      const gap = paneRect.top - triggerRect.bottom;

      // Anclado bajo el trigger (sideOffset ~8), no centrado en el viewport.
      expect(gap).toBeGreaterThanOrEqual(0);
      expect(gap).toBeLessThan(48);
      expect(
        Math.abs(paneRect.left + paneRect.width / 2 - (triggerRect.left + triggerRect.width / 2)),
      ).toBeLessThan(triggerRect.width + 32);
    });

    it('closes via wiPopoverClose', async () => {
      trigger().click();
      fixture.detectChanges();
      await waitForPanel(true);

      const closeBtn = document.querySelector('[wiPopoverClose]');
      expect(closeBtn).toBeTruthy();
      (closeBtn as HTMLElement).click();
      fixture.detectChanges();
      await waitForPanel(false);
    });

    it('dismisses with Escape', async () => {
      trigger().click();
      fixture.detectChanges();
      await waitForPanel(true);

      const overlay = document.querySelector('.cdk-overlay-pane');
      overlay?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      fixture.detectChanges();
      await waitForPanel(false);
    });

    it('does not dismiss with Escape when disableClose is true', async () => {
      fixture.componentInstance.disableClose.set(true);
      fixture.detectChanges();

      trigger().click();
      fixture.detectChanges();
      await waitForPanel(true);

      const overlay = document.querySelector('.cdk-overlay-pane');
      overlay?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      fixture.detectChanges();
      await new Promise((r) => setTimeout(r, 50));

      expect(panel()).toBeTruthy();
    });

    it('dismisses on outside pointer click', async () => {
      trigger().click();
      fixture.detectChanges();
      await waitForPanel(true);

      pointerClick(document.body);
      fixture.detectChanges();
      await waitForPanel(false);
    });

    it('stays open when the pointer lands on another CDK overlay pane', async () => {
      trigger().click();
      fixture.detectChanges();
      await waitForPanel(true);

      const nested = document.createElement('div');
      nested.className = 'cdk-overlay-pane';
      nested.setAttribute('data-wi-nested-overlay-stub', '');
      nested.textContent = 'opción';
      const container = document.querySelector('.cdk-overlay-container') ?? document.body;
      container.appendChild(nested);

      pointerClick(nested);
      fixture.detectChanges();
      await new Promise((r) => setTimeout(r, 50));

      expect(panel()).toBeTruthy();

      pointerClick(document.body);
      fixture.detectChanges();
      await waitForPanel(false);
    });

    it('reopens from the trigger after close()', async () => {
      trigger().click();
      fixture.detectChanges();
      await waitForPanel(true);

      const popover = fixture.debugElement
        .query(By.directive(WiPopoverComponent))
        .injector.get(WiPopoverComponent);
      popover.close();
      fixture.detectChanges();
      await waitForPanel(false);

      trigger().click();
      fixture.detectChanges();
      await waitForPanel(true);
    });
  });

  describe('ariaLabel host', () => {
    let fixture: ComponentFixture<PopoverAriaLabelHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [PopoverAriaLabelHostComponent],
        providers: [Directionality],
      }).compileComponents();

      fixture = TestBed.createComponent(PopoverAriaLabelHostComponent);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('sets aria-label on the pane when there is no title', async () => {
      const trigger = fixture.nativeElement.querySelector(
        '[wiPopoverTrigger]',
      ) as HTMLElement;
      trigger.click();
      fixture.detectChanges();
      await waitForPanel(true);
      await new Promise((r) => setTimeout(r, 0));

      const pane = document.querySelector('.cdk-overlay-pane');
      expect(pane?.getAttribute('aria-label')).toBe('Filtros rápidos');
      expect(pane?.getAttribute('aria-labelledby')).toBeNull();
    });
  });
});
