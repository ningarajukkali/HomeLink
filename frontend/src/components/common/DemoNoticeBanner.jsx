import React from 'react';

export default function DemoNoticeBanner({
  message = 'These listings are for demonstration purposes. Real listings will appear after HomeLink launches.',
  className = ''
}) {
  return (
    <div
      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#00A88E]/[0.06] border border-[#00A88E]/20 text-[#005143] text-xs font-semibold ${className}`}
    >
      <span className="material-symbols-outlined text-base text-[#00A88E] shrink-0">
        info
      </span>
      <span className="truncate">{message}</span>
    </div>
  );
}
