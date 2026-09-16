import React, { useState, useMemo, useEffect } from 'react';
import { platformConfigService } from '../../src/services/platformConfig';
import { Header } from './components/Header';
import { NavigationJumpBar } from './components/NavigationJumpBar';
import { GrainRatesPanel } from './components/GrainRatesPanel';
import { VegetableMarketPanel } from './components/VegetableMarketPanel';
import { ProductionGuidancePanel } from './components/ProductionGuidancePanel';
import { GovernmentSchemesPanel } from './components/GovernmentSchemesPanel';
import { MobileSummaryBar } from './components/MobileSummaryBar';
import { FarmerVerificationModal } from './components/FarmerVerificationModal';
import { VerificationStatusBanner } from './components/VerificationStatusBanner';
import { AdminVerificationDesk } from './components/AdminVerificationDesk';
import { KisanAIAssistant } from './components/KisanAIAssistant';
import {
  SAMPLE_CROP_MSP_RATES,
  SAMPLE_VEGETABLE_RATES,
  PRODUCTION_GUIDANCE_STAGES,
  GOVT_SCHEMES,
} from './data/mockAgriculturalData';
import {
  getStoredSubmissions,
  saveStoredSubmissions,
} from './data/verificationData';
import { FarmerDocumentSubmission } from './types';

export interface FarmerAppProps {
  currentUser?: any;
  onSignOut?: () => void;
  onSwitchModule?: (module: string) => void;
}

export default function App({ currentUser, onSignOut, onSwitchModule }: FarmerAppProps = {}) {
  // Navigation View: 'farmer' | 'admin'
  const [currentView, setCurrentView] = useState<'farmer' | 'admin'>('farmer');

  // Dark Mode Theme State (synchronized with global theme)
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kishansetu_theme') || localStorage.getItem('farmer_dashboard_theme');
      if (saved) return saved === 'dark';
      return document.documentElement.classList.contains('dark') || window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Listen to global theme change events
  React.useEffect(() => {
    const handleThemeChange = (e: any) => {
      if (e.detail?.isDark !== undefined) {
        setIsDark(e.detail.isDark);
      } else if (e.detail?.theme) {
        setIsDark(e.detail.theme === 'dark');
      }
    };
    window.addEventListener('kishansetu_theme_changed', handleThemeChange);
    return () => window.removeEventListener('kishansetu_theme_changed', handleThemeChange);
  }, []);

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDark);
      document.body.classList.toggle('dark', isDark);
      localStorage.setItem('kishansetu_theme', isDark ? 'dark' : 'light');
      localStorage.setItem('farmer_dashboard_theme', isDark ? 'dark' : 'light');
    }
  }, [isDark]);

  // Submissions State (persisted to localStorage)
  const [submissions, setSubmissions] = useState<FarmerDocumentSubmission[]>(() =>
    getStoredSubmissions()
  );

  // Active farmer profile being represented in Farmer Dashboard
  const [activeFarmerId, setActiveFarmerId] = useState<string>('sub-farmer-01');

  // Modal visibility
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState<boolean>(false);

  // Kisan AI Sahayak Assistant open/close state
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState<boolean>(false);

  // Quantities for crops (in Quintals)
  const [cropQuantities, setCropQuantities] = useState<Record<string, number>>({
    wheat: 25,
    mustard: 10,
    rice: 0,
    maize: 0,
    gram: 0,
    bajra: 0,
  });

  // Quantities for vegetables (in Quintals or Kg depending on toggle)
  const [vegetableQuantities, setVegetableQuantities] = useState<Record<string, number>>({
    potato: 15,
    onion: 8,
    tomato: 0,
    cauliflower: 0,
    cabbage: 0,
    green_peas: 0,
  });

  const handleCropQuantityChange = (cropId: string, value: number) => {
    setCropQuantities((prev) => ({
      ...prev,
      [cropId]: value,
    }));
  };

  const handleVegetableQuantityChange = (vegId: string, value: number) => {
    setVegetableQuantities((prev) => ({
      ...prev,
      [vegId]: value,
    }));
  };

  const handleResetCrops = () => {
    setCropQuantities({
      wheat: 0,
      rice: 0,
      maize: 0,
      mustard: 0,
      gram: 0,
      bajra: 0,
    });
  };

  const handleResetVegetables = () => {
    setVegetableQuantities({
      potato: 0,
      onion: 0,
      tomato: 0,
      cauliflower: 0,
      cabbage: 0,
      green_peas: 0,
    });
  };

  const handleResetAll = () => {
    handleResetCrops();
    handleResetVegetables();
  };

  // Super Admin Central Platform Parameters Subscription
  const [adminConfig, setAdminConfig] = useState(() => platformConfigService.getConfig());

  useEffect(() => {
    const unsubscribe = platformConfigService.subscribe((cfg) => {
      setAdminConfig(cfg);
    });
    return unsubscribe;
  }, []);

  // Dynamically map crop MSP rates based on Super Admin live configuration
  const activeCrops = useMemo(() => {
    return SAMPLE_CROP_MSP_RATES.map((baseCrop) => {
      const override = adminConfig.farmer.crops.find((c) => c.id === baseCrop.id);
      if (override) {
        return {
          ...baseCrop,
          mspRate: override.mspRate,
          name: override.name || baseCrop.name,
          hindiName: override.hindiName || baseCrop.hindiName,
        };
      }
      return baseCrop;
    });
  }, [adminConfig.farmer.crops]);

  // Dynamically map vegetable mandi benchmarks based on Super Admin live configuration
  const activeVegetables = useMemo(() => {
    return SAMPLE_VEGETABLE_RATES.map((baseVeg) => {
      const override = adminConfig.farmer.vegetables.find((v) => v.id === baseVeg.id);
      if (override) {
        return {
          ...baseVeg,
          mandiRatePerQuintal: override.pricePerQuintal,
          primaryMarket: override.benchmarkMandi || baseVeg.primaryMarket,
        };
      }
      return baseVeg;
    });
  }, [adminConfig.farmer.vegetables]);

  // Dynamic schemes based on Super Admin configuration
  const activeSchemes = useMemo(() => {
    return GOVT_SCHEMES.map((scheme) => {
      if (scheme.id === 'scheme-pm-kisan') {
        return {
          ...scheme,
          amountOrAssistance: `₹${adminConfig.farmer.schemes.pmKisanAnnualAmount.toLocaleString('en-IN')}/year`,
          description: `Direct cash benefit of ₹${adminConfig.farmer.schemes.pmKisanAnnualAmount.toLocaleString('en-IN')} per year transferred directly to Aadhaar-seeded bank accounts in 3 equal installments.`,
        };
      }
      if (scheme.id === 'scheme-kcc') {
        return {
          ...scheme,
          amountOrAssistance: `Up to ₹${(adminConfig.farmer.schemes.kccCreditCeiling / 100000).toFixed(1)} Lakh @ ${adminConfig.farmer.schemes.kccInterestRatePct}%`,
        };
      }
      if (scheme.id === 'scheme-sinchayee') {
        return {
          ...scheme,
          amountOrAssistance: `${adminConfig.farmer.schemes.dripIrrigationSubsidyPct}% Subsidy`,
        };
      }
      return scheme;
    });
  }, [adminConfig.farmer.schemes]);

  // Grain subtotal calculation with dynamic Super Admin rates
  const totalGrainValue = activeCrops.reduce((sum, crop) => {
    const qty = cropQuantities[crop.id] || 0;
    return sum + qty * crop.mspRate;
  }, 0);

  // Vegetable subtotal calculation with dynamic Super Admin rates
  const totalVegetableValue = activeVegetables.reduce((sum, veg) => {
    const qty = vegetableQuantities[veg.id] || 0;
    return sum + qty * veg.mandiRatePerQuintal;
  }, 0);

  // Active Farmer Submission
  const currentFarmerSubmission =
    submissions.find((s) => s.id === activeFarmerId) || submissions[0];

  const isFarmerVerified = currentFarmerSubmission?.status === 'verified';
  const pendingAdminCount = submissions.filter((s) => s.status === 'pending').length;

  // Farmer submits / updates document
  const handleFarmerSubmitDocument = (
    data: Omit<FarmerDocumentSubmission, 'id' | 'submissionDate' | 'status'>
  ) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    setSubmissions((prev) => {
      const existingIdx = prev.findIndex((s) => s.id === activeFarmerId);
      let updated: FarmerDocumentSubmission[];
      if (existingIdx >= 0) {
        updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          ...data,
          status: 'pending',
          submissionDate: formattedDate,
          adminRemarks: undefined,
        };
      } else {
        const newSub: FarmerDocumentSubmission = {
          ...data,
          id: `sub-${Date.now()}`,
          status: 'pending',
          submissionDate: formattedDate,
        };
        setActiveFarmerId(newSub.id);
        updated = [newSub, ...prev];
      }
      saveStoredSubmissions(updated);
      return updated;
    });
  };

  // Admin approves submission
  const handleAdminApprove = (id: string) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    setSubmissions((prev) => {
      const updated = prev.map((s) => {
        if (s.id === id) {
          const stateCode = s.state.substring(0, 2).toUpperCase() || 'DL';
          const randomDigits = Math.floor(1000 + Math.random() * 9000);
          return {
            ...s,
            status: 'verified' as const,
            reviewedAt: formattedDate,
            reviewedBy: 'Dr. R. K. Verma (BAO)',
            kisanRegistrationNumber: s.kisanRegistrationNumber || `KISAN-${stateCode}-2026-${randomDigits}`,
            adminRemarks: undefined,
          };
        }
        return s;
      });
      saveStoredSubmissions(updated);
      return updated;
    });
  };

  // Admin rejects submission
  const handleAdminReject = (id: string, remarks: string) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    setSubmissions((prev) => {
      const updated = prev.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            status: 'rejected' as const,
            reviewedAt: formattedDate,
            reviewedBy: 'Dr. R. K. Verma (BAO)',
            adminRemarks: remarks,
          };
        }
        return s;
      });
      saveStoredSubmissions(updated);
      return updated;
    });
  };

  // Admin resets status to pending
  const handleResetStatus = (id: string) => {
    setSubmissions((prev) => {
      const updated = prev.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            status: 'pending' as const,
            adminRemarks: undefined,
            reviewedAt: undefined,
          };
        }
        return s;
      });
      saveStoredSubmissions(updated);
      return updated;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Accessibility Skip Link */}
      <a
        href="#main-dashboard-panels"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-800 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none"
      >
        Skip to main agricultural content
      </a>

      {/* Main Header with Role Switcher & Live Earnings */}
      <Header
        totalGrainValue={totalGrainValue}
        totalVegetableValue={totalVegetableValue}
        onResetAll={handleResetAll}
        currentView={currentView}
        onToggleView={setCurrentView}
        farmerSubmission={currentFarmerSubmission}
        onOpenVerificationModal={() => setIsVerificationModalOpen(true)}
        pendingAdminCount={pendingAdminCount}
        onOpenAI={() => setIsAIAssistantOpen(true)}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
      />

      {/* View Switcher: Farmer Dashboard vs Admin Verification Desk */}
      {currentView === 'farmer' ? (
        <>
          {/* Sticky Quick-Navigation Jump Bar */}
          <NavigationJumpBar
            totalGrainValue={totalGrainValue}
            totalVegetableValue={totalVegetableValue}
            onOpenAI={() => setIsAIAssistantOpen(true)}
          />

          {/* Main 2x2 Responsive Layout Grid */}
          <main
            id="main-dashboard-panels"
            className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12"
          >
            {/* Farmer Verification Status Banner */}
            <VerificationStatusBanner
              submission={currentFarmerSubmission}
              onOpenUploadModal={() => setIsVerificationModalOpen(true)}
            />

            <div className="grid grid-cols-1 min-[880px]:grid-cols-2 gap-6 items-start">
              {/* Panel 1: Grain & Crop Rates (MSP) */}
              <GrainRatesPanel
                crops={activeCrops}
                quantities={cropQuantities}
                onQuantityChange={handleCropQuantityChange}
                onResetCrops={handleResetCrops}
                isFarmerVerified={isFarmerVerified}
              />

              {/* Panel 2: Vegetable Market (Mandi Rates) */}
              <VegetableMarketPanel
                vegetables={activeVegetables}
                quantities={vegetableQuantities}
                onQuantityChange={handleVegetableQuantityChange}
                onResetVegetables={handleResetVegetables}
              />

              {/* Panel 3: Production Guidance */}
              <ProductionGuidancePanel stages={PRODUCTION_GUIDANCE_STAGES} />

              {/* Panel 4: Government Schemes */}
              <GovernmentSchemesPanel
                schemes={activeSchemes}
                isFarmerVerified={isFarmerVerified}
              />
            </div>
          </main>

          {/* Sticky Bottom Mobile Summary */}
          <MobileSummaryBar
            totalGrainValue={totalGrainValue}
            totalVegetableValue={totalVegetableValue}
            onResetAll={handleResetAll}
          />
        </>
      ) : (
        /* Admin Verification Portal View */
        <main className="flex-1">
          <AdminVerificationDesk
            submissions={submissions}
            onApprove={handleAdminApprove}
            onReject={handleAdminReject}
            onResetStatus={handleResetStatus}
            onBackToFarmerView={() => setCurrentView('farmer')}
          />
        </main>
      )}

      {/* Farmer Document & Aadhaar Upload Modal */}
      <FarmerVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onSubmit={handleFarmerSubmitDocument}
        currentSubmission={currentFarmerSubmission}
      />

      {/* Kisan AI Sahayak Assistant (Gemini 3.8 Flash) */}
      <KisanAIAssistant
        crops={activeCrops}
        vegetables={activeVegetables}
        cropQuantities={cropQuantities}
        vegetableQuantities={vegetableQuantities}
        totalGrainValue={totalGrainValue}
        totalVegetableValue={totalVegetableValue}
        farmerSubmission={currentFarmerSubmission}
        isOpen={isAIAssistantOpen}
        onToggle={() => setIsAIAssistantOpen((prev) => !prev)}
      />


    </div>
  );
}
