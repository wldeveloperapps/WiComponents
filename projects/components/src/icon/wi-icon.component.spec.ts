import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WiIconComponent } from '../../icon/src/wi-icon.component';
import { provideWiIcons } from '../../icon/src/wi-icon.provider';
import { mergeIconRegistries, resolveIconGlyph } from '../../icon/src/wi-icon.registry';
import type { WiIconGlyph, WiIconRegistry } from '../../icon/src/wi-icon.types';

const homeOutline: WiIconGlyph = {
  viewBox: '0 0 24 24',
  nodes: [
    {
      tag: 'path',
      attrs: {
        d: 'M3 12 L12 3 L21 12',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
      },
    },
  ],
};

const homeSolid: WiIconGlyph = {
  viewBox: '0 0 24 24',
  nodes: [{ tag: 'path', attrs: { d: 'M3 12 L12 3 L21 12 V21 H3 Z' } }],
};

const trashOutline: WiIconGlyph = {
  viewBox: '0 0 24 24',
  nodes: [{ tag: 'path', attrs: { d: 'M6 6 H18' } }],
};

const azureSolid: WiIconGlyph = {
  viewBox: '0 0 24 24',
  preserveColors: true,
  nodes: [
    {
      tag: 'path',
      attrs: { d: 'M4 4 H20 V20 H4 Z', fill: '#0078D4' },
    },
  ],
};

const baseRegistry: WiIconRegistry = {
  home: { outline: homeOutline, solid: homeSolid },
  trash: { outline: trashOutline },
  azure: { solid: azureSolid },
};

describe('mergeIconRegistries', () => {
  it('returns empty object when registries are missing', () => {
    expect(mergeIconRegistries(null)).toEqual({});
    expect(mergeIconRegistries([])).toEqual({});
  });

  it('merges multiple registries with last-write-wins per name and variant merge', () => {
    const merged = mergeIconRegistries([
      { home: { outline: homeOutline }, trash: { outline: trashOutline } },
      { home: { solid: homeSolid }, azure: { solid: azureSolid } },
    ]);

    expect(merged['home']?.outline).toBe(homeOutline);
    expect(merged['home']?.solid).toBe(homeSolid);
    expect(merged['trash']?.outline).toBe(trashOutline);
    expect(merged['azure']?.solid).toBe(azureSolid);
  });
});

describe('resolveIconGlyph', () => {
  it('returns preferred variant when available', () => {
    const result = resolveIconGlyph(baseRegistry['home'], 'solid');
    expect(result?.usedVariant).toBe('solid');
    expect(result?.fellBack).toBe(false);
    expect(result?.glyph).toBe(homeSolid);
  });

  it('falls back to the other variant when preferred is missing', () => {
    const result = resolveIconGlyph(baseRegistry['trash'], 'solid');
    expect(result?.usedVariant).toBe('outline');
    expect(result?.fellBack).toBe(true);
    expect(result?.glyph).toBe(trashOutline);
  });

  it('returns null when definition is missing', () => {
    expect(resolveIconGlyph(undefined, 'outline')).toBeNull();
  });
});

describe('WiIconComponent', () => {
  let fixture: ComponentFixture<WiIconComponent>;
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    await TestBed.configureTestingModule({
      imports: [WiIconComponent],
      providers: [provideWiIcons(baseRegistry)],
    }).compileComponents();

    fixture = TestBed.createComponent(WiIconComponent);
    fixture.componentRef.setInput('name', 'home');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  function svg(): SVGElement | null {
    return fixture.nativeElement.querySelector('svg');
  }

  it('renders a registered icon', () => {
    const el = svg();
    expect(el).toBeTruthy();
    expect(el?.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(el?.querySelector('path')).toBeTruthy();
  });

  it('applies outline presentation', () => {
    fixture.componentRef.setInput('variant', 'outline');
    fixture.detectChanges();

    const el = svg();
    expect(el?.getAttribute('fill')).toBe('none');
    expect(el?.getAttribute('stroke')).toBe('currentColor');
    expect(el?.getAttribute('stroke-width')).toBe('1.5');
  });

  it('applies solid presentation', () => {
    fixture.componentRef.setInput('variant', 'solid');
    fixture.detectChanges();

    const el = svg();
    expect(el?.getAttribute('fill')).toBe('currentColor');
    expect(el?.getAttribute('stroke')).toBeNull();
  });

  it('falls back between variants', () => {
    fixture.componentRef.setInput('name', 'trash');
    fixture.componentRef.setInput('variant', 'solid');
    fixture.detectChanges();

    expect(svg()).toBeTruthy();
    expect(warnSpy).toHaveBeenCalled();
  });

  it('applies size classes and intrinsic dimensions', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();

    expect(svg()?.classList.contains('size-6')).toBe(true);
    expect(svg()?.getAttribute('width')).toBe('24');
    expect(svg()?.getAttribute('height')).toBe('24');
  });

  it('inherits color via currentColor presentation', () => {
    fixture.componentRef.setInput('variant', 'outline');
    fixture.detectChanges();

    expect(svg()?.getAttribute('stroke')).toBe('currentColor');
    expect(fixture.nativeElement.classList.contains('text-current')).toBe(true);
  });

  it('marks decorative icons as aria-hidden', () => {
    fixture.componentRef.setInput('label', null);
    fixture.detectChanges();

    const el = svg();
    expect(el?.getAttribute('aria-hidden')).toBe('true');
    expect(el?.getAttribute('role')).toBeNull();
    expect(el?.getAttribute('aria-label')).toBeNull();
  });

  it('exposes accessible name when label is set', () => {
    fixture.componentRef.setInput('label', 'Advertencia');
    fixture.detectChanges();

    const el = svg();
    expect(el?.getAttribute('aria-hidden')).toBeNull();
    expect(el?.getAttribute('role')).toBe('img');
    expect(el?.getAttribute('aria-label')).toBe('Advertencia');
  });

  it('warns once for missing icons and renders nothing', () => {
    const uniqueName = `missing-${Date.now()}`;
    fixture.componentRef.setInput('name', uniqueName);
    fixture.detectChanges();

    expect(svg()).toBeNull();
    expect(warnSpy).toHaveBeenCalled();
    const calls = warnSpy.mock.calls.length;

    fixture.detectChanges();
    expect(warnSpy.mock.calls.length).toBe(calls);
  });

  it('renders custom icons', () => {
    fixture.componentRef.setInput('name', 'azure');
    fixture.componentRef.setInput('variant', 'solid');
    fixture.detectChanges();

    const path = svg()?.querySelector('path');
    expect(path?.getAttribute('fill')).toBe('#0078D4');
  });

  it('can be created without throwing (SSR-safe construction)', () => {
    const iconFixture = TestBed.createComponent(WiIconComponent);
    iconFixture.componentRef.setInput('name', 'home');
    expect(() => iconFixture.detectChanges()).not.toThrow();
    expect(iconFixture.componentInstance).toBeTruthy();
  });
});

describe('WiIconComponent without registry', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders nothing when the registry is empty', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    await TestBed.configureTestingModule({
      imports: [WiIconComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(WiIconComponent);
    fixture.componentRef.setInput('name', 'home');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('svg')).toBeNull();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('combines multiple provideWiIcons calls', async () => {
    await TestBed.configureTestingModule({
      imports: [WiIconComponent],
      providers: [
        provideWiIcons({ home: { outline: homeOutline } }),
        provideWiIcons({
          home: { solid: homeSolid },
          trash: { outline: trashOutline },
        }),
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(WiIconComponent);
    fixture.componentRef.setInput('name', 'home');
    fixture.componentRef.setInput('variant', 'solid');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('svg')).toBeTruthy();

    fixture.componentRef.setInput('name', 'trash');
    fixture.componentRef.setInput('variant', 'outline');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('svg')).toBeTruthy();
  });
});
