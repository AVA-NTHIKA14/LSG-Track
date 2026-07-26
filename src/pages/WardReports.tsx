import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';
import type { WardReportRecord, BuildingRecord } from '../types';
import { 
  ClipboardCheck, CheckCircle2, Search, 
  MapPin, FileText, ExternalLink, User, Camera
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WardReports: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [reports, setReports] = useState<WardReportRecord[]>([]);
  const [buildings, setBuildings] = useState<BuildingRecord[]>([]);

  const [selectedReport, setSelectedReport] = useState<WardReportRecord | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('pending_verification');
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationNote, setVerificationNote] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const currentUser = authService.getCurrentUser();
  const isSecretaryOrAdmin = currentUser?.role === 'Secretary' || currentUser?.role === 'Administrator';

  useEffect(() => {
    const unsubR = dbService.subscribeToWardReports((list) => {
      setReports(list);
      if (list.length > 0 && !selectedReport) {
        setSelectedReport(list[0]);
      }
    });
    const unsubB = dbService.subscribeToBuildings(setBuildings);

    return () => {
      unsubR();
      unsubB();
    };
  }, []);



  const filteredReports = reports.filter(r => {
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchSearch = r.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (r.reporterName && r.reporterName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                        r.wardNumber.includes(searchQuery);
    return matchStatus && matchSearch;
  });

  const handleAction = async (status: WardReportRecord['status']) => {
    if (!selectedReport) return;

    await dbService.verifyWardReport(selectedReport.id, status, verificationNote);
    setActionSuccess(`Report ${selectedReport.id} marked as ${status.replace('_', ' ').toUpperCase()}`);
    setVerificationNote('');
    
    // Update local active item
    setSelectedReport(prev => prev ? { ...prev, status, verifiedAt: new Date().toISOString() } : null);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const getStatusBadge = (st: WardReportRecord['status']) => {
    const isMl = i18n.language === 'ml';
    switch (st) {
      case 'pending_verification':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">{isMl ? 'പരിശോധനയിൽ' : 'Pending Verification'}</span>;
      case 'verified_licensed':
        return <span className="bg-emerald-100 text-[#0F6E4F] text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">{isMl ? 'ലൈസൻസ് ഉണ്ട് (സ്ഥിരീകരിച്ചു)' : 'Verified Licensed'}</span>;
      case 'confirmed_unlicensed':
        return <span className="bg-red-100 text-red-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">{isMl ? 'ലൈസൻസ് ഇല്ല (സ്ഥിരീകരിച്ചു)' : 'Confirmed Unlicensed'}</span>;
      case 'inspection_required':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">{isMl ? 'പരിശോധന ആവശ്യമാണ്' : 'Inspection Due'}</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">{isMl ? 'പൂർത്തിയായി' : 'Closed'}</span>;
    }
  };

  // Find potential match in synchronized database
  // 1-Directional Sanity Check: Does Ward Member field report match an existing K-SMART application in Ward X?
  const potentialMatch = selectedReport 
    ? buildings.find(b => {
        if (b.wardNumber !== selectedReport.wardNumber) return false;
        if (selectedReport.landmark && b.structureNumber && selectedReport.landmark.toLowerCase().includes(b.structureNumber.toLowerCase())) return true;
        const rName = selectedReport.businessName.toLowerCase().trim();
        const bName = b.businessName.toLowerCase().trim();
        if (bName === rName || (rName.length > 3 && (bName.includes(rName) || rName.includes(bName)))) return true;
        const latDiff = Math.abs(b.coordinates.lat - selectedReport.coordinates.lat);
        const lngDiff = Math.abs(b.coordinates.lng - selectedReport.coordinates.lng);
        return latDiff < 0.0015 && lngDiff < 0.0015;
      })
    : null;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-2">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <ClipboardCheck size={22} className="text-[#0F6E4F]" />
            <span>{t('nav.ward_reports')}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('dashboard.subheading')}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate('/map')}
            className="bg-[#0F6E4F] hover:bg-[#0B5A3E] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-sm flex items-center space-x-1.5"
          >
            <MapPin size={14} />
            <span>{i18n.language === 'ml' ? 'മാപ്പിൽ റിപ്പോർട്ടുകൾ കാണുക' : 'View Reports on GIS Map'}</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-[#0F6E4F] text-xs font-extrabold p-3 rounded-2xl flex items-center space-x-2">
          <CheckCircle2 size={16} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main Grid: Left List (40%) / Right Verification Desk (60%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Submissions Catalog (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col h-[650px]">
          
          {/* Filter Bar */}
          <div className="space-y-2 border-b pb-3 shrink-0">
            <div className="relative">
              <input
                type="text"
                placeholder={i18n.language === 'ml' ? 'സ്ഥാപനം, വ്യക്തി അല്ലെങ്കിൽ വാർഡ് തിരയുക...' : 'Filter by business, reporter, or ward...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#0F6E4F] focus:ring-1 focus:ring-[#0F6E4F]"
              />
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] font-bold">
              {[
                { label: i18n.language === 'ml' ? 'പരിശോധനയിൽ' : 'Pending', value: 'pending_verification' },
                { label: i18n.language === 'ml' ? 'ലൈസൻസ് ഇല്ലാത്തവ' : 'Unlicensed', value: 'confirmed_unlicensed' },
                { label: i18n.language === 'ml' ? 'ലൈസൻസ് ഉള്ളവ' : 'Licensed', value: 'verified_licensed' },
                { label: i18n.language === 'ml' ? 'എല്ലാം' : 'All', value: 'all' }
              ].map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilterStatus(f.value)}
                  className={`px-3 py-1 rounded-lg border transition whitespace-nowrap ${
                    filterStatus === f.value
                      ? 'bg-[#0F6E4F] text-white border-[#0F6E4F]'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* List Pane */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {filteredReports.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs">
                <FileText size={32} className="mx-auto mb-2 text-slate-300" />
                <p>{i18n.language === 'ml' ? 'തിരഞ്ഞെടുത്ത വിവരങ്ങൾക്ക് അനുയോജ്യമായ വാർഡ് റിപ്പോർട്ടുകൾ ലഭ്യമല്ല.' : 'No Ward Member field reports match the selected filters.'}</p>
              </div>
            ) : (
              filteredReports.map(report => {
                const isSelected = selectedReport?.id === report.id;
                return (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                      isSelected
                        ? 'border-[#0F6E4F] bg-emerald-50/40 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <h4 className="font-extrabold text-slate-900 text-xs tracking-tight">{report.businessName}</h4>
                      {getStatusBadge(report.status)}
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-0.5 font-medium">
                      <div>Ward {report.wardNumber} • {report.category}</div>
                      <div className="text-slate-400 text-[10px] flex items-center space-x-1">
                        <User size={10} />
                        <span>Reported by: {report.reporterName}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Verification Desk Pane (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-[650px] overflow-y-auto">
          
          {selectedReport ? (
            <div className="space-y-6">
              
              {/* Card Header */}
              <div className="border-b pb-4 flex justify-between items-start flex-wrap gap-2">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] font-mono font-extrabold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {selectedReport.id}
                    </span>
                    <span className="text-xs font-bold text-slate-500">Ward {selectedReport.wardNumber}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">{selectedReport.businessName}</h3>
                </div>

                <div>
                  {getStatusBadge(selectedReport.status)}
                </div>
              </div>

              {/* Detail Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                
                {/* Field Details */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
                  <h5 className="font-extrabold text-slate-900 text-xs border-b pb-1.5 flex items-center space-x-1.5">
                    <MapPin size={13} className="text-[#0F6E4F]" />
                    <span>{i18n.language === 'ml' ? 'ഫീൽഡ് പരിശോധനാ വിവരങ്ങൾ' : 'Field Inspection Entry'}</span>
                  </h5>
                  <div><strong className="text-slate-700">{i18n.language === 'ml' ? 'വിഭാഗം:' : 'Category:'}</strong> {selectedReport.category}</div>
                  <div><strong className="text-slate-700">{i18n.language === 'ml' ? 'ഉടമ:' : 'Proprietor:'}</strong> {selectedReport.ownerName || (i18n.language === 'ml' ? 'വ്യക്തമാക്കിയിട്ടില്ല' : 'Not specified')}</div>
                  <div><strong className="text-slate-700">{i18n.language === 'ml' ? 'ലാൻഡ്മാർക്ക്:' : 'Landmark:'}</strong> {selectedReport.landmark || 'N/A'}</div>
                  <div><strong className="text-slate-700">{i18n.language === 'ml' ? 'ജി.പി.എസ്:' : 'GPS:'}</strong> {selectedReport.coordinates.lat.toFixed(5)}, {selectedReport.coordinates.lng.toFixed(5)}</div>
                  <div><strong className="text-slate-700">{i18n.language === 'ml' ? 'സമർപ്പിച്ച തീയതി:' : 'Reported Date:'}</strong> {new Date(selectedReport.createdAt).toLocaleDateString()}</div>
                  <div><strong className="text-slate-700">{i18n.language === 'ml' ? 'വാർഡ് മെമ്പർ:' : 'Ward Member:'}</strong> {selectedReport.reporterName}</div>
                </div>

                {/* Geotagged Photo Preview */}
                {selectedReport.photoUrl && (
                  <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2">
                    <div className="text-[11px] font-extrabold text-slate-800 flex items-center space-x-1.5">
                      <Camera size={13} className="text-[#0F6E4F]" />
                      <span>{i18n.language === 'ml' ? 'ജി.പി.എസ് ചിത്രം' : 'Onsite Geotagged Photograph'}</span>
                    </div>
                    <div className="relative rounded-xl overflow-hidden border border-slate-300">
                      <img src={selectedReport.photoUrl} alt="Geotagged Establishment" className="w-full h-48 object-cover" />
                      <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-white px-3 py-1 text-[10px] font-mono flex justify-between">
                        <span>📍 Lat: {selectedReport.coordinates.lat.toFixed(5)}, Lng: {selectedReport.coordinates.lng.toFixed(5)}</span>
                        <span className="text-emerald-400 font-bold">{i18n.language === 'ml' ? 'ജി.പി.എസ് മുദ്രണം' : 'GPS Stamped'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* K-SMART Cross Reference Check */}
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 space-y-2">
                  <h5 className="font-extrabold text-[#0F6E4F] text-xs border-b border-emerald-200/60 pb-1.5 flex items-center space-x-1.5">
                    <ExternalLink size={13} />
                    <span>{i18n.language === 'ml' ? 'കെ-സ്മാർട്ട് താരതമ്യം' : 'K-SMART ERP Comparison'}</span>
                  </h5>

                  {potentialMatch ? (
                    <div className="space-y-1 text-slate-700">
                      <div className="text-emerald-900 font-bold">{i18n.language === 'ml' ? '✓ സ്ഥാപനം കണ്ടെത്തി' : '✓ Potential Match Found'}</div>
                      <div><strong>{i18n.language === 'ml' ? 'സ്ഥാപനം:' : 'Est. Name:'}</strong> {potentialMatch.businessName}</div>
                      <div><strong>{i18n.language === 'ml' ? 'ബിൽഡിംഗ് ഐ.ഡി:' : 'Building ID:'}</strong> {potentialMatch.id}</div>
                      <div><strong>{i18n.language === 'ml' ? 'ലൈസൻസ് സ്റ്റാറ്റസ്:' : 'ERP Status:'}</strong> <span className="uppercase font-bold">{potentialMatch.status}</span></div>
                    </div>
                  ) : (
                    <div className="text-slate-500 italic py-2">
                      {i18n.language === 'ml' ? `വാർഡ് ${selectedReport.wardNumber} ൽ അനുയോജ്യമായ സ്ഥാപനം കണ്ടെത്തിയില്ല.` : `No matching registered business found in synchronized K-SMART database for Ward ${selectedReport.wardNumber}.`}
                    </div>
                  )}
                </div>
              </div>

              {/* Field Remarks */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-medium space-y-1">
                <span className="font-bold text-slate-700 block">{i18n.language === 'ml' ? 'വാർഡ് മെമ്പറുടെ കുറിപ്പുകൾ:' : 'Ward Member Field Remarks:'}</span>
                <p className="text-slate-600 italic">"{selectedReport.remarks || (i18n.language === 'ml' ? 'പ്രത്യേക കുറിപ്പുകൾ ഇല്ല' : 'No specific remarks entered.')}"</p>
              </div>
              
              {/* Secretary Verification Controls (or Status Badge for Ward Members) */}
              {isSecretaryOrAdmin ? (
                <div className="border-t pt-4 space-y-3">
                  <span className="block font-bold text-slate-900 text-xs">{i18n.language === 'ml' ? 'സെക്രട്ടറിയുടെ സ്വീകാര്യതാ പ്രവർത്തനം:' : 'Panchayat Secretary Verification Action:'}</span>
                  
                  <textarea
                    rows={2}
                    value={verificationNote}
                    onChange={e => setVerificationNote(e.target.value)}
                    placeholder="e.g. Verified against K-SMART registry. Directed for physical inspection..."
                    className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-[#0F6E4F] focus:ring-1 focus:ring-[#0F6E4F]"
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs font-extrabold">
                    <button
                      onClick={() => handleAction('confirmed_unlicensed')}
                      className="bg-red-700 hover:bg-red-800 text-white rounded-xl py-2.5 px-3 transition shadow-sm text-center"
                    >
                      {i18n.language === 'ml' ? 'ലൈസൻസ് ഇല്ലാത്തതായി സ്ഥിരീകരിക്കുക' : 'Confirm Unlicensed'}
                    </button>

                    <button
                      onClick={() => handleAction('verified_licensed')}
                      className="bg-[#0F6E4F] hover:bg-[#0B5A3E] text-white rounded-xl py-2.5 px-3 transition shadow-sm text-center"
                    >
                      {i18n.language === 'ml' ? 'ലൈസൻസ് ഉള്ളതായി അംഗീകരിക്കുക' : 'Mark Verified Licensed'}
                    </button>

                    <button
                      onClick={() => handleAction('inspection_required')}
                      className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl py-2.5 px-3 transition shadow-sm text-center"
                    >
                      {i18n.language === 'ml' ? 'പരിശോധനയ്ക്ക് അയക്കുക' : 'Require Inspection'}
                    </button>

                    <button
                      onClick={() => handleAction('closed')}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl py-2.5 px-3 transition shadow-sm text-center"
                    >
                      {i18n.language === 'ml' ? 'ക്ലോസ് ചെയ്യുക' : 'Close / Duplicate'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t pt-4 bg-emerald-50/60 border-emerald-100 rounded-2xl p-4 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700">{i18n.language === 'ml' ? 'പരിശോധനാ സ്റ്റാറ്റസ്:' : 'Verification Status:'}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-emerald-100 text-[#0F6E4F] border border-emerald-300">
                    {selectedReport.status.replace('_', ' ')}
                  </span>
                </div>
              )}

            </div>
          ) : (
            <div className="my-auto text-center py-20 text-slate-400 text-xs">
              <ClipboardCheck size={40} className="mx-auto mb-2 text-slate-300" />
              <p>{i18n.language === 'ml' ? 'കെ-സ്മാർട്ട് ഡാറ്റാബേസുമായി പരിശോധിക്കാൻ ഇടതുവശത്ത് നിന്ന് ഒരു ഫീൽഡ് റിപ്പോർട്ട് തിരഞ്ഞെടുക്കുക.' : 'Select a field report from the left pane to begin verification against K-SMART database.'}</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
