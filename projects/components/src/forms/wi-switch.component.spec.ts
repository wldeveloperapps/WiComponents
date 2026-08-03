import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { WiSwitchComponent } from '../../forms/src/wi-switch.component';
import type { WiSwitchSize } from '../../forms/src/wi-switch.types';

@Component({
  imports: [WiSwitchComponent, ReactiveFormsModule],
  template: `<wi-switch [formControl]="control" ariaLabel="Alerts" />`,
})
class ReactiveHostComponent {
  readonly control = new FormControl(false, {
    nonNullable: true,
    validators: [Validators.requiredTrue],
  });
}

describe('WiSwitchComponent', () => {
  let fixture: ComponentFixture<WiSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WiSwitchComponent, ReactiveHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WiSwitchComponent);
    fixture.componentRef.setInput('ariaLabel', 'Airplane mode');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  function switchButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button[role="switch"]');
  }

  it('renders an accessible switch with default state', () => {
    const el = switchButton();
    expect(el).toBeTruthy();
    expect(el.getAttribute('role')).toBe('switch');
    expect(el.getAttribute('aria-checked')).toBe('false');
    expect(el.getAttribute('aria-label')).toBe('Airplane mode');
    expect(el.className).toContain('data-[state=unchecked]:bg-outline-variant');

    expect(el.className).toContain('h-5');
    expect(el.className).toContain('w-9');
    expect(fixture.nativeElement.classList.contains('wi-switch')).toBe(true);
    expect(el.disabled).toBe(false);
  });

  it('exposes a stable id for label association', () => {
    expect(switchButton().id).toMatch(/^wi-switch-\d+$/);

    fixture.componentRef.setInput('id', 'airplane');
    fixture.detectChanges();
    expect(switchButton().id).toBe('airplane');
  });

  it.each([
    ['sm', 'h-4', 'w-7'],
    ['md', 'h-5', 'w-9'],
    ['lg', 'h-6', 'w-11'],
  ] as const satisfies readonly (readonly [WiSwitchSize, string, string])[])(
    'applies %s size classes',
    (size, heightClass, widthClass) => {
      fixture.componentRef.setInput('size', size);
      fixture.detectChanges();
      expect(switchButton().className).toContain(heightClass);
      expect(switchButton().className).toContain(widthClass);
    },
  );

  it('toggles value on click', () => {
    const el = switchButton();
    el.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe(true);
    expect(el.getAttribute('aria-checked')).toBe('true');
    expect(el.getAttribute('data-state')).toBe('checked');

    el.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe(false);
    expect(el.getAttribute('aria-checked')).toBe('false');
    expect(el.getAttribute('data-state')).toBe('unchecked');
  });

  it('reflects checked state when value is true', () => {
    fixture.componentRef.setInput('value', true);
    fixture.detectChanges();

    expect(switchButton().getAttribute('aria-checked')).toBe('true');
    expect(switchButton().getAttribute('data-state')).toBe('checked');
    expect(fixture.nativeElement.querySelector('.wi-switch__thumb')).toBeTruthy();
  });

  it('disables when disabled is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(switchButton().disabled).toBe(true);
  });

  it('applies invalid visual state', () => {
    fixture.componentRef.setInput('invalid', true);
    fixture.detectChanges();
    expect(switchButton().className).toContain('data-[state=checked]:bg-error');
  });

  it('applies aria-describedby', () => {
    fixture.componentRef.setInput('ariaDescribedBy', 'hint-1');
    fixture.detectChanges();
    expect(switchButton().getAttribute('aria-describedby')).toBe('hint-1');
  });

  it('emits touch on blur', async () => {
    const touchSpy = vi.fn();
    fixture.componentInstance.touch.subscribe(touchSpy);

    const el = switchButton();
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
      'button[role="switch"]',
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
    const switchFixture = TestBed.createComponent(WiSwitchComponent);
    expect(() => switchFixture.detectChanges()).not.toThrow();
    expect(switchFixture.componentInstance).toBeTruthy();
  });
});
