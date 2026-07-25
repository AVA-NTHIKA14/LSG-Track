import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Building2, 
  Compass, 
  User, 
  CheckCircle2, 
  ArrowRight,
  HardDrive,
  RefreshCw,
  MapPin
} from 'lucide-react';
import { authService } from '../services/authService';
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

  // Login Form State
  const [role, setRole] = useState<UserRole>('Secretary');
  const [staffName, setStaffName] = useState<string>('');
  const [wardNumber, setWardNumber] = useState<string>('1');
  const [error, setError] = useState<string | null>(null);

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
    if (list.length > 0 && !list.find(p => p.code === selectedPanchayathCode)) {
      setSelectedPanchayathCode(list[0].code);
    }
  }, [selectedDistrict]);

  // Check if a Panchayath is already saved in LocalStorage
  useEffect(() => {
    const savedCode = localStorage.getItem('cp_active_panchayat_code');
    if (savedCode) {
      const match = getPanchayathByCode(savedCode);
      if (match) {
        setResolvedPanchayath(match);
        setSelectedPanchayathCode(match.code);
        setSelectedDistrict(match.district);
        setStep('login');
      } else {
        setResolvedPanchayath({
          code: savedCode,
          name: `Panchayat (${savedCode})`,
          nameMl: `പഞ്ചായത്ത് (${savedCode})`,
          district: 'Kerala'
        });
        setSelectedPanchayathCode(savedCode);
        setStep('login');
      }
    }
  }, []);

  const handleConfirmPanchayath = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let targetCode = selectedPanchayathCode;
    if (manualMode) {
      targetCode = manualCodeInput.trim().toUpperCase();
      if (!targetCode) {
        setError('Please enter a valid Panchayath LSGD Code (e.g. G070702).');
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
    setStep('login');
  };

  const handleSwitchPanchayath = () => {
    setStep('picker');
  };

  const handleEntrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const displayName = staffName.trim() || (
      role === 'Secretary' ? (i18n.language === 'ml' ? 'പഞ്ചായത്ത് സെക്രട്ടറി' : 'Panchayat Secretary') :
      role === 'Panchayat Section Clerk' ? (i18n.language === 'ml' ? 'സെക്ഷൻ ക്ലർക്ക്' : 'Section Clerk') :
      role === 'Ward Member' ? (i18n.language === 'ml' ? `വാർഡ് ${wardNumber} മെമ്പർ` : `Ward ${wardNumber} Member`) : 'Grama Officer'
    );

    try {
      await authService.loginLocalSession({
        panchayatCode: resolvedPanchayath.code,
        role,
        name: displayName,
        wardNumber: role === 'Ward Member' || role === 'ward_member' ? wardNumber : undefined
      });
      navigate('/');
    } catch (err: any) {
      setError(err?.message || 'Failed to start local session.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col md:flex-row font-sans">
      
      {/* LEFT COLUMN - Honest Standalone Webtool Branding */}
      <div className="w-full md:w-[42%] bg-[#0F6E4F] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-600/30 via-transparent to-transparent pointer-events-none" />

        {/* Top Header Logo */}
        <div className="flex items-center space-x-3 z-10">
          <svg viewBox="0 0 20 25" className="w-7 h-8 text-white fill-current" aria-hidden="true">
            <path d="M10 12.5C10.6875 12.5 11.276 12.2552 11.7656 11.7656C12.2552 11.276 12.5 10.6875 12.5 10C12.5 9.3125 12.2552 8.72396 11.7656 8.23438C11.276 7.74479 10.6875 7.5 10 7.5C9.3125 7.5 8.72396 7.74479 8.23438 8.23438C7.74479 8.72396 7.5 9.3125 7.5 10C7.5 10.6875 7.74479 11.276 8.23438 11.7656C8.72396 12.2552 9.3125 12.5 10 12.5ZM10 25C6.64583 22.1458 4.14062 19.4948 2.48438 17.0469C0.828125 14.599 0 12.3333 0 10.25C0 7.125 1.00521 4.63542 3.01562 2.78125C5.02604 0.927083 7.35417 0 10 0C12.6458 0 14.974 0.927083 16.9844 2.78125C18.9948 4.63542 20 7.125 20 10.25C20 12.3333 19.1719 14.599 17.5156 17.0469C15.8594 19.4948 13.3542 22.1458 10 25Z" />
          </svg>
          <div>
            <span className="font-extrabold text-xl tracking-wider block leading-tight">LSG Track</span>
            <span className="text-[10px] text-emerald-200 uppercase font-mono tracking-widest block">Local-First Webtool</span>
          </div>
        </div>

        {/* Center Copy Banner */}
        <div className="my-auto space-y-6 z-10 py-8">
          <div className="space-y-2">
            <span className="bg-emerald-800/80 text-emerald-100 font-mono text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              Standalone Desktop & Mobile Webtool
            </span>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
              {i18n.language === 'ml' ? 'കേരളത്തിലെ ഗ്രാമപഞ്ചായത്തുകൾക്കായി തയാറാക്കിയത്' : 'Built for Kerala Grama Panchayat Secretaries'}
            </h1>
            <p className="text-xs text-emerald-100/90 leading-relaxed font-normal">
              {t('app.privacy_banner')}
            </p>
          </div>

          {/* Device Storage Guarantee */}
          <div className="bg-emerald-950/40 border border-emerald-400/30 rounded-2xl p-4 space-y-2.5 shadow-inner">
            <div className="flex items-center space-x-2 text-emerald-300 font-bold text-xs">
              <HardDrive size={16} />
              <span>{i18n.language === 'ml' ? 'പ്രാദേശിക ഡാറ്റാ സുരക്ഷാ ഉറപ്പ്' : 'Device-Only Storage Guarantee'}</span>
            </div>
            <p className="text-[11px] text-emerald-100/80 leading-relaxed">
              {t('app.privacy_banner')}
            </p>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-center space-x-3">
              <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
              <span>Offline GIS Map & Ward Compliance Choropleth</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
              <span>Zero Backend & Free wa.me WhatsApp Links</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
              <span>Full Panchayath Local Backup & Restore</span>
            </div>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="z-10 border-t border-emerald-600/40 pt-4 text-[10px] text-emerald-200/70 font-mono">
          Free & Open-Source Tool • Copyright © 2026 Avanthika K S, Sredha Manoj
        </div>
      </div>

      {/* RIGHT COLUMN - ONBOARDING & LOGIN TERMINAL */}
      <div className="w-full md:w-[58%] bg-white p-8 md:p-12 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto space-y-6">
          
          {/* STEP 1: ONBOARDING PANCHAYATH PICKER */}
          {step === 'picker' ? (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {i18n.language === 'ml' ? 'പഞ്ചായത്ത് തിരഞ്ഞെടുക്കുക' : 'Select Your Grama Panchayat'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {i18n.language === 'ml' ? 'ജില്ലയും ഗ്രാമപഞ്ചായത്തും തിരഞ്ഞെടുത്ത് വർക്ക്‌സ്‌പെയിസ് ആരംഭിക്കുക.' : 'Choose your district and panchayath to resolve your local database bucket.'}
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
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#0F6E4F] focus:ring-1 focus:ring-[#0F6E4F]"
                      >
                        {panchayathList.map((p) => (
                          <option key={p.code} value={p.code}>
                            {i18n.language === 'ml' ? p.nameMl : p.name} ({p.code})
                          </option>
                        ))}
                      </select>
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
                      placeholder="e.g. G070702 or G110706"
                      value={manualCodeInput}
                      onChange={(e) => setManualCodeInput(e.target.value.toUpperCase())}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-[#0F6E4F] uppercase"
                    />
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
                      : (i18n.language === 'ml' ? 'പഞ്ചായത്ത് കോഡ് നേരിട്ട് നൽകുക' : 'Enter LSGD Code Manually')}
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
            /* STEP 2: LOGIN TERMINAL (Free-text Name + Role Selector, Zero PINs) */
            <div className="space-y-5">
              
              {/* Resolved Panchayath Header Badge */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#0F6E4F] uppercase tracking-wider block">
                    LSGD CODE: {resolvedPanchayath.code}
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

              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{t('entry.welcome')}</h2>
                <p className="text-xs text-slate-500 mt-1">{t('entry.sub')}</p>
              </div>

              {error && (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3.5 text-xs font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleEntrySubmit} className="space-y-4 text-xs">
                
                {/* Role Designation Selector */}
                <div>
                  <label className="block font-extrabold text-slate-900 mb-1.5 flex items-center space-x-1.5">
                    <Compass size={15} className="text-[#0F6E4F]" />
                    <span>{t('entry.role_label')} *</span>
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#0F6E4F] focus:ring-1 focus:ring-[#0F6E4F]"
                  >
                    <option value="Secretary">{t('roles.secretary')}</option>
                    <option value="Panchayat Section Clerk">{t('roles.clerk')}</option>
                    <option value="Ward Member">{t('roles.ward_member')}</option>
                  </select>
                </div>

                {/* Free-Text Officer Name Input */}
                <div>
                  <label className="block font-extrabold text-slate-900 mb-1.5 flex items-center space-x-1.5">
                    <User size={15} className="text-[#0F6E4F]" />
                    <span>{t('entry.name_label')}</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={i18n.language === 'ml' ? 'ഉദാഹരണത്തിന്: രമേഷ് വി (ക്ലർക്ക്)' : 'e.g. Ramesh V (Secretary / Clerk)'}
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#0F6E4F] focus:ring-1 focus:ring-[#0F6E4F]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    {i18n.language === 'ml' ? 'പാസ്‌വേഡ് ആവശ്യമില്ല — പരിശോധനാ രേഖകൾക്കായി നിങ്ങളുടെ പേര് നൽകുക.' : 'No password or PIN needed — enter your name for action attribution.'}
                  </p>
                </div>

                {/* Ward Number (If Ward Member) */}
                {(role === 'Ward Member' || role === 'ward_member') && (
                  <div>
                    <label className="block font-extrabold text-slate-900 mb-1.5">{t('entry.ward_label')}</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={wardNumber}
                      onChange={(e) => setWardNumber(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0F6E4F]"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#0F6E4F] hover:bg-[#0B5A3E] text-white font-extrabold py-3 px-4 rounded-xl transition text-xs flex items-center justify-center space-x-2 shadow-sm"
                >
                  <span>{t('entry.launch_btn')}</span>
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
