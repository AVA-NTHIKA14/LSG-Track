import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import type { SyncHistoryRecord } from '../types';
import { 
  Database, UploadCloud, FileSpreadsheet, CheckCircle2, 
  AlertTriangle, RefreshCw, Download, ShieldAlert, Clock, History, FileText
} from 'lucide-react';

export const DataSync: React.FC = () => {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const [syncHistory, setSyncHistory] = useState<SyncHistoryRecord[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<ArrayBuffer | string | null>(null);
  const [importResult, setImportResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentUser = authService.getCurrentUser();
  const panchayatCode = profile?.panchayatCode || localStorage.getItem('cp_active_panchayat_code') || 'G110706';
  const isDEOOrAdmin = profile?.role === 'clerk' || profile?.role === 'secretary' || currentUser?.role === 'Panchayat Section Clerk' || currentUser?.role === 'Administrator';

  useEffect(() => {
    const unsub = dbService.subscribeToSyncHistory(setSyncHistory);
    return unsub;
  }, []);

  if (!isDEOOrAdmin) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center max-w-md mx-auto my-12 shadow-sm">
        <ShieldAlert size={40} className="mx-auto text-red-600 mb-3" />
        <h3 className="font-extrabold text-slate-900 text-base">Access Restricted</h3>
        <p className="text-xs text-slate-500 mt-2">
          The K-SMART Data Synchronization Terminal is reserved exclusively for Data Entry Operators (DEO) and System Administrators.
        </p>
      </div>
    );
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setErrorMsg(null);
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      setFileData(event.target?.result || null);
    };

    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleProcessImport = async () => {
    if (!selectedFile || !fileData) {
      setErrorMsg("Please select a valid K-SMART CSV or Excel export file first.");
      return;
    }

    setUploading(true);
    setErrorMsg(null);

    try {
      const result = await dbService.processKSmartImport(
        fileData,
        selectedFile.name,
        currentUser?.name || 'Data Entry Operator'
      );
      setImportResult(result);
      setSelectedFile(null);
      setFileData(null);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to process K-SMART export. Check column formatting.");
    } finally {
      setUploading(false);
    }
  };

  const downloadSampleCSV = () => {
    const sampleHeader = "Building_ID,Business_Name,Owner_Name,Category,Ward_Number,Latitude,Longitude,License_ID,Expiry_Date,Fee_Paid,Status\n";
    const sampleRows = [
      "BLDG-G110706-001,Panangad Hypermarket,KUMARAN N,Retail,12,11.4421,75.8321,LIC-G110706-901,2027-03-31,3500,licensed",
      "BLDG-G110706-002,Vattoli Restaurant,AVANTHIKA K A,Hotel/Restaurant,12,11.4465,75.8359,LIC-G110706-902,2025-12-31,2200,expired",
      "BLDG-G110706-003,Kozhikode Textiles,SREYA M,Textiles,12,11.4402,75.8311,,2026-03-31,0,unlicensed"
    ].join("\n");

    const blob = new Blob([sampleHeader + sampleRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'KSmart_Trade_License_Sample_Export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-2">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <Database size={22} className="text-[#0F6E4F]" />
            <span>{t('sync.heading')}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('sync.subheading', { code: panchayatCode })}
          </p>
        </div>

        <button
          onClick={downloadSampleCSV}
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 self-start"
        >
          <Download size={14} />
          <span>Download Sample K-SMART CSV</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Import Workplace (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          
          <div className="border-b pb-3">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
              <UploadCloud size={20} className="text-[#0F6E4F]" />
              <span>Import K-SMART Export File</span>
            </h3>
            <p className="text-xs text-slate-500">
              Upload standard K-SMART CSV or Excel export file to sync licenses into LSG Track GIS Monitoring engine.
            </p>
          </div>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-slate-200 hover:border-[#0F6E4F] rounded-3xl p-8 text-center bg-slate-50/50 transition">
            <FileSpreadsheet size={44} className="mx-auto text-emerald-800/80 mb-3" />
            <h4 className="font-extrabold text-slate-900 text-sm mb-1">Select K-SMART CSV / Excel File</h4>
            <p className="text-xs text-slate-400 mb-4">Supported formats: .xlsx, .xls, .csv, .txt</p>

            <input
              type="file"
              accept=".csv,.txt,.xlsx,.xls"
              onChange={handleFileSelect}
              id="file-upload-input"
              className="hidden"
            />

            <label
              htmlFor="file-upload-input"
              className="cursor-pointer bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm inline-block"
            >
              Browse Computer File
            </label>

            {selectedFile && (
              <div className="mt-4 bg-emerald-50 text-[#0F6E4F] border border-emerald-200 rounded-2xl p-3 text-xs font-bold inline-flex items-center space-x-2">
                <FileText size={14} />
                <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-800 text-xs font-bold p-3 rounded-2xl flex items-center space-x-2">
              <AlertTriangle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Trigger */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleProcessImport}
              disabled={!selectedFile || uploading}
              className={`px-6 py-2.5 rounded-xl text-xs font-extrabold text-white transition shadow-md flex items-center space-x-2 ${
                !selectedFile || uploading ? 'bg-slate-300 cursor-not-allowed' : 'bg-[#0F6E4F] hover:bg-[#0B5A3E]'
              }`}
            >
              {uploading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Validating & Synchronizing...</span>
                </>
              ) : (
                <>
                  <Database size={14} />
                  <span>Execute K-SMART Synchronization</span>
                </>
              )}
            </button>
          </div>

          {/* Import Result Notification Box */}
          {importResult && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs space-y-2">
              <h4 className="font-extrabold text-[#0F6E4F] text-sm flex items-center space-x-1.5">
                <CheckCircle2 size={16} />
                <span>Synchronization Successful</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-bold text-slate-700 pt-1">
                <div className="bg-white p-2 rounded-xl border border-emerald-100">Total: {importResult.totalRecords}</div>
                <div className="bg-white p-2 rounded-xl border border-emerald-100 text-[#0F6E4F]">New: {importResult.importedCount}</div>
                <div className="bg-white p-2 rounded-xl border border-emerald-100 text-blue-700">Updated: {importResult.updatedCount}</div>
                <div className="bg-white p-2 rounded-xl border border-emerald-100 text-amber-700">Duplicates: {importResult.duplicateCount}</div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Import History & Validation Logs (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          
          <div className="border-b pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
              <History size={18} className="text-[#0F6E4F]" />
              <span>Synchronization Audit Log</span>
            </h3>
            <p className="text-xs text-slate-500">Historical log of past K-SMART file imports.</p>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {syncHistory.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs">
                <Clock size={32} className="mx-auto mb-2 text-slate-300" />
                <p>No synchronization history recorded yet.</p>
              </div>
            ) : (
              syncHistory.map(item => (
                <div key={item.id} className="border border-slate-200 rounded-2xl p-3.5 space-y-1.5 bg-slate-50/50">
                  <div className="flex justify-between items-start text-xs font-bold text-slate-900">
                    <span className="truncate">{item.fileName}</span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold shrink-0">{new Date(item.timestamp).toLocaleDateString()}</span>
                  </div>

                  <div className="text-[11px] text-slate-600 font-medium space-y-0.5">
                    <div>Operator: {item.operatorName}</div>
                    <div className="flex gap-2 text-[10px] font-bold pt-1">
                      <span className="text-[#0F6E4F]">+{item.importedCount} New</span>
                      <span className="text-blue-700">~{item.updatedCount} Updated</span>
                      <span className="text-amber-700">!{item.expiredCount} Expired</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

      </div>

      {/* Ward Member Field Survey Hand-Off Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="border-b pb-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
              <FileText size={18} className="text-[#0F6E4F]" />
              <span>Ward Member Field Survey Hand-Off (.json)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Export offline field surveys collected on a Ward Member device, or import survey batches into the central Panchayat registry.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const jsonStr = dbService.exportWardSurveysJSON();
                const blob = new Blob([jsonStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Ward_Surveys_Export_${panchayatCode}_${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="bg-emerald-50 hover:bg-emerald-100 text-[#0F6E4F] border border-emerald-200 px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center space-x-1.5"
            >
              <Download size={14} />
              <span>Export Survey Batch</span>
            </button>

            <label className="bg-slate-800 hover:bg-slate-900 text-white px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center space-x-1.5 cursor-pointer">
              <UploadCloud size={14} />
              <span>Import Survey Batch</span>
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = async (evt) => {
                    try {
                      const res = await dbService.importWardSurveysJSON(evt.target?.result as string);
                      alert(`Successfully imported ${res.importedCount} new field survey entries!`);
                    } catch (err: any) {
                      alert(err?.message || 'Failed to import survey batch.');
                    }
                  };
                  reader.readAsText(file);
                }}
              />
            </label>
          </div>
        </div>
      </div>

    </div>
  );
};
