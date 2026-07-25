import { db, isFirebaseEnabled } from './firebaseConfig';
import { 
  collection, doc, addDoc, updateDoc, deleteDoc, 
  onSnapshot, query, orderBy, setDoc, getDoc 
} from 'firebase/firestore';
import * as XLSX from 'xlsx';
import type { 
  BuildingRecord, WardRecord, LicenseRecord, SurveyRecord, 
  SystemNotification, AuditLogRecord, SystemSettings, Panchayath, SyncHistoryRecord, WhatsAppLogRecord,
  WardReportRecord, WardReportStatus, StaffProfile 
} from '../types';
import { authService } from './authService';

// Resolve current tenant context dynamically
export const getActivePanchayathId = (): string => {
  const currentUser = authService.getCurrentUser();
  const saved = localStorage.getItem('cp_active_panchayat_code');
  if (saved) return saved;
  if (currentUser?.panchayatCode) return currentUser.panchayatCode;
  return 'G110706';
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
  WARD_REPORTS: `cp_${panchayathId}_ward_reports`,
  STAFF: `cp_${panchayathId}_staff`
});

// Initialize localStorage partitions if empty
const initPanchayatLocalStorage = (panchayathId: string) => {
  const keys = getKeys(panchayathId);
  const isChakkittapara = panchayathId === '204902';
  const isPanangad = panchayathId === 'G110706';

  const savedWards = localStorage.getItem(keys.WARDS);
  const needsWardReset = isChakkittapara && savedWards && JSON.parse(savedWards).length !== 13;
  const needsPanangadWardReset = isPanangad && savedWards && JSON.parse(savedWards).length !== 20;



  if (!savedWards || savedWards === '[]' || needsWardReset || needsPanangadWardReset) {
    const defaultWards: WardRecord[] = isChakkittapara ? [
      { id: "1", name: "Ward 1 - Pannikkottur", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 0.0, assignedOfficer: "Anjali Devi" },
      { id: "2", name: "Ward 2 - Chembanoda", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 0.0, assignedOfficer: "Binu Kumar" },
      { id: "3", name: "Ward 3 - Kurathippara", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 0.0, assignedOfficer: "Sajith V" },
      { id: "4", name: "Ward 4 - Poozhithode", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 0.0, assignedOfficer: "Unassigned" },
      { id: "5", name: "Ward 5 - Ilamkad-Chenkottakkolli", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 0.0, assignedOfficer: "Unassigned" },
      { id: "7", name: "Ward 7 - Muthukad", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 0.0, assignedOfficer: "Unassigned" },
      { id: "8", name: "Ward 8 - Plantation", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 0.0, assignedOfficer: "Unassigned" },
      { id: "9", name: "Ward 9 - Narinada", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 0.0, assignedOfficer: "Unassigned" },
      { id: "10", name: "Ward 10 - Annakuttanchal", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 0.0, assignedOfficer: "Unassigned" },
      { id: "11", name: "Ward 11 - Peruvannamuzhi", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 0.0, assignedOfficer: "Unassigned" },
      { id: "12", name: "Ward 12 - Chakkittapara", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 0.0, assignedOfficer: "Unassigned" },
      { id: "13", name: "Ward 13 - Kulathuvayal", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 0.0, assignedOfficer: "Unassigned" },
      { id: "16", name: "Ward 16 - Thazhathuvayal", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 0.0, assignedOfficer: "Unassigned" }
    ] : isPanangad ? [
      { id: "1", name: "Ward 1 - Kannadipoil", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 0.0, assignedOfficer: "Anjali Devi" },
      { id: "2", name: "Ward 2 - Kurumpoli", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 0.0, assignedOfficer: "Unassigned" },
      { id: "3", name: "Ward 3 - Vayalada", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 0.0, assignedOfficer: "Unassigned" },
      { id: "4", name: "Ward 4 - Thalayad", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 0.0, assignedOfficer: "Binu Kumar" },
      { id: "5", name: "Ward 5 - Padikkal Vayal", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 0.0, assignedOfficer: "Unassigned" },
      { id: "6", name: "Ward 6 - Mankayam", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 0.0, assignedOfficer: "Unassigned" },
      { id: "7", name: "Ward 7 - Ezhukandi", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 0.0, assignedOfficer: "Unassigned" },
      { id: "8", name: "Ward 8 - Palamthala", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 0.0, assignedOfficer: "Unassigned" },
      { id: "9", name: "Ward 9 - Poovambai", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 0.0, assignedOfficer: "Unassigned" },
      { id: "10", name: "Ward 10 - Rarothmukku", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 0.0, assignedOfficer: "Unassigned" },
      { id: "11", name: "Ward 11 - Chithiramangalam", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 0.0, assignedOfficer: "Unassigned" },
      { id: "12", name: "Ward 12 - Vattoli", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 0.0, assignedOfficer: "Sajith V" },
      { id: "13", name: "Ward 13 - Arappeedika", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 0.0, assignedOfficer: "Unassigned" },
      { id: "14", name: "Ward 14 - Mundakkara", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 0.0, assignedOfficer: "Unassigned" },
      { id: "15", name: "Ward 15 - Thiruvancheripoil", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 0.0, assignedOfficer: "Unassigned" },
      { id: "16", name: "Ward 16 - Karayathodi", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 0.0, assignedOfficer: "Unassigned" },
      { id: "17", name: "Ward 17 - Kattamvalli", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 0.0, assignedOfficer: "Unassigned" },
      { id: "18", name: "Ward 18 - Nirmallur", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 0.0, assignedOfficer: "Unassigned" },
      { id: "19", name: "Ward 19 - Panangad North", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 0.0, assignedOfficer: "Anjali Devi" },
      { id: "20", name: "Ward 20 - Kattode", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 0.0, assignedOfficer: "Unassigned" }
    ] : [];
    localStorage.setItem(keys.WARDS, JSON.stringify(defaultWards));
  }

  if (!localStorage.getItem(keys.BUILDINGS)) localStorage.setItem(keys.BUILDINGS, JSON.stringify([]));
  if (!localStorage.getItem(keys.LICENSES)) localStorage.setItem(keys.LICENSES, JSON.stringify([]));

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
      const snap = await getDoc(doc(db, 'config', 'panchayaths'));
      return snap.exists() ? (snap.data().list || []) : [];
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
          const chakkittaparaRecord: Panchayath = {
            id: '204902',
            name: 'Chakkittapara Grama Panchayat',
            district: 'Kozhikode',
            taluk: 'Quilandy',
            boundaryGeoJSON: JSON.stringify({
              type: "FeatureCollection",
              name: "chakkittapara_wards",
              crs: {
                type: "name",
                properties: {
                  name: "urn:ogc:def:crs:OGC:1.3:CRS84"
                }
              },
              features: [
                {
                  type: "Feature",
                  properties: { ward_number: "1", ward_name: "Pannikkottur" },
                  geometry: {
                    type: "Polygon",
                    coordinates: [[[75.7900, 11.5650], [75.7915, 11.5682], [75.7942, 11.5705], [75.7968, 11.5724], [75.7995, 11.5718], [75.8020, 11.5700], [75.8012, 11.5668], [75.8005, 11.5632], [75.7985, 11.5615], [75.7952, 11.5602], [75.7925, 11.5620], [75.7900, 11.5650]]]
                  }
                },
                {
                  type: "Feature",
                  properties: { ward_number: "2", ward_name: "Chembanoda" },
                  geometry: {
                    type: "Polygon",
                    coordinates: [[[75.8050, 11.5750], [75.8042, 11.5775], [75.8050, 11.5800], [75.8078, 11.5828], [75.8112, 11.5845], [75.8150, 11.5850], [75.8142, 11.5815], [75.8130, 11.5788], [75.8120, 11.5750], [75.8082, 11.5745], [75.8050, 11.5750]]]
                  }
                },
                {
                  type: "Feature",
                  properties: { ward_number: "3", ward_name: "Kurathippara" },
                  geometry: {
                    type: "Polygon",
                    coordinates: [[[75.8150, 11.5850], [75.8132, 11.5895], [75.8100, 11.5950], [75.8135, 11.5968], [75.8172, 11.5975], [75.8200, 11.5980], [75.8228, 11.5948], [75.8250, 11.5880], [75.8212, 11.5872], [75.8185, 11.5860], [75.8150, 11.5850]]]
                  }
                },
                {
                  type: "Feature",
                  properties: { ward_number: "4", ward_name: "Poozhithode" },
                  geometry: {
                    type: "Polygon",
                    coordinates: [[[75.8250, 11.5880], [75.8228, 11.5948], [75.8200, 11.5980], [75.8258, 11.6025], [75.8312, 11.6072], [75.8350, 11.6100], [75.8425, 11.6082], [75.8500, 11.6050], [75.8488, 11.5988], [75.8450, 11.5900], [75.8385, 11.5892], [75.8315, 11.5885], [75.8250, 11.5880]]]
                  }
                },
                {
                  type: "Feature",
                  properties: { ward_number: "5", ward_name: "Ilamkad-Chenkottakkolli" },
                  geometry: {
                    type: "Polygon",
                    coordinates: [[[75.8200, 11.5780], [75.8225, 11.5828], [75.8250, 11.5880], [75.8315, 11.5885], [75.8385, 11.5892], [75.8450, 11.5900], [75.8432, 11.5835], [75.8400, 11.5750], [75.8322, 11.5762], [75.8265, 11.5770], [75.8200, 11.5780]]]
                  }
                },
                {
                  type: "Feature",
                  properties: { ward_number: "7", ward_name: "Muthukad" },
                  geometry: {
                    type: "Polygon",
                    coordinates: [[[75.8200, 11.5650], [75.8192, 11.5695], [75.8200, 11.5780], [75.8265, 11.5770], [75.8322, 11.5762], [75.8400, 11.5750], [75.8388, 11.5682], [75.8350, 11.5600], [75.8285, 11.5622], [75.8242, 11.5638], [75.8200, 11.5650]]]
                  }
                },
                {
                  type: "Feature",
                  properties: { ward_number: "8", ward_name: "Plantation" },
                  geometry: {
                    type: "Polygon",
                    coordinates: [[[75.8120, 11.5580], [75.8118, 11.5642], [75.8120, 11.5700], [75.8162, 11.5678], [75.8200, 11.5650], [75.8242, 11.5638], [75.8285, 11.5622], [75.8220, 11.5500], [75.8182, 11.5532], [75.8152, 11.5558], [75.8120, 11.5580]]]
                  }
                },
                {
                  type: "Feature",
                  properties: { ward_number: "9", ward_name: "Narinada" },
                  geometry: {
                    type: "Polygon",
                    coordinates: [[[75.8100, 11.5450], [75.8158, 11.5482], [75.8220, 11.5500], [75.8212, 11.5435], [75.8200, 11.5380], [75.8158, 11.5388], [75.8100, 11.5400], [75.8088, 11.5422], [75.8100, 11.5450]]]
                  }
                },
                {
                  type: "Feature",
                  properties: { ward_number: "10", ward_name: "Annakuttanchal" },
                  geometry: {
                    type: "Polygon",
                    coordinates: [[[75.7950, 11.5520], [75.8002, 11.5542], [75.8062, 11.5562], [75.8120, 11.5580], [75.8152, 11.5558], [75.8182, 11.5532], [75.8220, 11.5500], [75.8158, 11.5482], [75.8100, 11.5450], [75.8062, 11.5452], [75.7950, 11.5460], [75.7950, 11.5520]]]
                  }
                },
                {
                  type: "Feature",
                  properties: { ward_number: "11", ward_name: "Peruvannamuzhi" },
                  geometry: {
                    type: "Polygon",
                    coordinates: [[[75.7980, 11.5580], [75.8028, 11.5582], [75.8078, 11.5581], [75.8120, 11.5580], [75.8118, 11.5642], [75.8120, 11.5700], [75.7920, 11.5700], [75.8020, 11.5700], [75.7995, 11.5718], [75.7968, 11.5724], [75.7972, 11.5658], [75.7980, 11.5580]]]
                  }
                },
                {
                  type: "Feature",
                  properties: { ward_number: "12", ward_name: "Chakkittapara" },
                  geometry: {
                    type: "Polygon",
                    coordinates: [[[75.8020, 11.5700], [75.8072, 11.5700], [75.8120, 11.5700], [75.8120, 11.5750], [75.8130, 11.5788], [75.8142, 11.5815], [75.8150, 11.5850], [75.8082, 11.5788], [75.8050, 11.5780], [75.8020, 11.5700]]]
                  }
                },
                {
                  type: "Feature",
                  properties: { ward_number: "13", ward_name: "Kulathuvayal" },
                  geometry: {
                    type: "Polygon",
                    coordinates: [[[75.7920, 11.5350], [75.7982, 11.5375], [75.8042, 11.5392], [75.8100, 11.5400], [75.8075, 11.5320], [75.8050, 11.5250], [75.7985, 11.5262], [75.7900, 11.5280], [75.7920, 11.5350]]]
                  }
                },
                {
                  type: "Feature",
                  properties: { ward_number: "16", ward_name: "Thazhathuvayal" },
                  geometry: {
                    type: "Polygon",
                    coordinates: [[[75.7968, 11.5724], [75.7995, 11.5718], [75.8020, 11.5700], [75.8050, 11.5780], [75.8082, 11.5788], [75.8150, 11.5850], [75.8112, 11.5845], [75.8078, 11.5828], [75.8050, 11.5800], [75.8042, 11.5775], [75.8050, 11.5750], [75.8012, 11.5742], [75.7968, 11.5724]]]
                  }
                }
              ]
            }),
            status: 'active'
          };

          if (chakkittaparaIdx > -1) {
            list[chakkittaparaIdx] = chakkittaparaRecord;
          } else {
            list.push(chakkittaparaRecord);
          }
          localStorage.setItem(GLOBAL_PANCHARATH_KEY, JSON.stringify(list));
        }

        const panangadIdx = list.findIndex(p => p.id === 'G110706');
        if (panangadIdx === -1 || !list[panangadIdx].boundaryGeoJSON) {
          try {
            const res = await fetch('/data/panangad_wards.geojson');
            const data = await res.json();
            const panangadRecord: Panchayath = {
              id: 'G110706',
              name: 'Panangad Grama Panchayat',
              district: 'Kozhikode',
              taluk: 'Balussery',
              boundaryGeoJSON: JSON.stringify(data),
              status: 'active'
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
      return onSnapshot(
        doc(db, 'config', 'panchayaths'), 
        (snapshot) => {
          callback(snapshot.exists() ? (snapshot.data()?.list || []) : []);
        },
        async (_err) => {
          const list = await this.getPanchayaths();
          callback(list);
        }
      );
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
      try {
        await addDoc(collection(db, 'panchayaths', activePId, 'auditLogs'), log);
        return;
      } catch (err) {
        // Fallback to local storage if Firestore rules block unauthenticated write
      }
    }

    initPanchayatLocalStorage(activePId);
    const keys = getKeys(activePId);
    const logs = JSON.parse(localStorage.getItem(keys.AUDIT_LOGS) || '[]');
    logs.unshift(log);
    localStorage.setItem(keys.AUDIT_LOGS, JSON.stringify(logs));
    notifySubscribers('auditLogs', logs);
  },

  subscribeToAuditLogs(callback: (logs: AuditLogRecord[]) => void): () => void {
    const activePId = getActivePanchayathId();
    if (isFirebaseEnabled && db) {
      const q = query(collection(db, 'panchayaths', activePId, 'auditLogs'), orderBy('timestamp', 'desc'));
      const unsub = onSnapshot(q, 
        (snapshot) => {
          const logs: AuditLogRecord[] = [];
          snapshot.forEach((doc) => logs.push(doc.data() as AuditLogRecord));
          callback(logs);
        },
        (_err) => {
          // On permission error, fallback to LocalStorage
          initPanchayatLocalStorage(activePId);
          const keys = getKeys(activePId);
          const logs = JSON.parse(localStorage.getItem(keys.AUDIT_LOGS) || '[]');
          callback(logs);
          subscribers.auditLogs.add(callback);
        }
      );
      return unsub;
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
      return onSnapshot(
        collection(db, 'panchayaths', activePId, 'wards'), 
        (snapshot) => {
          const wards: WardRecord[] = [];
          snapshot.forEach((doc) => wards.push(doc.data() as WardRecord));
          callback(wards);
        },
        (_err) => {
          initPanchayatLocalStorage(activePId);
          const keys = getKeys(activePId);
          const wards = JSON.parse(localStorage.getItem(keys.WARDS) || '[]');
          callback(wards);
          subscribers.wards.add(callback);
        }
      );
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
          : 0;
        
        localStorage.setItem(keys.WARDS, JSON.stringify(wards));
        notifySubscribers('wards', wards);
      }
    }
  },

  // --- BUILDINGS ---
  subscribeToBuildings(callback: (buildings: BuildingRecord[]) => void): () => void {
    const activePId = getActivePanchayathId();
    if (isFirebaseEnabled && db) {
      return onSnapshot(
        collection(db, 'panchayaths', activePId, 'establishments'), 
        (snapshot) => {
          const buildings: BuildingRecord[] = [];
          snapshot.forEach((doc) => buildings.push(doc.data() as BuildingRecord));
          callback(buildings);
        },
        (_err) => {
          initPanchayatLocalStorage(activePId);
          const keys = getKeys(activePId);
          const buildings = JSON.parse(localStorage.getItem(keys.BUILDINGS) || '[]');
          callback(buildings);
          subscribers.buildings.add(callback);
        }
      );
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
  async processKSmartImport(fileContent: string | ArrayBuffer, fileName: string, operatorName: string): Promise<{
    totalRecords: number;
    importedCount: number;
    updatedCount: number;
    expiredCount: number;
    errorCount: number;
    duplicateCount: number;
    errors: string[];
  }> {
    const activePId = getActivePanchayathId();

    let matrixRows: any[][] = [];

    try {
      let workbook: XLSX.WorkBook;
      if (typeof fileContent === 'string' && !fileContent.startsWith('PK')) {
        workbook = XLSX.read(fileContent, { type: 'string' });
      } else {
        workbook = XLSX.read(fileContent, { type: 'array' });
      }
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      matrixRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
    } catch (e) {
      if (typeof fileContent === 'string') {
        const lines = fileContent.split(/\r?\n/).filter(l => l.trim().length > 0);
        const delim = lines[0]?.includes(';') ? ';' : ',';
        matrixRows = lines.map(line => line.split(delim).map(c => c.trim().replace(/^["']|["']$/g, '')));
      }
    }

    matrixRows = matrixRows.filter(row => Array.isArray(row) && row.some(cell => cell !== null && cell !== undefined && String(cell).trim() !== ''));

    if (matrixRows.length < 2) {
      throw new Error("Invalid file format. File must contain a header row and at least one data row.");
    }

    const headerRow = matrixRows[0].map(c => String(c || '').toLowerCase().trim());

    let colBId = headerRow.findIndex(h => h.includes('building') || h.includes('bldg') || h === 'id');
    let colBiz = headerRow.findIndex(h => h.includes('business') || h.includes('establishment') || h.includes('name') || h.includes('trade'));
    let colOwner = headerRow.findIndex(h => h.includes('owner') || h.includes('proprietor') || h.includes('applicant'));
    let colCat = headerRow.findIndex(h => h.includes('category') || h.includes('type'));
    let colWard = headerRow.findIndex(h => h.includes('ward'));
    let colLat = headerRow.findIndex(h => h.includes('lat'));
    let colLng = headerRow.findIndex(h => h.includes('lng') || h.includes('long'));
    let colLic = headerRow.findIndex(h => h.includes('license') || h.includes('lic') || h.includes('permit'));
    let colExp = headerRow.findIndex(h => h.includes('expiry') || h.includes('expire') || h.includes('date'));
    let colFee = headerRow.findIndex(h => h.includes('fee') || h.includes('paid') || h.includes('amount'));
    let colStat = headerRow.findIndex(h => h.includes('status'));

    if (colBId === -1) colBId = 0;
    if (colBiz === -1) colBiz = 1;
    if (colOwner === -1) colOwner = 2;
    if (colCat === -1) colCat = 3;
    if (colWard === -1) colWard = 4;
    if (colLat === -1) colLat = 5;
    if (colLng === -1) colLng = 6;
    if (colLic === -1) colLic = 7;
    if (colExp === -1) colExp = 8;
    if (colFee === -1) colFee = 9;
    if (colStat === -1) colStat = 10;

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

    const dataRows = matrixRows.slice(1);
    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      if (!row || row.length === 0) continue;

      const rawBId = String(row[colBId] || '').trim();
      const bId = rawBId ? (rawBId.startsWith('BLDG-') ? rawBId : `BLDG-${rawBId}`) : `BLDG-IMPORT-${i + 1}`;
      const businessName = String(row[colBiz] || '').trim() || `Commercial Unit #${i + 1}`;
      const ownerName = String(row[colOwner] || '').trim() || 'Proprietor';
      const category = String(row[colCat] || '').trim() || 'General Trade';
      const rawWard = String(row[colWard] || '').trim();
      const wardNumber = rawWard.replace(/[^0-9]/g, '') || '12';
      
      const parsedLat = parseFloat(String(row[colLat]));
      const parsedLng = parseFloat(String(row[colLng]));
      const lat = !isNaN(parsedLat) && parsedLat > 0 ? parsedLat : (11.4420 + (i * 0.0012));
      const lng = !isNaN(parsedLng) && parsedLng > 0 ? parsedLng : (75.8320 + (i * 0.0012));

      const licId = String(row[colLic] || '').trim();
      const rawExp = String(row[colExp] || '').trim();
      const expiryDate = rawExp || '2026-12-31';
      const feePaid = parseFloat(String(row[colFee])) || 1500;
      const rawStatus = String(row[colStat] || 'licensed').toLowerCase();

      let status: BuildingRecord['status'] = 'licensed';
      if (rawStatus.includes('unlicensed') || rawStatus.includes('no')) {
        status = 'unlicensed';
      } else if (rawStatus.includes('pending')) {
        status = 'pending';
      } else if (rawStatus.includes('expired')) {
        status = 'unlicensed';
        expiredCount++;
      } else {
        if (new Date(expiryDate) < new Date(nowIso)) {
          status = 'unlicensed';
          expiredCount++;
        } else {
          status = 'licensed';
        }
      }

      const riskScore = status === 'unlicensed' ? 'High' : (new Date(expiryDate) <= new Date(Date.now() + 7 * 86400000) ? 'Medium' : 'Low');

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

      if (licId || status === 'licensed') {
        const effectiveLicId = licId || `LIC-${bId}`;
        const licExistIdx = licenses.findIndex(l => l.id.toLowerCase() === effectiveLicId.toLowerCase());
        const licObj: LicenseRecord = {
          id: effectiveLicId,
          buildingId: bId,
          licenseType: category,
          issueDate: '2025-04-01',
          expiryDate,
          status: new Date(expiryDate) < new Date(nowIso) ? 'expired' : 'active',
          feePaid,
          kSmartAppNo: `KSMART-APP-${i + 1}`
        };
        if (licExistIdx >= 0) {
          licenses[licExistIdx] = licObj;
        } else {
          licenses.push(licObj);
        }
      }
    }

    // Recalculate ward statistics for all wards
    const wards: WardRecord[] = JSON.parse(localStorage.getItem(keys.WARDS) || '[]');
    if (wards.length > 0) {
      wards.forEach(w => {
        const wardBuildings = buildings.filter(b => b.wardNumber === w.id);
        const licensed = wardBuildings.filter(b => b.status === 'licensed').length;
        const unlicensed = wardBuildings.filter(b => b.status === 'unlicensed').length;
        const pending = wardBuildings.filter(b => b.status === 'pending').length;
        const govtOrNgo = wardBuildings.filter(b => b.status === 'govt' || b.status === 'ngo').length;
        
        w.totalBuildings = wardBuildings.length;
        w.licensedBuildings = licensed;
        w.unlicensedBuildings = unlicensed;
        w.pendingBuildings = pending;
        
        const compDenom = wardBuildings.length - govtOrNgo;
        w.compliancePercentage = compDenom > 0 ? Math.round((licensed / compDenom) * 100) : 0;
      });
      localStorage.setItem(keys.WARDS, JSON.stringify(wards));
    }

    // Save back to storage
    localStorage.setItem(keys.BUILDINGS, JSON.stringify(buildings));
    localStorage.setItem(keys.LICENSES, JSON.stringify(licenses));
    notifySubscribers('buildings', buildings);
    notifySubscribers('licenses', licenses);
    if (wards.length > 0) notifySubscribers('wards', wards);

    // Save Sync Log
    const syncRecord: Omit<SyncHistoryRecord, 'id' | 'timestamp'> = {
      operatorName,
      fileName,
      totalRecords: dataRows.length,
      importedCount,
      updatedCount,
      expiredCount,
      errorCount,
      duplicateCount,
      errors
    };

    await this.addSyncHistory(syncRecord);

    return {
      totalRecords: dataRows.length,
      importedCount,
      updatedCount,
      expiredCount,
      errorCount,
      duplicateCount,
      errors
    };
  },

  // --- LOCAL STAFF PROFILES MANAGEMENT ---
  getStaffProfiles(panchayatCode?: string): StaffProfile[] {
    const activePId = panchayatCode || getActivePanchayathId();
    initPanchayatLocalStorage(activePId);
    const keys = getKeys(activePId);
    return JSON.parse(localStorage.getItem(keys.STAFF) || '[]');
  },

  async addStaffProfile(staff: Omit<StaffProfile, 'id' | 'createdAt'>, panchayatCode?: string): Promise<StaffProfile> {
    const activePId = panchayatCode || getActivePanchayathId();
    initPanchayatLocalStorage(activePId);
    const keys = getKeys(activePId);
    const staffList: StaffProfile[] = JSON.parse(localStorage.getItem(keys.STAFF) || '[]');

    const newStaff: StaffProfile = {
      ...staff,
      id: 'STF-' + Date.now(),
      createdAt: new Date().toISOString()
    };

    staffList.unshift(newStaff);
    localStorage.setItem(keys.STAFF, JSON.stringify(staffList));
    await this.addAuditLog('ADD_STAFF', `Added local staff profile: ${newStaff.name} (${newStaff.role}) for Ward ${newStaff.wardNumber || 'All'}.`);
    return newStaff;
  },

  async deleteStaffProfile(staffId: string, panchayatCode?: string): Promise<void> {
    const activePId = panchayatCode || getActivePanchayathId();
    initPanchayatLocalStorage(activePId);
    const keys = getKeys(activePId);
    let staffList: StaffProfile[] = JSON.parse(localStorage.getItem(keys.STAFF) || '[]');
    const target = staffList.find(s => s.id === staffId);
    staffList = staffList.filter(s => s.id !== staffId);
    localStorage.setItem(keys.STAFF, JSON.stringify(staffList));
    if (target) {
      await this.addAuditLog('REMOVE_STAFF', `Removed local staff profile: ${target.name} (${target.role}).`);
    }
  },

  verifyStaffPin(staffId: string, pin: string, panchayatCode?: string): boolean {
    const activePId = panchayatCode || getActivePanchayathId();
    const staffList = this.getStaffProfiles(activePId);
    const target = staffList.find(s => s.id === staffId);
    if (!target) return false;
    if (!target.pin) return true;
    return target.pin === pin.trim();
  },

  // --- FULL PANCHAYATH JSON BACKUP & RESTORE ---
  exportPanchayatJSON(panchayatCode?: string): string {
    const activePId = panchayatCode || getActivePanchayathId();
    initPanchayatLocalStorage(activePId);
    const keys = getKeys(activePId);

    const backupData = {
      app: 'LSG-Track',
      version: '2.0-local-first',
      panchayatCode: activePId,
      exportedAt: new Date().toISOString(),
      data: {
        wards: JSON.parse(localStorage.getItem(keys.WARDS) || '[]'),
        buildings: JSON.parse(localStorage.getItem(keys.BUILDINGS) || '[]'),
        licenses: JSON.parse(localStorage.getItem(keys.LICENSES) || '[]'),
        surveys: JSON.parse(localStorage.getItem(keys.SURVEYS) || '[]'),
        notifications: JSON.parse(localStorage.getItem(keys.NOTIFICATIONS) || '[]'),
        auditLogs: JSON.parse(localStorage.getItem(keys.AUDIT_LOGS) || '[]'),
        settings: JSON.parse(localStorage.getItem(keys.SETTINGS) || '{}'),
        syncHistory: JSON.parse(localStorage.getItem(keys.SYNC_HISTORY) || '[]'),
        whatsappLogs: JSON.parse(localStorage.getItem(keys.WHATSAPP_LOGS) || '[]'),
        wardReports: JSON.parse(localStorage.getItem(keys.WARD_REPORTS) || '[]'),
        staff: JSON.parse(localStorage.getItem(keys.STAFF) || '[]')
      }
    };

    return JSON.stringify(backupData, null, 2);
  },

  async importPanchayatJSON(jsonString: string): Promise<{ success: boolean; panchayatCode: string; recordCounts: Record<string, number> }> {
    try {
      const parsed = JSON.parse(jsonString);
      const pCode = parsed.panchayatCode || getActivePanchayathId();
      const keys = getKeys(pCode);

      if (!parsed.data) {
        throw new Error('Invalid backup file. Missing "data" section.');
      }

      const d = parsed.data;
      if (d.wards) localStorage.setItem(keys.WARDS, JSON.stringify(d.wards));
      if (d.buildings) localStorage.setItem(keys.BUILDINGS, JSON.stringify(d.buildings));
      if (d.licenses) localStorage.setItem(keys.LICENSES, JSON.stringify(d.licenses));
      if (d.surveys) localStorage.setItem(keys.SURVEYS, JSON.stringify(d.surveys));
      if (d.notifications) localStorage.setItem(keys.NOTIFICATIONS, JSON.stringify(d.notifications));
      if (d.auditLogs) localStorage.setItem(keys.AUDIT_LOGS, JSON.stringify(d.auditLogs));
      if (d.settings) localStorage.setItem(keys.SETTINGS, JSON.stringify(d.settings));
      if (d.syncHistory) localStorage.setItem(keys.SYNC_HISTORY, JSON.stringify(d.syncHistory));
      if (d.whatsappLogs) localStorage.setItem(keys.WHATSAPP_LOGS, JSON.stringify(d.whatsappLogs));
      if (d.wardReports) localStorage.setItem(keys.WARD_REPORTS, JSON.stringify(d.wardReports));
      if (d.staff) localStorage.setItem(keys.STAFF, JSON.stringify(d.staff));

      notifySubscribers('buildings', d.buildings || []);
      notifySubscribers('licenses', d.licenses || []);
      notifySubscribers('wards', d.wards || []);

      await this.addAuditLog('RESTORE_BACKUP', `Restored full JSON backup for Panchayat: ${pCode}.`);

      return {
        success: true,
        panchayatCode: pCode,
        recordCounts: {
          buildings: d.buildings?.length || 0,
          licenses: d.licenses?.length || 0,
          surveys: d.surveys?.length || 0,
          wardReports: d.wardReports?.length || 0,
          staff: d.staff?.length || 0
        }
      };
    } catch (err: any) {
      throw new Error(err?.message || 'Failed to parse JSON backup file.');
    }
  },

  // --- LIGHTWEIGHT FIELD SURVEY HAND-OFF EXPORT/IMPORT ---
  exportWardSurveysJSON(wardNumber?: string): string {
    const activePId = getActivePanchayathId();
    const keys = getKeys(activePId);
    const surveys: SurveyRecord[] = JSON.parse(localStorage.getItem(keys.SURVEYS) || '[]');
    const wardReports: WardReportRecord[] = JSON.parse(localStorage.getItem(keys.WARD_REPORTS) || '[]');

    const filteredSurveys = wardNumber ? surveys.filter(s => s.buildingId.includes(`W${wardNumber}`)) : surveys;
    const filteredReports = wardNumber ? wardReports.filter(r => r.wardNumber === wardNumber) : wardReports;

    const payload = {
      type: 'LSG-Track-Survey-Batch',
      panchayatCode: activePId,
      wardNumber: wardNumber || 'all',
      exportedAt: new Date().toISOString(),
      surveys: filteredSurveys,
      wardReports: filteredReports
    };

    return JSON.stringify(payload, null, 2);
  },

  async importWardSurveysJSON(jsonString: string): Promise<{ importedCount: number }> {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.type !== 'LSG-Track-Survey-Batch') {
        throw new Error('Invalid survey hand-off file. File must be an LSG-Track survey batch export.');
      }

      const activePId = getActivePanchayathId();
      const keys = getKeys(activePId);
      const currentReports: WardReportRecord[] = JSON.parse(localStorage.getItem(keys.WARD_REPORTS) || '[]');

      let importedCount = 0;
      if (parsed.wardReports && Array.isArray(parsed.wardReports)) {
        parsed.wardReports.forEach((rep: WardReportRecord) => {
          const exists = currentReports.some(r => r.id === rep.id);
          if (!exists) {
            currentReports.unshift(rep);
            importedCount++;
          }
        });
        localStorage.setItem(keys.WARD_REPORTS, JSON.stringify(currentReports));
        notifySubscribers('wardReports', currentReports);
      }

      await this.addAuditLog('IMPORT_FIELD_SURVEYS', `Imported field survey hand-off batch (${importedCount} new entries).`);
      return { importedCount };
    } catch (err: any) {
      throw new Error(err?.message || 'Failed to import field survey batch.');
    }
  }
};
