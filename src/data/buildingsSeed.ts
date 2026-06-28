import type { BuildingRecord, WardRecord, LicenseRecord, SurveyRecord, SystemNotification, AuditLogRecord, UserProfile } from '../types';

export const mockUsers: UserProfile[] = [
  { id: 'usr-admin', name: 'K. Balan', email: 'balan.administrator@kerala.gov.in', role: 'Administrator', permissions: ['all'] },
  { id: 'usr-secy', name: 'Smt. Mini Joseph', email: 'mini.secretary@kerala.gov.in', role: 'Secretary', permissions: ['approve_license', 'verify_survey', 'view_reports'] },
  { id: 'usr-ward1', name: 'Thomas Mathew (Ward 1 Member)', email: 'thomas.ward1@kerala.gov.in', role: 'Ward Member', ward: '1', permissions: ['view_ward', 'submit_survey'] },
  { id: 'usr-ward2', name: 'Anila Kumari (Ward 2 Member)', email: 'anila.ward2@kerala.gov.in', role: 'Ward Member', ward: '2', permissions: ['view_ward', 'submit_survey'] },
  { id: 'usr-officer1', name: 'Shri. P. K. Suresh', email: 'suresh.surveyor@kerala.gov.in', role: 'VEO', permissions: ['submit_survey', 'capture_gps'] },
  { id: 'usr-officer2', name: 'Smt. Deepa Nair', email: 'deepa.surveyor@kerala.gov.in', role: 'VEO', permissions: ['submit_survey', 'capture_gps'] },
  { id: 'usr-dataentry', name: 'Sajesh Kumar', email: 'sajesh.deo@kerala.gov.in', role: 'Data Entry Operator', permissions: ['register_building', 'edit_records'] },
  { id: 'usr-readonly', name: 'Public Auditor', email: 'auditor.readonly@kerala.gov.in', role: 'Read Only Viewer', permissions: ['view_only'] }
];

export const mockWards: WardRecord[] = [
  { id: '1', name: 'Ward 1 - Chakkittapara Town', totalBuildings: 25, licensedBuildings: 18, pendingBuildings: 3, unlicensedBuildings: 4, compliancePercentage: 72, assignedOfficer: 'Shri. P. K. Suresh' },
  { id: '2', name: 'Ward 2 - Kulathuvayal', totalBuildings: 18, licensedBuildings: 14, pendingBuildings: 1, unlicensedBuildings: 3, compliancePercentage: 77, assignedOfficer: 'Smt. Deepa Nair' },
  { id: '3', name: 'Ward 3 - Peruvannamuzhi', totalBuildings: 22, licensedBuildings: 15, pendingBuildings: 4, unlicensedBuildings: 3, compliancePercentage: 68, assignedOfficer: 'Shri. P. K. Suresh' },
  { id: '4', name: 'Ward 4 - Chembanoda', totalBuildings: 15, licensedBuildings: 12, pendingBuildings: 1, unlicensedBuildings: 2, compliancePercentage: 80, assignedOfficer: 'Smt. Deepa Nair' },
  { id: '5', name: 'Ward 5 - Muthukad', totalBuildings: 20, licensedBuildings: 13, pendingBuildings: 2, unlicensedBuildings: 5, compliancePercentage: 65, assignedOfficer: 'Shri. P. K. Suresh' },
  { id: '6', name: 'Ward 6 - Kattippara Road', totalBuildings: 12, licensedBuildings: 10, pendingBuildings: 0, unlicensedBuildings: 2, compliancePercentage: 83, assignedOfficer: 'Smt. Deepa Nair' }
];

// Chakkittapara coordinates center approx: 11.57547, 75.81649
export const mockBuildings: BuildingRecord[] = [
  {
    id: 'BLDG-101',
    ownerName: 'P. T. Abraham',
    businessName: 'Malabar Bakers & Sweets',
    category: 'Retail / Bakery',
    wardNumber: '1',
    coordinates: { lat: 11.57612, lng: 75.81520 },
    licenseId: 'LIC-201',
    status: 'licensed',
    remarks: 'Complies with fire safety standards.',
    history: [
      { date: '2025-04-12', action: 'CREATE', user: 'Sajesh Kumar', remarks: 'Initial registry' },
      { date: '2025-05-15', action: 'APPROVE', user: 'Smt. Mini Joseph', remarks: 'License issued after inspection' }
    ]
  },
  {
    id: 'BLDG-102',
    ownerName: 'N. K. Radhakrishnan',
    businessName: 'Radha Groceries',
    category: 'Retail / Provisions',
    wardNumber: '1',
    coordinates: { lat: 11.57480, lng: 75.81710 },
    status: 'unlicensed',
    remarks: 'Operating without local body trade license. Notice issued.',
    history: [
      { date: '2025-09-01', action: 'CREATE', user: 'Sajesh Kumar', remarks: 'Identified during tax review' }
    ]
  },
  {
    id: 'BLDG-103',
    ownerName: 'M. M. Mathew',
    businessName: 'St. George Hardwares & Electricals',
    category: 'Wholesale / Hardware',
    wardNumber: '1',
    coordinates: { lat: 11.57720, lng: 75.81480 },
    status: 'pending',
    remarks: 'Survey uploaded. Waiting for Secretary approval.',
    history: [
      { date: '2026-06-10', action: 'CREATE', user: 'Sajesh Kumar', remarks: 'Initial registry' },
      { date: '2026-06-25', action: 'SURVEY_SUBMIT', user: 'Shri. P. K. Suresh', remarks: 'Site visited. GPS verified.' }
    ]
  },
  {
    id: 'BLDG-104',
    ownerName: 'Government of Kerala',
    businessName: 'Chakkittapara Grama Panchayat Office',
    category: 'Government Office',
    wardNumber: '1',
    coordinates: { lat: 11.57547, lng: 75.81649 },
    status: 'govt',
    remarks: 'Main administrative office.',
    history: [
      { date: '2020-01-01', action: 'CREATE', user: 'System', remarks: 'Base installation' }
    ]
  },
  {
    id: 'BLDG-201',
    ownerName: 'Smt. Khadeeja Beevi',
    businessName: 'Al-Madina Restaurant',
    category: 'Hotel / Restaurant',
    wardNumber: '2',
    coordinates: { lat: 11.58110, lng: 75.82100 },
    licenseId: 'LIC-202',
    status: 'licensed',
    remarks: 'Health inspection clear.',
    history: [
      { date: '2024-05-10', action: 'CREATE', user: 'Sajesh Kumar', remarks: 'Registry created' }
    ]
  },
  {
    id: 'BLDG-202',
    ownerName: 'K. J. George',
    businessName: 'George Medicals & Diagnostics',
    category: 'Clinic / Pharmacy',
    wardNumber: '2',
    coordinates: { lat: 11.58320, lng: 75.82340 },
    status: 'unlicensed',
    remarks: 'Unlicensed medical lab facilities. In violation of code.',
    history: [
      { date: '2026-05-02', action: 'CREATE', user: 'Smt. Deepa Nair', remarks: 'Identified during survey' }
    ]
  },
  {
    id: 'BLDG-301',
    ownerName: 'Joseph K. J.',
    businessName: 'Peruvannamuzhi Tourist Lodge',
    category: 'Lodging / Commercial',
    wardNumber: '3',
    coordinates: { lat: 11.56450, lng: 75.80910 },
    licenseId: 'LIC-203',
    status: 'licensed',
    remarks: 'Near dam tourism spot.',
    history: [
      { date: '2023-11-20', action: 'CREATE', user: 'Sajesh Kumar', remarks: 'Registry created' }
    ]
  },
  {
    id: 'BLDG-302',
    ownerName: 'Irrigation Department',
    businessName: 'Peruvannamuzhi Dam Info Centre',
    category: 'Government / Tourism',
    wardNumber: '3',
    coordinates: { lat: 11.56210, lng: 75.80800 },
    status: 'govt',
    remarks: 'Government tourist info point.',
    history: [
      { date: '2021-03-15', action: 'CREATE', user: 'System', remarks: 'Added government building' }
    ]
  },
  {
    id: 'BLDG-401',
    ownerName: 'K. R. Hariharan',
    businessName: 'Hari Rice & Flour Mill',
    category: 'Industrial / Mill',
    wardNumber: '4',
    coordinates: { lat: 11.58910, lng: 75.81120 },
    licenseId: 'LIC-204',
    status: 'licensed',
    remarks: 'Noise pollution certificate attached.',
    history: [
      { date: '2024-03-01', action: 'CREATE', user: 'Sajesh Kumar', remarks: 'Created mill entry' }
    ]
  },
  {
    id: 'BLDG-501',
    ownerName: 'Thomas Kurian',
    businessName: 'Muthukad Spices Processing',
    category: 'Industrial / Agriculture',
    wardNumber: '5',
    coordinates: { lat: 11.56990, lng: 75.83210 },
    status: 'pending',
    remarks: 'New spice sorting plant, field survey submitted. Lat/Lng needs cross check.',
    history: [
      { date: '2026-06-20', action: 'CREATE', user: 'Sajesh Kumar', remarks: 'Data Entry' },
      { date: '2026-06-27', action: 'SURVEY_SUBMIT', user: 'Shri. P. K. Suresh', remarks: 'Inspection completed' }
    ]
  }
];

export const mockLicenses: LicenseRecord[] = [
  {
    id: 'LIC-201',
    buildingId: 'BLDG-101',
    licenseType: 'D&O (Dangerous & Offensive) Trade License',
    issueDate: '2025-05-15',
    expiryDate: '2026-03-31', // Expired
    status: 'expired',
    feePaid: 1500
  },
  {
    id: 'LIC-202',
    buildingId: 'BLDG-201',
    licenseType: 'D&O Trade License - Food/Catering',
    issueDate: '2025-04-01',
    expiryDate: '2027-03-31', // Active
    status: 'active',
    feePaid: 2500
  },
  {
    id: 'LIC-203',
    buildingId: 'BLDG-301',
    licenseType: 'Commercial Lodging License',
    issueDate: '2025-04-01',
    expiryDate: '2026-03-31', // Expired
    status: 'expired',
    feePaid: 5000
  },
  {
    id: 'LIC-204',
    buildingId: 'BLDG-401',
    licenseType: 'Industrial Manufacturing License',
    issueDate: '2026-04-01',
    expiryDate: '2027-03-31', // Active
    status: 'active',
    feePaid: 4500
  }
];

export const mockSurveys: SurveyRecord[] = [
  {
    id: 'SRV-301',
    buildingId: 'BLDG-103',
    officerId: 'usr-officer1',
    officerName: 'Shri. P. K. Suresh',
    gps: { lat: 11.57720, lng: 75.81480 },
    status: 'submitted',
    remarks: 'Verified boundary and owner records. Business is active and operating. Safe distance from highway maintained.',
    surveyDate: '2026-06-25',
    isSynced: true
  },
  {
    id: 'SRV-302',
    buildingId: 'BLDG-501',
    officerId: 'usr-officer1',
    officerName: 'Shri. P. K. Suresh',
    gps: { lat: 11.56990, lng: 75.83210 },
    status: 'submitted',
    remarks: 'Spice sorting unit. Fire extinguishers installed. Found unlicensed operations but forms submitted for issue.',
    surveyDate: '2026-06-27',
    isSynced: true
  }
];

export const mockNotifications: SystemNotification[] = [
  {
    id: 'NOT-001',
    title: 'License Expiring Soon',
    message: 'Malabar Bakers & Sweets (LIC-201) in Ward 1 has expired on 2026-03-31.',
    type: 'warning',
    timestamp: '2026-06-28T09:00:00Z',
    read: false
  },
  {
    id: 'NOT-002',
    title: 'Verification Required',
    message: 'Field Officer Suresh submitted a survey for St. George Hardwares (BLDG-103) in Ward 1.',
    type: 'info',
    timestamp: '2026-06-25T11:30:00Z',
    read: false
  },
  {
    id: 'NOT-003',
    title: 'Unlicensed Building Flagged',
    message: 'George Medicals (BLDG-202) has been reported active without a trade license in Ward 2.',
    type: 'alert',
    timestamp: '2026-06-27T16:45:00Z',
    read: true
  }
];

export const mockAuditLogs: AuditLogRecord[] = [
  { id: 'LOG-001', timestamp: '2026-06-25T11:30:00Z', userId: 'usr-officer1', userName: 'Shri. P. K. Suresh', userRole: 'VEO', action: 'SURVEY_SUBMIT', description: 'Submitted field inspection details for St. George Hardwares (BLDG-103).' },
  { id: 'LOG-002', timestamp: '2026-06-27T16:00:00Z', userId: 'usr-dataentry', userName: 'Sajesh Kumar', userRole: 'Data Entry Operator', action: 'CREATE', description: 'Registered building record for Muthukad Spices Processing (BLDG-501).' },
  { id: 'LOG-003', timestamp: '2026-06-27T16:45:00Z', userId: 'usr-officer1', userName: 'Shri. P. K. Suresh', userRole: 'VEO', action: 'SURVEY_SUBMIT', description: 'Submitted field inspection details for Muthukad Spices Processing (BLDG-501).' },
  { id: 'LOG-004', timestamp: '2026-06-28T04:20:00Z', userId: 'usr-secy', userName: 'Smt. Mini Joseph', userRole: 'Secretary', action: 'LOGIN', description: 'Logged into dashboard portal.' }
];
