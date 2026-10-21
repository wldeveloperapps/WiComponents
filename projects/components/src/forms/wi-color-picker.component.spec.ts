import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { WiColorPickerComponent } from '../../forms/src/color-picker/wi-color-picker.component';
import type { WiColorPickerSize } from '../../forms/src/color-picker/wi-color.types';
import {
  hexToHsv,
  hsvToHex,
  isWiColor,
  normalizeWiColor,
  stepSv,
  svFromPointer,
} from '../../forms/src/color-picker/wi-color';

class ResizeObserverStub {
  observe(): void {
    /* no-op for jsdom */
  }
  unobserve(): void {
    /* no-op for jsdom */
  }
  disconnect(): void {
    /* no-op for jsdom */
  }
}

beforeAll(() => {
  Object.defineProperty(globalThis, 'ResizeObserver', {
    writable: true,
    configurable: true,
    value: ResizeObserverStub,
  });

  Object.defineProperty(Element.prototype, 'scrollIntoView', {
    writable: true,
    configurable: true,
    value: () => undefined,
  });
});

@Component({
  imports: [WiColorPickerComponent, ReactiveFormsModule],
  template: `<wi-color-picker [formControl]="control" ariaLabel="Color" />`,
})
class ReactiveHostComponent {
  readonly control = new FormControl<string | null>(null, {
    validators: [Validators.required],
  });
}

describe('normalizeWiColor', () => {
  it('normalizes short, long and unhashed hex', () => {
    expect(normalizeWiColor('#abc')).toBe('#aabbcc');
    expect(normalizeWiColor('  #AABBCC ')).toBe('#aabbcc');
    expect(normalizeWiColor('00ff00')).toBe('#00ff00');
  });

  it('rejects alpha, names and empty values', () => {
    expect(normalizeWiColor('#aabbccdd')).toBeNull();
    expect(normalizeWiColor('red')).toBeNull();
    expect(normalizeWiColor('')).toBeNull();
    expect(normalizeWiColor(null)).toBeNull();
    expect(isWiColor('#abc')).toBe(true);
    expect(isWiColor('#aabbccdd')).toBe(false);
  });

  it('round-trips primary colors and keeps the hue of gray', () => {
    expect(hsvToHex(hexToHsv('#ff0000'))).toBe('#ff0000');
    expect(hsvToHex(hexToHsv('#00ff00'))).toBe('#00ff00');
    expect(hsvToHex(hexToHsv('#0000ff'))).toBe('#0000ff');
    expect(hexToHsv('#ffffff', 200).h).toBe(200);
    expect(hexToHsv('#ffffff', 200).s).toBe(0);
    expect(hexToHsv('#000000').v).toBe(0);
  });

  it('maps pointer and keyboard movement inside the plane', () => {
    expect(svFromPointer(0, 0, 100, 100)).toEqual({ s: 0, v: 100 });
    expect(svFromPointer(100, 100, 100, 100)).toEqual({ s: 100, v: 0 });
    expect(svFromPointer(-10, 200, 100, 100)).toEqual({ s: 0, v: 0 });
    expect(svFromPointer(10, 10, 0, 0)).toEqual({ s: 0, v: 0 });

    const start = { h: 10, s: 50, v: 50 };
    expect(stepSv(start, 'ArrowRight', true)).toEqual({ h: 10, s: 60, v: 50 });
    expect(stepSv(start, 'ArrowUp', false)).toEqual({ h: 10, s: 50, v: 51 });
    expect(stepSv(start, 'Home', false)).toEqual({ h: 10, s: 0, v: 50 });
    expect(stepSv(start, 'PageUp', false)).toEqual({ h: 10, s: 50, v: 100 });
    expect(stepSv(start, 'Enter', false)).toBeNull();
  });
});

describe('WiColorPickerComponent', () => {
  let fixture: ComponentFixture<WiColorPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WiColorPickerComponent, ReactiveHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WiColorPickerComponent);
    fixture.componentRef.setInput('ariaLabel', 'Color');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  function trigger(): HTMLButtonElement {
    const button = fixture.nativeElement.querySelector('.wi-color-picker__trigger');
    if (!(button instanceof HTMLButtonElement)) {
      throw new Error('Missing trigger');
    }
    return button;
  }

  async function open(): Promise<void> {
    trigger().click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function palette(): HTMLElement {
    const element = document.querySelector('.wi-color-picker__palette');
    if (!(element instanceof HTMLElement)) {
      throw new Error('Missing palette');
    }
    return element;
  }

  function hue(): HTMLInputElement {
    const element = document.querySelector('.wi-color-picker__hue');
    if (!(element instanceof HTMLInputElement)) {
      throw new Error('Missing hue');
    }
    return element;
  }

  function hex(): HTMLInputElement {
    const element = document.querySelector('.wi-color-picker__hex');
    if (!(element instanceof HTMLInputElement)) {
      throw new Error('Missing hex');
    }
    return element;
  }

  it('renders an empty accessible trigger', () => {
    const host: HTMLElement = fixture.nativeElement;
    const button = trigger();

    expect(host.classList.contains('wi-color-picker')).toBe(true);
    expect(button.className).toContain('h-control-md');
    expect(button.className).toContain('border-outline-variant');
    expect(button.getAttribute('aria-label')).toBe('Color');
    expect(button.getAttribute('aria-haspopup')).toBe('dialog');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.getAttribute('aria-invalid')).toBeNull();
    expect(button.disabled).toBe(false);
    expect(fixture.componentInstance.value()).toBeNull();
    expect(button.querySelector('.wi-color-picker__swatch')?.className).toContain(
      'wi-color-picker__swatch--empty',
    );
    expect(button.querySelector('.wi-color-picker__swatch')?.className).toContain('size-5');
  });

  it.each([
    ['sm', 'h-control-sm', 'size-4'],
    ['md', 'h-control-md', 'size-5'],
    ['lg', 'h-control-lg', 'size-6'],
  ] as const satisfies readonly (readonly [WiColorPickerSize, string, string])[])(
    'applies %s trigger and swatch size',
    (size, triggerClass, swatchClass) => {
      fixture.componentRef.setInput('size', size);
      fixture.detectChanges();
      expect(trigger().className).toContain(triggerClass);
      expect(trigger().querySelector('.wi-color-picker__swatch')?.className).toContain(swatchClass);
    },
  );

  it('shows a normalized color and a stable id', () => {
    expect(trigger().id).toMatch(/^wi-color-picker-\d+$/);

    fixture.componentRef.setInput('id', 'mark-color');
    fixture.componentRef.setInput('value', '#ABC');
    fixture.detectChanges();

    expect(trigger().id).toBe('mark-color');
    expect(fixture.componentInstance.value()).toBe('#aabbcc');
    expect(trigger().textContent).toContain('#aabbcc');
    expect(trigger().querySelector('.wi-color-picker__swatch')?.getAttribute('style')).toContain(
      'rgb(170, 187, 204)',
    );
  });

  it('uses an external label and exposes invalid and required', () => {
    fixture.componentRef.setInput('ariaLabel', null);
    fixture.componentRef.setInput('ariaLabelledBy', 'mark-color-label');
    fixture.componentRef.setInput('ariaDescribedBy', 'mark-color-error');
    fixture.componentRef.setInput('invalid', true);
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    expect(trigger().getAttribute('aria-label')).toBeNull();
    expect(trigger().getAttribute('aria-labelledby')).toBe('mark-color-label');
    expect(trigger().getAttribute('aria-describedby')).toBe('mark-color-error');
    expect(trigger().getAttribute('aria-invalid')).toBe('true');
    expect(trigger().getAttribute('aria-required')).toBe('true');
    expect(trigger().className).toContain('aria-invalid:border-error');
  });

  it('does not open a choice when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.componentRef.setInput('value', '#ff0000');
    fixture.detectChanges();

    expect(trigger().disabled).toBe(true);
    trigger().click();
    fixture.detectChanges();
    expect(document.querySelector('.wi-color-picker__palette')).toBeNull();
    expect(fixture.componentInstance.value()).toBe('#ff0000');
  });

  it('picks a hue and a hex from the panel', async () => {
    fixture.componentRef.setInput('value', '#ff0000');
    fixture.componentRef.setInput('labels', {
      dialog: 'Elegir color',
      palette: 'Saturación y brillo',
      hue: 'Tono',
      hex: 'Hexadecimal',
      empty: 'Sin color',
    });
    fixture.detectChanges();
    await open();

    expect(palette().getAttribute('aria-label')).toBe('Saturación y brillo');
    expect(hue().getAttribute('aria-label')).toBe('Tono');
    expect(document.getElementById(`${trigger().id}-title`)?.textContent?.trim()).toBe(
      'Elegir color',
    );

    hue().value = '120';
    hue().dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('#00ff00');

    hex().value = '#0000ff';
    hex().dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('#0000ff');
    expect(hex().value).toBe('#0000ff');
  });

  it('moves saturation with the keyboard and clears an empty hex on blur', async () => {
    fixture.componentRef.setInput('value', '#ff0000');
    fixture.detectChanges();
    await open();

    palette().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).not.toBe('#ff0000');
    expect(fixture.componentInstance.value()).toMatch(/^#[0-9a-f]{6}$/);

    hex().value = '';
    hex().dispatchEvent(new Event('input', { bubbles: true }));
    hex().dispatchEvent(new Event('blur', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBeNull();
  });

  it('keeps a short hex until blur and reverts an invalid one', async () => {
    fixture.componentRef.setInput('value', '#ff0000');
    fixture.detectChanges();
    await open();

    hex().value = '#abc';
    hex().dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('#ff0000');

    hex().dispatchEvent(new Event('blur', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('#aabbcc');

    hex().value = 'nope';
    hex().dispatchEvent(new Event('input', { bubbles: true }));
    hex().dispatchEvent(new Event('blur', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('#aabbcc');
    expect(hex().value).toBe('#aabbcc');
  });

  it('emits touch when the panel closes and labels the dialog', async () => {
    const touches: number[] = [];
    fixture.componentInstance.touch.subscribe(() => touches.push(1));
    await open();
    await new Promise<void>((resolve) => queueMicrotask(resolve));

    const titleId = `${trigger().id}-title`;
    expect(
      document
        .getElementById(trigger().getAttribute('aria-controls') ?? '')
        ?.getAttribute('aria-labelledby'),
    ).toBe(titleId);

    fixture.componentInstance['onClosed']();
    expect(touches).toEqual([1]);
  });

  it('canonicalizes reactive form values', async () => {
    const hostFixture = TestBed.createComponent(ReactiveHostComponent);
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    hostFixture.componentInstance.control.setValue('#ABC');
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    const picker = hostFixture.debugElement.query(By.directive(WiColorPickerComponent))
      .componentInstance as WiColorPickerComponent;
    expect(picker.value()).toBe('#aabbcc');
    expect(hostFixture.componentInstance.control.value).toBe('#aabbcc');

    hostFixture.componentInstance.control.disable();
    hostFixture.detectChanges();
    const button = hostFixture.nativeElement.querySelector('.wi-color-picker__trigger');
    expect(button instanceof HTMLButtonElement && button.disabled).toBe(true);
  });

  it('does not show the eyedropper when the browser has no EyeDropper', async () => {
    fixture.componentRef.setInput('value', '#ff0000');
    fixture.detectChanges();
    await open();
    expect(document.querySelector('.wi-color-picker__eyedropper')).toBeNull();
  });

  it('rejects a non-color written by a form and stays SSR-safe', () => {
    fixture.componentInstance.writeValue('red');
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBeNull();

    const local = TestBed.createComponent(WiColorPickerComponent);
    expect(() => local.detectChanges()).not.toThrow();
  });
});

describe('WiColorPickerComponent eyedropper', () => {
  interface EyeDropperHost {
    EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> };
  }

  const host = globalThis as EyeDropperHost;

  afterEach(() => {
    delete host.EyeDropper;
  });

  async function create(
    open: () => Promise<{ sRGBHex: string }>,
  ): Promise<ComponentFixture<WiColorPickerComponent>> {
    host.EyeDropper = class {
      open(): Promise<{ sRGBHex: string }> {
        return open();
      }
    };
    const local = TestBed.createComponent(WiColorPickerComponent);
    local.componentRef.setInput('ariaLabel', 'Color');
    local.componentRef.setInput('labels', { eyedropper: 'Cuentagotas' });
    local.detectChanges();
    await local.whenStable();
    local.detectChanges();
    return local;
  }

  async function openPanel(local: ComponentFixture<WiColorPickerComponent>): Promise<void> {
    const button = local.nativeElement.querySelector('.wi-color-picker__trigger');
    if (!(button instanceof HTMLButtonElement)) {
      throw new Error('Missing trigger');
    }
    button.click();
    local.detectChanges();
    await local.whenStable();
    local.detectChanges();
  }

  function dropper(): HTMLButtonElement {
    const button = document.querySelector('.wi-color-picker__eyedropper');
    if (!(button instanceof HTMLButtonElement)) {
      throw new Error('Missing eyedropper');
    }
    return button;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WiColorPickerComponent],
    }).compileComponents();
  });

  it('stores the sampled hex', async () => {
    const local = await create(() => Promise.resolve({ sRGBHex: '#00FF00' }));
    local.componentRef.setInput('value', '#ff0000');
    local.detectChanges();
    await openPanel(local);

    expect(dropper().getAttribute('aria-label')).toBe('Cuentagotas');
    dropper().click();
    await local.whenStable();
    local.detectChanges();

    expect(local.componentInstance.value()).toBe('#00ff00');
  });

  it('keeps the current color when the sample is cancelled', async () => {
    const local = await create(() =>
      Promise.reject(new DOMException('The user aborted a request.', 'AbortError')),
    );
    local.componentRef.setInput('value', '#ff0000');
    local.detectChanges();
    await openPanel(local);

    dropper().click();
    await local.whenStable();
    local.detectChanges();

    expect(local.componentInstance.value()).toBe('#ff0000');
    expect(dropper().disabled).toBe(false);
  });

  it('does not sample while disabled', async () => {
    let opened = 0;
    const local = await create(() => {
      opened += 1;
      return Promise.resolve({ sRGBHex: '#00ff00' });
    });
    await openPanel(local);
    local.componentRef.setInput('disabled', true);
    local.detectChanges();

    expect(dropper().disabled).toBe(true);
    dropper().click();
    await local.whenStable();
    expect(opened).toBe(0);
  });
});
