import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';
import type { BuildingRecord, SurveyRecord } from '../types';
import { 
  ClipboardCheck, Save, CheckCircle, WifiOff, 
  RefreshCw, ShieldAlert, MapPin, Check, Play, Search, Plus 
} from 'lucide-react';

interface LocalReportDraft {
  id: string;
  businessName: string;
  ownerName: string;
  category: string;
  wardNumber: string;
  gps: { lat: number; lng: number };
  remarks: string;
  surveyDate: string;
}

export const Survey: React.FC = () => {
  const [buildings, setBuildings] = useState<BuildingRecord[]>([]);
  
  const currentUser = authService.getCurrentUser();
  const assignedWard = currentUser?.ward || '1';
  const role = currentUser?.role || 'Guest';

  // --- WARD MEMBER STATE ---
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [category, setCategory] = useState('');
  
  // --- VEO STATE ---
  const [activeBuilding, setActiveBuilding] = useState<BuildingRecord | null>(null);
  const [veoSearchQuery, setVeoSearchQuery] = useState('');
  const [licenseExemptStatus, setLicenseExemptStatus] = useState<'needs-license' | 'ngo-exempt' | 'govt-exempt'>('needs-license');
  const veoMapContainerRef = useRef<HTMLDivElement>(null);
  const veoMapRef = useRef<L.Map | null>(null);

  // --- SHARED STATE ---
  const [remarks, setRemarks] = useState('');
  const [lat, setLat] = useState<number>(11.57547);
  const [lng, setLng] = useState<number>(75.81649);
  const [localDrafts, setLocalDrafts] = useState<any[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsubBuildings = dbService.subscribeToBuildings(setBuildings);
    
    // Load offline drafts
    const savedDrafts = localStorage.getItem('cp_unlicensed_report_drafts');
    if (savedDrafts) {
      setLocalDrafts(JSON.parse(savedDrafts));
    }

    return () => {
      unsubBuildings();
    };
  }, []);

  // VEO Local Field Map Initialization
  useEffect(() => {
    if (role !== 'VEO' || !activeBuilding || !veoMapContainerRef.current) return;

    // Destroy existing map instance
    if (veoMapRef.current) {
      veoMapRef.current.remove();
      veoMapRef.current = null;
    }

    try {
      const map = L.map(veoMapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([lat, lng], 15);
      
      veoMapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

      L.marker([lat, lng]).addTo(map)
        .bindPopup(activeBuilding.businessName)
        .openPopup();
    } catch (err) {
      console.warn("Leaflet field map initialization failed: ", err);
    }

    return () => {
      if (veoMapRef.current) {
        veoMapRef.current.remove();
        veoMapRef.current = null;
      }
    };
  }, [activeBuilding, lat, lng, role]);

  // Filter reported buildings in this member's ward (Ward Member view)
  const myWardBuildings = buildings.filter(b => b.wardNumber === assignedWard);
  const unlicensedReported = myWardBuildings.filter(b => b.status === 'unlicensed' || b.status === 'pending');

  // Filter survey targets (VEO view)
  const surveyTargets = buildings.filter(b => {
    const matchQuery = 
      b.businessName.toLowerCase().includes(veoSearchQuery.toLowerCase()) ||
      b.ownerName.toLowerCase().includes(veoSearchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(veoSearchQuery.toLowerCase());
      
    if (veoSearchQuery) {
      return matchQuery;
    }
    return b.status === 'unlicensed' && matchQuery;
  });

  const handleGetGPS = () => {
    const offsetLat = +(Math.random() * 0.006 - 0.003).toFixed(5);
    const offsetLng = +(Math.random() * 0.006 - 0.003).toFixed(5);
    setLat(+(11.57547 + offsetLat).toFixed(5));
    setLng(+(75.81649 + offsetLng).toFixed(5));
  };

  const clearForm = () => {
    setBusinessName('');
    setOwnerName('');
    setCategory('');
    setRemarks('');
    setLat(11.57547);
    setLng(75.81649);
    setActiveBuilding(null);
  };

  // --- WARD MEMBER ACTION: SAVE DRAFT ---
  const handleSaveMemberDraft = () => {
    if (!businessName || !ownerName || !category) {
      alert('Please fill in business name, owner name, and category to save draft.');
      return;
    }

    const newDraft: LocalReportDraft = {
      id: 'DRAFT-' + Date.now(),
      businessName,
      ownerName,
      category,
      wardNumber: assignedWard,
      gps: { lat, lng },
      remarks,
      surveyDate: new Date().toISOString().split('T')[0]
    };

    const updated = [...localDrafts, newDraft];
    setLocalDrafts(updated);
    localStorage.setItem('cp_unlicensed_report_drafts', JSON.stringify(updated));
    setSuccessMsg(`Draft saved locally in offline browser cache.`);
    clearForm();
  };

  // --- FIELD OFFICER ACTION: SAVE DRAFT ---
  const handleSaveOfficerDraft = () => {
    if (!activeBuilding) return;

    const newDraft = {
      id: 'OFFICER-DRAFT-' + Date.now(),
      buildingId: activeBuilding.id,
      businessName: activeBuilding.businessName,
      gps: { lat, lng },
      remarks,
      surveyDate: new Date().toISOString().split('T')[0]
    };

    const updated = [...localDrafts, newDraft];
    setLocalDrafts(updated);
    localStorage.setItem('cp_unlicensed_report_drafts', JSON.stringify(updated));
    setSuccessMsg(`Inspection draft saved locally. Offline cache synchronized.`);
    clearForm();
  };

  // --- WARD MEMBER ACTION: SUBMIT REPORT ---
  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isOffline) {
      handleSaveMemberDraft();
      return;
    }

    const buildingId = 'BLDG-' + Math.floor(1000 + Math.random() * 9000);

    const buildingData: Omit<BuildingRecord, 'history'> = {
      id: buildingId,
      ownerName,
      businessName,
      category,
      wardNumber: assignedWard,
      coordinates: { lat, lng },
      status: 'unlicensed',
      remarks
    };

    await dbService.addBuilding(buildingData);

    const surveyData: Omit<SurveyRecord, 'id' | 'officerId' | 'officerName' | 'surveyDate'> = {
      buildingId,
      gps: { lat, lng },
      status: 'submitted',
      remarks: `[Ward Member Survey] ${remarks}`,
      isSynced: true
    };

    await dbService.addSurvey(surveyData);

    setSuccessMsg(`Report submitted. Building registered as ID: ${buildingId}. Sent to Secretary approval queue.`);
    clearForm();
  };

  // --- FIELD OFFICER ACTION: SUBMIT SURVEY ---
  const handleOfficerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBuilding) return;

    if (isOffline) {
      handleSaveOfficerDraft();
      return;
    }

    let nextStatus: any = 'pending';
    if (licenseExemptStatus === 'ngo-exempt') nextStatus = 'ngo';
    else if (licenseExemptStatus === 'govt-exempt') nextStatus = 'govt';

    const surveyData: Omit<SurveyRecord, 'id' | 'officerId' | 'officerName' | 'surveyDate'> = {
      buildingId: activeBuilding.id,
      gps: { lat, lng },
      status: 'submitted',
      remarks: `[VEO Survey] [Obligation: ${licenseExemptStatus}] ${remarks}`,
      isSynced: true
    };

    // Update building status and GPS coordinates in the database
    await dbService.updateBuilding(activeBuilding.id, {
      status: nextStatus,
      coordinates: { lat, lng }
    });

    await dbService.addSurvey(surveyData);
    setSuccessMsg(`Survey report submitted successfully. Building status updated to ${nextStatus}.`);
    clearForm();
  };

  // --- SYNC DRAFTS HANDLER ---
  const handleSyncDrafts = async () => {
    if (localDrafts.length === 0) return;
    setSyncing(true);

    setTimeout(async () => {
      for (const draft of localDrafts) {
        if (draft.id.startsWith('DRAFT-')) {
          // Ward Member Sync
          const buildingId = 'BLDG-' + Math.floor(1000 + Math.random() * 9000);
          const buildingData: Omit<BuildingRecord, 'history'> = {
            id: buildingId,
            ownerName: draft.ownerName,
            businessName: draft.businessName,
            category: draft.category,
            wardNumber: draft.wardNumber,
            coordinates: draft.gps,
            status: 'unlicensed',
            remarks: draft.remarks
          };
          await dbService.addBuilding(buildingData);

          const surveyData: Omit<SurveyRecord, 'id' | 'officerId' | 'officerName' | 'surveyDate'> = {
            buildingId,
            gps: draft.gps,
            status: 'submitted',
            remarks: `[Synced Member Survey] ${draft.remarks}`,
            isSynced: true
          };
          await dbService.addSurvey(surveyData);
        } else {
          // Field Officer Sync
          const surveyData: Omit<SurveyRecord, 'id' | 'officerId' | 'officerName' | 'surveyDate'> = {
            buildingId: draft.buildingId,
            gps: draft.gps,
            status: 'submitted',
            remarks: `[Synced Officer Survey] ${draft.remarks}`,
            isSynced: true
          };
          await dbService.addSurvey(surveyData);
        }
      }

      setLocalDrafts([]);
      localStorage.removeItem('cp_unlicensed_report_drafts');
      setSyncing(false);
      setSuccessMsg(`Synced ${localDrafts.length} offline drafts successfully.`);
    }, 1500);
  };

  const handleDeleteDraft = (draftId: string) => {
    const updated = localDrafts.filter(d => d.id !== draftId);
    setLocalDrafts(updated);
    localStorage.setItem('cp_unlicensed_report_drafts', JSON.stringify(updated));
  };

  // Block unauthorized roles
  const isAuthorized = role === 'Ward Member' || role === 'VEO' || role === 'Administrator';
  if (!isAuthorized) {
    return (
      <div className="bg-white border border-gov-border rounded p-6 shadow-sm text-center py-12 text-slate-500 italic text-xs max-w-md mx-auto mt-12">
        <ShieldAlert size={36} className="mx-auto text-red-700 mb-2" />
        <p className="font-bold text-slate-800 text-sm mb-1">ACCESS RESTRICTED</p>
        <p className="mb-4">This survey reporting and inspect terminal is restricted to Ward Members, VEOs, or Administrators.</p>
        <p>Your current profile ({role}) does not hold access permissions.</p>
      </div>
    );
  }

  // --- RENDER DUAL VIEWS ---
  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b pb-4 flex justify-between items-center flex-wrap gap-2">
        <div>
          {role === 'Ward Member' ? (
            <>
              <h2 className="text-xl font-bold text-gov-navy">Report Unlicensed Establishments</h2>
              <p className="text-xs text-slate-500">Report newly identified unlicensed commercial activities in Ward {assignedWard}.</p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gov-navy">Field Survey Terminal</h2>
              <p className="text-xs text-slate-500">Manage pending survey tasks, capture onsite GPS, log remarks, and sync offline reports.</p>
            </>
          )}
        </div>
        
        <button
          onClick={() => setIsOffline(!isOffline)}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded text-[11px] font-bold transition uppercase ${
            isOffline 
              ? 'bg-red-50 text-status-unlicensed border border-red-200' 
              : 'bg-emerald-50 text-status-licensed border border-emerald-200'
          }`}
        >
          {isOffline ? (
            <>
              <WifiOff size={14} />
              <span>Offline Mode</span>
            </>
          ) : (
            <>
              <RefreshCw size={12} className="animate-spin" />
              <span>Network Active</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns */}
        <div className="space-y-6 lg:col-span-2">
          
          {role === 'Ward Member' ? (
            /* WARD MEMBER LIST: MY SUBMISSIONS */
            <div className="bg-white border border-gov-border rounded p-4 shadow-sm">
              <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-3.5 border-b pb-2 flex items-center space-x-2">
                <ClipboardCheck size={16} className="text-gov-green" />
                <span>My Ward Monitoring (Ward {assignedWard})</span>
              </h3>

              {/* Mini Ward-based Performance Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                <div className="bg-emerald-50/50 border border-emerald-100 rounded p-2 text-xs">
                  <span className="block text-[9px] uppercase font-bold text-slate-500">Licensed</span>
                  <span className="block text-base font-bold text-status-licensed">
                    {myWardBuildings.filter(b => b.status === 'licensed').length}
                  </span>
                </div>
                <div className="bg-red-50/30 border border-red-100 rounded p-2 text-xs">
                  <span className="block text-[9px] uppercase font-bold text-slate-500">Unlicensed</span>
                  <span className="block text-base font-bold text-status-unlicensed">
                    {myWardBuildings.filter(b => b.status === 'unlicensed' || b.status === 'pending').length}
                  </span>
                </div>
                <div className="bg-purple-50/30 border border-purple-100 rounded p-2 text-xs">
                  <span className="block text-[9px] uppercase font-bold text-slate-500">NGO / Exempt</span>
                  <span className="block text-base font-bold text-purple-600">
                    {myWardBuildings.filter(b => b.status === 'ngo').length}
                  </span>
                </div>
              </div>

              {unlicensedReported.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">No unlicensed reports submitted or pending inside your ward boundary.</p>
              ) : (
                <div className="space-y-2">
                  {unlicensedReported.map(b => (
                    <div key={b.id} className="border rounded p-3 bg-slate-50 flex justify-between items-center text-xs">
                      <div>
                        <div className="flex items-center space-x-1.5 mb-1 text-[10px]">
                          <span className="font-mono font-bold text-slate-400">ID: {b.id}</span>
                          <span className={`px-1.5 py-0.25 font-bold uppercase rounded ${
                            b.status === 'pending' ? 'bg-amber-100 text-status-pending' : 'bg-red-100 text-status-unlicensed'
                          }`}>
                            {b.status === 'pending' ? 'Pending Approval' : 'Unlicensed'}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800">{b.businessName}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Proprietor: {b.ownerName} | Class: {b.category}</p>
                      </div>
                      <div className="text-[10px] text-slate-400 italic max-w-xs truncate text-right">
                        {b.remarks}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* FIELD OFFICER LIST: ASSIGNED TARGETS */
            <div className="bg-white border border-gov-border rounded p-4 shadow-sm">
              <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-3.5 border-b pb-2 flex items-center space-x-2">
                <ClipboardCheck size={16} className="text-gov-green" />
                <span>Inspection Survey Targets ({surveyTargets.length})</span>
              </h3>

              {/* VEO SEARCH BAR */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search existing buildings by name, owner, ID..."
                  value={veoSearchQuery}
                  onChange={(e) => setVeoSearchQuery(e.target.value)}
                  className="w-full border border-slate-300 rounded pl-8 pr-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-gov-green"
                />
                <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
              </div>

              {surveyTargets.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-xs text-slate-400 italic mb-3">No matching buildings found in local records.</p>
                  <button
                    type="button"
                    onClick={() => {
                      const tempId = 'BLDG-FIELD-' + Math.floor(1000 + Math.random() * 9000);
                      const tempBldg: BuildingRecord = {
                        id: tempId,
                        businessName: veoSearchQuery || 'New Field Activity',
                        ownerName: 'To be verified',
                        category: 'Commercial',
                        wardNumber: assignedWard,
                        coordinates: { lat: 11.57547, lng: 75.81649 },
                        status: 'unlicensed'
                      };
                      setActiveBuilding(tempBldg);
                      setRemarks('');
                      setSuccessMsg(null);
                    }}
                    className="bg-gov-green hover:bg-gov-green-light text-white text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded flex items-center space-x-1.5 mx-auto"
                  >
                    <Plus size={12} />
                    <span>Report Unregistered Building</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {surveyTargets.map((b) => (
                    <div key={b.id} className="border border-slate-100 rounded p-3 bg-slate-50 flex justify-between items-center text-xs">
                      <div>
                        <div className="flex items-center space-x-1.5 mb-1">
                          <span className="font-mono text-[10px] font-bold text-slate-400">ID: {b.id}</span>
                          <span className={`px-1.5 py-0.5 text-[9px] uppercase font-bold rounded ${
                            b.status === 'licensed' ? 'bg-emerald-100 text-status-licensed' :
                            b.status === 'ngo' ? 'bg-purple-100 text-purple-700' :
                            b.status === 'govt' ? 'bg-blue-100 text-blue-700' :
                            b.status === 'pending' ? 'bg-amber-100 text-status-pending' : 'bg-red-100 text-status-unlicensed'
                          }`}>
                            {b.status}
                          </span>
                          <span className="text-slate-400 font-mono">| Ward {b.wardNumber}</span>
                        </div>
                        <h4 className="font-bold text-slate-800">{b.businessName}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Owner: {b.ownerName} | Category: {b.category}</p>
                      </div>
                      <button
                        onClick={() => {
                          setActiveBuilding(b);
                          setLat(b.coordinates.lat);
                          setLng(b.coordinates.lng);
                          setRemarks('');
                          setSuccessMsg(null);
                        }}
                        className="bg-gov-navy hover:bg-gov-navy-light text-white text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded flex items-center space-x-1"
                      >
                        <Play size={10} />
                        <span>Inspect</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Offline Drafts Cache */}
          <div className="bg-white border border-gov-border rounded p-4 shadow-sm">
            <div className="border-b pb-2 mb-3 flex justify-between items-center">
              <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center space-x-2">
                <WifiOff size={16} className="text-red-700" />
                <span>Offline Cached Drafts ({localDrafts.length})</span>
              </h3>
              
              {localDrafts.length > 0 && !isOffline && (
                <button
                  onClick={handleSyncDrafts}
                  disabled={syncing}
                  className="bg-gov-green hover:bg-gov-green-light text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded flex items-center space-x-1 transition"
                >
                  <RefreshCw size={10} className={syncing ? 'animate-spin' : ''} />
                  <span>{syncing ? 'Syncing...' : 'Sync Upload'}</span>
                </button>
              )}
            </div>

            {localDrafts.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">No drafts cached in browser storage.</p>
            ) : (
              <div className="space-y-2">
                {localDrafts.map((d) => (
                  <div key={d.id} className="border border-red-100 rounded p-3 bg-red-50/20 flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-bold text-slate-800">{d.businessName}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {d.id.startsWith('DRAFT-') ? `Ward Member Report | Ward ${d.wardNumber}` : `VEO Inspection | Bldg ${d.buildingId}`}
                      </p>
                      <p className="text-[10px] text-slate-600 truncate mt-1">Notes: {d.remarks}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteDraft(d.id)}
                      className="text-red-700 hover:underline text-[10px]"
                    >
                      Discard
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Dynamic Form */}
        <div className="bg-white border border-gov-border rounded p-5 shadow-sm h-fit">
          
          {successMsg && (
            <div className="bg-green-50 border border-green-200 text-status-licensed rounded p-2.5 text-xs mb-4 flex items-center space-x-1">
              <CheckCircle size={15} />
              <span>{successMsg}</span>
            </div>
          )}

          {role === 'Ward Member' ? (
            /* WARD MEMBER FORM */
            <>
              <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-4 border-b pb-2">
                Report Establishment Form
              </h3>
              <form onSubmit={handleMemberSubmit} className="space-y-4 text-xs text-slate-700">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Establishment / Business Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Malabar Bakery"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-gov-green"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Proprietor / Owner Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. K. Raghavan"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-gov-green"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Trade Category *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Retail Shop / Hotel"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-gov-green"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Ward Jurisdiction</label>
                  <span className="block font-bold text-slate-800 font-mono py-1">Ward {assignedWard}</span>
                </div>

                {/* GPS */}
                <div className="bg-slate-50 p-3 border rounded space-y-2">
                  <div className="flex justify-between items-center border-b pb-1">
                    <span className="font-bold text-gov-navy uppercase text-[9px] flex items-center space-x-0.5">
                      <MapPin size={10} />
                      <span>GPS Coordinates</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleGetGPS}
                      className="text-gov-green hover:underline font-bold text-[9px] uppercase"
                    >
                      Locate Now
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="block text-slate-400 mb-0.5 font-bold">Latitude</span>
                      <span className="block font-mono bg-white border rounded px-1.5 py-1 text-slate-800">{lat}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 mb-0.5 font-bold">Longitude</span>
                      <span className="block font-mono bg-white border rounded px-1.5 py-1 text-slate-800">{lng}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Survey Remarks / Observations *</label>
                  <textarea
                    required
                    placeholder="e.g. Operating commercial laundry without license clear tags."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={3}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-gov-green"
                  />
                </div>

                <div className="pt-2 border-t flex flex-col space-y-2">
                  <button
                    type="submit"
                    className="w-full bg-gov-green hover:bg-gov-green-light text-white font-bold uppercase py-2 rounded transition flex items-center justify-center space-x-1.5"
                  >
                    <Check size={14} />
                    <span>{isOffline ? 'Save Offline Draft' : 'Report Unlicensed'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveMemberDraft}
                    className="w-full border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold uppercase py-2 rounded transition"
                  >
                    Save Draft to Cache
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* FIELD OFFICER FORM */
            <>
              <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-4 border-b pb-2">
                Field Inspection Form
              </h3>
              {activeBuilding ? (
                <form onSubmit={handleOfficerSubmit} className="space-y-4 text-xs text-slate-700">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Target Establishment</span>
                    <span className="block font-bold text-slate-800 text-xs mt-0.5">{activeBuilding.businessName}</span>
                    <span className="block text-slate-500 text-[10px] mt-0.5">Building ID: {activeBuilding.id} | Ward {activeBuilding.wardNumber}</span>
                  </div>

                  {/* GPS */}
                  <div className="bg-slate-50 p-3 border rounded space-y-2">
                    <div className="flex justify-between items-center border-b pb-1">
                      <span className="font-bold text-gov-navy uppercase text-[9px] flex items-center space-x-0.5">
                        <MapPin size={10} />
                        <span>GPS Verification</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleGetGPS}
                        className="text-gov-green hover:underline font-bold text-[9px] uppercase"
                      >
                        Capture Coordinates
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <span className="block text-slate-400 mb-0.5 font-bold">Latitude</span>
                        <span className="block font-mono bg-white border rounded px-1.5 py-1 text-slate-800">{lat}</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 mb-0.5 font-bold">Longitude</span>
                        <span className="block font-mono bg-white border rounded px-1.5 py-1 text-slate-800">{lng}</span>
                      </div>
                    </div>
                  </div>

                  {/* Local map container */}
                  <div className="mt-2 space-y-1">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase">Field Verification Map</span>
                    <div 
                      ref={veoMapContainerRef} 
                      className="h-32 w-full rounded border border-slate-200 z-10"
                    ></div>
                  </div>

                  {/* License Obligation Status */}
                  <div>
                    <label className="block font-bold text-slate-500 uppercase mb-1">License Need / Exemption Status *</label>
                    <select
                      value={licenseExemptStatus}
                      onChange={(e) => setLicenseExemptStatus(e.target.value as any)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-gov-green"
                    >
                      <option value="needs-license">Requires Trade License (Commercial Unit)</option>
                      <option value="ngo-exempt">Exempt (NGO / Charitable Trust / NGO Activity)</option>
                      <option value="govt-exempt">Exempt (Government Building)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-500 uppercase mb-1">Survey Remarks & Observations *</label>
                    <textarea
                      required
                      placeholder="e.g. Verified coordinates. Commercial restaurant operating with LPG storage, lacks valid Panchayat permit sign."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      rows={4}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-gov-green"
                    />
                  </div>

                  <div className="pt-2 border-t flex flex-col space-y-2">
                    <button
                      type="submit"
                      className="w-full bg-gov-green hover:bg-gov-green-light text-white font-bold uppercase py-2 rounded transition flex items-center justify-center space-x-1.5"
                    >
                      <Check size={14} />
                      <span>{isOffline ? 'Save Offline Draft' : 'Submit Verification'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveOfficerDraft}
                      className="w-full border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold uppercase py-2 rounded transition flex items-center justify-center space-x-1.5"
                    >
                      <Save size={12} />
                      <span>Save Draft to Cache</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-12 text-slate-400 italic text-xs">
                  Select an unlicensed building target from the targets list on the left to launch the inspection report form.
                </div>
              )}
            </>
          )}

        </div>

      </div>

    </div>
  );
};
