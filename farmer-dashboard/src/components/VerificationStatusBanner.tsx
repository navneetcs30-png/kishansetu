import React from 'react';
import { ShieldCheck, Clock, AlertTriangle, FileUp, Award, RefreshCw, FileText } from 'lucide-react';
import { FarmerDocumentSubmission } from '../types';

interface VerificationStatusBannerProps {
  submission?: FarmerDocumentSubmission;
  onOpenUploadModal: () => void;
}

export const VerificationStatusBanner: React.FC<VerificationStatusBannerProps> = ({
  submission,
  onOpenUploadModal,
}) => {
  const status = submission?.status || 'not_submitted';

  if (status === 'verified') {
    return (
      <div className="bg-gradient-to-r from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-emerald-950/40 border border-emerald-300/80 dark:border-emerald-800 rounded-2xl p-4 sm:p-5 shadow-xs mb-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
              <Award className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-700">
                  Aadhaar Verified Kisan
                </span>
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  Registration ID: {submission?.kisanRegistrationNumber || 'KISAN-MP-2026-7842'}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                Identity Verified • {submission?.farmerName} ({submission?.village}, {submission?.district})
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Aadhaar card ({submission?.aadhaarNumber}) verified by {submission?.reviewedBy || 'District Agriculture Officer'}. Authorized for APMC MSP procurement & PM-KISAN DBT payouts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center flex-shrink-0">
            <button
              type="button"
              onClick={onOpenUploadModal}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 transition-colors shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>View Uploaded Document</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl p-4 sm:p-5 shadow-xs mb-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
              <Clock className="w-5 h-5 animate-pulse" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider bg-amber-200/80 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-md border border-amber-300 dark:border-amber-700">
                  Verification In Progress
                </span>
                <span className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                  Submitted on {submission?.submissionDate}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-amber-950 dark:text-amber-100 mt-1">
                Aadhaar Document Awaiting Admin Verification ({submission?.farmerName})
              </h3>
              <p className="text-xs text-amber-900/80 dark:text-amber-200/80 mt-0.5">
                Your Aadhaar card ({submission?.documentFileName}) has been submitted successfully. The Agriculture Officer will review and verify your identity in the Admin portal.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center flex-shrink-0">
            <button
              type="button"
              onClick={onOpenUploadModal}
              className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-amber-100/50 dark:hover:bg-slate-700 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 transition-colors shadow-2xs"
            >
              Update / Re-submit Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="bg-rose-50/90 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-2xl p-4 sm:p-5 shadow-xs mb-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
              <AlertTriangle className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider bg-rose-200 dark:bg-rose-900/80 text-rose-900 dark:text-rose-200 px-2 py-0.5 rounded-md border border-rose-300 dark:border-rose-700">
                  Action Required
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-rose-950 dark:text-rose-100 mt-1">
                Document Needs Re-upload ({submission?.farmerName})
              </h3>
              <p className="text-xs text-rose-900/90 dark:text-rose-200/90 mt-0.5">
                <span className="font-semibold">Reason from Agriculture Officer:</span> {submission?.adminRemarks || 'Document scan was illegible or incomplete.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center flex-shrink-0">
            <button
              type="button"
              onClick={onOpenUploadModal}
              className="text-xs font-bold px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Re-upload Aadhaar Card</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not submitted yet
  return (
    <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 dark:from-emerald-950 dark:to-emerald-900 border border-emerald-800/80 text-white rounded-2xl p-4 sm:p-5 shadow-sm mb-6 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-700/80 border border-emerald-600 flex items-center justify-center flex-shrink-0 text-amber-300">
            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-amber-400 text-emerald-950 px-2 py-0.5 rounded-md font-sans">
                Mandatory KYC
              </span>
              <span className="text-xs text-emerald-200">
                Government Identity Authentication
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold mt-1 text-white">
              Upload Your Aadhaar Card for Farmer Verification
            </h3>
            <p className="text-xs text-emerald-200/90 mt-0.5">
              Farmers must upload Aadhaar documentation for administrative verification by the Agriculture Officer to activate official MSP procurement tokens and PM-KISAN schemes.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenUploadModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-emerald-900 flex-shrink-0"
        >
          <FileUp className="w-4 h-4 text-emerald-950" />
          <span>Upload Aadhaar Card</span>
        </button>
      </div>
    </div>
  );
};

