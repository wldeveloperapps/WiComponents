import {
  datepickerValueToUtcIso,
  fromLocalDateString,
  isLocalDateString,
  requireTimeZoneId,
  toLocalDateString,
  utcIsoToDatepickerValue,
  zonedPartsToUtcDate,
} from '../../forms/src/wi-date';

describe('wi-date helpers', () => {
  describe('civil local date', () => {
    it('serializes with local Y/M/D (not UTC)', () => {
      // 15 jul 2026 00:00 local
      const date = new Date(2026, 6, 15, 0, 0, 0, 0);
      expect(toLocalDateString(date)).toBe('2026-07-15');
      // En TZ con offset ≠ 0, toISOString().slice(0,10) diferiría; el helper siempre usa getters locales.
      expect(toLocalDateString(date)).toBe(
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
      );
    });

    it('parses YYYY-MM-DD as local midnight without string Date constructor', () => {
      const date = fromLocalDateString('2026-07-15');
      expect(date.getFullYear()).toBe(2026);
      expect(date.getMonth()).toBe(6);
      expect(date.getDate()).toBe(15);
      expect(date.getHours()).toBe(0);
    });

    it('rejects invalid civil strings', () => {
      expect(isLocalDateString('2026-07-15')).toBe(true);
      expect(isLocalDateString('2026-02-30')).toBe(false);
      expect(isLocalDateString('15/07/2026')).toBe(false);
      expect(() => fromLocalDateString('2026-13-01')).toThrow();
    });
  });

  describe('timeZoneId', () => {
    it('requireTimeZoneId throws when missing', () => {
      expect(() => requireTimeZoneId(undefined)).toThrow(/timeZoneId is required/);
      expect(() => requireTimeZoneId('')).toThrow(/timeZoneId is required/);
      expect(requireTimeZoneId('Europe/Madrid')).toBe('Europe/Madrid');
    });
  });

  describe('zoned datetime (Madrid / Lima / Singapore)', () => {
    it('round-trips wall time in Europe/Madrid', () => {
      const utc = zonedPartsToUtcDate({
        year: 2026,
        month: 7,
        day: 15,
        hour: 14,
        minute: 30,
        timeZoneId: 'Europe/Madrid',
      });
      // CEST = UTC+2 → 12:30Z
      expect(utc.toISOString()).toBe('2026-07-15T12:30:00.000Z');

      const naive = utcIsoToDatepickerValue(utc.toISOString(), 'Europe/Madrid');
      expect(naive.getFullYear()).toBe(2026);
      expect(naive.getMonth()).toBe(6);
      expect(naive.getDate()).toBe(15);
      expect(naive.getHours()).toBe(14);
      expect(naive.getMinutes()).toBe(30);
    });

    it('interprets picker components in America/Lima', () => {
      // Picker “naive”: 15 jul 2026 10:00 (getters locales del Date)
      const picker = new Date(2026, 6, 15, 10, 0, 0, 0);
      const iso = datepickerValueToUtcIso(picker, 'America/Lima');
      // PET = UTC-5 → 15:00Z
      expect(iso).toBe('2026-07-15T15:00:00.000Z');
    });

    it('interprets picker components in Asia/Singapore', () => {
      const picker = new Date(2026, 6, 15, 9, 15, 0, 0);
      const iso = datepickerValueToUtcIso(picker, 'Asia/Singapore');
      // SGT = UTC+8 → 01:15Z
      expect(iso).toBe('2026-07-15T01:15:00.000Z');
    });
  });
});
