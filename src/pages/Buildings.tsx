import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Plus, Search, Trash2, ShieldAlert, CheckCircle, 
  Upload, FileText, Lock, RefreshCw, AlertTriangle, 
  Building2, Table2, Grid, Download, Printer, Check, Save
} from 'lucide-react';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';
import type { BuildingRecord, WardRecord } from '../types';

// Zod Schema for Building Registration
const buildingFormSchema = z.object({
  id: z.string().min(4, 'Building ID must be at least 4 characters (e.g. BLDG-402)'),
  ownerName: z.string().min(3, 'Owner Name is required'),
  businessName: z.string().min(3, 'Business/Establishment name is required'),
  category: z.string().min(2, 'Please specify category'),
  wardNumber: z.string().min(1, 'Please select ward'),
  lat: z.preprocess((val) => parseFloat(val as string) || 0, z.number().min(11.5, 'Must be in Chakkittapara coordinates').max(11.7, 'Must be in Chakkittapara coordinates')),
  lng: z.preprocess((val) => parseFloat(val as string) || 0, z.number().min(75.7, 'Must be in Chakkittapara coordinates').max(75.9, 'Must be in Chakkittapara coordinates')),
  remarks: z.string().optional()
});

type BuildingFormData = z.infer<typeof buildingFormSchema>;

export const Buildings: React.FC = () => {
  const [buildings, setBuildings] = useState<BuildingRecord[]>([]);
  const [wards, setWards] = useState<WardRecord[]>([]);
  
  // UI Tabs & Active selections
  const [activeTab, setActiveTab] = useState<'directory' | 'register' | 'edit'>('directory');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingRecord | null>(null);
  
  // Search & Filters (Admin view only)
  const [searchQuery, setSearchQuery] = useState('');
  const [filterWard, setFilterWard] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // DEO Document/Photo uploads simulator states
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [docName, setDocName] = useState('');
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Previous License Data Entry Import State
  const [showPrevLicense, setShowPrevLicense] = useState(false);
  const [prevLicenseNum, setPrevLicenseNum] = useState('');
  const [prevLicenseIssue, setPrevLicenseIssue] = useState('');
  const [prevLicenseExpiry, setPrevLicenseExpiry] = useState('');
  const [prevLicenseFee, setPrevLicenseFee] = useState('1000');
  const [isNgoStatus, setIsNgoStatus] = useState(false);

  // Initialize DB Subscriptions
  useEffect(() => {
    const unsubBuildings = dbService.subscribeToBuildings(setBuildings);
    const unsubWards = dbService.subscribeToWards(setWards);
    return () => {
      unsubBuildings();
      unsubWards();
    };
  }, []);

  const currentUser = authService.getCurrentUser();
  const isDEO = currentUser?.role === 'Data Entry Operator';
  const isAdmin = currentUser?.role === 'Administrator';

  // React Hook Form for registering
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<BuildingFormData>({
    resolver: zodResolver(buildingFormSchema),
    defaultValues: {
      lat: 11.57547,
      lng: 75.81649
    }
  });

  // GPS Simulators
  const handleCaptureGPS = () => {
    const mockLat = +(11.57 + Math.random() * 0.015).toFixed(5);
    const mockLng = +(75.81 + Math.random() * 0.015).toFixed(5);
    setValue('lat', mockLat);
    setValue('lng', mockLng);
  };

  const handleCaptureGPSEdit = () => {
    if (!selectedBuilding) return;
    const mockLat = +(11.57 + Math.random() * 0.015).toFixed(5);
    const mockLng = +(75.81 + Math.random() * 0.015).toFixed(5);
    setSelectedBuilding({
      ...selectedBuilding,
      coordinates: { lat: mockLat, lng: mockLng }
    });
  };

  // --- SUBMIT NEW BUILDING WORKFLOWS (DEO ONLY) ---
  const saveBuildingDraft = async (data: BuildingFormData) => {
    try {
      let bldgStatus: any = 'unlicensed';
      if (isNgoStatus) bldgStatus = 'ngo';
      else if (showPrevLicense) bldgStatus = 'licensed';

      const bldgRecord: Omit<BuildingRecord, 'history'> = {
        id: data.id,
        ownerName: data.ownerName,
        businessName: data.businessName,
        category: data.category,
        wardNumber: data.wardNumber,
        coordinates: { lat: data.lat, lng: data.lng },
        status: bldgStatus,
        remarks: data.remarks || '',
        attachments: [],
        isReturnedForCorrection: false
      };
      
      await dbService.addBuilding(bldgRecord);

      if (showPrevLicense) {
        const licId = prevLicenseNum || ('LIC-HIST-' + Math.floor(1000 + Math.random() * 9000));
        await dbService.addHistoricalLicense({
          id: licId,
          buildingId: data.id,
          licenseType: 'Imported Legacy D&O License',
          issueDate: prevLicenseIssue || new Date().toISOString().split('T')[0],
          expiryDate: prevLicenseExpiry || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
          status: new Date(prevLicenseExpiry) > new Date() ? 'active' : 'expired',
          feePaid: parseInt(prevLicenseFee) || 1000
        });
      }

      setFormSuccess(`Draft "${data.businessName}" saved successfully.`);
      reset();
      setShowPrevLicense(false);
      setPrevLicenseNum('');
      setPrevLicenseIssue('');
      setPrevLicenseExpiry('');
      setIsNgoStatus(false);

      setTimeout(() => {
        setFormSuccess(null);
        setActiveTab('directory');
      }, 1500);
    } catch (err) {
      console.error(err);
    }
  };

  const submitBuildingForVerification = async (data: BuildingFormData) => {
    try {
      let bldgStatus: any = 'pending';
      if (isNgoStatus) bldgStatus = 'ngo';
      else if (showPrevLicense) bldgStatus = 'licensed';

      const bldgRecord: Omit<BuildingRecord, 'history'> = {
        id: data.id,
        ownerName: data.ownerName,
        businessName: data.businessName,
        category: data.category,
        wardNumber: data.wardNumber,
        coordinates: { lat: data.lat, lng: data.lng },
        status: bldgStatus,
        remarks: data.remarks || '',
        attachments: [],
        submittedAt: new Date().toISOString().split('T')[0],
        isReturnedForCorrection: false
      };

      await dbService.addBuilding(bldgRecord);

      if (showPrevLicense) {
        const licId = prevLicenseNum || ('LIC-HIST-' + Math.floor(1000 + Math.random() * 9000));
        await dbService.addHistoricalLicense({
          id: licId,
          buildingId: data.id,
          licenseType: 'Imported Legacy D&O License',
          issueDate: prevLicenseIssue || new Date().toISOString().split('T')[0],
          expiryDate: prevLicenseExpiry || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
          status: new Date(prevLicenseExpiry) > new Date() ? 'active' : 'expired',
          feePaid: parseInt(prevLicenseFee) || 1000
        });
      } else {
        // Trigger verification survey automatically
        await dbService.addSurvey({
          buildingId: data.id,
          gps: { lat: data.lat, lng: data.lng },
          status: 'submitted',
          remarks: `[DEO System Submit] Submitted for official compliance review.`,
          isSynced: true
        });
      }

      setFormSuccess(`Building "${data.businessName}" submitted successfully.`);
      reset();
      setShowPrevLicense(false);
      setPrevLicenseNum('');
      setPrevLicenseIssue('');
      setPrevLicenseExpiry('');
      setIsNgoStatus(false);

      setTimeout(() => {
        setFormSuccess(null);
        setActiveTab('directory');
      }, 1500);
    } catch (err) {
      console.error(err);
    }
  };

  // --- EDIT EXISTING BUILDING UPDATES (DEO ONLY) ---
  const handleSaveDraftUpdate = async () => {
    if (!selectedBuilding) return;
    await dbService.updateBuilding(selectedBuilding.id, {
      ownerName: selectedBuilding.ownerName,
      businessName: selectedBuilding.businessName,
      category: selectedBuilding.category,
      wardNumber: selectedBuilding.wardNumber,
      coordinates: selectedBuilding.coordinates,
      remarks: selectedBuilding.remarks
    });
    setFormSuccess('Draft changes saved successfully.');
    setTimeout(() => {
      setFormSuccess(null);
      setActiveTab('directory');
      setSelectedBuilding(null);
    }, 1500);
  };

  const handleSubmitDraftUpdate = async () => {
    if (!selectedBuilding) return;
    
    // Update fields and transition status to pending
    await dbService.updateBuilding(selectedBuilding.id, {
      ownerName: selectedBuilding.ownerName,
      businessName: selectedBuilding.businessName,
      category: selectedBuilding.category,
      wardNumber: selectedBuilding.wardNumber,
      coordinates: selectedBuilding.coordinates,
      remarks: selectedBuilding.remarks,
      status: 'pending',
      submittedAt: new Date().toISOString().split('T')[0],
      isReturnedForCorrection: false
    });

    // Create verification survey
    await dbService.addSurvey({
      buildingId: selectedBuilding.id,
      gps: selectedBuilding.coordinates,
      status: 'submitted',
      remarks: `[DEO Draft Submit] Submitted draft for compliance verification.`,
      isSynced: true
    });

    setFormSuccess('Record submitted. Sent to Secretary approval queue. Locked as Read-Only.');
    setTimeout(() => {
      setFormSuccess(null);
      setActiveTab('directory');
      setSelectedBuilding(null);
    }, 1500);
  };

  // --- DEO FILE UPLOADS SIMULATORS ---
  const handleSimulatePhotoUpload = () => {
    if (!selectedBuilding) return;
    setUploadingPhoto(true);
    setTimeout(async () => {
      const mockPhoto = `/C:/Users/OWNER/.gemini/antigravity/brain/82577a0c-f16e-4876-ae36-cca2dc96e487/lsgd_dashboard_preview_1782612914864.jpg`;
      await dbService.updateBuilding(selectedBuilding.id, {
        photoUrl: mockPhoto
      });
      setSelectedBuilding({
        ...selectedBuilding,
        photoUrl: mockPhoto
      });
      setUploadingPhoto(false);
      alert('Mock photograph uploaded successfully.');
    }, 1000);
  };

  const handleSimulateDocUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBuilding || !docName.trim()) return;
    setUploadingDoc(true);
    
    setTimeout(async () => {
      const newAttachment = {
        name: docName,
        url: '#',
        uploadedAt: new Date().toISOString().split('T')[0]
      };
      
      const updatedAttachments = [...(selectedBuilding.attachments || []), newAttachment];
      
      await dbService.updateBuilding(selectedBuilding.id, {
        attachments: updatedAttachments
      });

      setSelectedBuilding({
        ...selectedBuilding,
        attachments: updatedAttachments
      });

      setUploadingDoc(false);
      setDocName('');
      alert(`Mock document "${docName}" attached to building file.`);
    }, 1000);
  };

  // --- DELETE BUILDING (ADMIN ONLY) ---
  const handleDeleteBuilding = async (id: string) => {
    if (window.confirm(`Are you sure you want to archive and remove Building Record ${id}?`)) {
      await dbService.deleteBuilding(id);
      setSelectedBuilding(null);
    }
  };

  // --- DATA FILTERING BY ROLE ---
  // 1. Data Entry Operator: Can ONLY browse records they created or assigned to them
  const myScopeBuildings = isDEO 
    ? buildings.filter(b => b.createdBy === currentUser?.id || b.assignedTo === currentUser?.id)
    : buildings;

  // 2. Filter query matching for rendering
  const filteredBuildings = myScopeBuildings.filter(b => {
    const matchSearch = 
      b.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchWard = filterWard === 'all' || b.wardNumber === filterWard;
    const matchStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchCategory = filterCategory === 'all' || b.category.toLowerCase().includes(filterCategory.toLowerCase());

    return matchSearch && matchWard && matchStatus && matchCategory;
  });

  // Admin Export/Print actions
  const triggerExport = (format: string) => {
    dbService.addAuditLog('EXPORT', `Exported building registry reports in ${format} format.`);
    alert(`Generating ${format} file matching ${filteredBuildings.length} records.`);
  };

  // Block unauthorized roles (Secretary, Ward Member, VEO, Guest from this page)
  if (!isDEO && !isAdmin) {
    return (
      <div className="bg-white border border-gov-border rounded p-6 shadow-sm text-center py-12 text-slate-500 italic text-xs max-w-md mx-auto mt-12">
        <ShieldAlert size={36} className="mx-auto text-red-700 mb-2" />
        <p className="font-bold text-slate-800 text-sm mb-1">ACCESS RESTRICTED</p>
        <p className="mb-4">This building registry and management portal is restricted to Panchayat Staff (Data Entry Operators) and Administrators.</p>
        <p>Your current profile ({currentUser?.role || 'Guest'}) does not hold access to this interface.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 gap-2 no-print">
        <div>
          {isDEO ? (
            <>
              <h2 className="text-xl font-bold text-gov-navy">Data Entry Portal</h2>
              <p className="text-xs text-slate-500">Official workplace to register buildings, edit draft items, upload documents, and dispatch verification logs.</p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gov-navy">Building Registry File</h2>
              <p className="text-xs text-slate-500">Complete catalog of commercial building assets and license compliance statuses.</p>
            </>
          )}
        </div>
        
        {/* Tab switchers */}
        <div className="flex space-x-2">
          <button
            onClick={() => { setActiveTab('directory'); setSelectedBuilding(null); }}
            className={`px-3 py-1.5 rounded text-xs font-bold transition ${
              activeTab === 'directory' 
                ? 'bg-gov-navy text-white' 
                : 'bg-white border border-slate-300 hover:bg-slate-50 text-slate-700'
            }`}
          >
            {isDEO ? 'My Submissions & Drafts' : 'Registry Catalog'}
          </button>
          
          {isDEO && (
            <button
              onClick={() => setActiveTab('register')}
              className={`px-3 py-1.5 rounded text-xs font-bold flex items-center space-x-1.5 transition ${
                activeTab === 'register' 
                  ? 'bg-gov-navy text-white' 
                  : 'bg-white border border-slate-300 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <Plus size={14} />
              <span>Register New Building</span>
            </button>
          )}

          {activeTab === 'edit' && selectedBuilding && (
            <span className="px-3 py-1.5 bg-gov-green text-white rounded text-xs font-bold">
              Editing: {selectedBuilding.id}
            </span>
          )}
        </div>
      </div>

      {formSuccess && (
        <div className="bg-green-50 border border-green-200 text-status-licensed rounded p-3 text-xs flex items-center space-x-2">
          <CheckCircle size={16} />
          <span>{formSuccess}</span>
        </div>
      )}

      {/* --- DIRECTORY CATALOG TAB --- */}
      {activeTab === 'directory' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left panel: Search table index */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Search and Filters */}
            <div className="bg-white border border-gov-border rounded p-4 shadow-sm space-y-3 no-print">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search by ID, business name, or proprietor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-slate-300 rounded pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-gov-green"
                  />
                  <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                </div>
                {isAdmin && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
                      className="px-2.5 py-1.5 border border-slate-300 rounded hover:bg-slate-50 text-slate-600"
                      title="Toggle View Mode"
                    >
                      {viewMode === 'table' ? <Grid size={14} /> : <Table2 size={14} />}
                    </button>
                    <button
                      onClick={window.print}
                      className="px-2.5 py-1.5 border border-slate-300 rounded hover:bg-slate-50 text-slate-600"
                      title="Print Registry"
                    >
                      <Printer size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Admin filters */}
              {isAdmin && (
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Ward</label>
                    <select
                      value={filterWard}
                      onChange={(e) => setFilterWard(e.target.value)}
                      className="w-full border border-slate-300 rounded px-2 py-1 text-xs text-slate-700"
                    >
                      <option value="all">All Wards</option>
                      {wards.map(w => <option key={w.id} value={w.id}>Ward {w.id}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Status</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full border border-slate-300 rounded px-2 py-1 text-xs text-slate-700"
                    >
                      <option value="all">All Statuses</option>
                      <option value="licensed">Licensed</option>
                      <option value="unlicensed">Unlicensed</option>
                      <option value="pending">Pending</option>
                      <option value="govt">Government</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Classification</label>
                    <input
                      type="text"
                      placeholder="e.g. Retail"
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full border border-slate-300 rounded px-2 py-1 text-xs text-slate-700"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* List Table */}
            <div className="bg-white border border-gov-border rounded shadow-sm overflow-hidden">
              <div className="p-3 bg-slate-50 border-b flex justify-between items-center flex-wrap gap-2">
                <span className="text-xs font-bold text-gov-navy uppercase tracking-wider">
                  {isDEO ? 'My Registered Records & Draft Files' : 'All Panchayat Commercial Units'} ({filteredBuildings.length})
                </span>
                
                {isAdmin && (
                  <div className="flex space-x-1">
                    <button
                      onClick={() => triggerExport('CSV')}
                      className="px-2 py-1 border rounded text-[10px] uppercase font-bold hover:bg-slate-100 flex items-center space-x-1"
                    >
                      <Download size={10} />
                      <span>Export CSV</span>
                    </button>
                  </div>
                )}
              </div>

              {filteredBuildings.length === 0 ? (
                <div className="p-12 text-center text-slate-400 italic text-xs">
                  {isDEO 
                    ? "You haven't registered any building records or drafts yet. Click 'Register New Building' to begin."
                    : 'No records matching search query criteria.'}
                </div>
              ) : viewMode === 'table' ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b uppercase font-bold text-slate-500">
                      <tr>
                        <th className="px-3 py-2">ID</th>
                        <th className="px-3 py-2">Business Name</th>
                        <th className="px-3 py-2">Proprietor</th>
                        <th className="px-3 py-2">Ward</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredBuildings.map(b => (
                        <tr key={b.id} className="hover:bg-slate-50 transition">
                          <td className="px-3 py-2.5 font-mono font-bold text-slate-500">{b.id}</td>
                          <td className="px-3 py-2.5 font-bold text-slate-800">
                            {b.businessName}
                            {b.isReturnedForCorrection && (
                              <span className="ml-1.5 px-1 py-0.25 bg-red-100 text-status-unlicensed font-bold rounded text-[8px] uppercase">
                                Correction Req
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-slate-600">{b.ownerName}</td>
                          <td className="px-3 py-2.5 font-mono">Ward {b.wardNumber}</td>
                          <td className="px-3 py-2.5">
                            <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                              b.status === 'licensed' ? 'bg-green-50 text-status-licensed' :
                              b.status === 'unlicensed' ? 'bg-slate-100 text-slate-500 border' :
                              b.status === 'pending' ? 'bg-amber-50 text-status-pending' :
                              'bg-blue-50 text-status-govt'
                            }`}>
                              {b.status === 'unlicensed' ? 'Draft' : b.status}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-right space-x-1.5">
                            {isDEO ? (
                              <button
                                onClick={() => { setSelectedBuilding(b); setActiveTab('edit'); }}
                                className="text-gov-green font-bold hover:underline"
                              >
                                {b.status === 'unlicensed' || b.isReturnedForCorrection ? 'Edit / Upload' : 'View File'}
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => setSelectedBuilding(b)}
                                  className="text-gov-navy font-bold hover:underline"
                                >
                                  Details
                                </button>
                                {isAdmin && (
                                  <button
                                    onClick={() => handleDeleteBuilding(b.id)}
                                    className="text-red-700 hover:text-red-900 font-bold pl-1"
                                    title="Delete/Archive"
                                  >
                                    <Trash2 size={12} className="inline" />
                                  </button>
                                )}
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Grid view mode */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                  {filteredBuildings.map(b => (
                    <div key={b.id} className="border rounded p-3 bg-slate-50/50 space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-mono text-slate-400 font-bold">{b.id}</span>
                          <span className={`text-[8px] font-bold px-1.5 py-0.25 uppercase rounded ${
                            b.status === 'licensed' ? 'bg-green-100 text-status-licensed' :
                            b.status === 'pending' ? 'bg-amber-100 text-status-pending' :
                            b.status === 'unlicensed' ? 'bg-slate-200 text-slate-600' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {b.status === 'unlicensed' ? 'Draft' : b.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm">{b.businessName}</h4>
                        <p className="text-slate-500 text-xs mt-0.5">Proprietor: {b.ownerName}</p>
                        <p className="text-[10px] text-slate-400">Ward {b.wardNumber} | Cat: {b.category}</p>
                      </div>
                      <div className="pt-2 border-t flex justify-end space-x-1.5">
                        <button
                          onClick={() => {
                            if (isDEO) {
                              setSelectedBuilding(b);
                              setActiveTab('edit');
                            } else {
                              setSelectedBuilding(b);
                            }
                          }}
                          className="text-[11px] font-bold text-gov-navy hover:underline"
                        >
                          {isDEO ? 'Open File' : 'View Details'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Panel: File details display (Admin or read-only DEO viewer) */}
          <div className="space-y-4">
            <div className="bg-white border border-gov-border rounded p-5 shadow-sm h-fit">
              <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-4 border-b pb-2 flex items-center space-x-1.5">
                <Building2 size={15} />
                <span>Building Record File</span>
              </h3>

              {selectedBuilding ? (
                <div className="space-y-4 text-xs text-slate-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{selectedBuilding.businessName}</h4>
                      <span className="font-mono text-slate-400 text-[10px]">Record ID: {selectedBuilding.id}</span>
                    </div>
                    <span className={`px-2 py-0.5 font-bold uppercase rounded text-[9px] ${
                      selectedBuilding.status === 'licensed' ? 'bg-green-50 text-status-licensed' :
                      selectedBuilding.status === 'pending' ? 'bg-amber-50 text-status-pending' :
                      selectedBuilding.status === 'unlicensed' ? 'bg-slate-100 text-slate-500 border' :
                      'bg-blue-50 text-status-govt'
                    }`}>
                      {selectedBuilding.status === 'unlicensed' ? 'Draft' : selectedBuilding.status}
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 space-y-2 text-[11px]">
                    <div className="pt-1.5 flex justify-between">
                      <span className="text-slate-400 uppercase font-bold text-[9px]">Proprietor</span>
                      <span className="font-bold text-slate-800">{selectedBuilding.ownerName}</span>
                    </div>
                    <div className="pt-1.5 flex justify-between">
                      <span className="text-slate-400 uppercase font-bold text-[9px]">Ward Number</span>
                      <span className="font-mono font-bold text-slate-800">Ward {selectedBuilding.wardNumber}</span>
                    </div>
                    <div className="pt-1.5 flex justify-between">
                      <span className="text-slate-400 uppercase font-bold text-[9px]">Trade Classification</span>
                      <span className="font-bold text-slate-800">{selectedBuilding.category}</span>
                    </div>
                    <div className="pt-1.5 flex justify-between">
                      <span className="text-slate-400 uppercase font-bold text-[9px]">GPS coordinates</span>
                      <span className="font-mono text-slate-800">{selectedBuilding.coordinates.lat}, {selectedBuilding.coordinates.lng}</span>
                    </div>
                    {selectedBuilding.licenseId && (
                      <div className="pt-1.5 flex justify-between text-status-licensed">
                        <span className="uppercase font-bold text-[9px]">Trade License ID</span>
                        <span className="font-mono font-bold">{selectedBuilding.licenseId}</span>
                      </div>
                    )}
                    {selectedBuilding.createdBy && (
                      <div className="pt-1.5 flex justify-between">
                        <span className="text-slate-400 uppercase font-bold text-[9px]">Registered By</span>
                        <span className="text-slate-600 font-bold">{selectedBuilding.createdBy}</span>
                      </div>
                    )}
                    {selectedBuilding.submittedAt && (
                      <div className="pt-1.5 flex justify-between">
                        <span className="text-slate-400 uppercase font-bold text-[9px]">Submitted Date</span>
                        <span className="text-slate-600 font-bold">{selectedBuilding.submittedAt}</span>
                      </div>
                    )}
                  </div>

                  {/* Photograph display */}
                  <div className="space-y-1.5 pt-2">
                    <span className="block text-[9px] uppercase font-bold text-slate-400">Establishment Photo</span>
                    {selectedBuilding.photoUrl ? (
                      <img 
                        src={selectedBuilding.photoUrl} 
                        alt={selectedBuilding.businessName} 
                        className="w-full h-28 object-cover rounded border"
                      />
                    ) : (
                      <div className="bg-slate-50 border rounded p-4 text-center text-slate-400 italic text-[10px]">
                        No photograph attached to record file.
                      </div>
                    )}
                  </div>

                  {/* Documents Attachments List */}
                  <div className="space-y-1.5 pt-2">
                    <span className="block text-[9px] uppercase font-bold text-slate-400">Attached Documents</span>
                    {!selectedBuilding.attachments || selectedBuilding.attachments.length === 0 ? (
                      <p className="text-slate-400 italic text-[10px] pl-1">No document attachments uploaded.</p>
                    ) : (
                      <div className="space-y-1">
                        {selectedBuilding.attachments.map((att, i) => (
                          <div key={i} className="flex justify-between items-center p-1.5 border border-slate-100 bg-slate-50 rounded">
                            <span className="font-medium text-slate-700 flex items-center space-x-1">
                              <FileText size={11} className="text-gov-navy" />
                              <span>{att.name}</span>
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono">{att.uploadedAt}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* History Logs */}
                  <div className="space-y-1.5 pt-2">
                    <span className="block text-[9px] uppercase font-bold text-slate-400">Audit History Logs</span>
                    <div className="border rounded bg-slate-50 p-2 max-h-32 overflow-y-auto space-y-1.5 text-[10px]">
                      {selectedBuilding.history?.map((h, i) => (
                        <div key={i} className="border-b last:border-b-0 pb-1.5 last:pb-0">
                          <div className="flex justify-between text-slate-400 text-[8px] font-mono">
                            <span>{h.date} - {h.action}</span>
                            <span>{h.user}</span>
                          </div>
                          <p className="text-slate-700">{h.remarks}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 italic text-xs">
                  Select a building from the catalog list to view its complete administrative record file.
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* --- REGISTER NEW BUILDING TAB (DEO ONLY) --- */}
      {activeTab === 'register' && isDEO && (
        <div className="bg-white border border-gov-border rounded p-6 shadow-sm max-w-2xl mx-auto">
          <div className="border-b pb-2 mb-4">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center space-x-1.5">
              <Plus size={16} className="text-gov-green" />
              <span>New Commercial Establishment Registration</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Manually record details of existing licensed buildings or tax holdings.</p>
          </div>

          <form className="space-y-4 text-xs text-slate-700">
            
            {/* Grid 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Building/Establishment ID *</label>
                <input
                  type="text"
                  placeholder="e.g. BLDG-409"
                  {...register('id')}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-gov-green"
                />
                {errors.id && <p className="text-red-600 mt-1">{errors.id.message}</p>}
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Ward Jurisdiction *</label>
                <select
                  {...register('wardNumber')}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-gov-green"
                >
                  <option value="">Select Ward</option>
                  {wards.map(w => (
                    <option key={w.id} value={w.id}>Ward {w.id} - {w.name}</option>
                  ))}
                </select>
                {errors.wardNumber && <p className="text-red-600 mt-1">{errors.wardNumber.message}</p>}
              </div>
            </div>

            {/* Grid 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Trade Business Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Kozhikode Restaurant"
                  {...register('businessName')}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-gov-green"
                />
                {errors.businessName && <p className="text-red-600 mt-1">{errors.businessName.message}</p>}
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Proprietor / Owner Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Shri. P. Ibrahim"
                  {...register('ownerName')}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-gov-green"
                />
                {errors.ownerName && <p className="text-red-600 mt-1">{errors.ownerName.message}</p>}
              </div>
            </div>

            {/* Grid 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Trade Classification / Category *</label>
                <input
                  type="text"
                  placeholder="e.g. Retail / Grocery"
                  {...register('category')}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-gov-green"
                />
                {errors.category && <p className="text-red-600 mt-1">{errors.category.message}</p>}
              </div>
              
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Obligation / Import Option</label>
                <div className="flex space-x-4 py-2">
                  <label className="flex items-center space-x-1.5 font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isNgoStatus}
                      disabled={showPrevLicense}
                      onChange={(e) => setIsNgoStatus(e.target.checked)}
                      className="rounded text-gov-green focus:ring-gov-green"
                    />
                    <span>NGO / Charitable Exempt</span>
                  </label>
                  <label className="flex items-center space-x-1.5 font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showPrevLicense}
                      disabled={isNgoStatus}
                      onChange={(e) => setShowPrevLicense(e.target.checked)}
                      className="rounded text-gov-green focus:ring-gov-green"
                    />
                    <span>Import Historical License</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Historical License Data Import Form */}
            {showPrevLicense && (
              <div className="bg-emerald-50/40 border border-emerald-100 rounded p-4 space-y-3">
                <div className="font-bold text-gov-navy uppercase text-[10px] tracking-wider border-b pb-1.5 flex items-center space-x-1">
                  <span>Legacy / Previous Trade License Data Input</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Historical License Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. LIC-CP-2024-X45"
                      value={prevLicenseNum}
                      onChange={(e) => setPrevLicenseNum(e.target.value)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">License Fee Paid (₹) *</label>
                    <input
                      type="number"
                      required
                      value={prevLicenseFee}
                      onChange={(e) => setPrevLicenseFee(e.target.value)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 bg-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Issue Date *</label>
                    <input
                      type="date"
                      required
                      value={prevLicenseIssue}
                      onChange={(e) => setPrevLicenseIssue(e.target.value)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Expiry Date *</label>
                    <input
                      type="date"
                      required
                      value={prevLicenseExpiry}
                      onChange={(e) => setPrevLicenseExpiry(e.target.value)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Geotags */}
            <div className="bg-slate-50 p-4 border rounded space-y-3">
              <div className="flex justify-between items-center border-b pb-1.5">
                <span className="font-bold text-gov-navy uppercase tracking-wider text-[10px]">Geotag Coordinates</span>
                <button
                  type="button"
                  onClick={handleCaptureGPS}
                  className="text-gov-green hover:underline font-bold uppercase text-[9px]"
                >
                  Locate Now (GPS Mock)
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.00001"
                    {...register('lat')}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 font-mono focus:outline-none"
                  />
                  {errors.lat && <p className="text-red-600 mt-1">{errors.lat.message}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.00001"
                    {...register('lng')}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 font-mono focus:outline-none"
                  />
                  {errors.lng && <p className="text-red-600 mt-1">{errors.lng.message}</p>}
                </div>
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1">Remarks & Details</label>
              <textarea
                placeholder="Add trade license history, physical descriptors, etc."
                {...register('remarks')}
                rows={3}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none"
              />
            </div>

            {/* Submit Actions */}
            <div className="pt-4 border-t flex space-x-3">
              <button
                type="button"
                onClick={handleSubmit(saveBuildingDraft)}
                className="flex-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold uppercase py-2 rounded transition flex items-center justify-center space-x-1.5"
              >
                <Save size={14} />
                <span>Save Draft File</span>
              </button>
              <button
                type="button"
                onClick={handleSubmit(submitBuildingForVerification)}
                className="flex-1 bg-gov-green hover:bg-gov-green-light text-white font-bold uppercase py-2 rounded transition flex items-center justify-center space-x-1.5"
              >
                <Check size={14} />
                <span>Submit for Verification</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* --- EDIT RECORD & UPLOADS TAB (DEO ONLY) --- */}
      {activeTab === 'edit' && selectedBuilding && isDEO && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* Left Column: Form Details */}
          <div className="bg-white border border-gov-border rounded p-5 shadow-sm space-y-4">
            <div className="border-b pb-2 flex justify-between items-center">
              <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider">
                Edit Record details
              </h3>
              
              {/* Submission Status Lock Banner */}
              {selectedBuilding.status !== 'unlicensed' ? (
                <span className="bg-red-50 text-status-unlicensed border border-red-200 px-2 py-0.5 rounded font-bold uppercase text-[9px] flex items-center space-x-1">
                  <Lock size={10} />
                  <span>Locked: Read-Only</span>
                </span>
              ) : (
                <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-bold uppercase text-[9px] flex items-center space-x-1">
                  <RefreshCw size={10} className="animate-spin" />
                  <span>Draft Editable</span>
                </span>
              )}
            </div>

            {selectedBuilding.isReturnedForCorrection && (
              <div className="bg-red-50 border border-red-200 rounded p-3 text-xs text-red-900 flex items-start space-x-2">
                <AlertTriangle size={16} className="text-red-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block uppercase text-[10px]">Returned for Correction</span>
                  This record was returned by the Secretary or Administrator for correction. Please update details and resubmit.
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Building ID</label>
                <span className="block font-mono font-bold bg-slate-50 border rounded px-2.5 py-1 text-slate-600">{selectedBuilding.id}</span>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Business Name</label>
                <input
                  type="text"
                  value={selectedBuilding.businessName}
                  onChange={(e) => setSelectedBuilding({ ...selectedBuilding, businessName: e.target.value })}
                  disabled={selectedBuilding.status !== 'unlicensed'}
                  className="w-full border rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Proprietor Name</label>
                <input
                  type="text"
                  value={selectedBuilding.ownerName}
                  onChange={(e) => setSelectedBuilding({ ...selectedBuilding, ownerName: e.target.value })}
                  disabled={selectedBuilding.status !== 'unlicensed'}
                  className="w-full border rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Ward Number</label>
                  <select
                    value={selectedBuilding.wardNumber}
                    onChange={(e) => setSelectedBuilding({ ...selectedBuilding, wardNumber: e.target.value })}
                    disabled={selectedBuilding.status !== 'unlicensed'}
                    className="w-full border rounded px-2.5 py-1 text-xs text-slate-700 focus:outline-none disabled:bg-slate-50"
                  >
                    {wards.map(w => <option key={w.id} value={w.id}>Ward {w.id}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Category</label>
                  <input
                    type="text"
                    value={selectedBuilding.category}
                    onChange={(e) => setSelectedBuilding({ ...selectedBuilding, category: e.target.value })}
                    disabled={selectedBuilding.status !== 'unlicensed'}
                    className="w-full border rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none disabled:bg-slate-50"
                  />
                </div>
              </div>

              {/* Coordinates */}
              <div className="bg-slate-50 p-3 border rounded space-y-2">
                <div className="flex justify-between items-center border-b pb-1">
                  <span className="font-bold text-[9px] uppercase text-slate-500">Coordinates Geotag</span>
                  <button
                    type="button"
                    onClick={handleCaptureGPSEdit}
                    disabled={selectedBuilding.status !== 'unlicensed'}
                    className="text-gov-green hover:underline font-bold text-[9px] uppercase disabled:text-slate-400 disabled:no-underline"
                  >
                    Refresh GPS
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                  <div>
                    <span className="text-slate-400">Lat:</span> {selectedBuilding.coordinates.lat}
                  </div>
                  <div>
                    <span className="text-slate-400">Lng:</span> {selectedBuilding.coordinates.lng}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Remarks</label>
                <textarea
                  value={selectedBuilding.remarks || ''}
                  onChange={(e) => setSelectedBuilding({ ...selectedBuilding, remarks: e.target.value })}
                  disabled={selectedBuilding.status !== 'unlicensed'}
                  rows={2}
                  className="w-full border rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none disabled:bg-slate-50"
                />
              </div>

              {/* Action buttons (only visible if draft editable) */}
              {selectedBuilding.status === 'unlicensed' && (
                <div className="pt-3 border-t flex space-x-3">
                  <button
                    type="button"
                    onClick={handleSaveDraftUpdate}
                    className="flex-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold uppercase py-2 rounded transition flex items-center justify-center space-x-1.5 text-[10px]"
                  >
                    <Save size={13} />
                    <span>Save Draft Updates</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitDraftUpdate}
                    className="flex-1 bg-gov-green hover:bg-gov-green-light text-white font-bold uppercase py-2 rounded transition flex items-center justify-center space-x-1.5 text-[10px]"
                  >
                    <Check size={13} />
                    <span>Submit for verification</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Upload Photographs and Document Attachments */}
          <div className="space-y-4">
            
            {/* Photograph uploads */}
            <div className="bg-white border border-gov-border rounded p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider border-b pb-2 flex items-center space-x-1.5">
                <Upload size={14} />
                <span>Upload Building Photographs</span>
              </h3>

              {selectedBuilding.photoUrl ? (
                <div className="space-y-2">
                  <img 
                    src={selectedBuilding.photoUrl} 
                    alt="Uploaded establishment" 
                    className="w-full h-36 object-cover rounded border"
                  />
                  {selectedBuilding.status === 'unlicensed' && (
                    <button
                      onClick={handleSimulatePhotoUpload}
                      disabled={uploadingPhoto}
                      className="text-gov-green font-bold hover:underline text-[10px] uppercase flex items-center space-x-1"
                    >
                      <RefreshCw size={11} className={uploadingPhoto ? 'animate-spin' : ''} />
                      <span>{uploadingPhoto ? 'Uploading...' : 'Replace Photograph'}</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-slate-50 border rounded p-6 text-center text-slate-500 flex flex-col items-center justify-center space-y-2">
                  <span className="italic text-[10px]">No photograph attached to this building file yet.</span>
                  
                  {selectedBuilding.status === 'unlicensed' ? (
                    <button
                      type="button"
                      onClick={handleSimulatePhotoUpload}
                      disabled={uploadingPhoto}
                      className="bg-gov-navy hover:bg-gov-navy-light text-white text-[10px] font-bold uppercase py-1.5 px-3 rounded flex items-center space-x-1 transition"
                    >
                      <Upload size={11} />
                      <span>{uploadingPhoto ? 'Uploading...' : 'Simulate Camera Capture'}</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400 flex items-center space-x-1 font-bold">
                      <Lock size={10} />
                      <span>Locked - Upload Disabled</span>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Document Attachments */}
            <div className="bg-white border border-gov-border rounded p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider border-b pb-2 flex items-center space-x-1.5">
                <FileText size={14} />
                <span>Upload Building Documents</span>
              </h3>

              {/* Existing attachments */}
              <div className="space-y-1.5">
                <span className="block text-[9px] uppercase font-bold text-slate-400">Files Uploaded</span>
                {!selectedBuilding.attachments || selectedBuilding.attachments.length === 0 ? (
                  <p className="text-slate-400 italic text-[10px] pl-1">No attachments uploaded yet.</p>
                ) : (
                  <div className="space-y-1">
                    {selectedBuilding.attachments.map((att, i) => (
                      <div key={i} className="flex justify-between items-center p-2 border border-slate-100 bg-slate-50 rounded text-[11px]">
                        <span className="font-semibold text-slate-700 flex items-center space-x-1">
                          <FileText size={12} className="text-gov-navy" />
                          <span>{att.name}</span>
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">{att.uploadedAt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upload form */}
              {selectedBuilding.status === 'unlicensed' ? (
                <form onSubmit={handleSimulateDocUpload} className="bg-slate-50 p-3 border rounded space-y-2.5">
                  <span className="block text-[9px] font-bold text-gov-navy uppercase tracking-wider">Simulate Document Attachment</span>
                  <div>
                    <label className="block text-[9px] text-slate-400 font-bold mb-0.5">Document Title / Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. Fire NOC clearance certificate"
                      value={docName}
                      onChange={(e) => setDocName(e.target.value)}
                      className="w-full border rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={uploadingDoc || !docName.trim()}
                    className="w-full bg-gov-navy hover:bg-gov-navy-light text-white text-[10px] font-bold uppercase py-1.5 rounded transition disabled:bg-slate-200 disabled:text-slate-400"
                  >
                    {uploadingDoc ? 'Attaching...' : 'Attach Document'}
                  </button>
                </form>
              ) : (
                <div className="bg-slate-50 border rounded p-4 text-center text-slate-400 italic text-[10px] flex items-center justify-center space-x-1">
                  <Lock size={12} className="text-slate-400" />
                  <span>Document uploads locked. Record in verification.</span>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
