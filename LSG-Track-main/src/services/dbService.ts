import { db, isFirebaseEnabled } from './firebaseConfig';
import { 
  collection, doc, addDoc, updateDoc, deleteDoc, 
  onSnapshot, query, orderBy, setDoc, getDoc 
} from 'firebase/firestore';
import type { 
  BuildingRecord, WardRecord, LicenseRecord, SurveyRecord, 
  SystemNotification, AuditLogRecord, SystemSettings, Panchayath, SyncHistoryRecord, WhatsAppLogRecord,
  WardReportRecord, WardReportStatus 
} from '../types';
import { authService } from './authService';
import { tenantService } from './tenantService';

import { 
  getSeedTenant, 
  getSeedWardsForTenant 
} from '../fixtures/seedTenants';

// Resolve current tenant context dynamically via tenantService
export const getActivePanchayathId = (): string => {
  return tenantService.getActiveTenantId();
};

// Dynamic LocalStorage Keys per tenant
const getKeys = (panchayathId: string) => ({
  WARDS: `cp_${panchayathId}_wards`,
  BUILDINGS: `cp_${panchayathId}_buildings`,
  LICENSES: `cp_${panchayathId}_licenses`,
  SURVEYS: `cp_${panchayathId}_surveys`,
  NOTIFICATIONS: `cp_${panchayathId}_notifications`,
  AUDIT_LOGS: `cp_${panchayathId}_audit_logs`,
  SETTINGS: `cp_${panchayathId}_settings`,
  SYNC_HISTORY: `cp_${panchayathId}_sync_history`,
  WHATSAPP_LOGS: `cp_${panchayathId}_whatsapp_logs`,
  WARD_REPORTS: `cp_${panchayathId}_ward_reports`
});

// Initialize localStorage partitions if empty
const initPanchayatLocalStorage = (panchayathId: string) => {
  const keys = getKeys(panchayathId);
  const isChakkittapara = panchayathId === '204902';
  const isPanangad = panchayathId === 'G110706';

  const savedWards = localStorage.getItem(keys.WARDS);
  const needsWardReset = isChakkittapara && savedWards && JSON.parse(savedWards).length !== 13;
  const needsPanangadWardReset = isPanangad && savedWards && (JSON.parse(savedWards).length !== 20 || JSON.parse(savedWards).some((w: any) => w.totalBuildings > 0));

  if (!savedWards || savedWards === '[]' || needsWardReset || needsPanangadWardReset) {
    const defaultWards: WardRecord[] = getSeedWardsForTenant(panchayathId);
    localStorage.setItem(keys.WARDS, JSON.stringify(defaultWards));
  }

  // Always initialize empty arrays for buildings and licenses for clean state
  const defaultBuildings: BuildingRecord[] = [];
  localStorage.setItem(keys.BUILDINGS, JSON.stringify(defaultBuildings));

  const defaultLicenses: LicenseRecord[] = [];
  localStorage.setItem(keys.LICENSES, JSON.stringify(defaultLicenses));

  if (!localStorage.getItem(keys.SURVEYS)) localStorage.setItem(keys.SURVEYS, JSON.stringify([]));
  if (!localStorage.getItem(keys.NOTIFICATIONS)) localStorage.setItem(keys.NOTIFICATIONS, JSON.stringify([]));
  if (!localStorage.getItem(keys.AUDIT_LOGS)) localStorage.setItem(keys.AUDIT_LOGS, JSON.stringify([]));
  if (!localStorage.getItem(keys.SYNC_HISTORY)) localStorage.setItem(keys.SYNC_HISTORY, JSON.stringify([]));
  if (!localStorage.getItem(keys.WHATSAPP_LOGS)) localStorage.setItem(keys.WHATSAPP_LOGS, JSON.stringify([]));
  if (!localStorage.getItem(keys.WARD_REPORTS)) localStorage.setItem(keys.WARD_REPORTS, JSON.stringify([]));
  
  if (!localStorage.getItem(keys.SETTINGS)) {
    const defaultSettings: SystemSettings = {
      highContrast: false,
      smsNotificationsEnabled: true,
      emailNotificationsEnabled: true
    };
    localStorage.setItem(keys.SETTINGS, JSON.stringify(defaultSettings));
  }
};

// Global Tenants List Key
const GLOBAL_PANCHARATH_KEY = 'cp_panchayaths';

// Pub-sub listeners
type SubscriptionCallback = (data: any) => void;
const subscribers: { [key: string]: Set<SubscriptionCallback> } = {
  buildings: new Set(),
  wards: new Set(),
  licenses: new Set(),
  surveys: new Set(),
  notifications: new Set(),
  auditLogs: new Set(),
  settings: new Set(),
  panchayaths: new Set(),
  syncHistory: new Set(),
  whatsappLogs: new Set(),
  wardReports: new Set(),
  users: new Set()
};

const notifySubscribers = (key: keyof typeof subscribers, data: any) => {
  subscribers[key].forEach(cb => cb(data));
};

export const dbService = {
  // --- PANCHAYATH / TENANTS ---
  async getPanchayaths(): Promise<Panchayath[]> {
    if (isFirebaseEnabled && db) {
      await tenantService.ensureDefaultTenantsSeeded();
      return tenantService.getTenants();
    } else {
      try {
        const saved = localStorage.getItem(GLOBAL_PANCHARATH_KEY);
        let list: Panchayath[] = [];
        if (saved) {
          try {
            list = JSON.parse(saved);
          } catch {
            list = [];
          }
        }

        const chakkittaparaIdx = list.findIndex(p => p.id === '204902');
        if (chakkittaparaIdx === -1 || !list[chakkittaparaIdx].boundaryGeoJSON) {
          const chakkittaparaRecord = getSeedTenant('204902');
          if (chakkittaparaRecord) {
            if (chakkittaparaIdx > -1) {
              list[chakkittaparaIdx] = chakkittaparaRecord;
            } else {
              list.push(chakkittaparaRecord);
            }
            localStorage.setItem(GLOBAL_PANCHARATH_KEY, JSON.stringify(list));
          }
        }

        const panangadIdx = list.findIndex(p => p.id === 'G110706');
        if (panangadIdx === -1 || !list[panangadIdx].boundaryGeoJSON) {
          try {
            const res = await fetch('/data/panangad_wards.geojson');
            const data = await res.json();
            const panangadSeed = getSeedTenant('G110706');
            const panangadRecord: Panchayath = {
              ...(panangadSeed || {
                id: 'G110706',
                name: 'Panangad Grama Panchayat',
                district: 'Kozhikode',
                taluk: 'Balussery',
                status: 'active'
              }),
              boundaryGeoJSON: JSON.stringify(data),
            };
            if (panangadIdx > -1) {
              list[panangadIdx] = panangadRecord;
            } else {
              list.push(panangadRecord);
            }
            localStorage.setItem(GLOBAL_PANCHARATH_KEY, JSON.stringify(list));
            notifySubscribers('panchayaths', list);
          } catch (e) {
            console.error('Failed to seed Panangad GP boundaries:', e);
          }
        }

        return list;
      } catch {
        return [];
      }
    }
  },

  async onboardPanchayath(panchayath: Panchayath, initialWards: { id: string; name: string }[]): Promise<void> {
    if (isFirebaseEnabled && db) {
      // Save tenant document
      await setDoc(doc(db, 'panchayaths', panchayath.id), {
        id: panchayath.id,
        name: panchayath.name,
        district: panchayath.district,
        taluk: panchayath.taluk || '',
        boundaryGeoJSON: panchayath.boundaryGeoJSON || '',
        status: panchayath.status
      });

      // Initialize wards subcollection
      for (const w of initialWards) {
        const wardDoc: WardRecord = {
          id: w.id,
          name: w.name,
          totalBuildings: 0,
          licensedBuildings: 0,
          pendingBuildings: 0,
          unlicensedBuildings: 0,
          compliancePercentage: 100,
          assignedOfficer: 'Unassigned'
        };
        await setDoc(doc(db, 'panchayaths', panchayath.id, 'wards', w.id), wardDoc);
      }

      // Update global list
      const listRef = doc(db, 'config', 'panchayaths');
      const snap = await getDoc(listRef);
      const currentList: Panchayath[] = snap.exists() ? (snap.data().list || []) : [];
      currentList.push(panchayath);
      await setDoc(listRef, { list: currentList });
    } else {
      const list = JSON.parse(localStorage.getItem(GLOBAL_PANCHARATH_KEY) || '[]');
      list.push(panchayath);
      localStorage.setItem(GLOBAL_PANCHARATH_KEY, JSON.stringify(list));

      // Init dynamic storage partition
      initPanchayatLocalStorage(panchayath.id);
      const keys = getKeys(panchayath.id);

      const wards: WardRecord[] = initialWards.map(w => ({
        id: w.id,
        name: w.name,
        totalBuildings: 0,
        licensedBuildings: 0,
        pendingBuildings: 0,
        unlicensedBuildings: 0,
        compliancePercentage: 100,
        assignedOfficer: 'Unassigned'
      }));

      localStorage.setItem(keys.WARDS, JSON.stringify(wards));
      notifySubscribers('panchayaths', list);
    }
    
    await this.addAuditLog('ONBOARD', `Onboarded new Panchayat: ${panchayath.name} (Code: ${panchayath.id}) with ${initialWards.length} wards.`);
  },

  subscribeToPanchayaths(callback: (list: Panchayath[]) => void): () => void {
    if (isFirebaseEnabled && db) {
      return onSnapshot(doc(db, 'config', 'panchayaths'), (snapshot) => {
        callback(snapshot.exists() ? (snapshot.data()?.list || []) : []);
      });
    } else {
      const list = JSON.parse(localStorage.getItem(GLOBAL_PANCHARATH_KEY) || '[]');
      callback(list);
      subscribers.panchayaths.add(callback);
      return () => subscribers.panchayaths.delete(callback);
    }
  },

  // --- AUDIT LOGS ---
  async addAuditLog(action: string, description: string): Promise<void> {
    const currentUser = authService.getCurrentUser();
    const activePId = getActivePanchayathId();
    const log: AuditLogRecord = {
      id: 'LOG-' + Date.now(),
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || 'anonymous',
      userName: currentUser?.name || 'Anonymous User',
      userRole: currentUser?.role || 'Ward Member',
      action,
      description
    };

    if (isFirebaseEnabled && db) {
      await addDoc(collection(db, 'panchayaths', activePId, 'auditLogs'), log);
    } else {
      initPanchayatLocalStorage(activePId);
      const keys = getKeys(activePId);
      const logs = JSON.parse(localStorage.getItem(keys.AUDIT_LOGS) || '[]');
      logs.unshift(log);
      localStorage.setItem(keys.AUDIT_LOGS, JSON.stringify(logs));
      notifySubscribers('auditLogs', logs);
    }
  },

  subscribeToAuditLogs(callback: (logs: AuditLogRecord[]) => void): () => void {
    const activePId = getActivePanchayathId();
    if (isFirebaseEnabled && db) {
      const q = query(collection(db, 'panchayaths', activePId, 'auditLogs'), orderBy('timestamp', 'desc'));
      return onSnapshot(q, (snapshot) => {
        const logs: AuditLogRecord[] = [];
        snapshot.forEach((doc) => logs.push(doc.data() as AuditLogRecord));
        callback(logs);
      });
    } else {
      initPanchayatLocalStorage(activePId);
      const keys = getKeys(activePId);
      const logs = JSON.parse(localStorage.getItem(keys.AUDIT_LOGS) || '[]');
      callback(logs);
      subscribers.auditLogs.add(callback);
      return () => subscribers.auditLogs.delete(callback);
    }
  },

  // --- WARDS ---
  subscribeToWards(callback: (wards: WardRecord[]) => void): () => void {
    const activePId = getActivePanchayathId();
    if (isFirebaseEnabled && db) {
      return onSnapshot(collection(db, 'panchayaths', activePId, 'wards'), (snapshot) => {
        const wards: WardRecord[] = [];
        snapshot.forEach((doc) => wards.push(doc.data() as WardRecord));
        callback(wards);
      });
    } else {
      initPanchayatLocalStorage(activePId);
      const keys = getKeys(activePId);
      const wards = JSON.parse(localStorage.getItem(keys.WARDS) || '[]');
      callback(wards);
      subscribers.wards.add(callback);
      return () => subscribers.wards.delete(callback);
    }
  },

  async assignWardOfficer(wardId: string, officerName: string): Promise<void> {
    const activePId = getActivePanchayathId();
    if (isFirebaseEnabled && db) {
      await updateDoc(doc(db, 'panchayaths', activePId, 'wards', wardId), { assignedOfficer: officerName });
    } else {
      initPanchayatLocalStorage(activePId);
      const keys = getKeys(activePId);
      const wards: WardRecord[] = JSON.parse(localStorage.getItem(keys.WARDS) || '[]');
      const index = wards.findIndex(w => w.id === wardId);
      if (index > -1) {
        wards[index].assignedOfficer = officerName;
        localStorage.setItem(keys.WARDS, JSON.stringify(wards));
        notifySubscribers('wards', wards);
      }
    }
    await this.addAuditLog('WARD_UPDATE', `Assigned officer ${officerName} to Ward ${wardId}.`);
  },

  async updateWardStats(wardNumber: string): Promise<void> {
    const activePId = getActivePanchayathId();
    if (isFirebaseEnabled && db) {
      // In production Firestore, this runs on a Cloud Function or triggers.
      // We simulate locally here by performing query
    } else {
      initPanchayatLocalStorage(activePId);
      const keys = getKeys(activePId);
      const buildings: BuildingRecord[] = JSON.parse(localStorage.getItem(keys.BUILDINGS) || '[]');
      const wards: WardRecord[] = JSON.parse(localStorage.getItem(keys.WARDS) || '[]');
      
      const wardBuildings = buildings.filter(b => b.wardNumber === wardNumber);
      const licensed = wardBuildings.filter(b => b.status === 'licensed').length;
      const unlicensed = wardBuildings.filter(b => b.status === 'unlicensed').length;
      const pending = wardBuildings.filter(b => b.status === 'pending').length;
      const govtOrNgo = wardBuildings.filter(b => b.status === 'govt' || b.status === 'ngo').length;
      
      const wardIndex = wards.findIndex(w => w.id === wardNumber);
      if (wardIndex > -1) {
        wards[wardIndex].totalBuildings = wardBuildings.length;
        wards[wardIndex].licensedBuildings = licensed;
        wards[wardIndex].unlicensedBuildings = unlicensed;
        wards[wardIndex].pendingBuildings = pending;
        
        const complianceDenominator = wardBuildings.length - govtOrNgo;
        wards[wardIndex].compliancePercentage = complianceDenominator > 0 
          ? Math.round((licensed / complianceDenominator) * 100) || 0
          : 100;
        
        localStorage.setItem(keys.WARDS, JSON.stringify(wards));
        notifySubscribers('wards', wards);
      }
    }
  },

  // --- BUILDINGS ---
  subscribeToBuildings(callback: (buildings: BuildingRecord[]) => void): () => void {
    const activePId = getActivePanchayathId();
    if (isFirebaseEnabled && db) {
      return onSnapshot(collection(db, 'panchayaths', activePId, 'establishments'), (snapshot) => {
        const buildings: BuildingRecord[] = [];
        snapshot.forEach((doc) => buildings.push(doc.data() as BuildingRecord));
        callback(buildings);
      });
    } else {
      initPanchayatLocalStorage(activePId);
      const keys = getKeys(activePId);
      const buildings = JSON.parse(localStorage.getItem(keys.BUILDINGS) || '[]');
      callback(buildings);
      subscribers.buildings.add(callback);
      return () => subscribers.buildings.delete(callback);
    }
  },

  async addBuilding(building: Omit<BuildingRecord, 'history'>): Promise<void> {
    const currentUser = authService.getCurrentUser();
    const activePId = getActivePanchayathId();
    const newBuilding: BuildingRecord = {
      ...building,
      createdBy: currentUser?.id,
      history: [
        {
          date: new Date().toISOString().split('T')[0],
          action: 'CREATE',
          user: currentUser?.name || 'System',
          remarks: 'Registered building details in e-Governance portal'
        }
      ]
    };

    if (isFirebaseEnabled && db) {
      await setDoc(doc(db, 'panchayaths', activePId, 'establishments', building.id), newBuilding);
    } else {
      initPanchayatLocalStorage(activePId);
      const keys = getKeys(activePId);
      const buildings = JSON.parse(localStorage.getItem(keys.BUILDINGS) || '[]');
      buildings.push(newBuilding);
      localStorage.setItem(keys.BUILDINGS, JSON.stringify(buildings));
      notifySubscribers('buildings', buildings);
    }

    await this.updateWardStats(building.wardNumber);
    await this.addAuditLog('CREATE', `Registered commercial building ${building.businessName} (ID: ${building.id}) in Ward ${building.wardNumber}.`);
    await this.addNotification(
      'New Building Registered',
      `${building.businessName} has been registered in Ward ${building.wardNumber} and requires survey.`,
      'info'
    );
  },

  async updateBuilding(id: string, updates: Partial<BuildingRecord>): Promise<void> {
    const activePId = getActivePanchayathId();
    if (isFirebaseEnabled && db) {
      const ref = doc(db, 'panchayaths', activePId, 'establishments', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data() as BuildingRecord;
        const updatedHistory = [...(data.history || []), {
          date: new Date().toISOString().split('T')[0],
          action: 'UPDATE_DETAILS',
          user: authService.getCurrentUser()?.name || 'System',
          remarks: 'Updated building records in e-Governance portal'
        }];
        await updateDoc(ref, { 
          ...updates, 
          history: updatedHistory 
        });
      }
    } else {
      initPanchayatLocalStorage(activePId);
      const keys = getKeys(activePId);
      const buildings = JSON.parse(localStorage.getItem(keys.BUILDINGS) || '[]');
      const index = buildings.findIndex((b: BuildingRecord) => b.id === id);
      if (index > -1) {
        buildings[index] = {
          ...buildings[index],
          ...updates,
          history: [
            ...(buildings[index].history || []),
            {
              date: new Date().toISOString().split('T')[0],
              action: 'UPDATE_DETAILS',
              user: authService.getCurrentUser()?.name || 'System',
              remarks: 'Updated building records in e-Governance portal'
            }
          ]
        };
        localStorage.setItem(keys.BUILDINGS, JSON.stringify(buildings));
        notifySubscribers('buildings', buildings);
        await this.updateWardStats(buildings[index].wardNumber);
      }
    }
  },

  async updateBuildingStatus(id: string, status: BuildingRecord['status'], licenseId?: string, surveyNotes?: string): Promise<void> {
    const activePId = getActivePanchayathId();
    if (isFirebaseEnabled && db) {
      const ref = doc(db, 'panchayaths', activePId, 'establishments', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data() as BuildingRecord;
        const updatedHistory = [...(data.history || []), {
          date: new Date().toISOString().split('T')[0],
          action: 'UPDATE_STATUS',
          user: authService.getCurrentUser()?.name || 'System',
          remarks: `Status updated to ${status}. ${surveyNotes || ''}`
        }];
        await updateDoc(ref, { 
          status, 
          licenseId: licenseId || data.licenseId || null, 
          history: updatedHistory 
        });
      }
    } else {
      initPanchayatLocalStorage(activePId);
      const keys = getKeys(activePId);
      const buildings = JSON.parse(localStorage.getItem(keys.BUILDINGS) || '[]');
      const index = buildings.findIndex((b: BuildingRecord) => b.id === id);
      if (index > -1) {
        buildings[index].status = status;
        if (licenseId) buildings[index].licenseId = licenseId;
        buildings[index].history = [
          ...(buildings[index].history || []),
          {
            date: new Date().toISOString().split('T')[0],
            action: 'UPDATE_STATUS',
            user: authService.getCurrentUser()?.name || 'System',
            remarks: `Status updated to ${status}. ${surveyNotes || ''}`
          }
        ];
        localStorage.setItem(keys.BUILDINGS, JSON.stringify(buildings));
        notifySubscribers('buildings', buildings);
        await this.updateWardStats(buildings[index].wardNumber);
      }
    }
  },

  async deleteBuilding(id: string): Promise<void> {
    const activePId = getActivePanchayathId();
    let bldgName = id;
    let wardNumber = '1';
    
    if (isFirebaseEnabled && db) {
      const ref = doc(db, 'panchayaths', activePId, 'establishments', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const b = snap.data() as BuildingRecord;
        bldgName = b.businessName;
        wardNumber = b.wardNumber;
      }
      await deleteDoc(ref);
    } else {
      initPanchayatLocalStorage(activePId);
      const keys = getKeys(activePId);
      const buildings = JSON.parse(localStorage.getItem(keys.BUILDINGS) || '[]');
      const bIndex = buildings.findIndex((b: BuildingRecord) => b.id === id);
      if (bIndex > -1) {
        bldgName = buildings[bIndex].businessName;
        wardNumber = buildings[bIndex].wardNumber;
        buildings.splice(bIndex, 1);
        localStorage.setItem(keys.BUILDINGS, JSON.stringify(buildings));
        notifySubscribers('buildings', buildings);
      }
    }

    await this.updateWardStats(wardNumber);
    await this.addAuditLog('DELETE', `Archived / Deleted building ${bldgName} (ID: ${id}) from Ward ${wardNumber}.`);
  },

  // --- LICENSES ---
  subscribeToLicenses(callback: (licenses: LicenseRecord[]) => void): () => void {
    const activePId = getActivePanchayathId();
    if (isFirebaseEnabled && db) {
      return onSnapshot(collection(db, 'panchayaths', activePId, 'licenses'), (snapshot) => {
        const licenses: LicenseRecord[] = [];
        snapshot.forEach((doc) => licenses.push(doc.data() as LicenseRecord));
        callback(licenses);
      });
    } else {
      initPanchayatLocalStorage(activePId);
      const keys = getKeys(activePId);
      const licenses = JSON.parse(localStorage.getItem(keys.LICENSES) || '[]');
      callback(licenses);
      subscribers.licenses.add(callback);
      return () => subscribers.licenses.delete(callback);
    }
  },

  async generateLicense(buildingId: string, type: string, durationYears: number = 1): Promise<void> {
    const activePId = getActivePanchayathId();
    const licId = 'LIC-CP-' + Math.floor(1000 + Math.random() * 9000);
    const issueDate = new Date().toISOString().split('T')[0];
    const expiryDate = new Date(new Date().setFullYear(new Date().getFullYear() + durationYears)).toISOString().split('T')[0];
    
    const newLicense: LicenseRecord = {
      id: licId,
      buildingId,
      licenseType: type,
      issueDate,
      expiryDate,
      status: 'active',
      feePaid: 1500 * durationYears
    };

    if (isFirebaseEnabled && db) {
      await setDoc(doc(db, 'panchayaths', activePId, 'licenses', licId), newLicense);
    } else {
      initPanchayatLocalStorage(activePId);
      const keys = getKeys(activePId);
      const licenses = JSON.parse(localStorage.getItem(keys.LICENSES) || '[]');
      licenses.push(newLicense);
      localStorage.setItem(keys.LICENSES, JSON.stringify(licenses));
      notifySubscribers('licenses', licenses);
    }

    await this.updateBuildingStatus(buildingId, 'licensed', licId, `License generated successfully. License ID: ${licId}`);
    await this.addAuditLog('APPROVE', `Secretary approved and generated License #${licId} for Building ID: ${buildingId}.`);
    await this.addNotification(
      'License Issued',
      `Trade License ${licId} has been successfully issued for building ${buildingId}.`,
      'success'
    );
  },

  async addHistoricalLicense(license: LicenseRecord): Promise<void> {
    const activePId = getActivePanchayathId();
    if (isFirebaseEnabled && db) {
      await setDoc(doc(db, 'panchayaths', activePId, 'licenses', license.id), license);
    } else {
      initPanchayatLocalStorage(activePId);
      const keys = getKeys(activePId);
      const licenses = JSON.parse(localStorage.getItem(keys.LICENSES) || '[]');
      licenses.push(license);
      localStorage.setItem(keys.LICENSES, JSON.stringify(licenses));
      notifySubscribers('licenses', licenses);
    }
    await this.updateBuildingStatus(license.buildingId, license.status === 'active' ? 'licensed' : 'unlicensed', license.id, `Historical license imported. ID: ${license.id}`);
    await this.addAuditLog('CREATE', `Imported historical Trade License #${license.id} for Building ID: ${license.buildingId}.`);
  },

  async renewLicense(licenseId: string): Promise<void> {
    const activePId = getActivePanchayathId();
    if (isFirebaseEnabled && db) {
      const ref = doc(db, 'panchayaths', activePId, 'licenses', licenseId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const lic = snap.data() as LicenseRecord;
        const currentExpiry = new Date(lic.expiryDate);
        const newExpiry = new Date(currentExpiry.setFullYear(currentExpiry.getFullYear() + 1)).toISOString().split('T')[0];
        await updateDoc(ref, { expiryDate: newExpiry, status: 'active' });
        await this.updateBuildingStatus(lic.buildingId, 'licensed', lic.id, 'License renewed for 1 fiscal year.');
      }
    } else {
      initPanchayatLocalStorage(activePId);
      const keys = getKeys(activePId);
      const licenses = JSON.parse(localStorage.getItem(keys.LICENSES) || '[]');
      const idx = licenses.findIndex((l: LicenseRecord) => l.id === licenseId);
      if (idx > -1) {
        const lic = licenses[idx];
        const currentExpiry = new Date(lic.expiryDate);
        const newExpiry = new Date(currentExpiry.setFullYear(currentExpiry.getFullYear() + 1)).toISOString().split('T')[0];
        licenses[idx].expiryDate = newExpiry;
        licenses[idx].status = 'active';
        localStorage.setItem(keys.LICENSES, JSON.stringify(licenses));
        notifySubscribers('licenses', licenses);
        await this.updateBuildingStatus(lic.buildingId, 'licensed', lic.id, 'License renewed for 1 fiscal year.');
      }
    }

    await this.addAuditLog('UPDATE', `Renewed License ID: ${licenseId} for an additional year.`);
  },

  // --- SURVEYS ---
  subscribeToSurveys(callback: (surveys: SurveyRecord[]) => void): () => void {
    const activePId = getActivePanchayathId();
    if (isFirebaseEnabled && db) {
      return onSnapshot(collection(db, 'panchayaths', activePId, 'surveys'), (snapshot) => {
        const surveys: SurveyRecord[] = [];
        snapshot.forEach((doc) => surveys.push(doc.data() as SurveyRecord));
        callback(surveys);
      });
    } else {
      initPanchayatLocalStorage(activePId);
      const keys = getKeys(activePId);
      const surveys = JSON.parse(localStorage.getItem(keys.SURVEYS) || '[]');
      callback(surveys);
      subscribers.surveys.add(callback);
      return () => subscribers.surveys.delete(callback);
    }
  },

  async addSurvey(survey: Omit<SurveyRecord, 'id' | 'officerId' | 'officerName' | 'surveyDate'>): Promise<void> {
    const user = authService.getCurrentUser();
    const activePId = getActivePanchayathId();
    const newSurvey: SurveyRecord = {
      ...survey,
      id: 'SRV-' + Date.now(),
      officerId: user?.id || 'usr-anonymous',
      officerName: user?.name || 'Anonymous Officer',
      surveyDate: new Date().toISOString().split('T')[0],
    };

    if (isFirebaseEnabled && db) {
      await setDoc(doc(db, 'panchayaths', activePId, 'surveys', newSurvey.id), newSurvey);
    } else {
      initPanchayatLocalStorage(activePId);
      const keys = getKeys(activePId);
      const surveys = JSON.parse(localStorage.getItem(keys.SURVEYS) || '[]');
      surveys.unshift(newSurvey);
      localStorage.setItem(keys.SURVEYS, JSON.stringify(surveys));
      notifySubscribers('surveys', surveys);
    }

    if (newSurvey.status === 'submitted') {
      await this.updateBuildingStatus(survey.buildingId, 'pending', undefined, 'Field survey submitted. Awaiting review.');
      await this.addNotification(
        'Survey Verification Required',
        `Field Survey for building (ID: ${survey.buildingId}) has been submitted for Secretary verification.`,
        'info'
      );
      await this.addAuditLog('SURVEY_SUBMIT', `Submitted field survey details for Building ID: ${survey.buildingId}.`);
    } else {
      await this.addAuditLog('SURVEY_DRAFT', `Saved survey draft locally for Building ID: ${survey.buildingId}.`);
    }
  },

  async approveSurvey(surveyId: string): Promise<void> {
    const activePId = getActivePanchayathId();
    let buildingId = '';
    
    if (isFirebaseEnabled && db) {
      const ref = doc(db, 'panchayaths', activePId, 'surveys', surveyId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const s = snap.data() as SurveyRecord;
        buildingId = s.buildingId;
        await updateDoc(ref, { status: 'approved' });
      }
    } else {
      initPanchayatLocalStorage(activePId);
      const keys = getKeys(activePId);
      const surveys = JSON.parse(localStorage.getItem(keys.SURVEYS) || '[]');
      const idx = surveys.findIndex((s: SurveyRecord) => s.id === surveyId);
      if (idx > -1) {
        surveys[idx].status = 'approved';
        buildingId = surveys[idx].buildingId;
        localStorage.setItem(keys.SURVEYS, JSON.stringify(surveys));
        notifySubscribers('surveys', surveys);
      }
    }

    if (buildingId) {
      await this.generateLicense(buildingId, 'D&O Trade License');
    }
  },

  async rejectSurvey(surveyId: string, rejectionRemarks: string): Promise<void> {
    const activePId = getActivePanchayathId();
    let buildingId = '';
    
    if (isFirebaseEnabled && db) {
      const ref = doc(db, 'panchayaths', activePId, 'surveys', surveyId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const s = snap.data() as SurveyRecord;
        buildingId = s.buildingId;
        await updateDoc(ref, { status: 'rejected', remarks: `REJECTED: ${rejectionRemarks}` });
      }
    } else {
      initPanchayatLocalStorage(activePId);
      const keys = getKeys(activePId);
      const surveys = JSON.parse(localStorage.getItem(keys.SURVEYS) || '[]');
      const idx = surveys.findIndex((s: SurveyRecord) => s.id === surveyId);
      if (idx > -1) {
        surveys[idx].status = 'rejected';
        surveys[idx].remarks = `REJECTED: ${rejectionRemarks}. Original: ${surveys[idx].remarks}`;
        buildingId = surveys[idx].buildingId;
        localStorage.setItem(keys.SURVEYS, JSON.stringify(surveys));
        notifySubscribers('surveys', surveys);
      }
    }

    if (buildingId) {
      await this.updateBuildingStatus(buildingId, 'unlicensed', undefined, `Survey rejected: ${rejectionRemarks}`);
      await this.updateBuilding(buildingId, { isReturnedForCorrection: true });
      await this.addAuditLog('REJECT', `Secretary rejected survey #${surveyId} for Building: ${buildingId}. Remarks: ${rejectionRemarks}`);
      await this.addNotification(
        'Survey Application Rejected',
        `Survey #${surveyId} was rejected by Secretary. Reason: ${rejectionRemarks}`,
        'warning'
      );
    }
  },

  // --- NOTIFICATIONS ---
  subscribeToNotifications(callback: (notifications: SystemNotification[]) => void): () => void {
    const activePId = getActivePanchayathId();
    if (isFirebaseEnabled && db) {
      return onSnapshot(collection(db, 'panchayaths', activePId, 'notifications'), (snapshot) => {
        const notifications: SystemNotification[] = [];
        snapshot.forEach((doc) => notifications.push(doc.data() as SystemNotification));
        callback(notifications);
      });
    } else {
      initPanchayatLocalStorage(activePId);
      const keys = getKeys(activePId);
      const notifications = JSON.parse(localStorage.getItem(keys.NOTIFICATIONS) || '[]');
      callback(notifications);
      subscribers.notifications.add(callback);
      return () => subscribers.notifications.delete(callback);
    }
  },

  async addNotification(title: string, message: string, type: SystemNotification['type']): Promise<void> {
    const activePId = getActivePanchayathId();
    const notif: SystemNotification = {
      id: 'NOT-' + Date.now(),
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };

    if (isFirebaseEnabled && db) {
      await addDoc(collection(db, 'panchayaths', activePId, 'notifications'), notif);
    } else {
      initPanchayatLocalStorage(activePId);
      const keys = getKeys(activePId);
      const notifications = JSON.parse(localStorage.getItem(keys.NOTIFICATIONS) || '[]');
      notifications.unshift(notif);
      localStorage.setItem(keys.NOTIFICATIONS, JSON.stringify(notifications));
      notifySubscribers('notifications', notifications);
    }
  },

  async markNotificationAsRead(id: string): Promise<void> {
    const activePId = getActivePanchayathId();
    if (isFirebaseEnabled && db) {
      // In production, update matching doc
    } else {
      initPanchayatLocalStorage(activePId);
      const keys = getKeys(activePId);
      const notifications = JSON.parse(localStorage.getItem(keys.NOTIFICATIONS) || '[]');
      const index = notifications.findIndex((n: SystemNotification) => n.id === id);
      if (index > -1) {
        notifications[index].read = true;
        localStorage.setItem(keys.NOTIFICATIONS, JSON.stringify(notifications));
        notifySubscribers('notifications', notifications);
      }
    }
  },

  // --- SETTINGS ---
  subscribeToSettings(callback: (settings: SystemSettings) => void): () => void {
    const activePId = getActivePanchayathId();
    if (isFirebaseEnabled && db) {
      const ref = doc(db, 'panchayaths', activePId, 'settings', 'config');
      return onSnapshot(ref, (doc) => {
        if (doc.exists()) {
          callback(doc.data() as SystemSettings);
        }
      });
    } else {
      initPanchayatLocalStorage(activePId);
      const keys = getKeys(activePId);
      const settings = JSON.parse(localStorage.getItem(keys.SETTINGS) || '{}');
      callback(settings);
      subscribers.settings.add(callback);
      return () => subscribers.settings.delete(callback);
    }
  },

  async updateSettings(settings: Partial<SystemSettings>): Promise<void> {
    const activePId = getActivePanchayathId();
    if (isFirebaseEnabled && db) {
      const ref = doc(db, 'panchayaths', activePId, 'settings', 'config');
      await setDoc(ref, settings, { merge: true });
    } else {
      initPanchayatLocalStorage(activePId);
      const keys = getKeys(activePId);
      const current = JSON.parse(localStorage.getItem(keys.SETTINGS) || '{}');
      const updated = { ...current, ...settings };
      localStorage.setItem(keys.SETTINGS, JSON.stringify(updated));
      notifySubscribers('settings', updated);
    }
  },

  // --- SYNC HISTORY ---
  async addSyncHistory(record: Omit<SyncHistoryRecord, 'id' | 'timestamp'>): Promise<void> {
    const activePId = getActivePanchayathId();
    const newRecord: SyncHistoryRecord = {
      ...record,
      id: 'SYNC-' + Date.now(),
      timestamp: new Date().toISOString()
    };
    if (isFirebaseEnabled && db) {
      await setDoc(doc(db, 'panchayaths', activePId, 'syncHistory', newRecord.id), newRecord);
    } else {
      initPanchayatLocalStorage(activePId);
      const keys = getKeys(activePId);
      const historyList: SyncHistoryRecord[] = JSON.parse(localStorage.getItem(keys.SYNC_HISTORY) || '[]');
      historyList.unshift(newRecord);
      localStorage.setItem(keys.SYNC_HISTORY, JSON.stringify(historyList));
      notifySubscribers('syncHistory', historyList);
    }
    await this.addAuditLog('SYNC', `Imported K-SMART file: ${record.fileName}. Registered: ${record.importedCount}, Updated: ${record.updatedCount}, Errors: ${record.errorCount}`);
  },

  subscribeToSyncHistory(callback: (history: SyncHistoryRecord[]) => void): () => void {
    const activePId = getActivePanchayathId();
    if (isFirebaseEnabled && db) {
      return onSnapshot(collection(db, 'panchayaths', activePId, 'syncHistory'), (snapshot) => {
        const history: SyncHistoryRecord[] = [];
        snapshot.forEach(doc => history.push(doc.data() as SyncHistoryRecord));
        callback(history);
      });
    } else {
      initPanchayatLocalStorage(activePId);
      const keys = getKeys(activePId);
      const historyList = JSON.parse(localStorage.getItem(keys.SYNC_HISTORY) || '[]');
      callback(historyList);
      subscribers.syncHistory.add(callback);
      return () => subscribers.syncHistory.delete(callback);
    }
  },

  // --- WHATSAPP LOGS ---
  async addWhatsAppLog(log: Omit<WhatsAppLogRecord, 'id' | 'timestamp'>): Promise<void> {
    const activePId = getActivePanchayathId();
    const newLog: WhatsAppLogRecord = {
      ...log,
      id: 'WA-' + Date.now(),
      timestamp: new Date().toISOString()
    };
    if (isFirebaseEnabled && db) {
      await setDoc(doc(db, 'panchayaths', activePId, 'whatsappLogs', newLog.id), newLog);
    } else {
      initPanchayatLocalStorage(activePId);
      const keys = getKeys(activePId);
      const logsList: WhatsAppLogRecord[] = JSON.parse(localStorage.getItem(keys.WHATSAPP_LOGS) || '[]');
      logsList.unshift(newLog);
      localStorage.setItem(keys.WHATSAPP_LOGS, JSON.stringify(logsList));
      notifySubscribers('whatsappLogs', logsList);
    }
  },

  subscribeToWhatsAppLogs(callback: (logs: WhatsAppLogRecord[]) => void): () => void {
    const activePId = getActivePanchayathId();
    if (isFirebaseEnabled && db) {
      return onSnapshot(collection(db, 'panchayaths', activePId, 'whatsappLogs'), (snapshot) => {
        const logs: WhatsAppLogRecord[] = [];
        snapshot.forEach(doc => logs.push(doc.data() as WhatsAppLogRecord));
        callback(logs);
      });
    } else {
      initPanchayatLocalStorage(activePId);
      const keys = getKeys(activePId);
      const logsList = JSON.parse(localStorage.getItem(keys.WHATSAPP_LOGS) || '[]');
      callback(logsList);
      subscribers.whatsappLogs.add(callback);
      return () => subscribers.whatsappLogs.delete(callback);
    }
  },

  // --- WARD MEMBER REPORTS ---
  async addWardReport(reportData: Omit<WardReportRecord, 'id' | 'createdAt' | 'status'>): Promise<string> {
    const activePId = getActivePanchayathId();
    const id = 'WRD-REP-' + Date.now();
    const newReport: WardReportRecord = {
      ...reportData,
      id,
      status: 'pending_verification',
      createdAt: new Date().toISOString()
    };

    if (isFirebaseEnabled && db) {
      await setDoc(doc(db, 'panchayaths', activePId, 'wardReports', id), newReport);
    } else {
      initPanchayatLocalStorage(activePId);
      const keys = getKeys(activePId);
      const list: WardReportRecord[] = JSON.parse(localStorage.getItem(keys.WARD_REPORTS) || '[]');
      list.unshift(newReport);
      localStorage.setItem(keys.WARD_REPORTS, JSON.stringify(list));
      notifySubscribers('wardReports', list);
    }

    await this.addAuditLog('SUBMIT_WARD_REPORT', `Ward Member ${reportData.reporterName} reported business: ${reportData.businessName} in Ward ${reportData.wardNumber}.`);
    return id;
  },

  subscribeToWardReports(callback: (reports: WardReportRecord[]) => void): () => void {
    const activePId = getActivePanchayathId();
    if (isFirebaseEnabled && db) {
      return onSnapshot(collection(db, 'panchayaths', activePId, 'wardReports'), (snapshot) => {
        const list: WardReportRecord[] = [];
        snapshot.forEach(doc => list.push(doc.data() as WardReportRecord));
        callback(list);
      });
    } else {
      initPanchayatLocalStorage(activePId);
      const keys = getKeys(activePId);
      const list = JSON.parse(localStorage.getItem(keys.WARD_REPORTS) || '[]');
      callback(list);
      subscribers.wardReports.add(callback);
      return () => subscribers.wardReports.delete(callback);
    }
  },

  async verifyWardReport(reportId: string, status: WardReportStatus, remarks?: string, matchedBuildingId?: string): Promise<void> {
    const activePId = getActivePanchayathId();
    if (isFirebaseEnabled && db) {
      const ref = doc(db, 'panchayaths', activePId, 'wardReports', reportId);
      await updateDoc(ref, {
        status,
        verifiedAt: new Date().toISOString(),
        matchedBuildingId,
        remarks: remarks ? `${remarks}` : undefined
      });
    } else {
      initPanchayatLocalStorage(activePId);
      const keys = getKeys(activePId);
      const list: WardReportRecord[] = JSON.parse(localStorage.getItem(keys.WARD_REPORTS) || '[]');
      const updated = list.map(r => {
        if (r.id === reportId) {
          return {
            ...r,
            status,
            verifiedAt: new Date().toISOString(),
            matchedBuildingId: matchedBuildingId || r.matchedBuildingId,
            remarks: remarks ? `${r.remarks} | Verification note: ${remarks}` : r.remarks
          };
        }
        return r;
      });
      localStorage.setItem(keys.WARD_REPORTS, JSON.stringify(updated));
      notifySubscribers('wardReports', updated);
    }
    await this.addAuditLog('VERIFY_WARD_REPORT', `Secretary verified Ward Report ${reportId} with status: ${status}.`);
  },

  // --- K-SMART CSV/EXCEL IMPORT ENGINE ---
  async processKSmartImport(fileContent: string, fileName: string, operatorName: string): Promise<{
    totalRecords: number;
    importedCount: number;
    updatedCount: number;
    expiredCount: number;
    errorCount: number;
    duplicateCount: number;
    errors: string[];
  }> {
    const activePId = getActivePanchayathId();
    const lines = fileContent.split(/\r?\n/).filter(line => line.trim().length > 0);

    if (lines.length < 2) {
      throw new Error("Invalid file format. File must contain a header row and at least one data row.");
    }

    const header = lines[0].toLowerCase();
    const delimiter = header.includes(';') ? ';' : ',';

    let importedCount = 0;
    let updatedCount = 0;
    let expiredCount = 0;
    let errorCount = 0;
    let duplicateCount = 0;
    const errors: string[] = [];

    // Retrieve current database state
    initPanchayatLocalStorage(activePId);
    const keys = getKeys(activePId);
    const buildings: BuildingRecord[] = JSON.parse(localStorage.getItem(keys.BUILDINGS) || '[]');
    const licenses: LicenseRecord[] = JSON.parse(localStorage.getItem(keys.LICENSES) || '[]');
    const nowIso = new Date().toISOString().split('T')[0];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cols = line.split(delimiter).map(c => c.trim().replace(/^["']|["']$/g, ''));
      
      // Expected Columns:
      // 0: Building ID (e.g. BLDG-G110706-001)
      // 1: Business Name
      // 2: Proprietor / Owner Name
      // 3: Category
      // 4: Ward Number
      // 5: Latitude
      // 6: Longitude
      // 7: License ID (Optional)
      // 8: Expiry Date (YYYY-MM-DD)
      // 9: Fee Paid
      // 10: Status (licensed, unlicensed, pending, expired)
      
      const bId = cols[0] || `BLDG-IMPORT-${i}`;
      const businessName = cols[1] || 'Commercial Unit';
      const ownerName = cols[2] || 'Proprietor';
      const category = cols[3] || 'General Trade';
      const wardNumber = cols[4] || '1';
      const lat = parseFloat(cols[5]) || 11.575 + (i * 0.001);
      const lng = parseFloat(cols[6]) || 75.816 + (i * 0.001);
      const licId = cols[7] || '';
      const expiryDate = cols[8] || '2026-12-31';
      const feePaid = parseFloat(cols[9]) || 1500;
      const rawStatus = (cols[10] || 'licensed').toLowerCase();

      let status: BuildingRecord['status'] = 'licensed';
      if (rawStatus.includes('unlicensed') || rawStatus.includes('no')) {
        status = 'unlicensed';
      } else if (rawStatus.includes('pending')) {
        status = 'pending';
      } else if (rawStatus.includes('expired')) {
        status = 'unlicensed';
        expiredCount++;
      } else {
        // check expiry date vs today
        if (new Date(expiryDate) < new Date(nowIso)) {
          status = 'unlicensed';
          expiredCount++;
        } else {
          status = 'licensed';
        }
      }

      const riskScore = status === 'unlicensed' ? 'High' : (new Date(expiryDate) <= new Date(Date.now() + 7*86400000) ? 'Medium' : 'Low');

      const existingIndex = buildings.findIndex(b => b.id.toLowerCase() === bId.toLowerCase() || b.businessName.toLowerCase() === businessName.toLowerCase());

      const buildingObj: BuildingRecord = {
        id: bId,
        businessName,
        ownerName,
        category,
        wardNumber,
        coordinates: { lat, lng },
        status,
        licenseId: licId || undefined,
        riskScore,
        lastSyncDate: nowIso,
        kSmartRefId: `KSMART-${bId}`
      };

      if (existingIndex >= 0) {
        duplicateCount++;
        buildings[existingIndex] = { ...buildings[existingIndex], ...buildingObj };
        updatedCount++;
      } else {
        buildings.push(buildingObj);
        importedCount++;
      }

      if (licId) {
        const licExistIdx = licenses.findIndex(l => l.id.toLowerCase() === licId.toLowerCase());
        const licObj: LicenseRecord = {
          id: licId,
          buildingId: bId,
          licenseType: category,
          issueDate: '2025-04-01',
          expiryDate,
          status: new Date(expiryDate) < new Date(nowIso) ? 'expired' : 'active',
          feePaid,
          kSmartAppNo: `KSMART-APP-${i}`
        };
        if (licExistIdx >= 0) {
          licenses[licExistIdx] = licObj;
        } else {
          licenses.push(licObj);
        }
      }
    }

    // Save back to storage
    localStorage.setItem(keys.BUILDINGS, JSON.stringify(buildings));
    localStorage.setItem(keys.LICENSES, JSON.stringify(licenses));
    notifySubscribers('buildings', buildings);
    notifySubscribers('licenses', licenses);

    // Save Sync Log
    const syncRecord: Omit<SyncHistoryRecord, 'id' | 'timestamp'> = {
      operatorName,
      fileName,
      totalRecords: lines.length - 1,
      importedCount,
      updatedCount,
      expiredCount,
      errorCount,
      duplicateCount,
      errors
    };

    await this.addSyncHistory(syncRecord);

    return {
      totalRecords: lines.length - 1,
      importedCount,
      updatedCount,
      expiredCount,
      errorCount,
      duplicateCount,
      errors
    };
  }
};
