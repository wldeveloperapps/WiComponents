import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { WiInputComponent } from '../../forms/src/input/wi-input.component';
import type { WiInputSize, WiInputType } from '../../forms/src/input/wi-input.types';

@Component({
  imports: [WiInputComponent, ReactiveFormsModule],
  template: `<wi-input [formControl]="control" />`,
})
class ReactiveHostComponent {
  readonly control = new FormControl('initial', {
    nonNullable: true,
    validators: [Validators.required],
  });
}

describe('WiInputComponent', () => {
  let fixture: ComponentFixture<WiInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WiInputComponent, ReactiveHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WiInputComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  function nativeInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector('input');
  }

  it('renders a native text input with default classes', () => {
    const el = nativeInput();
    expect(el).toBeTruthy();
    expect(el.getAttribute('type')).toBe('text');
    expect(el.className).toContain('border-outline-variant');
    expect(el.className).toContain('bg-surface');
    expect(el.className).toContain('h-control-md');
    expect(fixture.nativeElement.classList.contains('wi-input')).toBe(true);
    expect(el.disabled).toBe(false);
    expect(el.readOnly).toBe(false);
    expect(el.getAttribute('aria-invalid')).toBeNull();
    expect(el.getAttribute('aria-required')).toBeNull();
  });

  it('exposes a stable id for label association', () => {
    expect(nativeInput().id).toMatch(/^wi-input-\d+$/);

    fixture.componentRef.setInput('id', 'email');
    fixture.detectChanges();
    expect(nativeInput().id).toBe('email');
  });

  it.each([
    ['sm', 'h-control-sm'],
    ['md', 'h-control-md'],
    ['lg', 'h-control-lg'],
  ] as const satisfies readonly (readonly [WiInputSize, string])[])(
    'applies %s size classes',
    (size, heightClass) => {
      fixture.componentRef.setInput('size', size);
      fixture.detectChanges();
      expect(nativeInput().className).toContain(heightClass);
    },
  );

  it.each([
    'text',
    'email',
    'password',
    'search',
    'tel',
    'url',
    'number',
  ] as const satisfies readonly WiInputType[])('sets type=%s', (type) => {
    fixture.componentRef.setInput('type', type);
    fixture.detectChanges();
    expect(nativeInput().getAttribute('type')).toBe(type);
  });

  it('applies placeholder, aria-label and aria-describedby', () => {
    fixture.componentRef.setInput('placeholder', 'Buscar…');
    fixture.componentRef.setInput('ariaLabel', 'Buscar');
    fixture.componentRef.setInput('ariaDescribedBy', 'hint-1');
    fixture.detectChanges();

    const el = nativeInput();
    expect(el.getAttribute('placeholder')).toBe('Buscar…');
    expect(el.getAttribute('aria-label')).toBe('Buscar');
    expect(el.getAttribute('aria-describedby')).toBe('hint-1');
  });

  it('disables when disabled is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(nativeInput().disabled).toBe(true);
  });

  it('marks readonly when readonly is true', () => {
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();
    expect(nativeInput().readOnly).toBe(true);
  });

  it('exposes invalid and required ARIA state', () => {
    fixture.componentRef.setInput('invalid', true);
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    const el = nativeInput();
    expect(el.getAttribute('aria-invalid')).toBe('true');
    expect(el.getAttribute('aria-required')).toBe('true');
    expect(el.required).toBe(true);
  });

  it('updates value model on input', () => {
    const el = nativeInput();
    el.value = 'hola';
    el.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('hola');
  });

  it('emits touch on blur', () => {
    const touchSpy = vi.fn();
    fixture.componentInstance.touch.subscribe(touchSpy);

    nativeInput().dispatchEvent(new Event('blur'));
    expect(touchSpy).toHaveBeenCalledTimes(1);
  });

  it('integrates with Reactive Forms via CVA', async () => {
    const hostFixture = TestBed.createComponent(ReactiveHostComponent);
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    const el = hostFixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(el.value).toBe('initial');

    el.value = 'updated';
    el.dispatchEvent(new Event('input'));
    hostFixture.detectChanges();
    expect(hostFixture.componentInstance.control.value).toBe('updated');

    hostFixture.componentInstance.control.setValue('from-form');
    hostFixture.detectChanges();
    expect(el.value).toBe('from-form');

    hostFixture.componentInstance.control.disable();
    hostFixture.detectChanges();
    expect(el.disabled).toBe(true);
  });

  it('can be created without throwing (SSR-safe construction)', () => {
    const inputFixture = TestBed.createComponent(WiInputComponent);
    expect(() => inputFixture.detectChanges()).not.toThrow();
    expect(inputFixture.componentInstance).toBeTruthy();
  });

  function passwordToggleButton(): HTMLButtonElement | null {
    return fixture.nativeElement.querySelector('button[type="button"]');
  }

  it('does not render a password toggle for non-password types', () => {
    fixture.componentRef.setInput('type', 'text');
    fixture.detectChanges();
    expect(passwordToggleButton()).toBeNull();
  });

  it('renders a password toggle that reveals and remasks without changing value or focus', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.componentInstance.value.set('secret');
    fixture.detectChanges();

    const el = nativeInput();
    el.focus();
    expect(el.getAttribute('type')).toBe('password');
    expect(el.className).toContain('pr-10');

    const toggle = passwordToggleButton();
    expect(toggle).toBeTruthy();
    expect(toggle?.getAttribute('aria-label')).toBe('Show password');
    expect(toggle?.getAttribute('aria-pressed')).toBe('false');
    expect(toggle?.getAttribute('aria-controls')).toBe(el.id);

    toggle?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    toggle?.click();
    fixture.detectChanges();

    expect(nativeInput().getAttribute('type')).toBe('text');
    expect(fixture.componentInstance.value()).toBe('secret');
    expect(document.activeElement).toBe(el);
    expect(passwordToggleButton()?.getAttribute('aria-label')).toBe('Hide password');
    expect(passwordToggleButton()?.getAttribute('aria-pressed')).toBe('true');

    passwordToggleButton()?.click();
    fixture.detectChanges();
    expect(nativeInput().getAttribute('type')).toBe('password');
  });

  it('hides the password toggle when passwordToggle is false', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.componentRef.setInput('passwordToggle', false);
    fixture.detectChanges();
    expect(passwordToggleButton()).toBeNull();
    expect(nativeInput().getAttribute('type')).toBe('password');
  });

  it('removes the toggle and remasks when disabled', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.detectChanges();

    passwordToggleButton()?.click();
    fixture.detectChanges();
    expect(nativeInput().getAttribute('type')).toBe('text');

    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    expect(passwordToggleButton()).toBeNull();
    expect(nativeInput().getAttribute('type')).toBe('password');
    expect(nativeInput().disabled).toBe(true);
  });

  it('keeps the password toggle when readonly', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();
    expect(passwordToggleButton()).toBeTruthy();
  });

  it('uses custom show/hide password labels', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.componentRef.setInput('showPasswordLabel', 'Mostrar contraseña');
    fixture.componentRef.setInput('hidePasswordLabel', 'Ocultar contraseña');
    fixture.detectChanges();

    expect(passwordToggleButton()?.getAttribute('aria-label')).toBe('Mostrar contraseña');

    passwordToggleButton()?.click();
    fixture.detectChanges();
    expect(passwordToggleButton()?.getAttribute('aria-label')).toBe('Ocultar contraseña');
  });
});
