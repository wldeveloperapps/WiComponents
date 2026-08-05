import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  WiTabsContentDirective,
  WiTabsComponent,
  WiTabsListComponent,
  WiTabsTriggerDirective,
} from '../../navigation/src/wi-tabs.component';

@Component({
  selector: 'wi-tabs-host',
  imports: [WiTabsComponent, WiTabsListComponent, WiTabsTriggerDirective, WiTabsContentDirective],
  template: `
    <wi-tabs
      [value]="value()"
      [orientation]="orientation()"
      (valueChange)="value.set($event ?? '')"
      (tabActivated)="activated.set($event)"
    >
      <wi-tabs-list [variant]="variant()" [size]="size()">
        <button type="button" wiTabsTrigger="unmanaged">Alertas No Gestionadas</button>
        <button type="button" wiTabsTrigger="managed" [disabled]="managedDisabled()">
          Alertas Gestionadas
        </button>
      </wi-tabs-list>
      <div wiTabsContent="unmanaged">Panel no gestionadas</div>
      <div wiTabsContent="managed">Panel gestionadas</div>
    </wi-tabs>
  `,
})
class WiTabsHostComponent {
  readonly value = signal('unmanaged');
  readonly orientation = signal<'horizontal' | 'vertical'>('horizontal');
  readonly variant = signal<'segmented' | 'line'>('segmented');
  readonly size = signal<'sm' | 'md'>('md');
  readonly managedDisabled = signal(false);
  readonly activated = signal<string | null>(null);
}

describe('WiTabsComponent', () => {
  let fixture: ComponentFixture<WiTabsHostComponent>;
  let host: WiTabsHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WiTabsHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WiTabsHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  function root(): HTMLElement {
    return fixture.nativeElement.querySelector('wi-tabs');
  }

  function list(): HTMLElement {
    return fixture.nativeElement.querySelector('wi-tabs-list');
  }

  function triggers(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('button[wiTabsTrigger]'));
  }

  function panels(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('[wiTabsContent]'));
  }

  it('renders tabs with default segmented list and active trigger', () => {
    expect(root().classList.contains('wi-tabs')).toBe(true);
    expect(list().classList.contains('wi-tabs__list')).toBe(true);
    expect(list().getAttribute('data-variant')).toBe('segmented');
    expect(list().getAttribute('data-size')).toBe('md');
    expect(list().getAttribute('role')).toBe('tablist');

    const viewport = list().querySelector('.wi-tabs__viewport') as HTMLElement;
    expect(viewport.className).toContain('bg-surface-variant');

    const [first, second] = triggers();
    expect(first.getAttribute('role')).toBe('tab');
    expect(first.getAttribute('aria-selected')).toBe('true');
    expect(first.getAttribute('data-state')).toBe('active');
    expect(first.className).toContain('wi-tabs__trigger');
    expect(second.getAttribute('aria-selected')).toBe('false');
    expect(second.getAttribute('data-state')).toBe('inactive');
  });

  it('switches active tab on click and emits tabActivated', async () => {
    triggers()[1].click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.value()).toBe('managed');
    expect(host.activated()).toBe('managed');
    expect(triggers()[1].getAttribute('aria-selected')).toBe('true');
    expect(triggers()[0].getAttribute('aria-selected')).toBe('false');
  });

  it('hides inactive panel content', async () => {
    const [unmanaged, managed] = panels();
    expect(unmanaged.hasAttribute('hidden')).toBe(false);
    expect(managed.hasAttribute('hidden')).toBe(true);

    triggers()[1].click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(unmanaged.hasAttribute('hidden')).toBe(true);
    expect(managed.hasAttribute('hidden')).toBe(false);
  });

  it('applies line variant classes', () => {
    host.variant.set('line');
    fixture.detectChanges();

    expect(list().getAttribute('data-variant')).toBe('line');
    const viewport = list().querySelector('.wi-tabs__viewport') as HTMLElement;
    expect(viewport.className).toContain('bg-transparent');
  });

  it('applies size data attribute', () => {
    host.size.set('sm');
    fixture.detectChanges();

    expect(list().getAttribute('data-size')).toBe('sm');
  });

  it('disables a trigger', () => {
    host.managedDisabled.set(true);
    fixture.detectChanges();

    const managed = triggers()[1];
    expect(managed.disabled).toBe(true);
    expect(managed.getAttribute('aria-disabled')).toBe('true');
    expect(managed.tabIndex).toBe(-1);
    expect(managed.className).toContain('px-2');
    expect(managed.className).toContain('shrink-0');
  });

  it('applies built-in scroll viewport with library scrollbar styles', () => {
    expect(root().classList.contains('wi-tabs')).toBe(true);
    expect(root().className).toContain('w-full');
    expect(root().className).toContain('max-w-full');
    const viewport = list().querySelector('.wi-tabs__viewport') as HTMLElement;
    expect(viewport).toBeTruthy();
    expect(getComputedStyle(viewport).overflowX).toBe('auto');
    expect(getComputedStyle(viewport).scrollbarWidth).toBe('thin');
  });

  it('sets vertical orientation on the root', () => {
    host.orientation.set('vertical');
    fixture.detectChanges();

    expect(root().getAttribute('data-orientation')).toBe('vertical');
    expect(list().getAttribute('aria-orientation')).toBe('vertical');
  });
});
