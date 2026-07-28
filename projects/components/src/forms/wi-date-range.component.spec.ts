import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNativeDateAdapter } from '@spartan-ng/brain/date-time';

import { provideWiIcons } from '../../icon/src/public-api';
import { calendarOutline } from '../../icon/heroicons/src/calendar';
import { WiDateRangeComponent } from '../../forms/src/wi-date-range.component';
import { WiDatepickerComponent } from '../../forms/src/wi-datepicker.component';
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
    fixture.componentRef.setInput('startAriaLabel', 'Inicio');
    fixture.componentRef.setInput('endAriaLabel', 'Fin');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('renders two datepickers under wi-date-range host', () => {
    expect(fixture.nativeElement.classList.contains('wi-date-range')).toBe(true);
    const pickers = fixture.debugElement.queryAll(By.directive(WiDatepickerComponent));
    expect(pickers.length).toBe(2);
  });

  it('wires start/end models independently', () => {
    const start = new Date(2026, 0, 1);
    const end = new Date(2026, 0, 10);
    fixture.componentRef.setInput('start', start);
    fixture.componentRef.setInput('end', end);
    fixture.detectChanges();

    expect(fixture.componentInstance.start()?.getTime()).toBe(start.getTime());
    expect(fixture.componentInstance.end()?.getTime()).toBe(end.getTime());
  });

  it('passes max of end to start picker and min of start to end picker', () => {
    const start = new Date(2026, 5, 1);
    const end = new Date(2026, 5, 20);
    fixture.componentRef.setInput('start', start);
    fixture.componentRef.setInput('end', end);
    fixture.detectChanges();

    const pickers = fixture.debugElement.queryAll(By.directive(WiDatepickerComponent));
    const startPicker = pickers[0].componentInstance as WiDatepickerComponent;
    const endPicker = pickers[1].componentInstance as WiDatepickerComponent;

    expect(startPicker.max()?.getTime()).toBe(end.getTime());
    expect(endPicker.min()?.getTime()).toBe(start.getTime());
  });

  it('is SSR-safe on init', () => {
    const local = TestBed.createComponent(WiDateRangeComponent);
    expect(() => local.detectChanges()).not.toThrow();
  });
});
