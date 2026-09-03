import { Directionality } from '@angular/cdk/bidi';
import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { WiButtonDirective } from '../../button/src/public-api';
import {
  WiConfirmPopupComponent,
  WiConfirmPopupTriggerDirective,
} from '../../overlays/src/confirm-popup/wi-confirm-popup.component';
import type {
  WiConfirmPopupConfirmVariant,
  WiConfirmPopupSize,
} from '../../overlays/src/confirm-popup/wi-confirm-popup.types';
import { provideWiOverlaysI18n } from '../../overlays/src/wi-overlays.i18n';

@Component({
  selector: 'wi-confirm-popup-host',
  imports: [WiConfirmPopupComponent, WiConfirmPopupTriggerDirective, WiButtonDirective],
  template: `
    <wi-confirm-popup
      [size]="size()"
      [title]="title()"
      [description]="description()"
      [confirmLabel]="confirmLabel()"
      [cancelLabel]="cancelLabel()"
      [confirmVariant]="confirmVariant()"
      [showCancel]="showCancel()"
      [loading]="loading()"
      (confirmed)="confirmedCount.set(confirmedCount() + 1)"
      (cancelled)="cancelledCount.set(cancelledCount() + 1)"
    >
      <button wiButton type="button" wiConfirmPopupTrigger>Abrir</button>
    </wi-confirm-popup>
  `,
})
class ConfirmPopupHostComponent {
  readonly size = signal<WiConfirmPopupSize>('sm');
  readonly title = signal('Eliminar elemento');
  readonly description = signal<string | undefined>('Esta acción no se puede deshacer.');
  readonly confirmLabel = signal('Eliminar');
  readonly cancelLabel = signal<string | undefined>('Cancelar');
  readonly confirmVariant = signal<WiConfirmPopupConfirmVariant>('danger');
  readonly showCancel = signal(true);
  readonly loading = signal(false);
  readonly confirmedCount = signal(0);
  readonly cancelledCount = signal(0);
}

describe('WiConfirmPopupComponent', () => {
  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
    document.querySelectorAll('[data-wi-nested-overlay-stub]').forEach((el) => el.remove());
  });

  function panel(): Element | null {
    return document.querySelector('[data-slot="confirm-popup-content"]');
  }

  function popupTitle(): Element | null {
    return document.querySelector('[data-slot="confirm-popup-title"]');
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
    let fixture: ComponentFixture<ConfirmPopupHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ConfirmPopupHostComponent],
        providers: [
          Directionality,
          provideWiOverlaysI18n({
            confirmCancelLabel: () => 'Cancel',
          }),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ConfirmPopupHostComponent);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    function trigger(): HTMLElement {
      return fixture.nativeElement.querySelector(
        '[wiConfirmPopupTrigger]',
      );
    }

    it('constructs closed without a panel (SSR-safe init path)', () => {
      expect(trigger()).toBeTruthy();
      expect(panel()).toBeNull();
      expect(fixture.nativeElement.querySelector('wi-confirm-popup')).toBeTruthy();
    });

    it('opens on trigger click and shows accessible title and description', async () => {
      trigger().click();
      fixture.detectChanges();
      await waitForPanel(true);

      expect(panel()?.className).toContain('w-[min(calc(100vw-2rem),18rem)]');
      expect(popupTitle()?.textContent).toContain('Eliminar elemento');
      expect(
        document.querySelector('[data-slot="confirm-popup-description"]')?.textContent,
      ).toContain('Esta acción no se puede deshacer.');
      expect(document.querySelector('.cdk-overlay-backdrop')).toBeNull();
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

    it('emits confirmed and closes when confirm is clicked', async () => {
      trigger().click();
      fixture.detectChanges();
      await waitForPanel(true);

      const buttons = panel()?.querySelectorAll('button');
      const confirmBtn = Array.from(buttons ?? []).find((el) =>
        el.textContent?.includes('Eliminar'),
      ) as HTMLElement | undefined;
      expect(confirmBtn).toBeTruthy();
      confirmBtn!.click();
      fixture.detectChanges();
      await waitForPanel(false);

      expect(fixture.componentInstance.confirmedCount()).toBe(1);
      expect(fixture.componentInstance.cancelledCount()).toBe(0);
    });

    it('emits cancelled and closes when cancel is clicked', async () => {
      trigger().click();
      fixture.detectChanges();
      await waitForPanel(true);

      const buttons = panel()?.querySelectorAll('button');
      const cancelBtn = Array.from(buttons ?? []).find((el) =>
        el.textContent?.includes('Cancelar'),
      ) as HTMLElement | undefined;
      expect(cancelBtn).toBeTruthy();
      cancelBtn!.click();
      fixture.detectChanges();
      await waitForPanel(false);

      expect(fixture.componentInstance.cancelledCount()).toBe(1);
      expect(fixture.componentInstance.confirmedCount()).toBe(0);
    });

    it('hides cancel when showCancel is false', async () => {
      fixture.componentInstance.showCancel.set(false);
      fixture.detectChanges();

      trigger().click();
      fixture.detectChanges();
      await waitForPanel(true);

      const text = panel()?.textContent ?? '';
      expect(text).not.toContain('Cancelar');
      expect(text).toContain('Eliminar');
    });

    it('dismisses with Escape', async () => {
      trigger().click();
      fixture.detectChanges();
      await waitForPanel(true);

      const overlay = document.querySelector('.cdk-overlay-pane');
      overlay?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      fixture.detectChanges();
      await waitForPanel(false);

      expect(fixture.componentInstance.cancelledCount()).toBe(0);
      expect(fixture.componentInstance.confirmedCount()).toBe(0);
    });

    it('dismisses on outside pointer click without emitting cancelled', async () => {
      trigger().click();
      fixture.detectChanges();
      await waitForPanel(true);

      pointerClick(document.body);
      fixture.detectChanges();
      await waitForPanel(false);

      expect(fixture.componentInstance.cancelledCount()).toBe(0);
      expect(fixture.componentInstance.confirmedCount()).toBe(0);
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
    });

    it('reopens from the trigger after close()', async () => {
      trigger().click();
      fixture.detectChanges();
      await waitForPanel(true);

      const popup = fixture.debugElement
        .query(By.directive(WiConfirmPopupComponent))
        .injector.get(WiConfirmPopupComponent);
      popup.close();
      fixture.detectChanges();
      await waitForPanel(false);

      trigger().click();
      fixture.detectChanges();
      await waitForPanel(true);
    });

    it('uses confirmVariant danger classes on the confirm button', async () => {
      trigger().click();
      fixture.detectChanges();
      await waitForPanel(true);

      const confirmBtn = Array.from(panel()?.querySelectorAll('button') ?? []).find((el) =>
        el.textContent?.includes('Eliminar'),
      );
      expect(confirmBtn?.className).toContain('bg-error');
    });

    it('disables cancel and shows loading on confirm when loading is true', async () => {
      fixture.componentInstance.loading.set(true);
      fixture.detectChanges();

      trigger().click();
      fixture.detectChanges();
      await waitForPanel(true);

      const cancelBtn = Array.from(panel()?.querySelectorAll('button') ?? []).find((el) =>
        el.textContent?.includes('Cancelar'),
      );
      const confirmBtn = Array.from(panel()?.querySelectorAll('button') ?? []).find((el) =>
        el.textContent?.includes('Eliminar'),
      );

      expect(cancelBtn?.disabled).toBe(true);
      expect(confirmBtn?.disabled).toBe(true);
      expect(confirmBtn?.getAttribute('aria-busy')).toBe('true');
    });

    it('sets alertdialog role on the overlay pane', async () => {
      trigger().click();
      fixture.detectChanges();
      await waitForPanel(true);

      const pane = document.querySelector('.cdk-overlay-pane');
      expect(pane?.getAttribute('role')).toBe('alertdialog');
      expect(pane?.getAttribute('aria-labelledby')).toBeTruthy();
    });
  });
});
