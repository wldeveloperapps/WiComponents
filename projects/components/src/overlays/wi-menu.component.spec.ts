import { Directionality } from '@angular/cdk/bidi';
import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WiButtonComponent } from '../../button/src/public-api';
import {
  WiMenuComponent,
  WiMenuGroupComponent,
  WiMenuItemDirective,
  WiMenuLabelComponent,
  WiMenuRadioDirective,
  WiMenuSeparatorComponent,
  WiMenuTriggerDirective,
} from '../../overlays/src/wi-menu.component';

@Component({
  selector: 'wi-menu-host',
  imports: [
    WiMenuTriggerDirective,
    WiMenuComponent,
    WiMenuLabelComponent,
    WiMenuItemDirective,
    WiMenuSeparatorComponent,
    WiButtonComponent,
  ],
  template: `
    <wi-button type="button" [wiMenuTrigger]="menu">Abrir</wi-button>
    <ng-template #menu>
      <wi-menu>
        <wi-menu-label>Acciones</wi-menu-label>
        <button type="button" wiMenuItem data-testid="edit">Editar</button>
        <button type="button" wiMenuItem [disabled]="itemDisabled()" data-testid="disabled-item">
          Deshabilitado
        </button>
        <wi-menu-separator />
        <button type="button" wiMenuItem variant="danger" data-testid="danger">Eliminar</button>
      </wi-menu>
    </ng-template>
  `,
})
class MenuHostComponent {
  readonly itemDisabled = signal(true);
}

@Component({
  selector: 'wi-menu-radio-host',
  imports: [
    WiMenuTriggerDirective,
    WiMenuComponent,
    WiMenuLabelComponent,
    WiMenuGroupComponent,
    WiMenuRadioDirective,
  ],
  template: `
    <button type="button" [wiMenuTrigger]="menu" aria-label="Filtro">Filtro</button>
    <ng-template #menu>
      <wi-menu>
        <wi-menu-label>Tipos</wi-menu-label>
        <wi-menu-group>
          <button
            type="button"
            wiMenuRadio
            [checked]="selected() === 'all'"
            (triggered)="selected.set('all')"
          >
            All
          </button>
          <button
            type="button"
            wiMenuRadio
            [checked]="selected() === 'adhoc'"
            (triggered)="selected.set('adhoc')"
            data-testid="adhoc"
          >
            Adhoc
          </button>
        </wi-menu-group>
      </wi-menu>
    </ng-template>
    <span data-testid="selected">{{ selected() }}</span>
  `,
})
class MenuRadioHostComponent {
  readonly selected = signal('all');
}

describe('WiMenuComponent', () => {
  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
  });

  function panel(): Element | null {
    return document.querySelector('[data-slot="menu"]');
  }

  async function waitForPanel(present: boolean): Promise<void> {
    const deadline = Date.now() + 2000;
    while (Date.now() < deadline) {
      const found = panel();
      if (present ? found : !found) {
        return;
      }
      await new Promise((r) => setTimeout(r, 20));
    }
    expect(!!panel()).toBe(present);
  }

  describe('default menu', () => {
    let fixture: ComponentFixture<MenuHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [MenuHostComponent],
        providers: [Directionality],
      }).compileComponents();

      fixture = TestBed.createComponent(MenuHostComponent);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renders the trigger by default without a panel', () => {
      expect(fixture.nativeElement.textContent).toContain('Abrir');
      expect(panel()).toBeNull();
    });

    it('opens the menu on trigger click', async () => {
      const trigger = fixture.nativeElement.querySelector('wi-button, button');
      trigger.click();
      fixture.detectChanges();
      await waitForPanel(true);

      const menu = panel();
      expect(menu).toBeTruthy();
      expect(menu?.classList.contains('wi-menu')).toBe(true);
      expect(menu?.textContent).toContain('Acciones');
      expect(menu?.textContent).toContain('Editar');
    });

    it('applies danger variant classes on menu items', async () => {
      fixture.nativeElement.querySelector('wi-button, button').click();
      fixture.detectChanges();
      await waitForPanel(true);

      const danger = document.querySelector('[data-testid="danger"]');
      expect(danger?.className).toContain('text-error');
      expect(danger?.getAttribute('data-variant')).toBe('danger');
    });

    it('marks disabled items', async () => {
      fixture.nativeElement.querySelector('wi-button, button').click();
      fixture.detectChanges();
      await waitForPanel(true);

      const disabled = document.querySelector('[data-testid="disabled-item"]');
      expect(disabled?.hasAttribute('data-disabled')).toBe(true);
    });

    it('exposes a label and separator structure', async () => {
      fixture.nativeElement.querySelector('wi-button, button').click();
      fixture.detectChanges();
      await waitForPanel(true);

      expect(document.querySelector('[data-slot="menu-label"]')?.textContent).toContain('Acciones');
      expect(document.querySelector('[data-slot="menu-separator"]')).toBeTruthy();
    });
  });

  describe('radio selection', () => {
    let fixture: ComponentFixture<MenuRadioHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [MenuRadioHostComponent],
        providers: [Directionality],
      }).compileComponents();

      fixture = TestBed.createComponent(MenuRadioHostComponent);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('updates selection when a radio item is triggered', async () => {
      fixture.nativeElement.querySelector('button').click();
      fixture.detectChanges();
      await waitForPanel(true);

      document.querySelector<HTMLButtonElement>('[data-testid="adhoc"]')?.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(fixture.componentInstance.selected()).toBe('adhoc');
      expect(fixture.nativeElement.querySelector('[data-testid="selected"]')?.textContent).toBe(
        'adhoc',
      );
    });
  });
});
