import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { WiCheckboxComponent } from '../../forms/src/wi-checkbox.component';
import type { WiCheckboxSize } from '../../forms/src/wi-checkbox.types';

@Component({
  imports: [WiCheckboxComponent, ReactiveFormsModule],
  template: `<wi-checkbox [formControl]="control" ariaLabel="Terms" />`,
})
class ReactiveHostComponent {
  readonly control = new FormControl(false, {
    nonNullable: true,
    validators: [Validators.requiredTrue],
  });
}

describe('WiCheckboxComponent', () => {
  let fixture: ComponentFixture<WiCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WiCheckboxComponent, ReactiveHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WiCheckboxComponent);
    fixture.componentRef.setInput('ariaLabel', 'Accept');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  function checkboxButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button[role="checkbox"]');
  }

  it('renders an accessible checkbox with default state', () => {
    const el = checkboxButton();
    expect(el).toBeTruthy();
    expect(el.getAttribute('role')).toBe('checkbox');
    expect(el.getAttribute('aria-checked')).toBe('false');
    expect(el.getAttribute('aria-label')).toBe('Accept');
    expect(el.className).toContain('border-outline');
    expect(el.className).toContain('size-4');
    expect(fixture.nativeElement.classList.contains('wi-checkbox')).toBe(true);
    expect(el.disabled).toBe(false);
  });

  it('exposes a stable id for label association', () => {
    expect(checkboxButton().id).toMatch(/^wi-checkbox-\d+$/);

    fixture.componentRef.setInput('id', 'terms');
    fixture.detectChanges();
    expect(checkboxButton().id).toBe('terms');
  });

  it.each([
    ['sm', 'size-3.5'],
    ['md', 'size-4'],
    ['lg', 'size-5'],
  ] as const satisfies readonly (readonly [WiCheckboxSize, string])[])(
    'applies %s size classes',
    (size, sizeClass) => {
      fixture.componentRef.setInput('size', size);
      fixture.detectChanges();
      expect(checkboxButton().className).toContain(sizeClass);
    },
  );

  it('toggles value on click', () => {
    const el = checkboxButton();
    el.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe(true);
    expect(el.getAttribute('aria-checked')).toBe('true');
    expect(fixture.nativeElement.querySelector('.wi-checkbox__indicator')).toBeTruthy();

    el.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe(false);
    expect(el.getAttribute('aria-checked')).toBe('false');
  });

  it('shows check indicator when value is true', () => {
    fixture.componentRef.setInput('value', true);
    fixture.detectChanges();

    expect(checkboxButton().getAttribute('aria-checked')).toBe('true');
    expect(fixture.nativeElement.querySelector('.wi-checkbox__indicator')).toBeTruthy();
  });

  it('supports indeterminate state', () => {
    fixture.componentRef.setInput('indeterminate', true);
    fixture.detectChanges();

    const el = checkboxButton();
    expect(el.getAttribute('aria-checked')).toBe('mixed');
    expect(el.getAttribute('data-state')).toBe('indeterminate');
    expect(fixture.nativeElement.querySelector('.wi-checkbox__indicator')).toBeTruthy();
  });

  it('clears indeterminate and checks on click', () => {
    fixture.componentRef.setInput('indeterminate', true);
    fixture.detectChanges();

    checkboxButton().click();
    fixture.detectChanges();

    expect(fixture.componentInstance.indeterminate()).toBe(false);
    expect(fixture.componentInstance.value()).toBe(true);
    expect(checkboxButton().getAttribute('aria-checked')).toBe('true');
  });

  it('disables when disabled is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(checkboxButton().disabled).toBe(true);
  });

  it('applies invalid visual state', () => {
    fixture.componentRef.setInput('invalid', true);
    fixture.detectChanges();
    expect(checkboxButton().className).toContain('border-error');
  });

  it('applies aria-describedby', () => {
    fixture.componentRef.setInput('ariaDescribedBy', 'hint-1');
    fixture.detectChanges();
    expect(checkboxButton().getAttribute('aria-describedby')).toBe('hint-1');
  });

  it('emits touch on blur', async () => {
    const touchSpy = vi.fn();
    fixture.componentInstance.touch.subscribe(touchSpy);

    const el = checkboxButton();
    el.focus();
    el.blur();
    await Promise.resolve();
    fixture.detectChanges();

    expect(touchSpy).toHaveBeenCalled();
  });

  it('integrates with Reactive Forms via CVA', async () => {
    const hostFixture = TestBed.createComponent(ReactiveHostComponent);
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    const el = hostFixture.nativeElement.querySelector(
      'button[role="checkbox"]',
    ) as HTMLButtonElement;
    expect(el.getAttribute('aria-checked')).toBe('false');

    el.click();
    hostFixture.detectChanges();
    expect(hostFixture.componentInstance.control.value).toBe(true);

    hostFixture.componentInstance.control.setValue(false);
    hostFixture.detectChanges();
    expect(el.getAttribute('aria-checked')).toBe('false');

    hostFixture.componentInstance.control.disable();
    hostFixture.detectChanges();
    expect(el.disabled).toBe(true);
  });

  it('can be created without throwing (SSR-safe construction)', () => {
    const checkboxFixture = TestBed.createComponent(WiCheckboxComponent);
    expect(() => checkboxFixture.detectChanges()).not.toThrow();
    expect(checkboxFixture.componentInstance).toBeTruthy();
  });
});
