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

export type {
  WiConfirmDialogConfirmVariant,
  WiConfirmDialogSize,
  WiConfirmDialogState,
} from './wi-confirm-dialog.types';
export {
  WiConfirmDialogComponent,
  WiConfirmDialogTriggerDirective,
} from './wi-confirm-dialog.component';

export type { WiOverlaysI18n } from './wi-overlays.i18n';
export { provideWiOverlaysI18n } from './wi-overlays.i18n';

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

export type {
  WiToastAction,
  WiToastCancel,
  WiToastId,
  WiToastOptions,
  WiToastPosition,
  WiToastPromiseMessages,
  WiToastTheme,
} from './wi-toast.types';
export { wiToast } from './wi-toast';
export { WiToast } from './wi-toast.service';
export { WiToasterComponent } from './wi-toaster.component';
