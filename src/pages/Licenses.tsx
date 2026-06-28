import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';
import type { LicenseRecord, BuildingRecord, SurveyRecord } from '../types';
import { 
  FileCheck, ShieldCheck, Check, X, ShieldAlert, 
  Search, ExternalLink 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Licenses: React.FC = () => {
  const [licenses, setLicenses] = useState<LicenseRecord[]>([]);
  const [buildings, setBuildings] = useState<BuildingRecord[]>([]);
  const [surveys, setSurveys] = useState<SurveyRecord[]>([]);
  
  const [activeLicense, setActiveLicense] = useState<LicenseRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Secretary approval states
  const [selectedPendingBldg, setSelectedPendingBldg] = useState<BuildingRecord | null>(null);
  const [rejectionRemarks, setRejectionRemarks] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  useEffect(() => {
    const unsubLicenses = dbService.subscribeToLicenses(setLicenses);
    const unsubBuildings = dbService.subscribeToBuildings(setBuildings);
    const unsubSurveys = dbService.subscribeToSurveys(setSurveys);
    return () => {
      unsubLicenses();
      unsubBuildings();
      unsubSurveys();
    };
  }, []);

  const currentUser = authService.getCurrentUser();
  const canApprove = authService.hasPermission('approve_license');

  // Filtered active & expired registers
  const filteredLicenses = licenses.filter(l => {
    const building = buildings.find(b => b.id === l.buildingId);
    const query = searchQuery.toLowerCase();
    return (
      l.id.toLowerCase().includes(query) ||
      l.buildingId.toLowerCase().includes(query) ||
      building?.businessName.toLowerCase().includes(query) ||
      building?.ownerName.toLowerCase().includes(query)
    );
  });

  // Buildings awaiting Secretary verification
  const pendingBuildings = buildings.filter(b => b.status === 'pending');

  const handleSelectPending = (bldg: BuildingRecord) => {
    setSelectedPendingBldg(bldg);
    setShowRejectForm(false);
    setRejectionRemarks('');
  };

  const handleApprove = async (bldgId: string) => {
    // Find survey matching building
    const survey = surveys.find(s => s.buildingId === bldgId && s.status === 'submitted');
    if (survey) {
      await dbService.approveSurvey(survey.id);
      setSelectedPendingBldg(null);
      alert('Survey approved. Trade license issued successfully. Map registry synchronized.');
    }
  };

  const handleReject = async (bldgId: string) => {
    if (!rejectionRemarks) {
      alert('Please specify rejection remarks/deficiencies.');
      return;
    }
    const survey = surveys.find(s => s.buildingId === bldgId && s.status === 'submitted');
    if (survey) {
      await dbService.rejectSurvey(survey.id, rejectionRemarks);
      setSelectedPendingBldg(null);
      setShowRejectForm(false);
      alert('Record returned to Data Entry Operator for correction.');
    }
  };

  // Find survey for selected pending building
  const activeSurvey = selectedPendingBldg 
    ? surveys.find(s => s.buildingId === selectedPendingBldg.id && s.status === 'submitted')
    : null;

  if (currentUser?.role !== 'Secretary' && currentUser?.role !== 'Administrator') {
    return (
      <div className="bg-white border border-gov-border rounded p-6 shadow-sm text-center py-12 text-slate-500 italic text-xs max-w-md mx-auto mt-12">
        <ShieldAlert size={36} className="mx-auto text-red-700 mb-2" />
        <p className="font-bold text-slate-800 text-sm mb-1">ACCESS RESTRICTED</p>
        <p className="mb-4">This license management queue and approval center is restricted to Secretaries and Administrators.</p>
        <p>Your current profile ({currentUser?.role || 'Guest'}) does not hold access permissions.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gov-navy">License Management & Verification</h2>
        <p className="text-xs text-slate-500">Secretary verification queue, commercial license issuance registry, and enforcement approvals.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Grid: Approvals Queue & Active Licenses */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Secretary Verification Queue */}
          <div className="bg-white border border-gov-border rounded p-4 shadow-sm">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-3.5 border-b pb-2 flex items-center space-x-2">
              <ShieldCheck size={16} className="text-gov-green" />
              <span>Secretary Verification Queue ({pendingBuildings.length})</span>
            </h3>

            {pendingBuildings.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">No pending survey inspections awaiting Secretary verification.</p>
            ) : (
              <div className="space-y-2">
                {pendingBuildings.map((b) => (
                  <div 
                    key={b.id} 
                    onClick={() => handleSelectPending(b)}
                    className={`border rounded p-3 text-xs flex justify-between items-center cursor-pointer transition ${
                      selectedPendingBldg?.id === b.id 
                        ? 'border-gov-green bg-slate-50 ring-1 ring-gov-green' 
                        : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-1.5 mb-1 text-[10px]">
                        <span className="font-mono font-bold text-slate-400">ID: {b.id}</span>
                        <span className="px-1.5 py-0.25 bg-amber-100 text-status-pending font-bold uppercase rounded">Awaiting Review</span>
                        <span className="text-slate-400">| Ward {b.wardNumber}</span>
                      </div>
                      <h4 className="font-bold text-slate-800">{b.businessName}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Prop: {b.ownerName} | Category: {b.category}</p>
                    </div>
                    <span className="text-gov-green font-bold uppercase text-[9px] flex items-center space-x-0.5 shrink-0">
                      <span>Review Details</span>
                      <ExternalLink size={10} />
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Licenses List */}
          <div className="bg-white border border-gov-border rounded p-4 shadow-sm">
            <div className="border-b pb-2.5 mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center space-x-2">
                <FileCheck size={16} className="text-gov-green" />
                <span>Trade License Register ({filteredLicenses.length})</span>
              </h3>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search license, owner, building..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border border-slate-300 rounded pl-7 pr-3 py-1 text-xs text-slate-700 focus:outline-none focus:border-gov-green w-48 sm:w-56"
                />
                <Search size={12} className="absolute left-2 top-2 text-slate-400" />
              </div>
            </div>

            {filteredLicenses.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">No active or expired license records found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-gov-border text-slate-500 font-bold uppercase">
                    <tr>
                      <th className="px-3 py-2">License ID</th>
                      <th className="px-3 py-2">Building ID</th>
                      <th className="px-3 py-2">Business Name</th>
                      <th className="px-3 py-2">Issue Date</th>
                      <th className="px-3 py-2">Expiry Date</th>
                      <th className="px-3 py-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gov-border">
                    {filteredLicenses.map(l => {
                      const bldg = buildings.find(b => b.id === l.buildingId);
                      return (
                        <tr 
                          key={l.id} 
                          className="hover:bg-slate-50 cursor-pointer"
                          onClick={() => setActiveLicense(l)}
                        >
                          <td className="px-3 py-2.5 font-bold font-mono text-slate-800">{l.id}</td>
                          <td className="px-3 py-2.5 font-mono text-slate-500">{l.buildingId}</td>
                          <td className="px-3 py-2.5 font-semibold text-slate-800">{bldg?.businessName || 'N/A'}</td>
                          <td className="px-3 py-2.5 text-slate-500">{l.issueDate}</td>
                          <td className="px-3 py-2.5 text-slate-500">{l.expiryDate}</td>
                          <td className="px-3 py-2.5 text-right">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                              l.status === 'active' 
                                ? 'bg-green-50 text-status-licensed' 
                                : 'bg-amber-50 text-amber-800'
                            }`}>
                              {l.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Approval Detail View / active license panel */}
        <div className="bg-white border border-gov-border rounded p-5 shadow-sm h-fit">
          
          {selectedPendingBldg ? (
            /* Approval Inspection details */
            <div className="space-y-4 text-xs text-slate-700">
              
              <div className="border-b pb-3 flex justify-between items-start">
                <div>
                  <span className="font-mono text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">Queue ID: {selectedPendingBldg.id}</span>
                  <h3 className="font-bold text-slate-800 text-sm mt-1">{selectedPendingBldg.businessName}</h3>
                </div>
                <button onClick={() => setSelectedPendingBldg(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              </div>

              {/* Specifications */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[9px]">Owner Name</span>
                  <span className="font-semibold">{selectedPendingBldg.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[9px]">Panchayat Ward</span>
                  <span className="font-mono font-semibold">Ward {selectedPendingBldg.wardNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[9px]">Category</span>
                  <span className="font-semibold">{selectedPendingBldg.category}</span>
                </div>
              </div>

              {/* Survey details */}
              {activeSurvey ? (
                <div className="bg-slate-50 border rounded p-3 space-y-2">
                  <span className="block font-bold text-gov-navy uppercase text-[9px] border-b pb-1">Field Inspection Report</span>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[9px] uppercase">Surveyor</span>
                    <span className="font-medium">{activeSurvey.officerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[9px] uppercase">Inspection Date</span>
                    <span className="font-medium font-mono">{activeSurvey.surveyDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[9px] uppercase">Recorded GPS</span>
                    <span className="font-medium font-mono">{activeSurvey.gps.lat.toFixed(5)}, {activeSurvey.gps.lng.toFixed(5)}</span>
                  </div>
                  <div className="mt-1.5 pt-1 border-t flex flex-col">
                    <span className="text-slate-400 text-[9px] uppercase mb-0.5">Field Officer Remarks</span>
                    <p className="italic text-[10px] text-slate-600 leading-tight">
                      "{activeSurvey.remarks}"
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded p-2 text-center">
                  Survey details not loaded or missing.
                </div>
              )}

              {/* Rejection Remarks Form */}
              {showRejectForm ? (
                <div className="space-y-2 border-t pt-3">
                  <label className="block font-bold text-red-700 uppercase text-[9px]">Specify Deficiencies for Correction</label>
                  <textarea
                    required
                    placeholder="Provide reason (e.g., inadequate fire clearance, incorrect boundary tags)."
                    value={rejectionRemarks}
                    onChange={(e) => setRejectionRemarks(e.target.value)}
                    rows={3}
                    className="w-full border border-red-300 rounded px-2 py-1 text-slate-800 focus:outline-none"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleReject(selectedPendingBldg.id)}
                      className="bg-red-700 text-white font-bold uppercase py-1 px-3 rounded text-[10px]"
                    >
                      Confirm Return to DEO
                    </button>
                    <button
                      onClick={() => setShowRejectForm(false)}
                      className="border border-slate-300 text-slate-700 font-bold uppercase py-1 px-3 rounded text-[10px]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* Secretary Actions buttons */
                <div className="pt-3 border-t space-y-2">
                  
                  {!canApprove && (
                    <div className="bg-red-50 text-status-unlicensed p-2 rounded text-[10px] flex items-center space-x-1.5">
                      <ShieldAlert size={12} />
                      <span>Approve permissions restricted to Secretary role</span>
                    </div>
                  )}

                  <button
                    onClick={() => handleApprove(selectedPendingBldg.id)}
                    disabled={!canApprove}
                    className="w-full bg-gov-green hover:bg-gov-green-light text-white font-bold uppercase py-2 rounded transition flex items-center justify-center space-x-1.5 disabled:opacity-50"
                  >
                    <Check size={14} />
                    <span>Approve & Issue License</span>
                  </button>

                  <button
                    onClick={() => setShowRejectForm(true)}
                    disabled={!canApprove}
                    className="w-full border border-red-300 text-status-unlicensed hover:bg-red-50 font-bold uppercase py-2 rounded transition flex items-center justify-center space-x-1.5 disabled:opacity-50"
                  >
                    <X size={14} />
                    <span>Return for DEO Correction</span>
                  </button>

                </div>
              )}

            </div>
          ) : activeLicense ? (
            /* Active License Card detail */
            <div className="space-y-4 text-xs text-slate-700">
              <div className="border-b pb-3 flex justify-between items-center">
                <span className="font-mono text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">Active License File</span>
                <button onClick={() => setActiveLicense(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded p-4 text-center border-t-4 border-t-status-licensed">
                <div className="font-bold text-emerald-900 text-xs uppercase tracking-wider mb-1">OFFICIAL TRADE LICENSE</div>
                <div className="font-mono font-bold text-slate-900 text-sm">{activeLicense.id}</div>
                <div className="text-[10px] text-slate-500 mt-1">Chakkittapara Grama Panchayat, Kerala</div>
              </div>

              <div className="space-y-2 border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[9px]">Building Reference</span>
                  <span className="font-mono font-semibold">{activeLicense.buildingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[9px]">License Type</span>
                  <span className="font-semibold text-right">{activeLicense.licenseType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[9px]">Date of Issue</span>
                  <span className="font-mono">{activeLicense.issueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[9px]">Expiration Date</span>
                  <span className="font-mono font-bold text-red-700">{activeLicense.expiryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[9px]">Administrative Fee</span>
                  <span className="font-semibold font-mono text-emerald-800">₹{activeLicense.feePaid.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 border-t flex space-x-2 text-[10px] uppercase font-bold text-slate-400">
                <Link 
                  to={`/buildings?id=${activeLicense.buildingId}`}
                  className="flex-1 border text-slate-700 rounded py-1 text-center hover:bg-slate-50 transition inline-block"
                >
                  Inspect Building File
                </Link>
              </div>

            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 text-xs space-y-2">
              <ShieldAlert size={28} className="mx-auto text-slate-300" />
              <p>Select a pending verification item or an active license from the lists to inspect administrative parameters and approval operations.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
