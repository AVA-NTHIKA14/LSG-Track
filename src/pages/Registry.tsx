import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Buildings } from './Buildings';
import { Licenses } from './Licenses';
import { Building2, ShieldCheck } from 'lucide-react';

export const Registry: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'licenses' ? 'licenses' : 'establishments';
  const [activeSubTab, setActiveSubTab] = useState<'establishments' | 'licenses'>(initialTab);

  const handleTabChange = (tab: 'establishments' | 'licenses') => {
    setActiveSubTab(tab);
    setSearchParams({ tab });
  };

  return (
    <div className="space-y-6">
      
      {/* Registry Sub-Tab Header Switcher */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <Building2 size={22} className="text-[#0F6E4F]" />
            <span>{t('nav.buildings')} & {t('nav.licenses')} Registry</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Consolidated commercial premises, building records, and active K-SMART trade permits directory.
          </p>
        </div>

        <div className="flex bg-slate-100/90 p-1 rounded-2xl border border-slate-200 shrink-0 text-xs font-bold">
          <button
            onClick={() => handleTabChange('establishments')}
            className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 ${
              activeSubTab === 'establishments'
                ? 'bg-[#0F6E4F] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 size={15} />
            <span>{t('nav.buildings')}</span>
          </button>
          <button
            onClick={() => handleTabChange('licenses')}
            className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 ${
              activeSubTab === 'licenses'
                ? 'bg-[#0F6E4F] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck size={15} />
            <span>{t('nav.licenses')}</span>
          </button>
        </div>
      </div>

      {/* Render Selected View */}
      {activeSubTab === 'establishments' ? (
        <Buildings />
      ) : (
        <Licenses />
      )}
    </div>
  );
};
