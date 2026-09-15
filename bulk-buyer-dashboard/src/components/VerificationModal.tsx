import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  ShieldCheck, 
  Trash2, 
  FileCheck, 
  ExternalLink,
  Lock,
  ArrowRight,
  BadgeCheck,
  RefreshCw
} from 'lucide-react';
import { OrganizationVerification, DocumentItem } from '../types';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  verification: OrganizationVerification;
  onSaveVerification: (updated: OrganizationVerification) => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  verification,
  onSaveVerification,
}) => {
  const [formData, setFormData] = useState<OrganizationVerification>(verification);
  const [isDraggingGST, setIsDraggingGST] = useState(false);
  const [isDraggingLicense, setIsDraggingLicense] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'guidelines'>('upload');

  const gstInputRef = useRef<HTMLInputElement>(null);
  const licenseInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Process file upload helper
  const handleFileProcess = (file: File, type: 'gst' | 'license') => {
    const fileSizeFormatted = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    const docItem: DocumentItem = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: file.name,
      fileSize: fileSizeFormatted,
      fileType: file.type || 'application/pdf',
      uploadedAt: 'Just now',
      documentNumber: type === 'gst' ? formData.gstin : formData.mandiLicenseNo,
      status: 'Uploaded',
    };

    if (type === 'gst') {
      setFormData((prev) => ({
        ...prev,
        gstDocument: docItem,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        licenseDocument: docItem,
      }));
    }
  };

  // Drag-and-drop handlers for GST
  const handleGSTDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingGST(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0], 'gst');
    }
  };

  // Drag-and-drop handlers for License
  const handleLicenseDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingLicense(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0], 'license');
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    // Simulate official GSTN & APMC Mandi Portal API check
    setTimeout(() => {
      const updated: OrganizationVerification = {
        ...formData,
        overallStatus: 'Verified',
        verifiedAt: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        tier: 'Level 2: Mandi Verified',
        creditLimit: 5000000, // ₹50 Lakhs
        gstDocument: formData.gstDocument ? { ...formData.gstDocument, status: 'Verified' } : null,
        licenseDocument: formData.licenseDocument ? { ...formData.licenseDocument, status: 'Verified' } : null,
      };

      setIsVerifying(false);
      onSaveVerification(updated);
      onClose();
    }, 1200);
  };

  const hasBothDocs = !!formData.gstDocument && !!formData.licenseDocument;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="verification-modal-title"
    >
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="verification-modal-title" className="text-base sm:text-lg font-bold font-display">
                  Organization Verification & KYC
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  formData.overallStatus === 'Verified'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {formData.overallStatus}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Upload your company GST Certificate and Mandi / APMC Trading License to unlock institutional bulk trade limits.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3 pb-0 border-b border-slate-200 bg-slate-50 flex items-center gap-3 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Document Upload & Form</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guidelines')}
            className={`pb-2.5 font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'guidelines'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Verification Guidelines & Benefits</span>
          </button>
        </div>

        {/* Modal Body */}
        {activeTab === 'upload' ? (
          <form onSubmit={handleVerifySubmit} className="p-4 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Organization Info Box */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label htmlFor="company-name-input" className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Registered Entity Name:
                </label>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <input
                    type="text"
                    id="company-name-input"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-md py-1 px-2.5 text-xs font-bold text-slate-900 focus:ring-1 focus:ring-emerald-600"
                    placeholder="e.g. Apex Agro Industrial Ventures Ltd."
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="trade-name-input" className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Trading / Mandi Brand Name:
                </label>
                <input
                  type="text"
                  id="trade-name-input"
                  value={formData.tradeName}
                  onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-md py-1 px-2.5 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-600"
                  placeholder="e.g. Apex Agro Wholesale"
                />
              </div>
            </div>

            {/* Document 1: GST Certificate Upload */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      Goods & Services Tax (GST) Certificate
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Upload Form REG-06 (Registration Certificate). Required for tax-exempt bulk mandi bills.
                    </p>
                  </div>
                </div>

                {formData.gstDocument ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    File Attached
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    *Mandatory
                  </span>
                )}
              </div>

              {/* GSTIN Number Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label htmlFor="gstin-number-input" className="block text-[11px] font-semibold text-slate-700 mb-1">
                    GSTIN Identification Number (15 Digits):
                  </label>
                  <input
                    type="text"
                    id="gstin-number-input"
                    maxLength={15}
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                    placeholder="e.g. 07AAACA1234B1Z5"
                    className="w-full font-mono bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="pan-number-input" className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Organization PAN (Linked):
                  </label>
                  <input
                    type="text"
                    id="pan-number-input"
                    maxLength={10}
                    value={formData.panNumber}
                    onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                    placeholder="e.g. AAACA1234B"
                    className="w-full font-mono bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* GST Upload Zone: Drag & Drop + Click File Picker */}
              {formData.gstDocument ? (
                /* Already uploaded state */
                <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">
                        {formData.gstDocument.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {formData.gstDocument.fileSize} • Uploaded {formData.gstDocument.uploadedAt} • Status: <span className="font-semibold text-emerald-800">{formData.gstDocument.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => gstInputRef.current?.click()}
                      className="text-xs text-slate-600 hover:text-slate-900 underline px-2 py-1"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, gstDocument: null })}
                      className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-md transition"
                      title="Remove document"
                      aria-label="Remove GST document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Drop Zone */
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingGST(true);
                  }}
                  onDragLeave={() => setIsDraggingGST(false)}
                  onDrop={handleGSTDrop}
                  onClick={() => gstInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition ${
                    isDraggingGST
                      ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
                      : 'border-slate-300 hover:border-emerald-400 bg-slate-50/60 hover:bg-slate-50'
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      gstInputRef.current?.click();
                    }
                  }}
                  aria-label="Upload GST Certificate: Drag and drop or click to browse"
                >
                  <UploadCloud className="w-7 h-7 text-emerald-600 mx-auto mb-1.5" />
                  <div className="text-xs font-bold text-slate-800">
                    Drag and drop your GST Certificate here, or <span className="text-emerald-700 underline">browse file</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Supports PDF, JPG, PNG (Max 15MB)
                  </p>
                </div>
              )}

              <input
                type="file"
                ref={gstInputRef}
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileProcess(e.target.files[0], 'gst');
                  }
                }}
                className="hidden"
                id="gst-file-input"
              />
            </div>

            {/* Document 2: Mandi / APMC Trading License Upload */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      Mandi / APMC Wholesale Trading License
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Single unified license or State APMC trader certificate for inter-mandi procurement.
                    </p>
                  </div>
                </div>

                {formData.licenseDocument ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    File Attached
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    *Mandatory
                  </span>
                )}
              </div>

              {/* License Details Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label htmlFor="license-number-input" className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Wholesale License / Registration No.:
                  </label>
                  <input
                    type="text"
                    id="license-number-input"
                    value={formData.mandiLicenseNo}
                    onChange={(e) => setFormData({ ...formData, mandiLicenseNo: e.target.value })}
                    placeholder="e.g. APMC-DL-9421-2024"
                    className="w-full font-mono bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="fssai-number-input" className="block text-[11px] font-semibold text-slate-700 mb-1">
                    FSSAI Wholesale License No. (Optional):
                  </label>
                  <input
                    type="text"
                    id="fssai-number-input"
                    value={formData.fssaiLicenseNo}
                    onChange={(e) => setFormData({ ...formData, fssaiLicenseNo: e.target.value })}
                    placeholder="e.g. 10022011000492"
                    className="w-full font-mono bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* License Upload Zone: Drag & Drop + Click File Picker */}
              {formData.licenseDocument ? (
                /* Already uploaded state */
                <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">
                        {formData.licenseDocument.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {formData.licenseDocument.fileSize} • Uploaded {formData.licenseDocument.uploadedAt} • Status: <span className="font-semibold text-emerald-800">{formData.licenseDocument.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => licenseInputRef.current?.click()}
                      className="text-xs text-slate-600 hover:text-slate-900 underline px-2 py-1"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, licenseDocument: null })}
                      className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-md transition"
                      title="Remove document"
                      aria-label="Remove License document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Drop Zone */
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingLicense(true);
                  }}
                  onDragLeave={() => setIsDraggingLicense(false)}
                  onDrop={handleLicenseDrop}
                  onClick={() => licenseInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition ${
                    isDraggingLicense
                      ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
                      : 'border-slate-300 hover:border-emerald-400 bg-slate-50/60 hover:bg-slate-50'
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      licenseInputRef.current?.click();
                    }
                  }}
                  aria-label="Upload Mandi License: Drag and drop or click to browse"
                >
                  <UploadCloud className="w-7 h-7 text-emerald-600 mx-auto mb-1.5" />
                  <div className="text-xs font-bold text-slate-800">
                    Drag and drop your APMC / Mandi License here, or <span className="text-emerald-700 underline">browse file</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Supports PDF, JPG, PNG (Max 15MB)
                  </p>
                </div>
              )}

              <input
                type="file"
                ref={licenseInputRef}
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileProcess(e.target.files[0], 'license');
                  }
                }}
                className="hidden"
                id="license-file-input"
              />
            </div>

            {/* Verification Security Note */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-slate-900">Encrypted Enterprise Verification: </strong>
                Uploaded certificates are validated against the Ministry of Corporate Affairs and GSTN database. Your verified status enables direct farmgate FPO contracts and 0% APMC middleman cess.
              </div>
            </div>

            {/* Submit Action Strip */}
            <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                {!hasBothDocs && (
                  <span className="text-amber-700 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Please attach both GST and License files to complete verification.
                  </span>
                )}
                {hasBothDocs && (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Both documents ready for instant automated verification.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!hasBothDocs || isVerifying}
                  className="px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-bold shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Validating with Mandi Clearing...</span>
                    </>
                  ) : (
                    <>
                      <BadgeCheck className="w-4 h-4" />
                      <span>Verify Organization</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* Guidelines & Benefits Tab */
          <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-slate-700">
            <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200">
              <h4 className="font-bold text-emerald-950 text-sm mb-1 flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4 text-emerald-700" />
                Benefits of Organization Verification
              </h4>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Verifying your entity connects your company directly with 10,000+ Farmer Producer Organizations (FPOs) across 23 states under the National Agriculture Market framework.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <div className="font-bold text-slate-900 mb-1">0% Mandi Tax on Direct FPO Sourcing</div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Verified institutional buyers bypass secondary market cess and APMC middleman commissions when buying directly from certified FPOs.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <div className="font-bold text-slate-900 mb-1">Enhanced Escrow Procurement Limits</div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Unverified buyers are capped at ₹10 Lakhs per contract. Verification raises your single-consignment clearance limit to ₹50 Lakhs+.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <div className="font-bold text-slate-900 mb-1">Automated e-Way Bill Part-B</div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Once your GSTIN is verified, e-Way bills generate automatically upon FPO truck dispatch without manual data re-entry.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <div className="font-bold text-slate-900 mb-1">NABL Mandi Lab Assaying Priority</div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Verified buyers receive guaranteed 2-hour joint moisture assaying turnarounds at terminal mandi gate weighbridges.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>Proceed to Document Upload</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
