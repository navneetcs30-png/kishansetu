import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Eye,
  ArrowLeft,
  FileText,
  UserCheck,
  AlertCircle,
  Award,
  RefreshCw,
} from 'lucide-react';
import { FarmerDocumentSubmission } from '../types';

interface AdminVerificationDeskProps {
  submissions: FarmerDocumentSubmission[];
  onApprove: (id: string, remarks?: string) => void;
  onReject: (id: string, remarks: string) => void;
  onResetStatus: (id: string) => void;
  onBackToFarmerView: () => void;
}

export const AdminVerificationDesk: React.FC<AdminVerificationDeskProps> = ({
  submissions,
  onApprove,
  onReject,
  onResetStatus,
  onBackToFarmerView,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectingDoc, setInspectingDoc] = useState<FarmerDocumentSubmission | null>(null);
  const [rejectionRemark, setRejectionRemark] = useState<string>('Aadhaar photo or UIDAI number is unclear. Please re-upload a clear front/back scan.');
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);

  // Filtered list
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesFilter = filterStatus === 'all' || sub.status === filterStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      sub.farmerName.toLowerCase().includes(q) ||
      sub.aadhaarNumber.includes(q) ||
      sub.village.toLowerCase().includes(q) ||
      sub.district.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const pendingCount = submissions.filter((s) => s.status === 'pending').length;
  const verifiedCount = submissions.filter((s) => s.status === 'verified').length;
  const rejectedCount = submissions.filter((s) => s.status === 'rejected').length;

  const handleOpenReject = (sub: FarmerDocumentSubmission) => {
    setInspectingDoc(sub);
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    if (inspectingDoc) {
      onReject(inspectingDoc.id, rejectionRemark);
      setShowRejectModal(false);
      setInspectingDoc(null);
    }
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-20">
      {/* Top Banner & Return */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <button
            type="button"
            onClick={onBackToFarmerView}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-200 bg-emerald-100/70 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 px-3 py-1.5 rounded-lg mb-2 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600 border border-emerald-200/60 dark:border-emerald-800/60"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Farmer Dashboard</span>
          </button>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 font-display tracking-tight">
              Admin Verification Page (कृषि अधिकारी पोर्टल)
            </h1>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-950/80 text-purple-900 dark:text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
              Official Review
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Official portal for administrative review of farmer identity, Aadhaar documentation, and land records for DBT & MSP authorization
          </p>
        </div>

        {/* Officer info badge */}
        <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 px-3.5 flex items-center gap-3 text-xs self-start sm:self-center">
          <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold">
            AO
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-slate-100 block text-xs">Dr. R. K. Verma</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Block Agriculture Officer (BAO)</span>
          </div>
        </div>
      </div>

      {/* Administrative Authority Callout */}
      <div className="bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 rounded-xl p-3 px-4 mb-5 text-xs text-purple-950 dark:text-purple-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
          <span className="font-bold">Official Verification Desk:</span>
          <span className="text-purple-900/90 dark:text-purple-300/90 text-[11px]">
            Farmer KYC approvals and rejections are conducted exclusively on this page by authorized Agriculture Officers.
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase bg-purple-700 text-white px-2 py-0.5 rounded shadow-2xs whitespace-nowrap">
          Official Access
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
        <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 sm:p-4 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Total Submissions
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            {submissions.length}
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 block">Across all registered blocks</span>
        </div>

        <div className="bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3.5 sm:p-4 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 block flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
            Pending Verification
          </span>
          <div className="text-2xl font-black text-amber-900 dark:text-amber-200 mt-1">
            {pendingCount}
          </div>
          <span className="text-[10px] text-amber-700 dark:text-amber-400 mt-0.5 block">Requires officer review</span>
        </div>

        <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-3.5 sm:p-4 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Approved & Verified
          </span>
          <div className="text-2xl font-black text-emerald-900 dark:text-emerald-200 mt-1">
            {verifiedCount}
          </div>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5 block">Kisan IDs issued</span>
        </div>

        <div className="bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl p-3.5 sm:p-4 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 block flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            Rejected / Re-upload
          </span>
          <div className="text-2xl font-black text-rose-900 dark:text-rose-200 mt-1">
            {rejectedCount}
          </div>
          <span className="text-[10px] text-rose-700 dark:text-rose-400 mt-0.5 block">Clarification requested</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl p-3 sm:p-4 shadow-2xs mb-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: `All (${submissions.length})` },
            { id: 'pending', label: `Pending (${pendingCount})` },
            { id: 'verified', label: `Verified (${verifiedCount})` },
            { id: 'rejected', label: `Rejected (${rejectedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                filterStatus === tab.id
                  ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search name, Aadhaar, village..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-3.5">
        {filteredSubmissions.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl">
            <UserCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No submissions found</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try changing the status filter or search query.</p>
          </div>
        ) : (
          filteredSubmissions.map((sub) => {
            const isPending = sub.status === 'pending';
            const isVerified = sub.status === 'verified';
            const isRejected = sub.status === 'rejected';

            return (
              <div
                key={sub.id}
                className={`bg-white dark:bg-slate-800/80 border rounded-xl p-4 sm:p-5 shadow-2xs transition-all ${
                  isPending
                    ? 'border-amber-300 dark:border-amber-700/80 ring-1 ring-amber-100 dark:ring-amber-950/40'
                    : isVerified
                    ? 'border-emerald-200 dark:border-emerald-800/70'
                    : 'border-rose-200 dark:border-rose-800/70'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Farmer Info */}
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                        isPending
                          ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                          : isVerified
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                          : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300'
                      }`}
                    >
                      {isPending ? (
                        <Clock className="w-5 h-5" />
                      ) : isVerified ? (
                        <ShieldCheck className="w-5 h-5" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                          {sub.farmerName}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          Ph: {sub.phone}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            isPending
                              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                              : isVerified
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                              : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700'
                          }`}
                        >
                          {sub.status === 'pending'
                            ? 'Pending Review'
                            : sub.status === 'verified'
                            ? 'Approved & Verified'
                            : 'Clarification Needed'}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 flex items-center gap-2 flex-wrap">
                        <span>Aadhaar: <strong className="font-mono text-slate-900 dark:text-slate-100">{sub.aadhaarNumber}</strong></span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span>Location: {sub.village}, {sub.district} ({sub.state})</span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span>Holding: <strong>{sub.landSizeAcres} Acres</strong></span>
                      </div>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                        <span>Document: <strong className="text-slate-700 dark:text-slate-200">{sub.documentFileName}</strong> ({sub.documentType})</span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span>Submitted: {sub.submissionDate}</span>
                      </div>

                      {/* Admin Remarks / Registration ID if present */}
                      {sub.kisanRegistrationNumber && (
                        <div className="mt-2 text-xs font-medium text-emerald-900 dark:text-emerald-200 bg-emerald-50/80 dark:bg-emerald-950/50 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800 inline-block">
                          Kisan ID: <strong>{sub.kisanRegistrationNumber}</strong> (Approved by {sub.reviewedBy})
                        </div>
                      )}

                      {sub.adminRemarks && isRejected && (
                        <div className="mt-2 text-xs text-rose-900 dark:text-rose-200 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-1 rounded-md border border-rose-200 dark:border-rose-800">
                          <strong>Rejection Note:</strong> {sub.adminRemarks}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-start md:self-center flex-wrap">
                    <button
                      type="button"
                      onClick={() => setInspectingDoc(sub)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
                      title="Inspect Aadhaar document scan"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Document</span>
                    </button>

                    {isPending && (
                      <>
                        <button
                          type="button"
                          onClick={() => onApprove(sub.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-2xs transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve KYC</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenReject(sub)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-semibold transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}

                    {!isPending && (
                      <button
                        type="button"
                        onClick={() => onResetStatus(sub.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Reset to Pending"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Re-evaluate</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Inspect Document Modal */}
      {inspectingDoc && !showRejectModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-5 py-4 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
              <div>
                <h3 className="font-bold text-base">
                  Officer Document Verification: {inspectingDoc.farmerName}
                </h3>
                <p className="text-xs text-slate-400">
                  Aadhaar No: {inspectingDoc.aadhaarNumber} • Village: {inspectingDoc.village}, {inspectingDoc.district}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInspectingDoc(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Document Image Render */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-3 bg-slate-50 dark:bg-slate-800/60 text-center">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                  Uploaded Document Scan ({inspectingDoc.documentType})
                </span>
                {inspectingDoc.documentFileData ? (
                  <img
                    src={inspectingDoc.documentFileData}
                    alt="Aadhaar Scan"
                    className="max-h-60 mx-auto rounded-lg border border-slate-300 dark:border-slate-600 shadow-sm object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="py-12 bg-white dark:bg-slate-800 rounded border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 text-xs">
                    Official Document File: {inspectingDoc.documentFileName} ({inspectingDoc.documentFileSize || '480 KB'})
                  </div>
                )}
              </div>

              {/* Data Verification Checklist */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">Verification Protocol Checks:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Aadhaar 12-Digit Format:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{inspectingDoc.aadhaarNumber}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Landholding Area:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{inspectingDoc.landSizeAcres} Acres</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Revenue Village & District:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{inspectingDoc.village}, {inspectingDoc.district}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Current Status:</span>
                    <span className="font-bold uppercase text-slate-800 dark:text-slate-200">{inspectingDoc.status}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Officer Actions */}
            <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setInspectingDoc(null)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/60 hover:bg-rose-200 dark:hover:bg-rose-900/60 text-rose-800 dark:text-rose-300 text-xs font-bold transition-colors"
                >
                  Reject with Remarks
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onApprove(inspectingDoc.id);
                    setInspectingDoc(null);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Issue Kisan ID</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Remarks Modal */}
      {showRejectModal && inspectingDoc && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-5 py-4 bg-rose-800 text-white">
              <h3 className="font-bold text-base">
                Reject Verification: {inspectingDoc.farmerName}
              </h3>
              <p className="text-xs text-rose-200">
                Specify the deficiency so the farmer can correct and re-upload.
              </p>
            </div>

            <div className="p-5 space-y-3">
              <label htmlFor="rejection-remarks-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Administrative Rejection Remarks:
              </label>
              <textarea
                id="rejection-remarks-input"
                rows={3}
                value={rejectionRemark}
                onChange={(e) => setRejectionRemark(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  Quick Pre-set Remarks:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Aadhaar image blurry/illegible',
                    'Name mismatch with land records',
                    'Corner or UIDAI QR code cut off',
                    'Upload front and back both sides',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setRejectionRemark(preset)}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
