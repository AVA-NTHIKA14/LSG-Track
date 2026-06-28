import { db, isFirebaseEnabled } from './firebaseConfig';
import { 
  collection, doc, addDoc, updateDoc, deleteDoc, 
  onSnapshot, query, orderBy, setDoc, getDoc 
} from 'firebase/firestore';
import type { 
  BuildingRecord, WardRecord, LicenseRecord, SurveyRecord, 
  SystemNotification, AuditLogRecord, SystemSettings 
} from '../types';
import { 
  mockWards, mockBuildings, mockLicenses, mockSurveys, 
  mockNotifications, mockAuditLogs 
} from '../data/buildingsSeed';
import { authService } from './authService';

// Keys for LocalStorage
const KEYS = {
  WARDS: 'cp_wards',
  BUILDINGS: 'cp_buildings',
  LICENSES: 'cp_licenses',
  SURVEYS: 'cp_surveys',
  NOTIFICATIONS: 'cp_notifications',
  AUDIT_LOGS: 'cp_audit_logs',
  SETTINGS: 'cp_settings'
};

// Initialize localStorage if empty
const initLocalStorage = () => {
  if (!localStorage.getItem(KEYS.WARDS)) localStorage.setItem(KEYS.WARDS, JSON.stringify(mockWards));
  if (!localStorage.getItem(KEYS.BUILDINGS)) localStorage.setItem(KEYS.BUILDINGS, JSON.stringify(mockBuildings));
  if (!localStorage.getItem(KEYS.LICENSES)) localStorage.setItem(KEYS.LICENSES, JSON.stringify(mockLicenses));
  if (!localStorage.getItem(KEYS.SURVEYS)) localStorage.setItem(KEYS.SURVEYS, JSON.stringify(mockSurveys));
  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(mockNotifications));
  if (!localStorage.getItem(KEYS.AUDIT_LOGS)) localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(mockAuditLogs));
  if (!localStorage.getItem(KEYS.SETTINGS)) {
    const defaultSettings: SystemSettings = {
      highContrast: false,
      smsNotificationsEnabled: true,
      emailNotificationsEnabled: true
    };
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(defaultSettings));
  }
};

initLocalStorage();

// Simple pub-sub system for local simulation
type SubscriptionCallback = (data: any) => void;
const subscribers: { [key: string]: Set<SubscriptionCallback> } = {
  buildings: new Set(),
  wards: new Set(),
  licenses: new Set(),
  surveys: new Set(),
  notifications: new Set(),
  auditLogs: new Set(),
  settings: new Set()
};

const notifySubscribers = (key: keyof typeof subscribers, data: any) => {
  subscribers[key].forEach(cb => cb(data));
};

export const dbService = {
  // --- AUDIT LOGS ---
  async addAuditLog(action: string, description: string): Promise<void> {
    const currentUser = authService.getCurrentUser();
    const log: AuditLogRecord = {
      id: 'LOG-' + Date.now(),
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || 'anonymous',
      userName: currentUser?.name || 'Anonymous User',
      userRole: currentUser?.role || 'Read Only Viewer',
      action,
      description
    };

    if (isFirebaseEnabled && db) {
      await addDoc(collection(db, 'audit_logs'), log);
    } else {
      const logs = JSON.parse(localStorage.getItem(KEYS.AUDIT_LOGS) || '[]');
      logs.unshift(log);
      localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(logs));
      notifySubscribers('auditLogs', logs);
    }
  },

  subscribeToAuditLogs(callback: (logs: AuditLogRecord[]) => void): () => void {
    if (isFirebaseEnabled && db) {
      const q = query(collection(db, 'audit_logs'), orderBy('timestamp', 'desc'));
      return onSnapshot(q, (snapshot) => {
        const logs: AuditLogRecord[] = [];
        snapshot.forEach((doc) => logs.push(doc.data() as AuditLogRecord));
        callback(logs);
      });
    } else {
      const logs = JSON.parse(localStorage.getItem(KEYS.AUDIT_LOGS) || '[]');
      callback(logs);
      subscribers.auditLogs.add(callback);
      return () => subscribers.auditLogs.delete(callback);
    }
  },

  // --- WARDS ---
  subscribeToWards(callback: (wards: WardRecord[]) => void): () => void {
    if (isFirebaseEnabled && db) {
      return onSnapshot(collection(db, 'wards'), (snapshot) => {
        const wards: WardRecord[] = [];
        snapshot.forEach((doc) => wards.push(doc.data() as WardRecord));
        callback(wards);
      });
    } else {
      const wards = JSON.parse(localStorage.getItem(KEYS.WARDS) || '[]');
      callback(wards);
      subscribers.wards.add(callback);
      return () => subscribers.wards.delete(callback);
    }
  },

  async updateWardStats(wardNumber: string): Promise<void> {
    // Recalculate buildings compliance statistics for a ward
    if (isFirebaseEnabled && db) {
      // In real backend, trigger or cloud function.
      // For prototype, we do local sync or manual query.
    } else {
      const buildings: BuildingRecord[] = JSON.parse(localStorage.getItem(KEYS.BUILDINGS) || '[]');
      const wards: WardRecord[] = JSON.parse(localStorage.getItem(KEYS.WARDS) || '[]');
      
      const wardBuildings = buildings.filter(b => b.wardNumber === wardNumber);
      const licensed = wardBuildings.filter(b => b.status === 'licensed').length;
      const unlicensed = wardBuildings.filter(b => b.status === 'unlicensed').length;
      const pending = wardBuildings.filter(b => b.status === 'pending').length;
      
      const wardIndex = wards.findIndex(w => w.id === wardNumber);
      if (wardIndex > -1) {
        wards[wardIndex].totalBuildings = wardBuildings.length;
        wards[wardIndex].licensedBuildings = licensed;
        wards[wardIndex].unlicensedBuildings = unlicensed;
        wards[wardIndex].pendingBuildings = pending;
        wards[wardIndex].compliancePercentage = wardBuildings.length > 0 
          ? Math.round((licensed / (wardBuildings.length - wardBuildings.filter(b => b.status === 'govt').length)) * 100) || 0
          : 100;
        
        localStorage.setItem(KEYS.WARDS, JSON.stringify(wards));
        notifySubscribers('wards', wards);
      }
    }
  },

  // --- BUILDINGS ---
  subscribeToBuildings(callback: (buildings: BuildingRecord[]) => void): () => void {
    if (isFirebaseEnabled && db) {
      return onSnapshot(collection(db, 'buildings'), (snapshot) => {
        const buildings: BuildingRecord[] = [];
        snapshot.forEach((doc) => buildings.push(doc.data() as BuildingRecord));
        callback(buildings);
      });
    } else {
      const buildings = JSON.parse(localStorage.getItem(KEYS.BUILDINGS) || '[]');
      callback(buildings);
      subscribers.buildings.add(callback);
      return () => subscribers.buildings.delete(callback);
    }
  },

  async addBuilding(building: Omit<BuildingRecord, 'history'>): Promise<void> {
    const currentUser = authService.getCurrentUser();
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
      await setDoc(doc(db, 'buildings', building.id), newBuilding);
    } else {
      const buildings = JSON.parse(localStorage.getItem(KEYS.BUILDINGS) || '[]');
      buildings.push(newBuilding);
      localStorage.setItem(KEYS.BUILDINGS, JSON.stringify(buildings));
      notifySubscribers('buildings', buildings);
    }

    await this.updateWardStats(building.wardNumber);
    await this.addAuditLog('CREATE', `Registered commercial building ${building.businessName} (ID: ${building.id}) in Ward ${building.wardNumber}.`);
    
    // Add system notification
    await this.addNotification(
      'New Building Registered',
      `${building.businessName} has been registered in Ward ${building.wardNumber} and requires survey.`,
      'info'
    );
  },

  async updateBuilding(id: string, updates: Partial<BuildingRecord>): Promise<void> {
    if (isFirebaseEnabled && db) {
      const ref = doc(db, 'buildings', id);
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
      const buildings = JSON.parse(localStorage.getItem(KEYS.BUILDINGS) || '[]');
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
        localStorage.setItem(KEYS.BUILDINGS, JSON.stringify(buildings));
        notifySubscribers('buildings', buildings);
        await this.updateWardStats(buildings[index].wardNumber);
      }
    }
  },

  async updateBuildingStatus(id: string, status: BuildingRecord['status'], licenseId?: string, surveyNotes?: string): Promise<void> {
    if (isFirebaseEnabled && db) {
      const ref = doc(db, 'buildings', id);
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
      const buildings = JSON.parse(localStorage.getItem(KEYS.BUILDINGS) || '[]');
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
        localStorage.setItem(KEYS.BUILDINGS, JSON.stringify(buildings));
        notifySubscribers('buildings', buildings);
        await this.updateWardStats(buildings[index].wardNumber);
      }
    }
  },

  async deleteBuilding(id: string): Promise<void> {
    let bldgName = id;
    let wardNumber = '1';
    
    if (isFirebaseEnabled && db) {
      const ref = doc(db, 'buildings', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const b = snap.data() as BuildingRecord;
        bldgName = b.businessName;
        wardNumber = b.wardNumber;
      }
      await deleteDoc(ref);
    } else {
      const buildings = JSON.parse(localStorage.getItem(KEYS.BUILDINGS) || '[]');
      const bIndex = buildings.findIndex((b: BuildingRecord) => b.id === id);
      if (bIndex > -1) {
        bldgName = buildings[bIndex].businessName;
        wardNumber = buildings[bIndex].wardNumber;
        buildings.splice(bIndex, 1);
        localStorage.setItem(KEYS.BUILDINGS, JSON.stringify(buildings));
        notifySubscribers('buildings', buildings);
      }
    }

    await this.updateWardStats(wardNumber);
    await this.addAuditLog('DELETE', `Archived / Deleted building ${bldgName} (ID: ${id}) from Ward ${wardNumber}.`);
  },

  // --- LICENSES ---
  subscribeToLicenses(callback: (licenses: LicenseRecord[]) => void): () => void {
    if (isFirebaseEnabled && db) {
      return onSnapshot(collection(db, 'licenses'), (snapshot) => {
        const licenses: LicenseRecord[] = [];
        snapshot.forEach((doc) => licenses.push(doc.data() as LicenseRecord));
        callback(licenses);
      });
    } else {
      const licenses = JSON.parse(localStorage.getItem(KEYS.LICENSES) || '[]');
      callback(licenses);
      subscribers.licenses.add(callback);
      return () => subscribers.licenses.delete(callback);
    }
  },

  async generateLicense(buildingId: string, type: string, durationYears: number = 1): Promise<void> {
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
      await setDoc(doc(db, 'licenses', licId), newLicense);
    } else {
      const licenses = JSON.parse(localStorage.getItem(KEYS.LICENSES) || '[]');
      licenses.push(newLicense);
      localStorage.setItem(KEYS.LICENSES, JSON.stringify(licenses));
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

  async renewLicense(licenseId: string): Promise<void> {
    if (isFirebaseEnabled && db) {
      // Firebase update
      const ref = doc(db, 'licenses', licenseId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const lic = snap.data() as LicenseRecord;
        const currentExpiry = new Date(lic.expiryDate);
        const newExpiry = new Date(currentExpiry.setFullYear(currentExpiry.getFullYear() + 1)).toISOString().split('T')[0];
        await updateDoc(ref, { expiryDate: newExpiry, status: 'active' });
        await this.updateBuildingStatus(lic.buildingId, 'licensed', lic.id, 'License renewed for 1 fiscal year.');
      }
    } else {
      const licenses = JSON.parse(localStorage.getItem(KEYS.LICENSES) || '[]');
      const idx = licenses.findIndex((l: LicenseRecord) => l.id === licenseId);
      if (idx > -1) {
        const lic = licenses[idx];
        const currentExpiry = new Date(lic.expiryDate);
        const newExpiry = new Date(currentExpiry.setFullYear(currentExpiry.getFullYear() + 1)).toISOString().split('T')[0];
        licenses[idx].expiryDate = newExpiry;
        licenses[idx].status = 'active';
        localStorage.setItem(KEYS.LICENSES, JSON.stringify(licenses));
        notifySubscribers('licenses', licenses);
        await this.updateBuildingStatus(lic.buildingId, 'licensed', lic.id, 'License renewed for 1 fiscal year.');
      }
    }

    await this.addAuditLog('UPDATE', `Renewed License ID: ${licenseId} for an additional year.`);
  },

  // --- SURVEYS ---
  subscribeToSurveys(callback: (surveys: SurveyRecord[]) => void): () => void {
    if (isFirebaseEnabled && db) {
      return onSnapshot(collection(db, 'surveys'), (snapshot) => {
        const surveys: SurveyRecord[] = [];
        snapshot.forEach((doc) => surveys.push(doc.data() as SurveyRecord));
        callback(surveys);
      });
    } else {
      const surveys = JSON.parse(localStorage.getItem(KEYS.SURVEYS) || '[]');
      callback(surveys);
      subscribers.surveys.add(callback);
      return () => subscribers.surveys.delete(callback);
    }
  },

  async addSurvey(survey: Omit<SurveyRecord, 'id' | 'officerId' | 'officerName' | 'surveyDate'>): Promise<void> {
    const user = authService.getCurrentUser();
    const newSurvey: SurveyRecord = {
      ...survey,
      id: 'SRV-' + Date.now(),
      officerId: user?.id || 'usr-anonymous',
      officerName: user?.name || 'Anonymous Officer',
      surveyDate: new Date().toISOString().split('T')[0],
    };

    if (isFirebaseEnabled && db) {
      await setDoc(doc(db, 'surveys', newSurvey.id), newSurvey);
    } else {
      const surveys = JSON.parse(localStorage.getItem(KEYS.SURVEYS) || '[]');
      surveys.unshift(newSurvey);
      localStorage.setItem(KEYS.SURVEYS, JSON.stringify(surveys));
      notifySubscribers('surveys', surveys);
    }

    // Set building status to pending
    if (newSurvey.status === 'submitted') {
      await this.updateBuildingStatus(survey.buildingId, 'pending', undefined, 'Field survey submitted. Awaiting review.');
      await this.addNotification(
        'Survey Verification Required',
        `Field Survey for St. George Hardwares (ID: ${survey.buildingId}) has been submitted for Secretary verification.`,
        'info'
      );
      await this.addAuditLog('SURVEY_SUBMIT', `Submitted field survey details for Building ID: ${survey.buildingId}.`);
    } else {
      await this.addAuditLog('SURVEY_DRAFT', `Saved survey draft locally for Building ID: ${survey.buildingId}.`);
    }
  },

  async approveSurvey(surveyId: string): Promise<void> {
    let buildingId = '';
    
    if (isFirebaseEnabled && db) {
      const ref = doc(db, 'surveys', surveyId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const s = snap.data() as SurveyRecord;
        buildingId = s.buildingId;
        await updateDoc(ref, { status: 'approved' });
      }
    } else {
      const surveys = JSON.parse(localStorage.getItem(KEYS.SURVEYS) || '[]');
      const idx = surveys.findIndex((s: SurveyRecord) => s.id === surveyId);
      if (idx > -1) {
        surveys[idx].status = 'approved';
        buildingId = surveys[idx].buildingId;
        localStorage.setItem(KEYS.SURVEYS, JSON.stringify(surveys));
        notifySubscribers('surveys', surveys);
      }
    }

    // Approve the survey, then generate license
    if (buildingId) {
      await this.generateLicense(buildingId, 'D&O Trade License');
    }
  },

  async rejectSurvey(surveyId: string, rejectionRemarks: string): Promise<void> {
    let buildingId = '';
    
    if (isFirebaseEnabled && db) {
      const ref = doc(db, 'surveys', surveyId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const s = snap.data() as SurveyRecord;
        buildingId = s.buildingId;
        await updateDoc(ref, { status: 'rejected', remarks: `REJECTED: ${rejectionRemarks}` });
      }
    } else {
      const surveys = JSON.parse(localStorage.getItem(KEYS.SURVEYS) || '[]');
      const idx = surveys.findIndex((s: SurveyRecord) => s.id === surveyId);
      if (idx > -1) {
        surveys[idx].status = 'rejected';
        surveys[idx].remarks = `REJECTED: ${rejectionRemarks}. Original: ${surveys[idx].remarks}`;
        buildingId = surveys[idx].buildingId;
        localStorage.setItem(KEYS.SURVEYS, JSON.stringify(surveys));
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
    if (isFirebaseEnabled && db) {
      return onSnapshot(collection(db, 'notifications'), (snapshot) => {
        const notifications: SystemNotification[] = [];
        snapshot.forEach((doc) => notifications.push(doc.data() as SystemNotification));
        callback(notifications);
      });
    } else {
      const notifications = JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS) || '[]');
      callback(notifications);
      subscribers.notifications.add(callback);
      return () => subscribers.notifications.delete(callback);
    }
  },

  async addNotification(title: string, message: string, type: SystemNotification['type']): Promise<void> {
    const notif: SystemNotification = {
      id: 'NOT-' + Date.now(),
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };

    if (isFirebaseEnabled && db) {
      await addDoc(collection(db, 'notifications'), notif);
    } else {
      const notifications = JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS) || '[]');
      notifications.unshift(notif);
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications));
      notifySubscribers('notifications', notifications);
    }
  },

  async markNotificationAsRead(id: string): Promise<void> {
    if (isFirebaseEnabled && db) {
      // Firebase update
    } else {
      const notifications = JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS) || '[]');
      const index = notifications.findIndex((n: SystemNotification) => n.id === id);
      if (index > -1) {
        notifications[index].read = true;
        localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications));
        notifySubscribers('notifications', notifications);
      }
    }
  },

  // --- SETTINGS ---
  subscribeToSettings(callback: (settings: SystemSettings) => void): () => void {
    if (isFirebaseEnabled && db) {
      const ref = doc(db, 'settings', 'config');
      return onSnapshot(ref, (doc) => {
        if (doc.exists()) {
          callback(doc.data() as SystemSettings);
        }
      });
    } else {
      const settings = JSON.parse(localStorage.getItem(KEYS.SETTINGS) || '{}');
      callback(settings);
      subscribers.settings.add(callback);
      return () => subscribers.settings.delete(callback);
    }
  },

  async updateSettings(settings: Partial<SystemSettings>): Promise<void> {
    if (isFirebaseEnabled && db) {
      const ref = doc(db, 'settings', 'config');
      await updateDoc(ref, settings);
    } else {
      const current = JSON.parse(localStorage.getItem(KEYS.SETTINGS) || '{}');
      const updated = { ...current, ...settings };
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
      notifySubscribers('settings', updated);
    }
  }
};
