import type { WiDocsTopic } from './types.js';

export const WI_DOCS_TOPICS: readonly WiDocsTopic[] = [
  {
    id: 'installation',
    title: 'Instalación de @wiloc/ui',
    body: `Instala el paquete alineado con esta versión del MCP (0.1.0-alpha.1). API experimental.

\`\`\`bash
pnpm add @wiloc/ui
# o desde el artefacto local:
pnpm add ./wiloc-ui-0.1.0-alpha.1.tgz
\`\`\`

Peers: Angular 22, @angular/aria, @angular/cdk, @angular/forms, @spartan-ng/brain, rxjs, clsx.
Tailwind v4 es peer opcional; las apps Wiloc lo usan para tokens.

Imports canónicos (nunca Spartan, nunca rutas src/):

\`\`\`ts
import { WiButtonComponent } from '@wiloc/ui/button';
import { WiInputComponent } from '@wiloc/ui/forms';
import { WiDialogComponent } from '@wiloc/ui/overlays';
import { WiTableComponent } from '@wiloc/ui/data-display';
import { provideWiIcons, WiIconComponent } from '@wiloc/ui/icon';
import { WI_DARK_CLASS } from '@wiloc/ui/core';
\`\`\`

CSS en la app (NO uses \`@wiloc/ui/styles/index.css\`; es Storybook).

Archivos:
- CSS global de la app (\`src/styles.css\` o \`styles.scss\`) registrado en \`angular.json\` → styles.
- \`postcss.config.json\` en la raíz: \`{ "plugins": { "@tailwindcss/postcss": {} } }\`.
- Si la app ya tiene hoja global (PrimeNG, etc.): AÑADE los @import; no dupliques Tailwind.

\`\`\`css
@layer theme, base, components, utilities;
@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/preflight.css' layer(base);
@import 'tailwindcss/utilities.css';
@import '@spartan-ng/brain/hlm-tailwind-preset.css';
@import '@wiloc/ui/styles/tokens.css';
@custom-variant dark (&:where(.wi-dark, .wi-dark *));
@source '../node_modules/@wiloc/ui/**/*.mjs';
@theme inline {
  --color-on-primary: var(--wi-color-on-primary);
  --color-primary-container: var(--wi-color-primary-container);
  --color-on-primary-container: var(--wi-color-on-primary-container);
  --color-on-secondary: var(--wi-color-on-secondary);
  --color-secondary-container: var(--wi-color-secondary-container);
  --color-on-secondary-container: var(--wi-color-on-secondary-container);
  --color-surface: var(--wi-color-surface);
  --color-on-surface: var(--wi-color-on-surface);
  --color-surface-variant: var(--wi-color-surface-variant);
  --color-on-surface-variant: var(--wi-color-on-surface-variant);
  --color-inverse-surface: var(--wi-color-inverse-surface);
  --color-inverse-on-surface: var(--wi-color-inverse-on-surface);
  --color-on-background: var(--wi-color-on-background);
  --color-outline: var(--wi-color-outline);
  --color-outline-variant: var(--wi-color-outline-variant);
  --color-error: var(--wi-color-error);
  --color-on-error: var(--wi-color-on-error);
  --color-error-container: var(--wi-color-error-container);
  --color-on-error-container: var(--wi-color-on-error-container);
  --color-warning: var(--wi-color-warning);
  --color-on-warning: var(--wi-color-on-warning);
  --color-success: var(--wi-color-success);
  --color-on-success: var(--wi-color-on-success);
  --radius-control: var(--wi-radius-md);
  --radius-control-sm: var(--wi-radius-sm);
  --radius-control-lg: var(--wi-radius-lg);
  --height-control-sm: var(--wi-control-height-sm);
  --height-control-md: var(--wi-control-height-md);
  --height-control-lg: var(--wi-control-height-lg);
}
\`\`\`

\`@source\` es relativo al archivo CSS. Con \`src/styles.css\`: \`../node_modules/@wiloc/ui/**/*.mjs\`.
Sin \`@theme inline\` las clases \`bg-primary\` / \`text-on-surface\` no existen.
Si usas tabs o toast: \`@import '@wiloc/ui/styles/tabs.css'\` y \`@import '@wiloc/ui/styles/toast.css'\`.
No importes \`@spartan-ng/brain\` ni Helm en plantillas de producto.`,
  },
  {
    id: 'tokens',
    title: 'Tokens semánticos',
    body: `Prefijo público: \`--wi-color-*\`. Constantes: \`WI_COLOR_TOKEN_PREFIX\`, \`WI_DARK_CLASS\` desde \`@wiloc/ui/core\`.

Dónde: importar \`@wiloc/ui/styles/tokens.css\` en el CSS global de la app + \`@theme inline\` (mapeo a Tailwind) + \`@custom-variant dark (&:where(.wi-dark, .wi-dark *));\` + \`@source\` a \`node_modules/@wiloc/ui/**/*.mjs\`.
NO uses \`@wiloc/ui/styles/index.css\`. PostCSS: \`postcss.config.json\` con \`@tailwindcss/postcss\`.

Usa clases Tailwind estáticas ligadas a tokens (\`bg-primary\`, \`text-on-surface\`, \`border-outline\`, \`rounded-control\`).
Prohibido: \`bg-\${color}\`, colores hex sueltos en componentes Wi, clases \`.p-*\` de Prime, \`.dark\` / \`data-theme\`.

Roles: primary, on-primary, primary-container, secondary, background, on-background, surface, on-surface, surface-variant, inverse-surface, outline, error, warning, success.

La librería no muta el DOM. La app aplica tema (\`WI_DARK_CLASS\` en \`<html>\`) y tokens vía CSS importado.
Tabs/toast: CSS extra \`@wiloc/ui/styles/tabs.css\` / \`toast.css\` si los usas.`,
  },
  {
    id: 'dark-mode',
    title: 'Tema oscuro (.wi-dark)',
    body: `El tema oscuro se activa con la clase \`wi-dark\` en un ancestro (recomendado: \`<html>\`).

\`\`\`ts
import { WI_DARK_CLASS } from '@wiloc/ui/core';
document.documentElement.classList.toggle(WI_DARK_CLASS, dark);
\`\`\`

No uses \`.dark\` ni \`data-theme\`. El preset de Spartan Brain espera \`.dark\`; \`@custom-variant dark (&:where(.wi-dark, .wi-dark *));\` lo redirige.

Overlays portaled a \`document.body\` heredan el tema si \`wi-dark\` está en \`<html>\`.
Toast: \`<wi-toaster theme="auto" />\` sigue \`.wi-dark\`.`,
  },
  {
    id: 'icons',
    title: 'Iconos',
    body: `API: \`<wi-icon>\` + \`provideWiIcons\` desde \`@wiloc/ui/icon\`.
Glifos oficiales: \`@wiloc/ui/icon/heroicons\` (subconjunto ~79). Importa solo los que uses.

\`\`\`ts
import { provideWiIcons } from '@wiloc/ui/icon';
import { trashOutline } from '@wiloc/ui/icon/heroicons';

provideWiIcons({ trash: { outline: trashOutline } });
\`\`\`

- Sin \`label\` → decorativo (\`aria-hidden\`).
- Con \`label\` → \`role="img"\` + \`aria-label\`.
- Color: \`currentColor\`.
- Custom: objeto \`WiIconGlyph\` (viewBox + nodes). Sin innerHTML.

No uses PrimeIcons. Mapa pi-* → wi: docs/icons-prime-migration.md del repo de la librería.`,
  },
  {
    id: 'ssr',
    title: 'SSR y zoneless',
    body: `Los componentes son standalone, signals y compatibles con zoneless.
No accedas a \`window\` / \`document\` en constructores. Overlays usan portal a body en el cliente.

Iconos: glifos tipados (no innerHTML). Toasts y diálogos se portan a \`document.body\`.

La librería no llama a \`NgZone\`. La app debe usar APIs de plataforma si hidrata en SSR.`,
  },
  {
    id: 'i18n',
    title: 'i18n',
    body: `La librería no trae diccionarios. Dos canales:
- Provider (\`provideWiCalendarI18n\` / \`provideWiDataDisplayI18n\` / \`provideWiOverlaysI18n\`): chrome (meses, paginación, aria del botón X, toast).
- Input / proyección / pipe Transloco: copy de esa pantalla (placeholder, título del dialog, cabeceras).

Apps Wiloc con Transloco (recomendado):
- JSON: añadir claves \`wi.*\` a \`src/assets/i18n/es.json\` y \`en.json\` (los archivos que ya carga Transloco). No crear carpeta aparte.
- TypeScript: \`src/app/locale.ts\` con \`provideAppWiI18n()\` (factories que llaman a \`transloco.translate\` en cada \`() =>\`). NO poner \`.ts\` en \`assets/i18n\`.
- \`app.config.ts\`: \`provideTransloco(...)\` ANTES que \`provideAppWiI18n()\`.
- \`provideWi*I18n(createX())\` se evalúa al cargar el config (sin \`inject()\`). Captura \`TranslocoService\` en \`ENVIRONMENT_INITIALIZER\`.
- Al cambiar idioma (\`setActiveLang\`) no re-registrar providers. Placeholders de producto: \`{{ 'clave' | transloco }}\` en el template.

Claves ES (espejo en en.json):
- wi.calendar: months[12], weekdaysShort[7], weekdaysLong[7], previous, next, hour, minute (HH/MM pueden quedar en código)
- wi.table: empty, aria, paginationAria, previous, next, filterPlaceholder, selectPlaceholder, filterOperatorAria, filterAria (Transloco \`{{header}}\`), columnSummary (\`{visible}\`/\`{total}\` los sustituye Wi), columnMenu, columnAria, resultCount (\`{count}\` lo sustituye Wi), rowActions, operators.contains|notContains|startsWith|endsWith|equals|notEquals|none
- wi.overlays: dialogClose, confirmCancel, toastClose, toastRegion

EN: January…; Su/Mo…; Previous month; Next month; Hour; Minute; No data; Data table; Pagination; Previous; Next; Type to search; Select one; Filter operator; Filter {{header}}; {visible} of {total} columns visible; Columns; Column visibility; {count} results; Actions; Contains / Does not contain / …; Close; Cancel; Close toast; Notifications.

Sin Transloco: signal \`appLocale\` + ternarios ES/EN (ver \`apps/e2e-consumer\`). Storybook toolbar Locale solo simula providers; no es el i18n de la app.

Ver \`wi_view\` de toast, datepicker y table para campos concretos.`,
  },
  {
    id: 'forms',
    title: 'Formularios',
    body: `Controles reales (input, checkbox, switch, select, listbox, otp, datepicker, picklist) implementan CVA / FormValueControl.

No hay \`wi-form-field\` en 0.1.0-alpha.1: label, descripción y error los compone la app (\`<label>\` + \`role="alert"\` + \`aria-describedby\`).

Password: usa \`<wi-input type="password">\`, no hay componente aparte.
Select múltiple: \`<wi-select [multiple]="true">\`.`,
  },
];

export function listDocTopics(): readonly { id: string; title: string }[] {
  return WI_DOCS_TOPICS.map(({ id, title }) => ({ id, title }));
}

export function getDocTopic(id: string): WiDocsTopic | undefined {
  const needle = id.trim().toLowerCase();
  return WI_DOCS_TOPICS.find((topic) => topic.id === needle);
}
