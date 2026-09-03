import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WiButtonDirective } from '../../button/src/wi-button.directive';
import type { WiButtonSize, WiButtonVariant } from '../../button/src/wi-button.types';

@Component({
  selector: 'wi-button-host',
  imports: [WiButtonDirective],
  template: `
    <button
      wiButton
      class="extra-class"
      [variant]="variant()"
      [size]="size()"
      [type]="type()"
      [loading]="loading()"
      [disabled]="disabled()"
      [iconOnly]="iconOnly()"
      [ariaLabel]="ariaLabel()"
    >
      Guardar
    </button>
  `,
})
class ButtonHostComponent {
  readonly variant = signal<WiButtonVariant>('primary');
  readonly size = signal<WiButtonSize>('md');
  readonly type = signal<'button' | 'submit' | 'reset'>('button');
  readonly loading = signal(false);
  readonly disabled = signal(false);
  readonly iconOnly = signal(false);
  readonly ariaLabel = signal<string | null>(null);
}

@Component({
  selector: 'wi-button-link-host',
  imports: [WiButtonDirective],
  template: `
    <a
      wiButton
      href="/settings"
      [variant]="variant()"
      [disabled]="disabled()"
      [loading]="loading()"
    >
      Ajustes
    </a>
  `,
})
class LinkHostComponent {
  readonly variant = signal<WiButtonVariant>('outline');
  readonly disabled = signal(false);
  readonly loading = signal(false);
}

describe('WiButtonDirective', () => {
  describe('on button', () => {
    let fixture: ComponentFixture<ButtonHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ButtonHostComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(ButtonHostComponent);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    function button(): HTMLButtonElement {
      return fixture.nativeElement.querySelector('button');
    }

    it('renders a native button with default type and classes', () => {
      const el = button();
      expect(el).toBeTruthy();
      expect(el.getAttribute('type')).toBe('button');
      expect(el.classList.contains('wi-button')).toBe(true);
      expect(el.classList.contains('inline-flex')).toBe(true);
      expect(el.classList.contains('extra-class')).toBe(true);
      expect(el.getAttribute('data-variant')).toBe('primary');
      expect(el.getAttribute('data-size')).toBe('md');
      expect(el.className).toContain('bg-primary');
      expect(el.className).toContain('text-on-primary');
      expect(el.className).toContain('h-control-md');
      expect(el.disabled).toBe(false);
      expect(el.getAttribute('aria-busy')).toBeNull();
      expect(el.getAttribute('aria-disabled')).toBeNull();
      expect(el.getAttribute('aria-label')).toBeNull();
      expect(el.getAttribute('data-loading')).toBeNull();
    });

    it.each([
      ['primary', 'bg-primary', 'text-on-primary'],
      ['secondary', 'bg-surface-container', 'text-on-surface-variant'],
      ['danger', 'bg-error', 'text-on-error'],
      ['ghost', 'bg-transparent', 'text-on-surface'],
      ['outline', 'border-outline-variant', 'text-on-surface'],
    ] as const satisfies readonly (readonly [WiButtonVariant, string, string])[])(
      'applies %s variant classes',
      (variant, tokenA, tokenB) => {
        fixture.componentInstance.variant.set(variant);
        fixture.detectChanges();

        expect(button().getAttribute('data-variant')).toBe(variant);
        expect(button().className).toContain(tokenA);
        expect(button().className).toContain(tokenB);
      },
    );

    it.each([
      ['sm', 'h-control-sm'],
      ['md', 'h-control-md'],
      ['lg', 'h-control-lg'],
    ] as const satisfies readonly (readonly [WiButtonSize, string])[])(
      'applies %s size classes',
      (size, heightClass) => {
        fixture.componentInstance.size.set(size);
        fixture.detectChanges();

        expect(button().getAttribute('data-size')).toBe(size);
        expect(button().className).toContain(heightClass);
      },
    );

    it('disables when disabled is true', () => {
      fixture.componentInstance.disabled.set(true);
      fixture.detectChanges();

      expect(button().disabled).toBe(true);
      expect(button().getAttribute('aria-disabled')).toBe('true');
      expect(button().getAttribute('data-disabled')).toBe('true');
    });

    it('disables and shows busy state when loading', () => {
      fixture.componentInstance.loading.set(true);
      fixture.detectChanges();

      const el = button();
      expect(el.disabled).toBe(true);
      expect(el.getAttribute('aria-busy')).toBe('true');
      expect(el.getAttribute('aria-disabled')).toBe('true');
      expect(el.getAttribute('data-loading')).toBe('true');
    });

    it('stays disabled when both disabled and loading are true', () => {
      fixture.componentInstance.disabled.set(true);
      fixture.componentInstance.loading.set(true);
      fixture.detectChanges();

      expect(button().disabled).toBe(true);
      expect(button().getAttribute('aria-busy')).toBe('true');
    });

    it('applies icon-only sizing and aria-label', () => {
      fixture.componentInstance.iconOnly.set(true);
      fixture.componentInstance.ariaLabel.set('Eliminar');
      fixture.detectChanges();

      const el = button();
      expect(el.getAttribute('data-icon-only')).toBe('true');
      expect(el.className).toContain('w-10');
      expect(el.className).toContain('px-0');
      expect(el.getAttribute('aria-label')).toBe('Eliminar');
    });

    it.each([
      ['sm', 'w-8'],
      ['md', 'w-10'],
      ['lg', 'w-12'],
    ] as const satisfies readonly (readonly [WiButtonSize, string])[])(
      'applies icon-only width for size %s',
      (size, widthClass) => {
        fixture.componentInstance.iconOnly.set(true);
        fixture.componentInstance.size.set(size);
        fixture.detectChanges();

        expect(button().className).toContain(widthClass);
        expect(button().className).toContain('px-0');
      },
    );

    it('supports submit and reset types', () => {
      fixture.componentInstance.type.set('submit');
      fixture.detectChanges();
      expect(button().getAttribute('type')).toBe('submit');

      fixture.componentInstance.type.set('reset');
      fixture.detectChanges();
      expect(button().getAttribute('type')).toBe('reset');
    });

    it('can be created without throwing (SSR-safe construction)', () => {
      const hostFixture = TestBed.createComponent(ButtonHostComponent);
      expect(() => hostFixture.detectChanges()).not.toThrow();
      expect(hostFixture.componentInstance).toBeTruthy();
    });
  });

  describe('on anchor', () => {
    let fixture: ComponentFixture<LinkHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LinkHostComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(LinkHostComponent);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    function link(): HTMLAnchorElement {
      return fixture.nativeElement.querySelector('a');
    }

    it('keeps native link semantics and button appearance', () => {
      const el = link();
      expect(el.tagName).toBe('A');
      expect(el.getAttribute('href')).toBe('/settings');
      expect(el.getAttribute('role')).toBeNull();
      expect(el.getAttribute('type')).toBeNull();
      expect(el.classList.contains('wi-button')).toBe(true);
      expect(el.getAttribute('data-variant')).toBe('outline');
      expect(el.getAttribute('disabled')).toBeNull();
    });

    it('does not use native disabled; blocks activation when disabled', () => {
      const clicks: Event[] = [];
      link().addEventListener('click', (event) => clicks.push(event));

      fixture.componentInstance.disabled.set(true);
      fixture.detectChanges();

      const el = link();
      expect(el.getAttribute('disabled')).toBeNull();
      expect(el.getAttribute('aria-disabled')).toBe('true');
      expect(el.getAttribute('tabindex')).toBe('-1');
      expect(el.getAttribute('data-disabled')).toBe('true');

      el.click();
      expect(clicks).toHaveLength(0);
    });

    it('blocks activation when loading', () => {
      fixture.componentInstance.loading.set(true);
      fixture.detectChanges();

      const el = link();
      expect(el.getAttribute('aria-busy')).toBe('true');
      expect(el.getAttribute('aria-disabled')).toBe('true');
      expect(el.getAttribute('tabindex')).toBe('-1');
    });
  });
});
