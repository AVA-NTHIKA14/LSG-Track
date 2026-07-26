import type { UserRole } from '../types';

export const AUTHORIZED_PORTAL_ROLES: UserRole[] = [
  'Administrator',
  'Secretary',
  'Field Officer',
  'Ward Member'
];

export const isAuthorizedPortalRole = (role: unknown): role is UserRole => {
  return typeof role === 'string' && [
    ...AUTHORIZED_PORTAL_ROLES,
    'admin', 'secretary', 'field_officer', 'ward_member', 'clerk', 'Panchayat Section Clerk'
  ].includes(role as UserRole);
};
