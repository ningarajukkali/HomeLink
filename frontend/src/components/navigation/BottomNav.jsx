import React from 'react';
import { useApp } from '../../context/AppContext';

export default function BottomNav() {
  const { currentRoute, navigate, isAuthenticated, isOwner, setAuthModalOpen } = useApp();

  const primaryHomeTab = !isAuthenticated
    ? { id: 'welcome', label: 'Explore', icon: 'explore' }
    : (isOwner 
        ? { id: 'owner-dashboard', label: 'Dashboard', icon: 'storefront' }
        : { id: 'dashboard', label: 'Dashboard', icon: 'space_dashboard' });

  const navItems = [
    primaryHomeTab,
    { id: 'rentals', label: 'Rentals', icon: 'apartment' },
    { id: 'roommates', label: 'Roommates', icon: 'group' },
    { id: 'chat', label: 'Chat', icon: 'chat' },
    { id: 'profile', label: isAuthenticated ? 'Profile' : 'Sign In', icon: 'person' },
  ];

  // Full-screen focused views with their own sticky action/input bars
  const hideOnRoutes = ['rental-detail', 'roommate-detail', 'chat', 'list-property'];
  if (hideOnRoutes.includes(currentRoute)) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-lg border-t border-outline-variant/30 px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentRoute === item.id || 
            (item.id === 'rentals' && currentRoute === 'rental-detail') ||
            (item.id === 'roommates' && currentRoute === 'connections');

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'profile' && !isAuthenticated) {
                  setAuthModalOpen(true);
                } else {
                  navigate(item.id);
                }
              }}
              className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-primary font-extrabold' : 'text-outline hover:text-on-surface'
              }`}
            >
              <div className={`p-1 rounded-full transition-transform ${isActive ? 'bg-primary-fixed text-primary scale-110' : ''}`}>
                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              </div>
              <span className="text-[10.5px] font-semibold tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
