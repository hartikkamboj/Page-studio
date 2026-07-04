// Draft Storage — localStorage adapter (client-side only).
// Persists editor drafts across page reloads.

import type { Page } from '@/domain/models/page';

const DRAFT_KEY_PREFIX = 'page-studio:draft:';

function getKey(slug: string): string {
  return `${DRAFT_KEY_PREFIX}${slug}`;
}

/**
 * Load a draft from localStorage.
 * Returns null if no draft exists or if running server-side.
 */
export function loadDraft(slug: string): Page | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(getKey(slug));
    if (!raw) return null;
    return JSON.parse(raw) as Page;
  } catch {
    return null;
  }
}

/**
 * Save a draft to localStorage.
 * No-op if running server-side.
 */
export function saveDraft(slug: string, page: Page): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(getKey(slug), JSON.stringify(page));
  } catch {
    console.warn('Failed to save draft to localStorage');
  }
}

/**
 * Clear a draft from localStorage.
 */
export function clearDraft(slug: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(getKey(slug));
}
