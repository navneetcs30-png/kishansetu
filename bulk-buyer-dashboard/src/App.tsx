/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { platformConfigService } from '../../src/services/platformConfig';
import { 
  COMMODITIES_DATA, 
  CONTRACT_ORDERS_DATA, 
  GUIDANCE_TOPICS_DATA, 
  TRADE_SCHEMES_DATA,
  DEFAULT_ORGANIZATION_VERIFICATION
} from './data/mockData';
import { Commodity, ContractOrder, TradeScheme, OrganizationVerification } from './types';
import { getEffectiveRate } from './utils/formatters';
import { HeaderStats } from './components/HeaderStats';
import { ProcurementPanel } from './components/ProcurementPanel';
import { ContractsPanel } from './components/ContractsPanel';
import { GuidancePanel } from './components/GuidancePanel';
import { CompliancePanel } from './components/CompliancePanel';
import { OrderQuoteModal } from './components/OrderQuoteModal';
import { ContractDetailsModal } from './components/ContractDetailsModal';
import { SchemeDetailsModal } from './components/SchemeDetailsModal';
import { VerificationModal } from './components/VerificationModal';
import { MobileQuickNav } from './components/MobileQuickNav';
import { CheckCircle2, Grid2X2, Maximize2, ShieldCheck, Sparkles, X, UploadCloud } from 'lucide-react';

export interface BulkBuyerAppProps {
  currentUser?: any;
  onSignOut?: () => void;
  onSwitchModule?: (module: string) => void;
}

export default function App({ currentUser, onSignOut, onSwitchModule }: BulkBuyerAppProps = {}) {
  // Super Admin Central Platform Parameters Subscription
  const [adminConfig, setAdminConfig] = useState(() => platformConfigService.getConfig());

  useEffect(() => {
    const unsubscribe = platformConfigService.subscribe((cfg) => {
      setAdminConfig(cfg);
    });
    return unsubscribe;
  }, []);

  // Dynamically map commodity base rates and volume tiers governed by Super Admin
  const activeCommodities = useMemo(() => {
    return COMMODITIES_DATA.map((baseComm) => {
      const override = adminConfig.bulkBuyer.commodities.find((c) => c.id === baseComm.id);
      if (override) {
        return {
          ...baseComm,
          basePricePerQuintal: override.basePricePerQuintal,
          tiers: [
            { minQuintals: override.tier1MinQ, discountPercent: override.tier1DiscountPct },
            { minQuintals: override.tier2MinQ, discountPercent: override.tier2DiscountPct },
            { minQuintals: override.tier3MinQ, discountPercent: override.tier3DiscountPct },
          ],
        };
      }
      return baseComm;
    });
  }, [adminConfig.bulkBuyer.commodities]);

  const [contracts, setContracts] = useState<ContractOrder[]>(CONTRACT_ORDERS_DATA);
  const [topics] = useState(GUIDANCE_TOPICS_DATA);
  const [schemes] = useState(TRADE_SCHEMES_DATA);

  // Organization KYC Verification State
  const [verification, setVerification] = useState<OrganizationVerification>(DEFAULT_ORGANIZATION_VERIFICATION);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState<boolean>(false);

  // Pre-seed a couple quantities for immediate realistic preview
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'comm-1': 120, // 120 Q Wheat
    'comm-4': 200, // 200 Q Nashik Onions
  });

  // Modals state
  const [orderModal, setOrderModal] = useState<{ isOpen: boolean; mode: 'order' | 'quote' }>({
    isOpen: false,
    mode: 'order',
  });
  const [inspectedContract, setInspectedContract] = useState<ContractOrder | null>(null);
  const [inspectedScheme, setInspectedScheme] = useState<TradeScheme | null>(null);


  // Desktop view mode toggle (Focused Tab view vs 2x2 Grid view)
  const [desktopLayout, setDesktopLayout] = useState<'grid' | 'tabs'>('tabs');
  const [focusedTab, setFocusedTab] = useState<'procurement' | 'contracts' | 'guidance' | 'compliance'>('procurement');

  // Listen to Global Voice Assistant Panel Selection Commands
  useEffect(() => {
    const handleVoicePanelSelect = (e: any) => {
      const panel = e.detail?.panelId;
      if (!panel) return;
      if (panel === 'all' || panel === 'grid') {
        setDesktopLayout('grid');
      } else {
        setDesktopLayout('tabs');
        if (panel.includes('procurement') || panel.includes('quote') || panel.includes('grain')) {
          setFocusedTab('procurement');
        } else if (panel.includes('contract') || panel.includes('order')) {
          setFocusedTab('contracts');
        } else if (panel.includes('compliance') || panel.includes('kyc')) {
          setFocusedTab('compliance');
        } else if (panel.includes('guidance')) {
          setFocusedTab('guidance');
        }
      }
    };
    window.addEventListener('kishansetu_select_panel', handleVoicePanelSelect);
    return () => window.removeEventListener('kishansetu_select_panel', handleVoicePanelSelect);
  }, []);

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Live Running Totals Calculation
  const { totalProcurementValue, totalQuintals, totalBaseValue, selectedItemsCount } = useMemo(() => {
    let totalVal = 0;
    let totalQ = 0;
    let baseVal = 0;
    let count = 0;

    activeCommodities.forEach((c) => {
      const q = quantities[c.id] || 0;
      if (q > 0) {
        count += 1;
        totalQ += q;
        const { rate } = getEffectiveRate(c, q);
        totalVal += q * rate;
        baseVal += q * c.basePricePerQuintal;
      }
    });

    return {
      totalProcurementValue: totalVal,
      totalQuintals: totalQ,
      totalBaseValue: baseVal,
      selectedItemsCount: count,
    };
  }, [activeCommodities, quantities]);

  const activeContractsCount = contracts.filter((c) => c.status !== 'Delivered').length;
  const actionRequiredCount = contracts.filter((c) => !!c.actionRequired).length;

  const handleQuantityChange = (commodityId: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [commodityId]: quantity,
    }));
  };

  const handleResetQuantities = () => {
    setQuantities({});
    showToast('Procurement quantities reset to 0.', 'info');
  };

  const handleOrderSubmitted = (newContract: ContractOrder) => {
    setContracts((prev) => [newContract, ...prev]);
    setOrderModal({ isOpen: false, mode: 'order' });
    setQuantities({}); // clear cart
    showToast(
      `Order ${newContract.contractRef} executed successfully! Added to Active Contracts.`,
      'success'
    );
  };

  const handleResolveAction = (contract: ContractOrder) => {
    setContracts((prev) =>
      prev.map((c) => {
        if (c.id === contract.id) {
          if (c.status === 'In Transit') {
            return {
              ...c,
              actionRequired: undefined,
              inspectionStatus: 'Passed Grade A',
              status: 'Delivered',
              deliveryTimeline: 'Delivered & Accepted Today',
            };
          }
          if (c.status === 'Quoted') {
            return {
              ...c,
              actionRequired: undefined,
              status: 'Confirmed',
              deliveryTimeline: 'Dispatch Scheduled within 3 Days',
            };
          }
          if (c.status === 'Requested') {
            return {
              ...c,
              actionRequired: undefined,
              status: 'Quoted',
            };
          }
          return {
            ...c,
            actionRequired: undefined,
          };
        }
        return c;
      })
    );

    if (inspectedContract?.id === contract.id) {
      setInspectedContract(null);
    }

    showToast(`Action cleared for ${contract.contractRef}. Milestone status updated!`, 'success');
  };

  const handleSaveVerification = (updated: OrganizationVerification) => {
    setVerification(updated);
    showToast(
      `Organization ${updated.companyName} successfully verified! GST and Mandi license confirmed. Credit limit updated to ₹50,00,000.`,
      'success'
    );
  };

  return (    <div className="min-h-screen bulk-buyer-dashboard-root text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900 pb-16 lg:pb-8 transition-colors duration-200">
      {/* Toast Alert */}
      {toast && (
        <div 
          role="status" 
          aria-live="polite"
          className="fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-200 text-xs sm:text-sm max-w-md"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="flex-1 font-medium">{toast.message}</span>
          <button 
            type="button" 
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white p-0.5 rounded"
            aria-label="Dismiss message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Prominent Header with Live Running Total & Panel Switcher */}
      <HeaderStats
        totalProcurementValue={totalProcurementValue}
        totalQuintals={totalQuintals}
        totalBaseValue={totalBaseValue}
        selectedItemsCount={selectedItemsCount}
        activeContractsCount={activeContractsCount}
        actionRequiredCount={actionRequiredCount}
        verification={verification}
        onResetQuantities={handleResetQuantities}
        onOpenOrderModal={() => setOrderModal({ isOpen: true, mode: 'order' })}
        onOpenVerificationModal={() => setIsVerificationModalOpen(true)}
        desktopLayout={desktopLayout}
        onSelectLayout={setDesktopLayout}
        focusedTab={focusedTab}
        onSelectTab={setFocusedTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-4 sm:py-6" id="dashboard-main">
        {/* Scenic B2B Agricultural Procurement Banner */}
        <div className="relative rounded-2xl overflow-hidden shadow-md border border-amber-500/20 mb-6 bg-gradient-to-r from-amber-950/90 via-slate-900/80 to-slate-950/90 p-5 sm:p-6 text-white">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay pointer-events-none"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&auto=format&fit=crop&q=80')` }}
          />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  🏢 Tier-1 Institutional Mandi Highway
                </span>
                <span className="text-xs text-slate-300">• Direct Silo Procurement</span>
              </div>
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white">
                B2B Bulk Buyer Procurement Portal
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Execute large-scale multi-tonnage agricultural contracts, tiered volume discounts, and verified weighbridge manifests with escrow security.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="bg-white/10 dark:bg-slate-900/60 backdrop-blur-md rounded-xl p-3 border border-white/15 text-center min-w-[100px]">
                <p className="text-[10px] text-amber-300 uppercase font-semibold">Volume Tiers</p>
                <p className="text-xl font-extrabold text-white">Up to 11.5%</p>
              </div>
              <div className="bg-white/10 dark:bg-slate-900/60 backdrop-blur-md rounded-xl p-3 border border-white/15 text-center min-w-[100px]">
                <p className="text-[10px] text-emerald-300 uppercase font-semibold">Assaying QC</p>
                <p className="text-xl font-extrabold text-white">e-NAM Standard</p>
              </div>
            </div>
          </div>
        </div>
        {/* Desktop View Switcher Strip */}
        <div className="hidden lg:flex items-center justify-between mb-4 pb-2 border-b border-slate-200/80 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-slate-100">Enterprise Mandi Dashboard View:</span>
            <span>2×2 Balanced Procurement & Compliance Grid</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDesktopLayout('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                desktopLayout === 'grid'
                  ? 'bg-emerald-800 dark:bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Grid2X2 className="w-3.5 h-3.5" />
              <span>2×2 Grid View</span>
            </button>

            <button
              type="button"
              onClick={() => setDesktopLayout('tabs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                desktopLayout === 'tabs'
                  ? 'bg-emerald-800 dark:bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Focused Panel Mode</span>
            </button>
          </div>
        </div>

        {/* Tab Selection if Focused Mode is active on Desktop */}
        {desktopLayout === 'tabs' && (
          <div className="hidden lg:flex items-center gap-2 mb-4 p-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <button
              type="button"
              onClick={() => setFocusedTab('procurement')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                focusedTab === 'procurement' ? 'bg-emerald-700 dark:bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>Bulk Procurement ({selectedItemsCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setFocusedTab('contracts')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                focusedTab === 'contracts' ? 'bg-blue-700 dark:bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>Active Contracts ({contracts.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setFocusedTab('guidance')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                focusedTab === 'guidance' ? 'bg-amber-700 dark:bg-amber-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>Sourcing & Quality Guidance</span>
            </button>

            <button
              type="button"
              onClick={() => setFocusedTab('compliance')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                focusedTab === 'compliance' ? 'bg-slate-800 dark:bg-slate-700 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>Trade Schemes & Compliance</span>
            </button>
          </div>
        )}

        {/* Layout: Responsive 2x2 Grid on Desktop, Stacking to Single Column on Mobile */}
        {desktopLayout === 'tabs' ? (
          /* Single Focused Panel Mode */
          <div className="w-full">
            {focusedTab === 'procurement' && (
              <ProcurementPanel
                commodities={activeCommodities}
                quantities={quantities}
                onQuantityChange={handleQuantityChange}
                onRequestQuote={() => setOrderModal({ isOpen: true, mode: 'quote' })}
                onPlaceBulkOrder={() => setOrderModal({ isOpen: true, mode: 'order' })}
              />
            )}
            {focusedTab === 'contracts' && (
              <ContractsPanel
                contracts={contracts}
                onSelectContract={(c) => setInspectedContract(c)}
                onConfirmAction={handleResolveAction}
              />
            )}
            {focusedTab === 'guidance' && (
              <GuidancePanel topics={topics} />
            )}
            {focusedTab === 'compliance' && (
              <CompliancePanel
                schemes={schemes}
                verification={verification}
                onOpenSchemeModal={(s) => setInspectedScheme(s)}
                onOpenVerificationModal={() => setIsVerificationModalOpen(true)}
              />
            )}
          </div>
        ) : (
          /* Standard 2x2 Grid Layout */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-start">
            {/* Panel 1: Bulk Procurement Panel */}
            <div className="w-full h-full min-h-[520px]">
              <ProcurementPanel
                commodities={activeCommodities}
                quantities={quantities}
                onQuantityChange={handleQuantityChange}
                onRequestQuote={() => setOrderModal({ isOpen: true, mode: 'quote' })}
                onPlaceBulkOrder={() => setOrderModal({ isOpen: true, mode: 'order' })}
              />
            </div>

            {/* Panel 2: Active Contracts & Orders Panel */}
            <div className="w-full h-full min-h-[520px]">
              <ContractsPanel
                contracts={contracts}
                onSelectContract={(c) => setInspectedContract(c)}
                onConfirmAction={handleResolveAction}
              />
            </div>

            {/* Panel 3: Sourcing & Quality Guidance Panel */}
            <div className="w-full h-full min-h-[520px]">
              <GuidancePanel topics={topics} />
            </div>

            {/* Panel 4: Trade Schemes & Compliance Panel */}
            <div className="w-full h-full min-h-[520px]">
              <CompliancePanel
                schemes={schemes}
                verification={verification}
                onOpenSchemeModal={(s) => setInspectedScheme(s)}
                onOpenVerificationModal={() => setIsVerificationModalOpen(true)}
              />
            </div>
          </div>
        )}
      </main>

      {/* Sticky Quick-Navigation Bar for Mobile */}
      <MobileQuickNav
        selectedItemsCount={selectedItemsCount}
        actionRequiredCount={actionRequiredCount}
      />

      {/* Footer Note */}
      <footer className="mt-8 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-100 font-display">Bulk Buyer Procurement Dashboard</span>
            <span>• Mandi Clearing & Settlement Platform</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-600 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              e-NAM Assaying Protocol
            </span>
            <span>WDRA Warehouse Receipt Backed</span>
            <span>100% Tax Exempt Raw Produce</span>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <OrderQuoteModal
        isOpen={orderModal.isOpen}
        mode={orderModal.mode}
        commodities={activeCommodities}
        quantities={quantities}
        verification={verification}
        onClose={() => setOrderModal({ ...orderModal, isOpen: false })}
        onSubmitSuccess={handleOrderSubmitted}
        onOpenVerification={() => setIsVerificationModalOpen(true)}
      />

      <ContractDetailsModal
        contract={inspectedContract}
        onClose={() => setInspectedContract(null)}
        onResolveAction={handleResolveAction}
      />

      <SchemeDetailsModal
        scheme={inspectedScheme}
        onClose={() => setInspectedScheme(null)}
      />

      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        verification={verification}
        onSaveVerification={handleSaveVerification}
      />
    </div>
  );
}

