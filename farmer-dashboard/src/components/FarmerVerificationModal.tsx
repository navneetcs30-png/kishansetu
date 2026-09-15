import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, ShieldAlert, Sparkles, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { FarmerDocumentSubmission } from '../types';

interface FarmerVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (submission: Omit<FarmerDocumentSubmission, 'id' | 'submissionDate' | 'status'>) => void;
  currentSubmission?: FarmerDocumentSubmission;
}

export const FarmerVerificationModal: React.FC<FarmerVerificationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentSubmission,
}) => {
  const [farmerName, setFarmerName] = useState(currentSubmission?.farmerName || 'Rameshwar Prasad');
  const [phone, setPhone] = useState(currentSubmission?.phone || '9876543210');
  const [aadhaarNumber, setAadhaarNumber] = useState(currentSubmission?.aadhaarNumber || '7842 9104 3821');
  const [village, setVillage] = useState(currentSubmission?.village || 'Pipariya Khurd');
  const [district, setDistrict] = useState(currentSubmission?.district || 'Hoshangabad');
  const [state, setState] = useState(currentSubmission?.state || 'Madhya Pradesh');
  const [landSizeAcres, setLandSizeAcres] = useState<number>(currentSubmission?.landSizeAcres || 4.5);
  const [documentType, setDocumentType] = useState<'Aadhaar Card' | 'Land Patta / Khasra' | 'Voter ID'>(
    currentSubmission?.documentType || 'Aadhaar Card'
  );

  const [documentFileName, setDocumentFileName] = useState<string>(
    currentSubmission?.documentFileName || 'aadhaar_front_scan.jpg'
  );
  const [documentFileData, setDocumentFileData] = useState<string>(
    currentSubmission?.documentFileData || ''
  );
  const [documentFileSize, setDocumentFileSize] = useState<string>(
    currentSubmission?.documentFileSize || '480 KB'
  );
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Format Aadhaar input as 4-digit groups (XXXX XXXX XXXX)
  const handleAadhaarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setAadhaarNumber(formatted);
  };

  const handleFileSelected = (file: File) => {
    if (!file) return;
    setErrorMsg('');
    setDocumentFileName(file.name);
    setDocumentFileSize(`${(file.size / 1024).toFixed(0)} KB`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setDocumentFileData(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleUseDemoAadhaar = () => {
    setFarmerName('Rameshwar Prasad');
    setPhone('9876543210');
    setAadhaarNumber('7842 9104 3821');
    setVillage('Pipariya Khurd');
    setDistrict('Hoshangabad');
    setState('Madhya Pradesh');
    setLandSizeAcres(4.5);
    setDocumentType('Aadhaar Card');
    setDocumentFileName('rameshwar_aadhaar_card_official.jpg');
    setDocumentFileSize('520 KB');
    setDocumentFileData(
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" fill="%23f4f6f8" rx="12" stroke="%23cbd5e1" stroke-width="2"/><rect x="20" y="20" width="360" height="36" fill="%23dc2626" rx="4"/><text x="200" y="44" fill="white" font-family="sans-serif" font-weight="bold" font-size="14" text-anchor="middle">GOVERNMENT OF INDIA • भारत सरकार</text><rect x="30" y="75" width="80" height="100" fill="%23e2e8f0" rx="6" stroke="%2394a3b8"/><circle cx="70" cy="110" r="22" fill="%2394a3b8"/><path d="M45 165 C45 140 95 140 95 165" fill="%2394a3b8"/><text x="130" y="95" fill="%230f172a" font-family="sans-serif" font-weight="bold" font-size="13">Rameshwar Prasad / रामेश्वर प्रसाद</text><text x="130" y="115" fill="%23475569" font-family="sans-serif" font-size="11">DOB: 15/08/1976 • Gender: Male</text><text x="130" y="135" fill="%23475569" font-family="sans-serif" font-size="11">Village: Pipariya, MP</text><rect x="130" y="165" width="220" height="30" fill="%23f1f5f9" rx="4" stroke="%23cbd5e1"/><text x="240" y="185" fill="%230f172a" font-family="monospace" font-weight="bold" font-size="14" text-anchor="middle">7842 9104 3821</text><text x="200" y="230" fill="%2364748b" font-family="sans-serif" font-size="10" text-anchor="middle">आधार - आम आदमी का अधिकार</text></svg>'
    );
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerName.trim()) {
      setErrorMsg('Please enter your full name as shown on your Aadhaar card.');
      return;
    }
    const cleanAadhaar = aadhaarNumber.replace(/\s/g, '');
    if (cleanAadhaar.length !== 12) {
      setErrorMsg('Please enter a valid 12-digit Aadhaar card number.');
      return;
    }
    if (!documentFileName) {
      setErrorMsg('Please upload a clear scan or photo of your Aadhaar card.');
      return;
    }

    onSubmit({
      farmerName: farmerName.trim(),
      phone: phone.trim() || '9876543210',
      aadhaarNumber: aadhaarNumber.trim(),
      village: village.trim() || 'Pipariya',
      district: district.trim() || 'Hoshangabad',
      state: state.trim() || 'Madhya Pradesh',
      landSizeAcres: landSizeAcres || 2,
      documentType,
      documentFileName,
      documentFileData,
      documentFileSize,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-verification-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 transition-colors">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-900 to-emerald-800 dark:from-emerald-950 dark:to-emerald-900 text-white flex items-center justify-between border-b border-emerald-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700/80 dark:bg-emerald-800/80 border border-emerald-600 dark:border-emerald-700 flex items-center justify-center text-emerald-100 flex-shrink-0">
              <FileText className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 id="modal-verification-title" className="text-base sm:text-lg font-bold">
                Farmer Document & Aadhaar Verification
              </h2>
              <p className="text-xs text-emerald-200">
                Upload official identity document for government verification & DBT clearance
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-700/50 dark:hover:bg-emerald-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-300"
            aria-label="Close verification modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Auto-Fill Banner */}
        <div className="bg-amber-50 dark:bg-amber-950/40 px-5 py-2.5 border-b border-amber-200/80 dark:border-amber-800/60 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200 gap-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-700 dark:text-amber-400 flex-shrink-0" />
            <span className="font-medium">Testing with sample documents?</span>
            <span className="hidden sm:inline text-amber-800 dark:text-amber-300">You can prefill realistic demo data with one click.</span>
          </div>
          <button
            type="button"
            onClick={handleUseDemoAadhaar}
            className="px-2.5 py-1 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px] shadow-2xs whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            Prefill Sample Aadhaar
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[78vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Farmer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label htmlFor="input-farmer-name" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Farmer Full Name (As per Aadhaar) <span className="text-rose-600">*</span>
              </label>
              <input
                id="input-farmer-name"
                type="text"
                required
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                placeholder="e.g. Rameshwar Prasad"
                className="w-full text-xs px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
              />
            </div>

            <div>
              <label htmlFor="input-aadhaar" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                12-Digit Aadhaar Card Number <span className="text-rose-600">*</span>
              </label>
              <input
                id="input-aadhaar"
                type="text"
                required
                maxLength={14}
                value={aadhaarNumber}
                onChange={handleAadhaarChange}
                placeholder="XXXX XXXX XXXX"
                className="w-full text-xs font-mono font-semibold px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
              />
            </div>

            <div>
              <label htmlFor="input-phone" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mobile Number (Linked with Aadhaar/OTP)
              </label>
              <input
                id="input-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full text-xs px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
              />
            </div>

            <div>
              <label htmlFor="input-land-size" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Cultivable Land Holding (Acres)
              </label>
              <input
                id="input-land-size"
                type="number"
                step="0.1"
                min="0.1"
                value={landSizeAcres}
                onChange={(e) => setLandSizeAcres(parseFloat(e.target.value) || 0)}
                className="w-full text-xs px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
              />
            </div>

            <div>
              <label htmlFor="input-village" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Village / Gram Panchayat
              </label>
              <input
                id="input-village"
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="Village name"
                className="w-full text-xs px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
              />
            </div>

            <div>
              <label htmlFor="input-district" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                District & State
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  id="input-district"
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="District"
                  className="w-full text-xs px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <input
                  id="input-state"
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                  className="w-full text-xs px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Document Upload Area (Supports Drag and Drop + File selection click) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Upload Identity Document (Aadhaar Card) <span className="text-rose-600">*</span>
              </label>
              <div className="flex gap-2 text-[11px]">
                {(['Aadhaar Card', 'Land Patta / Khasra', 'Voter ID'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setDocumentType(type)}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                      documentType === type
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Drag & Drop Box */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'
                  : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleFileInputChange}
              />
              <UploadCloud className="w-8 h-8 text-emerald-700 dark:text-emerald-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Drag and drop your Aadhaar scan here, or <span className="text-emerald-700 dark:text-emerald-400 underline">browse file</span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Supports JPG, PNG, or PDF format (Max 10 MB). Make sure UIDAI number and name are legible.
              </p>
            </div>

            {/* Uploaded File Pill & Preview */}
            {documentFileName && (
              <div className="mt-3 p-3 rounded-xl bg-slate-100/90 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block truncate">
                      {documentFileName}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {documentType} • {documentFileSize} • Ready for verification
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:underline flex-shrink-0"
                >
                  Change File
                </button>
              </div>
            )}

            {/* Document preview if available */}
            {documentFileData && (
              <div className="mt-2.5 rounded-lg border border-slate-200 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-800 text-center">
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">Document Visual Preview:</span>
                <img
                  src={documentFileData}
                  alt="Aadhaar Document Preview"
                  className="max-h-40 mx-auto rounded border border-slate-300 dark:border-slate-600 shadow-2xs object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>

          {/* Guidelines info */}
          <div className="rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800/60 p-3 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-blue-700 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <span className="font-semibold">Verification Guarantee:</span> Your document is transmitted to the designated Block Agriculture Officer (BAO) or District Agriculture Officer (DAO) for biometric/demographic verification against revenue department records.
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-800 dark:bg-emerald-700 hover:bg-emerald-900 dark:hover:bg-emerald-800 shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Document for Verification</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
