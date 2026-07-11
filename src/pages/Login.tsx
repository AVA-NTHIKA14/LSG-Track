import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  User, 
  HelpCircle, 
  Map, 
  RefreshCw, 
  Bell, 
  Info,
  Compass
} from 'lucide-react';
import { dbService } from '../services/dbService';
import { mockUsers } from '../data/buildingsSeed';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDevNotes, setShowDevNotes] = useState(false);
  
  // Login Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [panchayatCode, setPanchayatCode] = useState('204902');
  const [rememberMe, setRememberMe] = useState(false);

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your official email/username and password.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Allow searching by email prefix (username) or full email
      const user = mockUsers.find(u => 
        u.email.toLowerCase() === email.toLowerCase() ||
        u.email.toLowerCase().split('@')[0] === email.toLowerCase()
      );
      
      if (user) {
        localStorage.setItem('cp_license_active_user', JSON.stringify(user));
        localStorage.setItem('cp_active_panchayat_code', panchayatCode);
        await dbService.addAuditLog('LOGIN', `User logged in using credentials: ${user.email} (Panchayat Code: ${panchayatCode})`);
        navigate('/');
      } else {
        setError('Invalid personnel credentials. Please try again.');
      }
    } catch (err: any) {
      setError('Credentials sign-in failed. Please contact administrator.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* LEFT COLUMN - Brand and Product Features Info */}
      <div className="w-full md:w-[40%] bg-[#0F6E4F] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden select-none">
        
        {/* Background Decorative Rings */}
        <div className="absolute top-[-20%] left-[-20%] w-[90%] h-[90%] rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-white/5 pointer-events-none" />

        {/* Top Header Logo */}
        <div className="flex items-center space-x-2.5 z-10">
          <svg viewBox="0 0 20 25" className="w-6 h-7 text-white" fill="currentColor">
            <path d="M10 12.5C10.6875 12.5 11.276 12.2552 11.7656 11.7656C12.2552 11.276 12.5 10.6875 12.5 10C12.5 9.3125 12.2552 8.72396 11.7656 8.23438C11.276 7.74479 10.6875 7.5 10 7.5C9.3125 7.5 8.72396 7.74479 8.23438 8.23438C7.74479 8.72396 7.5 9.3125 7.5 10C7.5 10.6875 7.74479 11.276 8.23438 11.7656C8.72396 12.2552 9.3125 12.5 10 12.5ZM10 25C6.64583 22.1458 4.14062 19.4948 2.48438 17.0469C0.828125 14.599 0 12.3333 0 10.25C0 7.125 1.00521 4.63542 3.01562 2.78125C5.02604 0.927083 7.35417 0 10 0C12.6458 0 14.974 0.927083 16.9844 2.78125C18.9948 4.63542 20 7.125 20 10.25C20 12.3333 19.1719 14.599 17.5156 17.0469C15.8594 19.4948 13.3542 22.1458 10 25Z" />
          </svg>
          <span className="font-extrabold text-xl tracking-wider">LSG Track</span>
        </div>

        {/* Center Copy and Feature Bullet List */}
        <div className="my-auto py-12 md:py-0 z-10 space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
              Trade License Compliance Portal
            </h1>
            <p className="text-sm text-emerald-100/90 leading-relaxed font-normal">
              A GIS-enabled platform for monitoring licensed and unlicensed commercial establishments across Kerala Grama Panchayats.
            </p>
          </div>

          {/* Features checkmarks list */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-8 h-8 rounded-full border border-emerald-300 flex items-center justify-center shrink-0">
                <Map size={15} />
              </div>
              <span className="text-sm font-semibold tracking-wide">GIS-Based Business Monitoring</span>
            </div>

            <div className="flex items-center space-x-3.5">
              <div className="w-8 h-8 rounded-full border border-emerald-300 flex items-center justify-center shrink-0">
                <RefreshCw size={15} />
              </div>
              <span className="text-sm font-semibold tracking-wide">K-SMART Integrated</span>
            </div>

            <div className="flex items-center space-x-3.5">
              <div className="w-8 h-8 rounded-full border border-emerald-300 flex items-center justify-center shrink-0">
                <Bell size={15} />
              </div>
              <span className="text-sm font-semibold tracking-wide">Automated Renewal Notifications</span>
            </div>
          </div>
        </div>

        {/* Bottom Gov Department label */}
        <div className="z-10 text-[10px] uppercase font-bold tracking-widest text-emerald-200/80 leading-normal">
          Government of Kerala<br />
          Local Self Government Department
        </div>

      </div>

      {/* RIGHT COLUMN - Welcome back Sign in Card */}
      <div className="w-full md:w-[60%] bg-white p-8 md:p-12 flex flex-col justify-between relative overflow-y-auto">
        
        {/* Warning Banner */}
        <div className="bg-red-50 border border-red-100 text-red-800 rounded-2xl p-4 text-[11px] flex items-start space-x-2.5 max-w-xl mx-auto w-full mb-6">
          <ShieldAlert size={16} className="text-red-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold block text-red-700">RESTRICTED ADMINISTRATIVE CHANNEL</span>
            This portal is restricted to authorized officers of Kerala Grama Panchayats. Unauthorised access attempts are logged and punishable under the Information Technology Act 2000.
          </div>
        </div>

        {/* Sign In Core Card */}
        <div className="max-w-md w-full mx-auto my-auto py-4 space-y-6">
          
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Welcome Back</h2>
            <p className="text-xs text-slate-400 font-medium">Sign in to continue to your dashboard</p>
          </div>

          {error && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 text-xs leading-normal">
              {error}
            </div>
          )}

          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
            
            {/* Username/Email Input */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Official Email / Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. panchayat_official_01"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-[#0F6E4F] focus:ring-1 focus:ring-[#0F6E4F] transition"
                />
                <User size={15} className="absolute right-3.5 top-3.5 text-slate-400" />
              </div>
            </div>

            {/* Panchayat Code Input */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Panchayat Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. 204902"
                  value={panchayatCode}
                  onChange={(e) => setPanchayatCode(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-[#0F6E4F] focus:ring-1 focus:ring-[#0F6E4F] transition"
                />
                <Compass size={15} className="absolute right-3.5 top-3.5 text-[#0F6E4F]" />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Password
                </label>
                <a href="#" className="text-[10px] font-bold text-[#0F6E4F] hover:underline transition">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-[#0F6E4F] focus:ring-1 focus:ring-[#0F6E4F] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center space-x-2 select-none">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#0F6E4F] focus:ring-[#0F6E4F] border-slate-300"
              />
              <label htmlFor="remember" className="text-xs text-slate-500 font-medium cursor-pointer">
                Remember Me
              </label>
            </div>

            {/* Submit Sign In */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F6E4F] hover:bg-[#0B5A3E] text-white rounded-xl py-2.5 text-xs font-semibold uppercase tracking-wider transition shadow-sm"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-3 text-slate-300 text-[9px] uppercase font-bold tracking-widest">support & help</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            {/* Support outline button */}
            <button
              type="button"
              className="w-full border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl py-2.5 text-xs font-semibold transition flex items-center justify-center space-x-2"
            >
              <HelpCircle size={15} />
              <span>Help & Support</span>
            </button>

          </form>

          {/* Dev credentials helper button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowDevNotes(!showDevNotes)}
              className="text-[10px] font-bold text-slate-400 hover:text-slate-500 uppercase tracking-widest flex items-center space-x-1 focus:outline-none"
            >
              <span>{showDevNotes ? 'Hide Mock Accounts' : 'Show Mock Accounts'}</span>
              <Info size={11} />
            </button>
            
            {showDevNotes && (
              <div className="mt-2.5 bg-slate-50 border border-slate-200 rounded-xl p-3 text-[10px] text-slate-500 space-y-1 font-mono leading-normal">
                <div><strong>Secretary</strong>: <code>mini.secretary</code> (or email)</div>
                <div><strong>DEO (Staff)</strong>: <code>sajesh.deo</code></div>
                <div><strong>VEO (Surveyor)</strong>: <code>suresh.surveyor</code></div>
                <div><strong>Ward Member</strong>: <code>thomas.ward1</code></div>
                <div className="text-slate-400 italic mt-1 font-sans">Use any password to sign in to these profiles.</div>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Branding net connection secure */}
        <div className="w-full max-w-xl mx-auto flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 mt-6 select-none font-medium">
          <div>Powered by LSG Track</div>
          <div className="font-mono">Version 1.0.0</div>
        </div>

      </div>

    </div>
  );
};
