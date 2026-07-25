import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Map, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Bell, 
  Search, 
  Compass,
  ChevronDown,
  Building2,
  Smartphone,
  MessageSquare,
  Menu,
  X,
  Database,
  ClipboardCheck
} from 'lucide-react';
import { authService } from '../services/authService';
import { dbService } from '../services/dbService';
import type { UserProfile, SystemNotification, Panchayath } from '../types';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(authService.getCurrentUser());
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largerText, setLargerText] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  
  // Multi-tenancy states
  const [panchayaths, setPanchayaths] = useState<Panchayath[]>([]);
  const [, setActivePanchayatName] = useState('Loading Panchayat...');
  const activePanchayatCode = localStorage.getItem('cp_active_panchayat_code') || '204902';

  useEffect(() => {
    // Listen for auth changes
    const unsubscribeAuth = authService.subscribeToAuthChanges((user) => {
      setCurrentUser(user);
    });

    // Listen for notification changes
    const unsubscribeNotifications = dbService.subscribeToNotifications((notifs) => {
      setNotifications(notifs);
    });

    // Listen to settings/accessibility
    const unsubscribeSettings = dbService.subscribeToSettings((settings) => {
      const isHc = !!settings.highContrast;
      const isLt = !!settings.largerText;
      setHighContrast(isHc);
      setLargerText(isLt);
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('high-contrast', isHc);
        document.documentElement.classList.toggle('larger-text', isLt);
      }
    });

    // Subscribe to Panchayats list and active name
    const unsubscribePanchayaths = dbService.subscribeToPanchayaths((list) => {
      setPanchayaths(list);
      const activeP = list.find(p => p.id === activePanchayatCode);
      if (activeP) {
        setActivePanchayatName(activeP.name);
      } else {
        setActivePanchayatName(`Panchayat (${activePanchayatCode})`);
      }
    });

    // Subscribe to Sync History for dynamic status pill
    const unsubscribeSync = dbService.subscribeToSyncHistory((history) => {
      if (history.length > 0) {
        const latest = history[0];
        setLastSyncTime(new Date(latest.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeNotifications();
      unsubscribeSettings();
      unsubscribePanchayaths();
      unsubscribeSync();
    };
  }, [activePanchayatCode]);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/buildings?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Consolidated Navigation Items (6 core items) per wireframe decisions
  const getNavItems = () => {
    const role = currentUser?.role;

    if (role === 'Panchayat Section Clerk' || role === 'clerk') {
      return [
        { name: t('nav.dashboard'), path: '/', icon: LayoutDashboard },
        { name: `${t('nav.buildings')} / Registry`, path: '/registry', icon: Building2 },
        { name: t('nav.sync'), path: '/sync', icon: Database },
        { name: t('nav.settings'), path: '/settings', icon: Settings },
      ];
    }

    if (role === 'Ward Member' || role === 'ward_member') {
      return [
        { name: t('nav.survey'), path: '/survey', icon: Smartphone },
        { name: `${t('nav.ward_reports')}`, path: '/report?tab=ward', icon: ClipboardCheck },
        { name: t('nav.settings'), path: '/settings', icon: Settings },
      ];
    }

    // Consolidated 6 Items for Secretary & Administrators
    return [
      { name: t('nav.dashboard'), path: '/', icon: LayoutDashboard },
      { name: t('nav.map'), path: '/map', icon: Map },
      { name: t('nav.communication'), path: '/communication', icon: MessageSquare },
      { name: 'Registry', path: '/registry', icon: Building2 },
      { name: 'Report', path: '/report', icon: BarChart3 },
      { name: t('nav.settings'), path: '/settings', icon: Settings },
    ];
  };

  const navItems = getNavItems();

  const getUserInitials = () => {
    if (!currentUser) return 'SK';
    const names = currentUser.name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return currentUser.name.substring(0, 2).toUpperCase();
  };

  return (
    <div className={`min-h-screen flex flex-col ${highContrast ? 'high-contrast' : 'bg-slate-50 text-slate-800'} ${largerText ? 'larger-text' : ''} font-sans`}>
      
      {/* Accessible Skip to Content Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-[#0F6E4F] focus:text-white focus:p-2.5 focus:rounded-lg font-bold text-xs shadow-xl outline-none"
      >
        Skip to main content
      </a>

      {/* ==================== WHITE HEADER ==================== */}
      <header className="bg-white border-b border-slate-100 px-4 md:px-6 py-3 flex justify-between items-center z-30 shadow-sm no-print select-none">
        
        {/* Left Side: Mobile Hamburger + Brand Logo and Search Bar */}
        <div className="flex items-center space-x-3 md:space-x-8">
          
          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation drawer"
            className="p-2 text-slate-600 hover:text-slate-900 md:hidden rounded-lg hover:bg-slate-100 transition"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Brand Mark Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <svg viewBox="0 0 20 25" className="w-5 h-6 text-[#0F6E4F]" fill="currentColor" aria-hidden="true">
              <path d="M10 12.5C10.6875 12.5 11.276 12.2552 11.7656 11.7656C12.2552 11.276 12.5 10.6875 12.5 10C12.5 9.3125 12.2552 8.72396 11.7656 8.23438C11.276 7.74479 10.6875 7.5 10 7.5C9.3125 7.5 8.72396 7.74479 8.23438 8.23438C7.74479 8.72396 7.5 9.3125 7.5 10C7.5 10.6875 7.74479 11.276 8.23438 11.7656C8.72396 12.2552 9.3125 12.5 10 12.5ZM10 25C6.64583 22.1458 4.14062 19.4948 2.48438 17.0469C0.828125 14.599 0 12.3333 0 10.25C0 7.125 1.00521 4.63542 3.01562 2.78125C5.02604 0.927083 7.35417 0 10 0C12.6458 0 14.974 0.927083 16.9844 2.78125C18.9948 4.63542 20 7.125 20 10.25C20 12.3333 19.1719 14.599 17.5156 17.0469C15.8594 19.4948 13.3542 22.1458 10 25Z" />
            </svg>
            <span className="font-extrabold text-lg text-[#0F6E4F] tracking-wide">LSG Track</span>
          </Link>

          {/* Functional Header Search Bar */}
          {location.pathname !== '/map' && (
            <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
              <input
                type="text"
                placeholder={t('common.search')}
                value={searchQuery}
                aria-label={t('common.search')}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-slate-200 bg-slate-50/50 rounded-full pl-9 pr-4 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#0F6E4F] focus:ring-1 focus:ring-[#0F6E4F] w-64 transition"
              />
              <button type="submit" aria-label="Perform search" className="absolute left-3.5 top-2.5 text-slate-400 hover:text-slate-600">
                <Search size={13} />
              </button>
            </form>
          )}

        </div>

        {/* Right Side: Status Pill, Language Toggle, Notifications, Help & User Dropdown */}
        <div className="flex items-center space-x-3 md:space-x-4">
          
          {/* Language Switcher Toggle */}
          <div className="flex items-center border border-slate-200 bg-slate-100/80 rounded-full p-0.5 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => {
                i18n.changeLanguage('en');
                localStorage.setItem('cp_language', 'en');
              }}
              className={`px-2.5 py-0.5 rounded-full transition ${i18n.language === 'en' ? 'bg-[#0F6E4F] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => {
                i18n.changeLanguage('ml');
                localStorage.setItem('cp_language', 'ml');
              }}
              className={`px-2.5 py-0.5 rounded-full transition ${i18n.language === 'ml' ? 'bg-[#0F6E4F] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              മലയാളം
            </button>
          </div>

          {/* K-SMART Dynamic Integration Pill with live status binding */}
          <div className="bg-[#EBF7F2] text-[#0F6E4F] px-3 py-1.5 rounded-full text-[11px] font-semibold hidden lg:flex items-center space-x-1.5 shadow-sm border border-emerald-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="tracking-wide">
              {lastSyncTime ? `${t('dashboard.last_sync')} (${lastSyncTime})` : t('sync.heading')}
            </span>
          </div>

          {/* Notifications bell */}
          <button 
            type="button" 
            aria-label="Notifications system"
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
            aria-label="Help and Support guidelines"
            onClick={() => navigate('/settings')}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition"
          >
            <HelpCircle size={18} />
          </button>

          {/* User profile dropdown button */}
          <div className="relative">
            <button
              type="button"
              aria-label="User profile and account settings"
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-full border border-slate-100 transition"
            >
              <div className="w-7 h-7 bg-[#0F6E4F] text-white rounded-full flex items-center justify-center text-[10px] font-extrabold shadow-sm">
                {getUserInitials()}
              </div>
              <div className="text-left text-[11px] leading-tight pr-1 hidden sm:block">
                <span className="block font-bold text-slate-700 capitalize">{currentUser?.name.split(' ')[0] || t('roles.secretary')}</span>
                <span className="text-[9px] text-slate-400 font-medium block leading-none">
                  {currentUser?.role === 'Panchayat Section Clerk' ? t('roles.clerk') : currentUser?.role === 'Ward Member' ? t('roles.ward_member') : currentUser?.role === 'Administrator' ? t('roles.admin') : t('roles.secretary')}
                </span>
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
                  <div className="text-slate-400 text-[9px] mt-0.5 font-bold">
                    LSGD: {currentUser?.panchayathId || activePanchayatCode}
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
        
        {/* Mobile Slide-Out Drawer Navigation Overlay (<768px) */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-slate-900/60 md:hidden flex">
            <div className="w-72 bg-[#EEF2F6] h-full p-4 flex flex-col justify-between shadow-2xl overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center space-x-2">
                    <Compass size={18} className="text-[#0F6E4F]" />
                    <span className="font-bold text-slate-800 text-sm">LSG Mobile Menu</span>
                  </div>
                  <button 
                    type="button" 
                    aria-label="Close menu drawer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 text-slate-500 hover:text-slate-800"
                  >
                    <X size={20} />
                  </button>
                </div>

                <nav className="space-y-1.5">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                          isActive 
                            ? 'bg-[#0F6E4F] text-white shadow-md' 
                            : 'text-slate-700 hover:bg-slate-200/70'
                        }`}
                      >
                        <Icon size={18} className={isActive ? 'text-white' : 'text-slate-500'} />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="border-t border-slate-300 pt-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
            <div className="flex-grow" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Left Desktop Sidebar Navigation */}
        <aside className="w-64 bg-[#EEF2F6] border-r border-slate-200/60 hidden md:flex flex-col no-print shrink-0 p-4 justify-between select-none">
          
          <div className="space-y-6">
            
            {/* Top Gov Metadata branding */}
            <div className="flex flex-col space-y-2.5 px-2">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200">
                  <Compass size={14} className="text-[#0F6E4F]" />
                </div>
                <div className="leading-tight">
                  <div className="text-xs font-extrabold text-slate-800">{i18n.language === 'ml' ? 'എൽ.എസ്.ജി അഡ്മിൻ പോർട്ടൽ' : 'LSG Admin Portal'}</div>
                  <div className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">{i18n.language === 'ml' ? 'കേരള സംസ്ഥാനം' : 'Kerala State'}</div>
                </div>
              </div>

              {/* Tenant context switcher for System Admins */}
              {currentUser?.role === 'Administrator' && panchayaths.length > 0 && (
                <div className="pt-2">
                  <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 pl-1">{i18n.language === 'ml' ? 'പ്രവർത്തന സജ്ജമായ പഞ്ചായത്ത്' : 'Active Tenant'}</label>
                  <select
                    value={activePanchayatCode}
                    onChange={(e) => {
                      localStorage.setItem('cp_active_panchayat_code', e.target.value);
                      window.location.reload(); 
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1 text-[10px] font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0F6E4F]"
                  >
                    {panchayaths.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}
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

          </div>

          {/* Bottom Action buttons */}
          <div className="space-y-1 border-t border-slate-300/40 pt-4">
            
            <button
              onClick={() => navigate('/settings')}
              className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 rounded-xl transition"
            >
              <HelpCircle size={16} className="text-slate-400" />
              <span>Support</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition"
            >
              <LogOut size={16} className="text-red-400" />
              <span>Sign Out</span>
            </button>

          </div>

        </aside>

        {/* Content Area with Accessible ID */}
        <main id="main-content" className="flex-1 min-w-0 bg-slate-50 flex flex-col p-4 md:p-6 overflow-y-auto">
          {children}
        </main>

      </div>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-[#0B3B24] text-emerald-100/70 py-6 border-t border-emerald-950/20 text-center text-xs no-print select-none leading-relaxed">
        <div className="max-w-7xl mx-auto px-6 space-y-1.5">
          <div className="font-semibold text-[11px] tracking-wide">
            LSG-Track — Independent Local-First Licensing Platform for Grama Panchayaths
          </div>
          <div className="text-[10px] text-emerald-200/50">
            Built by students for Panchayat Secretaries & Ward Members. Unofficial tool with zero government affiliation. Developed and piloted with Panangad Grama Panchayat. For support: support@lsgtrack.local
          </div>
        </div>
      </footer>

    </div>
  );
};
