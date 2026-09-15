import React, { useState } from 'react';
import { X, AlertTriangle, FileX2 } from 'lucide-react';
import { VerificationApplication } from '../types';

interface RejectVerificationModalProps {
  application: VerificationApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmReject: (applicationId: string, reason: string) => void;
}

const PRESET_REASONS = [
  'Illegible or low-resolution document scan',
  'Land Title / 7-12 record name does not match applicant identification',
  'Expired GSTIN certificate or APMC trade license',
  'Unaccredited or unverified organic certification credential',
  'Missing mandatory government stamp or revenue officer seal',
  'Other operational / compliance discrepancy',
];

export const RejectVerificationModal: React.FC<RejectVerificationModalProps> = ({
  application,
  isOpen,
  onClose,
  onConfirmReject,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>(PRESET_REASONS[0]);
  const [customReason, setCustomReason] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!isOpen || !application) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = customReason.trim() 
      ? `${selectedPreset}: ${customReason.trim()}`
      : selectedPreset;

    if (!finalReason.trim()) {
      setError('Please provide a specific rejection reason for the applicant.');
      return;
    }

    onConfirmReject(application.id, finalReason);
    setCustomReason('');
    setError('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reject-modal-title"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-start justify-between gap-3 bg-rose-950/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <FileX2 className="w-5 h-5" />
            </div>
            <div>
              <h3 id="reject-modal-title" className="text-base font-bold text-slate-100">
                Reject Verification Application
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Applicant: <span className="text-slate-200 font-medium">{application.applicantName}</span> ({application.role})
              </p>
            </div>
          </div>
          <button
            id="reject-modal-close-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
            aria-label="Close rejection dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 text-xs text-amber-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Mandatory Requirement: </span>
              A documented reason is required. This explanation will be logged in the applicant audit trail and transmitted via SMS/email notification for re-upload.
            </div>
          </div>

          {/* Reason Category Selector */}
          <div>
            <label htmlFor="rejection-preset-select" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Primary Rejection Category <span className="text-rose-400">*</span>
            </label>
            <select
              id="rejection-preset-select"
              value={selectedPreset}
              onChange={(e) => {
                setSelectedPreset(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              required
            >
              {PRESET_REASONS.map((reason, idx) => (
                <option key={idx} value={reason} className="bg-slate-900 text-slate-200">
                  {reason}
                </option>
              ))}
            </select>
          </div>

          {/* Detailed Clarification Notes */}
          <div>
            <label htmlFor="rejection-notes-textarea" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Additional Details & Guidance for Applicant <span className="text-rose-400">*</span>
            </label>
            <textarea
              id="rejection-notes-textarea"
              rows={3}
              value={customReason}
              onChange={(e) => {
                setCustomReason(e.target.value);
                if (error) setError('');
              }}
              placeholder="Specify the exact issue (e.g., 'Please re-upload page 2 of the 7/12 land record showing survey number 148/2 with clear official revenue stamp.')"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 resize-none"
              required
            />
            {error && (
              <p className="text-xs text-rose-400 mt-1 font-medium">{error}</p>
            )}
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-950/50 p-2.5 rounded border border-slate-800">
            Documents attached to this queue: <span className="text-slate-300 font-mono">{application.submittedDocuments.map(d => d.name).join(', ')}</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              id="reject-modal-cancel-btn"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="reject-modal-confirm-btn"
              className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400"
            >
              Confirm Rejection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
