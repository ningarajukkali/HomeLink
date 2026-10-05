import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export default function Header() {
  const {
    currentRoute,
    navigate,
    unreadNotificationsCount,
    currentUser,
    isAuthenticated,
    isOwner,
    isStudentOrParent,
    setAuthModalOpen,
    comparePropertyIds,
    logoutUser,
    selectedCity,
    changeCity,
    CITIES,
    userLocation,
    detectLocation
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCityMenuOpen, setIsCityMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const cityMenuRef = useRef(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
      if (cityMenuRef.current && !cityMenuRef.current.contains(e.target)) {
        setIsCityMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show dashboard ONLY after user login
  // Student/Parent -> Normal Dashboard
  // Owner -> Owner Dashboard only
  const navLinks = [];

  if (isAuthenticated) {
    if (isOwner) {
      navLinks.push({ id: 'owner-dashboard', label: 'Owner Dashboard', icon: 'storefront' });
    } else {
      navLinks.push({ id: 'dashboard', label: 'Dashboard', icon: 'space_dashboard' });
    }
  }

  // Common discovery links
  navLinks.push(
    { id: 'rentals', label: 'Find a Rental', icon: 'real_estate_agent' },
    { id: 'roommates', label: 'Roommates', icon: 'group' }
  );

  const currentCityObj = CITIES?.find(c => c.id === selectedCity) || {
    id: selectedCity,
    name: selectedCity === 'All Cities' ? 'All Locations' : selectedCity,
    badge: selectedCity
  };

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-outline-variant/30 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Interactive City Selector */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              if (!isAuthenticated) {
                navigate('welcome');
              } else if (isOwner) {
                navigate('owner-dashboard');
              } else {
                navigate('dashboard');
              }
            }}
            className="flex items-center gap-1.5 sm:gap-2.5 group text-left cursor-pointer focus:outline-none shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary-container text-white flex items-center justify-center shadow-sm shadow-primary-container/30 group-hover:scale-105 transition-transform duration-200">
              <span className="material-symbols-outlined text-xl sm:text-2xl font-bold">home</span>
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black tracking-tight text-on-surface flex items-center gap-0.5 leading-tight">
                Home<span className="text-primary-container">Link</span>
              </span>
              <span className="hidden sm:block text-[9.5px] uppercase font-bold tracking-[0.14em] text-outline leading-none mt-0.5">
                Verified Housing
              </span>
            </div>
          </button>

          {/* Interactive Multi-City Selector Dropdown */}
          <div className="relative shrink-0" ref={cityMenuRef}>
            <button
              onClick={() => setIsCityMenuOpen(!isCityMenuOpen)}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-secondary text-xs font-bold border border-outline-variant/40 transition-all cursor-pointer shadow-2xs group"
              title="Click to switch city or auto-detect location"
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${userLocation?.detected ? 'bg-emerald-500 animate-ping' : 'bg-primary-container animate-pulse'}`}></span>
              <span className="text-on-surface font-extrabold max-w-[70px] xs:max-w-[95px] sm:max-w-[130px] truncate text-[11px] sm:text-xs">
                {userLocation?.detected && userLocation?.locality 
                  ? userLocation.locality 
                  : (currentCityObj.badge || currentCityObj.name)}
              </span>
              <span className={`material-symbols-outlined text-[15px] sm:text-[16px] text-outline group-hover:text-on-surface transition-transform duration-200 ${isCityMenuOpen ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>

            {/* City Dropdown Menu */}
            {isCityMenuOpen && (
              <div className="absolute left-0 mt-2 w-80 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-outline-variant/30 flex items-center justify-between">
                  <p className="text-[11px] font-extrabold text-outline uppercase tracking-wider">Select Location</p>
                  <span className="text-[10px] font-bold text-primary-container bg-primary-container/10 px-2 py-0.5 rounded-full">
                    GPS & Cities
                  </span>
                </div>

                {/* Auto-Detect Location Button */}
                <div className="p-2 border-b border-outline-variant/30 bg-surface-container-low/60">
                  <button
                    onClick={async () => {
                      try {
                        await detectLocation();
                        setIsCityMenuOpen(false);
                      } catch (e) {
                        // error is handled inside userLocation.error
                      }
                    }}
                    disabled={userLocation?.isDetecting}
                    className="w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl bg-primary-container/15 hover:bg-primary-container/25 text-primary transition-all font-bold text-xs cursor-pointer border border-primary-container/30 active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-2.5">
                      {userLocation?.isDetecting ? (
                        <span className="material-symbols-outlined text-lg animate-spin text-primary-container">
                          progress_activity
                        </span>
                      ) : (
                        <span className="material-symbols-outlined text-lg text-primary-container">
                          near_me
                        </span>
                      )}
                      <div className="text-left">
                        <span className="block font-black text-xs text-primary">
                          {userLocation?.isDetecting ? 'Detecting your GPS location...' : 'Auto-Detect My Location'}
                        </span>
                        <span className="block text-[10.5px] text-outline font-medium">
                          Find rentals, gyms & barbers near you
                        </span>
                      </div>
                    </div>
                    <span className="text-[9.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary-container text-white shrink-0">
                      LIVE GPS
                    </span>
                  </button>

                  {userLocation?.error && (
                    <p className="text-[10.5px] text-rose-600 font-semibold mt-1.5 px-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">error</span>
                      {userLocation.error}
                    </p>
                  )}

                  {userLocation?.detected && (
                    <div className="mt-2 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-[11px] font-bold flex items-center justify-between">
                      <span className="truncate flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-emerald-600">location_on</span>
                        {userLocation.formattedAddress || `${userLocation.locality}, ${userLocation.cityName}`}
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-black shrink-0 ml-1">
                        Active
                      </span>
                    </div>
                  )}
                </div>

                <div className="py-1 max-h-[280px] overflow-y-auto">
                  {CITIES?.map((city) => {
                    const isSelected = selectedCity === city.id || (selectedCity === 'All Cities' && city.id === 'All Cities');
                    return (
                      <button
                        key={city.id}
                        onClick={() => {
                          changeCity(city.id);
                          setIsCityMenuOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-primary-container/15 text-primary'
                            : 'text-on-surface hover:bg-surface-container'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span className={`material-symbols-outlined text-lg mt-0.5 ${isSelected ? 'text-primary-container' : 'text-outline'}`}>
                            location_on
                          </span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold">{city.name}</span>
                              {city.state && (
                                <span className="text-[10px] text-outline font-semibold">({city.state})</span>
                              )}
                            </div>
                            {city.popular && (
                              <p className="text-[10.5px] text-outline font-normal line-clamp-1 mt-0.5">
                                {city.popular}
                              </p>
                            )}
                          </div>
                        </div>

                        {isSelected && (
                          <span className="material-symbols-outlined text-base text-primary-container shrink-0 ml-2">
                            check_circle
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Nav Links - with whitespace-nowrap and subtle active pill */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive =
              currentRoute === link.id ||
              (link.id === 'rentals' && currentRoute === 'rental-detail') ||
              (link.id === 'roommates' && currentRoute === 'connections');

            return (
              <button
                key={link.id}
                onClick={() => navigate(link.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-primary-container/15 text-primary border border-primary-container/30 shadow-2xs'
                    : 'text-on-surface/80 hover:text-on-surface hover:bg-surface-container border border-transparent'
                }`}
              >
                <span className={`material-symbols-outlined text-[17px] ${isActive ? 'text-primary-container' : 'text-outline'}`}>
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions - Fully responsive for mobile & desktop */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Compare Badge button if items selected */}
          {comparePropertyIds.length > 0 && (
            <button
              onClick={() => navigate('compare')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                currentRoute === 'compare'
                  ? 'bg-primary-container text-white shadow-xs'
                  : 'bg-primary-container/15 text-primary border border-primary-container/30 hover:bg-primary-container/20'
              }`}
              title="View property comparison"
            >
              <span className="material-symbols-outlined text-[15px] sm:text-[16px]">compare_arrows</span>
              <span className="hidden sm:inline">Compare</span>
              <span className="bg-primary-container text-white px-1.5 py-0.2 rounded-full text-[10px] font-extrabold">
                {comparePropertyIds.length}
              </span>
            </button>
          )}

          {/* List CTA Button - Renamed to 'List', prompts login if unauthenticated */}
          <button
            onClick={() => {
              if (!isAuthenticated) {
                setAuthModalOpen(true);
              } else {
                navigate('list-property');
              }
            }}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-extrabold bg-secondary-container text-on-secondary-container hover:bg-secondary-container/85 border border-secondary-container/60 shadow-xs hover:shadow-sm active:scale-95 transition-all whitespace-nowrap cursor-pointer"
            title="List Your Property"
          >
            <span className="material-symbols-outlined text-[16px] sm:text-[17px]">add_circle</span>
            <span>List</span>
          </button>

          {/* Notifications */}
          <button
            onClick={() => navigate('notifications')}
            className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl hover:bg-surface-container text-on-surface border border-transparent hover:border-outline-variant/30 flex items-center justify-center transition-colors cursor-pointer"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[19px] sm:text-[21px]">notifications</span>
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 rounded-full bg-error text-white text-[9.5px] font-bold flex items-center justify-center ring-2 ring-surface animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Saved properties & roommates - hidden on small mobile, accessible in profile */}
          <button
            onClick={() => navigate('saved')}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl transition-colors hidden sm:flex items-center justify-center cursor-pointer border ${
              currentRoute === 'saved'
                ? 'bg-primary-container/15 text-primary border-primary-container/30 shadow-2xs'
                : 'hover:bg-surface-container text-on-surface border-transparent hover:border-outline-variant/30'
            }`}
            title="Saved Items"
          >
            <span className="material-symbols-outlined text-[19px] sm:text-[21px]">bookmark</span>
          </button>

          {/* Profile Capsule or Sign In Button */}
          {!isAuthenticated ? (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-primary-container text-white text-xs font-bold shadow-xs hover:bg-primary active:scale-95 transition-all whitespace-nowrap cursor-pointer ml-0.5"
            >
              <span className="material-symbols-outlined text-[16px] sm:text-[17px]">login</span>
              <span>Sign In</span>
            </button>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 sm:gap-2 pl-1 sm:pl-1.5 pr-2 sm:pr-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors border border-outline-variant/40 cursor-pointer ml-0.5 select-none shadow-2xs"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary-container text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {currentUser?.name ? currentUser.name[0].toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-bold text-on-surface hidden md:inline max-w-[90px] truncate">
                  {currentUser?.name || 'Account'}
                </span>
                <span className={`material-symbols-outlined text-sm text-outline transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2.5 border-b border-outline-variant/30">
                  <p className="text-xs font-extrabold text-on-surface truncate">{currentUser?.name}</p>
                  <p className="text-[11px] text-outline font-medium truncate mt-0.5">{currentUser?.phoneMasked || currentUser?.role || 'Verified Member'}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary-container/15 text-primary border border-primary-container/30">
                    {currentUser?.role || (isOwner ? 'Property Owner' : 'Student / Parent')}
                  </span>
                </div>

                <div className="py-1">
                  {isOwner ? (
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigate('owner-dashboard');
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-on-surface hover:bg-surface-container flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg text-secondary">storefront</span>
                      <span>Owner Dashboard</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigate('dashboard');
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-on-surface hover:bg-surface-container flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg text-primary-container">space_dashboard</span>
                      <span>Student / Tenant Dashboard</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate('profile');
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-on-surface hover:bg-surface-container flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg text-primary-container">person</span>
                    <span>My Profile & KYC Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate('saved');
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-on-surface hover:bg-surface-container flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg text-primary-container">bookmark</span>
                    <span>Saved Stays & Roommates</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate('safety');
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-on-surface hover:bg-surface-container flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg text-amber-500">verified_user</span>
                    <span>Safety & Fraud Guidelines</span>
                  </button>
                </div>

                <div className="border-t border-outline-variant/30 pt-1 mt-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setAuthModalOpen(true);
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-primary-container hover:bg-surface-container flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">sync_alt</span>
                    <span>Switch Account / Sign In</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logoutUser();
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-error hover:bg-error/10 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </header>
  );
}
