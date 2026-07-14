# Love Letter — Feature-Based Architecture

A Next.js 16 application built with a strict **feature-based architecture**. This document is the single source of truth for every developer working on this project.

---

## Tech Stack

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
| **Animation** | tw-animate-css | Tailwind animation utilities |
| **Class Utilities** | clsx + tailwind-merge | Combined via `cn()` helper |

---

## Architectural Philosophy: Feature-Based Design

### The "Delete Test"

Every business domain lives in `src/features/[feature-name]`. **If a feature folder is deleted, the app must compile without errors** (aside from the routing entry point that references it). This enforces true feature independence and prevents hidden coupling between domains.

### The "Rule of Two" (No Premature Abstractions)

Code only moves to the global `src/components/` or `src/lib/` directories **if it is actively used by at least two distinct features**. Minor duplication across features is preferred over premature abstraction. Keep code local to the feature until a global need is proven.

---

## Directory Structure

```text
src/
├── app/                      # ROUTING LAYER (Strictly thin — no business logic)
│   ├── layout.tsx            # Root layout (fonts, global providers)
│   ├── (dashboard)/          # Authenticated routes
│   ├── (public)/             # Public routes
│   │   ├── layout.tsx        # Public layout wrapper
│   │   ├── (landing)/        # Landing/home page route group
│   │   └── auth/             # Public auth routes (sign-in, sign-up)
│   └── api/
│       └── auth/
│           └── [...all]/     # Thin wrapper endpoint for Better-Auth
│
├── components/               # SHARED DESIGN SYSTEM (Domain-agnostic UI only)
│   ├── background/           # Ambient visual layers (e.g., NoiseOverlay)
│   └── ui/                   # shadcn/ui components (Button, Card, etc.)
│
├── features/                 # BUSINESS DOMAINS (80–90% of app code)
│   ├── auth/                 # Authentication Feature
│   │   ├── api/              # Better-Auth server configuration & helpers
│   │   ├── components/       # Sign-in / Sign-up forms
│   │   ├── hooks/            # Better-Auth client hooks (useSession, etc.)
│   │   ├── schema.ts         # Auth-related Drizzle tables (users, sessions, accounts)
│   │   └── index.ts          # Auth public API exports
│   └── [feature-name]/
│       ├── components/       # Feature UI
│       ├── hooks/            # Feature hooks (Zustand stores, TanStack Query)
│       ├── api/              # Server Actions & fetch logic
│       ├── schema.ts         # Feature-specific Drizzle schema definitions
│       ├── types/            # Scoped TypeScript definitions
│       └── index.ts          # Public API barrel file
│
├── lib/                      # UTILITIES (Shared database connection, cn util)
│   ├── db.ts                 # Global Drizzle/Neon DB client instance
│   └── utils.ts              # cn() helper (clsx + tailwind-merge)
│
└── styles/                   # CSS (Tailwind v4 theme + custom properties)
    └── globals.css
```

---

## Routing, Data Fetching & Caching

### The "Thin App" Rule

Route files (`page.tsx`) in `src/app/` must be **whisper-thin**. They only handle:

- URL params and search params
- `Metadata` / OpenGraph generation
- Rendering the feature's parent component wrapped in `<Suspense>`

```tsx
// ❌ BAD — business logic in a route file
export default function Page() {
  const { data } = useQuery(...);
  return <div>Complex UI Logic Here</div>;
}

// ✅ GOOD — delegate immediately to the feature
import { FeatureContainer } from '@/features/my-feature';

export default function Page() {
  return <FeatureContainer />;
}
```

### Data Fetching

- **Initial data fetching** happens in React Server Components inside the feature directory.
- **Mutations** use Next.js Server Actions co-located in the feature's `api/` folder.

### Caching & Revalidation Strategy

#### `revalidateTag` (Recommended)

Selectively purge specific cached data across **all pages** simultaneously. Next.js recommends this over `revalidatePath` because it is more precise and avoids unnecessary page re-renders.

- **Scope:** Targets data assigned to a custom tag via `fetch(..., { next: { tags: ['...'] } })`
- **Use when:** A piece of data (letter, post, profile) is shared across multiple pages. Revalidating the tag updates that data universally.

```ts
import { revalidateTag } from 'next/cache';

revalidateTag('latest-letters');
```

#### `revalidatePath`

Clear the cache for an **entire page or layout**.

- **Scope:** Targets a specific URL path (e.g., `/dashboard`)
- **Use when:** A user action modifies the UI of a particular page and you need to guarantee fresh data on next visit.

```ts
import { revalidatePath } from 'next/cache';

revalidatePath('/dashboard');
```

---

## Database & Authentication Architecture

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
import { auth } from '@/features/auth';
import { toNextHandler } from 'better-auth/next-js';

export const { GET, POST } = toNextHandler(auth);
```

---

## State Management Taxonomy

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

## Styling & Tooling

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

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Neon DB URL and Better-Auth secrets

# Run development server
npm run dev

# Open in browser
# http://localhost:3000
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run Biome linter |
| `npm run format` | Format code with Biome |
