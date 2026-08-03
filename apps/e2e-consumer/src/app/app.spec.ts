import { TestBed } from '@angular/core/testing';
import { provideWiCalendarI18n } from '@wiloc/ui/forms';
import { provideWiIcons } from '@wiloc/ui/icon';
import { calendarOutline, xMarkOutline } from '@wiloc/ui/icon/heroicons';

import { App } from './app';
import { createCalendarI18n, setAppLocale } from './locale';

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
});

describe('App', () => {
  beforeEach(async () => {
    setAppLocale('es');
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideWiIcons({
          calendar: { outline: calendarOutline },
          'x-mark': { outline: xMarkOutline },
        }),
        provideWiCalendarI18n(createCalendarI18n()),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the smoke title', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('e2e-consumer');
  });

  it('should switch UI language to English', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const langButton = (fixture.nativeElement as HTMLElement).querySelector(
      'button[aria-label="Cambiar a inglés"]',
    );
    expect(langButton).toBeTruthy();
    (langButton as HTMLButtonElement).click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Primary');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Packaged library smoke test',
    );
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'I accept the terms and conditions',
    );
  });

  it('should toggle checkbox via reactive forms', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    const checkbox = root.querySelector(
      'wi-checkbox button[role="checkbox"]',
    ) as HTMLButtonElement | null;
    expect(checkbox).toBeTruthy();
    expect(checkbox?.getAttribute('aria-checked')).toBe('false');
    expect(root.textContent).toContain('Valor: no');

    checkbox?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(checkbox?.getAttribute('aria-checked')).toBe('true');
    expect(root.textContent).toContain('Valor: sí');
  });
});
