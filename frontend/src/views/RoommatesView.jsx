import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import RoommateCard from '../components/RoommateCard';
import AISearchBar from '../components/AISearchBar';
import DemoBadge from '../components/DemoBadge';
import DemoNoticeBanner from '../components/DemoNoticeBanner';
import AvailabilityBadge from '../components/AvailabilityBadge';
import RoommateFoundModal from '../components/RoommateFoundModal';

export default function RoommatesView() {
  const {
    roommates,
    roommateFilters,
    setRoommateFilters,
    currentUser,
    updateCurrentUserRoommateStatus,
    navigate,
    selectedCity
  } = useApp();

  const [dietFilter, setDietFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentRoommateStatus = currentUser?.roommateStatus || 'looking_for_room';
  const currentRoommateType = currentUser?.roommateType || (currentRoommateStatus === 'looking_for_roommate' || currentRoommateStatus === 'roommate_found' ? 'looking_for_roommate' : 'looking_for_room');

  const isLookingForRoommate = currentRoommateType === 'looking_for_roommate';
  const isFound = currentRoommateStatus === 'roommate_found' || currentRoommateStatus === 'found_a_room';

  const handleConfirmFound = () => {
    if (isLookingForRoommate) {
      updateCurrentUserRoommateStatus('roommate_found', 'looking_for_roommate');
    } else {
      updateCurrentUserRoommateStatus('found_a_room', 'looking_for_room');
    }
    setIsModalOpen(false);
  };

  const handleStartLookingAgain = () => {
    if (isLookingForRoommate) {
      updateCurrentUserRoommateStatus('looking_for_roommate', 'looking_for_roommate');
    } else {
      updateCurrentUserRoommateStatus('looking_for_room', 'looking_for_room');
    }
  };

  // Memoized Filter roommate discovery: Only active seekers appear
  const filteredRoommates = useMemo(() => {
    return roommates.filter(rm => {
      // Availability Management: Only profiles with active status appear in roommate discovery
      const isActive = rm.availabilityStatus === 'looking_for_room' || 
                       rm.availabilityStatus === 'looking_for_roommate' || 
                       !rm.availabilityStatus;
      if (!isActive) return false;

      // City Filter
      if (selectedCity && selectedCity !== 'All Cities') {
        const cityLower = selectedCity.toLowerCase().replace(' ncr', '');
        const rmLoc = (rm.location || '').toLowerCase();
        
        let matchesCity = rmLoc.includes(cityLower);
        if (!matchesCity) {
          if (cityLower.includes('delhi')) matchesCity = rmLoc.includes('delhi') || rmLoc.includes('noida') || rmLoc.includes('gurgaon');
          else if (cityLower.includes('bangalore')) matchesCity = rmLoc.includes('bangalore') || rmLoc.includes('bengaluru') || rmLoc.includes('koramangala') || rmLoc.includes('hsr') || rmLoc.includes('indiranagar');
          else if (cityLower.includes('mumbai')) matchesCity = rmLoc.includes('mumbai') || rmLoc.includes('bandra') || rmLoc.includes('andheri') || rmLoc.includes('powai');
          else if (cityLower.includes('hyderabad')) matchesCity = rmLoc.includes('hyderabad') || rmLoc.includes('gachibowli') || rmLoc.includes('hitec') || rmLoc.includes('kondapur');
          else if (cityLower.includes('rewa')) matchesCity = rmLoc.includes('rewa') || rmLoc.includes('apsu') || rmLoc.includes('civil lines');
          else if (cityLower.includes('other')) matchesCity = !rmLoc.includes('delhi') && !rmLoc.includes('bangalore') && !rmLoc.includes('mumbai') && !rmLoc.includes('hyderabad') && !rmLoc.includes('rewa');
        }

        if (!matchesCity) return false;
      }

      if (roommateFilters.searchQuery && roommateFilters.searchQuery.trim()) {
        const q = roommateFilters.searchQuery.toLowerCase().trim();
        const combined = `${rm.name} ${rm.occupation} ${rm.location} ${rm.lookingFor || ''} ${rm.bio || ''} ${rm.diet || ''} ${rm.habits?.join(' ') || ''}`.toLowerCase();
        
        let isMatch = combined.includes(q);

        if (!isMatch) {
          const stopWords = new Set(['find', 'me', 'a', 'an', 'the', 'near', 'in', 'at', 'with', 'for', 'to', 'of', 'and', 'or', 'i', 'need', 'show', 'under', 'my', 'looking']);
          const tokens = q
            .replace(/[^\w\s₹]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 1 && !stopWords.has(w));

          if (tokens.length > 0) {
            const matchCount = tokens.filter(t => combined.includes(t)).length;
            isMatch = matchCount > 0;
          } else {
            isMatch = true;
          }
        }

        if (!isMatch) return false;
      }

      if (dietFilter !== 'All') {
        if (!rm.diet.toLowerCase().includes(dietFilter.toLowerCase())) return false;
      }

      return true;
    });
  }, [roommates, roommateFilters, dietFilter, selectedCity]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 pb-24 md:pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-secondary/15 via-secondary-container/20 to-transparent p-6 rounded-3xl border border-secondary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold mb-1.5">
            <span className="material-symbols-outlined text-[14px]">handshake</span>
            <span>Roommate Match • {selectedCity === 'All Cities' ? 'All Locations' : selectedCity}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-on-surface">
            Find Your Ideal Flatmate
          </h1>
          <p className="text-xs text-outline font-medium mt-1">
            Connect with student and professional flatmate seekers. Direct chat unlocks only after mutual approval.
          </p>
        </div>

        <button
          onClick={() => navigate('roommate-requests')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-xs font-bold text-on-surface border border-outline-variant/40 shadow-sm transition-all cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-lg text-secondary">inbox</span>
          <span>Requests & Connections</span>
        </button>
      </div>

      {/* Demo Notice Banner */}
      <DemoNoticeBanner message="These roommate profiles are for demonstration purposes. Real seekers will appear after HomeLink launches." />

      {/* My Availability Status Bar for Quick Toggle */}
      <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary-container/40 text-secondary flex items-center justify-center font-bold shrink-0">
            <span className="material-symbols-outlined text-2xl">person_pin</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-on-surface">Your Roommate Status:</span>
              <AvailabilityBadge status={currentRoommateStatus} size="sm" />
            </div>
            <p className="text-[11px] text-outline mt-0.5">
              {isFound 
                ? 'Your profile is hidden from discovery. You will not receive new roommate requests.' 
                : 'Your profile is active and discoverable by flatmate seekers in Rewa.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {!isFound ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="py-1.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-700 hover:text-white border border-rose-500/20 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">check_circle</span>
              <span>{isLookingForRoommate ? 'Roommate Found' : 'Found a Room'}</span>
            </button>
          ) : (
            <button
              onClick={handleStartLookingAgain}
              className="py-1.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">restart_alt</span>
              <span>Start Looking Again</span>
            </button>
          )}

          <button
            onClick={() => navigate('profile')}
            className="py-1.5 px-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-outline hover:text-on-surface transition-colors cursor-pointer"
            title="Configure profile preferences"
          >
            <span className="material-symbols-outlined text-base">settings</span>
          </button>
        </div>
      </div>

      {/* AI Search and Diet Filters */}
      <div className="space-y-3">
        <AISearchBar
          value={roommateFilters.searchQuery}
          onChange={(e) => setRoommateFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
          onClear={() => setRoommateFilters(prev => ({ ...prev, searchQuery: '' }))}
          aiLabel="Ask HomeLink"
          placeholderExamples={[
            'Find a roommate near SSMC medical college',
            'Show female flatmate in Civil Lines with Wi-Fi',
            'Looking for flatmate near APSU under ₹3,500',
            'I need a roommate for 2 BHK near Collectorate'
          ]}
          suggestions={[
            'Female roommate in Civil Lines',
            'SSMC medical intern',
            'REC Rewa student',
            'Vegetarian flatmate'
          ]}
          onSelectSuggestion={(prompt) => {
            setRoommateFilters(prev => ({ ...prev, searchQuery: prompt }));
          }}
        />

        {/* Diet Filter Chips */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pt-1">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-bold text-outline uppercase tracking-wider mr-1">Diet:</span>
            {['All', 'Vegetarian', 'Non-Vegetarian'].map((diet) => (
              <button
                key={diet}
                onClick={() => setDietFilter(diet)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  dietFilter === diet
                    ? 'bg-secondary text-white shadow-sm'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {diet}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Seekers Counter */}
      <div className="flex items-center justify-between text-xs font-bold text-outline">
        <div className="flex items-center gap-2">
          <span>{filteredRoommates.length} Active Seekers in {selectedCity === 'All Cities' ? 'All Locations' : selectedCity}</span>
          <DemoBadge size="sm" />
        </div>
        <span>Demo Profiles</span>
      </div>

      {/* Grid of Seekers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRoommates.map((rm) => (
          <RoommateCard key={rm.id} roommate={rm} />
        ))}
      </div>

      {/* Confirmation Modal */}
      <RoommateFoundModal
        isOpen={isModalOpen}
        roommateType={currentRoommateType}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmFound}
      />
    </div>
  );
}
