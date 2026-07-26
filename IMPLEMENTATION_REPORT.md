# LSG Track - Improvement Report

## Purpose

LSG Track is a Kerala Grama Panchayat workspace for trade-licence monitoring, field surveys, GIS-based establishment review, K-SMART import, reports, and local administrative follow-up.

## Access model

The portal now applies role access at both navigation and route level.

| Role | Workspace scope |
| --- | --- |
| Administrator | Full portal access; administration and configuration owner |
| Secretary | Dashboard, GIS, registry, reports, renewals, notifications, settings, profile |
| Field Officer | Dashboard, GIS, registry, K-SMART synchronisation, settings, profile |
| Ward Member | Dashboard landing, field survey, settings, profile |

At sign-in, a user selects Secretary, Field Officer, or Ward Member. The selected role must match the approved role on the user profile. Administrator is intentionally not offered as a self-registration option. Existing `Panchayat Section Clerk` records continue as Field Officer accounts for backwards compatibility.

## User-experience improvements

- Uses the existing Lucide icon library for consistent, recognisable interface icons.
- First-entry guided tour remains available and can be restarted from Settings.
- Added ready-made one-page PDF guides for Secretary, Field Officer, and Ward Member.
- Guide modal now opens the actual downloadable PDF for the selected stakeholder.

## Language status

Malayalam language resources exist in `src/locales/ml.json` and the language control persists the chosen language. The codebase also contains a large set of legacy hard-coded labels (the build safeguard currently identifies 269 candidates). These need a structured follow-up localisation pass before Malayalam can be claimed as complete for every screen; dynamic data such as citizen-entered business names should remain as entered.

## Quality verification

- TypeScript build and production Vite build: passed.
- Unit tests: 4/4 passed.
- Generated PDFs: verified as readable one-page PDFs.
- Local development server: HTTP 200 at `http://127.0.0.1:5173`.

## Files changed for the requested work

- `src/services/roleAccess.ts` - central role normalisation and path permission checks.
- `src/App.tsx` - server-side-style route protection within the client router.
- `src/pages/Login.tsx` - sign-in role selection and mismatch prevention.
- `src/layouts/MainLayout.tsx` - role-aware navigation.
- `src/services/portalRoles.ts`, `src/services/authService.ts`, `src/types/index.ts` - Field Officer support with legacy compatibility.
- `public/user-guides/*.pdf` - stakeholder documents.
- `src/components/UserGuideModal.tsx` - direct PDF access.
- `src/pages/Reports.tsx` - repaired a malformed report-view source fragment that blocked compilation.
