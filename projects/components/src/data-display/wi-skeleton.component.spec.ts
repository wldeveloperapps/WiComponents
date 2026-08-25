import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WiSkeletonComponent } from '../../data-display/src/skeleton/wi-skeleton.component';
import type { WiSkeletonShape } from '../../data-display/src/skeleton/wi-skeleton.types';

@Component({
  imports: [WiSkeletonComponent],
  template: `
    <wi-skeleton
      [shape]="shape()"
      [size]="size()"
      [width]="width()"
      [height]="height()"
      [animated]="animated()"
    />
  `,
})
class WiSkeletonHostComponent {
  readonly shape = signal<WiSkeletonShape>('rectangle');
  readonly size = signal<string | undefined>(undefined);
  readonly width = signal<string | undefined>(undefined);
  readonly height = signal<string | undefined>(undefined);
  readonly animated = signal(true);
}

describe('WiSkeletonComponent', () => {
  let fixture: ComponentFixture<WiSkeletonHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WiSkeletonHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WiSkeletonHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  function skeleton(): HTMLElement {
    return fixture.nativeElement.querySelector('wi-skeleton');
  }

  it('renders host with default rectangle dimensions and structural classes', () => {
    const el = skeleton();
    expect(el).toBeTruthy();
    expect(el.getAttribute('data-slot')).toBe('skeleton');
    expect(el.getAttribute('data-shape')).toBe('rectangle');
    expect(el.getAttribute('data-animated')).toBe('true');
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.classList.contains('wi-skeleton')).toBe(true);
    expect(el.className).toContain('bg-surface-variant');
    expect(el.className).toContain('data-[shape=rectangle]:rounded-control');
    expect(el.className).toContain('motion-safe:data-[animated=true]:animate-pulse');
    expect(el.style.width).toBe('100%');
    expect(el.style.height).toBe('1rem');
  });

  it('applies circle shape and default size when no dimensions are set', () => {
    fixture.componentInstance.shape.set('circle');
    fixture.detectChanges();

    const el = skeleton();
    expect(el.getAttribute('data-shape')).toBe('circle');
    expect(el.className).toContain('data-[shape=circle]:rounded-full');
    expect(el.style.width).toBe('2.5rem');
    expect(el.style.height).toBe('2.5rem');
  });

  it('uses size for both width and height', () => {
    fixture.componentInstance.size.set('4rem');
    fixture.detectChanges();

    const el = skeleton();
    expect(el.style.width).toBe('4rem');
    expect(el.style.height).toBe('4rem');
  });

  it('applies custom width and height', () => {
    fixture.componentInstance.width.set('10rem');
    fixture.componentInstance.height.set('3rem');
    fixture.detectChanges();

    const el = skeleton();
    expect(el.style.width).toBe('10rem');
    expect(el.style.height).toBe('3rem');
  });

  it('disables animation when animated is false', () => {
    fixture.componentInstance.animated.set(false);
    fixture.detectChanges();

    const el = skeleton();
    expect(el.getAttribute('data-animated')).toBe('false');
  });

  it('can be created without throwing (SSR-safe construction)', () => {
    const skeletonFixture = TestBed.createComponent(WiSkeletonComponent);
    expect(() => skeletonFixture.detectChanges()).not.toThrow();
    expect(skeletonFixture.componentInstance).toBeTruthy();
    expect(skeletonFixture.nativeElement.classList.contains('wi-skeleton')).toBe(true);
  });
});
