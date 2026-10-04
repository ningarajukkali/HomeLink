import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import DemoBadge from '../components/DemoBadge';
import DemoNoticeBanner from '../components/DemoNoticeBanner';

export default function RoommateRequestsView() {
  const {
    roommates,
    acceptRoommateRequest,
    declineRoommateRequest,
    setActiveChatUserId,
    navigate,
    goBack
  } = useApp();

  const [activeTab, setActiveTab] = useState('received'); // 'received' | 'connected' | 'sent'

  const received = roommates.filter(r => r.requestStatus === 'received');
  const connected = roommates.filter(r => r.requestStatus === 'connected');
  const sent = roommates.filter(r => r.requestStatus === 'sent');

  const handleOpenChat = (rmId) => {
    setActiveChatUserId(rmId);
    navigate('chat', { roommateId: rmId });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-20 md:pb-12">
      {/* Header matching Stitch 31029d1d7e0740ffb0488e95747bdfa7 */}
      <div className="flex items-center gap-3 pb-3 border-b border-outline-variant/30">
        <button
          onClick={goBack}
          className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-on-surface">
            Roommate Requests & Connections
          </h1>
          <p className="text-xs text-outline font-medium">Manage mutual requests & unlocked chat</p>
        </div>
      </div>

      {/* Demo Notice */}
      <DemoNoticeBanner message="Roommate profiles and connection requests are demo data for platform preview." />

      {/* Safety Banner */}
      <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/40 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-container/10 text-primary-container flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-2xl">lock</span>
        </div>
        <p className="text-xs text-outline leading-tight">
          <strong className="text-on-surface">Privacy Guaranteed:</strong> Direct messaging is encrypted and unlocks only after mutual approval between both parties.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex rounded-2xl bg-surface-container p-1 text-xs font-extrabold">
        <button
          onClick={() => setActiveTab('received')}
          className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'received'
              ? 'bg-surface-container-lowest text-primary shadow-sm'
              : 'text-outline hover:text-on-surface'
          }`}
        >
          <span>Received</span>
          {received.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-primary-container text-white text-[10px] flex items-center justify-center font-bold">
              {received.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('connected')}
          className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'connected'
              ? 'bg-surface-container-lowest text-primary shadow-sm'
              : 'text-outline hover:text-on-surface'
          }`}
        >
          <span>Connected</span>
          <span className="text-outline font-bold">({connected.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'sent'
              ? 'bg-surface-container-lowest text-primary shadow-sm'
              : 'text-outline hover:text-on-surface'
          }`}
        >
          <span>Sent</span>
          <span className="text-outline font-bold">({sent.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'received' && (
          received.length > 0 ? (
            received.map(rm => (
              <div
                key={rm.id}
                className="p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rm.avatar}
                      alt={rm.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-primary-container"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-on-surface">{rm.name}</h4>
                        <DemoBadge size="sm" />
                      </div>
                      <p className="text-xs text-outline">{rm.occupation}</p>
                      <span className="text-[11px] font-bold text-secondary">{rm.location}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-bold">
                    {rm.matchScore}% Match
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant bg-surface-container-low p-3 rounded-xl leading-relaxed">
                  "{rm.bio}"
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => declineRoommateRequest(rm.id)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-surface-container text-outline hover:text-error text-xs font-bold transition-colors cursor-pointer"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => acceptRoommateRequest(rm.id)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-primary-container text-white text-xs font-bold hover:bg-primary shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">check</span>
                    <span>Accept & Chat</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-surface-container-lowest rounded-3xl border border-outline-variant/30">
              <span className="material-symbols-outlined text-3xl text-outline mb-2">mark_email_read</span>
              <p className="text-xs font-bold text-outline">No pending incoming requests.</p>
            </div>
          )
        )}

        {activeTab === 'connected' && (
          connected.length > 0 ? (
            connected.map(rm => (
              <div
                key={rm.id}
                className="p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={rm.avatar}
                      alt={rm.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-emerald-500"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-[10px]">check</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-on-surface">{rm.name}</h4>
                      <DemoBadge size="sm" />
                    </div>
                    <p className="text-xs text-outline">{rm.occupation}</p>
                    <span className="text-[11px] font-bold text-emerald-700">Connected (Demo) ✓</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenChat(rm.id)}
                  className="py-2.5 px-4 rounded-xl bg-primary-container text-white text-xs font-bold hover:bg-primary shadow-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span className="material-symbols-outlined text-base">chat</span>
                  <span>Chat</span>
                </button>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-surface-container-lowest rounded-3xl border border-outline-variant/30">
              <span className="material-symbols-outlined text-3xl text-outline mb-2">group_off</span>
              <p className="text-xs font-bold text-outline">No connected flatmates yet.</p>
            </div>
          )
        )}

        {activeTab === 'sent' && (
          sent.length > 0 ? (
            sent.map(rm => (
              <div
                key={rm.id}
                className="p-4 rounded-3xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={rm.avatar}
                    alt={rm.name}
                    className="w-11 h-11 rounded-2xl object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-on-surface">{rm.name}</h4>
                      <DemoBadge size="sm" />
                    </div>
                    <p className="text-xs text-outline">{rm.occupation}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-surface-container text-outline text-xs font-bold">
                  Pending Approval
                </span>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-surface-container-lowest rounded-3xl border border-outline-variant/30">
              <span className="material-symbols-outlined text-3xl text-outline mb-2">send</span>
              <p className="text-xs font-bold text-outline">You haven't sent any requests yet.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
