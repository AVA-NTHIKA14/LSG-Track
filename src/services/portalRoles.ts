import type { UserRole } from '../types';

export const AUTHORIZED_PORTAL_ROLES: UserRole[] = [
  'Administrator',
  'Secretary',
  'Field Officer',
  'Ward Member'
];

export const isAuthorizedPortalRole = (
  role: unknown
): role is UserRole => {
  if (typeof role !== 'string') return false;

  return [
    'administrator',
    'admin',
    'secretary',
    'field officer',
    'field_officer',
    'ward member',
    'ward_member',
    'clerk',
    'panchayat section clerk'
  ].includes(role.trim().toLowerCase());
};
