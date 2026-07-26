import type { UserRole } from '../types';

export type PortalRole = 'admin' | 'secretary' | 'field_officer' | 'ward_member';

export const normalizeRole = (role: UserRole | string | undefined): PortalRole | null => {
  switch (role) {
    case 'Administrator': case 'admin': return 'admin';
    case 'Secretary': case 'secretary': return 'secretary';
    case 'Field Officer': case 'field_officer': case 'Panchayat Section Clerk': case 'clerk': return 'field_officer';
    case 'Ward Member': case 'ward_member': return 'ward_member';
    default: return null;
  }
};

const permissions: Record<PortalRole, string[]> = {
  admin: ['*'],
  secretary: ['/', '/map', '/registry', '/report', '/renewals', '/notifications', '/settings', '/profile'],
  field_officer: ['/', '/map', '/registry', '/sync', '/settings', '/profile'],
  ward_member: ['/', '/survey', '/settings', '/profile'],
};

export const canAccessPath = (role: UserRole | string | undefined, path: string) => {
  const normalized = normalizeRole(role);
  if (!normalized) return false;
  return permissions[normalized].includes('*') || permissions[normalized].includes(path);
};

export const roleHome = (role: UserRole | string | undefined) =>
  normalizeRole(role) === 'ward_member' ? '/survey' : '/';
