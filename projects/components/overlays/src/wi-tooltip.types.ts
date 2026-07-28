/**
 * Posición preferida del tooltip (CDK Overlay puede hacer flip si no cabe).
 */
export type WiTooltipPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Opciones del grupo de tooltips (skip-delay entre hermanos).
 */
export interface WiTooltipGroupOptions {
  /** Ms tras cerrar el último tooltip durante los cuales el siguiente abre al instante. `0` desactiva. */
  skipDelayDuration: number;
}
