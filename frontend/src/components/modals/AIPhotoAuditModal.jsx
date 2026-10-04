import React from 'react';

export default function AIPhotoAuditModal({ isOpen, onClose, auditData, photoUrl, onRemovePhoto }) {
  if (!isOpen || !auditData) return null;

  const isReal = auditData.isReal === true;
  const isAiGen = auditData.isAiGenerated === true || auditData.verdict === 'AI_GENERATED';
  const isCgi = auditData.isRenderOrCgi === true || auditData.verdict === 'SYNTHETIC_OR_CGI';
  const score = auditData.authenticityScore ?? (isReal ? 95 : 12);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-surface-container-lowest rounded-3xl max-w-lg w-full border border-outline-variant/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low/50">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isReal ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
            }`}>
              <span className="material-symbols-outlined text-xl">
                {isReal ? 'verified_user' : 'warning'}
              </span>
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-on-surface flex items-center gap-1.5">
                AI Photo Authenticity Audit
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-fixed/30 text-primary-container">
                  Gemini 3.5 Vision
                </span>
              </h3>
              <p className="text-[11px] text-outline">Real-Time Forensic Optical Verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Photo & Score Banner */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {photoUrl && (
              <div className="relative w-32 h-28 rounded-2xl overflow-hidden shrink-0 border border-outline-variant/40 shadow-inner">
                <img src={photoUrl} alt="inspected" className="w-full h-full object-cover" />
                <div className={`absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  isReal ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}>
                  {isReal ? 'Real' : 'Flagged'}
                </div>
              </div>
            )}

            <div className="flex-1 w-full space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-outline">Authenticity Score</span>
                <span className={`text-base font-black ${
                  score >= 80 ? 'text-emerald-600' : score >= 50 ? 'text-amber-500' : 'text-rose-600'
                }`}>
                  {score} / 100
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-surface-container overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${
                    score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-400' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.max(5, Math.min(100, score))}%` }}
                />
              </div>

              {/* Status Badge */}
              <div className="pt-1">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold ${
                  isReal
                    ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/30'
                    : isAiGen
                    ? 'bg-rose-500/10 text-rose-700 border border-rose-500/30'
                    : 'bg-amber-500/10 text-amber-700 border border-amber-500/30'
                }`}>
                  <span className="material-symbols-outlined text-sm">
                    {isReal ? 'check_circle' : 'error'}
                  </span>
                  {auditData.badgeText || (isReal ? 'Verified Real Photo' : 'Flagged as Synthetic / AI')}
                </span>
              </div>
            </div>
          </div>

          {/* AI Executive Verdict */}
          <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-outline block">
              AI Forensic Summary
            </span>
            <p className="text-xs text-on-surface leading-relaxed font-medium">
              {auditData.summary || 'Image was evaluated against deep optical markers, camera noise consistency, and synthetic diffusion signatures.'}
            </p>
          </div>

          {/* Key Forensic Evidence Reasons */}
          {auditData.reasons && auditData.reasons.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-outline block">
                Evidence & Optical Signals Analyzed:
              </span>
              <ul className="space-y-2">
                {auditData.reasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-on-surface">
                    <span className={`material-symbols-outlined text-sm shrink-0 mt-0.5 ${
                      isReal ? 'text-emerald-500' : 'text-rose-500'
                    }`}>
                      {isReal ? 'verified' : 'cancel'}
                    </span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Policy Notice */}
          <div className={`p-3 rounded-2xl text-[11px] font-medium leading-relaxed ${
            isReal
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            {isReal ? (
              <p>
                <strong>HomeLink Quality Guarantee:</strong> This photo has passed AI authenticity verification and will show a "Verified Real" seal to build instant trust with prospective tenants.
              </p>
            ) : (
              <p>
                <strong>Anti-Fraud Protection:</strong> HomeLink prohibits AI-generated or synthetic 3D renders for property listings. Please upload or take live camera photos of your actual room to avoid listing rejection.
              </p>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-outline-variant/30 bg-surface-container-low/50 flex items-center justify-between gap-3">
          {!isReal && onRemovePhoto ? (
            <button
              type="button"
              onClick={() => {
                onRemovePhoto();
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
              Remove Flagged Photo
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-primary-container hover:bg-primary text-white text-xs font-extrabold transition-all cursor-pointer ml-auto shadow-sm"
          >
            {isReal ? 'Done' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
