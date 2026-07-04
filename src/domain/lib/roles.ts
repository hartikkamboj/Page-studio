// Roles — RBAC permission logic.
// Pure functions, ZERO framework imports.

import type { Role } from './users';

/**
 * Role hierarchy: publisher > editor > viewer
 * Higher number = more permissions.
 */
const ROLE_LEVEL: Record<Role, number> = {
  viewer: 1,
  editor: 2,
  publisher: 3,
};

/**
 * Check if a role meets the minimum required level.
 */
function hasMinimumRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_LEVEL[userRole] >= ROLE_LEVEL[requiredRole];
}

/**
 * Route → minimum role mapping.
 * More specific routes should be checked first.
 */
const ROUTE_PERMISSIONS: { pattern: RegExp; minRole: Role }[] = [
  // Public routes — no auth needed (handled separately in middleware)
  { pattern: /^\/login/, minRole: 'viewer' },
  { pattern: /^\/api\/auth/, minRole: 'viewer' },

  // Protected routes
  { pattern: /^\/api\/publish/, minRole: 'publisher' },
  { pattern: /^\/studio/, minRole: 'editor' },
  { pattern: /^\/preview/, minRole: 'viewer' },

  // Default — viewer can access everything else
  { pattern: /^\//, minRole: 'viewer' },
];

/**
 * Can the given role access this route?
 */
export function canAccessRoute(role: Role, route: string): boolean {
  for (const { pattern, minRole } of ROUTE_PERMISSIONS) {
    if (pattern.test(route)) {
      return hasMinimumRole(role, minRole);
    }
  }
  return false;
}

/**
 * Can the given role perform this action?
 */
export function canPerformAction(
  role: Role,
  action: 'view' | 'edit' | 'publish'
): boolean {
  switch (action) {
    case 'view':
      return hasMinimumRole(role, 'viewer');
    case 'edit':
      return hasMinimumRole(role, 'editor');
    case 'publish':
      return hasMinimumRole(role, 'publisher');
    default:
      return false;
  }
}

/**
 * Public routes that don't require authentication.
 */
const PUBLIC_ROUTES = ['/login', '/api/auth'];

export function isPublicRoute(route: string): boolean {
  return PUBLIC_ROUTES.some((pr) => route.startsWith(pr));
}
