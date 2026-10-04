import React from 'react';
import { useApp } from '../context/AppContext';
import DemoBadge from '../components/DemoBadge';
import DemoNoticeBanner from '../components/DemoNoticeBanner';
import AvailabilityBadge from '../components/AvailabilityBadge';

export default function RoommateDetailView() {
  const {
    routeParams,
    roommates,
    goBack,
    navigate,
    sendRoommateRequest,
    acceptRoommateRequest,
    setActiveChatUserId,
    isRoommateSaved,
    toggleSaveRoommate,
    setReportModalOpen,
    setReportedTarget
  } = useApp();

  const roommateId = routeParams.roommateId || 'rm-1';
  const rm = roommates.find(r => r.id === roommateId) || roommates[0];

  const saved = isRoommateSaved(rm.id);
  const status = rm.availabilityStatus || 'looking_for_roommate';
  const isFound = status === 'roommate_found' || status === 'found_a_room';

  const handleAction = () => {
    if (rm.requestStatus === 'connected') {
      setActiveChatUserId(rm.id);
      navigate('chat', { roommateId: rm.id });
    } else if (rm.requestStatus === 'received') {
      acceptRoommateRequest(rm.id);
    } else if (rm.requestStatus === 'none') {
      sendRoommateRequest(rm.id);
    }
  };

  const handleReport = () => {
    setReportedTarget({ type: 'Roommate Profile', id: rm.id, title: rm.name });
    setReportModalOpen(true);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6 pb-28">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleSaveRoommate(rm.id)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              saved ? 'bg-rose-500 text-white' : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
            }`}
          >
            <span className={`material-symbols-outlined text-lg ${saved ? 'fill-current' : ''}`}>
              bookmark
            </span>
          </button>
          <button
            onClick={handleReport}
            className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-outline hover:text-error transition-colors cursor-pointer"
            title="Report"
          >
            <span className="material-symbols-outlined text-lg">flag</span>
          </button>
        </div>
      </div>

      {/* Demo Notice Banner */}
      <DemoNoticeBanner message="This roommate profile is for demonstration purposes. Real flatmate seekers will appear after HomeLink launches." />

      {/* Inactive Seeker Status Banner */}
      {isFound && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-xs">
          <div className="w-9 h-9 rounded-xl bg-rose-500/15 text-rose-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-xl">check_circle</span>
          </div>
          <div>
            <h4 className="font-black text-rose-800 text-sm">
              {status === 'found_a_room' ? 'Room Found • Profile Inactive' : 'Roommate Found • Profile Inactive'}
            </h4>
            <p className="text-rose-600 text-[11px] mt-0.5">
              This seeker has found what they were looking for and is no longer appearing in discovery or accepting new requests.
            </p>
          </div>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/40 shadow-sm text-center space-y-4">
        <div className="relative w-28 h-28 mx-auto">
          <img
            src={rm.avatar}
            alt={rm.name}
            className="w-full h-full rounded-3xl object-cover border-4 border-primary-container shadow-md"
          />
          <div className="absolute -bottom-2 -right-2">
            <DemoBadge size="sm" variant="white" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <h1 className="text-2xl font-black text-on-surface">{rm.name}</h1>
            <DemoBadge size="md" />
            <AvailabilityBadge status={status} size="sm" />
          </div>
          <p className="text-xs font-bold text-outline mt-1">{rm.occupation} • Age {rm.age}</p>
          <p className="text-xs font-semibold text-secondary flex items-center justify-center gap-1 mt-1">
            <span className="material-symbols-outlined text-sm">location_on</span>
            <span>{rm.location}</span>
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-black border border-emerald-500/20">
          <span className="material-symbols-outlined text-base">favorite</span>
          <span>{rm.matchScore}% Lifestyle Compatibility</span>
        </div>
      </div>

      {/* Sample Credentials Card */}
      <div className="bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/40 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase text-outline">Sample Profile Checklist</h3>
          <span className="text-[10px] font-bold text-outline">Demo Data</span>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container/60">
            <div className="flex items-center gap-2 font-bold text-on-surface">
              <span className="material-symbols-outlined text-primary-container text-base">school</span>
              <span>Institutional Student / College ID</span>
            </div>
            <span className="text-outline font-extrabold">Demo Check ✓</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container/60">
            <div className="flex items-center gap-2 font-bold text-on-surface">
              <span className="material-symbols-outlined text-primary-container text-base">phone_android</span>
              <span>Mobile Phone OTP</span>
            </div>
            <span className="text-outline font-extrabold">Demo Check ✓</span>
          </div>
        </div>
      </div>

      {/* Preferences & Bio */}
      <div className="bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/40 shadow-sm space-y-4">
        <div>
          <h3 className="text-xs font-extrabold uppercase text-outline mb-1.5">About</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {rm.bio}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-surface-container text-xs">
            <span className="text-[10px] uppercase font-bold text-outline block">Budget</span>
            <span className="font-extrabold text-on-surface">{rm.budget}</span>
          </div>
          <div className="p-3 rounded-2xl bg-surface-container text-xs">
            <span className="text-[10px] uppercase font-bold text-outline block">Looking For</span>
            <span className="font-extrabold text-on-surface">{rm.lookingFor}</span>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-extrabold uppercase text-outline mb-2">Habits & Routine</h3>
          <div className="flex flex-wrap gap-1.5">
            <span className="px-3 py-1 rounded-full bg-primary-fixed text-primary text-xs font-bold">
              {rm.diet}
            </span>
            {rm.habits?.map((h, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-semibold">
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface/95 backdrop-blur-md border-t border-outline-variant/30 z-30">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          {isFound ? (
            <div className="w-full py-3.5 px-4 rounded-xl bg-rose-500/10 text-rose-700 font-bold text-sm border border-rose-500/20 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-lg">cancel</span>
              <span>{status === 'found_a_room' ? 'User Found a Room • Inquiries Closed' : 'Roommate Found • New Requests Closed'}</span>
            </div>
          ) : rm.requestStatus === 'connected' ? (
            <button
              onClick={handleAction}
              className="w-full py-3.5 px-4 rounded-xl bg-primary-container text-white font-black text-sm shadow-md hover:bg-primary transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">chat</span>
              <span>Open Private Chat</span>
            </button>
          ) : rm.requestStatus === 'received' ? (
            <button
              onClick={handleAction}
              className="w-full py-3.5 px-4 rounded-xl bg-primary-container text-white font-black text-sm shadow-md hover:bg-primary transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">check</span>
              <span>Accept & Unlock Chat</span>
            </button>
          ) : rm.requestStatus === 'sent' ? (
            <button
              disabled
              className="w-full py-3.5 px-4 rounded-xl bg-surface-container text-outline font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-lg">hourglass_top</span>
              <span>Request Sent (Waiting for Acceptance)</span>
            </button>
          ) : (
            <button
              onClick={handleAction}
              className="w-full py-3.5 px-4 rounded-xl bg-primary-container text-white font-black text-sm shadow-md hover:bg-primary transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">person_add</span>
              <span>Send Connection Request</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
