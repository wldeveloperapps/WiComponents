import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideWiIcons } from '../../icon/src/public-api';
import { homeOutline } from '../../icon/heroicons/src/home';
import { WiBreadcrumbComponent } from '../../navigation/src/breadcrumb/wi-breadcrumb.component';
import type { WiBreadcrumbItem } from '../../navigation/src/breadcrumb/wi-breadcrumb.types';

const ITEMS: readonly WiBreadcrumbItem[] = [
  { id: 'home', label: 'Inicio', href: '/', icon: 'home', iconOnly: true },
  { id: 'admin', label: 'Administración', href: '/administration' },
  { id: 'users', label: 'Gestión de usuarios' },
];

@Component({
  imports: [WiBreadcrumbComponent],
  template: `
    <wi-breadcrumb [items]="items()" [aria-label]="ariaLabel()" (itemClick)="onItemClick($event)" />
  `,
})
class WiBreadcrumbHostComponent {
  readonly items = signal<readonly WiBreadcrumbItem[]>(ITEMS);
  readonly ariaLabel = signal('Migas');
  readonly clicks = signal<WiBreadcrumbItem[]>([]);

  onItemClick(item: WiBreadcrumbItem): void {
    this.clicks.update((current) => [...current, item]);
  }
}

describe('WiBreadcrumbComponent', () => {
  let fixture: ComponentFixture<WiBreadcrumbHostComponent>;
  let host: WiBreadcrumbHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WiBreadcrumbHostComponent],
      providers: [
        provideWiIcons({
          home: { outline: homeOutline },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WiBreadcrumbHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  function root(): HTMLElement {
    return fixture.nativeElement.querySelector('wi-breadcrumb');
  }

  function nav(): HTMLElement {
    return fixture.nativeElement.querySelector('nav');
  }

  function links(): HTMLAnchorElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('a.wi-breadcrumb__link'));
  }

  function current(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.wi-breadcrumb__current');
  }

  function separators(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.wi-breadcrumb__separator'));
  }

  it('renders host, nav and structural classes', () => {
    const el = root();
    expect(el).toBeTruthy();
    expect(el.classList.contains('wi-breadcrumb')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('breadcrumb');
    expect(nav().getAttribute('aria-label')).toBe('Migas');
    const list = el.querySelector('ol.wi-breadcrumb__list');
    expect(list).toBeTruthy();
    expect(list?.className).toContain('border-outline');
    expect(list?.className).toContain('rounded-full');
    expect(list?.className).toContain('bg-surface-container');
  });

  it('renders ancestors as links and the last item as the current page', () => {
    const hrefs = links().map((link) => link.getAttribute('href'));
    expect(hrefs).toEqual(['/', '/administration']);
    expect(links()[0]?.getAttribute('aria-label')).toBe('Inicio');
    expect(links()[1]?.textContent?.trim()).toBe('Administración');

    const page = current();
    expect(page).toBeTruthy();
    expect(page?.getAttribute('aria-current')).toBe('page');
    expect(page?.textContent?.trim()).toBe('Gestión de usuarios');
    expect(page?.className).toContain('bg-primary');
    expect(page?.className).toContain('rounded-full');
    expect(page?.querySelector('a')).toBeNull();
  });

  it('renders decorative separators between items', () => {
    expect(separators()).toHaveLength(2);
    for (const separator of separators()) {
      expect(separator.getAttribute('aria-hidden')).toBe('true');
    }
  });

  it('emits itemClick and prevents default on unmodified ancestor clicks', () => {
    const admin = links()[1];
    expect(admin).toBeTruthy();
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    admin?.dispatchEvent(event);
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(true);
    expect(host.clicks()).toEqual([ITEMS[1]]);
    expect(current()?.getAttribute('aria-current')).toBe('page');
  });

  it('does not prevent default on modifier-click so the browser can open the href', () => {
    const admin = links()[1];
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      button: 0,
      ctrlKey: true,
    });
    admin?.dispatchEvent(event);
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(false);
    expect(host.clicks()).toEqual([]);
  });

  it('does not emit itemClick for the current page', () => {
    current()?.click();
    fixture.detectChanges();
    expect(host.clicks()).toEqual([]);
  });

  it('lets external hrefs navigate natively and still emits itemClick', () => {
    host.items.set([
      { id: 'docs', label: 'Docs', href: 'https://example.com/docs' },
      { id: 'here', label: 'Aquí' },
    ]);
    fixture.detectChanges();

    const link = links()[0];
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    link?.dispatchEvent(event);
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(false);
    expect(host.clicks()[0]?.id).toBe('docs');
  });

  it('renders a static ancestor when href is omitted', () => {
    host.items.set([
      { id: 'home', label: 'Inicio', icon: 'home', iconOnly: true },
      { id: 'users', label: 'Gestión de usuarios' },
    ]);
    fixture.detectChanges();

    expect(links()).toHaveLength(0);
    const text = fixture.nativeElement.querySelector('.wi-breadcrumb__text') as HTMLElement;
    expect(text.getAttribute('aria-label')).toBe('Inicio');
    expect(current()?.textContent?.trim()).toBe('Gestión de usuarios');
  });

  it('updates aria-label when the input changes', () => {
    host.ariaLabel.set('Breadcrumb');
    fixture.detectChanges();
    expect(nav().getAttribute('aria-label')).toBe('Breadcrumb');
  });
});
