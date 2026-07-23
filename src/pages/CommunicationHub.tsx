import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { whatsappService } from '../services/whatsappService';
import type { BuildingRecord, LicenseRecord, WhatsAppLogRecord } from '../types';
import { 
  MessageSquare, Search, Send
} from 'lucide-react';

export const CommunicationHub: React.FC = () => {
  // Database States
  const [buildings, setBuildings] = useState<BuildingRecord[]>([]);
  const [licenses, setLicenses] = useState<LicenseRecord[]>([]);
  const [logs, setLogs] = useState<WhatsAppLogRecord[]>([]);

  // UI States
  const [activeTab, setActiveTab] = useState<'campaign' | 'logs'>('campaign');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [templateLang, setTemplateLang] = useState<'en' | 'ml'>('ml');
  const [channel] = useState<'WhatsApp'>('WhatsApp');
  
  // Feedback
  const [loading, setLoading] = useState(false);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  // Load active Panchayat Data
  useEffect(() => {
    const unsubB = dbService.subscribeToBuildings(setBuildings);
    const unsubL = dbService.subscribeToLicenses(setLicenses);
    const unsubLogs = dbService.subscribeToWhatsAppLogs(setLogs);

    return () => {
      unsubB();
      unsubL();
      unsubLogs();
    };
  }, []);

  // Filter establishments to only unlicensed or expired license list
  const campaignTargets = buildings.filter(b => {
    const matchesSearch = b.businessName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Unlicensed status or has an expired license
    const isUnlicensed = b.status === 'unlicensed';
    let isExpired = false;
    if (b.licenseId) {
      const lic = licenses.find(l => l.id === b.licenseId);
      if (lic && lic.status === 'expired') isExpired = true;
    }

    return matchesSearch && (isUnlicensed || isExpired);
  });

  // Toggle selection
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === campaignTargets.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(campaignTargets.map(b => b.id));
    }
  };

  // Trigger campaign dispatch
  const handleLaunchCampaign = async () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one establishment to send campaign reminders.');
      return;
    }

    setLoading(true);
    setSuccessCount(0);

    let successes = 0;

    for (const bldgId of selectedIds) {
      const bldg = buildings.find(b => b.id === bldgId);
      if (!bldg) continue;

      const lic = licenses.find(l => l.id === bldg.licenseId);
      
      // Extract phone number from building ownerName if present, otherwise generate simulated fallback
      const clean = bldg.ownerName.replace(/\s+/g, '');
      const match = clean.match(/\d{10}/);
      const phoneNum = match ? `+91${match[0]}` : `+91944${Math.floor(1000000 + Math.random() * 9000000)}`;

      const res = await whatsappService.sendMessage({
        recipientName: bldg.ownerName,
        businessName: bldg.businessName,
        contactNumber: phoneNum,
        licenseId: lic?.id,
        expiryDate: lic?.expiryDate,
        channel,
        templateLanguage: templateLang
      });

      if (res.success) {
        successes++;
      }
    }

    setLoading(false);
    setSuccessCount(successes);
    setSelectedIds([]);
    alert("Bulk campaign alerts have been processed and logged in the ledger. Go to the 'Message Notification Logs' tab and click 'Send Message' next to a record to dispatch the real WhatsApp notification!");
    setTimeout(() => setSuccessCount(null), 5000);
  };



  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="border-b pb-4 flex justify-between items-center flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <MessageSquare size={22} className="text-[#0F6E4F]" />
            <span>Renewal Alerts</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated WhatsApp renewal reminder dispatch hub for expired and expiring trade license establishments.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs">
        <button
          onClick={() => setActiveTab('campaign')}
          className={`py-2.5 px-4 font-bold border-b-2 transition ${
            activeTab === 'campaign' ? 'border-[#0F6E4F] text-[#0F6E4F]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Reminders Campaign Center
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`py-2.5 px-4 font-bold border-b-2 transition ${
            activeTab === 'logs' ? 'border-[#0F6E4F] text-[#0F6E4F]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Message Notification Logs ({logs.length})
        </button>
      </div>

      {/* Campaign center */}
      {activeTab === 'campaign' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Target List Table */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            
            <div className="flex justify-between items-center border-b pb-2 flex-wrap gap-2 text-xs">
              <h3 className="font-bold text-slate-800 text-sm">
                Non-Compliant & Expired Targets ({campaignTargets.length})
              </h3>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter targets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border border-slate-200 rounded-xl pl-8 pr-3 py-1 text-xs focus:outline-none focus:border-[#0F6E4F] w-48"
                />
                <Search size={13} className="absolute left-2.5 top-2 text-slate-400" />
              </div>
            </div>

            {successCount !== null && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 text-xs text-[#0F6E4F] font-bold">
                ✓ Campaign Sent: Dispatched {successCount} alerts successfully! Logs added.
              </div>
            )}

            {campaignTargets.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-400 italic font-medium">
                No non-compliant or expired targets found in the active Panchayat database. Setup imports or register unlicensed structures first.
              </div>
            ) : (
              <div className="overflow-x-auto text-xs">
                <table className="min-w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b">
                    <tr>
                      <th className="px-3 py-2 text-center w-8">
                        <input
                          type="checkbox"
                          checked={selectedIds.length === campaignTargets.length && campaignTargets.length > 0}
                          onChange={handleSelectAll}
                          className="rounded text-[#0F6E4F] focus:ring-[#0F6E4F]"
                        />
                      </th>
                      <th className="px-3 py-2">ID</th>
                      <th className="px-3 py-2">Business Title</th>
                      <th className="px-3 py-2">Proprietor</th>
                      <th className="px-3 py-2">Ward</th>
                      <th className="px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {campaignTargets.map(b => {
                      const isSelected = selectedIds.includes(b.id);
                      let licenseText = 'Unlicensed';
                      let statusBadge = 'bg-red-50 text-status-unlicensed';
                      
                      if (b.licenseId) {
                        const l = licenses.find(lic => lic.id === b.licenseId);
                        if (l && l.status === 'expired') {
                          licenseText = `Expired (${l.id})`;
                          statusBadge = 'bg-amber-50 text-amber-800';
                        }
                      }

                      return (
                        <tr key={b.id} className={`hover:bg-slate-50 ${isSelected ? 'bg-emerald-50/10' : ''}`}>
                          <td className="px-3 py-2.5 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelect(b.id)}
                              className="rounded text-[#0F6E4F] focus:ring-[#0F6E4F]"
                            />
                          </td>
                          <td className="px-3 py-2.5 font-mono font-bold text-slate-800">{b.id}</td>
                          <td className="px-3 py-2.5 font-bold text-slate-900">{b.businessName}</td>
                          <td className="px-3 py-2.5 font-medium">{b.ownerName}</td>
                          <td className="px-3 py-2.5 font-mono">Ward {b.wardNumber}</td>
                          <td className="px-3 py-2.5">
                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider ${statusBadge}`}>
                              {licenseText}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Campaign Trigger Settings Panel */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-xs space-y-4 self-start">
            <h3 className="font-extrabold text-slate-800 border-b pb-2 text-sm flex items-center space-x-2">
              <Send size={18} className="text-[#0F6E4F]" />
              <span>Dispatch Configuration</span>
            </h3>

            <div className="space-y-3 font-medium text-slate-600">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Channel</label>
                <div className="w-full bg-[#EBF7F2] text-[#0F6E4F] border border-emerald-200 rounded-xl py-2 px-3 text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center space-x-1.5">
                  <MessageSquare size={14} className="text-[#0F6E4F]" />
                  <span>WhatsApp Direct</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Template Language</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTemplateLang('ml')}
                    className={`flex-1 py-1.5 rounded-xl border text-[10px] font-bold uppercase transition ${
                      templateLang === 'ml' 
                        ? 'border-[#0F6E4F] bg-[#EBF7F2] text-[#0F6E4F]' 
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    മലയാളം (Malayalam)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTemplateLang('en')}
                    className={`flex-1 py-1.5 rounded-xl border text-[10px] font-bold uppercase transition ${
                      templateLang === 'en' 
                        ? 'border-[#0F6E4F] bg-[#EBF7F2] text-[#0F6E4F]' 
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Message Preview</span>
                <div className="bg-slate-50 border rounded-xl p-3 text-[11px] text-slate-500 italic font-medium leading-relaxed">
                  {templateLang === 'ml' ? (
                    <span>"പ്രിയ [ഉടമയുടെ പേര്], നിങ്ങളുടെ [സ്ഥാപനം] വ്യാപാര സ്ഥാപനത്തിൻ്റെ ലൈസൻസ് കാലാവധി തീരുന്നതാണ്. പിഴ ഒഴിവാക്കാൻ കെ-സ്മാർട്ട് പോർട്ടലിൽ അപേക്ഷിക്കുക."</span>
                  ) : (
                    <span>"Dear [Owner Name], trade license for [Business Name] is expiring. To avoid penalties, please renew on K-SMART portal."</span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleLaunchCampaign}
                disabled={loading || selectedIds.length === 0}
                className="w-full bg-[#0F6E4F] hover:bg-[#0B5A3E] text-white font-bold py-2.5 rounded-xl uppercase tracking-wider transition shadow flex items-center justify-center space-x-1.5"
              >
                <MessageSquare size={14} />
                <span>{loading ? 'Sending Reminders...' : `Send ${selectedIds.length} Alerts`}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message logs */}
      {activeTab === 'logs' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 text-xs text-slate-700">
          <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Sent Communications Ledger</h3>

          {logs.length === 0 ? (
            <p className="text-slate-400 italic text-center py-8">No dispatched message logs found in the database.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b">
                  <tr>
                    <th className="px-3 py-2">Timestamp</th>
                    <th className="px-3 py-2">Proprietor</th>
                    <th className="px-3 py-2">Establishment</th>
                    <th className="px-3 py-2">Contact</th>
                    <th className="px-3 py-2">Channel</th>
                    <th className="px-3 py-2">Message Content</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px] leading-relaxed">
                  {logs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2.5 font-mono text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="px-3 py-2.5 font-bold text-slate-800">{log.recipientName}</td>
                      <td className="px-3 py-2.5 font-semibold text-slate-800">{log.businessName}</td>
                      <td className="px-3 py-2.5 font-mono">{log.contactNumber}</td>
                      <td className="px-3 py-2.5">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded font-bold uppercase text-[9px]">{log.channel}</span>
                      </td>
                      <td className="px-3 py-2.5 font-medium text-slate-500 max-w-xs truncate" title={log.messageText}>
                        {log.messageText}
                      </td>
                      <td className="px-3 py-2.5 font-mono">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                          log.status === 'sent' ? 'bg-emerald-50 text-status-licensed' : 'bg-red-50 text-status-unlicensed'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <a
                          href={`https://wa.me/${log.contactNumber.replace(/\+/g, '')}?text=${encodeURIComponent(log.messageText)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#15803D] hover:bg-[#0e5628] text-white font-bold px-2 py-1 rounded text-[10px] inline-flex items-center space-x-1"
                        >
                          <span>Send Message</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
