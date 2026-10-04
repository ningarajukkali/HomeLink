import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import DemoBadge from './DemoBadge';

export default function AddPropertyModal({ isOpen, onClose }) {
  const {
    properties,
    comparePropertyIds,
    addToCompare
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  if (!isOpen) return null;

  const propertyTypes = ['All', 'Room', 'PG', '1 BHK', '2 BHK', 'House', 'Hostel'];

  const filteredProperties = properties.filter((prop) => {
    // Type filter
    if (selectedType !== 'All' && prop.propertyType !== selectedType) {
      return false;
    }

    // Text search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        prop.title.toLowerCase().includes(q) ||
        prop.locality.toLowerCase().includes(q) ||
        prop.description.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const handleAdd = (propId) => {
    const success = addToCompare(propId);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-2xl max-h-[88vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-outline-variant/30 flex items-center justify-between bg-gradient-to-r from-[#00A88E]/10 via-transparent to-transparent shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#00A88E] uppercase tracking-wider">
              <span className="material-symbols-outlined text-base">add_circle</span>
              <span>Add Property to Compare</span>
            </div>
            <h3 className="text-base md:text-lg font-black text-on-surface">
              Select Property ({comparePropertyIds.length} of 4 selected)
            </h3>
            <p className="text-xs text-outline font-medium">
              Choose a verified property in Rewa to add side-by-side
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

        {/* Search & Type Filter Bar */}
        <div className="p-3 bg-surface border-b border-outline-variant/20 space-y-2 shrink-0">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-outline-variant/50 focus-within:border-[#00A88E] transition-all">
            <span className="material-symbols-outlined text-lg text-outline">search</span>
            <input
              type="text"
              placeholder="Search Rewa listings (University Area, Civil Lines, PG)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-semibold text-on-surface bg-transparent focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>

          {/* Quick type chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {propertyTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedType === type
                    ? 'bg-[#00A88E] text-white shadow-2xs'
                    : 'bg-white hover:bg-surface-container text-outline border border-outline-variant/40'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Properties List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-10 text-outline text-xs">
              No matching properties found in Rewa.
            </div>
          ) : (
            filteredProperties.map((prop) => {
              const isAlreadyComparing = comparePropertyIds.includes(prop.id);

              return (
                <div
                  key={prop.id}
                  className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isAlreadyComparing
                      ? 'bg-surface-container/40 border-outline-variant/30 opacity-75'
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
                        <span>{prop.distance || 'Rewa'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 w-full sm:w-auto flex sm:block justify-end">
                    {isAlreadyComparing ? (
                      <span className="text-xs font-bold text-outline px-3 py-1.5 rounded-xl bg-surface-container inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-[#00A88E]">check</span>
                        <span>Already Comparing</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAdd(prop.id)}
                        className="px-4 py-2 rounded-xl bg-[#00A88E] hover:bg-[#00927b] text-white text-xs font-bold transition-all shadow-sm shadow-[#00A88E]/20 cursor-pointer flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                        <span>Add to Compare</span>
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
