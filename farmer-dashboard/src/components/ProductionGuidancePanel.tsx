import React, { useState } from 'react';
import { BookOpen, Layers, Droplets, ShieldAlert, Warehouse, CheckCircle2, AlertTriangle, Lightbulb, ChevronDown, Filter } from 'lucide-react';
import { GuidanceStage } from '../types';
import { PRODUCTION_GUIDANCE_STAGES } from '../data/mockAgriculturalData';

interface ProductionGuidancePanelProps {
  stages?: GuidanceStage[];
}

export const ProductionGuidancePanel: React.FC<ProductionGuidancePanelProps> = ({ stages = PRODUCTION_GUIDANCE_STAGES }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [expandAll, setExpandAll] = useState<boolean>(false);

  // Helper to match icons
  const getStageIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layers':
        return <Layers className="w-4 h-4 text-amber-600" aria-hidden="true" />;
      case 'Droplets':
        return <Droplets className="w-4 h-4 text-blue-600" aria-hidden="true" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-4 h-4 text-rose-600" aria-hidden="true" />;
      case 'Warehouse':
        return <Warehouse className="w-4 h-4 text-emerald-600" aria-hidden="true" />;
      default:
        return <BookOpen className="w-4 h-4 text-slate-600" aria-hidden="true" />;
    }
  };

  const filteredStages = selectedFilter === 'all'
    ? stages
    : stages.filter(s => s.id === selectedFilter);

  return (
    <section
      id="panel-guidance"
      aria-labelledby="heading-production-guidance"
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col h-full overflow-hidden transition-colors"
    >
      {/* Panel Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-b from-blue-50/60 to-white dark:from-blue-950/30 dark:to-slate-900">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 flex items-center justify-center border border-blue-200/80 dark:border-blue-800/60 shadow-2xs flex-shrink-0">
              <BookOpen className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="heading-production-guidance" className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight font-display">
                  Production Guidance
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100/90 dark:bg-blue-950/90 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
                  Panel 3
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Stage-wise agricultural best practices, seasonal timing & agronomy protocols
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setExpandAll(prev => !prev)}
            className="text-xs font-semibold text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-200 px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={expandAll ? 'Collapse all guidance accordions' : 'Expand all guidance accordions'}
          >
            {expandAll ? 'Collapse All' : 'Expand All'}
          </button>
        </div>

        {/* Quick Topic Scanning Filter Pills */}
        <div className="mt-3.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1 flex-shrink-0">
            <Filter className="w-3 h-3 text-slate-400" aria-hidden="true" />
            Scan Topic:
          </span>
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              selectedFilter === 'all'
                ? 'bg-blue-800 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Stages ({stages.length})
          </button>
          {stages.map((stg) => (
            <button
              key={stg.id}
              type="button"
              onClick={() => setSelectedFilter(stg.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                selectedFilter === stg.id
                  ? 'bg-blue-800 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {stg.stageName.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Stage-wise Accordions using native accessible <details> */}
      <div className="p-4 sm:p-5 flex-1 space-y-3.5 overflow-y-auto">
        {filteredStages.map((stage, idx) => (
          <details
            key={stage.id}
            id={`guidance-details-${stage.id}`}
            open={expandAll || idx === 0}
            className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/70 transition-shadow hover:shadow-xs open:ring-1 open:ring-blue-200 dark:open:ring-blue-800 open:border-blue-300 dark:open:border-blue-700"
          >
            {/* Native accessible summary */}
            <summary className="flex items-center justify-between p-3.5 sm:p-4 cursor-pointer select-none rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 list-none">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 group-open:bg-blue-50 dark:group-open:bg-blue-950/80 flex items-center justify-center border border-slate-200 dark:border-slate-700 group-open:border-blue-200 dark:group-open:border-blue-800 transition-colors">
                  {getStageIcon(stage.iconName)}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {stage.stageName}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                      ({stage.hindiTitle})
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {stage.summary}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full hidden sm:inline">
                  {stage.keyPractices?.length || 0} Key Steps
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 group-open:rotate-180 transition-transform duration-200" aria-hidden="true" />
              </div>
            </summary>

            {/* Accordion Content */}
            <div className="px-4 pb-4 pt-1 sm:px-5 sm:pb-5 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs">
              
              {/* Key Practices */}
              <div className="space-y-2.5 pt-2">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Recommended Field Protocol
                </h3>
                {(stage.keyPractices || []).map((practice, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" aria-hidden="true" />
                        <span>{practice.title}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800 whitespace-nowrap">
                        {practice.criticalTiming}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-5">
                      {practice.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Expert Tips */}
              <div className="p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/60 space-y-1.5 text-emerald-950 dark:text-emerald-200">
                <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-900 dark:text-emerald-200">
                  <Lightbulb className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                  <span>Agronomist Advisory Tips:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-emerald-900/90 dark:text-emerald-300 pl-1 leading-relaxed">
                  {stage.expertTips.map((tip, tIdx) => (
                    <li key={tIdx}>{tip}</li>
                  ))}
                </ul>
              </div>

              {/* Common Mistakes to Avoid */}
              <div className="p-3 rounded-lg bg-rose-50/70 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-800/60 space-y-1.5 text-rose-950 dark:text-rose-200">
                <div className="flex items-center gap-1.5 font-bold text-xs text-rose-900 dark:text-rose-200">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" aria-hidden="true" />
                  <span>Critical Mistakes to Avoid:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-rose-900/90 dark:text-rose-300 pl-1 leading-relaxed">
                  {stage.mistakesToAvoid.map((mistake, mIdx) => (
                    <li key={mIdx}>{mistake}</li>
                  ))}
                </ul>
              </div>

            </div>
          </details>
        ))}
      </div>

      {/* Panel Footer Advice */}
      <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="font-medium">
          Source: ICAR (Indian Council of Agricultural Research) Field Manuals
        </span>
        <span className="text-[11px] text-blue-700 dark:text-blue-300 font-semibold hidden sm:inline">
          Scan by crop stages above
        </span>
      </div>
    </section>
  );
};
