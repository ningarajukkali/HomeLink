import React from 'react';
import { useApp } from '../context/AppContext';

export default function CompareToast() {
  const { compareToast, setCompareToast } = useApp();

  if (!compareToast) return null;

  const isSuccess = compareToast.message.includes('✓');

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] md:w-auto animate-in fade-in slide-in-from-top-3 duration-200">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-[#131b2e] text-white shadow-xl shadow-black/20 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`material-symbols-outlined text-lg shrink-0 ${
              isSuccess ? 'text-[#00A88E]' : 'text-amber-400'
            }`}
          >
            {isSuccess ? 'check_circle' : 'info'}
          </span>
          <span className="text-xs font-bold truncate">
            {compareToast.message}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {compareToast.action && (
            <button
              type="button"
              onClick={() => {
                compareToast.action.onClick();
                setCompareToast(null);
              }}
              className="text-xs font-black text-[#00A88E] hover:underline cursor-pointer"
            >
              {compareToast.action.label}
            </button>
          )}

          <button
            type="button"
            onClick={() => setCompareToast(null)}
            className="text-white/60 hover:text-white p-0.5 rounded cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      </div>
    </div>
  );
}
