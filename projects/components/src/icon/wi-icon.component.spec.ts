import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
  type TestRequest,
} from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WiIconComponent } from '../../icon/src/wi-icon.component';
import { provideWiIcons } from '../../icon/src/wi-icon.provider';
import { mergeIconRegistries, resolveIconGlyph } from '../../icon/src/wi-icon.registry';
import type { WiIconGlyph, WiIconRegistry } from '../../icon/src/wi-icon.types';
import { parseExternalSvg } from '../../icon/src/wi-icon.svg';

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

describe('WiIconComponent source selection', () => {
  let fixture: ComponentFixture<WiIconComponent>;
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    await TestBed.configureTestingModule({
      imports: [WiIconComponent],
      providers: [provideWiIcons(baseRegistry)],
    }).compileComponents();

    fixture = TestBed.createComponent(WiIconComponent);
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('warns in dev and renders nothing when name and src are missing', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('svg')).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith('[wi-icon] Provide "name" or "src". Neither was set.');

    const calls = warnSpy.mock.calls.length;
    fixture.detectChanges();
    expect(warnSpy.mock.calls.length).toBe(calls);
  });

  it('uses name, ignores src and warns in dev when both are set', () => {
    fixture.componentRef.setInput('name', 'home');
    fixture.componentRef.setInput('src', 'assets/images/ignored.svg');
    fixture.detectChanges();

    const path = fixture.nativeElement.querySelector('svg path');
    expect(path?.getAttribute('d')).toBe('M3 12 L12 3 L21 12');
    expect(warnSpy).toHaveBeenCalledWith(
      '[wi-icon] Both "name" and "src" were set. Using "name" and ignoring "src".',
    );
  });
});

@Component({
  selector: 'wi-icon-src-pair',
  imports: [WiIconComponent],
  template: `
    <wi-icon class="first" [src]="src" />
    <wi-icon class="second" [src]="src" />
  `,
})
class SrcPairComponent {
  src = '';
}

const FILLED_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0z" fill="#ff00aa" onclick="alert(1)" style="fill:red"/>
  </svg>
`;

const STROKE_SVG = `
  <svg width="800" height="800" fill="none" viewBox="0 0 24 24">
    <path d="M4 20V10" stroke="#112233" stroke-width="2"/>
  </svg>
`;

const UNSAFE_SVG = `
  <svg viewBox="0 0 24 24">
    <script>alert(1)</script>
    <image href="evil.png"/>
    <foreignObject><div>x</div></foreignObject>
    <use href="#sprite"/>
    <g transform="translate(1 1)">
      <circle cx="2" cy="3" r="4" fill="#abc"/>
      <g>
        <rect x="0" y="0" width="4" height="5" stroke="#111"/>
      </g>
    </g>
  </svg>
`;

describe('WiIconComponent src', () => {
  let http: HttpTestingController;
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    await TestBed.configureTestingModule({
      imports: [WiIconComponent, SrcPairComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideWiIcons(baseRegistry)],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    warnSpy.mockRestore();
  });

  async function renderSrc(
    svg: string,
    configure?: (fixture: ComponentFixture<WiIconComponent>) => void,
    url = `assets/images/icon-${Math.random().toString(16).slice(2)}.svg`,
  ): Promise<ComponentFixture<WiIconComponent>> {
    const fixture = TestBed.createComponent(WiIconComponent);
    fixture.componentRef.setInput('name', null);
    fixture.componentRef.setInput('src', url);
    configure?.(fixture);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('svg')).toBeNull();

    const request = await waitForRequest(http, url);
    request.flush(svg);
    await fixture.whenStable();
    TestBed.tick();
    return fixture;
  }

  it('paints a single path with a hex fill as currentColor', async () => {
    const fixture = await renderSrc(FILLED_SVG, (current) => {
      current.componentRef.setInput('size', 'sm');
      current.componentRef.setInput('label', 'Puerta');
    });

    const el = fixture.nativeElement.querySelector('svg');
    const path = el?.querySelector('path');
    expect(el?.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(el?.getAttribute('width')).toBe('16');
    expect(el?.getAttribute('height')).toBe('16');
    expect(el?.classList.contains('size-4')).toBe(true);
    expect(el?.getAttribute('fill')).toBeNull();
    expect(path?.getAttribute('fill')).toBe('currentColor');
    expect(path?.getAttribute('onclick')).toBeNull();
    expect(path?.getAttribute('style')).toBeNull();
    expect(el?.getAttribute('role')).toBe('img');
    expect(el?.getAttribute('aria-label')).toBe('Puerta');
    expect(el?.getAttribute('aria-hidden')).toBeNull();
  });

  it('keeps fill none on the svg and maps a hex stroke to currentColor', async () => {
    const fixture = await renderSrc(STROKE_SVG, (current) => {
      current.componentRef.setInput('variant', 'solid');
    });

    const el = fixture.nativeElement.querySelector('svg');
    const path = el?.querySelector('path');
    expect(el?.getAttribute('fill')).toBe('none');
    expect(el?.getAttribute('stroke')).toBeNull();
    expect(el?.getAttribute('stroke-width')).toBeNull();
    expect(el?.getAttribute('width')).toBe('20');
    expect(path?.getAttribute('stroke')).toBe('currentColor');
    expect(path?.getAttribute('stroke-width')).toBe('2');
    expect(path?.getAttribute('fill')).not.toBe('currentColor');
    expect(el?.getAttribute('aria-hidden')).toBe('true');
  });

  it('keeps the file hex when preserveColors is true', async () => {
    const fixture = await renderSrc(
      `<svg viewBox="0 0 32 32"><path d="M0 0h10v10H0z" fill="#0078D4"/></svg>`,
      (current) => {
        current.componentRef.setInput('preserveColors', true);
      },
    );

    expect(fixture.nativeElement.querySelector('path')?.getAttribute('fill')).toBe('#0078D4');
  });

  it('falls back to the default viewBox and ignores width and height from the file', async () => {
    const fixture = await renderSrc(
      `<svg width="800" height="800"><path d="M0 0h1" fill="#fff"/></svg>`,
    );

    const el = fixture.nativeElement.querySelector('svg');
    expect(el?.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(el?.getAttribute('width')).toBe('20');
    expect(el?.querySelector('path')?.getAttribute('fill')).toBe('currentColor');
  });

  it('does not paint script, image or other disallowed tags and nests groups', async () => {
    const fixture = await renderSrc(UNSAFE_SVG);
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('script')).toBeNull();
    expect(root.querySelector('image')).toBeNull();
    expect(root.querySelector('foreignObject')).toBeNull();
    expect(root.querySelector('use')).toBeNull();

    const circle = root.querySelector('g circle');
    const rect = root.querySelector('g g rect');
    expect(circle?.getAttribute('fill')).toBe('currentColor');
    expect(circle?.getAttribute('cx')).toBe('2');
    expect(root.querySelector('g')?.getAttribute('transform')).toBe('translate(1 1)');
    expect(rect?.getAttribute('stroke')).toBe('currentColor');
    expect(rect?.getAttribute('width')).toBe('4');
  });

  it('renders nothing and warns when the download fails', async () => {
    const url = `assets/images/missing-${Math.random().toString(16).slice(2)}.svg`;
    const fixture = TestBed.createComponent(WiIconComponent);
    fixture.componentRef.setInput('src', url);
    fixture.detectChanges();

    const request = await waitForRequest(http, url);
    request.flush('nope', { status: 404, statusText: 'Not Found' });
    await fixture.whenStable();
    TestBed.tick();

    expect(fixture.nativeElement.querySelector('svg')).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith(`[wi-icon] Failed to load SVG from "${url}".`);
  });

  it('renders nothing and warns when the payload is not an SVG', async () => {
    const url = `assets/images/bad-${Math.random().toString(16).slice(2)}.svg`;
    const fixture = TestBed.createComponent(WiIconComponent);
    fixture.componentRef.setInput('src', url);
    fixture.detectChanges();

    const request = await waitForRequest(http, url);
    request.flush('<html></html>');
    await fixture.whenStable();
    TestBed.tick();

    expect(fixture.nativeElement.querySelector('svg')).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith(`[wi-icon] Could not parse SVG from "${url}".`);
  });

  it('does not request a src outside app paths and http(s)', () => {
    const fixture = TestBed.createComponent(WiIconComponent);
    fixture.componentRef.setInput('src', 'javascript:alert(1)');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('svg')).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith(
      '[wi-icon] src "javascript:alert(1)" must be an app path or an http(s) URL.',
    );
    http.expectNone(() => true);
  });

  it('requests an http(s) URL once', async () => {
    const url = 'https://cdn.example.test/icons/gate.svg';
    const fixture = TestBed.createComponent(WiIconComponent);
    fixture.componentRef.setInput('src', url);
    fixture.detectChanges();

    const request = await waitForRequest(http, url);
    expect(request.request.method).toBe('GET');
    request.flush(FILLED_SVG);
    await fixture.whenStable();
    TestBed.tick();

    expect(fixture.nativeElement.querySelector('path')?.getAttribute('fill')).toBe('currentColor');
  });

  it('loads the same src once for two icons, including a later preserveColors instance', async () => {
    const url = `assets/images/shared-${Math.random().toString(16).slice(2)}.svg`;
    const pair = TestBed.createComponent(SrcPairComponent);
    pair.componentInstance.src = url;
    pair.detectChanges();

    const request = await waitForRequest(http, url);
    request.flush(FILLED_SVG);
    await pair.whenStable();
    TestBed.tick();

    const paths = pair.nativeElement.querySelectorAll('path');
    expect(paths).toHaveLength(2);
    expect(paths[0]?.getAttribute('fill')).toBe('currentColor');
    expect(paths[1]?.getAttribute('fill')).toBe('currentColor');

    const colored = TestBed.createComponent(WiIconComponent);
    colored.componentRef.setInput('src', url);
    colored.componentRef.setInput('preserveColors', true);
    colored.detectChanges();
    await colored.whenStable();
    TestBed.tick();

    http.expectNone(url);
    expect(colored.nativeElement.querySelector('path')?.getAttribute('fill')).toBe('#ff00aa');
  });
});

describe('parseExternalSvg', () => {
  it('returns null when the text has no svg root', () => {
    expect(parseExternalSvg('<html></html>', false)).toBeNull();
  });

  it('maps a hex fill to currentColor and keeps viewBox', () => {
    const parsed = parseExternalSvg(FILLED_SVG, false);
    expect(parsed?.glyph.viewBox).toBe('0 0 24 24');
    expect(parsed?.rootFill).toBeNull();
    expect(parsed?.glyph.nodes[0]?.attrs['fill']).toBe('currentColor');
    expect(parsed?.glyph.nodes[0]?.attrs['d']).toBe('M0 0h24v24H0z');
    expect(parsed?.glyph.nodes[0]?.attrs['onclick']).toBeUndefined();
    expect(parsed?.glyph.nodes[0]?.attrs['style']).toBeUndefined();

    const stroke = parseExternalSvg(STROKE_SVG, false);
    expect(stroke?.rootFill).toBe('none');
    expect(stroke?.glyph.nodes[0]?.attrs['stroke']).toBe('currentColor');
    expect(stroke?.glyph.nodes[0]?.attrs['stroke-width']).toBe('2');
  });
});

async function waitForRequest(http: HttpTestingController, url: string): Promise<TestRequest> {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    TestBed.tick();
    const pending = http.match(url);
    if (pending.length > 1) {
      throw new Error(`Expected at most 1 request to ${url}, received ${pending.length}`);
    }
    if (pending.length === 1 && pending[0]) {
      return pending[0];
    }
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  throw new Error(`No request to ${url}`);
}
