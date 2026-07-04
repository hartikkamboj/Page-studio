import { describe, it, expect } from 'vitest';
import { getUserById, getAllUsers } from '@/domain/lib/users';

describe('getUserById', () => {
  it('returns Alice with role viewer', () => {
    const user = getUserById('alice');
    expect(user).not.toBeNull();
    expect(user!.name).toBe('Alice');
    expect(user!.role).toBe('viewer');
  });

  it('returns Bob with role editor', () => {
    const user = getUserById('bob');
    expect(user).not.toBeNull();
    expect(user!.name).toBe('Bob');
    expect(user!.role).toBe('editor');
  });

  it('returns Charlie with role publisher', () => {
    const user = getUserById('charlie');
    expect(user).not.toBeNull();
    expect(user!.name).toBe('Charlie');
    expect(user!.role).toBe('publisher');
  });

  it('returns null for unknown user', () => {
    expect(getUserById('unknown')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(getUserById('')).toBeNull();
  });
});

describe('getAllUsers', () => {
  it('returns all 3 users', () => {
    const users = getAllUsers();
    expect(users).toHaveLength(3);
  });

  it('returns users with correct structure', () => {
    const users = getAllUsers();
    for (const user of users) {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('role');
    }
  });

  it('includes all three roles', () => {
    const roles = getAllUsers().map((u) => u.role);
    expect(roles).toContain('viewer');
    expect(roles).toContain('editor');
    expect(roles).toContain('publisher');
  });
});
