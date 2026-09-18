import React, { useState, useMemo, useEffect } from 'react';
import { platformConfigService } from '../../src/services/platformConfig';
import { Header } from './components/Header';
import { NavigationJumpBar } from './components/NavigationJumpBar';
import { GrainRatesPanel } from './components/GrainRatesPanel';
import { VegetableMarketPanel } from './components/VegetableMarketPanel';
import { ProductionGuidancePanel } from './components/ProductionGuidancePanel';
import { GovernmentSchemesPanel } from './components/GovernmentSchemesPanel';
import { BuyerDemandsPanel } from './components/BuyerDemandsPanel';
import { FarmerProductSubmitModal } from './components/FarmerProductSubmitModal';
import { FarmerMyListingsModal } from './components/FarmerMyListingsModal';
import { MobileSummaryBar } from './components/MobileSummaryBar';
import { FarmerVerificationModal } from './components/FarmerVerificationModal';
import { VerificationStatusBanner } from './components/VerificationStatusBanner';
import { AdminVerificationDesk } from './components/AdminVerificationDesk';
import { KisanAIAssistant } from './components/KisanAIAssistant';
import { marketplaceService, FarmerProduct } from '../../src/services/marketplaceService';
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

  // Active panel visibility: 'panel-grains' | 'panel-vegetables' | 'panel-demands' | 'panel-guidance' | 'panel-schemes' | 'all'
  const [activePanel, setActivePanel] = useState<string>('panel-grains');

  // Marketplace Modals State
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [isMyListingsModalOpen, setIsMyListingsModalOpen] = useState<boolean>(false);
  const [prefillSubmitData, setPrefillSubmitData] = useState<{
    name?: string;
    category?: 'Grains' | 'Vegetables' | 'Pulses & Seeds' | 'Fruits' | 'Oilseeds';
    pricePerQuintal?: number;
  } | null>(null);

  // Marketplace Counts
  const [openDemandsCount, setOpenDemandsCount] = useState<number>(() => marketplaceService.getOpenDemands().length);
  const [myListingsCount, setMyListingsCount] = useState<number>(() => marketplaceService.getProductsByFarmer(activeFarmerId).length);

  // Listen to Marketplace & Demand changes
  useEffect(() => {
    const updateCounts = () => {
      setOpenDemandsCount(marketplaceService.getOpenDemands().length);
      setMyListingsCount(marketplaceService.getProductsByFarmer(activeFarmerId).length);
    };
    const unsubscribe = marketplaceService.subscribe(updateCounts);
    window.addEventListener('kishansetu_marketplace_updated', updateCounts);
    window.addEventListener('kishansetu_demands_updated', updateCounts);
    return () => {
      unsubscribe();
      window.removeEventListener('kishansetu_marketplace_updated', updateCounts);
      window.removeEventListener('kishansetu_demands_updated', updateCounts);
    };
  }, [activeFarmerId]);

  // Listen to Global Voice Assistant Panel Selection Commands
  useEffect(() => {
    const handleVoicePanelSelect = (e: any) => {
      const panel = e.detail?.panelId;
      if (!panel) return;
      if (panel === 'all') {
        setActivePanel('all');
      } else if (panel.includes('demand') || panel.includes('order') || panel.includes('buyer') || panel.includes('contract')) {
        setActivePanel('panel-demands');
      } else if (panel.includes('grain') || panel.includes('msp') || panel.includes('wheat')) {
        setActivePanel('panel-grains');
      } else if (panel.includes('veg') || panel.includes('onion') || panel.includes('potato')) {
        setActivePanel('panel-vegetables');
      } else if (panel.includes('guidance')) {
        setActivePanel('panel-guidance');
      } else if (panel.includes('scheme')) {
        setActivePanel('panel-schemes');
      } else if (panel.includes('submit') || panel.includes('sell')) {
        setPrefillSubmitData(null);
        setIsSubmitModalOpen(true);
      }
    };
    window.addEventListener('kishansetu_select_panel', handleVoicePanelSelect);
    return () => window.removeEventListener('kishansetu_select_panel', handleVoicePanelSelect);
  }, []);

  // Modal visibility
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState<boolean>(false);

  // Kisan AI Sahayak Assistant open/close state
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState<boolean>(false);

  const handleOpenSubmitCrop = (crop: any) => {
    setPrefillSubmitData({
      name: `${crop.name} (${crop.hindiName})`,
      category: 'Grains',
      pricePerQuintal: crop.mspRate,
    });
    setIsSubmitModalOpen(true);
  };

  const handleOpenSubmitVegetable = (veg: any) => {
    setPrefillSubmitData({
      name: `${veg.name} (${veg.hindiName})`,
      category: 'Vegetables',
      pricePerQuintal: veg.mandiRatePerQuintal,
    });
    setIsSubmitModalOpen(true);
  };

  const handleOpenGeneralSubmit = () => {
    setPrefillSubmitData(null);
    setIsSubmitModalOpen(true);
  };

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
    <div className="min-h-screen flex flex-col text-slate-800 dark:text-slate-100 transition-colors duration-200">
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
        onOpenSubmitProduct={handleOpenGeneralSubmit}
        onOpenMyListings={() => setIsMyListingsModalOpen(true)}
      />

      {/* View Switcher: Farmer Dashboard vs Admin Verification Desk */}
      {currentView === 'farmer' ? (
        <>
          {/* Sticky Quick-Navigation Jump Bar */}
          <NavigationJumpBar
            totalGrainValue={totalGrainValue}
            totalVegetableValue={totalVegetableValue}
            onOpenAI={() => setIsAIAssistantOpen(true)}
            activePanel={activePanel}
            onSelectPanel={setActivePanel}
            openDemandsCount={openDemandsCount}
            onOpenSubmitProduct={handleOpenGeneralSubmit}
            onOpenMyListings={() => setIsMyListingsModalOpen(true)}
            myListingsCount={myListingsCount}
          />

          {/* Main Layout Grid / Focused Panel Mode */}
          <main
            id="main-dashboard-panels"
            className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12"
          >
            {/* Scenic Agricultural Hero Banner */}
            <div className="relative rounded-2xl overflow-hidden shadow-md border border-emerald-500/20 mb-6 bg-gradient-to-r from-emerald-900/90 via-slate-900/80 to-emerald-950/90 p-5 sm:p-6 text-white">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay pointer-events-none"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80')` }}
              />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      🌾 National Mandi Feeds Active
                    </span>
                    <span className="text-xs text-slate-300">• MSP Guaranteed</span>
                  </div>
                  <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white">
                    Farmer Mandi Hub & Production Desk
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                    Live government MSP rates, direct marketplace crop listings for Consumers and Bulk Buyers, and instant live Buyer Demand matching.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="bg-white/10 dark:bg-slate-900/60 backdrop-blur-md rounded-xl p-3 border border-white/15 text-center min-w-[100px]">
                    <p className="text-[10px] text-emerald-300 uppercase font-semibold">MSP Crops</p>
                    <p className="text-xl font-extrabold text-white">6 Grains</p>
                  </div>
                  <div className="bg-white/10 dark:bg-slate-900/60 backdrop-blur-md rounded-xl p-3 border border-white/15 text-center min-w-[100px]">
                    <p className="text-[10px] text-amber-300 uppercase font-semibold">Buyer Demands</p>
                    <p className="text-xl font-extrabold text-amber-400">{openDemandsCount} Live</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Farmer Verification Status Banner */}
            <VerificationStatusBanner
              submission={currentFarmerSubmission}
              onOpenUploadModal={() => setIsVerificationModalOpen(true)}
            />

            {activePanel === 'all' ? (
              <div className="grid grid-cols-1 min-[880px]:grid-cols-2 gap-6 items-start animate-in fade-in duration-200">
                {/* Panel 1: Grain & Crop Rates (MSP) */}
                <GrainRatesPanel
                  crops={activeCrops}
                  quantities={cropQuantities}
                  onQuantityChange={handleCropQuantityChange}
                  onResetCrops={handleResetCrops}
                  isFarmerVerified={isFarmerVerified}
                  onListCropForSale={handleOpenSubmitCrop}
                />

                {/* Panel 2: Vegetable Market (Mandi Rates) */}
                <VegetableMarketPanel
                  vegetables={activeVegetables}
                  quantities={vegetableQuantities}
                  onQuantityChange={handleVegetableQuantityChange}
                  onResetVegetables={handleResetVegetables}
                  onListVegetableForSale={handleOpenSubmitVegetable}
                />

                {/* Panel: Live Buyer Demands */}
                <div className="min-[880px]:col-span-2">
                  <BuyerDemandsPanel
                    farmerName={currentFarmerSubmission?.fullName || 'Ramesh Patel'}
                    farmerId={activeFarmerId}
                    onOpenSubmitProduct={handleOpenGeneralSubmit}
                  />
                </div>

                {/* Panel 3: Production Guidance */}
                <ProductionGuidancePanel stages={PRODUCTION_GUIDANCE_STAGES} />

                {/* Panel 4: Government Schemes */}
                <GovernmentSchemesPanel
                  schemes={activeSchemes}
                  isFarmerVerified={isFarmerVerified}
                />
              </div>
            ) : (
              <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
                {activePanel === 'panel-grains' && (
                  <GrainRatesPanel
                    crops={activeCrops}
                    quantities={cropQuantities}
                    onQuantityChange={handleCropQuantityChange}
                    onResetCrops={handleResetCrops}
                    isFarmerVerified={isFarmerVerified}
                    onListCropForSale={handleOpenSubmitCrop}
                  />
                )}

                {activePanel === 'panel-vegetables' && (
                  <VegetableMarketPanel
                    vegetables={activeVegetables}
                    quantities={vegetableQuantities}
                    onQuantityChange={handleVegetableQuantityChange}
                    onResetVegetables={handleResetVegetables}
                    onListVegetableForSale={handleOpenSubmitVegetable}
                  />
                )}

                {activePanel === 'panel-demands' && (
                  <BuyerDemandsPanel
                    farmerName={currentFarmerSubmission?.fullName || 'Ramesh Patel'}
                    farmerId={activeFarmerId}
                    onOpenSubmitProduct={handleOpenGeneralSubmit}
                  />
                )}

                {activePanel === 'panel-guidance' && (
                  <ProductionGuidancePanel stages={PRODUCTION_GUIDANCE_STAGES} />
                )}

                {activePanel === 'panel-schemes' && (
                  <GovernmentSchemesPanel
                    schemes={activeSchemes}
                    isFarmerVerified={isFarmerVerified}
                  />
                )}
              </div>
            )}
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

      {/* Farmer Produce Submit Modal */}
      <FarmerProductSubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        farmerName={currentFarmerSubmission?.fullName || 'Ramesh Patel'}
        farmerId={activeFarmerId}
        initialCropName={prefillSubmitData?.name}
        initialCategory={prefillSubmitData?.category}
        initialPricePerQuintal={prefillSubmitData?.pricePerQuintal}
        onSuccess={() => {
          setOpenDemandsCount(marketplaceService.getOpenDemands().length);
          setMyListingsCount(marketplaceService.getProductsByFarmer(activeFarmerId).length);
        }}
      />

      {/* Farmer My Active Listings Modal */}
      <FarmerMyListingsModal
        isOpen={isMyListingsModalOpen}
        onClose={() => setIsMyListingsModalOpen(false)}
        farmerId={activeFarmerId}
        onOpenSubmitNew={handleOpenGeneralSubmit}
      />
    </div>
  );
}
