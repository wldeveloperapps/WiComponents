import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { provideWiIcons } from '../../icon/src/public-api';
import { funnelOutline } from '../../icon/heroicons/src/funnel';
import {
  WiSelectComponent,
  WiSelectTriggerIconDirective,
} from '../../forms/src/wi-select.component';
import type { WiSelectSize } from '../../forms/src/wi-select.types';

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
  imports: [WiSelectComponent, ReactiveFormsModule],
  template: `
    <wi-select
      [formControl]="control"
      [options]="options"
      [multiple]="multiple"
      [clearable]="clearable"
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
  clearable = false;
}

describe('WiSelectComponent', () => {
  let fixture: ComponentFixture<WiSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WiSelectComponent, ReactiveHostComponent],
      providers: [
        provideWiIcons({
          funnel: { outline: funnelOutline },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WiSelectComponent);
    fixture.componentRef.setInput('options', ['One', 'Two', 'Three']);
    fixture.componentRef.setInput('ariaLabel', 'Choice');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  function trigger(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button[brnSelectTrigger]');
  }

  async function openAndSelectFirst(): Promise<void> {
    trigger().click();
    fixture.detectChanges();
    await fixture.whenStable();
    const option = document.querySelector('[brnSelectItem]') as HTMLElement | null;
    expect(option).toBeTruthy();
    option?.click();
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('renders host and trigger with default classes', () => {
    expect(fixture.nativeElement.classList.contains('wi-select')).toBe(true);
    const button = trigger();
    expect(button).toBeTruthy();
    expect(button.className).toContain('border-outline');
    expect(button.className).toContain('bg-surface');
    expect(button.className).toContain('h-control-md');
    expect(button.getAttribute('aria-label')).toBe('Choice');
  });

  it('exposes a stable id for label association', () => {
    expect(trigger().id).toMatch(/^wi-select-\d+$/);

    fixture.componentRef.setInput('id', 'site-select');
    fixture.detectChanges();
    expect(trigger().id).toBe('site-select');
  });

  it.each([
    ['sm', 'h-control-sm'],
    ['md', 'h-control-md'],
    ['lg', 'h-control-lg'],
  ] as const satisfies readonly (readonly [WiSelectSize, string])[])(
    'applies %s size classes',
    (size, heightClass) => {
      fixture.componentRef.setInput('size', size);
      fixture.detectChanges();
      expect(trigger().className).toContain(heightClass);
    },
  );

  it('shows placeholder when empty', () => {
    fixture.componentRef.setInput('placeholder', 'Pick one');
    fixture.detectChanges();
    expect(trigger().textContent).toContain('Pick one');
  });

  it('disables the trigger when disabled is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(trigger().disabled).toBe(true);
  });

  it('exposes invalid and required ARIA state', () => {
    fixture.componentRef.setInput('invalid', true);
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    const button = trigger();
    expect(button.getAttribute('aria-invalid')).toBe('true');
    expect(button.getAttribute('aria-required')).toBe('true');
  });

  it('updates value on single selection', async () => {
    await openAndSelectFirst();
    expect(fixture.componentInstance.value()).toBe('One');
  });

  it('clears value when clearable and clear is clicked', async () => {
    fixture.componentRef.setInput('clearable', true);
    fixture.componentRef.setInput('clearLabel', 'Limpiar');
    fixture.componentInstance.value.set('Two');
    fixture.detectChanges();
    await fixture.whenStable();

    const clear = fixture.nativeElement.querySelector(
      '.wi-select__clear',
    ) as HTMLButtonElement | null;
    expect(clear).toBeTruthy();
    expect(clear?.getAttribute('aria-label')).toBe('Limpiar');
    clear?.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBeNull();
  });

  it('toggles values in multiple mode without requiring Object.is identity', async () => {
    fixture.componentRef.setInput('multiple', true);
    fixture.componentInstance.value.set([]);
    fixture.detectChanges();
    await fixture.whenStable();

    trigger().click();
    fixture.detectChanges();
    await fixture.whenStable();

    const options = Array.from(document.querySelectorAll('[brnSelectItem]')) as HTMLElement[];
    expect(options.length).toBeGreaterThanOrEqual(2);
    options[0]?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    options[1]?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.value()).toEqual(['One', 'Two']);
  });

  it('resolves optionLabel and optionValue for object options', async () => {
    fixture.componentRef.setInput('options', [
      { id: 's1', name: 'Site One' },
      { id: 's2', name: 'Site Two' },
    ]);
    fixture.componentRef.setInput('optionLabel', 'name');
    fixture.componentRef.setInput('optionValue', 'id');
    fixture.detectChanges();
    await fixture.whenStable();

    await openAndSelectFirst();
    expect(fixture.componentInstance.value()).toBe('s1');
    expect(trigger().textContent).toContain('Site One');
  });

  it('emits touch when the panel closes', async () => {
    const touches: void[] = [];
    fixture.componentInstance.touch.subscribe(() => touches.push(undefined));

    await openAndSelectFirst();
    expect(touches.length).toBeGreaterThanOrEqual(1);
  });

  it('renders a named icon instead of the chevron', () => {
    fixture.componentRef.setInput('icon', 'funnel');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.wi-select__chevron')).toBeNull();
    expect(fixture.nativeElement.querySelector('.wi-select__trigger-icon')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('wi-icon')).toBeTruthy();
  });

  it('prefers wiSelectTriggerIcon template over icon input', () => {
    @Component({
      imports: [WiSelectComponent, WiSelectTriggerIconDirective],
      template: `
        <wi-select [options]="options" icon="funnel" ariaLabel="Filter">
          <ng-template wiSelectTriggerIcon>
            <span class="custom-trigger-icon">custom</span>
          </ng-template>
        </wi-select>
      `,
    })
    class TriggerIconHostComponent {
      readonly options = ['A', 'B'];
    }

    const hostFixture = TestBed.createComponent(TriggerIconHostComponent);
    hostFixture.detectChanges();

    const root = hostFixture.nativeElement as HTMLElement;
    expect(root.querySelector('.wi-select__chevron')).toBeNull();
    expect(root.querySelector('.custom-trigger-icon')?.textContent).toContain('custom');
    expect(root.querySelector('wi-icon')).toBeNull();
  });

  it('integrates with Reactive Forms', async () => {
    const hostFixture = TestBed.createComponent(ReactiveHostComponent);
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    const selectDebug = hostFixture.debugElement.query(By.directive(WiSelectComponent));
    const select = selectDebug.componentInstance as WiSelectComponent;
    const button = hostFixture.nativeElement.querySelector(
      'button[brnSelectTrigger]',
    ) as HTMLButtonElement;

    button.click();
    hostFixture.detectChanges();
    await hostFixture.whenStable();
    (document.querySelector('[brnSelectItem]') as HTMLElement | null)?.click();
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    expect(hostFixture.componentInstance.control.value).toBe('a');
    expect(select.value()).toBe('a');
  });
});
