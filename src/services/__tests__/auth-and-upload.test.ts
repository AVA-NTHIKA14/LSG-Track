import { describe, expect, it } from 'vitest';
import { AUTHORIZED_PORTAL_ROLES } from '../portalRoles';
import { validateBuildingUpload } from '../uploadValidation';

describe('portal access controls', () => {
  it('only exposes the four allowed login roles', () => {
    expect(AUTHORIZED_PORTAL_ROLES).toEqual([
      'Administrator',
      'Secretary',
      'Panchayat Section Clerk',
      'Ward Member'
    ]);
  });
});

describe('building upload validation', () => {
  it('accepts a valid image upload', () => {
    expect(() => {
      validateBuildingUpload({
        name: 'inspection-photo.jpg',
        type: 'image/jpeg',
        size: 1024
      } as File);
    }).not.toThrow();
  });

  it('rejects spoofed or unsupported file types', () => {
    expect(() => {
      validateBuildingUpload({
        name: 'payload.exe',
        type: 'application/x-msdownload',
        size: 1024
      } as File);
    }).toThrow('Only JPEG, PNG, WEBP, and PDF files are allowed for portal uploads.');
  });

  it('rejects files larger than 10 MB', () => {
    expect(() => {
      validateBuildingUpload({
        name: 'large.pdf',
        type: 'application/pdf',
        size: 10 * 1024 * 1024 + 1
      } as File);
    }).toThrow('Uploads must be 10 MB or smaller.');
  });
});
