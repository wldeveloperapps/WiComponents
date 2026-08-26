import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  WiPicklistComponent,
  WiPicklistItemDirective,
} from '../../forms/src/picklist/wi-picklist.component';
import type { WiPicklistSize } from '../../forms/src/picklist/wi-picklist.types';

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
  imports: [WiPicklistComponent, ReactiveFormsModule],
  template: `
    <wi-picklist
      [formControl]="control"
      [options]="options"
      optionLabel="name"
      optionValue="id"
      sourceHeader="Available"
      targetHeader="Assigned"
      moveToTargetLabel="Move selected"
      moveAllToTargetLabel="Move all"
      moveToSourceLabel="Remove selected"
      moveAllToSourceLabel="Remove all"
      ariaLabel="Members"
    />
  `,
})
class ReactiveHostComponent {
  readonly control = new FormControl<string[]>([]);
  readonly options = [
    { id: 'a', name: 'Alpha' },
    { id: 'b', name: 'Beta' },
    { id: 'c', name: 'Gamma' },
  ];
}

@Component({
  imports: [WiPicklistComponent, WiPicklistItemDirective],
  template: `
    <wi-picklist [options]="options" [(value)]="value" ariaLabel="Custom">
      <ng-template wiPicklistItem let-option let-selected="selected">
        <span data-testid="custom-item">{{ option }}{{ selected ? ' *' : '' }}</span>
      </ng-template>
    </wi-picklist>
  `,
})
class TemplateHostComponent {
  readonly options = ['One', 'Two'];
  value: string[] = ['Two'];
}

describe('WiPicklistComponent', () => {
  let fixture: ComponentFixture<WiPicklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WiPicklistComponent, ReactiveHostComponent, TemplateHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WiPicklistComponent);
    fixture.componentRef.setInput('options', ['One', 'Two', 'Three']);
    fixture.componentRef.setInput('sourceHeader', 'Disponibles');
    fixture.componentRef.setInput('targetHeader', 'Asignados');
    fixture.componentRef.setInput('sourceEmptyText', 'Sin disponibles');
    fixture.componentRef.setInput('targetEmptyText', 'Sin asignados');
    fixture.componentRef.setInput('moveToTargetLabel', 'Mover a asignados');
    fixture.componentRef.setInput('moveAllToTargetLabel', 'Mover todos');
    fixture.componentRef.setInput('moveToSourceLabel', 'Quitar de asignados');
    fixture.componentRef.setInput('moveAllToSourceLabel', 'Quitar todos');
    fixture.componentRef.setInput('ariaLabel', 'Asignación');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  function sourceList(): HTMLElement {
    return fixture.nativeElement.querySelector('.wi-picklist__source [role="listbox"]');
  }

  function targetList(): HTMLElement {
    return fixture.nativeElement.querySelector('.wi-picklist__target [role="listbox"]');
  }

  function sourceOptions(): HTMLElement[] {
    return Array.from(
      fixture.nativeElement.querySelectorAll('.wi-picklist__source [role="option"]'),
    );
  }

  function targetOptions(): HTMLElement[] {
    return Array.from(
      fixture.nativeElement.querySelectorAll('.wi-picklist__target [role="option"]'),
    );
  }

  function moveToTarget(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.wi-picklist__move-to-target button');
  }

  function moveAllToTarget(): HTMLButtonElement | null {
    return fixture.nativeElement.querySelector('.wi-picklist__move-all-to-target button');
  }

  function moveToSource(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.wi-picklist__move-to-source button');
  }

  function moveAllToSource(): HTMLButtonElement | null {
    return fixture.nativeElement.querySelector('.wi-picklist__move-all-to-source button');
  }

  it('renders host, headers and both listboxes', () => {
    expect(fixture.nativeElement.classList.contains('wi-picklist')).toBe(true);
    expect(fixture.nativeElement.querySelector('.wi-picklist__layout')?.className).toContain(
      'grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]',
    );
    expect(fixture.nativeElement.getAttribute('role')).toBe('group');
    expect(fixture.nativeElement.getAttribute('aria-label')).toBe('Asignación');
    expect(sourceList()).toBeTruthy();
    expect(targetList()).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Disponibles');
    expect(fixture.nativeElement.textContent).toContain('Asignados');
    expect(sourceOptions()).toHaveLength(3);
    expect(targetOptions()).toHaveLength(0);
  });

  it('exposes a stable id for the source and target lists', () => {
    expect(sourceList().id).toMatch(/^wi-picklist-\d+-source$/);
    expect(targetList().id).toMatch(/^wi-picklist-\d+-target$/);

    fixture.componentRef.setInput('id', 'members');
    fixture.detectChanges();
    expect(sourceList().id).toBe('members-source');
    expect(targetList().id).toBe('members-target');
  });

  it.each([
    ['sm', 'h-control-sm'],
    ['md', 'h-control-md'],
    ['lg', 'h-control-lg'],
  ] as const satisfies readonly (readonly [WiPicklistSize, string])[])(
    'applies %s size classes to transfer buttons',
    (size, heightClass) => {
      fixture.componentRef.setInput('size', size);
      fixture.detectChanges();
      expect(moveToTarget().className).toContain(heightClass);
      expect(moveToSource().className).toContain(heightClass);
    },
  );

  it('labels transfer buttons with the provided aria-labels', () => {
    expect(moveToTarget().getAttribute('aria-label')).toBe('Mover a asignados');
    expect(moveAllToTarget()?.getAttribute('aria-label')).toBe('Mover todos');
    expect(moveToSource().getAttribute('aria-label')).toBe('Quitar de asignados');
    expect(moveAllToSource()?.getAttribute('aria-label')).toBe('Quitar todos');
  });

  it('keeps transfer-selected disabled until there is a selection', () => {
    expect(moveToTarget().disabled).toBe(true);
    expect(moveToSource().disabled).toBe(true);
    expect(moveAllToTarget()?.disabled).toBe(false);
    expect(moveAllToSource()?.disabled).toBe(true);
  });

  it('moves selected items to the target', async () => {
    sourceOptions()[1]?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(moveToTarget().disabled).toBe(false);
    moveToTarget().click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.value()).toEqual(['Two']);
    expect(sourceOptions().map((el) => el.textContent)).toEqual(
      expect.arrayContaining([expect.stringContaining('One'), expect.stringContaining('Three')]),
    );
    expect(sourceOptions()).toHaveLength(2);
    expect(targetOptions()).toHaveLength(1);
    expect(targetOptions()[0]?.textContent).toContain('Two');
  });

  it('moves all source items to the target', async () => {
    moveAllToTarget()?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.value()).toEqual(['One', 'Two', 'Three']);
    expect(sourceOptions()).toHaveLength(0);
    expect(targetOptions()).toHaveLength(3);
    expect(
      fixture.nativeElement.querySelector('.wi-picklist__source .wi-listbox__empty'),
    ).toBeTruthy();
  });

  it('moves selected target items back to the source', async () => {
    fixture.componentInstance.value.set(['One', 'Three']);
    fixture.detectChanges();
    await fixture.whenStable();

    targetOptions()[0]?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    moveToSource().click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.value()).toEqual(['Three']);
    expect(sourceOptions()).toHaveLength(2);
    expect(targetOptions()).toHaveLength(1);
  });

  it('moves all target items back to the source', async () => {
    fixture.componentInstance.value.set(['Two']);
    fixture.detectChanges();
    await fixture.whenStable();

    moveAllToSource()?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.value()).toEqual([]);
    expect(sourceOptions()).toHaveLength(3);
    expect(targetOptions()).toHaveLength(0);
  });

  it('emits touch when transferring', async () => {
    const touchSpy = vi.fn();
    fixture.componentInstance.touch.subscribe(touchSpy);

    moveAllToTarget()?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(touchSpy).toHaveBeenCalled();
  });

  it('disables lists and buttons when disabled is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.getAttribute('aria-disabled')).toBe('true');
    expect(sourceList().getAttribute('aria-disabled')).toBe('true');
    expect(targetList().getAttribute('aria-disabled')).toBe('true');
    expect(moveToTarget().disabled).toBe(true);
    expect(moveAllToTarget()?.disabled).toBe(true);
    expect(moveToSource().disabled).toBe(true);
    expect(moveAllToSource()?.disabled).toBe(true);
  });

  it('exposes invalid and required ARIA state', () => {
    fixture.componentRef.setInput('invalid', true);
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.getAttribute('aria-invalid')).toBe('true');
    expect(fixture.nativeElement.getAttribute('aria-required')).toBe('true');
    expect(targetList().getAttribute('aria-invalid')).toBe('true');
    expect(targetList().getAttribute('aria-required')).toBe('true');
  });

  it('hides move-all buttons when showMoveAll is false', () => {
    fixture.componentRef.setInput('showMoveAll', false);
    fixture.detectChanges();

    expect(moveAllToTarget()).toBeNull();
    expect(moveAllToSource()).toBeNull();
    expect(moveToTarget()).toBeTruthy();
    expect(moveToSource()).toBeTruthy();
  });

  it('shows empty text on both lists', () => {
    fixture.componentRef.setInput('options', []);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.wi-picklist__source .wi-listbox__empty')?.textContent,
    ).toContain('Sin disponibles');
    expect(
      fixture.nativeElement.querySelector('.wi-picklist__target .wi-listbox__empty')?.textContent,
    ).toContain('Sin asignados');
  });

  it('works with Reactive Forms and optionValue/optionLabel', async () => {
    const hostFixture = TestBed.createComponent(ReactiveHostComponent);
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    const optionEls = Array.from(
      hostFixture.nativeElement.querySelectorAll('.wi-picklist__source [role="option"]'),
    ) as HTMLElement[];
    expect(optionEls[0]?.textContent).toContain('Alpha');

    optionEls[1]?.click();
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    const move = hostFixture.nativeElement.querySelector(
      '.wi-picklist__move-to-target button',
    ) as HTMLButtonElement;
    move.click();
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    expect(hostFixture.componentInstance.control.value).toEqual(['b']);
    expect(
      hostFixture.nativeElement.querySelector('.wi-picklist__target [role="option"]')?.textContent,
    ).toContain('Beta');
  });

  it('renders custom item template in both lists', async () => {
    const hostFixture = TestBed.createComponent(TemplateHostComponent);
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    const custom = hostFixture.nativeElement.querySelectorAll('[data-testid="custom-item"]');
    expect(custom).toHaveLength(2);
    expect(hostFixture.nativeElement.querySelector('.wi-picklist__source')?.textContent).toContain(
      'One',
    );
    expect(hostFixture.nativeElement.querySelector('.wi-picklist__target')?.textContent).toContain(
      'Two',
    );
  });

  it('writeValue normalizes null to an empty array', () => {
    fixture.componentInstance.writeValue(null);
    expect(fixture.componentInstance.value()).toEqual([]);
  });
});
