---
name: storybook
description: >-
  Normas de Storybook para @wldeveloperapps/ui: actions obligatorias, Controls/autodocs
  solo con API pública, historias mínimas, responsive e i18n en demos. Usar al crear o
  editar *.stories.ts, documentar componentes en Storybook, o cuando el usuario
  mencione stories, Actions panel, Controls, Properties o addon-actions.
---

# Storybook `@wldeveloperapps/ui`

Leer esta skill **antes** de crear o modificar `*.stories.ts`.

## Actions (obligatorio)

Si el componente emite outputs (`valueChange`, `touch`, `opened`, clicks, etc.):

1. `import { fn } from 'storybook/test';`
2. `argTypes` con `action: '<eventName>'`, `table: { category: 'Events' }`, `control: false`
3. `args` con `eventName: fn()`
4. Template: `(valueChange)="valueChange($event)"`, `(touch)="touch()"`, …

```ts
type StoryArgs = WiExampleComponent & {
  valueChange: ReturnType<typeof fn>;
  touch: ReturnType<typeof fn>;
};

const meta: Meta<StoryArgs> = {
  argTypes: {
    valueChange: {
      action: 'valueChange',
      description: 'Se emite al cambiar el valor',
      table: { category: 'Events' },
      control: false,
    },
    touch: {
      action: 'touch',
      table: { category: 'Events' },
      control: false,
    },
  },
  args: {
    valueChange: fn(),
    touch: fn(),
  },
};
```

Prohibido: stories interactivas sin actions para outputs públicos.

Referencia: `wi-checkbox.stories.ts`, `wi-select.stories.ts`, `wi-switch.stories.ts`.

## Controls y autodocs (obligatorio)

En Docs/Controls solo debe aparecer la **API pública** del componente: `input()`, `model()` y outputs (como Events).

### Permitido en Controls / Properties

- Inputs públicos (`size`, `disabled`, `placeholder`, `displayFormat`, …)
- Models (`value`, `start`, `end`, …) si la story los controla
- Outputs vía actions (`control: false`, categoría Events)

### Prohibido (rompe el canvas)

Storybook refleja campos de la clase Angular. Si quedan editables, Docs muestra **Set object** / textareas y al tocarlos se sobrescribe DI, `viewChild`, CVA o signals internos → error.

No dejar controles para:

- `inject()` / adapters / i18n inyectado (`dateAdapter`, `calendarI18n`, …)
- `viewChild` / `ElementRef` (`calendar`, `popover`, `hourInput`, …)
- callbacks CVA (`onChange`, `onTouched`)
- signals / computeds internos (`displayText`, `cvaDisabled`, `timeEditing`, …)
- constantes de chrome / clases (`triggerClasses`, `panelClasses`, …)
- helpers solo de la story (`formatLocalDate`, `tzHint`, …) salvo que sean args de demo conscientes

### Cómo hacerlo

Preferir **`controls.include`** con la lista explícita de inputs/models públicos (más seguro que `exclude` a mano):

```ts
parameters: {
  controls: {
    include: [
      'size',
      'disabled',
      'invalid',
      'placeholder',
      'ariaLabel',
      // …resto de input()/model() públicos
    ],
  },
},
```

En Angular + autodocs, `include` suele filtrar el panel Controls pero **Properties en Docs** puede seguir listando campos de la clase con “Set object”. Para esos internos, desactivar fila y control:

```ts
argTypes: {
  calendar: { table: { disable: true }, control: false },
  dateAdapter: { table: { disable: true }, control: false },
}
```

- `control: false` → sin control editable
- `table: { disable: true }` → no aparece en Properties de autodocs

Usar **ambos**: `controls.include` + `table.disable` en internos conocidos. Referencia: `wi-datepicker.stories.ts`, `wi-date-range.stories.ts`.

### Checklist al cerrar stories

- [ ] Docs → Properties: no hay **Set object** en campos internos
- [ ] Controls solo API pública (+ Events sin control)
- [ ] Actions cableadas para outputs públicos

## Historias mínimas

Cuando aplique: Default, Variants, Sizes, Disabled, Loading, long content, Dark mode, a11y, Responsive (~320–400px).

Documentar comportamiento, no solo escaparate visual. Interacción en componentes complejos.

## Responsive

Layouts / Recipe: `grid-cols-1 sm:…`. Comprobar canvas ~320–400px (regla `responsive`).

## i18n

Copy de demo en español por defecto; en apps el texto viene de i18n. No diccionarios en la librería.

Toolbar **Locale** (ES/EN) en Storybook: simula `provideWi*I18n` de la app (`projects/components/.storybook/locale.ts`). No hardcodear ES/EN en `applicationConfig` de una story si debe reaccionar al selector; usa el preview global o las factories de `.storybook/locale`.
