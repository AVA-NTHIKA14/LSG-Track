import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';
import type { WardRecord, BuildingRecord } from '../types';
import { Users, ArrowUpRight, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Wards: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const assignedWard = currentUser?.ward || '1';
  const isWardMember = currentUser?.role === 'Ward Member';

  const [wards, setWards] = useState<WardRecord[]>([]);
  const [buildings, setBuildings] = useState<BuildingRecord[]>([]);
  const [selectedWard, setSelectedWard] = useState<WardRecord | null>(null);

  useEffect(() => {
    const unsubWards = dbService.subscribeToWards(setWards);
    const unsubBuildings = dbService.subscribeToBuildings(setBuildings);
    return () => {
      unsubWards();
      unsubBuildings();
    };
  }, []);

  const handleSelectWard = (ward: WardRecord) => {
    setSelectedWard(ward);
  };

  const wardBuildings = selectedWard 
    ? buildings.filter(b => b.wardNumber === selectedWard.id)
    : [];

  if (currentUser?.role !== 'Secretary' && currentUser?.role !== 'Administrator') {
    return (
      <div className="bg-white border border-gov-border rounded p-6 shadow-sm text-center py-12 text-slate-500 italic text-xs max-w-md mx-auto mt-12">
        <ShieldAlert size={36} className="mx-auto text-red-700 mb-2" />
        <p className="font-bold text-slate-800 text-sm mb-1">ACCESS RESTRICTED</p>
        <p className="mb-4">Ward Management metrics are restricted to Panchayat Secretaries and Administrators.</p>
        <p>Your current profile ({currentUser?.role || 'Guest'}) does not hold access permissions.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gov-navy">Ward Management & Boundaries</h2>
        <p className="text-xs text-slate-500">Compliance distribution, inspection officer assignments, and spatial records for the 6 local body wards.</p>
      </div>

      {/* Grid of Wards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wards
          .filter(w => !isWardMember || w.id === assignedWard)
          .map((w) => {
          // Calculate compliance color
          let cardBorder = 'border-l-4 border-l-status-licensed';
          let badgeBg = 'bg-green-50 text-status-licensed';
          if (w.compliancePercentage < 70) {
            cardBorder = 'border-l-4 border-l-status-unlicensed';
            badgeBg = 'bg-red-50 text-status-unlicensed';
          } else if (w.compliancePercentage < 80) {
            cardBorder = 'border-l-4 border-l-status-pending';
            badgeBg = 'bg-amber-50 text-amber-800';
          }

          return (
            <div 
              key={w.id}
              onClick={() => handleSelectWard(w)}
              className={`bg-white border border-gov-border rounded p-4 shadow-sm hover:border-gov-green transition cursor-pointer flex flex-col justify-between ${cardBorder} ${
                selectedWard?.id === w.id ? 'ring-1 ring-gov-green' : ''
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-wider">Ward ID: {w.id}</span>
                    <h3 className="font-bold text-slate-800 text-xs mt-0.5">{w.name}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badgeBg}`}>
                    {w.compliancePercentage}% Compliance
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-b py-2 my-2 text-center text-[10px] text-slate-500 font-mono">
                  <div>
                    <span className="block font-bold text-slate-800 text-xs">{w.totalBuildings}</span>
                    <span>Buildings</span>
                  </div>
                  <div>
                    <span className="block font-bold text-status-licensed text-xs">{w.licensedBuildings}</span>
                    <span>Licensed</span>
                  </div>
                  <div>
                    <span className="block font-bold text-status-unlicensed text-xs">{w.unlicensedBuildings}</span>
                    <span>Unlicensed</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1.5">
                <div className="flex items-center space-x-1">
                  <Users size={12} className="text-slate-400" />
                  <span>Officer: {w.assignedOfficer}</span>
                </div>
                <span className="text-gov-green font-bold uppercase tracking-wider flex items-center space-x-0.5">
                  <span>Drill down</span>
                  <ArrowUpRight size={10} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ward Drilldown Panel */}
      {selectedWard ? (
        <div className="bg-white border border-gov-border rounded p-5 shadow-sm">
          
          <div className="border-b pb-3 mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">Expanded View: Ward {selectedWard.id}</span>
              <h3 className="font-bold text-slate-800 text-sm mt-1">Establishment directory inside {selectedWard.name}</h3>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Assigned Inspection Officer: <strong>{selectedWard.assignedOfficer}</strong>
            </div>
          </div>

          {wardBuildings.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500 italic">
              No commercial building assets currently registered inside Ward {selectedWard.id}.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-gov-border text-slate-500 font-bold uppercase">
                  <tr>
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Business Name</th>
                    <th className="px-3 py-2">Owner Name</th>
                    <th className="px-3 py-2">Category</th>
                    <th className="px-3 py-2">License ID</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gov-border">
                  {wardBuildings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2.5 font-bold font-mono text-slate-800">{b.id}</td>
                      <td className="px-3 py-2.5 font-bold text-slate-800">{b.businessName}</td>
                      <td className="px-3 py-2.5">{b.ownerName}</td>
                      <td className="px-3 py-2.5">{b.category}</td>
                      <td className="px-3 py-2.5 font-mono text-slate-500">{b.licenseId || 'N/A'}</td>
                      <td className="px-3 py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          b.status === 'licensed' 
                            ? 'bg-green-50 text-status-licensed' 
                            : b.status === 'unlicensed' 
                              ? 'bg-red-50 text-status-unlicensed' 
                              : b.status === 'pending' 
                                ? 'bg-amber-50 text-status-pending'
                                : 'bg-blue-50 text-status-govt'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <Link 
                          to={`/buildings?id=${b.id}`}
                          className="text-gov-green hover:underline font-bold"
                        >
                          View Registry
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      ) : (
        <div className="bg-slate-100 border rounded p-6 text-center text-xs text-slate-400 italic">
          Click any ward card above to drill down and review the list of operating establishments and active license audits.
        </div>
      )}

    </div>
  );
};
