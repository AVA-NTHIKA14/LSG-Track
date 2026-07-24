import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';
import type { WardReportRecord, BuildingRecord } from '../types';
import { 
  ClipboardCheck, CheckCircle2, Search, 
  MapPin, ShieldAlert, FileText, ExternalLink, User, Camera
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WardReports: React.FC = () => {
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

  if (!isSecretaryOrAdmin) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center max-w-md mx-auto my-12 shadow-sm">
        <ShieldAlert size={40} className="mx-auto text-red-600 mb-3" />
        <h3 className="font-extrabold text-slate-900 text-base">Access Restricted</h3>
        <p className="text-xs text-slate-500 mt-2">
          The Ward Member Reports Verification Workspace is restricted to Panchayat Secretaries and System Administrators.
        </p>
      </div>
    );
  }

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
    switch (st) {
      case 'pending_verification':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">Pending Verification</span>;
      case 'verified_licensed':
        return <span className="bg-emerald-100 text-[#0F6E4F] text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">Verified Licensed</span>;
      case 'confirmed_unlicensed':
        return <span className="bg-red-100 text-red-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">Confirmed Unlicensed</span>;
      case 'inspection_required':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">Inspection Due</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">Closed</span>;
    }
  };

  // Find potential match in synchronized database
  const potentialMatch = selectedReport 
    ? buildings.find(b => b.wardNumber === selectedReport.wardNumber && b.businessName.toLowerCase().includes(selectedReport.businessName.toLowerCase().substring(0, 4)))
    : null;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-2">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <ClipboardCheck size={22} className="text-[#0F6E4F]" />
            <span>Ward Member Unlicensed Field Reports</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Panchayat Secretary Decision Workspace to verify field submissions against synchronized K-SMART ERP records.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate('/map')}
            className="bg-[#0F6E4F] hover:bg-[#0B5A3E] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-sm flex items-center space-x-1.5"
          >
            <MapPin size={14} />
            <span>View Reports on GIS Map</span>
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
                placeholder="Filter by business, reporter, or ward..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#0F6E4F] focus:ring-1 focus:ring-[#0F6E4F]"
              />
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] font-bold">
              {[
                { label: 'Pending', value: 'pending_verification' },
                { label: 'Unlicensed', value: 'confirmed_unlicensed' },
                { label: 'Licensed', value: 'verified_licensed' },
                { label: 'All', value: 'all' }
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
                <p>No Ward Member field reports match the selected filters.</p>
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
                    <span>Field Inspection Entry</span>
                  </h5>
                  <div><strong className="text-slate-700">Category:</strong> {selectedReport.category}</div>
                  <div><strong className="text-slate-700">Proprietor:</strong> {selectedReport.ownerName || 'Not specified'}</div>
                  <div><strong className="text-slate-700">Landmark:</strong> {selectedReport.landmark || 'N/A'}</div>
                  <div><strong className="text-slate-700">GPS:</strong> {selectedReport.coordinates.lat.toFixed(5)}, {selectedReport.coordinates.lng.toFixed(5)}</div>
                  <div><strong className="text-slate-700">Reported Date:</strong> {new Date(selectedReport.createdAt).toLocaleDateString()}</div>
                  <div><strong className="text-slate-700">Ward Member:</strong> {selectedReport.reporterName}</div>
                </div>

                {/* Geotagged Photo Preview */}
                {selectedReport.photoUrl && (
                  <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2">
                    <div className="text-[11px] font-extrabold text-slate-800 flex items-center space-x-1.5">
                      <Camera size={13} className="text-[#0F6E4F]" />
                      <span>Onsite Geotagged Photograph</span>
                    </div>
                    <div className="relative rounded-xl overflow-hidden border border-slate-300">
                      <img src={selectedReport.photoUrl} alt="Geotagged Establishment" className="w-full h-48 object-cover" />
                      <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-white px-3 py-1 text-[10px] font-mono flex justify-between">
                        <span>📍 Lat: {selectedReport.coordinates.lat.toFixed(5)}, Lng: {selectedReport.coordinates.lng.toFixed(5)}</span>
                        <span className="text-emerald-400 font-bold">GPS Stamped</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* K-SMART Cross Reference Check */}
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 space-y-2">
                  <h5 className="font-extrabold text-[#0F6E4F] text-xs border-b border-emerald-200/60 pb-1.5 flex items-center space-x-1.5">
                    <ExternalLink size={13} />
                    <span>K-SMART ERP Comparison</span>
                  </h5>

                  {potentialMatch ? (
                    <div className="space-y-1 text-slate-700">
                      <div className="text-emerald-900 font-bold">✓ Potential Match Found</div>
                      <div><strong>Est. Name:</strong> {potentialMatch.businessName}</div>
                      <div><strong>Building ID:</strong> {potentialMatch.id}</div>
                      <div><strong>ERP Status:</strong> <span className="uppercase font-bold">{potentialMatch.status}</span></div>
                    </div>
                  ) : (
                    <div className="text-slate-500 italic py-2">
                      No matching registered business found in synchronized K-SMART database for Ward {selectedReport.wardNumber}.
                    </div>
                  )}
                </div>
              </div>

              {/* Field Remarks */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-medium space-y-1">
                <span className="font-bold text-slate-700 block">Ward Member Field Remarks:</span>
                <p className="text-slate-600 italic">"{selectedReport.remarks || 'No specific remarks entered.'}"</p>
              </div>

              {/* Secretary Action Form */}
              <div className="border-t pt-4 space-y-3">
                <label className="block text-xs font-extrabold text-slate-900">
                  Secretary Decision Remarks / Notes:
                </label>
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
                    Confirm Unlicensed
                  </button>

                  <button
                    onClick={() => handleAction('verified_licensed')}
                    className="bg-[#0F6E4F] hover:bg-[#0B5A3E] text-white rounded-xl py-2.5 px-3 transition shadow-sm text-center"
                  >
                    Mark Verified Licensed
                  </button>

                  <button
                    onClick={() => handleAction('inspection_required')}
                    className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl py-2.5 px-3 transition shadow-sm text-center"
                  >
                    Require Inspection
                  </button>

                  <button
                    onClick={() => handleAction('closed')}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl py-2.5 px-3 transition shadow-sm text-center"
                  >
                    Close / Duplicate
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="my-auto text-center py-20 text-slate-400 text-xs">
              <ClipboardCheck size={40} className="mx-auto mb-2 text-slate-300" />
              <p>Select a field report from the left pane to begin verification against K-SMART database.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
