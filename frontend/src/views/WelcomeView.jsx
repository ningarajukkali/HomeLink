import React from 'react';
import { useApp } from '../context/AppContext';

export default function WelcomeView() {
  const { navigate, setAuthModalOpen, isAuthenticated } = useApp();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between max-w-xl mx-auto px-4 py-8 md:py-12">
      {/* Top Hero Section */}
      <div className="text-center pt-2">
        {/* Community Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/40 text-on-primary-fixed-variant text-xs font-extrabold uppercase tracking-wide border border-primary-container/20 mb-4 animate-in fade-in">
          <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
          <span>Your All-in-One Housing Community</span>
        </div>

        {/* Brand Headline */}
        <h1 className="text-4xl md:text-5xl font-black text-on-surface tracking-tight leading-[1.1] mb-3">
          Find Your Place.<br />
          <span className="text-primary-container">Find Your People.</span>
        </h1>

        <p className="text-base text-outline max-w-md mx-auto leading-relaxed">
          Find rooms, PGs, apartments and roommates in Rewa in one transparent, zero-brokerage community.
        </p>
      </div>

      {/* 3 Core Action Cards matching Stitch Welcome Screen */}
      <div className="my-8 space-y-3.5">
        {/* Card 1: Find a Rental */}
        <button
          onClick={() => navigate('rentals')}
          className="group w-full p-4 md:p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 hover:border-primary-container shadow-sm hover:shadow-xl transition-all duration-300 flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-primary-container/10 text-primary-container flex items-center justify-center group-hover:bg-primary-container group-hover:text-white transition-all">
              <span className="material-symbols-outlined text-3xl">apartment</span>
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-on-surface group-hover:text-primary transition-colors">
                Find a Rental
              </h3>
              <p className="text-xs text-outline font-medium">
                Find a room, PG, flat or independent floor in Rewa.
              </p>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-surface-container group-hover:bg-primary-container group-hover:text-white flex items-center justify-center text-outline transition-all">
            <span className="material-symbols-outlined text-xl">chevron_right</span>
          </div>
        </button>

        {/* Card 2: Find a Roommate */}
        <button
          onClick={() => navigate('roommates')}
          className="group w-full p-4 md:p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 hover:border-primary-container shadow-sm hover:shadow-xl transition-all duration-300 flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-secondary-container/40 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all">
              <span className="material-symbols-outlined text-3xl">group</span>
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-on-surface group-hover:text-secondary transition-colors">
                Find a Roommate
              </h3>
              <p className="text-xs text-outline font-medium">
                Connect with verified students and professionals to share costs.
              </p>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-surface-container group-hover:bg-secondary group-hover:text-white flex items-center justify-center text-outline transition-all">
            <span className="material-symbols-outlined text-xl">chevron_right</span>
          </div>
        </button>

        {/* Card 3: List Your Property */}
        <button
          onClick={() => {
            if (!isAuthenticated) {
              setAuthModalOpen(true);
            } else {
              navigate('list-property');
            }
          }}
          className="group w-full p-4 md:p-5 rounded-2xl bg-gradient-to-r from-surface-container-low to-surface-container-lowest border border-primary-container/30 hover:border-primary-container shadow-sm hover:shadow-xl transition-all duration-300 flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-3xl">add_home</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-on-surface">
                  List Your Property
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[10px] font-extrabold uppercase">
                  Host & Earn
                </span>
              </div>
              <p className="text-xs text-outline font-medium">
                Have a room or property to rent? Get direct inquiries.
              </p>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-surface-container group-hover:bg-primary group-hover:text-white flex items-center justify-center text-outline transition-all">
            <span className="material-symbols-outlined text-xl">chevron_right</span>
          </div>
        </button>
      </div>

      {/* Bottom Trust & Auth Section */}
      <div className="text-center pt-4 border-t border-outline-variant/30">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-outline mb-6">
          <span className="inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-base text-primary-container">verified</span>
            Verified listings
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-base text-primary-container">verified_user</span>
            Verified roommates
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-base text-primary-container">shield</span>
            Zero spam
          </span>
        </div>

        <div className="flex items-center justify-center gap-2">
          <span className="text-xs text-outline">Already have an account?</span>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="text-xs font-extrabold text-primary-container hover:text-primary hover:underline cursor-pointer"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
