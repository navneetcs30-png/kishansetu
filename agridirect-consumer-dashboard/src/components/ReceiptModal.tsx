import React from 'react';
import { CustomerOrder } from '../types';
import { X, Printer, CheckCircle2, ShieldCheck, MapPin, Calendar, Sprout } from 'lucide-react';

interface ReceiptModalProps {
  order: CustomerOrder | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs"
    >
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
              <Sprout className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <h3 id="receipt-modal-title" className="text-sm sm:text-base font-bold text-stone-900">
                Direct-Mandi Tax Invoice / Receipt
              </h3>
              <span className="text-[11px] text-stone-500 font-mono">
                {order.orderNumber}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close receipt"
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          <div className="text-center pb-2 border-b border-stone-200">
            <p className="font-bold text-stone-900 text-sm">AgriDirect Consumer Collective</p>
            <p className="text-stone-500 text-[11px]">Direct Farmer-to-Consumer Digital Mandi</p>
            <div className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-mono text-[10px] font-semibold border border-emerald-200">
              STATUS: {order.status.toUpperCase()}
            </div>
          </div>

          {/* Details Table */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200">
            <div>
              <span className="text-stone-400 block">Date & Time:</span>
              <span className="font-medium text-stone-800">{order.orderDate}</span>
            </div>
            <div>
              <span className="text-stone-400 block">Payment Mode:</span>
              <span className="font-medium text-stone-800">{order.paymentMethod}</span>
            </div>
            <div className="col-span-2 pt-1 border-t border-stone-200/60">
              <span className="text-stone-400 block">Cooperative Source:</span>
              <span className="font-medium text-stone-800">{order.farmerGroup}</span>
            </div>
            <div className="col-span-2 pt-1 border-t border-stone-200/60">
              <span className="text-stone-400 block">Delivering To:</span>
              <span className="font-medium text-stone-800">{order.deliveryAddress}</span>
            </div>
          </div>

          {/* Items */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
              Produce Items
            </h4>
            <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100">
              {order.items.map((it) => (
                <div key={it.produceId} className="p-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-stone-900">{it.name}</span>
                    <div className="text-stone-500 text-[10px] font-mono">
                      {it.quantityKg} kg × ₹{it.pricePerKg}/kg
                    </div>
                  </div>
                  <span className="font-mono font-bold text-stone-900">
                    ₹{it.subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1 font-mono text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal:</span>
              <span>₹{order.subtotalAmount.toLocaleString('en-IN')}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Bulk Saver Rebate:</span>
                <span>-₹{order.discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>Logistics / Delivery:</span>
              <span>{order.deliveryFee === 0 ? '₹0 (FREE)' : `₹${order.deliveryFee}`}</span>
            </div>
            <div className="flex justify-between text-stone-900 font-bold border-t border-stone-200 pt-1 text-sm">
              <span>Total Paid:</span>
              <span>₹{order.finalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <p className="text-[10px] text-stone-400 text-center">
            Certified zero middleman trade. All funds settle directly to farmer cooperative account.
          </p>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Receipt
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
