# `@wldeveloperapps/ui`

Librería de componentes UI Angular (Wiloc). API pública `Wi`; Spartan es interno.

Corte actual: **`1.0.0`**.

## Instalación

GitHub Packages (no npmjs). Hace falta permiso de lectura en la organización `wldeveloperapps`. Cada persona configura el acceso en su máquina; el token no se commitea.

En el `.npmrc` de la app:

```
@wldeveloperapps:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

pnpm lee el token de `NODE_AUTH_TOKEN`. En Windows se deja así:

### 1. Instalar GitHub CLI

Instala la interfaz de línea de comandos de GitHub con winget.

```powershell
winget install --id GitHub.cli
```

### 2. Añadir GitHub CLI al PATH

Registra la ruta de instalación para que la terminal reconozca `gh`. La primera línea lo deja permanente en el usuario. La segunda lo aplica en la sesión actual, sin reiniciar la consola.

```powershell
[Environment]::SetEnvironmentVariable("Path", [Environment]::GetEnvironmentVariable("Path", "User") + ";C:\Program Files\GitHub CLI\", "User")
$env:Path += ";C:\Program Files\GitHub CLI\"
```

### 3. Autenticarse en GitHub

Inicia sesión en el navegador (`-w`). `-s read:packages` pide permiso para descargar paquetes privados de GitHub Packages.

```powershell
gh auth login -s read:packages -w
```

### 4. Configurar el token para pnpm

Copia el token de GitHub CLI a `NODE_AUTH_TOKEN`. pnpm lo usa al descargar el paquete. El valor vale solo en esa terminal; en una sesión nueva hay que volver a asignarlo.

```powershell
$env:NODE_AUTH_TOKEN = gh auth token
```

Después:

```powershell
pnpm add @wldeveloperapps/ui@1.0.0
```

Docs: [Instalación](https://github.com/wldeveloperapps/WiComponents) · entry points `@wldeveloperapps/ui/button`, `/forms`, `/data-display`, `/navigation`, `/overlays`, `/icon`, `/core`.
