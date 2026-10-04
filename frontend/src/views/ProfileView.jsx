import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import AvailabilityBadge from '../components/AvailabilityBadge';
import RoommateFoundModal from '../components/RoommateFoundModal';
import DemoBadge from '../components/DemoBadge';

export default function ProfileView() {
  const {
    currentUser,
    setCurrentUser,
    updateCurrentUserRoommateStatus,
    navigate,
    goBack,
    setAuthModalOpen
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [nameVal, setNameVal] = useState(currentUser.name);
  const [roleVal, setRoleVal] = useState(currentUser.role);
  const [isRoommateModalOpen, setIsRoommateModalOpen] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setCurrentUser(prev => ({
      ...prev,
      name: nameVal,
      role: roleVal
    }));
    setIsEditing(false);
  };

  const currentRoommateStatus = currentUser.roommateStatus || 'looking_for_room';
  const currentRoommateType = currentUser.roommateType || (currentRoommateStatus === 'looking_for_roommate' || currentRoommateStatus === 'roommate_found' ? 'looking_for_roommate' : 'looking_for_room');

  const isLookingForRoommate = currentRoommateType === 'looking_for_roommate';
  const isFound = currentRoommateStatus === 'roommate_found' || currentRoommateStatus === 'found_a_room';

  const handleConfirmFound = () => {
    if (isLookingForRoommate) {
      updateCurrentUserRoommateStatus('roommate_found', 'looking_for_roommate');
    } else {
      updateCurrentUserRoommateStatus('found_a_room', 'looking_for_room');
    }
    setIsRoommateModalOpen(false);
  };

  const handleStartLookingAgain = () => {
    if (isLookingForRoommate) {
      updateCurrentUserRoommateStatus('looking_for_roommate', 'looking_for_roommate');
    } else {
      updateCurrentUserRoommateStatus('looking_for_room', 'looking_for_room');
    }
  };

  const handleSwitchType = (newType) => {
    if (newType === 'looking_for_roommate') {
      updateCurrentUserRoommateStatus('looking_for_roommate', 'looking_for_roommate');
    } else {
      updateCurrentUserRoommateStatus('looking_for_room', 'looking_for_room');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6 pb-24 md:pb-12">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <h1 className="text-xl font-extrabold text-on-surface">Profile & Settings</h1>
        </div>
      </div>

      {/* Main Profile Card matching Stitch 66abc73b61694842b6f1b036143eed59 */}
      <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/40 shadow-sm space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-black shadow-md">
                {currentUser.name[0]}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary-container text-white flex items-center justify-center shadow">
                <span className="material-symbols-outlined text-sm">verified</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-on-surface">{currentUser.name}</h2>
              <p className="text-xs font-semibold text-outline">
                {currentUser.role} • {currentUser.city}
              </p>
              <span className="text-[11px] text-outline font-medium">
                Joined HomeLink in {currentUser.memberSince}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface transition-colors cursor-pointer"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {isEditing && (
          <form onSubmit={handleSaveProfile} className="pt-3 border-t border-outline-variant/30 space-y-3">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Full Name</label>
              <input
                type="text"
                value={nameVal}
                onChange={(e) => setNameVal(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs font-bold bg-surface-container-low focus:border-primary-container focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Role</label>
              <select
                value={roleVal}
                onChange={(e) => setRoleVal(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs font-bold bg-surface-container-low focus:border-primary-container focus:outline-none"
              >
                <option>Renter & Seeker</option>
                <option>Property Owner / Host</option>
                <option>Student Seeker</option>
              </select>
            </div>
            <button
              type="submit"
              className="py-2 px-4 rounded-xl bg-primary-container text-white text-xs font-bold shadow hover:bg-primary transition-all cursor-pointer"
            >
              Save Changes
            </button>
          </form>
        )}
      </div>

      {/* Roommate Availability & Status Management Card */}
      <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/40 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-xl">group</span>
            <h3 className="font-extrabold text-sm text-on-surface">Roommate Profile Availability</h3>
          </div>
          <AvailabilityBadge status={currentRoommateStatus} size="sm" />
        </div>

        <p className="text-xs text-outline leading-relaxed">
          Manage whether your profile is actively discoverable by people looking for rooms or flatmates in Rewa.
        </p>

        {/* Mode selector */}
        <div className="p-1 rounded-2xl bg-surface-container-low flex items-center gap-1 text-xs font-bold">
          <button
            onClick={() => handleSwitchType('looking_for_room')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer text-center ${
              !isLookingForRoommate
                ? 'bg-white text-primary shadow-xs'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            I'm Looking for a Room
          </button>
          <button
            onClick={() => handleSwitchType('looking_for_roommate')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer text-center ${
              isLookingForRoommate
                ? 'bg-white text-secondary shadow-xs'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            I Have a Room & Need Roommate
          </button>
        </div>

        {/* Current Status Box */}
        <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-outline">Search Visibility:</span>
            <span className={`text-xs font-extrabold ${isFound ? 'text-rose-600' : 'text-emerald-700'}`}>
              {isFound ? '🔴 Hidden from Discovery' : '🟢 Active & Searchable'}
            </span>
          </div>

          <p className="text-[11px] text-outline">
            {isFound
              ? 'Your profile is currently hidden from roommate search results and recommendations. You will not receive new requests.'
              : 'Your profile appears in roommate search and suggestions for students and professionals across Rewa.'}
          </p>

          <div className="pt-2">
            {!isFound ? (
              <button
                onClick={() => setIsRoommateModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-700 hover:text-white border border-rose-500/20 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>{isLookingForRoommate ? 'Roommate Found' : 'Found a Room'}</span>
              </button>
            ) : (
              <button
                onClick={handleStartLookingAgain}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">restart_alt</span>
                <span>Start Looking Again</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Verification Strip matching Stitch */}
      <div className="bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/40 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container text-xl">shield</span>
            <h3 className="font-extrabold text-sm text-on-surface">Verification Credentials</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-extrabold">
            {currentUser.trustLevel}
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
              <div>
                <span className="font-bold text-on-surface block">Government / Student ID</span>
                <span className="text-[11px] text-outline">Verified by Rewa Field Coordinator</span>
              </div>
            </div>
            <span className="font-extrabold text-emerald-700">Approved</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
              <div>
                <span className="font-bold text-on-surface block">Phone Number</span>
                <span className="text-[11px] text-outline">{currentUser.phoneMasked}</span>
              </div>
            </div>
            <span className="font-extrabold text-emerald-700">OTP Confirmed</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
              <div>
                <span className="font-bold text-on-surface block">Email Address</span>
                <span className="text-[11px] text-outline">{currentUser.emailMasked}</span>
              </div>
            </div>
            <span className="font-extrabold text-emerald-700">Verified</span>
          </div>
        </div>
      </div>

      {/* Quick Navigation Menu */}
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/40 shadow-sm overflow-hidden divide-y divide-outline-variant/30">
        <button
          onClick={() => navigate('owner-dashboard')}
          className="w-full p-4 flex items-center justify-between hover:bg-surface-container transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary-container text-xl">real_estate_agent</span>
            <span className="text-xs font-bold text-on-surface">My Properties (Availability Management)</span>
          </div>
          <span className="material-symbols-outlined text-outline text-lg">chevron_right</span>
        </button>

        <button
          onClick={() => navigate('roommates')}
          className="w-full p-4 flex items-center justify-between hover:bg-surface-container transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary text-xl">badge</span>
            <span className="text-xs font-bold text-on-surface">Browse Roommates</span>
          </div>
          <span className="material-symbols-outlined text-outline text-lg">chevron_right</span>
        </button>

        <button
          onClick={() => navigate('roommate-requests')}
          className="w-full p-4 flex items-center justify-between hover:bg-surface-container transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-xl">sync_alt</span>
            <span className="text-xs font-bold text-on-surface">Requests & Connections</span>
          </div>
          <span className="material-symbols-outlined text-outline text-lg">chevron_right</span>
        </button>

        <button
          onClick={() => navigate('saved')}
          className="w-full p-4 flex items-center justify-between hover:bg-surface-container transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-rose-500 text-xl">bookmark</span>
            <span className="text-xs font-bold text-on-surface">Saved Stays & Flatmates</span>
          </div>
          <span className="material-symbols-outlined text-outline text-lg">chevron_right</span>
        </button>

        <button
          onClick={() => navigate('notifications')}
          className="w-full p-4 flex items-center justify-between hover:bg-surface-container transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-amber-500 text-xl">notifications</span>
            <span className="text-xs font-bold text-on-surface">Notifications</span>
          </div>
          <span className="material-symbols-outlined text-outline text-lg">chevron_right</span>
        </button>

        <button
          onClick={() => navigate('safety')}
          className="w-full p-4 flex items-center justify-between hover:bg-surface-container transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-emerald-600 text-xl">verified_user</span>
            <span className="text-xs font-bold text-on-surface">Safety, Verification & Privacy</span>
          </div>
          <span className="material-symbols-outlined text-outline text-lg">chevron_right</span>
        </button>

        <button
          onClick={() => setIsEditing(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-surface-container transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-outline text-xl">tune</span>
            <span className="text-xs font-bold text-on-surface">Account Settings</span>
          </div>
          <span className="material-symbols-outlined text-outline text-lg">chevron_right</span>
        </button>

        <button
          onClick={() => alert('HomeLink Rewa Support Desk: Email support@homelink.in or call 1800-REWA-STAYS (9 AM - 8 PM). HomeLink is 100% free with zero brokerage fees.')}
          className="w-full p-4 flex items-center justify-between hover:bg-surface-container transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#00A88E] text-xl">help</span>
            <span className="text-xs font-bold text-on-surface">Help & Support</span>
          </div>
          <span className="material-symbols-outlined text-outline text-lg">chevron_right</span>
        </button>
      </div>

      {/* Logout Action */}
      <button
        onClick={() => {
          setAuthModalOpen(true);
        }}
        className="w-full py-3.5 px-4 rounded-2xl bg-surface-container hover:bg-surface-container-high text-error font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <span className="material-symbols-outlined text-lg">logout</span>
        <span>Switch Account / Sign In with Another Number</span>
      </button>

      {/* Confirmation Modal */}
      <RoommateFoundModal
        isOpen={isRoommateModalOpen}
        roommateType={currentRoommateType}
        onClose={() => setIsRoommateModalOpen(false)}
        onConfirm={handleConfirmFound}
      />
    </div>
  );
}
