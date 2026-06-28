import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Map, Building2, Layers, ClipboardCheck, 
  FileCheck, RefreshCw, FileText, Bell, Settings, User, 
  LogOut, Shield, ChevronDown 
} from 'lucide-react';
import { authService } from '../services/authService';
import { dbService } from '../services/dbService';
import type { UserProfile, SystemNotification } from '../types';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(authService.getCurrentUser());
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    // Listen for auth changes
    const unsubscribeAuth = authService.subscribeToAuthChanges((user) => {
      setCurrentUser(user);
    });

    // Listen for notification changes
    const unsubscribeNotifications = dbService.subscribeToNotifications((notifs) => {
      setNotifications(notifs);
    });

    // Listen to settings/high-contrast
    const unsubscribeSettings = dbService.subscribeToSettings((settings) => {
      setHighContrast(settings.highContrast);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeNotifications();
      unsubscribeSettings();
    };
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNavItems = () => {
    const role = currentUser?.role || 'Read Only Viewer';
    switch (role) {
      case 'Administrator':
        return [
          { name: 'Dashboard', path: '/', icon: LayoutDashboard },
          { name: 'GIS Monitor Map', path: '/map', icon: Map },
          { name: 'Building Registry', path: '/buildings', icon: Building2 },
          { name: 'Ward Management', path: '/wards', icon: Layers },
          { name: 'Survey Monitoring', path: '/survey', icon: ClipboardCheck },
          { name: 'License Management', path: '/licenses', icon: FileCheck },
          { name: 'Renewals & Reminders', path: '/renewals', icon: RefreshCw },
          { name: 'Reports', path: '/reports', icon: FileText },
          { name: 'Notifications', path: '/notifications', icon: Bell, badgeCount: unreadCount },
          { name: 'System Settings', path: '/settings', icon: Settings },
          { name: 'Profile', path: '/profile', icon: User },
        ];
      case 'Secretary':
        return [
          { name: 'Dashboard', path: '/', icon: LayoutDashboard },
          { name: 'GIS Monitor Map', path: '/map', icon: Map },
          { name: 'License Verification', path: '/licenses', icon: FileCheck },
          { name: 'Renewals & Reminders', path: '/renewals', icon: RefreshCw },
          { name: 'Reports', path: '/reports', icon: FileText },
          { name: 'Notifications', path: '/notifications', icon: Bell, badgeCount: unreadCount },
          { name: 'Profile', path: '/profile', icon: User },
        ];
      case 'Ward Member':
        return [
          { name: 'Report Unlicensed', path: '/survey', icon: ClipboardCheck },
          { name: 'Notifications', path: '/notifications', icon: Bell, badgeCount: unreadCount },
          { name: 'Profile', path: '/profile', icon: User },
        ];
      case 'VEO':
        return [
          { name: 'VEO Survey Tasks', path: '/survey', icon: ClipboardCheck },
          { name: 'Notifications', path: '/notifications', icon: Bell, badgeCount: unreadCount },
          { name: 'Profile', path: '/profile', icon: User },
        ];
      case 'Data Entry Operator':
        return [
          { name: 'Data Entry Portal', path: '/buildings', icon: Building2 },
          { name: 'Profile', path: '/profile', icon: User },
        ];
      default: // Guest
        return [
          { name: 'Profile', path: '/profile', icon: User },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className={`min-h-screen flex flex-col ${highContrast ? 'high-contrast' : 'bg-gov-light text-gov-text'}`}>
      
      {/* Top Banner/Header */}
      <header className="bg-gov-navy text-white shadow-md border-b-4 border-gov-green no-print">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex justify-between items-center flex-wrap gap-3">
          
          {/* Government Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-gov-green-light">
              {/* Symbolic government emblem representation */}
              <span className="font-bold text-gov-green text-sm">LSGD</span>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-slate-300">Government of Kerala</div>
              <h1 className="text-lg font-bold leading-tight">Chakkittapara Grama Panchayat</h1>
              <div className="text-[10px] text-slate-400 font-mono">LSG Track Compliance Monitor</div>
            </div>
          </div>

          {/* User Profile & Role Switcher */}
          <div className="flex items-center space-x-4">
            
            {currentUser ? (
              <div className="relative">
                <button 
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="flex items-center space-x-2 bg-gov-navy-light hover:bg-slate-700 px-3 py-1.5 rounded text-xs font-medium border border-slate-700 transition"
                >
                  <Shield size={14} className="text-gov-green-light" />
                  <div className="text-left leading-none">
                    <span className="block font-bold">{currentUser.name}</span>
                    <span className="text-[10px] text-slate-300">{currentUser.role}</span>
                  </div>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {showRoleMenu && (
                  <div className="absolute right-0 mt-1 w-56 bg-white text-slate-800 rounded shadow-xl border border-slate-200 z-50 py-1">
                    <div className="px-3 py-2 border-b border-slate-100 text-xs">
                      <div className="font-bold text-slate-900">{currentUser.name}</div>
                      <div className="text-slate-500 text-[10px] truncate">{currentUser.email}</div>
                      <div className="text-slate-400 text-[10px] mt-0.5 font-semibold">
                        Role: {currentUser.role} {currentUser.ward ? `(Ward ${currentUser.ward})` : ''}
                      </div>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center space-x-2 font-medium"
                    >
                      <LogOut size={12} />
                      <span>Sign Out Session</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login"
                className="bg-gov-green hover:bg-gov-green-light px-4 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition"
              >
                Officer Portal Login
              </Link>
            )}

            <div className="text-[10px] text-slate-400 hidden sm:block text-right">
              <div>Financial Year: 2026-27</div>
              <div>System Date: 2026-06-28</div>
            </div>

          </div>

        </div>
      </header>

      {/* Main Core Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto relative">
        
        {/* Left Navigation Sidebar */}
        <aside className="w-64 bg-white border-r border-gov-border hidden md:flex flex-col no-print shrink-0">
          <nav className="p-3 space-y-1 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2.5 rounded text-xs font-medium transition ${
                    isActive 
                      ? 'bg-gov-green text-white shadow-sm' 
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                    <span>{item.name}</span>
                  </div>
                  {item.badgeCount && item.badgeCount > 0 ? (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white text-gov-green' : 'bg-red-600 text-white'
                    }`}>
                      {item.badgeCount}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
          
          <div className="p-3 border-t border-gov-border text-[10px] text-slate-400 font-mono">
            Logged as: {currentUser?.role || 'Guest'}<br />
            IP: 10.12.84.102 (LSGD Net)
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 bg-slate-50 flex flex-col p-4 md:p-6 overflow-y-auto">
          {children}
        </main>

      </div>

      {/* Official Government Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t-2 border-slate-800 text-center text-xs no-print">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div>
            © 2026 Chakkittapara Grama Panchayat, Kozhikode, Kerala. All Rights Reserved.
          </div>
          <div className="text-[10px] text-slate-500">
            Maintained by LSGD Information Kerala Mission (IKM). Software version 1.0.4.
            For support: helpdesk.lsgd@kerala.gov.in | Phone: 0496 266 2235
          </div>
        </div>
      </footer>

    </div>
  );
};
