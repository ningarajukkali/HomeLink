import React, { useEffect } from 'react';

/**
 * Confirmation modal when a user or roommate seeker has found a room or roommate.
 */
export default function RoommateFoundModal({
  isOpen,
  onClose,
  onConfirm,
  roommateType = 'looking_for_roommate' // 'looking_for_roommate' | 'looking_for_room'
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isLookingForRoommate = roommateType === 'looking_for_roommate';

  const title = isLookingForRoommate ? 'Found a roommate?' : 'Found a room?';
  const description = isLookingForRoommate
    ? '“Your profile will stop appearing to people looking for a roommate.”'
    : '“Your profile will stop appearing to people searching for flatmates and you will no longer receive new connection requests.”';
  const confirmText = isLookingForRoommate ? 'Yes, Roommate Found' : 'Yes, Found a Room';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-outline-variant/30 p-6 space-y-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Icon */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl font-bold">
              {isLookingForRoommate ? 'group' : 'home'}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-600">
              Seeker Status Update
            </span>
            <h3 className="text-lg font-black text-on-surface leading-tight">
              {title}
            </h3>
          </div>
        </div>

        {/* Explanation Message from requirements */}
        <p className="text-xs text-outline leading-relaxed">
          {description}
        </p>

        {/* Existing Connections Info */}
        <div className="p-3.5 rounded-2xl bg-surface-container text-[11px] text-outline space-y-1">
          <div className="flex items-center gap-1.5 text-on-surface font-bold">
            <span className="material-symbols-outlined text-sm text-[#00A88E]">forum</span>
            <span>Existing Connections & Chats Kept Safe</span>
          </div>
          <p>
            Your current chats, mutual contacts, and connected friends will remain active. You can choose to <strong>"Start Looking Again"</strong> anytime.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface transition-colors cursor-pointer text-center"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer text-center"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
