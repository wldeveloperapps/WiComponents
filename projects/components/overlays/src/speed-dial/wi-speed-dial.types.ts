/**
 * Acción del speed dial. Icono, textos y significado los aporta la app.
 */
export interface WiSpeedDialItem {
  /** Identificador estable emitido en `itemClick`. */
  id: string;
  /** Nombre del icono registrado con `provideWiIcons`. */
  icon: string;
  /** Nombre accesible del botón. */
  label: string;
  /** Deshabilita la acción. */
  disabled?: boolean;
}

/** Dirección en la que se despliegan las acciones respecto al ancla. */
export type WiSpeedDialDirection = 'up' | 'down' | 'left' | 'right';
