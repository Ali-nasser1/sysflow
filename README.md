# SysFlow

Design a system, press Run, and watch requests flow through it as load grows.

## Layout

- `packages/schema` — component catalog (26 types) and the versioned Design format (Zod)
- `apps/web` — React + React Flow editor (palette, canvas, properties, metrics, focus mode)
- `packages/engine` — simulation engine (next step)
- `apps/api` — backend (later step)

## Develop

```bash
pnpm install
pnpm dev        # web app on http://localhost:5173
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

Utilization and metrics in the editor are demo values until the engine is connected.
