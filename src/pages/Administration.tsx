import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import type { StaffProfile, UserRole } from '../types';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  KeyRound, 
  ShieldCheck, 
  Download, 
  Upload, 
  CheckCircle2, 
  XCircle, 
  FileJson,
  ShieldAlert
} from 'lucide-react';

export const Administration: React.FC = () => {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const currentUser = authService.getCurrentUser();

  const [staffList, setStaffList] = useState<StaffProfile[]>([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('clerk');
  const [wardNumber, setWardNumber] = useState<number | ''>(1);
  const [pin, setPin] = useState('');
  
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const panchayatCode = profile?.panchayatCode || localStorage.getItem('cp_active_panchayat_code') || 'G070702';
  const isSecretaryOrAdmin = profile?.role === 'secretary' || currentUser?.role === 'Secretary' || currentUser?.role === 'Administrator';

  useEffect(() => {
    loadStaff();
  }, [panchayatCode]);

  const loadStaff = () => {
    const list = dbService.getStaffProfiles(panchayatCode);
    setStaffList(list);
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please provide the staff member’s full name.');
      return;
    }

    if (pin && (pin.length !== 4 || !/^\d{4}$/.exec(pin))) {
      setErrorMsg('PIN must be exactly 4 numeric digits.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      await dbService.addStaffProfile({
        name: name.trim(),
        role,
        wardNumber: role === 'ward_member' || role === 'Ward Member' ? Number(wardNumber) : null,
        pin: pin.trim() || undefined
      }, panchayatCode);

      setName('');
      setPin('');
      setSuccessMsg(`Added staff profile: ${name.trim()}.`);
      loadStaff();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to add staff profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = async (id: string, staffName: string) => {
    try {
      await dbService.deleteStaffProfile(id, panchayatCode);
      setSuccessMsg(`Removed staff profile: ${staffName}.`);
      loadStaff();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to remove staff profile.');
    }
  };

  const handleExportBackup = () => {
    const jsonStr = dbService.exportPanchayatJSON(panchayatCode);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LSGTrack_Backup_${panchayatCode}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSuccessMsg(`Downloaded full JSON backup for Panchayat ${panchayatCode}.`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const content = evt.target?.result as string;
        const result = await dbService.importPanchayatJSON(content);
        setSuccessMsg(`Successfully restored backup for Panchayat ${result.panchayatCode}! (${result.recordCounts.buildings} buildings, ${result.recordCounts.licenses} licenses, ${result.recordCounts.staff} staff)`);
        loadStaff();
        setTimeout(() => setSuccessMsg(null), 6000);
      } catch (err: any) {
        setErrorMsg(err?.message || 'Failed to restore JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  if (!isSecretaryOrAdmin) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center max-w-md mx-auto my-12 shadow-sm">
        <ShieldAlert size={40} className="mx-auto text-red-600 mb-3" />
        <h3 className="font-extrabold text-slate-900 text-base">Secretarial Access Restricted</h3>
        <p className="text-xs text-slate-500 mt-2">
          The Local Administration & Staff Terminal is restricted to Panchayat Secretaries.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-2">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <ShieldCheck size={22} className="text-[#0F6E4F]" />
            <span>{t('administration.heading')}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('administration.subheading', { code: panchayatCode })}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportBackup}
            className="bg-[#0F6E4F] hover:bg-[#0B5A3E] text-white px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center space-x-1.5 shadow-xs"
          >
            <Download size={14} />
            <span>Export Full Backup (.json)</span>
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            accept=".json"
            onChange={handleRestoreBackup}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-slate-800 hover:bg-slate-900 text-white px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center space-x-1.5 shadow-xs"
          >
            <Upload size={14} />
            <span>Restore Backup</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-[#0F6E4F] text-xs font-extrabold p-3.5 rounded-2xl flex items-center space-x-2">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-xs font-extrabold p-3.5 rounded-2xl flex items-center space-x-2">
          <XCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Create Staff Profile Form (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="border-b pb-3 flex justify-between items-center">
            <h3 className="font-extrabold text-slate-900 text-sm tracking-tight flex items-center space-x-2">
              <UserPlus size={16} className="text-[#0F6E4F]" />
              <span>Create Local Staff Profile</span>
            </h3>
            <span className="text-[10px] font-mono font-bold text-slate-400">Panchayat {panchayatCode}</span>
          </div>

          <form onSubmit={handleAddStaff} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block text-slate-900 font-extrabold mb-1">Staff Member Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh V"
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#0F6E4F] focus:ring-1 focus:ring-[#0F6E4F]"
              />
            </div>

            <div>
              <label className="block text-slate-900 font-extrabold mb-1">Official Role *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#0F6E4F] focus:ring-1 focus:ring-[#0F6E4F]"
              >
                <option value="clerk">Panchayat Section Clerk / DEO</option>
                <option value="ward_member">Ward Member / Field Inspector</option>
              </select>
            </div>

            {(role === 'ward_member' || role === 'Ward Member') && (
              <div>
                <label className="block text-slate-900 font-extrabold mb-1">Assigned Ward Number *</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  required
                  value={wardNumber}
                  onChange={(e) => setWardNumber(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 1"
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#0F6E4F] focus:ring-1 focus:ring-[#0F6E4F]"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-900 font-extrabold mb-1 flex items-center space-x-1">
                <KeyRound size={13} className="text-[#0F6E4F]" />
                <span>Optional 4-Digit Action PIN</span>
              </label>
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="•••• (Optional)"
                className="w-full border border-slate-200 rounded-xl p-2.5 font-mono tracking-widest text-xs focus:outline-none focus:border-[#0F6E4F] focus:ring-1 focus:ring-[#0F6E4F]"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                UX guard against mis-attributing actions on a shared office PC (not a password).
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F6E4F] hover:bg-[#0B5A3E] text-white font-extrabold py-2.5 rounded-xl text-xs transition flex items-center justify-center space-x-2 shadow-xs"
            >
              <UserPlus size={16} />
              <span>{loading ? 'Creating Profile...' : 'Save Staff Profile'}</span>
            </button>
          </form>
        </div>

        {/* Existing Staff Profiles List & Backup Utilities (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Staff List Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="border-b pb-3 flex justify-between items-center">
              <h3 className="font-extrabold text-slate-900 text-sm tracking-tight flex items-center space-x-2">
                <Users size={16} className="text-[#0F6E4F]" />
                <span>Local Office Staff Profiles ({staffList.length})</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-400">Stored on This Device</span>
            </div>

            {staffList.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs space-y-1">
                <Users size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="font-semibold">No local staff profiles created yet.</p>
                <p className="text-[11px]">Use the form on the left to add clerks or ward members for action attribution.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {staffList.map((s) => (
                  <div key={s.id} className="border border-slate-200 rounded-2xl p-3 bg-slate-50 flex items-center justify-between hover:bg-slate-100/60 transition">
                    <div>
                      <div className="font-extrabold text-slate-900 text-xs">{s.name}</div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        <span className="uppercase text-slate-700 font-bold">{s.role.replace('_', ' ')}</span>
                        {s.wardNumber ? ` • Ward ${s.wardNumber}` : ''}
                        {s.pin ? ` • 🔒 PIN Enabled` : ''}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteStaff(s.id, s.name)}
                      className="text-slate-400 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition"
                      title="Remove Staff Profile"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Backup & Restore Notice Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-sm space-y-3 border border-slate-800">
            <div className="flex items-center space-x-2 text-emerald-400 font-extrabold text-sm">
              <FileJson size={18} />
              <span>Full Panchayath Backup & Restore</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Browser storage is non-durable and local to this device. Download a full JSON backup regularly to restore data when switching computers or clearing browser history.
            </p>
            <div className="flex space-x-3 pt-1">
              <button
                onClick={handleExportBackup}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center space-x-1.5"
              >
                <Download size={14} />
                <span>Export JSON Backup</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center space-x-1.5"
              >
                <Upload size={14} />
                <span>Restore From File</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
