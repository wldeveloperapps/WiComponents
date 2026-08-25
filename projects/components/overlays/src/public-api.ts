export type { WiTooltipGroupOptions, WiTooltipPosition } from './tooltip/wi-tooltip.types';
export { provideWiTooltipGroup, WiTooltipDirective } from './tooltip/wi-tooltip.directive';

export type { WiDialogSize, WiDialogState } from './dialog/wi-dialog.types';
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
} from './dialog/wi-dialog.component';

export type {
  WiConfirmDialogConfirmVariant,
  WiConfirmDialogSize,
  WiConfirmDialogState,
} from './confirm-dialog/wi-confirm-dialog.types';
export {
  WiConfirmDialogComponent,
  WiConfirmDialogTriggerDirective,
} from './confirm-dialog/wi-confirm-dialog.component';

export type { WiOverlaysI18n } from './wi-overlays.i18n';
export { provideWiOverlaysI18n } from './wi-overlays.i18n';

export type { WiMenuAlign, WiMenuItemVariant, WiMenuSide } from './menu/wi-menu.types';
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
} from './menu/wi-menu.component';

export type {
  WiToastAction,
  WiToastCancel,
  WiToastId,
  WiToastOptions,
  WiToastPosition,
  WiToastPromiseMessages,
  WiToastTheme,
} from './toast/wi-toast.types';
export { wiToast } from './toast/wi-toast';
export { WiToast } from './toast/wi-toast.service';
export { WiToasterComponent } from './toast/wi-toaster.component';

export type { WiSpeedDialDirection, WiSpeedDialItem } from './speed-dial/wi-speed-dial.types';
export { WiSpeedDialComponent } from './speed-dial/wi-speed-dial.component';
