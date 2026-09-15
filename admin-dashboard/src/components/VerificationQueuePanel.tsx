import React, { useState } from 'react';
import { 
  FileCheck2, 
  Check, 
  X, 
  Clock, 
  FileText, 
  AlertTriangle, 
  Building2, 
  ExternalLink,
  Filter,
  CheckCircle,
  Eye
} from 'lucide-react';
import { VerificationApplication, SubmittedDocument, Role } from '../types';

interface VerificationQueuePanelProps {
  applications: VerificationApplication[];
  onApprove: (applicationId: string) => void;
  onOpenRejectModal: (application: VerificationApplication) => void;
  onPreviewDocument: (doc: SubmittedDocument, applicantName: string) => void;
}

export const VerificationQueuePanel: React.FC<VerificationQueuePanelProps> = ({
  applications,
  onApprove,
  onOpenRejectModal,
  onPreviewDocument,
}) => {
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const pendingApps = applications.filter((app) => app.status === 'Pending');
  const filteredApps = pendingApps.filter(
    (app) => roleFilter === 'ALL' || app.role === roleFilter
  );

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'Farmer':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 font-mono">
            Farmer
          </span>
        );
      case 'Bulk Buyer':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-950/80 text-blue-300 border border-blue-800/80 font-mono">
            Bulk Buyer
          </span>
        );
      case 'Consumer':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-800/80 font-mono">
            Consumer
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section
      id="panel-verifications"
      className="bg-slate-900 border border-slate-800 rounded-xl shadow-sm flex flex-col h-full overflow-hidden"
      aria-labelledby="queue-heading"
    >
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/50">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <h2 id="queue-heading" className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                Registration & Verification Queue
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/80">
                  {pendingApps.length} Awaiting Review
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Pending sign-ups requiring identity validation, land titles, and business licenses.
              </p>
            </div>
          </div>

          {/* Filter by role */}
          <div className="flex items-center gap-1.5 ml-auto">
            <label htmlFor="queue-role-filter" className="sr-only">Filter queue by role</label>
            <select
              id="queue-role-filter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Roles ({pendingApps.length})</option>
              <option value="Farmer">Farmers</option>
              <option value="Bulk Buyer">Bulk Buyers</option>
              <option value="Consumer">Consumers</option>
            </select>
          </div>
        </div>
      </div>

      {/* Queue Items List */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 min-h-[320px] max-h-[440px]">
        {filteredApps.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-12 text-center text-slate-400">
            <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-700/60 flex items-center justify-center text-emerald-400 mb-3">
              <CheckCircle className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-200">Verification Queue Clear</p>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              All submitted identity credentials, land records, and business registrations have been processed.
            </p>
          </div>
        ) : (
          filteredApps.map((app) => {
            const isUrgent = app.waitingHours >= 24;
            return (
              <div
                key={app.id}
                id={`queue-card-${app.id}`}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                  isUrgent
                    ? 'bg-amber-950/15 border-amber-800/60 hover:border-amber-700'
                    : 'bg-slate-950/60 border-slate-800/90 hover:border-slate-700'
                }`}
              >
                {/* Top row: Applicant Info & Wait Time */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-100">
                        {app.applicantName}
                      </h3>
                      {getRoleBadge(app.role)}
                      <span className="text-[10px] font-mono text-slate-500">
                        {app.id}
                      </span>
                    </div>
                    {app.organizationName && (
                      <p className="text-xs text-slate-300 font-medium mt-0.5 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{app.organizationName}</span>
                      </p>
                    )}
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {app.location} • <span className="font-mono text-slate-400">{app.applicantPhone}</span>
                    </p>
                  </div>

                  {/* Wait Time Badge */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium font-mono ${
                        isUrgent
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-700/60 animate-pulse'
                          : 'bg-slate-800/90 text-slate-300 border border-slate-700'
                      }`}
                      title={isUrgent ? 'Over standard 24h operational SLA' : 'Within normal review SLA'}
                    >
                      <Clock className="w-3 h-3" />
                      <span>{app.timeWaiting}</span>
                      {isUrgent && <span className="font-sans text-[10px] text-rose-400 uppercase font-bold ml-1">SLA Alert</span>}
                    </span>
                  </div>
                </div>

                {/* Submitted Documents Section */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                  <div className="text-[11px] font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                    Submitted Verification Documents ({app.submittedDocuments.length}):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {app.submittedDocuments.map((doc) => (
                      <button
                        key={doc.id}
                        type="button"
                        id={`btn-inspect-${doc.id}`}
                        onClick={() => onPreviewDocument(doc, app.applicantName)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 text-xs font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 group"
                        title={`Inspect ${doc.name} (${doc.type})`}
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                        <span className="truncate max-w-[150px] sm:max-w-[200px] text-[11px]">
                          {doc.type}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          ({doc.fileSize})
                        </span>
                        <Eye className="w-3 h-3 text-slate-400 ml-0.5" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Bar: Approve vs Reject */}
                <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-500 hidden sm:inline">
                    Requires compliance verification before activating marketplace permissions.
                  </span>
                  <div className="flex items-center gap-2 ml-auto">
                    {/* Reject Button (requires reason modal) */}
                    <button
                      id={`queue-reject-btn-${app.id}`}
                      type="button"
                      onClick={() => onOpenRejectModal(app)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/70 text-slate-300 hover:text-rose-300 text-xs font-medium border border-slate-700/90 hover:border-rose-700/80 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
                      aria-label={`Reject verification application for ${app.applicantName}`}
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject Application</span>
                    </button>

                    {/* Approve Button */}
                    <button
                      id={`queue-approve-btn-${app.id}`}
                      type="button"
                      onClick={() => onApprove(app.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      aria-label={`Approve verification application for ${app.applicantName}`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Activate</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Standard review SLA: 24h for farmers & consumers, 48h for bulk institutional buyers.</span>
        <span className="font-mono text-slate-500 hidden sm:inline">Priority queue auto-sort enabled</span>
      </div>
    </section>
  );
};
