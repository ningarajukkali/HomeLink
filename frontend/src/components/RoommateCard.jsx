import React, { memo } from 'react';
import { useApp } from '../context/AppContext';
import DemoBadge from './DemoBadge';
import AvailabilityBadge from './AvailabilityBadge';

function RoommateCard({ roommate }) {
  const {
    navigate,
    isRoommateSaved,
    toggleSaveRoommate,
    sendRoommateRequest,
    acceptRoommateRequest,
    declineRoommateRequest,
    setActiveChatUserId
  } = useApp();

  const saved = isRoommateSaved(roommate.id);
  const isFound = roommate.availabilityStatus === 'roommate_found' || roommate.availabilityStatus === 'found_a_room';

  const handleAction = (e) => {
    e.stopPropagation();
    if (isFound) return;
    if (roommate.requestStatus === 'connected') {
      setActiveChatUserId(roommate.id);
      navigate('chat', { roommateId: roommate.id });
    } else if (roommate.requestStatus === 'received') {
      acceptRoommateRequest(roommate.id);
    } else if (roommate.requestStatus === 'none') {
      sendRoommateRequest(roommate.id);
    }
  };

  return (
    <div
      onClick={() => navigate('roommate-detail', { roommateId: roommate.id })}
      className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 p-5 hover:border-primary-container/60 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top Header: Avatar, Name, Match Score */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={roommate.avatar}
                alt={roommate.name}
                loading="lazy"
                decoding="async"
                className="w-14 h-14 rounded-2xl object-cover border-2 border-primary-container shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1">
                <DemoBadge size="sm" variant="white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-bold text-base text-on-surface hover:text-primary transition-colors">
                  {roommate.name}
                </h3>
                <span className="text-xs font-semibold text-outline">({roommate.age})</span>
                <DemoBadge size="sm" />
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <AvailabilityBadge status={roommate.availabilityStatus || 'looking_for_roommate'} size="sm" />
              </div>
              <p className="text-xs font-medium text-outline line-clamp-1 mt-0.5">
                {roommate.occupation}
              </p>
              <p className="text-[11px] font-semibold text-secondary flex items-center gap-0.5 mt-0.5">
                <span className="material-symbols-outlined text-[13px]">location_on</span>
                {roommate.location}
              </p>
            </div>
          </div>

          {/* Match Score & Bookmark */}
          <div className="flex flex-col items-end gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-extrabold border border-emerald-500/20 flex items-center gap-0.5">
              <span className="material-symbols-outlined text-sm">favorite</span>
              {roommate.matchScore}% Match
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSaveRoommate(roommate.id);
              }}
              className={`p-1.5 rounded-full hover:bg-surface-container transition-colors cursor-pointer ${
                saved ? 'text-rose-500' : 'text-outline'
              }`}
            >
              <span className={`material-symbols-outlined text-lg ${saved ? 'fill-current' : ''}`}>
                bookmark
              </span>
            </button>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-on-surface-variant line-clamp-2 mt-3 leading-relaxed">
          "{roommate.bio}"
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 mt-3.5 p-2.5 rounded-xl bg-surface-container/60 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-outline block">Budget Target</span>
            <span className="font-bold text-on-surface">{roommate.budget}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-outline block">Move-in Date</span>
            <span className="font-bold text-on-surface">{roommate.moveIn}</span>
          </div>
        </div>

        {/* Habits & Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          <span className="px-2 py-0.5 rounded-full bg-primary-fixed/30 text-on-primary-fixed-variant text-[11px] font-semibold">
            {roommate.diet}
          </span>
          {roommate.habits?.slice(0, 2).map((habit, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-semibold">
              {habit}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-between gap-2">
        {isFound ? (
          <div className="w-full py-2 px-3 rounded-xl bg-rose-500/10 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-rose-500/20">
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>{roommate.availabilityStatus === 'found_a_room' ? 'Found a Room • Inactive' : 'Roommate Found • Inactive'}</span>
          </div>
        ) : roommate.requestStatus === 'connected' ? (
          <button
            onClick={handleAction}
            className="w-full py-2 px-3 rounded-xl bg-primary-container text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md hover:bg-primary transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">chat</span>
            <span>Open Direct Chat</span>
          </button>
        ) : roommate.requestStatus === 'received' ? (
          <div className="flex items-center gap-2 w-full">
            <button
              onClick={handleAction}
              className="flex-1 py-2 px-2 rounded-xl bg-primary-container text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm hover:bg-primary transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">check</span>
              Accept
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                declineRoommateRequest(roommate.id);
              }}
              className="py-2 px-3 rounded-xl bg-surface-container text-outline hover:text-error text-xs font-bold transition-all cursor-pointer"
            >
              Decline
            </button>
          </div>
        ) : roommate.requestStatus === 'sent' ? (
          <button
            disabled
            className="w-full py-2 px-3 rounded-xl bg-surface-container text-outline font-bold text-xs flex items-center justify-center gap-1 cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-base">hourglass_top</span>
            <span>Request Sent (Pending)</span>
          </button>
        ) : (
          <button
            onClick={handleAction}
            className="w-full py-2 px-3 rounded-xl bg-surface-container-high hover:bg-primary-container hover:text-white text-on-surface font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-primary-container group-hover:text-white">
              person_add
            </span>
            <span>Connect & Request Chat</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default memo(RoommateCard);
