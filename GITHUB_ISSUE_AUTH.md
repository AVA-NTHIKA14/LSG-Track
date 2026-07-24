# Issue: Firebase Authentication Console User Provisioning & Production Configuration

## Description
Set up production Firebase Authentication user accounts and Firestore role profiles for Kerala Grama Panchayat personnel to transition from local simulation mode to pure cloud Firebase authentication.

---

## Tasks to Complete

### 1. Provision Officer Accounts in Firebase Auth Console
Create the following accounts under **Firebase Console > Authentication > Users**:
- `secretary@lsgtrack.gov.in`
- `clerk@lsgtrack.gov.in`
- `ward@lsgtrack.gov.in`
- `admin@lsgtrack.gov.in`

### 2. Provision Firestore User Profile Documents
Create matching user profile documents in **Cloud Firestore** under the `users` collection:

#### Document Path: `users/{secretary_uid}`
```json
{
  "id": "{secretary_uid}",
  "name": "Panchayat Secretary",
  "email": "secretary@lsgtrack.gov.in",
  "role": "Secretary",
  "panchayathId": "G110706",
  "permissions": ["approve_license", "verify_survey", "view_reports"],
  "active": true
}
```

#### Document Path: `users/{clerk_uid}`
```json
{
  "id": "{clerk_uid}",
  "name": "Panchayat Section Clerk",
  "email": "clerk@lsgtrack.gov.in",
  "role": "Panchayat Section Clerk",
  "panchayathId": "G110706",
  "permissions": ["register_building", "view_only"],
  "active": true
}
```

#### Document Path: `users/{ward_uid}`
```json
{
  "id": "{ward_uid}",
  "name": "Ward Member",
  "email": "ward@lsgtrack.gov.in",
  "role": "Ward Member",
  "ward": "1",
  "panchayathId": "G110706",
  "permissions": ["submit_survey", "view_only"],
  "active": true
}
```

---

## Current Status
- Portal build is fully functional with instant 1-click role testing and local simulation fallback.
- Firebase integration code in `src/services/authService.ts` is ready and will automatically authenticate against Firebase Auth once user documents are provisioned.
