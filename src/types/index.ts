export type UserRole = 
  | 'Administrator' 
  | 'Secretary' 
  | 'Ward Member' 
  | 'VEO' 
  | 'Data Entry Operator' 
  | 'Read Only Viewer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  ward?: string; // Ward assignment if Ward Member/Field Officer
  permissions: string[];
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

export type BuildingStatus = 'licensed' | 'unlicensed' | 'pending' | 'govt' | 'inactive';

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
  smsNotificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
}
