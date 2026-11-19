# web-3d-agency — Experiencia web hiperrealista

Landing inmersiva (Next.js 16 · React 19 · R3F v9 · GSAP + Lenis · Tailwind v4) construida con la metodología de
`Manuales/MANUAL_V2_WEB_HIPERREALISTA.md` y gestionada con el tablero de `Manuales/FLUJO_TRELLO_WEB_HIPERREALISTA.md`.

## Puesta en marcha

```bash
git lfs install          # una sola vez por equipo
npm install              # el postinstall copia Draco/Basis/benchmarks a /public
npm run dev              # http://localhost:3000
```

| Script | Qué hace |
| :--- | :--- |
| `npm run dev` | Servidor de desarrollo (Turbopack) |
| `npm run build` | Build de producción |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

## Ramas (ver guía de gobernanza)

`main` (producción) ← PR ← `develop` (integración) ← PR ← `feat/<id-trello>-<tarea>` · `fix/<bug>` · `assets/<tipo>`.
Nadie hace push directo a `main` ni a `develop`. Cada PR indica la tarjeta de Trello (`DEV-XX`) que resuelve.

## Contrato de assets (`/public`)

Ver `CLAUDE.md` §2. Los nombres son fijos; los assets se **versionan** al cambiar (caché `immutable`).
`/public/draco`, `/public/basis` y `/public/benchmarks` se generan en `postinstall` y no se versionan en Git.

## Documentos clave

- `CLAUDE.md` — especificación de código (Parte II del Manual v2) para humanos y agentes.
- `LICENCIAS.md` — registro obligatorio de licencias.
- `Manuales/` — manual técnico, flujo Trello y gobernanza Git/GitHub.
