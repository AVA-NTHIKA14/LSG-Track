import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useAuth } from '../context/AuthContext';
import type { UserProfile, UserRole } from '../types';
import { ShieldAlert, Clock, Send, LogOut, Building2, User, Hash } from 'lucide-react';

export const Onboarding: React.FC = () => {
  const { user, profile, logout } = useAuth();

  const [panchayatCode, setPanchayatCode] = useState('G070702');
  const [role, setRole] = useState<UserRole>('clerk');
  const [wardNumber, setWardNumber] = useState<number | ''>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!panchayatCode.trim()) {
      setError('Please provide a valid Panchayat Code (e.g. G070702).');
      return;
    }

    if (role === 'ward_member' && (!wardNumber || Number(wardNumber) < 1)) {
      setError('Please provide a valid Ward Number for Ward Member role.');
      return;
    }

    setLoading(true);
    setError(null);

    const formattedCode = panchayatCode.trim().toUpperCase();

    const newProfile: UserProfile = {
      uid: user.uid,
      name: user.displayName || user.email?.split('@')[0] || 'Grama Officer',
      email: user.email || '',
      panchayatCode: formattedCode,
      role,
      wardNumber: role === 'ward_member' ? Number(wardNumber) : null,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    try {
      if (db) {
        await setDoc(doc(db, 'users', user.uid), newProfile);
      }
      localStorage.setItem('cp_license_active_user', JSON.stringify(newProfile));
      localStorage.setItem('cp_active_panchayat_code', formattedCode);
    } catch (err: any) {
      console.error('Error saving onboarding profile:', err);
      setError(err?.message || 'Failed to submit profile for secretarial approval.');
    } finally {
      setLoading(false);
    }
  };

  // If user profile exists and is PENDING
  if (profile?.status === 'PENDING') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl border border-slate-100">
          <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Clock size={32} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Awaiting Secretarial Approval</h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Your registration request for Panchayat <strong className="text-slate-900 font-mono">{profile.panchayatCode}</strong> as <strong className="text-slate-900 capitalize">{profile.role.replace('_', ' ')}</strong> has been submitted.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Applicant:</span>
              <span className="font-bold text-slate-900">{profile.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Email:</span>
              <span className="font-mono text-slate-700">{profile.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Target Panchayat:</span>
              <span className="font-mono font-bold text-[#0F6E4F]">{profile.panchayatCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="bg-amber-100 text-amber-900 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full">
                PENDING APPROVAL
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            Please inform your Panchayat Secretary to approve your access in the Secretarial Approval Terminal.
          </p>

          <button
            onClick={logout}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center space-x-2"
          >
            <LogOut size={16} />
            <span>Sign Out & Try Another Account</span>
          </button>
        </div>
      </div>
    );
  }

  // If profile is REJECTED
  if (profile?.status === 'REJECTED') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl border border-red-100">
          <div className="w-16 h-16 bg-red-100 text-red-700 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert size={32} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Application Rejected</h2>
            <p className="text-xs text-slate-500 mt-2">
              Your request for access to Panchayat <strong className="text-slate-900">{profile.panchayatCode}</strong> was rejected by the Panchayat Secretary.
            </p>
          </div>
          <button
            onClick={logout}
            className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Form for New User Onboarding
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full space-y-6 shadow-2xl border border-slate-100">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-emerald-50 text-[#0F6E4F] rounded-2xl flex items-center justify-center mx-auto mb-2">
            <Building2 size={24} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Panchayat Personnel Onboarding</h2>
          <p className="text-xs text-slate-500">
            Welcome <span className="font-bold text-slate-900">{user?.displayName || user?.email}</span>. Select your Panchayat and official role.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 text-xs p-3 rounded-xl flex items-center space-x-2">
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
          <div>
            <label className="block text-slate-900 font-extrabold mb-1 flex items-center space-x-1.5">
              <Building2 size={14} className="text-[#0F6E4F]" />
              <span>Panchayat Code (LSGD Code) *</span>
            </label>
            <input
              type="text"
              required
              value={panchayatCode}
              onChange={(e) => setPanchayatCode(e.target.value.toUpperCase())}
              placeholder="e.g. G070702"
              className="w-full border border-slate-200 rounded-xl p-2.5 font-mono text-xs focus:outline-none focus:border-[#0F6E4F] focus:ring-1 focus:ring-[#0F6E4F] uppercase"
            />
            <p className="text-[10px] text-slate-400 mt-1">Unique 7-digit LSGD identifier (e.g. G070702 for Panangad)</p>
          </div>

          <div>
            <label className="block text-slate-900 font-extrabold mb-1 flex items-center space-x-1.5">
              <User size={14} className="text-[#0F6E4F]" />
              <span>Official Designation / Role *</span>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#0F6E4F] focus:ring-1 focus:ring-[#0F6E4F]"
            >
              <option value="clerk">Panchayat Section Clerk / DEO</option>
              <option value="ward_member">Ward Member / Field Inspector</option>
              <option value="secretary">Panchayat Secretary</option>
            </select>
          </div>

          {role === 'ward_member' && (
            <div>
              <label className="block text-slate-900 font-extrabold mb-1 flex items-center space-x-1.5">
                <Hash size={14} className="text-[#0F6E4F]" />
                <span>Assigned Ward Number *</span>
              </label>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0F6E4F] hover:bg-[#0B5A3E] text-white font-extrabold py-3 rounded-xl text-xs transition shadow-sm flex items-center justify-center space-x-2"
          >
            <Send size={16} />
            <span>{loading ? 'Submitting Application...' : 'Submit Profile for Approval'}</span>
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 text-center">
          <button
            onClick={logout}
            className="text-xs text-slate-400 hover:text-slate-600 font-medium"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};