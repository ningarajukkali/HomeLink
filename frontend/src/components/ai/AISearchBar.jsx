import React, { useState, useEffect, useRef } from 'react';

export default function AISearchBar({
  value = '',
  onChange,
  onSubmit,
  onClear,
  placeholderExamples = [
    'Try: furnished room near university under ₹5,000…',
    'Find a room near my college under ₹5,000',
    'Show PGs with Wi-Fi for a female student',
    'Find a furnished room near the railway station',
    'I need a room for two people under ₹8,000'
  ],
  aiLabel = 'Ask HomeLink',
  actions = null,
  suggestions = [],
  onSelectSuggestion,
  className = '',
  size = 'default'
}) {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [fadeState, setFadeState] = useState('fade-in');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // Smoothly rotate realistic natural-language query examples
  useEffect(() => {
    if (value || isFocused || placeholderExamples.length <= 1) return;

    const interval = setInterval(() => {
      setFadeState('fade-out');
      setTimeout(() => {
        setExampleIndex((prev) => (prev + 1) % placeholderExamples.length);
        setFadeState('fade-in');
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [value, isFocused, placeholderExamples.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange({ target: { value: '' } });
    }
    inputRef.current?.focus();
  };

  const handleChipClick = (suggestion) => {
    if (onSelectSuggestion) {
      onSelectSuggestion(suggestion);
    } else if (onChange) {
      onChange({ target: { value: suggestion } });
      if (onSubmit) {
        setTimeout(() => {
          onSubmit({ preventDefault: () => {} });
        }, 50);
      }
    }
  };

  const isCompact = size === 'compact';

  return (
    <div className={`w-full ${className}`}>
      {/* Search Bar Container: 18-24px rounded corners, subtle light-green border, subtle shadow */}
      <form
        onSubmit={handleSubmit}
        className={`group relative flex items-center gap-2 md:gap-3 bg-white rounded-[22px] border border-[#00A88E]/30 shadow-[0_2px_14px_rgba(0,168,142,0.06)] hover:shadow-[0_4px_20px_rgba(0,168,142,0.12)] focus-within:border-[#00A88E] focus-within:ring-4 focus-within:ring-[#00A88E]/15 focus-within:shadow-[0_6px_24px_rgba(0,168,142,0.16)] focus-within:scale-[1.008] transition-all duration-300 ease-out ${
          isCompact ? 'p-1.5 pl-3' : 'p-2 pl-3 md:p-2.5 md:pl-4.5'
        }`}
      >
        {/* ✨ AI Search / Ask HomeLink Badge */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="flex items-center gap-1.5 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full bg-[#00A88E]/10 border border-[#00A88E]/25 text-[#006b5a] text-xs font-bold tracking-tight shrink-0 select-none cursor-pointer transition-all hover:bg-[#00A88E]/15"
          title="Natural language search powered by HomeLink"
        >
          {/* Subtle sparkle icon */}
          <span className="material-symbols-outlined text-[17px] text-[#00A88E] leading-none transition-transform group-focus-within:rotate-12">
            auto_awesome
          </span>
          <span className="hidden sm:inline whitespace-nowrap">{aiLabel}</span>
          <span className="sm:hidden font-extrabold whitespace-nowrap">AI</span>
        </div>

        {/* Input & Natural-Language Animated Placeholder */}
        <div className="relative flex-1 min-w-0 flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isFocused ? placeholderExamples[exampleIndex] : ''}
            className="w-full text-sm md:text-[15px] font-semibold text-[#131b2e] bg-transparent focus:outline-none placeholder:text-outline/50 placeholder:font-normal placeholder:italic pr-1 py-1.5"
          />

          {/* Gentle rotating placeholder with animated blinking cursor when empty & unfocused */}
          {!value && !isFocused && (
            <div
              onClick={() => inputRef.current?.focus()}
              className={`absolute inset-0 flex items-center pointer-events-none select-none text-xs sm:text-sm text-outline/80 truncate transition-all duration-300 ease-out ${
                fadeState === 'fade-in'
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 -translate-y-1.5'
              }`}
            >
              <span className="truncate font-normal italic">
                {placeholderExamples[exampleIndex]}
              </span>
              <span className="inline-block w-[1.5px] h-3.5 bg-[#00A88E] ml-1 shrink-0 animate-pulse" />
            </div>
          )}
        </div>

        {/* Clear Button (appears when user types) */}
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-full text-outline hover:text-[#131b2e] hover:bg-surface-container transition-colors cursor-pointer shrink-0"
            title="Clear search"
          >
            <span className="material-symbols-outlined text-lg leading-none">close</span>
          </button>
        )}

        {/* Optional Action Controls (Filters, Map toggle) */}
        {actions && (
          <div className="flex items-center gap-1.5 border-l border-outline-variant/30 pl-2 shrink-0">
            {actions}
          </div>
        )}

        {/* Small Green Search Button on the right */}
        <button
          type="submit"
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 md:px-4.5 md:py-2.5 rounded-[15px] bg-[#00A88E] hover:bg-[#00927b] active:scale-95 text-white font-bold text-xs md:text-sm tracking-wide shadow-sm shadow-[#00A88E]/30 transition-all cursor-pointer shrink-0"
          title="Search listings"
        >
          <span className="material-symbols-outlined text-base md:text-lg leading-none">search</span>
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>

      {/* Natural Prompt Suggestion Chips */}
      {suggestions && suggestions.length > 0 && (
        <div className="mt-2.5 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <div className="flex items-center gap-1 text-outline font-bold text-[11px] shrink-0 select-none pl-1">
            <span className="material-symbols-outlined text-[14px] text-[#00A88E]">temp_preferences_custom</span>
            <span className="hidden xs:inline">Try asking:</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(suggestion)}
                className="px-2.5 py-1 rounded-full bg-white/90 hover:bg-[#00A88E]/10 border border-[#00A88E]/20 hover:border-[#00A88E] text-[#131b2e] hover:text-[#006b5a] text-[11px] font-semibold transition-all cursor-pointer shadow-2xs whitespace-nowrap active:scale-95"
              >
                "{suggestion}"
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
