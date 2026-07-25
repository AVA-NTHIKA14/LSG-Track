import { authService } from './authService';
import { db, isFirebaseEnabled } from './firebaseConfig';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { storageService } from './storageService';
import type { Panchayath, Tenant } from '../types';
import {
  getAllSeedTenants,
  getSeedTenant,
  getSeedWardsForTenant,
  SEED_TENANTS,
} from '../fixtures/seedTenants';

export const ACTIVE_TENANT_KEY = 'cp_active_panchayat_code';
export const DEFAULT_TENANT_ID = '204902';

export const tenantService = {
  /**
   * Central single source of truth for resolving active tenant ID.
   */
  getActiveTenantId(): string {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      return localStorage.getItem(ACTIVE_TENANT_KEY) || DEFAULT_TENANT_ID;
    }
    if (currentUser.role === 'Administrator') {
      return localStorage.getItem(ACTIVE_TENANT_KEY) || DEFAULT_TENANT_ID;
    }
    return currentUser.panchayathId || DEFAULT_TENANT_ID;
  },

  /**
   * Set active tenant context (primarily for System Administrators).
   */
  setActiveTenantId(tenantId: string): void {
    if (tenantId) {
      localStorage.setItem(ACTIVE_TENANT_KEY, tenantId);
    }
  },

  /**
   * Normalize a Panchayath object into a full Tenant object with default fallback values.
   */
  normalizeTenant(panchayath: Panchayath | Tenant): Tenant {
    const existing = panchayath as Tenant;
    return {
      ...panchayath,
      lsgType: existing.lsgType || 'grama_panchayat',
      talukOrZone: existing.talukOrZone || panchayath.taluk || '',
      branding: existing.branding || {
        primaryColor: '#0F6E4F',
        secondaryColor: '#1E293B',
      },
      contactInfo: existing.contactInfo || {},
      gisBoundary: existing.gisBoundary || {
        inlineGeoJSON: panchayath.boundaryGeoJSON || '',
      },
      featureFlags: existing.featureFlags || {
        enableWhatsAppAlerts: true,
        enablePublicPortal: true,
        enableKSmartSync: true,
      },
      status: panchayath.status || 'active',
    };
  },

  /**
   * Dynamically fetch all tenants from Firestore or local seed fixtures.
   */
  async getTenants(): Promise<Tenant[]> {
    if (isFirebaseEnabled && db) {
      const snap = await getDoc(doc(db, 'config', 'panchayaths'));
      if (snap.exists() && Array.isArray(snap.data().list) && snap.data().list.length > 0) {
        return snap.data().list.map((p: Panchayath) => this.normalizeTenant(p));
      }
    }
    return getAllSeedTenants();
  },

  /**
   * Fetch a single tenant document by ID.
   */
  async getTenantById(id: string): Promise<Tenant | undefined> {
    if (isFirebaseEnabled && db) {
      const snap = await getDoc(doc(db, 'panchayaths', id));
      if (snap.exists()) {
        return this.normalizeTenant(snap.data() as Tenant);
      }
    }
    return getSeedTenant(id);
  },

  /**
   * Data-driven, fully generic boundary loader for any tenant:
   * 1. Try fetching from tenant.gisBoundary.geoJsonUrl (Firebase Storage URL).
   * 2. Try parsing inline GeoJSON string (boundaryGeoJSON / inlineGeoJSON).
   * 3. Try fetching data-driven local fallback path if configured (localFallbackPath).
   */
  async loadTenantBoundaryGeoJSON(tenant?: Tenant | Panchayath | null): Promise<any> {
    if (!tenant) return null;
    const normalized = this.normalizeTenant(tenant);

    // 1. Try Storage / Download URL fetch
    if (normalized.gisBoundary?.geoJsonUrl) {
      try {
        const res = await fetch(normalized.gisBoundary.geoJsonUrl);
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn(`Failed to fetch GeoJSON from url ${normalized.gisBoundary.geoJsonUrl}:`, err);
      }
    }

    // 2. Try inline stringified GeoJSON
    const inline = normalized.boundaryGeoJSON || normalized.gisBoundary?.inlineGeoJSON;
    if (inline) {
      try {
        return typeof inline === 'string' ? JSON.parse(inline) : inline;
      } catch (err) {
        console.warn('Failed to parse inline GeoJSON string:', err);
      }
    }

    // 3. Data-driven local fallback path (generic for any tenant with localFallbackPath)
    if (normalized.gisBoundary?.localFallbackPath) {
      try {
        const res = await fetch(normalized.gisBoundary.localFallbackPath);
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn(`Failed to fetch local fallback GeoJSON from ${normalized.gisBoundary.localFallbackPath}:`, err);
      }
    }

    return null;
  },

  /**
   * NON-DESTRUCTIVE & SELF-HEALING auto-seeding helper for Firebase mode:
   * 1. Checks if Panangad already has a valid Storage URL before attempting pre-fetch / upload.
   * 2. Safely attempts uploading default GIS assets to Storage (wrapped in inner try/catch to handle non-admin permissions).
   * 3. Only writes tenant document if doc doesn't already exist.
   * 4. Self-heals: if doc exists but lacks boundaryGeoJSON or geoJsonUrl, backfills boundary & Storage URL fields.
   * 5. Only populates default wards if wards subcollection is empty (never overwrites customized wards).
   * 6. Merges seed tenants into global config/panchayaths without dropping or overwriting user-added tenants.
   */
  async ensureDefaultTenantsSeeded(): Promise<void> {
    if (!isFirebaseEnabled || !db) return;

    try {
      const configRef = doc(db, 'config', 'panchayaths');
      const configSnap = await getDoc(configRef);
      const currentList: Panchayath[] = configSnap.exists() ? (configSnap.data().list || []) : [];
      let listUpdated = false;

      // Check if Panangad already has a valid Storage URL in Firestore to avoid redundant uploads
      const panangadTenantRef = doc(db, 'panchayaths', 'G110706');
      const panangadSnap = await getDoc(panangadTenantRef);
      const existingPanangadUrl = panangadSnap.exists() ? panangadSnap.data()?.gisBoundary?.geoJsonUrl : '';
      const panangadNeedsStorageUpload = !existingPanangadUrl || existingPanangadUrl.startsWith('/data/');

      let panangadGeoJson = '';
      let panangadStorageUrl = '';

      if (panangadNeedsStorageUpload && typeof window !== 'undefined') {
        try {
          const res = await fetch('/data/panangad_wards.geojson');
          if (res.ok) {
            const data = await res.json();
            panangadGeoJson = JSON.stringify(data);

            // Inner try/catch specifically wrapping Storage upload (permission-denied for non-admins is caught cleanly)
            try {
              const blob = new Blob([panangadGeoJson], { type: 'application/json' });
              const uploadRes = await storageService.uploadTenantGisAsset('G110706', blob, 'panangad_wards.geojson');
              if (uploadRes?.downloadUrl) {
                panangadStorageUrl = uploadRes.downloadUrl;
              }
            } catch (storageErr) {
              console.info('Storage upload skipped during seeding (non-admin or unconfigured):', storageErr);
            }
          }
        } catch (e) {
          console.warn('Could not pre-fetch Panangad GeoJSON for seeding:', e);
        }
      }

      for (const seedTenant of SEED_TENANTS) {
        const fullSeedTenant: Tenant = {
          ...seedTenant,
          boundaryGeoJSON: seedTenant.boundaryGeoJSON || (seedTenant.id === 'G110706' ? panangadGeoJson : ''),
          gisBoundary: {
            ...seedTenant.gisBoundary,
            geoJsonUrl: (seedTenant.id === 'G110706' && panangadStorageUrl) ? panangadStorageUrl : seedTenant.gisBoundary?.geoJsonUrl,
            inlineGeoJSON: seedTenant.gisBoundary?.inlineGeoJSON || (seedTenant.id === 'G110706' ? panangadGeoJson : '')
          }
        };

        const tenantRef = doc(db, 'panchayaths', fullSeedTenant.id);
        const tenantSnap = await getDoc(tenantRef);

        // 1. Non-destructive tenant document check (create if missing; backfill boundary/Storage URL if blank)
        if (!tenantSnap.exists()) {
          await setDoc(tenantRef, fullSeedTenant);
        } else if (
          (fullSeedTenant.boundaryGeoJSON && (!tenantSnap.data().boundaryGeoJSON || tenantSnap.data().boundaryGeoJSON === '')) ||
          (fullSeedTenant.gisBoundary?.geoJsonUrl && !tenantSnap.data().gisBoundary?.geoJsonUrl)
        ) {
          // Self-healing retry: backfill boundary & Storage URL fields if missing on existing doc
          await setDoc(
            tenantRef,
            {
              boundaryGeoJSON: fullSeedTenant.boundaryGeoJSON,
              gisBoundary: fullSeedTenant.gisBoundary
            },
            { merge: true }
          );
        }

        // 2. Non-destructive ward subcollection check (only seed if empty)
        const wardsColRef = collection(db, 'panchayaths', fullSeedTenant.id, 'wards');
        const wardsSnap = await getDocs(wardsColRef);
        if (wardsSnap.empty) {
          const defaultWards = getSeedWardsForTenant(fullSeedTenant.id);
          for (const w of defaultWards) {
            await setDoc(doc(db, 'panchayaths', fullSeedTenant.id, 'wards', w.id), w);
          }
        }

        // 3. Merging into config/panchayaths without dropping existing tenants
        const existingIdx = currentList.findIndex(p => p.id === fullSeedTenant.id);
        if (existingIdx === -1) {
          currentList.push(fullSeedTenant);
          listUpdated = true;
        } else if (
          (!currentList[existingIdx].boundaryGeoJSON && fullSeedTenant.boundaryGeoJSON) ||
          (!currentList[existingIdx].gisBoundary?.geoJsonUrl && fullSeedTenant.gisBoundary?.geoJsonUrl)
        ) {
          currentList[existingIdx] = {
            ...currentList[existingIdx],
            boundaryGeoJSON: fullSeedTenant.boundaryGeoJSON,
            gisBoundary: {
              ...currentList[existingIdx].gisBoundary,
              ...fullSeedTenant.gisBoundary
            }
          };
          listUpdated = true;
        }
      }

      if (listUpdated || !configSnap.exists()) {
        await setDoc(configRef, { list: currentList }, { merge: true });
      }
    } catch (err) {
      console.error('Non-destructive tenant seeding check failed:', err);
    }
  }
};
