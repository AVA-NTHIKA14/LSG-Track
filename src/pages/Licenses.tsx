import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';
import type { LicenseRecord, BuildingRecord, SurveyRecord } from '../types';
import { read, utils } from 'xlsx';
import { 
  FileCheck, 
  ShieldCheck, 
  Check, 
  X, 
  ShieldAlert, 
  Search, 
  ExternalLink,
  RefreshCw,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  FileText
} from 'lucide-react';

export const Licenses: React.FC = () => {
  const { t } = useTranslation();
  const [licenses, setLicenses] = useState<LicenseRecord[]>([]);
  const [buildings, setBuildings] = useState<BuildingRecord[]>([]);
  const [surveys, setSurveys] = useState<SurveyRecord[]>([]);
  
  const [activeLicense, setActiveLicense] = useState<LicenseRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [ksmartSyncStatus, setKsmartSyncStatus] = useState<string | null>(null);
  
  // Secretary approval states
  const [selectedPendingBldg, setSelectedPendingBldg] = useState<BuildingRecord | null>(null);
  const [rejectionRemarks, setRejectionRemarks] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  // K-SMART Import Pipeline States
  const [showImportModal, setShowImportModal] = useState(false);
  const [importStep, setImportStep] = useState<'upload' | 'validate' | 'preview' | 'report'>('upload');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [conflicts, setConflicts] = useState<{ incoming: any; existing: BuildingRecord }[]>([]);
  const [conflictResolutions, setConflictResolutions] = useState<{ [id: string]: 'overwrite' | 'keep' }>({});
  
  const [syncReport, setSyncReport] = useState<{
    total: number;
    imported: number;
    updated: number;
    expired: number;
    errors: number;
  } | null>(null);

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
    setActiveLicense(null);
    setShowRejectForm(false);
    setRejectionRemarks('');
  };

  const handleApprove = async (bldgId: string) => {
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

  // Mock API K-SMART Sync trigger
  const handleKsmartSync = async () => {
    const unlicensedBldg = buildings.find(b => b.status === 'unlicensed');
    if (!unlicensedBldg) {
      alert('All mock buildings are already licensed or in pending/exempt status. Try registering a new structure first.');
      return;
    }
    
    const ksmartLicId = 'LIC-KSMART-' + Math.floor(1000 + Math.random() * 9000);
    const newLicense = {
      id: ksmartLicId,
      buildingId: unlicensedBldg.id,
      licenseType: 'K-SMART Direct Sync (' + unlicensedBldg.category + ')',
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      status: 'active' as const,
      feePaid: 3000
    };
    
    await dbService.addHistoricalLicense(newLicense);
    await dbService.addAuditLog('KSMART_SYNC', `Synchronized license ${ksmartLicId} from K-SMART for Building ${unlicensedBldg.id}.`);
    setKsmartSyncStatus(`Successfully synchronized: License #${ksmartLicId} for "${unlicensedBldg.businessName}" (ID: ${unlicensedBldg.id}) added from K-SMART.`);
  };

  // Get centroid of ward polygon fallback to Panangad centroids
  const getCentroidOfWard = (wardNum: string): { lat: number; lng: number } => {
    try {
      const activePanchayatCode = localStorage.getItem('cp_active_panchayat_code') || 'G110706';
      const panchayats = JSON.parse(localStorage.getItem('cp_panchayaths') || '[]');
      const activeP = panchayats.find((p: any) => p.id === activePanchayatCode);
      if (activeP && activeP.boundaryGeoJSON) {
        const geojson = JSON.parse(activeP.boundaryGeoJSON);
        const feature = geojson.features.find((f: any) => String(f.properties.ward_number) === String(wardNum));
        if (feature && feature.geometry) {
          const type = feature.geometry.type;
          let coords = [];
          if (type === 'Polygon') {
            coords = feature.geometry.coordinates[0];
          } else if (type === 'MultiPolygon') {
            coords = feature.geometry.coordinates[0][0];
          }
          
          if (coords.length > 0) {
            let latSum = 0, lngSum = 0;
            coords.forEach((pt: any) => {
              lngSum += pt[0];
              latSum += pt[1];
            });
            return {
              lat: Number((latSum / coords.length).toFixed(6)),
              lng: Number((lngSum / coords.length).toFixed(6))
            };
          }
        }
      }
    } catch (e) {
      console.error('Centroid calculation error:', e);
    }
    
    // Fallback centers by ward (approximations from Panangadwards)
    const centers: { [key: string]: { lat: number; lng: number } } = {
      "1": { lat: 11.483579, lng: 75.858206 },
      "2": { lat: 11.488730, lng: 75.868115 },
      "3": { lat: 11.500069, lng: 75.873285 },
      "4": { lat: 11.505120, lng: 75.888578 },
      "5": { lat: 11.490907, lng: 75.895435 },
      "6": { lat: 11.472689, lng: 75.886492 },
      "7": { lat: 11.469168, lng: 75.875849 },
      "8": { lat: 11.470958, lng: 75.863662 },
      "9": { lat: 11.463250, lng: 75.866267 },
      "10": { lat: 11.464721, lng: 75.855462 },
      "11": { lat: 11.456633, lng: 75.852822 },
      "12": { lat: 11.447025, lng: 75.853599 },
      "13": { lat: 11.445755, lng: 75.838849 },
      "14": { lat: 11.457596, lng: 75.843115 },
      "15": { lat: 11.455602, lng: 75.834349 },
      "16": { lat: 11.461431, lng: 75.829446 },
      "17": { lat: 11.463647, lng: 75.810295 },
      "18": { lat: 11.470365, lng: 75.813777 },
      "19": { lat: 11.473846, lng: 75.836008 },
      "20": { lat: 11.469560, lng: 75.849527 }
    };
    return centers[wardNum] || { lat: 11.4167, lng: 75.9167 };
  };

  // Parse CSV Line Helper
  const parseCSVText = (text: string) => {
    const lines = text.split(/\r?\n/);
    if (lines.length === 0) return [];
    
    const rawHeaders = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const headers = rawHeaders.map((h, idx) => {
      const isDuplicate = rawHeaders.filter((val, i) => val === h && i < idx).length > 0;
      return isDuplicate ? `${h}_${idx}` : h;
    });
    
    const results = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Split comma separated, ignoring commas inside quotes
      const matches = [];
      let currentVal = '';
      let insideQuote = false;
      for (let charIdx = 0; charIdx < line.length; charIdx++) {
        const char = line[charIdx];
        if (char === '"') {
          insideQuote = !insideQuote;
        } else if (char === ',' && !insideQuote) {
          matches.push(currentVal);
          currentVal = '';
        } else {
          currentVal += char;
        }
      }
      matches.push(currentVal);

      const row = matches.map(val => val.trim().replace(/^"|"$/g, ''));
      const obj: any = {};
      
      headers.forEach((h, idx) => {
        obj[h] = row[idx] || '';
      });
      results.push(obj);
    }
    return results;
  };

  // Unified parsed data normalizer (handles both CSV & Excel K-SMART formats)
  const processParsedData = (parsed: any[]) => {
    // Detect if this is a K-SMART format sheet
    const isKsmart = parsed.length > 0 && (
      parsed[0]['Application Nu'] !== undefined ||
      parsed[0]['Receipt De'] !== undefined ||
      parsed[0]['Ward No'] !== undefined
    );
    
    if (isKsmart) {
      console.log('Detected K-SMART format CSV. Translating records...');
      
      const normalized = parsed.map((row, idx) => {
        const keys = Object.keys(row);
        
        // Map Duplicate headers:
        // Column F (5): Name & Address of Owner
        // Column G (6): Name & Address of Business
        const ownerAddrCol = keys[4] || 'Name & Address';
        const businessAddrCol = keys[5] || 'Name & Address_5';
        const bizCatCol = keys[6] || 'Business';
        const bizTypeCol = keys[7] || 'Business_7';
        
        const rawOwner = row[ownerAddrCol] || '';
        const rawBusiness = row[businessAddrCol] || '';
        
        // Keep name and phone number together from full address field
        const ownerName = rawOwner.trim() || 'Unknown Owner';
        const businessName = rawBusiness.split(',')[0].trim() || 'Unknown Business';
        
        const wardNum = row['Ward No'] || '1';
        const structure = row['Structure'] || `BLDG-IMPORT-${idx}`;
        
        // Create building ID
        const buildingId = `BLDG-G110706-${structure.replace(/[^a-zA-Z0-9-]/g, '-')}`;
        
        // Parse Receipt Details
        const receiptDetails = row['Receipt De'] || '';
        const matchReceipt = receiptDetails.match(/(R-[G0-9]+-[0-9]+)/i);
        const licenseId = matchReceipt ? matchReceipt[1] : (row['Application Nu'] || `LIC-IMPORT-${idx}`);
        
        // Parse dates DD-MM-YYYY to YYYY-MM-DD
        const parseDate = (dStr: string) => {
          if (!dStr) return '';
          const parts = dStr.split('-');
          if (parts.length === 3) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
          }
          return dStr;
        };
        
        const issueDate = parseDate(row['Validity Fr']);
        const expiryDate = parseDate(row['Validity To']);
        
        // Geocode using centroid of ward boundary polygon
        const coord = getCentroidOfWard(wardNum);
        
        const rawStatus = (row['Status'] || '').toLowerCase();
        const licenseStatus = rawStatus.includes('approve') || rawStatus.includes('active') ? 'active' : 'expired';
        
        return {
          building_id: buildingId,
          business_name: businessName,
          owner_name: ownerName,
          category: row[bizTypeCol] || row[bizCatCol] || 'Commercial',
          ward_number: wardNum,
          latitude: String(coord.lat),
          longitude: String(coord.lng),
          license_id: licenseId,
          license_status: licenseStatus,
          license_type: 'D&O Trade License',
          issue_date: issueDate,
          expiry_date: expiryDate,
          fee_paid: row['License Fe'] || '1000'
        };
      });
      
      setCsvData(normalized);
    } else {
      setCsvData(parsed);
    }
  };

  // Step 1: Parse Excel/CSV File
  const parseFileAndLoad = (file: File) => {
    setCsvFile(file);
    setValidationErrors([]);
    setConflicts([]);
    setImportStep('upload');

    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

    if (isExcel) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          const rawRows = utils.sheet_to_json<any[]>(worksheet, { header: 1 });
          if (rawRows.length === 0) {
            throw new Error('Spreadsheet sheet is empty.');
          }
          
          const rawHeaders = rawRows[0].map(h => String(h || '').trim().replace(/^"|"$/g, ''));
          const headers = rawHeaders.map((h, idx) => {
            const isDuplicate = rawHeaders.filter((val, i) => val === h && i < idx).length > 0;
            return isDuplicate ? `${h}_${idx}` : h;
          });
          
          const parsed: any[] = [];
          for (let i = 1; i < rawRows.length; i++) {
            const row = rawRows[i];
            if (!row || row.length === 0) continue;
            
            const obj: any = {};
            headers.forEach((h, idx) => {
              obj[h] = row[idx] !== undefined ? String(row[idx]).trim() : '';
            });
            parsed.push(obj);
          }
          
          processParsedData(parsed);
        } catch (err: any) {
          setValidationErrors([`Excel Parse Error: ${err.message || 'Malformed spreadsheet format.'}`]);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const parsed = parseCSVText(text);
          processParsedData(parsed);
        } catch (err: any) {
          setValidationErrors([`File Parse Error: ${err.message || 'Malformed CSV format.'}`]);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleCSVFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) parseFileAndLoad(file);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) parseFileAndLoad(file);
  };

  // Step 2: Validate Data
  const handleValidateCSV = () => {
    if (csvData.length === 0) {
      setValidationErrors(['No records found in the uploaded file.']);
      return;
    }

    const errors: string[] = [];
    const requiredHeaders = ['building_id', 'business_name', 'owner_name', 'category', 'ward_number', 'latitude', 'longitude'];
    
    // Check if headers match
    const firstRowKeys = Object.keys(csvData[0]);
    const missingHeaders = requiredHeaders.filter(h => !firstRowKeys.includes(h));
    
    if (missingHeaders.length > 0) {
      errors.push(`Critical Header Mismatch: Missing required columns: ${missingHeaders.join(', ')}`);
      setValidationErrors(errors);
      setImportStep('validate');
      return;
    }

    // Row-level validations
    csvData.forEach((row, idx) => {
      const rowNum = idx + 2; // 1-indexed header is row 1
      
      if (!row.building_id) errors.push(`Row ${rowNum}: building_id is required.`);
      if (!row.business_name) errors.push(`Row ${rowNum}: business_name is required.`);
      if (!row.owner_name) errors.push(`Row ${rowNum}: owner_name is required.`);
      
      const latVal = parseFloat(row.latitude);
      const lngVal = parseFloat(row.longitude);
      
      if (isNaN(latVal) || latVal < 8.0 || latVal > 13.0) {
        errors.push(`Row ${rowNum}: latitude "${row.latitude}" must be a number inside Kerala boundaries [8.0, 13.0].`);
      }
      if (isNaN(lngVal) || lngVal < 74.0 || lngVal > 78.0) {
        errors.push(`Row ${rowNum}: longitude "${row.longitude}" must be a number inside Kerala boundaries [74.0, 78.0].`);
      }
      if (!row.ward_number) {
        errors.push(`Row ${rowNum}: ward_number is required.`);
      }
    });

    setValidationErrors(errors);
    
    if (errors.length === 0) {
      // Find conflicts
      const resolvedConflicts: { incoming: any; existing: BuildingRecord }[] = [];
      const defaultResolutions: { [id: string]: 'overwrite' | 'keep' } = {};

      csvData.forEach(row => {
        const exist = buildings.find(b => b.id === row.building_id);
        if (exist) {
          resolvedConflicts.push({ incoming: row, existing: exist });
          defaultResolutions[row.building_id] = 'overwrite';
        }
      });

      setConflicts(resolvedConflicts);
      setConflictResolutions(defaultResolutions);
      setImportStep('preview');
    } else {
      setImportStep('validate');
    }
  };

  // Step 4: Commit Imports
  const handleCommitImport = async () => {
    setImportStep('upload'); // fallback loading
    let imported = 0;
    let updated = 0;
    let expired = 0;
    let errorsCount = 0;
    const importErrors: string[] = [];

    for (const row of csvData) {
      try {
        const exist = buildings.find(b => b.id === row.building_id);
        const resolution = conflictResolutions[row.building_id] || 'overwrite';

        if (exist && resolution === 'keep') {
          // Keep existing, skip writing building details
        } else {
          // Insert or Overwrite Building details
          const bldgRecord: Omit<BuildingRecord, 'history'> = {
            id: row.building_id,
            businessName: row.business_name,
            ownerName: row.owner_name,
            category: row.category,
            wardNumber: row.ward_number,
            coordinates: {
              lat: parseFloat(row.latitude),
              lng: parseFloat(row.longitude)
            },
            status: row.license_id ? (row.license_status === 'active' ? 'licensed' : 'unlicensed') : 'unlicensed',
            licenseId: row.license_id || undefined,
            submittedAt: new Date().toISOString()
          };

          if (exist) {
            await dbService.updateBuilding(row.building_id, bldgRecord);
            updated++;
          } else {
            await dbService.addBuilding(bldgRecord);
            imported++;
          }
        }

        // Handle License Insertion/Renewal
        if (row.license_id) {
          const isLicActive = row.license_status === 'active';
          if (!isLicActive) expired++;

          const licenseRecord: LicenseRecord = {
            id: row.license_id,
            buildingId: row.building_id,
            licenseType: row.license_type || 'Commercial Trade License',
            issueDate: row.issue_date || new Date().toISOString().split('T')[0],
            expiryDate: row.expiry_date || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            status: (row.license_status || 'active') as any,
            feePaid: parseInt(row.fee_paid) || 1500
          };
          
          await dbService.addHistoricalLicense(licenseRecord);
        }
      } catch (err: any) {
        errorsCount++;
        importErrors.push(`Row ID ${row.building_id}: ${err.message || err}`);
      }
    }

    // Save Sync History Log in Database
    await dbService.addSyncHistory({
      fileName: csvFile?.name || 'K-SMART_Export.csv',
      operatorName: currentUser?.name || 'Secretary',
      totalRecords: csvData.length,
      importedCount: imported,
      updatedCount: updated,
      expiredCount: expired,
      errorCount: errorsCount,
      errors: importErrors
    });

    setSyncReport({
      total: csvData.length,
      imported,
      updated,
      expired,
      errors: errorsCount
    });

    setImportStep('report');
  };

  const activeSurvey = selectedPendingBldg 
    ? surveys.find(s => s.buildingId === selectedPendingBldg.id && s.status === 'submitted')
    : null;

  if (currentUser?.role !== 'Secretary' && currentUser?.role !== 'Administrator' && currentUser?.role !== 'Panchayat Section Clerk') {
    return (
      <div className="bg-white border border-gov-border rounded p-6 shadow-sm text-center py-12 text-slate-500 italic text-xs max-w-md mx-auto mt-12">
        <ShieldAlert size={36} className="mx-auto text-red-700 mb-2" />
        <p className="font-bold text-slate-800 text-sm mb-1">ACCESS RESTRICTED</p>
        <p className="mb-4">This K-SMART import workspace is restricted to Panchayat Section Clerks, Secretaries, and Administrators.</p>
        <p>Your current profile ({currentUser?.role || 'Guest'}) does not hold access permissions.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="border-b pb-4 flex justify-between items-center flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <ShieldCheck size={22} className="text-[#0F6E4F]" />
            <span>{t('licenses.heading')}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('licenses.subheading', { code: localStorage.getItem('cp_active_panchayat_code') || 'G070702' })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns - Applications and Licenses Lists */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Secretary Verification Queue */}
          <div className="bg-white border border-gov-border rounded p-4 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider border-b pb-2 flex items-center space-x-2">
              <FileCheck size={16} className="text-gov-green" />
              <span>Secretary Verification Queue ({pendingBuildings.length})</span>
            </h3>

            {pendingBuildings.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">No pending inspection surveys require approval.</p>
            ) : (
              <div className="overflow-x-auto text-xs">
                <table className="min-w-full text-left">
                  <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase">
                    <tr>
                      <th className="px-3 py-2">Asset ID</th>
                      <th className="px-3 py-2">Business Title</th>
                      <th className="px-3 py-2">Category</th>
                      <th className="px-3 py-2">Ward Number</th>
                      <th className="px-3 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {pendingBuildings.map(b => {
                      const isSelected = selectedPendingBldg?.id === b.id;
                      return (
                        <tr key={b.id} className={`hover:bg-slate-50 transition cursor-pointer ${isSelected ? 'bg-emerald-50/20' : ''}`} onClick={() => handleSelectPending(b)}>
                          <td className="px-3 py-2.5 font-bold font-mono text-slate-800">{b.id}</td>
                          <td className="px-3 py-2.5 font-bold text-slate-900">{b.businessName}</td>
                          <td className="px-3 py-2.5">{b.category}</td>
                          <td className="px-3 py-2.5 font-mono">Ward {b.wardNumber}</td>
                          <td className="px-3 py-2.5 text-right">
                            <span className="text-[#0F6E4F] font-bold hover:underline">Select</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section 2: Active Trade Licenses Registry */}
          <div className="bg-white border border-gov-border rounded p-4 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-2 flex-wrap gap-2 text-xs">
              <h3 className="font-bold text-gov-navy uppercase tracking-wider flex items-center space-x-2">
                <ShieldCheck size={16} className="text-gov-green" />
                <span>Trade License Registry Registers ({filteredLicenses.length})</span>
              </h3>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter licenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border rounded px-2.5 py-1 text-xs text-slate-700 focus:outline-none focus:border-gov-green w-48"
                />
                <Search size={13} className="absolute left-2 top-2 text-slate-400" />
              </div>
            </div>

            {filteredLicenses.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">No registers match filter parameters.</p>
            ) : (
              <div className="overflow-x-auto text-xs">
                <table className="min-w-full text-left">
                  <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase">
                    <tr>
                      <th className="px-3 py-2">License ID</th>
                      <th className="px-3 py-2">Asset ID</th>
                      <th className="px-3 py-2">Business Title</th>
                      <th className="px-3 py-2">Expiry Date</th>
                      <th className="px-3 py-2">Treasury Fee</th>
                      <th className="px-3 py-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredLicenses.map(l => {
                      const b = buildings.find(bld => bld.id === l.buildingId);
                      const isSelected = activeLicense?.id === l.id;
                      return (
                        <tr key={l.id} className={`hover:bg-slate-50 transition cursor-pointer ${isSelected ? 'bg-emerald-50/20' : ''}`} onClick={() => { setActiveLicense(l); setSelectedPendingBldg(null); }}>
                          <td className="px-3 py-2.5 font-bold font-mono text-slate-800">{l.id}</td>
                          <td className="px-3 py-2.5 font-mono text-slate-500">{l.buildingId}</td>
                          <td className="px-3 py-2.5 font-bold text-slate-900">{b?.businessName || 'N/A'}</td>
                          <td className="px-3 py-2.5 font-mono">{l.expiryDate}</td>
                          <td className="px-3 py-2.5 font-mono font-bold">₹{l.feePaid}</td>
                          <td className="px-3 py-2.5 text-right">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                              l.status === 'active' ? 'bg-green-50 text-status-licensed' : 'bg-red-50 text-status-unlicensed'
                            }`}>{l.status}</span>
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

        {/* Right Columns - Details Viewer / K-SMART panels */}
        <div className="space-y-6">
          
          {selectedPendingBldg ? (
            /* Selected Application Approval Details */
            <div className="bg-white border border-gov-border rounded p-5 shadow-sm space-y-4 text-xs text-slate-700">
              <h3 className="font-extrabold text-gov-navy border-b pb-2 text-sm">Secretary Application Review</h3>
              
              <div className="space-y-3 font-semibold">
                <div>
                  <span className="block text-[9px] font-bold text-slate-400 uppercase">Establishment Name</span>
                  <span className="text-slate-800 text-sm font-bold">{selectedPendingBldg.businessName}</span>
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-slate-400 uppercase">Owner Name</span>
                  <span className="text-slate-800">{selectedPendingBldg.ownerName}</span>
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-slate-400 uppercase">Category</span>
                  <span className="text-slate-800">{selectedPendingBldg.category}</span>
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-slate-400 uppercase">GPS Tag Location</span>
                  <span className="text-slate-800 font-mono">{selectedPendingBldg.coordinates.lat.toFixed(5)}, {selectedPendingBldg.coordinates.lng.toFixed(5)}</span>
                </div>

                {activeSurvey && (
                  <div className="bg-slate-50 border rounded-xl p-3.5 space-y-2.5">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase border-b pb-1">VEO Field Observation Report</span>
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase">Inspected By</span>
                      <span>{activeSurvey.officerName}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase">Remarks / Notes</span>
                      <p className="text-[11px] text-slate-650 font-normal italic leading-relaxed">"{activeSurvey.remarks}"</p>
                    </div>
                  </div>
                )}
              </div>

              {canApprove ? (
                <div className="space-y-2 pt-2">
                  {!showRejectForm ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(selectedPendingBldg.id)}
                        className="flex-1 bg-[#0F6E4F] hover:bg-[#0B5A3E] text-white font-bold py-2.5 rounded-xl uppercase tracking-wider transition shadow-sm flex items-center justify-center space-x-1.5"
                      >
                        <Check size={14} />
                        <span>Issue License</span>
                      </button>
                      <button
                        onClick={() => setShowRejectForm(true)}
                        className="flex-1 bg-red-650 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl uppercase tracking-wider transition"
                      >
                        Return for Correction
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 border-t pt-3">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Deficiency Description Remarks</label>
                        <textarea
                          rows={3}
                          required
                          value={rejectionRemarks}
                          onChange={(e) => setRejectionRemarks(e.target.value)}
                          placeholder="State exact details to correct, e.g. Upload Fire Safety certificates..."
                          className="w-full border rounded-xl p-2.5 focus:outline-none focus:border-red-600 text-xs font-medium"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReject(selectedPendingBldg.id)}
                          className="flex-1 bg-red-650 text-white font-bold py-2 rounded-xl"
                        >
                          Confirm Deficiencies
                        </button>
                        <button
                          onClick={() => setShowRejectForm(false)}
                          className="flex-1 border text-slate-600 font-bold py-2 rounded-xl hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 leading-normal font-semibold">
                  ⚠️ View-only profile: You do not possess approval credentials.
                </div>
              )}

            </div>
          ) : activeLicense ? (
            /* Selected Active License Details */
            <div className="bg-white border border-gov-border rounded p-5 shadow-sm space-y-4 text-xs text-slate-700">
              <div className="flex justify-between items-start border-b pb-2">
                <h3 className="font-extrabold text-gov-navy text-sm">License Certificate</h3>
                <span className="font-mono text-slate-400 font-bold uppercase">{activeLicense.status}</span>
              </div>

              <div className="space-y-3 font-semibold">
                <div>
                  <span className="block text-[9px] font-bold text-slate-400 uppercase">License ID</span>
                  <span className="text-slate-800 text-sm font-bold font-mono">{activeLicense.id}</span>
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-slate-400 uppercase">Type classification</span>
                  <span>{activeLicense.licenseType}</span>
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-slate-400 uppercase">Fiscal Period</span>
                  <span className="font-mono">Issued: {activeLicense.issueDate} | Exp: {activeLicense.expiryDate}</span>
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-slate-400 uppercase">Treasury Fee Paid</span>
                  <span className="font-mono text-slate-800 font-bold">₹{activeLicense.feePaid}</span>
                </div>
              </div>

              <div className="pt-2 border-t space-y-2">
                <a
                  href={`https://lsgtrack.kerala.gov.in/certs/download/${activeLicense.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#0F6E4F] hover:bg-[#0B5A3E] text-white font-bold py-2.5 rounded-xl uppercase tracking-wider transition shadow-sm flex items-center justify-center space-x-1.5"
                >
                  <ExternalLink size={13} />
                  <span>Download Digital Copy</span>
                </a>
                <button
                  onClick={() => { setActiveLicense(null); }}
                  className="w-full border text-slate-650 hover:bg-slate-50 font-bold py-2.5 rounded-xl transition"
                >
                  Close Certificate Detail
                </button>
              </div>
            </div>
          ) : (
            /* Default Panel when nothing is selected */
            <div className="text-center py-10 text-slate-400 text-xs space-y-2 bg-slate-50 border rounded-2xl p-4">
              <ShieldAlert size={28} className="mx-auto text-slate-300" />
              <p>Select a pending verification item or an active license from the lists to inspect parameters.</p>
            </div>
          )}

          {/* K-SMART Live Integration Panel (Restricted to DEO and Admin) */}
          {(currentUser?.role === 'Panchayat Section Clerk' || currentUser?.role === 'Administrator') && (
            <div className="bg-[#EBF7F2] border border-emerald-100 rounded-2xl p-4 space-y-3 text-xs text-slate-700">
              <div className="flex items-center space-x-2 border-b border-emerald-100 pb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                <h4 className="font-extrabold text-[#0F6E4F] uppercase tracking-wider text-[10px]">K-SMART Integration Gateway</h4>
              </div>
              
              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                Licensed trade establishments are exported by K-SMART. Use the control buttons below to simulate API sync or launch the file import pipeline.
              </p>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleKsmartSync}
                  className="w-full bg-[#0F6E4F] hover:bg-[#0B5A3E] text-white font-bold uppercase py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-sm text-[10px] tracking-wide"
                >
                  <RefreshCw size={12} />
                  <span>Sync Live K-SMART Database</span>
                </button>

                <button
                  onClick={() => { setShowImportModal(true); setImportStep('upload'); }}
                  className="w-full border border-emerald-300 text-[#0F6E4F] hover:bg-emerald-50 font-bold uppercase py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 text-[10px] tracking-wide"
                >
                  <Download size={12} />
                  <span>Import K-SMART Export Files</span>
                </button>
              </div>

              {ksmartSyncStatus && (
                <div className="mt-3 p-2.5 bg-white rounded-lg border border-emerald-100 text-[10px] text-slate-655 italic leading-relaxed font-mono">
                  {ksmartSyncStatus}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ==================== K-SMART CSV FILE IMPORT MODAL PIPELINE ==================== */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/60 p-4 font-sans text-slate-800">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-[#0F6E4F] text-white p-5 flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-2.5">
                <Upload size={20} />
                <h3 className="font-extrabold text-sm uppercase tracking-wide">K-SMART Import Pipeline</h3>
              </div>
              <button 
                onClick={() => setShowImportModal(false)}
                className="text-white/70 hover:text-white bg-emerald-950/20 p-1.5 rounded-xl transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Step Indicator */}
            <div className="bg-slate-50 border-b px-6 py-2.5 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
              <span className={importStep === 'upload' ? 'text-[#0F6E4F]' : ''}>1. Upload</span>
              <span className={importStep === 'validate' ? 'text-[#0F6E4F]' : ''}>2. Validate</span>
              <span className={importStep === 'preview' ? 'text-[#0F6E4F]' : ''}>3. Preview Conflicts</span>
              <span className={importStep === 'report' ? 'text-[#0F6E4F]' : ''}>4. Report</span>
            </div>

            {/* Modal Content Scroll */}
            <div className="flex-grow p-6 overflow-y-auto text-xs space-y-4 font-semibold leading-relaxed">
              
              {/* STEP 1: Upload Panel */}
              {importStep === 'upload' && (
                <div className="space-y-4 text-center py-6">
                  <div 
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleFileDrop}
                    className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center space-y-3 transition relative ${
                      isDragging 
                        ? 'border-[#0F6E4F] bg-emerald-50/50 scale-[1.01]' 
                        : 'border-slate-300 bg-slate-50 hover:bg-slate-100/50'
                    }`}
                  >
                    <FileText size={36} className={isDragging ? 'text-[#0F6E4F]' : 'text-slate-400'} />
                    <p className="font-bold text-slate-700">Drag & drop or select K-SMART exported spreadsheet</p>
                    <p className="text-[10px] text-slate-400 font-medium">Supports Excel (.xlsx, .xls) and CSV spreadsheet exports containing building metrics and trade listings.</p>
                    
                    <input 
                      type="file" 
                      id="csv-file-upload" 
                      accept=".xlsx,.xls,.csv"
                      onChange={handleCSVFileChange}
                      className="hidden" 
                    />
                    <label 
                      htmlFor="csv-file-upload"
                      className="bg-[#0F6E4F] hover:bg-[#0B5A3E] text-white font-bold px-4 py-2 rounded-xl cursor-pointer transition shadow"
                    >
                      Browse local files
                    </label>
                  </div>
                  {csvFile && (
                    <div className="bg-[#EBF7F2] border border-emerald-100 rounded-2xl p-3 text-left flex justify-between items-center text-[#0F6E4F] font-bold">
                      <span>✓ Ready to import: <strong>{csvFile.name}</strong> ({csvData.length} records parsed)</span>
                      <button
                        onClick={handleValidateCSV}
                        className="bg-[#0F6E4F] hover:bg-[#0B5A3E] text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg transition"
                      >
                        Process & Validate
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: Validation Errors View */}
              {importStep === 'validate' && (
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 text-red-900 rounded-2xl p-4 flex items-start space-x-2.5">
                    <AlertTriangle size={18} className="text-red-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-red-800 text-xs">Validation Failed: Row-level anomalies found</strong>
                      <span className="text-[10px] text-red-700 font-medium">The uploaded spreadsheet contains parsing errors or invalid values. Correct these errors and upload again.</span>
                    </div>
                  </div>

                  <div className="border rounded-2xl p-3 bg-slate-50 space-y-1.5 max-h-56 overflow-y-auto font-mono text-[10px] text-slate-600">
                    {validationErrors.map((err, i) => (
                      <div key={i} className="border-b last:border-b-0 pb-1 flex space-x-1.5 text-red-650">
                        <span>•</span>
                        <span>{err}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setImportStep('upload')}
                      className="border border-slate-350 text-slate-600 px-4 py-2 rounded-xl font-bold uppercase transition"
                    >
                      Upload Corrected File
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Preview Conflicts & Resolution */}
              {importStep === 'preview' && (
                <div className="space-y-4">
                  
                  {conflicts.length === 0 ? (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-emerald-900 leading-normal flex items-start space-x-2 font-semibold">
                      <CheckCircle size={18} className="text-[#0F6E4F] shrink-0 mt-0.5" />
                      <div>
                        <span><strong>Validation Successful!</strong> No conflicts found. All {csvData.length} records are new assets and can be imported directly into the Panchayat database registers.</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 leading-normal flex items-start space-x-2">
                        <AlertTriangle size={18} className="text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <span><strong>Conflict Resolution Audit:</strong> Detected <strong>{conflicts.length} records</strong> that already exist in the local registers. Choose the reconciliation action.</span>
                        </div>
                      </div>

                      <div className="border rounded-2xl max-h-56 overflow-y-auto divide-y text-[11px] leading-relaxed">
                        {conflicts.map(({ incoming, existing }) => {
                          const res = conflictResolutions[incoming.building_id];
                          return (
                            <div key={incoming.building_id} className="p-3.5 flex justify-between items-start bg-slate-50/50 hover:bg-slate-50">
                              <div className="space-y-1 pr-4">
                                <span className="font-mono font-bold text-slate-400 uppercase text-[9px]">Asset ID: {incoming.building_id}</span>
                                <div className="text-slate-800">
                                  <strong>DB Existing:</strong> {existing.businessName} (Owner: {existing.ownerName})
                                </div>
                                <div className="text-emerald-700">
                                  <strong>Import Incoming:</strong> {incoming.business_name} (Owner: {incoming.owner_name})
                                </div>
                              </div>
                              <div className="flex gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => setConflictResolutions(prev => ({ ...prev, [incoming.building_id]: 'overwrite' }))}
                                  className={`px-2.5 py-1 rounded-xl text-[9px] font-bold uppercase transition ${
                                    res === 'overwrite' ? 'bg-[#0F6E4F] text-white' : 'bg-slate-100 text-slate-500'
                                  }`}
                                >
                                  Import Overwrite
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConflictResolutions(prev => ({ ...prev, [incoming.building_id]: 'keep' }))}
                                  className={`px-2.5 py-1 rounded-xl text-[9px] font-bold uppercase transition ${
                                    res === 'keep' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500'
                                  }`}
                                >
                                  Keep DB
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  <div className="flex justify-between pt-2 border-t">
                    <button
                      onClick={() => setImportStep('upload')}
                      className="border border-slate-350 text-slate-600 px-4 py-2 rounded-xl font-bold uppercase transition"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleCommitImport}
                      className="bg-[#0F6E4F] hover:bg-[#0B5A3E] text-white px-5 py-2 rounded-xl font-bold uppercase transition shadow"
                    >
                      Commit {csvData.length} Records
                    </button>
                  </div>

                </div>
              )}

              {/* STEP 4: Import Success Report */}
              {importStep === 'report' && syncReport && (
                <div className="space-y-6 py-4 text-center">
                  <CheckCircle size={48} className="text-[#0F6E4F] mx-auto animate-pulse" />
                  
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-800">Reconciliation Sync Successful</h3>
                    <p className="text-xs text-slate-500 font-medium leading-normal">
                      The K-SMART export files sync pipeline has been committed to database registers.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-md mx-auto text-xs font-semibold">
                    <div className="bg-slate-50 border rounded-2xl p-3">
                      <span className="block text-slate-400 text-[9px] uppercase">Processed</span>
                      <span className="block text-lg font-bold text-slate-800 mt-1">{syncReport.total} rows</span>
                    </div>
                    <div className="bg-slate-50 border rounded-2xl p-3">
                      <span className="block text-slate-400 text-[9px] uppercase">Imported</span>
                      <span className="block text-lg font-bold text-status-licensed mt-1">+{syncReport.imported}</span>
                    </div>
                    <div className="bg-slate-50 border rounded-2xl p-3">
                      <span className="block text-slate-400 text-[9px] uppercase">Updated</span>
                      <span className="block text-lg font-bold text-blue-700 mt-1">~{syncReport.updated}</span>
                    </div>
                    <div className="bg-slate-50 border rounded-2xl p-3">
                      <span className="block text-slate-400 text-[9px] uppercase">Skipped / Err</span>
                      <span className="block text-lg font-bold text-status-unlicensed mt-1">{syncReport.errors}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowImportModal(false)}
                    className="bg-slate-800 hover:bg-black text-white px-6 py-2.5 rounded-xl font-bold uppercase transition"
                  >
                    Done & Close
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
