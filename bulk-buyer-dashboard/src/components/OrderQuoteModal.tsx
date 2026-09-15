import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  FileText, 
  MapPin, 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  Calendar,
  AlertCircle,
  Building2,
  UploadCloud,
  BadgeCheck
} from 'lucide-react';
import { Commodity, ContractOrder, OrganizationVerification } from '../types';
import { formatINR, formatNumber, getEffectiveRate } from '../utils/formatters';

interface OrderQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  commodities: Commodity[];
  quantities: Record<string, number>;
  mode: 'order' | 'quote';
  verification?: OrganizationVerification;
  onSubmitSuccess: (newContract: ContractOrder) => void;
  onOpenVerification?: () => void;
}

export const OrderQuoteModal: React.FC<OrderQuoteModalProps> = ({
  isOpen,
  onClose,
  commodities,
  quantities,
  mode,
  verification,
  onSubmitSuccess,
  onOpenVerification,
}) => {
  const [destinationMandi, setDestinationMandi] = useState('Azadpur Mandi Wholesale Shed, New Delhi');
  const [deliveryTimeline, setDeliveryTimeline] = useState('Within 5 Business Days');
  const [paymentTerms, setPaymentTerms] = useState('20% Advance Escrow • 60% On Dispatch • 20% Post QC');
  const [inspectionClause, setInspectionClause] = useState('NABL Assaying at Gate Entry Weighbridge');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;


  // Selected commodities summary
  const selectedItems = commodities
    .map((c) => {
      const qty = quantities[c.id] || 0;
      if (qty <= 0) return null;
      const { rate, activeTier, discountPercent } = getEffectiveRate(c, qty);
      return {
        commodity: c,
        qty,
        rate,
        activeTier,
        discountPercent,
        lineTotal: qty * rate,
      };
    })
    .filter(Boolean) as {
    commodity: Commodity;
    qty: number;
    rate: number;
    activeTier: any;
    discountPercent: number;
    lineTotal: number;
  }[];

  const totalValue = selectedItems.reduce((acc, item) => acc + item.lineTotal, 0);
  const totalQuintals = selectedItems.reduce((acc, item) => acc + item.qty, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      // Pick first commodity as main representation or combined
      const primaryItem = selectedItems[0]?.commodity;
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      const contractRef = `B2B-2026-${(primaryItem?.origin.split(' ')[0] || 'MANDI').toUpperCase().slice(0, 5)}-${randomSuffix}`;

      const newContract: ContractOrder = {
        id: `ord-${Date.now()}`,
        contractRef,
        supplierGroup: primaryItem?.fpoSupplier || 'Consolidated Farmers Federation',
        item: selectedItems.length === 1 
          ? primaryItem?.name || 'Bulk Grain Lot'
          : `${primaryItem?.name || 'Bulk Lot'} + ${selectedItems.length - 1} more`,
        variety: primaryItem?.variety || 'Standard Agmark Grade',
        quantityQuintals: totalQuintals,
        agreedRatePerQuintal: selectedItems[0]?.rate || 2500,
        totalValue,
        status: mode === 'order' ? 'Confirmed' : 'Requested',
        orderDate: 'Today (Just Now)',
        deliveryTimeline,
        destinationMandi,
        nearingDelivery: false,
        actionRequired: mode === 'order' 
          ? '20% Advance Escrow Deposit Pending Bank Authorization' 
          : 'Awaiting FPO Official Price Quotation Acceptance',
        vehicleNo: 'Allocation in progress',
        driverContact: 'Logistics Desk (+91 80 2341 8800)',
        eWayBillNo: 'Draft Pending',
        inspectionStatus: 'Pending',
      };

      setIsSubmitting(false);
      onSubmitSuccess(newContract);
    }, 600);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 id="modal-title" className="text-base sm:text-lg font-bold font-display">
                {mode === 'order' ? 'Confirm B2B Wholesale Bulk Order' : 'Request Official Mandi Quotation'}
              </h3>
              <p className="text-xs text-slate-300">
                Direct B2B transaction with verified Farmer Producer Organizations (FPOs)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Order Summary Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-850/50">
            <div className="p-3 bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-750 text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
              <span>Selected Commodities ({selectedItems.length})</span>
              <span>Total: {formatINR(totalValue)}</span>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
              {selectedItems.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{item.commodity.name}</div>
                    <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                      {item.commodity.fpoSupplier} • {item.commodity.origin}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-slate-900 dark:text-white">{formatINR(item.lineTotal)}</div>
                    <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                      {formatNumber(item.qty)} Q @ {formatINR(item.rate)}/Q
                      {item.discountPercent > 0 && (
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold ml-1">
                          ({item.discountPercent}% bulk tier)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-750 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
              <span>Consignment Weight: {formatNumber(totalQuintals)} Quintals ({(totalQuintals/10).toFixed(1)} MT)</span>
              <span className="text-sm font-extrabold text-emerald-800 dark:text-emerald-400 font-display">
                Net Value: {formatINR(totalValue)}
              </span>
            </div>
          </div>

          {/* Organization Verification Status in Order Modal */}
          {verification && (
            <div className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
              verification.overallStatus === 'Verified'
                ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200'
            }`}>
              <div className="flex items-center gap-2">
                {verification.overallStatus === 'Verified' ? (
                  <BadgeCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
                )}
                <div>
                  <span className="font-bold">
                    {verification.companyName} ({verification.overallStatus})
                  </span>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">
                    GSTIN: {verification.gstin} • License: {verification.mandiLicenseNo}
                  </div>
                </div>
              </div>

              {verification.overallStatus !== 'Verified' && onOpenVerification && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenVerification();
                  }}
                  className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px] shrink-0 transition"
                >
                  Upload GST & License
                </button>
              )}
            </div>
          )}


          {/* Form Fields: Destination & Logistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label htmlFor="modal-dest-mandi" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Destination Mandi / Warehouse Hub:
              </label>
              <select
                id="modal-dest-mandi"
                value={destinationMandi}
                onChange={(e) => setDestinationMandi(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="Azadpur Mandi Wholesale Shed, New Delhi">Azadpur Mandi Wholesale Shed, New Delhi</option>
                <option value="APMC Vashi Terminal Yard, Navi Mumbai">APMC Vashi Terminal Yard, Navi Mumbai</option>
                <option value="Yeshwanthpur Wholesale Hub, Bengaluru">Yeshwanthpur Wholesale Hub, Bengaluru</option>
                <option value="Koyambedu Wholesale Market, Chennai">Koyambedu Wholesale Market, Chennai</option>
                <option value="Central Silo Warehouse Bay 3, Indore">Central Silo Warehouse Bay 3, Indore</option>
              </select>
            </div>

            <div>
              <label htmlFor="modal-delivery-timeline" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Preferred Delivery Schedule:
              </label>
              <select
                id="modal-delivery-timeline"
                value={deliveryTimeline}
                onChange={(e) => setDeliveryTimeline(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="Express Dispatch (Within 48 Hours)">Express Dispatch (Within 48 Hours)</option>
                <option value="Within 5 Business Days">Within 5 Business Days</option>
                <option value="Staggered Batches over 15 Days">Staggered Batches over 15 Days</option>
                <option value="Forward Contract (Next Month Delivery)">Forward Contract (Next Month Delivery)</option>
              </select>
            </div>
          </div>

          {/* Payment Terms & Assaying */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label htmlFor="modal-payment-terms" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Payment Staging & Escrow:
              </label>
              <select
                id="modal-payment-terms"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="20% Advance Escrow • 60% On Dispatch • 20% Post QC">
                  20% Advance Escrow • 60% On Dispatch • 20% Post QC (Recommended)
                </option>
                <option value="100% Irrevocable Inland Letter of Credit (LC)">
                  100% Irrevocable Inland Letter of Credit (LC)
                </option>
                <option value="e-NAM Integrated Clearing Bank Escrow (T+1 Settlement)">
                  e-NAM Integrated Clearing Bank Escrow (T+1 Settlement)
                </option>
              </select>
            </div>

            <div>
              <label htmlFor="modal-inspection-clause" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Quality Inspection / Assaying Protocol:
              </label>
              <select
                id="modal-inspection-clause"
                value={inspectionClause}
                onChange={(e) => setInspectionClause(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="NABL Assaying at Gate Entry Weighbridge">NABL Assaying at Gate Entry Weighbridge</option>
                <option value="Agmark Authorized Third-Party Sampler">Agmark Authorized Third-Party Sampler</option>
                <option value="Buyer Self-Inspection with Joint Sampling">Buyer Self-Inspection with Joint Sampling</option>
              </select>
            </div>
          </div>

          {/* Special Instructions */}
          <div className="text-xs">
            <label htmlFor="modal-special-instructions" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Consignment Packaging & Tare Notes (Optional):
            </label>
            <textarea
              id="modal-special-instructions"
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g., 50kg new HDPE gunny bags required, maximum moisture tolerance 11.5%..."
              className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Statutory Security Callout */}
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Statutory Protection: </strong>
              Funds remain held in Mandi Clearing Escrow until weighbridge weight slip and quality moisture parameters are digitally approved by your QC manager.
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              id="confirm-order-submit-btn"
              disabled={isSubmitting || selectedItems.length === 0}
              className="px-5 py-2 rounded-lg bg-emerald-700 dark:bg-emerald-600 hover:bg-emerald-800 dark:hover:bg-emerald-500 active:bg-emerald-900 text-white text-xs font-bold shadow-sm transition disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <span>Generating Contract...</span>
              ) : mode === 'order' ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Execute Order ({formatINR(totalValue)})</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Submit RFP for Quotation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
