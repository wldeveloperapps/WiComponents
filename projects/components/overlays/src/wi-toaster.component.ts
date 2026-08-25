import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  booleanAttribute,
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  inject,
  input,
  numberAttribute,
  PLATFORM_ID,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { BrnSonnerToaster } from '@spartan-ng/brain/sonner';
import { WI_DARK_CLASS } from '@wiloc/ui/core';

import { injectWiOverlaysI18n } from './wi-overlays.i18n';
import type { WiToastPosition, WiToastTheme } from './wi-toast.types';

/** Estilos del toaster anclados a tokens `--wi-color-*` / `--wi-radius-*`. */
const WI_TOASTER_TOKEN_STYLE: Record<string, string> = {
  '--normal-bg': 'var(--wi-color-surface)',
  '--normal-text': 'var(--wi-color-on-surface)',
  '--normal-border': 'var(--wi-color-outline-variant)',
  '--border-radius': 'var(--wi-radius-md)',
  '--success-bg': 'var(--wi-color-success)',
  '--success-border': 'var(--wi-color-success)',
  '--success-text': 'var(--wi-color-on-success)',
  '--error-bg': 'var(--wi-color-error)',
  '--error-border': 'var(--wi-color-error)',
  '--error-text': 'var(--wi-color-on-error)',
  '--warning-bg': 'var(--wi-color-warning)',
  '--warning-border': 'var(--wi-color-warning)',
  '--warning-text': 'var(--wi-color-on-warning)',
  '--info-bg': 'var(--wi-color-primary)',
  '--info-border': 'var(--wi-color-primary)',
  '--info-text': 'var(--wi-color-on-primary)',
};

/**
 * Host global de toasts (`wi-toaster`).
 *
 * Montar una sola vez en el root. El viewport se adjunta con CDK Overlay a
 * `document.body` (fuera de contenedores con `transform`), anclado al viewport.
 *
 * Tema: `auto` (default) sigue `.wi-dark` en `<html>`.
 * Posición default: `top-right`.
 * Chrome a11y: `provideWiOverlaysI18n` (`toastCloseLabel`, `toastRegionLabel`).
 *
 * ```html
 * <router-outlet />
 * <wi-toaster />
 * ```
 */
@Component({
  selector: 'wi-toaster',
  imports: [BrnSonnerToaster],
  host: {
    'data-slot': 'toaster',
    class: 'wi-toaster',
    // El host en el árbol de la app no pinta nada; el viewport vive en el overlay.
    style: 'display: contents',
  },
  template: `
    <ng-template #portal>
      <brn-sonner-toaster
        class="wi-toaster__viewport"
        [invert]="invert()"
        [theme]="resolvedTheme()"
        [position]="position()"
        [hotKey]="hotKey()"
        [richColors]="richColors()"
        [expand]="expand()"
        [duration]="duration()"
        [visibleToasts]="visibleToasts()"
        [closeButton]="closeButton()"
        [toastOptions]="toastOptions()"
        [offset]="offset()"
        [style]="tokenStyle()"
      />
    </ng-template>
  `,
})
export class WiToasterComponent {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly overlaysI18n = injectWiOverlaysI18n();

  private readonly portalTpl = viewChild.required<TemplateRef<unknown>>('portal');

  /** Invierte contraste del toast respecto al tema. */
  readonly invert = input(false, { transform: booleanAttribute });

  /**
   * Tema del viewport sonner.
   * - `auto` (default): sigue `.wi-dark` en `<html>`
   * - `light` | `dark` | `system`: fuerza el valor
   */
  readonly theme = input<WiToastTheme>('auto');

  /** Posición por defecto de los toasts (viewport). */
  readonly position = input<WiToastPosition>('top-right');

  /** Atajo para enfocar el área de notificaciones. Default Alt+T. */
  readonly hotKey = input<string[]>(['altKey', 'KeyT']);

  /** Colores semánticos en success / error / warning / info. */
  readonly richColors = input(false, { transform: booleanAttribute });

  /**
   * Apila los toasts expandídos (uno debajo de otro).
   * Default `true`.
   */
  readonly expand = input(true, { transform: booleanAttribute });

  /** Duración por defecto (ms). */
  readonly duration = input(4000, { transform: numberAttribute });

  /** Máximo de toasts visibles a la vez. */
  readonly visibleToasts = input(5, { transform: numberAttribute });

  /** Botón cerrar en todos los toasts. */
  readonly closeButton = input(true, { transform: booleanAttribute });

  /** Offset desde el borde del viewport. */
  readonly offset = input<string | number | null>(null);

  private readonly documentTheme = signal<'light' | 'dark'>('light');
  private overlayRef: OverlayRef | null = null;

  protected readonly resolvedTheme = computed(() => {
    const theme = this.theme();
    return theme === 'auto' ? this.documentTheme() : theme;
  });

  protected readonly tokenStyle = computed(() => WI_TOASTER_TOKEN_STYLE);

  protected readonly toastOptions = computed(() => ({
    classes: {
      toast: 'wi-toast',
      title: 'wi-toast__title',
      description: 'wi-toast__description',
      closeButton: 'wi-toast__close',
      actionButton: 'wi-toast__action',
      cancelButton: 'wi-toast__cancel',
    },
  }));

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    afterNextRender(() => {
      this.syncDocumentTheme();
      this.attachOverlay();

      const themeObserver = new MutationObserver(() => this.syncDocumentTheme());
      themeObserver.observe(this.document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });

      // Storybook / apps: `lang` cambia con el locale → reaplicar chrome a11y.
      const localeObserver = new MutationObserver(() => this.applyChromeI18n());
      localeObserver.observe(this.document.documentElement, {
        attributes: true,
        attributeFilter: ['lang'],
      });

      this.destroyRef.onDestroy(() => {
        themeObserver.disconnect();
        localeObserver.disconnect();
        this.overlayRef?.dispose();
        this.overlayRef = null;
      });
    });
  }

  private attachOverlay(): void {
    if (this.overlayRef) {
      return;
    }

    this.overlayRef = this.overlay.create({
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      positionStrategy: this.overlay.position().global(),
      panelClass: 'wi-toaster-overlay',
    });

    // Pane a pantalla completa, sin capturar clics (los toasts sí).
    const pane = this.overlayRef.overlayElement;
    pane.style.position = 'fixed';
    pane.style.inset = '0';
    pane.style.width = '100vw';
    pane.style.height = '100vh';
    pane.style.pointerEvents = 'none';
    pane.style.zIndex = '2147483646';

    this.overlayRef.attach(new TemplatePortal(this.portalTpl(), this.viewContainerRef));

    // Brain hardcodea "Close toast" / "Notifications …"; sustituimos tras cada mount.
    const chromeObserver = new MutationObserver(() => this.applyChromeI18n());
    chromeObserver.observe(pane, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-label'],
    });
    this.destroyRef.onDestroy(() => chromeObserver.disconnect());
    this.applyChromeI18n();
  }

  /**
   * Sustituye labels en inglés de Brain por `provideWiOverlaysI18n`.
   * No hay API pública en Spartan para estos aria-label.
   */
  private applyChromeI18n(): void {
    const root = this.overlayRef?.overlayElement;
    if (!root) {
      return;
    }

    const closeLabel = this.overlaysI18n.toastCloseLabel();
    const regionLabel = this.overlaysI18n.toastRegionLabel();
    const hotKeySuffix = this.hotKey().join('+').replace(/Key/g, '').replace(/Digit/g, '');
    const regionAria = `${regionLabel} ${hotKeySuffix}`.trim();

    root.querySelectorAll('button[data-close-button]').forEach((btn) => {
      if (btn.getAttribute('aria-label') !== closeLabel) {
        btn.setAttribute('aria-label', closeLabel);
      }
    });

    root.querySelectorAll('section[aria-label]').forEach((section) => {
      if (section.getAttribute('aria-label') !== regionAria) {
        section.setAttribute('aria-label', regionAria);
      }
    });
  }

  private syncDocumentTheme(): void {
    this.documentTheme.set(
      this.document.documentElement.classList.contains(WI_DARK_CLASS) ? 'dark' : 'light',
    );
  }
}
