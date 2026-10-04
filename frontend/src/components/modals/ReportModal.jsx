import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function ReportModal() {
  const { reportModalOpen, setReportModalOpen, reportedTarget } = useApp();
  const [reason, setReason] = useState('Spam or Brokerage Violation');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!reportModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setReportModalOpen(false);
      setDetails('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="bg-surface-container-lowest rounded-3xl max-w-md w-full border border-outline-variant/40 shadow-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setReportModalOpen(false)}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        <div className="w-12 h-12 rounded-2xl bg-error-container text-error flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-2xl">flag</span>
        </div>

        <h2 className="text-xl font-extrabold text-on-surface">
          Report {reportedTarget?.type || 'Listing / User'}
        </h2>
        <p className="text-xs text-outline mt-1">
          HomeLink Rewa maintains a strict zero-brokerage, anti-harassment policy. Every report is audited within 2 hours.
        </p>

        {submitted ? (
          <div className="py-8 text-center">
            <span className="material-symbols-outlined text-4xl text-emerald-600 mb-2">
              task_alt
            </span>
            <h3 className="font-bold text-base text-on-surface">Report Submitted</h3>
            <p className="text-xs text-outline mt-1">
              Thank you for keeping the Rewa housing community safe.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">
                Primary Issue
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm font-semibold text-on-surface bg-surface-container-low focus:border-primary-container focus:outline-none"
              >
                <option>Charging Brokerage / Commission</option>
                <option>Fake Photos or Inaccurate Rent</option>
                <option>Unresponsive or Abusive Behavior</option>
                <option>Suspicious Payment Demand</option>
                <option>Other Community Guideline Violation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">
                Additional Comments (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Describe what occurred..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full px-3 py-2 text-sm text-on-surface rounded-xl border border-outline-variant bg-surface-container-low focus:border-primary-container focus:outline-none resize-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-surface-container text-on-surface text-xs font-bold hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-error text-white text-xs font-bold hover:bg-error/90 transition-colors shadow-sm cursor-pointer"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
