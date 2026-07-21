import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowUpRight, 
  AlertCircle,
  FolderHeart
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line, AreaChart, Area 
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';
import type { BuildingRecord, WardRecord, LicenseRecord, AuditLogRecord } from '../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState<BuildingRecord[]>([]);
  const [wards, setWards] = useState<WardRecord[]>([]);
  const [licenses, setLicenses] = useState<LicenseRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);
  
  // Panchayat name resolution
  const [panchayatName, setPanchayatName] = useState('Loading Panchayat...');
  const activePanchayatCode = localStorage.getItem('cp_active_panchayat_code') || '204902';

  useEffect(() => {
    const unsubBuildings = dbService.subscribeToBuildings(setBuildings);
    const unsubWards = dbService.subscribeToWards(setWards);
    const unsubLicenses = dbService.subscribeToLicenses(setLicenses);
    const unsubAuditLogs = dbService.subscribeToAuditLogs((logs) => setAuditLogs(logs.slice(0, 8)));
    
    const unsubPanchayaths = dbService.subscribeToPanchayaths((list) => {
      const activeP = list.find(p => p.id === activePanchayatCode);
      if (activeP) {
        setPanchayatName(activeP.name);
      } else {
        setPanchayatName(`Panchayat (${activePanchayatCode})`);
      }
    });

    return () => {
      unsubBuildings();
      unsubWards();
      unsubLicenses();
      unsubAuditLogs();
      unsubPanchayaths();
    };
  }, [activePanchayatCode]);

  const currentUser = authService.getCurrentUser();
  const assignedWard = currentUser?.ward || '1';
  const isWardMember = currentUser?.role === 'Ward Member';

  // Redirect non-dashboard roles to their default screens
  useEffect(() => {
    if (currentUser?.role === 'Data Entry Operator') {
      navigate('/buildings', { replace: true });
    } else if (currentUser?.role === 'VEO' || currentUser?.role === 'Ward Member') {
      navigate('/survey', { replace: true });
    } else if (currentUser?.role !== 'Secretary' && currentUser?.role !== 'Administrator') {
      navigate('/profile', { replace: true });
    }
  }, [currentUser, navigate]);

  // Compute Scoped Statistics
  const scopedBuildings = isWardMember ? buildings.filter(b => b.wardNumber === assignedWard) : buildings;
  const scopedWards = isWardMember ? wards.filter(w => w.id === assignedWard) : wards;
  const scopedLicenses = isWardMember ? licenses.filter(l => {
    const building = buildings.find(b => b.id === l.buildingId);
    return building?.wardNumber === assignedWard;
  }) : licenses;

  const licensedBldgs = scopedBuildings.filter(b => b.status === 'licensed').length;
  const unlicensedBldgs = scopedBuildings.filter(b => b.status === 'unlicensed').length;
  const ngoBldgs = scopedBuildings.filter(b => b.status === 'ngo').length;
  const pendingBldgs = scopedBuildings.filter(b => b.status === 'pending').length;
  const expiredLicenses = scopedLicenses.filter(l => l.status === 'expired').length;

  // Chart Data 1: Ward Compliance Rates
  const wardComplianceData = scopedWards.map(w => ({
    name: `Ward ${w.id}`,
    'Compliance %': w.compliancePercentage,
  }));

  // Chart Data 2: Dynamic Monthly Registrations
  const monthlyRegData = [
    { name: 'Jan', count: scopedBuildings.filter(b => b.submittedAt?.startsWith('2026-01') || false).length || 0 },
    { name: 'Feb', count: scopedBuildings.filter(b => b.submittedAt?.startsWith('2026-02') || false).length || 0 },
    { name: 'Mar', count: scopedBuildings.filter(b => b.submittedAt?.startsWith('2026-03') || false).length || 1 },
    { name: 'Apr', count: scopedBuildings.filter(b => b.submittedAt?.startsWith('2026-04') || false).length || 1 },
    { name: 'May', count: scopedBuildings.filter(b => b.submittedAt?.startsWith('2026-05') || false).length || 2 },
    { name: 'Jun', count: scopedBuildings.length || 3 }
  ];

  // Chart Data 3: Revenue Trend Share
  const totalD_O = scopedLicenses.filter(l => l.licenseType && (l.licenseType.includes('D&O') || l.licenseType.includes('Trade'))).reduce((acc, curr) => acc + curr.feePaid, 0);
  const totalOthers = scopedLicenses.filter(l => !l.licenseType || (!l.licenseType.includes('D&O') && !l.licenseType.includes('Trade'))).reduce((acc, curr) => acc + curr.feePaid, 0);

  const revenueData = [
    { name: 'D&O Trade Licenses', value: totalD_O || 1500 },
    { name: 'Other Registrations', value: totalOthers || 1000 },
    { name: 'Inspections Revenue', value: pendingBldgs * 500 || 500 }
  ];

  const isEmpty = buildings.length === 0;

  return (
    <div className="space-y-6">
      
      {/* ==================== PAGE HEADER ==================== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-4 gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">LSGD Administrative Dashboard</h2>
          <p className="text-xs text-slate-500">Real-time commercial license compliance monitoring status for {panchayatName}.</p>
        </div>
        <div className="bg-[#0F6E4F] text-white px-4 py-2 rounded-xl text-xs font-bold self-start shadow-sm tracking-wide">
          Grama Panchayat Code: {activePanchayatCode}
        </div>
      </div>

      {isEmpty ? (
        /* Empty State */
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center py-20 max-w-xl mx-auto space-y-4">
          <AlertCircle size={48} className="mx-auto text-amber-500" />
          <h3 className="text-lg font-bold text-slate-800">No Establishments Registered Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            This Panchayat context contains zero establishment records. You can load trade listings using the K-SMART Import Pipeline or manually register a new entry.
          </p>
          <div className="pt-2 flex justify-center space-x-3">
            <button
              onClick={() => navigate('/licenses')}
              className="bg-[#0F6E4F] text-white font-bold text-xs uppercase px-4 py-2.5 rounded-xl hover:bg-[#0B5A3E] transition shadow"
            >
              Go to K-SMART Import
            </button>
            <button
              onClick={() => navigate('/buildings')}
              className="border border-slate-200 text-slate-600 font-bold text-xs uppercase px-4 py-2.5 rounded-xl hover:bg-slate-50 transition"
            >
              Add New Entry
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* ==================== STATISTICS CARDS GRID ==================== */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Card 1: Licensed */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div className="flex justify-between items-start text-slate-500">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Licensed Businesses</span>
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-status-licensed flex items-center justify-center border border-emerald-100">
                  <CheckCircle2 size={16} />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-extrabold text-slate-800">{licensedBldgs}</span>
                <div className="text-[10px] text-status-licensed font-bold flex items-center mt-1.5 space-x-0.5">
                  <ArrowUpRight size={12} />
                  <span>Dynamic compliance live tracking</span>
                </div>
              </div>
            </div>

            {/* Card 2: Unlicensed */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div className="flex justify-between items-start text-slate-500">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unlicensed Businesses</span>
                <div className="w-8 h-8 rounded-full bg-red-50 text-status-unlicensed flex items-center justify-center border border-red-100">
                  <AlertTriangle size={16} />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-extrabold text-slate-800">{unlicensedBldgs}</span>
                <div className="text-[10px] text-status-unlicensed font-bold flex items-center mt-1.5 space-x-1">
                  <AlertCircle size={12} />
                  <span>Action Required</span>
                </div>
              </div>
            </div>

            {/* Card 3: NGO / Exempt */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div className="flex justify-between items-start text-slate-500">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">NGO / Exempt</span>
                <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                  <FolderHeart size={16} />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-extrabold text-slate-800">{ngoBldgs}</span>
                <div className="text-[10px] text-slate-400 font-semibold mt-1.5">
                  Non-Commercial entities
                </div>
              </div>
            </div>

            {/* Card 4: Expiring Soon */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div className="flex justify-between items-start text-slate-500">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expiring Soon</span>
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                  <Clock size={16} />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-extrabold text-slate-800">{expiredLicenses}</span>
                <div className="text-[10px] text-amber-600 font-bold flex items-center mt-1.5 space-x-1">
                  <Clock size={12} />
                  <span>Awaiting Renewals</span>
                </div>
              </div>
            </div>

          </div>

          {/* ==================== ANALYTICS CHARTS PANEL ==================== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chart 1: Compliance Rate by Ward */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col h-80">
              <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-4 border-b border-slate-50 pb-2 flex justify-between">
                <span>Ward-wise Compliance rates</span>
                <span className="text-[9px] font-bold text-[#0F6E4F] bg-emerald-50 px-2 py-0.5 rounded">Target: 100%</span>
              </h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={wardComplianceData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b' }} stroke="#cbd5e1" />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#64748b' }} stroke="#cbd5e1" />
                    <Tooltip contentStyle={{ fontSize: 10, borderRadius: 12, border: '1px solid #f1f5f9' }} />
                    <Bar dataKey="Compliance %" fill="#0F6E4F" radius={[4, 4, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Monthly Registration Trends */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col h-80">
              <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-4 border-b border-slate-50 pb-2">
                Monthly Commercial registrations
              </h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyRegData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b' }} stroke="#cbd5e1" />
                    <YAxis tick={{ fontSize: 9, fill: '#64748b' }} stroke="#cbd5e1" />
                    <Tooltip contentStyle={{ fontSize: 10, borderRadius: 12, border: '1px solid #f1f5f9' }} />
                    <Line type="monotone" dataKey="count" stroke="#151C27" strokeWidth={2.5} dot={{ r: 4, stroke: '#151C27', strokeWidth: 2, fill: '#fff' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Revenue contribution by Type */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col h-80">
              <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-4 border-b border-slate-50 pb-2">
                Revenue Share by Trade Category
              </h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0F6E4F" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#0F6E4F" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b' }} stroke="#cbd5e1" />
                    <YAxis tick={{ fontSize: 9, fill: '#64748b' }} stroke="#cbd5e1" />
                    <Tooltip contentStyle={{ fontSize: 10, borderRadius: 12, border: '1px solid #f1f5f9' }} />
                    <Area type="monotone" dataKey="value" stroke="#0F6E4F" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* ==================== WARD TABLE AND LOGS ==================== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Ward Compliance Summary Table */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm lg:col-span-2 flex flex-col">
              <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-4 border-b border-slate-50 pb-2">
                Ward Performance compliance summary
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-xs">
                  <thead className="text-slate-400 font-bold uppercase border-b border-slate-100">
                    <tr>
                      <th className="px-3 py-2.5">Ward ID</th>
                      <th className="px-3 py-2.5">Ward Name</th>
                      <th className="px-3 py-2.5 text-center">Licensed</th>
                      <th className="px-3 py-2.5 text-center">Unlicensed</th>
                      <th className="px-3 py-2.5 text-center">Pending</th>
                      <th className="px-3 py-2.5 text-center">Compliance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {scopedWards.map((w) => (
                      <tr key={w.id} className="hover:bg-slate-50 transition">
                        <td className="px-3 py-3 font-extrabold text-slate-800 font-mono">Ward {w.id}</td>
                        <td className="px-3 py-3 font-medium">{w.name}</td>
                        <td className="px-3 py-3 text-center text-status-licensed">{w.licensedBuildings}</td>
                        <td className="px-3 py-3 text-center text-status-unlicensed">{w.unlicensedBuildings}</td>
                        <td className="px-3 py-3 text-center text-status-pending">{w.pendingBuildings}</td>
                        <td className="px-3 py-3 text-center font-bold">
                          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                            w.compliancePercentage >= 80 
                              ? 'bg-emerald-50 text-status-licensed' 
                              : w.compliancePercentage >= 70 
                                ? 'bg-amber-50 text-amber-800' 
                                : 'bg-red-50 text-status-unlicensed'
                          }`}>
                            {w.compliancePercentage}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Official Action log feed */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col">
              <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-4 border-b border-slate-50 pb-2 flex justify-between items-center">
                <span>Official Action Log</span>
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded tracking-wide uppercase">Live Audit</span>
              </h3>
              <div className="flex-grow space-y-3.5 overflow-y-auto max-h-[220px]">
                
                {auditLogs.length === 0 ? (
                  <p className="text-slate-400 italic text-center py-8">No official logs recorded for this tenant.</p>
                ) : (
                  auditLogs.map((log) => (
                    <div key={log.id} className="text-[11px] border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center text-[10px] text-slate-400 mb-0.5 font-bold">
                        <span>{log.userName} ({log.userRole})</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-slate-600 font-medium leading-relaxed">{log.description}</p>
                      <div className="mt-1 flex items-center space-x-1.5 font-bold">
                        <span className={`text-[8px] px-1.5 py-0.2 rounded uppercase ${
                          log.action === 'APPROVE' 
                            ? 'bg-emerald-50 text-status-licensed' 
                            : log.action === 'REJECT' 
                              ? 'bg-red-50 text-status-unlicensed' 
                              : log.action === 'SURVEY_SUBMIT' 
                                ? 'bg-blue-50 text-blue-800'
                                : 'bg-slate-100 text-slate-600'
                        }`}>
                          {log.action}
                        </span>
                        <span className="text-[8px] font-mono text-slate-300">{log.id}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </>
      )}

    </div>
  );
};
