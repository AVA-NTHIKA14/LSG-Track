import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import L from 'leaflet';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';
import type { BuildingRecord, SurveyRecord, WardReportRecord } from '../types';
import { 
  ClipboardCheck, CheckCircle, WifiOff, 
  RefreshCw, ShieldAlert, MapPin, Send,
  Camera, X, History, FileText
} from 'lucide-react';

interface LocalReportDraft {
  id: string;
  businessName: string;
  ownerName: string;
  category: string;
  wardNumber: string;
  gps: { lat: number; lng: number };
  photoUrl?: string;
  remarks: string;
  surveyDate: string;
}

export const Survey: React.FC = () => {
  const location = useLocation();
  const currentUser = authService.getCurrentUser();
  const assignedWard = currentUser?.ward || '1';
  const role = currentUser?.role || 'Guest';

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  const [submittedReports, setSubmittedReports] = useState<WardReportRecord[]>([]);

  // Form State
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [category, setCategory] = useState('Retail');
  const [customCategory, setCustomCategory] = useState('');
  const [remarks, setRemarks] = useState('');
  const [lat, setLat] = useState<number>(11.57547);
  const [lng, setLng] = useState<number>(75.81649);

  // Geotagged Camera State
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Field Inspection State
  const [activeBuilding, setActiveBuilding] = useState<BuildingRecord | null>(null);
  const veoMapContainerRef = useRef<HTMLDivElement>(null);
  const veoMapRef = useRef<L.Map | null>(null);

  // Offline Drafts State
  const [localDrafts, setLocalDrafts] = useState<LocalReportDraft[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Read URL query parameters for tab navigation
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === 'history') {
      setActiveTab('history');
    }
  }, [location.search]);

  useEffect(() => {
    const unsubBuildings = dbService.subscribeToBuildings(() => {});
    const unsubReports = dbService.subscribeToWardReports((reports) => {
      setSubmittedReports(reports);
    });

    const savedDrafts = localStorage.getItem('cp_unlicensed_report_drafts');
    if (savedDrafts) {
      setLocalDrafts(JSON.parse(savedDrafts));
    }

    return () => {
      unsubBuildings();
      unsubReports();
    };
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;

        // Draw original photo
        ctx.drawImage(img, 0, 0);

        // Watermark Geotag Overlay Banner
        const timestamp = new Date().toLocaleString();
        const geotagText = `GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)} | ${timestamp}`;

        const bannerHeight = Math.max(44, Math.floor(img.height * 0.09));
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(0, img.height - bannerHeight, img.width, bannerHeight);

        ctx.fillStyle = '#10B981'; // Emerald GPS dot
        ctx.beginPath();
        ctx.arc(20, img.height - bannerHeight / 2, 6, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        const fontSize = Math.max(14, Math.floor(bannerHeight * 0.42));
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.fillText(geotagText, 34, img.height - bannerHeight / 2);

        const watermarked = canvas.toDataURL('image/jpeg', 0.85);
        setPhotoUrl(watermarked);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // VEO Field Map Initialization
  useEffect(() => {
    if (role !== 'Panchayat Section Clerk' || !activeBuilding || !veoMapContainerRef.current) return;

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
      L.marker([lat, lng]).addTo(map).bindPopup(activeBuilding.businessName).openPopup();
    } catch (err) {
      console.warn("Leaflet map init failed: ", err);
    }

    return () => {
      if (veoMapRef.current) {
        veoMapRef.current.remove();
        veoMapRef.current = null;
      }
    };
  }, [activeBuilding, lat, lng, role]);

  const handleGetGPS = () => {
    const offsetLat = +(Math.random() * 0.006 - 0.003).toFixed(5);
    const offsetLng = +(Math.random() * 0.006 - 0.003).toFixed(5);
    setLat(+(11.57547 + offsetLat).toFixed(5));
    setLng(+(75.81649 + offsetLng).toFixed(5));
  };

  const clearForm = () => {
    setBusinessName('');
    setOwnerName('');
    setCategory('Retail');
    setCustomCategory('');
    setRemarks('');
    setPhotoUrl(null);
    setLat(11.57547);
    setLng(75.81649);
    setActiveBuilding(null);
  };

  // --- WARD MEMBER ACTION: SAVE DRAFT ---
  const handleSaveMemberDraft = () => {
    const finalCategory = category === 'Others' ? (customCategory.trim() || 'Others') : category;
    if (!businessName || !finalCategory) {
      alert('Please fill in business name and category to save draft.');
      return;
    }

    const newDraft: LocalReportDraft = {
      id: 'DRAFT-' + Date.now(),
      businessName,
      ownerName: ownerName || 'Proprietor',
      category: finalCategory,
      wardNumber: assignedWard,
      gps: { lat, lng },
      photoUrl: photoUrl || undefined,
      remarks,
      surveyDate: new Date().toISOString().split('T')[0]
    };

    const updated = [...localDrafts, newDraft];
    setLocalDrafts(updated);
    localStorage.setItem('cp_unlicensed_report_drafts', JSON.stringify(updated));
    setSuccessMsg(`Draft saved in local browser storage.`);
    clearForm();
  };

  // --- WARD MEMBER ACTION: SUBMIT REPORT ---
  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isOffline) {
      handleSaveMemberDraft();
      return;
    }

    const finalCategory = category === 'Others' ? (customCategory.trim() || 'Others') : category;
    const buildingId = 'BLDG-' + Math.floor(1000 + Math.random() * 9000);

    const buildingData: Omit<BuildingRecord, 'history'> = {
      id: buildingId,
      ownerName: ownerName || 'Proprietor',
      businessName,
      category: finalCategory,
      wardNumber: assignedWard,
      coordinates: { lat, lng },
      photoUrl: photoUrl || undefined,
      status: 'unlicensed',
      remarks
    };

    await dbService.addBuilding(buildingData);

    const surveyData: Omit<SurveyRecord, 'id' | 'officerId' | 'officerName' | 'surveyDate'> = {
      buildingId,
      gps: { lat, lng },
      photoUrl: photoUrl || undefined,
      status: 'submitted',
      remarks: `[Ward Member Survey] ${remarks}`,
      isSynced: true
    };

    await dbService.addSurvey(surveyData);

    await dbService.addWardReport({
      businessName,
      ownerName: ownerName || 'Proprietor',
      category: finalCategory,
      wardNumber: assignedWard,
      coordinates: { lat, lng },
      photoUrl: photoUrl || undefined,
      landmark: remarks,
      reporterId: currentUser?.id || 'usr-ward',
      reporterName: currentUser?.name || 'Ward Member',
      remarks
    });

    setSuccessMsg(`Report submitted to Panchayat Secretary verification queue.`);
    clearForm();
  };

  // --- SYNC DRAFTS HANDLER ---
  const handleSyncDrafts = async () => {
    if (localDrafts.length === 0) return;
    setSyncing(true);

    setTimeout(async () => {
      for (const draft of localDrafts) {
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

        await dbService.addWardReport({
          businessName: draft.businessName,
          ownerName: draft.ownerName,
          category: draft.category,
          wardNumber: draft.wardNumber,
          coordinates: draft.gps,
          landmark: draft.remarks,
          reporterId: currentUser?.id || 'usr-ward',
          reporterName: currentUser?.name || 'Ward Member',
          remarks: draft.remarks
        });
      }

      setLocalDrafts([]);
      localStorage.removeItem('cp_unlicensed_report_drafts');
      setSyncing(false);
      setSuccessMsg(`Synced ${localDrafts.length} offline drafts successfully.`);
    }, 1200);
  };

  const isAuthorized = role === 'Panchayat Section Clerk' || role === 'Ward Member' || role === 'Administrator';
  if (!isAuthorized) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center max-w-md mx-auto my-12 shadow-sm">
        <ShieldAlert size={40} className="mx-auto text-red-600 mb-3" />
        <h3 className="font-extrabold text-slate-900 text-base">Access Restricted</h3>
        <p className="text-xs text-slate-500 mt-2">
          The Field Inspection & Ward Reporting Terminal is restricted to Data Entry Operators, Ward Members, and Administrators.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-2">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <ClipboardCheck size={22} className="text-[#0F6E4F]" />
            <span>
              {activeTab === 'history'
                ? 'My Submitted Field Reports'
                : role === 'Ward Member'
                ? 'Report Suspected Unlicensed Business'
                : 'Field Inspection Terminal'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeTab === 'history'
              ? `Verification status & audit log of reports submitted for Ward ${assignedWard}`
              : role === 'Ward Member'
              ? `Field reporting workspace for Ward Member (Ward ${assignedWard})`
              : 'Physical site verification terminal for Panchayat Section Clerk.'}
          </p>
        </div>

        <button
          onClick={() => setIsOffline(!isOffline)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition uppercase border ${
            isOffline ? 'bg-red-50 text-red-800 border-red-200' : 'bg-emerald-50 text-[#0F6E4F] border-emerald-200'
          }`}
        >
          {isOffline ? <WifiOff size={14} /> : <RefreshCw size={14} />}
          <span>{isOffline ? 'Offline Mode' : 'Network Active'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-[#0F6E4F] text-xs font-extrabold p-3.5 rounded-2xl flex items-center space-x-2">
          <CheckCircle size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tab 2: My Submitted Reports History Workspace */}
      {activeTab === 'history' ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="border-b pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm tracking-tight flex items-center space-x-2">
                <History size={16} className="text-[#0F6E4F]" />
                <span>My Submitted Field Reports History</span>
              </h3>
              <p className="text-xs text-slate-500">Track verification status of reports submitted to Panchayat Secretary.</p>
            </div>
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-xl">
              Total Reports: {submittedReports.length}
            </span>
          </div>

          {submittedReports.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-2">
              <FileText size={36} className="mx-auto text-slate-300" />
              <p className="text-xs font-semibold">No field reports submitted yet.</p>
              <button
                onClick={() => setActiveTab('new')}
                className="bg-[#0F6E4F] text-white px-4 py-2 rounded-xl text-xs font-extrabold shadow-sm"
              >
                Submit First Report
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {submittedReports.map(report => (
                <div key={report.id} className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-slate-50/50 hover:bg-slate-50 transition shadow-2xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400">Ward {report.wardNumber}</span>
                      <h4 className="font-extrabold text-slate-900 text-sm">{report.businessName}</h4>
                    </div>
                    {report.status === 'pending_verification' && (
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                        Pending Verification
                      </span>
                    )}
                    {report.status === 'verified_licensed' && (
                      <span className="bg-emerald-100 text-[#0F6E4F] text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                        Verified Licensed
                      </span>
                    )}
                    {report.status === 'confirmed_unlicensed' && (
                      <span className="bg-red-100 text-red-900 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                        Confirmed Unlicensed
                      </span>
                    )}
                    {report.status === 'closed' && (
                      <span className="bg-slate-200 text-slate-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                        Closed
                      </span>
                    )}
                  </div>

                  {report.photoUrl && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 h-28">
                      <img src={report.photoUrl} alt={report.businessName} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-white text-[9px] font-mono px-2 py-0.5 flex justify-between">
                        <span>📍 GPS Stamped</span>
                        <span>{report.coordinates.lat.toFixed(4)}, {report.coordinates.lng.toFixed(4)}</span>
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-slate-600 space-y-1 font-medium">
                    <div><strong className="text-slate-700">Category:</strong> {report.category}</div>
                    <div><strong className="text-slate-700">Proprietor:</strong> {report.ownerName || 'Proprietor'}</div>
                    {report.landmark && <div><strong className="text-slate-700">Remarks:</strong> {report.landmark}</div>}
                    <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-200 flex justify-between">
                      <span>Reported: {new Date(report.createdAt).toLocaleDateString()}</span>
                      <span>By: {report.reporterName}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Main Grid Form */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form Container (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <form onSubmit={handleMemberSubmit} className="space-y-4 text-xs font-medium">
            
            <div>
              <label className="block text-slate-900 font-extrabold mb-1">Business / Establishment Name *</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                placeholder="e.g. Royal General Store"
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#0F6E4F] focus:ring-1 focus:ring-[#0F6E4F]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-900 font-extrabold mb-1">Proprietor / Owner Name</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={e => setOwnerName(e.target.value)}
                  placeholder="e.g. Suresh Kumar"
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#0F6E4F] focus:ring-1 focus:ring-[#0F6E4F]"
                />
              </div>

              <div>
                <label className="block text-slate-900 font-extrabold mb-1">Business Category *</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#0F6E4F] focus:ring-1 focus:ring-[#0F6E4F]"
                >
                  <option value="Retail">Retail Store / Supermarket</option>
                  <option value="Hotel/Restaurant">Hotel / Restaurant / Eatery</option>
                  <option value="Textiles">Textiles & Garments</option>
                  <option value="Workshop">Automobile Workshop</option>
                  <option value="Bakery">Bakery / Confectionery</option>
                  <option value="General Trade">General Trade</option>
                  <option value="Others">Others (Specify category below)</option>
                </select>

                {category === 'Others' && (
                  <div className="mt-2.5">
                    <label className="block text-slate-900 font-extrabold mb-1">Specify Custom Business Category *</label>
                    <input
                      type="text"
                      required
                      value={customCategory}
                      onChange={e => setCustomCategory(e.target.value)}
                      placeholder="e.g. Chemical Processing / Storage Unit"
                      className="w-full border border-[#0F6E4F] bg-emerald-50/40 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#0F6E4F]"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* GPS Location Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-slate-900 flex items-center space-x-1.5">
                  <MapPin size={14} className="text-[#0F6E4F]" />
                  <span>Onsite GPS Location Coordinates</span>
                </span>
                <button
                  type="button"
                  onClick={handleGetGPS}
                  className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-3 py-1 rounded-xl text-[11px] font-bold transition shadow-sm"
                >
                  Capture Live GPS
                </button>
              </div>
              <div className="font-mono text-slate-700 text-xs bg-white p-2 rounded-xl border border-slate-200 flex justify-between">
                <span>Lat: {lat.toFixed(5)}</span>
                <span>Lng: {lng.toFixed(5)}</span>
              </div>
            </div>

            {/* Geotagged Camera Photo Upload Field */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-slate-900 flex items-center space-x-1.5">
                  <Camera size={15} className="text-[#0F6E4F]" />
                  <span>Geotagged Establishment Photograph</span>
                </span>

                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white hover:bg-slate-100 text-[#0F6E4F] border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center space-x-1.5 shadow-sm"
                >
                  <Camera size={14} />
                  <span>{photoUrl ? 'Retake Photo' : 'Capture / Upload Photo'}</span>
                </button>
              </div>

              {photoUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-300 shadow-sm group">
                  <img src={photoUrl} alt="Geotagged building photo" className="w-full h-44 object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotoUrl(null)}
                    className="absolute top-2.5 right-2.5 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-md transition"
                    title="Remove Photo"
                  >
                    <X size={14} />
                  </button>
                  <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-white px-3 py-1.5 text-[11px] font-mono flex justify-between items-center">
                    <span>📍 Geotagged: Lat {lat.toFixed(5)}, Lng {lng.toFixed(5)}</span>
                    <span className="text-emerald-400 font-bold">GPS Stamped</span>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-[#0F6E4F] bg-white rounded-2xl p-5 text-center cursor-pointer transition space-y-1"
                >
                  <Camera size={22} className="mx-auto text-slate-400" />
                  <p className="text-xs font-bold text-slate-700">Click to capture building photo with camera</p>
                  <p className="text-[10px] text-slate-400">Onsite GPS coordinates (Lat: {lat.toFixed(5)}, Lng: {lng.toFixed(5)}) will be stamped on photo</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-slate-900 font-extrabold mb-1">Landmark / Field Remarks</label>
              <textarea
                rows={3}
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                placeholder="e.g. Near Bus Stand, operating without displayed license board..."
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#0F6E4F] focus:ring-1 focus:ring-[#0F6E4F]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleSaveMemberDraft}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-4 py-2 rounded-xl font-extrabold text-xs transition"
              >
                Save Offline Draft
              </button>

              <button
                type="submit"
                className="bg-[#0F6E4F] hover:bg-[#0B5A3E] text-white px-6 py-2.5 rounded-xl font-extrabold text-xs transition shadow-sm flex items-center space-x-1.5"
              >
                <Send size={14} />
                <span>Submit Field Report</span>
              </button>
            </div>

          </form>
        </div>

        {/* Offline Cache & Sync Box (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="border-b pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Offline Draft Cache ({localDrafts.length})</h3>
              <p className="text-xs text-slate-500">Local reports awaiting internet sync.</p>
            </div>

            {localDrafts.length > 0 && (
              <button
                onClick={handleSyncDrafts}
                disabled={syncing}
                className="bg-[#0F6E4F] hover:bg-[#0B5A3E] text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1"
              >
                <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} />
                <span>Sync Now</span>
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 text-xs">
            {localDrafts.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <CheckCircle size={32} className="mx-auto text-emerald-500 mb-1" />
                <p>All field reports synchronized to server.</p>
              </div>
            ) : (
              localDrafts.map(d => (
                <div key={d.id} className="border border-slate-200 rounded-2xl p-3 bg-slate-50 space-y-1">
                  <div className="font-extrabold text-slate-900">{d.businessName}</div>
                  <div className="text-slate-600">Ward {d.wardNumber} • {d.category}</div>
                  <div className="text-slate-400 font-mono text-[10px]">{d.gps.lat.toFixed(4)}, {d.gps.lng.toFixed(4)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      )}

    </div>
  );
};
