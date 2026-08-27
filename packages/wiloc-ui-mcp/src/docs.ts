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

CSS en la app (patrón del consumidor de prueba):

\`\`\`css
@layer theme, base, components, utilities;
@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/preflight.css' layer(base);
@import 'tailwindcss/utilities.css';
@import '@spartan-ng/brain/hlm-tailwind-preset.css';
@import '@wiloc/ui/styles/tokens.css';
@custom-variant dark (&:where(.wi-dark, .wi-dark *));
@source '../node_modules/@wiloc/ui/**/*.mjs';
\`\`\`

Si usas tabs o toast, importa también \`@wiloc/ui/styles/tabs.css\` y \`@wiloc/ui/styles/toast.css\`.
No uses \`@wiloc/ui/styles/index.css\` en la app (es el bundle de Storybook).
No importes \`@spartan-ng/brain\` ni Helm en plantillas de producto.`,
  },
  {
    id: 'tokens',
    title: 'Tokens semánticos',
    body: `Prefijo público: \`--wi-color-*\`. Constantes: \`WI_COLOR_TOKEN_PREFIX\`, \`WI_DARK_CLASS\` desde \`@wiloc/ui/core\`.

Usa clases Tailwind estáticas ligadas a tokens (\`bg-primary\`, \`text-on-surface\`, \`border-outline\`).
Prohibido: \`bg-\${color}\`, colores hex sueltos en componentes, clases \`.p-*\` de Prime.

Roles: primary, on-primary, secondary, background, surface, on-surface, outline, error, warning, success.

La librería no muta el DOM. La app aplica tema y tokens vía CSS importado.`,
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
    body: `La librería no hardcodea copy de producto. Labels, placeholders, mensajes de error y acciones los aporta la app (p. ej. Transloco).

Chrome de overlays/calendario/tabla:
- \`provideWiOverlaysI18n\` (\`toastCloseLabel\`, \`toastRegionLabel\`, …)
- \`provideWiCalendarI18n\` (meses, weekdays, previous/next)
- \`provideWiDataDisplayI18n\` (paginación, visibilidad de columnas, …)

Ver \`wi_view\` de toast, datepicker y table para los campos concretos.`,
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
