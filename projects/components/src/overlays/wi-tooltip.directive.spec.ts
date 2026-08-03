import { Directionality } from '@angular/cdk/bidi';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WiTooltipDirective } from '../../overlays/src/wi-tooltip.directive';

@Component({
  selector: 'wi-tooltip-host',
  imports: [WiTooltipDirective],
  template: `
    <div
      style="position: fixed; inset: 0; display: flex; align-items: center; justify-content: center"
    >
      <button
        type="button"
        [wiTooltip]="text"
        [position]="position"
        [showDelay]="0"
        [hideDelay]="0"
        [tooltipDisabled]="tooltipDisabled"
      >
        trigger
      </button>
    </div>
  `,
})
class TooltipHostComponent {
  text: string | null = 'Tip de prueba';
  position: 'top' | 'bottom' | 'left' | 'right' = 'top';
  tooltipDisabled = false;
}

@Component({
  selector: 'wi-tooltip-disabled-host',
  imports: [WiTooltipDirective],
  template: `
    <div
      style="position: fixed; inset: 0; display: flex; align-items: center; justify-content: center"
    >
      <button
        type="button"
        wiTooltip="No debería verse"
        [showDelay]="0"
        [hideDelay]="0"
        [tooltipDisabled]="true"
      >
        trigger
      </button>
    </div>
  `,
})
class TooltipDisabledHostComponent {}

@Component({
  selector: 'wi-tooltip-empty-host',
  imports: [WiTooltipDirective],
  template: `
    <div
      style="position: fixed; inset: 0; display: flex; align-items: center; justify-content: center"
    >
      <button type="button" [wiTooltip]="null" [showDelay]="0" [hideDelay]="0">trigger</button>
    </div>
  `,
})
class TooltipEmptyHostComponent {}

describe('WiTooltipDirective', () => {
  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
  });

  function tooltipEl(): Element | null {
    return document.querySelector('[role="tooltip"]');
  }

  async function waitForTooltip(present: boolean): Promise<void> {
    const deadline = Date.now() + 2000;
    while (Date.now() < deadline) {
      const found = tooltipEl();
      if (present ? found : !found) {
        return;
      }
      await new Promise((r) => setTimeout(r, 20));
    }
    expect(!!tooltipEl()).toBe(present);
  }

  describe('default host', () => {
    let fixture: ComponentFixture<TooltipHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TooltipHostComponent],
        providers: [Directionality],
      }).compileComponents();

      fixture = TestBed.createComponent(TooltipHostComponent);
      fixture.detectChanges();
      await fixture.whenStable();
      // BrnTooltip crea el overlay en afterNextRender
      await fixture.whenStable();
    });

    function trigger(): HTMLButtonElement {
      return fixture.nativeElement.querySelector('button');
    }

    it('constructs without showing a tooltip (SSR-safe init path)', () => {
      expect(trigger()).toBeTruthy();
      expect(tooltipEl()).toBeNull();
    });

    it('shows tooltip on mouseenter and sets aria-describedby', async () => {
      trigger().dispatchEvent(new MouseEvent('mouseenter'));
      await waitForTooltip(true);

      const tip = tooltipEl();
      expect(tip).toBeTruthy();
      expect(tip?.textContent).toContain('Tip de prueba');
      expect(tip?.className).toContain('bg-inverse-surface');
      expect(tip?.className).toContain('text-inverse-on-surface');

      const describedBy = trigger().getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
      expect(tip?.getAttribute('id')).toBe(describedBy);
    });

    it('hides tooltip on mouseleave', async () => {
      trigger().dispatchEvent(new MouseEvent('mouseenter'));
      await waitForTooltip(true);

      trigger().dispatchEvent(new MouseEvent('mouseleave'));
      await waitForTooltip(false);
    });

    it('applies data-side from position input', async () => {
      fixture.componentInstance.position = 'bottom';
      fixture.detectChanges();

      trigger().dispatchEvent(new MouseEvent('mouseenter'));
      await waitForTooltip(true);

      expect(tooltipEl()?.getAttribute('data-side')).toBe('bottom');
    });

    it('shows on focus', async () => {
      trigger().dispatchEvent(new FocusEvent('focus'));
      await waitForTooltip(true);
      expect(tooltipEl()?.textContent).toContain('Tip de prueba');
    });
  });

  it('does not show when tooltipDisabled', async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipDisabledHostComponent],
      providers: [Directionality],
    }).compileComponents();

    const fixture = TestBed.createComponent(TooltipDisabledHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    await new Promise((r) => setTimeout(r, 150));

    expect(tooltipEl()).toBeNull();
  });

  it('does not show when content is empty', async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipEmptyHostComponent],
      providers: [Directionality],
    }).compileComponents();

    const fixture = TestBed.createComponent(TooltipEmptyHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    await new Promise((r) => setTimeout(r, 150));

    expect(tooltipEl()).toBeNull();
  });
});
