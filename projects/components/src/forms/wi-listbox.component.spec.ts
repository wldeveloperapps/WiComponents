import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  WiListboxComponent,
  WiListboxItemDirective,
} from '../../forms/src/listbox/wi-listbox.component';
import type { WiListboxSize } from '../../forms/src/listbox/wi-listbox.types';

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
  imports: [WiListboxComponent, ReactiveFormsModule],
  template: `
    <wi-listbox
      [formControl]="control"
      [options]="options"
      [multiple]="multiple"
      optionLabel="name"
      optionValue="id"
      ariaLabel="Site"
    />
  `,
})
class ReactiveHostComponent {
  readonly control = new FormControl<string | string[] | null>(null);
  readonly options = [
    { id: 'a', name: 'Alpha' },
    { id: 'b', name: 'Beta' },
    { id: 'c', name: 'Gamma' },
  ];
  multiple = false;
}

@Component({
  imports: [WiListboxComponent, WiListboxItemDirective],
  template: `
    <wi-listbox [options]="options" [(value)]="value" ariaLabel="Custom">
      <ng-template wiListboxItem let-option let-selected="selected">
        <span data-testid="custom-item">{{ option }}{{ selected ? ' *' : '' }}</span>
      </ng-template>
    </wi-listbox>
  `,
})
class TemplateHostComponent {
  readonly options = ['One', 'Two'];
  value: string | null = 'Two';
}

describe('WiListboxComponent', () => {
  let fixture: ComponentFixture<WiListboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WiListboxComponent, ReactiveHostComponent, TemplateHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WiListboxComponent);
    fixture.componentRef.setInput('options', ['One', 'Two', 'Three']);
    fixture.componentRef.setInput('ariaLabel', 'Choice');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  function listbox(): HTMLElement {
    return fixture.nativeElement.querySelector('[ngListbox], [role="listbox"]');
  }

  function options(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('[ngOption], [role="option"]'));
  }

  it('renders host and listbox with default classes', () => {
    expect(fixture.nativeElement.classList.contains('wi-listbox')).toBe(true);
    const el = listbox();
    expect(el).toBeTruthy();
    expect(el.getAttribute('role')).toBe('listbox');
    expect(el.className).toContain('border-outline-variant');
    expect(el.className).toContain('bg-surface');
    expect(el.className).toContain('max-h-60');
    expect(el.getAttribute('aria-label')).toBe('Choice');
  });

  it('exposes a stable id for label association', () => {
    expect(listbox().id).toMatch(/^wi-listbox-\d+$/);

    fixture.componentRef.setInput('id', 'roles');
    fixture.detectChanges();
    expect(listbox().id).toBe('roles');
  });

  it.each([
    ['sm', 'p-0.5'],
    ['md', 'p-1'],
    ['lg', 'p-1.5'],
  ] as const satisfies readonly (readonly [WiListboxSize, string])[])(
    'applies %s size classes',
    (size, paddingClass) => {
      fixture.componentRef.setInput('size', size);
      fixture.detectChanges();
      expect(listbox().className).toContain(paddingClass);
    },
  );

  it('applies default option alignment for text items', () => {
    expect(options()[0]?.className).toContain('items-center');
  });

  it('renders options from input', () => {
    expect(options()).toHaveLength(3);
    expect(options()[0]?.textContent).toContain('One');
  });

  it('shows empty text when options is empty', () => {
    fixture.componentRef.setInput('options', []);
    fixture.componentRef.setInput('emptyText', 'Sin opciones');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.wi-listbox__empty')?.textContent).toContain(
      'Sin opciones',
    );
    expect(options()).toHaveLength(0);
  });

  it('disables when disabled is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const el = listbox();
    expect(el.getAttribute('aria-disabled')).toBe('true');
  });

  it('exposes invalid and required ARIA state', () => {
    fixture.componentRef.setInput('invalid', true);
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    const el = listbox();
    expect(el.getAttribute('aria-invalid')).toBe('true');
    expect(el.getAttribute('aria-required')).toBe('true');
    expect(el.className).toContain('aria-invalid:border-error');
  });

  it('updates value on single selection', async () => {
    options()[1]?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.value()).toBe('Two');
    expect(options()[1]?.getAttribute('aria-selected')).toBe('true');
  });

  it('supports multiple selection', async () => {
    fixture.componentRef.setInput('multiple', true);
    fixture.componentRef.setInput('value', []);
    fixture.detectChanges();
    await fixture.whenStable();

    options()[0]?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    options()[2]?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.value()).toEqual(['One', 'Three']);
  });

  it('marks the selected option with aria-selected', async () => {
    fixture.componentInstance.value.set('Two');
    fixture.detectChanges();
    await fixture.whenStable();

    const items = options();
    expect(items[0]?.getAttribute('aria-selected')).toBe('false');
    expect(items[1]?.getAttribute('aria-selected')).toBe('true');
    expect(items[2]?.getAttribute('aria-selected')).toBe('false');
    expect(items[1]?.querySelector('.wi-listbox__check')?.getAttribute('class')).toContain(
      'group-aria-selected:opacity-100',
    );
  });

  it('works with Reactive Forms and optionValue/optionLabel', async () => {
    const hostFixture = TestBed.createComponent(ReactiveHostComponent);
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    const optionEls = Array.from(
      hostFixture.nativeElement.querySelectorAll('[role="option"]'),
    ) as HTMLElement[];
    expect(optionEls[0]?.textContent).toContain('Alpha');

    optionEls[1]?.click();
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    expect(hostFixture.componentInstance.control.value).toBe('b');
  });

  it('renders custom item template', async () => {
    const hostFixture = TestBed.createComponent(TemplateHostComponent);
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    const custom = hostFixture.nativeElement.querySelectorAll('[data-testid="custom-item"]');
    expect(custom).toHaveLength(2);
    expect(custom[1]?.textContent).toContain('Two *');
    expect(custom[0]?.closest('.wi-listbox__option')?.className).toContain('items-start');
    expect(custom[0]?.parentElement?.className).not.toContain('truncate');
    expect(hostFixture.nativeElement.querySelector('.wi-listbox__check')).toBeNull();
  });

  it('writeValue normalizes null for multiple', () => {
    fixture.componentRef.setInput('multiple', true);
    fixture.detectChanges();
    fixture.componentInstance.writeValue(null);
    expect(fixture.componentInstance.value()).toEqual([]);
  });
});
