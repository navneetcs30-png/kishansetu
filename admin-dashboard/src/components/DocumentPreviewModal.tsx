import React from 'react';
import { X, FileText, CheckCircle, ShieldCheck, Download, ExternalLink, Calendar, Building, FileCheck } from 'lucide-react';
import { SubmittedDocument } from '../types';

interface DocumentPreviewModalProps {
  document: SubmittedDocument | null;
  applicantName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  applicantName,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !document) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="doc-preview-title"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 id="doc-preview-title" className="text-sm font-bold text-slate-100 flex items-center gap-2">
                Document Inspection
                <span className="text-xs font-mono font-normal text-slate-400">({document.id})</span>
              </h3>
              <p className="text-xs text-slate-400">
                Uploaded by <span className="text-slate-200 font-medium">{applicantName}</span>
              </p>
            </div>
          </div>
          <button
            id="doc-preview-close-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Close document preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Document Meta Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
            <div>
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Document Type</span>
              <span className="font-semibold text-slate-200 truncate block mt-0.5">{document.type}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Identifier / Ref</span>
              <span className="font-mono text-emerald-400 truncate block mt-0.5">{document.docNumber}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Issuing Authority</span>
              <span className="font-medium text-slate-300 truncate block mt-0.5">{document.issuer}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block">File Size</span>
              <span className="font-mono text-slate-300 block mt-0.5">{document.fileSize}</span>
            </div>
          </div>

          {/* Realistic Document Preview Card */}
          <div className="p-6 rounded-lg bg-slate-950 border border-slate-800 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 text-slate-100 font-black text-4xl select-none rotate-[-15deg]">
              OFFICIAL VERIFICATION COPY • KISANDIRECT
            </div>

            <div className="w-14 h-14 rounded-2xl bg-emerald-950/50 border border-emerald-700/50 flex items-center justify-center text-emerald-400 mb-3 shadow-inner">
              <FileText className="w-7 h-7" />
            </div>

            <h4 className="text-sm font-semibold text-slate-200 max-w-md truncate font-mono">
              {document.name}
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-md">
              Secure PDF Encrypted Document • Hash: <span className="font-mono text-emerald-400/80">SHA-256 Verified</span>
            </p>

            <div className="mt-4 flex items-center gap-2">
              <button 
                id="doc-download-sim-btn"
                onClick={() => alert(`Simulated secure download of ${document.name} (Watermarked with Admin IP)`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Download Watermarked File</span>
              </button>
            </div>
          </div>

          {/* Verification Protocol Checklist */}
          <div className="p-3.5 rounded-lg bg-slate-950/40 border border-slate-800/80 space-y-2">
            <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Administrative Verification Checklist
            </h4>
            <ul className="text-xs text-slate-400 space-y-1.5 pl-1">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Revenue department registration or official GST portal active status confirmed</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Survey number / GAT number or GSTIN matches platform registration entity</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Legible digital seal and authorized signatory stamp verified</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end">
          <button
            id="doc-preview-dismiss-btn"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
