export type { WiTooltipGroupOptions, WiTooltipPosition } from './wi-tooltip.types';
export { provideWiTooltipGroup, WiTooltipDirective } from './wi-tooltip.directive';

export type { WiDialogSize, WiDialogState } from './wi-dialog.types';
export {
  WiDialogCloseDirective,
  WiDialogComponent,
  WiDialogContentComponent,
  WiDialogDescriptionComponent,
  WiDialogFooterComponent,
  WiDialogHeaderComponent,
  WiDialogPortalDirective,
  WiDialogTitleComponent,
  WiDialogTriggerDirective,
} from './wi-dialog.component';

export type { WiMenuAlign, WiMenuItemVariant, WiMenuSide } from './wi-menu.types';
export {
  WiMenuComponent,
  /** @internal hostDirective — no usar en apps */
  WiMenuFocusOnHoverDirective,
  WiMenuGroupComponent,
  WiMenuItemDirective,
  WiMenuLabelComponent,
  /** @internal hostDirective — no usar en apps */
  WiMenuRadioCdkDirective,
  WiMenuRadioDirective,
  WiMenuSeparatorComponent,
  WiMenuTriggerDirective,
} from './wi-menu.component';
