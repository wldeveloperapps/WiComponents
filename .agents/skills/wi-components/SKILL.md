---
name: wi-components
description: >-
  Crear y modificar componentes @wiloc/ui: arquitectura Spartan→Wi, API, tokens,
  a11y, forms, entry points, tests, MCP y checklist. Usar al implementar
  componentes en projects/components. Detalle largo en references/full-guide.md.
---

# wi-components

Antes de implementar: leer esta skill y, si hace falta detalle, [full-guide.md](references/full-guide.md).
También: skill `storybook` (stories), `spartan` (Brain), `angular-developer` (Angular moderno).

## Arquitectura

```text
Spartan Brain → implementación interna Wi → API @wiloc/ui → apps
```

No exponer Spartan. No wrappers sin valor. No lógica de negocio de producto.

## Reglas (resumen)

1. API pública propia (tipos Wi, no Brn*).
2. Angular moderno: signals, control flow `@if`/`@for`, zoneless/SSR-safe.
3. TypeScript estricto; sin `any`.
4. APIs pequeñas; composición > configuración gigante.
5. Tokens semánticos; sin clases Tailwind dinámicas.
6. A11y: teclado + nombre accesible; diálogos con foco correcto.
7. Forms: CVA / FormValueControl solo en controles.
8. Imports `@wiloc/ui/{entry}`; entry points por dominio.
9. Tests Vitest + Storybook (skill `storybook`) + MCP registry + inventario.

## Proceso componente nuevo

1. Necesidad → inventario → base vs pattern.
2. Primitive Spartan (si aplica) → API Wi.
3. Implementar mínimo completo.
4. Tests + stories + exports + MCP.
5. `pnpm lint` / test / build según alcance.

## Checklist entrega

- [ ] Standalone, signals, sin `any`, sin Spartan en API pública
- [ ] Tokens; sin Tailwind dinámico; SSR/zoneless
- [ ] Teclado + nombre accesible + disabled
- [ ] Tests unitarios (`*.spec.ts`)
- [ ] Stories + actions (skill `storybook`)
- [ ] Responsive ~320px en layouts/recipes
- [ ] Export entry + `exports`/aliases si entry nuevo
- [ ] MCP registry (solo API pública)
- [ ] Inventario actualizado; sin breaking accidentales

## Detalle

Plantilla de componente, ejemplos largos, semver, publicación y reglas 1–15 ampliadas: [full-guide.md](references/full-guide.md).
