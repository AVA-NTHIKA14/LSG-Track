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

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const currentUser = authService.getCurrentUser();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
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
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
        <Route path="/registry" element={<ProtectedRoute><Registry /></ProtectedRoute>} />
        <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
        
        {/* Transparent Redirects for Merged Routes */}
        <Route path="/buildings" element={<Navigate to="/registry?tab=establishments" replace />} />
        <Route path="/licenses" element={<Navigate to="/registry?tab=licenses" replace />} />
        <Route path="/reports" element={<Navigate to="/report?tab=executive" replace />} />
        <Route path="/ward-reports" element={<Navigate to="/report?tab=ward" replace />} />

        <Route path="/wards" element={<ProtectedRoute><Wards /></ProtectedRoute>} />
        <Route path="/survey" element={<ProtectedRoute><Survey /></ProtectedRoute>} />
        <Route path="/renewals" element={<ProtectedRoute><Renewals /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/administration" element={<ProtectedRoute><Administration /></ProtectedRoute>} />
        <Route path="/communication" element={<ProtectedRoute><CommunicationHub /></ProtectedRoute>} />
        <Route path="/sync" element={<ProtectedRoute><DataSync /></ProtectedRoute>} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
