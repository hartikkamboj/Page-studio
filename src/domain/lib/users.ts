// Users — Hardcoded user constants for demo RBAC.
// Pure data, ZERO framework imports.

export type Role = 'viewer' | 'editor' | 'publisher';

export interface User {
  id: string;
  name: string;
  role: Role;
}

/**
 * Hardcoded demo users.
 * In production, this would be a database lookup.
 */
export const USERS: Record<string, User> = {
  alice: { id: 'alice', name: 'Alice', role: 'viewer' },
  bob: { id: 'bob', name: 'Bob', role: 'editor' },
  charlie: { id: 'charlie', name: 'Charlie', role: 'publisher' },
} as const;

export type UserId = keyof typeof USERS;

/**
 * Look up a user by ID. Returns null if not found.
 * Server reads cookie → calls this → gets role.
 */
export function getUserById(id: string): User | null {
  return USERS[id] ?? null;
}

/**
 * Get all users (for the login page).
 */
export function getAllUsers(): User[] {
  return Object.values(USERS);
}
