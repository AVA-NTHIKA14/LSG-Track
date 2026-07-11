import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  ShieldCheck, 
  BarChart3, 
  Settings, 
  Plus, 
  HelpCircle, 
  LogOut, 
  Bell, 
  Search, 
  Compass,
  ChevronDown
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
  const [searchQuery, setSearchQuery] = useState('');

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

  // Navigation Items mapped to match the sidebar in screenshot (using clean Lucide icons)
  const getNavItems = () => {
    // Default standard links for Secretary/Admin, adapted to match the design screenshot
    return [
      { name: 'Dashboard', path: '/', icon: LayoutDashboard },
      { name: 'Map View', path: '/map', icon: Map },
      { name: 'Compliance', path: '/survey', icon: ShieldCheck },
      { name: 'Analytics', path: '/reports', icon: BarChart3 },
      { name: 'Settings', path: '/settings', icon: Settings },
    ];
  };

  const navItems = getNavItems();

  // Get User Initials (e.g. "SK" for Sajesh Kumar, or "SK" for Secretary Kerala)
  const getUserInitials = () => {
    if (!currentUser) return 'SK';
    const names = currentUser.name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return currentUser.name.substring(0, 2).toUpperCase();
  };

  return (
    <div className={`min-h-screen flex flex-col ${highContrast ? 'high-contrast' : 'bg-slate-50 text-slate-800'} font-sans`}>
      
      {/* ==================== WHITE HEADER ==================== */}
      <header className="bg-white border-b border-slate-100 px-6 py-3 flex justify-between items-center z-30 shadow-sm no-print select-none">
        
        {/* Left Side: Brand Logo and Search Bar */}
        <div className="flex items-center space-x-8">
          
          {/* Brand Mark Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <svg viewBox="0 0 20 25" className="w-5 h-6 text-[#0F6E4F]" fill="currentColor">
              <path d="M10 12.5C10.6875 12.5 11.276 12.2552 11.7656 11.7656C12.2552 11.276 12.5 10.6875 12.5 10C12.5 9.3125 12.2552 8.72396 11.7656 8.23438C11.276 7.74479 10.6875 7.5 10 7.5C9.3125 7.5 8.72396 7.74479 8.23438 8.23438C7.74479 8.72396 7.5 9.3125 7.5 10C7.5 10.6875 7.74479 11.276 8.23438 11.7656C8.72396 12.2552 9.3125 12.5 10 12.5ZM10 25C6.64583 22.1458 4.14062 19.4948 2.48438 17.0469C0.828125 14.599 0 12.3333 0 10.25C0 7.125 1.00521 4.63542 3.01562 2.78125C5.02604 0.927083 7.35417 0 10 0C12.6458 0 14.974 0.927083 16.9844 2.78125C18.9948 4.63542 20 7.125 20 10.25C20 12.3333 19.1719 14.599 17.5156 17.0469C15.8594 19.4948 13.3542 22.1458 10 25Z" />
            </svg>
            <span className="font-extrabold text-lg text-[#0F6E4F] tracking-wide">LSG Track</span>
          </Link>

          {/* Header Search Mockup */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search businesses, wards or files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-slate-200 bg-slate-50/50 rounded-full pl-9 pr-4 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#0F6E4F] focus:ring-1 focus:ring-[#0F6E4F] w-64 transition"
            />
            <Search size={13} className="absolute left-3.5 top-2.5 text-slate-400" />
          </div>

        </div>

        {/* Right Side: Status Pill, Notifications, Help & User Dropdown */}
        <div className="flex items-center space-x-5">
          
          {/* K-SMART Active Pill */}
          <div className="bg-[#EBF7F2] text-[#0F6E4F] px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 shadow-sm border border-emerald-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="tracking-wide">K-SMART Active</span>
          </div>

          {/* Notifications bell */}
          <button 
            type="button" 
            onClick={() => navigate('/notifications')}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition relative"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {/* Help circle */}
          <button 
            type="button" 
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition"
          >
            <HelpCircle size={18} />
          </button>

          {/* User profile with initials dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-full border border-slate-100 transition"
            >
              {/* Initials circle */}
              <div className="w-7 h-7 bg-[#0F6E4F] text-white rounded-full flex items-center justify-center text-[10px] font-extrabold shadow-sm">
                {getUserInitials()}
              </div>
              <div className="text-left text-[11px] leading-tight pr-1 hidden sm:block">
                <span className="block font-bold text-slate-700 capitalize">{currentUser?.name.split(' ')[0] || 'Secretary'}</span>
                <span className="text-[9px] text-slate-400 font-medium block leading-none">{currentUser?.role || 'Secretary'}</span>
              </div>
              <ChevronDown size={12} className="text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-100 z-50 py-1.5 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-100 text-xs">
                  <div className="font-bold text-slate-900">{currentUser?.name || 'Administrator'}</div>
                  <div className="text-slate-400 text-[10px] truncate">{currentUser?.email}</div>
                  <div className="text-slate-400 text-[9px] mt-1 font-bold">
                    Role: {currentUser?.role} {currentUser?.ward ? `(Ward ${currentUser.ward})` : ''}
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 flex items-center space-x-2 font-semibold transition"
                >
                  <LogOut size={13} />
                  <span>Sign Out Session</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </header>

      {/* ==================== CORE CONTAINER ==================== */}
      <div className="flex-grow flex relative">
        
        {/* Left Navigation Sidebar (Light Lavender-Grey) */}
        <aside className="w-64 bg-[#EEF2F6] border-r border-slate-200/60 hidden md:flex flex-col no-print shrink-0 p-4 justify-between select-none">
          
          <div className="space-y-6">
            
            {/* Top Gov Metadata branding */}
            <div className="flex items-center space-x-3 px-2">
              <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200">
                <Compass size={14} className="text-[#0F6E4F]" />
              </div>
              <div className="leading-tight">
                <div className="text-xs font-extrabold text-slate-800">LSG Admin</div>
                <div className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Kerala State</div>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 ${
                      isActive 
                        ? 'bg-[#0F6E4F] text-white shadow-md shadow-emerald-950/10' 
                        : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* + New Entry Button */}
            <div className="px-1.5 pt-2">
              <button
                type="button"
                onClick={() => navigate('/buildings')}
                className="w-full bg-[#0F6E4F] hover:bg-[#0B5A3E] text-white rounded-xl py-3 px-4 flex items-center justify-center space-x-2 font-bold text-xs transition shadow-md shadow-emerald-900/10"
              >
                <Plus size={16} />
                <span>New Entry</span>
              </button>
            </div>

          </div>

          {/* Bottom Action buttons */}
          <div className="space-y-1 border-t border-slate-300/40 pt-4">
            
            {/* Support link */}
            <button
              onClick={() => navigate('/settings')}
              className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 rounded-xl transition"
            >
              <HelpCircle size={16} className="text-slate-400" />
              <span>Support</span>
            </button>

            {/* Logout link */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition"
            >
              <LogOut size={16} className="text-red-400" />
              <span>Sign Out</span>
            </button>

          </div>

        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 bg-slate-50 flex flex-col p-4 md:p-6 overflow-y-auto">
          {children}
        </main>

      </div>

      {/* ==================== DARK GREEN FOOTER ==================== */}
      <footer className="bg-[#0B3B24] text-emerald-100/70 py-6 border-t border-emerald-950/20 text-center text-xs no-print select-none leading-relaxed">
        <div className="max-w-7xl mx-auto px-6 space-y-1.5">
          <div className="font-semibold text-[11px] tracking-wide">
            © 2026 Chakkittapara Grama Panchayat, Kozhikode, Kerala. All Rights Reserved.
          </div>
          <div className="text-[10px] text-emerald-200/50">
            Maintained by LSGD Information Kerala Mission (IKM). Software version 1.0.4. For support: helpdesk.lsgd@kerala.gov.in | Phone: 0496 286 2235
          </div>
        </div>
      </footer>

    </div>
  );
};
