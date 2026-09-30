---
name: wi-release
description: >-
  Gestiona el corte de versión de @wldeveloperapps/ui y @wldeveloperapps/ui-mcp
  y la revisión previa a publicarlo. Usar al cambiar la versión, escribir el
  changelog, crear un tag v* o publicar en GitHub Packages. El tag solo se crea
  sobre un commit que ya está en main; un commit no publica.
---

# wi-release

Leer esta skill antes de cambiar la versión, redactar el changelog o preparar una publicación.

Un commit no publica. La CI (`ci.yml`) corre en pull requests y en pushes a `main`. Publica solo el push de un tag `v{version}` (o **Run workflow** desde `main`). El workflow (`publish.yml`) rechaza el tag si ese commit no está en `main`.

No crear el tag, no hacer push y no publicar salvo que se pida de forma explícita.

## Flujo

1. El trabajo del día a día va en una rama y entra en `main` por pull request. Ahí no se cambia la versión ni se crea tag.
2. El cambio de versión entra igual: rama, pull request, merge a `main`. En ese cambio van la versión alineada, el changelog y los textos de instalación.
3. Cuando ese commit ya está en `main`, y solo si se pide publicar:

```bash
git checkout main
git pull
git tag v1.0.0
git push origin v1.0.0
```

El tag es del commit de `main`, no del commit de la rama. Si el pull request entra por squash, el commit de la rama no queda en `main`: el tag va en el commit que `main` tiene después del merge.

El nombre del tag es `v` más la versión de los paquetes (`v1.0.0` con `1.0.0`). `scripts/publish-github.mjs` lo comprueba.

## Versiones que deben coincidir

Misma cadena en:

- `projects/components/package.json`
- `packages/wiloc-ui-mcp/package.json`
- `packages/wiloc-ui-mcp/src/catalog.ts` (`WI_PACKAGE_VERSION`)
- textos de instalación en `packages/wiloc-ui-mcp/src/docs.ts` y `catalog.spec.ts`
- corte actual en `README.md` y `projects/components/README.md`
- cabecera nueva en `CHANGELOG.md`

`apps/e2e-consumer/package.json` lo reescribe `pnpm e2e-consumer:sync` después de `pnpm pack:lib`. No editar esa ruta a mano.

Clasificación: fix compatible → patch; feature compatible → minor; breaking de API pública → major. Primera estable documentada: `1.0.0` (dist-tag `latest`). Prerelease: `-alpha.N`, `-beta.N`, `-rc.N` (dist-tag `alpha`, `beta`, `rc`).

En una estable, el changelog y la doc dejan de decir que la API es experimental.

## Revisión antes del tag

Parar si falla cualquiera:

- Las versiones de la lista anterior coinciden con el tag previsto.
- `CHANGELOG.md` tiene la entrada de esa versión y la clasificación cuadra con el diff público (export, selector, input, output, tipo, token, entry point, Angular).
- El commit que se va a etiquetar ya está en `main`.
- `pnpm lint`, `pnpm test`, `pnpm test:mcp`, `pnpm build:lib`, `pnpm build:mcp` y `pnpm pack:lib` pasan. El `.tgz` se prueba en `apps/e2e-consumer`.

La publicación la hace `.github/workflows/publish.yml`. No ejecutar `pnpm publish` a mano.
