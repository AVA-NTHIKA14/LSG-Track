import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import type { LicenseRecord, BuildingRecord } from '../types';
import { 
  RefreshCw, MessageSquare, Mail, CheckCircle, 
  Clock, AlertTriangle, Play 
} from 'lucide-react';

export const Renewals: React.FC = () => {
  const [licenses, setLicenses] = useState<LicenseRecord[]>([]);
  const [buildings, setBuildings] = useState<BuildingRecord[]>([]);
  const [activeLic, setActiveLic] = useState<LicenseRecord | null>(null);
  
  const [smsStatus, setSmsStatus] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [renewSuccess, setRenewSuccess] = useState<string | null>(null);

  useEffect(() => {
    const unsubLicenses = dbService.subscribeToLicenses(setLicenses);
    const unsubBuildings = dbService.subscribeToBuildings(setBuildings);
    return () => {
      unsubLicenses();
      unsubBuildings();
    };
  }, []);

  // Filter expired or soon-to-expire (expiring before 2027-03-31)
  const expiringLicenses = licenses.filter(l => l.status === 'expired' || new Date(l.expiryDate) <= new Date('2026-12-31'));

  const handleSelectLic = (lic: LicenseRecord) => {
    setActiveLic(lic);
    setSmsStatus(null);
    setEmailStatus(null);
    setRenewSuccess(null);
  };

  const handleSendSMS = (lic: LicenseRecord, bldgName: string) => {
    setSmsStatus(`SMS dispatched: "Dear Proprietor, Trade License #${lic.id} for ${bldgName} is due for renewal. Please renew before ${lic.expiryDate} at Chakkittapara Panchayat Office to avoid penalty."`);
    dbService.addAuditLog('SMS_ALERT', `Sent renewal SMS alert for License: ${lic.id} to owner.`);
  };

  const handleSendEmail = (lic: LicenseRecord, bldgName: string) => {
    setEmailStatus(`Email sent: To proprietor of ${bldgName}. Subject: NOTICE: Trade License Renewal Due (ID: ${lic.id}). Form uploaded to LSGD portal.`);
    dbService.addAuditLog('EMAIL_ALERT', `Sent renewal email alert for License: ${lic.id} to owner.`);
  };

  const handleRenew = async (licId: string) => {
    await dbService.renewLicense(licId);
    setRenewSuccess(`License ${licId} has been successfully renewed. Expiry date extended by 12 months.`);
    
    // Refresh active item
    const updatedLicenses = licenses.map(l => {
      if (l.id === licId) {
        const currentExpiry = new Date(l.expiryDate);
        return {
          ...l,
          expiryDate: new Date(currentExpiry.setFullYear(currentExpiry.getFullYear() + 1)).toISOString().split('T')[0],
          status: 'active' as const
        };
      }
      return l;
    });
    const match = updatedLicenses.find(l => l.id === licId);
    if (match) setActiveLic(match);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gov-navy">Renewal & Reminders Management</h2>
        <p className="text-xs text-slate-500">Monitor upcoming license expiries, send automated notification reminders, and process fiscal year renewals.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Expiries List */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="bg-white border border-gov-border rounded p-4 shadow-sm">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-4 border-b pb-2 flex items-center space-x-2">
              <Clock size={16} className="text-gov-green" />
              <span>Upcoming Expiries & Outstanding Renewals ({expiringLicenses.length})</span>
            </h3>

            {expiringLicenses.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">No licenses currently expired or due for renewal in the current period.</p>
            ) : (
              <div className="space-y-2">
                {expiringLicenses.map(l => {
                  const bldg = buildings.find(b => b.id === l.buildingId);
                  const isExpired = l.status === 'expired';
                  
                  return (
                    <div 
                      key={l.id}
                      onClick={() => handleSelectLic(l)}
                      className={`border rounded p-3 text-xs flex justify-between items-center cursor-pointer transition ${
                        activeLic?.id === l.id 
                          ? 'border-gov-green bg-slate-50 ring-1 ring-gov-green' 
                          : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div>
                        <div className="flex items-center space-x-1.5 mb-1 text-[10px]">
                          <span className="font-mono font-bold text-slate-400">License: {l.id}</span>
                          <span className={`px-1.5 py-0.25 font-bold uppercase rounded ${
                            isExpired ? 'bg-red-100 text-status-unlicensed' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {l.status}
                          </span>
                          <span className="text-slate-400 font-mono">| Building: {l.buildingId}</span>
                        </div>
                        <h4 className="font-bold text-slate-800">{bldg?.businessName || 'N/A'}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Expiry Date: <strong className="text-red-700">{l.expiryDate}</strong> | Owner: {bldg?.ownerName}</p>
                      </div>
                      <span className="text-gov-green font-bold uppercase text-[9px] flex items-center space-x-0.5 shrink-0">
                        <span>Open Reminders</span>
                        <Play size={10} />
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Reminders Detail Trigger Panel */}
        <div className="bg-white border border-gov-border rounded p-5 shadow-sm h-fit">
          {activeLic ? (
            (() => {
              const b = buildings.find(bld => bld.id === activeLic.buildingId);
              return (
                <div className="space-y-4 text-xs text-slate-700">
                  
                  <div className="border-b pb-3">
                    <span className="font-mono text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">Action File: {activeLic.id}</span>
                    <h3 className="font-bold text-slate-800 text-sm mt-1">{b?.businessName || 'N/A'}</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Proprietor: {b?.ownerName} | Ward {b?.wardNumber}</p>
                  </div>

                  {/* Renew Success */}
                  {renewSuccess && (
                    <div className="bg-green-50 border border-green-200 text-status-licensed rounded p-2.5 text-[11px] flex items-center space-x-1.5">
                      <CheckCircle size={14} />
                      <span>{renewSuccess}</span>
                    </div>
                  )}

                  {/* License stats */}
                  <div className="bg-slate-50 border rounded p-3 text-[11px] space-y-1.5 font-mono">
                    <div className="flex justify-between">
                      <span>EXPIRY DATE:</span>
                      <span className="font-bold text-red-700">{activeLic.expiryDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>RENEWAL FEE:</span>
                      <span className="font-bold text-emerald-800">₹{activeLic.feePaid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>LICENSE TYPE:</span>
                      <span className="font-bold">{activeLic.licenseType}</span>
                    </div>
                  </div>

                  {/* Notification simulations */}
                  <div className="space-y-2 border-t pt-3">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Simulate Enforcement Notices</span>
                    
                    <button
                      onClick={() => handleSendSMS(activeLic, b?.businessName || '')}
                      className="w-full bg-slate-50 hover:bg-slate-100 border rounded py-2 px-3 flex items-center justify-between transition text-left"
                    >
                      <div className="flex items-center space-x-2">
                        <MessageSquare size={14} className="text-slate-500" />
                        <span>Send SMS Alert (Owner)</span>
                      </div>
                      <span className="text-[9px] text-slate-400 uppercase">Gateway Ready</span>
                    </button>

                    <button
                      onClick={() => handleSendEmail(activeLic, b?.businessName || '')}
                      className="w-full bg-slate-50 hover:bg-slate-100 border rounded py-2 px-3 flex items-center justify-between transition text-left"
                    >
                      <div className="flex items-center space-x-2">
                        <Mail size={14} className="text-slate-500" />
                        <span>Send Email Notice (Owner)</span>
                      </div>
                      <span className="text-[9px] text-slate-400 uppercase">SMTP Ready</span>
                    </button>

                  </div>

                  {/* Notification output logs */}
                  {(smsStatus || emailStatus) && (
                    <div className="bg-slate-100 p-2.5 rounded text-[10px] space-y-2 leading-tight italic text-slate-600 font-mono">
                      {smsStatus && <div className="border-b pb-1.5 border-slate-200">{smsStatus}</div>}
                      {emailStatus && <div>{emailStatus}</div>}
                    </div>
                  )}

                  {/* Perform Renewal Action */}
                  <div className="pt-3 border-t">
                    <button
                      onClick={() => handleRenew(activeLic.id)}
                      className="w-full bg-gov-navy hover:bg-gov-navy-light text-white font-bold uppercase py-2.5 rounded transition flex items-center justify-center space-x-1.5 shadow-sm"
                    >
                      <RefreshCw size={12} />
                      <span>Renew License (1 Fiscal Year)</span>
                    </button>
                  </div>

                </div>
              );
            })()
          ) : (
            <div className="text-center py-16 text-slate-400 text-xs space-y-2">
              <AlertTriangle size={28} className="mx-auto text-slate-300" />
              <p>Select a license due for renewal from the exipires checklist to access reminder triggers and extension tools.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
