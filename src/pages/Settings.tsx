import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';
import { KERALA_PANCHAYATHS } from '../data/keralaPanchayaths';
import type { SystemSettings, SyncHistoryRecord } from '../types';
import { 
  User, Accessibility, Database, HelpCircle, 
  CheckCircle2, ArrowRight, FileText, Mail
} from 'lucide-react';

import { UserGuideModal } from '../components/UserGuideModal';
import { OnboardingTour } from '../components/OnboardingTour';

export const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const [showGuides, setShowGuides] = useState(false);
  const [showTour, setShowTour] = useState(false);

  const activePanchayatCode = localStorage.getItem('cp_active_panchayat_code') || 'G110706';
  const currentPanchayathObj = KERALA_PANCHAYATHS.find(p => p.code.toLowerCase() === activePanchayatCode.toLowerCase());
  const panchayatName = currentPanchayathObj ? currentPanchayathObj.name : 'Grama Panchayat';

  // Settings State
  const [settings, setSettings] = useState<SystemSettings>({
    highContrast: false,
    smsNotificationsEnabled: true,
    emailNotificationsEnabled: true
  });
  
  const [syncHistory, setSyncHistory] = useState<SyncHistoryRecord[]>([]);
  
  // Editable Contact Number
  const [contactNumber, setContactNumber] = useState('+91 94470 12345');
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [contactSavedMsg, setContactSavedMsg] = useState(false);



  useEffect(() => {
    const unsubSettings = dbService.subscribeToSettings(setSettings);
    const unsubSync = dbService.subscribeToSyncHistory(setSyncHistory);
    return () => {
      unsubSettings();
      unsubSync();
    };
  }, []);

  const handleToggleContrast = async () => {
    const nextVal = !settings.highContrast;
    await dbService.updateSettings({ highContrast: nextVal });
    await dbService.addAuditLog('SETTING_CHANGE', `Toggled accessibility High Contrast Mode: ${nextVal ? 'ON' : 'OFF'}`);
  };

  const handleToggleLargerText = async () => {
    const nextVal = !settings.largerText;
    await dbService.updateSettings({ largerText: nextVal });
    await dbService.addAuditLog('SETTING_CHANGE', `Toggled accessibility Larger Text Size: ${nextVal ? 'ON' : 'OFF'}`);
  };

  const handleSaveContact = async () => {
    setIsEditingContact(false);
    setContactSavedMsg(true);
    await dbService.addAuditLog('PROFILE_UPDATE', `Updated official Secretary contact number: ${contactNumber}`);
    setTimeout(() => setContactSavedMsg(false), 3000);
  };

  const lastSync = syncHistory.length > 0 ? syncHistory[0] : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      
      {/* Header */}
      <div className="border-b pb-3 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {t('settings.heading')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('settings.subheading')}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* SECTION 1: PROFILE */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
              <User size={18} className="text-[#0F6E4F]" />
              <span>{i18n.language === 'ml' ? 'ഉദ്യോഗസ്ഥ പ്രൊഫൈൽ' : 'Officer Profile'}</span>
            </h3>
            <span className="bg-emerald-50 text-[#0F6E4F] border border-emerald-100 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
              {i18n.language === 'ml' ? 'സജീവം' : 'Authenticated Session'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            <div>
              <span className="block text-[10px] font-extrabold text-slate-400 uppercase">{i18n.language === 'ml' ? 'ഉദ്യോഗസ്ഥന്റെ പേര്' : 'Officer Name'}</span>
              <span className="text-slate-900 text-sm font-extrabold">{currentUser?.name || (i18n.language === 'ml' ? 'പഞ്ചായത്ത് സെക്രട്ടറി' : 'Panchayat Secretary')}</span>
            </div>
            <div>
              <span className="block text-[10px] font-extrabold text-slate-400 uppercase">{i18n.language === 'ml' ? 'ഔദ്യോഗിക ചുമതല' : 'Designation'}</span>
              <span className="text-slate-900">{currentUser?.role || (i18n.language === 'ml' ? 'പഞ്ചായത്ത് സെക്രട്ടറി' : 'Panchayat Secretary')}</span>
            </div>
            <div>
              <span className="block text-[10px] font-extrabold text-slate-400 uppercase">{i18n.language === 'ml' ? 'പഞ്ചായത്ത് പേര്' : 'Panchayat Name'}</span>
              <span className="text-slate-900 font-extrabold">{panchayatName}</span>
            </div>
            <div>
              <span className="block text-[10px] font-extrabold text-slate-400 uppercase">{i18n.language === 'ml' ? 'സ്ഥാപന കോഡ്' : 'LSGD Institution Code'}</span>
              <span className="text-slate-900 font-mono font-bold">{currentUser?.panchayathId || activePanchayatCode}</span>
            </div>
          </div>

          <div className="border-t pt-3 flex items-center justify-between text-xs">
            <div>
              <span className="block text-[10px] font-extrabold text-slate-400 uppercase">{i18n.language === 'ml' ? 'ഔദ്യോഗിക ഫോൺ നമ്പർ' : 'Official Contact Number'}</span>
              {isEditingContact ? (
                <input
                  type="text"
                  value={contactNumber}
                  onChange={e => setContactNumber(e.target.value)}
                  className="border border-slate-300 rounded-lg px-2 py-1 text-xs font-mono font-bold mt-1 text-slate-900 focus:outline-none focus:border-[#0F6E4F]"
                />
              ) : (
                <span className="text-slate-900 font-mono font-bold">{contactNumber}</span>
              )}
            </div>

            {isEditingContact ? (
              <button
                onClick={handleSaveContact}
                className="bg-[#0F6E4F] hover:bg-[#0B5A3E] text-white px-3 py-1.5 rounded-xl font-extrabold text-xs transition"
              >
                {i18n.language === 'ml' ? 'സേവ് ചെയ്യുക' : 'Save Contact'}
              </button>
            ) : (
              <button
                onClick={() => setIsEditingContact(true)}
                className="text-[#0F6E4F] hover:underline font-extrabold text-xs"
              >
                {i18n.language === 'ml' ? 'ഫോൺ നമ്പർ തിരുത്തുക' : 'Edit Contact'}
              </button>
            )}
          </div>

          {contactSavedMsg && (
            <div className="bg-emerald-50 text-[#0F6E4F] text-xs font-extrabold p-2 rounded-xl border border-emerald-100 flex items-center space-x-1.5">
              <CheckCircle2 size={14} />
              <span>{i18n.language === 'ml' ? 'ഫോൺ നമ്പർ പുതുക്കി.' : 'Contact number updated.'}</span>
            </div>
          )}
        </div>

        {/* SECTION 2: ACCESSIBILITY */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="border-b pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
              <Accessibility size={18} className="text-[#0F6E4F]" />
              <span>{i18n.language === 'ml' ? 'ആക്സസിബിലിറ്റി ക്രമീകരണങ്ങൾ' : 'Accessibility Options'}</span>
            </h3>
          </div>

          <div className="space-y-4 text-xs font-semibold">
            {/* High Contrast */}
            <div className="flex justify-between items-center">
              <div>
                <span className="font-extrabold text-slate-900 block">{i18n.language === 'ml' ? 'ഹൈ കോൺട്രാസ്റ്റ് മോഡ്' : 'High Contrast Mode'}</span>
                <span className="text-slate-500 text-[11px] font-normal">{i18n.language === 'ml' ? 'സൂര്യപ്രകാശത്തിലും വായനാസൗകര്യത്തിനായി നിറങ്ങൾ വ്യക്തമാക്കുക.' : 'Enable high-contrast colors for enhanced outdoor daylight readability.'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleToggleContrast}
                  className={`w-16 h-7 rounded-full transition-colors relative flex items-center px-1.5 border shadow-inner ${
                    settings.highContrast ? 'bg-[#0F6E4F] border-[#0B5A3E]' : 'bg-slate-200 border-slate-300'
                  }`}
                  aria-label="Toggle High Contrast Mode"
                >
                  <span className={`text-[10px] font-extrabold uppercase select-none transition-all ${
                    settings.highContrast ? 'text-white ml-0.5' : 'text-slate-500 ml-auto mr-0.5'
                  }`}>
                    {settings.highContrast ? 'ON' : 'OFF'}
                  </span>
                  <span className={`w-5 h-5 rounded-full bg-white absolute transition-transform shadow-md border border-slate-200 ${
                    settings.highContrast ? 'translate-x-8' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

            {/* Larger Text */}
            <div className="flex justify-between items-center border-t pt-3">
              <div>
                <span className="font-extrabold text-slate-900 block">{i18n.language === 'ml' ? 'വലിയ അക്ഷരങ്ങൾ' : 'Larger Text'}</span>
                <span className="text-slate-500 text-[11px] font-normal font-sans">{i18n.language === 'ml' ? 'അക്ഷരങ്ങളുടെ വലിപ്പം വർദ്ധിപ്പിക്കുക.' : 'Increase font size across monitoring tables and cards.'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleToggleLargerText}
                  className={`w-16 h-7 rounded-full transition-colors relative flex items-center px-1.5 border shadow-inner ${
                    settings.largerText ? 'bg-[#0F6E4F] border-[#0B5A3E]' : 'bg-slate-200 border-slate-300'
                  }`}
                  aria-label="Toggle Larger Text"
                >
                  <span className={`text-[10px] font-extrabold uppercase select-none transition-all ${
                    settings.largerText ? 'text-white ml-0.5' : 'text-slate-500 ml-auto mr-0.5'
                  }`}>
                    {settings.largerText ? 'ON' : 'OFF'}
                  </span>
                  <span className={`w-5 h-5 rounded-full bg-white absolute transition-transform shadow-md border border-slate-200 ${
                    settings.largerText ? 'translate-x-8' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: K-SMART SYNCHRONIZATION STATUS */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
              <Database size={18} className="text-[#0F6E4F]" />
              <span>{i18n.language === 'ml' ? 'കെ-സ്മാർട്ട് ഡാറ്റാ സിങ്ക് വിവരങ്ങൾ' : 'K-SMART Synchronization Status'}</span>
            </h3>
            <button
              onClick={() => navigate('/sync')}
              className="text-[#0F6E4F] hover:text-[#0B5A3E] font-extrabold text-xs flex items-center space-x-1"
            >
              <span>{i18n.language === 'ml' ? 'ചരിത്രം കാണുക' : 'View Import History'}</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 col-span-2 sm:col-span-1 text-left">
              <span className="block text-[10px] font-extrabold text-slate-400 uppercase">{i18n.language === 'ml' ? 'അവസാന ഡാറ്റാ സിങ്ക്' : 'Last Synchronization'}</span>
              <span className="font-bold text-slate-900 text-xs block mt-0.5">
                {lastSync ? new Date(lastSync.timestamp).toLocaleDateString() : (i18n.language === 'ml' ? 'രേഖപ്പെടുത്തിയിട്ടില്ല' : 'No Sync Recorded')}
              </span>
            </div>
            <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100 text-[#0F6E4F] font-bold">
              <span className="block text-[10px] uppercase font-extrabold">{i18n.language === 'ml' ? 'ചേർത്തവ' : 'Imported Records'}</span>
              <span className="text-lg font-extrabold">{lastSync ? lastSync.importedCount : 0}</span>
            </div>
            <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100 text-blue-800 font-bold">
              <span className="block text-[10px] uppercase font-extrabold">{i18n.language === 'ml' ? 'പുതുക്കിയവ' : 'Updated Records'}</span>
              <span className="text-lg font-extrabold">{lastSync ? lastSync.updatedCount : 0}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-slate-700 font-bold">
              <span className="block text-[10px] uppercase font-extrabold">{i18n.language === 'ml' ? 'വിഫലമായവ' : 'Failed Records'}</span>
              <span className="text-lg font-extrabold">{lastSync ? lastSync.errorCount : 0}</span>
            </div>
          </div>
        </div>

        {/* SECTION 4: HELP */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="border-b pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
              <HelpCircle size={18} className="text-[#0F6E4F]" />
              <span>Help & Support</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
            <button
              onClick={() => setShowGuides(true)}
              className="bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 p-3.5 rounded-2xl flex items-center justify-between transition"
            >
              <div className="flex items-center space-x-2">
                <FileText size={16} className="text-[#0F6E4F]" />
                <span>{i18n.language === 'ml' ? 'പി.ഡി.എഫ് ഉപയോക്തൃ ഗൈഡ്' : 'Stakeholder User Guides (PDF)'}</span>
              </div>
              <ArrowRight size={14} className="text-slate-400" />
            </button>

            <button
              onClick={() => setShowTour(true)}
              className="bg-emerald-50 hover:bg-emerald-100 text-[#0F6E4F] border border-emerald-200 p-3.5 rounded-2xl flex items-center justify-between transition"
            >
              <div className="flex items-center space-x-2">
                <HelpCircle size={16} />
                <span>{i18n.language === 'ml' ? 'ടൂർ വീണ്ടും ആരംഭിക്കുക' : 'Start Interactive Tour'}</span>
              </div>
              <ArrowRight size={14} className="text-[#0F6E4F]" />
            </button>
          </div>

          <div className="border-t pt-3 flex flex-col sm:flex-row justify-between text-xs text-slate-500 font-medium gap-2">
            <div>
              <span>Application Version: </span>
              <span className="font-mono font-bold text-slate-800">2.0.0 (Independent Pilot)</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail size={12} className="text-slate-400" />
              <span>Support Email: </span>
              <span className="font-mono text-[#0F6E4F] font-bold">support@lsgtrack.local</span>
            </div>
          </div>
        </div>

      </div>

      <UserGuideModal isOpen={showGuides} onClose={() => setShowGuides(false)} />
      <OnboardingTour isOpen={showTour} onClose={() => setShowTour(false)} userRole={currentUser?.role || 'Panchayat Secretary'} panchayatName={panchayatName} />

    </div>
  );
};
