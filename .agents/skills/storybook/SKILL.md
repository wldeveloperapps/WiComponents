---
name: storybook
description: >-
  Normas de Storybook para @wiloc/ui: actions obligatorias, historias mínimas,
  responsive e i18n en demos. Usar al crear o editar *.stories.ts, documentar
  componentes en Storybook, o cuando el usuario mencione stories, Actions panel
  o addon-actions.
---

# Storybook `@wiloc/ui`

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

## Historias mínimas

Cuando aplique: Default, Variants, Sizes, Disabled, Loading, long content, Dark mode, a11y, Responsive (~320–400px).

Documentar comportamiento, no solo escaparate visual. Interacción en componentes complejos.

## Responsive

Layouts / Recipe: `grid-cols-1 sm:…`. Comprobar canvas ~320–400px (regla `responsive`).

## i18n

Copy de demo en español; en apps el texto viene de i18n. No diccionarios en la librería.
