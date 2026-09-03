import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WiChipComponent } from '../../data-display/src/chip/wi-chip.component';
import type { WiChipRadius, WiChipSize, WiChipVariant } from '../../data-display/src/chip/wi-chip.types';

@Component({
  imports: [WiChipComponent],
  template: `
    <wi-chip
      [variant]="variant()"
      [size]="size()"
      [radius]="radius()"
      [selected]="selected()"
      [clickable]="clickable()"
      [removable]="removable()"
      [disabled]="disabled()"
      [removeLabel]="removeLabel()"
      [ariaLabel]="ariaLabel()"
      (removed)="removedCount.set(removedCount() + 1)"
      (clicked)="clickedCount.set(clickedCount() + 1)"
    >
      {{ label() }}
    </wi-chip>
  `,
})
class WiChipHostComponent {
  readonly variant = signal<WiChipVariant>('neutral');
  readonly size = signal<WiChipSize>('sm');
  readonly radius = signal<WiChipRadius>('control');
  readonly selected = signal(false);
  readonly clickable = signal(false);
  readonly removable = signal(false);
  readonly disabled = signal(false);
  readonly removeLabel = signal('Quitar');
  readonly ariaLabel = signal<string | null>(null);
  readonly label = signal('Etiqueta');
  readonly removedCount = signal(0);
  readonly clickedCount = signal(0);
}

describe('WiChipComponent', () => {
  let fixture: ComponentFixture<WiChipHostComponent>;
  let host: WiChipHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WiChipHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WiChipHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  function chip(): HTMLElement {
    return fixture.nativeElement.querySelector('wi-chip');
  }

  function removeButton(): HTMLButtonElement | null {
    return chip().querySelector('button.wi-chip__remove');
  }

  it('renders host with default variant, size and structural classes', () => {
    const el = chip();
    expect(el).toBeTruthy();
    expect(el.getAttribute('data-slot')).toBe('chip');
    expect(el.getAttribute('data-variant')).toBe('neutral');
    expect(el.getAttribute('data-size')).toBe('sm');
    expect(el.getAttribute('data-radius')).toBe('control');
    expect(el.getAttribute('data-appearance')).toBe('default');
    expect(el.getAttribute('data-removable')).toBe('false');
    expect(el.getAttribute('data-clickable')).toBe('false');
    expect(el.getAttribute('data-disabled')).toBeNull();
    expect(el.getAttribute('role')).toBeNull();
    expect(el.classList.contains('wi-chip')).toBe(true);
    expect(el.className).toContain('data-[radius=control]:rounded-control');
    expect(el.className).toContain('data-[size=sm]:text-xs');
    expect(el.className).toContain('data-[size=sm]:px-2');
    expect(el.className).toContain(
      'data-[appearance=default]:data-[variant=neutral]:bg-surface-variant',
    );
    expect(el.textContent).toContain('Etiqueta');
    expect(removeButton()).toBeNull();
  });

  it.each([
    ['neutral', 'data-[appearance=default]:data-[variant=neutral]:bg-surface-variant'],
    ['primary', 'data-[appearance=default]:data-[variant=primary]:bg-primary-container'],
    ['secondary', 'data-[appearance=default]:data-[variant=secondary]:bg-secondary-container'],
    ['success', 'data-[appearance=default]:data-[variant=success]:bg-success'],
    ['warning', 'data-[appearance=default]:data-[variant=warning]:bg-warning'],
    ['danger', 'data-[appearance=default]:data-[variant=danger]:bg-error'],
  ] as const satisfies readonly (readonly [WiChipVariant, string])[])(
    'exposes %s variant via data-variant',
    (variant, tokenClass) => {
      host.variant.set(variant);
      fixture.detectChanges();

      expect(chip().getAttribute('data-variant')).toBe(variant);
      expect(chip().className).toContain(tokenClass);
    },
  );

  it('applies md size via data-size', () => {
    host.size.set('md');
    fixture.detectChanges();

    expect(chip().getAttribute('data-size')).toBe('md');
    expect(chip().className).toContain('data-[size=md]:px-3');
  });

  it.each([
    ['control', 'data-[radius=control]:rounded-control'],
    ['full', 'data-[radius=full]:rounded-full'],
  ] as const satisfies readonly (readonly [WiChipRadius, string])[])(
    'applies %s radius via data-radius',
    (radius, radiusClass) => {
      host.radius.set(radius);
      fixture.detectChanges();

      expect(chip().getAttribute('data-radius')).toBe(radius);
      expect(chip().className).toContain(radiusClass);
    },
  );

  it('uses selected appearance without becoming a button unless clickable', () => {
    host.selected.set(true);
    fixture.detectChanges();

    const el = chip();
    expect(el.getAttribute('data-selected')).toBe('true');
    expect(el.getAttribute('data-appearance')).toBe('selected');
    expect(el.getAttribute('role')).toBeNull();
    expect(el.className).toContain('data-[appearance=selected]:bg-success');
  });

  it('makes the host a toggle button when clickable and emits clicked', () => {
    host.clickable.set(true);
    host.ariaLabel.set('Aplicación');
    fixture.detectChanges();

    const el = chip();
    expect(el.getAttribute('role')).toBe('button');
    expect(el.getAttribute('tabindex')).toBe('0');
    expect(el.getAttribute('aria-pressed')).toBe('false');
    expect(el.getAttribute('aria-label')).toBe('Aplicación');

    el.click();
    fixture.detectChanges();
    expect(host.clickedCount()).toBe(1);

    host.selected.set(true);
    fixture.detectChanges();
    expect(chip().getAttribute('aria-pressed')).toBe('true');
  });

  it('does not emit clicked when disabled', () => {
    host.clickable.set(true);
    host.disabled.set(true);
    fixture.detectChanges();

    const el = chip();
    expect(el.getAttribute('aria-disabled')).toBe('true');
    expect(el.getAttribute('tabindex')).toBeNull();

    el.click();
    fixture.detectChanges();
    expect(host.clickedCount()).toBe(0);
  });

  it('renders remove button when removable and emits removed', () => {
    host.removable.set(true);
    host.removeLabel.set('Quitar filtro');
    fixture.detectChanges();

    const button = removeButton();
    expect(button).toBeTruthy();
    expect(chip().getAttribute('data-removable')).toBe('true');
    expect(button?.getAttribute('type')).toBe('button');
    expect(button?.getAttribute('aria-label')).toBe('Quitar filtro');
    expect(button?.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');

    button?.click();
    fixture.detectChanges();

    expect(host.removedCount()).toBe(1);
  });

  it('does not emit removed when disabled', () => {
    host.removable.set(true);
    host.disabled.set(true);
    fixture.detectChanges();

    const el = chip();
    expect(el.getAttribute('data-disabled')).toBe('true');
    expect(el.className).toContain('data-[disabled=true]:opacity-50');
    expect(el.className).toContain('data-[disabled=true]:pointer-events-none');

    const button = removeButton();
    expect(button?.disabled).toBe(true);

    button?.click();
    fixture.detectChanges();

    expect(host.removedCount()).toBe(0);
  });

  it('does not emit clicked when activating the remove control', () => {
    host.clickable.set(true);
    host.removable.set(true);
    fixture.detectChanges();

    removeButton()?.click();
    fixture.detectChanges();

    expect(host.removedCount()).toBe(1);
    expect(host.clickedCount()).toBe(0);
  });

  it('can be created without throwing (SSR-safe construction)', () => {
    const chipFixture = TestBed.createComponent(WiChipComponent);
    expect(() => chipFixture.detectChanges()).not.toThrow();
    expect(chipFixture.componentInstance).toBeTruthy();
    expect(chipFixture.nativeElement.classList.contains('wi-chip')).toBe(true);
  });
});
