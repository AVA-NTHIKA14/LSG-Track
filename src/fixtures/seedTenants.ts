import type { Tenant, WardRecord } from '../types';

export const CHAKKITTAPARA_TENANT_ID = '204902';
export const PANANGAD_TENANT_ID = 'G110706';

export const CHAKKITTAPARA_GEOJSON_STRING = JSON.stringify({
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
        coordinates: [[[75.8200, 11.5850], [75.8185, 11.5880], [75.8202, 11.5915], [75.8235, 11.5932], [75.8270, 11.5938], [75.8295, 11.5912], [75.8288, 11.5878], [75.8265, 11.5855], [75.8230, 11.5842], [75.8200, 11.5850]]]
      }
    }
  ]
});

export const SEED_WARDS_CHAKKITTAPARA: WardRecord[] = [
  { id: "1", name: "Ward 1 - Pannikkottur", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 100.0, assignedOfficer: "Anjali Devi" },
  { id: "2", name: "Ward 2 - Chembanoda", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 100.0, assignedOfficer: "Binu Kumar" },
  { id: "3", name: "Ward 3 - Kurathippara", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 100.0, assignedOfficer: "Sajith V" },
  { id: "4", name: "Ward 4 - Poozhithode", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 100.0, assignedOfficer: "Unassigned" },
  { id: "5", name: "Ward 5 - Ilamkad-Chenkottakkolli", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 100.0, assignedOfficer: "Unassigned" },
  { id: "7", name: "Ward 7 - Muthukad", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 100.0, assignedOfficer: "Unassigned" },
  { id: "8", name: "Ward 8 - Plantation", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 100.0, assignedOfficer: "Unassigned" },
  { id: "9", name: "Ward 9 - Narinada", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 100.0, assignedOfficer: "Unassigned" },
  { id: "10", name: "Ward 10 - Annakuttanchal", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 100.0, assignedOfficer: "Unassigned" },
  { id: "11", name: "Ward 11 - Peruvannamuzhi", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 100.0, assignedOfficer: "Unassigned" },
  { id: "12", name: "Ward 12 - Chakkittapara", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 100.0, assignedOfficer: "Unassigned" },
  { id: "13", name: "Ward 13 - Kulathuvayal", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 100.0, assignedOfficer: "Unassigned" },
  { id: "16", name: "Ward 16 - Thazhathuvayal", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 100.0, assignedOfficer: "Unassigned" }
];

export const SEED_WARDS_PANANGAD: WardRecord[] = [
  { id: "1", name: "Ward 1 - Kannadipoil", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 100.0, assignedOfficer: "Anjali Devi" },
  { id: "2", name: "Ward 2 - Kurumpoli", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 100.0, assignedOfficer: "Unassigned" },
  { id: "3", name: "Ward 3 - Vayalada", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 100.0, assignedOfficer: "Unassigned" },
  { id: "4", name: "Ward 4 - Thalayad", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 100.0, assignedOfficer: "Binu Kumar" },
  { id: "5", name: "Ward 5 - Padikkal Vayal", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 100.0, assignedOfficer: "Unassigned" },
  { id: "6", name: "Ward 6 - Mankayam", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 100.0, assignedOfficer: "Unassigned" },
  { id: "7", name: "Ward 7 - Ezhukandi", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 100.0, assignedOfficer: "Unassigned" },
  { id: "8", name: "Ward 8 - Palamthala", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 100.0, assignedOfficer: "Unassigned" },
  { id: "9", name: "Ward 9 - Poovambai", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 100.0, assignedOfficer: "Unassigned" },
  { id: "10", name: "Ward 10 - Rarothmukku", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 100.0, assignedOfficer: "Unassigned" },
  { id: "11", name: "Ward 11 - Chithiramangalam", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 100.0, assignedOfficer: "Unassigned" },
  { id: "12", name: "Ward 12 - Vattoli", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 100.0, assignedOfficer: "Sajith V" },
  { id: "13", name: "Ward 13 - Arappeedika", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 100.0, assignedOfficer: "Unassigned" },
  { id: "14", name: "Ward 14 - Mundakkara", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 100.0, assignedOfficer: "Unassigned" },
  { id: "15", name: "Ward 15 - Thiruvancheripoil", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 100.0, assignedOfficer: "Unassigned" },
  { id: "16", name: "Ward 16 - Karayathodi", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 100.0, assignedOfficer: "Unassigned" },
  { id: "17", name: "Ward 17 - Kattamvalli", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 100.0, assignedOfficer: "Unassigned" },
  { id: "18", name: "Ward 18 - Nirmallur", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 100.0, assignedOfficer: "Unassigned" },
  { id: "19", name: "Ward 19 - Panangad North", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 100.0, assignedOfficer: "Anjali Devi" },
  { id: "20", name: "Ward 20 - Kattode", totalBuildings: 0, licensedBuildings: 0, pendingBuildings: 0, unlicensedBuildings: 0, compliancePercentage: 100.0, assignedOfficer: "Unassigned" }
];

export const SEED_TENANTS: Tenant[] = [
  {
    id: CHAKKITTAPARA_TENANT_ID,
    name: 'Chakkittapara Grama Panchayat',
    lsgType: 'grama_panchayat',
    district: 'Kozhikode',
    taluk: 'Quilandy',
    talukOrZone: 'Quilandy',
    boundaryGeoJSON: CHAKKITTAPARA_GEOJSON_STRING,
    gisBoundary: {
      inlineGeoJSON: CHAKKITTAPARA_GEOJSON_STRING
    },
    branding: {
      primaryColor: '#0F6E4F',
      secondaryColor: '#1E293B',
      slogan: 'Model Eco-Governance & License Compliance'
    },
    contactInfo: {
      email: 'secretary.chakkittapara@lsgtrack.gov.in'
    },
    featureFlags: {
      enableWhatsAppAlerts: true,
      enablePublicPortal: true,
      enableKSmartSync: true
    },
    status: 'active'
  },
  {
    id: PANANGAD_TENANT_ID,
    name: 'Panangad Grama Panchayat',
    lsgType: 'grama_panchayat',
    district: 'Kozhikode',
    taluk: 'Balussery',
    talukOrZone: 'Balussery',
    boundaryGeoJSON: '',
    gisBoundary: {
      geoJsonUrl: '/data/panangad_wards.geojson',
      localFallbackPath: '/data/panangad_wards.geojson'
    },
    branding: {
      primaryColor: '#1D4ED8',
      secondaryColor: '#0F172A',
      slogan: 'Digital Trade Licensing Platform'
    },
    contactInfo: {
      email: 'secretary.panangad@lsgtrack.gov.in'
    },
    featureFlags: {
      enableWhatsAppAlerts: true,
      enablePublicPortal: true,
      enableKSmartSync: true
    },
    status: 'active'
  }
];

export const SEED_WARDS_BY_TENANT: Record<string, WardRecord[]> = {
  [CHAKKITTAPARA_TENANT_ID]: SEED_WARDS_CHAKKITTAPARA,
  [PANANGAD_TENANT_ID]: SEED_WARDS_PANANGAD
};

export const getAllSeedTenants = (): Tenant[] => SEED_TENANTS;

export const getSeedTenant = (id: string): Tenant | undefined =>
  SEED_TENANTS.find(t => t.id === id);

export const getSeedWardsForTenant = (id: string): WardRecord[] =>
  SEED_WARDS_BY_TENANT[id] || [];
