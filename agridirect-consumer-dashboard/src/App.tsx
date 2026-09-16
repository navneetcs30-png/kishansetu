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

  const [orders, setOrders] = useState<CustomerOrder[]>(INITIAL_CUSTOMER_ORDERS);
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>({
    'prod-wheat-sharbati': 10,
    'prod-tomato-vine': 3
  });

  const [activeSection, setActiveSection] = useState<string>('panel-produce');
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
        const item = activeProduceList.find((p) => p.id === prodId);
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
  }, [cartQuantities, activeProduceList, adminConfig.consumer.rules]);

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
    <div className="min-h-screen consumer-dashboard-root bg-stone-100/70 dark:bg-slate-950 text-stone-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900 pb-20 md:pb-10 transition-colors duration-200">
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
        {/* Buyer Welcome & Layout Context */}
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
              Customer Produce & Procurement Hub
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-slate-400 mt-0.5">
              Transparent direct buying, live dispatch tracking, shelf-life guides & consumer welfare schemes.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-[11px] font-medium text-stone-500 dark:text-slate-300 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-slate-800 shadow-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Verified Direct Mandi Feed
            </span>
          </div>
        </div>

        {/* Focused Panel Mode or 2x2 Clean Responsive Grid */}
        {activeSection === 'all' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch animate-in fade-in duration-200">
            {/* Panel 1: Browse & Buy Produce */}
            <div className="h-full min-h-[560px]">
              <BrowseProducePanel
                produceList={activeProduceList}
                cartQuantities={cartQuantities}
                onUpdateQuantity={handleUpdateQuantity}
                onClearCart={handleClearCart}
                onProceedToOrder={() => setIsCheckoutOpen(true)}
                subtotal={subtotal}
                totalWeightKg={totalWeightKg}
                bulkDiscountAmount={bulkDiscountAmount}
                finalCartAmount={finalCartAmount}
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
                produceList={activeProduceList}
                cartQuantities={cartQuantities}
                onUpdateQuantity={handleUpdateQuantity}
                onClearCart={handleClearCart}
                onProceedToOrder={() => setIsCheckoutOpen(true)}
                subtotal={subtotal}
                totalWeightKg={totalWeightKg}
                bulkDiscountAmount={bulkDiscountAmount}
                finalCartAmount={finalCartAmount}
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
        produceList={activeProduceList}
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
    </div>
  );
}
