# LSG Track — GIS Trade License Monitoring & Decision Support Platform

> **Secretary-Centric Operational Intelligence Platform for Kerala Local Self Government Institutions**

LSG Track is a GIS-powered **Decision Support System (DSS)** designed for Kerala Local Self Government Institutions (Grama Panchayats).

It visualizes trade license compliance, streamlines field verifications, monitors statutory renewals, and provides Panchayat Secretaries with spatial intelligence to improve administrative decision-making.

> [!IMPORTANT]
> **LSG Track is NOT an ERP and DOES NOT replace K-SMART.**  
> K-SMART remains the official Government ERP for license approvals, fee collection, permits, and official records.  
> LSG Track synchronizes data from K-SMART to provide spatial intelligence, inspection prioritization, and ward-level compliance tracking.

---

# Architecture

```text
               K-SMART (Official ERP)
       Single Source of Truth for Licenses & Permits
                         │
                         ▼
             DEO CSV / Excel Import
       Schema Validation & Synchronization
                         │
                         ▼
         LSG Track Decision Support System
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
 Secretary Dashboard    GIS Map     Reports & Analytics
```

---

# Data Flow

```text
K-SMART
   │
   ▼
CSV / Excel Export
   │
   ▼
Schema Validation
   │
   ▼
Duplicate Detection
   │
   ▼
Firebase Firestore
   │
   ▼
GIS Visualization
   │
   ▼
Secretary Dashboard
   │
   ▼
Administrative Decision Making
```

---

# User Roles

## Panchayat Secretary

The primary stakeholder who uses LSG Track as a decision-support platform.

### Dashboard

- Operational overview
- Priority action cards
- Ward compliance ranking
- Revenue leakage summary
- Pending verifications
- Inspection statistics

### GIS Workspace

- Interactive GIS map
- Building information drawer
- Spatial filtering
- Layer controls
- Direct links to K-SMART records

### Verification Workspace

- Review field reports
- Verify suspected unlicensed establishments
- Approve or reject submissions
- Compare reports with K-SMART records

### Renewal Management

- WhatsApp renewal reminders
- Expiring license monitoring
- Delivery tracking

### Reports

- PDF export
- CSV export
- Compliance reports
- Ward reports

### Settings

- Officer profile
- Accessibility preferences
- K-SMART synchronization status
- Support information

---

## Data Entry Operator (DEO)

Responsible for importing and synchronizing official K-SMART exports.

### Responsibilities

- Import CSV and Excel files
- Validate file schema
- Detect duplicate records
- Execute synchronization
- Review synchronization history
- Resolve import issues

---

## Ward Member / Field Inspector

Responsible for reporting suspected unlicensed establishments.

### Responsibilities

- Submit field reports
- Capture GPS coordinates
- Upload building photographs
- Add inspection notes
- Track report status

---

# GIS Layers

| Layer | Description |
|--------|-------------|
| Licensed | Active licensed establishments |
| Expired | Expired trade licenses |
| Expiring Soon | Licenses nearing expiry |
| Unlicensed | Suspected unlicensed establishments |
| Ward Reports | Field inspection submissions |
| Risk Score | Compliance priority visualization |
| Ward Boundaries | Panchayat administrative boundaries |
| Heatmap | Business density visualization |

---

# Core Modules

## Secretary Dashboard

A centralized operational workspace that enables Secretaries to understand the Panchayat's compliance status at a glance.

### Features

- KPI summary cards
- Compliance overview
- Revenue leakage estimation
- Inspection priorities
- Recent activities
- Ward ranking
- Quick navigation

---

## GIS Map View

Interactive spatial workspace powered by Leaflet and OpenStreetMap.

### Features

- Layer controls
- Building profiles
- Ward boundaries
- Heatmaps
- Risk visualization
- Search and filtering

---

## K-SMART Synchronization

Synchronize official K-SMART trade license exports.

### Features

- CSV import
- Excel import
- Schema validation
- Duplicate detection
- Import logs
- Synchronization history

---

## Field Verification

Verification workflow for Secretary review.

### Features

- Geotagged reports
- Photograph verification
- Status management
- Approval workflow
- Administrative remarks

---

## Renewal Notification System

Automated statutory renewal reminders.

### Features

- WhatsApp reminders
- Delivery tracking
- Reminder history
- Renewal status

---

## Reports Engine

Generate official administrative reports.

### Export Formats

- PDF
- CSV

### Reports

- Compliance Report
- Ward Report
- Inspection Summary
- Renewal Status Report
- Revenue Analysis

---

# Security

- Firebase Authentication
- Role-Based Access Control (RBAC)
- Protected Routes
- Audit Trail Logging
- CSV Schema Validation
- Secure Firestore Rules
- Session Management

---

# Accessibility

Designed following WCAG 2.1 AA/AAA accessibility principles.

### Features

- High Contrast Mode
- Larger Text (125%)
- Keyboard Navigation
- Skip Navigation Links
- Screen Reader Support
- Visible Focus Indicators

---

# Audit Trail

Every important administrative action is recorded.

Tracked activities include:

- User authentication
- Data synchronization
- Report downloads
- Field verification
- Profile updates
- Administrative actions

---

# Data Privacy

- Official trade license information originates from K-SMART exports.
- LSG Track does not modify official government records.
- Synchronization activities are logged for accountability.
- Administrative actions are fully traceable through audit logs.

---

# Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS + CSS Design Tokens |
| GIS | Leaflet + OpenStreetMap + GeoJSON |
| Database | Firebase Firestore |
| Authentication | Firebase Authentication |
| File Storage | Firebase Storage |
| CSV Parsing | PapaParse |
| Excel Parsing | XLSX |

---

# Project Structure

```text
src/
├── assets/
├── components/
├── pages/
├── layouts/
├── hooks/
├── services/
├── firebase/
├── auth/
├── context/
├── map/
├── styles/
├── types/
├── utils/
└── main.tsx
```

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

## Configure Environment

Create a `.env.local` file:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Start Development Server

```bash
npm run dev
```

Open:

```
http://localhost:5173
```

## Production Build

```bash
npm run build
```

---

# Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Panchayat Secretary | `secretary@lsgtrack.gov.in` | Any Password |
| Data Entry Operator | `clerk@lsgtrack.gov.in` | Any Password |
| Ward Member | `ward@lsgtrack.gov.in` | Any Password |
| Administrator | `admin@lsgtrack.gov.in` | Any Password |

---

# Current Limitations

- K-SMART integration currently relies on CSV/Excel imports.
- WhatsApp notifications are demonstrated using a simulated service.
- Offline inspection capabilities are planned.
- Native mobile application is under development.

---

# Roadmap

## Completed

- Secretary Dashboard
- GIS Monitoring
- K-SMART CSV Synchronization
- Accessibility Improvements
- Audit Trail
- Role-Based Access Control

## Planned

- Direct K-SMART API Integration
- AI-Based Inspection Prioritization
- Mobile Field Inspection Application
- Digital Signature Integration
- Offline Inspection Support
- Advanced Analytics Dashboard

---

# Design Principles

- Secretary-first workflow
- GIS-first navigation
- Low cognitive load
- Government-friendly interface
- Accessibility by default
- Fast operational decision-making

---

# Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push your branch.
5. Submit a Pull Request.

---

# License

This project is licensed under the **MIT License**.

---

# Project Status

**Version:** 2.0.0

**Status:** Production Prototype

LSG Track is being developed as a GIS-based Decision Support System for Kerala Local Self Government Institutions.

---

# Maintainers

- **Avanthika K S**
- **Sredha Manoj**

> **LSG Track follows a "Decision Support, Not Data Ownership" philosophy. Official government records remain within K-SMART, while LSG Track provides spatial intelligence, compliance monitoring, inspection prioritization, and operational insights that enable Panchayat Secretaries to make informed administrative decisions.**
