import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { WiOtpComponent } from '../../forms/src/otp/wi-otp.component';
import type { WiOtpSize } from '../../forms/src/otp/wi-otp.types';

@Component({
  imports: [WiOtpComponent, ReactiveFormsModule],
  template: `<wi-otp [formControl]="control" ariaLabel="Code" />`,
})
class ReactiveHostComponent {
  readonly control = new FormControl('12', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(6)],
  });
}

describe('WiOtpComponent', () => {
  let fixture: ComponentFixture<WiOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WiOtpComponent, ReactiveHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WiOtpComponent);
    fixture.componentRef.setInput('ariaLabel', 'Verification code');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  function nativeInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector('input[data-slot="input-otp"]');
  }

  function slots(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.wi-otp__slot'));
  }

  function typeValue(value: string): void {
    const el = nativeInput();
    el.value = value;
    el.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  it('renders six slots and a hidden input by default', () => {
    expect(slots()).toHaveLength(6);
    expect(nativeInput()).toBeTruthy();
    expect(nativeInput().getAttribute('autocomplete')).toBe('one-time-code');
    expect(nativeInput().getAttribute('inputMode')).toBe('numeric');
    expect(fixture.nativeElement.classList.contains('wi-otp')).toBe(true);
    expect(slots()[0]?.className).toContain('size-10');
    expect(slots()[0]?.className).toContain('border-outline-variant');
  });

  it('exposes a stable id for label association', () => {
    expect(nativeInput().id).toMatch(/^wi-otp-\d+$/);

    fixture.componentRef.setInput('id', 'login-otp');
    fixture.detectChanges();
    expect(nativeInput().id).toBe('login-otp');
  });

  it.each([
    ['sm', 'size-8'],
    ['md', 'size-10'],
    ['lg', 'size-12'],
  ] as const satisfies readonly (readonly [WiOtpSize, string])[])(
    'applies %s size classes',
    (size, sizeClass) => {
      fixture.componentRef.setInput('size', size);
      fixture.detectChanges();
      expect(slots()[0]?.className).toContain(sizeClass);
    },
  );

  it('renders the requested number of slots', () => {
    fixture.componentRef.setInput('length', 4);
    fixture.detectChanges();
    expect(slots()).toHaveLength(4);
  });

  it('applies aria-label, aria-describedby, invalid and required on the native input', async () => {
    fixture.componentRef.setInput('ariaLabel', 'Código');
    fixture.componentRef.setInput('ariaDescribedBy', 'otp-hint');
    fixture.componentRef.setInput('invalid', true);
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();
    await fixture.whenStable();

    const el = nativeInput();
    expect(el.getAttribute('aria-label')).toBe('Código');
    expect(el.getAttribute('aria-describedby')).toBe('otp-hint');
    expect(el.getAttribute('aria-invalid')).toBe('true');
    expect(el.getAttribute('aria-required')).toBe('true');
    expect(slots()[0]?.className).toContain('border-error');
  });

  it('disables when disabled is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(nativeInput().disabled).toBe(true);
    expect(fixture.nativeElement.classList.contains('opacity-50')).toBe(true);
  });

  it('marks the native input readonly', async () => {
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(nativeInput().readOnly).toBe(true);
  });

  it('updates value model on input and fills slots', () => {
    typeValue('123');
    expect(fixture.componentInstance.value()).toBe('123');
    expect(slots()[0]?.textContent).toContain('1');
    expect(slots()[1]?.textContent).toContain('2');
    expect(slots()[2]?.textContent).toContain('3');
  });

  it('strips non-digits in numeric mode', () => {
    typeValue('1a2');
    expect(fixture.componentInstance.value()).toBe('12');
  });

  it('emits completed when the value reaches length', () => {
    const completedSpy = vi.fn();
    fixture.componentInstance.completed.subscribe(completedSpy);

    typeValue('123456');
    expect(completedSpy).toHaveBeenCalledWith('123456');
  });

  it('emits touch on focusout', () => {
    const touchSpy = vi.fn();
    fixture.componentInstance.touch.subscribe(touchSpy);

    nativeInput().dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    expect(touchSpy).toHaveBeenCalledTimes(1);
  });

  it('integrates with Reactive Forms via CVA', async () => {
    const hostFixture = TestBed.createComponent(ReactiveHostComponent);
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    const el = hostFixture.nativeElement.querySelector(
      'input[data-slot="input-otp"]',
    ) as HTMLInputElement;
    expect(el.value).toBe('12');

    el.value = '654321';
    el.dispatchEvent(new Event('input'));
    hostFixture.detectChanges();
    expect(hostFixture.componentInstance.control.value).toBe('654321');

    hostFixture.componentInstance.control.setValue('111111');
    hostFixture.detectChanges();
    expect(el.value).toBe('111111');

    hostFixture.componentInstance.control.disable();
    hostFixture.detectChanges();
    expect(el.disabled).toBe(true);
  });

  it('can be created without throwing (SSR-safe construction)', () => {
    const otpFixture = TestBed.createComponent(WiOtpComponent);
    expect(() => otpFixture.detectChanges()).not.toThrow();
    expect(otpFixture.componentInstance).toBeTruthy();
  });
});
