import React from 'react';
import { useApp } from '../context/AppContext';

export default function FeaturedListingView() {
  const { goBack, navigate } = useApp();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-outline-variant/30">
        <button
          onClick={goBack}
          className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <div>
          <div className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase text-[#00A88E] bg-[#00A88E]/10 px-2.5 py-0.5 rounded-full mb-0.5">
            <span className="material-symbols-outlined text-xs">star</span>
            <span>100% Free Platform Policy</span>
          </div>
          <h1 className="text-xl font-extrabold text-on-surface">
            Featured Listings on HomeLink
          </h1>
        </div>
      </div>

      {/* Main Free Feature Policy Card */}
      <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#00A88E]/10 text-[#00A88E] flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl">verified</span>
        </div>

        <h2 className="text-lg font-black text-on-surface">
          Zero Fees. Zero Paid Placements.
        </h2>

        <p className="text-xs text-outline leading-relaxed">
          HomeLink is <strong>completely free for all owners, renters, and students</strong>. We do not sell paid boosts, subscriptions, or featured tiers.
        </p>

        <div className="space-y-3 pt-2 text-xs">
          <div className="p-3.5 rounded-2xl bg-surface-container-low flex items-start gap-3">
            <span className="material-symbols-outlined text-base text-[#00A88E] shrink-0 mt-0.5">check_circle</span>
            <div>
              <strong className="text-on-surface block">Organic, Quality-Based Visibility</strong>
              <span className="text-outline text-[11px]">
                Listings with clear photos, transparent pricing, and prompt host response times automatically receive higher placement.
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-container-low flex items-start gap-3">
            <span className="material-symbols-outlined text-base text-[#00A88E] shrink-0 mt-0.5">check_circle</span>
            <div>
              <strong className="text-on-surface block">Zero Brokerage & Zero Listing Fees</strong>
              <span className="text-outline text-[11px]">
                Publish as many rooms or flats as you have available without any registration or renewal costs.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate('dashboard')}
          className="flex-1 py-3 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface transition-colors cursor-pointer text-center"
        >
          Return to Dashboard
        </button>

        <button
          type="button"
          onClick={() => navigate('list-property')}
          className="flex-1 py-3 px-4 rounded-xl bg-[#00A88E] hover:bg-[#00927b] text-white text-xs font-bold shadow-md transition-all cursor-pointer text-center"
        >
          List a Free Property
        </button>
      </div>
    </div>
  );
}
