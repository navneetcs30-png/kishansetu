import { FarmerDocumentSubmission } from '../types';

export const INITIAL_SUBMISSIONS: FarmerDocumentSubmission[] = [
  {
    id: 'sub-farmer-01',
    farmerName: 'Rameshwar Prasad',
    phone: '9876543210',
    aadhaarNumber: '7842 9104 3821',
    village: 'Pipariya Khurd',
    district: 'Hoshangabad',
    state: 'Madhya Pradesh',
    landSizeAcres: 4.5,
    documentType: 'Aadhaar Card',
    documentFileName: 'rameshwar_aadhaar_front_back.jpg',
    documentFileData: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" fill="%23f4f6f8" rx="12" stroke="%23cbd5e1" stroke-width="2"/><rect x="20" y="20" width="360" height="36" fill="%23dc2626" rx="4"/><text x="200" y="44" fill="white" font-family="sans-serif" font-weight="bold" font-size="14" text-anchor="middle">GOVERNMENT OF INDIA • भारत सरकार</text><rect x="30" y="75" width="80" height="100" fill="%23e2e8f0" rx="6" stroke="%2394a3b8"/><circle cx="70" cy="110" r="22" fill="%2394a3b8"/><path d="M45 165 C45 140 95 140 95 165" fill="%2394a3b8"/><text x="130" y="95" fill="%230f172a" font-family="sans-serif" font-weight="bold" font-size="13">Rameshwar Prasad / रामेश्वर प्रसाद</text><text x="130" y="115" fill="%23475569" font-family="sans-serif" font-size="11">DOB: 15/08/1976 • Gender: Male</text><text x="130" y="135" fill="%23475569" font-family="sans-serif" font-size="11">Village: Pipariya, MP</text><rect x="130" y="165" width="220" height="30" fill="%23f1f5f9" rx="4" stroke="%23cbd5e1"/><text x="240" y="185" fill="%230f172a" font-family="monospace" font-weight="bold" font-size="14" text-anchor="middle">7842 9104 3821</text><text x="200" y="230" fill="%2364748b" font-family="sans-serif" font-size="10" text-anchor="middle">आधार - आम आदमी का अधिकार</text></svg>',
    documentFileSize: '480 KB',
    submissionDate: '2026-09-12 10:30 AM',
    status: 'pending',
  },
  {
    id: 'sub-farmer-02',
    farmerName: 'Balwinder Singh',
    phone: '9812345678',
    aadhaarNumber: '4921 7730 1195',
    village: 'Shahpur Kalan',
    district: 'Sangrur',
    state: 'Punjab',
    landSizeAcres: 8.0,
    documentType: 'Aadhaar Card',
    documentFileName: 'balwinder_aadhaar_card.pdf',
    documentFileData: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" fill="%23f4f6f8" rx="12" stroke="%23cbd5e1" stroke-width="2"/><rect x="20" y="20" width="360" height="36" fill="%2315803d" rx="4"/><text x="200" y="44" fill="white" font-family="sans-serif" font-weight="bold" font-size="14" text-anchor="middle">GOVERNMENT OF INDIA • UIDAI VERIFIED</text><rect x="30" y="75" width="80" height="100" fill="%23e2e8f0" rx="6" stroke="%2394a3b8"/><circle cx="70" cy="110" r="22" fill="%2365a30d"/><path d="M45 165 C45 140 95 140 95 165" fill="%2365a30d"/><text x="130" y="95" fill="%230f172a" font-family="sans-serif" font-weight="bold" font-size="13">Balwinder Singh / बलविंदर सिंह</text><text x="130" y="115" fill="%23475569" font-family="sans-serif" font-size="11">DOB: 02/04/1982 • Gender: Male</text><text x="130" y="135" fill="%23475569" font-family="sans-serif" font-size="11">Dist: Sangrur, Punjab</text><rect x="130" y="165" width="220" height="30" fill="%23f1f5f9" rx="4" stroke="%23cbd5e1"/><text x="240" y="185" fill="%230f172a" font-family="monospace" font-weight="bold" font-size="14" text-anchor="middle">4921 7730 1195</text><text x="200" y="230" fill="%2315803d" font-family="sans-serif" font-weight="bold" font-size="10" text-anchor="middle">VERIFIED KISAN IDENTIFIER</text></svg>',
    documentFileSize: '620 KB',
    submissionDate: '2026-09-10 03:15 PM',
    status: 'verified',
    reviewedAt: '2026-09-11 11:20 AM',
    reviewedBy: 'District Agriculture Officer (DAO)',
    kisanRegistrationNumber: 'KISAN-PB-2026-9812',
    adminRemarks: 'Aadhaar demographic details verified against revenue land record (Jamabandi). Approved for PM-KISAN & KCC subsidy.',
  },
  {
    id: 'sub-farmer-03',
    farmerName: 'Sunita Devi',
    phone: '9765432190',
    aadhaarNumber: '3310 9845 2201',
    village: 'Manpur Bigha',
    district: 'Patna',
    state: 'Bihar',
    landSizeAcres: 2.0,
    documentType: 'Aadhaar Card',
    documentFileName: 'sunita_devi_doc.png',
    documentFileData: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" fill="%23f4f6f8" rx="12" stroke="%23cbd5e1" stroke-width="2"/><rect x="20" y="20" width="360" height="36" fill="%23b91c1c" rx="4"/><text x="200" y="44" fill="white" font-family="sans-serif" font-weight="bold" font-size="14" text-anchor="middle">AADHAAR CARD PHOTOCOPY</text><rect x="30" y="75" width="80" height="100" fill="%23fee2e2" rx="6" stroke="%23f87171"/><circle cx="70" cy="110" r="22" fill="%23f87171"/><path d="M45 165 C45 140 95 140 95 165" fill="%23f87171"/><text x="130" y="95" fill="%230f172a" font-family="sans-serif" font-weight="bold" font-size="13">Sunita Devi / सुनीता देवी</text><text x="130" y="115" fill="%23475569" font-family="sans-serif" font-size="11">DOB: 10/11/1988 • Gender: Female</text><text x="130" y="135" fill="%23dc2626" font-family="sans-serif" font-size="11">[Corner of photo cut off in scan]</text><rect x="130" y="165" width="220" height="30" fill="%23f1f5f9" rx="4" stroke="%23cbd5e1"/><text x="240" y="185" fill="%230f172a" font-family="monospace" font-weight="bold" font-size="14" text-anchor="middle">3310 9845 2201</text><text x="200" y="230" fill="%23b91c1c" font-family="sans-serif" font-size="10" text-anchor="middle">RE-UPLOAD REQUESTED BY ADMIN</text></svg>',
    documentFileSize: '210 KB',
    submissionDate: '2026-09-08 09:40 AM',
    status: 'rejected',
    reviewedAt: '2026-09-09 02:45 PM',
    reviewedBy: 'Block Agriculture Officer (BAO)',
    adminRemarks: 'Aadhaar card edges are cut off and QR code is not legible. Please re-upload a clear front and back photo or original e-Aadhaar PDF.',
  },
];

const STORAGE_KEY = 'kisan_farmer_document_submissions_v1';

export function getStoredSubmissions(): FarmerDocumentSubmission[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return INITIAL_SUBMISSIONS;
}

export function saveStoredSubmissions(submissions: FarmerDocumentSubmission[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  } catch (err) {
    console.error('Failed to save submissions to localStorage', err);
  }
}
