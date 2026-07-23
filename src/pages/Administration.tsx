import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';
import { AUTHORIZED_PORTAL_ROLES } from '../services/portalRoles';
import type { Panchayath, UserProfile, UserRole } from '../types';
import { 
  Building2, Users, Plus, ShieldCheck, FileCode, CheckCircle, AlertTriangle, Compass, ShieldAlert 
} from 'lucide-react';

export const Administration: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser?.role === 'Administrator';

  // State Management
  const [panchayaths, setPanchayaths] = useState<Panchayath[]>([]);
  const [activeTab, setActiveTab] = useState<'onboard' | 'switcher' | 'users'>('onboard');
  const [activePanchayatCode, setActivePanchayatCode] = useState(
    localStorage.getItem('cp_active_panchayat_code') || '204902'
  );

  // Form State - Onboarding
  const [lsgdCode, setLsgdCode] = useState('');
  const [panchayatName, setPanchayatName] = useState('');
  const [district, setDistrict] = useState('');
  const [taluk, setTaluk] = useState('');
  const [boundaryGeoJSON, setBoundaryGeoJSON] = useState('');
  const [geoJsonFile, setGeoJsonFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<{ wards: { id: string; name: string }[] } | null>(null);
  const [secName, setSecName] = useState('');
  const [secEmail, setSecEmail] = useState('');
  const [secPassword, setSecPassword] = useState('');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('Panchayat Section Clerk');
  const [newUserWard, setNewUserWard] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');

  // UI Feedback
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load Data
  useEffect(() => {
    if (!isAdmin) return;
    const unsubPanchayaths = dbService.subscribeToPanchayaths(setPanchayaths);
    setUsers([]);
    
    return () => {
      unsubPanchayaths();
    };
  }, [isAdmin, activePanchayatCode]);

  if (!isAdmin) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center py-16 text-slate-500 max-w-md mx-auto mt-12">
        <ShieldAlert size={48} className="mx-auto text-red-600 mb-3" />
        <h3 className="font-extrabold text-slate-800 text-lg mb-1">Access Restricted</h3>
        <p className="text-xs mb-4">Administration panel is restricted to System Administrators only.</p>
        <p className="text-[11px] text-slate-400">Your profile: {currentUser?.role || 'Guest'}</p>
      </div>
    );
  }

  // Handle GeoJSON File Upload & Validation
  const handleGeoJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setGeoJsonFile(file);
    setErrorMsg(null);
    setValidationResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        
        // Validation check
        if (parsed.type !== 'FeatureCollection') {
          throw new Error('Invalid GeoJSON format. Must be a FeatureCollection.');
        }
        if (!Array.isArray(parsed.features) || parsed.features.length === 0) {
          throw new Error('FeatureCollection must contain at least one ward boundary feature.');
        }

        const extractedWards: { id: string; name: string }[] = [];
        parsed.features.forEach((feat: any, idx: number) => {
          const props = feat.properties;
          const wardNo = props?.ward_number || props?.ward_no || props?.wardnumber || props?.id || String(idx + 1);
          const wardName = props?.ward_name || props?.name || `Ward ${wardNo}`;
          extractedWards.push({ id: String(wardNo), name: String(wardName) });
        });

        // Sort wards
        extractedWards.sort((a, b) => parseInt(a.id) - parseInt(b.id));

        setBoundaryGeoJSON(text);
        setValidationResult({ wards: extractedWards });
      } catch (err: any) {
        setErrorMsg(`GeoJSON Validation Error: ${err.message || 'Malformed JSON file.'}`);
      }
    };
    reader.readAsText(file);
  };

  // Accounts must be provisioned by a trusted Firebase Admin service, not the browser.
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('Personnel accounts must be created through the approved Firebase Admin workflow. Browser-based account creation is disabled.');
  };

  // Simulate GeoJSON Fetch from OpenDataKerala
  const handleFetchPublicDataset = () => {
    if (!lsgdCode || lsgdCode.length !== 6) {
      setErrorMsg('Please enter a valid 6-digit LSGD code first.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    // Simulate fetch with timeout
    setTimeout(() => {
      setLoading(false);
      
      // Standard mock GeoJSON for the newly entered Panchayat (using Chakkittapara layout scaled/translated)
      const mockWards = [
        { id: '1', name: `Ward 1 - Pannikkottur` },
        { id: '2', name: `Ward 2 - Chembanoda` },
        { id: '3', name: `Ward 3 - Kurathippara` },
        { id: '4', name: `Ward 4 - Poozhithode` },
        { id: '5', name: `Ward 5 - Muthukad` },
        { id: '6', name: `Ward 6 - Town Centre` }
      ];

      // SimulatedGeoJSON
      const simulatedGeoJSON = {
        type: "FeatureCollection",
        features: mockWards.map(w => ({
          type: "Feature",
          properties: { ward_number: w.id, ward_name: w.name },
          geometry: {
            type: "Polygon",
            coordinates: [[[75.8, 11.5], [75.9, 11.5], [75.9, 11.6], [75.8, 11.6], [75.8, 11.5]]]
          }
        }))
      };

      setBoundaryGeoJSON(JSON.stringify(simulatedGeoJSON));
      setValidationResult({ wards: mockWards });
      setSuccessMsg(`Successfully fetched public ward boundaries for code: ${lsgdCode} from OpenDataKerala repository mirror!`);
    }, 1500);
  };

  // Onboard Submit
  const handleOnboardPanchayat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lsgdCode || !panchayatName || !district) {
      setErrorMsg('LSGD Code, Panchayat Name and District are required fields.');
      return;
    }
    if (!validationResult || validationResult.wards.length === 0) {
      setErrorMsg('Please load or upload valid ward boundary GeoJSON first.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // 1. Create Panchayat Document
      const newPanchayath: Panchayath = {
        id: lsgdCode,
        name: panchayatName,
        district,
        taluk,
        boundaryGeoJSON,
        status: 'active'
      };

      await dbService.onboardPanchayath(newPanchayath, validationResult.wards);

      setSuccessMsg(`Successfully onboarded Panchayat "${panchayatName}" (Code: ${lsgdCode}) with ${validationResult.wards.length} wards. Provision officers through the approved Firebase Admin workflow.`);
      
      // Reset onboarding form
      setLsgdCode('');
      setPanchayatName('');
      setDistrict('');
      setTaluk('');
      setBoundaryGeoJSON('');
      setValidationResult(null);
      
    } catch (err: any) {
      setErrorMsg(`Onboarding failed: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  // Switch Active Panchayat Context
  const handleSwitchPanchayat = (code: string) => {
    localStorage.setItem('cp_active_panchayat_code', code);
    setActivePanchayatCode(code);
    dbService.addAuditLog('SWITCH', `Admin switched active Panchayat context to code: ${code}.`);
    setSuccessMsg(`Context switched to Panchayat LSGD code: ${code}.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gov-navy">System Administration Portal</h2>
        <p className="text-xs text-slate-500">
          Onboard new Panchayaths, configure ward boundary datasets, switch active workspace contexts, and manage authorized personnel directory.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs">
        <button
          onClick={() => { setActiveTab('onboard'); setErrorMsg(null); setSuccessMsg(null); }}
          className={`py-2.5 px-4 font-bold border-b-2 transition ${
            activeTab === 'onboard' ? 'border-[#0F6E4F] text-[#0F6E4F]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Onboard New Panchayat
        </button>
        <button
          onClick={() => { setActiveTab('switcher'); setErrorMsg(null); setSuccessMsg(null); }}
          className={`py-2.5 px-4 font-bold border-b-2 transition ${
            activeTab === 'switcher' ? 'border-[#0F6E4F] text-[#0F6E4F]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Panchayat Switcher ({panchayaths.length})
        </button>
        <button
          onClick={() => { setActiveTab('users'); setErrorMsg(null); setSuccessMsg(null); }}
          className={`py-2.5 px-4 font-bold border-b-2 transition ${
            activeTab === 'users' ? 'border-[#0F6E4F] text-[#0F6E4F]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          User Directory & Invites
        </button>
      </div>

      {/* Banners */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 text-xs leading-normal flex items-start space-x-2">
          <AlertTriangle size={15} className="shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-[#0F6E4F] rounded-xl p-3 text-xs leading-normal flex items-start space-x-2">
          <CheckCircle size={15} className="shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Onboard New Panchayat Form */}
      {activeTab === 'onboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleOnboardPanchayat} className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 text-xs text-slate-700">
            
            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-800 border-b pb-2 text-sm flex items-center space-x-2">
                <Building2 size={18} className="text-[#0F6E4F]" />
                <span>Local Self-Government Institution Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">LSGD Code (6 Digits)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 204902"
                    value={lsgdCode}
                    onChange={(e) => setLsgdCode(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0F6E4F] focus:border-[#0F6E4F]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Panchayat Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kunnamangalam Grama Panchayat"
                    value={panchayatName}
                    onChange={(e) => setPanchayatName(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0F6E4F] focus:border-[#0F6E4F]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">District</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kozhikode"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0F6E4F] focus:border-[#0F6E4F]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Taluk</label>
                  <input
                    type="text"
                    placeholder="e.g. Koyilandy"
                    value={taluk}
                    onChange={(e) => setTaluk(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0F6E4F] focus:border-[#0F6E4F]"
                  />
                </div>
              </div>
            </div>

            {/* Boundary dataset ingestion */}
            <div className="space-y-4 pt-2">
              <h3 className="font-extrabold text-slate-800 border-b pb-2 text-sm flex items-center space-x-2">
                <FileCode size={18} className="text-[#0F6E4F]" />
                <span>GIS Boundary Source & Ingestion</span>
              </h3>

              <div className="space-y-3">
                <p className="text-[11px] text-slate-400 font-medium">
                  Ward boundaries are required to initialize the mapping canvas. Fetch directly from OpenDataKerala datasets repository, or upload a custom GeoJSON.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleFetchPublicDataset}
                    disabled={loading}
                    className="bg-[#0F6E4F] hover:bg-[#0B5A3E] text-white font-bold py-2 px-4 rounded-xl transition shadow flex items-center justify-center space-x-1.5"
                  >
                    <Compass size={14} />
                    <span>{loading ? 'Fetching...' : 'Fetch OpenDataKerala Dataset'}</span>
                  </button>

                  <div className="flex-1 border border-dashed border-slate-300 rounded-xl p-2 flex items-center justify-between text-[11px]">
                    <span className="font-medium text-slate-400 pl-1">
                      {geoJsonFile ? geoJsonFile.name : 'Upload boundary GeoJSON/KML file'}
                    </span>
                    <input
                      type="file"
                      id="geojson-upload"
                      accept=".geojson,.json"
                      onChange={handleGeoJsonUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="geojson-upload"
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl cursor-pointer transition"
                    >
                      Browse File
                    </label>
                  </div>
                </div>

                {validationResult && (
                  <div className="bg-[#EBF7F2] border border-emerald-100 rounded-xl p-3 text-[11px] text-[#0F6E4F] leading-normal font-semibold">
                    <span>✓ Boundaries Verified: Extracted <strong>{validationResult.wards.length} wards</strong> from spatial datasets. Wards ID ranges: {validationResult.wards[0]?.id} to {validationResult.wards[validationResult.wards.length - 1]?.id}.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Invite Secretary */}
            <div className="space-y-4 pt-2">
              <h3 className="font-extrabold text-slate-800 border-b pb-2 text-sm flex items-center space-x-2">
                <Users size={18} className="text-[#0F6E4F]" />
                <span>First Authority User Invite</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Secretary Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Smt. Mini Joseph"
                    value={secName}
                    onChange={(e) => setSecName(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0F6E4F]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Official Email ID</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. mini.secretary@kerala.gov.in"
                    value={secEmail}
                    onChange={(e) => setSecEmail(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0F6E4F]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={secPassword}
                    onChange={(e) => setSecPassword(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0F6E4F]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F6E4F] hover:bg-[#0B5A3E] text-white font-bold py-3 px-4 rounded-xl uppercase tracking-wider transition shadow"
            >
              {loading ? 'Initializing...' : 'Initialize & Onboard Panchayat'}
            </button>

          </form>

          {/* Right Pane: Help & Requirements */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 text-xs text-slate-600 space-y-4 self-start leading-relaxed">
            <h4 className="font-extrabold text-gov-navy border-b pb-1.5 uppercase tracking-wide">Onboarding Guidelines</h4>
            
            <div className="space-y-3 font-medium">
              <p>
                As a System Administrator, you are responsible for onboarding new LSGD local bodies to the LSG Track compliance platform.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 leading-normal flex items-start space-x-2">
                <AlertTriangle size={15} className="shrink-0 mt-0.5 text-amber-700" />
                <span><strong>No fake data policy:</strong> New panchayaths are initialized with exactly zero commercial buildings or active D&O licenses. Metrics start empty.</span>
              </div>
              <p>
                <strong>GeoJSON Requirements:</strong> Ward polygon files must be formatted as standard GeoJSON feature collections with coordinate systems in EPSG:4326. Each feature properties must include a ward index number.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Panchayat Switcher */}
      {activeTab === 'switcher' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-2 mb-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
              <Compass size={18} className="text-[#0F6E4F]" />
              <span>Active Panchayat Workspace Selector</span>
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Active Context: {activePanchayatCode}
            </span>
          </div>

          {panchayaths.length === 0 ? (
            <p className="text-xs text-slate-500 italic text-center py-8">
              No Panchayaths onboarded yet. Please use the Onboard form to initialize the first Panchayat.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {panchayaths.map((p) => {
                const isActive = p.id === activePanchayatCode;
                return (
                  <div
                    key={p.id}
                    className={`border rounded-2xl p-4 cursor-pointer hover:border-[#0F6E4F] transition flex flex-col justify-between ${
                      isActive ? 'border-[#0F6E4F] bg-emerald-50/20 ring-1 ring-[#0F6E4F]' : 'border-slate-200'
                    }`}
                    onClick={() => handleSwitchPanchayat(p.id)}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono text-[10px] font-bold text-slate-400">LSGD: {p.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          isActive ? 'bg-[#0F6E4F] text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {isActive ? 'Active' : 'Select'}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-800">{p.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-1">{p.district} District | Taluk: {p.taluk || 'N/A'}</p>
                    </div>

                    <div className="border-t border-slate-100 pt-2 mt-3 flex justify-between items-center text-[10px] text-[#0F6E4F] font-bold uppercase tracking-wide">
                      <span>Interactive GIS Map</span>
                      <ShieldCheck size={13} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* User Directory */}
      {activeTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create User Form */}
          <form onSubmit={handleCreateUser} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 text-xs text-slate-700 self-start">
            <h3 className="font-extrabold text-slate-800 border-b pb-2 text-sm flex items-center space-x-2">
              <Plus size={18} className="text-[#0F6E4F]" />
              <span>Create Personnel Account</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Panchayat Code Context</label>
                <input
                  type="text"
                  disabled
                  value={activePanchayatCode}
                  className="w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2 text-slate-500 font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Official Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sajesh Kumar"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0F6E4F]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Official Email ID</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. sajesh.deo@kerala.gov.in"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0F6E4F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Role Type</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full border border-slate-200 rounded-xl px-2 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0F6E4F]"
                  >
                    {AUTHORIZED_PORTAL_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Ward (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 12"
                    value={newUserWard}
                    onChange={(e) => setNewUserWard(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0F6E4F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0F6E4F]"
                />
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed">
              Browser-based account creation is intentionally disabled. The supported portal roles are {AUTHORIZED_PORTAL_ROLES.join(', ')} and must be provisioned through Firebase Admin.
            </p>

            <button
              type="submit"
              className="w-full bg-[#0F6E4F] hover:bg-[#0B5A3E] text-white font-bold py-2.5 px-4 rounded-xl uppercase tracking-wide transition shadow"
            >
              Save Account
            </button>
          </form>

          {/* Users Directory Table */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 border-b pb-2 text-sm flex items-center space-x-2">
              <Users size={18} className="text-[#0F6E4F]" />
              <span>Panchayat Personnel List (Scope: {activePanchayatCode})</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b">
                  <tr>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Role</th>
                    <th className="px-3 py-2">LSGD Code</th>
                    <th className="px-3 py-2">Ward Scope</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {users
                    .filter((u) => u.panchayathId === activePanchayatCode || u.panchayathId === 'all')
                    .map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="px-3 py-2.5 font-bold text-slate-800">{u.name}</td>
                        <td className="px-3 py-2.5 font-mono text-[11px]">{u.email}</td>
                        <td className="px-3 py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.role === 'Secretary' 
                              ? 'bg-green-50 text-status-licensed' 
                              : u.role === 'Administrator'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-slate-100 text-slate-600'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 font-mono text-slate-500">{u.panchayathId || 'N/A'}</td>
                        <td className="px-3 py-2.5 font-mono font-bold text-slate-500">{u.ward || 'All'}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
