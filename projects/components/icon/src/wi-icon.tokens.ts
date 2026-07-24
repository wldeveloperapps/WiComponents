import { InjectionToken } from '@angular/core';

import type { WiIconRegistry } from './wi-icon.types';

/**
 * Token multi para registros de iconos.
 * Preferir `provideWiIcons` frente a proveer el token manualmente.
 */
export const WI_ICONS = new InjectionToken<readonly WiIconRegistry[]>('WI_ICONS');
