import React from 'react';

/**
 * Clean status badge according to HomeLink design system:
 * - 🟢 Available / Looking for Room / Looking for Roommate
 * - 🟡 Temporarily Unavailable / Paused
 * - 🔴 Rented / Roommate Found / Found a Room
 */
export default function AvailabilityBadge({
  status = 'available',
  type = 'property', // 'property' | 'roommate'
  size = 'md',       // 'sm' | 'md' | 'lg'
  className = ''
}) {
  // Normalize status string
  const s = String(status || '').toLowerCase();

  let config = {
    label: 'Available',
    dotColor: 'bg-emerald-500',
    textColor: 'text-emerald-700',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/25',
    icon: 'check_circle'
  };

  // Property statuses
  if (type === 'property') {
    if (s === 'rented') {
      config = {
        label: 'Rented',
        dotColor: 'bg-rose-500',
        textColor: 'text-rose-700',
        bgColor: 'bg-rose-500/10',
        borderColor: 'border-rose-500/25',
        icon: 'cancel'
      };
    } else if (s === 'paused' || s === 'unavailable' || s === 'temporarily_unavailable') {
      config = {
        label: 'Temporarily Unavailable',
        dotColor: 'bg-amber-500',
        textColor: 'text-amber-800',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/30',
        icon: 'pause_circle'
      };
    } else {
      config = {
        label: 'Available',
        dotColor: 'bg-emerald-500',
        textColor: 'text-emerald-700',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/25',
        icon: 'check_circle'
      };
    }
  }

  // Roommate statuses
  if (type === 'roommate') {
    if (s === 'roommate_found') {
      config = {
        label: 'Roommate Found',
        dotColor: 'bg-rose-500',
        textColor: 'text-rose-700',
        bgColor: 'bg-rose-500/10',
        borderColor: 'border-rose-500/25',
        icon: 'person_off'
      };
    } else if (s === 'found_room') {
      config = {
        label: 'Found a Room',
        dotColor: 'bg-rose-500',
        textColor: 'text-rose-700',
        bgColor: 'bg-rose-500/10',
        borderColor: 'border-rose-500/25',
        icon: 'home'
      };
    } else if (s === 'looking_for_roommate') {
      config = {
        label: 'Looking for Roommate',
        dotColor: 'bg-emerald-500',
        textColor: 'text-emerald-700',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/25',
        icon: 'group'
      };
    } else {
      config = {
        label: 'Looking for Room',
        dotColor: 'bg-emerald-500',
        textColor: 'text-emerald-700',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/25',
        icon: 'search'
      };
    }
  }

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2'
  }[size] || 'text-xs px-2.5 py-1 gap-1.5';

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5'
  }[size] || 'w-2 h-2';

  return (
    <span
      className={`inline-flex items-center font-extrabold rounded-full border ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeClasses} ${className}`}
    >
      <span className={`rounded-full shrink-0 ${config.dotColor} ${dotSizes}`} />
      <span>{config.label}</span>
    </span>
  );
}
