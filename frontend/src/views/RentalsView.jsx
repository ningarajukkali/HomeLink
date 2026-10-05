import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import PropertyCard from '../components/PropertyCard';
import AISearchBar from '../components/AISearchBar';
import DemoBadge from '../components/DemoBadge';
import DemoNoticeBanner from '../components/DemoNoticeBanner';

export default function RentalsView() {
  const {
    properties,
    rentalFilters,
    setRentalFilters,
    navigate,
    selectedCity,
    changeCity,
    CITIES,
    userLocation,
    detectLocation
  } = useApp();

  const [isMapView, setIsMapView] = useState(false);

  // Property types chips
  const propertyTypes = ['All', 'Room', 'PG', '1 BHK', '2 BHK', 'House'];

  // Memoized Filter properties
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // City Filter
      if (selectedCity && selectedCity !== 'All Cities') {
        const target = selectedCity.toLowerCase().replace(' ncr', '');
        const pCity = (p.city || '').toLowerCase();
        const pLoc = (p.locality || '').toLowerCase();
        const pTitle = (p.title || '').toLowerCase();

        const isCityMatch =
          pCity === selectedCity.toLowerCase() ||
          pCity.includes(target) ||
          pLoc.includes(target) ||
          pTitle.includes(target);

        if (!isCityMatch) return false;
      }

      // Search query matching (supports normal keywords & natural language descriptions)
      if (rentalFilters.searchQuery && rentalFilters.searchQuery.trim()) {
        const q = rentalFilters.searchQuery.toLowerCase().trim();
        const combined = `${p.title} ${p.locality} ${p.description} ${p.propertyType} ${p.amenities?.join(' ') || ''}`.toLowerCase();
        
        let isMatch = combined.includes(q);

        if (!isMatch) {
          // Price constraint parsing (e.g. "under 5000", "under ₹5,000")
          const priceMatch = q.match(/under\s*(?:₹|rs\.?|inr)?\s*(\d+[\d,]*)/i);
          if (priceMatch) {
            const maxPrice = parseInt(priceMatch[1].replace(/,/g, ''), 10);
            if (p.rent > maxPrice) return false;
          }

          const stopWords = new Set(['try:', 'try', 'find', 'me', 'a', 'an', 'the', 'near', 'in', 'at', 'with', 'for', 'to', 'of', 'and', 'or', 'i', 'need', 'show', 'under', 'my']);
          const tokens = q
            .replace(/[^\w\s₹]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 1 && !stopWords.has(w) && !/^\d+$/.test(w));

          if (tokens.length > 0) {
            const matchCount = tokens.filter(t => combined.includes(t)).length;
            isMatch = matchCount > 0;
          } else {
            isMatch = true;
          }
        }

        if (!isMatch) return false;
      }

      // Property Type
      if (rentalFilters.propertyTypes && rentalFilters.propertyTypes.length > 0) {
        if (!rentalFilters.propertyTypes.includes('All') && !rentalFilters.propertyTypes.includes(p.propertyType)) {
          return false;
        }
      }

      // Rent
      if (p.rent < rentalFilters.minRent || p.rent > rentalFilters.maxRent) {
        return false;
      }

      // Furnishing
      if (rentalFilters.furnishing !== 'All') {
        if (p.furnished !== rentalFilters.furnishing) return false;
      }

      // Availability Management: Only listings with 🟢 Available appear in normal rental search
      if (p.availabilityStatus && p.availabilityStatus !== 'available') {
        return false;
      }

      return true;
    });
  }, [properties, rentalFilters, selectedCity]);

  // Memoized Sorting
  const sortedProperties = useMemo(() => {
    return [...filteredProperties].sort((a, b) => {
      if (rentalFilters.sortBy === 'rent_low') return a.rent - b.rent;
      if (rentalFilters.sortBy === 'rent_high') return b.rent - a.rent;
      if (rentalFilters.sortBy === 'rating') return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [filteredProperties, rentalFilters.sortBy]);

  const handleTypeToggle = (type) => {
    if (type === 'All') {
      setRentalFilters(prev => ({ ...prev, propertyTypes: ['All'] }));
      return;
    }

    setRentalFilters(prev => {
      let current = prev.propertyTypes.filter(t => t !== 'All');
      if (current.includes(type)) {
        current = current.filter(t => t !== type);
        if (current.length === 0) current = ['All'];
      } else {
        current = [...current, type];
      }
      return { ...prev, propertyTypes: current };
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 pb-20 md:pb-12">
      {/* Header AI Search Bar */}
      <AISearchBar
        value={rentalFilters.searchQuery}
        onChange={(e) => setRentalFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
        onClear={() => setRentalFilters(prev => ({ ...prev, searchQuery: '' }))}
        aiLabel="Ask HomeLink"
        placeholderExamples={[
          'Try: furnished room near university under ₹5,000…',
          'Find a room near my college under ₹5,000',
          'Show PGs with Wi-Fi for a female student',
          'Find a furnished room near the railway station',
          'I need a room for two people under ₹8,000'
        ]}
        actions={
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => navigate('rental-filters')}
              className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-[#131b2e] transition-colors cursor-pointer"
              title="Filters"
            >
              <span className="material-symbols-outlined text-base text-[#00A88E]">tune</span>
              <span className="hidden sm:inline">Filters</span>
            </button>

            <button
              type="button"
              onClick={() => setIsMapView(!isMapView)}
              className={`flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isMapView
                  ? 'bg-[#00A88E] text-white shadow-sm'
                  : 'bg-surface-container hover:bg-surface-container-high text-[#131b2e]'
              }`}
              title={isMapView ? 'Switch to List' : 'Switch to Map'}
            >
              <span className="material-symbols-outlined text-base">
                {isMapView ? 'view_list' : 'map'}
              </span>
              <span className="hidden sm:inline">{isMapView ? 'List' : 'Map'}</span>
            </button>
          </div>
        }
        suggestions={[
          'Furnished room near APSU under ₹5,000',
          'Girls PG with Wi-Fi',
          '2 BHK in Civil Lines',
          'Near Railway Station'
        ]}
        onSelectSuggestion={(prompt) => {
          setRentalFilters(prev => ({ ...prev, searchQuery: prompt }));
        }}
      />

      {/* Demo Notice Banner */}
      <DemoNoticeBanner />

      {/* Quick City Selector Chips with Live GPS Auto-Detect */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
        <span className="text-[11px] font-bold text-outline uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
          <span className="material-symbols-outlined text-sm text-primary">location_on</span>
          City:
        </span>

        {/* Live GPS Auto-Detect Button */}
        <button
          onClick={detectLocation}
          disabled={userLocation?.isDetecting}
          className={`px-3 py-1.5 rounded-full text-xs font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 border shadow-2xs active:scale-95 ${
            userLocation?.detected
              ? 'bg-emerald-500/15 text-emerald-800 border-emerald-500/30'
              : 'bg-primary-container/10 hover:bg-primary-container/20 text-primary border-primary-container/30'
          }`}
          title="Click to detect your live location via GPS"
        >
          <span className={`material-symbols-outlined text-sm ${userLocation?.isDetecting ? 'animate-spin' : ''}`}>
            {userLocation?.isDetecting ? 'progress_activity' : (userLocation?.detected ? 'my_location' : 'near_me')}
          </span>
          <span>
            {userLocation?.isDetecting 
              ? 'Locating...' 
              : (userLocation?.detected ? `Near ${userLocation.locality}` : 'Auto-Detect GPS')}
          </span>
        </button>

        {CITIES?.map((city) => {
          const isSelected = selectedCity === city.id || (!selectedCity && city.id === 'All Cities');
          return (
            <button
              key={city.id}
              onClick={() => changeCity(city.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-secondary text-white shadow-sm ring-2 ring-secondary/20'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-outline-variant/40'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white animate-pulse' : 'bg-outline/40'}`} />
              <span>{city.badge || city.name}</span>
            </button>
          );
        })}
      </div>

      {/* Nearby Places & Local Living Essentials Spotlight */}
      {userLocation?.detected && userLocation?.nearbyPlaces && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-primary-container/10 via-surface-container to-surface-container border border-primary-container/20 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container text-lg">explore</span>
              <h4 className="text-xs font-black text-on-surface">
                Nearby Essentials & Places around <span className="text-primary">{userLocation.locality}</span>
              </h4>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700">
              Live GPS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1 text-xs">
            {/* Gym */}
            {userLocation.nearbyPlaces.gyms?.[0] && (
              <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex items-start gap-2 shadow-2xs">
                <span className="text-base shrink-0">🏋️</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs truncate">{userLocation.nearbyPlaces.gyms[0].name}</span>
                    <span className="text-[10px] text-outline shrink-0 ml-1">{userLocation.nearbyPlaces.gyms[0].distance}</span>
                  </div>
                  <p className="text-[10.5px] text-primary font-bold mt-0.5">{userLocation.nearbyPlaces.gyms[0].price}</p>
                </div>
              </div>
            )}

            {/* Barber */}
            {userLocation.nearbyPlaces.barbers?.[0] && (
              <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex items-start gap-2 shadow-2xs">
                <span className="text-base shrink-0">💈</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs truncate">{userLocation.nearbyPlaces.barbers[0].name}</span>
                    <span className="text-[10px] text-outline shrink-0 ml-1">{userLocation.nearbyPlaces.barbers[0].distance}</span>
                  </div>
                  <p className="text-[10.5px] text-primary font-bold mt-0.5">{userLocation.nearbyPlaces.barbers[0].price}</p>
                </div>
              </div>
            )}

            {/* Food / Tiffin */}
            {userLocation.nearbyPlaces.food?.[0] && (
              <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex items-start gap-2 shadow-2xs">
                <span className="text-base shrink-0">🍲</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs truncate">{userLocation.nearbyPlaces.food[0].name}</span>
                    <span className="text-[10px] text-outline shrink-0 ml-1">{userLocation.nearbyPlaces.food[0].distance}</span>
                  </div>
                  <p className="text-[10.5px] text-primary font-bold mt-0.5">{userLocation.nearbyPlaces.food[0].price}</p>
                </div>
              </div>
            )}

            {/* Transit */}
            {userLocation.nearbyPlaces.transit?.[0] && (
              <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex items-start gap-2 shadow-2xs">
                <span className="text-base shrink-0">🚇</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs truncate">{userLocation.nearbyPlaces.transit[0].name}</span>
                    <span className="text-[10px] text-outline shrink-0 ml-1">{userLocation.nearbyPlaces.transit[0].distance}</span>
                  </div>
                  <p className="text-[10.5px] text-outline font-semibold mt-0.5">{userLocation.nearbyPlaces.transit[0].type}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Property Type Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
        <span className="text-[11px] font-bold text-outline uppercase tracking-wider shrink-0 mr-1">
          Type:
        </span>
        {propertyTypes.map((type) => {
          const isSelected = rentalFilters.propertyTypes.includes(type) || 
            (type === 'All' && rentalFilters.propertyTypes.includes('All'));

          return (
            <button
              key={type}
              onClick={() => handleTypeToggle(type)}
              className={`px-4 py-2 rounded-full text-xs font-extrabold shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-primary-container text-white shadow-sm shadow-primary-container/20'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
              }`}
            >
              {type}
            </button>
          );
        })}
      </div>

      {/* Filter Summary & Sorting Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <span className="text-base font-extrabold text-on-surface">
            {sortedProperties.length} Properties in {selectedCity === 'All Cities' ? 'All Locations' : selectedCity}
          </span>
          <DemoBadge size="sm" />
          <span className="text-xs font-bold text-primary-container bg-surface-container px-2 py-0.5 rounded-full border border-primary-container/20">
            0% Brokerage
          </span>
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-outline">Sort by:</span>
          <select
            value={rentalFilters.sortBy}
            onChange={(e) => setRentalFilters(prev => ({ ...prev, sortBy: e.target.value }))}
            className="px-3 py-1.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs font-bold text-on-surface focus:outline-none focus:border-primary-container"
          >
            <option value="recommended">Recommended & Featured</option>
            <option value="rent_low">Rent: Low to High</option>
            <option value="rent_high">Rent: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Map View Simulation */}
      {isMapView && (
        <div className="relative w-full h-80 rounded-3xl overflow-hidden border border-outline-variant/50 bg-surface-container-high flex items-center justify-center p-6 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(#00a88e_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
          <div className="relative z-10 max-w-sm bg-surface-container-lowest/90 backdrop-blur-md p-5 rounded-2xl border border-primary-container/30 shadow-xl">
            <span className="material-symbols-outlined text-4xl text-primary-container mb-2">
              explore
            </span>
            <h4 className="font-extrabold text-sm text-on-surface">
              Interactive Map of Rewa Localities
            </h4>
            <p className="text-xs text-outline mt-1 mb-3">
              Pins show verified listings across University Area, Civil Lines, Bodhaghat, and Dhekaha.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-primary text-[11px] font-bold">
                APSU Gate (12)
              </span>
              <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface text-[11px] font-bold">
                Civil Lines (18)
              </span>
              <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface text-[11px] font-bold">
                Bodhaghat (8)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Properties Grid */}
      {sortedProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/40 p-12 text-center max-w-md mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-surface-container text-outline flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl">filter_alt_off</span>
          </div>
          <h3 className="font-extrabold text-base text-on-surface">
            No properties found
          </h3>
          <p className="text-xs text-outline mt-1 mb-5">
            Try adjusting your rent range or clear locality filters to see more verified stays in {selectedCity === 'All Cities' ? 'all cities' : selectedCity}.
          </p>
          <button
            onClick={() => setRentalFilters({
              searchQuery: '',
              locality: 'All Rewa',
              propertyTypes: ['All'],
              minRent: 2000,
              maxRent: 20000,
              furnishing: 'All',
              preferredTenant: 'All',
              sortBy: 'recommended'
            })}
            className="px-4 py-2.5 rounded-xl bg-primary-container text-white text-xs font-bold hover:bg-primary transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
