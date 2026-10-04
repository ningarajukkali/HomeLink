import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import DemoBadge from '../components/DemoBadge';
import DemoNoticeBanner from '../components/DemoNoticeBanner';
import AvailabilityBadge from '../components/AvailabilityBadge';
import MarkAsRentedModal from '../components/MarkAsRentedModal';

export default function OwnerDashboardView() {
  const { 
    properties, 
    currentUser, 
    navigate,
    markPropertyAsRented,
    pauseProperty,
    reactivateProperty,
    deleteProperty,
    updatePropertyStatus
  } = useApp();

  // State for modals
  const [rentedModalState, setRentedModalState] = useState({ isOpen: false, property: null });
  const [editModalProperty, setEditModalProperty] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', rent: 0 });

  // Get owner's properties (strictly for the logged in owner - no demo fallback for new users)
  const myProperties = properties.filter(p => {
    if (currentUser?.ownedPropertyIds?.length > 0) {
      return currentUser.ownedPropertyIds.includes(p.id);
    }
    if (currentUser?.isDemo) {
      return p.id === 'prop-1' || p.id === 'prop-2';
    }
    return false;
  });

  const activeStaysCount = myProperties.filter(p => (p.availabilityStatus || 'available') === 'available').length;
  const rentedStaysCount = myProperties.filter(p => p.availabilityStatus === 'rented').length;
  const pausedStaysCount = myProperties.filter(p => p.availabilityStatus === 'paused').length;
  const totalViewsCount = myProperties.length > 0 ? myProperties.reduce((acc, curr) => acc + (curr.viewsCount || 45), 0) : 0;
  const totalBrokerageSaved = myProperties.length > 0 ? myProperties.reduce((acc, curr) => acc + (curr.rent || 0), 0) : 0;

  const handleOpenRentedModal = (property) => {
    setRentedModalState({ isOpen: true, property });
  };

  const handleConfirmRented = () => {
    if (rentedModalState.property) {
      markPropertyAsRented(rentedModalState.property.id);
    }
    setRentedModalState({ isOpen: false, property: null });
  };

  const handleOpenEdit = (property) => {
    setEditModalProperty(property);
    setEditForm({
      title: property.title,
      rent: property.rent
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editModalProperty) return;
    // update property in state via updatePropertyStatus trick or custom edit
    editModalProperty.title = editForm.title;
    editModalProperty.rent = Number(editForm.rent);
    setEditModalProperty(null);
  };

  const handleDeleteListing = (property) => {
    if (window.confirm(`Are you sure you want to permanently delete "${property.title}"?`)) {
      deleteProperty(property.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-20 md:pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-fixed/40 text-primary text-xs font-bold mb-1">
            <span className="material-symbols-outlined text-[14px]">shield</span>
            <span>Host Portfolio • Availability System</span>
          </div>
          <h1 className="text-2xl font-black text-on-surface">Owner Dashboard</h1>
          <p className="text-xs text-outline font-medium">
            Manage your properties, availability status, and tenant inquiries in Rewa.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('list-property')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-container hover:bg-primary text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add_home</span>
            <span>Add Free Listing</span>
          </button>
        </div>
      </div>

      {/* Demo Notice Banner */}
      <DemoNoticeBanner />

      {/* 30-Day Activity & Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-outline">Total Views</span>
            <span className="material-symbols-outlined text-primary-container text-xl">visibility</span>
          </div>
          <div className="text-2xl font-black text-on-surface">{totalViewsCount}</div>
          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
            <span className="material-symbols-outlined text-xs">trending_up</span>
            {myProperties.length > 0 ? 'Across your listings' : '0 views'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-outline">Direct Leads</span>
            <span className="material-symbols-outlined text-secondary text-xl">chat</span>
          </div>
          <div className="text-2xl font-black text-on-surface">{myProperties.length > 0 ? myProperties.length * 3 : 0}</div>
          <span className="text-[10px] font-bold text-outline mt-0.5 block">
            Direct Calls & WhatsApp
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-outline">Active Stays</span>
            <span className="material-symbols-outlined text-primary-container text-xl">check_circle</span>
          </div>
          <div className="text-2xl font-black text-on-surface">{activeStaysCount}</div>
          <span className="text-[10px] font-bold text-emerald-600 mt-0.5 block">
            {rentedStaysCount} Rented / {myProperties.length} Total
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-outline">Brokerage Saved</span>
            <span className="material-symbols-outlined text-amber-500 text-xl">savings</span>
          </div>
          <div className="text-2xl font-black text-primary">₹{totalBrokerageSaved.toLocaleString('en-IN')}</div>
          <span className="text-[10px] font-bold text-outline mt-0.5 block">
            100% Free • 0 Brokerage
          </span>
        </div>
      </div>

      {/* Property Status Legend / Guide */}
      <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-extrabold text-on-surface flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary text-base">tune</span>
          Availability Status Guide:
        </span>
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-semibold text-outline">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <b>Available:</b> Visible in searches
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <b>Paused:</b> Temporarily hidden
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <b>Rented:</b> Inquiries closed
          </span>
        </div>
      </div>

      {/* Property Management Card */}
      <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/40 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-on-surface">My Properties</h2>
            <DemoBadge size="sm" />
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed/40 text-primary text-xs font-bold">
            {myProperties.length} Listings
          </span>
        </div>

        {myProperties.length === 0 ? (
          <div className="p-8 sm:p-10 text-center space-y-4 bg-gradient-to-br from-primary-fixed/20 via-surface-container-low to-surface-container rounded-3xl border-2 border-dashed border-primary-container/40">
            <div className="w-16 h-16 rounded-2xl bg-primary-container/10 text-primary-container flex items-center justify-center mx-auto shadow-xs">
              <span className="material-symbols-outlined text-4xl">home_work</span>
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-black text-on-surface">
                Welcome to your Host Dashboard{currentUser?.name ? `, ${currentUser.name}` : ''}!
              </h3>
              <p className="text-xs text-outline mt-1.5 leading-relaxed">
                Your dashboard is completely fresh and ready. You have 0 active properties listed. Add your first room or flat in Rewa to start getting direct tenant inquiries with 0% brokerage.
              </p>
            </div>
            <button
              onClick={() => navigate('list-property')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-container hover:bg-primary text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer hover:scale-[1.02]"
            >
              <span className="material-symbols-outlined text-base">add_home</span>
              <span>Add Your First Free Listing</span>
            </button>

            {/* 3 Quick Benefit Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-outline-variant/30 text-left">
              <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                <span className="text-xs font-black text-primary block mb-1">0% Brokerage</span>
                <p className="text-[11px] text-outline">Keep 100% of your rent without broker cuts or commissions.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                <span className="text-xs font-black text-emerald-700 block mb-1">Live Availability</span>
                <p className="text-[11px] text-outline">Mark as Rented or Pause anytime in 1 click once filled.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                <span className="text-xs font-black text-secondary block mb-1">Direct Leads</span>
                <p className="text-[11px] text-outline">Students & bachelors connect via verified phone & WhatsApp.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {myProperties.map((prop, index) => {
              const status = prop.availabilityStatus || 'available';
              const isAvailable = status === 'available';
              const isRented = status === 'rented';
              const isPaused = status === 'paused';

              return (
                <div 
                  key={prop.id}
                  className="flex flex-col md:flex-row gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 items-start md:items-center justify-between hover:border-outline-variant/70 transition-all"
                >
                  {/* Property Details */}
                  <div className="flex items-center gap-3.5 w-full md:w-auto">
                    <div className="relative shrink-0">
                      <img
                        src={prop.images?.[0]}
                        alt={prop.title}
                        className="w-24 h-20 rounded-xl object-cover"
                      />
                      <div className="absolute top-1 left-1">
                        <DemoBadge size="sm" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                          Property {String.fromCharCode(65 + index)}
                        </span>
                        <AvailabilityBadge status={status} size="sm" />
                        <span className="text-xs font-bold text-outline">• {prop.propertyType}</span>
                      </div>

                      <h3 className="font-bold text-sm text-on-surface line-clamp-1">
                        {prop.title}
                      </h3>

                      <p className="text-xs text-outline font-semibold">
                        ₹{prop.rent.toLocaleString()}/mo • {prop.locality}
                      </p>

                      {isRented && (
                        <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">visibility_off</span>
                          Hidden from search & new requests
                        </p>
                      )}

                      {isPaused && (
                        <p className="text-[11px] font-semibold text-amber-600 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">pause_circle</span>
                          Paused by owner • Temporarily hidden
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Availability Management Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-outline-variant/30">
                    {/* View Button */}
                    <button
                      onClick={() => navigate('rental-detail', { propertyId: prop.id })}
                      className="py-2 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface transition-colors cursor-pointer flex items-center gap-1"
                      title="View listing details"
                    >
                      <span className="material-symbols-outlined text-sm">visibility</span>
                      <span>View</span>
                    </button>

                    {/* Edit Button (Available properties) */}
                    {isAvailable && (
                      <button
                        onClick={() => handleOpenEdit(prop)}
                        className="py-2 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface transition-colors cursor-pointer flex items-center gap-1"
                        title="Edit property details"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                        <span>Edit</span>
                      </button>
                    )}

                    {/* Pause Button (if Available) */}
                    {isAvailable && (
                      <button
                        onClick={() => pauseProperty(prop.id)}
                        className="py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 border border-amber-500/20"
                        title="Hide listing temporarily"
                      >
                        <span className="material-symbols-outlined text-sm">pause</span>
                        <span>Pause</span>
                      </button>
                    )}

                    {/* Reactivate Listing Button (if Rented or Paused) */}
                    {(isRented || isPaused) && (
                      <button
                        onClick={() => reactivateProperty(prop.id)}
                        className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
                        title="Make property available in search results again"
                      >
                        <span className="material-symbols-outlined text-sm">replay</span>
                        <span>Reactivate Listing</span>
                      </button>
                    )}

                    {/* Mark as Rented Button (if Available or Paused) */}
                    {!isRented && (
                      <button
                        onClick={() => handleOpenRentedModal(prop)}
                        className="py-2 px-3.5 rounded-xl bg-rose-600/10 hover:bg-rose-600 text-rose-700 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border border-rose-600/20"
                        title="Mark property as rented"
                      >
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        <span>Mark as Rented</span>
                      </button>
                    )}

                    {/* Permanent Delete Button */}
                    <button
                      onClick={() => handleDeleteListing(prop)}
                      className="p-2 rounded-xl text-outline hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Permanently remove listing"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tenant Lead Feed */}
      <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/40 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-on-surface">Recent Tenant Inquiries & Chats</h2>
          <span className="text-[11px] font-semibold text-outline">Historical logs preserved</span>
        </div>

        <div className="space-y-3">
          {[
            { name: 'Saurabh Dwivedi', purpose: 'APSU Student (M.A History)', time: '20 mins ago', phone: '+91 97520 •••••', prop: 'Modern 2BHK Flat' },
            { name: 'Dr. Neha Verma', purpose: 'Medical Resident at SSMC', time: '2 hours ago', phone: '+91 91312 •••••', prop: 'Student Room near SSMC' },
            { name: 'Rajesh Mishra', purpose: 'Bank Clerk, SBI Kalan', time: 'Yesterday', phone: '+91 94251 •••••', prop: 'Modern 2BHK Flat' }
          ].map((lead, idx) => (
            <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container/50 border border-outline-variant/20 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary font-bold flex items-center justify-center">
                  {lead.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-on-surface">{lead.name}</h4>
                    <span className="text-[10px] text-primary font-semibold">for {lead.prop}</span>
                  </div>
                  <p className="text-[11px] text-outline">{lead.purpose} • {lead.time}</p>
                </div>
              </div>
              <button
                onClick={() => alert(`Direct tenant connection opened for ${lead.name} (${lead.phone}).`)}
                className="px-3 py-1.5 rounded-lg bg-primary-container text-white font-bold hover:bg-primary transition-colors cursor-pointer"
              >
                Contact
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal when owner marks as rented */}
      <MarkAsRentedModal
        isOpen={rentedModalState.isOpen}
        propertyTitle={rentedModalState.property?.title}
        onClose={() => setRentedModalState({ isOpen: false, property: null })}
        onConfirm={handleConfirmRented}
      />

      {/* Quick Edit Modal */}
      {editModalProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-4 border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-on-surface">Edit Listing Details</h3>
              <button 
                onClick={() => setEditModalProperty(null)}
                className="p-1 rounded-full text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-on-surface mb-1">Property Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low font-medium text-on-surface focus:outline-primary"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Monthly Rent (₹)</label>
                <input
                  type="number"
                  value={editForm.rent}
                  onChange={(e) => setEditForm(prev => ({ ...prev, rent: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low font-medium text-on-surface focus:outline-primary"
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalProperty(null)}
                  className="flex-1 py-2.5 rounded-xl bg-surface-container font-bold text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-primary-container text-white font-bold hover:bg-primary transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
