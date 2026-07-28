/** Tamaño del control, alineado con `wi-input` / `wi-select`. */
export type WiDatepickerSize = 'sm' | 'md' | 'lg';

/** Día de la semana (0 = domingo … 6 = sábado). */
export type WiWeekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Predicado para deshabilitar días concretos en el calendario. */
export type WiDateDisabled = (date: Date) => boolean;

/** Formateador del valor mostrado en el trigger. */
export type WiFormatDate = (date: Date) => string;
