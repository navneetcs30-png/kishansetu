import React, { useState } from 'react';
import { 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  CheckSquare, 
  Square, 
  AlertCircle, 
  ShieldAlert, 
  FileText, 
  LifeBuoy, 
  Search,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { GuidanceTopic } from '../types';

interface GuidancePanelProps {
  topics: GuidanceTopic[];
}

export const GuidancePanel: React.FC<GuidancePanelProps> = ({ topics: initialTopics }) => {
  const [topics, setTopics] = useState<GuidanceTopic[]>(initialTopics);
  const [expandedId, setExpandedId] = useState<string>('GUIDE-01');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Onboarding', 'Escalations', 'Moderation', 'Data Policy'];

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? '' : id));
  };

  const handleToggleChecklist = (topicId: string, checkId: string) => {
    setTopics((prevTopics) =>
      prevTopics.map((t) => {
        if (t.id !== topicId || !t.checklist) return t;
        return {
          ...t,
          checklist: t.checklist.map((item) =>
            item.id === checkId ? { ...item, done: !item.done } : item
          ),
        };
      })
    );
  };

  const filteredTopics = topics.filter((t) => {
    const matchesCategory = activeCategory === 'ALL' || t.category === activeCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.overview.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section
      id="panel-guidance"
      className="bg-slate-900 border border-slate-800 rounded-xl shadow-sm flex flex-col h-full overflow-hidden"
      aria-labelledby="guidance-heading"
    >
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/50">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 id="guidance-heading" className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                Platform Activity & Guidance
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {filteredTopics.length} Operational Guides
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Onboarding checklists, dispute resolution trees, listing moderation, and PII policies.
              </p>
            </div>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[160px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="guidance-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search operational guidelines..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Search guidance topics"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                id={`guidance-cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  activeCategory === cat
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/80'
                    : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat === 'ALL' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Accordion Content List */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 min-h-[320px] max-h-[440px]">
        {filteredTopics.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            No guidelines match your query. Try clearing search filters.
          </div>
        ) : (
          filteredTopics.map((topic) => {
            const isExpanded = expandedId === topic.id;
            const completedCount = topic.checklist
              ? topic.checklist.filter((c) => c.done).length
              : 0;
            const totalChecklist = topic.checklist ? topic.checklist.length : 0;

            return (
              <div
                key={topic.id}
                id={`guide-card-${topic.id}`}
                className="rounded-xl border border-slate-800 bg-slate-950/50 overflow-hidden transition-colors hover:border-slate-700"
              >
                {/* Accordion Header Button */}
                <button
                  type="button"
                  id={`guide-header-${topic.id}`}
                  onClick={() => toggleExpand(topic.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`guide-body-${topic.id}`}
                  className="w-full p-3 sm:p-3.5 text-left flex items-start justify-between gap-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {topic.category}
                      </span>
                      <span className="text-[10px] text-emerald-400/90 font-medium">
                        {topic.badge}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                        {topic.lastUpdated}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-2">
                      <span>{topic.title}</span>
                      {totalChecklist > 0 && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {completedCount}/{totalChecklist} done
                        </span>
                      )}
                    </h3>

                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2 sm:line-clamp-1">
                      {topic.summary}
                    </p>
                  </div>

                  <div className="p-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400 shrink-0 mt-0.5">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {/* Accordion Body */}
                {isExpanded && (
                  <div
                    id={`guide-body-${topic.id}`}
                    role="region"
                    aria-labelledby={`guide-header-${topic.id}`}
                    className="p-3 sm:p-4 border-t border-slate-800/80 bg-slate-950/80 space-y-3.5 text-xs animate-in fade-in duration-150"
                  >
                    {/* Overview Text */}
                    <div className="text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-lg border border-slate-800/60">
                      {topic.content.overview}
                    </div>

                    {/* Interactive Checklist (if available) */}
                    {topic.checklist && topic.checklist.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                          <span>Operational Action Checklist</span>
                          <span className="text-emerald-400 font-mono">
                            {Math.round((completedCount / totalChecklist) * 100)}% Completed
                          </span>
                        </div>
                        <div className="space-y-1">
                          {topic.checklist.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              id={`chk-${topic.id}-${item.id}`}
                              onClick={() => handleToggleChecklist(topic.id, item.id)}
                              className="w-full flex items-start gap-2.5 p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800/80 text-left transition-colors group focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            >
                              {item.done ? (
                                <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-500 group-hover:text-slate-300 shrink-0 mt-0.5" />
                              )}
                              <span
                                className={`text-xs ${
                                  item.done
                                    ? 'text-slate-400 line-through'
                                    : 'text-slate-200'
                                }`}
                              >
                                {item.text}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Protocol Steps (if available) */}
                    {topic.content.protocolSteps && (
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                          Mandatory Execution Protocol:
                        </div>
                        <ol className="space-y-1.5 pl-1">
                          {topic.content.protocolSteps.map((step, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-slate-300 bg-slate-900/50 p-2 rounded border border-slate-800/60"
                            >
                              <span className="w-4 h-4 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span className="leading-snug">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Operational Rules & Thresholds */}
                    {topic.content.rules && topic.content.rules.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                          Critical Rules & SLA Thresholds:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {topic.content.rules.map((rule, idx) => (
                            <div
                              key={idx}
                              className="p-2 rounded bg-slate-900/80 border border-slate-800 flex items-start gap-2"
                            >
                              <span
                                className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0 font-mono ${
                                  rule.severity === 'high'
                                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                    : rule.severity === 'medium'
                                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                    : 'bg-blue-950 text-blue-300 border border-blue-800'
                                }`}
                              >
                                {rule.label}
                              </span>
                              <span className="text-[11px] text-slate-300 leading-snug">
                                {rule.detail}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Important Note */}
                    {topic.content.importantNote && (
                      <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-800/40 text-[11px] text-amber-300/90 flex items-start gap-2">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-amber-200">Notice: </strong>
                          {topic.content.importantNote}
                        </div>
                      </div>
                    )}

                    {/* Escalation Contact */}
                    {topic.content.contactEscalation && (
                      <div className="pt-1 text-[11px] text-slate-400 flex items-center gap-1.5 border-t border-slate-800/60 font-mono">
                        <LifeBuoy className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{topic.content.contactEscalation}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Organized for fast operational scanning & mobile compliance lookup.</span>
        <span className="font-mono text-slate-500 hidden sm:inline">Compliance Standard ISO-Agri-2026</span>
      </div>
    </section>
  );
};
