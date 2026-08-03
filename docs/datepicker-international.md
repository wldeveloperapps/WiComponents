# Datepicker: fechas internacionales y API

Checklist de consumo de `wi-datepicker` / `wi-date-range` (`@wiloc/ui/forms`) cuando las apps se despliegan en varios países.

El control **captura componentes** (día / hora del device). **No adivina** la zona horaria.

Helpers públicos: `toLocalDateString`, `fromLocalDateString`, `datepickerValueToUtcIso`, `utcIsoToDatepickerValue`, `requireTimeZoneId`, etc.

---

## 5 reglas

### 1. Clasifica el campo antes de codear

¿**Solo día (civil)** o **momento con hora (instante)**?

Si no lo sabes, no elijas el contrato API todavía.

| Semántica                        | API                        | UI                           |
| -------------------------------- | -------------------------- | ---------------------------- |
| Cumpleaños, día de informe, baja | `YYYY-MM-DD`               | `wi-datepicker` sin hora     |
| Cita, deadline, evento de planta | Instant UTC + `timeZoneId` | `wi-datepicker` + `showTime` |

### 2. Civil → siempre `YYYY-MM-DD`

Serializa con año/mes/día del valor elegido:

```ts
import { toLocalDateString } from '@wiloc/ui/forms';

toLocalDateString(date); // "2026-07-15"
```

**Nunca** `toISOString()` ni `JSON.stringify(date)` para un día civil.

### 3. Civil → parsea sin el constructor string

```ts
import { fromLocalDateString } from '@wiloc/ui/forms';

fromLocalDateString('2026-07-15'); // Date a medianoche local (para el picker)
```

**Prohibido:** `new Date('2026-07-15')` (UTC midnight → día incorrecto en muchas TZ).

### 4. Con hora → obliga `timeZoneId`

Los números del picker (día + HH:MM) se interpretan en esa TZ (usuario o **site** en IIoT).

```ts
import {
  datepickerValueToUtcIso,
  requireTimeZoneId,
  utcIsoToDatepickerValue,
} from '@wiloc/ui/forms';

const tz = requireTimeZoneId(site.timeZoneId); // sin TZ → error
const iso = datepickerValueToUtcIso(pickerDate, tz); // "...Z"
const again = utcIsoToDatepickerValue(iso, tz);
```

Al API: Instant UTC (ISO con `Z` o epoch). Sin TZ → error o solo modo civil.

### 5. La lib convierte; la app decide

- `@wiloc/ui/forms` expone helpers/tipos (`WiLocalDateString`, `WiTimeZoneId`, `WiZonedDateTimeParts`).
- La **app** elige semántica por campo y pasa `timeZoneId` (en IIoT: TZ del site).

---

## Bonus al implementar

- Tests del mapper con al menos `Europe/Madrid`, `America/Lima`, `Asia/Singapore` (y DST donde aplique).
- Documenta en la app que el control no “adivina” la zona: captura componentes; la política TZ vive en el mapper.
- Locale de calendario: `provideWiCalendarI18n` (copy de la app), independiente de la serialización.

---

## Qué no hace `wi-datepicker`

- No serializa HTTP.
- No conoce IANA TZ del site.
- `showTime=false` → `Date` a **00:00:00 local del device**, no un tipo “PlainDate” nativo.
- El rango (`wi-date-range`) son dos valores independientes: valida `start ≤ end` en la app/back.
