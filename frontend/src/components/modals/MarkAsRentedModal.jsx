import React, { useEffect } from 'react';

/**
 * Confirmation modal when owner marks a property as rented.
 */
export default function MarkAsRentedModal({
  isOpen,
  onClose,
  onConfirm,
  propertyTitle = 'this property'
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-outline-variant/30 p-6 space-y-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Icon */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl font-bold">cancel</span>
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-600">
              Availability Update
            </span>
            <h3 className="text-lg font-black text-on-surface leading-tight">
              Mark this property as rented?
            </h3>
          </div>
        </div>

        {/* Selected Property preview if title provided */}
        {propertyTitle && (
          <div className="p-3 rounded-2xl bg-surface-container-low text-xs text-on-surface font-bold border border-outline-variant/30 line-clamp-1">
            📍 {propertyTitle}
          </div>
        )}

        {/* Explanation Message from requirements */}
        <p className="text-xs text-outline leading-relaxed">
          “Once marked as rented, this property will no longer appear in rental search results and users will not be able to send new requests.”
        </p>

        {/* Reassurance note */}
        <div className="p-3.5 rounded-2xl bg-surface-container text-[11px] text-outline space-y-1">
          <div className="flex items-center gap-1.5 text-on-surface font-bold">
            <span className="material-symbols-outlined text-sm text-[#00A88E]">history</span>
            <span>Historical Data Preserved</span>
          </div>
          <p>
            Your existing conversations and visit requests will remain accessible. You can reactivate this listing anytime if the room becomes available again.
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
            Mark as Rented
          </button>
        </div>
      </div>
    </div>
  );
}
