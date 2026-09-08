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

@Component({
  imports: [
    WiCardComponent,
    WiCardContentComponent,
    WiCardHeaderComponent,
    WiCardTitleComponent,
  ],
  template: `
    <wi-card class="p-0 gap-0">
      <wi-card-header class="flex items-center">
        <wi-card-title>Zona</wi-card-title>
      </wi-card-header>
      <wi-card-content class="p-0">Cuerpo</wi-card-content>
    </wi-card>
  `,
})
class WiCardClassOverrideHostComponent {}

@Component({
  imports: [WiCardComponent, WiCardContentComponent, WiCardHeaderComponent, WiCardTitleComponent],
  template: `
    <wi-card size="none" class="flex h-full min-h-0 flex-col overflow-hidden">
      <wi-card-header class="flex items-center bg-primary px-4 py-3">
        <wi-card-title>Zona</wi-card-title>
      </wi-card-header>
      <wi-card-content class="flex min-h-0 flex-1 flex-col p-0">Gráfico</wi-card-content>
    </wi-card>
  `,
})
class WiCardFlushPanelHostComponent {}

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
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('py-4')).toBe(true);
    expect(el.classList.contains('gap-2')).toBe(true);
    expect(el.classList.contains('overflow-hidden')).toBe(false);
    expect(el.className).toContain('bg-surface');
    expect(el.className).toContain('border-outline-variant');
    expect(el.className).toContain('rounded-control-lg');
  });

  it.each([
    ['sm', 'sm', 'py-3'],
    ['md', 'md', 'py-4'],
    ['none', 'none', 'py-0'],
  ] as const satisfies readonly (readonly [WiCardSize, string, string])[])(
    'applies data-size=%s and %s',
    (size, expected, pyClass) => {
      fixture.componentInstance.size.set(size);
      fixture.detectChanges();

      const el = card();
      expect(el.getAttribute('data-size')).toBe(expected);
      expect(el.classList.contains(pyClass)).toBe(true);
      if (size === 'none') {
        expect(el.classList.contains('gap-0')).toBe(true);
        expect(el.classList.contains('py-4')).toBe(false);
        expect(el.classList.contains('gap-2')).toBe(false);
        expect(
          (fixture.nativeElement as HTMLElement)
            .querySelector('wi-card-header')
            ?.classList.contains('px-4'),
        ).toBe(false);
        expect(
          (fixture.nativeElement as HTMLElement)
            .querySelector('wi-card-content')
            ?.classList.contains('px-4'),
        ).toBe(false);
      } else {
        expect(el.classList.contains('gap-2')).toBe(true);
      }
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

  it('merges consumer class so p-0 gap-0 win over py-4 gap-2', async () => {
    const overrideFixture = TestBed.createComponent(WiCardClassOverrideHostComponent);
    overrideFixture.detectChanges();
    await overrideFixture.whenStable();

    const el = overrideFixture.nativeElement.querySelector('wi-card') as HTMLElement;
    expect(el.classList.contains('p-0')).toBe(true);
    expect(el.classList.contains('gap-0')).toBe(true);
    expect(el.classList.contains('py-4')).toBe(false);
    expect(el.classList.contains('gap-2')).toBe(false);
    expect(el.classList.contains('wi-card')).toBe(true);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('rounded-control-lg')).toBe(true);

    const header = overrideFixture.nativeElement.querySelector('wi-card-header') as HTMLElement;
    expect(header.classList.contains('flex')).toBe(true);
    expect(header.classList.contains('items-center')).toBe(true);
    expect(header.classList.contains('grid')).toBe(false);
    expect(header.classList.contains('wi-card__header')).toBe(true);

    const content = overrideFixture.nativeElement.querySelector('wi-card-content') as HTMLElement;
    expect(content.classList.contains('p-0')).toBe(true);
    expect(content.classList.contains('px-4')).toBe(false);
  });

  it('flush panel: size=none + consumer layout without host py-4/gap-2', async () => {
    const panelFixture = TestBed.createComponent(WiCardFlushPanelHostComponent);
    panelFixture.detectChanges();
    await panelFixture.whenStable();

    const el = panelFixture.nativeElement.querySelector('wi-card') as HTMLElement;
    expect(el.getAttribute('data-size')).toBe('none');
    expect(el.classList.contains('py-0')).toBe(true);
    expect(el.classList.contains('gap-0')).toBe(true);
    expect(el.classList.contains('py-4')).toBe(false);
    expect(el.classList.contains('gap-2')).toBe(false);
    expect(el.classList.contains('overflow-hidden')).toBe(true);
    expect(el.classList.contains('h-full')).toBe(true);

    const header = panelFixture.nativeElement.querySelector('wi-card-header') as HTMLElement;
    expect(header.classList.contains('flex')).toBe(true);
    expect(header.classList.contains('bg-primary')).toBe(true);
    expect(header.classList.contains('px-4')).toBe(true);
    expect(header.classList.contains('py-3')).toBe(true);
    expect(header.classList.contains('grid')).toBe(false);

    const content = panelFixture.nativeElement.querySelector('wi-card-content') as HTMLElement;
    expect(content.classList.contains('flex-1')).toBe(true);
    expect(content.classList.contains('p-0')).toBe(true);
    expect(content.classList.contains('px-4')).toBe(false);
  });
});
