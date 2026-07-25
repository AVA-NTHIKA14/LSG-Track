import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Reports } from './Reports';
import { WardReports } from './WardReports';
import { BarChart3, ClipboardCheck } from 'lucide-react';

export const Report: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'ward' ? 'ward' : 'executive';
  const [activeSubTab, setActiveSubTab] = useState<'executive' | 'ward'>(initialTab);

  const handleTabChange = (tab: 'executive' | 'ward') => {
    setActiveSubTab(tab);
    setSearchParams({ tab });
  };

  return (
    <div className="space-y-6">
      
      {/* Consolidated Report Sub-Tab Switcher */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <BarChart3 size={22} className="text-[#0F6E4F]" />
            <span>{t('nav.reports')} & {t('nav.ward_reports')}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Executive compliance statistics, revenue analytics, and Ward Member field report verification.
          </p>
        </div>

        <div className="flex bg-slate-100/90 p-1 rounded-2xl border border-slate-200 shrink-0 text-xs font-bold">
          <button
            onClick={() => handleTabChange('executive')}
            className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 ${
              activeSubTab === 'executive'
                ? 'bg-[#0F6E4F] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 size={15} />
            <span>{t('nav.reports')}</span>
          </button>
          <button
            onClick={() => handleTabChange('ward')}
            className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 ${
              activeSubTab === 'ward'
                ? 'bg-[#0F6E4F] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardCheck size={15} />
            <span>{t('nav.ward_reports')}</span>
          </button>
        </div>
      </div>

      {/* Render Selected View */}
      {activeSubTab === 'executive' ? (
        <Reports />
      ) : (
        <WardReports />
      )}
    </div>
  );
};
