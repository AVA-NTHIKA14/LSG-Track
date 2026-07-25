import type { UserRole } from '../types';

export const AUTHORIZED_PORTAL_ROLES: UserRole[] = [
  'Administrator',
  'Secretary',
  'Panchayat Section Clerk',
  'Ward Member'
];

export const isAuthorizedPortalRole = (role: unknown): role is UserRole => {
  return typeof role === 'string' && (AUTHORIZED_PORTAL_ROLES as string[]).includes(role);
};