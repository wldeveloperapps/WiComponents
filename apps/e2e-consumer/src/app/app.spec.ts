import { TestBed } from '@angular/core/testing';
import { provideWiDataDisplayI18n } from '@wiloc/ui/data-display';
import { provideWiCalendarI18n } from '@wiloc/ui/forms';
import { provideWiIcons } from '@wiloc/ui/icon';
import { calendarOutline, homeOutline, xMarkOutline } from '@wiloc/ui/icon/heroicons';
import { provideWiOverlaysI18n } from '@wiloc/ui/overlays';

import { App } from './app';
import {
  createCalendarI18n,
  createDataDisplayI18n,
  createOverlaysI18n,
  setAppLocale,
} from './locale';

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

describe('App', () => {
  beforeEach(async () => {
    setAppLocale('es');
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideWiIcons({
          calendar: { outline: calendarOutline },
          home: { outline: homeOutline },
          'x-mark': { outline: xMarkOutline },
        }),
        provideWiCalendarI18n(createCalendarI18n()),
        provideWiDataDisplayI18n(createDataDisplayI18n()),
        provideWiOverlaysI18n(createOverlaysI18n()),
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

  it('should type an OTP code via reactive forms', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    const section = root.querySelector('section[aria-labelledby="otp-heading"]');
    expect(section?.querySelector('wi-otp')).toBeTruthy();

    const input = section?.querySelector('input[data-slot="input-otp"]') as HTMLInputElement | null;
    expect(input).toBeTruthy();
    expect(input?.getAttribute('autocomplete')).toBe('one-time-code');

    input!.value = '123456';
    input!.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(section?.textContent).toContain('Valor: 123456');
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

  it('should toggle switch via reactive forms', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    const toggle = root.querySelector(
      'wi-switch button[role="switch"]',
    ) as HTMLButtonElement | null;
    expect(toggle).toBeTruthy();
    expect(toggle?.getAttribute('aria-checked')).toBe('false');

    toggle?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(toggle?.getAttribute('aria-checked')).toBe('true');
    expect(root.textContent).toContain('Notificaciones');
    expect(root.textContent).toMatch(/Valor:\s*sí/);
  });

  it('should select a listbox option', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    const listboxSection = root.querySelector('section[aria-labelledby="listbox-heading"]');
    expect(listboxSection?.querySelector('wi-listbox [role="listbox"]')).toBeTruthy();

    const options = Array.from(
      listboxSection?.querySelectorAll('wi-listbox [role="option"]') ?? [],
    ) as HTMLElement[];
    expect(options.length).toBe(3);

    options[1]?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(options[1]?.getAttribute('aria-selected')).toBe('true');
    expect(root.textContent).toContain('Valor: Editor');
  });

  it('should transfer a picklist item to assigned', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    const section = root.querySelector('section[aria-labelledby="picklist-heading"]');
    expect(section?.querySelector('wi-picklist')).toBeTruthy();

    const sourceOptions = Array.from(
      section?.querySelectorAll('.wi-picklist__source [role="option"]') ?? [],
    ) as HTMLElement[];
    expect(sourceOptions.length).toBe(3);

    sourceOptions[0]?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const move = section?.querySelector(
      '.wi-picklist__move-to-target button',
    ) as HTMLButtonElement | null;
    expect(move).toBeTruthy();
    move?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(section?.querySelector('.wi-picklist__target [role="option"]')?.textContent).toContain(
      'Ana',
    );
    expect(root.textContent).toContain('Valor: ana');
  });

  it('should render the popover section', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('wi-popover')).toBeTruthy();
    expect(root.textContent).toContain('Abrir popover');
  });

  it('should emit breadcrumb itemClick for an ancestor', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    const section = root.querySelector('section[aria-labelledby="breadcrumb-heading"]');
    expect(section?.querySelector('wi-breadcrumb')).toBeTruthy();
    expect(section?.textContent).toContain('Gestión de usuarios');

    const admin = Array.from(section?.querySelectorAll('a') ?? []).find((link) =>
      link.textContent?.includes('Administración'),
    );
    expect(admin).toBeTruthy();
    admin?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(section?.textContent).toContain('Valor: admin');
  });

  it('should switch tabs and update the active panel', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('wi-tabs [role="tablist"]')).toBeTruthy();
    expect(root.textContent).toContain('Lista de alertas no gestionadas');
    expect(root.textContent).toContain('Valor: alerts-unmanaged');

    const tabs = Array.from(root.querySelectorAll('wi-tabs button[role="tab"]')) as HTMLElement[];
    expect(tabs.length).toBe(3);

    tabs[1]?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(tabs[1]?.getAttribute('aria-selected')).toBe('true');
    expect(root.textContent).toContain('Lista de alertas gestionadas');
    expect(root.textContent).toContain('Valor: alerts-managed');
  });

  it('should advance the stepper with Next', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    const section = root.querySelector('section[aria-labelledby="stepper-heading"]');
    expect(section?.querySelector('wi-stepper')).toBeTruthy();
    expect(section?.textContent).toContain('Datos');
    expect(section?.textContent).toContain('Contenido del paso Datos');
    expect(section?.textContent).toContain('Valor: details');

    const next = Array.from(section?.querySelectorAll('button') ?? []).find((button) =>
      button.textContent?.includes('Siguiente'),
    );
    expect(next).toBeTruthy();
    next?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(section?.textContent).toContain('Contenido del paso Aplicaciones');
    expect(section?.textContent).toContain('Valor: apps');
  });

  it('should render, paginate and filter the data table', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    const tableHost = root.querySelector('wi-table');
    expect(tableHost?.getAttribute('aria-label')).toBe('Sitios de ejemplo');
    expect(root.textContent).toContain('Inventario smoke');
    expect(root.textContent).toContain('8 resultados');
    expect(root.querySelectorAll('wi-table tbody tr').length).toBe(3);
    expect(root.textContent).toContain('Norte');
    expect(root.textContent).not.toContain('Oeste');

    const next = root.querySelector(
      'wi-table button[aria-label="Siguiente"]',
    ) as HTMLButtonElement | null;
    expect(next).toBeTruthy();
    next?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(root.textContent).toContain('Oeste');
    expect(root.textContent).not.toContain('Norte');

    const cityFilter = root.querySelector(
      'wi-table input[aria-label="Filtrar Ciudad"]',
    ) as HTMLInputElement | null;
    expect(cityFilter).toBeTruthy();
    cityFilter!.value = 'Madrid';
    cityFilter!.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(root.textContent).toContain('2 resultados');
    expect(root.querySelectorAll('wi-table tbody tr').length).toBe(2);
    expect(root.textContent).toContain('Norte');
    expect(root.textContent).toContain('Centro');
    expect(root.textContent).not.toContain('Sevilla');
  });
});
