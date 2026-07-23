import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mapPreviewImg from '../assets/map_preview.jpg';
import { 
  ArrowRight, 
  ArrowLeft,
  ChevronRight, 
  RefreshCw, 
  Search, 
  Calendar, 
  ShieldCheck, 
  Smartphone, 
  MapPin, 
  AlertTriangle, 
  History, 
  Layers, 
  Map,
  Building2,
  Bell,
  MessageSquare
} from 'lucide-react';

// Custom SVG Icons matching the design screenshot
const KSmartIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#0F6E4F]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l.73-.73" />
    <path d="M12 8a3 3 0 1 0 3 3" />
  </svg>
);

const LsgTrackIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#0F6E4F]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="9" y1="17" x2="9" y2="10" />
    <line x1="12" y1="17" x2="12" y2="7" />
    <line x1="15" y1="17" x2="15" y2="13" />
  </svg>
);

const GisMapIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#0F6E4F]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
    <line x1="9" y1="3" x2="9" y2="18" />
    <line x1="15" y1="6" x2="15" y2="21" />
  </svg>
);

interface Feature {
  title: string;
  description?: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

interface Slide {
  title: string;
  description: string;
  features: Feature[];
  activeCard: 'K-SMART' | 'LSG TRACK' | 'GIS MAP';
  statusText: string;
}

const slides: Slide[] = [
  {
    title: 'Integrated with K-SMART',
    description: 'Licensed trade establishments are synchronized from K-SMART, reducing manual data entry and ensuring up-to-date records.',
    activeCard: 'K-SMART',
    statusText: 'Live Data Synchronization Active',
    features: [
      {
        title: 'Automatic license synchronization',
        description: 'Real-time updates from the state database.',
        icon: RefreshCw
      },
      {
        title: 'Business search',
        description: 'Instant lookup of any registered entity by ID or name.',
        icon: Search
      },
      {
        title: 'Renewal monitoring',
        description: 'Automated alerts for expiring trade licenses.',
        icon: Calendar
      },
      {
        title: 'Compliance tracking',
        description: 'Unified view of field verification vs official records.',
        icon: ShieldCheck
      }
    ]
  },
  {
    title: 'Field Surveys & Geo-tagging',
    description: 'Conduct door-to-door validation, verify business credentials, and capture precise GPS locations of structures in the field.',
    activeCard: 'LSG TRACK',
    statusText: 'Real-time Field Auditing Active',
    features: [
      {
        title: 'Mobile field surveys',
        description: 'Collect structure, owner, and license data on-site.',
        icon: Smartphone
      },
      {
        title: 'Geo-tagging structures',
        description: 'Pinpoint exact coordinates for spatial mapping.',
        icon: MapPin
      },
      {
        title: 'Discrepancy reporting',
        description: 'Flag unlicensed operations or mismatching categories.',
        icon: AlertTriangle
      },
      {
        title: 'Audit logs',
        description: 'Complete historical trace of field officer verifications.',
        icon: History
      }
    ]
  },
  {
    title: 'GIS-Based Monitoring',
    description: 'View businesses on an interactive GIS map, identify unlicensed establishments, monitor expiring licenses, and manage inspections from a single dashboard.',
    activeCard: 'GIS MAP',
    statusText: 'Interactive GIS Layers Active',
    features: [
      {
        title: 'Interactive GIS Map',
        icon: Map
      },
      {
        title: 'Ward Boundaries',
        icon: Layers
      },
      {
        title: 'Business Details',
        icon: Building2
      },
      {
        title: 'Renewal Alerts',
        icon: Bell
      },
      {
        title: 'WhatsApp Notifications',
        icon: MessageSquare
      }
    ]
  }
];

export const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const isLastSlide = step === slides.length - 1;
  const slide = slides[step];

  const goToLogin = () => navigate('/login');

  const handleNext = () => {
    if (isLastSlide) {
      goToLogin();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep((s) => s - 1);
    }
  };

  const renderPaginationDots = (alignClass: string) => (
    <div className={`flex space-x-1.5 ${alignClass}`}>
      {slides.map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => setStep(i)}
          aria-label={`Go to slide ${i + 1} of ${slides.length}`}
          aria-current={i === step}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === step ? 'w-8 bg-[#0F6E4F]' : 'w-2.5 bg-slate-200 hover:bg-slate-300'
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F9F6] flex flex-col justify-between items-center p-4 md:p-8 font-sans">
      
      <div className="flex-grow flex items-center justify-center w-full">
        
        {/* Main Onboarding Modal Container */}
        <div className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row min-h-[620px] transition-all duration-500">
          
          {step === 2 ? (
            /* ==================== SLIDE 3 SPECIFIC LAYOUT ==================== */
            <>
              {/* Left Pane - White background copy (w-full md:w-[48%]) */}
              <div className="w-full md:w-[48%] p-8 md:p-10 flex flex-col justify-between bg-white">
                <div>
                  {/* Step indicator badge */}
                  <span className="inline-block bg-emerald-50 text-[#0F6E4F] font-bold text-[10px] uppercase px-3 py-1 rounded-full mb-4">
                    Step 3 of 3: Live Monitoring
                  </span>
                  
                  <h1 className="text-2xl font-bold text-[#0F6E4F] md:text-3xl leading-tight tracking-tight">
                    {slide.title}
                  </h1>
                  <p className="text-sm text-slate-600 leading-relaxed mt-3 mb-6">
                    {slide.description}
                  </p>

                  {/* Features Checklist Layout */}
                  <div className="space-y-3.5 my-6">
                    {slide.features.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-3 text-slate-700">
                        <div className="w-7 h-7 bg-emerald-50 text-[#0F6E4F] rounded-lg flex items-center justify-center shrink-0">
                          <item.icon size={15} />
                        </div>
                        <span className="text-xs font-semibold">{item.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions and Dots */}
                <div>
                  <div className="border-t border-slate-100 my-5" />
                  <div className="flex justify-between items-center">
                    
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="flex items-center space-x-1.5 border border-slate-200 rounded-xl px-5 py-2 text-sm font-semibold transition text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                    >
                      <ArrowLeft size={16} />
                      <span>Previous</span>
                    </button>

                    {renderPaginationDots('self-center')}

                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center space-x-1.5 bg-[#0F6E4F] hover:bg-[#0B5A3E] text-white rounded-xl px-5 py-2 text-sm font-semibold transition shadow-md shadow-emerald-900/10 hover:opacity-95"
                    >
                      <span>Get started</span>
                      <ArrowRight size={16} />
                    </button>

                  </div>
                </div>
              </div>

              {/* Right Pane - Satellite Map Graphic (w-full md:w-[52%]) */}
              <div className="w-full md:w-[52%] bg-slate-100 relative min-h-[350px] md:min-h-none overflow-hidden flex items-stretch">
                
                {/* Map satellite image preview */}
                <div 
                  className="absolute inset-0 bg-cover bg-center filter brightness-95"
                  style={{ backgroundImage: `url(${mapPreviewImg})` }}
                />

                {/* Styled pins overlay */}
                <div className="absolute top-[28%] left-[35%] w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-md animate-pulse z-10" />
                <div className="absolute top-[48%] left-[58%] w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-md animate-pulse z-10" />
                <div className="absolute top-[52%] left-[22%] w-3 h-3 bg-purple-600 rounded-full border-2 border-white shadow-md z-10" />
                <div className="absolute top-[34%] left-[68%] w-3 h-3 bg-amber-500 rounded-full border-2 border-white shadow-md animate-pulse z-10" />
                <div className="absolute top-[72%] left-[48%] w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-md z-10" />
                <div className="absolute top-[64%] left-[78%] w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-md animate-pulse z-10" />
                <div className="absolute top-[18%] left-[45%] w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-md z-10" />

                {/* Overlay Legend */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-100 z-10 text-[10px] space-y-1.5 w-32">
                  <span className="font-bold uppercase tracking-wider text-slate-400 block mb-1">Legend</span>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-slate-700 font-medium">Licensed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span className="text-slate-700 font-medium">Unlicensed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                    <span className="text-slate-700 font-medium">NGO / Exempt</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span className="text-slate-700 font-medium">Expiring Soon</span>
                  </div>
                </div>

                {/* Overlay Alert Box */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl p-3.5 shadow-xl border border-red-100 z-10 max-w-[230px]">
                  <div className="flex items-start space-x-2.5">
                    <div className="p-1.5 bg-red-50 rounded-lg text-red-600 shrink-0">
                      <AlertTriangle size={15} className="animate-bounce" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-red-600 uppercase tracking-wide block">High Priority</span>
                      <span className="text-[11px] font-extrabold text-slate-800 block mt-0.5">12 Unlicensed Found</span>
                      <span className="text-[9px] text-slate-500 block leading-normal mt-0.5">Identified in Ward 14: Kunnamangalam North</span>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={goToLogin}
                    className="w-full mt-3 bg-[#111827] hover:bg-black text-white font-bold text-[9px] uppercase py-2 rounded-xl tracking-wider transition text-center shadow"
                  >
                    Action Inspections
                  </button>
                </div>

              </div>
            </>
          ) : (
            /* ==================== SLIDES 1 & 2 LAYOUT ==================== */
            <>
              {/* Left Pane - Green flowchart (w-full md:w-[42%]) */}
              <div className="w-full md:w-[42%] bg-[#0F6E4F] p-8 md:p-10 flex flex-col justify-between text-white relative overflow-hidden">
                
                {/* Brand Logo */}
                <div className="flex items-center space-x-2.5 z-10">
                  <svg viewBox="0 0 20 25" className="w-5 h-6 text-white" fill="currentColor">
                    <path d="M10 12.5C10.6875 12.5 11.276 12.2552 11.7656 11.7656C12.2552 11.276 12.5 10.6875 12.5 10C12.5 9.3125 12.2552 8.72396 11.7656 8.23438C11.276 7.74479 10.6875 7.5 10 7.5C9.3125 7.5 8.72396 7.74479 8.23438 8.23438C7.74479 8.72396 7.5 9.3125 7.5 10C7.5 10.6875 7.74479 11.276 8.23438 11.7656C8.72396 12.2552 9.3125 12.5 10 12.5ZM10 25C6.64583 22.1458 4.14062 19.4948 2.48438 17.0469C0.828125 14.599 0 12.3333 0 10.25C0 7.125 1.00521 4.63542 3.01562 2.78125C5.02604 0.927083 7.35417 0 10 0C12.6458 0 14.974 0.927083 16.9844 2.78125C18.9948 4.63542 20 7.125 20 10.25C20 12.3333 19.1719 14.599 17.5156 17.0469C15.8594 19.4948 13.3542 22.1458 10 25Z" />
                  </svg>
                  <span className="font-bold text-lg text-white tracking-wide">LSG Track</span>
                </div>

                <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-white/5 pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-white/5 pointer-events-none" />

                {/* Graphic Flowchart */}
                <div className="flex items-center justify-center space-x-2 md:space-x-3 my-12 z-10">
                  
                  {/* Card 1: K-SMART */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center transition-all duration-500 ${
                      slide.activeCard === 'K-SMART' 
                        ? 'ring-4 ring-emerald-300 scale-110' 
                        : 'opacity-60 scale-90'
                    }`}>
                      <KSmartIcon />
                    </div>
                    <span className={`text-[10px] md:text-xs font-bold tracking-wider transition-opacity duration-500 uppercase ${
                      slide.activeCard === 'K-SMART' ? 'opacity-100 font-extrabold' : 'opacity-60'
                    }`}>K-SMART</span>
                  </div>

                  <ChevronRight className={`text-white w-4 h-4 md:w-5 md:h-5 transition-opacity duration-500 ${
                    slide.activeCard === 'K-SMART' || slide.activeCard === 'LSG TRACK' ? 'opacity-100' : 'opacity-30'
                  }`} />

                  {/* Card 2: LSG TRACK */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center transition-all duration-500 ${
                      slide.activeCard === 'LSG TRACK' 
                        ? 'ring-4 ring-emerald-300 scale-110' 
                        : 'opacity-60 scale-90'
                    }`}>
                      <LsgTrackIcon />
                    </div>
                    <span className={`text-[10px] md:text-xs font-bold tracking-wider transition-opacity duration-500 uppercase ${
                      slide.activeCard === 'LSG TRACK' ? 'opacity-100 font-extrabold' : 'opacity-60'
                    }`}>LSG TRACK</span>
                  </div>

                  <ChevronRight className={`text-white w-4 h-4 md:w-5 md:h-5 transition-opacity duration-500 ${
                    slide.activeCard === 'LSG TRACK' || slide.activeCard === 'GIS MAP' ? 'opacity-100' : 'opacity-30'
                  }`} />

                  {/* Card 3: GIS MAP */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center transition-all duration-500 ${
                      slide.activeCard === 'GIS MAP' 
                        ? 'ring-4 ring-emerald-300 scale-110' 
                        : 'opacity-60 scale-90'
                    }`}>
                      <GisMapIcon />
                    </div>
                    <span className={`text-[10px] md:text-xs font-bold tracking-wider transition-opacity duration-500 uppercase ${
                      slide.activeCard === 'GIS MAP' ? 'opacity-100 font-extrabold' : 'opacity-60'
                    }`}>GIS MAP</span>
                  </div>
                </div>

                {/* Status indicator */}
                <div className="bg-white/15 text-white rounded-full px-5 py-2.5 text-xs font-medium flex items-center space-x-2 backdrop-blur-sm self-center shadow-inner z-10 select-none transition-all duration-500">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                  </span>
                  <span className="tracking-wide">{slide.statusText}</span>
                </div>

              </div>

              {/* Right Pane - White background text (w-full md:w-[58%]) */}
              <div className="w-full md:w-[58%] p-8 md:p-10 flex flex-col justify-between bg-white">
                <div>
                  {renderPaginationDots('mb-6')}

                  <div className="transition-all duration-500">
                    <h1 className="text-2xl font-bold text-[#0F6E4F] md:text-3xl leading-tight tracking-tight">
                      {slide.title}
                    </h1>
                    <p className="text-sm text-slate-600 leading-relaxed mt-3 mb-6">
                      {slide.description}
                    </p>
                  </div>

                  {/* Feature Lists */}
                  <div className="space-y-4 my-6">
                    {slide.features.map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-4 transition-all duration-500">
                        <div className="w-10 h-10 bg-[#0F6E4F] rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm transition-transform hover:scale-105">
                          <item.icon size={18} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-[#0F6E4F] leading-tight">{item.title}</h3>
                          <p className="text-xs text-slate-500 mt-0.5 leading-normal">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div>
                  <div className="border-t border-slate-100 my-6" />
                  <div className="flex justify-between items-center">
                    
                    <button
                      type="button"
                      disabled={step === 0}
                      onClick={handlePrev}
                      className={`flex items-center space-x-1.5 border border-slate-200 rounded-xl px-5 py-2 text-sm font-semibold transition ${
                        step === 0 
                          ? 'opacity-30 cursor-not-allowed text-slate-400' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      <ArrowLeft size={16} />
                      <span>Previous</span>
                    </button>

                    <button
                      type="button"
                      onClick={goToLogin}
                      className="text-sm font-semibold text-slate-400 hover:text-slate-600 transition"
                    >
                      Skip
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center space-x-1.5 bg-[#0F6E4F] hover:bg-[#0B5A3E] text-white rounded-xl px-5 py-2 text-sm font-semibold transition shadow-md shadow-emerald-900/10 hover:opacity-95"
                    >
                      <span>Next</span>
                      <ArrowRight size={16} />
                    </button>

                  </div>
                </div>
              </div>
            </>
          )}

        </div>
        
      </div>

      {/* Footer copyright */}
      <div className="w-full max-w-5xl mt-6 px-4 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-[11px] text-[#0F6E4F]/60 font-sans tracking-wide space-y-2 md:space-y-0">
        <div>© 2026 LSG Track Kerala • Panchayat GIS Portal</div>
        <div className="flex space-x-4">
          <a href="#" className="hover:underline hover:text-[#0F6E4F] transition">Privacy Policy</a>
          <a href="#" className="hover:underline hover:text-[#0F6E4F] transition">Terms of Service</a>
          <a href="#" className="hover:underline hover:text-[#0F6E4F] transition">Department of Local Self Government</a>
        </div>
      </div>

    </div>
  );
};