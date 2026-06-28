import React, { useState, useEffect } from 'react';
import { 
  Building2, CheckCircle2, AlertTriangle, Clock, 
  CircleDollarSign 
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

  useEffect(() => {
    const unsubBuildings = dbService.subscribeToBuildings(setBuildings);
    const unsubWards = dbService.subscribeToWards(setWards);
    const unsubLicenses = dbService.subscribeToLicenses(setLicenses);
    const unsubAuditLogs = dbService.subscribeToAuditLogs((logs) => setAuditLogs(logs.slice(0, 5)));

    return () => {
      unsubBuildings();
      unsubWards();
      unsubLicenses();
      unsubAuditLogs();
    };
  }, []);

  const currentUser = authService.getCurrentUser();
  const assignedWard = currentUser?.ward || '1';
  const isWardMember = currentUser?.role === 'Ward Member';

  useEffect(() => {
    if (currentUser?.role === 'Data Entry Operator') {
      navigate('/buildings', { replace: true });
    } else if (currentUser?.role === 'VEO' || currentUser?.role === 'Ward Member') {
      navigate('/survey', { replace: true });
    } else if (currentUser?.role !== 'Secretary' && currentUser?.role !== 'Administrator') {
      navigate('/profile', { replace: true });
    }
  }, [currentUser, navigate]);

  // Compute Statistics
  const scopedBuildings = isWardMember ? buildings.filter(b => b.wardNumber === assignedWard) : buildings;
  const scopedWards = isWardMember ? wards.filter(w => w.id === assignedWard) : wards;
  const scopedLicenses = isWardMember ? licenses.filter(l => {
    const building = buildings.find(b => b.id === l.buildingId);
    return building?.wardNumber === assignedWard;
  }) : licenses;

  const totalBldgs = scopedBuildings.length;
  const licensedBldgs = scopedBuildings.filter(b => b.status === 'licensed').length;
  const unlicensedBldgs = scopedBuildings.filter(b => b.status === 'unlicensed').length;
  const pendingBldgs = scopedBuildings.filter(b => b.status === 'pending').length;
  const govtBldgs = scopedBuildings.filter(b => b.status === 'govt').length;
  
  const expiredLicenses = scopedLicenses.filter(l => l.status === 'expired').length;
  const activeLicenses = scopedLicenses.filter(l => l.status === 'active').length;
  const totalRevenue = scopedLicenses.reduce((sum, lic) => sum + lic.feePaid, 0);

  // compliance rate overall (excluding government buildings)
  const nonGovCount = totalBldgs - govtBldgs;
  const complianceRate = nonGovCount > 0 
    ? Math.round((licensedBldgs / nonGovCount) * 100) 
    : 100;

  // Chart Data 1: Ward Compliance Rates
  const wardComplianceData = scopedWards.map(w => ({
    name: `Ward ${w.id}`,
    'Compliance %': w.compliancePercentage,
    'Licensed': w.licensedBuildings,
    'Unlicensed': w.unlicensedBuildings
  }));

  // Chart Data 2: Monthly Registrations Simulation
  const monthlyRegData = [
    { name: 'Jan', count: Math.max(1, Math.round(scopedBuildings.length * 0.1)) },
    { name: 'Feb', count: Math.max(2, Math.round(scopedBuildings.length * 0.2)) },
    { name: 'Mar', count: Math.max(4, Math.round(scopedBuildings.length * 0.4)) },
    { name: 'Apr', count: Math.max(3, Math.round(scopedBuildings.length * 0.3)) },
    { name: 'May', count: Math.max(5, Math.round(scopedBuildings.length * 0.5)) },
    { name: 'Jun', count: scopedBuildings.length } // Dynamic simulation
  ];

  // Chart Data 3: Revenue Trend
  const revenueData = [
    { name: 'D&O Trade', value: scopedLicenses.filter(l => l.licenseType.includes('D&O')).reduce((s, l) => s + l.feePaid, 0) },
    { name: 'Lodging', value: scopedLicenses.filter(l => l.licenseType.includes('Lodging')).reduce((s, l) => s + l.feePaid, 0) },
    { name: 'Industrial', value: scopedLicenses.filter(l => l.licenseType.includes('Industrial')).reduce((s, l) => s + l.feePaid, 0) }
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gov-border pb-4 gap-2">
        <div>
          <h2 className="text-xl font-bold text-gov-navy">LSGD Administrative Dashboard</h2>
          <p className="text-xs text-slate-500">Real-time commercial license compliance monitoring status for Chakkittapara Panchayat.</p>
        </div>
        <div className="bg-emerald-800 text-white px-3 py-1.5 rounded text-xs font-bold self-start">
          Grama Panchayat Code: 204902
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        
        {/* Card 1: Total Buildings */}
        <div className="bg-white border border-gov-border rounded p-4 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start text-slate-500">
            <span className="text-[10px] uppercase font-bold tracking-wider leading-tight">Total Buildings</span>
            <Building2 size={16} className="text-slate-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900">{totalBldgs}</span>
            <span className="text-[10px] block text-slate-500 mt-0.5">{govtBldgs} Government Buildings</span>
          </div>
        </div>

        {/* Card 2: Licensed */}
        <div className="bg-white border border-gov-border rounded p-4 flex flex-col justify-between shadow-sm border-l-4 border-l-status-licensed">
          <div className="flex justify-between items-start text-slate-500">
            <span className="text-[10px] uppercase font-bold tracking-wider leading-tight">Licensed Establishments</span>
            <CheckCircle2 size={16} className="text-status-licensed" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-status-licensed">{licensedBldgs}</span>
            <span className="text-[10px] block text-slate-500 mt-0.5">{activeLicenses} Active Licenses</span>
          </div>
        </div>

        {/* Card 3: Unlicensed */}
        <div className="bg-white border border-gov-border rounded p-4 flex flex-col justify-between shadow-sm border-l-4 border-l-status-unlicensed">
          <div className="flex justify-between items-start text-slate-500">
            <span className="text-[10px] uppercase font-bold tracking-wider leading-tight">Unlicensed Detected</span>
            <AlertTriangle size={16} className="text-status-unlicensed" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-status-unlicensed">{unlicensedBldgs}</span>
            <span className="text-[10px] block text-slate-500 mt-0.5">Enforcement notices generated</span>
          </div>
        </div>

        {/* Card 4: Pending */}
        <div className="bg-white border border-gov-border rounded p-4 flex flex-col justify-between shadow-sm border-l-4 border-l-status-pending">
          <div className="flex justify-between items-start text-slate-500">
            <span className="text-[10px] uppercase font-bold tracking-wider leading-tight">Pending Verification</span>
            <Clock size={16} className="text-status-pending" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-status-pending">{pendingBldgs}</span>
            <span className="text-[10px] block text-slate-500 mt-0.5">Awaiting Secretary approval</span>
          </div>
        </div>

        {/* Card 5: Expired */}
        <div className="bg-white border border-gov-border rounded p-4 flex flex-col justify-between shadow-sm border-l-4 border-l-amber-600">
          <div className="flex justify-between items-start text-slate-500">
            <span className="text-[10px] uppercase font-bold tracking-wider leading-tight">Expired Licences</span>
            <Clock size={16} className="text-amber-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-amber-600">{expiredLicenses}</span>
            <span className="text-[10px] block text-slate-500 mt-0.5">Renewal notices pending</span>
          </div>
        </div>

        {/* Card 6: Revenue */}
        <div className="bg-white border border-gov-border rounded p-4 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start text-slate-500">
            <span className="text-[10px] uppercase font-bold tracking-wider leading-tight">License Dues Collected</span>
            <CircleDollarSign size={16} className="text-emerald-700" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-emerald-800">₹{totalRevenue.toLocaleString('en-IN')}</span>
            <span className="text-[10px] block text-slate-500 mt-0.5">Compliance Rate: {complianceRate}%</span>
          </div>
        </div>

      </div>

      {/* Analytics Charts Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Compliance Rate by Ward */}
        <div className="bg-white border border-gov-border rounded p-4 shadow-sm flex flex-col h-80">
          <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-4 border-b pb-2 flex justify-between">
            <span>Ward-wise Compliance rates</span>
            <span className="text-[10px] text-slate-500">Target: 100%</span>
          </h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wardComplianceData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Tooltip contentStyle={{ fontSize: 10 }} />
                <Bar dataKey="Compliance %" fill="#1E5128" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Registration Trends */}
        <div className="bg-white border border-gov-border rounded p-4 shadow-sm flex flex-col h-80">
          <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-4 border-b pb-2">
            Monthly Commercial registrations
          </h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRegData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 9 }} />
                <Tooltip contentStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="count" stroke="#0B192C" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue contribution by Type */}
        <div className="bg-white border border-gov-border rounded p-4 shadow-sm flex flex-col h-80">
          <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-4 border-b pb-2">
            Revenue Share by Trade Category
          </h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 9 }} />
                <Tooltip contentStyle={{ fontSize: 10 }} />
                <Area type="monotone" dataKey="value" stroke="#1E5128" fill="#e8f5e9" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Ward breakdown and Audit Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Ward Breakdown Table */}
        <div className="bg-white border border-gov-border rounded p-4 shadow-sm lg:col-span-2 flex flex-col">
          <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-3 border-b pb-2">
            Ward Performance compliance summary
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-gov-border">
                <tr>
                  <th className="px-3 py-2">Ward ID</th>
                  <th className="px-3 py-2">Ward Name</th>
                  <th className="px-3 py-2 text-center">Licensed</th>
                  <th className="px-3 py-2 text-center">Unlicensed</th>
                  <th className="px-3 py-2 text-center">Pending</th>
                  <th className="px-3 py-2 text-center">Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gov-border">
                {scopedWards.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2.5 font-bold font-mono text-slate-800">Ward {w.id}</td>
                    <td className="px-3 py-2.5">{w.name}</td>
                    <td className="px-3 py-2.5 text-center text-status-licensed font-semibold">{w.licensedBuildings}</td>
                    <td className="px-3 py-2.5 text-center text-status-unlicensed font-semibold">{w.unlicensedBuildings}</td>
                    <td className="px-3 py-2.5 text-center text-status-pending font-semibold">{w.pendingBuildings}</td>
                    <td className="px-3 py-2.5 text-center font-bold">
                      <span className={`px-2 py-0.5 rounded ${
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

        {/* Recent e-Governance Activities Log */}
        <div className="bg-white border border-gov-border rounded p-4 shadow-sm flex flex-col">
          <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-3 border-b pb-2 flex justify-between items-center">
            <span>Official Action Log</span>
            <span className="text-[9px] text-slate-400 uppercase">Live Audit</span>
          </h3>
          <div className="flex-grow space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="text-xs border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
                <div className="flex justify-between items-center text-[10px] text-slate-400 mb-0.5">
                  <span className="font-semibold">{log.userName} ({log.userRole})</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-slate-700 font-medium">{log.description}</p>
                <div className="mt-1 flex items-center space-x-1">
                  <span className={`text-[9px] px-1 rounded uppercase font-bold ${
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
                  <span className="text-[9px] font-mono text-slate-400">{log.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
