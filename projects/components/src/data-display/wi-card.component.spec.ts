import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  WiCardActionComponent,
  WiCardComponent,
  WiCardContentComponent,
  WiCardDescriptionComponent,
  WiCardFooterComponent,
  WiCardHeaderComponent,
  WiCardTitleComponent,
} from '../../data-display/src/card/wi-card.component';
import type { WiCardSize } from '../../data-display/src/card/wi-card.types';

@Component({
  imports: [
    WiCardActionComponent,
    WiCardComponent,
    WiCardContentComponent,
    WiCardDescriptionComponent,
    WiCardFooterComponent,
    WiCardHeaderComponent,
    WiCardTitleComponent,
  ],
  template: `
    <wi-card [size]="size()">
      <wi-card-header>
        <wi-card-title>Título</wi-card-title>
        <wi-card-description>Descripción</wi-card-description>
        <wi-card-action>Acción</wi-card-action>
      </wi-card-header>
      <wi-card-content>Contenido</wi-card-content>
      <wi-card-footer>Pie</wi-card-footer>
    </wi-card>
  `,
})
class WiCardHostComponent {
  readonly size = signal<WiCardSize>('md');
}

describe('WiCardComponent', () => {
  let fixture: ComponentFixture<WiCardHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WiCardHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WiCardHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  function card(): HTMLElement {
    return fixture.nativeElement.querySelector('wi-card');
  }

  it('renders host with default size and structural classes', () => {
    const el = card();
    expect(el).toBeTruthy();
    expect(el.getAttribute('data-size')).toBe('md');
    expect(el.getAttribute('data-slot')).toBe('card');
    expect(el.classList.contains('wi-card')).toBe(true);
    expect(el.className).toContain('bg-surface');
    expect(el.className).toContain('border-outline-variant');
    expect(el.className).toContain('rounded-control-lg');
  });

  it.each([
    ['sm', 'sm'],
    ['md', 'md'],
  ] as const satisfies readonly (readonly [WiCardSize, string])[])(
    'applies data-size=%s',
    (size, expected) => {
      fixture.componentInstance.size.set(size);
      fixture.detectChanges();

      expect(card().getAttribute('data-size')).toBe(expected);
    },
  );

  it('projects header, title, description, action, content and footer', () => {
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('wi-card-header')?.getAttribute('data-slot')).toBe('card-header');
    expect(root.querySelector('wi-card-title')?.textContent?.trim()).toBe('Título');
    expect(root.querySelector('wi-card-description')?.textContent?.trim()).toBe('Descripción');
    expect(root.querySelector('wi-card-action')?.textContent?.trim()).toBe('Acción');
    expect(root.querySelector('wi-card-content')?.textContent?.trim()).toBe('Contenido');
    expect(root.querySelector('wi-card-footer')?.textContent?.trim()).toBe('Pie');
  });

  it('applies BEM structural classes on parts', () => {
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('wi-card-header')?.classList.contains('wi-card__header')).toBe(true);
    expect(root.querySelector('wi-card-title')?.classList.contains('wi-card__title')).toBe(true);
    expect(
      root.querySelector('wi-card-description')?.classList.contains('wi-card__description'),
    ).toBe(true);
    expect(root.querySelector('wi-card-action')?.classList.contains('wi-card__action')).toBe(true);
    expect(root.querySelector('wi-card-content')?.classList.contains('wi-card__content')).toBe(
      true,
    );
    expect(root.querySelector('wi-card-footer')?.classList.contains('wi-card__footer')).toBe(true);
  });

  it('can be created without throwing (SSR-safe construction)', () => {
    const cardFixture = TestBed.createComponent(WiCardComponent);
    expect(() => cardFixture.detectChanges()).not.toThrow();
    expect(cardFixture.componentInstance).toBeTruthy();
    expect(cardFixture.nativeElement.classList.contains('wi-card')).toBe(true);
  });
});
