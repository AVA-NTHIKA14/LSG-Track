import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Building2, 
  Compass,
  User as UserIcon,
  CheckCircle2, 
  ArrowRight,
  HardDrive,
  RefreshCw,
  MapPin,
  KeyRound,
  Mail,
  UserPlus,
  LogIn,
  Eye,
  EyeOff
} from 'lucide-react';




import { authService } from '../services/authService';
import { dbService } from '../services/dbService';

import type { UserRole } from '../types';
import { 
  KERALA_DISTRICTS, 
  getPanchayathsByDistrict, 
  getPanchayathByCode,
  type PanchayathOption 
} from '../data/keralaPanchayaths';

export const Login: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Onboarding / Selection state
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Kozhikode');
  const [panchayathList, setPanchayathList] = useState<PanchayathOption[]>([]);
  const [selectedPanchayathCode, setSelectedPanchayathCode] = useState<string>('G110706'); // Default Panangad
  const [manualMode, setManualMode] = useState<boolean>(false);
  const [manualCodeInput, setManualCodeInput] = useState<string>('');

  // Mode: 'signin' or 'signup'
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Authentication Form State
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('');
  const [role, setRole] = useState<UserRole>('Panchayat Section Clerk');
  const [loginRole, setLoginRole] = useState<UserRole>('Administrator');
  const [wardNumber, setWardNumber] = useState<string>('1');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);


  // Active Resolved Panchayath Meta
  const [resolvedPanchayath, setResolvedPanchayath] = useState<PanchayathOption>({
    code: 'G110706',
    name: 'Panangad Grama Panchayat',
    nameMl: 'പനങ്ങാട് ഗ്രാമപഞ്ചായത്ത്',
    district: 'Kozhikode'
  });

  // Step state: 'picker' or 'login'
  const [step, setStep] = useState<'picker' | 'login'>('picker');

  // Load Panchayaths in official SEC Kerala Local Body order
  useEffect(() => {
    const list = getPanchayathsByDistrict(selectedDistrict);
    setPanchayathList(list);
    if (list.length > 0) {
      if (!list.find(p => p.code === selectedPanchayathCode)) {
        setSelectedPanchayathCode(list[0].code);
        setResolvedPanchayath(list[0]);
      }
    }
  }, [selectedDistrict]);

  // Check if a Panchayath is already saved in LocalStorage (BUG 3 Fix: ignore 'all' or invalid codes)
  useEffect(() => {
    const savedCode = localStorage.getItem('cp_active_panchayat_code');
    if (savedCode && savedCode !== 'all') {
      const match = getPanchayathByCode(savedCode);
      if (match) {
        setResolvedPanchayath(match);
        setSelectedPanchayathCode(match.code);
        setSelectedDistrict(match.district);
        setStep('login');
      } else {
        // Unresolvable code: purge and force user to picker screen
        localStorage.removeItem('cp_active_panchayat_code');
        setStep('picker');
      }
    } else {
      // Missing or 'all' sentinel code: purge and force user to picker screen
      localStorage.removeItem('cp_active_panchayat_code');
      setStep('picker');
    }
  }, []);

  const handleConfirmPanchayath = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetMessage(null);

    let targetCode = selectedPanchayathCode;
    if (manualMode) {
      targetCode = manualCodeInput.trim().toUpperCase();
      if (!targetCode) {
        setError('Please enter a valid LSGD Code (Example: G070702)');
        return;
      }
    }

    const match = getPanchayathByCode(targetCode);
    const panchayathObj: PanchayathOption = match || {
      code: targetCode,
      name: `Panchayat (${targetCode})`,
      nameMl: `പഞ്ചായത്ത് (${targetCode})`,
      district: selectedDistrict
    };

    setResolvedPanchayath(panchayathObj);
    localStorage.setItem('cp_active_panchayat_code', targetCode);
    dbService.registerActivePanchayath(targetCode);
    setStep('login');
  };

  const handleSwitchPanchayath = () => {
    setStep('picker');
    setError(null);
    setResetMessage(null);
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetMessage(null);
    setLoading(true);

    try {
      if (authMode === 'signin') {
        const profile = await authService.loginWithCredentials(email, password, resolvedPanchayath.code);
        if (profile && profile.role !== loginRole) {
          await authService.logout();
          throw new Error(`This account is registered as ${profile.role}. Please select ${profile.role} to continue.`);
        }
        navigate('/');




      } else {
        if (!fullName.trim()) {
          setError('Please enter your full official name.');
          setLoading(false);
          return;
        }
        await authService.signUp({
          email,
          password,
          name: fullName,
          role,
          panchayatCode: resolvedPanchayath.code,
          wardNumber: role === 'Ward Member' || role === 'ward_member' ? wardNumber : undefined
        });
        setResetMessage('Your registration has been submitted successfully. Your account is awaiting approval by the Panchayat Secretary. This usually takes 1–2 working days. If approval is urgent, please contact your Panchayat office.');
        setAuthMode('signin');
        setPassword('');
      }
    } catch (err: any) {
      const code = err?.code || '';
      setError(
        code === 'auth/invalid-credential'
          ? 'Please verify your credentials and selected role. If the problem continues, contact your Panchayat administrator.'
          : err?.message || 'Operation failed. Check your details and network connectivity.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      setError('Please enter your email address to request a password reset.');
      return;
    }

    setError(null);
    setResetMessage(null);
    setLoading(true);

    try {
      await authService.sendPasswordReset(email);
      setResetMessage(`Password reset link dispatched to ${email}. Check your inbox.`);
    } catch (err: any) {
      setError(err?.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (language: 'en' | 'ml') => {
    i18n.changeLanguage(language);
    localStorage.setItem('cp_language', language);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col md:flex-row font-sans">

      {/* LEFT COLUMN — Official Branding & Privacy Guarantee */}
      <div className="w-full md:w-[42%] bg-[#0F6E4F] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-600/30 via-transparent to-transparent pointer-events-none" />

        {/* Top Header Logo */}
        <div className="flex items-center space-x-3 z-10">
          <MapPin className="w-7 h-8 text-white" aria-hidden="true" />
          <div>
            <span className="font-extrabold text-xl tracking-wider block leading-tight">LSG Track</span>
            <span className="text-[10px] text-emerald-200 uppercase font-mono tracking-widest block">Panchayat Monitoring Portal</span>
          </div>

        </div>


        {/* Center Copy Banner */}
        <div className="my-auto space-y-6 z-10 py-8">
          <div className="space-y-2">
            <span className="bg-emerald-800/80 text-emerald-100 font-mono text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              Kerala Grama Panchayat Production Portal
            </span>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
              {i18n.language === 'ml' ? 'കേരളത്തിലെ ഗ്രാമപഞ്ചായത്തുകൾക്കായി തയാറാക്കിയത്' : 'Built for Kerala Grama Panchayat Secretaries'}
            </h1>
            <p className="text-xs text-emerald-100/90 leading-relaxed font-normal">
              {t('app.privacy_banner')}
            </p>
          </div>

          <div className="bg-emerald-950/40 border border-emerald-400/30 rounded-2xl p-4 space-y-2.5 shadow-inner">
            <div className="flex items-center space-x-2 text-emerald-300 font-bold text-xs">
              <HardDrive size={16} />
              <span>{i18n.language === 'ml' ? 'സുരക്ഷിത ഫയർബേസ് ആധികാരികത' : 'Secure Firebase Authentication'}</span>
            </div>
            <p className="text-[11px] text-emerald-100/80 leading-relaxed">
              Secure sign-in and role-based access for authorized local body staff.
            </p>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-center space-x-3">
              <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
              <span>Offline-capable field workflows</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
              <span>GIS-enabled Panchayat Monitoring</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
              <span>Encrypted cloud synchronization</span>
            </div>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="z-10 border-t border-emerald-600/40 pt-4 text-[10px] text-emerald-200/70 font-mono">
          Free & Open-Source Tool • Copyright © 2026 Avanthika K S, Sredha Manoj
        </div>
      </div>

      {/* RIGHT COLUMN — SECURE LOGIN & REGISTRATION TERMINAL */}
      <div className="w-full md:w-[58%] bg-white p-8 md:p-12 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto space-y-6">
          <div className="flex justify-end" aria-label="Language selection">
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 text-[10px] font-bold">
              <button type="button" onClick={() => handleLanguageChange('en')} aria-pressed={i18n.language === 'en'} className={`rounded-md px-2 py-1 transition ${i18n.language === 'en' ? 'bg-[#0F6E4F] text-white' : 'text-slate-600 hover:text-slate-900'}`}>EN</button>
              <button type="button" onClick={() => handleLanguageChange('ml')} aria-pressed={i18n.language === 'ml'} className={`rounded-md px-2 py-1 transition ${i18n.language === 'ml' ? 'bg-[#0F6E4F] text-white' : 'text-slate-600 hover:text-slate-900'}`}>മലയാളം</button>
            </div>
          </div>
          {/* STEP 1: ONBOARDING PANCHAYATH PICKER */}
          {step === 'picker' ? (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {i18n.language === 'ml' ? 'പഞ്ചായത്ത് തിരഞ്ഞെടുക്കുക' : 'Select Your Grama Panchayat'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {i18n.language === 'ml' ? 'ജില്ലയും ഗ്രാമപഞ്ചായത്തും തിരഞ്ഞെടുത്ത് തുടരുക.' : 'Select your District and Panchayat to continue.'}
                </p>
              </div>

              {error && (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3.5 text-xs font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleConfirmPanchayath} className="space-y-4 text-xs">

                {!manualMode ? (
                  <>
                    {/* District Dropdown */}
                    <div>
                      <label className="block font-extrabold text-slate-900 mb-1.5 flex items-center space-x-1.5">
                        <MapPin size={15} className="text-[#0F6E4F]" />
                        <span>{i18n.language === 'ml' ? 'ജില്ല (District)' : 'Select District'}</span>
                      </label>
                      <select
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        aria-label="Select District"
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#0F6E4F] focus:ring-1 focus:ring-[#0F6E4F]"
                      >
                        {KERALA_DISTRICTS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    {/* Panchayath Dropdown */}
                    <div>
                      <label className="block font-extrabold text-slate-900 mb-1.5 flex items-center space-x-1.5">
                        <Building2 size={15} className="text-[#0F6E4F]" />
                        <span>{i18n.language === 'ml' ? 'ഗ്രാമപഞ്ചായത്ത് (Grama Panchayat)' : 'Select Grama Panchayat'}</span>
                      </label>
                      <select
                        value={selectedPanchayathCode}
                        onChange={(e) => setSelectedPanchayathCode(e.target.value)}
                        aria-label="Select Grama Panchayat"
                        disabled={panchayathList.length === 0}
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#0F6E4F] focus:ring-1 focus:ring-[#0F6E4F] disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                      >
                        {panchayathList.map((p) => (
                          <option key={p.code} value={p.code}>
                            {i18n.language === 'ml' ? p.nameMl : p.name}
                          </option>
                        ))}
                      </select>
                      {panchayathList.length === 0 && <p className="mt-1.5 text-[11px] text-slate-500">No Panchayats are currently available for this district.</p>}
                    </div>
                  </>
                ) : (
                  /* Manual Code Input Fallback */
                  <div>
                    <label className="block font-extrabold text-slate-900 mb-1.5 flex items-center space-x-1.5">
                      <Building2 size={15} className="text-[#0F6E4F]" />
                      <span>{t('entry.code_label')}</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. G070702"
                      value={manualCodeInput}
                      onChange={(e) => setManualCodeInput(e.target.value.toUpperCase())}
                      aria-label="LSGD Panchayat Code"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-[#0F6E4F] uppercase"
                    />
                    <p className="mt-1.5 text-[11px] text-slate-500">Enter the official LSGD code of your Panchayat.</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setManualMode(!manualMode)}
                    className="text-[11px] text-[#0F6E4F] hover:underline font-semibold"
                  >
                    {manualMode 
                      ? (i18n.language === 'ml' ? '← ജില്ല തിരിച്ചു തിരഞ്ഞെടുക്കുക' : '← Back to District Picker') 
                      : (i18n.language === 'ml' ? 'LSGD കോഡ് നേരിട്ട് നൽകുക' : 'Enter LSGD Code Manually')}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0F6E4F] hover:bg-[#0B5A3E] text-white font-extrabold py-3 px-4 rounded-xl transition text-xs flex items-center justify-center space-x-2 shadow-sm"
                >
                  <span>{i18n.language === 'ml' ? 'തുടരുക (Proceed)' : 'Confirm Panchayat & Proceed'}</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>
          ) : (
            /* STEP 2: FIREBASE LOGIN / SIGN UP TERMINAL */
            <div className="space-y-5">

              {/* Resolved Panchayath Header Badge */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#0F6E4F] uppercase tracking-wider block">
                    Grama Panchayat Portal
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                    {i18n.language === 'ml' ? resolvedPanchayath.nameMl : resolvedPanchayath.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleSwitchPanchayath}
                  className="text-xs text-[#0F6E4F] hover:text-[#0B5A3E] font-bold flex items-center space-x-1 bg-white border border-emerald-200 px-2.5 py-1.5 rounded-xl shadow-2xs shrink-0"
                >
                  <RefreshCw size={12} />
                  <span>{i18n.language === 'ml' ? 'മാറ്റുക' : 'Switch'}</span>
                </button>
              </div>

              {/* Mode Toggle Switcher: Sign In vs Sign Up */}
              <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => { setAuthMode('signin'); setError(null); setResetMessage(null); }}
                  className={`flex-1 py-2 rounded-xl transition flex items-center justify-center space-x-1.5 ${
                    authMode === 'signin'
                      ? 'bg-[#0F6E4F] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LogIn size={14} />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('signup'); setError(null); setResetMessage(null); }}
                  className={`flex-1 py-2 rounded-xl transition flex items-center justify-center space-x-1.5 ${
                    authMode === 'signup'
                      ? 'bg-[#0F6E4F] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserPlus size={14} />
                  <span>Sign Up (Register)</span>
                </button>
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {authMode === 'signin' ? 'Portal Sign In' : 'New Officer Registration'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {authMode === 'signin' 
                    ? 'Sign in with your official Grama Panchayat credentials.'
                    : 'Register your official profile for secretarial approval.'}
                </p>
              </div>

              {error && (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3.5 text-xs font-medium">
                  {error}
                </div>
              )}

              {resetMessage && (
                <div className="bg-emerald-50 border border-emerald-200 text-[#0F6E4F] rounded-xl p-3.5 text-xs font-medium">
                  {resetMessage}
                </div>
              )}

              <form onSubmit={handleCredentialsSubmit} className="space-y-4 text-xs">

                {/* Full Name Field (Sign Up Only) */}
                {authMode === 'signup' && (
                  <div>
                    <label className="block font-extrabold text-slate-900 mb-1.5 flex items-center space-x-1.5">
                      <UserIcon size={15} className="text-[#0F6E4F]" />
                      <span>Full Official Name *</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Avanthika K S"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      aria-label="Full Official Name"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#0F6E4F] focus:ring-1 focus:ring-[#0F6E4F]"
                    />
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label className="block font-extrabold text-slate-900 mb-1.5 flex items-center space-x-1.5">
                    <Mail size={15} className="text-[#0F6E4F]" />
                    <span>Official Email / Username *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. avanthikaks2702@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Official Email or Username"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#0F6E4F] focus:ring-1 focus:ring-[#0F6E4F]"
                  />
                  {authMode === 'signin' && email.trim() && !email.includes('@') && (
                    <p className="mt-1.5 text-[11px] text-slate-500">Using a username creates an internal account. Password recovery works only with a real email address.</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block font-extrabold text-slate-900 mb-1.5 flex items-center space-x-1.5">
                    <KeyRound size={15} className="text-[#0F6E4F]" />
                    <span>Password *</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      aria-label="Password"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#0F6E4F] focus:ring-1 focus:ring-[#0F6E4F]"
                    />
                    <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-500 hover:text-[#0F6E4F] focus:outline-none focus:ring-1 focus:ring-inset focus:ring-[#0F6E4F] rounded-r-xl">
                      {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                    </button>
                  </div>
                </div>

                {/* Role Designation Selector (Sign Up Only) */}
                {authMode === 'signup' && (
                  <div>
                    <label className="block font-extrabold text-slate-900 mb-1.5 flex items-center space-x-1.5">
                      <Compass size={15} className="text-[#0F6E4F]" />
                      <span>Designated Official Role *</span>
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      aria-label="Designated Official Role"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#0F6E4F] focus:ring-1 focus:ring-[#0F6E4F]"
                    >
                      <option value="Field Officer">{t('roles.field_officer')}</option>
                      <option value="Ward Member">{t('roles.ward_member')}</option>
                      <option value="Secretary">{t('roles.secretary')}</option>
                    </select>
                    <p className="mt-1.5 text-[11px] text-slate-500">Field Officer (formerly Panchayat Section Clerk)</p>
                  </div>
                )}

                {authMode === 'signin' && (
                  <div>
                    <label className="block font-extrabold text-slate-900 mb-1.5 flex items-center space-x-1.5">
                      <Compass size={15} className="text-[#0F6E4F]" />
                      <span>{i18n.language === 'ml' ? 'നിങ്ങളുടെ ചുമതല തിരഞ്ഞെടുക്കുക *' : 'Select your assigned role *'}</span>
                    </label>
                    <select value={loginRole} onChange={(e) => setLoginRole(e.target.value as UserRole)} aria-label="Select your assigned role" className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#0F6E4F]">
                      <option value="Administrator">{t('roles.admin')}</option>
                      <option value="Secretary">{t('roles.secretary')}</option>
                      <option value="Field Officer">{t('roles.field_officer')}</option>
                      <option value="Ward Member">{t('roles.ward_member')}</option>
                    </select>
                  </div>
                )}

                {/* Ward Number (Sign Up Only if Ward Member) */}
                {authMode === 'signup' && (role === 'Ward Member' || role === 'ward_member') && (
                  <div>
                    <label className="block font-extrabold text-slate-900 mb-1.5">{t('entry.ward_label')}</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={wardNumber}
                      onChange={(e) => setWardNumber(e.target.value)}
                      aria-label="Ward Number"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0F6E4F]"
                    />
                  </div>
                )}

                {authMode === 'signin' && (
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={handlePasswordReset}
                      className="text-[11px] text-[#0F6E4F] hover:underline font-semibold"
                    >
                      Forgot password? Send reset link
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0F6E4F] hover:bg-[#0B5A3E] disabled:opacity-50 text-white font-extrabold py-3 px-4 rounded-xl transition text-xs flex items-center justify-center space-x-2 shadow-sm"
                >
                  <span>{loading ? 'Processing...' : (authMode === 'signin' ? 'Sign In' : 'Register Account')}</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
