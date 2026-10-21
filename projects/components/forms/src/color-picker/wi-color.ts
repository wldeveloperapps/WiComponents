/** HSV del selector. El tono se conserva cuando el color no tiene saturación. */
export interface WiHsv {
  /** 0–359 */
  readonly h: number;
  /** 0–100 */
  readonly s: number;
  /** 0–100 */
  readonly v: number;
}

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

/**
 * Hex opaco normalizado (`#rrggbb`) o `null`.
 * Acepta `#rgb`, `#rrggbb` y los mismos sin almohadilla. No acepta alfa.
 */
export function normalizeWiColor(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const match = HEX.exec(value.trim());
  if (!match?.[1]) {
    return null;
  }
  let body = match[1].toLowerCase();
  if (body.length === 3) {
    body = `${body[0]}${body[0]}${body[1]}${body[1]}${body[2]}${body[2]}`;
  }
  return `#${body}`;
}

/** `true` si `value` se puede guardar como hex opaco. */
export function isWiColor(value: unknown): value is string {
  return normalizeWiColor(value) !== null;
}

export function clampPercent(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function clampHue(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  const rounded = Math.round(value);
  return ((rounded % 360) + 360) % 360;
}

/** Saturación y brillo a partir de un punto dentro del plano (el origen es la esquina superior izquierda). */
export function svFromPointer(
  offsetX: number,
  offsetY: number,
  width: number,
  height: number,
): Pick<WiHsv, 's' | 'v'> {
  const s = width > 0 ? (offsetX / width) * 100 : 0;
  const v = height > 0 ? (1 - offsetY / height) * 100 : 0;
  return { s: clampPercent(s), v: clampPercent(v) };
}

/**
 * Mueve el plano con el teclado.
 * Izquierda/derecha: saturación. Arriba/abajo: brillo. Shift avanza de 10 en 10.
 * Home/End fijan la saturación. PageUp/PageDown fijan el brillo.
 */
export function stepSv(hsv: WiHsv, key: string, shiftKey: boolean): WiHsv | null {
  const delta = shiftKey ? 10 : 1;
  switch (key) {
    case 'ArrowLeft':
      return { ...hsv, s: clampPercent(hsv.s - delta) };
    case 'ArrowRight':
      return { ...hsv, s: clampPercent(hsv.s + delta) };
    case 'ArrowDown':
      return { ...hsv, v: clampPercent(hsv.v - delta) };
    case 'ArrowUp':
      return { ...hsv, v: clampPercent(hsv.v + delta) };
    case 'Home':
      return { ...hsv, s: 0 };
    case 'End':
      return { ...hsv, s: 100 };
    case 'PageDown':
      return { ...hsv, v: 0 };
    case 'PageUp':
      return { ...hsv, v: 100 };
    default:
      return null;
  }
}

export function hexToHsv(hex: string, fallbackHue = 0): WiHsv {
  const rgb = parseRgb(hex);
  if (!rgb) {
    return { h: clampHue(fallbackHue), s: 100, v: 100 };
  }

  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let hue = fallbackHue;
  if (delta !== 0) {
    if (max === r) {
      hue = ((g - b) / delta) % 6;
    } else if (max === g) {
      hue = (b - r) / delta + 2;
    } else {
      hue = (r - g) / delta + 4;
    }
    hue *= 60;
    if (hue < 0) {
      hue += 360;
    }
  }

  const saturation = max === 0 ? 0 : (delta / max) * 100;
  return { h: clampHue(hue), s: clampPercent(saturation), v: clampPercent(max * 100) };
}

export function hsvToHex(hsv: WiHsv): string {
  const h = clampHue(hsv.h);
  const s = clampPercent(hsv.s) / 100;
  const v = clampPercent(hsv.v) / 100;
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let rp = 0;
  let gp = 0;
  let bp = 0;
  if (h < 60) {
    rp = c;
    gp = x;
  } else if (h < 120) {
    rp = x;
    gp = c;
  } else if (h < 180) {
    gp = c;
    bp = x;
  } else if (h < 240) {
    gp = x;
    bp = c;
  } else if (h < 300) {
    rp = x;
    bp = c;
  } else {
    rp = c;
    bp = x;
  }

  return `#${channel((rp + m) * 255)}${channel((gp + m) * 255)}${channel((bp + m) * 255)}`;
}

function parseRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = normalizeWiColor(hex);
  if (!normalized) {
    return null;
  }
  return {
    r: Number.parseInt(normalized.slice(1, 3), 16),
    g: Number.parseInt(normalized.slice(3, 5), 16),
    b: Number.parseInt(normalized.slice(5, 7), 16),
  };
}

function channel(value: number): string {
  return Math.round(value).toString(16).padStart(2, '0');
}
