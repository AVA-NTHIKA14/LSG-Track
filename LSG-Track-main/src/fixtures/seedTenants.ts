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
    boundaryGeoJSON: '', // Dynamic Storage URL or pre-fetched GeoJSON
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
