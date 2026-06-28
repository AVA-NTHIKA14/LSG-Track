🏛️ LSGD Chakkittapara Panchayat GIS License Compliance Portal
An enterprise e-governance spatial monitoring dashboard and licensing workflow built for Chakkittapara Grama Panchayat, Kerala. The system manages trade license compliance audits, field surveys, and registry updates using role-based access control and integrated GIS mapping.

👥 Stakeholders & Role-Based Access Control (RBAC)
Every official accesses a unique interface tailored specifically to their administrative responsibilities:

1. 🥇 Panchayat Secretary (Executive Authority)
Scope: Overall monitoring, dashboard tracking, GIS Map analytics, ward statistics, reports, and administrative setups.
Actions: Verify field surveys, approve/reject license files, return files to data entry operators for correction, track revenue, and issue notices/reminders.
2. 🗳️ Ward Member (Report Unlicensed)
Scope: Restricted strictly to their assigned ward. Hides all global dashboards and maps.
Actions: Input-only interface to report unlicensed commercial activity in their ward. Submitted reports automatically file as unlicensed building drafts in the verification queue.
3. 📝 Panchayat Staff (Data Entry Operator)
Scope: A dedicated office entry portal. Hides maps and global statistics.
Actions: Register existing commercial units, manage attachments (tax deeds, NOCs, photos), save local drafts, and submit records to the Secretary's queue for license issuance (submitting locks the record to read-only).
4. 🥾 VEO (Village Extension Officer)
Scope: Onsite field inspector survey terminal. Hides global analytics.
Actions: View assigned inspection targets, log GPS coordinates, add inspect descriptions/remarks, cache local drafts offline, and submit reports to the Secretary.
🔑 Authentication & Firestore Profile Sync
Google Authentication: Authenticates securely using Firebase Auth.
Firestore Synchronization: On first login, a user profile is automatically generated inside Firestore (defaulting to Secretary role). If the Google account's email matches pre-seeded personnel, it inherits their specific role and ward scope permissions.
Credentials Fallback (Development): You can type any mock email in the standard email/password fields with any password to load respective stakeholder interfaces.
🛠️ Tech Stack & Architecture
Core: React, Vite 8, TypeScript, Tailwind CSS
Mapping: Leaflet GIS Maps (OpenStreetMap tiles, custom Kerala Grama Panchayat geoJSON boundaries, measurement calipers)
Database: Firebase Firestore, Storage, and Authentication (with integrated offline-caching fallback)
State & Forms: React Hook Form, Zod validation schemas, Recharts area and bar charts
🚀 Running the Project
1. Install Dependencies
bash

npm install
2. Run Development Server
bash

npm run dev
Open http://localhost:5173/ in your web browser.

3. Build for Production (Zero-Warning Code Splitting)
bash

npm run build
This splits large dependency files (maps, charts, icons, db drivers) into optimized, cached chunks under 500 kB:

vendor-charts: Recharts
vendor-maps: Leaflet
vendor-icons: Lucide Icons
vendor-db: Firebase Firestore / Auth drivers
🧪 Developer Demo Accounts
Use these official emails on the login screen to simulate different views:

Panchayat Secretary: mini.secretary@kerala.gov.in
Panchayat Staff (DEO): sajesh.deo@kerala.gov.in
Ward Member: thomas.ward1@kerala.gov.in
VEO (Village Extension Officer): suresh.surveyor@kerala.gov.in
Administrator: balan.administrator@kerala.gov.in
