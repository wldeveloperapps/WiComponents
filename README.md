# wiComponents

Librería de componentes UI para aplicaciones Angular de Wiloc.

`wiComponents` proporciona componentes reutilizables, accesibles y visualmente consistentes, construidos sobre Angular, Tailwind CSS y las primitivas de accesibilidad de Spartan.

El objetivo de la librería no es replicar todas las funcionalidades de una suite como PrimeNG, sino ofrecer un sistema de diseño mantenible, controlado y adaptado a las necesidades reales de las aplicaciones de Wiloc.

---

## Objetivos

- Unificar la apariencia y el comportamiento de las aplicaciones Wiloc.
- Reducir la duplicación de componentes entre proyectos.
- Proporcionar APIs Angular sencillas, tipadas y estables.
- Garantizar accesibilidad y navegación mediante teclado.
- Centralizar tokens de diseño, temas y estilos.
- Encapsular las dependencias internas de Spartan.
- Facilitar la evolución visual sin modificar cada aplicación.
- Ser compatible con Angular moderno, standalone components y aplicaciones zoneless.

---

## Principios

### La aplicación depende de wiComponents

Las aplicaciones consumidoras deben utilizar los componentes públicos de `wiComponents`.

```ts
import { WiButtonComponent } from '@wiloc/ui/button';
import { WiDialogComponent } from '@wiloc/ui/dialog';
```

Las aplicaciones no deben depender directamente de los componentes internos de Spartan cuando exista una alternativa dentro de la librería.

```ts
// Evitar en aplicaciones consumidoras
import { BrnDialog } from '@spartan-ng/brain';
```

Esto permite actualizar, sustituir o modificar Spartan sin trasladar esos cambios a todas las aplicaciones.

---

### Spartan es una dependencia interna

Spartan proporciona primitivas accesibles y comportamientos complejos, como:

- gestión del foco;
- navegación mediante teclado;
- overlays;
- diálogos;
- menús;
- selects;
- tabs;
- tooltips;
- popovers.

`wiComponents` utiliza principalmente Spartan Brain como base interna.

La API pública de la librería no debe exponer directamente tipos, configuraciones o implementaciones internas de Spartan.

```ts
// Evitar
input<BrnDialogConfig>();

// Preferir
export interface WiDialogConfig {
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
```

---

### Los componentes deben aportar valor

No deben crearse wrappers que únicamente cambien el nombre de un componente de Spartan.

Un componente de `wiComponents` debe aportar al menos una de estas capacidades:

- API pública simplificada;
- variantes visuales corporativas;
- tokens propios;
- estados de carga;
- comportamiento estandarizado;
- accesibilidad adicional;
- integración con formularios;
- documentación;
- pruebas;
- compatibilidad con las aplicaciones Wiloc.

---

## Stack tecnológico

- Angular
- TypeScript
- Tailwind CSS
- Spartan
- Storybook
- Playwright
- Vitest o Jest
- Angular Package Format
- ng-packagr
- pnpm
- MCP (`@wiloc/ui-mcp`) para agentes en apps consumidoras

---

## Arquitectura

```text
wi-components/
├── projects/
│   └── components/          # librería publicable @wiloc/ui
│       ├── src/
│       ├── icon/            # secondary entry @wiloc/ui/icon
│       │   └── heroicons/   # @wiloc/ui/icon/heroicons
│       ├── ng-package.json
│       └── package.json
│
├── packages/
│   └── wiloc-ui-mcp/        # servidor MCP @wiloc/ui-mcp (previsto)
│
├── apps/
│   ├── showcase/
│   └── e2e-consumer/
│
├── scripts/
│   └── generate-heroicons.mjs
├── THIRD_PARTY_NOTICES
├── .cursor/
│   ├── mcp.json
│   └── rules/
├── angular.json
├── package.json
└── README.md
```

---

## MCP (`@wiloc/ui-mcp`)

Las aplicaciones Wiloc deben consumir `@wiloc/ui`, no Spartan. El servidor MCP de la librería existe para que Cursor (y otros agentes) conozcan el catálogo real, la API pública y los imports canónicos.

### Por qué existe

- Evitar que el agente use Spartan o rutas internas cuando ya hay un equivalente en `@wiloc/ui`.
- Exponer un catálogo tipado (componentes, patterns, entry points).
- Alinear snippets y docs con la versión publicada del paquete.
- Complementar Storybook: Storybook documenta visualmente; el MCP documenta la API para agentes.

### Estado

```text
Estado: previsto / en preparación
Paquete previsto: @wiloc/ui-mcp
Ubicación prevista: packages/wiloc-ui-mcp/
```

El contrato de tools y el proceso de registro ya están definidos. La implementación del servidor se completará cuando existan los primeros componentes públicos estables.

### Tools previstas

| Tool        | Descripción                                                  |
| ----------- | ------------------------------------------------------------ |
| `wi_list`   | Listar componentes, patterns y entry points                  |
| `wi_search` | Búsqueda fuzzy en el catálogo y la documentación             |
| `wi_view`   | Detalle de un componente: API, variantes, a11y, ejemplos     |
| `wi_docs`   | Temas transversales: instalación, tokens, dark mode, SSR     |
| `wi_usage`  | Snippet canónico de import y uso                             |
| `wi_audit`  | Detectar imports de Spartan donde debería usarse `@wiloc/ui` |

El MCP **no** debe exponer tipos de Spartan ni APIs internas no publicadas.

### Relación con el desarrollo de componentes

Cada componente público nuevo o modificado debe actualizar el **registry** del MCP con:

- nombre y selector;
- entry point (`@wiloc/ui/...`);
- exports públicos;
- inputs / outputs / variantes;
- notas de teclado y accesibilidad;
- ejemplo mínimo válido;
- estado (`stable` | `experimental` | `deprecated`).

En Cursor, la regla `.cursor/rules/wiloc-ui-mcp.mdc` obliga a incluir este paso al crear o cambiar componentes.

### Cómo habilitarlo en una aplicación consumidora

1. Tener instalada (o disponible vía `npx`) la versión de `@wiloc/ui-mcp` alineada con `@wiloc/ui`.
2. Añadir el servidor en `.cursor/mcp.json` de la app:

```json
{
  "mcpServers": {
    "wiloc-ui": {
      "command": "npx",
      "args": ["-y", "@wiloc/ui-mcp"]
    }
  }
}
```

Durante el desarrollo local del monorepo, puede apuntarse al binario del workspace:

```json
{
  "mcpServers": {
    "wiloc-ui": {
      "command": "node",
      "args": ["./packages/wiloc-ui-mcp/dist/index.js"]
    }
  }
}
```

3. Reiniciar Cursor o recargar los MCP servers.
4. Verificar que el agente usa `wi_list` / `wi_view` / `wi_usage` antes de inventar markup o imports.

### Buenas prácticas en apps

- Configurar `@wiloc/ui-mcp` en cada app Wiloc que consuma la librería.
- No configurar el MCP de Spartan como fuente de UI en esas apps (o usarlo solo si se trabaja en la propia librería `wi-components`).
- Mantener la versión del MCP alineada con la de `@wiloc/ui` instalada.
- Preferir rules/skills de producto + MCP de catálogo: las rules enseñan criterios; el MCP aporta la verdad del API.

### Checklist al publicar un componente

- [ ] Componente exportado desde el entry point correcto.
- [ ] Historias de Storybook.
- [ ] Tests.
- [ ] Entrada actualizada en el registry del MCP.
- [ ] `wi_view` / `wi_usage` reflejan la API real.
- [ ] Ninguna referencia a Spartan en la documentación del MCP.

---

## Iconos (MVP)

**MVP** = lo mínimo usable en las apps: registrar iconos y pintarlos con
`<wi-icon>`. Nada más.

Heroicons es el catálogo visual (SVG). `WiIcon` es cómo lo usamos en Angular.
Las apps no importan Heroicons; importan `@wiloc/ui/icon`.

### Qué incluye este MVP

- `<wi-icon name variant size label />`
- `provideWiIcons` (solo los iconos que importes)
- ~79 glifos Heroicons generados (`@wiloc/ui/icon/heroicons`) — Storybook **Icon → Catalog**
- Iconos custom con la misma API
- Warning en desarrollo si el nombre no está registrado
- Licencia en `THIRD_PARTY_NOTICES`
- Mapa PrimeIcons → Wi: [`docs/icons-prime-migration.md`](docs/icons-prime-migration.md)

### Qué no es (aún)

- Los ~miles de iconos de Heroicons (solo el subconjunto de la app)
- Servicio de iconos, CDN o carga HTTP
- Sustitutos custom para `pi-file-excel`, `pi-save`, `pi-spinner`, etc. (ver doc de migración)

### Uso

```ts
import { provideWiIcons } from '@wiloc/ui/icon';
import { homeOutline, trashOutline, trashSolid } from '@wiloc/ui/icon/heroicons';

provideWiIcons({
  home: { outline: homeOutline },
  trash: { outline: trashOutline, solid: trashSolid },
});
```

```html
<wi-icon name="home" />
<wi-icon name="trash" variant="solid" class="text-destructive" />
<wi-icon name="exclamation-triangle" label="Advertencia" />
```

- Sin `label` → decorativo (`aria-hidden`).
- Con `label` → `role="img"` + `aria-label`.
- Color → `currentColor` (clases del host).
- Variante pedida inexistente → usa la otra si hay; warning en desarrollo.

### Custom

```ts
import type { WiIconGlyph } from '@wiloc/ui/icon';
import { provideWiIcons } from '@wiloc/ui/icon';

const workerIcon: WiIconGlyph = {
  viewBox: '0 0 32 32',
  nodes: [{ tag: 'path', attrs: { d: '…' } }],
};

provideWiIcons({
  worker: { solid: workerIcon },
});
```

```html
<wi-icon name="worker" variant="solid" />
```

Ver también la rule `.cursor/rules/wi-icons.mdc` y Storybook **Custom Icon**.

### Ampliar el catálogo oficial

Añade el nombre en `scripts/generate-heroicons.mjs` y ejecuta
`pnpm generate:icons` (con `heroicons` instalado solo para generar).

Licencia: `THIRD_PARTY_NOTICES` (repo y paquete publicado).

---

## Capas de la librería

### Core

Elementos compartidos por toda la librería:

- tokens;
- temas;
- tipos;
- utilidades;
- directivas;
- helpers de accesibilidad.

Iconos: entry point propio `@wiloc/ui/icon` (no viven solo en core).

### Primitives

Abstracciones internas sobre Spartan Brain.

No tienen por qué formar parte de la API pública.

### Components

Componentes UI reutilizables:

- botones;
- inputs;
- selects;
- diálogos;
- tooltips;
- badges;
- tablas;
- tabs.

### Patterns

Composiciones orientadas a casos de uso frecuentes:

- barras de filtros;
- encabezados de página;
- estados vacíos;
- diálogos de confirmación;
- selectores de site;
- tablas de datos;
- indicadores de estado.

---

## Componentes iniciales

La primera versión debe centrarse en un conjunto pequeño de componentes.

### Fase 1

- Button
- Icon Button
- Input
- Textarea
- Form Field
- Select
- Checkbox
- Switch
- Dialog
- Drawer
- Tooltip
- Badge
- Alert
- Skeleton
- Toast

### Fase 2

- Tabs
- Menu
- Popover
- Pagination
- Data Table
- Empty State
- Page Header
- Filter Bar
- Confirm Dialog

No se añadirán componentes simplemente para completar un catálogo. Cada componente debe responder a una necesidad real de alguna aplicación.

---

## Sistema de diseño

Los componentes no deben utilizar colores o dimensiones arbitrarias directamente.

```html
<!-- Evitar -->
<button class="h-10 rounded-md bg-blue-600 text-white">Guardar</button>
```

Los estilos deben estar basados en tokens semánticos con prefijo `--wi-color-*` (roles MD3: `primary`, `on-primary`, `surface`, etc.).

El tema oscuro se activa con la clase `wi-dark` en un ancestro (recomendado: `<html>`), no con `.dark` ni `data-theme`.

```css
:root {
  --wi-color-primary: #32628d;
  --wi-color-on-primary: #ffffff;
  --wi-color-primary-container: #cfe4ff;
  --wi-color-on-primary-container: #134a74;

  --wi-color-background: #f8f9ff;
  --wi-color-on-background: #191c20;
  --wi-color-surface: #f8f9ff;
  --wi-color-on-surface: #191c20;
  --wi-color-outline: #73777f;

  --wi-color-error: #ba1a1a;
  --wi-color-on-error: #ffffff;
  --wi-color-warning: #f97316;
  --wi-color-on-warning: #ffffff;

  --wi-radius-sm: 0.25rem;
  --wi-radius-md: 0.5rem;
  --wi-radius-lg: 0.75rem;

  --wi-control-height-sm: 2rem;
  --wi-control-height-md: 2.5rem;
  --wi-control-height-lg: 3rem;
}

.wi-dark {
  --wi-color-primary: #48586c;
  --wi-color-on-primary: #dce0e8;
  --wi-color-background: #0e121a;
  --wi-color-on-background: #c4c9d2;
  --wi-color-surface: #10161f;
  --wi-color-on-surface: #c4c9d2;
  --wi-color-outline: #525a68;
}
```

```html
<html class="wi-dark">
  <!-- overlays portaled a body heredan el tema -->
</html>
```

Los nombres de los tokens deben describir su función, no su color concreto.

```css
/* Preferir */
--wi-color-primary;
--wi-color-on-primary;
--wi-color-error;
--wi-color-surface;

/* Evitar */
--wi-blue-600;
--wi-red-button;
--wi-white-background;
```

---

## Tailwind CSS

Las clases de Tailwind deben ser detectables estáticamente.

```ts
// Evitar
const className = `bg-${color}-600`;
```

```ts
// Preferir
const variants = {
  primary: 'bg-primary text-on-primary',
  secondary: 'bg-secondary text-on-secondary',
  danger: 'bg-error text-on-error',
} as const;
```

La librería debe minimizar la configuración necesaria en las aplicaciones consumidoras.

La estrategia recomendada es combinar:

- variables CSS para tokens y temas;
- clases Tailwind estáticas;
- CSS compilado distribuido con la librería;
- configuración pública documentada.

---

## API pública

Cada componente debe exponer una API propia, estable y tipada.

```ts
export type WiButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

export type WiButtonSize = 'sm' | 'md' | 'lg';
```

Ejemplo:

```ts
@Component({
  selector: 'wi-button',
  standalone: true,
  templateUrl: './wi-button.component.html',
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
  },
})
export class WiButtonComponent {
  readonly variant = input<WiButtonVariant>('primary');
  readonly size = input<WiButtonSize>('md');
  readonly loading = input(false);
  readonly disabled = input(false);
}
```

La API pública no debe filtrar implementaciones internas.

---

## Entry points

La librería debe proporcionar entry points secundarios para organizar los imports y evitar cargar módulos innecesarios.

```ts
import { WiButtonComponent } from '@wiloc/ui/button';
import { WiInputComponent } from '@wiloc/ui/forms';
import { WiDialogComponent } from '@wiloc/ui/overlays';
import { WiDataTableComponent } from '@wiloc/ui/table';
```

Entry points previstos:

```text
@wiloc/ui/core
@wiloc/ui/button
@wiloc/ui/forms
@wiloc/ui/overlays
@wiloc/ui/navigation
@wiloc/ui/data-display
@wiloc/ui/table
@wiloc/ui/patterns
```

No se debe crear un entry point para cada helper interno.

---

## Angular

La librería debe utilizar APIs modernas de Angular:

- standalone components;
- signals;
- `input()`;
- `output()`;
- `model()` cuando corresponda;
- control flow moderno;
- Change Detection compatible con zoneless;
- componentes compatibles con SSR;
- tipado estricto.

No debe depender innecesariamente de `NgZone`, acceso directo a `window`, `document` o APIs exclusivas del navegador.

Cuando sea necesario utilizar APIs del navegador, deben protegerse mediante comprobaciones de plataforma o abstracciones inyectables.

---

## Formularios

Los controles deben ser compatibles con Angular Forms cuando tenga sentido.

Los componentes de formulario deben contemplar:

- label;
- descripción;
- estado required;
- estado disabled;
- estado readonly;
- mensajes de error;
- `aria-describedby`;
- Reactive Forms;
- ControlValueAccessor cuando corresponda.

Ejemplo de uso:

```html
<wi-form-field>
  <wi-label for="email">Correo electrónico</wi-label>

  <wi-input id="email" type="email" [formControl]="emailControl" />

  <wi-form-error> Introduce un correo electrónico válido. </wi-form-error>
</wi-form-field>
```

---

## Accesibilidad

La accesibilidad es un requisito funcional, no una mejora opcional.

Cada componente debe comprobar:

- uso completo mediante teclado;
- orden correcto del foco;
- restauración del foco;
- estados disabled;
- etiquetas accesibles;
- roles y atributos ARIA;
- mensajes de error;
- contraste;
- zoom;
- lectores de pantalla;
- reducción de movimiento;
- compatibilidad táctil;
- comportamiento responsive.

Los componentes más sensibles requieren especial atención:

- Dialog
- Drawer
- Select
- Combobox
- Menu
- Tooltip
- Tabs
- Data Table
- Toast

No debe asumirse que un componente es accesible únicamente por utilizar Spartan.

---

## Storybook

Todo componente público debe tener historias de Storybook.

Cada historia debe cubrir, cuando corresponda:

- variante por defecto;
- variantes visuales;
- tamaños;
- estado disabled;
- estado loading;
- errores;
- contenido largo;
- responsive;
- dark mode;
- navegación con teclado;
- ejemplos recomendados;
- casos extremos.

Ejemplo de historias:

```text
Button
├── Default
├── Variants
├── Sizes
├── Loading
├── Disabled
├── WithIcon
└── IconOnly
```

Storybook actúa como:

- documentación visual;
- catálogo de componentes;
- entorno de desarrollo;
- base para pruebas visuales;
- referencia del sistema de diseño.

---

## Pruebas

### Unitarias

Deben comprobar:

- inputs;
- outputs;
- variantes;
- estados;
- renderizado;
- integración con formularios;
- eventos;
- lógica interna.

### Accesibilidad e interacción

Deben comprobar:

- teclado;
- foco;
- Escape;
- Tab;
- Enter;
- Space;
- atributos ARIA;
- estados disabled;
- comportamiento de overlays.

### End-to-end

Playwright debe utilizarse para comprobar componentes complejos y flujos reales.

### Consumidor externo

Debe existir una aplicación que consuma la librería como paquete externo.

Antes de publicar una versión:

```bash
pnpm build
pnpm pack
```

El archivo `.tgz` generado debe instalarse en la aplicación de prueba.

```bash
pnpm add ../wiloc-ui-0.1.0.tgz
```

Esto permite detectar:

- exports incorrectos;
- CSS no publicado;
- assets ausentes;
- imports privados;
- peer dependencies incorrectas;
- fallos de empaquetado;
- diferencias entre el monorepo y npm.

---

## Dependencias

Angular, Spartan y otras dependencias compartidas por la aplicación deben declararse normalmente como `peerDependencies`.

Ejemplo orientativo:

```json
{
  "peerDependencies": {
    "@angular/common": ">=22 <23",
    "@angular/core": ">=22 <23",
    "@spartan-ng/brain": "^1.0.0"
  }
}
```

Los rangos definitivos deben revisarse según las versiones reales utilizadas.

No se deben incluir varias copias de Angular dentro de la aplicación consumidora.

---

## Publicación

El paquete se publicará con scope:

```text
@wiloc/ui
```

Durante el desarrollo se utilizarán versiones prerelease:

```text
0.1.0-alpha.1
0.1.0-alpha.2
0.1.0-beta.1
```

Primera versión estable:

```text
1.0.0
```

Comandos orientativos:

```bash
pnpm lint
pnpm test
pnpm build
pnpm pack
pnpm publish
```

La publicación debe realizarse desde CI y no depender de builds manuales locales.

---

## Versionado

Se seguirá Semantic Versioning.

### Patch

Correcciones compatibles.

```text
1.0.0 → 1.0.1
```

### Minor

Nuevas funcionalidades compatibles.

```text
1.0.0 → 1.1.0
```

### Major

Cambios incompatibles en la API pública.

```text
1.0.0 → 2.0.0
```

Se considera breaking change:

- eliminar un input u output;
- renombrar un componente;
- cambiar el selector;
- modificar el tipo de una propiedad pública;
- cambiar un comportamiento documentado;
- eliminar una variante;
- cambiar tokens públicos;
- alterar imports públicos;
- aumentar la versión mínima de Angular de forma incompatible.

---

## Convenciones de nombres

### Componentes

```text
WiButtonComponent
WiDialogComponent
WiFormFieldComponent
WiDataTableComponent
```

### Selectores

```text
wi-button
wi-dialog
wi-form-field
wi-data-table
```

### Directivas

```text
wiButton
wiTooltip
wiInput
```

### Tipos

```text
WiButtonVariant
WiButtonSize
WiDialogConfig
WiTableColumn
```

### Archivos

```text
wi-button.component.ts
wi-button.component.html
wi-button.component.spec.ts
wi-button.stories.ts
wi-button.types.ts
```

---

## Requisitos para añadir un componente

Un componente solo debe incorporarse cuando:

1. Existe una necesidad real.
2. Hay al menos un caso de uso definido.
3. Su API pública está diseñada.
4. Tiene tokens y variantes definidos.
5. Incluye pruebas.
6. Incluye historias de Storybook.
7. Tiene documentación de uso.
8. Está registrado en el MCP (`@wiloc/ui-mcp`).
9. Ha sido probado desde el paquete npm.
10. Cumple los requisitos de accesibilidad.
11. No duplica innecesariamente otro componente.

---

## Checklist de pull request

- [ ] El componente resuelve una necesidad real.
- [ ] La API pública no expone tipos internos de Spartan.
- [ ] No se han utilizado colores o medidas arbitrarias.
- [ ] Las clases Tailwind son detectables estáticamente.
- [ ] Es compatible con teclado.
- [ ] Tiene etiquetas accesibles.
- [ ] Funciona en dark mode.
- [ ] Funciona en responsive.
- [ ] Tiene pruebas unitarias.
- [ ] Tiene pruebas de interacción cuando corresponde.
- [ ] Tiene historias de Storybook.
- [ ] Está actualizado en el registry del MCP.
- [ ] No utiliza imports privados.
- [ ] El build de la librería funciona.
- [ ] Se ha probado mediante `pnpm pack`.
- [ ] Se ha actualizado el changelog cuando corresponde.
- [ ] No introduce un breaking change accidental.

---

## Roadmap inicial

### Etapa 1: infraestructura

- Crear workspace Angular.
- Crear proyecto de librería.
- Configurar Angular Package Format.
- Configurar Tailwind.
- Configurar tokens.
- Instalar Spartan Brain.
- Configurar Storybook.
- Configurar linting y tests.
- Configurar aplicación showcase.
- Configurar aplicación consumidora.
- Definir contrato y registry del MCP (`@wiloc/ui-mcp`).
- Configurar publicación prerelease.

### Etapa 2: prueba de concepto

Implementar:

- Button
- Input
- Form Field
- Select
- Dialog
- Toast

Validar:

- publicación;
- instalación externa;
- estilos;
- dark mode;
- Storybook;
- accesibilidad;
- MCP usable desde una app consumidora;
- actualización de Spartan.

### Etapa 3: componentes base

Implementar el conjunto mínimo necesario para sustituir progresivamente componentes de las aplicaciones existentes.

### Etapa 4: patrones Wiloc

Añadir composiciones específicas de producto:

- Filter Bar
- Page Header
- Empty State
- Status Badge
- Confirm Dialog
- Site Selector
- Data Table

---

## Licencias

La librería debe mantener las atribuciones y avisos de las dependencias de terceros.

Cuando se adapte código procedente de Spartan u otras librerías:

- conservar los avisos de licencia aplicables;
- documentar el origen;
- incluir un archivo `THIRD_PARTY_NOTICES` (ya presente en la raíz);
- revisar las licencias de iconos y assets (Heroicons: MIT; ver `THIRD_PARTY_NOTICES`);
- no copiar código sin verificar previamente su licencia.

---

## Estado del proyecto

`wiComponents` se encuentra en fase inicial de diseño y prueba de concepto.

Durante esta fase, la API puede cambiar sin mantener compatibilidad hacia atrás.

```text
Versión actual: 0.x
Estado: experimental
```
