import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';
import type { BuildingRecord, WardRecord, LicenseRecord, SurveyRecord } from '../types';
import { 
  Printer, FileSpreadsheet, 
  Layers, CircleDollarSign, CheckSquare, Clock, ShieldAlert 
} from 'lucide-react';

type ReportType = 'compliance' | 'licenses' | 'revenue' | 'surveys';

export const Reports: React.FC = () => {
  const [buildings, setBuildings] = useState<BuildingRecord[]>([]);
  const [wards, setWards] = useState<WardRecord[]>([]);
  const [licenses, setLicenses] = useState<LicenseRecord[]>([]);
  const [surveys, setSurveys] = useState<SurveyRecord[]>([]);

  // Filter query states
  const [reportType, setReportType] = useState<ReportType>('compliance');
  const [selectedWard, setSelectedWard] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    const unsubBuildings = dbService.subscribeToBuildings(setBuildings);
    const unsubWards = dbService.subscribeToWards(setWards);
    const unsubLicenses = dbService.subscribeToLicenses(setLicenses);
    const unsubSurveys = dbService.subscribeToSurveys(setSurveys);
    return () => {
      unsubBuildings();
      unsubWards();
      unsubLicenses();
      unsubSurveys();
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    dbService.addAuditLog('EXPORT', `Exported ${reportType} report matching query criteria to CSV.`);
    alert(`Generating CSV export matching current search results...`);
  };

  // Compile stats based on selections
  const totalBldgs = buildings.length;
  const totalRevenue = licenses.reduce((sum, lic) => sum + lic.feePaid, 0);

  const currentUser = authService.getCurrentUser();

  if (currentUser?.role !== 'Secretary' && currentUser?.role !== 'Administrator') {
    return (
      <div className="bg-white border border-gov-border rounded p-6 shadow-sm text-center py-12 text-slate-500 italic text-xs max-w-md mx-auto mt-12">
        <ShieldAlert size={36} className="mx-auto text-red-700 mb-2" />
        <p className="font-bold text-slate-800 text-sm mb-1">ACCESS RESTRICTED</p>
        <p className="mb-4">Compliance Reports are restricted to Panchayat Secretaries and Administrators.</p>
        <p>Your current profile ({currentUser?.role || 'Guest'}) does not hold access permissions.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b pb-4 flex justify-between items-center no-print">
        <div>
          <h2 className="text-xl font-bold text-gov-navy">Administrative Report Centre</h2>
          <p className="text-xs text-slate-500">Query and compile LSGD audit records, compliance indexes, and treasury collections.</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleExportCSV}
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded text-xs font-bold flex items-center space-x-1.5 transition"
          >
            <FileSpreadsheet size={13} className="text-emerald-700" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="bg-gov-navy hover:bg-gov-navy-light text-white px-3 py-1.5 rounded text-xs font-bold flex items-center space-x-1.5 transition shadow-sm"
          >
            <Printer size={13} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Query Filter panel */}
      <div className="bg-white border border-gov-border rounded p-4 shadow-sm flex flex-wrap gap-4 items-end no-print text-xs text-slate-700">
        
        <div>
          <label className="block font-bold text-slate-500 uppercase mb-1">Select Report Template</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as ReportType)}
            className="border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-gov-green w-48"
          >
            <option value="compliance">Ward-wise Compliance Audit</option>
            <option value="licenses">License status Register</option>
            <option value="revenue">Treasury Revenue Collection</option>
            <option value="surveys">Field Inspector Progress</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-500 uppercase mb-1">Scope Ward Boundary</label>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-gov-green w-40"
          >
            <option value="all">All Wards (Panchayat)</option>
            {wards.map(w => (
              <option key={w.id} value={w.id}>Ward {w.id} - {w.name}</option>
            ))}
          </select>
        </div>

        {reportType === 'compliance' && (
          <div>
            <label className="block font-bold text-slate-500 uppercase mb-1">Filter Building Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-gov-green w-40"
            >
              <option value="all">All Status</option>
              <option value="licensed">Licensed Only</option>
              <option value="unlicensed">Unlicensed Only</option>
              <option value="pending">Pending Verification</option>
              <option value="govt">Government Buildings</option>
            </select>
          </div>
        )}

      </div>

      {/* Print-formatted layout container */}
      <div className="bg-white border border-gov-border rounded p-6 md:p-8 shadow-sm print-card space-y-6">
        
        {/* Printable Official Header */}
        <div className="text-center border-b-2 border-slate-800 pb-5">
          <div className="text-xs uppercase tracking-widest font-bold text-slate-600">Local Self Government Department</div>
          <h2 className="text-lg font-extrabold uppercase text-gov-navy mt-1">Chakkittapara Grama Panchayat Office</h2>
          <p className="text-[10px] text-slate-500">Kozhikode District, Kerala State, India | Tel: 0496 266 2235</p>
          <div className="mt-4 px-3 py-1 bg-slate-50 rounded border inline-block text-[10px] font-mono text-slate-700">
            REF NO: LSGD/CP/LIC/2026/RP-{reportType.toUpperCase()} | DATE OF COMPILE: 2026-06-28
          </div>
        </div>

        {/* Report Overview summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 border rounded p-3 text-center">
            <span className="block text-slate-400 font-bold uppercase text-[8px] tracking-wider mb-1">Panchayat Extent</span>
            <span className="block font-bold text-slate-800">Chakkittapara GP</span>
          </div>
          <div className="bg-slate-50 border rounded p-3 text-center">
            <span className="block text-slate-400 font-bold uppercase text-[8px] tracking-wider mb-1">Total Assets Listed</span>
            <span className="block font-bold text-slate-800">{totalBldgs} commercial units</span>
          </div>
          <div className="bg-slate-50 border rounded p-3 text-center">
            <span className="block text-slate-400 font-bold uppercase text-[8px] tracking-wider mb-1">Treasury Revenue</span>
            <span className="block font-bold text-emerald-800 font-mono">₹{totalRevenue.toLocaleString()}</span>
          </div>
          <div className="bg-slate-50 border rounded p-3 text-center">
            <span className="block text-slate-400 font-bold uppercase text-[8px] tracking-wider mb-1">Portal Status</span>
            <span className="block font-bold text-status-licensed">ACTIVE / AUDITED</span>
          </div>
        </div>

        {/* Template Renders */}
        {reportType === 'compliance' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider border-b pb-1.5 flex items-center space-x-1.5">
              <Layers size={14} />
              <span>Ward-wise Compliance Audit</span>
            </h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs">
                <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase">
                  <tr>
                    <th className="px-3 py-2">Ward Number</th>
                    <th className="px-3 py-2">Ward Name</th>
                    <th className="px-3 py-2 text-center">Registered</th>
                    <th className="px-3 py-2 text-center">Licensed</th>
                    <th className="px-3 py-2 text-center">Unlicensed</th>
                    <th className="px-3 py-2 text-center">Pending</th>
                    <th className="px-3 py-2 text-right">Compliance</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {wards
                    .filter(w => selectedWard === 'all' || w.id === selectedWard)
                    .map(w => (
                      <tr key={w.id} className="hover:bg-slate-50">
                        <td className="px-3 py-2 font-mono font-bold">Ward {w.id}</td>
                        <td className="px-3 py-2">{w.name}</td>
                        <td className="px-3 py-2 text-center font-semibold">{w.totalBuildings}</td>
                        <td className="px-3 py-2 text-center text-status-licensed font-semibold">{w.licensedBuildings}</td>
                        <td className="px-3 py-2 text-center text-status-unlicensed font-semibold">{w.unlicensedBuildings}</td>
                        <td className="px-3 py-2 text-center text-status-pending font-semibold">{w.pendingBuildings}</td>
                        <td className="px-3 py-2 text-right font-extrabold text-slate-900">{w.compliancePercentage}%</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === 'licenses' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider border-b pb-1.5 flex items-center space-x-1.5">
              <Clock size={14} />
              <span>License Expiry and Status log</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs">
                <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase">
                  <tr>
                    <th className="px-3 py-2">License ID</th>
                    <th className="px-3 py-2">Building ID</th>
                    <th className="px-3 py-2">Establishment Title</th>
                    <th className="px-3 py-2">Classification</th>
                    <th className="px-3 py-2">Date Issued</th>
                    <th className="px-3 py-2">Expiry Date</th>
                    <th className="px-3 py-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {licenses
                    .filter(l => {
                      const b = buildings.find(bld => bld.id === l.buildingId);
                      return selectedWard === 'all' || b?.wardNumber === selectedWard;
                    })
                    .map(l => {
                      const b = buildings.find(bld => bld.id === l.buildingId);
                      return (
                        <tr key={l.id} className="hover:bg-slate-50">
                          <td className="px-3 py-2 font-mono font-bold text-slate-800">{l.id}</td>
                          <td className="px-3 py-2 font-mono">{l.buildingId}</td>
                          <td className="px-3 py-2 font-bold">{b?.businessName || 'N/A'}</td>
                          <td className="px-3 py-2">{l.licenseType}</td>
                          <td className="px-3 py-2 font-mono">{l.issueDate}</td>
                          <td className="px-3 py-2 font-mono text-red-700 font-semibold">{l.expiryDate}</td>
                          <td className="px-3 py-2 text-right">
                            <span className="font-bold uppercase text-[9px]">{l.status}</span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === 'revenue' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider border-b pb-1.5 flex items-center space-x-1.5">
              <CircleDollarSign size={14} />
              <span>Treasury Revenue Collection register</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs">
                <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase">
                  <tr>
                    <th className="px-3 py-2">Treasury Receipt</th>
                    <th className="px-3 py-2">License ID</th>
                    <th className="px-3 py-2">Establishment Reference</th>
                    <th className="px-3 py-2">Account Head</th>
                    <th className="px-3 py-2">Receipt Date</th>
                    <th className="px-3 py-2 text-right">Amount Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700 font-mono">
                  {licenses
                    .filter(l => {
                      const b = buildings.find(bld => bld.id === l.buildingId);
                      return selectedWard === 'all' || b?.wardNumber === selectedWard;
                    })
                    .map(l => {
                      const b = buildings.find(bld => bld.id === l.buildingId);
                      return (
                        <tr key={l.id} className="hover:bg-slate-50">
                          <td className="px-3 py-2">TR-CP-{Math.floor(10000 + Math.random() * 90000)}</td>
                          <td className="px-3 py-2 font-bold">{l.id}</td>
                          <td className="px-3 py-2 font-sans font-medium">{b?.businessName || 'N/A'}</td>
                          <td className="px-3 py-2 font-sans text-slate-500">{l.licenseType} Fee</td>
                          <td className="px-3 py-2">{l.issueDate}</td>
                          <td className="px-3 py-2 text-right font-bold text-emerald-800">₹{l.feePaid.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  <tr className="bg-slate-100 font-sans border-t-2 border-slate-700 font-bold">
                    <td colSpan={5} className="px-3 py-3 text-right uppercase">CUMULATIVE TREASURY COLLECTION:</td>
                    <td className="px-3 py-3 text-right font-mono text-emerald-950 text-sm">
                      ₹{licenses
                        .filter(l => {
                          const b = buildings.find(bld => bld.id === l.buildingId);
                          return selectedWard === 'all' || b?.wardNumber === selectedWard;
                        })
                        .reduce((sum, l) => sum + l.feePaid, 0)
                        .toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === 'surveys' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider border-b pb-1.5 flex items-center space-x-1.5">
              <CheckSquare size={14} />
              <span>Field Surveyor Inspection Log</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs">
                <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase">
                  <tr>
                    <th className="px-3 py-2">Survey ID</th>
                    <th className="px-3 py-2">Officer Name</th>
                    <th className="px-3 py-2">Building reference</th>
                    <th className="px-3 py-2 font-mono">GPS Coordinates</th>
                    <th className="px-3 py-2">Inspection Date</th>
                    <th className="px-3 py-2">Review Status</th>
                    <th className="px-3 py-2 text-right">Remarks Summary</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {surveys
                    .filter(s => {
                      const b = buildings.find(bld => bld.id === s.buildingId);
                      return selectedWard === 'all' || b?.wardNumber === selectedWard;
                    })
                    .map(s => {
                      const b = buildings.find(bld => bld.id === s.buildingId);
                      return (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 font-mono font-bold text-slate-800">{s.id}</td>
                          <td className="px-3 py-2.5 font-semibold">{s.officerName}</td>
                          <td className="px-3 py-2.5">
                            <span className="block font-bold">{b?.businessName || 'N/A'}</span>
                            <span className="block text-[10px] text-slate-400 font-mono">{s.buildingId}</span>
                          </td>
                          <td className="px-3 py-2.5 font-mono text-slate-500">{s.gps.lat.toFixed(5)}, {s.gps.lng.toFixed(5)}</td>
                          <td className="px-3 py-2.5 font-mono">{s.surveyDate}</td>
                          <td className="px-3 py-2.5">
                            <span className={`px-1.5 py-0.25 rounded text-[9px] font-bold uppercase ${
                              s.status === 'approved' 
                                ? 'bg-green-50 text-status-licensed' 
                                : s.status === 'rejected'
                                  ? 'bg-red-50 text-status-unlicensed'
                                  : 'bg-amber-50 text-status-pending'
                            }`}>
                              {s.status}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-right text-slate-500 italic max-w-xs truncate">{s.remarks}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Printable Official Footer Signature */}
        <div className="pt-16 grid grid-cols-2 text-center text-xs border-t border-dashed mt-12 text-slate-700">
          <div>
            <div className="h-12"></div>
            <div className="border-t border-slate-400 w-48 mx-auto mt-2 pt-1 font-bold">Field Survey Officer</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Chakkittapara Panchayat</div>
          </div>
          <div>
            <div className="h-12"></div>
            <div className="border-t border-slate-400 w-48 mx-auto mt-2 pt-1 font-bold">Secretary Approval</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">LSGD Kerala Authority</div>
          </div>
        </div>

      </div>

    </div>
  );
};
