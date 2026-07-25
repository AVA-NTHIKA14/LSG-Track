import type { BuildingRecord, WardRecord, LicenseRecord, SurveyRecord, SystemNotification, AuditLogRecord, UserProfile } from '../../src/types';

export const mockUsers: UserProfile[] = [
  { id: 'usr-admin', name: 'K. Balan', email: 'balan.administrator@kerala.gov.in', role: 'Administrator', permissions: ['all'], panchayathId: 'all' },
  { id: 'usr-secy', name: 'Smt. Mini Joseph', email: 'mini.secretary@kerala.gov.in', role: 'Secretary', permissions: ['approve_license', 'verify_survey', 'view_reports'], panchayathId: '204902' },
  { id: 'usr-ward12', name: 'Thomas Mathew (Ward 12 Member)', email: 'thomas.ward12@kerala.gov.in', role: 'Ward Member', ward: '12', permissions: ['view_ward', 'submit_survey'], panchayathId: '204902' },
  { id: 'usr-ward11', name: 'Anila Kumari (Ward 11 Member)', email: 'anila.ward11@kerala.gov.in', role: 'Ward Member', ward: '11', permissions: ['view_ward', 'submit_survey'], panchayathId: '204902' },
  { id: 'usr-officer1', name: 'Shri. P. K. Suresh', email: 'suresh.surveyor@kerala.gov.in', role: 'VEO', permissions: ['submit_survey', 'capture_gps'], panchayathId: '204902' },
  { id: 'usr-officer2', name: 'Smt. Deepa Nair', email: 'deepa.surveyor@kerala.gov.in', role: 'VEO', permissions: ['submit_survey', 'capture_gps'], panchayathId: '204902' },
  { id: 'usr-dataentry', name: 'Sajesh Kumar', email: 'sajesh.deo@kerala.gov.in', role: 'Data Entry Operator', permissions: ['register_building', 'edit_records'], panchayathId: '204902' },
  { id: 'usr-readonly', name: 'Public Auditor', email: 'auditor.readonly@kerala.gov.in', role: 'Read Only Viewer', permissions: ['view_only'], panchayathId: '204902' }
];

export const mockWards: WardRecord[] = [
  { id: '1', name: 'Ward 1 - Pannikkottur', totalBuildings: 25, licensedBuildings: 23, pendingBuildings: 1, unlicensedBuildings: 1, compliancePercentage: 92, assignedOfficer: 'Shri. P. K. Suresh' },
  { id: '2', name: 'Ward 2 - Chembanoda', totalBuildings: 18, licensedBuildings: 14, pendingBuildings: 1, unlicensedBuildings: 3, compliancePercentage: 82, assignedOfficer: 'Smt. Deepa Nair' },
  { id: '3', name: 'Ward 3 - Kurathippara', totalBuildings: 22, licensedBuildings: 16, pendingBuildings: 3, unlicensedBuildings: 3, compliancePercentage: 76, assignedOfficer: 'Shri. P. K. Suresh' },
  { id: '4', name: 'Ward 4 - Poozhithode', totalBuildings: 15, licensedBuildings: 9, pendingBuildings: 3, unlicensedBuildings: 3, compliancePercentage: 63, assignedOfficer: 'Smt. Deepa Nair' },
  { id: '5', name: 'Ward 5 - Ilamkad-Chenkottakkolli', totalBuildings: 20, licensedBuildings: 10, pendingBuildings: 4, unlicensedBuildings: 6, compliancePercentage: 52, assignedOfficer: 'Shri. P. K. Suresh' },
  { id: '7', name: 'Ward 7 - Muthukad', totalBuildings: 12, licensedBuildings: 10, pendingBuildings: 0, unlicensedBuildings: 2, compliancePercentage: 88, assignedOfficer: 'Smt. Deepa Nair' },
  { id: '8', name: 'Ward 8 - Plantation', totalBuildings: 16, licensedBuildings: 11, pendingBuildings: 2, unlicensedBuildings: 3, compliancePercentage: 74, assignedOfficer: 'Shri. P. K. Suresh' },
  { id: '9', name: 'Ward 9 - Narinada', totalBuildings: 14, licensedBuildings: 13, pendingBuildings: 0, unlicensedBuildings: 1, compliancePercentage: 95, assignedOfficer: 'Smt. Deepa Nair' },
  { id: '10', name: 'Ward 10 - Annakuttanchal', totalBuildings: 19, licensedBuildings: 13, pendingBuildings: 2, unlicensedBuildings: 4, compliancePercentage: 73, assignedOfficer: 'Shri. P. K. Suresh' },
  { id: '11', name: 'Ward 11 - Peruvannamuzhi', totalBuildings: 28, licensedBuildings: 15, pendingBuildings: 5, unlicensedBuildings: 8, compliancePercentage: 57, assignedOfficer: 'Smt. Deepa Nair' },
  { id: '12', name: 'Ward 12 - Chakkittapara', totalBuildings: 35, licensedBuildings: 26, pendingBuildings: 4, unlicensedBuildings: 5, compliancePercentage: 77, assignedOfficer: 'Shri. P. K. Suresh' },
  { id: '13', name: 'Ward 13 - Kulathuvayal', totalBuildings: 24, licensedBuildings: 19, pendingBuildings: 2, unlicensedBuildings: 3, compliancePercentage: 81, assignedOfficer: 'Smt. Deepa Nair' },
  { id: '16', name: 'Ward 16 - Thazhathuvayal', totalBuildings: 15, licensedBuildings: 9, pendingBuildings: 3, unlicensedBuildings: 3, compliancePercentage: 68, assignedOfficer: 'Shri. P. K. Suresh' }
];

export const mockBuildings: BuildingRecord[] = [
  {
    id: 'BLDG-101',
    ownerName: 'Joy Joseph',
    businessName: 'Chakkittapara Cooperative Bank',
    category: 'Financial Service / Banking',
    wardNumber: '12',
    coordinates: { lat: 11.57560, lng: 75.81600 },
    licenseId: 'LIC-201',
    status: 'licensed',
    remarks: 'Approved structural clearance. Trade license active.',
    history: [
      { date: '2025-04-12', action: 'CREATE', user: 'Sajesh Kumar', remarks: 'Initial registry entry' },
      { date: '2025-05-15', action: 'APPROVE', user: 'Smt. Mini Joseph', remarks: 'Trade license generated' }
    ]
  },
  {
    id: 'BLDG-102',
    ownerName: 'Grama Panchayat Secretary',
    businessName: 'Chakkittapara Panchayat Office',
    category: 'Government Office',
    wardNumber: '12',
    coordinates: { lat: 11.57547, lng: 75.81649 },
    status: 'govt',
    remarks: 'Panchayat Administrative Headquarters.',
    history: [
      { date: '2020-01-01', action: 'CREATE', user: 'System', remarks: 'Base registry installation' }
    ]
  },
  {
    id: 'BLDG-103',
    ownerName: 'Dr. Ramesh Nair',
    businessName: 'Janakshema Hospital, Chakkittapara',
    category: 'Healthcare / Clinic',
    wardNumber: '12',
    coordinates: { lat: 11.57620, lng: 75.81710 },
    status: 'pending',
    remarks: 'Inspected medical facilities. Fire safety verification pending.',
    history: [
      { date: '2026-06-10', action: 'CREATE', user: 'Sajesh Kumar', remarks: 'Hospital entry registry' },
      { date: '2026-06-25', action: 'SURVEY_SUBMIT', user: 'Shri. P. K. Suresh', remarks: 'Field survey GPS verified.' }
    ]
  },
  {
    id: 'BLDG-104',
    ownerName: 'Home Department',
    businessName: 'Chakkittapara Police Station',
    category: 'Government / Security',
    wardNumber: '12',
    coordinates: { lat: 11.57480, lng: 75.81550 },
    status: 'govt',
    remarks: 'Police headquarters and security camp.',
    history: [
      { date: '2021-02-10', action: 'CREATE', user: 'System', remarks: 'Public service listing' }
    ]
  },
  {
    id: 'BLDG-201',
    ownerName: 'ICAR Director',
    businessName: 'IISR Experimental Farm, Peruvannamuzhi',
    category: 'Research / Agriculture',
    wardNumber: '11',
    coordinates: { lat: 11.56450, lng: 75.80910 },
    licenseId: 'LIC-202',
    status: 'licensed',
    remarks: 'Indian Institute of Spices Research complex.',
    history: [
      { date: '2024-05-10', action: 'CREATE', user: 'Sajesh Kumar', remarks: 'Registry created' }
    ]
  },
  {
    id: 'BLDG-202',
    ownerName: 'DTPC Kozhikode',
    businessName: 'Peruvannamuzhi Reservoir Boating Center',
    category: 'Tourism / Commercial',
    wardNumber: '11',
    coordinates: { lat: 11.56210, lng: 75.80800 },
    status: 'unlicensed',
    remarks: 'Boating ticket center operating without current fiscal D&O license. Notice dispatched.',
    history: [
      { date: '2026-05-02', action: 'CREATE', user: 'Smt. Deepa Nair', remarks: 'Identified during tourism survey' }
    ]
  },
  {
    id: 'BLDG-301',
    ownerName: 'Kulathuvayal Diocese',
    businessName: 'St. George Church, Kulathuvayal',
    category: 'Religious / NGO',
    wardNumber: '13',
    coordinates: { lat: 11.53200, lng: 75.79800 },
    status: 'ngo',
    remarks: 'Charitable institution/Exempt category.',
    history: [
      { date: '2023-11-20', action: 'CREATE', user: 'Sajesh Kumar', remarks: 'Registered NGO status' }
    ]
  },
  {
    id: 'BLDG-302',
    ownerName: 'Education Dept Kerala',
    businessName: 'St. George High School, Kulathuvayal',
    category: 'Educational / Govt',
    wardNumber: '13',
    coordinates: { lat: 11.53320, lng: 75.79950 },
    status: 'govt',
    remarks: 'Aided primary & high school campus.',
    history: [
      { date: '2021-03-15', action: 'CREATE', user: 'System', remarks: 'Registry entry complete' }
    ]
  },
  {
    id: 'BLDG-401',
    ownerName: 'Government of Kerala',
    businessName: 'Govt. UP School, Chembanoda',
    category: 'Educational / Govt',
    wardNumber: '2',
    coordinates: { lat: 11.58110, lng: 75.81050 },
    status: 'govt',
    remarks: 'Government school campus.',
    history: [
      { date: '2024-03-01', action: 'CREATE', user: 'Sajesh Kumar', remarks: 'Initial school listing' }
    ]
  },
  {
    id: 'BLDG-501',
    ownerName: 'KSEB Limited',
    businessName: 'Poozhithode Hydroelectric Project Site',
    category: 'Industrial / Power',
    wardNumber: '4',
    coordinates: { lat: 11.59950, lng: 75.83900 },
    status: 'pending',
    remarks: 'Power station plant. Field survey submitted, waiting for commercial clearance.',
    history: [
      { date: '2026-06-20', action: 'CREATE', user: 'Sajesh Kumar', remarks: 'Industrial registration' },
      { date: '2026-06-27', action: 'SURVEY_SUBMIT', user: 'Shri. P. K. Suresh', remarks: 'Field survey complete' }
    ]
  }
];

export const mockLicenses: LicenseRecord[] = [
  {
    id: 'LIC-201',
    buildingId: 'BLDG-101',
    licenseType: 'Commercial Trade License',
    issueDate: '2025-05-15',
    expiryDate: '2026-03-31',
    status: 'expired',
    feePaid: 1500
  },
  {
    id: 'LIC-202',
    buildingId: 'BLDG-201',
    licenseType: 'D&O Trade License - Food/Catering',
    issueDate: '2025-04-01',
    expiryDate: '2027-03-31',
    status: 'active',
    feePaid: 2500
  }
];

export const mockSurveys: SurveyRecord[] = [
  {
    id: 'SRV-301',
    buildingId: 'BLDG-103',
    officerId: 'usr-officer1',
    officerName: 'Shri. P. K. Suresh',
    gps: { lat: 11.57620, lng: 75.81710 },
    status: 'submitted',
    remarks: 'Verified bank layout and boundary markers. Safety clearance documents submitted.',
    surveyDate: '2026-06-25',
    isSynced: true
  },
  {
    id: 'SRV-302',
    buildingId: 'BLDG-501',
    officerId: 'usr-officer1',
    officerName: 'Shri. P. K. Suresh',
    gps: { lat: 11.59950, lng: 75.83900 },
    status: 'submitted',
    remarks: 'Inspected plant layout and electrical safety clearance documents. Recommended for license generation.',
    surveyDate: '2026-06-27',
    isSynced: true
  }
];

export const mockNotifications: SystemNotification[] = [
  {
    id: 'NOT-001',
    title: 'License Expiring Soon',
    message: 'Chakkittapara Cooperative Bank (LIC-201) in Ward 12 has expired on 2026-03-31.',
    type: 'warning',
    timestamp: '2026-06-28T09:00:00Z',
    read: false
  },
  {
    id: 'NOT-002',
    title: 'Verification Required',
    message: 'Field Officer Suresh submitted a survey for Janakshema Hospital (BLDG-103) in Ward 12.',
    type: 'info',
    timestamp: '2026-06-25T11:30:00Z',
    read: false
  },
  {
    id: 'NOT-003',
    title: 'Unlicensed Building Flagged',
    message: 'Peruvannamuzhi Reservoir Boating Center (BLDG-202) has been reported active without a trade license in Ward 11.',
    type: 'alert',
    timestamp: '2026-06-27T16:45:00Z',
    read: true
  }
];

export const mockAuditLogs: AuditLogRecord[] = [
  { id: 'LOG-001', timestamp: '2026-06-25T11:30:00Z', userId: 'usr-officer1', userName: 'Shri. P. K. Suresh', userRole: 'VEO', action: 'SURVEY_SUBMIT', description: 'Submitted field inspection details for Janakshema Hospital (BLDG-103).' },
  { id: 'LOG-002', timestamp: '2026-06-27T16:00:00Z', userId: 'usr-dataentry', userName: 'Sajesh Kumar', userRole: 'Data Entry Operator', action: 'CREATE', description: 'Registered industrial record for Poozhithode Hydroelectric Project Site (BLDG-501).' },
  { id: 'LOG-003', timestamp: '2026-06-27T16:45:00Z', userId: 'usr-officer1', userName: 'Shri. P. K. Suresh', userRole: 'VEO', action: 'SURVEY_SUBMIT', description: 'Submitted field inspection details for Poozhithode Hydroelectric Project Site (BLDG-501).' },
  { id: 'LOG-004', timestamp: '2026-06-28T04:20:00Z', userId: 'usr-secy', userName: 'Smt. Mini Joseph', userRole: 'Secretary', action: 'LOGIN', description: 'Logged into dashboard portal.' }
];
