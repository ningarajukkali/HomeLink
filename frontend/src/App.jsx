import React, { Suspense, lazy, useEffect } from 'react';
import { useApp } from './context/AppContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import AuthModal from './components/AuthModal';
import ReportModal from './components/ReportModal';
import AIAssistant from './components/AIAssistant';
import FloatingCompareBar from './components/FloatingCompareBar';
import CompareToast from './components/CompareToast';

// Keep primary DashboardView immediate for instant first load
import DashboardView from './views/DashboardView';

// Code-split secondary views on-demand with React.lazy
const WelcomeView = lazy(() => import('./views/WelcomeView'));
const RentalsView = lazy(() => import('./views/RentalsView'));
const RentalFiltersView = lazy(() => import('./views/RentalFiltersView'));
const RentalDetailView = lazy(() => import('./views/RentalDetailView'));
const CompareView = lazy(() => import('./views/CompareView'));
const ListPropertyWizardView = lazy(() => import('./views/ListPropertyWizardView'));
const OwnerDashboardView = lazy(() => import('./views/OwnerDashboardView'));
const FeaturedListingView = lazy(() => import('./views/FeaturedListingView'));
const RoommatesView = lazy(() => import('./views/RoommatesView'));
const RoommateDetailView = lazy(() => import('./views/RoommateDetailView'));
const RoommateRequestsView = lazy(() => import('./views/RoommateRequestsView'));
const ChatView = lazy(() => import('./views/ChatView'));
const SavedView = lazy(() => import('./views/SavedView'));
const NotificationsView = lazy(() => import('./views/NotificationsView'));
const ProfileView = lazy(() => import('./views/ProfileView'));
const SafetyView = lazy(() => import('./views/SafetyView'));

// Lightweight, accessible loading fallback
function ViewLoadingFallback() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-3 animate-in fade-in duration-200">
      <div className="w-11 h-11 rounded-2xl bg-[#00A88E]/10 text-[#00A88E] flex items-center justify-center shadow-xs">
        <span className="material-symbols-outlined text-2xl animate-spin">progress_activity</span>
      </div>
      <p className="text-xs font-bold text-outline">Loading HomeLink Rewa...</p>
    </div>
  );
}

export default function App() {
  const { currentRoute, isAuthenticated, isOwner, setAuthModalOpen } = useApp();

  // Scroll to top on every view navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentRoute]);

  const renderCurrentView = () => {
    switch (currentRoute) {
      case 'welcome':
        return <WelcomeView />;
      case 'dashboard':
        // Show dashboard only after login; route based on role
        if (!isAuthenticated) return <WelcomeView />;
        if (isOwner) return <OwnerDashboardView />;
        return <DashboardView />;
      case 'owner-dashboard':
        // Show owner dashboard only if user is logged in as owner
        if (!isAuthenticated) return <WelcomeView />;
        if (!isOwner) return <DashboardView />;
        return <OwnerDashboardView />;
      case 'rentals':
        return <RentalsView />;
      case 'rental-filters':
        return <RentalFiltersView />;
      case 'rental-detail':
        return <RentalDetailView />;
      case 'compare':
        return <CompareView />;
      case 'list-property':
        if (!isAuthenticated) {
          setAuthModalOpen(true);
          return <WelcomeView />;
        }
        return <ListPropertyWizardView />;
      case 'featured-plans':
        return <FeaturedListingView />;
      case 'roommates':
        return <RoommatesView />;
      case 'roommate-detail':
        return <RoommateDetailView />;
      case 'roommate-requests':
      case 'connections':
        return <RoommateRequestsView />;
      case 'chat':
        return <ChatView />;
      case 'saved':
        return <SavedView />;
      case 'notifications':
        return <NotificationsView />;
      case 'profile':
        return <ProfileView />;
      case 'safety':
        return <SafetyView />;
      default:
        if (!isAuthenticated) return <WelcomeView />;
        if (isOwner) return <OwnerDashboardView />;
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans selection:bg-primary-container selection:text-white">
      {/* Persistent Sticky Header */}
      <Header />

      {/* Main Content View with Code-Splitting Suspense & Mobile Bottom Spacing */}
      <main className="flex-1 w-full pb-16 md:pb-0">
        <Suspense fallback={<ViewLoadingFallback />}>
          {renderCurrentView()}
        </Suspense>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Floating Compare Bar (Active when properties selected) */}
      <FloatingCompareBar />

      {/* Persistent Floating AI Assistant */}
      <AIAssistant />

      {/* Toast Notifications */}
      <CompareToast />

      {/* Global Modals */}
      <AuthModal />
      <ReportModal />
    </div>
  );
}
