import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WI_DARK_CLASS } from '../../core/src/wi-theme';
import { provideWiOverlaysI18n } from '../../overlays/src/wi-overlays.i18n';
import { wiToast } from '../../overlays/src/toast/wi-toast';
import { WiToast } from '../../overlays/src/toast/wi-toast.service';
import { WiToasterComponent } from '../../overlays/src/toast/wi-toaster.component';

@Component({
  imports: [WiToasterComponent],
  template: `
    <wi-toaster [closeButton]="true" [duration]="4000" />
    <button type="button" data-testid="trigger" (click)="onClick()">Trigger</button>
  `,
})
class WiToastHostComponent {
  onClick(): void {
    wiToast('Hola toast');
  }
}

describe('WiToasterComponent / wiToast', () => {
  let fixture: ComponentFixture<WiToastHostComponent>;

  beforeEach(async () => {
    document.documentElement.classList.remove(WI_DARK_CLASS);
    await TestBed.configureTestingModule({
      imports: [WiToastHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WiToastHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    await flushAfterRender();
    wiToast.dismiss();
  });

  afterEach(() => {
    wiToast.dismiss();
    document.documentElement.classList.remove(WI_DARK_CLASS);
    fixture.destroy();
  });

  async function flushAfterRender(): Promise<void> {
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function toastNodes(): NodeListOf<Element> {
    return document.querySelectorAll('[data-sonner-toast]');
  }

  async function waitForToast(present: boolean, text?: string): Promise<void> {
    const deadline = Date.now() + 2000;
    while (Date.now() < deadline) {
      const nodes = toastNodes();
      const found = text
        ? Array.from(nodes).some((n) => n.textContent?.includes(text))
        : nodes.length > 0;
      if (present ? found : !found) {
        return;
      }
      await new Promise((r) => setTimeout(r, 20));
    }
    if (text) {
      expect(Array.from(toastNodes()).some((n) => n.textContent?.includes(text))).toBe(present);
    } else {
      expect(toastNodes().length > 0).toBe(present);
    }
  }

  it('attaches viewport via CDK overlay on document.body (viewport, not story container)', async () => {
    const host = fixture.nativeElement.querySelector('wi-toaster') as HTMLElement;
    expect(host).toBeTruthy();
    expect(host.getAttribute('data-slot')).toBe('toaster');

    const overlayContainer = document.querySelector('.cdk-overlay-container');
    expect(overlayContainer).toBeTruthy();
    expect(overlayContainer?.parentElement).toBe(document.body);

    const pane = document.querySelector('.wi-toaster-overlay, .cdk-overlay-pane');
    expect(pane).toBeTruthy();

    expect(TestBed.createComponent(WiToasterComponent).componentInstance.position()).toBe(
      'top-right',
    );
  });

  it('stacks multiple toasts expanded (data-expanded) without collapsing', async () => {
    wiToast('Toast uno', { duration: 10_000 });
    wiToast('Toast dos', { duration: 10_000 });
    wiToast('Toast tres', { duration: 10_000 });
    fixture.detectChanges();
    await waitForToast(true, 'Toast tres');

    const nodes = Array.from(toastNodes());
    expect(nodes.length).toBeGreaterThanOrEqual(3);
    for (const node of nodes) {
      expect(node.getAttribute('data-expanded')).toBe('true');
    }
  });

  it('shows a toast when wiToast is called', async () => {
    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]',
    ) as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    await waitForToast(true, 'Hola toast');
    const toast = toastNodes()[0];
    expect(toast.getAttribute('role')).toBe('status');
    expect(toast.classList.contains('wi-toast')).toBe(true);

    const viewport = document.querySelector('[data-sonner-toaster]');
    expect(viewport?.closest('.cdk-overlay-container')).toBeTruthy();
    expect(viewport?.getAttribute('data-y-position')).toBe('top');
    expect(viewport?.getAttribute('data-x-position')).toBe('right');
  });

  it('syncs sonner theme with .wi-dark on documentElement when theme=auto', async () => {
    wiToast('Light toast');
    fixture.detectChanges();
    await waitForToast(true, 'Light toast');
    expect(document.querySelector('[data-sonner-toaster]')?.getAttribute('data-theme')).toBe(
      'light',
    );
    wiToast.dismiss();
    await waitForToast(false);

    document.documentElement.classList.add(WI_DARK_CLASS);
    await flushAfterRender();

    wiToast('Dark toast');
    fixture.detectChanges();
    await waitForToast(true, 'Dark toast');
    expect(document.querySelector('[data-sonner-toaster]')?.getAttribute('data-theme')).toBe(
      'dark',
    );
  });

  it('supports typed helpers and dismiss', async () => {
    const id = wiToast.success('Guardado', { description: 'Detalle' });
    fixture.detectChanges();
    await waitForToast(true, 'Guardado');

    wiToast.dismiss(id);
    fixture.detectChanges();
    await waitForToast(false, 'Guardado');
  });

  it('WiToast service delegates to wiToast', async () => {
    const service = TestBed.inject(WiToast);
    service.error('Falló', { important: true });
    fixture.detectChanges();
    await waitForToast(true, 'Falló');

    const toast = toastNodes()[0];
    expect(toast.getAttribute('aria-live')).toBe('assertive');
  });

  it('can be created without throwing (SSR-safe construction)', () => {
    const toasterFixture = TestBed.createComponent(WiToasterComponent);
    expect(() => toasterFixture.detectChanges()).not.toThrow();
    expect(toasterFixture.componentInstance).toBeTruthy();
    toasterFixture.destroy();
  });
});

describe('WiToasterComponent chrome i18n', () => {
  let fixture: ComponentFixture<WiToastHostComponent>;

  beforeEach(async () => {
    document.documentElement.classList.remove(WI_DARK_CLASS);
    document.documentElement.lang = 'es';
    await TestBed.configureTestingModule({
      imports: [WiToastHostComponent],
      providers: [
        provideWiOverlaysI18n({
          toastCloseLabel: () => 'Cerrar notificación',
          toastRegionLabel: () => 'Notificaciones',
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WiToastHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();
    wiToast.dismiss();
  });

  afterEach(() => {
    wiToast.dismiss();
    fixture.destroy();
  });

  it('applies provideWiOverlaysI18n to close button and region aria-labels', async () => {
    wiToast('Mensaje', { duration: 10_000 });
    fixture.detectChanges();

    const deadline = Date.now() + 2000;
    let closeBtn: Element | null = null;
    while (Date.now() < deadline) {
      closeBtn = document.querySelector('button[data-close-button]');
      if (closeBtn?.getAttribute('aria-label') === 'Cerrar notificación') {
        break;
      }
      await new Promise((r) => setTimeout(r, 20));
    }

    expect(closeBtn?.getAttribute('aria-label')).toBe('Cerrar notificación');

    const region = document.querySelector('section[aria-label]');
    expect(region?.getAttribute('aria-label')).toMatch(/^Notificaciones/);
  });
});
