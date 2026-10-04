import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import DemoBadge from './DemoBadge';

export default function ReplacePropertyModal({
  isOpen,
  onClose,
  targetPropertyId
}) {
  const {
    properties,
    comparePropertyIds,
    replaceInCompare,
    rentalFilters
  } = useApp();

  const [searchFilter, setSearchFilter] = useState('');

  if (!isOpen || !targetPropertyId) return null;

  const targetProperty = properties.find((p) => p.id === targetPropertyId);

  // Filter available properties
  const availableProperties = properties.filter((p) => {
    // Cannot replace with the exact same property
    if (p.id === targetPropertyId) return false;
    
    // Quick text filter inside modal
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const match = p.title.toLowerCase().includes(q) ||
                    p.locality.toLowerCase().includes(q) ||
                    p.propertyType.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const handleSelectReplacement = (newPropId) => {
    const success = replaceInCompare(targetPropertyId, newPropId);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-xl max-h-[85vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-outline-variant/30 flex items-center justify-between bg-gradient-to-r from-[#00A88E]/10 via-transparent to-transparent shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#00A88E] uppercase tracking-wider">
              <span className="material-symbols-outlined text-base">swap_horiz</span>
              <span>Replace Property</span>
            </div>
            <h3 className="text-base md:text-lg font-black text-on-surface">
              Replacing: {targetProperty?.title}
            </h3>
            <p className="text-xs text-outline font-medium">
              Choose an alternative Rewa rental to swap into this column
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-container text-outline hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Search input inside modal */}
        <div className="p-3 bg-surface border-b border-outline-variant/20 shrink-0">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-outline-variant/50 focus-within:border-[#00A88E] transition-all">
            <span className="material-symbols-outlined text-lg text-outline">search</span>
            <input
              type="text"
              placeholder="Search by area (APSU, Civil Lines, Bodhaghat) or type..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full text-xs font-semibold text-on-surface bg-transparent focus:outline-none"
            />
            {searchFilter && (
              <button
                type="button"
                onClick={() => setSearchFilter('')}
                className="text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Options List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {availableProperties.length === 0 ? (
            <div className="text-center py-8 text-outline text-xs">
              No matching alternative properties found in Rewa.
            </div>
          ) : (
            availableProperties.map((prop) => {
              const isAlreadyComparing = comparePropertyIds.includes(prop.id);

              return (
                <div
                  key={prop.id}
                  className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isAlreadyComparing
                      ? 'bg-surface-container/40 border-outline-variant/30 opacity-70'
                      : 'bg-white border-outline-variant/50 hover:border-[#00A88E] hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                    <img
                      src={prop.images?.[0]}
                      alt={prop.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-outline-variant/30"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-[#00A88E]">
                          ₹{prop.rent.toLocaleString('en-IN')}/mo
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">
                          {prop.propertyType}
                        </span>
                        <DemoBadge size="sm" />
                      </div>

                      <h4 className="font-bold text-xs text-on-surface truncate">
                        {prop.title}
                      </h4>

                      <p className="text-[11px] text-outline truncate flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[13px] text-[#00A88E]">location_on</span>
                        {prop.locality}
                      </p>

                      <div className="flex items-center gap-1.5 text-[10px] text-outline mt-1 truncate">
                        <span>{prop.furnished}</span>
                        <span>•</span>
                        <span>{prop.amenities?.slice(0, 2).join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 w-full sm:w-auto flex sm:block justify-end">
                    {isAlreadyComparing ? (
                      <span className="text-xs font-bold text-outline px-3 py-1.5 rounded-xl bg-surface-container inline-block">
                        Already in Compare
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSelectReplacement(prop.id)}
                        className="px-4 py-2 rounded-xl bg-[#00A88E] hover:bg-[#00927b] text-white text-xs font-bold transition-all shadow-sm shadow-[#00A88E]/20 cursor-pointer"
                      >
                        Replace
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
