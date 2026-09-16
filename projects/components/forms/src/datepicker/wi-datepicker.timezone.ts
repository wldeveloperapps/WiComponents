import { inject, InjectionToken, type Provider } from '@angular/core';

import { requireTimeZoneId, type WiTimeZoneId } from './wi-date';

const WI_TIME_ZONE_ID = new InjectionToken<WiTimeZoneId>('WI_TIME_ZONE_ID');

/**
 * Provee la zona IANA del site (o del contexto de la app) para mapear
 * valores naive del datepicker ↔ Instant UTC.
 *
 * El control **no** reinterpreta el `Date` con esta TZ (sigue siendo naive).
 * La app la usa al serializar: `datepickerValueToUtcIso(value, requireTimeZoneId(injectWiTimeZoneId()))`.
 *
 * @example
 * ```ts
 * provideWiTimeZone('America/Lima')
 * ```
 */
export function provideWiTimeZone(timeZoneId: WiTimeZoneId): Provider {
  const zone = requireTimeZoneId(timeZoneId, 'provideWiTimeZone');
  return { provide: WI_TIME_ZONE_ID, useValue: zone };
}

/**
 * Lee la TZ del site si está proveída; `null` si no hay provider.
 */
export function injectWiTimeZoneId(): WiTimeZoneId | null {
  return inject(WI_TIME_ZONE_ID, { optional: true }) ?? null;
}
