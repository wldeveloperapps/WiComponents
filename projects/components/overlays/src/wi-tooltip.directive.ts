import { Directive, type Provider } from '@angular/core';
import {
  BrnTooltip,
  type BrnTooltipPosition,
  provideBrnTooltipDefaultOptions,
  provideBrnTooltipGroup,
} from '@spartan-ng/brain/tooltip';

import type { WiTooltipGroupOptions, WiTooltipPosition } from './wi-tooltip.types';

const TOOLTIP_CONTENT_CLASSES = [
  'wi-tooltip',
  'z-50',
  'w-fit',
  'max-w-xs',
  'rounded-control-sm',
  'bg-on-surface',
  'px-3',
  'py-1.5',
  'text-xs',
  'text-balance',
  'text-surface',
  'shadow-md',
  'data-[state=open]:animate-in',
  'data-[state=open]:fade-in-0',
  'data-[state=open]:zoom-in-95',
  'data-[state=instant-open]:animate-in',
  'data-[state=instant-open]:fade-in-0',
  'data-[state=closed]:animate-out',
  'data-[state=closed]:fade-out-0',
  'data-[state=closed]:zoom-out-95',
  'data-[side=bottom]:slide-in-from-top-2',
  'data-[side=left]:slide-in-from-right-2',
  'data-[side=right]:slide-in-from-left-2',
  'data-[side=top]:slide-in-from-bottom-2',
].join(' ');

const TOOLTIP_SVG_CLASSES = 'fill-on-surface z-50 block';

const ARROW_POSITION_CLASSES: Record<WiTooltipPosition, string> = {
  top: 'absolute bottom-0 left-[calc(50%-5px)] translate-y-full',
  bottom: 'absolute -top-2.5 left-[calc(50%-5px)] translate-y-0 rotate-180',
  left: 'absolute -end-2.5 top-[calc(50%-5px)] translate-y-0 rotate-270 rtl:-rotate-270',
  right: 'absolute -start-2.5 top-[calc(50%-5px)] translate-y-0 rotate-90 rtl:-rotate-90',
};

/**
 * Tooltip del design system (`[wiTooltip]`).
 *
 * - Contenido: string o `TemplateRef` vía `wiTooltip`.
 * - Hover y focus en el host; no usar como única fuente de información crítica.
 * - En botones icon-only el nombre accesible va en el botón (`aria-label` / `ariaLabel`).
 * - Usar `tooltipDisabled` (no `disabled`) para no chocar con el atributo nativo del control.
 * - El host debe generar caja CSS (evitar `display: contents`): si no, el overlay se ancla en (0,0).
 */
@Directive({
  selector: '[wiTooltip]',
  providers: [
    provideBrnTooltipDefaultOptions({
      showDelay: 150,
      hideDelay: 100,
      tooltipContentClasses: TOOLTIP_CONTENT_CLASSES,
      svgClasses: TOOLTIP_SVG_CLASSES,
      arrowClasses: (position: BrnTooltipPosition) => ARROW_POSITION_CLASSES[position],
    }),
  ],
  hostDirectives: [
    {
      directive: BrnTooltip,
      inputs: ['brnTooltip: wiTooltip', 'position', 'showDelay', 'hideDelay', 'tooltipDisabled'],
      outputs: ['show', 'hide'],
    },
  ],
})
export class WiTooltipDirective {}

/**
 * Coordina el skip-delay entre tooltips hermanos (p. ej. toolbar).
 * Proveer en el contenedor que agrupa los triggers.
 */
export function provideWiTooltipGroup(options?: Partial<WiTooltipGroupOptions>): Provider[] {
  return provideBrnTooltipGroup(options);
}
