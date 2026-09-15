import React from 'react';
import { 
  X, 
  Truck, 
  Building, 
  MapPin, 
  CheckCircle2, 
  FileCheck, 
  AlertTriangle, 
  ShieldCheck, 
  Phone, 
  Download, 
  Calendar,
  Scale
} from 'lucide-react';
import { ContractOrder } from '../types';
import { formatINR, formatNumber } from '../utils/formatters';

interface ContractDetailsModalProps {
  contract: ContractOrder | null;
  onClose: () => void;
  onResolveAction: (contract: ContractOrder) => void;
}

export const ContractDetailsModal: React.FC<ContractDetailsModalProps> = ({
  contract,
  onClose,
  onResolveAction,
}) => {
  if (!contract) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contract-modal-title"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700 font-bold">
                {contract.contractRef}
              </span>
              <span className="text-xs text-slate-300">
                Status: <strong className="text-white">{contract.status}</strong>
              </span>
            </div>
            <h3 id="contract-modal-title" className="text-base sm:text-lg font-bold font-display mt-1">
              Consignment Manifest & QC Dossier
            </h3>
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

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-slate-700 dark:text-slate-300">
          {/* Commodity & Financial Summary Box */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850/50 border border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px]">Commodity</div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">{contract.item}</div>
              <div className="text-slate-600 dark:text-slate-400 text-[10px]">{contract.variety}</div>
            </div>

            <div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px]">Quantity</div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">
                {formatNumber(contract.quantityQuintals)} Quintals
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-[10px]">{(contract.quantityQuintals / 10).toFixed(1)} Metric Tonnes</div>
            </div>

            <div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px]">Agreed Rate</div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">
                {formatINR(contract.agreedRatePerQuintal)}/Q
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-[10px]">Mandi Benchmark</div>
            </div>

            <div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px]">Total Contract Value</div>
              <div className="font-extrabold text-emerald-800 dark:text-emerald-400 text-sm sm:text-base font-display">
                {formatINR(contract.totalValue)}
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-[10px]">Escrow Protected</div>
            </div>
          </div>

          {/* Logistics & Dispatch Vehicle Details */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3 bg-white dark:bg-slate-900">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <Truck className="w-4 h-4 text-blue-700 dark:text-blue-400" />
              Consignment Dispatch & Carrier Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-150 dark:border-slate-800">
                <div className="text-slate-500 dark:text-slate-400 text-[11px]">Vehicle Registration No.</div>
                <div className="font-bold text-slate-900 dark:text-white font-mono text-sm">{contract.vehicleNo || 'Allocation Pending'}</div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  Driver: {contract.driverContact || 'FPO Dispatch Desk'}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-150 dark:border-slate-800">
                <div className="text-slate-500 dark:text-slate-400 text-[11px]">Official e-Way Bill No.</div>
                <div className="font-bold text-slate-900 dark:text-white font-mono text-sm">{contract.eWayBillNo || 'Pending'}</div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-1">Part-B Active • GST Exempt Agricultural Produce</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-150 dark:border-slate-800">
                <div className="text-slate-500 dark:text-slate-400 text-[11px]">FPO Supplier Collective</div>
                <div className="font-bold text-slate-900 dark:text-white">{contract.supplierGroup}</div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-1">Verified FPO / Primary Agricultural Society</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-150 dark:border-slate-800">
                <div className="text-slate-500 dark:text-slate-400 text-[11px]">Destination Delivery Point</div>
                <div className="font-bold text-slate-900 dark:text-white">{contract.destinationMandi}</div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-1">Timeline: {contract.deliveryTimeline}</div>
              </div>
            </div>
          </div>

          {/* Weighbridge & Assaying Inspection Report */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3 bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs uppercase tracking-wider">
                <Scale className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                Weighbridge Weight & Moisture Assaying Report
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {contract.inspectionStatus || 'Pending'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Gross Loaded Tare</div>
                <div className="font-bold text-slate-900 dark:text-white">32.40 MT</div>
              </div>
              <div className="p-2 rounded bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Unladen Truck Tare</div>
                <div className="font-bold text-slate-900 dark:text-white">8.20 MT</div>
              </div>
              <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80">
                <div className="text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold">Net Produce Weight</div>
                <div className="font-extrabold text-emerald-950 dark:text-emerald-200 font-display">
                  {(contract.quantityQuintals / 10).toFixed(2)} MT ({formatNumber(contract.quantityQuintals)} Q)
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-850 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span>Assaying Laboratory: <strong className="text-slate-900 dark:text-white">NABL Mandi Gate Testing Cell</strong></span>
              <span>Moisture: <strong className="text-slate-900 dark:text-white">11.2% (Within ≤12% benchmark)</strong></span>
            </div>
          </div>

          {/* Action Required Callout if any */}
          {contract.actionRequired && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Buyer Action Required
                </div>
                <div className="text-xs text-amber-800 dark:text-amber-200 mt-0.5">
                  {contract.actionRequired}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onResolveAction(contract)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-xs transition shrink-0"
              >
                Approve & Execute Action
              </button>
            </div>
          )}

          {/* Footer Actions inside Modal */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => alert(`Simulated downloading official Mandi Tax & Consignment Invoice for ${contract.contractRef}`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Download Tax Invoice / Consignment Slip</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white text-xs font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
