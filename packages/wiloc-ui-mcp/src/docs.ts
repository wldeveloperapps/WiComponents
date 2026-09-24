import type { WiDocsTopic } from './types.js';

export const WI_DOCS_TOPICS: readonly WiDocsTopic[] = [
  {
    id: 'installation',
    title: 'Instalación de @wldeveloperapps/ui',
    body: `Instala el paquete alineado con esta versión del MCP (0.1.0-alpha.6). API experimental.

\`\`\`bash
# .npmrc: @wldeveloperapps:registry=https://npm.pkg.github.com
pnpm add @wldeveloperapps/ui@0.1.0-alpha.6
# o desde el artefacto local:
pnpm add ./wldeveloperapps-ui-0.1.0-alpha.6.tgz
\`\`\`

Peers: Angular 22, @angular/aria, @angular/cdk, @angular/forms, @spartan-ng/brain, rxjs, clsx.
Tailwind v4 es peer opcional; las apps Wiloc lo usan para tokens.

Imports canónicos (nunca Spartan, nunca rutas src/):

\`\`\`ts
import { WiButtonDirective } from '@wldeveloperapps/ui/button';
import { WiInputComponent } from '@wldeveloperapps/ui/forms';
import { WiDialogComponent } from '@wldeveloperapps/ui/overlays';
import { WiTableComponent } from '@wldeveloperapps/ui/data-display';
import { provideWiIcons, WiIconComponent } from '@wldeveloperapps/ui/icon';
import { WI_DARK_CLASS } from '@wldeveloperapps/ui/core';
\`\`\`

CSS en la app (NO uses \`@wldeveloperapps/ui/styles/index.css\`; es Storybook).

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
@import '@wldeveloperapps/ui/styles/tokens.css';
@custom-variant dark (&:where(.wi-dark, .wi-dark *));
@source '../node_modules/@wldeveloperapps/ui/**/*.mjs';
@theme inline {
  --color-on-primary: var(--wi-color-on-primary);
  --color-primary-container: var(--wi-color-primary-container);
  --color-on-primary-container: var(--wi-color-on-primary-container);
  --color-on-secondary: var(--wi-color-on-secondary);
  --color-secondary-container: var(--wi-color-secondary-container);
  --color-on-secondary-container: var(--wi-color-on-secondary-container);
  --color-surface: var(--wi-color-surface);
  --color-on-surface: var(--wi-color-on-surface);
  --color-surface-container: var(--wi-color-surface-container);
  --color-surface-container-lowest: var(--wi-color-surface-container-lowest);
  --color-surface-container-low: var(--wi-color-surface-container-low);
  --color-surface-container-high: var(--wi-color-surface-container-high);
  --color-surface-container-highest: var(--wi-color-surface-container-highest);
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
  --color-warning-container: var(--wi-color-warning-container);
  --color-on-warning-container: var(--wi-color-on-warning-container);
  --color-success: var(--wi-color-success);
  --color-on-success: var(--wi-color-on-success);
  --color-success-container: var(--wi-color-success-container);
  --color-on-success-container: var(--wi-color-on-success-container);
  --radius-control: var(--wi-radius-md);
  --radius-control-sm: var(--wi-radius-sm);
  --radius-control-lg: var(--wi-radius-lg);
  --height-control-sm: var(--wi-control-height-sm);
  --height-control-md: var(--wi-control-height-md);
  --height-control-lg: var(--wi-control-height-lg);
}
\`\`\`

\`@source\` es relativo al archivo CSS. Con \`src/styles.css\`: \`../node_modules/@wldeveloperapps/ui/**/*.mjs\`.
Sin \`@theme inline\` las clases \`bg-primary\` / \`text-on-surface\` no existen.
Si usas tabs o toast: \`@import '@wldeveloperapps/ui/styles/tabs.css'\` y \`@import '@wldeveloperapps/ui/styles/toast.css'\`.
No importes \`@spartan-ng/brain\` ni Helm en plantillas de producto.`,
  },
  {
    id: 'tokens',
    title: 'Tokens semánticos',
    body: `Prefijo público: \`--wi-color-*\`. Constantes: \`WI_COLOR_TOKEN_PREFIX\`, \`WI_DARK_CLASS\` desde \`@wldeveloperapps/ui/core\`.

Dónde: importar \`@wldeveloperapps/ui/styles/tokens.css\` en el CSS global de la app + \`@theme inline\` (mapeo a Tailwind) + \`@custom-variant dark (&:where(.wi-dark, .wi-dark *));\` + \`@source\` a \`node_modules/@wldeveloperapps/ui/**/*.mjs\`.
NO uses \`@wldeveloperapps/ui/styles/index.css\`. PostCSS: \`postcss.config.json\` con \`@tailwindcss/postcss\`.

Usa clases Tailwind estáticas ligadas a tokens (\`bg-primary\`, \`text-on-surface\`, \`border-outline\`, \`rounded-control\`).
Prohibido: \`bg-\${color}\`, colores hex sueltos en componentes Wi, clases \`.p-*\` de Prime, \`.dark\` / \`data-theme\`.

Roles: primary, on-primary, primary-container, secondary, background, on-background, surface, on-surface, surface-container, surface-container-high, surface-variant, inverse-surface, outline, error, warning, warning-container, success, success-container.

La librería no muta el DOM. La app aplica tema (\`WI_DARK_CLASS\` en \`<html>\`) y tokens vía CSS importado.
Otra app = otros valores de \`--wi-color-*\` en su CSS; los componentes no cambian. Storybook: toolbar Paleta (\`data-wi-palette\`) para previsualizar paletas.
Tabs/toast: CSS extra \`@wldeveloperapps/ui/styles/tabs.css\` / \`toast.css\` si los usas.`,
  },
  {
    id: 'dark-mode',
    title: 'Tema oscuro (.wi-dark)',
    body: `El tema oscuro se activa con la clase \`wi-dark\` en un ancestro (recomendado: \`<html>\`).

\`\`\`ts
import { WI_DARK_CLASS } from '@wldeveloperapps/ui/core';
document.documentElement.classList.toggle(WI_DARK_CLASS, dark);
\`\`\`

No uses \`.dark\` ni \`data-theme\`. El preset de Spartan Brain espera \`.dark\`; \`@custom-variant dark (&:where(.wi-dark, .wi-dark *));\` lo redirige.

Overlays portaled a \`document.body\` heredan el tema si \`wi-dark\` está en \`<html>\`.
Toast: \`<wi-toast theme="auto" />\` sigue \`.wi-dark\`.`,
  },
  {
    id: 'icons',
    title: 'Iconos',
    body: `## Contrato

- Render: \`<wi-icon>\` desde \`@wldeveloperapps/ui/icon\`. Exactamente uno de \`name\` o \`src\`.
- Registro: \`provideWiIcons({ … })\` (varias llamadas se combinan; multi). \`src\` no usa el registro.
- Glifos oficiales: \`@wldeveloperapps/ui/icon/heroicons\` (~80 nombres kebab-case, outline + solid).
- Catálogo visual: Storybook → **Icon → WiIcon → Catalog**.
- \`WI_HEROICONS_CURATED\` es **solo** Storybook/demos. En apps importa glifos individuales.

## 1) Icono oficial (app)

\`\`\`ts
import { provideWiIcons, WiIconComponent } from '@wldeveloperapps/ui/icon';
import { trashOutline, trashSolid } from '@wldeveloperapps/ui/icon/heroicons';

// app.config.ts (o providers del feature)
provideWiIcons({
  trash: { outline: trashOutline, solid: trashSolid },
});
\`\`\`

\`\`\`html
<wi-icon name="trash" />
<wi-icon name="trash" variant="solid" class="text-error" />
\`\`\`

Importa **solo** los glifos que registres (tree shaking). El \`name\` del template debe coincidir con la clave de \`provideWiIcons\`.

## 2) Icono custom (app cliente)

Define un \`WiIconGlyph\` tipado (viewBox + nodes). Sin \`innerHTML\` ni strings SVG crudos.

\`\`\`ts
import { provideWiIcons, type WiIconGlyph } from '@wldeveloperapps/ui/icon';

const brandMark: WiIconGlyph = {
  viewBox: '0 0 24 24',
  nodes: [{ tag: 'path', attrs: { d: 'M12 2 2 22h20L12 2Z' } }],
  // preserveColors: true  // opcional: logos multicolor
};

provideWiIcons({
  'brand-mark': { solid: brandMark },
});
\`\`\`

\`\`\`html
<wi-icon name="brand-mark" variant="solid" label="Marca" />
\`\`\`

Misma API que los oficiales. Tags SVG permitidos: path, circle, rect, line, polyline, polygon, g (los \`g\` pueden anidar esa allowlist).

## 3) SVG por URL (\`src\`)

Un fichero SVG de la app o una URL \`http\`/\`https\`. No lo registres en \`provideWiIcons\`. \`src\` es solo SVG (no PNG ni marcadores de mapa).

Hace falta \`provideHttpClient()\`. La misma URL se descarga una vez (caché en memoria, también en vuelo). Hasta que llega, no se pinta. Si falla, no se pinta (warning en dev).

El texto se traduce a \`WiIconGlyph\` (\`viewBox\` + \`nodes\`) sin \`DOMParser\`, \`document\`, \`innerHTML\` ni \`<img>\`. Se queda el \`viewBox\` del fichero; si no hay, \`0 0 24 24\`. \`width\`/\`height\` del SVG no marcan el tamaño en pantalla: lo marca \`size\`.

\`\`\`ts
import { provideHttpClient } from '@angular/common/http';

provideHttpClient();
\`\`\`

\`\`\`html
<wi-icon src="assets/images/gate-open.svg" class="text-success" />
<wi-icon [src]="asset.urlIcon" size="sm" />
<wi-icon src="assets/images/logo.svg" [preserveColors]="true" />
\`\`\`

- Exactamente uno de \`name\` o \`src\`. Si faltan los dos, no pinta (warning en dev). Si vienen los dos, usa \`name\` e ignora \`src\` (warning en dev).
- \`variant\` solo aplica a \`name\`. Con \`src\` se ignora.
- \`preserveColors\` solo aplica a \`src\`. \`false\` (defecto): un fill/stroke distinto de \`none\`, \`transparent\` y \`currentColor\` pasa a \`currentColor\`. \`fill="none"\` se queda. No se pone \`fill="currentColor"\` en el \`<svg>\` raíz. \`true\` equivale a \`WiIconGlyph.preserveColors\`.
- \`size\` y \`label\` se comportan igual que con \`name\`.

## Accesibilidad y estilo

- Sin \`label\` → decorativo (\`aria-hidden\`).
- Con \`label\` → \`role="img"\` + \`aria-label\`.
- Botón solo-icono: el nombre accesible va en el **botón** (\`aria-label\`), el \`wi-icon\` sigue decorativo.
- Color: \`currentColor\` / clases en el host (\`class="text-error"\`). No hay input \`color\`.

## Qué no hacer

- No \`import … from 'heroicons'\` / \`@heroicons/…\` / PrimeIcons (\`pi-*\`).
- No registrar todo el catálogo de golpe en la app.
- No pintar un SVG externo con \`<img>\`, \`innerHTML\` ni \`bypassSecurityTrustHtml\`. \`src\` lo deja inline.
- Mapa Prime → Wi: \`docs/icons-prime-migration.md\` del repo de la librería.
- Detalle de componente: \`wi_view("icon")\` / \`wi_usage("icon")\`.`,
  },
  {
    id: 'ssr',
    title: 'SSR y zoneless',
    body: `Los componentes son standalone, signals y compatibles con zoneless.
No accedas a \`window\` / \`document\` en constructores. Overlays usan portal a body en el cliente.

Iconos: glifos tipados (no innerHTML). \`src\` descarga el SVG con HttpClient y lo parsea a \`WiSvgNode\` sin DOMParser. Toasts y diálogos se portan a \`document.body\`.

La librería no llama a \`NgZone\`. La app debe usar APIs de plataforma si hidrata en SSR.`,
  },
  {
    id: 'i18n',
    title: 'i18n',
    body: `La librería no trae diccionarios. Dos canales:
- Provider (\`provideWiCalendarI18n\` / \`provideWiDataDisplayI18n\` / \`provideWiOverlaysI18n\` / \`provideWiTimeZone\`): chrome (meses, paginación, aria del botón X, toast) y TZ IANA del site.
- Input / proyección / pipe Transloco: copy de esa pantalla (placeholder, título del dialog, cabeceras).

\`provideWiTimeZone('America/Lima')\` aporta el default del site para mapear Date naive ↔ Instant UTC (\`datepickerValueToUtcIso\`). El control **no** reinterpreta el Date con esa TZ.

Apps Wiloc con Transloco (recomendado):
- JSON: añadir claves \`wi.*\` a \`src/assets/i18n/es.json\` y \`en.json\` (los archivos que ya carga Transloco). No crear carpeta aparte.
- TypeScript: \`src/app/locale.ts\` con \`provideAppWiI18n()\` (factories que llaman a \`transloco.translate\` en cada \`() =>\`). NO poner \`.ts\` en \`assets/i18n\`.
- \`app.config.ts\`: \`provideTransloco(...)\` ANTES que \`provideAppWiI18n()\`.
- \`provideWi*I18n(createX())\` se evalúa al cargar el config (sin \`inject()\`). Captura \`TranslocoService\` en \`ENVIRONMENT_INITIALIZER\`.
- Al cambiar idioma (\`setActiveLang\`) no re-registrar providers. Placeholders de producto: \`{{ 'clave' | transloco }}\` en el template.

Claves ES (espejo en en.json):
- wi.calendar: months[12], weekdaysShort[7], weekdaysLong[7], previous, next, hour, minute (HH/MM pueden quedar en código)
- wi.table: empty, aria, paginationAria, previous, next, filterPlaceholder, selectPlaceholder, selectClearLabel, filterOperatorAria, filterAria (Transloco \`{{header}}\`), columnSummary (\`{visible}\`/\`{total}\` los sustituye Wi), columnMenu, columnAria, resultCount (\`{count}\` lo sustituye Wi), rowActions, expandHeader, expandRow, collapseRow, operators.contains|notContains|startsWith|endsWith|equals|notEquals|none
- wi.overlays: dialogClose, confirmCancel, toastClose, toastRegion

EN: January…; Su/Mo…; Previous month; Next month; Hour; Minute; No data; Data table; Pagination; Previous; Next; Type to search; Select one; Clear; Filter operator; Filter {{header}}; {visible} of {total} columns visible; Columns; Column visibility; {count} results; Actions; Contains / Does not contain / …; Close; Cancel; Close toast; Notifications.

Sin Transloco: signal \`appLocale\` + ternarios ES/EN (ver \`apps/e2e-consumer\`). Storybook toolbar Locale solo simula providers; no es el i18n de la app.

Ver \`wi_view\` de toast, datepicker y table para campos concretos.`,
  },
  {
    id: 'overlays',
    title: 'Overlays anclados y scroll anidado',
    body: `Los paneles conectados a un trigger viven en portal CDK dentro de \`overflow: auto|scroll\` (shell 100dvh). No hace falta \`cdkScrollable\` en la app ni parchear \`Overlay.prototype\`.

Política de scroll:

- **Cierran** al scroll fuera del panel: \`wi-select\`, \`wi-menu\`, filtros/visibilidad de \`wi-table\`, \`[wiTooltip]\`, \`wi-speed-dial\`. Scroll **dentro** de la lista del panel no cierra.
- **Siguen** al trigger (reposicionan): \`wi-datepicker\` / \`wi-date-range\`, \`wi-popover\`, \`wi-confirm-popup\`.

No usan el top-layer de Popover API. Stacking fijo de la librería:

- Contenido de página (card, \`overflow: auto\`): z-index auto. El panel anclado se pinta **encima** para no quedar tapado.
- Header / migas: la app pone **z-index < 1000** (Wiloc: **10**). El desplegable **sí** se pinta encima.
- Overlay anclado (menú, select, datepicker, filtros): portal CDK **z-index 1000**.
- Sidebar: la app pone **z-index > 1000** (Wiloc: **1100**). El menú **no** debe salir por encima del sidebar.
- Dialog, confirm modal y toast: sí pueden ir a top-layer (por encima de cualquier z-index).

No subas el z-index global del overlay por encima del sidebar. No pongas el header / las migas a 1100. No hace falta \`cdkScrollable\` ni parchear \`Overlay.prototype\`. Scroll de ventana sigue funcionando.

Storybook: **Documentation → Z-index** (contrato) y **Overlays → Nested scroll** (demo: contenedor 300px overflow auto + sidebar 1100 + header 10). El canvas hace scroll de ventana (CDK sí lo oye); el recuadro reproduce el shell de producto.`,
  },
  {
    id: 'forms',
    title: 'Formularios',
    body: `Controles reales (input, checkbox, switch, select, listbox, otp, datepicker, picklist) implementan CVA / FormValueControl.

\`wi-date-range\` es un único input con calendario de rango (\`start\`/\`end\` models). \`displayFormat\` (tokens YYYY/MM/DD…) o \`formatDate\` controlan el texto del trigger (solo UI). TZ del site: \`provideWiTimeZone\`. Ver \`wi_view\` / \`wi_usage\` de \`date-range\`.

No hay \`wi-form-field\` en 0.1.0-alpha.6: label, descripción y error los compone la app (\`<label>\` + \`role="alert"\` + \`aria-describedby\`).

Password: usa \`<wi-input type="password">\` (botón de revelar/ocultar por defecto; apagar con \`[passwordToggle]="false"\`). No hay componente aparte.
Select múltiple: \`<wi-select [multiple]="true">\`.`,
  },
  {
    id: 'agent',
    title: 'Reglas para agentes',
    body: `Antes de escribir markup, llama a wi_view. limits dice lo que no hace. requires dice el provider, el CSS o el icono que tiene que existir antes.

1. Importa solo desde \`@wldeveloperapps/ui/...\`. Nada de Spartan, PrimeNG, PrimeIcons ni Heroicons sueltos.

2. No inventes inputs. Si no está en la ficha, no existe.

3. Los textos visibles los pone la app. La librería no trae diccionario.

4. Un icono de UI es \`<wi-icon name="...">\` y el name tiene que estar en \`provideWiIcons\`. No hay src, ni clase \`pi-\`, ni \`<img>\`.

5. Label, error y hint no van dentro del control, salvo que la ficha tenga una parte para eso.

6. Confirmación, menú, popover y diálogo se abren con el trigger y la plantilla de la ficha, o con el servicio si la ficha lo exporta.

7. Toast y tabs necesitan \`toast.css\` y \`tabs.css\` además de \`tokens.css\`.

8. El color es una clase de token (\`text-error\`, \`bg-primary\`). No uses hex.

9. Si hay dos componentes parecidos, usa el que indique la ficha.`,
  },
];

export function listDocTopics(): readonly { id: string; title: string }[] {
  return WI_DOCS_TOPICS.map(({ id, title }) => ({ id, title }));
}

export function getDocTopic(id: string): WiDocsTopic | undefined {
  const needle = id.trim().toLowerCase();
  return WI_DOCS_TOPICS.find((topic) => topic.id === needle);
}
