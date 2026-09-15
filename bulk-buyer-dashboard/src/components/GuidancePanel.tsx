import React, { useState } from 'react';
import { 
  BookOpen, 
  ChevronDown, 
  CheckCircle2, 
  Calendar, 
  Gauge, 
  Truck, 
  Handshake, 
  Sparkles, 
  Info,
  Layers,
  Calculator
} from 'lucide-react';
import { GuidanceTopic } from '../types';

interface GuidancePanelProps {
  topics: GuidanceTopic[];
}

export const GuidancePanel: React.FC<GuidancePanelProps> = ({ topics }) => {
  // Store set of open topic IDs; by default keep first topic open
  const [openIds, setOpenIds] = useState<string[]>([topics[0]?.id || 'guide-1']);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Mini Moisture Deduction Calculator State
  const [calcCommodity, setCalcCommodity] = useState<'Wheat' | 'Paddy' | 'Maize'>('Wheat');
  const [testedMoisture, setTestedMoisture] = useState<number>(13.2);
  const [invoiceQuintals, setInvoiceQuintals] = useState<number>(500);

  const toggleTopic = (id: string) => {
    setOpenIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    setOpenIds(topics.map((t) => t.id));
  };

  const collapseAll = () => {
    setOpenIds([]);
  };

  const categories = ['All', 'Quality Grading', 'Seasonal Calendar', 'Storage & Logistics', 'FPO Negotiation'];

  const filteredTopics = topics.filter((t) => {
    if (categoryFilter === 'All') return true;
    return t.category === categoryFilter;
  });

  // Calculate Moisture Docking
  const baseMoistureLimit = calcCommodity === 'Wheat' ? 12.0 : calcCommodity === 'Paddy' ? 14.0 : 13.0;
  const excessMoisture = Math.max(0, testedMoisture - baseMoistureLimit);
  // Standard docking formula: 1.5% deduction per 1% excess moisture
  const dockingPercent = excessMoisture * 1.5;
  const dockedQuintals = (invoiceQuintals * (dockingPercent / 100));
  const payableQuintals = invoiceQuintals - dockedQuintals;

  return (
    <section 
      id="guidance-panel" 
      aria-labelledby="guidance-panel-title"
      className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col h-full overflow-hidden"
    >
      {/* Panel Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-linear-to-r from-amber-50/40 dark:from-amber-950/30 via-white dark:via-slate-900 to-transparent">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-700 text-white flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 id="guidance-panel-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
                Sourcing & Quality Guidance Panel
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Grading specs, seasonal harvest windows, warehouse storage & FPO contract guidelines.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={expandAll}
              className="text-[11px] font-medium text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-amber-200 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800"
            >
              Expand All
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
            >
              Collapse
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-3 flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none" role="tablist" aria-label="Guidance topic categories">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={categoryFilter === cat}
              onClick={() => setCategoryFilter(cat)}
              className={`whitespace-nowrap text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                categoryFilter === cat
                  ? 'bg-amber-800 dark:bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion Topics List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 max-h-[620px] scrollbar-thin">
        {filteredTopics.map((topic, index) => {
          const isOpen = openIds.includes(topic.id);

          return (
            <div
              key={topic.id}
              id={`accordion-item-${topic.id}`}
              className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900/90 shadow-2xs transition hover:border-slate-300 dark:hover:border-slate-700"
            >
              {/* Accordion Header Button - Keyboard Navigable */}
              <h3>
                <button
                  type="button"
                  id={`accordion-header-${topic.id}`}
                  aria-expanded={isOpen}
                  aria-controls={`accordion-content-${topic.id}`}
                  onClick={() => toggleTopic(topic.id)}
                  className="w-full p-3.5 sm:p-4 text-left flex items-center justify-between gap-3 bg-white dark:bg-slate-900 hover:bg-slate-50/80 dark:hover:bg-slate-850 focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:outline-none transition"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                          {topic.category}
                        </span>
                      </div>
                      <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                        {topic.title}
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {topic.summary}
                      </p>
                    </div>
                  </div>

                  <div className={`p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
              </h3>

              {/* Accordion Body */}
              {isOpen && (
                <div
                  id={`accordion-content-${topic.id}`}
                  role="region"
                  aria-labelledby={`accordion-header-${topic.id}`}
                  className="p-3.5 sm:p-4 pt-1 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40 text-xs text-slate-700 dark:text-slate-300 space-y-3.5"
                >
                  {/* Summary & Key bullet points */}
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Key Procurement Criteria & Standards
                    </h4>
                    <ul className="space-y-1.5 pl-1">
                      {topic.keyPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-slate-600 dark:text-slate-300 leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Topic-specific metrics or Seasonal calendar display */}
                  {topic.metricsOrSpecs && (
                    <div className="bg-white dark:bg-slate-850 p-3 rounded-lg border border-slate-200 dark:border-slate-750">
                      <h5 className="font-bold text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                        Tolerance & Assaying Benchmark Table
                      </h5>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {topic.metricsOrSpecs.map((spec, i) => (
                          <div key={i} className="p-2 rounded bg-slate-50 dark:bg-slate-900/80 border border-slate-150 dark:border-slate-800">
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">{spec.label}</div>
                            <div className="font-bold text-slate-900 dark:text-white text-xs">{spec.value}</div>
                            <div className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">{spec.tolerance}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {topic.seasonalTimeline && (
                    <div className="bg-white dark:bg-slate-850 p-3 rounded-lg border border-slate-200 dark:border-slate-750">
                      <h5 className="font-bold text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        Procurement Window & Price Index Tracker
                      </h5>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-center">
                        {topic.seasonalTimeline.map((item, i) => (
                          <div
                            key={i}
                            className={`p-1.5 rounded border text-xs ${
                              item.peakSupply
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-medium'
                                : 'bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <div className="text-[10px] font-semibold">{item.month}</div>
                            <div className="text-[10px] mt-0.5">
                              {item.peakSupply ? '🌾 Peak Arrival' : 'Off-Season'}
                            </div>
                            <div className={`text-[10px] font-bold mt-0.5 ${
                              item.priceTrend === 'Low' ? 'text-emerald-700 dark:text-emerald-400' : item.priceTrend === 'High' ? 'text-rose-700 dark:text-rose-400' : 'text-amber-700 dark:text-amber-400'
                            }`}>
                              Price: {item.priceTrend}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendation Callout */}
                  <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
                    <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold">Agronomist Recommendation: </strong>
                      {topic.recommendation}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Interactive Moisture Docking & Assaying Tool */}
        <div className="border border-emerald-200 dark:border-emerald-800/80 rounded-xl p-3.5 sm:p-4 bg-emerald-50/40 dark:bg-emerald-950/20">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="w-4 h-4 text-emerald-700" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              Interactive Assaying Check: Moisture Deduction Calculator
            </h4>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-3">
            Estimate weighbridge weight docking for moisture above benchmark tolerance.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div>
              <label htmlFor="calc-comm-select" className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Commodity:
              </label>
              <select
                id="calc-comm-select"
                value={calcCommodity}
                onChange={(e) => setCalcCommodity(e.target.value as any)}
                className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-md py-1 px-2 text-xs focus:ring-1 focus:ring-emerald-600"
              >
                <option value="Wheat">Wheat (Benchmark ≤ 12.0%)</option>
                <option value="Paddy">Paddy / Rice (Benchmark ≤ 14.0%)</option>
                <option value="Maize">Maize Corn (Benchmark ≤ 13.0%)</option>
              </select>
            </div>

            <div>
              <label htmlFor="calc-moisture-input" className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Lab Tested Moisture %:
              </label>
              <input
                type="number"
                id="calc-moisture-input"
                step="0.1"
                min="8"
                max="25"
                value={testedMoisture}
                onChange={(e) => setTestedMoisture(parseFloat(e.target.value) || 0)}
                className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-md py-1 px-2 text-xs focus:ring-1 focus:ring-emerald-600 font-semibold"
              />
            </div>

            <div>
              <label htmlFor="calc-quintals-input" className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Gross Truck Quintals:
              </label>
              <input
                type="number"
                id="calc-quintals-input"
                step="10"
                min="10"
                value={invoiceQuintals}
                onChange={(e) => setInvoiceQuintals(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-md py-1 px-2 text-xs focus:ring-1 focus:ring-emerald-600 font-semibold"
              />
            </div>
          </div>

          {/* Result Strip */}
          <div className="mt-3 p-2 rounded bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400">Excess Moisture: </span>
              <span className={`font-bold ${excessMoisture > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
                {excessMoisture.toFixed(1)}% {excessMoisture > 0 ? `(${dockingPercent.toFixed(2)}% docking)` : '(Safe)'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Weight Docking: </span>
              <span className="font-bold text-rose-700 dark:text-rose-400">-{dockedQuintals.toFixed(1)} Q</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Net Payable Weight: </span>
              <span className="font-extrabold text-emerald-800 dark:text-emerald-400 text-sm font-display">
                {payableQuintals.toFixed(1)} Q
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Guidance Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Handshake className="w-4 h-4 text-amber-700" />
          Direct FPO procurement eliminates mandi middleman cess
        </span>
        <span className="text-slate-400 dark:text-slate-500 hidden sm:inline">
          Standards aligned with Bureau of Indian Standards (BIS)
        </span>
      </div>
    </section>
  );
};
