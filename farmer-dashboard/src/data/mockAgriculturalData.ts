import { CropRateItem, VegetableItem, GuidanceStage, GovtScheme } from '../types';

/**
 * Sample government MSP rates (Minimum Support Price per Quintal / 100 kg)
 * Clearly marked as sample planning benchmarks.
 */
export const SAMPLE_CROP_MSP_RATES: CropRateItem[] = [
  {
    id: 'wheat',
    name: 'Wheat',
    hindiName: 'गेहूं (Gehun)',
    season: 'Rabi',
    mspRate: 2275,
    unit: 'Quintal (100 kg)',
    description: 'Central pool procurement standard FAQ grain moisture < 12%',
    badge: 'Major Rabi Crop',
  },
  {
    id: 'rice',
    name: 'Paddy / Rice (Common)',
    hindiName: 'धान (Dhan / Chawal)',
    season: 'Kharif',
    mspRate: 2183,
    unit: 'Quintal (100 kg)',
    description: 'Grade-A variant ₹2,203/qtl. Regulated purchase at APMC mandis',
    badge: 'Staple Kharif',
  },
  {
    id: 'maize',
    name: 'Maize (Corn)',
    hindiName: 'मक्का (Makka)',
    season: 'Kharif',
    mspRate: 2090,
    unit: 'Quintal (100 kg)',
    description: 'Dry grain feed and industrial starch grade benchmark',
    badge: 'Coarse Grain',
  },
  {
    id: 'mustard',
    name: 'Mustard & Rapeseed',
    hindiName: 'सरसों (Sarson)',
    season: 'Rabi',
    mspRate: 5650,
    unit: 'Quintal (100 kg)',
    description: 'Oilseed minimum support rate; basis 42% oil content standard',
    badge: 'High Value Oilseed',
  },
  {
    id: 'gram',
    name: 'Gram (Chana)',
    hindiName: 'चना (Chana / Desi)',
    season: 'Rabi',
    mspRate: 5440,
    unit: 'Quintal (100 kg)',
    description: 'Standard FAQ desi Bengal gram procured through NAFED',
    badge: 'Pulse Support',
  },
  {
    id: 'bajra',
    name: 'Pearl Millet (Bajra)',
    hindiName: 'बाजरा (Bajra)',
    season: 'Kharif',
    mspRate: 2500,
    unit: 'Quintal (100 kg)',
    description: 'Shree Anna millet promotion with assured purchase mechanism',
    badge: 'Nutri-Cereal',
  },
];

/**
 * Sample Mandi rates for vegetables
 * Rate in ₹ per Quintal (and easily derived per Kg: rate / 100)
 */
export const SAMPLE_VEGETABLE_RATES: VegetableItem[] = [
  {
    id: 'potato',
    name: 'Potato',
    hindiName: 'आलू (Aloo)',
    mandiRatePerQuintal: 1450, // ₹14.50 / kg
    typicalArrival: 'High',
    primaryMarket: 'Agra / Indore Mandi',
    seasonNote: 'Jyoti & Chipsona cold storage arrivals active',
  },
  {
    id: 'onion',
    name: 'Onion (Red/Nashik)',
    hindiName: 'प्याज (Pyaaz)',
    mandiRatePerQuintal: 2100, // ₹21.00 / kg
    typicalArrival: 'Moderate',
    primaryMarket: 'Lasalgaon / Pimpalgaon Mandi',
    seasonNote: 'Graded medium-large bulb wholesale price',
  },
  {
    id: 'tomato',
    name: 'Tomato (Hybrid)',
    hindiName: 'टमाटर (Tamatar)',
    mandiRatePerQuintal: 1800, // ₹18.00 / kg
    typicalArrival: 'High',
    primaryMarket: 'Kolar / Madanapalle Mandi',
    seasonNote: 'Firm red harvesting batch; perishable lot pricing',
  },
  {
    id: 'cauliflower',
    name: 'Cauliflower',
    hindiName: 'फूलगोभी (Phool Gobhi)',
    mandiRatePerQuintal: 1650, // ₹16.50 / kg
    typicalArrival: 'Moderate',
    primaryMarket: 'Azadpur Wholesale Mandi',
    seasonNote: 'Snowball curd quality white heads with leaves',
  },
  {
    id: 'cabbage',
    name: 'Cabbage',
    hindiName: 'पत्तागोभी (Patta Gobhi)',
    mandiRatePerQuintal: 1200, // ₹12.00 / kg
    typicalArrival: 'High',
    primaryMarket: 'Nashik / Belgaum APMC',
    seasonNote: 'Compact green heads without outer yellow leaf defects',
  },
  {
    id: 'green_peas',
    name: 'Green Peas (Matar)',
    hindiName: 'हरी मटर (Hari Matar)',
    mandiRatePerQuintal: 3200, // ₹32.00 / kg
    typicalArrival: 'Low',
    primaryMarket: 'Jalandhar / Shimla Mandi',
    seasonNote: 'Sweet tender pods; premium fetched on morning auction',
  },
];

/**
 * Stage-wise agricultural production guidance organized so farmers can scan by topic.
 */
export const PRODUCTION_GUIDANCE_STAGES: GuidanceStage[] = [
  {
    id: 'soil_prep',
    stageName: 'Soil Preparation & Conditioning',
    hindiTitle: 'मृदा तैयारी एवं सुधार',
    iconName: 'Layers',
    summary: 'Deep summer ploughing, organic matter enrichment, and laser land leveling for uniform moisture.',
    keyPractices: [
      {
        title: 'Deep Summer Ploughing (May–June)',
        description: 'Ploughing the field 20–25 cm deep exposes dormant insect pupae, weed rhizomes, and harmful nematodes to harsh solar heat, significantly reducing chemical pesticide dependence later.',
        criticalTiming: 'Immediately after Rabi harvest before monsoon arrival',
      },
      {
        title: 'Green Manuring with Dhaincha / Sunhemp',
        description: 'Sow Dhaincha (Sesbania) or Sunhemp 45 days before primary crop sowing and incorporate into soil using disc harrow. Supplies 15–20 tonnes of green biomass and fixes ~60–80 kg atmospheric Nitrogen per hectare.',
        criticalTiming: 'Incorporate at 50% flowering stage (45–50 days after emergence)',
      },
      {
        title: 'Soil Testing & Balanced Nutrition (NPK + Zinc)',
        description: 'Draw representative samples from 8–10 zig-zag spots. Apply farmyard manure (FYM) @ 10–12 t/ha and correct zinc deficiency with 25 kg Zinc Sulphate (21%) per ha in alkaline/calcic soils.',
        criticalTiming: '3 to 4 weeks prior to basal seedbed preparation',
      },
    ],
    expertTips: [
      'Use a Laser Land Leveler once every 3 years: it cuts irrigation water wastage by 20–25% and ensures uniform germination across the field.',
      'Check soil pH: optimal range is 6.5 to 7.5. For acidic soils (pH < 6.0), incorporate agricultural lime; for sodic/alkaline soils (pH > 8.5), apply gypsum.',
    ],
    mistakesToAvoid: [
      'Do not burn crop stubble: it kills beneficial earthworms, strips soil organic carbon, and depletes topsoil microbial biology.',
      'Avoid working wet clay soil right after rain; it causes compaction and hardpan formation.',
    ],
  },
  {
    id: 'irrigation',
    stageName: 'Sowing & Precision Irrigation',
    hindiTitle: 'बुवाई एवं सिंचाई प्रबंधन',
    iconName: 'Droplets',
    summary: 'Optimal seed rate, biological seed treatment, and scheduling irrigation at critical growth stages.',
    keyPractices: [
      {
        title: 'Seed Treatment (FIR Method: Fungicide -> Insecticide -> Rhizobium)',
        description: 'Treat certified seed with Trichoderma viride @ 5g/kg or Carbendazim @ 2g/kg, followed by Imidacloprid for termite protection, and bio-fertilizers (Rhizobium/Azotobacter & PSB) to boost germination and early vigor.',
        criticalTiming: '24 hours before seed drilling in shade',
      },
      {
        title: 'Critical Irrigation Windows (e.g. CRI in Wheat)',
        description: 'Avoid water stress during vital physiological milestones: Crown Root Initiation (CRI: 20-25 days), Tillering, Flowering, and Milking stages. Skipping CRI can slash yield by up to 25%.',
        criticalTiming: 'Day 21 (CRI), Day 45 (Tillering), Day 65 (Late Jointing)',
      },
      {
        title: 'Micro-Irrigation (Drip & Sprinkler Systems)',
        description: 'Drip irrigation maintains root-zone moisture near field capacity while cutting water use by 40–50% compared to flood basin irrigation. Enables precise fertigation (injecting soluble fertilizers with water).',
        criticalTiming: 'Morning or late afternoon to minimize evaporation losses',
      },
    ],
    expertTips: [
      'Maintain proper seed spacing: Use zero-till seed-cum-fertilizer drill to save fuel, minimize weed flush, and ensure exact depth (4–5 cm).',
      'Mulch vegetable beds with straw or silver-black plastic mulch to reduce surface evaporation and keep soil 3–5°C cooler in heatwaves.',
    ],
    mistakesToAvoid: [
      'Never flood the field when high wind velocities are forecasted near grain filling to prevent lodging (plants falling flat).',
      'Avoid over-irrigation during early vegetative phase as it causes shallow root architecture.',
    ],
  },
  {
    id: 'pest_control',
    stageName: 'Pest & Disease Management (IPM)',
    hindiTitle: 'कीट एवं रोग नियंत्रण (एकीकृत प्रबंधन)',
    iconName: 'ShieldAlert',
    summary: 'Integrated Pest Management (IPM): physical traps, biocontrol agents, and calibrated curative sprays.',
    keyPractices: [
      {
        title: 'Physical Monitoring Traps (Pheromone & Sticky Traps)',
        description: 'Install yellow sticky traps (15–20 per acre) for sucking pests (whiteflies, aphids, thrips) and blue sticky traps for flower thrips. Install 4–5 delta pheromone traps per acre for bollworms/stem borers to catch early moth flight.',
        criticalTiming: 'Install 10 days after transplanting or seedling emergence',
      },
      {
        title: 'Preventive Neem-Based Botanical Formulations',
        description: 'Spray Azadirachtin (Neem Oil 1500 ppm or 10,000 ppm) @ 3–5 ml/litre with sticker/soap solution. Acts as an anti-feedant and repellent against caterpillars and leaf miners without killing beneficial pollinator bees.',
        criticalTiming: 'Early morning or dusk hours every 12–15 days',
      },
      {
        title: 'Targeted Biological Control (Trichogramma / Pseudomonas)',
        description: 'Release Trichogramma egg parasitoids @ 50,000/acre for lepidopteran borer control. Apply Pseudomonas fluorescens spray @ 5g/litre for fungal blight and root wilt suppression.',
        criticalTiming: 'At first appearance of pest egg masses before larvae bore in',
      },
    ],
    expertTips: [
      'Observe the Economic Threshold Level (ETL): do not spray expensive systemic chemicals at the first sight of a bug. Wait until counts cross economic injury levels.',
      'Rotate chemical fungicide groups (e.g. Triazoles vs Strobilurins) to stop pathogens from mutating resistance.',
    ],
    mistakesToAvoid: [
      'Never mix chemical insecticides directly with bio-control agents (Trichoderma or Beauveria) as it neutralizes the living beneficial fungi.',
      'Never spray during peak pollinator hours (10:00 AM – 2:00 PM) to protect honeybees.',
    ],
  },
  {
    id: 'harvest_storage',
    stageName: 'Harvesting & Safe Storage',
    hindiTitle: 'कटाई, गहाई एवं सुरक्षित भंडारण',
    iconName: 'Warehouse',
    summary: 'Optimal grain moisture standards, hermetic storage bags, and post-harvest grading for mandi premiums.',
    keyPractices: [
      {
        title: 'Moisture Testing Before Silo / Bagging',
        description: 'Harvest grains when grain moisture reaches 18–20%, but dry thoroughly on clean drying floors/tarpaulins down to 10–12% moisture before hermetic storage to prevent fungal aflatoxins and stored-grain weevils.',
        criticalTiming: 'Dry immediately after combine-threshing over 2–3 sunny days',
      },
      {
        title: 'Hermetic / Triple-Layer Storage Bags (e.g. Pusa Bins / GrainPro)',
        description: 'Store grain in sealed oxygen-depleting triple-layer hermetic bags or galvanized Pusa bins. As residual respiration exhausts oxygen inside, insects suffocate naturally without any synthetic fumigation tablets.',
        criticalTiming: 'During final packing into dunnage wooden pallets in godown',
      },
      {
        title: 'Vegetable Field Pre-cooling and Grading',
        description: 'Harvest vegetables (tomatoes, capsicum, peas) early in the morning before daytime heat. Remove field heat under ventilated shade, sort into Grade A (uniform size, zero blemish) and Grade B for 20–35% higher mandi price.',
        criticalTiming: 'Harvest 6:00 AM – 9:00 AM; transport during cool night hours',
      },
    ],
    expertTips: [
      'Stack grain bags on wooden crates/dunnage at least 50 cm away from walls and 15 cm above ground to avoid moisture seepage from masonry walls.',
      'Use non-toxic neem leaf powder or edible inert dusts (diatomaceous earth) for farm-stored seed grains.',
    ],
    mistakesToAvoid: [
      'Never store new harvest grain sacks directly on damp cement floors without wooden battens.',
      'Do not wash wet mud off vegetables with dirty ditch water; it introduces bacterial soft rot during transit.',
    ],
  },
];

/**
 * Verified Government Support Schemes
 * Includes real official portal links and direct URLs.
 */
export const GOVT_SCHEMES: GovtScheme[] = [
  {
    id: 'pm_kisan',
    name: 'Pradhan Mantri Kisan Samman Nidhi',
    hindiName: 'पीएम किसान सम्मान निधि',
    shortAcronym: 'PM-KISAN',
    category: 'Income Support',
    benefitAmount: '₹6,000 / year (Direct DBT in 3 equal installments of ₹2,000)',
    summary: 'Central sector scheme providing income support to all landholding farmer families across the country to procure agricultural inputs and manage domestic needs.',
    keyBenefits: [
      'Direct benefit transfer (DBT) straight to Aadhaar-seeded bank account',
      '3 installments of ₹2,000 each credited every 4 months',
      'Universal coverage for all cultivable landholding farmer households',
      'Self-registration, e-KYC and payment status tracking via PM-KISAN Portal',
    ],
    eligibility: 'All farmer families holding cultivable land in their names (subject to exclusion criteria such as institutional landholders, income tax payers, and constitutional post holders).',
    officialUrl: 'https://pmkisan.gov.in',
    portalName: 'pmkisan.gov.in',
  },
  {
    id: 'pmfby',
    name: 'Pradhan Mantri Fasal Bima Yojana',
    hindiName: 'प्रधानमंत्री फसल बीमा योजना',
    shortAcronym: 'PMFBY',
    category: 'Crop Insurance',
    benefitAmount: 'Comprehensive non-preventable yield risk & localized disaster compensation',
    summary: 'Affordable, government-subsidized crop insurance shield covering post-sowing crop loss, dry spells, flooding, hailstorms, unseasonal rains, and post-harvest cyclone damage.',
    keyBenefits: [
      'Farmer pays nominal premium: only 1.5% for Rabi, 2% for Kharif, and 5% for annual commercial/horticulture crops',
      'Remaining actuarial premium balance fully subsidized 50:50 by Central and State Govts',
      'Satellite, drone, and smartphone CCE (Crop Cutting Experiment) app validation',
      'Claim settlement paid directly into farmer bank account within 3 weeks of assessment',
    ],
    eligibility: 'All farmers (including sharecroppers and tenant farmers) growing notified crops in designated insurance areas.',
    officialUrl: 'https://pmfby.gov.in',
    portalName: 'pmfby.gov.in',
  },
  {
    id: 'kcc',
    name: 'Kisan Credit Card & Concessional Credit',
    hindiName: 'किसान क्रेडिट कार्ड योजना',
    shortAcronym: 'KCC',
    category: 'Credit',
    benefitAmount: 'Revolving crop loan up to ₹3,00,000 at an effective interest rate of 4% p.a.',
    summary: 'Institutional credit access to prevent predatory moneylender borrowing. Provides flexible revolving cash-credit for seeds, fertilizers, tractor hire, irrigation power, and allied animal husbandry.',
    keyBenefits: [
      'Base interest rate 7% with 3% prompt repayment incentive (effective rate = 4% only)',
      'Collateral-free loan limit up to ₹1.60 lakh (extendable to ₹2.00 lakh under tie-ups)',
      'Includes personal accident insurance cover up to ₹50,000',
      'Validity for 5 years with annual renewal based on agricultural land records',
    ],
    eligibility: 'All individual farmers, joint borrowers, tenant farmers, oral lessees, and Self Help Groups (SHGs) engaged in agriculture or animal husbandry.',
    officialUrl: 'https://www.myscheme.gov.in/schemes/kcc',
    portalName: 'myscheme.gov.in/schemes/kcc',
  },
  {
    id: 'soil_health_card',
    name: 'Soil Health Card Scheme',
    hindiName: 'मृदा स्वास्थ्य कार्ड योजना',
    shortAcronym: 'SHC',
    category: 'Soil Health',
    benefitAmount: 'Free 12-parameter laboratory soil test report & customized nutrient dose',
    summary: 'Scientific field soil testing issued to farmers every 3 years, highlighting micro and macro-nutrient levels and advising precise fertilizer dosage to curb unnecessary urea overuse.',
    keyBenefits: [
      'Analyzes 12 critical parameters: N, P, K, S, Zn, Fe, Cu, Mn, Bo, pH, EC, and Organic Carbon',
      'Crop-specific customized fertilizer recommendation guidelines',
      'Prevents excessive urea usage, reducing input costs by 8–15% and boosting yields by 10–12%',
      'Online digital card download anytime through village Khasra/survey number',
    ],
    eligibility: 'Every farmer possessing agricultural land in all states and union territories.',
    officialUrl: 'https://soilhealth.dac.gov.in',
    portalName: 'soilhealth.dac.gov.in',
  },
  {
    id: 'pmksy',
    name: 'Pradhan Mantri Krishi Sinchayee Yojana (Per Drop More Crop)',
    hindiName: 'प्रधानमंत्री कृषि सिंचाई योजना',
    shortAcronym: 'PMKSY',
    category: 'Irrigation Subsidy',
    benefitAmount: 'Up to 55% subsidy for small/marginal farmers (45% for other farmers) on drip & sprinkler hardware',
    summary: 'Focused on extending water-use efficiency at farm level through micro-irrigation systems (Drip and Sprinkler), farm ponds, check dams, and pressurized pipeline connections.',
    keyBenefits: [
      'Financial subsidy up to 55% of benchmark cost for small & marginal farmers',
      'Saves 40–50% irrigation water while boosting fertilizer utilization efficiency via fertigation',
      'Reduces electricity bills and eliminates weed proliferation between crop rows',
      'Authorized multi-brand empanelled vendors with field installation warranties',
    ],
    eligibility: 'Farmers possessing cultivable land with an assured water source (borewell, tubewell, canal, or farm pond).',
    officialUrl: 'https://pmksy.gov.in',
    portalName: 'pmksy.gov.in',
  },
  {
    id: 'enam',
    name: 'e-NAM (National Agriculture Market)',
    hindiName: 'राष्ट्रीय कृषि बाजार (ई-नाम)',
    shortAcronym: 'e-NAM',
    category: 'Market Access',
    benefitAmount: 'Transparent pan-India online electronic bidding with direct payment transfer',
    summary: 'A pan-India electronic trading portal networking the existing APMC mandis to create a unified national market for agricultural commodities, eliminating middleman cartel pricing.',
    keyBenefits: [
      'Connects over 1,300+ wholesale mandis across 23+ states and UTs',
      'Transparent electronic auction (e-Bidding) ensuring better competitive price discovery',
      'Integrated quality assaying labs at mandi gates with lot-wise grade certificates',
      'Direct electronic settlement (e-Payment) right into the seller farmer bank account',
    ],
    eligibility: 'Any farmer holding an Aadhaar card, bank passbook, and agricultural produce visiting an e-NAM integrated mandi or registering via the e-NAM mobile app.',
    officialUrl: 'https://enam.gov.in',
    portalName: 'enam.gov.in',
  },
];
