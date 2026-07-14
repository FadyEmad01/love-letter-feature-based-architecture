<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Architecture Quick-Reference

This project uses a **feature-based architecture**. Follow these rules strictly.

## The "Delete Test"

Every business domain lives in `src/features/[feature-name]`. **If a feature folder is deleted, the app must compile without errors** (aside from the routing entry point that references it). Enforce true feature independence.

## The "Rule of Two"

Code only moves to `src/components/` or `src/lib/` **if used by at least two distinct features**. Prefer minor duplication over premature abstraction.

## The "Thin App" Rule

Route files (`page.tsx`) in `src/app/` must be **whisper-thin**. They only handle:
- URL params and search params
- `Metadata` / OpenGraph generation
- Rendering the feature's parent component wrapped in `<Suspense>`

**No business logic, hooks, or complex JSX in route files.** Delegate immediately to the feature.

## Schema Co-location

Drizzle tables live in `src/features/[feature-name]/schema.ts`. The `drizzle.config.ts` scans `./src/features/**/schema.ts`. Removing a feature removes its schema.

## State Management Hierarchy (No Redux)

1. **Server State** → TanStack Query (feature `hooks/`)
2. **UI Filters/Sorting/Pagination** → URL Search Parameters
3. **Local Component UI** → `useState` / `useReducer`
4. **Shared Feature UI State** → Zustand (feature-scoped stores in `hooks/`)

## Better-Auth

- Server config: `src/features/auth/api/auth.ts`
- Client instance: `src/features/auth/hooks/use-auth.ts`
- API route: `src/app/api/auth/[...all]/route.ts` — **thin wrapper only**

## Styling

- Tailwind CSS v4 with `@tailwindcss/postcss`
- Biome for linting and formatting (replaces ESLint + Prettier)
- shadcn/ui components in `src/components/ui/`
