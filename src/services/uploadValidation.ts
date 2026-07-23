const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);

export const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[^a-zA-Z0-9._-]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '') || 'upload';
};

export const validateBuildingUpload = (file: Pick<File, 'type' | 'size'>): void => {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error('Only JPEG, PNG, WEBP, and PDF files are allowed for portal uploads.');
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('Uploads must be 10 MB or smaller.');
  }
};