import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Sparkles, 
  MapPin, 
  Database, 
  ClipboardCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  X
} from 'lucide-react';

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
  panchayatName?: string;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  isOpen,
  onClose,
  userRole = 'Panchayat Secretary',
  panchayatName = 'Grama Panchayat'
}) => {
  const { i18n } = useTranslation();
  const [currentStep, setCurrentStep] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isMalayalam = i18n.language === 'ml';

  const steps = [
    {
      title: isMalayalam ? `സ്വാഗതം — ${panchayatName}` : `Welcome to LSG Track — ${panchayatName}`,
      icon: Sparkles,
      color: 'bg-emerald-50 text-[#0F6E4F] border-emerald-200',
      description: isMalayalam
        ? `കേരളത്തിലെ ഗ്രാമപഞ്ചായത്തുകളിലെ വ്യാപാര ലൈസൻസുകൾ ജി.ഐ.എസ് ഭൂപടത്തിലൂടെ നിരീക്ഷിക്കാനുള്ള ഔദ്യോഗിക ഡിജിറ്റൽ സംവിധാനത്തിലേക്ക് സ്വാഗതം. നിങ്ങളുടെ പ്രൊഫൈൽ: ${userRole}.`
        : `Welcome to Kerala Grama Panchayat's official GIS Trade License Monitoring System. Your active session role: ${userRole}.`,
      highlights: [
        isMalayalam ? 'തത്സമയ ലൈസൻസ് നിരീക്ഷണം' : 'Real-time trade license compliance tracking',
        isMalayalam ? '100% പ്രാദേശിക ഡാറ്റാ സുരക്ഷ' : '100% On-device local data security',
        isMalayalam ? 'കെ-സ്മാർട്ട് ഡാറ്റാ ഏകോപനം' : 'Seamless K-SMART ERP synchronization'
      ]
    },
    {
      title: isMalayalam ? 'നിങ്ങളുടെ ചുമതലകൾ (Role Dashboard)' : 'Role-Tailored Operational Dashboard',
      icon: ClipboardCheck,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      description: isMalayalam
        ? `${userRole} എന്ന നിലയിൽ നിങ്ങൾക്ക് ആവശ്യമായ വിവരങ്ങളും പ്രധാന നിർബന്ധിത ചുമതലകളും ഡാഷ്‌ബോർഡിൽ ഉടനടി ലഭ്യമാണ്.`
        : `As a ${userRole}, your workspace dashboard presents custom priority tasks, compliance metrics, and action items tailored specifically to your designation.`,
      highlights: [
        isMalayalam ? 'തീർപ്പുകൽപ്പിക്കാത്ത ഫീൽഡ് റിപ്പോർട്ടുകൾ' : 'Actionable verification queue',
        isMalayalam ? 'വാർഡ് അടിസ്ഥാനത്തിലുള്ള നിരക്കുകൾ' : 'Ward-wise compliance ranking',
        isMalayalam ? 'അവസാന കെ-സ്മാർട്ട് സിങ്ക് വിവരങ്ങൾ' : 'Live K-SMART sync audit log'
      ]
    },
    {
      title: isMalayalam ? 'ജി.ഐ.എസ് ഭൂപടവും വാർഡ് അതിരുകളും' : 'Authentic GIS Mapping & Ward Safety',
      icon: MapPin,
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      description: isMalayalam
        ? 'സെക് കേരളയുടെ ഔദ്യോഗിക വാർഡ് അതിരുകളും സ്ഥാപനങ്ങളുടെ സ്ഥാനവും മാപ്പിൽ കാണാം. തെറ്റായ മാപ്പ് പിന്നുകൾ സ്വയം തിരിച്ചറിഞ്ഞു തിരുത്താനുള്ള സൗകര്യമുണ്ട്.'
        : 'Visualize licensed (green) and unlicensed (red) establishments mapped over authentic Grama Panchayat boundary GeoJSON polygons. Points outside boundaries are flagged for manual pin placement.',
      highlights: [
        isMalayalam ? 'പച്ച: ലൈസൻസ് ഉള്ളവ | ചുവപ്പ്: ഇല്ലാത്തവ' : 'Green: Licensed | Red: Unlicensed',
        isMalayalam ? 'കൃത്യമായ അതിർത്തി സുരക്ഷ പരിശോധന' : 'Authentic Panchayat boundary verification',
        isMalayalam ? 'നേരിട്ടുള്ള മാപ്പ് പിന്നിങ് സൗകര്യം' : 'Interactive doorstep pin positioning'
      ]
    },
    {
      title: isMalayalam ? 'കെ-സ്മാർട്ട് ഡാറ്റാ അപ്‌ലോഡ് (K-SMART Sync)' : 'K-SMART ERP Import & Verification',
      icon: Database,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      description: isMalayalam
        ? 'കെ-സ്മാർട്ട് സോഫ്റ്റ്‌വെയറിൽ നിന്നുള്ള എക്സെൽ ഫയലുകൾ നേരിട്ട് അപ്‌ലോഡ് ചെയ്ത് സ്ഥാപനങ്ങളുടെ ലൈസൻസ് വിവരങ്ങൾ തത്സമയം പുതുക്കാവുന്നതാണ്.'
        : 'Import official K-SMART Trade License Excel files with zero manual typing. Ward numbers are strictly extracted from Excel records to preserve data integrity.',
      highlights: [
        isMalayalam ? 'എക്സെൽ ഡാറ്റാ അപ്‌ലോഡ്' : 'Direct K-SMART Excel ingestion',
        isMalayalam ? 'വാർഡ് വിവരങ്ങളുടെ കൃത്യത' : 'Data-first ward assignment',
        isMalayalam ? 'വാട്സാപ്പ് പുതുക്കൽ അറിയിപ്പുകൾ' : 'Automated WhatsApp renewal dispatches'
      ]
    }
  ];

  const step = steps[currentStep];
  const StepIcon = step.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <span className="bg-[#0F6E4F] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {isMalayalam ? 'സഹായ മാർഗ്ഗദർശി' : 'System Guide'} ({currentStep + 1}/{steps.length})
            </span>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close tour"
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step Content Body */}
        <div className="p-6 space-y-5">
          <div className="flex items-start space-x-4">
            <div className={`p-3.5 rounded-2xl border ${step.color} shrink-0 shadow-xs`}>
              <StepIcon size={24} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 leading-tight">
                {step.title}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                {step.description}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              {isMalayalam ? 'പ്രധാന സവിശേഷതകൾ' : 'Key Highlights'}
            </span>
            <ul className="space-y-1.5 text-xs text-slate-700 font-semibold">
              {step.highlights.map((h, i) => (
                <li key={i} className="flex items-center space-x-2">
                  <CheckCircle2 size={14} className="text-[#0F6E4F] shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Navigation Controls */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
              currentStep === 0 
                ? 'opacity-40 cursor-not-allowed text-slate-400' 
                : 'text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            <ArrowLeft size={14} />
            <span>{isMalayalam ? 'പുറകോട്ട്' : 'Previous'}</span>
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center space-x-1.5">
            {steps.map((_, idx) => (
              <div 
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentStep ? 'w-6 bg-[#0F6E4F]' : 'w-2 bg-slate-200'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="bg-[#0F6E4F] hover:bg-[#0B5A3E] text-white px-5 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 shadow-sm transition"
          >
            <span>{currentStep === steps.length - 1 ? (isMalayalam ? 'ആരംഭിക്കുക' : 'Get Started') : (isMalayalam ? 'അടുത്തത്' : 'Next')}</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
};
