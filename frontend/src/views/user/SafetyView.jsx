import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function SafetyView() {
  const { goBack, setReportModalOpen, setReportedTarget } = useApp();
  const [activeTab, setActiveTab] = useState('pillars'); // 'pillars' | 'states' | 'charter'

  const handleReportGeneral = () => {
    setReportedTarget({ type: 'General Brokerage Incident', id: 'gen-report', title: 'Rewa SafeNet Report' });
    setReportModalOpen(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-20 md:pb-12">
      {/* Header matching Stitch 335e8a7323904d94b5436c54ef2c3b5b */}
      <div className="flex items-center gap-3 pb-3 border-b border-outline-variant/30">
        <button
          onClick={goBack}
          className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[10px] font-extrabold uppercase">
            <span className="material-symbols-outlined text-xs">verified_user</span>
            <span>Rewa SafeNet v2.4</span>
          </div>
          <h1 className="text-xl font-extrabold text-on-surface">
            Trust, Safety & Security Hub
          </h1>
        </div>
      </div>

      <p className="text-xs text-outline leading-relaxed">
        HomeLink is engineered specifically to eliminate rental fraud, fake brokerages, and unverified roommate listings across Rewa.
      </p>

      {/* Tabs */}
      <div className="flex rounded-2xl bg-surface-container p-1 text-xs font-extrabold">
        {[
          { id: 'pillars', label: 'Safety Pillars' },
          { id: 'charter', label: 'Anti-Brokerage Policy' },
          { id: 'states', label: 'Platform States' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer text-center ${
              activeTab === tab.id
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Safety Pillars */}
      {activeTab === 'pillars' && (
        <div className="space-y-3.5">
          <div className="p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary-container text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">phone_android</span>
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-on-surface">OTP Authenticated Logins</h3>
                <span className="text-[11px] text-emerald-700 font-bold">100% Verified Phone Numbers</span>
              </div>
            </div>
            <p className="text-xs text-outline leading-relaxed pt-1">
              Every tenant and host must verify their mobile identity through an SMS gateway before posting or contacting members. Phone numbers remain masked in public search results.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-secondary-container text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">apartment</span>
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-on-surface">Geo-Tagged Physical Inspections</h3>
                <span className="text-[11px] text-emerald-700 font-bold">Rewa Field Agent Audits</span>
              </div>
            </div>
            <p className="text-xs text-outline leading-relaxed pt-1">
              Properties displaying the "Verified Stay" badge have been audited in-person for accurate room photos, operational water/power, and legitimate owner deeds.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">badge</span>
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-on-surface">Student & Institutional KYC</h3>
                <span className="text-[11px] text-emerald-700 font-bold">APSU & Medical College Credentials</span>
              </div>
            </div>
            <p className="text-xs text-outline leading-relaxed pt-1">
              Roommate seekers can voluntarily connect their official college or hospital ID to display trusted green verification pills.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: Anti-Brokerage Charter */}
      {activeTab === 'charter' && (
        <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/40 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">block</span>
          </div>

          <h2 className="text-lg font-black text-on-surface">
            Zero Brokerage, Direct Lease Policy
          </h2>

          <p className="text-xs text-on-surface-variant leading-relaxed">
            HomeLink was founded to eliminate the rampant problem of unauthorized middlemen charging 15 days to 1 month rent as "brokerage commission" from students in Rewa.
          </p>

          <div className="p-4 rounded-2xl bg-surface-container-low text-xs space-y-2 font-medium">
            <p className="font-bold text-on-surface">Rules strictly enforced:</p>
            <ul className="space-y-1.5 list-disc list-inside text-outline">
              <li>No middleman or broker may list properties without explicit owner deed documentation.</li>
              <li>Charging commission to tenants will result in permanent device & phone blacklisting.</li>
              <li>All tenancy agreements are signed directly between property owners and renters.</li>
            </ul>
          </div>

          <button
            onClick={handleReportGeneral}
            className="w-full py-3 px-4 rounded-xl bg-error text-white font-bold text-xs hover:bg-error/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-base">report</span>
            <span>Report Broker or Suspicious Property</span>
          </button>
        </div>
      )}

      {/* TAB 3: Platform States Demo */}
      {activeTab === 'states' && (
        <div className="space-y-4">
          <p className="text-xs text-outline">
            Interactive demonstrations of HomeLink system states (empty, error, loading, and success).
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => alert('Success State: Your verified inquiry was dispatched successfully!')}
              className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 hover:border-primary-container text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl text-emerald-600 mb-1">check_circle</span>
              <h4 className="font-extrabold text-xs text-on-surface">Success Feedback</h4>
              <p className="text-[10px] text-outline">Toast confirmation modal</p>
            </button>

            <button
              onClick={() => alert('Connection State: Network heartbeat optimal (SafeNet latency 42ms).')}
              className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 hover:border-primary-container text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl text-primary-container mb-1">wifi</span>
              <h4 className="font-extrabold text-xs text-on-surface">Live Network</h4>
              <p className="text-[10px] text-outline">Rewa node synchronized</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
