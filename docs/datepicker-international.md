# Datepicker: fechas internacionales y API

Checklist de consumo de `wi-datepicker` / `wi-date-range` (`@wldeveloperapps/ui/forms`) cuando las apps se despliegan en varios países.

El control **captura componentes** (día / hora del device). **No adivina** la zona horaria.

Helpers públicos: `toLocalDateString`, `fromLocalDateString`, `formatWiDate`, `formatWiDateRange`, `datepickerValueToUtcIso`, `utcIsoToDatepickerValue`, `requireTimeZoneId`, `provideWiTimeZone`, `injectWiTimeZoneId`, etc.

---

## 5 reglas

### 1. Clasifica el campo antes de codear

¿**Solo día (civil)** o **momento con hora (instante)**?

Si no lo sabes, no elijas el contrato API todavía.

| Semántica                        | API                        | UI                           |
| -------------------------------- | -------------------------- | ---------------------------- |
| Cumpleaños, día de informe, baja | `YYYY-MM-DD`               | `wi-datepicker` sin hora     |
| Cita, deadline, evento de planta | Instant UTC + `timeZoneId` | `wi-datepicker` + `showTime` |
| Periodo civil (filtros)          | dos `YYYY-MM-DD`           | `wi-date-range` (un input)   |

### 2. Civil → siempre `YYYY-MM-DD`

Serializa con año/mes/día del valor elegido:

```ts
import { toLocalDateString } from '@wldeveloperapps/ui/forms';

toLocalDateString(date); // "2026-07-15"
```

**Nunca** `toISOString()` ni `JSON.stringify(date)` para un día civil.

### 3. Civil → parsea sin el constructor string

```ts
import { fromLocalDateString } from '@wldeveloperapps/ui/forms';

fromLocalDateString('2026-07-15'); // Date a medianoche local (para el picker)
```

**Prohibido:** `new Date('2026-07-15')` (UTC midnight → día incorrecto en muchas TZ).

### 4. Con hora → obliga `timeZoneId`

Los números del picker (día + HH:MM) se interpretan en esa TZ (usuario o **site** en IIoT).

```ts
import {
  datepickerValueToUtcIso,
  provideWiTimeZone,
  injectWiTimeZoneId,
  requireTimeZoneId,
  utcIsoToDatepickerValue,
} from '@wldeveloperapps/ui/forms';

// Bootstrap / layout del site
provideWiTimeZone(site.timeZoneId);

// Al serializar
const tz = requireTimeZoneId(injectWiTimeZoneId() ?? site.timeZoneId);
const iso = datepickerValueToUtcIso(pickerDate, tz); // "...Z"
const again = utcIsoToDatepickerValue(iso, tz);
```

Al API: Instant UTC (ISO con `Z` o epoch). Sin TZ → error o solo modo civil.

`provideWiTimeZone` **no** reinterpreta el `Date` del control (sigue naive). Solo aporta el default IANA del contexto.

### 5. La lib convierte; la app decide

- `@wldeveloperapps/ui/forms` expone helpers/tipos (`WiLocalDateString`, `WiTimeZoneId`, `WiZonedDateTimeParts`, `WiDisplayDateFormat`).
- La **app** elige semántica por campo y pasa `timeZoneId` (en IIoT: TZ del site).

---

## Display vs serialización

| Concern | API |
| --- | --- |
| Texto del trigger | `displayFormat="YYYY/MM/DD"` o `formatDate` (callback gana) |
| Payload civil | `toLocalDateString` → `YYYY-MM-DD` |
| Payload con hora | `datepickerValueToUtcIso(value, tz)` |

`formatWiDate` / `formatWiDateRange` son helpers puros de UI. No usarlos como contrato HTTP.

---

## `wi-date-range` (un input)

- Un trigger: `09/09/2026 - 16/09/2026`.
- Calendario de rango (1.er clic = inicio, 2.º = fin).
- Models `start` / `end` independientes.
- `showTime`: dos grupos HH:MM en el mismo panel.
- Validar `start ≤ end` en la app/back.

```html
<wi-date-range
  [(start)]="from"
  [(end)]="to"
  displayFormat="DD/MM/YYYY"
  placeholder="Selecciona un rango…"
/>
```

---

## Bonus al implementar

- Tests del mapper con al menos `Europe/Madrid`, `America/Lima`, `Asia/Singapore` (y DST donde aplique).
- Documenta en la app que el control no “adivina” la zona: captura componentes; la política TZ vive en el mapper / `provideWiTimeZone`.
- Locale de calendario: `provideWiCalendarI18n` (copy de la app), independiente de la serialización y del `displayFormat`.

---

## Qué no hace `wi-datepicker` / `wi-date-range`

- No serializa HTTP.
- No conoce IANA TZ del site salvo que la app provea `provideWiTimeZone`.
- `showTime=false` → `Date` a **00:00:00 local del device**, no un tipo “PlainDate” nativo.
- `displayFormat` no cambia el valor del model.
