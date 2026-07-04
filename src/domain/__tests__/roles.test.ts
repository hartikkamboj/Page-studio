import { describe, it, expect } from 'vitest';
import { canAccessRoute, canPerformAction, isPublicRoute } from '@/domain/lib/roles';

describe('canAccessRoute', () => {
  // ── Viewer ──
  it('viewer can access /preview', () => {
    expect(canAccessRoute('viewer', '/preview/homepage')).toBe(true);
  });

  it('viewer cannot access /studio', () => {
    expect(canAccessRoute('viewer', '/studio/homepage')).toBe(false);
  });

  it('viewer cannot access /api/publish', () => {
    expect(canAccessRoute('viewer', '/api/publish')).toBe(false);
  });

  // ── Editor ──
  it('editor can access /preview', () => {
    expect(canAccessRoute('editor', '/preview/homepage')).toBe(true);
  });

  it('editor can access /studio', () => {
    expect(canAccessRoute('editor', '/studio/homepage')).toBe(true);
  });

  it('editor cannot access /api/publish', () => {
    expect(canAccessRoute('editor', '/api/publish')).toBe(false);
  });

  // ── Publisher ──
  it('publisher can access /preview', () => {
    expect(canAccessRoute('publisher', '/preview/homepage')).toBe(true);
  });

  it('publisher can access /studio', () => {
    expect(canAccessRoute('publisher', '/studio/homepage')).toBe(true);
  });

  it('publisher can access /api/publish', () => {
    expect(canAccessRoute('publisher', '/api/publish')).toBe(true);
  });
});

describe('canPerformAction', () => {
  it('viewer can view', () => {
    expect(canPerformAction('viewer', 'view')).toBe(true);
  });

  it('viewer cannot edit', () => {
    expect(canPerformAction('viewer', 'edit')).toBe(false);
  });

  it('viewer cannot publish', () => {
    expect(canPerformAction('viewer', 'publish')).toBe(false);
  });

  it('editor can edit', () => {
    expect(canPerformAction('editor', 'edit')).toBe(true);
  });

  it('editor cannot publish', () => {
    expect(canPerformAction('editor', 'publish')).toBe(false);
  });

  it('publisher can do everything', () => {
    expect(canPerformAction('publisher', 'view')).toBe(true);
    expect(canPerformAction('publisher', 'edit')).toBe(true);
    expect(canPerformAction('publisher', 'publish')).toBe(true);
  });
});

describe('isPublicRoute', () => {
  it('/login is public', () => {
    expect(isPublicRoute('/login')).toBe(true);
  });

  it('/api/auth/login is public', () => {
    expect(isPublicRoute('/api/auth/login')).toBe(true);
  });

  it('/preview is not public', () => {
    expect(isPublicRoute('/preview/homepage')).toBe(false);
  });

  it('/studio is not public', () => {
    expect(isPublicRoute('/studio/homepage')).toBe(false);
  });
});
