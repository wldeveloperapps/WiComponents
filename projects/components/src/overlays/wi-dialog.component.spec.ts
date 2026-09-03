import { Directionality } from '@angular/cdk/bidi';
import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WiButtonDirective } from '../../button/src/public-api';
import { xMarkOutline } from '../../icon/heroicons/src/x-mark';
import { provideWiIcons } from '../../icon/src/public-api';
import {
  WiDialogCloseDirective,
  WiDialogComponent,
  WiDialogContentComponent,
  WiDialogDescriptionComponent,
  WiDialogFooterComponent,
  WiDialogHeaderComponent,
  WiDialogPortalDirective,
  WiDialogTitleComponent,
  WiDialogTriggerDirective,
} from '../../overlays/src/dialog/wi-dialog.component';

@Component({
  selector: 'wi-dialog-host',
  imports: [
    WiDialogComponent,
    WiDialogTriggerDirective,
    WiDialogPortalDirective,
    WiDialogCloseDirective,
    WiDialogContentComponent,
    WiDialogHeaderComponent,
    WiDialogTitleComponent,
    WiDialogDescriptionComponent,
    WiDialogFooterComponent,
    WiButtonDirective,
  ],
  template: `
    <wi-dialog [size]="size()" [disableClose]="disableClose()">
      <button wiButton type="button" wiDialogTrigger>Abrir</button>
      <ng-template wiDialogPortal>
        <wi-dialog-content [showCloseButton]="showCloseButton()" [closeLabel]="closeLabel()">
          <wi-dialog-header>
            <wi-dialog-title>Título de prueba</wi-dialog-title>
            <wi-dialog-description>Descripción de prueba</wi-dialog-description>
          </wi-dialog-header>
          <p>Cuerpo</p>
          <wi-dialog-footer>
            <button wiButton type="button" variant="secondary" wiDialogClose>Cancelar</button>
          </wi-dialog-footer>
        </wi-dialog-content>
      </ng-template>
    </wi-dialog>
  `,
})
class DialogHostComponent {
  readonly size = signal<'sm' | 'md' | 'lg'>('md');
  readonly disableClose = signal(false);
  readonly showCloseButton = signal(true);
  readonly closeLabel = signal('Cerrar dialog');
}

describe('WiDialogComponent', () => {
  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
  });

  function panel(): Element | null {
    return document.querySelector('[data-slot="dialog-content"]');
  }

  function dialogTitle(): Element | null {
    return document.querySelector('[data-slot="dialog-title"]');
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
    let fixture: ComponentFixture<DialogHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DialogHostComponent],
        providers: [
          Directionality,
          provideWiIcons({
            'x-mark': { outline: xMarkOutline },
          }),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(DialogHostComponent);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    function trigger(): HTMLElement {
      return fixture.nativeElement.querySelector('[wiDialogTrigger]');
    }

    it('constructs closed without a panel (SSR-safe init path)', () => {
      expect(trigger()).toBeTruthy();
      expect(panel()).toBeNull();
      expect(fixture.nativeElement.querySelector('wi-dialog')).toBeTruthy();
    });

    it('opens on trigger click and shows accessible title', async () => {
      trigger().click();
      fixture.detectChanges();
      await waitForPanel(true);

      expect(panel()?.className).toContain('w-[min(calc(100vw-2rem),32rem)]');
      expect(dialogTitle()?.textContent).toContain('Título de prueba');
      expect(dialogTitle()?.id).toMatch(/brn-dialog-title-/);
    });

    it('applies size classes on the panel', async () => {
      fixture.componentInstance.size.set('sm');
      fixture.detectChanges();

      trigger().click();
      fixture.detectChanges();
      await waitForPanel(true);

      expect(document.querySelector('.cdk-overlay-pane')?.className).toContain(
        'w-[min(calc(100vw-2rem),24rem)]',
      );
      expect(panel()?.className).toContain('w-full');
    });

    it('updates size classes when size input changes while open', async () => {
      trigger().click();
      fixture.detectChanges();
      await waitForPanel(true);
      expect(document.querySelector('.cdk-overlay-pane')?.className).toContain(
        'w-[min(calc(100vw-2rem),32rem)]',
      );

      fixture.componentInstance.size.set('lg');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(document.querySelector('.cdk-overlay-pane')?.className).toContain(
        'w-[min(calc(100vw-2rem),42rem)]',
      );
    });

    it('closes via wiDialogClose', async () => {
      trigger().click();
      fixture.detectChanges();
      await waitForPanel(true);

      const cancel = document.querySelector('[wiDialogClose]');
      expect(cancel).toBeTruthy();
      (cancel as HTMLElement).click();
      fixture.detectChanges();
      await waitForPanel(false);
    });

    it('exposes aria-label on the icon close button', async () => {
      trigger().click();
      fixture.detectChanges();
      await waitForPanel(true);

      const closeBtn = panel()?.querySelector(
        'button.wi-dialog__close',
      );
      expect(closeBtn?.getAttribute('aria-label')).toBe('Cerrar dialog');
    });

    it('does not dismiss with Escape when disableClose is true', async () => {
      fixture.componentInstance.disableClose.set(true);
      fixture.detectChanges();

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

    it('hides the X button when showCloseButton is false', async () => {
      fixture.componentInstance.showCloseButton.set(false);
      fixture.detectChanges();

      trigger().click();
      fixture.detectChanges();
      await waitForPanel(true);

      expect(panel()?.querySelector('.wi-dialog__close')).toBeNull();
    });
  });
});
