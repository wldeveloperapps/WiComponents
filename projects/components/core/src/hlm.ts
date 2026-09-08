import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Fusiona clases Tailwind. Las posteriores ganan conflictos
 * (`p-0` pisa `py-4`, `overflow-visible` pisa `overflow-hidden`).
 */
export function hlm(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
