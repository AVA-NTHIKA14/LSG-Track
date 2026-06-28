# 🏛️ LSG Track - GIS License Compliance Portal

An enterprise-grade e-Governance platform for monitoring trade license compliance using GIS mapping, role-based access control, and digital field inspection workflows. The system enables Chakkittapara Grama Panchayat officials to identify licensed and unlicensed commercial establishments, conduct inspections, manage licensing workflows, and monitor revenue through an integrated spatial dashboard.

---

## ✨ Key Features

* 🗺️ Interactive GIS map with geotagged commercial establishments
* 🔐 Role-Based Access Control (RBAC)
* 📍 GPS-enabled field inspection and survey management
* 📄 Digital license application and verification workflow
* 📊 Real-time analytics and revenue dashboard
* 📱 Offline field data collection with synchronization
* 📂 Document and image attachment support
* 🔔 Automated reminders and compliance monitoring

---

# 👥 User Roles

## 🥇 Panchayat Secretary

The Secretary acts as the primary administrator and monitoring authority.

### Responsibilities

* Monitor overall licensing status
* View GIS compliance dashboard
* Review ward-wise statistics
* Approve or reject license applications
* Return applications for correction
* Verify field inspection reports
* Generate reports and notices
* Monitor revenue collection
* Configure administrative settings

---

## 🗳️ Ward Member

Ward Members are restricted to their assigned ward.

### Responsibilities

* Report unlicensed commercial establishments
* Submit new commercial activity reports
* View submitted reports
* Track report status

Submitted reports automatically enter the verification queue for Secretary approval.

---

## 📝 Panchayat Staff (Data Entry Operator)

Provides office-based data entry functionality.

### Responsibilities

* Register commercial establishments
* Upload tax receipts and supporting documents
* Attach photographs
* Save draft records
* Submit applications for approval

Once submitted, records become read-only until reviewed by the Secretary.

---

## 🥾Panchayath section Clerk

Designed for onsite inspections and surveys.

### Responsibilities

* View assigned inspection tasks
* Capture GPS coordinates
* Upload inspection photographs
* Record field observations
* Save offline drafts
* Submit inspection reports

---

# 🔐 Authentication

## Google Authentication

Users can securely sign in using Firebase Authentication.

## Firestore Profile Synchronization

On first login:

* User profile is automatically created
* Role is assigned from preconfigured personnel records
* Ward permissions are automatically applied

## Development Login

For development purposes, any password can be used with the demo email accounts below.

---

# 🛠️ Technology Stack

| Category       | Technology                |
| -------------- | ------------------------- |
| Frontend       | React + Vite + TypeScript |
| Styling        | Tailwind CSS              |
| Mapping        | Leaflet + OpenStreetMap   |
| Database       | Firebase Firestore        |
| Storage        | Firebase Storage          |
| Authentication | Firebase Authentication   |
| Forms          | React Hook Form           |
| Validation     | Zod                       |
| Charts         | Recharts                  |

---

# 🚀 Getting Started

## Install Dependencies

```bash
npm install
```

## Start Development Server

```bash
npm run dev
```

Open:

```
http://localhost:5173
```

---

## Production Build

```bash
npm run build
```

The production build automatically performs code splitting for improved performance.

Optimized bundles include:

* vendor-maps (Leaflet)
* vendor-db (Firebase)
* vendor-icons (Lucide)
* vendor-charts (Recharts)

---

# 🧪 Demo Accounts

| Role                      | Email                                                                         |
| ------------------------- | ----------------------------------------------------------------------------- |
| Panchayat Secretary       | [mini.secretary@kerala.gov.in](mailto:mini.secretary@kerala.gov.in)           |
| Panchayat Staff (DEO)     | [sajesh.deo@kerala.gov.in](mailto:sajesh.deo@kerala.gov.in)                   |
| Ward Member               | [thomas.ward1@kerala.gov.in](mailto:thomas.ward1@kerala.gov.in)               |
| Village Extension Officer | [suresh.surveyor@kerala.gov.in](mailto:suresh.surveyor@kerala.gov.in)         |
| Administrator             | [balan.administrator@kerala.gov.in](mailto:balan.administrator@kerala.gov.in) |

Use any password while running in development mode.

---

# 📌 Project Objectives

* Digitize trade license management
* Improve identification of unlicensed establishments
* Enable GIS-based monitoring
* Reduce manual paperwork
* Improve transparency and accountability
* Increase Panchayat revenue through compliance monitoring
* Support efficient field inspections

---

# 📄 License

This project was developed as an enterprise e-Governance solution for **Chakkittapara Grama Panchayat, Kerala**, demonstrating modern GIS-based municipal license compliance monitoring using React, Firebase, and Leaflet.
