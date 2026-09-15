import React, { useState } from 'react';
import { ProduceItem, CustomerOrder, OrderItemDetail } from '../types';
import {
  X,
  MapPin,
  Clock,
  CreditCard,
  Truck,
  CheckCircle2,
  ShieldCheck,
  Scale
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  produceList: ProduceItem[];
  cartQuantities: Record<string, number>;
  subtotal: number;
  bulkDiscountAmount: number;
  finalCartAmount: number;
  totalWeightKg: number;
  onConfirmOrder: (newOrder: CustomerOrder) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  produceList,
  cartQuantities,
  subtotal,
  bulkDiscountAmount,
  finalCartAmount,
  totalWeightKg,
  onConfirmOrder
}) => {
  const [customerName, setCustomerName] = useState('Ananya Sharma');
  const [deliveryAddress, setDeliveryAddress] = useState('Flat 402, Green Meadows Residency, Sector 14');
  const [deliverySlot, setDeliverySlot] = useState('Morning (8:00 AM - 12:00 PM)');
  const [paymentMethod, setPaymentMethod] = useState('UPI (Instant Farm Transfer)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Selected produce items
  const selectedItems: OrderItemDetail[] = Object.entries(cartQuantities)
    .filter(([_, qty]) => Number(qty) > 0)
    .map(([id, rawQty]) => {
      const qty = Number(rawQty) || 0;
      const prod = produceList.find((p) => p.id === id)!;
      return {
        produceId: id,
        name: prod.name,
        variety: prod.variety,
        quantityKg: qty,
        pricePerKg: prod.pricePerKg,
        subtotal: qty * prod.pricePerKg
      };
    });

  const deliveryFee = finalCartAmount > 500 ? 0 : 40;
  const grandTotal = finalCartAmount + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Form random order number
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `AGR-2026-${randomNum}`;

    const newOrder: CustomerOrder = {
      id: `ord-${randomNum}`,
      orderNumber,
      orderDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      expectedDeliveryDate: 'Sep 16, 2026 (Within 36 hrs)',
      farmerGroup: 'Direct Kisan Cooperative Network',
      deliveryAddress,
      deliverySlot,
      paymentMethod,
      status: 'Placed',
      totalWeightKg: Math.round(totalWeightKg * 10) / 10,
      subtotalAmount: subtotal,
      discountAmount: bulkDiscountAmount,
      deliveryFee,
      finalAmount: grandTotal,
      items: selectedItems,
      trackingSteps: [
        {
          step: 'Placed',
          label: 'Order Placed',
          description: 'Direct procurement request logged. Awaiting farmer morning harvest queue.',
          timestamp: 'Just Now',
          completed: true,
          current: true
        },
        {
          step: 'Confirmed',
          label: 'Farmer Confirmation',
          description: 'Farmer quality weigh check and eco-jute packing scheduled.',
          completed: false,
          current: false
        },
        {
          step: 'Dispatched',
          label: 'Dispatched (In Transit)',
          description: 'Refrigerated agro-logistics direct transport.',
          completed: false,
          current: false
        },
        {
          step: 'Delivered',
          label: 'Doorstep Delivery',
          description: 'Delivery with digital weighing scale proof.',
          completed: false,
          current: false
        }
      ]
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmOrder(newOrder);
    }, 400);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs"
    >
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 id="checkout-modal-title" className="text-base sm:text-lg font-bold text-stone-900">
                Confirm Direct-Farm Order
              </h3>
              <p className="text-xs text-stone-500">
                Direct procurement from verified village cooperatives
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Itemized Order Review */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Produce Selected ({selectedItems.length} items)
              </h4>
              <span className="text-xs font-medium text-stone-600 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-stone-400" />
                {totalWeightKg.toFixed(1)} kg total
              </span>
            </div>

            <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100 max-h-40 overflow-y-auto">
              {selectedItems.map((item) => (
                <div key={item.produceId} className="p-2.5 flex items-center justify-between text-xs bg-stone-50/50">
                  <div>
                    <span className="font-semibold text-stone-900">{item.name}</span>
                    <span className="text-stone-500 ml-1">({item.variety})</span>
                    <div className="text-[11px] text-stone-500 font-mono">
                      {item.quantityKg} kg × ₹{item.pricePerKg}/kg
                    </div>
                  </div>
                  <span className="font-bold text-stone-900 font-mono">
                    ₹{item.subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Delivery Information
            </h4>

            <div>
              <label htmlFor="customer-name" className="block text-xs font-medium text-stone-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                id="customer-name"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label htmlFor="delivery-address" className="block text-xs font-medium text-stone-700 mb-1">
                Delivery Address (with House/Flat Number)
              </label>
              <input
                type="text"
                id="delivery-address"
                required
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="delivery-slot" className="block text-xs font-medium text-stone-700 mb-1">
                  Preferred Delivery Slot
                </label>
                <select
                  id="delivery-slot"
                  value={deliverySlot}
                  onChange={(e) => setDeliverySlot(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Morning (8:00 AM - 12:00 PM)">Morning (8:00 AM - 12:00 PM)</option>
                  <option value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1:00 PM - 4:00 PM)</option>
                  <option value="Evening (5:00 PM - 8:00 PM)">Evening (5:00 PM - 8:00 PM)</option>
                </select>
              </div>

              <div>
                <label htmlFor="payment-method" className="block text-xs font-medium text-stone-700 mb-1">
                  Payment Mode
                </label>
                <select
                  id="payment-method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="UPI (Instant Farm Transfer)">UPI (Instant Farm Transfer)</option>
                  <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
                  <option value="NetBanking (Direct Mandi Settlement)">NetBanking (Direct Mandi Settlement)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing Breakdown Card */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 font-mono space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal:</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {bulkDiscountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Bulk Saver Rebate:</span>
                <span>-₹{bulkDiscountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>Cooperative Logistics:</span>
              <span>{deliveryFee === 0 ? 'FREE (Orders > ₹500)' : `₹${deliveryFee}`}</span>
            </div>
            <div className="flex justify-between text-stone-900 font-bold border-t border-stone-200 pt-1.5 text-sm">
              <span>Total Payable:</span>
              <span>₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-medium"
            >
              Back to Browse
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-600 active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Placing Order...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Place Order</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
