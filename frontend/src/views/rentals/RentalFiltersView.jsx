import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function RentalFiltersView() {
  const {
    rentalFilters,
    setRentalFilters,
    navigate,
    goBack,
    properties,
    selectedCity,
    changeCity,
    CITIES
  } = useApp();

  // Local state for editing filters before apply
  const [localFilters, setLocalFilters] = useState({ ...rentalFilters });
  const [radiusKm, setRadiusKm] = useState(5);

  const availableTypes = ['Room', 'PG', '1 BHK', '2 BHK', 'House'];
  const furnishingOptions = ['All', 'Furnished', 'Semi-Furnished', 'Unfurnished'];
  const tenantOptions = ['All', 'Students & Working Bachelors', 'Families / Working Professionals', 'Students Only'];

  const toggleType = (t) => {
    setLocalFilters(prev => {
      let types = prev.propertyTypes.filter(item => item !== 'All');
      if (types.includes(t)) {
        types = types.filter(item => item !== t);
        if (types.length === 0) types = ['All'];
      } else {
        types = [...types, t];
      }
      return { ...prev, propertyTypes: types };
    });
  };

  const handleReset = () => {
    const defaultFilters = {
      searchQuery: '',
      locality: 'All',
      propertyTypes: ['All'],
      minRent: 2000,
      maxRent: 20000,
      furnishing: 'All',
      preferredTenant: 'All',
      sortBy: 'recommended'
    };
    setLocalFilters(defaultFilters);
    setRentalFilters(defaultFilters);
  };

  const handleApply = () => {
    setRentalFilters(localFilters);
    navigate('rentals');
  };

  // Calculate matching count
  const matchingCount = properties.filter(p => {
    if (selectedCity && selectedCity !== 'All Cities') {
      const target = selectedCity.toLowerCase().replace(' ncr', '');
      const pCity = (p.city || '').toLowerCase();
      const pLoc = (p.locality || '').toLowerCase();
      const isMatch = pCity === selectedCity.toLowerCase() || pCity.includes(target) || pLoc.includes(target);
      if (!isMatch) return false;
    }
    if (localFilters.propertyTypes && !localFilters.propertyTypes.includes('All')) {
      if (!localFilters.propertyTypes.includes(p.propertyType)) return false;
    }
    if (p.rent < localFilters.minRent || p.rent > localFilters.maxRent) return false;
    if (localFilters.furnishing !== 'All' && p.furnished !== localFilters.furnishing) return false;
    return true;
  }).length;

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6 pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-on-surface">Rental Filters</h1>
            <p className="text-xs text-outline font-medium">
              Customize search criteria in {selectedCity === 'All Cities' ? 'All Locations' : selectedCity}
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="text-xs font-bold text-primary-container hover:underline cursor-pointer"
        >
          Reset All
        </button>
      </div>

      {/* Section 0: Target City Selection */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container text-xl">location_city</span>
            <span className="text-sm font-bold text-on-surface">Target City</span>
          </div>
          <span className="text-xs font-extrabold text-primary px-2.5 py-0.5 rounded-full bg-primary-fixed/40">
            {selectedCity === 'All Cities' ? 'All Locations' : selectedCity}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CITIES?.map((c) => {
            const isSelected = selectedCity === c.id || (!selectedCity && c.id === 'All Cities');
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => changeCity(c.id)}
                className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'border-primary-container bg-primary-fixed/20 text-on-surface'
                    : 'border-outline-variant/50 bg-surface-container-low text-outline hover:text-on-surface'
                }`}
              >
                <div className="truncate">
                  <div className="text-xs font-bold truncate">{c.badge || c.name}</div>
                  <div className="text-[10px] text-outline truncate">{c.state}</div>
                </div>
                {isSelected && (
                  <span className="material-symbols-outlined text-primary-container text-base shrink-0 ml-1">
                    check_circle
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 1: Locality & Radius Slider */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container text-xl">near_me</span>
            <span className="text-sm font-bold text-on-surface">Search Radius</span>
          </div>
          <span className="text-xs font-extrabold text-primary px-2.5 py-1 rounded-full bg-primary-fixed/40">
            Within {radiusKm} km radius
          </span>
        </div>
        <p className="text-xs text-outline">
          Centered around {selectedCity === 'All Cities' ? 'selected city localities' : `${selectedCity} localities`}.
        </p>
        <input
          type="range"
          min="1"
          max="20"
          value={radiusKm}
          onChange={(e) => setRadiusKm(Number(e.target.value))}
          className="w-full accent-primary-container cursor-pointer"
        />
        <div className="flex justify-between text-[11px] font-bold text-outline">
          <span>1 km (Walking)</span>
          <span>5 km</span>
          <span>20 km (Greater Area)</span>
        </div>
      </div>

      {/* Section 2: Property Type Multi-Select */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/40 space-y-3">
        <label className="block text-sm font-bold text-on-surface">
          Property Type
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {availableTypes.map((type) => {
            const checked = localFilters.propertyTypes.includes(type) || 
              (localFilters.propertyTypes.includes('All'));

            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleType(type)}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  checked
                    ? 'border-primary-container bg-primary-fixed/20 text-on-surface'
                    : 'border-outline-variant/50 bg-surface-container-low text-outline hover:text-on-surface'
                }`}
              >
                <span className="text-xs font-bold">{type}</span>
                <span className={`material-symbols-outlined text-lg ${checked ? 'text-primary-container' : 'text-outline/40'}`}>
                  {checked ? 'check_box' : 'check_box_outline_blank'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 3: Monthly Rent Range */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/40 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-on-surface">
            Monthly Rent Budget
          </label>
          <span className="text-xs font-bold text-on-surface">
            ₹{localFilters.minRent.toLocaleString()} - ₹{localFilters.maxRent.toLocaleString()}
          </span>
        </div>

        <div className="space-y-4 pt-2">
          <div>
            <div className="flex justify-between text-xs text-outline mb-1 font-semibold">
              <span>Max Rent: ₹{localFilters.maxRent.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="2000"
              max="25000"
              step="500"
              value={localFilters.maxRent}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, maxRent: Number(e.target.value) }))}
              className="w-full accent-primary-container cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Section 4: Furnishing Level */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/40 space-y-3">
        <label className="block text-sm font-bold text-on-surface">
          Furnishing Status
        </label>
        <div className="flex flex-wrap gap-2">
          {furnishingOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setLocalFilters(prev => ({ ...prev, furnishing: opt }))}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                localFilters.furnishing === opt
                  ? 'bg-primary-container text-white shadow-sm'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Sticky Apply Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface/95 backdrop-blur-md border-t border-outline-variant/30 z-30">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          <button
            type="button"
            onClick={goBack}
            className="py-3 px-5 rounded-xl bg-surface-container text-on-surface font-bold text-xs hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-3 px-4 rounded-xl bg-primary-container text-white font-bold text-sm shadow-md hover:bg-primary transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Show {matchingCount} Properties</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
