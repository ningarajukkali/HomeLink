import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import DemoBadge from '../components/DemoBadge';

export default function ChatView() {
  const {
    chats,
    activeChatUserId,
    setActiveChatUserId,
    sendMessage,
    roommates,
    goBack,
    setReportModalOpen,
    setReportedTarget
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef(null);

  const connectedRoommates = roommates.filter(r => r.requestStatus === 'connected');
  const targetUser = roommates.find(r => r.id === activeChatUserId) || connectedRoommates[0] || roommates[0];
  const activeMessages = chats[targetUser.id] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    sendMessage(targetUser.id, inputVal);
    setInputVal('');
  };

  const handleReport = () => {
    setShowMenu(false);
    setReportedTarget({ type: 'Chat User', id: targetUser.id, title: targetUser.name });
    setReportModalOpen(true);
  };

  const handleBlock = () => {
    setShowMenu(false);
    alert(`${targetUser.name} has been blocked and removed from your conversations.`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 flex flex-col h-[calc(100vh-4.5rem)]">
      {/* Chat Top Header matching Stitch 83a6d4899b304c989ba7fd4c95b7f7a7 */}
      <div className="flex items-center justify-between p-3.5 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </button>

          <div className="relative">
            <img
              src={targetUser.avatar}
              alt={targetUser.name}
              className="w-10 h-10 rounded-xl object-cover border border-primary-container"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-sm text-on-surface">{targetUser.name}</h3>
              <DemoBadge size="sm" />
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                {targetUser.matchScore}% Match
              </span>
            </div>
            <p className="text-[11px] text-outline">{targetUser.occupation}</p>
          </div>
        </div>

        {/* Safety & Options Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline hover:text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">more_vert</span>
          </button>

          {showMenu && (
            <div className="absolute right-0 top-10 w-44 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-xl py-1.5 z-30">
              <button
                onClick={handleReport}
                className="w-full px-3.5 py-2 text-left text-xs font-bold text-error hover:bg-surface-container flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">flag</span>
                <span>Report User</span>
              </button>
              <button
                onClick={handleBlock}
                className="w-full px-3.5 py-2 text-left text-xs font-bold text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">block</span>
                <span>Block User</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Security & Demo Disclaimer Banner */}
      <div className="my-2 p-2 px-3 rounded-xl bg-surface-container/70 border border-outline-variant/30 flex items-center gap-2 text-[11px] text-outline font-medium shrink-0">
        <span className="material-symbols-outlined text-base text-primary-container shrink-0">
          lock
        </span>
        <span>
          Simulated demo conversation. Real tenant & roommate direct messaging unlocks after HomeLink launch.
        </span>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-3 p-2">
        {activeMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-sm ${
                msg.isMe
                  ? 'bg-primary-container text-white rounded-br-none'
                  : 'bg-surface-container text-on-surface rounded-bl-none border border-outline-variant/30'
              }`}
            >
              <p className="leading-relaxed">{msg.text}</p>
            </div>
            <span className="text-[10px] font-semibold text-outline/80 mt-1 px-1">
              {msg.timestamp}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Bar */}
      <form onSubmit={handleSend} className="pt-2 shrink-0">
        <div className="flex items-center gap-2 bg-surface-container-lowest p-2 rounded-2xl border border-outline-variant/60 shadow-md focus-within:border-primary-container transition-all">
          <button
            type="button"
            onClick={() => alert('Media attachments enabled for camera room photos in verified conversations.')}
            className="p-2 text-outline hover:text-on-surface cursor-pointer"
            title="Attach image"
          >
            <span className="material-symbols-outlined text-xl">attach_file</span>
          </button>

          <input
            type="text"
            placeholder={`Message ${targetUser.name}...`}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 text-xs font-semibold text-on-surface bg-transparent focus:outline-none"
          />

          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="w-10 h-10 rounded-xl bg-primary-container text-white flex items-center justify-center hover:bg-primary shadow-sm transition-all cursor-pointer disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-xl">send</span>
          </button>
        </div>
      </form>
    </div>
  );
}
