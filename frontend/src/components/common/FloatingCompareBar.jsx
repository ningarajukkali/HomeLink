import React from 'react';
import { useApp } from '../context/AppContext';

export default function FloatingCompareBar() {
  const {
    comparePropertyIds,
    properties,
    navigate,
    clearCompare,
    currentRoute,
    removeFromCompare
  } = useApp();

  // Do not show on Compare screen itself or when 0 properties selected
  if (currentRoute === 'compare' || comparePropertyIds.length === 0) {
    return null;
  }

  const selectedProperties = properties.filter((p) =>
    comparePropertyIds.includes(p.id)
  );

  const count = selectedProperties.length;
  const isReady = count >= 2;

  return (
    <aside
      aria-label="Room Comparison Drawer"
      className="fixed bottom-20 md:bottom-6 left-3 right-20 md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-auto md:min-w-[420px] md:max-w-lg z-40 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="bg-[#131b2e] text-white p-2.5 md:p-3 rounded-2xl shadow-xl shadow-black/25 border border-white/10 flex items-center justify-between gap-3 backdrop-blur-md">
        {/* Left: Thumbnail Previews & Count Text */}
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Thumbnails of selected properties */}
          <div className="flex -space-x-2 shrink-0">
            {selectedProperties.map((p) => (
              <div
                key={p.id}
                className="relative group w-8 h-8 md:w-9 md:h-9 rounded-full ring-2 ring-[#131b2e] overflow-hidden bg-surface-container shrink-0"
                title={`${p.title} - ₹${p.rent}/mo`}
              >
                <img
                  src={p.images?.[0]}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromCompare(p.id);
                  }}
                  className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  title="Remove from comparison"
                >
                  <span className="material-symbols-outlined text-xs">close</span>
                </button>
              </div>
            ))}
            {count < 4 && (
              <div
                className="w-8 h-8 md:w-9 md:h-9 rounded-full ring-2 ring-[#131b2e] bg-white/10 text-white/60 flex items-center justify-center text-[10px] font-bold shrink-0"
                title="You can compare up to 4 properties"
              >
                +{4 - count}
              </div>
            )}
          </div>

          {/* Text Description */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs text-white truncate">
                {count} {count === 1 ? 'Property' : 'Properties'} selected
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                Max 4
              </span>
            </div>
            <p className="text-[11px] text-white/70 truncate hidden sm:block">
              {isReady
                ? 'Ready for side-by-side room comparison'
                : 'Add one more property to compare'}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={clearCompare}
            className="text-[11px] font-bold text-white/70 hover:text-rose-400 transition-colors cursor-pointer px-1 py-1"
            title="Clear all selected properties"
          >
            Clear
          </button>

          {isReady ? (
            <button
              type="button"
              onClick={() => navigate('compare')}
              className="flex items-center gap-1 px-3 py-1.5 md:px-3.5 md:py-2 rounded-xl bg-[#00A88E] hover:bg-[#00927b] active:scale-95 text-white font-extrabold text-xs shadow-md shadow-[#00A88E]/30 transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Compare</span>
              <span className="material-symbols-outlined text-sm">compare_arrows</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('rentals')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <span className="hidden xs:inline">+ Add 1 more</span>
              <span className="xs:hidden">+ 1 more</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
