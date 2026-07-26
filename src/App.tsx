import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { authService } from './services/authService';
import { Welcome } from './pages/Welcome';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { MapPage } from './pages/MapPage';
import { Wards } from './pages/Wards';
import { Survey } from './pages/Survey';
import { Renewals } from './pages/Renewals';
import { Notifications } from './pages/Notifications';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { Administration } from './pages/Administration';
import { CommunicationHub } from './pages/CommunicationHub';
import { DataSync } from './pages/DataSync';
import { Registry } from './pages/Registry';
import { Report } from './pages/Report';
import { canAccessPath, roleHome } from './services/roleAccess';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const RoleRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const currentUser = authService.getCurrentUser();
  if (!currentUser) return <Navigate to="/login" replace />;
  const path = window.location.pathname;
  if (!canAccessPath(currentUser.role, path)) return <Navigate to={roleHome(currentUser.role)} replace />;
  return <MainLayout>{children}</MainLayout>;
};

function App() {
  return (
    <Router>
      <Routes>
        
        {/* Public Onboarding & Login Screen */}
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard & e-Governance workflows */}
        <Route path="/" element={<RoleRoute><Dashboard /></RoleRoute>} />
        <Route path="/map" element={<RoleRoute><MapPage /></RoleRoute>} />
        <Route path="/registry" element={<RoleRoute><Registry /></RoleRoute>} />
        <Route path="/report" element={<RoleRoute><Report /></RoleRoute>} />
        
        {/* Transparent Redirects for Merged Routes */}
        <Route path="/buildings" element={<Navigate to="/registry?tab=establishments" replace />} />
        <Route path="/licenses" element={<Navigate to="/registry?tab=licenses" replace />} />
        <Route path="/reports" element={<Navigate to="/report?tab=executive" replace />} />
        <Route path="/ward-reports" element={<Navigate to="/report?tab=ward" replace />} />

        <Route path="/wards" element={<RoleRoute><Wards /></RoleRoute>} />
        <Route path="/survey" element={<RoleRoute><Survey /></RoleRoute>} />
        <Route path="/renewals" element={<RoleRoute><Renewals /></RoleRoute>} />
        <Route path="/notifications" element={<RoleRoute><Notifications /></RoleRoute>} />
        <Route path="/settings" element={<RoleRoute><Settings /></RoleRoute>} />
        <Route path="/profile" element={<RoleRoute><Profile /></RoleRoute>} />
        <Route path="/administration" element={<RoleRoute><Administration /></RoleRoute>} />
        <Route path="/communication" element={<RoleRoute><CommunicationHub /></RoleRoute>} />
        <Route path="/sync" element={<RoleRoute><DataSync /></RoleRoute>} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
