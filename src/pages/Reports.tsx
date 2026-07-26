import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';
import { dbService } from '../services/dbService';
import { KERALA_PANCHAYATHS } from '../data/keralaPanchayaths';
import type { BuildingRecord, WardRecord, LicenseRecord, SurveyRecord, AuditLogRecord } from '../types';
import { 
  Printer, FileSpreadsheet, 
  Layers, CircleDollarSign, CheckSquare, Clock
} from 'lucide-react';

type ReportType = 'compliance' | 'licenses' | 'revenue' | 'surveys' | 'audit';

export const Reports: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [buildings, setBuildings] = useState<BuildingRecord[]>([]);
  const [wards, setWards] = useState<WardRecord[]>([]);
  const [licenses, setLicenses] = useState<LicenseRecord[]>([]);
  const [surveys, setSurveys] = useState<SurveyRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);

  // Filter query states
  const [reportType, setReportType] = useState<ReportType>('compliance');
  const [selectedWard, setSelectedWard] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const activePanchayatCode = localStorage.getItem('cp_active_panchayat_code') || 'G110706';

  // Panchayat Meta State
  const [panchayatName, setPanchayatName] = useState(() => {
    const match = KERALA_PANCHAYATHS.find(p => p.code.toLowerCase() === activePanchayatCode.toLowerCase());
    return match ? match.name : 'Grama Panchayat';
  });

  useEffect(() => {
    const unsubBuildings = dbService.subscribeToBuildings(setBuildings);
    const unsubWards = dbService.subscribeToWards(setWards);
    const unsubLicenses = dbService.subscribeToLicenses(setLicenses);
    const unsubSurveys = dbService.subscribeToSurveys(setSurveys);
    const unsubAudit = dbService.subscribeToAuditLogs(setAuditLogs);
    const unsubPanchayaths = dbService.subscribeToPanchayaths((list) => {
      const activeP = list.find(p => p.id === activePanchayatCode);
      if (activeP) {
        setPanchayatName(activeP.name);
      } else {
        const match = KERALA_PANCHAYATHS.find(p => p.code.toLowerCase() === activePanchayatCode.toLowerCase());
        if (match) setPanchayatName(match.name);
      }
    });

    return () => {
      unsubBuildings();
      unsubWards();
      unsubLicenses();
      unsubSurveys();
      unsubAudit();
      unsubPanchayaths();
    };
  }, [activePanchayatCode]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let dataRows: Record<string, any>[] = [];

    if (reportType === 'compliance') {
      dataRows = wards
        .filter(w => selectedWard === 'all' || w.id === selectedWard)
        .map(w => ({
          'Ward Number': `Ward ${w.id}`,
          'Ward Name': w.name,
          'Total Buildings': w.totalBuildings,
          'Licensed Units': w.licensedBuildings,
          'Unlicensed Units': w.unlicensedBuildings,
          'Pending Verification': w.pendingBuildings,
          'Compliance Rate': `${w.compliancePercentage}%`,
          'Assigned Officer': w.assignedOfficer || 'N/A'
        }));
    } else if (reportType === 'licenses') {
      dataRows = licenses
        .filter(l => {
          const b = buildings.find(bld => bld.id === l.buildingId);
          return selectedWard === 'all' || b?.wardNumber === selectedWard;
        })
        .map(l => {
          const b = buildings.find(bld => bld.id === l.buildingId);
          return {
            'License ID': l.id,
            'Building Reference': l.buildingId,
            'Establishment Name': b?.businessName || 'N/A',
            'Proprietor Name': b?.ownerName || 'N/A',
            'License Type': l.licenseType,
            'Issue Date': l.issueDate,
            'Expiry Date': l.expiryDate,
            'Fee Paid (INR)': l.feePaid,
            'Status': l.status
          };
        });
    } else if (reportType === 'revenue') {
      dataRows = licenses
        .filter(l => {
          const b = buildings.find(bld => bld.id === l.buildingId);
          return selectedWard === 'all' || b?.wardNumber === selectedWard;
        })
        .map(l => {
          const b = buildings.find(bld => bld.id === l.buildingId);
          return {
            'License Reference': l.id,
            'Establishment Name': b?.businessName || 'N/A',
            'Proprietor Name': b?.ownerName || 'N/A',
            'Category': l.licenseType,
            'Issue Date': l.issueDate,
            'Amount Paid (INR)': l.feePaid,
            'Payment Status': 'PAID'
          };
        });
    } else if (reportType === 'surveys') {
      dataRows = surveys
        .filter(s => {
          const b = buildings.find(bld => bld.id === s.buildingId);
          return selectedWard === 'all' || b?.wardNumber === selectedWard;
        })
        .map(s => {
          const b = buildings.find(bld => bld.id === s.buildingId);
          return {
            'Survey ID': s.id,
            'Officer Name': s.officerName,
            'Building Reference': s.buildingId,
            'Establishment Name': b?.businessName || 'N/A',
            'Latitude': s.gps.lat,
            'Longitude': s.gps.lng,
            'Inspection Date': s.surveyDate,
            'Status': s.status,
            'Remarks': s.remarks
          };
        });
    }

    if (dataRows.length === 0) {
      alert('No data rows found matching the selected filters to export.');
      return;
    }

    const ws = XLSX.utils.json_to_sheet(dataRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, reportType.toUpperCase());
    const filename = `${panchayatName.replace(/[^a-z0-9]/gi, '_')}_${reportType}_report.xlsx`;
    XLSX.writeFile(wb, filename);

    dbService.addAuditLog('EXPORT', `Exported ${reportType} report containing ${dataRows.length} rows to Excel spreadsheet (${filename}).`);
  };

  // Compile stats based on selections
  const totalBldgs = buildings.length;
  const totalRevenue = licenses.reduce((sum, lic) => sum + lic.feePaid, 0);



  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b pb-4 flex justify-between items-center no-print">
        <div>
          <h2 className="text-xl font-bold text-gov-navy">{t('reports.heading')}</h2>
          <p className="text-xs text-slate-500">{t('reports.subheading')}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleExportCSV}
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded text-xs font-bold flex items-center space-x-1.5 transition"
          >
            <FileSpreadsheet size={13} className="text-emerald-700" />
            <span>{i18n.language === 'ml' ? 'സി.എസ്.വി എക്സ്പോർട്ട്' : 'Export CSV'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="bg-gov-navy hover:bg-gov-navy-light text-white px-3 py-1.5 rounded text-xs font-bold flex items-center space-x-1.5 transition shadow-sm"
          >
            <Printer size={13} />
            <span>{i18n.language === 'ml' ? 'റിപ്പോർട്ട് പ്രിന്റ് ചെയ്യുക' : 'Print Report'}</span>
          </button>
        </div>
      </div>

      {/* Query Filter panel */}
      <div className="bg-white border border-gov-border rounded p-4 shadow-sm flex flex-wrap gap-4 items-end no-print text-xs text-slate-700">
        
        <div>
          <label className="block font-bold text-slate-500 uppercase mb-1">
            {i18n.language === 'ml' ? 'റിപ്പോർട്ട് മാതൃക' : 'Select Report Template'}
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as ReportType)}
            className="border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-gov-green w-48"
          >
            <option value="compliance">{i18n.language === 'ml' ? 'വാർഡ് തിരിച്ചു ലൈസൻസ് വിവരങ്ങൾ' : 'Ward-wise Compliance Audit'}</option>
            <option value="licenses">{i18n.language === 'ml' ? 'വ്യാപാര ലൈസൻസ് രജിസ്റ്റർ' : 'License Status Register'}</option>
            <option value="revenue">{i18n.language === 'ml' ? 'ലൈസൻസ് ഫീസ് വരുമാനം' : 'Treasury Revenue Collection'}</option>
            <option value="surveys">{i18n.language === 'ml' ? 'ഫീൽഡ് പരിശോധനാ പുരോഗതി' : 'Field Inspector Progress'}</option>
            <option value="audit">{i18n.language === 'ml' ? 'ഭരണപരമായ ആഡിറ്റ് രജിസ്റ്റർ' : 'Administrative Audit Register'}</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-500 uppercase mb-1">
            {i18n.language === 'ml' ? 'വാർഡ് പരിധി' : 'Scope Ward Boundary'}
          </label>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-gov-green w-40"
          >
            <option value="all">{i18n.language === 'ml' ? 'എല്ലാ വാർഡുകളും' : 'All Wards (Panchayat)'}</option>
            {wards.map(w => (
              <option key={w.id} value={w.id}>{i18n.language === 'ml' ? `വാർഡ് ${w.id} - ${w.name}` : `Ward ${w.id} - ${w.name}`}</option>
            ))}
          </select>
        </div>

        {reportType === 'compliance' && (
          <div>
            <label className="block font-bold text-slate-500 uppercase mb-1">
              {i18n.language === 'ml' ? 'ലൈസൻസ് സ്റ്റാറ്റസ്' : 'Filter Building Status'}
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-gov-green w-40"
            >
              <option value="all">{i18n.language === 'ml' ? 'എല്ലാ സ്റ്റാറ്റസും' : 'All Status'}</option>
              <option value="licensed">{i18n.language === 'ml' ? 'ലൈസൻസ് ഉള്ളവ മാത്രം' : 'Licensed Only'}</option>
              <option value="unlicensed">{i18n.language === 'ml' ? 'ലൈസൻസ് ഇല്ലാത്തവ മാത്രം' : 'Unlicensed Only'}</option>
              <option value="pending">{i18n.language === 'ml' ? 'പരിശോധനയിലുള്ളവ' : 'Pending Verification'}</option>
              <option value="govt">{i18n.language === 'ml' ? 'സർക്കാർ സ്ഥാപനങ്ങൾ' : 'Government Buildings'}</option>
            </select>
          </div>
        )}

      </div>

      {/* Print-formatted layout container */}
      <div className="bg-white border border-gov-border rounded p-6 md:p-8 shadow-sm print-card space-y-6">
        
        {/* Printable Official Header */}
        <div className="text-center border-b-2 border-slate-800 pb-5">
          <div className="text-xs uppercase tracking-widest font-bold text-slate-600">
            {i18n.language === 'ml' ? '?????? ??????? ?????? ???????? ???????' : 'Local Trade License Monitoring Portal'}
          </div>
          <h2 className="mt-1 text-lg font-extrabold text-slate-900">{panchayatName}</h2>
          <p className="mt-1 text-xs text-slate-500">{i18n.language === 'ml' ? '???????? ???????????' : 'Official report'}</p>
        </div>

        {/* Report Overview summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 border rounded p-3 text-center">
            <span className="block text-slate-400 font-bold uppercase text-[8px] tracking-wider mb-1">{i18n.language === 'ml' ? 'പഞ്ചായത്ത്' : 'Panchayat Extent'}</span>
            <span className="block font-bold text-slate-800">{panchayatName}</span>
          </div>
          <div className="bg-slate-50 border rounded p-3 text-center">
            <span className="block text-slate-400 font-bold uppercase text-[8px] tracking-wider mb-1">{i18n.language === 'ml' ? 'ആകെ കെട്ടിടങ്ങൾ' : 'Total Assets Listed'}</span>
            <span className="block font-bold text-slate-800">{totalBldgs} commercial units</span>
          </div>
          <div className="bg-slate-50 border rounded p-3 text-center">
            <span className="block text-slate-400 font-bold uppercase text-[8px] tracking-wider mb-1">{i18n.language === 'ml' ? 'ആകെ വരുമാനം' : 'Treasury Revenue'}</span>
            <span className="block font-bold text-emerald-800 font-mono">₹{totalRevenue.toLocaleString()}</span>
          </div>
          <div className="bg-slate-50 border rounded p-3 text-center">
            <span className="block text-slate-400 font-bold uppercase text-[8px] tracking-wider mb-1">{i18n.language === 'ml' ? 'പോർട്ടൽ സ്റ്റാറ്റസ്' : 'Portal Status'}</span>
            <span className="block font-bold text-status-licensed">ACTIVE / AUDITED</span>
          </div>
        </div>

        {/* Template Renders */}
        {reportType === 'compliance' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider border-b pb-1.5 flex items-center space-x-1.5">
              <Layers size={14} />
              <span>{i18n.language === 'ml' ? 'വാർഡ് തിരിച്ചു അനുമതിപ്പട്ടിക' : 'Ward-wise Compliance Audit'}</span>
            </h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs">
                <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase">
                  <tr>
                    <th className="px-3 py-2">{i18n.language === 'ml' ? 'വാർഡ് നമ്പർ' : 'Ward Number'}</th>
                    <th className="px-3 py-2">{i18n.language === 'ml' ? 'വാർഡിന്റെ പേര്' : 'Ward Name'}</th>
                    <th className="px-3 py-2 text-center">{i18n.language === 'ml' ? 'രജിസ്റ്റർ ചെയ്തവ' : 'Registered'}</th>
                    <th className="px-3 py-2 text-center">{i18n.language === 'ml' ? 'ലൈസൻസ് ഉള്ളവ' : 'Licensed'}</th>
                    <th className="px-3 py-2 text-center">{i18n.language === 'ml' ? 'ഇല്ലാത്തവ' : 'Unlicensed'}</th>
                    <th className="px-3 py-2 text-center">{i18n.language === 'ml' ? 'പരിശോധനയിൽ' : 'Pending'}</th>
                    <th className="px-3 py-2 text-right">{i18n.language === 'ml' ? 'ശതമാനം' : 'Compliance'}</th>
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
              <span>{i18n.language === 'ml' ? 'ലൈസൻസ് കാലാവധി രജിസ്റ്റർ' : 'License Expiry and Status log'}</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs">
                <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase">
                  <tr>
                    <th className="px-3 py-2">{i18n.language === 'ml' ? 'ലൈസൻസ് നമ്പർ' : 'License ID'}</th>
                    <th className="px-3 py-2">{i18n.language === 'ml' ? 'കെട്ടിട നമ്പർ' : 'Building ID'}</th>
                    <th className="px-3 py-2">{i18n.language === 'ml' ? 'സ്ഥാപനം' : 'Establishment Title'}</th>
                    <th className="px-3 py-2">{i18n.language === 'ml' ? 'വിഭാഗം' : 'Classification'}</th>
                    <th className="px-3 py-2">{i18n.language === 'ml' ? 'നൽകിയ തീയതി' : 'Date Issued'}</th>
                    <th className="px-3 py-2">{i18n.language === 'ml' ? 'കാലാവധി' : 'Expiry Date'}</th>
                    <th className="px-3 py-2 text-right">{i18n.language === 'ml' ? 'സ്റ്റാറ്റസ്' : 'License Status'}</th>
                    <th className="px-3 py-2 text-right">{i18n.language === 'ml' ? 'ഓർമ്മപ്പെടുത്തൽ' : 'SMS Reminders'}</th>
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
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                              l.status === 'active' ? 'bg-emerald-100 text-status-licensed' : 'bg-red-100 text-status-unlicensed'
                            }`}>{l.status}</span>
                          </td>
                          <td className="px-3 py-2 text-right">
                            <button
                              type="button"
                              onClick={async () => {
                                const phoneNum = `+91 944${Math.floor(1000000 + Math.random() * 9000000)}`;
                                const alertMsg = `[SMS DISPATCHED] To: Proprietor of ${b?.businessName || 'Establishment'} (Phone: ${phoneNum}).\n\nMessage: Your D&O Trade License #${l.id} is expiring on ${l.expiryDate}. Please submit your renewal draft immediately at the ${panchayatName} portal.`;
                                alert(alertMsg);
                                await dbService.addAuditLog('NOTIFICATION', `Dispatched SMS renewal reminder to owner of ${b?.businessName || 'Establishment'} (License ID: ${l.id}, Phone: ${phoneNum}) regarding expiry date ${l.expiryDate}.`);
                              }}
                              className="bg-gov-navy hover:bg-gov-navy-light text-white text-[9px] font-bold uppercase px-2 py-0.75 rounded flex items-center space-x-1 ml-auto transition shadow-sm"
                            >
                              <Clock size={10} />
                              <span>{i18n.language === 'ml' ? 'അറിയിപ്പ് അയക്കുക' : 'Send Alert'}</span>
                            </button>
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
              <span>{i18n.language === 'ml' ? 'പഞ്ചായത്ത് റവന്യൂ വരുമാന രജിസ്റ്റർ' : 'Treasury Revenue Collection register'}</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs">
                <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase">
                  <tr>
                    <th className="px-3 py-2">{i18n.language === 'ml' ? 'റസീപ്റ്റ് നമ്പർ' : 'Treasury Receipt'}</th>
                    <th className="px-3 py-2">{i18n.language === 'ml' ? 'ലൈസൻസ് നമ്പർ' : 'License ID'}</th>
                    <th className="px-3 py-2">{i18n.language === 'ml' ? 'സ്ഥാപനം' : 'Establishment Reference'}</th>
                    <th className="px-3 py-2">{i18n.language === 'ml' ? 'ഇനം' : 'Account Head'}</th>
                    <th className="px-3 py-2">{i18n.language === 'ml' ? 'തീയതി' : 'Receipt Date'}</th>
                    <th className="px-3 py-2 text-right">{i18n.language === 'ml' ? 'അടച്ച തുക' : 'Amount Paid'}</th>
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
                    <td colSpan={5} className="px-3 py-3 text-right uppercase">{i18n.language === 'ml' ? 'ആകെ പിരിച്ചെടുത്ത വരുമാനം:' : 'CUMULATIVE TREASURY COLLECTION:'}</td>
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
                    <th className="px-3 py-2">{i18n.language === 'ml' ? 'സർവേ ഐ.ഡി' : 'Survey ID'}</th>
                    <th className="px-3 py-2">{i18n.language === 'ml' ? 'ഉദ്യോഗസ്ഥൻ' : 'Officer Name'}</th>
                    <th className="px-3 py-2">{i18n.language === 'ml' ? 'സ്ഥാപനം' : 'Building reference'}</th>
                    <th className="px-3 py-2 font-mono">{i18n.language === 'ml' ? 'ജി.പി.എസ് സ്ഥാനരേഖ' : 'GPS Coordinates'}</th>
                    <th className="px-3 py-2">{i18n.language === 'ml' ? 'പരിശോധനാ തീയതി' : 'Inspection Date'}</th>
                    <th className="px-3 py-2">{i18n.language === 'ml' ? 'സ്റ്റാറ്റസ്' : 'Review Status'}</th>
                    <th className="px-3 py-2 text-right">{i18n.language === 'ml' ? 'കുറിപ്പുകൾ' : 'Remarks Summary'}</th>
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

        {/* AUDIT REGISTER TABLE */}
        {reportType === 'audit' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-gov-navy text-sm uppercase">{i18n.language === 'ml' ? 'ഭരണപരമായ ആഡിറ്റ് രജിസ്റ്റർ' : 'Official Operations Audit Register'}</h3>
              <span className="text-[10px] text-slate-500 font-bold">{i18n.language === 'ml' ? 'ആകെ ആഡിറ്റുകൾ:' : 'Total Audit Entries:'} {auditLogs.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b uppercase font-bold text-slate-500">
                  <tr>
                    <th className="px-3 py-2">{i18n.language === 'ml' ? 'ഉദ്യോഗസ്ഥൻ' : 'User / Officer'}</th>
                    <th className="px-3 py-2">{i18n.language === 'ml' ? 'പ്രവർത്തനം' : 'Action Performed'}</th>
                    <th className="px-3 py-2">{i18n.language === 'ml' ? 'സമയരേഖ' : 'Timestamp'}</th>
                    <th className="px-3 py-2">{i18n.language === 'ml' ? 'വിശദാംശങ്ങൾ' : 'Details / Result'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 font-medium">
                      <td className="px-3 py-2.5 font-bold text-slate-900">{log.userName} ({log.userRole})</td>
                      <td className="px-3 py-2.5 font-bold text-[#0F6E4F] font-mono">{log.action}</td>
                      <td className="px-3 py-2.5 font-mono text-slate-500 text-[11px]">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="px-3 py-2.5 text-slate-700">{log.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Printable Official Footer Signature */}
        <div className="pt-16 grid grid-cols-2 text-center text-xs border-t border-dashed mt-12 text-slate-700">
          <div>
            <div className="h-12"></div>
            <div className="border-t border-slate-400 w-48 mx-auto mt-2 pt-1 font-bold">
              {i18n.language === 'ml' ? 'ഫീൽഡ് സർവേ ഉദ്യോഗസ്ഥൻ' : 'Field Survey Officer'}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">{panchayatName}</div>
          </div>
          <div>
            <div className="h-12"></div>
            <div className="border-t border-slate-400 w-48 mx-auto mt-2 pt-1 font-bold">
              {i18n.language === 'ml' ? 'പഞ്ചായത്ത് സെക്രട്ടറി സാക്ഷ്യപ്പെടുത്തൽ' : 'Secretary Approval'}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
              {i18n.language === 'ml' ? 'തദ്ദേശ സ്വയംഭരണ വകുപ്പ്, കേരളം' : 'LSGD Kerala Authority'}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
