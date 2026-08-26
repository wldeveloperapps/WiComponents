import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideWiIcons } from '../../icon/src/public-api';
import { keyOutline } from '../../icon/heroicons/src/key';
import { listBulletOutline } from '../../icon/heroicons/src/list-bullet';
import { squares2x2Outline } from '../../icon/heroicons/src/squares-2x2';
import { userOutline } from '../../icon/heroicons/src/user';
import {
  WiStepperComponent,
  WiStepperPanelDirective,
} from '../../navigation/src/stepper/wi-stepper.component';
import type { WiStepperStep } from '../../navigation/src/stepper/wi-stepper.types';

const STEPS: readonly WiStepperStep[] = [
  { id: 'details', label: 'Datos', icon: 'user' },
  { id: 'apps', label: 'Aplicaciones', icon: 'squares-2x2' },
  { id: 'perms', label: 'Permisos', icon: 'key' },
  { id: 'summary', label: 'Resumen', icon: 'list-bullet' },
];

@Component({
  imports: [WiStepperComponent, WiStepperPanelDirective],
  template: `
    <wi-stepper
      [steps]="steps()"
      [(value)]="value"
      [orientation]="orientation()"
      [linear]="linear()"
      [aria-label]="ariaLabel()"
    >
      <div wiStepperPanel="details">Panel datos</div>
      <div wiStepperPanel="apps">Panel aplicaciones</div>
      <div wiStepperPanel="perms">Panel permisos</div>
      <div wiStepperPanel="summary">Panel resumen</div>
    </wi-stepper>
  `,
})
class WiStepperHostComponent {
  readonly stepper = viewChild.required(WiStepperComponent);
  readonly steps = signal<readonly WiStepperStep[]>(STEPS);
  readonly value = signal('details');
  readonly orientation = signal<'vertical' | 'horizontal'>('vertical');
  readonly linear = signal(true);
  readonly ariaLabel = signal('Alta');
}

describe('WiStepperComponent', () => {
  let fixture: ComponentFixture<WiStepperHostComponent>;
  let host: WiStepperHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WiStepperHostComponent],
      providers: [
        provideWiIcons({
          user: { outline: userOutline },
          'squares-2x2': { outline: squares2x2Outline },
          key: { outline: keyOutline },
          'list-bullet': { outline: listBulletOutline },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WiStepperHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  function root(): HTMLElement {
    return fixture.nativeElement.querySelector('wi-stepper');
  }

  function nav(): HTMLElement {
    return fixture.nativeElement.querySelector('nav');
  }

  function triggers(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.wi-stepper__trigger'));
  }

  function panels(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('[wiStepperPanel]'));
  }

  it('renders the host, nav and labels from steps', () => {
    expect(root().classList.contains('wi-stepper')).toBe(true);
    expect(root().getAttribute('data-orientation')).toBe('vertical');
    expect(root().querySelector('.wi-stepper__layout')?.className).toContain(
      'wi-stepper__layout--vertical',
    );
    expect(nav().getAttribute('aria-label')).toBe('Alta');
    expect(triggers()).toHaveLength(4);
    expect(triggers().map((button) => button.textContent?.trim())).toEqual([
      'Datos',
      'Aplicaciones',
      'Permisos',
      'Resumen',
    ]);
  });

  it('marks the current step and shows its panel', () => {
    const [first, second] = triggers();
    expect(first.getAttribute('aria-current')).toBe('step');
    expect(first.getAttribute('data-state')).toBe('current');
    expect(first.className).toContain('w-full');
    expect(second.getAttribute('aria-current')).toBeNull();
    expect(second.getAttribute('data-state')).toBe('upcoming');
    expect(second.disabled).toBe(false);
    expect(second.getAttribute('aria-disabled')).toBe('true');
    expect(second.tabIndex).toBe(-1);

    const [details, apps] = panels();
    expect(details.hasAttribute('hidden')).toBe(false);
    expect(apps.hasAttribute('hidden')).toBe(true);
    expect(details.getAttribute('role')).toBe('region');
    expect(details.textContent).toContain('Panel datos');
  });

  it('places a vertical connector from the indicator center on non-last steps', () => {
    const items = Array.from(nav().querySelectorAll('.wi-stepper__item')) as HTMLElement[];
    expect(items).toHaveLength(4);
    expect(nav().querySelector('.wi-stepper__connector')).toBeNull();
    expect(getComputedStyle(items[0]).paddingBottom).toBe('2rem');
    expect(getComputedStyle(items[3]).paddingBottom).not.toBe('2rem');
  });

  it('does not let linear mode skip ahead via the nav', () => {
    triggers()[2].click();
    fixture.detectChanges();

    expect(host.value()).toBe('details');
    expect(triggers()[0].getAttribute('aria-current')).toBe('step');
  });

  it('goes back via the nav when the step is complete', async () => {
    host.value.set('apps');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(triggers()[0].disabled).toBe(false);
    expect(triggers()[0].getAttribute('data-state')).toBe('complete');
    expect(triggers()[1].getAttribute('data-state')).toBe('current');
    expect(triggers()[2].getAttribute('aria-disabled')).toBe('true');
    expect(triggers()[2].tabIndex).toBe(-1);

    triggers()[0].click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.value()).toBe('details');
    expect(panels()[0].hasAttribute('hidden')).toBe(false);
    expect(panels()[1].hasAttribute('hidden')).toBe(true);
  });

  it('allows clicking any enabled step when not linear', async () => {
    host.linear.set(false);
    fixture.detectChanges();

    expect(triggers()[3].disabled).toBe(false);
    expect(triggers()[3].getAttribute('aria-disabled')).toBeNull();
    triggers()[3].click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.value()).toBe('summary');
    expect(triggers()[3].getAttribute('aria-current')).toBe('step');
    expect(panels()[3].hasAttribute('hidden')).toBe(false);
  });

  it('does not select a disabled step', async () => {
    host.linear.set(false);
    host.steps.set([STEPS[0], { ...STEPS[1], disabled: true }, STEPS[2], STEPS[3]]);
    fixture.detectChanges();

    expect(triggers()[1].disabled).toBe(true);
    triggers()[1].click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.value()).toBe('details');
  });

  it('selectNext and selectPrevious skip disabled steps', () => {
    host.steps.set([STEPS[0], { ...STEPS[1], disabled: true }, STEPS[2], STEPS[3]]);
    fixture.detectChanges();

    expect(host.stepper().selectNext()).toBe(true);
    expect(host.value()).toBe('perms');
    expect(host.stepper().selectPrevious()).toBe(true);
    expect(host.value()).toBe('details');
    expect(host.stepper().selectPrevious()).toBe(false);
  });

  it('applies horizontal orientation classes', () => {
    host.orientation.set('horizontal');
    fixture.detectChanges();

    expect(root().getAttribute('data-orientation')).toBe('horizontal');
    expect(root().querySelector('.wi-stepper__layout')?.className).toContain(
      'wi-stepper__layout--horizontal',
    );
    expect(triggers()[0].className).toContain('flex-col');
    expect(nav().querySelector('.wi-stepper__connector')).toBeNull();
    const items = Array.from(nav().querySelectorAll('.wi-stepper__item')) as HTMLElement[];
    expect(items).toHaveLength(4);
    expect(getComputedStyle(items[0]).paddingBottom).not.toBe('2rem');
    expect(root().style.getPropertyValue('--wi-stepper-count').trim()).toBe('4');
  });

  it('moves between selectable steps with arrow keys', async () => {
    host.value.set('apps');
    fixture.detectChanges();

    nav().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.value()).toBe('details');

    host.linear.set(false);
    fixture.detectChanges();

    nav().dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.value()).toBe('summary');
  });

  it('falls back to the first step when value is unknown', () => {
    host.value.set('missing');
    fixture.detectChanges();

    expect(triggers()[0].getAttribute('aria-current')).toBe('step');
    expect(panels()[0].hasAttribute('hidden')).toBe(false);
  });
});
