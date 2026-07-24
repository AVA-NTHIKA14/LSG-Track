import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, AlertTriangle, Clock, AlertCircle,
  MapPin, ShieldAlert, Send, ClipboardCheck, 
  ArrowRight, CheckSquare, History, FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';
import type { BuildingRecord, WardRecord, LicenseRecord, SyncHistoryRecord, WardReportRecord, AuditLogRecord } from '../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState<BuildingRecord[]>([]);
  const [wards, setWards] = useState<WardRecord[]>([]);
  const [licenses, setLicenses] = useState<LicenseRecord[]>([]);
  const [syncHistory, setSyncHistory] = useState<SyncHistoryRecord[]>([]);
  const [wardReports, setWardReports] = useState<WardReportRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);
  
  // Panchayat name resolution
  const [panchayatName, setPanchayatName] = useState('Panangad Grama Panchayat');
  const activePanchayatCode = localStorage.getItem('cp_active_panchayat_code') || 'G110706';

  const currentUser = authService.getCurrentUser();

  // Role check & navigation safety
  useEffect(() => {
    if (currentUser?.role === 'Ward Member') {
      navigate('/survey', { replace: true });
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const unsubBuildings = dbService.subscribeToBuildings(setBuildings);
    const unsubWards = dbService.subscribeToWards(setWards);
    const unsubLicenses = dbService.subscribeToLicenses(setLicenses);
    const unsubSync = dbService.subscribeToSyncHistory(setSyncHistory);
    const unsubReports = dbService.subscribeToWardReports(setWardReports);
    const unsubAudit = dbService.subscribeToAuditLogs((logs) => setAuditLogs(logs.slice(0, 6)));
    
    const unsubPanchayaths = dbService.subscribeToPanchayaths((list) => {
      const activeP = list.find(p => p.id === activePanchayatCode);
      if (activeP) {
        setPanchayatName(activeP.name);
      }
    });

    return () => {
      unsubBuildings();
      unsubWards();
      unsubLicenses();
      unsubSync();
      unsubReports();
      unsubAudit();
      unsubPanchayaths();
    };
  }, [activePanchayatCode]);

  // Operational Metrics
  const totalLicensed = buildings.filter(b => b.status === 'licensed').length;
  const totalUnlicensed = buildings.filter(b => b.status === 'unlicensed').length;
  const totalExpired = licenses.filter(l => l.status === 'expired').length;
  
  const nowMs = Date.now();
  const in7DaysMs = nowMs + 7 * 86400000;
  const expiring7Days = licenses.filter(l => {
    const exp = new Date(l.expiryDate).getTime();
    return l.status === 'active' && exp >= nowMs && exp <= in7DaysMs;
  }).length;

  const pendingWardReports = wardReports.filter(r => r.status === 'pending_verification').length;
  const highPriorityInspections = buildings.filter(b => b.status === 'unlicensed' || b.riskScore === 'High').length;
  const lastSync = syncHistory.length > 0 ? syncHistory[0] : null;

  // Ranked Wards by lowest compliance first
  const rankedWards = [...wards].sort((a, b) => a.compliancePercentage - b.compliancePercentage);

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. Compact Secretary Operational Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono font-bold uppercase tracking-wider mb-0.5">
            <span>LSGD CODE: {activePanchayatCode}</span>
            <span>•</span>
            <span>TRADE LICENSE MONITORING</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{panchayatName}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Panchayat Secretary Decision Support & Compliance Workspace
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs shrink-0">
          <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-2xl text-right">
            <span className="block text-[10px] text-slate-400 font-extrabold uppercase">Last K-SMART Sync</span>
            <span className="font-bold text-slate-800 text-xs">
              {lastSync ? `${new Date(lastSync.timestamp).toLocaleDateString()} (${lastSync.operatorName})` : 'No Sync Today'}
            </span>
          </div>

          <button
            onClick={() => navigate('/map')}
            className="bg-[#0F6E4F] hover:bg-[#0B5A3E] text-white px-4 py-2.5 rounded-2xl font-extrabold text-xs transition shadow-sm flex items-center space-x-1.5"
          >
            <MapPin size={14} />
            <span>Open Map View</span>
          </button>
        </div>
      </div>

      {/* 2. TODAY'S TASKS WIDGET (Positioned above analytics for immediate action) */}
      <div className="bg-emerald-50/60 border border-emerald-200 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
          <h3 className="font-extrabold text-[#0F6E4F] text-sm flex items-center space-x-2">
            <CheckSquare size={16} />
            <span>Today's Secretary Action Tasks</span>
          </h3>
          <span className="text-[10px] font-mono font-extrabold text-[#0F6E4F] bg-white px-2 py-0.5 rounded-md border border-emerald-200">
            {pendingWardReports + (totalExpired > 0 ? 1 : 0) + (totalUnlicensed > 0 ? 1 : 0) + 1} Tasks Requiring Attention
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-semibold">
          
          {/* Task 1 */}
          <div 
            onClick={() => navigate('/ward-reports')}
            className="bg-white border border-emerald-100 p-3 rounded-2xl hover:border-[#0F6E4F] transition cursor-pointer flex items-center justify-between shadow-2xs"
          >
            <div className="space-y-0.5">
              <span className="text-slate-900 font-bold block">Verify Ward Member Reports</span>
              <span className="text-slate-500 text-[11px] font-medium">{pendingWardReports} Pending Submissions</span>
            </div>
            <ArrowRight size={14} className="text-[#0F6E4F] shrink-0" />
          </div>

          {/* Task 2 */}
          <div 
            onClick={() => navigate('/licenses?filter=expired')}
            className="bg-white border border-emerald-100 p-3 rounded-2xl hover:border-[#0F6E4F] transition cursor-pointer flex items-center justify-between shadow-2xs"
          >
            <div className="space-y-0.5">
              <span className="text-slate-900 font-bold block">Review Expired Licenses</span>
              <span className="text-slate-500 text-[11px] font-medium">{totalExpired} Overdue Units</span>
            </div>
            <ArrowRight size={14} className="text-[#0F6E4F] shrink-0" />
          </div>

          {/* Task 3 */}
          <div 
            onClick={() => navigate('/map?filter=unlicensed')}
            className="bg-white border border-emerald-100 p-3 rounded-2xl hover:border-[#0F6E4F] transition cursor-pointer flex items-center justify-between shadow-2xs"
          >
            <div className="space-y-0.5">
              <span className="text-slate-900 font-bold block">Schedule Inspections</span>
              <span className="text-slate-500 text-[11px] font-medium">{totalUnlicensed} Unlicensed Businesses</span>
            </div>
            <ArrowRight size={14} className="text-[#0F6E4F] shrink-0" />
          </div>

          {/* Task 4 */}
          <div 
            onClick={() => navigate('/reports')}
            className="bg-white border border-emerald-100 p-3 rounded-2xl hover:border-[#0F6E4F] transition cursor-pointer flex items-center justify-between shadow-2xs"
          >
            <div className="space-y-0.5">
              <span className="text-slate-900 font-bold block">Generate Monthly Report</span>
              <span className="text-slate-500 text-[11px] font-medium">Ward Compliance Digest</span>
            </div>
            <ArrowRight size={14} className="text-[#0F6E4F] shrink-0" />
          </div>

        </div>
      </div>

      {/* 3. KPI CARDS (Each card has ONLY 1 clear action button) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Card 1: Licensed Establishments -> Open List */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Licensed Establishments</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#0F6E4F] flex items-center justify-center font-bold">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900">{totalLicensed}</div>
            <div className="text-[11px] text-slate-500 font-medium">Active K-SMART Trade Permits</div>
          </div>
          <button
            onClick={() => navigate('/licenses')}
            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 py-2 px-3 rounded-xl font-extrabold text-xs transition flex items-center justify-center space-x-1"
          >
            <span>Open List</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Card 2: Expired Licenses -> View on Map */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Expired Licenses</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Clock size={16} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-amber-700">{totalExpired}</div>
            <div className="text-[11px] text-slate-500 font-medium">Overdue for Renewal</div>
          </div>
          <button
            onClick={() => navigate('/map?filter=expired')}
            className="w-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 py-2 px-3 rounded-xl font-extrabold text-xs transition flex items-center justify-center space-x-1"
          >
            <span>View on Map</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Card 3: Expiring Soon -> Send Reminders */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Expiring Soon (7 Days)</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <AlertCircle size={16} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-blue-700">{expiring7Days}</div>
            <div className="text-[11px] text-slate-500 font-medium">Critical Expiry Window</div>
          </div>
          <button
            onClick={() => navigate('/communication')}
            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 py-2 px-3 rounded-xl font-extrabold text-xs transition flex items-center justify-center space-x-1"
          >
            <Send size={12} />
            <span>Send Reminders</span>
          </button>
        </div>

        {/* Card 4: Unlicensed Establishments -> Schedule Inspection */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Unlicensed Businesses</span>
            <div className="w-8 h-8 rounded-full bg-red-50 text-red-700 flex items-center justify-center font-bold">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-red-700">{totalUnlicensed}</div>
            <div className="text-[11px] text-slate-500 font-medium">Operating Without Permit</div>
          </div>
          <button
            onClick={() => navigate('/map?filter=unlicensed')}
            className="w-full bg-red-50 hover:bg-red-100 text-red-900 border border-red-200 py-2 px-3 rounded-xl font-extrabold text-xs transition flex items-center justify-center space-x-1"
          >
            <span>Schedule Inspection</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Card 5: Pending Field Reports -> Review Reports */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Pending Field Reports</span>
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <ClipboardCheck size={16} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-purple-700">{pendingWardReports}</div>
            <div className="text-[11px] text-slate-500 font-medium">Ward Member Submissions</div>
          </div>
          <button
            onClick={() => navigate('/ward-reports')}
            className="w-full bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 py-2 px-3 rounded-xl font-extrabold text-xs transition flex items-center justify-center space-x-1"
          >
            <span>Review Reports</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Card 6: High Priority Inspections -> Open Queue */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">High Priority Inspections</span>
            <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-700 flex items-center justify-center font-bold">
              <ShieldAlert size={16} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#0F6E4F]">{highPriorityInspections}</div>
            <div className="text-[11px] text-slate-500 font-medium">Risk Score Flagged Units</div>
          </div>
          <button
            onClick={() => navigate('/buildings?filter=high-risk')}
            className="w-full bg-emerald-50 hover:bg-emerald-100 text-[#0F6E4F] border border-emerald-200 py-2 px-3 rounded-xl font-extrabold text-xs transition flex items-center justify-center space-x-1"
          >
            <span>Open Queue</span>
            <ArrowRight size={12} />
          </button>
        </div>

      </div>

      {/* 4. OPERATIONAL TABLES & RECENT ACTIVITY WIDGET */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Ward Compliance Ranking Table (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm tracking-tight flex items-center space-x-2">
                <span>Panchayat Ward Compliance Ranking</span>
              </h3>
              <p className="text-[11px] text-slate-500">Sorted by lowest compliance rate for inspection prioritization.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="pb-2">Ward #</th>
                  <th className="pb-2">Ward Name</th>
                  <th className="pb-2 text-center">Compliance Rate</th>
                  <th className="pb-2 text-right">Unlicensed</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {rankedWards.slice(0, 6).map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 font-bold font-mono text-slate-900">Ward {w.id}</td>
                    <td className="py-2.5 font-semibold text-slate-800">{w.name}</td>
                    <td className="py-2.5 text-center font-bold">
                      <div className="inline-flex items-center space-x-2">
                        <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden hidden sm:block">
                          <div
                            className={`h-full ${
                              w.compliancePercentage >= 80 ? 'bg-[#0F6E4F]' : w.compliancePercentage >= 50 ? 'bg-amber-500' : 'bg-red-600'
                            }`}
                            style={{ width: `${w.compliancePercentage}%` }}
                          />
                        </div>
                        <span className={`text-xs ${
                          w.compliancePercentage >= 80 ? 'text-[#0F6E4F]' : w.compliancePercentage >= 50 ? 'text-amber-700' : 'text-red-700 font-extrabold'
                        }`}>
                          {w.compliancePercentage.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 text-right font-bold text-red-700">{w.unlicensedBuildings}</td>
                    <td className="py-2.5 text-right font-extrabold">
                      <button
                        onClick={() => navigate(`/map?ward=${w.id}`)}
                        className="text-[#0F6E4F] hover:text-[#0B5A3E] inline-flex items-center space-x-0.5 text-[11px]"
                      >
                        <span>Inspect</span>
                        <ArrowRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Administrative Activity Widget (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm tracking-tight flex items-center space-x-2">
                <History size={16} className="text-[#0F6E4F]" />
                <span>Recent Administrative Activity</span>
              </h3>
              <p className="text-[11px] text-slate-500">Chronological log of verified Secretary actions.</p>
            </div>
          </div>

          <div className="space-y-3">
            {auditLogs.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                <FileText size={28} className="mx-auto text-slate-300 mb-1" />
                <p>No administrative activity recorded today.</p>
              </div>
            ) : (
              auditLogs.map(log => (
                <div key={log.id} className="border border-slate-100 rounded-2xl p-3 bg-slate-50/60 space-y-1 text-xs">
                  <div className="flex justify-between items-start font-extrabold text-slate-900">
                    <span className="truncate max-w-[200px]">{log.action.replace(/_/g, ' ')}</span>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-slate-600 text-[11px] font-medium leading-relaxed">
                    {log.description}
                  </div>
                  <div className="text-slate-400 text-[9.5px] font-bold">
                    By {log.userName} ({log.userRole})
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
