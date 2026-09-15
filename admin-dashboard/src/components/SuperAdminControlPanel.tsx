import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  ShoppingBag, 
  Building2, 
  ShieldCheck, 
  Radio, 
  Sliders, 
  Save, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  IndianRupee, 
  Percent, 
  Clock, 
  Lock, 
  Unlock, 
  Volume2, 
  Bell, 
  DownloadCloud, 
  Layers, 
  Flame, 
  Info,
  KeyRound,
  FileCheck
} from 'lucide-react';
import { 
  platformConfigService, 
  PlatformSuperAdminConfig 
} from '../../../src/services/platformConfig';

interface Props {
  onNotifyToast: (type: 'success' | 'warning' | 'info', title: string, message?: string) => void;
}

export const SuperAdminControlPanel: React.FC<Props> = ({ onNotifyToast }) => {
  const [config, setConfig] = useState<PlatformSuperAdminConfig>(() => platformConfigService.getConfig());
  const [activeTab, setActiveTab] = useState<'farmer' | 'consumer' | 'bulk' | 'security' | 'global' | 'audit'>('farmer');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Subscribe to reactive updates
  useEffect(() => {
    const unsubscribe = platformConfigService.subscribe((newCfg) => {
      setConfig(newCfg);
    });
    return unsubscribe;
  }, []);

  const handleSaveAll = () => {
    platformConfigService.setFullConfig(config, 'Devon Vance (Super Admin)');
    setHasUnsavedChanges(false);
    onNotifyToast(
      'success',
      '⚡ Super Admin Parameters Broadcasted',
      'All 5 KishanSetu modules are now synchronized with your updated parameters.'
    );
  };

  const handleResetDefaults = () => {
    if (window.confirm('Are you sure you want to reset all platform parameters to official government factory presets?')) {
      platformConfigService.resetToFactoryDefaults('Devon Vance (Super Admin)');
      setConfig(platformConfigService.getConfig());
      setHasUnsavedChanges(false);
      onNotifyToast(
        'info',
        'Factory Presets Restored',
        'All MSP rates, vegetable benchmarks, discounts, and fees reverted to default benchmarks.'
      );
    }
  };

  // Helper for crop price change
  const handleCropPriceChange = (id: string, newRate: number) => {
    setConfig((prev) => ({
      ...prev,
      farmer: {
        ...prev.farmer,
        crops: prev.farmer.crops.map((c) => (c.id === id ? { ...c, mspRate: newRate } : c)),
      },
    }));
    setHasUnsavedChanges(true);
  };

  // Helper for vegetable price change
  const handleVegPriceChange = (id: string, newPrice: number, mandi?: string) => {
    setConfig((prev) => ({
      ...prev,
      farmer: {
        ...prev.farmer,
        vegetables: prev.farmer.vegetables.map((v) =>
          v.id === id ? { ...v, pricePerQuintal: newPrice, ...(mandi ? { benchmarkMandi: mandi } : {}) } : v
        ),
      },
    }));
    setHasUnsavedChanges(true);
  };

  // Helper for consumer produce price change
  const handleProduceChange = (id: string, updates: any) => {
    setConfig((prev) => ({
      ...prev,
      consumer: {
        ...prev.consumer,
        produce: prev.consumer.produce.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      },
    }));
    setHasUnsavedChanges(true);
  };

  // Helper for bulk commodity change
  const handleCommodityChange = (id: string, updates: any) => {
    setConfig((prev) => ({
      ...prev,
      bulkBuyer: {
        ...prev.bulkBuyer,
        commodities: prev.bulkBuyer.commodities.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      },
    }));
    setHasUnsavedChanges(true);
  };

  return (
    <div className="space-y-6">
      {/* Super Admin Access Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/90 via-indigo-950/80 to-slate-900 border border-purple-800/60 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold text-[11px] border border-purple-500/40 tracking-wide uppercase">
                <Zap className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
                Super Admin Access Level 5 • Master Control Tower
              </span>
              {hasUnsavedChanges && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30 animate-pulse">
                  Unsaved Changes Pending
                </span>
              )}
            </div>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              Global Platform Parameter Control Center
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              You possess Root Clearance to modify live Minimum Support Prices, Mandi wholesale benchmarks, retail consumer discounts, bulk commodity tiers, APMC cess rates, and security enforcement across all 5 portals.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Reset all parameters to official government defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAll}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer hover:scale-102"
            >
              <Save className="w-4 h-4" />
              <span>Apply & Broadcast Live</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Strip */}
        <div className="mt-4 pt-4 border-t border-purple-900/40 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-purple-900/30">
            <p className="text-slate-400 text-[10px]">MSP Crops Regulated</p>
            <p className="text-base font-bold text-emerald-400 font-mono mt-0.5">{config.farmer.crops.length} Active</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-purple-900/30">
            <p className="text-slate-400 text-[10px]">Mandi Vegetables Benchmarked</p>
            <p className="text-base font-bold text-amber-400 font-mono mt-0.5">{config.farmer.vegetables.length} Mandis</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-purple-900/30">
            <p className="text-slate-400 text-[10px]">Consumer SKUs & Bulk Tiers</p>
            <p className="text-base font-bold text-blue-400 font-mono mt-0.5">{config.consumer.produce.length} SKUs • {config.consumer.rules.tier2DiscountPct}% Max</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-purple-900/30">
            <p className="text-slate-400 text-[10px]">APMC Mandi Cess & Insurance</p>
            <p className="text-base font-bold text-purple-400 font-mono mt-0.5">{config.bulkBuyer.tradePolicy.apmcMandiCessPct}% Cess • {config.bulkBuyer.tradePolicy.transitInsurancePct}% Ins</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-purple-900/30">
            <p className="text-slate-400 text-[10px]">Emergency Status</p>
            <p className="text-base font-bold text-emerald-400 font-mono mt-0.5">
              {config.global.emergencyPriceFreeze ? '❄️ Frozen' : '🟢 Normal Trading'}
            </p>
          </div>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab('farmer')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'farmer'
              ? 'bg-emerald-600 text-white shadow-sm font-bold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <Sprout className="w-4 h-4 text-emerald-300" />
          <span>🌾 Farmer Hub Controls</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('consumer')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'consumer'
              ? 'bg-blue-600 text-white shadow-sm font-bold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-blue-300" />
          <span>🛒 Consumer Store Controls</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bulk')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'bulk'
              ? 'bg-amber-600 text-white shadow-sm font-bold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <Building2 className="w-4 h-4 text-amber-300" />
          <span>🏢 Bulk Procurement Controls</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'security'
              ? 'bg-indigo-600 text-white shadow-sm font-bold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <Lock className="w-4 h-4 text-indigo-300" />
          <span>🔐 Security & Auth Policy</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('global')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'global'
              ? 'bg-purple-600 text-white shadow-sm font-bold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <Radio className="w-4 h-4 text-purple-300" />
          <span>🌐 Global Broadcast & Kill-Switches</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ml-auto ${
            activeTab === 'audit'
              ? 'bg-slate-800 text-white shadow-sm font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Clock className="w-4 h-4 text-slate-400" />
          <span>📜 Parameter Audit Log ({config.changeLog?.length || 0})</span>
        </button>
      </div>

      {/* Tab 1: Farmer Hub Parameters */}
      {activeTab === 'farmer' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Sub-panel 1: Crop MSP Rates */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-950 border border-emerald-800/60 text-emerald-400">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Government Minimum Support Price (MSP) Rate Controller
                  </h3>
                  <p className="text-xs text-slate-400">
                    Modifying these rates updates live calculations on all farmers' calculators and procurement mandis.
                  </p>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-mono">Benchmark Unit: ₹ / Quintal (100 kg)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {config.farmer.crops.map((crop) => (
                <div
                  key={crop.id}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-700/60 transition-colors space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{crop.name}</h4>
                      <p className="text-[11px] text-slate-400">{crop.hindiName}</p>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
                      {crop.season}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-semibold">₹</span>
                      <input
                        type="number"
                        value={crop.mspRate}
                        onChange={(e) => handleCropPriceChange(crop.id, Number(e.target.value))}
                        className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCropPriceChange(crop.id, crop.mspRate + 50)}
                      className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold cursor-pointer"
                      title="Add ₹50 bonus"
                    >
                      +₹50
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCropPriceChange(crop.id, crop.mspRate + 100)}
                      className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold cursor-pointer"
                      title="Add ₹100 bonus"
                    >
                      +₹100
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">{crop.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sub-panel 2: Vegetable Mandi Benchmarks */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Daily Wholesale Vegetable Mandi Rates</h3>
                <p className="text-xs text-slate-400">Live auction spot prices benchmarked across primary APMC mandis.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {config.farmer.vegetables.map((veg) => (
                <div key={veg.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{veg.name} ({veg.hindiName})</h4>
                      <p className="text-[11px] text-slate-400">{veg.benchmarkMandi} • {veg.state}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-semibold">₹</span>
                      <input
                        type="number"
                        value={veg.pricePerQuintal}
                        onChange={(e) => handleVegPriceChange(veg.id, Number(e.target.value))}
                        className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <span className="text-xs text-slate-400 font-mono">/ Quintal</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sub-panel 3: Scheme Subsidies & AI Sahayak */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Welfare Scheme Financial Subsidies</span>
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">PM-KISAN Annual Direct Transfer:</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span>₹</span>
                    <input
                      type="number"
                      value={config.farmer.schemes.pmKisanAnnualAmount}
                      onChange={(e) => {
                        setConfig((prev) => ({
                          ...prev,
                          farmer: { ...prev.farmer, schemes: { ...prev.farmer.schemes, pmKisanAnnualAmount: Number(e.target.value) } },
                        }));
                        setHasUnsavedChanges(true);
                      }}
                      className="w-20 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white font-bold"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">Kisan Credit Card (KCC) Concessional Rate:</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <input
                      type="number"
                      step="0.1"
                      value={config.farmer.schemes.kccInterestRatePct}
                      onChange={(e) => {
                        setConfig((prev) => ({
                          ...prev,
                          farmer: { ...prev.farmer, schemes: { ...prev.farmer.schemes, kccInterestRatePct: Number(e.target.value) } },
                        }));
                        setHasUnsavedChanges(true);
                      }}
                      className="w-16 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white font-bold"
                    />
                    <span>% / annum</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">Micro-Irrigation (Drip/Sprinkler) Subsidy:</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <input
                      type="number"
                      value={config.farmer.schemes.dripIrrigationSubsidyPct}
                      onChange={(e) => {
                        setConfig((prev) => ({
                          ...prev,
                          farmer: { ...prev.farmer, schemes: { ...prev.farmer.schemes, dripIrrigationSubsidyPct: Number(e.target.value) } },
                        }));
                        setHasUnsavedChanges(true);
                      }}
                      className="w-16 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white font-bold"
                    />
                    <span>%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                <span>Kisan Sahayak AI Model Settings</span>
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">Primary AI Foundation Model:</span>
                  <span className="font-mono text-purple-400 font-bold">{config.farmer.ai.modelName}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">Temperature (Creativity vs Determinism):</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={config.farmer.ai.temperature}
                      onChange={(e) => {
                        setConfig((prev) => ({
                          ...prev,
                          farmer: { ...prev.farmer, ai: { ...prev.farmer.ai, temperature: Number(e.target.value) } },
                        }));
                        setHasUnsavedChanges(true);
                      }}
                      className="w-24"
                    />
                    <span className="font-mono text-white font-bold">{config.farmer.ai.temperature}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">Offline Multi-Language Fallback Engine:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setConfig((prev) => ({
                        ...prev,
                        farmer: {
                          ...prev.farmer,
                          ai: { ...prev.farmer.ai, fallbackKnowledgeEngineEnabled: !prev.farmer.ai.fallbackKnowledgeEngineEnabled },
                        },
                      }));
                      setHasUnsavedChanges(true);
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                      config.farmer.ai.fallbackKnowledgeEngineEnabled
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                        : 'bg-rose-950 text-rose-300 border border-rose-700'
                    }`}
                  >
                    {config.farmer.ai.fallbackKnowledgeEngineEnabled ? 'Enabled (8 Indian Languages)' : 'Disabled'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Consumer Store Parameters */}
      {activeTab === 'consumer' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Sub-panel 1: Produce Catalog Prices */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Retail Produce Catalog Prices & Stock Authority</h3>
                <p className="text-xs text-slate-400">Manage base farm-gate pricing per kilogram and stock flags for consumers.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {config.consumer.produce.map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.name}</h4>
                      <p className="text-[11px] text-slate-400">{item.hindiName}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-1">
                      <span className="text-slate-400 font-semibold text-xs">₹</span>
                      <input
                        type="number"
                        value={item.pricePerKg}
                        onChange={(e) => handleProduceChange(item.id, { pricePerKg: Number(e.target.value) })}
                        className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm"
                      />
                      <span className="text-xs text-slate-400 font-mono">/kg</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px]">
                      <button
                        type="button"
                        onClick={() => handleProduceChange(item.id, { inStock: !item.inStock })}
                        className={`px-2 py-1 rounded font-bold ${
                          item.inStock ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-rose-950 text-rose-300 border border-rose-700'
                        }`}
                      >
                        {item.inStock ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sub-panel 2: Bulk Discount Rules */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Dynamic Bulk Discount Engine & Delivery Rules</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-slate-400">Tier 1 Weight Threshold:</span>
                <div className="flex items-center gap-1.5 font-mono">
                  <input
                    type="number"
                    value={config.consumer.rules.tier1MinKg}
                    onChange={(e) => {
                      setConfig((prev) => ({
                        ...prev,
                        consumer: { ...prev.consumer, rules: { ...prev.consumer.rules, tier1MinKg: Number(e.target.value) } },
                      }));
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-bold"
                  />
                  <span>kg</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-slate-400">Tier 1 Discount %:</span>
                <div className="flex items-center gap-1.5 font-mono">
                  <input
                    type="number"
                    value={config.consumer.rules.tier1DiscountPct}
                    onChange={(e) => {
                      setConfig((prev) => ({
                        ...prev,
                        consumer: { ...prev.consumer, rules: { ...prev.consumer.rules, tier1DiscountPct: Number(e.target.value) } },
                      }));
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-bold"
                  />
                  <span>%</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-slate-400">Tier 2 Quintal Discount %:</span>
                <div className="flex items-center gap-1.5 font-mono">
                  <input
                    type="number"
                    value={config.consumer.rules.tier2DiscountPct}
                    onChange={(e) => {
                      setConfig((prev) => ({
                        ...prev,
                        consumer: { ...prev.consumer, rules: { ...prev.consumer.rules, tier2DiscountPct: Number(e.target.value) } },
                      }));
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-bold"
                  />
                  <span>%</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-slate-400">Free Delivery Minimum Order:</span>
                <div className="flex items-center gap-1.5 font-mono">
                  <span>₹</span>
                  <input
                    type="number"
                    value={config.consumer.rules.freeDeliveryThreshold}
                    onChange={(e) => {
                      setConfig((prev) => ({
                        ...prev,
                        consumer: { ...prev.consumer, rules: { ...prev.consumer.rules, freeDeliveryThreshold: Number(e.target.value) } },
                      }));
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: B2B Bulk Procurement Controls */}
      {activeTab === 'bulk' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Sub-panel 1: Wholesale Commodity Rates & Volume Tiers */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Wholesale Commodity Base Prices & Volume Tier Discounts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.bulkBuyer.commodities.map((comm) => (
                <div key={comm.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{comm.name}</h4>
                      <p className="text-[11px] text-slate-400">{comm.variety} • {comm.mandiLocation}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400">Base Price (₹/Q)</span>
                      <input
                        type="number"
                        value={comm.basePricePerQuintal}
                        onChange={(e) => handleCommodityChange(comm.id, { basePricePerQuintal: Number(e.target.value) })}
                        className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white font-mono font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">50-100Q Disc %</span>
                      <input
                        type="number"
                        step="0.5"
                        value={comm.tier1DiscountPct}
                        onChange={(e) => handleCommodityChange(comm.id, { tier1DiscountPct: Number(e.target.value) })}
                        className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-amber-400 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">100-250Q Disc %</span>
                      <input
                        type="number"
                        step="0.5"
                        value={comm.tier2DiscountPct}
                        onChange={(e) => handleCommodityChange(comm.id, { tier2DiscountPct: Number(e.target.value) })}
                        className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-amber-400 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">250Q+ Disc %</span>
                      <input
                        type="number"
                        step="0.5"
                        value={comm.tier3DiscountPct}
                        onChange={(e) => handleCommodityChange(comm.id, { tier3DiscountPct: Number(e.target.value) })}
                        className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sub-panel 2: Taxes, Mandi Cess & Cargo Insurance */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">APMC Mandi Cess, Cargo Transit & Escrow Protections</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-slate-300 font-medium">Statutory APMC Mandi Cess:</span>
                <div className="flex items-center gap-1.5 font-mono">
                  <input
                    type="number"
                    step="0.1"
                    value={config.bulkBuyer.tradePolicy.apmcMandiCessPct}
                    onChange={(e) => {
                      setConfig((prev) => ({
                        ...prev,
                        bulkBuyer: { ...prev.bulkBuyer, tradePolicy: { ...prev.bulkBuyer.tradePolicy, apmcMandiCessPct: Number(e.target.value) } },
                      }));
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-bold"
                  />
                  <span>%</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-slate-300 font-medium">Transit Cargo Insurance:</span>
                <div className="flex items-center gap-1.5 font-mono">
                  <input
                    type="number"
                    step="0.1"
                    value={config.bulkBuyer.tradePolicy.transitInsurancePct}
                    onChange={(e) => {
                      setConfig((prev) => ({
                        ...prev,
                        bulkBuyer: { ...prev.bulkBuyer, tradePolicy: { ...prev.bulkBuyer.tradePolicy, transitInsurancePct: Number(e.target.value) } },
                      }));
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-bold"
                  />
                  <span>%</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-slate-300 font-medium">Mandatory Mandi License Gate:</span>
                <button
                  type="button"
                  onClick={() => {
                    setConfig((prev) => ({
                      ...prev,
                      bulkBuyer: { ...prev.bulkBuyer, tradePolicy: { ...prev.bulkBuyer.tradePolicy, enforceMandiLicense: !prev.bulkBuyer.tradePolicy.enforceMandiLicense } },
                    }));
                    setHasUnsavedChanges(true);
                  }}
                  className={`w-full py-2 px-3 rounded-lg font-bold text-xs transition cursor-pointer ${
                    config.bulkBuyer.tradePolicy.enforceMandiLicense
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      : 'bg-slate-900 text-slate-400 border border-slate-700'
                  }`}
                >
                  {config.bulkBuyer.tradePolicy.enforceMandiLicense ? 'Enforced (Verified Only)' : 'Permissive (Demo Mode)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Security & Auth Policies */}
      {activeTab === 'security' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Multi-Factor Authentication (MFA) Role Enforcement</h3>
            <p className="text-xs text-slate-400">Configure which roles require mandatory 2FA on login versus optional enrollment.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
              {[
                { role: 'Farmer Accounts', key: 'mfaMandatoryForFarmer' as const, desc: 'SMS OTP or Authenticator' },
                { role: 'Consumer Accounts', key: 'mfaMandatoryForConsumer' as const, desc: 'Email OTP or SMS' },
                { role: 'Bulk Buyer Traders', key: 'mfaMandatoryForBulkBuyer' as const, desc: 'FIDO2 / SMS OTP Mandate' },
                { role: 'Admin Operators', key: 'mfaMandatoryForAdmin' as const, desc: 'TOTP Hardware / App' },
              ].map((item) => (
                <div key={item.key} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{item.role}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setConfig((prev) => ({
                          ...prev,
                          security: { ...prev.security, [item.key]: !prev.security[item.key] },
                        }));
                        setHasUnsavedChanges(true);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        config.security[item.key]
                          ? 'bg-purple-950 text-purple-300 border border-purple-700'
                          : 'bg-slate-900 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {config.security[item.key] ? 'Mandatory' : 'Optional'}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Brute-Force Safeguards & Lockout Rules</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-slate-300">Max Failed Attempts Before Lockout:</span>
                <input
                  type="number"
                  value={config.security.maxFailedLoginAttempts}
                  onChange={(e) => {
                    setConfig((prev) => ({
                      ...prev,
                      security: { ...prev.security, maxFailedLoginAttempts: Number(e.target.value) },
                    }));
                    setHasUnsavedChanges(true);
                  }}
                  className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-bold"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-slate-300">Lockout Duration:</span>
                <div className="flex items-center gap-1.5 font-mono">
                  <input
                    type="number"
                    value={config.security.lockoutDurationMinutes}
                    onChange={(e) => {
                      setConfig((prev) => ({
                        ...prev,
                        security: { ...prev.security, lockoutDurationMinutes: Number(e.target.value) },
                      }));
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-bold"
                  />
                  <span>min</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-slate-300">Minimum Password Length:</span>
                <input
                  type="number"
                  value={config.security.minPasswordLength}
                  onChange={(e) => {
                    setConfig((prev) => ({
                      ...prev,
                      security: { ...prev.security, minPasswordLength: Number(e.target.value) },
                    }));
                    setHasUnsavedChanges(true);
                  }}
                  className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-bold"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Global Broadcast & Kill-Switches */}
      {activeTab === 'global' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Emergency Kill-Switches */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-rose-500" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Emergency Price Freeze</h4>
                    <p className="text-xs text-slate-400">Instantly locks all live trading rates to prevent market volatility.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setConfig((prev) => ({
                      ...prev,
                      global: { ...prev.global, emergencyPriceFreeze: !prev.global.emergencyPriceFreeze },
                    }));
                    setHasUnsavedChanges(true);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                    config.global.emergencyPriceFreeze
                      ? 'bg-rose-600 text-white shadow-lg'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {config.global.emergencyPriceFreeze ? '❄️ Freeze Active' : 'Normal Fluctuations'}
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Platform Maintenance Mode</h4>
                    <p className="text-xs text-slate-400">Renders read-only maintenance notification for non-admins.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setConfig((prev) => ({
                      ...prev,
                      global: { ...prev.global, maintenanceMode: !prev.global.maintenanceMode },
                    }));
                    setHasUnsavedChanges(true);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                    config.global.maintenanceMode
                      ? 'bg-amber-600 text-white shadow-lg'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {config.global.maintenanceMode ? '⚠️ Maintenance ON' : 'Live Operations'}
                </button>
              </div>
            </div>
          </div>

          {/* System Announcement Banner Broadcast */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-purple-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">Platform-Wide Announcement Banner Broadcast</h4>
                  <p className="text-xs text-slate-400">Broadcasts an urgent top banner visible to all farmers, consumers, and bulk buyers.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setConfig((prev) => ({
                    ...prev,
                    global: { ...prev.global, announcementActive: !prev.global.announcementActive },
                  }));
                  setHasUnsavedChanges(true);
                }}
                className={`px-3 py-1 rounded-lg font-bold text-xs ${
                  config.global.announcementActive
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {config.global.announcementActive ? 'Broadcast Live' : 'Muted'}
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">Broadcast Message Text:</label>
                <textarea
                  rows={2}
                  value={config.global.announcementBanner}
                  onChange={(e) => {
                    setConfig((prev) => ({
                      ...prev,
                      global: { ...prev.global, announcementBanner: e.target.value },
                    }));
                    setHasUnsavedChanges(true);
                  }}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
                  placeholder="Enter platform notification to broadcast to all pages..."
                />
              </div>

              {config.global.announcementActive && (
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/60 text-purple-200 text-xs flex items-center gap-2">
                  <Bell className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="font-semibold">Live Preview:</span>
                  <span className="truncate">{config.global.announcementBanner}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Parameter Audit Log */}
      {activeTab === 'audit' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Super Admin Parameter Audit Trail</h3>
              <p className="text-xs text-slate-400">Chronological history of parameter tuning, price updates, and override actions.</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">Immutable Operations Log</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="pb-2 font-medium">Timestamp</th>
                  <th className="pb-2 font-medium">Category</th>
                  <th className="pb-2 font-medium">Parameter Modified</th>
                  <th className="pb-2 font-medium">Prior Value</th>
                  <th className="pb-2 font-medium">New Value</th>
                  <th className="pb-2 font-medium text-right">Authorized Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {config.changeLog && config.changeLog.length > 0 ? (
                  config.changeLog.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/30">
                      <td className="py-2.5 font-mono text-[11px] text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="py-2.5 font-bold text-slate-300">{log.category}</td>
                      <td className="py-2.5 text-white font-medium">{log.parameterName}</td>
                      <td className="py-2.5 font-mono text-[11px] text-slate-400 max-w-xs truncate">{log.oldValue}</td>
                      <td className="py-2.5 font-mono text-[11px] text-emerald-400 font-semibold max-w-xs truncate">{log.newValue}</td>
                      <td className="py-2.5 text-right text-slate-300">{log.adminName}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-slate-500">
                      No parameter change logs recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
