import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services';
import { generateAIResponse } from '../../services/aiAssistantService';
import DemoBadge from '../common/DemoBadge';

/**
 * Professional Clean Content Formatter for AI Assistant
 * Eliminates raw markdown "code words" like ###, *, ---, and presents clean typography.
 */
function FormattedMessage({ text, isUser = false }) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let currentList = [];

  const parseInline = (str) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={pIdx} className="font-extrabold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <div key={`list-${elements.length}`} className="space-y-1.5 my-2">
          {currentList.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 pl-1 text-xs md:text-sm leading-relaxed">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${isUser ? 'bg-white' : 'bg-primary-container'}`} />
              <div className="flex-1">{parseInline(item)}</div>
            </div>
          ))}
        </div>
      );
      currentList = [];
    }
  };

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim();

    if (!line) {
      flushList();
      elements.push(<div key={`empty-${idx}`} className="h-1.5" />);
      return;
    }

    // Horizontal Rule: --- or ***
    if (line === '---' || line === '***' || line === '___') {
      flushList();
      elements.push(
        <hr key={`hr-${idx}`} className={`my-2.5 ${isUser ? 'border-white/30' : 'border-outline-variant/30'}`} />
      );
      return;
    }

    // Headers: ### Header or ## Header or # Header (NEVER show raw #)
    if (line.startsWith('#')) {
      flushList();
      const cleanHeader = line.replace(/^#+\s*/, '');
      elements.push(
        <div
          key={`header-${idx}`}
          className={`mt-3 mb-1.5 pt-1.5 pb-1 font-black text-xs md:text-sm flex items-center gap-1.5 border-b ${
            isUser ? 'text-white border-white/30' : 'text-primary border-outline-variant/30'
          }`}
        >
          {parseInline(cleanHeader)}
        </div>
      );
      return;
    }

    // Bullet points: * item or - item or • item (NEVER show raw * or -)
    if (/^(\*|-|•)\s+/.test(line)) {
      const cleanItem = line.replace(/^(\*|-|•)\s+/, '');
      currentList.push(cleanItem);
      return;
    }

    // Subheaders like "* Gyms:" or "**Gyms:**" that are alone on a line
    if (/^\*?\s*\*\*(.*?)\*\*:?\s*$/.test(line)) {
      flushList();
      const match = line.match(/^\*?\s*\*\*(.*?)\*\*:?\s*$/);
      elements.push(
        <div
          key={`subhead-${idx}`}
          className={`mt-2.5 mb-1 font-bold text-xs uppercase tracking-wider ${
            isUser ? 'text-white/90' : 'text-primary'
          }`}
        >
          {match[1]}
        </div>
      );
      return;
    }

    // Numbered points: 1. item, 2. item
    const numMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (numMatch) {
      flushList();
      elements.push(
        <div key={`num-${idx}`} className="flex items-start gap-2 pl-0.5 my-1 text-xs md:text-sm leading-relaxed">
          <span className={`w-5 h-5 rounded-full text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5 ${
            isUser ? 'bg-white/20 text-white' : 'bg-primary-container/15 text-primary'
          }`}>
            {numMatch[1]}
          </span>
          <div className="flex-1">{parseInline(numMatch[2])}</div>
        </div>
      );
      return;
    }

    // Normal paragraph line
    flushList();
    elements.push(
      <p key={`p-${idx}`} className="text-xs md:text-sm leading-relaxed">
        {parseInline(line)}
      </p>
    );
  });

  flushList();
  return <div className="space-y-1">{elements}</div>;
}

export default function AIAssistant() {
  const {
    currentRoute,
    routeParams,
    properties,
    roommates,
    selectedCity,
    navigate,
    userLocation,
    detectLocation
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLabelExpanded, setIsLabelExpanded] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [attachedImage, setAttachedImage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingStatus, setTypingStatus] = useState('AI Assistant is typing…');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const activeCityName = userLocation?.detected && userLocation?.locality 
    ? `${userLocation.locality} (GPS)` 
    : (selectedCity === 'All Cities' ? 'All Locations' : selectedCity);

  // Active property context if user is on rental-detail
  const activePropertyId = routeParams?.propertyId || (currentRoute === 'rental-detail' ? 'prop-1' : null);
  const activeProperty = activePropertyId ? properties.find(p => p.id === activePropertyId) : null;

  // Active roommate context if user is on roommate-detail
  const activeRoommateId = routeParams?.roommateId || (currentRoute === 'roommate-detail' ? 'rm-1' : null);
  const activeRoommate = activeRoommateId ? roommates.find(r => r.id === activeRoommateId) : null;

  // Initial greeting message
  const [messages, setMessages] = useState([
    {
      id: 'msg-init',
      sender: 'ai',
      text: `Namaste! 👋 I'm **AI Assistant** (Powered by Gemini), your personal 24/7 rental & neighborhood living guide for **${activeCityName}**.\n\nAsk me anything related to your stay — or click **Auto-Detect Location** to find nearby gyms, barbers, food & verified rooms!`,
      followUps: [
        '📍 Auto-detect my location to find nearby places',
        '📷 Check if a room photo is real or AI-generated',
        'Is there any gym or barber shop near me?',
        'Find me best with cheap house in this area',
        'Find verified rooms under ₹5,000'
      ]
    }
  ]);

  // Collapse the floating button text label after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLabelExpanded(false);
    }, 5500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, isTyping, attachedImage]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, isMinimized]);

  // Keyboard accessibility: Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setAttachedImage(ev.target.result);
          if (!inputValue.trim()) {
            setInputValue('Is this photo real and genuine, or is it AI-generated / 3D render?');
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async (textToSend) => {
    const text = (textToSend || inputValue).trim() || (attachedImage ? 'Check this photo: Is it a real and genuine photograph or AI-generated / 3D render?' : '');
    if (!text && !attachedImage) return;

    const imgToSend = attachedImage;
    setAttachedImage(null);

    const userMessageId = `user-${Date.now()}`;
    const newMessages = [
      ...messages,
      { id: userMessageId, sender: 'user', text, image: imgToSend }
    ];

    setMessages(newMessages);
    setInputValue('');

    // Contextual typing indicator according to the text / image
    if (imgToSend) {
      setTypingStatus('HomeLink AI is analyzing photo authenticity…');
    } else if (/(\b(gym|barber|salon|haircut|tiffin|mess|food|amenit|near|nearby|distance)\b)/i.test(text)) {
      setTypingStatus('Searching neighborhood gyms, barbers & tiffin services…');
    } else if (/(\b(cheap|budget|bhk|flat|room|pg|rent|5k|8k|10k|house|find)\b)/i.test(text)) {
      setTypingStatus('Finding verified stays with 0% brokerage…');
    } else {
      setTypingStatus('AI Assistant is analyzing your query…');
    }

    setIsTyping(true);

    try {
      // Build past history for Gemini context
      const history = messages.slice(-6).map(m => ({
        sender: m.sender,
        text: m.text
      }));

      // Send to backend AI endpoint (Powered by Gemini 2.5 Flash)
      const res = await api.ai.chat({
        message: text,
        image: imgToSend,
        history,
        city: selectedCity === 'All Cities' ? '' : selectedCity,
        context: {
          currentRoute,
          activeProperty: activeProperty ? { id: activeProperty.id, title: activeProperty.title, rent: activeProperty.rent, locality: activeProperty.locality } : null,
          activeRoommate: activeRoommate ? { id: activeRoommate.id, name: activeRoommate.name } : null
        }
      });

      const replyText = res?.reply || res?.text || res?.data?.reply;

      if (replyText) {
        // Find matching properties if user searched for houses or rooms
        let recommendedProps = undefined;
        const qLower = text.toLowerCase();
        if (qLower.includes('cheap') || qLower.includes('room') || qLower.includes('house') || qLower.includes('flat') || qLower.includes('find') || qLower.includes('best') || qLower.includes('5000') || qLower.includes('5k')) {
          recommendedProps = properties.filter(p => {
            if (selectedCity && selectedCity !== 'All Cities') {
              const target = selectedCity.toLowerCase().replace(' ncr', '');
              if (!p.city?.toLowerCase().includes(target) && !p.locality?.toLowerCase().includes(target)) return false;
            }
            return (p.availabilityStatus || 'available') === 'available';
          }).slice(0, 2);
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: replyText,
            properties: recommendedProps && recommendedProps.length > 0 ? recommendedProps : undefined,
            provider: res?.provider || 'gemini-2.5-flash',
            followUps: res?.followUps || [
              'Is there any gym or barber shop near me?',
              'Find me best with cheap house in this area',
              'What should I check before renting a room?'
            ]
          }
        ]);
      } else {
        throw new Error('No reply from AI service');
      }
    } catch (err) {
      console.warn('AI API fallback to local generator:', err.message);
      const fallback = generateAIResponse({
        query: text,
        context: { currentRoute, activeProperty, activeRoommate },
        properties,
        roommates
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: fallback.text,
          properties: fallback.properties,
          roommates: fallback.roommates,
          followUps: fallback.followUps
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAutoDetectNearby = async () => {
    setTypingStatus('Auto-detecting your location & nearby amenities…');
    setIsTyping(true);
    try {
      const loc = await detectLocation();
      const locAddress = loc.formattedAddress || `${loc.locality}, ${loc.cityName}`;

      setMessages(prev => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          sender: 'user',
          text: `📍 Auto-detect my location to find nearby stays, gyms & barbers\n(Detected: ${locAddress})`
        }
      ]);

      const res = await api.ai.chat({
        message: `The user activated GPS auto-detection and is located at "${loc.locality}, ${loc.cityName}". Provide a dedicated, concise neighborhood guide for ${loc.locality}, ${loc.cityName} listing walking-distance gyms, barber shops, student tiffin mess options, and recommend closest verified HomeLink rooms near ${loc.locality}.`,
        city: loc.cityId,
        context: {
          detectedLocality: loc.locality,
          detectedCity: loc.cityName,
          userLocation: loc
        }
      });

      const replyText = res?.reply || res?.text || res?.data?.reply;

      const nearbyProps = properties.filter(p => {
        const target = (loc.cityId || '').toLowerCase().replace(' ncr', '');
        return (p.city?.toLowerCase().includes(target) || p.locality?.toLowerCase().includes(target)) &&
          (p.availabilityStatus || 'available') === 'available';
      }).slice(0, 3);

      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: replyText || `📍 Location Detected: **${locAddress}** (GPS Accuracy: ~${loc.accuracyMeters}m)\n\nHere are the top-rated local amenities and verified stays near you:`,
          properties: nearbyProps.length > 0 ? nearbyProps : undefined,
          provider: res?.provider || 'gemini-3.6-flash',
          followUps: [
            `Show cheapest rooms near ${loc.locality}`,
            `Show top gyms near ${loc.locality}`,
            `Show haircut salons near ${loc.locality}`
          ]
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `⚠️ Could not detect GPS position: ${err.message || 'Permission denied'}.\n\nPlease select your city from the top dropdown or tell me your area name (e.g. *GTB Nagar Delhi*, *Koramangala Bangalore*, *Civil Lines Rewa*)!`
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickSuggestion = (suggestion) => {
    if (suggestion.includes('Auto-detect') || suggestion.includes('location')) {
      handleAutoDetectNearby();
    } else {
      handleSend(suggestion);
    }
  };

  const handleNavigateProperty = (propId) => {
    setIsOpen(false);
    navigate('rental-detail', { propertyId: propId });
  };

  const handleNavigateRoommate = (rmId) => {
    setIsOpen(false);
    navigate('roommate-detail', { roommateId: rmId });
  };

  const quickChips = [
    { label: '📍 Auto-Detect Location', query: '📍 Auto-detect my location to find nearby places', isGps: true },
    { label: '🏋️ Gyms & Barbers Near Me', query: 'Is there any gym or barber shop near me?' },
    { label: '💰 Best Cheap Houses', query: 'Find me best with cheap house in this area' },
    { label: '🏠 Rooms Under ₹5,000', query: 'Find verified rooms under ₹5,000 with 0% brokerage' },
    { label: '🤝 Find a Roommate', query: 'How can I find a verified flatmate here?' },
    { label: '💡 What to Ask Owner', query: 'What should I ask the owner before renting?' }
  ];

  const isDetailPage = currentRoute === 'rental-detail' || currentRoute === 'roommate-detail';

  return (
    <>
      {/* 1. FLOATING AI ASSISTANT BUTTON */}
      <div className={`fixed right-4 md:right-6 z-40 flex items-center transition-all duration-300 ${
        isDetailPage ? 'bottom-24 md:bottom-24' : 'bottom-20 md:bottom-6'
      }`}>
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setIsMinimized(false);
          }}
          className="group relative flex items-center gap-2.5 p-3 md:py-3 md:px-4 rounded-full bg-primary-container hover:bg-primary text-white shadow-xl shadow-primary-container/30 active:scale-95 transition-all duration-300 cursor-pointer border border-white/20 select-none"
          title="Open HomeLink AI Assistant"
        >
          {/* Animated AI Icon */}
          <div className="relative w-6 h-6 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl transition-transform duration-300 group-hover:rotate-12">
              smart_toy
            </span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-primary-container animate-pulse" />
          </div>

          {/* Collapsible Text Label */}
          <span
            className={`font-black text-xs md:text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${
              isLabelExpanded ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0 md:max-w-xs md:opacity-100'
            }`}
          >
            AI Assistant
          </span>

          {/* Notification bubble if unopened */}
          {!isOpen && (
            <span className="absolute -top-1 -left-1 px-1.5 py-0.2 rounded-full bg-secondary text-white text-[9px] font-black uppercase tracking-wider shadow-sm ring-1 ring-white">
              AI
            </span>
          )}
        </button>
      </div>

      {/* 2. CHATBOT MODAL PANEL */}
      {isOpen && (
        <div
          className={`fixed z-50 bg-surface-container-lowest transition-all duration-300 ${
            isMinimized
              ? 'bottom-20 md:bottom-6 right-4 md:right-6 w-72 rounded-2xl border border-primary-container/30 shadow-xl overflow-hidden'
              : 'inset-x-0 bottom-0 max-h-[85vh] h-[82vh] rounded-t-3xl md:inset-auto md:bottom-6 md:right-6 md:w-[420px] md:h-[620px] md:max-h-[88vh] md:rounded-3xl border border-outline-variant/40 shadow-2xl flex flex-col overflow-hidden'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-surface-container border-b border-outline-variant/30 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary-container text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-xl">smart_toy</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-extrabold text-sm text-on-surface leading-tight">
                    AI Assistant
                  </h3>
                  <button
                    type="button"
                    onClick={handleAutoDetectNearby}
                    disabled={userLocation?.isDetecting || isTyping}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-extrabold bg-primary-container/15 hover:bg-primary-container/25 text-primary border border-primary-container/30 transition-all cursor-pointer shadow-2xs active:scale-95"
                    title="Click to auto-detect your location via GPS"
                  >
                    <span className={`material-symbols-outlined text-xs text-primary-container ${userLocation?.isDetecting ? 'animate-spin' : ''}`}>
                      {userLocation?.isDetecting ? 'progress_activity' : 'near_me'}
                    </span>
                    <span className="max-w-[100px] truncate">
                      {userLocation?.detected ? (userLocation.locality || activeCityName) : 'Auto-Detect'}
                    </span>
                  </button>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-outline font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Powered by Gemini • Zero Brokerage</span>
                </div>
              </div>
            </div>

            {/* Header Control Buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                <span className="material-symbols-outlined text-lg leading-none">
                  {isMinimized ? 'unfold_more' : 'minimize'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error/10 transition-colors cursor-pointer"
                title="Close AI Assistant"
              >
                <span className="material-symbols-outlined text-lg leading-none">close</span>
              </button>
            </div>
          </div>

          {/* If minimized, hide body */}
          {!isMinimized && (
            <>
              {/* Context Pill (if viewing specific property or roommate) */}
              {activeProperty && currentRoute === 'rental-detail' && (
                <div className="px-4 py-1.5 bg-primary-container/10 border-b border-primary-container/20 flex items-center justify-between text-xs shrink-0">
                  <div className="flex items-center gap-1.5 text-primary font-bold truncate">
                    <span className="material-symbols-outlined text-sm shrink-0">apartment</span>
                    <span className="truncate">Viewing: {activeProperty.title}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-outline shrink-0 ml-2">Context Active</span>
                </div>
              )}

              {/* Chat Message Scrollable Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface/50">
                {/* Quick Suggestion Chips */}
                <div className="space-y-1.5 pb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-outline px-1">
                    Suggested Questions
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {quickChips.map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleQuickSuggestion(chip.query)}
                        className="px-2.5 py-1 rounded-full bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/50 hover:border-primary-container text-on-surface text-xs font-semibold whitespace-nowrap shadow-2xs transition-all cursor-pointer shrink-0 active:scale-95"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Messages List */}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
                  >
                    {/* Message Bubble */}
                    <div
                      className={`max-w-[88%] p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-primary-container text-white rounded-br-xs shadow-xs'
                          : 'bg-surface-container-lowest border border-outline-variant/40 text-on-surface rounded-bl-xs shadow-xs'
                      }`}
                    >
                      {/* Attached Image inside User or AI Message */}
                      {msg.image && (
                        <div className="mb-2.5 rounded-xl overflow-hidden border border-white/20 shadow-xs max-w-[240px]">
                          <img src={msg.image} alt="uploaded room" className="w-full h-auto object-cover max-h-48" />
                          <span className="block px-2 py-0.5 text-[10px] font-bold bg-black/60 text-white">
                            🔍 AI Photo Authenticity Scan
                          </span>
                        </div>
                      )}

                      {/* Clean Professional Formatted Message (No raw # or * code words) */}
                      <FormattedMessage text={msg.text} isUser={msg.sender === 'user'} />

                      {/* Embedded Recommended Property Cards */}
                      {msg.properties && msg.properties.length > 0 && (
                        <div className="mt-3 space-y-2 pt-2 border-t border-outline-variant/30">
                          <span className="text-[11px] font-bold text-outline block">
                            Recommended Verified Stays:
                          </span>
                          {msg.properties.map((prop) => (
                            <div
                              key={prop.id}
                              className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 hover:border-primary-container transition-all flex flex-col gap-1.5 shadow-2xs"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <span className="font-black text-sm text-primary">
                                    ₹{prop.rent.toLocaleString('en-IN')}/mo
                                  </span>
                                  <h4 className="font-bold text-xs text-on-surface line-clamp-1">
                                    {prop.title}
                                  </h4>
                                </div>
                                <DemoBadge size="sm" />
                              </div>

                              <div className="flex items-center gap-2 text-[11px] text-outline">
                                <span className="flex items-center gap-0.5 truncate">
                                  <span className="material-symbols-outlined text-[13px] text-primary">location_on</span>
                                  {prop.locality}
                                </span>
                                <span>•</span>
                                <span>{prop.furnished}</span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleNavigateProperty(prop.id)}
                                className="mt-1 w-full py-1.5 rounded-lg bg-primary-container hover:bg-primary text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                              >
                                <span>View Listing</span>
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Follow-up question chips */}
                    {msg.followUps && msg.followUps.length > 0 && msg.sender === 'ai' && (
                      <div className="flex flex-wrap gap-1.5 pt-1 pl-1">
                        {msg.followUps.map((fu, fIdx) => (
                          <button
                            key={fIdx}
                            type="button"
                            onClick={() => handleQuickSuggestion(fu)}
                            className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 text-on-surface text-[11px] font-semibold transition-all cursor-pointer shadow-2xs active:scale-95"
                          >
                            💬 {fu}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Animated Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 w-fit">
                    <span className="material-symbols-outlined text-base text-primary animate-spin">
                      progress_activity
                    </span>
                    <span className="text-xs text-outline font-semibold">{typingStatus}</span>
                    <div className="flex gap-1 ml-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Attached Photo Preview Pill */}
              {attachedImage && (
                <div className="px-3 pt-2.5 pb-2 bg-surface-container-lowest flex items-center justify-between border-t border-outline-variant/30 animate-fadeIn">
                  <div className="flex items-center gap-2.5">
                    <img src={attachedImage} alt="preview" className="w-10 h-10 rounded-lg object-cover border border-primary-container shadow-xs" />
                    <div className="text-[11px] leading-tight">
                      <span className="font-extrabold text-on-surface block">Photo Attached</span>
                      <span className="text-emerald-600 text-[10px] font-bold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[12px]">verified_user</span>
                        Gemini Authenticity Verification Active
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAttachedImage(null)}
                    className="w-6 h-6 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center cursor-pointer transition-colors"
                    title="Remove photo"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              )}

              {/* Chat Input Bar fixed at bottom */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="p-3 bg-surface-container-lowest border-t border-outline-variant/30 flex items-center gap-2 shrink-0"
              >
                {/* Photo Upload Trigger Button */}
                <label
                  className="p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface cursor-pointer shrink-0 transition-colors flex items-center justify-center border border-outline-variant/40"
                  title="Upload room photo to verify real vs AI-generated"
                >
                  <span className="material-symbols-outlined text-lg leading-none text-primary-container">
                    photo_camera
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>

                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={attachedImage ? 'Ask about this photo (or hit send to verify)…' : `Ask or upload room photo to verify…`}
                    className="w-full text-xs md:text-sm font-medium text-on-surface bg-surface-container rounded-xl px-3.5 py-2.5 border border-outline-variant/40 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 focus:outline-none transition-all placeholder:text-outline"
                  />
                </div>

                <button
                  type="submit"
                  disabled={(!inputValue.trim() && !attachedImage) || isTyping}
                  className="p-2.5 rounded-xl bg-primary-container hover:bg-primary disabled:bg-outline-variant/40 text-white font-bold transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed shrink-0 flex items-center justify-center"
                  title="Send message"
                >
                  <span className="material-symbols-outlined text-lg leading-none">send</span>
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
