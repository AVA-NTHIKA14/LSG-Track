import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import type { SystemSettings, AuditLogRecord } from '../types';
import { ShieldCheck, Terminal, Accessibility } from 'lucide-react';

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    highContrast: false,
    smsNotificationsEnabled: true,
    emailNotificationsEnabled: true
  });
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);
  const [searchLogQuery, setSearchLogQuery] = useState('');

  useEffect(() => {
    const unsubSettings = dbService.subscribeToSettings(setSettings);
    const unsubAuditLogs = dbService.subscribeToAuditLogs(setAuditLogs);
    return () => {
      unsubSettings();
      unsubAuditLogs();
    };
  }, []);

  const handleToggleContrast = async () => {
    const nextVal = !settings.highContrast;
    await dbService.updateSettings({ highContrast: nextVal });
    await dbService.addAuditLog('SETTING_CHANGE', `Toggled accessibility High Contrast Mode: ${nextVal ? 'ON' : 'OFF'}`);
  };

  const handleToggleSMS = async () => {
    const nextVal = !settings.smsNotificationsEnabled;
    await dbService.updateSettings({ smsNotificationsEnabled: nextVal });
    await dbService.addAuditLog('SETTING_CHANGE', `Toggled automated SMS gateway alerts: ${nextVal ? 'ON' : 'OFF'}`);
  };

  const handleToggleEmail = async () => {
    const nextVal = !settings.emailNotificationsEnabled;
    await dbService.updateSettings({ emailNotificationsEnabled: nextVal });
    await dbService.addAuditLog('SETTING_CHANGE', `Toggled automated SMTP email alerts: ${nextVal ? 'ON' : 'OFF'}`);
  };

  // Filter audit logs
  const filteredLogs = auditLogs.filter(log => {
    const query = searchLogQuery.toLowerCase();
    return (
      log.userName.toLowerCase().includes(query) ||
      log.userRole.toLowerCase().includes(query) ||
      log.action.toLowerCase().includes(query) ||
      log.description.toLowerCase().includes(query) ||
      log.id.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gov-navy">System Settings & Audit Registers</h2>
        <p className="text-xs text-slate-500">Configure accessibility interfaces, simulated gateway integration, and view secure e-Governance audit logs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Configuration Panels */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Accessibility Settings */}
          <div className="bg-white border border-gov-border rounded p-4 shadow-sm">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-4 border-b pb-2 flex items-center space-x-2">
              <Accessibility size={16} className="text-gov-green" />
              <span>Accessibility Toggles</span>
            </h3>
            
            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="block font-bold text-slate-800">High Contrast Mode</span>
                <span className="block text-[10px] text-slate-500">Toggle readable yellow-on-black color overrides.</span>
              </div>
              <button
                onClick={handleToggleContrast}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  settings.highContrast ? 'bg-emerald-800' : 'bg-slate-300'
                }`}
              >
                <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow ${
                  settings.highContrast ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          {/* Integration Gateway Configurations */}
          <div className="bg-white border border-gov-border rounded p-4 shadow-sm text-xs space-y-4">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider border-b pb-2 flex items-center space-x-2">
              <ShieldCheck size={16} className="text-gov-green" />
              <span>Enforcement Gateways (Mock)</span>
            </h3>

            {/* SMS Toggle */}
            <div className="flex justify-between items-center">
              <div>
                <span className="block font-bold text-slate-800">Simulate SMS Notifications</span>
                <span className="block text-[10px] text-slate-500">Dispatches SMS alerts upon license expiry.</span>
              </div>
              <button
                onClick={handleToggleSMS}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  settings.smsNotificationsEnabled ? 'bg-emerald-800' : 'bg-slate-300'
                }`}
              >
                <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow ${
                  settings.smsNotificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Email Toggle */}
            <div className="flex justify-between items-center">
              <div>
                <span className="block font-bold text-slate-800">Simulate SMTP Email Notices</span>
                <span className="block text-[10px] text-slate-500">Auto dispatches renewal reminder notices.</span>
              </div>
              <button
                onClick={handleToggleEmail}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  settings.emailNotificationsEnabled ? 'bg-emerald-800' : 'bg-slate-300'
                }`}
              >
                <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow ${
                  settings.emailNotificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Future Server Details */}
            <div className="pt-3 border-t space-y-2 text-[10px] font-mono text-slate-400">
              <span className="block font-bold uppercase text-[9px] text-slate-500">Future Ready Integrations</span>
              <div>SMS Gateway: <strong>http://sms.kerala.gov.in/api/v2</strong></div>
              <div>Database: <strong>PostgreSQL 16 + PostGIS extension</strong></div>
              <div>Auth System: <strong>Google SSO / Firebase Authentication</strong></div>
            </div>

          </div>

        </div>

        {/* Right: Full Audit Log Registers */}
        <div className="bg-white border border-gov-border rounded p-4 shadow-sm lg:col-span-2 flex flex-col h-[500px]">
          
          <div className="border-b pb-2 mb-3.5 flex justify-between items-center flex-wrap gap-2 text-xs">
            <h3 className="font-bold text-gov-navy uppercase tracking-wider flex items-center space-x-2">
              <Terminal size={16} className="text-gov-green" />
              <span>e-Governance Audit Log Register</span>
            </h3>
            
            <input
              type="text"
              placeholder="Filter log actions, users..."
              value={searchLogQuery}
              onChange={(e) => setSearchLogQuery(e.target.value)}
              className="border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-700 focus:outline-none focus:border-gov-green w-48"
            />
          </div>

          {/* Audit Logs Table */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 pr-1 text-[11px]">
            {filteredLogs.length === 0 ? (
              <p className="text-slate-400 italic text-center py-12">No audit register matches search filter.</p>
            ) : (
              filteredLogs.map(log => (
                <div key={log.id} className="py-2 flex justify-between items-start space-x-4">
                  <div className="space-y-1">
                    <p className="text-slate-800 font-bold">{log.description}</p>
                    <div className="flex items-center space-x-1.5 text-[9px] text-slate-400">
                      <span className="font-bold text-slate-600 bg-slate-100 px-1 rounded">{log.userRole}</span>
                      <span>By: {log.userName}</span>
                      <span className="font-mono">({log.id})</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block font-mono text-[9px] text-slate-400">{new Date(log.timestamp).toLocaleString()}</span>
                    <span className={`inline-block font-extrabold uppercase text-[8px] px-1 rounded mt-0.5 ${
                      log.action === 'APPROVE' 
                        ? 'bg-green-50 text-status-licensed' 
                        : log.action === 'REJECT' 
                          ? 'bg-red-50 text-status-unlicensed' 
                          : log.action === 'LOGIN'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-slate-100 text-slate-500'
                    }`}>
                      {log.action}
                    </span>
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
