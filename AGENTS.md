# Project Coding Standards & Guidelines (AGENTS.md)

> **[PROJECT CONFIGURATION - LUMIPHOTOS STORE]**
>
> - **Framework:** Next.js 16 (App Router) with React 19 & TypeScript
> - **State Management & API:** Redux Toolkit & RTK Query (`@reduxjs/toolkit`) + Zustand (`zustand`)
> - **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss`) + Shadcn UI / Base UI (`@base-ui/react`) + Lucide Icons
> - **Form & Validation:** React Hook Form (`react-hook-form`) + Zod
> - **Internationalization:** next-intl (Localized routing: `app/[locale]/...`)
> - **Specialized Packages:** React Grid Gallery, React Phone Number Input (`libphonenumber-js`), Sanitize-HTML, Sonner (Toast)

---

## 1. Architecture & General Principles

- **Senior Persona**: Write clean, modular, self-documenting, type-safe, and production-ready code.
- **Single Responsibility Principle (SRP):** Every file MUST have exactly ONE distinct responsibility and reason to change. Separate presentation, business logic, state management, and data definitions.
- **One Component Per File:** Every component file MUST export exactly ONE React component. Never declare multiple sub-components, helper UI components, or dialogs in the same `.tsx` file.
- **No Quick Hacks**: Avoid inline mock data, hardcoded fallbacks, or superficial patches. Always connect to real APIs.
- **Clean Syntax**: Keep comments and code strings strictly ASCII (avoid non-standard unicode characters like `───` or `—` that cause `□` rendering boxes in editors).
- **Component Reusability**: Extract reusable UI elements into `@/components/common/` or `@/components/ui/` rather than duplicating markup across features.

## 2. UI, Shadcn & Component Library Standards

- **Shadcn & Base UI Standards**: Always prefer Shadcn UI primitives (`@/components/ui/*`) or `@base-ui/react` for UI elements, overlays, dialogs, dropdowns, and inputs.
- **Modals & Dialogs**: MUST use Shadcn UI Dialog (`@/components/ui/dialog`) for custom popups and modals. Never use raw inline modals.
- **Delete Operations**: MUST use the shared deletion modal `@/components/common/DeleteModal`. Never use native `window.confirm()` or inline prompt dialogs.
- **Loading & Skeleton States**: NEVER use plain text "Loading..." placeholders. Always use visual skeleton indicators (e.g., `TableSkeleton`, `CardSkeleton`).
- **Navigation & Headers**: Always use `@/components/common/BackNavigation` for back navigation buttons.
- **Image Optimization**:
  - ALWAYS use Next.js `Image` (`next/image`). NEVER use standard HTML `<img>` tags.
  - For static or remote images, provide explicit `width` and `height` or `fill` with `sizes`.

## 3. API, State Management & Environment Config

- **RTK Query Only**: All HTTP requests MUST be declared as RTK Query endpoints in feature API files (`features/<feature>/api/<name>Api.ts`). No raw `fetch()` or `axios` inside UI components.
- **Zustand vs Redux**: Use RTK Query for server-side caching/fetching and Zustand for lightweight global client-side UI states where applicable.
- **Centralized Environment**: ALWAYS import `env` from `@/config/env` (`env.baseUrl`, `env.mediaBaseUrl`). Never read `process.env.NEXT_PUBLIC_*` directly inside components.
- **Cache Tags**: Always define clear `providesTags` and `invalidatesTags` for automatic UI cache refetching.
- **Image Upload Pattern**: When uploading images via the API, ALWAYS use `useUploadImageMutation` from `@/features/media/api/mediaApi`. Usage pattern:
  1. Create a `FormData` object and append the file under the key `"images"` (`formData.append("images", file)`).
  2. Call `uploadImage(formData).unwrap()` inside `handleAsyncAction`.
  3. On success, extract `res.data[0].id` as the media/logo ID to store in state or form fields, and `res.data[0].url` for server-side previews.
  4. For local (instant) previews, create a blob URL via `URL.createObjectURL(file)` BEFORE the upload, store it in a `useRef`, and always clean it up with `URL.revokeObjectURL` in the `onError` callback, `useEffect` cleanup, and when the component unmounts.
  5. Reset the file `<input>` value after upload (`e.target.value = ""`) so the same file can be re-selected.

## 4. Form Handling & Zod Validation

- **React Hook Form**: Always handle form state using `react-hook-form` (`useForm`).
- **Zod Validation**: Always resolve validation schemas via `@hookform/resolvers/zod`. Keep schemas structured, type-safe, and stored in dedicated feature-level module files.
- **Phone Inputs**: Use `react-phone-number-input` integrated with React Hook Form and Zod schemas for international phone number fields.

## 5. Routing, Tab & URL State

- **URL-Driven State**: Store active tab states, filters, and detail view IDs in URL search parameters or sub-routes so page refreshes maintain exact UI state.
- **No URL Params for Modals**: Modals/Dialogs MUST use React local state (`useState`) for open/close state. NEVER push or set URL search parameters when opening a modal.
- **Localization**: Maintain Next.js App Router localized routing structure (`app/[locale]/...`).

## 6. React Hooks, Performance & Memory Safety

- **No Sync State Updates in Effects**: NEVER call `setState` synchronously within the body of a `useEffect` to avoid cascading re-renders.
- **Memory Cleanup**: Always clean up Object URLs (`URL.revokeObjectURL`) when working with Blob previews or transient images.
- **Toast Notifications**: Use `sonner` (`toast.success()`, `toast.error()`) for user feedback on API operations.

## 7. Feature Folder & Modular Architecture

- **Feature-Driven Structure**: Group code under `@/features/<feature-name>/`:
  - `api/` (RTK Query endpoints)
  - `components/` (Feature-specific UI elements)
  - `hooks/` (Custom hooks specific to feature)
  - `types/` (Zod schemas and TypeScript interfaces)
  - `utils/` (Feature helper functions)

## 8. Internationalization & Localization (`next-intl`)

- **No Hardcoded UI Text**: NEVER hardcode user-facing string literals inside JSX/TSX components. Always fetch text using `useTranslations()` from `next-intl`.
- **Locale Route Integrity**: Ensure all sub-routes, dynamic routing links, and API request headers preserve the current locale parameter (`app/[locale]/...`).

## 9. Gallery & Rich Content Handling

- **Grid Galleries**: Use `react-grid-gallery` for displaying structured photography albums and portfolios cleanly.
- **Sanitization & Safety**: Always sanitize HTML output via `sanitize-html` before rendering rich text or description fields to prevent XSS vulnerabilities.

## 10. Styling & Dynamic Class Names

- **`cn()` Utility**: Always merge dynamic Tailwind CSS classes using the `cn()` helper (`clsx` + `tailwind-merge`). Never concatenate class strings manually.
- **Standard Classes Only**: Use standard Tailwind CSS classes. Avoid deprecated or non-standard experimental CSS selectors.

## 11. Tailwind Sizing, Tokens & Canonical Classes (Tailwind v4)

- **Use Canonical Tailwind Classes**: Always use standard, canonical Tailwind CSS utility classes instead of arbitrary bracket values whenever a canonical class exists (e.g., `rounded-xs` instead of `rounded-[2px]`, `shadow-xs`, `text-xs`).
- **Avoid Arbitrary Value Warnings (`suggestCanonicalClasses`):** Never write arbitrary pixel bracket values like `max-w-[430px]`, `rounded-[2px]`, or `w-[16px]` when Tailwind CSS v4 supports canonical dynamic scale utilities (e.g., `max-w-[430px]` MUST be written as `max-w-107.5`).
- **Tailwind v4 Scale Calculation (`px / 4 = scale`):**
  - Standard spacing/sizing in Tailwind is based on units of `0.25rem` (4px).
  - Convert arbitrary pixel values to canonical classes by dividing by 4:
    - `430px` -> `max-w-107.5`
    - `480px` -> `max-w-120`
    - `200px` -> `max-w-50`
- **`size-*` Shorthand**: Prefer `size-N` for square dimensions (e.g., `size-5` instead of `h-5 w-5`).
- **No Non-existent Values**: Never use values that do not exist in the Tailwind scale (e.g., `h-4.5`). Use the nearest standard step or `size-*`.

## 12. Error Handling & Resilience

- **App Router Error Boundaries**: Implement `error.tsx` and `not-found.tsx` boundaries at feature or route segment levels.
- **Normalized Error Messages**: Extract API error messages standardly through RTK Query error payload helpers before displaying with `sonner` toast notifications.

## 13. TypeScript Enums & Constants Pattern (`as const`)

- **No Native TS `enum`**: NEVER use TypeScript native `enum` keywords to avoid runtime overhead and bundle bloat.
- **`const` Object + `as const` Standard**: ALWAYS declare enum-like constants as uppercase `const` objects with `as const` and derive the corresponding TypeScript type from the object keys/values:

  ```ts
  export const PHOTO_STORE_STATUS = {
    PUBLISHED: "published",
    DRAFT: "draft",
    ARCHIVED: "archived",
  } as const;
  export type PhotoStoreStatus =
    (typeof PHOTO_STORE_STATUS)[keyof typeof PHOTO_STORE_STATUS];
  ```

- **No Magic Strings**: NEVER write hardcoded string literals across feature components when comparing or assigning status values.

## 14. Mandatory Git Commit Message on Every Response

- **Always Provide Git Commit Command:** At the end of every response where code, configurations, or documents are created, updated, or refactored, the AI assistant MUST always provide a clean, conventional, copy-pasteable Git commit snippet (e.g., `feat(...)`, `refactor(...)`, `fix(...)`, `docs(...)`).
