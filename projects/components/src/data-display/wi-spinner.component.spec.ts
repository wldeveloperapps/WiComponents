import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WiSpinnerComponent } from '../../data-display/src/wi-spinner.component';
import type { WiSpinnerSize } from '../../data-display/src/wi-spinner.types';

@Component({
  imports: [WiSpinnerComponent],
  template: ` <wi-spinner [size]="size()" [ariaLabel]="ariaLabel()" /> `,
})
class WiSpinnerHostComponent {
  readonly size = signal<WiSpinnerSize>('md');
  readonly ariaLabel = signal('Cargando');
}

describe('WiSpinnerComponent', () => {
  let fixture: ComponentFixture<WiSpinnerHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WiSpinnerHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WiSpinnerHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  function spinner(): HTMLElement {
    return fixture.nativeElement.querySelector('wi-spinner');
  }

  function svg(): SVGElement {
    return spinner().querySelector('svg') as SVGElement;
  }

  it('renders host with status role, default size and structural classes', () => {
    const el = spinner();
    expect(el).toBeTruthy();
    expect(el.getAttribute('data-slot')).toBe('spinner');
    expect(el.getAttribute('data-size')).toBe('md');
    expect(el.getAttribute('role')).toBe('status');
    expect(el.getAttribute('aria-label')).toBe('Cargando');
    expect(el.classList.contains('wi-spinner')).toBe(true);
    expect(el.className).toContain('text-current');

    const icon = svg();
    expect(icon).toBeTruthy();
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.classList.contains('size-4')).toBe(true);
    expect(icon.className.baseVal || icon.getAttribute('class')).toContain(
      'motion-safe:animate-spin',
    );
  });

  it('applies size classes for sm and lg', () => {
    fixture.componentInstance.size.set('sm');
    fixture.detectChanges();
    expect(spinner().getAttribute('data-size')).toBe('sm');
    expect(svg().classList.contains('size-3')).toBe(true);

    fixture.componentInstance.size.set('lg');
    fixture.detectChanges();
    expect(spinner().getAttribute('data-size')).toBe('lg');
    expect(svg().classList.contains('size-6')).toBe(true);
  });

  it('updates aria-label when ariaLabel changes', () => {
    fixture.componentInstance.ariaLabel.set('Cargando listado');
    fixture.detectChanges();

    expect(spinner().getAttribute('aria-label')).toBe('Cargando listado');
  });

  it('can be created without throwing (SSR-safe construction)', () => {
    const spinnerFixture = TestBed.createComponent(WiSpinnerComponent);
    expect(() => spinnerFixture.detectChanges()).not.toThrow();
    expect(spinnerFixture.componentInstance).toBeTruthy();
    expect(spinnerFixture.nativeElement.classList.contains('wi-spinner')).toBe(true);
  });
});
