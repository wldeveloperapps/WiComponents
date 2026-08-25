import { InjectionToken, type InputSignal } from '@angular/core';

import type { WiDialogSize } from './wi-dialog.types';

/** Tamaño del panel; lo provee `wi-dialog` para que `wi-dialog-content` lo lea tras el portal. */
export const WI_DIALOG_SIZE = new InjectionToken<InputSignal<WiDialogSize>>('WI_DIALOG_SIZE');
