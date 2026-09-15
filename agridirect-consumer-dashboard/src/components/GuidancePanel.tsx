import React, { useState } from 'react';
import { GuidanceTopic } from '../types';
import {
  ChevronDown,
  Sparkles,
  Calendar,
  ShieldCheck,
  Boxes,
  Check,
  Lightbulb,
  ArrowRight,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface GuidancePanelProps {
  topics: GuidanceTopic[];
}

export const GuidancePanel: React.FC<GuidancePanelProps> = ({ topics }) => {
  const [openTopicIds, setOpenTopicIds] = useState<string[]>([topics[0]?.id || 'pick-fresh-produce']);
  const [selectedSeasonMonth, setSelectedSeasonMonth] = useState<'current' | 'winter' | 'summer' | 'monsoon'>('current');

  const toggleTopic = (id: string) => {
    setOpenTopicIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    setOpenTopicIds(topics.map((t) => t.id));
  };

  const collapseAll = () => {
    setOpenTopicIds([]);
  };

  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'Calendar':
        return <Calendar className="w-4 h-4 text-emerald-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4 text-blue-600" />;
      case 'Boxes':
        return <Boxes className="w-4 h-4 text-stone-600" />;
      default:
        return <Lightbulb className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <section
      id="panel-guidance"
      aria-labelledby="guidance-heading"
      className="bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col h-full overflow-hidden"
    >
      {/* Panel Header */}
      <div className="p-5 sm:p-6 border-b border-stone-200 bg-stone-50/70">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <h2 id="guidance-heading" className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
                Buying & Storage Guidance
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Practical agronomic guidance to inspect freshness, time harvests, and eliminate kitchen waste.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={expandAll}
              className="text-xs font-medium text-stone-600 hover:text-stone-900 px-2 py-1 rounded-md hover:bg-stone-200/50 transition-colors flex items-center gap-1"
              title="Expand all accordion topics"
            >
              <Maximize2 className="w-3 h-3" />
              <span className="hidden sm:inline">Expand All</span>
            </button>
            <span className="text-stone-300">|</span>
            <button
              type="button"
              onClick={collapseAll}
              className="text-xs font-medium text-stone-600 hover:text-stone-900 px-2 py-1 rounded-md hover:bg-stone-200/50 transition-colors flex items-center gap-1"
              title="Collapse all accordion topics"
            >
              <Minimize2 className="w-3 h-3" />
              <span className="hidden sm:inline">Collapse</span>
            </button>
          </div>
        </div>

        {/* Seasonal Quick-Selector Pills */}
        <div className="mt-4 pt-3 border-t border-stone-200/60">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-stone-500 font-medium">Seasonal Calendar Quick Filter:</span>
            <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
              Harvest Window 2026
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => {
                setSelectedSeasonMonth('current');
                if (!openTopicIds.includes('seasonal-calendar')) {
                  setOpenTopicIds((prev) => [...prev, 'seasonal-calendar']);
                }
              }}
              className={`py-1.5 px-2.5 rounded-xl border text-center transition-all ${
                selectedSeasonMonth === 'current'
                  ? 'bg-emerald-700 text-white border-emerald-700 font-semibold shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              🌿 Autumn / Sep (Now)
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedSeasonMonth('winter');
                if (!openTopicIds.includes('seasonal-calendar')) {
                  setOpenTopicIds((prev) => [...prev, 'seasonal-calendar']);
                }
              }}
              className={`py-1.5 px-2.5 rounded-xl border text-center transition-all ${
                selectedSeasonMonth === 'winter'
                  ? 'bg-emerald-700 text-white border-emerald-700 font-semibold shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              ❄️ Winter (Nov - Feb)
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedSeasonMonth('summer');
                if (!openTopicIds.includes('seasonal-calendar')) {
                  setOpenTopicIds((prev) => [...prev, 'seasonal-calendar']);
                }
              }}
              className={`py-1.5 px-2.5 rounded-xl border text-center transition-all ${
                selectedSeasonMonth === 'summer'
                  ? 'bg-emerald-700 text-white border-emerald-700 font-semibold shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              ☀️ Summer (Mar - Jun)
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedSeasonMonth('monsoon');
                if (!openTopicIds.includes('seasonal-calendar')) {
                  setOpenTopicIds((prev) => [...prev, 'seasonal-calendar']);
                }
              }}
              className={`py-1.5 px-2.5 rounded-xl border text-center transition-all ${
                selectedSeasonMonth === 'monsoon'
                  ? 'bg-emerald-700 text-white border-emerald-700 font-semibold shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              🌧️ Monsoon (Jul - Aug)
            </button>
          </div>
        </div>
      </div>

      {/* Accordion List */}
      <div className="p-4 sm:p-6 flex-1 overflow-y-auto max-h-[600px] space-y-3.5">
        {topics.map((topic) => {
          const isOpen = openTopicIds.includes(topic.id);
          const headingId = `guidance-header-${topic.id}`;
          const contentId = `guidance-content-${topic.id}`;

          return (
            <div
              key={topic.id}
              className={`rounded-xl border transition-all ${
                isOpen ? 'border-stone-300 bg-white shadow-xs' : 'border-stone-200 bg-stone-50/50'
              }`}
            >
              {/* Accordion Trigger Header */}
              <h3>
                <button
                  type="button"
                  id={headingId}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => toggleTopic(topic.id)}
                  className="w-full text-left p-4 sm:p-4.5 flex items-center justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center shrink-0 border border-stone-200">
                      {getTopicIcon(topic.iconName)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-stone-900">
                          {topic.title}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200 hidden sm:inline-block">
                          {topic.badge}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                        {topic.summary}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-stone-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-stone-700' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
              </h3>

              {/* Accordion Content Panel */}
              {isOpen && (
                <div
                  id={contentId}
                  role="region"
                  aria-labelledby={headingId}
                  className="px-4 sm:px-5 pb-5 pt-1 border-t border-stone-100 space-y-3.5"
                >
                  <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200/70">
                    💡 <strong className="text-stone-800">Core Insight:</strong> {topic.summary}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {topic.tips.map((tip, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-stone-200/80 bg-white hover:border-emerald-200 transition-colors flex flex-col justify-between"
                      >
                        <div>
                          <h4 className="text-xs font-bold text-stone-900 mb-1.5 flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                            {tip.heading}
                          </h4>
                          <p className="text-xs text-stone-600 leading-relaxed">
                            {tip.description}
                          </p>
                        </div>

                        {tip.highlight && (
                          <div className="mt-2.5 pt-2 border-t border-stone-100 text-[11px] font-medium text-emerald-800 flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>{tip.highlight}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
