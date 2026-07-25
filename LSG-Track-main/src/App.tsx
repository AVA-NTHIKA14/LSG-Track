import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { authService } from './services/authService';
import { Welcome } from './pages/Welcome';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { MapPage } from './pages/MapPage';
import { Buildings } from './pages/Buildings';
import { Wards } from './pages/Wards';
import { Survey } from './pages/Survey';
import { Licenses } from './pages/Licenses';
import { Renewals } from './pages/Renewals';
import { Reports } from './pages/Reports';
import { Notifications } from './pages/Notifications';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { Administration } from './pages/Administration';
import { CommunicationHub } from './pages/CommunicationHub';
import { WardReports } from './pages/WardReports';
import { DataSync } from './pages/DataSync';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
  requiredPermission?: string;
  authReady: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole, requiredPermission, authReady }) => {
  const currentUser = authService.getCurrentUser();

  if (!authReady) {
    return <div className="min-h-screen bg-slate-50" aria-label="Checking authentication" />;
  }
  
  if (!currentUser) {
    // If no active user, redirect to login
    return <Navigate to="/login" replace />;
  }

  // System Administrator bypasses specific role/permission checks
  if (currentUser.role !== 'Administrator') {
    if (requiredRole) {
      const allowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      if (!allowed.includes(currentUser.role)) {
        return <Navigate to="/" replace />;
      }
    }

    if (requiredPermission && !authService.hasPermission(requiredPermission)) {
      return <Navigate to="/" replace />;
    }
  }

  return <MainLayout>{children}</MainLayout>;
};

function App() {
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = authService.subscribeToAuthChanges(() => setAuthReady(true));
    return unsubscribe;
  }, []);

  return (
    <Router>
      <Routes>
        
        {/* Public Onboarding & Login Screen */}
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard & e-Governance workflows */}
        <Route path="/" element={<ProtectedRoute authReady={authReady}><Dashboard /></ProtectedRoute>} />
        <Route path="/map" element={<ProtectedRoute authReady={authReady}><MapPage /></ProtectedRoute>} />
        <Route path="/buildings" element={<ProtectedRoute authReady={authReady}><Buildings /></ProtectedRoute>} />
        <Route path="/wards" element={<ProtectedRoute authReady={authReady}><Wards /></ProtectedRoute>} />
        <Route path="/survey" element={<ProtectedRoute authReady={authReady} requiredRole={['Panchayat Section Clerk', 'Ward Member', 'Administrator']}><Survey /></ProtectedRoute>} />
        <Route path="/licenses" element={<ProtectedRoute authReady={authReady} requiredRole={['Panchayat Section Clerk', 'Secretary', 'Administrator']}><Licenses /></ProtectedRoute>} />
        <Route path="/renewals" element={<ProtectedRoute authReady={authReady} requiredRole={['Secretary', 'Administrator']}><Renewals /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute authReady={authReady} requiredRole={['Secretary', 'Administrator']}><Reports /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute authReady={authReady}><Notifications /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute authReady={authReady}><Settings /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute authReady={authReady}><Profile /></ProtectedRoute>} />
        <Route path="/administration" element={<ProtectedRoute authReady={authReady} requiredRole="Administrator"><Administration /></ProtectedRoute>} />
        <Route path="/communication" element={<ProtectedRoute authReady={authReady} requiredRole={['Secretary', 'Administrator']}><CommunicationHub /></ProtectedRoute>} />
        <Route path="/ward-reports" element={<ProtectedRoute authReady={authReady} requiredRole={['Secretary', 'Administrator']}><WardReports /></ProtectedRoute>} />
        <Route path="/sync" element={<ProtectedRoute authReady={authReady} requiredRole={['Panchayat Section Clerk', 'Administrator']}><DataSync /></ProtectedRoute>} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
