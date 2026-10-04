import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import PropertyCard from '../components/PropertyCard';
import RoommateCard from '../components/RoommateCard';
import DemoNoticeBanner from '../components/DemoNoticeBanner';

export default function SavedView() {
  const {
    properties,
    roommates,
    savedPropertyIds,
    savedRoommateIds,
    navigate,
    goBack
  } = useApp();

  const [activeTab, setActiveTab] = useState('properties'); // 'properties' | 'people'

  const savedProperties = properties.filter(p => savedPropertyIds.includes(p.id));
  const savedPeople = roommates.filter(r => savedRoommateIds.includes(r.id));

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 pb-24 md:pb-12">
      {/* Header matching Stitch 71192c85c6a24b94be6a22f7217ec334 */}
      <div className="flex items-center gap-3 pb-3 border-b border-outline-variant/30">
        <button
          onClick={goBack}
          className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-on-surface">Saved Items</h1>
          <p className="text-xs text-outline font-medium">Bookmarked stays & flatmates in Rewa</p>
        </div>
      </div>

      {/* Demo Notice */}
      <DemoNoticeBanner />

      {/* Tabs */}
      <div className="flex max-w-sm rounded-2xl bg-surface-container p-1 text-xs font-extrabold">
        <button
          onClick={() => setActiveTab('properties')}
          className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'properties'
              ? 'bg-surface-container-lowest text-primary shadow-sm'
              : 'text-outline hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-base">apartment</span>
          <span>Properties ({savedProperties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('people')}
          className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'people'
              ? 'bg-surface-container-lowest text-primary shadow-sm'
              : 'text-outline hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-base">group</span>
          <span>People ({savedPeople.length})</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'properties' && (
        savedProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.map(p => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-surface-container-lowest rounded-3xl border border-outline-variant/30 max-w-md mx-auto">
            <span className="material-symbols-outlined text-4xl text-outline mb-2">bookmark_border</span>
            <h3 className="font-extrabold text-base text-on-surface">No saved properties yet</h3>
            <p className="text-xs text-outline mt-1 mb-4">
              Tap the heart icon on any rental in Rewa to save it here for quick access.
            </p>
            <button
              onClick={() => navigate('rentals')}
              className="px-4 py-2 rounded-xl bg-primary-container text-white text-xs font-bold hover:bg-primary transition-colors cursor-pointer"
            >
              Explore Rentals
            </button>
          </div>
        )
      )}

      {activeTab === 'people' && (
        savedPeople.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {savedPeople.map(rm => (
              <RoommateCard key={rm.id} roommate={rm} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-surface-container-lowest rounded-3xl border border-outline-variant/30 max-w-md mx-auto">
            <span className="material-symbols-outlined text-4xl text-outline mb-2">person_add_disabled</span>
            <h3 className="font-extrabold text-base text-on-surface">No saved roommates yet</h3>
            <p className="text-xs text-outline mt-1 mb-4">
              Bookmark flatmate seekers to compare preferences and start connections later.
            </p>
            <button
              onClick={() => navigate('roommates')}
              className="px-4 py-2 rounded-xl bg-secondary text-white text-xs font-bold hover:bg-secondary/90 transition-colors cursor-pointer"
            >
              Explore Roommates
            </button>
          </div>
        )
      )}
    </div>
  );
}
