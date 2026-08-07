import { Directionality } from '@angular/cdk/bidi';
import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WiButtonComponent } from '../../button/src/public-api';
import {
  WiConfirmDialogComponent,
  WiConfirmDialogTriggerDirective,
} from '../../overlays/src/wi-confirm-dialog.component';
import type {
  WiConfirmDialogConfirmVariant,
  WiConfirmDialogSize,
} from '../../overlays/src/wi-confirm-dialog.types';
import { provideWiOverlaysI18n } from '../../overlays/src/wi-overlays.i18n';

@Component({
  selector: 'wi-confirm-dialog-host',
  imports: [WiConfirmDialogComponent, WiConfirmDialogTriggerDirective, WiButtonComponent],
  template: `
    <wi-confirm-dialog
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
      <wi-button type="button" wiConfirmDialogTrigger>Abrir</wi-button>
    </wi-confirm-dialog>
  `,
})
class ConfirmDialogHostComponent {
  readonly size = signal<WiConfirmDialogSize>('sm');
  readonly title = signal('Eliminar elemento');
  readonly description = signal<string | undefined>('Esta acción no se puede deshacer.');
  readonly confirmLabel = signal('Eliminar');
  readonly cancelLabel = signal<string | undefined>('Cancelar');
  readonly confirmVariant = signal<WiConfirmDialogConfirmVariant>('danger');
  readonly showCancel = signal(true);
  readonly loading = signal(false);
  readonly confirmedCount = signal(0);
  readonly cancelledCount = signal(0);
}

describe('WiConfirmDialogComponent', () => {
  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
  });

  function panel(): Element | null {
    return document.querySelector('[data-slot="confirm-dialog-content"]');
  }

  function dialogTitle(): Element | null {
    return document.querySelector('[data-slot="confirm-dialog-title"]');
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

  describe('default host', () => {
    let fixture: ComponentFixture<ConfirmDialogHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ConfirmDialogHostComponent],
        providers: [
          Directionality,
          provideWiOverlaysI18n({
            confirmCancelLabel: () => 'Cancel',
          }),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ConfirmDialogHostComponent);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    function trigger(): HTMLElement {
      return fixture.nativeElement.querySelector(
        'wi-button[wiConfirmDialogTrigger], [wiConfirmDialogTrigger]',
      );
    }

    it('constructs closed without a panel (SSR-safe init path)', () => {
      expect(trigger()).toBeTruthy();
      expect(panel()).toBeNull();
      expect(fixture.nativeElement.querySelector('wi-confirm-dialog')).toBeTruthy();
    });

    it('opens on trigger click and shows accessible title and description', async () => {
      trigger().click();
      fixture.detectChanges();
      await waitForPanel(true);

      expect(panel()?.className).toContain('w-[min(calc(100vw-2rem),24rem)]');
      expect(dialogTitle()?.textContent).toContain('Eliminar elemento');
      expect(
        document.querySelector('[data-slot="confirm-dialog-description"]')?.textContent,
      ).toContain('Esta acción no se puede deshacer.');
    });

    it('applies size classes on the panel', async () => {
      fixture.componentInstance.size.set('md');
      fixture.detectChanges();

      trigger().click();
      fixture.detectChanges();
      await waitForPanel(true);

      expect(document.querySelector('.cdk-overlay-pane')?.className).toContain(
        'w-[min(calc(100vw-2rem),32rem)]',
      );
    });

    it('emits confirmed and closes when confirm is clicked', async () => {
      trigger().click();
      fixture.detectChanges();
      await waitForPanel(true);

      const buttons = panel()?.querySelectorAll('wi-button button, button');
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

      const buttons = panel()?.querySelectorAll('wi-button button, button');
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

    it('does not dismiss with Escape (alertdialog disableClose)', async () => {
      trigger().click();
      fixture.detectChanges();
      await waitForPanel(true);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      const overlay = document.querySelector('.cdk-overlay-pane');
      overlay?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      fixture.detectChanges();
      await new Promise((r) => setTimeout(r, 50));

      expect(panel()).toBeTruthy();
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
  });
});
