import React, { useState, useMemo, useEffect } from 'react';
import { platformConfigService } from '../../src/services/platformConfig';
import {
  INITIAL_PRODUCE_ITEMS,
  INITIAL_CUSTOMER_ORDERS,
  GUIDANCE_TOPICS,
  CONSUMER_SCHEMES
} from './data/mockData';
import { CustomerOrder, ConsumerScheme, ProduceItem } from './types';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { BrowseProducePanel } from './components/BrowseProducePanel';
import { MyOrdersPanel } from './components/MyOrdersPanel';
import { GuidancePanel } from './components/GuidancePanel';
import { OffersSchemesPanel } from './components/OffersSchemesPanel';
import { CheckoutModal } from './components/CheckoutModal';
import { SchemeDetailModal } from './components/SchemeDetailModal';
import { ReceiptModal } from './components/ReceiptModal';
import { RaiseConsumerDemandModal } from './components/RaiseConsumerDemandModal';
import { marketplaceService, FarmerProduct } from '../../src/services/marketplaceService';
import { CheckCircle2, AlertCircle, LayoutGrid, Layers, Info } from 'lucide-react';

export interface ConsumerAppProps {
  currentUser?: any;
  onSignOut?: () => void;
  onSwitchModule?: (module: string) => void;
}

export default function App({ currentUser, onSignOut, onSwitchModule }: ConsumerAppProps = {}) {
  // Super Admin Central Platform Parameters Subscription
  const [adminConfig, setAdminConfig] = useState(() => platformConfigService.getConfig());

  useEffect(() => {
    const unsubscribe = platformConfigService.subscribe((cfg) => {
      setAdminConfig(cfg);
    });
    return unsubscribe;
  }, []);

  // Dynamically map produce items with Super Admin prices and availability
  const activeProduceList = useMemo(() => {
    return INITIAL_PRODUCE_ITEMS.map((baseItem) => {
      const override = adminConfig.consumer.produce.find((p) => p.id === baseItem.id);
      if (override) {
        return {
          ...baseItem,
          pricePerKg: override.pricePerKg,
          isAvailable: override.inStock,
          isOrganic: override.organicCertified,
        };
      }
      return baseItem;
    });
  }, [adminConfig.consumer.produce]);

  // Real-time Farmer Submitted Products from KishanSetu Marketplace
  const [farmerProducts, setFarmerProducts] = useState<FarmerProduct[]>(() => marketplaceService.getProductsForConsumers());
  const [isRaiseDemandOpen, setIsRaiseDemandOpen] = useState(false);

  useEffect(() => {
    const handleSync = () => {
      setFarmerProducts(marketplaceService.getProductsForConsumers());
    };
    const unsub = marketplaceService.subscribe(handleSync);
    window.addEventListener('kishansetu_marketplace_updated', handleSync);
    return () => {
      unsub();
      window.removeEventListener('kishansetu_marketplace_updated', handleSync);
    };
  }, []);

  // Merged Catalog: Fresh Farmer-Submitted items appear at top of Consumer Store
  const combinedProduceList = useMemo(() => {
    const mappedFarmerItems: ProduceItem[] = farmerProducts.map((fp) => ({
      id: fp.id,
      name: fp.name,
      hindiName: fp.hindiName,
      category: fp.category === 'Vegetables' ? 'Vegetables' : (fp.category === 'Pulses & Seeds' ? 'Pulses & Seeds' : 'Grains'),
      variety: `${fp.variety} • Direct Farm Gate`,
      pricePerKg: fp.pricePerKg,
      pricePerQuintal: fp.pricePerQuintal,
      farmerName: fp.farmerName,
      location: fp.location,
      distanceKm: 28,
      harvestedDate: fp.harvestDate,
      qualityGrade: fp.qualityGrade,
      stockKg: fp.availableStockKg,
      minOrderKg: fp.minOrderKg,
      popular: true,
      organic: fp.organic ?? false,
      description: fp.description,
    }));

    return [...mappedFarmerItems, ...activeProduceList];
  }, [farmerProducts, activeProduceList]);

  const [orders, setOrders] = useState<CustomerOrder[]>(INITIAL_CUSTOMER_ORDERS);
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>({
    'prod-wheat-sharbati': 10,
    'prod-tomato-vine': 3
  });

  const [activeSection, setActiveSection] = useState<string>('panel-produce');

  // Listen to Global Voice Assistant Panel Selection Commands
  useEffect(() => {
    const handleVoicePanelSelect = (e: any) => {
      const panel = e.detail?.panelId;
      if (!panel) return;
      if (panel.includes('order') || panel.includes('cart')) {
        setActiveSection('panel-orders');
      } else if (panel.includes('produce') || panel.includes('shop') || panel.includes('veg') || panel.includes('grain')) {
        setActiveSection('panel-produce');
      } else if (panel.includes('guidance')) {
        setActiveSection('panel-guidance');
      } else if (panel.includes('offer') || panel.includes('scheme')) {
        setActiveSection('panel-offers');
      }
    };
    window.addEventListener('kishansetu_select_panel', handleVoicePanelSelect);
    return () => window.removeEventListener('kishansetu_select_panel', handleVoicePanelSelect);
  }, []);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<ConsumerScheme | null>(null);
  const [viewingReceiptOrder, setViewingReceiptOrder] = useState<CustomerOrder | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>({
    message: 'Welcome to AgriDirect Consumer Hub. Farm-fresh prices updated for current harvest window.',
    type: 'info'
  });

  // Calculate live Cart Totals with Super Admin bulk discount rules
  const { subtotal, totalWeightKg, bulkDiscountAmount, finalCartAmount, cartItemCount } = useMemo(() => {
    let rawSubtotal = 0;
    let weight = 0;
    let itemCount = 0;

    for (const [prodId, rawQty] of Object.entries(cartQuantities)) {
      const qty = Number(rawQty) || 0;
      if (qty > 0) {
        const item = combinedProduceList.find((p) => p.id === prodId);
        if (item) {
          rawSubtotal += qty * item.pricePerKg;
          weight += qty;
          itemCount += 1;
        }
      }
    }

    // Dynamic Tiered bulk discounts governed by Super Admin
    const tier1Min = adminConfig.consumer.rules.tier1MinKg || 25;
    const tier1Pct = (adminConfig.consumer.rules.tier1DiscountPct || 8) / 100;
    const tier2Min = adminConfig.consumer.rules.tier2MinKg || 100;
    const tier2Pct = (adminConfig.consumer.rules.tier2DiscountPct || 15) / 100;

    let discount = 0;
    if (weight >= tier2Min) {
      discount = Math.round(rawSubtotal * tier2Pct);
    } else if (weight >= tier1Min) {
      discount = Math.round(rawSubtotal * tier1Pct);
    }

    const finalAmount = Math.max(0, rawSubtotal - discount);

    return {
      subtotal: rawSubtotal,
      totalWeightKg: weight,
      bulkDiscountAmount: discount,
      finalCartAmount: finalAmount,
      cartItemCount: itemCount
    };
  }, [cartQuantities, combinedProduceList, adminConfig.consumer.rules]);

  // Update quantity handler
  const handleUpdateQuantity = (produceId: string, quantity: number) => {
    setCartQuantities((prev) => ({
      ...prev,
      [produceId]: quantity
    }));
  };

  const handleClearCart = () => {
    setCartQuantities({});
    setNotification({
      message: 'Cart cleared.',
      type: 'info'
    });
    setTimeout(() => setNotification(null), 3000);
  };

  // Navigation handler
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Confirm order from checkout
  const handleConfirmOrder = (newOrder: CustomerOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartQuantities({});
    setIsCheckoutOpen(false);
    setNotification({
      message: `🎉 Order ${newOrder.orderNumber} placed successfully! Harvest & dispatch logged.`,
      type: 'success'
    });

    // Navigate to orders panel to show tracking
    setTimeout(() => {
      handleNavigate('panel-orders');
    }, 150);

    setTimeout(() => {
      setNotification(null);
    }, 6000);
  };

  // Reorder items
  const handleReorder = (order: CustomerOrder) => {
    const newQuantities: Record<string, number> = { ...cartQuantities };
    order.items.forEach((item) => {
      newQuantities[item.produceId] = (newQuantities[item.produceId] || 0) + item.quantityKg;
    });
    setCartQuantities(newQuantities);
    setNotification({
      message: `Added items from ${order.orderNumber} to your cart.`,
      type: 'success'
    });
    handleNavigate('panel-produce');
    setTimeout(() => setNotification(null), 3500);
  };

  const activeOrdersCount = orders.filter((o) => ['Placed', 'Confirmed', 'Dispatched'].includes(o.status)).length;

  return (
    <div className="min-h-screen consumer-dashboard-root text-stone-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900 pb-20 md:pb-10 transition-colors duration-200">
      {/* Sticky Header with Live Cart Total */}
      <Header
        totalCartAmount={finalCartAmount}
        totalWeightKg={totalWeightKg}
        cartItemCount={cartItemCount}
        onProceedToOrder={() => setIsCheckoutOpen(true)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Optional Notification Toast */}
      {notification && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3 w-full">
          <div
            role="status"
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between shadow-xs transition-all border ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : 'bg-stone-900 text-stone-100 border-stone-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotification(null)}
              className="text-xs opacity-70 hover:opacity-100 ml-4 px-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Dashboard Layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        {/* Scenic Farm-to-Table Banner */}
        <div className="relative rounded-2xl overflow-hidden shadow-md border border-blue-500/20 mb-6 bg-gradient-to-r from-blue-950/90 via-slate-900/80 to-emerald-950/90 p-5 sm:p-6 text-white">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay pointer-events-none"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=1200&auto=format&fit=crop&q=80')` }}
          />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  🌿 100% Certified Direct Producer Store
                </span>
                <span className="text-xs text-slate-300">• Farm-to-Doorstep</span>
              </div>
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white">
                AgriDirect Consumer Marketplace
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Fresh harvest delivered straight from Indian farms with verified origin tracing, zero pesticide certifications, and fair pricing.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="bg-white/10 dark:bg-slate-900/60 backdrop-blur-md rounded-xl p-3 border border-white/15 text-center min-w-[100px]">
                <p className="text-[10px] text-blue-300 uppercase font-semibold">Tier Discount</p>
                <p className="text-xl font-extrabold text-white">Up to 15%</p>
              </div>
              <div className="bg-white/10 dark:bg-slate-900/60 backdrop-blur-md rounded-xl p-3 border border-white/15 text-center min-w-[100px]">
                <p className="text-[10px] text-emerald-300 uppercase font-semibold">Quality Assured</p>
                <p className="text-xl font-extrabold text-white">Grade A</p>
              </div>
            </div>
          </div>
        </div>

        {/* Focused Panel Mode or 2x2 Clean Responsive Grid */}
        {activeSection === 'all' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch animate-in fade-in duration-200">
            {/* Panel 1: Browse & Buy Produce */}
            <div className="h-full min-h-[560px]">
              <BrowseProducePanel
                produceList={combinedProduceList}
                cartQuantities={cartQuantities}
                onUpdateQuantity={handleUpdateQuantity}
                onClearCart={handleClearCart}
                onProceedToOrder={() => setIsCheckoutOpen(true)}
                subtotal={subtotal}
                totalWeightKg={totalWeightKg}
                bulkDiscountAmount={bulkDiscountAmount}
                finalCartAmount={finalCartAmount}
                onOpenRaiseDemand={() => setIsRaiseDemandOpen(true)}
              />
            </div>

            {/* Panel 2: My Orders */}
            <div className="h-full min-h-[560px]">
              <MyOrdersPanel
                orders={orders}
                onReorder={handleReorder}
                onViewReceipt={(order) => setViewingReceiptOrder(order)}
              />
            </div>

            {/* Panel 3: Buying & Storage Guidance */}
            <div className="h-full min-h-[560px]">
              <GuidancePanel topics={GUIDANCE_TOPICS} />
            </div>

            {/* Panel 4: Offers & Consumer Schemes */}
            <div className="h-full min-h-[560px]">
              <OffersSchemesPanel
                schemes={CONSUMER_SCHEMES}
                onSelectScheme={(scheme) => setSelectedScheme(scheme)}
              />
            </div>
          </div>
        ) : (
          <div className="w-full max-w-5xl mx-auto animate-in fade-in duration-200 space-y-6">
            {activeSection === 'panel-produce' && (
              <BrowseProducePanel
                produceList={combinedProduceList}
                cartQuantities={cartQuantities}
                onUpdateQuantity={handleUpdateQuantity}
                onClearCart={handleClearCart}
                onProceedToOrder={() => setIsCheckoutOpen(true)}
                subtotal={subtotal}
                totalWeightKg={totalWeightKg}
                bulkDiscountAmount={bulkDiscountAmount}
                finalCartAmount={finalCartAmount}
                onOpenRaiseDemand={() => setIsRaiseDemandOpen(true)}
              />
            )}

            {activeSection === 'panel-orders' && (
              <MyOrdersPanel
                orders={orders}
                onReorder={handleReorder}
                onViewReceipt={(order) => setViewingReceiptOrder(order)}
              />
            )}

            {activeSection === 'panel-guidance' && (
              <GuidancePanel topics={GUIDANCE_TOPICS} />
            )}

            {activeSection === 'panel-offers' && (
              <OffersSchemesPanel
                schemes={CONSUMER_SCHEMES}
                onSelectScheme={(scheme) => setSelectedScheme(scheme)}
              />
            )}
          </div>
        )}
      </main>

      {/* Sticky Quick-Navigation Bar for Mobile */}
      <MobileNav
        activeSection={activeSection}
        onNavigate={handleNavigate}
        activeOrdersCount={activeOrdersCount}
        cartItemCount={cartItemCount}
      />

      {/* Modals */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        produceList={combinedProduceList}
        cartQuantities={cartQuantities}
        subtotal={subtotal}
        bulkDiscountAmount={bulkDiscountAmount}
        finalCartAmount={finalCartAmount}
        totalWeightKg={totalWeightKg}
        onConfirmOrder={handleConfirmOrder}
      />

      <SchemeDetailModal
        scheme={selectedScheme}
        onClose={() => setSelectedScheme(null)}
      />

      <ReceiptModal
        order={viewingReceiptOrder}
        onClose={() => setViewingReceiptOrder(null)}
      />

      <RaiseConsumerDemandModal
        isOpen={isRaiseDemandOpen}
        onClose={() => setIsRaiseDemandOpen(false)}
        onDemandSubmitted={(demand) => {
          setNotification({
            message: `🎉 Your demand for ${demand.commodity} (${demand.requiredQty} ${demand.unit}) has been broadcasted to farmers!`,
            type: 'success',
          });
          setTimeout(() => setNotification(null), 6000);
        }}
      />
    </div>
  );
}
