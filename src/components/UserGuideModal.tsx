import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FileText, 
  X, 
  ShieldCheck, 
  Building2, 
  Smartphone, 
  CheckCircle2, 
  Printer,
  Sparkles
} from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type StakeholderRole = 'secretary' | 'clerk' | 'ward_member';

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const [selectedRole, setSelectedRole] = useState<StakeholderRole>('secretary');

  if (!isOpen) return null;

  const isMalayalam = i18n.language === 'ml';
  const downloadableGuide = selectedRole === 'secretary'
    ? '/user-guides/secretary-user-guide.pdf'
    : selectedRole === 'clerk'
      ? '/user-guides/field-officer-user-guide.pdf'
      : '/user-guides/ward-member-user-guide.pdf';

  const handleDownloadPDF = () => {
    window.open(downloadableGuide, '_blank', 'noopener');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#0F6E4F] text-white rounded-xl shadow-xs">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {isMalayalam ? 'ഉദ്യോഗസ്ഥ ഉപയോക്തൃ മാർഗ്ഗദർശികൾ (PDF User Guides)' : 'Stakeholder Official SOP User Guides'}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {isMalayalam ? 'ഓരോ ഉദ്യോഗസ്ഥ ചുമതലയ്ക്കും ആവശ്യമായ ഔദ്യോഗിക പി.ഡി.എഫ് ഗൈഡ് ഡൗൺലോഡ് ചെയ്യുക.' : 'Select stakeholder role and download printable official PDF manual.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Stakeholder Selector Tabs */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setSelectedRole('secretary')}
              className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 ${
                selectedRole === 'secretary'
                  ? 'border-[#0F6E4F] bg-emerald-50/60 text-[#0F6E4F] ring-1 ring-[#0F6E4F]'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <ShieldCheck size={20} className={selectedRole === 'secretary' ? 'text-[#0F6E4F]' : 'text-slate-400'} />
              <div>
                <span className="block text-xs font-extrabold">{t('roles.secretary')}</span>
                <span className="text-[10px] text-slate-500 font-medium">Executive SOP</span>
              </div>
            </button>

            <button
              onClick={() => setSelectedRole('clerk')}
              className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 ${
                selectedRole === 'clerk'
                  ? 'border-[#0F6E4F] bg-emerald-50/60 text-[#0F6E4F] ring-1 ring-[#0F6E4F]'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <Building2 size={20} className={selectedRole === 'clerk' ? 'text-[#0F6E4F]' : 'text-slate-400'} />
              <div>
                <span className="block text-xs font-extrabold">{t('roles.clerk')}</span>
                <span className="text-[10px] text-slate-500 font-medium">Data Entry & Sync</span>
              </div>
            </button>

            <button
              onClick={() => setSelectedRole('ward_member')}
              className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 ${
                selectedRole === 'ward_member'
                  ? 'border-[#0F6E4F] bg-emerald-50/60 text-[#0F6E4F] ring-1 ring-[#0F6E4F]'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <Smartphone size={20} className={selectedRole === 'ward_member' ? 'text-[#0F6E4F]' : 'text-slate-400'} />
              <div>
                <span className="block text-xs font-extrabold">{t('roles.ward_member')}</span>
                <span className="text-[10px] text-slate-500 font-medium">Mobile Field Survey</span>
              </div>
            </button>
          </div>

          {/* Role Summary Preview */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-extrabold text-slate-900 flex items-center space-x-1.5">
                <Sparkles size={14} className="text-[#0F6E4F]" />
                <span>
                  {selectedRole === 'secretary' 
                    ? (isMalayalam ? 'സെക്രട്ടറിയുടെ ചുമതലകൾ' : 'Secretary Manual Scope')
                    : selectedRole === 'clerk'
                    ? (isMalayalam ? 'ക്ലർക്കിന്റെ ചുമതലകൾ' : 'Clerk/DEO Manual Scope')
                    : (isMalayalam ? 'വാർഡ് അംഗത്തിന്റെ ചുമതലകൾ' : 'Ward Member Survey Scope')}
                </span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">PDF Document</span>
            </div>

            <ul className="space-y-2 text-xs text-slate-700">
              {selectedRole === 'secretary' ? (
                <>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 size={14} className="text-[#0F6E4F] shrink-0 mt-0.5" />
                    <span>{isMalayalam ? 'വാർഡ് അംഗങ്ങളുടെ ഫീൽഡ് ഇൻസ്പെക്ഷൻ റിപ്പോർട്ടുകൾ പരിശോധിക്കുക.' : 'Verify pending field inspection reports submitted by ward members.'}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 size={14} className="text-[#0F6E4F] shrink-0 mt-0.5" />
                    <span>{isMalayalam ? 'കെ-സ്മാർട്ട് ഡാറ്റാ ഏകോപനവും ലൈസൻസ് സ്ഥിതിവിവരക്കണക്കുകളും അവലോകനം ചെയ്യുക.' : 'Audit K-SMART data sync and approve trade compliance digests.'}</span>
                  </li>
                </>
              ) : selectedRole === 'clerk' ? (
                <>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 size={14} className="text-[#0F6E4F] shrink-0 mt-0.5" />
                    <span>{isMalayalam ? 'കെ-സ്മാർട്ട് എക്സെൽ ഫയലുകൾ അപ്‌ലോഡ് ചെയ്തു കെട്ടിടങ്ങൾ അപ്‌ഡേറ്റ് ചെയ്യുക.' : 'Ingest K-SMART Excel files and register new commercial units.'}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 size={14} className="text-[#0F6E4F] shrink-0 mt-0.5" />
                    <span>{isMalayalam ? 'തെറ്റായ ജി.ഐ.എസ് സ്ഥാനങ്ങൾ നേരിട്ട് മാപ്പിൽ തിരുത്തുക.' : 'Correct out-of-boundary spatial pin locations on the GIS map.'}</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 size={14} className="text-[#0F6E4F] shrink-0 mt-0.5" />
                    <span>{isMalayalam ? 'ഫീൽഡ് പരിശോധനാ സമയത്ത് നേരിട്ട് മൊബൈൽ സർവേ വിവരങ്ങൾ രേഖപ്പെടുത്തുക.' : 'Conduct mobile onsite field inspection surveys for commercial premises.'}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 size={14} className="text-[#0F6E4F] shrink-0 mt-0.5" />
                    <span>{isMalayalam ? 'ലൈസൻസ് ഇല്ലാത്ത സ്ഥാപനങ്ങളുടെ വിവരങ്ങളും ചിത്രങ്ങളും അപ്‌ലോഡ് ചെയ്യുക.' : 'Upload GPS-stamped geotagged building photographs.'}</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Footer Action */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            {isMalayalam ? 'പ്രിന്റ് അല്ലെങ്കിൽ പി.ഡി.എഫ് ആയി സേവ് ചെയ്യാം.' : 'Opens print menu formatted for PDF export.'}
          </span>

          <button
            onClick={handleDownloadPDF}
            className="bg-[#0F6E4F] hover:bg-[#0B5A3E] text-white px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 shadow-sm transition"
          >
            <Printer size={15} />
            <span>{isMalayalam ? 'പി.ഡി.എഫ് ഗൈഡ് ഡൗൺലോഡ് ചെയ്യുക' : 'Download User Guide PDF'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
