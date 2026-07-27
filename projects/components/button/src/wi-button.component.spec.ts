import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WiButtonComponent } from './wi-button.component';

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
    expect(el.className).toContain('h-control-md');
    expect(fixture.nativeElement.classList.contains('wi-button')).toBe(true);
  });

  it('applies variant classes', () => {
    fixture.componentRef.setInput('variant', 'danger');
    fixture.detectChanges();

    expect(button().className).toContain('bg-error');
    expect(button().className).toContain('text-on-error');
  });

  it('applies size classes', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();

    expect(button().className).toContain('h-control-lg');
  });

  it('applies outline variant', () => {
    fixture.componentRef.setInput('variant', 'outline');
    fixture.detectChanges();

    expect(button().className).toContain('border-outline');
  });

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
    expect(el.querySelector('svg')).toBeTruthy();
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

  it('supports submit type', () => {
    fixture.componentRef.setInput('type', 'submit');
    fixture.detectChanges();

    expect(button().getAttribute('type')).toBe('submit');
  });

  it('can be created without throwing (SSR-safe construction)', () => {
    const buttonFixture = TestBed.createComponent(WiButtonComponent);
    expect(() => buttonFixture.detectChanges()).not.toThrow();
    expect(buttonFixture.componentInstance).toBeTruthy();
  });
});
