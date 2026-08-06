import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideNativeDateAdapter } from '@spartan-ng/brain/date-time';

import { provideWiIcons } from '../../icon/src/public-api';
import { calendarOutline } from '../../icon/heroicons/src/calendar';
import { WiDatepickerComponent } from '../../forms/src/wi-datepicker.component';
import type { WiDatepickerSize } from '../../forms/src/wi-datepicker.types';
import { provideWiCalendarI18n } from '../../forms/src/wi-datepicker.i18n';

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
  imports: [WiDatepickerComponent, ReactiveFormsModule],
  template: `<wi-datepicker [formControl]="control" ariaLabel="Fecha" [clearable]="clearable" />`,
})
class ReactiveHostComponent {
  readonly control = new FormControl<Date | null>(null);
  clearable = false;
}

describe('WiDatepickerComponent', () => {
  let fixture: ComponentFixture<WiDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WiDatepickerComponent, ReactiveHostComponent],
      providers: [
        provideNativeDateAdapter(),
        provideWiIcons({ calendar: { outline: calendarOutline } }),
        provideWiCalendarI18n({ firstDayOfWeek: () => 1 }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WiDatepickerComponent);
    fixture.componentRef.setInput('ariaLabel', 'Fecha');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  function trigger(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.wi-datepicker__trigger');
  }

  it('renders host and default trigger classes', () => {
    expect(fixture.nativeElement.classList.contains('wi-datepicker')).toBe(true);
    const btn = trigger();
    expect(btn).toBeTruthy();
    expect(btn.className).toContain('border-outline');
    expect(btn.className).toContain('h-control-md');
    expect(btn.getAttribute('aria-label')).toBe('Fecha');
    expect(btn.disabled).toBe(false);
  });

  it('exposes a stable id for label association', () => {
    const btn = trigger();
    expect(btn.id).toMatch(/^wi-datepicker-\d+$/);
  });

  it('applies size classes', () => {
    const sizes: WiDatepickerSize[] = ['sm', 'md', 'lg'];
    const expected = ['h-control-sm', 'h-control-md', 'h-control-lg'];

    sizes.forEach((size, index) => {
      fixture.componentRef.setInput('size', size);
      fixture.detectChanges();
      expect(trigger().className).toContain(expected[index]);
    });
  });

  it('marks invalid and required on the trigger', () => {
    fixture.componentRef.setInput('invalid', true);
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    const btn = trigger();
    expect(btn.getAttribute('aria-invalid')).toBe('true');
    expect(btn.getAttribute('aria-required')).toBe('true');
  });

  it('disables the trigger when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(trigger().disabled).toBe(true);
  });

  it('shows placeholder when empty and formatted value when set', () => {
    fixture.componentRef.setInput('placeholder', 'Elegir…');
    fixture.detectChanges();
    expect(trigger().textContent).toContain('Elegir…');

    const date = new Date(2026, 6, 15);
    fixture.componentRef.setInput('value', date);
    fixture.componentRef.setInput('formatDate', (d: Date) => `D:${d.getDate()}`);
    fixture.detectChanges();
    expect(trigger().textContent).toContain('D:15');
  });

  it('commits value through the model and clears when clearable', async () => {
    fixture.componentRef.setInput('clearable', true);
    fixture.componentRef.setInput('value', new Date(2026, 0, 5));
    fixture.detectChanges();
    await fixture.whenStable();

    const clearBtn = fixture.nativeElement.querySelector(
      '.wi-datepicker__clear',
    ) as HTMLButtonElement;
    expect(clearBtn).toBeTruthy();
    clearBtn.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBeNull();
  });

  it('merges time into the selected date when showTime is enabled', () => {
    fixture.componentRef.setInput('showTime', true);
    fixture.componentRef.setInput('value', new Date(2026, 6, 20, 10, 0, 0, 0));
    fixture.componentRef.setInput('autoCloseOnSelect', false);
    fixture.detectChanges();

    trigger().click();
    fixture.detectChanges();

    const hourInput = document.querySelectorAll(
      '.wi-datepicker__time-input',
    )[0] as HTMLInputElement;
    const minuteInput = document.querySelectorAll(
      '.wi-datepicker__time-input',
    )[1] as HTMLInputElement;
    expect(hourInput).toBeTruthy();
    expect(minuteInput).toBeTruthy();

    hourInput.value = '14';
    minuteInput.value = '45';
    fixture.componentInstance['commitTimeFromInputs']();
    fixture.detectChanges();

    const value = fixture.componentInstance.value();
    expect(value).toBeTruthy();
    expect(value!.getFullYear()).toBe(2026);
    expect(value!.getMonth()).toBe(6);
    expect(value!.getDate()).toBe(20);
    expect(value!.getHours()).toBe(14);
    expect(value!.getMinutes()).toBe(45);
  });

  it('defaults time format labels from provideWiCalendarI18n', () => {
    fixture.componentRef.setInput('showTime', true);
    fixture.componentRef.setInput('value', new Date(2026, 6, 20, 10, 0, 0, 0));
    fixture.detectChanges();

    trigger().click();
    fixture.detectChanges();

    const hourInput = document.querySelectorAll(
      '.wi-datepicker__time-input',
    )[0] as HTMLInputElement;
    const minuteInput = document.querySelectorAll(
      '.wi-datepicker__time-input',
    )[1] as HTMLInputElement;
    expect(hourInput.placeholder).toBe('HH');
    expect(minuteInput.placeholder).toBe('MM');
    expect(hourInput.getAttribute('aria-label')).toBe('Hour');
    expect(minuteInput.getAttribute('aria-label')).toBe('Minute');
  });

  it('applies localized time format labels from provideWiCalendarI18n', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [WiDatepickerComponent],
      providers: [
        provideNativeDateAdapter(),
        provideWiIcons({ calendar: { outline: calendarOutline } }),
        provideWiCalendarI18n({
          firstDayOfWeek: () => 1,
          hourPlaceholder: () => 'hh',
          minutePlaceholder: () => 'mm',
          hourAriaLabel: () => 'Hora',
          minuteAriaLabel: () => 'Minuto',
        }),
      ],
    }).compileComponents();

    const localized = TestBed.createComponent(WiDatepickerComponent);
    localized.componentRef.setInput('ariaLabel', 'Fecha');
    localized.componentRef.setInput('showTime', true);
    localized.componentRef.setInput('value', new Date(2026, 6, 20, 10, 0, 0, 0));
    localized.detectChanges();
    await localized.whenStable();

    const localizedTrigger = localized.nativeElement.querySelector(
      '.wi-datepicker__trigger',
    ) as HTMLButtonElement;
    localizedTrigger.click();
    localized.detectChanges();

    const hourInput = document.querySelectorAll(
      '.wi-datepicker__time-input',
    )[0] as HTMLInputElement;
    const minuteInput = document.querySelectorAll(
      '.wi-datepicker__time-input',
    )[1] as HTMLInputElement;
    expect(hourInput.placeholder).toBe('hh');
    expect(minuteInput.placeholder).toBe('mm');
    expect(hourInput.getAttribute('aria-label')).toBe('Hora');
    expect(minuteInput.getAttribute('aria-label')).toBe('Minuto');
  });

  it('commits time on Enter and closes the popover', () => {
    fixture.componentRef.setInput('showTime', true);
    fixture.componentRef.setInput('value', new Date(2026, 6, 20, 10, 0, 0, 0));
    fixture.componentRef.setInput('autoCloseOnSelect', false);
    fixture.detectChanges();

    trigger().click();
    fixture.detectChanges();
    expect(trigger().getAttribute('aria-expanded')).toBe('true');

    const hourInput = document.querySelectorAll(
      '.wi-datepicker__time-input',
    )[0] as HTMLInputElement;
    const minuteInput = document.querySelectorAll(
      '.wi-datepicker__time-input',
    )[1] as HTMLInputElement;
    hourInput.value = '08';
    minuteInput.value = '15';

    const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    fixture.componentInstance['onTimeEnter'](enter);
    fixture.detectChanges();

    expect(fixture.componentInstance.value()!.getHours()).toBe(8);
    expect(fixture.componentInstance.value()!.getMinutes()).toBe(15);
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
  });

  it('preserves existing time when selecting a new day with showTime', () => {
    fixture.componentRef.setInput('showTime', true);
    fixture.componentRef.setInput('value', new Date(2026, 6, 20, 9, 30, 0, 0));
    fixture.detectChanges();

    fixture.componentInstance['onCalendarDateChange'](new Date(2026, 6, 25));
    fixture.detectChanges();

    const value = fixture.componentInstance.value();
    expect(value!.getDate()).toBe(25);
    expect(value!.getHours()).toBe(9);
    expect(value!.getMinutes()).toBe(30);
  });

  it('commits the selected calendar day into value', () => {
    fixture.componentInstance['onCalendarDateChange'](new Date(2026, 6, 8, 15, 45, 0));
    fixture.detectChanges();

    const value = fixture.componentInstance.value();
    expect(value).toBeTruthy();
    expect(value!.getFullYear()).toBe(2026);
    expect(value!.getMonth()).toBe(6);
    expect(value!.getDate()).toBe(8);
    expect(value!.getHours()).toBe(0);
    expect(value!.getMinutes()).toBe(0);
    expect(fixture.componentInstance['calendarDate']()?.getDate()).toBe(8);
  });

  it('keeps calendarDate in sync with value for panel reopen', () => {
    const selected = new Date(2026, 6, 8, 0, 0, 0, 0);
    fixture.componentRef.setInput('value', selected);
    fixture.detectChanges();

    const calendarDate = fixture.componentInstance['calendarDate']();
    expect(calendarDate).toBeTruthy();
    expect(calendarDate!.getFullYear()).toBe(2026);
    expect(calendarDate!.getMonth()).toBe(6);
    expect(calendarDate!.getDate()).toBe(8);

    const focused = fixture.componentInstance['focusedDate']();
    expect(focused.getDate()).toBe(8);
    expect(focused.getMonth()).toBe(6);
  });

  it('does not clear value when Brain toggles off and clearable is false', () => {
    fixture.componentRef.setInput('value', new Date(2026, 6, 8));
    fixture.componentRef.setInput('clearable', false);
    fixture.detectChanges();

    fixture.componentInstance['onCalendarDateChange'](undefined);
    fixture.detectChanges();

    expect(fixture.componentInstance.value()?.getDate()).toBe(8);
    expect(fixture.componentInstance['calendarDate']()?.getDate()).toBe(8);
  });

  it('clears value when Brain toggles off and clearable is true', () => {
    fixture.componentRef.setInput('value', new Date(2026, 6, 8));
    fixture.componentRef.setInput('clearable', true);
    fixture.detectChanges();

    fixture.componentInstance['onCalendarDateChange'](undefined);
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBeNull();
    expect(fixture.componentInstance['calendarDate']()).toBeUndefined();
  });

  it('applies selected-day Tailwind variants with data-[selected-single=true]', () => {
    expect(fixture.componentInstance['dayButtonClasses']).toContain(
      'data-[selected-single=true]:bg-primary',
    );
  });

  it('marks the selected day when the popover opens', async () => {
    fixture.componentRef.setInput('value', new Date(2026, 6, 9));
    fixture.componentRef.setInput('autoCloseOnSelect', false);
    fixture.detectChanges();
    await fixture.whenStable();

    trigger().click();
    fixture.detectChanges();
    await fixture.whenStable();
    // Overlay content may need a second turn for the sync effect.
    fixture.detectChanges();
    await fixture.whenStable();

    const selected = document.querySelector(
      '.wi-datepicker__day[data-selected-single="true"]',
    ) as HTMLButtonElement | null;
    expect(selected).toBeTruthy();
    expect(selected!.textContent?.trim()).toBe('9');
  });

  it('works with Reactive Forms ControlValueAccessor', async () => {
    const hostFixture = TestBed.createComponent(ReactiveHostComponent);
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    const date = new Date(2026, 2, 3);
    hostFixture.componentInstance.control.setValue(date);
    hostFixture.detectChanges();

    const dp = hostFixture.debugElement.query(By.directive(WiDatepickerComponent))
      .componentInstance as WiDatepickerComponent;
    expect(dp.value()?.getTime()).toBe(date.getTime());

    hostFixture.componentInstance.clearable = true;
    hostFixture.detectChanges();
    dp.value.set(null);
    dp['onChange'](null);
    hostFixture.detectChanges();
    expect(hostFixture.componentInstance.control.value).toBeNull();
  });

  it('is SSR-safe on init (detectChanges without browser APIs)', () => {
    const local = TestBed.createComponent(WiDatepickerComponent);
    expect(() => local.detectChanges()).not.toThrow();
  });
});
