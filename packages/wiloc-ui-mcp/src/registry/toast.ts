/**
 * Registry seed for @wiloc/ui-mcp (paquete previsto en packages/wiloc-ui-mcp).
 * Documenta solo API pública — no Spartan ni rutas internas.
 */
export const wiToastRegistryEntry = {
  name: 'toast',
  selector: 'wi-toaster',
  entryPoint: '@wiloc/ui/overlays',
  status: 'experimental' as const,
  exports: [
    'WiToasterComponent',
    'WiToast',
    'wiToast',
    'WiToastId',
    'WiToastOptions',
    'WiToastPosition',
    'WiToastTheme',
    'WiToastAction',
    'WiToastCancel',
    'WiToastPromiseMessages',
    'WiOverlaysI18n',
    'provideWiOverlaysI18n',
  ],
  inputs: [
    {
      name: 'theme',
      type: "WiToastTheme ('auto' | 'light' | 'dark' | 'system')",
      default: 'auto',
      description:
        'auto (recomendado): sigue .wi-dark en <html>. light/dark/system fuerzan el viewport sonner. Colores de superficie vía tokens Wi.',
    },
    {
      name: 'position',
      type: 'WiToastPosition',
      default: 'top-right',
      description:
        'Posición en el viewport (el host se porta a document.body): top-left | top-center | top-right | bottom-left | bottom-center | bottom-right',
    },
    {
      name: 'richColors',
      type: 'boolean',
      default: false,
      description: 'Aplica colores semánticos (success/error/warning/info) a los tipos',
    },
    {
      name: 'closeButton',
      type: 'boolean',
      default: true,
      description: 'Muestra botón cerrar en los toasts',
    },
    {
      name: 'duration',
      type: 'number',
      default: 4000,
      description: 'Duración por defecto en ms',
    },
    {
      name: 'visibleToasts',
      type: 'number',
      default: 5,
      description: 'Máximo de toasts visibles a la vez (el resto queda en cola)',
    },
    {
      name: 'expand',
      type: 'boolean',
      default: true,
      description:
        'Apila toasts expandídos (uno debajo de otro). false → stack colapsado de Sonner',
    },
    {
      name: 'invert',
      type: 'boolean',
      default: false,
      description: 'Invierte contraste del toast',
    },
    {
      name: 'offset',
      type: 'string | number | null',
      default: null,
      description: 'Offset desde el borde del viewport',
    },
    {
      name: 'hotKey',
      type: 'string[]',
      default: "['altKey', 'KeyT']",
      description: 'Atajo para enfocar el área de notificaciones',
    },
  ],
  i18n: {
    provider: 'provideWiOverlaysI18n',
    fields: [
      {
        name: 'toastCloseLabel',
        description:
          'aria-label del botón cerrar de cada toast (Brain hardcodea inglés; wi-toaster lo sustituye)',
        default: 'Close toast',
      },
      {
        name: 'toastRegionLabel',
        description:
          'Prefijo del aria-label de la región de notificaciones (se concatena con el hotkey, p. ej. Notificaciones Alt+T)',
        default: 'Notifications',
      },
    ],
    productCopy:
      'Título, descripción, action/cancel y mensajes de promise vía wiToast / WiToast (API imperativa — la app)',
  },
  outputs: [],
  variants: [
    { name: 'default', description: 'wiToast(message) / wiToast.message' },
    { name: 'success', description: 'wiToast.success' },
    { name: 'info', description: 'wiToast.info' },
    { name: 'warning', description: 'wiToast.warning' },
    { name: 'error', description: 'wiToast.error' },
    { name: 'loading', description: 'wiToast.loading' },
    { name: 'promise', description: 'wiToast.promise(promise, { loading, success, error })' },
  ],
  parts: [
    {
      selector: 'wi-toaster',
      description: 'Host global (una vez en el root). Disparar con wiToast o inject(WiToast).',
    },
  ],
  keyboard: [
    'Alt+T enfoca el área de notificaciones (configurable con hotKey)',
    'Escape colapsa el stack si el foco está en el toaster',
    'Tab / foco en toast; botón cerrar y acciones accesibles',
  ],
  a11yNotes:
    'Cada toast: role=status, aria-atomic, aria-live polite (assertive si important). Viewport vía CDK Overlay en document.body. theme=auto sigue .wi-dark. Copy de producto vía wiToast (app i18n). Chrome a11y: provideWiOverlaysI18n.toastCloseLabel / toastRegionLabel (Brain hardcodea inglés; wi-toaster lo sustituye). Importar @wiloc/ui/styles/toast.css (o styles/index.css).',
  example: {
    import: `import {
  WiToasterComponent,
  wiToast,
  WiToast,
  provideWiOverlaysI18n,
} from '@wiloc/ui/overlays';

provideWiOverlaysI18n({
  toastCloseLabel: () => 'Cerrar notificación',
  toastRegionLabel: () => 'Notificaciones',
});

// Root: <wi-toaster />
wiToast.success('Guardado', { description: 'El registro se actualizó' });
inject(WiToast).error('Error', { important: true });`,
    template: `<router-outlet />
<wi-toaster />`,
  },
} as const;
