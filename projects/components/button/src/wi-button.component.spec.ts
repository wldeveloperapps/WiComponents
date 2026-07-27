import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WiButtonComponent } from './wi-button.component';
import type { WiButtonSize, WiButtonVariant } from './wi-button.types';

describe('WiButtonComponent', () => {
  let fixture: ComponentFixture<WiButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WiButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WiButtonComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  function button(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button');
  }

  it('renders a native button with default type and classes', () => {
    const el = button();
    expect(el).toBeTruthy();
    expect(el.getAttribute('type')).toBe('button');
    expect(el.className).toContain('bg-primary');
    expect(el.className).toContain('text-on-primary');
    expect(el.className).toContain('h-control-md');
    expect(fixture.nativeElement.classList.contains('wi-button')).toBe(true);
    expect(el.disabled).toBe(false);
    expect(el.getAttribute('aria-busy')).toBeNull();
    expect(el.getAttribute('aria-disabled')).toBeNull();
    expect(el.getAttribute('aria-label')).toBeNull();
    expect(el.querySelector('svg')).toBeNull();
  });

  it.each([
    ['primary', 'bg-primary', 'text-on-primary'],
    ['secondary', 'bg-secondary', 'text-on-secondary'],
    ['danger', 'bg-error', 'text-on-error'],
    ['ghost', 'bg-transparent', 'text-on-surface'],
    ['outline', 'border-outline', 'text-on-surface'],
  ] as const satisfies readonly (readonly [WiButtonVariant, string, string])[])(
    'applies %s variant classes',
    (variant, tokenA, tokenB) => {
      fixture.componentRef.setInput('variant', variant);
      fixture.detectChanges();

      expect(button().className).toContain(tokenA);
      expect(button().className).toContain(tokenB);
    },
  );

  it.each([
    ['sm', 'h-control-sm'],
    ['md', 'h-control-md'],
    ['lg', 'h-control-lg'],
  ] as const satisfies readonly (readonly [WiButtonSize, string])[])(
    'applies %s size classes',
    (size, heightClass) => {
      fixture.componentRef.setInput('size', size);
      fixture.detectChanges();

      expect(button().className).toContain(heightClass);
    },
  );

  it('disables when disabled is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    expect(button().disabled).toBe(true);
    expect(button().getAttribute('aria-disabled')).toBe('true');
  });

  it('disables and shows busy state when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const el = button();
    expect(el.disabled).toBe(true);
    expect(el.getAttribute('aria-busy')).toBe('true');
    expect(el.getAttribute('aria-disabled')).toBe('true');
    expect(el.querySelector('svg')).toBeTruthy();
  });

  it('stays disabled when both disabled and loading are true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    expect(button().disabled).toBe(true);
    expect(button().getAttribute('aria-busy')).toBe('true');
  });

  it('applies icon-only sizing and aria-label', () => {
    fixture.componentRef.setInput('iconOnly', true);
    fixture.componentRef.setInput('ariaLabel', 'Eliminar');
    fixture.detectChanges();

    const el = button();
    expect(el.className).toContain('w-10');
    expect(el.className).toContain('px-0');
    expect(el.getAttribute('aria-label')).toBe('Eliminar');
  });

  it.each([
    ['sm', 'w-8'],
    ['md', 'w-10'],
    ['lg', 'w-12'],
  ] as const satisfies readonly (readonly [WiButtonSize, string])[])(
    'applies icon-only width for size %s',
    (size, widthClass) => {
      fixture.componentRef.setInput('iconOnly', true);
      fixture.componentRef.setInput('size', size);
      fixture.detectChanges();

      expect(button().className).toContain(widthClass);
      expect(button().className).toContain('px-0');
    },
  );

  it('supports submit and reset types', () => {
    fixture.componentRef.setInput('type', 'submit');
    fixture.detectChanges();
    expect(button().getAttribute('type')).toBe('submit');

    fixture.componentRef.setInput('type', 'reset');
    fixture.detectChanges();
    expect(button().getAttribute('type')).toBe('reset');
  });

  it('can be created without throwing (SSR-safe construction)', () => {
    const buttonFixture = TestBed.createComponent(WiButtonComponent);
    expect(() => buttonFixture.detectChanges()).not.toThrow();
    expect(buttonFixture.componentInstance).toBeTruthy();
  });
});
