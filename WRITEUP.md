# Page Studio: Architectural Write-up

## 1. Problem Framing
The objective was to build a schema-driven, WYSIWYG landing page editor that seamlessly synchronizes draft states to a headless CMS (Contentful) while strictly enforcing Role-Based Access Control (RBAC). The system needed to support content versioning with automated Semantic Versioning (SemVer) based on the structural diffs of the page sections. The primary challenge was decoupling the raw content model from the frontend presentation while maintaining high performance, accessibility, and clean architecture.

## 2. Key Decisions and Trade-offs
*   **Clean Architecture & Adapters**: I opted for a strict separation of concerns. The Domain layer (`src/domain`) handles purely business logic (Zod validation, SemVer logic, RBAC rules) with zero dependencies on React or Next.js. The Adapter layer handles Contentful API interactions. **Trade-off**: This introduces slight boilerplate (e.g., mapping Contentful `Entry` objects to pure `Page` models) but ensures the UI and core logic are entirely immune to future CMS migrations.
*   **Client-Side Redux vs. Server Components**: The Studio Editor leverages Client Components and Redux Toolkit. While Next.js App Router heavily pushes Server Components, a WYSIWYG editor requires intense, transient state management (drag-and-drop, typing in property fields) that cannot sustain full server roundtrips. **Trade-off**: Slightly heavier initial JS bundle on the Studio route, but vastly superior editing performance.
*   **File System vs Memory Release Store**: To simulate an immutable release history locally, I built an `fs` (file system) JSON adapter. However, Vercel Serverless Functions have ephemeral, read-only filesystems. I introduced a fallback `memory` store adapter activated via the `RELEASE_STORE` environment variable to prevent crashes in production, trading persistence across lambda invocations for deployability.

## 3. Assumptions
*   **Seed Data Resilience**: It is assumed that the provided Contentful space will contain the required Content Types (`page` and `section`) with the exact schema matching the adapters. If it doesn't, the application falls back to an empty mock draft to prevent the UI from crashing, assuming the user might want to construct the page entirely from scratch.
*   **Role Management**: Roles (`publisher`, `editor`, `viewer`) are currently mocked via a hardcoded set of users in `src/domain/lib/users.ts`. It is assumed that in a real-world scenario, this would be replaced by an OAuth/JWT provider (like Auth0 or NextAuth), but the RBAC middleware and UI components are built to consume the abstracted role regardless of the origin.

## 4. What is Not Included and Why
*   **Image/Asset Uploads**: The Studio supports editing text, layouts, and URLs via JSON props. Native image uploading to Contentful via the Management API (CMA) was excluded to keep the scope manageable and focus heavily on the diffing/SemVer engine and architectural cleanliness. Image URLs must currently be provided manually.
*   **Production Release Persistence**: As mentioned in the trade-offs, the Vercel deployment uses an ephemeral `memory` store. True production release history would require writing a new adapter for AWS S3, Vercel KV, or a PostgreSQL database. The adapter pattern makes this trivial to add later without touching the core use cases.

## 5. Architecture Overview
The system follows a strict layered approach:
*   **Domain Layer** (`src/domain/`): Pure TypeScript. Contains core business models, Zod validation schemas, SemVer bumping logic, diff algorithms, and RBAC rules. 
*   **Application Layer** (`src/usecases/`): Orchestrates flow between adapters and the domain layer.
*   **Adapters Layer** (`src/adapters/`): Bridges external services. Contains the Contentful integration (`contentful/client.ts`, `sync.ts`) and local/memory release storage.
*   **Framework/UI Layer** (`src/app/`, `src/components/`, `src/store/`): Next.js App Router, React Components, and Redux slices.

## 6. Redux Slice Responsibilities
State management in the Studio is handled exclusively via Redux Toolkit with three slices:
*   **`draftPageSlice`**: Manages the core page draft structure (title, slug, sections array). Handles all content mutations: adding sections, moving them up/down, removing them, and editing section props. Syncs state to `localStorage` on every change so unsaved drafts persist across reloads.
*   **`uiSlice`**: Manages the transient UI state of the editor. Specifically tracks which section is currently selected (`selectedSectionId`) so the `PropEditor` knows which section's properties to display and edit.
*   **`publishSlice`**: Tracks the asynchronous state of the publishing workflow (`isPublishing`, `publishError`, `publishSuccess`). Separated from the draft state to isolate the API orchestration from the raw content representation.

## 7. Contentful Model and Adapter
The Contentful space implements a one-to-many relationship:
*   `Page`: Contains a slug, title, and a multi-reference field `sections` (links to `Section` entries).
*   `Section`: Contains a sectionId, type (e.g., 'hero', 'cta'), and a JSON object field `props`.

The integration is isolated entirely within `src/adapters/contentful/`. `client.ts` handles fetching data via the Delivery API, while `sync.ts` handles the two-way write-back using the Contentful Management API (CMA). No Contentful-specific logic (e.g., `sys`, `fields`) leaks into the UI.

## 8. Publish and SemVer Logic
When a user with the `publisher` role clicks "Publish":
1.  The `publishRelease` use case fetches the previous release from the Release Store.
2.  A deep deterministic diff is calculated between the old page state and the new draft (`src/domain/lib/diff.ts`).
3.  The diff is mapped to a semantic version bump severity:
    *   **Patch**: Only textual or prop changes inside existing sections.
    *   **Minor**: A section was added.
    *   **Major**: A section was removed, changed its type, or a required prop was broken.
4.  If there are no changes, the publish is idempotent and aborted.
5.  The immutable JSON release is stored locally (or in memory on Vercel), and the changes are synced back to Contentful.

## 9. Accessibility Approach
The implementation prioritizes WCAG 2.2 AAA guidelines:
*   **Base UI Integration**: Complex interactions (like the Dropdown Menus and Dialogs) leverage Base UI (Radix), which automatically handles complex ARIA roles, keyboard navigation trapping, and screen reader announcements.
*   **Keyboard Operability**: The Studio, section reordering controls, and the generated landing pages are fully navigable via `Tab` and `Enter/Space`.
*   **Focus States**: High-contrast, visible focus rings are enforced globally via Tailwind (`focus-visible:ring-purple-500`).
*   **Automated Gates**: Axe-core scans are baked into Playwright tests (`e2e/a11y.spec.ts`). We generate an `a11y-report.json` artifact in CI to ensure 0 critical/serious violations before deployment.
