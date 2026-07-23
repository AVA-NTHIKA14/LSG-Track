import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebaseConfig';
import { sanitizeFileName, validateBuildingUpload } from './uploadValidation';

export interface BuildingUploadContext {
  panchayathId: string;
  userId: string;
  buildingId: string;
  file: File;
}

export interface BuildingUploadResult {
  downloadUrl: string;
  storagePath: string;
  fileName: string;
}

export const storageService = {
  validateBuildingUpload(file: File): void {
    validateBuildingUpload(file);
  },

  async uploadBuildingAsset({ panchayathId, userId, buildingId, file }: BuildingUploadContext): Promise<BuildingUploadResult> {
    if (!storage) {
      throw new Error('Storage is unavailable. Configure Firebase before uploading files.');
    }

    this.validateBuildingUpload(file);

    const cleanName = sanitizeFileName(file.name);
    const storagePath = `panchayaths/${panchayathId}/uploads/${userId}/${Date.now()}-${buildingId}-${cleanName}`;
    const fileRef = ref(storage, storagePath);

    await uploadBytes(fileRef, file, {
      contentType: file.type,
      customMetadata: {
        buildingId,
        panchayathId,
        uploadedBy: userId,
        originalName: file.name
      }
    });

    return {
      downloadUrl: await getDownloadURL(fileRef),
      storagePath,
      fileName: file.name
    };
  }
};