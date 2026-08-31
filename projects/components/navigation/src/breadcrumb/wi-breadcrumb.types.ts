/**
 * Segmento de la miga. Label, href e icono los aporta la app (i18n + `provideWiIcons`).
 */
export interface WiBreadcrumbItem {
  /** Identificador estable para `@for` track. */
  id: string;
  /** Texto visible (o nombre accesible si `iconOnly`). Localizable en la app. */
  label: string;
  /** Destino. Omitir en la página actual (último ítem). */
  href?: string;
  /** Nombre del icono registrado con `provideWiIcons`. */
  icon?: string;
  /** Oculta el label (sigue siendo el nombre accesible). Típico del home. */
  iconOnly?: boolean;
}
