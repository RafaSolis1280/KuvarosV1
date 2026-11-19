# GUÍA DE CONFIGURACIÓN Y GOBERNANZA DE GIT & GITHUB
## Manual de Inicialización y Reglas del Repositorio (Fases 1 a 3)

Este documento explica cómo está estructurado el repositorio del proyecto (**KuvarosV1**), las reglas de ramas, el manejo de archivos 3D pesados y las herramientas de control de calidad en GitHub. Todo miembro del equipo debe leer y aplicar estas configuraciones antes de pasar al flujo diario de desarrollo (Paso 4).

---

## 1. Estrategia de Ramas (Branching Model)

Para evitar que el código en producción se rompa o que el trabajo de una persona sobrescriba el de otra, usamos un modelo de **GitFlow simplificado**. **Nadie** (ni humanos ni agentes de IA como Claude Code) puede hacer `push` directo a `main` o `develop`.

| Rama | Propósito | ¿Quién hace push directo? | Entorno (Vercel) |
| :--- | :--- | :--- | :--- |
| `main` | Código en producción, 100% estable y listo para el cliente. | **Nadie** (solo Pull Request desde `develop`). | Producción (dominio oficial) |
| `develop` | Rama principal de integración donde se une el trabajo del equipo. | **Nadie** (solo Pull Request desde ramas de trabajo). | Staging / Pre-producción |
| `feat/<tarea>` | Nuevas funcionalidades (ej. `feat/scroll-sequence`, `feat/hero-3d`). | El desarrollador asignado. | Preview URL automática |
| `fix/<bug>` | Corrección de errores (ej. `fix/ios-vram-leak`). | El desarrollador asignado. | Preview URL automática |
| `assets/<tipo>` | Subida y optimización de `.glb`, secuencias `.webp` o audio. | Artista 3D / Diseñador. | Preview URL automática |

---

## 2. Fase 0: Inicialización del Repositorio y Configuración Local

### A. Cómo se creó la arquitectura base (Referencia del Líder)
El proyecto nació utilizando **Next.js (App Router), TypeScript, Tailwind CSS y ESLint**, junto con **Git LFS (Large File Storage)** para gestionar archivos binarios pesados sin colapsar el historial de Git.

1. **Creación del proyecto:**
   ```bash
   npx create-next-app@latest web-3d-agency --typescript --tailwind --eslint --app --src-dir
   cd web-3d-agency
   ```

2. **Activación de Git LFS (Obligatorio para archivos 3D y audio):**
   ```bash
   git lfs install
   git lfs track "*.glb" "*.hdr" "*.ktx2" "*.webm" "*.mp3"
   ```
   Esto genera el archivo `.gitattributes`, el cual le indica a GitHub que esos formatos deben almacenarse como punteros ligeros y no como archivos binarios tradicionales.

3. **Reglas de `.gitignore` (Lo que NUNCA se sube a GitHub):**
   Para mantener el repositorio liviano, los archivos crudos de edición o generación de IA se quedan en local o en almacenamiento en la nube (Drive), nunca en Git:
   ```gitignore
   # Archivos pesados de producción (solo subir los optimizados en /public)
   raw-assets/
   *.blend
   *.blend1
   *.mp4
   *.mov
   *.psd
   .env.local
   ```

4. **Configuración de identidad de Git:**
   Antes del primer commit, cada desarrollador debe registrar su nombre y correo de GitHub en su computadora:
   ```bash
   git config --global user.name "TuUsuarioDeGitHub"
   git config --global user.email "tu-correo@ejemplo.com"
   ```

5. **Conexión con el repositorio remoto y creación de ramas base:**
   ```bash
   git add .gitattributes .gitignore .
   git commit -m "chore: inicializacion de arquitectura Next.js y Git LFS"
   git branch -M main
   git remote add origin https://github.com/RafaSolis1280/KuvarosV1.git
   git push -u origin main

   # Creación de la rama de integración
   git checkout -b develop
   git push -u origin develop
   ```

### B. Cómo deben conectarse los nuevos integrantes del equipo
Si ya eres colaborador invitado al repositorio, no debes ejecutar `create-next-app` ni `git init`. Solo sigue estos pasos en tu terminal:

```bash
# 1. Instalar el soporte de Git LFS en tu equipo (solo se hace una vez)
git lfs install

# 2. Clonar el repositorio
git clone https://github.com/RafaSolis1280/KuvarosV1.git
cd KuvarosV1

# 3. Cambiar a la rama de desarrollo e instalar dependencias
git checkout develop
npm install
```

### C. Solución a errores comunes en Windows (Troubleshooting)
* **Error `remote origin already exists`:** Ocurre si intentas agregar una URL remota cuando ya existe una configurada. En lugar de `add`, usa `set-url`:
  ```powershell
  git remote set-url origin https://github.com/RafaSolis1280/KuvarosV1.git
  ```
* **Error de permisos (403) o cuenta equivocada guardada en Windows:** Git en Windows guarda las sesiones en el Administrador de Credenciales (no existe `git logout`). Para cerrar sesión y loguearte con tu cuenta correcta en el navegador, ejecuta en PowerShell:
  ```powershell
  cmdkey /delete:git:https://github.com
  ```
  Luego vuelve a hacer `git push` o `git pull` y te pedirá iniciar sesión nuevamente.

---

## 3. Gobernanza y Herramientas de GitHub

Para garantizar calidad profesional y evitar que código con errores entre a las ramas principales, el repositorio utiliza cuatro pilares de control dentro de GitHub:

### 1. Protección de Ramas (Branch Rulesets)
Configurado en **Settings → Branches → Add branch ruleset** para `main` y `develop`:
* **Require a pull request before merging:** Todo cambio debe revisarse y contar con al menos **1 aprobación** antes de fusionarse.
* **Require status checks to pass:** Bloquea el botón de *Merge* si la verificación automática de código falla.
* **Block force pushes:** Protege el historial contra borrados accidentales (`git push --force`).

### 2. Integración Continua (CI) con GitHub Actions
El archivo `.github/workflows/ci.yml` valida automáticamente cada Pull Request dirigido a `develop` o `main`, comprobando que no existan errores de ESLint ni de compilación de TypeScript/Next.js:

```yaml
name: CI Verification

on:
  pull_request:
    branches: [develop, main]

jobs:
  build-and-lint:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          lfs: true

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run Linter
        run: npm run lint

      - name: Build Next.js
        run: npm run build
```

### 3. Tablero de Tareas (GitHub Projects + Issues)
El trabajo del equipo se organiza en la pestaña **Projects** usando un tablero **Kanban** de 5 columnas:
* `Backlog` → `To Do` → `In Progress` → `In Review` → `Done`.
* Cada módulo técnico (ej. *Motor de Scroll Lenis*, *Escena 3D Hero*, *Secuencia WebP*) se registra como un **Issue** con etiquetas (`3d`, `ui`, `shaders`, `performance`, `assets`) y se asigna a un responsable.

### 4. Entornos de Prueba Automáticos (Vercel Preview URLs)
El repositorio está conectado a **Vercel**. Cada vez que un integrante sube una rama y abre un Pull Request, Vercel genera automáticamente una URL temporal privada. Esto permite que todo el equipo pruebe las animaciones 3D, los FPS y la memoria VRAM directamente en celulares reales antes de aprobar el código.

---

> **Siguiente etapa:** Una vez que todo el equipo tenga clonado el repositorio, configurado Git LFS y validadas sus credenciales, se procede al **Paso 4: Flujo Diario de Trabajo (Ramas, Commits y Pull Requests)**.