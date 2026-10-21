import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { WiAccentDirective } from '../../forms/src/accent-picker/wi-accent.directive';
import { WiAccentPickerComponent } from '../../forms/src/accent-picker/wi-accent-picker.component';
import {
  WI_ACCENTS,
  type WiAccent,
  type WiAccentPickerSize,
  type WiAccentTone,
} from '../../forms/src/accent-picker/wi-accent.types';

@Component({
  imports: [WiAccentPickerComponent, ReactiveFormsModule],
  template: `<wi-accent-picker [formControl]="control" ariaLabel="Entity color" />`,
})
class ReactiveHostComponent {
  readonly control = new FormControl<WiAccent | null>(null, {
    validators: [Validators.required],
  });
}

@Component({
  imports: [WiAccentDirective],
  template: `<span id="mark" [wiAccent]="accent()" [wiAccentTone]="tone()">mark</span>`,
})
class AccentHostComponent {
  readonly accent = signal<WiAccent | null>('teal');
  readonly tone = signal<WiAccentTone>('icon');
}

describe('WiAccentPickerComponent', () => {
  let fixture: ComponentFixture<WiAccentPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WiAccentPickerComponent, ReactiveHostComponent, AccentHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WiAccentPickerComponent);
    fixture.componentRef.setInput('ariaLabel', 'Entity color');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  function radios(): HTMLInputElement[] {
    return [...fixture.nativeElement.querySelectorAll('input[type="radio"]')];
  }

  function radio(accent: WiAccent): HTMLInputElement {
    const input = fixture.nativeElement.querySelector(`input[value="${accent}"]`);
    if (!(input instanceof HTMLInputElement)) {
      throw new Error(`Missing radio ${accent}`);
    }
    return input;
  }

  it('renders an accessible radio group with the full palette', () => {
    const host: HTMLElement = fixture.nativeElement;
    expect(host.classList.contains('wi-accent-picker')).toBe(true);
    expect(host.getAttribute('role')).toBe('radiogroup');
    expect(host.getAttribute('aria-label')).toBe('Entity color');
    expect(host.getAttribute('aria-invalid')).toBeNull();

    const options = radios();
    expect(options).toHaveLength(WI_ACCENTS.length);
    expect(options.map((option) => option.value)).toEqual([...WI_ACCENTS]);
    expect(options.every((option) => option.checked === false)).toBe(true);
    expect(new Set(options.map((option) => option.name)).size).toBe(1);
    expect(options[0]?.name).toMatch(/^wi-accent-picker-\d+-group$/);
    expect(radio('teal').getAttribute('aria-label')).toBe('teal');
    expect(radio('teal').className).toContain('sr-only');

    const swatch = radio('blue').nextElementSibling;
    expect(swatch?.className).toContain('size-8');
    expect(swatch?.getAttribute('style')).toContain('var(--wi-color-accent-blue)');
  });

  it('uses a stable id and a custom group name', () => {
    expect(fixture.nativeElement.id).toMatch(/^wi-accent-picker-\d+$/);

    fixture.componentRef.setInput('id', 'entity-color');
    fixture.componentRef.setInput('name', 'entityAccent');
    fixture.detectChanges();

    expect(fixture.nativeElement.id).toBe('entity-color');
    expect(radio('blue').id).toBe('entity-color-blue');
    expect(radio('blue').name).toBe('entityAccent');
  });

  it.each([
    ['sm', 'size-6'],
    ['md', 'size-8'],
    ['lg', 'size-10'],
  ] as const satisfies readonly (readonly [WiAccentPickerSize, string])[])(
    'applies %s swatch size',
    (size, sizeClass) => {
      fixture.componentRef.setInput('size', size);
      fixture.detectChanges();
      expect(radio('blue').nextElementSibling?.className).toContain(sizeClass);
    },
  );

  it('selects an accent and reflects the checked radio', () => {
    radio('teal').click();
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('teal');
    expect(radio('teal').checked).toBe(true);
    expect(radio('blue').checked).toBe(false);
  });

  it('uses accent labels for the accessible name', () => {
    fixture.componentRef.setInput('accentLabels', { teal: '  Verde azulado  ', blue: '' });
    fixture.detectChanges();

    expect(radio('teal').getAttribute('aria-label')).toBe('Verde azulado');
    expect(radio('blue').getAttribute('aria-label')).toBe('blue');
  });

  it('shows a subset and ignores unknown ids', () => {
    fixture.componentRef.setInput('accents', [
      'slate',
      'teal',
      'nope',
      'teal',
    ] as unknown as readonly WiAccent[]);
    fixture.detectChanges();

    expect(radios().map((option) => option.value)).toEqual(['slate', 'teal']);
  });

  it('does not change the value when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    radio('red').click();
    fixture.detectChanges();

    expect(radio('red').disabled).toBe(true);
    expect(fixture.componentInstance.value()).toBeNull();
  });

  it('exposes invalid and required on the group', () => {
    fixture.componentRef.setInput('invalid', true);
    fixture.componentRef.setInput('required', true);
    fixture.componentRef.setInput('ariaDescribedBy', 'accent-error');
    fixture.componentRef.setInput('ariaLabelledBy', 'accent-label');
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;
    expect(host.getAttribute('aria-invalid')).toBe('true');
    expect(host.getAttribute('aria-required')).toBe('true');
    expect(host.getAttribute('aria-describedby')).toBe('accent-error');
    expect(host.getAttribute('aria-labelledby')).toBe('accent-label');
    expect(host.getAttribute('aria-label')).toBeNull();
    expect(host.className).toContain('ring-error');
    expect(radio('blue').required).toBe(true);
    expect(radio('blue').nextElementSibling?.className).toContain('peer-checked:ring-error');
  });

  it('emits touch when focus leaves the group', () => {
    let touched = 0;
    fixture.componentInstance.touch.subscribe(() => {
      touched += 1;
    });

    radio('blue').dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    expect(touched).toBe(1);

    radio('blue').dispatchEvent(
      new FocusEvent('blur', { bubbles: true, relatedTarget: radio('teal') }),
    );
    expect(touched).toBe(1);
  });

  it('writes form values and ignores unknown ones', () => {
    const hostFixture = TestBed.createComponent(ReactiveHostComponent);
    hostFixture.detectChanges();

    const picker = hostFixture.debugElement.children[0]
      ?.componentInstance as WiAccentPickerComponent;
    hostFixture.componentInstance.control.setValue('purple');
    hostFixture.detectChanges();
    expect(picker.value()).toBe('purple');

    const purple = hostFixture.nativeElement.querySelector(
      'input[value="purple"]',
    ) as HTMLInputElement;
    expect(purple.checked).toBe(true);

    const orange = hostFixture.nativeElement.querySelector(
      'input[value="orange"]',
    ) as HTMLInputElement;
    orange.click();
    hostFixture.detectChanges();
    expect(hostFixture.componentInstance.control.value).toBe('orange');

    hostFixture.componentInstance.control.setValue('nope' as WiAccent);
    hostFixture.detectChanges();
    expect(picker.value()).toBeNull();

    hostFixture.componentInstance.control.disable();
    hostFixture.detectChanges();
    expect(purple.disabled).toBe(true);
  });
});

describe('WiAccentDirective', () => {
  let fixture: ComponentFixture<AccentHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccentHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccentHostComponent);
    fixture.detectChanges();
  });

  function mark(): HTMLElement {
    const element = fixture.nativeElement.querySelector('#mark');
    if (!(element instanceof HTMLElement)) {
      throw new Error('Missing mark');
    }
    return element;
  }

  it('tints with the accent token', () => {
    const element = mark();
    expect(element.classList.contains('wi-accent')).toBe(true);
    expect(element.dataset['wiAccent']).toBe('teal');
    expect(element.dataset['wiAccentTone']).toBe('icon');
    expect(element.style.color).toBe('var(--wi-color-accent-teal)');
    expect(element.style.backgroundColor).toBe('');
  });

  it('applies container and solid pairs', () => {
    fixture.componentInstance.tone.set('container');
    fixture.detectChanges();
    expect(mark().style.color).toBe('var(--wi-color-on-accent-teal-container)');
    expect(mark().style.backgroundColor).toBe('var(--wi-color-accent-teal-container)');

    fixture.componentInstance.tone.set('solid');
    fixture.detectChanges();
    expect(mark().style.color).toBe('var(--wi-color-on-accent-teal)');
    expect(mark().style.backgroundColor).toBe('var(--wi-color-accent-teal)');
  });

  it('clears the paint when the accent is null', () => {
    fixture.componentInstance.accent.set(null);
    fixture.detectChanges();

    expect(mark().dataset['wiAccent']).toBeUndefined();
    expect(mark().style.color).toBe('');
    expect(mark().style.backgroundColor).toBe('');
  });
});
