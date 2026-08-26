import { InjectionToken, type InputSignal } from '@angular/core';

import type { WiPopoverSize } from './wi-popover.types';

/** Tamaño del panel; lo provee `wi-popover` para que `wi-popover-content` lo lea tras el portal. */
export const WI_POPOVER_SIZE = new InjectionToken<InputSignal<WiPopoverSize>>('WI_POPOVER_SIZE');
