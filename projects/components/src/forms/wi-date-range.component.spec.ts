import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNativeDateAdapter } from '@spartan-ng/brain/date-time';

import { provideWiIcons } from '../../icon/src/public-api';
import { calendarOutline } from '../../icon/heroicons/src/calendar';
import { WiDateRangeComponent } from '../../forms/src/datepicker/wi-date-range.component';
import { WiDatepickerComponent } from '../../forms/src/datepicker/wi-datepicker.component';
import { provideWiCalendarI18n } from '../../forms/src/datepicker/wi-datepicker.i18n';

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

describe('WiDateRangeComponent', () => {
  let fixture: ComponentFixture<WiDateRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WiDateRangeComponent],
      providers: [
        provideNativeDateAdapter(),
        provideWiIcons({ calendar: { outline: calendarOutline } }),
        provideWiCalendarI18n({ firstDayOfWeek: () => 1 }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WiDateRangeComponent);
    fixture.componentRef.setInput('ariaLabel', 'Rango de fechas');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  function trigger(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.wi-date-range__trigger');
  }

  it('renders a single trigger under wi-date-range host (no nested datepickers)', () => {
    expect(fixture.nativeElement.classList.contains('wi-date-range')).toBe(true);
    expect(trigger()).toBeTruthy();
    expect(fixture.debugElement.queryAll(By.directive(WiDatepickerComponent)).length).toBe(0);
  });

  it('wires start/end models independently and shows displayFormat text', () => {
    const start = new Date(2026, 8, 9);
    const end = new Date(2026, 8, 16);
    fixture.componentRef.setInput('start', start);
    fixture.componentRef.setInput('end', end);
    fixture.componentRef.setInput('displayFormat', 'DD/MM/YYYY');
    fixture.detectChanges();

    expect(fixture.componentInstance.start()?.getTime()).toBe(start.getTime());
    expect(fixture.componentInstance.end()?.getTime()).toBe(end.getTime());
    expect(trigger().textContent).toContain('09/09/2026 - 16/09/2026');
  });

  it('shows placeholder when empty', () => {
    fixture.componentRef.setInput('placeholder', 'Selecciona un rango…');
    fixture.detectChanges();
    expect(trigger().textContent).toContain('Selecciona un rango…');
  });

  it('prefers formatDate over displayFormat', () => {
    fixture.componentRef.setInput('start', new Date(2026, 8, 9));
    fixture.componentRef.setInput('end', new Date(2026, 8, 16));
    fixture.componentRef.setInput('displayFormat', 'YYYY/MM/DD');
    fixture.componentRef.setInput('formatDate', (d: Date) => `D:${d.getDate()}`);
    fixture.detectChanges();
    expect(trigger().textContent).toContain('D:9 - D:16');
  });

  it('disables the trigger and marks invalid', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.componentRef.setInput('invalid', true);
    fixture.detectChanges();
    expect(trigger().disabled).toBe(true);
    expect(trigger().getAttribute('aria-invalid')).toBe('true');
  });

  it('clears both ends when clearable', () => {
    fixture.componentRef.setInput('clearable', true);
    fixture.componentRef.setInput('start', new Date(2026, 8, 9));
    fixture.componentRef.setInput('end', new Date(2026, 8, 16));
    fixture.detectChanges();

    const clearBtn = fixture.nativeElement.querySelector(
      '.wi-date-range__clear',
    ) as HTMLButtonElement;
    expect(clearBtn).toBeTruthy();
    clearBtn.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.start()).toBeNull();
    expect(fixture.componentInstance.end()).toBeNull();
  });

  it('keeps the panel open when rewriting a complete range', async () => {
    fixture.componentRef.setInput('start', new Date(2026, 8, 9));
    fixture.componentRef.setInput('end', new Date(2026, 8, 16));
    fixture.detectChanges();
    await fixture.whenStable();

    trigger().click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(trigger().getAttribute('aria-expanded')).toBe('true');

    const inMonthDays = () =>
      Array.from(
        document.querySelectorAll('.wi-date-range__day:not([data-outside="true"])'),
      ) as HTMLButtonElement[];

    const day5 = inMonthDays().find((d) => d.textContent?.trim() === '5' && !d.disabled);
    expect(day5).toBeTruthy();
    day5!.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(fixture.componentInstance.start()?.getDate()).toBe(5);
    expect(fixture.componentInstance.end()).toBeNull();

    const day12 = inMonthDays().find((d) => d.textContent?.trim() === '12' && !d.disabled);
    expect(day12).toBeTruthy();
    day12!.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.start()?.getDate()).toBe(5);
    expect(fixture.componentInstance.end()?.getDate()).toBe(12);
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
  });

  it('selects a range via calendar cells and paints middle days', async () => {
    fixture.componentRef.setInput('autoCloseOnSelect', false);
    fixture.detectChanges();

    trigger().click();
    fixture.detectChanges();
    await fixture.whenStable();

    const days = Array.from(
      document.querySelectorAll('.wi-date-range__day:not([data-outside="true"])'),
    ) as HTMLButtonElement[];
    const day9 = days.find((d) => d.textContent?.trim() === '9' && !d.disabled);
    const day16 = days.find((d) => d.textContent?.trim() === '16' && !d.disabled);
    expect(day9).toBeTruthy();
    expect(day16).toBeTruthy();

    day9!.click();
    fixture.detectChanges();
    await fixture.whenStable();
    day16!.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.start()?.getDate()).toBe(9);
    expect(fixture.componentInstance.end()?.getDate()).toBe(16);

    const middle = document.querySelector('.wi-date-range__day[data-range-middle="true"]');
    expect(middle).toBeTruthy();
  });

  it('shows two time groups when showTime is enabled', async () => {
    fixture.componentRef.setInput('showTime', true);
    fixture.componentRef.setInput('start', new Date(2026, 8, 9, 10, 0));
    fixture.componentRef.setInput('end', new Date(2026, 8, 16, 18, 30));
    fixture.componentRef.setInput('autoCloseOnSelect', false);
    fixture.detectChanges();

    trigger().click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.querySelector('.wi-date-range__time-start')).toBeTruthy();
    expect(document.querySelector('.wi-date-range__time-end')).toBeTruthy();
    const inputs = document.querySelectorAll('.wi-date-range__time-input');
    expect(inputs.length).toBe(4);
  });

  it('merges start time from inputs', async () => {
    fixture.componentRef.setInput('showTime', true);
    fixture.componentRef.setInput('start', new Date(2026, 8, 9, 10, 0));
    fixture.componentRef.setInput('end', new Date(2026, 8, 16, 18, 0));
    fixture.componentRef.setInput('autoCloseOnSelect', false);
    fixture.detectChanges();

    trigger().click();
    fixture.detectChanges();
    await fixture.whenStable();

    const hour = document.querySelector('[id$="-start-hour"]') as HTMLInputElement;
    const minute = document.querySelector('[id$="-start-minute"]') as HTMLInputElement;
    expect(hour).toBeTruthy();
    expect(minute).toBeTruthy();

    hour.focus();
    hour.value = '11';
    minute.value = '45';
    hour.dispatchEvent(new Event('input'));
    minute.dispatchEvent(new Event('input'));
    hour.blur();
    minute.blur();
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));
    fixture.detectChanges();

    expect(fixture.componentInstance.start()?.getHours()).toBe(11);
    expect(fixture.componentInstance.start()?.getMinutes()).toBe(45);
  });

  it('is SSR-safe on init', () => {
    const local = TestBed.createComponent(WiDateRangeComponent);
    expect(() => local.detectChanges()).not.toThrow();
  });
});
