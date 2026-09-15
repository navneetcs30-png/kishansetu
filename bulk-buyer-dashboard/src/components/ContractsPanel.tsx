import React, { useState } from 'react';
import { 
  FileText, 
  Truck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  Building, 
  MapPin, 
  Calendar, 
  ShieldCheck,
  Search,
  ExternalLink,
  Phone
} from 'lucide-react';
import { ContractOrder, OrderStatus } from '../types';
import { formatINR, formatNumber } from '../utils/formatters';

interface ContractsPanelProps {
  contracts: ContractOrder[];
  onSelectContract: (contract: ContractOrder) => void;
  onConfirmAction: (contract: ContractOrder) => void;
}

const STATUS_STEPS: OrderStatus[] = ['Requested', 'Quoted', 'Confirmed', 'In Transit', 'Delivered'];

export const ContractsPanel: React.FC<ContractsPanelProps> = ({
  contracts,
  onSelectContract,
  onConfirmAction,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filterTabs = [
    { label: 'All', count: contracts.length },
    { label: 'Action Required', count: contracts.filter((c) => !!c.actionRequired).length },
    { label: 'In Transit', count: contracts.filter((c) => c.status === 'In Transit').length },
    { label: 'Confirmed', count: contracts.filter((c) => c.status === 'Confirmed').length },
    { label: 'Quoted', count: contracts.filter((c) => c.status === 'Quoted').length },
    { label: 'Delivered', count: contracts.filter((c) => c.status === 'Delivered').length },
  ];

  const filteredContracts = contracts.filter((contract) => {
    let matchesFilter = true;
    if (filterStatus === 'Action Required') {
      matchesFilter = !!contract.actionRequired;
    } else if (filterStatus !== 'All') {
      matchesFilter = contract.status === filterStatus;
    }

    const matchesSearch = 
      contract.contractRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.supplierGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.destinationMandi.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getStepIndex = (status: OrderStatus) => {
    return STATUS_STEPS.indexOf(status);
  };

  return (
    <section 
      id="contracts-panel" 
      aria-labelledby="contracts-panel-title"
      className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col h-full overflow-hidden"
    >
      {/* Panel Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-linear-to-r from-blue-50/40 dark:from-blue-950/30 via-white dark:via-slate-900 to-transparent">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 id="contracts-panel-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
                Active Contracts & Orders Panel
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ongoing procurement milestones, weighbridge QC status & dispatch manifests.
              </p>
            </div>
          </div>

          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            {contracts.length} Total Contracts
          </span>
        </div>

        {/* Search & Status Filter Toolbar */}
        <div className="mt-3.5 space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              id="contracts-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by contract #, FPO, commodity, or mandi destination..."
              aria-label="Filter active bulk contracts"
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none" role="tablist" aria-label="Contract status filter tabs">
            {filterTabs.map((tab) => (
              <button
                key={tab.label}
                type="button"
                role="tab"
                aria-selected={filterStatus === tab.label}
                onClick={() => setFilterStatus(tab.label)}
                className={`whitespace-nowrap text-xs px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1.5 ${
                  filterStatus === tab.label
                    ? 'bg-blue-800 dark:bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  filterStatus === tab.label ? 'bg-blue-900/50 dark:bg-blue-800 text-blue-100' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contracts List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 max-h-[620px] scrollbar-thin">
        {filteredContracts.length === 0 ? (
          <div className="text-center py-12 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-850/40">
            <Truck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No contracts found in this view</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try switching tabs to 'All' or clear your search term.</p>
          </div>
        ) : (
          filteredContracts.map((contract) => {
            const currentStepIdx = getStepIndex(contract.status);

            return (
              <article
                key={contract.id}
                id={`contract-card-${contract.id}`}
                className={`p-4 rounded-xl border transition-all ${
                  contract.nearingDelivery
                    ? 'border-emerald-500 dark:border-emerald-500/80 bg-emerald-50/15 dark:bg-emerald-950/20 shadow-sm ring-1 ring-emerald-500/20 dark:ring-emerald-500/30'
                    : contract.actionRequired
                    ? 'border-amber-400 dark:border-amber-500/80 bg-amber-50/15 dark:bg-amber-950/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Header of card: Ref & Status */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        {contract.contractRef}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Ordered {contract.orderDate}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-1">
                      {contract.item} <span className="font-normal text-xs text-slate-600 dark:text-slate-400">({contract.variety})</span>
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400 shrink-0" />
                      <span className="font-medium text-slate-800 dark:text-slate-200">{contract.supplierGroup}</span>
                    </div>
                  </div>

                  {/* Financial Value Box */}
                  <div className="text-right">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Agreed Contract Value</div>
                    <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-display">
                      {formatINR(contract.totalValue)}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      {formatNumber(contract.quantityQuintals)} Q @ {formatINR(contract.agreedRatePerQuintal)}/Q
                    </div>
                  </div>
                </div>

                {/* Status Milestones Stepper (Requested → Quoted → Confirmed → In Transit → Delivered) */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Milestone Progress</span>
                    <span className="text-blue-700 dark:text-blue-400 font-bold normal-case">
                      Status: {contract.status}
                    </span>
                  </div>

                  {/* Accessible 5-stage tracker */}
                  <div className="relative flex items-center justify-between">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-750 w-full z-0" />
                    <div 
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-600 dark:bg-emerald-500 z-0 transition-all duration-300"
                      style={{ width: `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
                    />

                    {STATUS_STEPS.map((step, idx) => {
                      const isCompleted = idx < currentStepIdx;
                      const isCurrent = idx === currentStepIdx;

                      return (
                        <div key={step} className="relative z-10 flex flex-col items-center">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition ${
                              isCompleted
                                ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-xs'
                                : isCurrent
                                ? 'bg-blue-700 dark:bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/50 shadow-xs'
                                : 'bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500'
                            }`}
                            title={`Step ${idx + 1}: ${step}`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                          </div>
                          <span
                            className={`text-[10px] mt-1 text-center font-medium hidden sm:block ${
                              isCurrent ? 'text-blue-900 dark:text-blue-400 font-bold' : isCompleted ? 'text-emerald-800 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Highlight Banner: Nearing Delivery or Action Required */}
                {contract.nearingDelivery && (
                  <div className="mt-3 p-2.5 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-600 animate-ping shrink-0" />
                      <div className="text-xs font-medium">
                        <strong className="font-bold text-emerald-900 dark:text-emerald-300">Consignment In Final Transit: </strong>
                        {contract.deliveryTimeline}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono bg-white dark:bg-slate-850 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-semibold">
                        {contract.vehicleNo}
                      </span>
                    </div>
                  </div>
                )}

                {contract.actionRequired && (
                  <div className="mt-3 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="text-xs font-medium">
                        <strong className="font-bold text-amber-900 dark:text-amber-300">Buyer Action Required: </strong>
                        {contract.actionRequired}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onConfirmAction(contract)}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded-md text-xs font-semibold shadow-xs transition shrink-0"
                    >
                      Take Action
                    </button>
                  </div>
                )}

                {/* Contract Meta Bar & Destination */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      Dest: <span className="text-slate-800 dark:text-slate-200 font-medium">{contract.destinationMandi}</span>
                    </span>

                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      Timeline: <span className="text-slate-800 dark:text-slate-200 font-medium">{contract.deliveryTimeline}</span>
                    </span>

                    {contract.eWayBillNo && (
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        e-Way: {contract.eWayBillNo}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectContract(contract)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 hover:underline"
                  >
                    <span>View Lot & Manifest</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Contracts Panel Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Escrow settlement backed by Mandi Clearing Bank
        </span>
        <span className="text-slate-400 dark:text-slate-500 hidden sm:inline">
          NABL Assaying at gate entry
        </span>
      </div>
    </section>
  );
};
