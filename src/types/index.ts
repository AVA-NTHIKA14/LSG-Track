export type UserRole = 
  | 'secretary' | 'clerk' | 'ward_member' | 'admin'
  | 'Secretary' | 'Panchayat Section Clerk' | 'Ward Member' | 'Administrator';

export type UserStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface UserProfile {
  uid: string;
  id?: string;
  name: string;
  email: string;
  panchayatCode: string;
  panchayathId?: string;
  role: UserRole;
  wardNumber?: number | string | null;
  ward?: string;
  status: UserStatus;
  createdAt: string;
  permissions?: string[];
  active?: boolean;
}

export interface StaffProfile {
  id: string;
  name: string;
  role: UserRole;
  wardNumber?: string | number | null;
  pin?: string;
  createdAt: string;
}

export interface WardRecord {
  id: string; // Ward number e.g. "1", "2"
  name: string; // Ward name e.g. "Ward 1 - Town Centre"
  totalBuildings: number;
  licensedBuildings: number;
  pendingBuildings: number;
  unlicensedBuildings: number;
  compliancePercentage: number;
  assignedOfficer: string; // Name of assigned field officer
}

export type BuildingStatus = 'licensed' | 'unlicensed' | 'pending' | 'govt' | 'ngo' | 'inactive';
export type RiskLevel = 'High' | 'Medium' | 'Low';

export interface BuildingRecord {
  id: string;
  ownerName: string;
  businessName: string;
  category: string; // e.g. "Retail", "Hotel/Restaurant", "Industrial", "Clinic"
  wardNumber: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  photoUrl?: string;
  licenseId?: string; // Reference to license record
  status: BuildingStatus;
  remarks?: string;
  riskScore?: RiskLevel;
  lastSyncDate?: string;
  kSmartRefId?: string;
  lastInspectionDate?: string;
  history?: {
    date: string;
    action: string;
    user: string;
    remarks: string;
  }[];
  attachments?: {
    name: string;
    url: string;
    uploadedAt: string;
  }[];
  createdBy?: string;
  assignedTo?: string;
  isReturnedForCorrection?: boolean;
  submittedAt?: string;
}

export type LicenseStatus = 'active' | 'expired' | 'suspended' | 'cancelled';

export interface LicenseRecord {
  id: string; // License Number e.g. "CP-2026-X102"
  buildingId: string;
  licenseType: string;
  issueDate: string;
  expiryDate: string;
  status: LicenseStatus;
  feePaid: number;
  kSmartAppNo?: string;
}

export type SurveyStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

export interface SurveyRecord {
  id: string;
  buildingId: string;
  officerId: string;
  officerName: string;
  gps: {
    lat: number;
    lng: number;
  };
  photoUrl?: string;
  status: SurveyStatus;
  remarks: string;
  surveyDate: string;
  isSynced: boolean; // Relevant for offline sync drafts
}

export type WardReportStatus = 
  | 'pending_verification' 
  | 'verified_licensed' 
  | 'inspection_required' 
  | 'confirmed_unlicensed' 
  | 'closed';

export interface WardReportRecord {
  id: string;
  wardNumber: string;
  businessName: string;
  ownerName?: string;
  category: string;
  landmark?: string;
  photoUrl?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  remarks: string;
  reporterId: string;
  reporterName: string;
  status: WardReportStatus;
  createdAt: string;
  verifiedAt?: string;
  matchedBuildingId?: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  timestamp: string;
  read: boolean;
}

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string; // e.g. "CREATE", "UPDATE", "APPROVE", "REJECT", "LOGIN"
  description: string;
}

export interface SystemSettings {
  highContrast: boolean;
  largerText?: boolean;
  smsNotificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
}

export interface Panchayath {
  id: string; // LSGD code e.g. "204902"
  name: string;
  district: string;
  taluk?: string;
  boundaryGeoJSON?: string; // Ward boundary GeoJSON string
  status: 'active' | 'suspended' | 'pending';
}

export type LSGType = 'grama_panchayat' | 'municipality' | 'corporation';

export interface TenantBranding {
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  slogan?: string;
}

export interface TenantContactInfo {
  phone?: string;
  email?: string;
  officeAddress?: string;
}

export interface TenantGISConfig {
  geoJsonUrl?: string;
  inlineGeoJSON?: string;
  localFallbackPath?: string;
  boundingBox?: [number, number, number, number];
}

export interface TenantFeatureFlags {
  enableWhatsAppAlerts?: boolean;
  enablePublicPortal?: boolean;
  enableKSmartSync?: boolean;
}

export interface Tenant extends Panchayath {
  lsgType?: LSGType;
  talukOrZone?: string;
  branding?: TenantBranding;
  contactInfo?: TenantContactInfo;
  gisBoundary?: TenantGISConfig;
  featureFlags?: TenantFeatureFlags;
  createdAt?: string;
  updatedAt?: string;
}

export interface SyncHistoryRecord {
  id: string;
  timestamp: string;
  operatorName: string;
  fileName: string;
  totalRecords: number;
  importedCount: number;
  updatedCount: number;
  expiredCount: number;
  errorCount: number;
  duplicateCount?: number;
  errors: string[];
}

export interface WhatsAppLogRecord {
  id: string;
  recipientName: string;
  businessName: string;
  contactNumber: string;
  channel: 'WhatsApp';
  messageText: string;
  status: 'sent' | 'delivered' | 'failed';
  timestamp: string;
}
