import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { authService } from './services/authService';

// Pages
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

// Route guards
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const currentUser = authService.getCurrentUser();
  
  if (!currentUser) {
    // If no active user session, redirect to login
    return <Navigate to="/login" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

function App() {
  return (
    <Router>
      <Routes>
        
        {/* Public Login Screen */}
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard / Map layout */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
        <Route path="/buildings" element={<ProtectedRoute><Buildings /></ProtectedRoute>} />
        <Route path="/wards" element={<ProtectedRoute><Wards /></ProtectedRoute>} />
        <Route path="/survey" element={<ProtectedRoute><Survey /></ProtectedRoute>} />
        <Route path="/licenses" element={<ProtectedRoute><Licenses /></ProtectedRoute>} />
        <Route path="/renewals" element={<ProtectedRoute><Renewals /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
