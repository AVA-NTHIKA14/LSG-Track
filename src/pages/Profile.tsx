import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import type { UserProfile } from '../types';
import { User, Award, Milestone, KeyRound } from 'lucide-react';

export const Profile: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setCurrentUser(authService.getCurrentUser());
    const unsub = authService.subscribeToAuthChanges((user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  if (!currentUser) {
    return (
      <div className="bg-white border border-gov-border rounded p-6 shadow-sm text-center py-12 text-slate-500 italic text-xs max-w-md mx-auto mt-12">
        No active user session detected. Please sign in via portal security screen.
      </div>
    );
  }

  // Define descriptive role specifications
  const getRoleDesc = (role: string) => {
    switch (role) {
      case 'Administrator':
        return 'Overall administrative control, user permissions configuration, database registers review, settings management, and e-Governance logs audit.';
      case 'Secretary':
        return 'Executive approval authority, trade license generation, field survey observations verification, renewal authorizations, and analytics reports view.';
      case 'Ward Member':
        return 'Assigned ward boundary supervisor, unlicensed building monitoring, field survey entries submission, and ward performance statistics review.';
      case 'VEO':
        return 'Panchayath Section Officer - Physical asset inspections supervisor, GPS coordinate tags capture, field verification data logs submission, and local survey drafts offline caching.';
      case 'Data Entry Operator':
        return 'Manual asset registers digitizer, commercial building metadata registry entry, documentation upload, and file properties modifications.';
      default:
        return 'Portal auditor/viewer. Read-only permissions across GIS maps, dashboard indicators, registries, and reports logs. Administrative actions restricted.';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gov-navy">Personnel Profile Summary</h2>
        <p className="text-xs text-slate-500">Official security credentials, role designations, and administrative permissions log.</p>
      </div>

      <div className="bg-white border border-gov-border rounded shadow-sm max-w-xl mx-auto overflow-hidden">
        
        {/* Banner */}
        <div className="bg-gov-navy text-white p-6 flex items-center space-x-4 border-b-4 border-gov-green">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border-2 border-gov-green-light shrink-0">
            <User size={32} className="text-gov-green-light" />
          </div>
          <div>
            <span className="font-mono text-[9px] text-slate-300 uppercase tracking-widest bg-slate-800 px-2 py-0.5 rounded">e-Governance ID: {currentUser.id.substring(0, 10)}</span>
            <h3 className="font-bold text-base mt-1 leading-none">{currentUser.name}</h3>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">{currentUser.email}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-700">
          
          {/* Role block */}
          <div className="flex items-start space-x-3">
            <Award size={18} className="text-gov-green shrink-0 mt-0.5" />
            <div>
              <span className="block font-bold text-slate-500 uppercase text-[9px]">Designated User Role</span>
              <span className="block font-bold text-slate-900 text-sm mt-0.5">{currentUser.role}</span>
              <p className="text-slate-600 mt-1 leading-relaxed font-medium">
                {getRoleDesc(currentUser.role)}
              </p>
            </div>
          </div>

          {/* Ward assignment (if any) */}
          {currentUser.ward && (
            <div className="flex items-start space-x-3 border-t pt-4">
              <Milestone size={18} className="text-gov-green shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-slate-500 uppercase text-[9px]">Assigned Ward Jurisdiction</span>
                <span className="block font-bold text-slate-900 text-sm mt-0.5">Ward {currentUser.ward} Boundary</span>
                <p className="text-slate-600 mt-1 leading-relaxed font-medium">
                  Authorised to perform inspections and monitor compliance aggregates within Ward {currentUser.ward} boundaries.
                </p>
              </div>
            </div>
          )}

          {/* Permissions tray */}
          <div className="flex items-start space-x-3 border-t pt-4">
            <KeyRound size={18} className="text-gov-green shrink-0 mt-0.5" />
            <div className="w-full">
              <span className="block font-bold text-slate-500 uppercase text-[9px] mb-2">Authorized Administrative Permissions</span>
              
              <div className="flex flex-wrap gap-1.5 font-mono">
                {currentUser.permissions.includes('all') ? (
                  <span className="bg-slate-100 border text-slate-800 px-2 py-0.5 rounded text-[10px] font-bold">
                    * ALL AUTHORIZATIONS (ROOT_ADMIN)
                  </span>
                ) : (
                  currentUser.permissions.map((p, i) => (
                    <span key={i} className="bg-slate-50 border text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">
                      {p.toUpperCase()}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
