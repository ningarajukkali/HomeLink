import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_PROPERTIES,
  INITIAL_ROOMMATES,
  INITIAL_CHATS,
  INITIAL_NOTIFICATIONS,
  CURRENT_USER,
  CITIES
} from '../data/mockData';
import { api } from '../services';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Navigation stack
  const [history, setHistory] = useState(['welcome']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [routeParams, setRouteParams] = useState({});

  const currentRoute = history[historyIndex] || 'welcome';

  const navigate = (route, params = {}) => {
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(route);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    setRouteParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('welcome');
    }
  };

  // Multi-city Location State (Delhi, Bangalore, Mumbai, Hyderabad, Rewa, Other)
  const [selectedCity, setSelectedCity] = useState(() => {
    try {
      return localStorage.getItem('homelink_selected_city') || 'All Cities';
    } catch {}
    return 'All Cities';
  });

  const changeCity = (cityName) => {
    setSelectedCity(cityName);
    try {
      localStorage.setItem('homelink_selected_city', cityName);
    } catch {}
  };

  // GPS Auto-Detect Location State
  const [userLocation, setUserLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('homelink_user_location');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      detected: false,
      isDetecting: false,
      locality: null,
      cityName: null,
      cityId: null,
      coordinates: null,
      formattedAddress: null,
      accuracyMeters: null,
      nearbyPlaces: null,
      error: null
    };
  });

  const detectLocation = async () => {
    setUserLocation(prev => ({ ...prev, isDetecting: true, error: null }));
    try {
      const { detectUserLiveLocation } = await import('../services/locationService');
      const loc = await detectUserLiveLocation();
      const updated = {
        detected: true,
        isDetecting: false,
        locality: loc.locality,
        cityName: loc.cityName,
        cityId: loc.cityId,
        coordinates: loc.coordinates,
        formattedAddress: loc.formattedAddress,
        accuracyMeters: loc.accuracyMeters,
        nearbyPlaces: loc.nearbyPlaces,
        error: null
      };
      setUserLocation(updated);
      try {
        localStorage.setItem('homelink_user_location', JSON.stringify(updated));
      } catch {}

      // Automatically switch active city if detected
      if (loc.cityId) {
        changeCity(loc.cityId);
      }
      return updated;
    } catch (err) {
      const failed = {
        detected: false,
        isDetecting: false,
        error: err.message || 'Could not detect location'
      };
      setUserLocation(prev => ({ ...prev, ...failed }));
      throw err;
    }
  };

  // Auth & User State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('homelink_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return CURRENT_USER;
  });
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authStep, setAuthStep] = useState('phone'); // 'phone' | 'otp' | 'success'
  const [authPhone, setAuthPhone] = useState('');
  const [authOtp, setAuthOtp] = useState('');

  // Keep localStorage in sync with currentUser
  useEffect(() => {
    if (currentUser) {
      try {
        localStorage.setItem('homelink_user', JSON.stringify(currentUser));
      } catch {}
    }
  }, [currentUser]);


  // Listings State
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [savedPropertyIds, setSavedPropertyIds] = useState(currentUser.savedProperties || []);

  // Property Listing Wizard Draft
  const [listingDraft, setListingDraft] = useState({
    propertyType: 'Room',
    bhk: '1 RK',
    locality: 'University Area, Rewa',
    city: 'Rewa',
    rent: 5500,
    deposit: 5500,
    brokerage: 0,
    furnished: 'Furnished',
    preferredTenant: 'Students & Working Bachelors',
    availableFrom: 'Immediately',
    amenities: ['High-speed Wi-Fi', '24/7 Power Backup', 'RO Drinking Water', 'Attached Bathroom'],
    description: 'Bright and airy room in Rewa near city college. Calm atmosphere for students and working professionals.',
    photos: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
    ],
    rules: ['No late night loud music', 'Visitors allowed with notice', 'Keep premises clean'],
    isFeatured: false
  });

  // Rental Filter State
  const [rentalFilters, setRentalFilters] = useState({
    searchQuery: '',
    locality: 'All Rewa',
    propertyTypes: ['Room', 'PG', '1 BHK', '2 BHK'],
    minRent: 2000,
    maxRent: 20000,
    furnishing: 'All',
    preferredTenant: 'All',
    sortBy: 'recommended' // 'recommended' | 'rent_low' | 'rent_high' | 'rating'
  });

  // Roommates State
  const [roommates, setRoommates] = useState(INITIAL_ROOMMATES);
  const [savedRoommateIds, setSavedRoommateIds] = useState(currentUser.savedRoommates || []);
  const [roommateFilters, setRoommateFilters] = useState({
    searchQuery: '',
    diet: 'All',
    maxBudget: 10000,
    occupation: 'All'
  });

  // Chat State
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [activeChatUserId, setActiveChatUserId] = useState('rm-1');

  // Notifications State
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Verification & Safety State
  const [kycStatus, setKycStatus] = useState('Approved'); // 'Approved' | 'Pending' | 'None'
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportedTarget, setReportedTarget] = useState(null);

  // Sync Properties & Roommates from Live Backend API
  useEffect(() => {
    api.properties.search()
      .then(res => {
        const items = res?.items || res?.data || (Array.isArray(res) ? res : []);
        if (items && items.length > 0) {
          const mapped = items.map(p => ({
            ...p,
            id: p.id || p._id,
            title: p.title || p.name || 'Rewa Property',
            propertyType: p.propertyType || (p.bhk?.includes('2') ? '2 BHK' : 'Room'),
            bhk: p.bhk || '1 RK',
            locality: p.locality || p.locationName || 'Rewa',
            city: p.city || 'Rewa',
            rent: Number(p.rent || p.monthlyRent || 4500),
            deposit: Number(p.deposit || 4500),
            brokerage: 0,
            furnished: p.furnished || 'Furnished',
            preferredTenant: p.preferredTenant || 'Students & Working Bachelors',
            availableFrom: p.availableFrom || 'Immediately',
            availabilityStatus: p.availabilityStatus || 'available',
            amenities: p.amenities || p.facilities || [],
            description: p.description || '',
            images: (p.images && p.images.length > 0) ? p.images : (p.photos && p.photos.length > 0 ? p.photos.map(ph => ph.imageUrl || ph) : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80']),
            owner: p.owner || {
              name: 'Verified Owner',
              type: 'Verified Owner',
              joinedYear: '2024',
              phoneMasked: '+91 98260 •••••',
              responseRate: 'Instant',
              verifiedKyc: true
            },
            distance: p.distance || 'Rewa City Area',
            isFeatured: Boolean(p.isFeatured),
            isVerified: p.isVerified !== undefined ? Boolean(p.isVerified) : true,
            rating: p.rating || 4.8,
            reviewsCount: p.reviewsCount || 5,
            isDemo: Boolean(p.isDemo)
          }));
          setProperties(prev => {
            const userAdded = prev.filter(p => !mapped.some(m => m.id === p.id) && !p.id.startsWith('prop-'));
            return [...userAdded, ...mapped];
          });
        }
      })
      .catch(() => {});

    api.roommates.search()
      .then(res => {
        const items = res?.items || res?.data || (Array.isArray(res) ? res : []);
        if (items && items.length > 0) {
          const mappedRm = items.map(r => ({
            ...r,
            id: r.id || r._id,
            name: r.name || r.user?.name || 'Roommate Seeker',
            age: r.age || 22,
            gender: r.gender || 'Any',
            occupation: r.occupation || 'Student',
            college: r.college || r.occupation || 'APSU Rewa',
            locality: r.locality || r.location || 'University Area, Rewa',
            distance: r.distance || 'Rewa Area',
            budget: r.budget || '₹3,000 - ₹5,000',
            budgetRange: r.budgetRange || `₹${r.budgetMin?.toLocaleString('en-IN') || '3,000'} - ₹${r.budgetMax?.toLocaleString('en-IN') || '6,000'}/mo`,
            moveIn: r.moveIn || 'Immediate',
            seeking: r.seeking || r.lookingFor || 'Looking for flatmate',
            diet: r.diet || 'Vegetarian Friendly',
            sleepHabit: r.sleepHabit || 'Flexible Schedule',
            workStyle: r.workStyle || 'Student / Professional',
            preferences: r.preferences || r.habits || ['Non-smoker', 'Early riser'],
            bio: r.bio || r.description || '',
            avatar: r.avatar || (r.gender?.toLowerCase() === 'female'
              ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
              : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80'),
            verifiedKyc: r.verifiedKyc !== undefined ? Boolean(r.verifiedKyc) : true,
            isDemo: Boolean(r.isDemo),
            requestStatus: r.requestStatus || 'none',
            availabilityStatus: r.availabilityStatus || 'looking_for_room',
          }));
          setRoommates(prev => {
            const custom = prev.filter(r => !mappedRm.some(m => m.id === r.id) && !r.id.startsWith('rm-'));
            return [...custom, ...mappedRm];
          });
        }
      })
      .catch(() => {});
  }, []);


  // Room Compare State (Max 4 properties)
  const [comparePropertyIds, setComparePropertyIds] = useState([]);
  const [compareToast, setCompareToast] = useState(null);

  const showCompareToast = (message, action = null) => {
    setCompareToast({ message, action, id: Date.now() });
    setTimeout(() => {
      setCompareToast(prev => (prev?.id ? null : prev));
    }, 3800);
  };

  const isPropertyInCompare = (propId) => {
    return comparePropertyIds.includes(propId);
  };

  const addToCompare = (propId) => {
    // 1. Duplicate check using unique property ID
    if (comparePropertyIds.includes(propId)) {
      showCompareToast('Already added to Compare', {
        label: 'View Comparison',
        onClick: () => navigate('compare')
      });
      return false;
    }

    // 2. Maximum limit check (4 properties)
    if (comparePropertyIds.length >= 4) {
      showCompareToast('Maximum 4 properties can be compared. Remove one first.', {
        label: 'View Comparison',
        onClick: () => navigate('compare')
      });
      return false;
    }

    // 3. Add to comparison
    setComparePropertyIds(prev => [...prev, propId]);
    showCompareToast('✓ Added to Compare', {
      label: 'View Comparison',
      onClick: () => navigate('compare')
    });
    return true;
  };

  const removeFromCompare = (propId) => {
    setComparePropertyIds(prev => prev.filter(id => id !== propId));
    showCompareToast('Property removed from Compare');
  };

  const replaceInCompare = (oldPropId, newPropId) => {
    if (newPropId === oldPropId) return false;
    if (comparePropertyIds.includes(newPropId)) {
      showCompareToast('Already added to Compare');
      return false;
    }

    setComparePropertyIds(prev =>
      prev.map(id => (id === oldPropId ? newPropId : id))
    );
    showCompareToast('Property replaced in Comparison');
    return true;
  };

  const clearCompare = () => {
    setComparePropertyIds([]);
    showCompareToast('Comparison list cleared');
  };

  // Property Actions
  const toggleSaveProperty = (propId) => {
    setSavedPropertyIds(prev => 
      prev.includes(propId) ? prev.filter(id => id !== propId) : [...prev, propId]
    );
  };

  const isPropertySaved = (propId) => savedPropertyIds.includes(propId);

  const addPropertyFromDraft = () => {
    const newId = 'prop-' + Date.now();
    const newProp = {
      ...listingDraft,
      id: newId,
      availabilityStatus: 'available',
      rating: 5.0,
      reviewsCount: 1,
      isVerified: true,
      images: listingDraft.photos.length > 0 ? listingDraft.photos : [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
      ],
      owner: {
        name: currentUser.name,
        type: 'Verified Owner',
        joinedYear: '2024',
        phoneMasked: currentUser.phoneMasked,
        responseRate: 'Instant',
        verifiedKyc: true
      },
      ownerId: currentUser.id,
      distance: 'Rewa City Center'
    };
    setProperties([newProp, ...properties]);
    setCurrentUser(prev => ({
      ...prev,
      ownedPropertyIds: [...(prev.ownedPropertyIds || []), newId]
    }));

    // Sync to backend MongoDB Atlas
    api.properties.create(newProp).catch(err => {
      console.warn('Backend sync for new listing note:', err.message);
    });

    return newId;
  };

  const loginUser = (user, token) => {
    if (token) {
      api.setToken(token);
    }
    setCurrentUser(user);
    if (user.savedProperties) setSavedPropertyIds(user.savedProperties);
    if (user.savedRoommates) setSavedRoommateIds(user.savedRoommates);
    try {
      localStorage.setItem('homelink_user', JSON.stringify(user));
    } catch {}
  };

  const logoutUser = () => {
    api.auth.logout().catch(() => {});
    localStorage.removeItem('homelink_user');
    localStorage.removeItem('homelink_token');
    const freshGuest = {
      id: `usr-${Date.now()}`,
      name: 'Guest User',
      role: 'Renter & Seeker',
      city: 'Rewa, MP',
      phoneMasked: '+91 ••••• •••••',
      emailMasked: '',
      isVerified: false,
      govtIdApproved: false,
      collegeIdApproved: false,
      trustLevel: 'Unverified Guest',
      memberSince: 'Today',
      activeListingsCount: 0,
      savedProperties: [],
      savedRoommates: [],
      ownedPropertyIds: [], // Fresh new guest starts with 0 listings!
      roommateType: 'looking_for_room',
      roommateStatus: 'looking_for_room'
    };
    setCurrentUser(freshGuest);
    setSavedPropertyIds([]);
    setSavedRoommateIds([]);
    navigate('dashboard');
  };


  // Property Availability Management (🟢 Available, 🟡 Paused, 🔴 Rented, 🗑️ Deleted)
  const updatePropertyStatus = (propId, status) => {
    setProperties(prev => prev.map(p => {
      if (p.id === propId) {
        return { ...p, availabilityStatus: status };
      }
      return p;
    }));
  };

  const markPropertyAsRented = (propId) => {
    updatePropertyStatus(propId, 'rented');
    api.properties.updateStatus(propId, 'RENTED').catch(() => {});
    showCompareToast('Property marked as: 🔴 Rented');
  };

  const pauseProperty = (propId) => {
    updatePropertyStatus(propId, 'paused');
    api.properties.updateStatus(propId, 'TEMPORARILY_UNAVAILABLE').catch(() => {});
    showCompareToast('Property paused: 🟡 Temporarily Unavailable');
  };

  const reactivateProperty = (propId) => {
    updatePropertyStatus(propId, 'available');
    api.properties.updateStatus(propId, 'AVAILABLE').catch(() => {});
    showCompareToast('Property reactivated: 🟢 Available in Search');
  };

  const deleteProperty = (propId) => {
    setProperties(prev => prev.filter(p => p.id !== propId));
    setCurrentUser(prev => ({
      ...prev,
      ownedPropertyIds: prev.ownedPropertyIds?.filter(id => id !== propId)
    }));
    showCompareToast('Property listing permanently removed');
  };

  // Roommate Actions
  const toggleSaveRoommate = (rmId) => {
    setSavedRoommateIds(prev =>
      prev.includes(rmId) ? prev.filter(id => id !== rmId) : [...prev, rmId]
    );
  };

  const isRoommateSaved = (rmId) => savedRoommateIds.includes(rmId);

  // Roommate Availability Management (🟢 Looking for Roommate/Room, 🔴 Roommate Found / Found a Room)
  const updateRoommateStatus = (rmId, status) => {
    setRoommates(prev => prev.map(rm => {
      if (rm.id === rmId) {
        return { ...rm, availabilityStatus: status };
      }
      return rm;
    }));
    const backendStatus = status === 'found_a_room' || status === 'roommate_found' ? 'ROOMMATE_FOUND' : 'LOOKING';
    api.roommates.updateStatus(rmId, backendStatus).catch(() => {});
  };

  const updateCurrentUserRoommateStatus = (status, type) => {
    setCurrentUser(prev => ({
      ...prev,
      roommateStatus: status,
      ...(type ? { roommateType: type } : {})
    }));
    
    if (status === 'looking_for_room') {
      showCompareToast('Status updated: 🟢 Looking for Room');
    } else if (status === 'found_a_room') {
      showCompareToast('Status updated: 🔴 Found a Room');
    } else if (status === 'looking_for_roommate') {
      showCompareToast('Status updated: 🟢 Looking for Roommate');
    } else if (status === 'roommate_found') {
      showCompareToast('Status updated: 🔴 Roommate Found');
    }
  };

  const sendRoommateRequest = (rmId) => {
    setRoommates(prev => prev.map(rm => {
      if (rm.id === rmId) {
        return { ...rm, requestStatus: 'sent' };
      }
      return rm;
    }));
    api.roommateRequests.send(rmId).catch(() => {});
  };

  const acceptRoommateRequest = (rmId) => {
    setRoommates(prev => prev.map(rm => {
      if (rm.id === rmId) {
        return { ...rm, requestStatus: 'connected' };
      }
      return rm;
    }));
    // initialize chat if not exists
    if (!chats[rmId]) {
      const rm = roommates.find(r => r.id === rmId);
      setChats(prev => ({
        ...prev,
        [rmId]: [
          {
            id: 'init-' + Date.now(),
            sender: rmId,
            senderName: rm ? rm.name : 'Roommate',
            text: 'Connection accepted! Hi Aman, glad to connect with you on HomeLink.',
            timestamp: 'Just now',
            isMe: false
          }
        ]
      }));
    }
  };

  const declineRoommateRequest = (rmId) => {
    setRoommates(prev => prev.map(rm => {
      if (rm.id === rmId) {
        return { ...rm, requestStatus: 'declined' };
      }
      return rm;
    }));
  };

  // Chat Actions
  const sendMessage = (userId, text) => {
    if (!text.trim()) return;
    const newMsg = {
      id: 'msg-' + Date.now(),
      sender: 'me',
      senderName: currentUser.name,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setChats(prev => {
      const userMsgs = prev[userId] || [];
      return {
        ...prev,
        [userId]: [...userMsgs, newMsg]
      };
    });

    // Simulated reply after 1.5s
    setTimeout(() => {
      const targetRoommate = roommates.find(r => r.id === userId);
      const replyMsg = {
        id: 'reply-' + Date.now(),
        sender: userId,
        senderName: targetRoommate ? targetRoommate.name : 'Roommate',
        text: 'Thanks for reaching out! I checked the details and I am definitely interested. When can we plan a visit?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false
      };
      setChats(prev => ({
        ...prev,
        [userId]: [...(prev[userId] || []), replyMsg]
      }));
    }, 1500);
  };

  // Notifications
  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        routeParams,
        navigate,
        goBack,
        currentUser,
        setCurrentUser,
        loginUser,
        logoutUser,
        selectedCity,
        setSelectedCity,
        changeCity,
        userLocation,
        detectLocation,
        CITIES,
        isAuthModalOpen,
        setAuthModalOpen,
        authStep,
        setAuthStep,
        authPhone,
        setAuthPhone,
        authOtp,
        setAuthOtp,
        properties,
        savedPropertyIds,
        toggleSaveProperty,
        isPropertySaved,
        listingDraft,
        setListingDraft,
        addPropertyFromDraft,
        updatePropertyStatus,
        markPropertyAsRented,
        pauseProperty,
        reactivateProperty,
        deleteProperty,
        rentalFilters,
        setRentalFilters,
        roommates,
        savedRoommateIds,
        toggleSaveRoommate,
        isRoommateSaved,
        updateRoommateStatus,
        updateCurrentUserRoommateStatus,
        sendRoommateRequest,
        acceptRoommateRequest,
        declineRoommateRequest,
        roommateFilters,
        setRoommateFilters,
        chats,
        activeChatUserId,
        setActiveChatUserId,
        sendMessage,
        notifications,
        markAllNotificationsRead,
        unreadNotificationsCount,
        kycStatus,
        setKycStatus,
        reportModalOpen,
        setReportModalOpen,
        reportedTarget,
        setReportedTarget,
        comparePropertyIds,
        compareToast,
        setCompareToast,
        addToCompare,
        removeFromCompare,
        replaceInCompare,
        clearCompare,
        isPropertyInCompare,
        showCompareToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
