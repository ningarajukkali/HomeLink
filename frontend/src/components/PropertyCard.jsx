import React, { useState, memo } from 'react';
import { useApp } from '../context/AppContext';
import DemoBadge from './DemoBadge';
import AvailabilityBadge from './AvailabilityBadge';

function PropertyCard({ property }) {
  const {
    navigate,
    isPropertySaved,
    toggleSaveProperty,
    isPropertyInCompare,
    addToCompare,
    removeFromCompare
  } = useApp();
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  const saved = isPropertySaved(property.id);
  const inCompare = isPropertyInCompare(property.id);

  const handleToggleCompare = (e) => {
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(property.id);
    } else {
      addToCompare(property.id);
    }
  };

  const handleNextImg = (e) => {
    e.stopPropagation();
    if (property.images && property.images.length > 1) {
      setCurrentImgIdx((prev) => (prev + 1) % property.images.length);
    }
  };

  const handlePrevImg = (e) => {
    e.stopPropagation();
    if (property.images && property.images.length > 1) {
      setCurrentImgIdx((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  return (
    <div
      onClick={() => navigate('rental-detail', { propertyId: property.id })}
      className="group bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/50 hover:border-primary-container/60 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Image Carousel Container */}
      <div className="relative aspect-[16/10] bg-surface-container-high overflow-hidden">
        <img
          src={property.images?.[currentImgIdx] || property.images?.[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Badges on top */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <DemoBadge variant="white" />
          <AvailabilityBadge status={property.availabilityStatus || 'available'} size="sm" />
          {property.isFeatured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/90 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
              <span className="material-symbols-outlined text-[12px]">star</span>
              Featured
            </span>
          )}
        </div>

        {/* Top-right Actions: Compare & Save */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {/* Compare button */}
          <button
            type="button"
            onClick={handleToggleCompare}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold backdrop-blur-md transition-all shadow-md cursor-pointer ${
              inCompare
                ? 'bg-[#00A88E] text-white ring-2 ring-white/50'
                : 'bg-black/45 hover:bg-black/65 text-white border border-white/20'
            }`}
            title={inCompare ? '✓ Added to Compare' : 'Add to Compare'}
          >
            <span className="material-symbols-outlined text-[15px] leading-none">
              {inCompare ? 'check' : 'compare_arrows'}
            </span>
            <span className="text-[11px] font-bold leading-none">
              {inCompare ? 'Added' : 'Compare'}
            </span>
          </button>

          {/* Save button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveProperty(property.id);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md cursor-pointer ${
              saved
                ? 'bg-rose-500 text-white'
                : 'bg-black/45 hover:bg-black/65 text-white border border-white/20'
            }`}
            title={saved ? 'Remove from saved' : 'Save property'}
          >
            <span className={`material-symbols-outlined text-lg leading-none ${saved ? 'fill-current' : ''}`}>
              favorite
            </span>
          </button>
        </div>

        {/* Carousel controls if multiple images */}
        {property.images && property.images.length > 1 && (
          <>
            <button
              onClick={handlePrevImg}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button
              onClick={handleNextImg}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
            <div className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold">
              {currentImgIdx + 1}/{property.images.length}
            </div>
          </>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Demo Tag & Brokerage */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <DemoBadge size="sm" />
              <span className="text-[11px] font-semibold text-outline">Demo Listing</span>
            </div>
            <span className="text-xs font-bold text-primary-container bg-surface-container px-2 py-0.5 rounded-md border border-primary-container/20">
              0% Brokerage
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1 mb-1.5">
            <span className="text-2xl font-extrabold text-on-surface tracking-tight">
              ₹{property.rent.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-semibold text-outline">/ month</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-base text-on-surface leading-snug line-clamp-1 group-hover:text-primary transition-colors">
            {property.title}
          </h3>

          {/* Locality */}
          <p className="flex items-center gap-1 text-xs text-outline font-medium mt-1">
            <span className="material-symbols-outlined text-[15px] text-primary-container">location_on</span>
            <span>{property.locality}</span>
          </p>

          {/* Key tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-[11px] font-semibold">
              {property.propertyType}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-[11px] font-semibold">
              {property.furnished}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-secondary-container/40 text-secondary text-[11px] font-semibold">
              Deposit: ₹{property.deposit.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Footer info & Direct contact button */}
        <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
              {property.owner?.name?.[0] || 'O'}
            </div>
            <span className="text-xs text-outline font-medium truncate max-w-[130px]" title={`${property.owner?.name} (Demo Host)`}>
              {property.owner?.name} <span className="text-[10px] text-outline/70">(Demo Host)</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-primary flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              View Details
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(PropertyCard);
