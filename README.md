# Page Studio

A lightweight, schema-driven WYSIWYG landing page editor built with Next.js (App Router), Redux Toolkit, and Tailwind CSS.

## 1. Architecture Overview

This project strictly adheres to **Clean Architecture** principles to separate business logic from the framework:

- **Domain Layer** (`src/domain/`): Pure TypeScript. Contains core business models, Zod validation schemas, SemVer bumping logic, diff algorithms, and RBAC rules. Zero dependencies on React, Next.js, or Redux.
- **Application Layer** (`src/usecases/`): Orchestrates flow between adapters and the domain layer.
- **Adapters Layer** (`src/adapters/`): Bridges external services. Contains the Contentful integration (`contentful/client.ts`, `sync.ts`) and local/memory release storage.
- **Framework/UI Layer** (`src/app/`, `src/components/`, `src/store/`): Next.js App Router, React Components, and Redux slices.

## 2. Redux Slice Responsibilities

State management in the Studio is handled exclusively via Redux Toolkit with three slices:

- **`draftPageSlice`**: Manages the core page draft structure (title, slug, sections array). Handles all content mutations: adding sections, moving them up/down, removing them, and editing section props. Syncs state to `localStorage` on every change so unsaved drafts persist across reloads.
- **`uiSlice`**: Manages the transient UI state of the editor. Specifically tracks which section is currently selected (`selectedSectionId`) so the `PropEditor` knows which section's properties to display and edit.
- **`publishSlice`**: Tracks the asynchronous state of the publishing workflow (`isPublishing`, `publishError`, `publishSuccess`). Separated from the draft state to isolate the API orchestration from the raw content representation.

## 3. Contentful Model & Adapter Explanation

**Content Model:**
The Contentful space implements a one-to-many relationship:
- `Page`: Contains a slug, title, and a multi-reference field `sections` (links to `Section` entries).
- `Section`: Contains a sectionId, type (e.g., 'hero', 'cta'), and a JSON object field `props`.

**Adapter Logic:**
The integration is isolated entirely within `src/adapters/contentful/`.
- `client.ts`: Handles fetching seed data from Contentful's Delivery and Preview APIs.
- `management.ts`: Instantiates the Contentful Management API (CMA) client.
- `sync.ts`: Handles the two-way write-back. On publish, the system iterates over the draft's sections, upserts them into Contentful using the CMA, and links them back to the Page entry.

No Contentful-specific logic (e.g., `sys`, `fields`) leaks into the UI. The adapter maps Contentful entries into the pure Domain `Page` and `Section` objects.

## 4. Publish & SemVer Logic

When a user with the `publisher` role clicks "Publish":
1. The `publishRelease` use case fetches the previous release from the Release Store.
2. A deep deterministic diff is calculated between the old page state and the new draft (`src/domain/lib/diff.ts`).
3. The diff is mapped to a semantic version bump severity:
   - **Patch**: Only textual or prop changes inside existing sections.
   - **Minor**: A section was added.
   - **Major**: A section was removed, changed its type, or a required prop was broken.
4. If there are no changes, the publish is idempotent and aborted.
5. The immutable JSON release is stored locally (or in memory on Vercel), and the changes are synced back to Contentful.

## 5. Accessibility Evidence

The implementation prioritizes WCAG 2.2 AAA guidelines:
- **Base UI Integration**: Radix/Base UI handles complex ARIA roles, keyboard navigation, and focus management automatically.
- **Keyboard Operability**: The Studio, section reordering controls, and the generated landing pages are fully navigable via `Tab` and `Enter/Space`.
- **Focus States**: High-contrast, visible focus rings are enforced globally via Tailwind (`focus-visible:ring-purple-500`).
- **Automated Gates**: Axe-core scans are baked into Playwright tests (`e2e/a11y.spec.ts`). We generate an `a11y-report.json` artifact in CI to ensure 0 critical/serious violations before deployment.

## 6. What is Incomplete and Why

- **Vercel Release Persistence**: Currently, `RELEASE_STORE=fs` writes published versions as JSON files to the local file system. On Vercel, the filesystem is ephemeral (serverless). While the fallback `memory` store exists to prevent crashes, true release persistence in production would require replacing the `fs` adapter with an S3 bucket or Vercel KV adapter.
- **Image/Asset Uploads**: The Studio currently supports editing text and URLs in the `props` JSON. We opted not to build full media asset uploading into Contentful via the CMA for this sprint due to time constraints; image URLs must be manually provided.

## Getting Started

1. Copy `.env.example` to `.env.local` and add your Contentful space credentials.
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Run Unit Tests: `npm run test`
5. Run E2E & A11y Tests: `npx playwright test`
