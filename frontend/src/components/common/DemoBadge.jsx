import React from 'react';

/**
 * Standard HomeLink DEMO badge component.
 * Minimal, clean, and styled according to the #00A88E HomeLink design system.
 */
export default function DemoBadge({
  size = 'md', // 'sm' | 'md' | 'lg'
  variant = 'light', // 'light' | 'white' | 'dark'
  className = ''
}) {
  const sizeClasses = {
    sm: 'text-[9px] px-1.5 py-0.2 font-black tracking-wider',
    md: 'text-[10px] px-2 py-0.5 font-black tracking-wider',
    lg: 'text-[11px] px-2.5 py-0.5 font-black tracking-wider'
  }[size] || 'text-[10px] px-2 py-0.5 font-black tracking-wider';

  const variantClasses = {
    light: 'bg-[#00A88E]/10 text-[#006b5a] border border-[#00A88E]/30',
    white: 'bg-white/95 text-[#006b5a] border border-[#00A88E]/30 shadow-2xs',
    dark: 'bg-[#131b2e]/90 text-emerald-400 border border-emerald-400/30 shadow-2xs'
  }[variant] || 'bg-[#00A88E]/10 text-[#006b5a] border border-[#00A88E]/30';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full uppercase select-none leading-tight ${sizeClasses} ${variantClasses} ${className}`}
      title="This is sample demonstration data"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#00A88E] shrink-0" />
      <span>DEMO</span>
    </span>
  );
}
