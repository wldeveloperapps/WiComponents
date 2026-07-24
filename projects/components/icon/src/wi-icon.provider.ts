import { makeEnvironmentProviders, type EnvironmentProviders } from '@angular/core';

import { WI_ICONS } from './wi-icon.tokens';
import type { WiIconRegistry } from './wi-icon.types';

/**
 * Registra iconos en el injector de entorno.
 * Varias llamadas se combinan (`multi`); el último registro gana en colisiones de nombre
 * y las variantes se fusionan dentro del mismo nombre.
 *
 * @example
 * ```ts
 * provideWiIcons({
 *   home: { outline: homeOutline, solid: homeSolid },
 *   azure: { solid: azureGlyph },
 * });
 * ```
 */
export function provideWiIcons(icons: WiIconRegistry): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: WI_ICONS,
      useValue: icons,
      multi: true,
    },
  ]);
}
