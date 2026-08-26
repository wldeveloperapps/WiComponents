/**
 * Paso del stepper. Label, icono e id los aporta la app (i18n + `provideWiIcons`).
 */
export interface WiStepperStep {
  /** Identificador estable usado en `value` y `[wiStepperPanel]`. */
  id: string;
  /** Texto visible del paso (localizable en la app). */
  label: string;
  /** Nombre del icono registrado con `provideWiIcons`. */
  icon: string;
  /** El paso no se puede seleccionar. */
  disabled?: boolean;
}

/** Orientación del listado de pasos. `vertical` es el layout de alta / wizard. */
export type WiStepperOrientation = 'vertical' | 'horizontal';

/** Estado visual derivado de `value` (no lo envía la app). */
export type WiStepperStepState = 'complete' | 'current' | 'upcoming';
