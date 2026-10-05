import React from 'react';
import { useApp } from '../context/AppContext';
import PropertyCard from '../components/PropertyCard';
import RoommateCard from '../components/RoommateCard';
import AISearchBar from '../components/AISearchBar';
import DemoBadge from '../components/DemoBadge';
import DemoNoticeBanner from '../components/DemoNoticeBanner';

export default function DashboardView() {
  const {
    currentUser,
    properties,
    roommates,
    navigate,
    rentalFilters,
    setRentalFilters
  } = useApp();

  const featuredProperties = properties
    .filter((p) => p.isFeatured && (p.availabilityStatus === 'available' || !p.availabilityStatus))
    .slice(0, 3);
  const activeRoommates = roommates
    .filter((rm) => (rm.availabilityStatus === 'looking_for_room' || rm.availabilityStatus === 'looking_for_roommate' || !rm.availabilityStatus))
    .slice(0, 2);

  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    navigate('rentals');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 pb-20 md:pb-12">
      {/* Greeting Banner & Location Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-primary/10 via-primary-container/10 to-transparent p-6 rounded-3xl border border-primary-container/20">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xl">👋</span>
            <span className="text-sm font-bold text-outline">Good day,</span>
            <span className="text-base font-extrabold text-on-surface">{currentUser.name}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-container/20 text-primary-container border border-primary-container/30 text-[10px] font-extrabold uppercase tracking-wide">
              🎓 Student / Parent Dashboard
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">
            Explore Housing in <span className="text-primary-container">Rewa</span>
          </h1>
          <p className="text-xs text-outline font-medium mt-1">
            Zero brokerage, direct contact with owners & flatmates (Demo Preview).
          </p>
        </div>

        {/* Live Safety Status Strip matching Stitch */}
        <div className="flex items-center gap-3 bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/40 shadow-sm shrink-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">shield</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-on-surface">Rewa SafeNet</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <span className="text-[11px] font-semibold text-outline">
              Demo Environment
            </span>
          </div>
        </div>
      </div>

      {/* Demo Notice Banner */}
      <DemoNoticeBanner />

      {/* AI-Powered Search Bar */}
      <div className="relative">
        <AISearchBar
          value={rentalFilters.searchQuery}
          onChange={(e) => setRentalFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
          onSubmit={handleSearchSubmit}
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
            <button
              type="button"
              onClick={() => navigate('rental-filters')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-[#131b2e] text-xs font-bold transition-colors cursor-pointer shrink-0"
              title="Filter preferences"
            >
              <span className="material-symbols-outlined text-base text-[#00A88E]">tune</span>
              <span className="hidden sm:inline">Filters</span>
            </button>
          }
          suggestions={[
            'Furnished room near university under ₹5,000',
            'Show PGs with Wi-Fi for a female student',
            'Find a furnished room near railway station',
            'Room for two people under ₹8,000'
          ]}
          onSelectSuggestion={(prompt) => {
            setRentalFilters(prev => ({ ...prev, searchQuery: prompt }));
            navigate('rentals');
          }}
        />
      </div>

      {/* 4 Feature Hub Grid matching Stitch Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <button
          onClick={() => navigate('rentals')}
          className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 hover:border-primary-container shadow-sm hover:shadow-md transition-all text-left cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-primary-container/10 text-primary-container flex items-center justify-center mb-3 group-hover:bg-primary-container group-hover:text-white transition-all">
            <span className="material-symbols-outlined text-2xl">apartment</span>
          </div>
          <h3 className="font-extrabold text-sm text-on-surface group-hover:text-primary transition-colors">
            Find a Rental
          </h3>
          <p className="text-[11px] text-outline font-medium mt-0.5">
            42 Demo Listings
          </p>
        </button>

        <button
          onClick={() => navigate('roommates')}
          className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 hover:border-secondary transition-all shadow-sm hover:shadow-md text-left cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-secondary-container/40 text-secondary flex items-center justify-center mb-3 group-hover:bg-secondary group-hover:text-white transition-all">
            <span className="material-symbols-outlined text-2xl">group</span>
          </div>
          <h3 className="font-extrabold text-sm text-on-surface group-hover:text-secondary transition-colors">
            Find Roommates
          </h3>
          <p className="text-[11px] text-outline font-medium mt-0.5">
            48 Demo Seekers
          </p>
        </button>

        <button
          onClick={() => navigate('list-property')}
          className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 hover:border-primary transition-all shadow-sm hover:shadow-md text-left cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-all">
            <span className="material-symbols-outlined text-2xl">add_home</span>
          </div>
          <h3 className="font-extrabold text-sm text-on-surface group-hover:text-primary transition-colors">
            List Property
          </h3>
          <p className="text-[11px] text-outline font-medium mt-0.5">
            100% Free Listing
          </p>
        </button>

        <button
          onClick={() => navigate('safety')}
          className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 hover:border-emerald-600 transition-all shadow-sm hover:shadow-md text-left cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <span className="material-symbols-outlined text-2xl">verified_user</span>
          </div>
          <h3 className="font-extrabold text-sm text-on-surface group-hover:text-emerald-700 transition-colors">
            Trust & Safety
          </h3>
          <p className="text-[11px] text-outline font-medium mt-0.5">
            KYC & Anti-Brokerage
          </p>
        </button>
      </div>

      {/* Featured Properties Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-on-surface tracking-tight">
                Featured Stays in Rewa
              </h2>
              <DemoBadge size="sm" />
            </div>
            <p className="text-xs text-outline font-medium">
              Sample accommodations for demonstration purposes.
            </p>
          </div>
          <button
            onClick={() => navigate('rentals')}
            className="text-xs font-bold text-primary-container hover:text-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({properties.length})</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </div>

      {/* Active Roommate Seekers Section */}
      <div className="pt-4 border-t border-outline-variant/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-on-surface tracking-tight">
                Active Flatmate Seekers
              </h2>
              <DemoBadge size="sm" />
            </div>
            <p className="text-xs text-outline font-medium">
              Sample seeker profiles for demonstration purposes.
            </p>
          </div>
          <button
            onClick={() => navigate('roommates')}
            className="text-xs font-bold text-secondary hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Explore Roommates ({roommates.length})</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {activeRoommates.map((rm) => (
            <RoommateCard key={rm.id} roommate={rm} />
          ))}
        </div>
      </div>
    </div>
  );
}
