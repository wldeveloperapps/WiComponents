import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideWiIcons } from '../../icon/src/public-api';
import { arrowPathOutline } from '../../icon/heroicons/src/arrow-path';
import { calendarOutline } from '../../icon/heroicons/src/calendar';
import { ellipsisVerticalOutline } from '../../icon/heroicons/src/ellipsis-vertical';
import { xMarkOutline } from '../../icon/heroicons/src/x-mark';
import { WiSpeedDialComponent } from '../../overlays/src/speed-dial/wi-speed-dial.component';
import type { WiSpeedDialItem } from '../../overlays/src/speed-dial/wi-speed-dial.types';

const ITEMS: WiSpeedDialItem[] = [
  { id: 'history', icon: 'arrow-path', label: 'Historial' },
  { id: 'schedule', icon: 'calendar', label: 'Calendario' },
  { id: 'dismiss', icon: 'x-mark', label: 'Cerrar' },
];

@Component({
  imports: [WiSpeedDialComponent],
  template: `
    <wi-speed-dial
      [items]="items()"
      [direction]="direction()"
      [(open)]="open"
      [disabled]="disabled()"
      [closeOnSelect]="closeOnSelect()"
      [ariaLabel]="ariaLabel()"
      (itemClick)="lastClicked.set($event)"
    />
  `,
})
class WiSpeedDialHostComponent {
  readonly items = signal<readonly WiSpeedDialItem[]>(ITEMS);
  readonly direction = signal<'left' | 'right' | 'up' | 'down'>('left');
  readonly open = signal(false);
  readonly disabled = signal(false);
  readonly closeOnSelect = signal(true);
  readonly ariaLabel = signal('Acciones');
  readonly lastClicked = signal<WiSpeedDialItem | null>(null);
}

describe('WiSpeedDialComponent', () => {
  let fixture: ComponentFixture<WiSpeedDialHostComponent>;
  let host: WiSpeedDialHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WiSpeedDialHostComponent],
      providers: [
        provideWiIcons({
          'ellipsis-vertical': { outline: ellipsisVerticalOutline },
          'arrow-path': { outline: arrowPathOutline },
          calendar: { outline: calendarOutline },
          'x-mark': { outline: xMarkOutline },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WiSpeedDialHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  function dial(): HTMLElement {
    return fixture.nativeElement.querySelector('wi-speed-dial');
  }

  function trigger(): HTMLButtonElement | null {
    return dial().querySelector('button[aria-expanded="false"]');
  }

  function toolbar(): HTMLElement | null {
    return dial().querySelector('[role="toolbar"]');
  }

  function actionButtons(): HTMLButtonElement[] {
    return Array.from(dial().querySelectorAll<HTMLButtonElement>('[data-item-id]'));
  }

  it('renders closed trigger with accessible name and structural attrs', () => {
    const el = dial();
    expect(el.getAttribute('data-slot')).toBe('speed-dial');
    expect(el.getAttribute('data-state')).toBe('closed');
    expect(el.getAttribute('data-direction')).toBe('left');
    expect(el.classList.contains('wi-speed-dial')).toBe(true);

    const button = trigger();
    expect(button).toBeTruthy();
    expect(button?.getAttribute('aria-label')).toBe('Acciones');
    expect(button?.getAttribute('aria-haspopup')).toBe('true');
    expect(toolbar()).toBeNull();
  });

  it('opens on trigger click and shows actions toolbar', async () => {
    trigger()?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.open()).toBe(true);
    expect(dial().getAttribute('data-state')).toBe('open');
    expect(trigger()).toBeNull();

    const bar = toolbar();
    expect(bar).toBeTruthy();
    expect(bar?.getAttribute('aria-label')).toBe('Acciones');

    const actions = actionButtons();
    expect(actions).toHaveLength(3);
    expect(actions[0].getAttribute('aria-label')).toBe('Historial');
    expect(actions[0].getAttribute('data-item-id')).toBe('history');
  });

  it('emits itemClick and closes when closeOnSelect is true', async () => {
    host.open.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    actionButtons()[1]?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.lastClicked()?.id).toBe('schedule');
    expect(host.open()).toBe(false);
    expect(trigger()).toBeTruthy();
  });

  it('keeps open when closeOnSelect is false', async () => {
    host.closeOnSelect.set(false);
    host.open.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    actionButtons()[0]?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.lastClicked()?.id).toBe('history');
    expect(host.open()).toBe(true);
    expect(toolbar()).toBeTruthy();
  });

  it('does not open when disabled', async () => {
    host.disabled.set(true);
    fixture.detectChanges();

    trigger()?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.open()).toBe(false);
    expect(toolbar()).toBeNull();
  });

  it('closes on Escape', async () => {
    host.open.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    await new Promise<void>((resolve) => setTimeout(resolve, 160));

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.open()).toBe(false);
  });

  it('closes on outside pointerdown', async () => {
    host.open.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    await new Promise<void>((resolve) => setTimeout(resolve, 160));

    document.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.open()).toBe(false);
  });

  it('can be created without throwing (SSR-safe construction)', () => {
    const dialFixture = TestBed.createComponent(WiSpeedDialComponent);
    dialFixture.componentRef.setInput('items', ITEMS);
    expect(() => dialFixture.detectChanges()).not.toThrow();
    expect(dialFixture.componentInstance).toBeTruthy();
    expect(dialFixture.nativeElement.classList.contains('wi-speed-dial')).toBe(true);
  });
});
