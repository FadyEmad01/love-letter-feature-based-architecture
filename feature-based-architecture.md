# OpenCode System Instructions: Next.js Project Architecture & Rules

You must strictly adhere to the following architectural guidelines, folder layout, and coding rules for this Next.js project.

---

## 1. Architectural Principles

### Group by Feature, Not File Type
* **Rule:** Do not create scattered global directories like `src/hooks/` or `src/utils/` for feature-specific code. 
* **The "Delete" Test:** Every business domain must be self-contained within `src/features/[feature-name]`. If that directory is deleted, the app should build without errors (aside from the routing entry point).
* **Co-location:** UI components, custom hooks, API calls, and TypeScript types belonging to a specific domain must live together inside that feature's folder.

### The Rule of Two (No Premature Abstractions)
* **Rule:** Do not extract code into global shared directories (`src/components/` or `src/lib/`) unless it is actively utilized by **at least two** distinct features.
* **Guideline:** Prefer minor code duplication across features over premature abstraction. Keep abstractions local to the feature until a global need is proven.

### No Barrel Files
* **Rule:** Do not create `index.ts` barrel re-export files inside feature directories. Barrel files hurt performance — bundlers must read and process every re-exported module, slowing compilation, dev reloads, and production loads.
* **Implementation:** Import directly from the source file path. Configure path aliases in your bundler for shorter imports if needed.

```tsx
// ❌ BAD — barrel import (slows bundler, hurts tree-shaking)
import { FeatureContainer } from '@/features/my-feature';

// ✅ GOOD — direct import (fast, tree-shakable)
import { FeatureContainer } from '@/features/my-feature/components/feature-container';
```

### Named React Imports
* **Rule:** Always use named imports for React hooks and types. Never use `React.useState`, `React.useEffect`, etc. Named imports are shorter, keep component logic cleaner, and make dependencies explicit.
* **Implementation:** Use destructured named imports for all React APIs.

```tsx
// ❌ BAD — namespace access (longer, redundant)
import React from 'react';
const [count, setCount] = React.useState(0);

// ✅ GOOD — named imports (concise, explicit)
import { useState } from 'react';
const [count, setCount] = useState(0);
```

Barrel files are acceptable only in **published packages/libraries** where a clean public API is needed for external consumers.

---

## 2. Folder Directory Map

Strictly maintain the following structural hierarchy:

```text
src/
├── app/                  # Routing & layouts only (STRICTLY THIN)
├── components/           # Shared UI / Local Design System ONLY (Domain-agnostic)
│   └── background/       # Background/ambient visual layers (e.g., NoiseOverlay)
├── features/             # Business domains (80-90% of code lives here)
│   └── [feature-name]/
│       ├── components/   # Feature-specific UI components
│       ├── hooks/        # Feature-specific hooks
│       ├── api/          # Domain-specific API calls / data access
│       └── schema.ts         # Scoped typescript definitions
├── lib/                  # 3rd-party configuration & clients (e.g., axios, prisma)
├── styles/               # Global stylesheets (e.g., globals.css)
└── types/                # Only truly global, systemic TypeScript definitions
```

---

## 3. Strict Code Implementation Rules

### Rule A: Keeping the app/ Directory Thin

**Requirement:** `page.tsx` files inside `src/app/` must act strictly as entry points. They must contain zero business logic, heavy hooks, or complex JSX layout structures.

**Implementation:** Delegate rendering immediately to a feature component.

```tsx
// ❌ BAD: Do not put feature logic in the app route
export default function Page() {
  const { data } = useQuery(...);
  return <div>Complex UI Logic Here</div>;
}

// ✅ GOOD: Delegate immediately
import { FeatureContainer } from '@/features/my-feature/components/feature-container';

export default function Page() {
  return <FeatureContainer/>;
}
```

### Rule B: Global src/components/ Isolation

**Requirement:** Components in the global `src/components/` folder must function as a domain-agnostic "Internal Design System" (e.g., Button, Modal, Spinner).

**Constraint:** These components must never import from `src/features/`, handle API fetching, or reference domain vocabulary (e.g., no variables named `invoice`, `user`, `transaction`). They accept layout configuration props only (`variant`, `size`, `isOpen`).

### Rule C: State Management Taxonomy

When managing or creating state, choose the correct tool based on this exact hierarchy:

1. **Server State (API/Database data):** Use TanStack Query (React Query). Do not sync server data into global client stores.
2. **UI Filters, Sorting, & Pagination:** Read/write directly to URL Search Parameters using Next.js navigation hooks (`useSearchParams`).
3. **Local Component UI (Toggles, local inputs):** Use primitive React `useState` / `useReducer` inside the closest relevant component.
4. **Global UI State:** Use a lightweight Zustand store or React Context only if cross-feature orchestration is required.

---

## 4. Tech Stack

| Category | Technology | Details |
|----------|-----------|---------|
| **Framework** | Next.js 16 | App Router + React Compiler |
| **React** | React 19 | Server Components by default |
| **Language** | TypeScript 5 | Strict mode |
| **Database** | Neon Serverless PostgreSQL | Via `@neondatabase/serverless` |
| **ORM** | Drizzle ORM | Schema-per-feature co-location |
| **Authentication** | Better-Auth | With Drizzle adapter |
| **Styling** | Tailwind CSS v4 | `@tailwindcss/postcss` |
| **UI Components** | shadcn/ui | Radix primitives + CVA |
| **State Management** | TanStack Query + Zustand | See State Taxonomy below |
| **Linting/Formatting** | Biome | Replaces ESLint + Prettier |
| **Animation** | tw-animate-css | Tailwind animation utilities | Motion (framer-motion)
| **Class Utilities** | clsx + tailwind-merge | Combined via `cn()` helper |

---

## 5. Database & Authentication Architecture

### Drizzle Schemas

Drizzle tables are **co-located inside their respective feature folders** (`src/features/[feature-name]/schema.ts`). The `drizzle.config.ts` in the project root scans all feature folders:

```ts
// drizzle.config.ts
schema: "./src/features/**/schema.ts"
```

This strictly preserves the "Delete Test" — removing a feature removes its schema without breaking unrelated features.

### Neon DB Instance

The global Drizzle client instance lives in `src/lib/db.ts`:

```ts
// src/lib/db.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);
```

### Better-Auth Setup

| Layer | Location | Responsibility |
|-------|----------|---------------|
| **Server config** | `src/features/auth/api/auth.ts` | Better-Auth instance, plugin configuration, Drizzle adapter |
| **Client instance** | `src/features/auth/hooks/use-auth.ts` | Better-Auth client for use in React components |
| **API route** | `src/app/api/auth/[...all]/route.ts` | **Thin wrapper only** — forwards requests to the auth instance |

The API route handler is purely a pass-through:

```ts
// src/app/api/auth/[...all]/route.ts
import { auth } from '@/features/auth/lib/auth';
import { toNextHandler } from 'better-auth/next-js';

export const { GET, POST } = toNextHandler(auth);
```

---

## 6. Caching & Revalidation Strategy

### `revalidateTag` (Recommended)

Selectively purge specific cached data across **all pages** simultaneously. Next.js recommends this over `revalidatePath` because it is more precise and avoids unnecessary page re-renders.

- **Scope:** Targets data assigned to a custom tag via `fetch(..., { next: { tags: ['...'] } })`
- **Use when:** A piece of data (letter, post, profile) is shared across multiple pages. Revalidating the tag updates that data universally.

```ts
import { revalidateTag } from 'next/cache';

revalidateTag('latest-letters');
```

### `revalidatePath`

Clear the cache for an **entire page or layout**.

- **Scope:** Targets a specific URL path (e.g., `/dashboard`)
- **Use when:** A user action modifies the UI of a particular page and you need to guarantee fresh data on next visit.

```ts
import { revalidatePath } from 'next/cache';

revalidatePath('/dashboard');
```

---

## 7. State Management Taxonomy

Choose the correct tool based on this strict hierarchy. **No Redux.**

| Priority | State Type | Tool | Location |
|----------|-----------|------|----------|
| 1 | **Server State** (API/DB data) | TanStack Query (React Query) | Feature `hooks/` |
| 2 | **UI Filters, Sorting, Pagination** | URL Search Parameters | `useSearchParams` in components |
| 3 | **Local Component UI** (toggles, inputs) | `useState` / `useReducer` | Closest relevant component |
| 4 | **Shared Feature UI State** | Zustand | Feature-scoped stores in `hooks/` |

### Rules

- **Never** sync server data into global client stores.
- **Zustand stores** must be small, feature-scoped, and live inside the feature's `hooks/` directory. Avoid global monolithic stores.
- **URL params** are the default for any state that affects what data is displayed (filters, pagination, search queries).

---

## 8. Styling & Tooling

### Tailwind CSS v4

Standard utility classes. Custom fonts (like Advercase) are configured in `globals.css` using `@theme` and `@font-face`. The project uses:

- **Fonts:** Inter (sans), Merriweather (heading), Advercase (display), Geist (code)
- **Color palette:** Neutral-based with CSS custom properties
- **Animations:** `tw-animate-css` for pre-built animation utilities

### Biome

Replaces ESLint + Prettier. Commands:

```bash
npm run lint      # biome check
npm run format    # biome format --write
```

---

## 9. OpenCode Local Setup

This rules file (`feature-based-architecture.md`) is automatically loaded by OpenCode when you run it from the project root directory.

### How It Works
- OpenCode scans the project root for rules files on startup
- No manual configuration needed — the file is picked up by name convention

### Usage
Run `opencode` directly from the project root:

```bash
# From project root
opencode
```

OpenCode will automatically apply these architecture rules to all sessions in this project.