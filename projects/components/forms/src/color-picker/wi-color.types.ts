/** Tamaño del trigger, alineado con el resto de controles. */
export type WiColorPickerSize = 'sm' | 'md' | 'lg';

/**
 * Nombres accesibles del panel. Los pone la app (i18n).
 * Si falta uno, el control usa un nombre técnico en inglés.
 */
export interface WiColorPickerLabels {
  /** Nombre del diálogo. */
  dialog?: string;
  /** Plano de saturación y brillo. */
  palette?: string;
  /** Deslizador de tono. */
  hue?: string;
  /** Campo hexadecimal. */
  hex?: string;
  /** Valor vacío, para el texto accesible del plano. */
  empty?: string;
  /** Botón del cuentagotas. Solo se muestra si el navegador tiene EyeDropper. */
  eyedropper?: string;
}
