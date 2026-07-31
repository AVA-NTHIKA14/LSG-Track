import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle, ArrowRight, BarChart3, Building2, CheckCircle2, ClipboardCheck,
  Clock3, FileText, Map, MapPin, RefreshCw, ShieldAlert
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dbService, getActivePanchayathId } from '../services/dbService';
import { authService } from '../services/authService';
import { KERALA_PANCHAYATHS } from '../data/keralaPanchayaths';
import type { AuditLogRecord, BuildingRecord, LicenseRecord, SyncHistoryRecord, WardRecord, WardReportRecord } from '../types';
import { normalizeRole, roleHome } from '../services/roleAccess';

type StatCardProps = {
  title: string; value: number; note: string; icon: React.ElementType;
  tone: 'green' | 'amber' | 'red' | 'blue'; onClick: () => void;
};

const toneClasses = {
  green: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  amber: 'border-amber-200 bg-amber-50 text-amber-800',
  red: 'border-red-200 bg-red-50 text-red-800',
  blue: 'border-blue-200 bg-blue-50 text-blue-800',
};

const StatCard: React.FC<StatCardProps> = ({ title, value, note, icon: Icon, tone, onClick }) => (
  <button onClick={onClick} className="group w-full rounded-xl border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#0F6E4F]">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{title}</p>
        <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">{value}</p>
      </div>
      <span className={`grid h-10 w-10 place-items-center rounded-lg border ${toneClasses[tone]}`}><Icon size={19} strokeWidth={2.2} /></span>
    </div>
    <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-slate-600 group-hover:text-[#0F6E4F]">{note} <ArrowRight size={14} /></p>
  </button>
);

export const Dashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState<BuildingRecord[]>([]);
  const [wards, setWards] = useState<WardRecord[]>([]);
  const [licenses, setLicenses] = useState<LicenseRecord[]>([]);
  const [syncHistory, setSyncHistory] = useState<SyncHistoryRecord[]>([]);
  const [wardReports, setWardReports] = useState<WardReportRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);
  const activePanchayatCode = getActivePanchayathId();
  const currentUser = authService.getCurrentUser();
  const [panchayatName, setPanchayatName] = useState(() => KERALA_PANCHAYATHS.find(p => p.code.toLowerCase() === activePanchayatCode.toLowerCase())?.name || 'Grama Panchayat');

  useEffect(() => {
    if (normalizeRole(currentUser?.role) === 'ward_member') navigate(roleHome(currentUser?.role), { replace: true });
  }, [currentUser, navigate]);

  useEffect(() => {
    const unsubscribe = [
      dbService.subscribeToBuildings(setBuildings), dbService.subscribeToWards(setWards),
      dbService.subscribeToLicenses(setLicenses), dbService.subscribeToSyncHistory(setSyncHistory),
      dbService.subscribeToWardReports(setWardReports), dbService.subscribeToAuditLogs(logs => setAuditLogs(logs.slice(0, 5))),
      dbService.subscribeToPanchayaths(list => {
        const current = list.find(p => p.id === activePanchayatCode);
        if (current) setPanchayatName(current.name);
      })
    ];
    return () => unsubscribe.forEach(stop => stop());
  }, [activePanchayatCode]);

  const licensed = buildings.filter(b => b.status === 'licensed').length;
const unlicensed = buildings.filter(b => b.status === 'unlicensed').length;
const expired = licenses.filter(l => l.status === 'expired').length;
const soon = licenses.filter(
  l =>
    l.status === 'active' &&
    new Date(l.expiryDate).getTime() >= Date.now() &&
    new Date(l.expiryDate).getTime() <= Date.now() + 7 * 86400000
).length;
const pending = wardReports.filter(r => r.status === 'pending_verification').length;
const total = buildings.length;
const compliance = total ? Math.round((licensed / total) * 100) : 0;const rankedWards = [...wards].sort((a, b) => a.compliancePercentage - b.compliancePercentage).slice(0, 6);
  const lastSync = syncHistory[0];
  const isMl = i18n.language === 'ml';

  const tasks = [
    { label: t('dashboard.task1_title'), count: pending, icon: ClipboardCheck, path: '/report?tab=ward', tone: 'text-purple-700 bg-purple-50 border-purple-100' },
    { label: t('dashboard.task2_title'), count: expired, icon: Clock3, path: '/registry?tab=licenses', tone: 'text-amber-700 bg-amber-50 border-amber-100' },
    { label: t('dashboard.task3_title'), count: unlicensed, icon: ShieldAlert, path: '/map?filter=unlicensed', tone: 'text-red-700 bg-red-50 border-red-100' },
  ];

  return (
    <main className="space-y-5">
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#0F6E4F] text-white"><Building2 size={22} /></span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#0F6E4F]">{t('app.subtitle')}</p>
              <h1 className="mt-1 text-xl font-bold text-slate-900">{panchayatName}</h1>
              <p className="mt-1 text-sm text-slate-600">{t('dashboard.subheading')}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-lg border border-slate-200 px-3 py-2 text-xs">
              <span className="block font-semibold text-slate-500">{t('dashboard.last_sync')}</span>
              <span className="font-bold text-slate-800">{lastSync ? new Date(lastSync.timestamp).toLocaleDateString() : t('dashboard.no_sync')}</span>
            </div>
            <button onClick={() => navigate('/map')} className="inline-flex items-center gap-2 rounded-lg bg-[#0F6E4F] px-4 py-3 text-xs font-bold text-white hover:bg-[#0B5A3E]"><Map size={16} />{t('dashboard.open_map')}</button>
          </div>
        </div>
        <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 text-xs text-slate-600">
          <span className="font-bold text-slate-800">{isMl ? 'നിലവിലെ അനുസരണ നിരക്ക്: ' : 'Current compliance rate: '}</span>{compliance}%
          <span className="mx-2 text-slate-300">|</span>{isMl ? 'ആകെ സ്ഥാപനങ്ങൾ: ' : 'Total establishments: '}{total}
        </div>
      </section>

      <section aria-label={t('dashboard.quick_actions')} className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {tasks.map(({ label, count, icon: Icon, path, tone }) => (
          <button key={label} onClick={() => navigate(path)} className={`flex items-center gap-3 rounded-xl border p-4 text-left transition hover:shadow-sm ${tone}`}>
            <Icon size={21} />
            <span className="flex-1 text-sm font-bold">{label}</span>
            <span className="rounded-md bg-white px-2 py-1 text-sm font-bold shadow-sm">{count}</span>
            <ArrowRight size={16} />
          </button>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title={t('dashboard.kpi1_title')} value={licensed} note={t('dashboard.open_list')} icon={CheckCircle2} tone="green" onClick={() => navigate('/registry?tab=licenses')} />
        <StatCard title={t('dashboard.kpi2_title')} value={expired} note={t('dashboard.open_list')} icon={Clock3} tone="amber" onClick={() => navigate('/registry?tab=licenses')} />
        <StatCard title={t('dashboard.kpi3_title')} value={soon} note={t('dashboard.view_on_map')} icon={AlertTriangle} tone="blue" onClick={() => navigate('/map')} />
        <StatCard title={t('dashboard.kpi4_title')} value={unlicensed} note={t('dashboard.schedule_inspection')} icon={ShieldAlert} tone="red" onClick={() => navigate('/map?filter=unlicensed')} />
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="xl:col-span-3 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 p-4">
            <div><h2 className="font-bold text-slate-900">{t('dashboard.table_title')}</h2><p className="mt-1 text-xs text-slate-500">{t('dashboard.table_sub')}</p></div>
            <BarChart3 className="text-[#0F6E4F]" size={20} />
          </div>
          <div className="overflow-x-auto p-2">
            <table className="w-full text-left text-xs"><thead className="text-[10px] uppercase tracking-wide text-slate-500"><tr><th className="p-3">{t('dashboard.th_ward')}</th><th className="p-3">{t('dashboard.th_name')}</th><th className="p-3 text-right">{t('dashboard.th_compliance')}</th><th className="p-3 text-right">{t('dashboard.th_action')}</th></tr></thead>
              <tbody>{rankedWards.map(ward => <tr key={ward.id} className="border-t border-slate-100 hover:bg-slate-50"><td className="p-3 font-bold text-slate-900">{isMl ? 'വാർഡ്' : 'Ward'} {ward.id}</td><td className="p-3 text-slate-700">{ward.name}</td><td className="p-3 text-right font-bold text-slate-800">{ward.compliancePercentage.toFixed(0)}%</td><td className="p-3 text-right"><button onClick={() => navigate(`/map?ward=${ward.id}`)} className="inline-flex items-center gap-1 font-bold text-[#0F6E4F]"><MapPin size={14} />{t('dashboard.inspect')}</button></td></tr>)}</tbody>
            </table>
          </div>
        </div>
        <div className="xl:col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 p-4"><div><h2 className="font-bold text-slate-900">{t('dashboard.recent_activity')}</h2><p className="mt-1 text-xs text-slate-500">{t('dashboard.activity_sub')}</p></div><RefreshCw className="text-slate-400" size={18} /></div>
          <div className="divide-y divide-slate-100">{auditLogs.length ? auditLogs.map(log => <div key={log.id} className="p-4"><div className="flex justify-between gap-3"><p className="font-bold text-slate-800">{log.action.replaceAll('_', ' ')}</p><time className="shrink-0 text-xs text-slate-500">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time></div><p className="mt-1 text-xs leading-relaxed text-slate-600">{log.description}</p></div>) : <div className="p-10 text-center text-sm text-slate-500"><FileText className="mx-auto mb-2 text-slate-300" size={28} />{t('dashboard.no_activity')}</div>}</div>
        </div>
      </section>
    </main>
  );
};
