/**
 * Helpers de fecha para mapear `wi-datepicker` ↔ API.
 *
 * El control captura componentes de calendario/reloj (Date “naive” del device).
 * No adivina la zona: la app decide semántica (civil vs instante) y, con hora,
 * aporta `timeZoneId` (IANA; en IIoT suele ser la TZ del site).
 */

/** Cadena de día civil `YYYY-MM-DD`. */
export type WiLocalDateString = string;

/** Identificador IANA (p. ej. `Europe/Madrid`, `America/Lima`). */
export type WiTimeZoneId = string;

/** Partes de fecha/hora en una zona concreta. `month` es 1–12. */
export interface WiZonedDateTimeParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second?: number;
  timeZoneId: WiTimeZoneId;
}

const LOCAL_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

/**
 * Serializa un `Date` del datepicker a día civil `YYYY-MM-DD`
 * usando año/mes/día locales del valor (nunca UTC / `toISOString`).
 */
export function toLocalDateString(date: Date): WiLocalDateString {
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  return `${year}-${month}-${day}`;
}

/**
 * Parsea `YYYY-MM-DD` a un `Date` a medianoche local del device
 * (apto para `wi-datepicker` sin `showTime`).
 *
 * @throws si el string no es un día civil válido
 */
export function fromLocalDateString(value: WiLocalDateString): Date {
  const match = LOCAL_DATE_RE.exec(value.trim());
  if (!match) {
    throw new Error(`Invalid WiLocalDateString: "${value}" (expected YYYY-MM-DD)`);
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    throw new Error(`Invalid calendar day: "${value}"`);
  }
  return date;
}

/** Type guard / validación de `YYYY-MM-DD` (día existente). */
export function isLocalDateString(value: string): value is WiLocalDateString {
  try {
    fromLocalDateString(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Exige un `timeZoneId` para flujos con hora.
 * Sin TZ → error (forzar modo civil o aportar zona).
 */
export function requireTimeZoneId(
  timeZoneId: string | null | undefined,
  context = 'datetime',
): WiTimeZoneId {
  const trimmed = timeZoneId?.trim();
  if (!trimmed) {
    throw new Error(
      `timeZoneId is required for ${context}. Use civil YYYY-MM-DD without time, or pass an IANA zone (e.g. site TZ).`,
    );
  }
  return trimmed;
}

/**
 * Lee los componentes que muestra el datepicker e interpreta esa pared
 * de reloj en `timeZoneId` → Instant UTC como `Date`.
 */
export function datepickerValueToUtcDate(value: Date, timeZoneId: WiTimeZoneId): Date {
  const zone = requireTimeZoneId(timeZoneId, 'datepickerValueToUtcDate');
  return zonedPartsToUtcDate({
    year: value.getFullYear(),
    month: value.getMonth() + 1,
    day: value.getDate(),
    hour: value.getHours(),
    minute: value.getMinutes(),
    second: value.getSeconds(),
    timeZoneId: zone,
  });
}

/** Igual que `datepickerValueToUtcDate` pero como ISO-8601 con `Z`. */
export function datepickerValueToUtcIso(value: Date, timeZoneId: WiTimeZoneId): string {
  return datepickerValueToUtcDate(value, timeZoneId).toISOString();
}

/**
 * Instant UTC → `Date` “naive” cuyas getters locales coinciden con la pared
 * de reloj en `timeZoneId` (para cargar el datepicker con `showTime`).
 */
export function utcDateToDatepickerValue(utc: Date, timeZoneId: WiTimeZoneId): Date {
  const parts = utcDateToZonedParts(utc, timeZoneId);
  return new Date(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second ?? 0,
    0,
  );
}

/** ISO/`Date` parseable → valor para el datepicker en la TZ dada. */
export function utcIsoToDatepickerValue(iso: string, timeZoneId: WiTimeZoneId): Date {
  const utc = new Date(iso);
  if (Number.isNaN(utc.getTime())) {
    throw new Error(`Invalid UTC instant: "${iso}"`);
  }
  return utcDateToDatepickerValue(utc, timeZoneId);
}

/** Partes en zona → Instant UTC. */
export function zonedPartsToUtcDate(parts: WiZonedDateTimeParts): Date {
  const zone = requireTimeZoneId(parts.timeZoneId, 'zonedPartsToUtcDate');
  const second = parts.second ?? 0;
  // Guess: treat components as UTC, then correct by the zone offset at that instant.
  let utcMs = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, second);
  for (let i = 0; i < 3; i += 1) {
    const asZone = utcDateToZonedParts(new Date(utcMs), zone);
    const asZoneMs = Date.UTC(
      asZone.year,
      asZone.month - 1,
      asZone.day,
      asZone.hour,
      asZone.minute,
      asZone.second ?? 0,
    );
    const wantedMs = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      second,
    );
    const delta = wantedMs - asZoneMs;
    if (delta === 0) {
      break;
    }
    utcMs += delta;
  }
  return new Date(utcMs);
}

/** Instant UTC → partes de pared de reloj en `timeZoneId`. */
export function utcDateToZonedParts(utc: Date, timeZoneId: WiTimeZoneId): WiZonedDateTimeParts {
  const zone = requireTimeZoneId(timeZoneId, 'utcDateToZonedParts');
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const bag: Record<string, string> = {};
  for (const part of formatter.formatToParts(utc)) {
    if (part.type !== 'literal') {
      bag[part.type] = part.value;
    }
  }
  return {
    year: Number(bag['year']),
    month: Number(bag['month']),
    day: Number(bag['day']),
    hour: Number(bag['hour']),
    minute: Number(bag['minute']),
    second: Number(bag['second'] ?? '0'),
    timeZoneId: zone,
  };
}
