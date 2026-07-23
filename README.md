# LSG Track — GIS Trade License Monitoring & Decision Support Platform
> **Kerala Local Self Governments (LSGs) Operational Intelligence System**
LSG Track is a Secretary-centric, GIS-powered **Decision Support and License Compliance Monitoring System** designed for Kerala Local Self Government Institutions (Grama Panchayats).
> [!IMPORTANT]  
> **LSG Track is NOT an ERP and DOES NOT replace K-SMART.**  
> **K-SMART** remains the single official Government ERP for license approvals, fee collection, permits, and official records. LSG Track visualizes synchronized K-SMART trade license data to empower Panchayat Secretaries with spatial intelligence, inspection prioritization, and ward-level compliance tracking.
---
## Architecture & Data Flow
```
                K-SMART (Official ERP)
       Single Source of Truth for Licenses & Permits
                         │
                         ▼
                   [ DEO File Import ]
        Automatic CSV/Excel Validation & Sync
                         │
                         ▼
                    LSG Track
    Decision Support + GIS Monitoring Platform
       (Designed for Panchayat Secretary)
```
---
## Stakeholder Workflows & User Roles
### 1. Panchayat Secretary (Primary Stakeholder)
The Panchayat Secretary relies on LSG Track as a 30-second operational command center to monitor compliance and make administrative decisions.
- **30-Second Operational Dashboard**: Top priority action tasks, single-action KPI summary cards, and ward compliance ranking.
- **Map View Workspace**: Interactive GIS map with 8 spatial layers, building profile drawers, and direct links to official K-SMART records.
- **Field Reports Verification Workspace**: Inspects and verifies geotagged unlicensed business reports submitted by Ward Members against K-SMART data.
- **Renewal Alerts**: Dispatches direct WhatsApp statutory renewal reminders to expired and expiring business owners.
- **Official Reports Engine**: Compiles and exports PDF / CSV compliance reports for administrative review.
- **Profile & Settings**: Simplified non-technical administrative preferences (Officer Profile, High Contrast Mode, Larger Text, K-SMART Sync Status, Support).
### 2. Data Entry Operator (DEO / Panchayat Section Clerk)
- **K-SMART Synchronization Terminal**: Downloads official K-SMART trade license export files (CSV/Excel), runs schema validation, detects duplicates, and executes batch synchronization.
### 3. Ward Member / Field Inspector
- **Unlicensed Establishment Field Reporting**: Geotags suspected unlicensed commercial units with GPS coordinates, building photographs, and field notes for Secretary review.
---
## Key Features & Modules
- **GIS Map View**: Leaflet-powered GIS workspace with 8 spatial layers (Licensed, Expired, Expiring Soon, Unlicensed, Ward Reports, Risk Score, Ward Boundaries, Heatmaps).
- **K-SMART Integration Pipeline**: Automatic CSV/Excel file parser, schema validator, duplicate detector, and sync audit logger.
- **WhatsApp Renewal Reminders**: Direct statutory notice dispatch with delivery tracking (Sent, Delivered, Read, Failed).
- **WCAG 2.1 AAA Accessibility**: Integrated High Contrast Mode (#0F172A), Larger Text Scaling (125%), ON/OFF indicators, and screen reader skip links.
- **Audit Trail Register**: Comprehensive security log tracking officer sign-ins, data imports, verifications, and report downloads.
---
## Technology Stack
|
 Component 
|
 Technology 
|
|
:---
|
:---
|
|
**
Frontend Framework
**
|
 React 18 + Vite + TypeScript 
|
|
**
Styling
**
|
 Vanilla CSS Design Tokens + Tailwind CSS 
|
|
**
GIS Mapping
**
|
 Leaflet + OpenStreetMap + GeoJSON 
|
|
**
Data Engine
**
|
 Firebase Firestore (Realtime) + LocalStorage Fallback 
|
|
**
Auth
**
|
 Firebase Authentication + Portal Role Verification 
|
|
**
Data Parsing
**
|
 XLSX / PapaParse CSV Engine 
|
---
## Getting Started
### 1. Clone & Install Dependencies
```bash
git clone https://github.com/AVA-NTHIKA14/LSG-Track.git
cd LSG-Track
npm install
```
### 2. Configure Environment (Optional Firebase)
Create `.env` or `.env.local`:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```
*(If Firebase keys are omitted, the application runs automatically in local mock mode)*.
### 3. Run Development Server
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.
### 4. Build for Production
```bash
npm run build
```
---
## Quick Test Accounts
|
 Role 
|
 Email 
|
 Password 
|
 Primary Feature Access 
|
|
:---
|
:---
|
:---
|
:---
|
|
**
Panchayat Secretary
**
|
`secretary@lsgtrack.gov.in`
|
*
(any)
*
|
 Dashboard, Map View, Ward Reports, Renewal Alerts 
|
|
**
Data Entry Operator (DEO)
**
|
`clerk@lsgtrack.gov.in`
|
*
(any)
*
|
 K-SMART CSV/Excel Synchronization Terminal 
|
|
**
Ward Member
**
|
`ward@lsgtrack.gov.in`
|
*
(any)
*
|
 Field Reporting Terminal 
|
|
**
System Administrator
**
|
`admin@lsgtrack.gov.in`
|
*
(any)
*
|
 System Tenant Administration 
|
---
## Governance & Maintenance
Maintained for Local Self Government Department (LSGD), Kerala. Software version **2.0.0 (Production)**.
