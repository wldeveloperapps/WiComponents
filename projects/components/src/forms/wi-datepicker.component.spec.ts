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
    fixture.detectChanges();

    const event = {
      target: { value: '14:45' },
    } as unknown as Event;
    fixture.componentInstance['onTimeChange'](event);
    fixture.detectChanges();

    const value = fixture.componentInstance.value();
    expect(value).toBeTruthy();
    expect(value!.getFullYear()).toBe(2026);
    expect(value!.getMonth()).toBe(6);
    expect(value!.getDate()).toBe(20);
    expect(value!.getHours()).toBe(14);
    expect(value!.getMinutes()).toBe(45);
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
