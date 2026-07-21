import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { whatsappService } from '../services/whatsappService';
import type { BuildingRecord, LicenseRecord, WhatsAppLogRecord } from '../types';
import { 
  MessageSquare, Send, Search, Phone
} from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export const CommunicationHub: React.FC = () => {
  // Database States
  const [buildings, setBuildings] = useState<BuildingRecord[]>([]);
  const [licenses, setLicenses] = useState<LicenseRecord[]>([]);
  const [logs, setLogs] = useState<WhatsAppLogRecord[]>([]);

  // UI States
  const [activeTab, setActiveTab] = useState<'campaign' | 'logs' | 'bot'>('campaign');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [templateLang, setTemplateLang] = useState<'en' | 'ml'>('ml');
  const [channel, setChannel] = useState<'WhatsApp' | 'SMS' | 'Email'>('WhatsApp');
  
  // Feedback
  const [loading, setLoading] = useState(false);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  // Chat Bot Simulator States
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { 
      sender: 'bot', 
      text: '🏛️ Welcome to LSG Track e-Governance Chatbot Hotline!\n\nI can help you check trade licensing status, survey applications, and download digital certificates.\n\nCommands:\n- *Status <Building ID>* (e.g. Status BLDG-103)\n- *License <License ID>* (e.g. License LIC-202)\n- *Help* to show this guidelines menu.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

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

  // Bot message handler
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add user message
    const userMsg: ChatMessage = { sender: 'user', text: userText, timestamp: nowTime };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');

    // Process Bot reply with delay
    setTimeout(() => {
      let botReply = '';
      const parts = userText.split(' ');
      const command = parts[0].toLowerCase();
      const arg = parts.slice(1).join(' ').trim();

      if (command === 'status' && arg) {
        const b = buildings.find(x => x.id.toLowerCase() === arg.toLowerCase());
        if (b) {
          botReply = `📍 *LSG Asset Records status:*\n\n- *Establishment:* ${b.businessName}\n- *Proprietor:* ${b.ownerName}\n- *Category:* ${b.category}\n- *Ward Jurisdiction:* Ward ${b.wardNumber}\n- *GPS Coordinates:* ${b.coordinates.lat.toFixed(5)}, ${b.coordinates.lng.toFixed(5)}\n- *Compliance Status:* ${b.status.toUpperCase()}\n- *License Reference:* ${b.licenseId || 'N/A'}`;
        } else {
          botReply = `❌ No commercial building found with ID: *${arg}* in our registered local body database. Please check the ID and try again.`;
        }
      } else if (command === 'license' && arg) {
        const l = licenses.find(x => x.id.toLowerCase() === arg.toLowerCase());
        if (l) {
          const b = buildings.find(x => x.id === l.buildingId);
          botReply = `📄 *Trade License Certificate Details:*\n\n- *License ID:* ${l.id}\n- *Establishment:* ${b?.businessName || 'N/A'}\n- *Proprietor:* ${b?.ownerName || 'N/A'}\n- *Category:* ${l.licenseType}\n- *Issue Date:* ${l.issueDate}\n- *Expiry Date:* ${l.expiryDate}\n- *Paid Treasury Fee:* ₹${l.feePaid}\n- *Status:* ${l.status.toUpperCase()}\n\n📥 *Digital Certificate Download Link:*\nhttps://lsgtrack.kerala.gov.in/certs/download/${l.id}`;
        } else {
          botReply = `❌ No active or historical D&O Trade License found with reference number: *${arg}*.`;
        }
      } else if (command === 'help') {
        botReply = `🏛️ *LSG Track Chatbot Assistance*\n\nCommands:\n- *Status <BuildingID>*: Check license/verification status of building\n- *License <LicenseID>*: Get details & online download link for trade license\n- *Help*: Display this guidelines menu`;
      } else {
        botReply = `🤖 I did not understand that command.\n\nType *Help* to show valid actions, or check if your query format matches:\n- _Status BLDG-101_\n- _License LIC-202_`;
      }

      setChatHistory(prev => [...prev, {
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 800);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gov-navy">WhatsApp & Communications Hub</h2>
        <p className="text-xs text-slate-500">
          Monitor auto-dispatched alerts, trigger bulk campaigns to non-compliant businesses, and test the interactive citizen status chatbot interface.
        </p>
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
        <button
          onClick={() => setActiveTab('bot')}
          className={`py-2.5 px-4 font-bold border-b-2 transition ${
            activeTab === 'bot' ? 'border-[#0F6E4F] text-[#0F6E4F]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Hotline Bot Simulator
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
                <div className="flex gap-2">
                  {['WhatsApp', 'SMS', 'Email'].map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setChannel(ch as any)}
                      className={`flex-1 py-1.5 rounded-xl border text-[10px] font-bold uppercase transition ${
                        channel === ch 
                          ? 'border-[#0F6E4F] bg-[#EBF7F2] text-[#0F6E4F]' 
                          : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
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

      {/* Bot simulator */}
      {activeTab === 'bot' && (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
          
          {/* Header */}
          <div className="bg-[#075E54] text-white p-4 flex items-center space-x-3.5 shadow">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border-2 border-emerald-400/30">
              <Phone size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm leading-none flex items-center space-x-1.5">
                <span>LSG Bot Assistant Hotline</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </h3>
              <p className="text-[10px] text-emerald-100 mt-1">Kerala Grama Panchayat Automated Service • Online</p>
            </div>
          </div>

          {/* Chat Pane */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#e5ddd5]/15 flex flex-col">
            {chatHistory.map((msg, index) => {
              const isUser = msg.sender === 'user';
              return (
                <div 
                  key={index} 
                  className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                    isUser 
                      ? 'bg-[#d9fdd3] text-slate-800 self-end rounded-tr-none' 
                      : 'bg-white text-slate-800 self-start rounded-tl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line font-medium">{msg.text}</p>
                  <span className="block text-[8px] text-slate-400 text-right mt-1 font-mono font-bold uppercase">{msg.timestamp}</span>
                </div>
              );
            })}
          </div>

          {/* Form Input */}
          <form onSubmit={handleSendChat} className="bg-[#f0f0f0] p-3 flex items-center space-x-2 border-t border-slate-200">
            <input
              type="text"
              placeholder="Type command, e.g. Status BLDG-101..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 border rounded-full px-4 py-2.5 text-xs text-slate-700 bg-white focus:outline-none"
            />
            <button
              type="submit"
              className="w-10 h-10 bg-[#075E54] hover:bg-[#064e46] text-white rounded-full flex items-center justify-center transition shadow shrink-0"
            >
              <Send size={15} />
            </button>
          </form>

        </div>
      )}

    </div>
  );
};
