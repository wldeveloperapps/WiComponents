import { Component, computed, input, output } from '@angular/core';
import { WiIconComponent } from '@wiloc/ui/icon';

import type { WiBreadcrumbItem } from './wi-breadcrumb.types';

const HOST_CLASSES = 'wi-breadcrumb block min-w-0';

const LIST_CLASSES = [
  'wi-breadcrumb__list',
  'm-0',
  'inline-flex',
  'min-w-0',
  'max-w-full',
  'list-none',
  'flex-wrap',
  'items-center',
  'gap-1',
  'rounded-full',
  'px-2',
  'py-1',
].join(' ');

const ITEM_CLASSES = 'wi-breadcrumb__item inline-flex min-w-0 max-w-full items-center gap-1';

const LINK_CLASSES = [
  'wi-breadcrumb__link',
  'inline-flex',
  'min-w-0',
  'max-w-full',
  'items-center',
  'gap-1',
  'rounded-control',
  'text-sm',
  'font-medium',
  'text-on-surface-variant',
  'transition-colors',
  'hover:text-on-surface',
  'outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-ring',
  'focus-visible:ring-offset-2',
  'focus-visible:ring-offset-background',
].join(' ');

const TEXT_CLASSES = [
  'wi-breadcrumb__text',
  'inline-flex',
  'min-w-0',
  'max-w-full',
  'items-center',
  'gap-1',
  'text-sm',
  'font-medium',
  'text-on-surface-variant',
].join(' ');

const CURRENT_CLASSES = [
  'wi-breadcrumb__current',
  'inline-flex',
  'min-w-0',
  'max-w-full',
  'items-center',
  'gap-1',
  'rounded-full',
  'bg-primary',
  'px-3',
  'py-1',
  'text-sm',
  'font-medium',
  'text-on-primary',
].join(' ');

const SEPARATOR_CLASSES =
  'wi-breadcrumb__separator inline-flex shrink-0 items-center text-on-surface-variant';

interface WiBreadcrumbItemView {
  readonly item: WiBreadcrumbItem;
  readonly current: boolean;
}

function isExternalHref(href: string): boolean {
  return /^(https?:|mailto:|tel:)/i.test(href);
}

/**
 * Migas de pan (`wi-breadcrumb`).
 *
 * Los segmentos los define la app: `{ id, label, href?, icon?, iconOnly? }`.
 * El último ítem es la página actual (`aria-current="page"`) con estilo pastilla.
 * La librería no hardcodea textos, rutas ni el icono de inicio.
 *
 * ```html
 * <wi-breadcrumb [items]="items" ariaLabel="Migas" (itemClick)="onCrumb($event)" />
 * ```
 */
@Component({
  selector: 'wi-breadcrumb',
  exportAs: 'wiBreadcrumb',
  imports: [WiIconComponent],
  styleUrl: './wi-breadcrumb.css',
  host: {
    'data-slot': 'breadcrumb',
    class: HOST_CLASSES,
  },
  template: `
    <nav [class]="navClasses" [attr.aria-label]="ariaLabel() || null">
      <ol [class]="listClasses">
        @for (entry of viewItems(); track entry.item.id) {
          <li [class]="itemClasses">
            @if (entry.current) {
              <span
                [class]="currentClasses"
                aria-current="page"
                [attr.aria-label]="entry.item.iconOnly ? entry.item.label : null"
                [attr.title]="entry.item.label"
              >
                @if (entry.item.icon) {
                  <wi-icon [name]="entry.item.icon" size="sm" />
                }
                @if (!entry.item.iconOnly) {
                  <span class="truncate">{{ entry.item.label }}</span>
                }
              </span>
            } @else if (entry.item.href) {
              <a
                [class]="linkClasses"
                [href]="entry.item.href"
                [attr.aria-label]="entry.item.iconOnly ? entry.item.label : null"
                [attr.title]="entry.item.label"
                (click)="onLinkClick($event, entry.item)"
              >
                @if (entry.item.icon) {
                  <wi-icon [name]="entry.item.icon" size="sm" />
                }
                @if (!entry.item.iconOnly) {
                  <span class="truncate">{{ entry.item.label }}</span>
                }
              </a>
            } @else {
              <span
                [class]="textClasses"
                [attr.aria-label]="entry.item.iconOnly ? entry.item.label : null"
                [attr.title]="entry.item.label"
              >
                @if (entry.item.icon) {
                  <wi-icon [name]="entry.item.icon" size="sm" />
                }
                @if (!entry.item.iconOnly) {
                  <span class="truncate">{{ entry.item.label }}</span>
                }
              </span>
            }
            @if (!entry.current) {
              <span [class]="separatorClasses" aria-hidden="true">
                <svg class="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
})
export class WiBreadcrumbComponent {
  protected readonly navClasses = 'wi-breadcrumb__nav';
  protected readonly listClasses = LIST_CLASSES;
  protected readonly itemClasses = ITEM_CLASSES;
  protected readonly linkClasses = LINK_CLASSES;
  protected readonly textClasses = TEXT_CLASSES;
  protected readonly currentClasses = CURRENT_CLASSES;
  protected readonly separatorClasses = SEPARATOR_CLASSES;

  /** Segmentos de la ruta. Label, href e icono los aporta la app. */
  readonly items = input<readonly WiBreadcrumbItem[]>([]);

  /** Nombre accesible de la nav (localizable en la app). */
  readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' });

  /**
   * Clic en un segmento con `href` que no es la página actual.
   * En clic izquierdo sin modificadores se evita la navegación nativa (SPA).
   */
  readonly itemClick = output<WiBreadcrumbItem>();

  protected readonly viewItems = computed((): readonly WiBreadcrumbItemView[] => {
    const items = this.items();
    const lastIndex = items.length - 1;
    return items.map((item, index) => ({
      item,
      current: index === lastIndex,
    }));
  });

  protected onLinkClick(event: MouseEvent, item: WiBreadcrumbItem): void {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    const href = item.href;
    if (href && isExternalHref(href)) {
      this.itemClick.emit(item);
      return;
    }
    event.preventDefault();
    this.itemClick.emit(item);
  }
}
