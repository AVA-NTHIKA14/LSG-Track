# LSG Track — GIS Trade License Monitoring & Decision Support Platform

> **Secretary-Centric Operational Intelligence Platform for Kerala Local Self Government Institutions**

LSG Track is a GIS-powered **Decision Support System (DSS)** built for Kerala Grama Panchayats. It visualizes trade license compliance, streamlines field verification, tracks statutory renewals, and gives Panchayat Secretaries spatial intelligence to prioritize inspections and follow-ups.

It is a real, working React + Firebase application — installable as a PWA, multi-tenant (one deployment can serve many Panchayats), bilingual (English/Malayalam), and it runs in a fully functional **local demo mode** even without a Firebase project configured.

> [!IMPORTANT]
> **LSG Track is NOT an ERP and DOES NOT replace K-SMART.**
> K-SMART remains the official Government ERP for license approvals, fee collection, permits, and statutory records.
> LSG Track imports/synchronizes exports from K-SMART to provide spatial intelligence, inspection prioritization, and ward-level compliance tracking on top of that official data.

---

# What Actually Works Today

This section reflects the current codebase (verified by installing dependencies, running the test suite, and producing a production build), not just the intended design.

**Working:**

- Firebase Authentication sign-up/sign-in, with role selection, per-Panchayat jurisdiction matching, and password reset.
- Route-level Role-Based Access Control for four roles (Administrator, Secretary, Field Officer, Ward Member).
- Interactive Leaflet GIS map with authentic Kerala LSG boundary data, ward choropleths, heatmaps, and a direct link to the official K-SMART Ward Map.
- K-SMART CSV/Excel import with heuristic column mapping, duplicate detection, and sync history.
- WhatsApp renewal reminders via real `wa.me` deep links (opens WhatsApp with a pre-filled message in English or Malayalam).
- PDF/print and CSV export for compliance and ward reports.
- English/Malayalam UI via i18next, with a build-time linter that flags hardcoded strings still needing translation.
- Guided onboarding tour and downloadable one-page PDF user guides per role.
- Installable PWA (offline app shell) via `vite-plugin-pwa`.
- Unit tests (Vitest) and `oxlint` pass; production build succeeds.

**Known gaps:**

- New user registrations sit as `PENDING` until a Secretary/Administrator manually approves them — there's currently no in-app "Approve" button; this is done by editing the user's Firestore document directly (see [Bootstrapping the first account](#bootstrapping-the-first-account)).
- WhatsApp sending is a manual, one-tap deep link, not an automated/scheduled notification service.
- Malayalam coverage is incomplete — the i18n safeguard script currently flags ~269 hardcoded strings still needing translation keys.

---

# Architecture

```text
               K-SMART (Official ERP)
       Single Source of Truth for Licenses & Permits
                         │
                         ▼
             DEO/Field Officer CSV / Excel Import
        (SheetJS parsing, column heuristics, dedup)
                         │
                         ▼
   ┌─────────────────────────────────────────────┐
   │           LSG Track Decision Support         │
   │                                               │
   │  Firebase enabled?                            │
   │   ├─ Yes → Firestore (real-time, per-tenant   │
   │   │        collections under /panchayaths/…)  │
   │   └─ No  → Browser localStorage demo dataset   │
   │            (per-Panchayat, works offline,      │
   │             zero setup required)               │
   └─────────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
 Secretary Dashboard    GIS Map     Reports & Analytics
```

## How data storage actually works

LSG Track is designed to run **with or without a configured Firebase project**:

- If `VITE_FIREBASE_*` environment variables are present, real-time data (buildings, licenses, wards, surveys, sync history, WhatsApp logs, audit logs) is read and written to **Firebase Firestore**, scoped per tenant under `panchayaths/{panchayathId}/…`, with live `onSnapshot` listeners.
- If Firebase isn't configured (or a Firestore read comes back empty/fails), the same screens transparently fall back to a **per-Panchayat partition of the browser's `localStorage`**, seeded with two demonstration Panchayats (see below). This is what makes it possible to clone the repo and try the full workflow in minutes without setting up a backend.
- **User accounts always require Firebase Authentication** — the local-storage fallback only applies to operational data, not login.

This hybrid design is convenient for evaluation and offline demos, but it also means: without Firebase configured, data does not sync across devices or browsers, and is not shared between users.

---

# Getting Started

## Clone the Repository

```bash
git clone https://github.com/AVA-NTHIKA14/LSG-Track.git
cd LSG-Track
```

## Install Dependencies

```bash
npm install
```

## Run Without Any Configuration (Local Demo Mode)

You can start the app immediately with no `.env` file at all. Every screen will run against the local, per-Panchayat demo dataset (Chakkittapara and Panangad Grama Panchayats are pre-seeded with real ward boundaries).

```bash
npm run dev
```

Open `http://localhost:5173`. Note that in this mode there is no real authentication — Firebase Auth calls will throw a "Firebase Authentication is not configured" error, so sign-in/sign-up screens require Firebase to be enabled (see next section). Everything else (map, registry, reports, sync, communication hub) works against the demo data.

## Configure Firebase (Required for Sign-In and Multi-User Sync)

Create a Firebase project with **Authentication** (Email/Password), **Firestore**, and **Storage** enabled, then create a `.env.local` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Deploy the included security rules to your project:

```bash
firebase deploy --only firestore:rules,storage:rules
```

## Bootstrapping the First Account

Sign-up is self-service, but every new account starts with `status: 'PENDING'` and cannot sign in until a Secretary or Administrator approves it. There is currently no in-app approval screen for this, so to create your **first** working account:

1. Register through the app's "Sign Up" form (choose Secretary, Field Officer, or Ward Member).
2. Open the Firestore console for your project, find the new document under `users/{uid}`, and change `status` from `PENDING` to `APPROVED` (and set `active: true`).
3. Sign in normally from then on. That account (if Secretary/Administrator) can be used to manage further accounts once an in-app approval workflow is added — see [Roadmap](#roadmap).

## Start Development Server

```bash
npm run dev
```

## Run Tests

```bash
npm test
```

## Lint (includes the i18n hardcoded-string safeguard)

```bash
npm run lint
```

## Production Build

```bash
npm run build
```

This runs `tsc -b`, the i18n safeguard check (non-blocking — it warns but does not fail the build), and `vite build`.

---

# User Roles & Access Control

Access is enforced both in navigation and at the route level (`src/services/roleAccess.ts`), so a role can't reach a screen it isn't permitted to use even by typing the URL directly.

| Role | Sign-up self-service? | Route access |
|---|---|---|
| **Administrator** | No (assigned manually) | Full access to every route (`*`) |
| **Secretary** | Yes | Dashboard, GIS Map, Registry, Reports, Renewals, Notifications, Settings, Profile |
| **Field Officer** *(formerly "Panchayat Section Clerk" / DEO — legacy accounts still work)* | Yes | Dashboard, Registry, K-SMART Sync, Settings, Profile |
| **Ward Member** | Yes | Dashboard (redirects to Survey), Field Survey, Settings, Profile |

At sign-in, the user selects the role they're signing in as; if it doesn't match the approved role on their account, the app blocks the sign-in and signs them out.

---

# Pages & Routes

Several legacy standalone pages were consolidated into tabbed views; old links still work via redirect.

| Route | Page | Notes |
|---|---|---|
| `/welcome` | Onboarding / marketing landing | Public |
| `/login` | Sign in / sign up | Public, includes district → Panchayat picker (941 official Kerala LSGD codes) |
| `/` | Dashboard | KPI cards, compliance overview, priority actions |
| `/map` | GIS Map | Leaflet map, layers, building drawer |
| `/registry` | Establishment & License Registry | Tabs: `establishments`, `licenses` (renders `Buildings.tsx` + `Licenses.tsx`) |
| `/report` | Reports | Tabs: `executive`, `ward` (renders `Reports.tsx` + `WardReports.tsx`) |
| `/wards` | Ward directory | Ward-level compliance list |
| `/survey` | Field Survey | Ward Member submission + status tracking |
| `/renewals` | Renewal Management | Expiring license queue, WhatsApp reminders |
| `/notifications` | System notifications | |
| `/settings` | Settings | Accessibility, language, sync status, support info |
| `/profile` | Officer profile | |
| `/administration` | Administration | Local staff/PIN directory, JSON export/import |
| `/communication` | Communication Hub | WhatsApp message composer + delivery log |
| `/sync` | K-SMART Data Sync | CSV/Excel import (Field Officer / Administrator only) |
| `/buildings`, `/licenses` | — | Redirect to `/registry?tab=…` |
| `/reports`, `/ward-reports` | — | Redirect to `/report?tab=…` |

---

# Core Modules

## Secretary Dashboard
Operational overview with KPI summary cards, revenue leakage estimation, ward compliance ranking, pending verifications, and recent activity.

## GIS Map View
Built on Leaflet + OpenStreetMap, loaded with an authentic Kerala LSG boundary dataset (`public/data/kerala_lsg_boundaries.json`, ~1,000 official boundary features) plus panchayat-specific ward GeoJSON. Includes:
- Status pins: Licensed (green), Unlicensed (red), Expired/Expiring (orange)
- Ward boundary choropleth
- Heatmap layers: unlicensed density, inspection density, business density, renewal-due density
- A direct **K-SMART Ward Map** button linking out to the official `wardmap.ksmart.live` boundary viewer for the selected district/Panchayat

## Establishment & License Registry
Consolidated registry combining establishment records and license records into one tabbed workspace, with search and filtering.

## K-SMART Data Synchronization
CSV/Excel import restricted to Field Officer and Administrator accounts. Parsing is done client-side with **SheetJS (`xlsx`)**, which reads both `.csv`/`.txt` and `.xlsx`/`.xls`. Column mapping is heuristic (matches header names like "application", "establishment", "ward", "validity to", etc., with sensible defaults if a column isn't found), records are deduplicated by application number, and every import is logged to a sync history list.

## Field Verification / Survey
Ward Members submit geotagged reports with photos and notes; Secretaries review, approve, or reject them against the registry.

## Renewal Management & Communication Hub
Tracks expiring licenses and sends renewal reminders as pre-filled **WhatsApp `wa.me` links** (English or Malayalam template), which the officer taps to actually send from their own WhatsApp. Every send attempt is logged.

## Reports Engine
- **Executive report**: compliance and revenue analytics.
- **Ward report**: Ward Member field-inspection log.
- Export via the browser print dialog (Save as PDF) and CSV download.

## Administration
Secretary/Administrator-only screen for managing a local staff directory (name, role, 4-digit PIN), plus JSON export/import of the active Panchayat's dataset.

## Multi-Tenancy
A single deployment can serve multiple Grama Panchayats. Two are pre-seeded for demonstration — **Chakkittapara** (Kozhikode district, 13 wards) and **Panangad** (Kozhikode district, 20 wards) — each with its own branding colors, ward boundaries, and feature flags. Any of the 941 official Kerala Panchayats can be selected at login; unseeded ones start with an empty, auto-generated ward list.

## Localization
English and Malayalam via `i18next`/`react-i18next`, toggle persisted in `localStorage`. A custom Node script (`scripts/check-i18n.js`) scans all `.tsx` files at build time and warns about hardcoded JSX text that bypasses the translation function — useful for tracking down remaining untranslated strings.

## Onboarding & User Guides
A first-run guided tour (restartable from Settings) plus ready-made, downloadable one-page PDF guides for Secretary, Field Officer, and Ward Member roles (generated via `scripts/generate-user-guides.py` using ReportLab).

## Accessibility
- High-contrast mode and larger text (both toggles are audit-logged)
- Keyboard navigation and visible focus states
- `aria-label`s on interactive controls

## Progressive Web App
Configured via `vite-plugin-pwa` (auto-update service worker, web app manifest, offline app-shell precache) — installable to a home screen or desktop.

---

# GIS Layers

| Layer | Description |
|--------|-------------|
| Licensed | Green pins — active licensed establishments |
| Unlicensed | Red pins — suspected/confirmed unlicensed establishments |
| Expired / Expiring | Orange pins — licenses expired or nearing expiry |
| Ward Boundary Choropleth | Panchayat ward polygons colored by compliance |
| Unlicensed Density | Heatmap of unlicensed hotspots |
| Inspection Density | Heatmap of pending field inspections |
| Business Density | Heatmap of overall establishment density |
| Renewal-Due Density | Heatmap of licenses approaching expiry |

---

# Security

- Firebase Authentication for identity
- Firestore security rules (`firestore.rules`) enforcing per-tenant access and Secretary/Administrator-only writes to shared config
- Storage rules (`storage.rules`) for uploaded files
- Client-side upload validation: JPEG/PNG/WEBP/PDF only, 10 MB limit (`src/services/uploadValidation.ts`)
- Route-level RBAC in addition to navigation-level hiding
- Audit log entries for authentication, settings changes, sync events, and administrative actions

---

# Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 19 + Vite 8 + TypeScript |
| Routing | React Router v6 |
| Styling | Tailwind CSS |
| GIS | Leaflet + OpenStreetMap + GeoJSON |
| Forms/validation | React Hook Form + Zod |
| Localization | i18next / react-i18next (English, Malayalam) |
| Database | Firebase Firestore (with local-storage fallback demo mode) |
| Authentication | Firebase Authentication |
| File Storage | Firebase Storage |
| CSV/Excel Parsing | SheetJS (`xlsx`) |
| Charts | Recharts |
| Icons | lucide-react |
| PWA | vite-plugin-pwa |
| Testing | Vitest |
| Linting | oxlint + custom i18n safeguard script |

---

# Project Structure

```text
src/
├── App.tsx                # Routes + role-gated route wrapper
├── main.tsx
├── i18n.ts                # i18next setup
├── assets/
├── components/            # BrandMark, OnboardingTour, UserGuideModal
├── context/                # AuthContext (Firebase auth + Firestore profile listener)
├── data/                   # keralaPanchayaths.ts (941 official LSGD codes)
├── fixtures/                # seedTenants.ts (Chakkittapara & Panangad demo data)
├── layouts/                # MainLayout.tsx (role-aware navigation)
├── locales/                 # en.json, ml.json
├── pages/                   # Route-level screens
├── services/                 # authService, dbService, boundaryService, tenantService,
│                             # storageService, whatsappService, roleAccess, portalRoles,
│                             # uploadValidation, firebaseConfig
├── styles/
└── types/

scripts/
├── check-i18n.js             # Build-time hardcoded-string linter
├── generate-user-guides.py   # Generates public/user-guides/*.pdf
└── dev-seed/                 # buildingsSeed.ts

public/
├── data/                      # kerala_lsg_boundaries.json + panchayat ward GeoJSON
└── user-guides/                # Pre-generated PDF guides
```

---

# Current Limitations

- New account registrations require manual Firestore approval — there is no in-app approve/reject screen yet.
- WhatsApp reminders are manual `wa.me` deep links, not an automated/scheduled messaging service or official WhatsApp Business API integration.
- Without a configured Firebase project, data is local to the browser (no cross-device or multi-user sync).
- Malayalam translation coverage is incomplete (~269 flagged strings as of this writing); dynamic, citizen-entered data such as business names is intentionally left as-entered.
- Offline-first field data capture (beyond the PWA app-shell cache) is not yet implemented.
- K-SMART integration is import-based (CSV/Excel), not a live API sync.

---

# Roadmap

## Completed
- Secretary Dashboard, GIS monitoring, K-SMART CSV/Excel sync
- Role-based access control across navigation and routes
- Multi-tenant foundation (Panchayat picker, tenant branding, seeded demo tenants)
- English/Malayalam localization framework
- Accessibility improvements, audit trail, PWA packaging

## Planned
- In-app Secretary approval workflow for pending registrations
- Direct K-SMART API integration (replacing file import)
- Automated/scheduled renewal notifications
- Offline-capable field inspection data capture
- Complete Malayalam translation coverage
- Digital signature integration for approvals

---

# Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Run `npm test` and `npm run lint` before committing.
4. Commit your changes and push your branch.
5. Submit a Pull Request.

---

# License

This project is licensed under the **MIT License**.

---

# Maintainers

- **Avanthika K S**
- **Sredha Manoj**

> **LSG Track follows a "Decision Support, Not Data Ownership" philosophy. Official government records remain within K-SMART, while LSG Track provides spatial intelligence, compliance monitoring, inspection prioritization, and operational insights that enable Panchayat Secretaries to make informed administrative decisions.**
