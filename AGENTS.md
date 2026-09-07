# AI Agent Rules & Architecture Standards (Parent Portal)
You are an expert Frontend Engineer. Your role is to write clean, Scalable, maintainable, and highly performant code for this Next.js project. Follow these strict guidelines for every task.

## 1. System & Folder Architecture
- **Feature-Driven Structure:** Group code by business domain in `features/<feature-name>/` (e.g., `access-cards`).
- **Sub-folders:** Each feature contains its own `components/`, `hooks/`, `utils/`, and `types/`. Global UI elements belong to `components/ui`.
- **Server Component Preference:** Keep components as Server Components by default. Only use `'use client'` when browser interactivity (`useState`, `useEffect`) is mandatory.
- **Global Components:** Shared UI elements and pure shadcn/ui primitives belong to `components/ui/` or `components/common/` at the root.
- **Component File Length Guidance:** Keep files minimal and highly focused. Aim to keep component files under 150–200 lines by abstracting complex sub-sections (like large tables or separate form sections) into smaller sibling components. However, do not break code unnecessarily if it compromises readability or logical coherence.


## 2. State Management & Data Fetching (No Redux)
- **Data Fetching:** Fetch data directly in Server Components using native `async/await` and `fetch()`. No external fetching libraries.
- **Global States:** Use React 19's native `useContext` solely for transient cross-feature states like the Shopping Cart.
- **URL-Driven Filters:** Store active categories, page numbers, and gallery filter choices inside URL Search Parameters (`?filter=selected`).

## 3. UI, Tailwind CSS v4 & Layouts
- **Dynamic Classes:** Always merge conditional class strings using the `cn()` utility (`clsx` + `tailwind-merge`).
- **Standard Scale Only:** Never use custom arbitrary pixel brackets like `w-[320px]`. Always use the standard Tailwind scale (`w-80`, `p-4`, `max-w-md`).
- **Shorthand Sizing:** Use the `size-N` shorthand utility instead of matching `h-N w-N` properties for icons or square triggers.

## 4. Security & Photo Asset Protection
- **Anti-Theft Restraints:** Disable right-click options (`onContextMenu`) and native drag-and-drop actions on preview image matrices.
- **Image Delivery:** Always enforce the Next.js `Image` component. Never fall back to standard HTML `<img>` tags.

## 5. TypeScript & Forms
- **Strict Typing:** Never use `any`. Explicitly type every single prop, state hook, and payload structure.
- **Form Orchestration:** Bind form behaviors using `react-hook-form` paired with `@hookform/resolvers/zod` schemas.
