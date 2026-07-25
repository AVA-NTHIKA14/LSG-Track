import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseEnabled } from './firebaseConfig';
import type { Panchayath, Tenant } from '../types';
import { getAllSeedTenants, getSeedTenant, getSeedWardsForTenant, SEED_TENANTS } from '../fixtures/seedTenants';
import { storageService } from './storageService';

export const tenantService = {
  /**
   * Normalize a legacy Panchayath object to a full Tenant structure.
   */
  normalizeTenant(panchayath: Panchayath | Tenant): Tenant {
    if ('lsgType' in panchayath && panchayath.lsgType) {
      return panchayath as Tenant;
    }

    return {
      ...panchayath,
      lsgType: 'grama_panchayat',
      talukOrZone: panchayath.taluk || '',
      boundaryGeoJSON: panchayath.boundaryGeoJSON || '',
      gisBoundary: {
        inlineGeoJSON: panchayath.boundaryGeoJSON || '',
        localFallbackPath: `/data/${panchayath.id}_wards.geojson`
      },
      branding: {
        primaryColor: '#0F6E4F',
        secondaryColor: '#1E293B',
        slogan: `${panchayath.name} Monitoring Portal`
      },
      contactInfo: {
        email: `secretary.${panchayath.id}@lsgtrack.gov.in`
      },
      featureFlags: {
        enableWhatsAppAlerts: true,
        enablePublicPortal: true,
        enableKSmartSync: true
      },
      status: panchayath.status || 'active',
    };
  },

  /**
   * Dynamically fetch all tenants from Firestore or local seed fixtures.
   */
  async getTenants(): Promise<Tenant[]> {
    if (isFirebaseEnabled && db) {
      try {
        const snap = await getDoc(doc(db, 'config', 'panchayaths'));
        if (snap.exists() && Array.isArray(snap.data().list) && snap.data().list.length > 0) {
          return snap.data().list.map((p: Panchayath) => this.normalizeTenant(p));
        }
      } catch (err) {
        console.warn('Failed to fetch tenants from Firestore, falling back to seed:', err);
      }
    }
    return getAllSeedTenants();
  },

  /**
   * Fetch a single tenant document by ID.
   */
  async getTenantById(id: string): Promise<Tenant | undefined> {
    if (isFirebaseEnabled && db) {
      try {
        const snap = await getDoc(doc(db, 'panchayaths', id));
        if (snap.exists()) {
          return this.normalizeTenant(snap.data() as Tenant);
        }
      } catch (err) {
        console.warn(`Failed to fetch tenant ${id} from Firestore:`, err);
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
   * Non-destructive auto-seeding helper for Firebase mode.
   */
  async ensureDefaultTenantsSeeded(): Promise<void> {
    if (!isFirebaseEnabled || !db) return;

    try {
      const configRef = doc(db, 'config', 'panchayaths');
      const configSnap = await getDoc(configRef);
      const currentList: Tenant[] = configSnap.exists()
        ? (configSnap.data().list || []).map((p: any) => this.normalizeTenant(p))
        : [];
      let listUpdated = false;

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

            try {
              const blob = new Blob([panangadGeoJson], { type: 'application/json' });
              const uploadRes = await storageService.uploadTenantGisAsset('G110706', blob, 'panangad_wards.geojson');
              if (uploadRes?.downloadUrl) {
                panangadStorageUrl = uploadRes.downloadUrl;
              }
            } catch (storageErr) {
              console.info('Storage upload skipped during seeding:', storageErr);
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

        if (!tenantSnap.exists()) {
          await setDoc(tenantRef, fullSeedTenant);
        } else if (
          (fullSeedTenant.boundaryGeoJSON && (!tenantSnap.data().boundaryGeoJSON || tenantSnap.data().boundaryGeoJSON === '')) ||
          (fullSeedTenant.gisBoundary?.geoJsonUrl && !tenantSnap.data().gisBoundary?.geoJsonUrl)
        ) {
          await setDoc(
            tenantRef,
            {
              boundaryGeoJSON: fullSeedTenant.boundaryGeoJSON,
              gisBoundary: fullSeedTenant.gisBoundary
            },
            { merge: true }
          );
        }

        const wardsColRef = collection(db, 'panchayaths', fullSeedTenant.id, 'wards');
        const wardsSnap = await getDocs(wardsColRef);
        if (wardsSnap.empty) {
          const defaultWards = getSeedWardsForTenant(fullSeedTenant.id);
          for (const w of defaultWards) {
            await setDoc(doc(db, 'panchayaths', fullSeedTenant.id, 'wards', w.id), w);
          }
        }

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
