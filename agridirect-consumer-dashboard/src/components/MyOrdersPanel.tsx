import React, { useState } from 'react';
import { CustomerOrder, OrderStatus } from '../types';
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronUp,
  Receipt,
  RotateCcw,
  AlertCircle
} from 'lucide-react';

interface MyOrdersPanelProps {
  orders: CustomerOrder[];
  onReorder: (order: CustomerOrder) => void;
  onViewReceipt: (order: CustomerOrder) => void;
}

export const MyOrdersPanel: React.FC<MyOrdersPanelProps> = ({
  orders,
  onReorder,
  onViewReceipt
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'delivered'>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(orders[0]?.id || null);

  const activeStatuses: OrderStatus[] = ['Placed', 'Confirmed', 'Dispatched'];

  const filteredOrders = orders.filter((ord) => {
    if (filterTab === 'active') return activeStatuses.includes(ord.status);
    if (filterTab === 'delivered') return ord.status === 'Delivered';
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Placed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600" />
            Order Placed
          </span>
        );
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <CheckCircle2 className="w-3 h-3 text-amber-600" />
            Confirmed by Farmer
          </span>
        );
      case 'Dispatched':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 ring-2 ring-emerald-500/20 animate-pulse">
            <Truck className="w-3 h-3 text-emerald-600" />
            Dispatched (In Transit)
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
            <CheckCircle2 className="w-3 h-3 text-stone-600" />
            Delivered
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section
      id="panel-orders"
      aria-labelledby="orders-heading"
      className="bg-white dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-xs flex flex-col h-full overflow-hidden transition-colors duration-200"
    >
      {/* Panel Header */}
      <div className="p-5 sm:p-6 border-b border-stone-200 dark:border-slate-800 bg-stone-50/70 dark:bg-slate-900/90">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h2 id="orders-heading" className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white tracking-tight">
                My Orders & Live Tracking
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-slate-400 mt-1">
              Real-time farm-gate dispatch milestones with weight verification and ETA.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center bg-stone-200/80 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-medium border border-stone-300 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterTab === 'all'
                  ? 'bg-white dark:bg-emerald-700 text-stone-900 dark:text-white shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              All ({orders.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('active')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterTab === 'active'
                  ? 'bg-white dark:bg-emerald-700 text-emerald-800 dark:text-white shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Active ({orders.filter((o) => activeStatuses.includes(o.status)).length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('delivered')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterTab === 'delivered'
                  ? 'bg-white dark:bg-emerald-700 text-stone-900 dark:text-white shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Delivered ({orders.filter((o) => o.status === 'Delivered').length})
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="p-4 sm:p-6 flex-1 overflow-y-auto max-h-[600px] space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-stone-500 dark:text-slate-400">
            <Package className="w-10 h-10 text-stone-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-stone-800 dark:text-slate-200">No orders in this view</p>
            <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
              Select produce from the Browse panel and proceed to place an order.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const isActive = activeStatuses.includes(order.status);

            return (
              <article
                key={order.id}
                className={`rounded-xl border transition-all overflow-hidden ${
                  isActive
                    ? 'border-emerald-200 dark:border-emerald-800/80 bg-white dark:bg-slate-900/90 shadow-xs'
                    : 'border-stone-200 dark:border-slate-800 bg-stone-50/40 dark:bg-slate-900/60'
                }`}
              >
                {/* Order Summary Header Bar */}
                <div
                  onClick={() => toggleExpand(order.id)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-stone-50/80 dark:hover:bg-slate-800/60 transition-colors"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleExpand(order.id);
                    }
                  }}
                  aria-expanded={isExpanded}
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-stone-900 dark:text-white">
                        {order.orderNumber}
                      </span>
                      {getStatusBadge(order.status)}
                      <span className="text-xs text-stone-500 dark:text-slate-400 font-mono">
                        • {order.orderDate}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-stone-700 dark:text-slate-200">
                      {order.items.map((it) => `${it.name} (${it.quantityKg}kg)`).join(', ')}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-stone-500 dark:text-slate-400">
                      <span>Total: <strong className="text-stone-700 dark:text-slate-200">{order.totalWeightKg} kg</strong></span>
                      <span>•</span>
                      <span>Cooperative: {order.farmerGroup}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 dark:border-slate-800">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-stone-400 dark:text-slate-500 block uppercase">
                        Total Amount
                      </span>
                      <span className="text-base font-bold text-stone-900 dark:text-white font-mono">
                        ₹{order.finalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="text-stone-400 dark:text-slate-400 p-1">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details & Status Pipeline */}
                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-stone-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-5">
                    {/* Status Tracking Pipeline Stepper */}
                    <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-950 border border-stone-200/80 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-slate-300">
                          Delivery Lifecycle Status
                        </span>
                        <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          Expected: {order.expectedDeliveryDate}
                        </span>
                      </div>

                      {/* 4-Step Pipeline Bar */}
                      <div className="relative mt-2">
                        {/* Connecting Line */}
                        <div className="absolute top-3.5 left-4 right-4 h-0.5 bg-stone-200 dark:bg-slate-700 z-0" />

                        <div className="grid grid-cols-4 gap-2 relative z-10">
                          {order.trackingSteps.map((stepItem, idx) => {
                            const isCurrent = stepItem.current;
                            const isCompleted = stepItem.completed;

                            return (
                              <div key={stepItem.step} className="flex flex-col items-center text-center">
                                {/* Step Circle Indicator */}
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                    isCurrent
                                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-950 shadow-sm scale-110'
                                      : isCompleted
                                      ? 'bg-emerald-700 text-white'
                                      : 'bg-stone-200 dark:bg-slate-800 text-stone-500 dark:text-slate-400 border border-stone-300 dark:border-slate-700'
                                  }`}
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                  ) : (
                                    idx + 1
                                  )}
                                </div>

                                <div className="mt-1.5">
                                  <div
                                    className={`text-[11px] font-bold ${
                                      isCurrent
                                        ? 'text-emerald-800 dark:text-emerald-400'
                                        : isCompleted
                                        ? 'text-stone-900 dark:text-white'
                                        : 'text-stone-400 dark:text-slate-500'
                                    }`}
                                  >
                                    {stepItem.label}
                                  </div>
                                  {stepItem.timestamp && (
                                    <div className="text-[10px] text-stone-500 dark:text-slate-400 font-mono">
                                      {stepItem.timestamp}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Current Status Explanation Note */}
                      {order.trackingSteps.find((s) => s.current) && (
                        <div className="mt-4 p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-950 dark:text-emerald-200 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <strong>Active Progress: </strong>
                            {order.trackingSteps.find((s) => s.current)?.description}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Itemized Order Breakdown */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400 mb-2">
                        Itemized Produce Breakdown
                      </h4>
                      <div className="border border-stone-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-stone-100 dark:divide-slate-800">
                        {order.items.map((it) => (
                          <div
                            key={it.produceId}
                            className="p-3 flex items-center justify-between text-xs"
                          >
                            <div>
                              <span className="font-semibold text-stone-900 dark:text-white">{it.name}</span>
                              <span className="text-stone-500 dark:text-slate-400 ml-1.5 font-normal">
                                ({it.variety})
                              </span>
                              <div className="text-stone-500 dark:text-slate-400 font-mono text-[11px]">
                                {it.quantityKg} kg × ₹{it.pricePerKg}/kg
                              </div>
                            </div>
                            <span className="font-bold text-stone-900 dark:text-white font-mono">
                              ₹{it.subtotal.toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery & Payment Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-stone-50 dark:bg-slate-950 p-3.5 rounded-xl border border-stone-200 dark:border-slate-800">
                      <div>
                        <span className="text-stone-500 dark:text-slate-400 block text-[11px]">Delivery Address:</span>
                        <p className="font-medium text-stone-800 dark:text-slate-200 flex items-start gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-stone-500 dark:text-slate-400 shrink-0 mt-0.5" />
                          {order.deliveryAddress}
                        </p>
                        <span className="text-stone-500 dark:text-slate-400 block text-[11px] mt-2">
                          Preferred Slot: <strong className="text-stone-700 dark:text-slate-200">{order.deliverySlot}</strong>
                        </span>
                      </div>

                      <div className="border-t sm:border-t-0 sm:border-l border-stone-200 dark:border-slate-800 pt-2 sm:pt-0 sm:pl-3 space-y-1 font-mono">
                        <div className="flex justify-between text-stone-600 dark:text-slate-300">
                          <span>Subtotal:</span>
                          <span>₹{order.subtotalAmount.toLocaleString('en-IN')}</span>
                        </div>
                        {order.discountAmount > 0 && (
                          <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                            <span>Bulk Saver Discount:</span>
                            <span>-₹{order.discountAmount.toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-stone-600 dark:text-slate-300">
                          <span>Delivery Fee:</span>
                          <span className="text-emerald-700 dark:text-emerald-400 font-sans font-semibold">FREE</span>
                        </div>
                        <div className="flex justify-between text-stone-900 dark:text-white font-bold border-t border-stone-200 dark:border-slate-800 pt-1 text-sm">
                          <span>Total Paid / Payable:</span>
                          <span>₹{order.finalAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="text-[11px] text-stone-500 dark:text-slate-400 font-sans text-right pt-0.5">
                          Method: {order.paymentMethod}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => onViewReceipt(order)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 dark:border-slate-700 text-xs font-medium text-stone-700 dark:text-slate-200 hover:bg-stone-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Receipt className="w-3.5 h-3.5 text-stone-500 dark:text-slate-400" />
                        Digital Receipt
                      </button>

                      <button
                        type="button"
                        onClick={() => onReorder(order)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reorder Items
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </section>
  );
};
