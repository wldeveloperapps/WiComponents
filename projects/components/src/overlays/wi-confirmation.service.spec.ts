import { Directionality } from '@angular/cdk/bidi';
import { Component, inject, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WiConfirmationService } from '../../overlays/src/confirmation/wi-confirmation.service';
import { WiConfirmDialogComponent } from '../../overlays/src/confirm-dialog/wi-confirm-dialog.component';
import { WiConfirmPopupComponent } from '../../overlays/src/confirm-popup/wi-confirm-popup.component';
import { provideWiOverlaysI18n } from '../../overlays/src/wi-overlays.i18n';

@Component({
  selector: 'wi-confirmation-dialog-host',
  imports: [WiConfirmDialogComponent],
  template: `
    <wi-confirm-dialog [key]="dialogKey()" />
    <button type="button" data-testid="trigger" (click)="onDelete($event)">Delete</button>
  `,
})
class ConfirmationDialogHostComponent {
  readonly confirmation = inject(WiConfirmationService);
  readonly dialogKey = signal<string | undefined>(undefined);
  readonly accepted = signal(0);
  readonly rejected = signal(0);
  lastResult: string | undefined;

  onDelete(event: Event): void {
    void this.confirmation
      .confirm({
        key: this.dialogKey(),
        title: 'Eliminar elemento',
        description: 'Esta acción no se puede deshacer.',
        confirmLabel: 'Eliminar',
        cancelLabel: 'Cancelar',
        confirmVariant: 'danger',
        accept: () => {
          this.accepted.update((n) => n + 1);
        },
        reject: () => {
          this.rejected.update((n) => n + 1);
        },
      })
      .then((result) => {
        this.lastResult = result;
      });
  }
}

@Component({
  selector: 'wi-confirmation-popup-host',
  imports: [WiConfirmPopupComponent],
  template: `
    <wi-confirm-popup [key]="popupKey()" />
    <button type="button" data-testid="trigger" (click)="onDelete($event)">Delete</button>
  `,
})
class ConfirmationPopupHostComponent {
  readonly confirmation = inject(WiConfirmationService);
  readonly popupKey = signal<string | undefined>(undefined);
  readonly accepted = signal(0);
  readonly rejected = signal(0);
  lastResult: string | undefined;

  onDelete(event: Event): void {
    void this.confirmation
      .confirm({
        key: this.popupKey(),
        target: event.currentTarget as HTMLElement,
        title: 'Eliminar fila',
        description: 'No se puede deshacer.',
        confirmLabel: 'Eliminar',
        cancelLabel: 'Cancelar',
        confirmVariant: 'danger',
        accept: () => {
          this.accepted.update((n) => n + 1);
        },
        reject: () => {
          this.rejected.update((n) => n + 1);
        },
      })
      .then((result) => {
        this.lastResult = result;
      });
  }
}

@Component({
  selector: 'wi-confirmation-keyed-hosts',
  imports: [WiConfirmDialogComponent, WiConfirmPopupComponent],
  template: `
    <wi-confirm-dialog key="dialog-a" />
    <wi-confirm-dialog key="dialog-b" />
    <wi-confirm-popup key="popup-a" />
    <button type="button" data-testid="open-a" (click)="openDialog('dialog-a')">A</button>
    <button type="button" data-testid="open-b" (click)="openDialog('dialog-b')">B</button>
    <button type="button" data-testid="open-popup" (click)="openPopup($event)">P</button>
  `,
})
class ConfirmationKeyedHostsComponent {
  readonly confirmation = inject(WiConfirmationService);
  readonly acceptedKey = signal<string | undefined>(undefined);

  openDialog(key: string): void {
    void this.confirmation.confirm({
      key,
      title: `Title ${key}`,
      confirmLabel: 'OK',
      accept: () => this.acceptedKey.set(key),
    });
  }

  openPopup(event: Event): void {
    void this.confirmation.confirm({
      key: 'popup-a',
      target: event.currentTarget as HTMLElement,
      title: 'Popup A',
      confirmLabel: 'OK',
      accept: () => this.acceptedKey.set('popup-a'),
    });
  }
}

@Component({
  selector: 'wi-confirmation-multi-same-key',
  imports: [WiConfirmDialogComponent],
  template: `
    <wi-confirm-dialog key="shared" />
    <wi-confirm-dialog key="shared" />
    <button type="button" data-testid="trigger" (click)="open()">Open</button>
  `,
})
class ConfirmationMultiSameKeyComponent {
  readonly confirmation = inject(WiConfirmationService);

  open(): void {
    void this.confirmation.confirm({
      key: 'shared',
      title: 'Shared',
      confirmLabel: 'OK',
    });
  }
}

describe('WiConfirmationService', () => {
  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
  });

  function dialogPanel(): Element | null {
    return document.querySelector('[data-slot="confirm-dialog-content"]');
  }

  function popupPanel(): Element | null {
    return document.querySelector('[data-slot="confirm-popup-content"]');
  }

  async function waitFor(
    predicate: () => boolean,
    label = 'condition',
  ): Promise<void> {
    const deadline = Date.now() + 2000;
    while (Date.now() < deadline) {
      if (predicate()) {
        return;
      }
      await new Promise((r) => setTimeout(r, 20));
    }
    throw new Error(`Timed out waiting for ${label}`);
  }

  describe('dialog host (default key)', () => {
    let fixture: ComponentFixture<ConfirmationDialogHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ConfirmationDialogHostComponent],
        providers: [
          Directionality,
          provideWiOverlaysI18n({ confirmCancelLabel: () => 'Cancel' }),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ConfirmationDialogHostComponent);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('opens dialog via confirm() and settles accept', async () => {
      fixture.nativeElement.querySelector('[data-testid="trigger"]').click();
      fixture.detectChanges();
      await waitFor(() => !!dialogPanel(), 'dialog panel');

      expect(dialogPanel()?.textContent).toContain('Eliminar elemento');

      const confirmBtn = Array.from(dialogPanel()?.querySelectorAll('button') ?? []).find((el) =>
        el.textContent?.includes('Eliminar'),
      ) as HTMLElement;
      confirmBtn.click();
      fixture.detectChanges();
      await waitFor(() => !dialogPanel(), 'dialog closed');
      await waitFor(() => fixture.componentInstance.lastResult === 'confirmed', 'promise');

      expect(fixture.componentInstance.accepted()).toBe(1);
      expect(fixture.componentInstance.rejected()).toBe(0);
    });

    it('settles reject on cancel without calling accept', async () => {
      fixture.nativeElement.querySelector('[data-testid="trigger"]').click();
      fixture.detectChanges();
      await waitFor(() => !!dialogPanel(), 'dialog panel');

      const cancelBtn = Array.from(dialogPanel()?.querySelectorAll('button') ?? []).find((el) =>
        el.textContent?.includes('Cancelar'),
      ) as HTMLElement;
      cancelBtn.click();
      fixture.detectChanges();
      await waitFor(() => fixture.componentInstance.lastResult === 'cancelled', 'promise');

      expect(fixture.componentInstance.rejected()).toBe(1);
      expect(fixture.componentInstance.accepted()).toBe(0);
    });
  });

  describe('popup host (default key + target)', () => {
    let fixture: ComponentFixture<ConfirmationPopupHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ConfirmationPopupHostComponent],
        providers: [
          Directionality,
          provideWiOverlaysI18n({ confirmCancelLabel: () => 'Cancel' }),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ConfirmationPopupHostComponent);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('opens popup anchored via confirm({ target }) and accepts', async () => {
      fixture.nativeElement.querySelector('[data-testid="trigger"]').click();
      fixture.detectChanges();
      await waitFor(() => !!popupPanel(), 'popup panel');

      expect(popupPanel()?.textContent).toContain('Eliminar fila');

      const confirmBtn = Array.from(popupPanel()?.querySelectorAll('button') ?? []).find((el) =>
        el.textContent?.includes('Eliminar'),
      ) as HTMLElement;
      confirmBtn.click();
      fixture.detectChanges();
      await waitFor(() => fixture.componentInstance.lastResult === 'confirmed', 'promise');

      expect(fixture.componentInstance.accepted()).toBe(1);
    });

    it('dismiss on Escape does not call reject', async () => {
      fixture.nativeElement.querySelector('[data-testid="trigger"]').click();
      fixture.detectChanges();
      await waitFor(() => !!popupPanel(), 'popup panel');

      const overlay = document.querySelector('.cdk-overlay-pane');
      overlay?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      fixture.detectChanges();
      await waitFor(() => fixture.componentInstance.lastResult === 'dismissed', 'dismissed');

      expect(fixture.componentInstance.rejected()).toBe(0);
      expect(fixture.componentInstance.accepted()).toBe(0);
    });
  });

  describe('key routing', () => {
    let fixture: ComponentFixture<ConfirmationKeyedHostsComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ConfirmationKeyedHostsComponent],
        providers: [
          Directionality,
          provideWiOverlaysI18n({ confirmCancelLabel: () => 'Cancel' }),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ConfirmationKeyedHostsComponent);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('routes confirm to the matching dialog key only', async () => {
      fixture.nativeElement.querySelector('[data-testid="open-b"]').click();
      fixture.detectChanges();
      await waitFor(() => !!dialogPanel(), 'dialog panel');

      expect(dialogPanel()?.textContent).toContain('Title dialog-b');
      expect(dialogPanel()?.textContent).not.toContain('Title dialog-a');
      expect(popupPanel()).toBeNull();
    });

    it('routes popup key with target', async () => {
      fixture.nativeElement.querySelector('[data-testid="open-popup"]').click();
      fixture.detectChanges();
      await waitFor(() => !!popupPanel(), 'popup panel');

      expect(popupPanel()?.textContent).toContain('Popup A');
      expect(dialogPanel()).toBeNull();
    });
  });

  describe('replace same key', () => {
    let fixture: ComponentFixture<ConfirmationDialogHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ConfirmationDialogHostComponent],
        providers: [
          Directionality,
          provideWiOverlaysI18n({ confirmCancelLabel: () => 'Cancel' }),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ConfirmationDialogHostComponent);
      fixture.componentInstance.dialogKey.set('replace');
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('dismisses the previous confirmation when confirming again with the same key', async () => {
      const service = fixture.componentInstance.confirmation;
      const first = service.confirm({
        key: 'replace',
        title: 'First',
        confirmLabel: 'OK',
      });
      fixture.detectChanges();
      await waitFor(() => !!dialogPanel(), 'first panel');

      const second = service.confirm({
        key: 'replace',
        title: 'Second',
        confirmLabel: 'OK',
        accept: () => fixture.componentInstance.accepted.update((n) => n + 1),
      });
      fixture.detectChanges();
      await waitFor(() => dialogPanel()?.textContent?.includes('Second') === true, 'second title');

      expect(await first).toBe('dismissed');

      const confirmBtn = Array.from(dialogPanel()?.querySelectorAll('button') ?? []).find((el) =>
        el.textContent?.includes('OK'),
      ) as HTMLElement;
      confirmBtn.click();
      fixture.detectChanges();
      expect(await second).toBe('confirmed');
      expect(fixture.componentInstance.accepted()).toBe(1);
    });
  });

  describe('multiple hosts same key', () => {
    it('opens using the last registered host', async () => {
      await TestBed.configureTestingModule({
        imports: [ConfirmationMultiSameKeyComponent],
        providers: [
          Directionality,
          provideWiOverlaysI18n({ confirmCancelLabel: () => 'Cancel' }),
        ],
      }).compileComponents();

      const fixture = TestBed.createComponent(ConfirmationMultiSameKeyComponent);
      fixture.detectChanges();
      await fixture.whenStable();

      fixture.nativeElement.querySelector('[data-testid="trigger"]').click();
      fixture.detectChanges();
      await waitFor(() => !!dialogPanel(), 'dialog panel');

      // Only one panel should be visible (last host).
      expect(document.querySelectorAll('[data-slot="confirm-dialog-content"]').length).toBe(1);
    });
  });

  describe('no matching host', () => {
    it('resolves dismissed when no host is mounted', async () => {
      await TestBed.configureTestingModule({
        providers: [Directionality],
      }).compileComponents();

      const service = TestBed.inject(WiConfirmationService);
      const result = await service.confirm({
        title: 'Orphan',
        confirmLabel: 'OK',
      });
      expect(result).toBe('dismissed');
    });
  });
});
