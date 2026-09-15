import { ProduceItem, CustomerOrder, GuidanceTopic, ConsumerScheme } from '../types';

export const INITIAL_PRODUCE_ITEMS: ProduceItem[] = [
  {
    id: 'prod-wheat-sharbati',
    name: 'Wheat (Sharbati Premium)',
    hindiName: 'शरबती गेहूं',
    category: 'Grains',
    variety: 'Madhya Pradesh Sharbati Grade A',
    pricePerKg: 38,
    pricePerQuintal: 3600, // discount at quintal
    farmerName: 'Rameshwar Patidar',
    location: 'Sehore, MP',
    distanceKm: 85,
    harvestedDate: 'Recent Rabi Harvest (Sun-cured)',
    qualityGrade: 'Grade A+',
    stockKg: 2400,
    minOrderKg: 5,
    popular: true,
    description: 'Golden, heavy grain with naturally high gluten and sweet aroma. Excellent for soft rotis and long shelf storage.'
  },
  {
    id: 'prod-rice-basmati',
    name: 'Basmati Rice (1121 Steam)',
    hindiName: 'बासमती चावल',
    category: 'Grains',
    variety: '1121 Extra Long Grain (Aged 1 yr)',
    pricePerKg: 85,
    pricePerQuintal: 8100,
    farmerName: 'Gurpreet Singh Brar',
    location: 'Karnal, Haryana',
    distanceKm: 140,
    harvestedDate: 'Aged 12 Months',
    qualityGrade: 'Grade A+',
    stockKg: 1800,
    minOrderKg: 5,
    popular: true,
    description: 'Aromatic aged grains that expand to over twice their raw length upon cooking without stickiness.'
  },
  {
    id: 'prod-rice-sona',
    name: 'Sona Masoori Rice',
    hindiName: 'सोना मसूरी चावल',
    category: 'Grains',
    variety: 'Lightweight Daily Grain',
    pricePerKg: 54,
    pricePerQuintal: 5150,
    farmerName: 'Venkata Raman',
    location: 'Kurnool, Andhra Pradesh',
    distanceKm: 260,
    harvestedDate: 'Fresh Crop 2026',
    qualityGrade: 'Grade A',
    stockKg: 3200,
    minOrderKg: 5,
    description: 'Low-starch, lightweight daily staple grain. Easy to digest and ideal for everyday meals.'
  },
  {
    id: 'prod-potato-desi',
    name: 'Farm-Fresh Potato',
    hindiName: 'देसी आलू',
    category: 'Vegetables',
    variety: 'Kufri Jyoti (Table Grade)',
    pricePerKg: 22,
    pricePerQuintal: 2050,
    farmerName: 'Mahesh Chandra',
    location: 'Farrukhabad, UP',
    distanceKm: 110,
    harvestedDate: 'Harvested 2 Days Ago',
    qualityGrade: 'Grade A',
    stockKg: 4500,
    minOrderKg: 2,
    popular: true,
    description: 'Firm, thin-skinned tubers without sprouts or green patches. Rich dry-matter content.'
  },
  {
    id: 'prod-onion-nashik',
    name: 'Red Onion (Nashik Special)',
    hindiName: 'नासिक लाल प्याज',
    category: 'Vegetables',
    variety: 'Garwa Dark Red',
    pricePerKg: 32,
    pricePerQuintal: 2980,
    farmerName: 'Sanjay B. Patil',
    location: 'Lasalgaon, Nashik',
    distanceKm: 190,
    harvestedDate: 'Harvested 3 Days Ago (Cured)',
    qualityGrade: 'Grade A+',
    stockKg: 5100,
    minOrderKg: 2,
    popular: true,
    description: 'High pungency, tight outer papery skin with multiple rings. Cured for enhanced kitchen longevity.'
  },
  {
    id: 'prod-tomato-vine',
    name: 'Vine-Ripened Tomato',
    hindiName: 'टमाटर',
    category: 'Vegetables',
    variety: 'Desi Hybrid Red',
    pricePerKg: 28,
    pricePerQuintal: 2600,
    farmerName: 'Anandi Devi',
    location: 'Kolar, Karnataka',
    distanceKm: 95,
    harvestedDate: 'Picked Today 6:00 AM',
    qualityGrade: 'Grade A',
    stockKg: 1200,
    minOrderKg: 1,
    popular: true,
    description: 'Naturally ripened on vines with rich lycopene red hue and balanced tangy-sweet acidity.'
  },
  {
    id: 'prod-green-chilli',
    name: 'Green Chillies (Teja/Desi)',
    hindiName: 'हरी मिर्च',
    category: 'Vegetables',
    variety: 'Spicy Long Green',
    pricePerKg: 65,
    pricePerQuintal: 6100,
    farmerName: 'Babulal Meena',
    location: 'Kota, Rajasthan',
    distanceKm: 175,
    harvestedDate: 'Picked Yesterday',
    qualityGrade: 'Grade A',
    stockKg: 450,
    minOrderKg: 0.5,
    description: 'Crisp, slender chillies with robust heat and deep green stems that indicate peak freshness.'
  },
  {
    id: 'prod-dal-toor',
    name: 'Desi Toor Dal (Unpolished)',
    hindiName: 'अरहर / तूर दाल',
    category: 'Pulses & Seeds',
    variety: 'Marathwada Organic Yellow',
    pricePerKg: 145,
    pricePerQuintal: 13900,
    farmerName: 'Shrikant Deshmukh',
    location: 'Latur, Maharashtra',
    distanceKm: 210,
    harvestedDate: 'Cleaned & Sorted This Week',
    qualityGrade: 'Organic Certified',
    stockKg: 1600,
    minOrderKg: 1,
    organic: true,
    description: 'Zero chemical polish or oil coating. High natural protein content with authentic earthy flavor.'
  },
  {
    id: 'prod-mustard-seeds',
    name: 'Yellow Mustard Seeds',
    hindiName: 'पीली सरसों',
    category: 'Pulses & Seeds',
    variety: 'High Oil Content Grade',
    pricePerKg: 95,
    pricePerQuintal: 9100,
    farmerName: 'Kailash Choudhary',
    location: 'Bharatpur, Rajasthan',
    distanceKm: 130,
    harvestedDate: 'Dry Machine Cleaned',
    qualityGrade: 'Grade A',
    stockKg: 950,
    minOrderKg: 1,
    description: 'Uniform golden seeds with high natural pungency. Ideal for cold-pressed oil extraction and culinary seasoning.'
  }
];

export const INITIAL_CUSTOMER_ORDERS: CustomerOrder[] = [
  {
    id: 'ord-8832',
    orderNumber: 'AGR-2026-8832',
    orderDate: 'Sep 13, 2026, 11:20 AM',
    expectedDeliveryDate: 'Sep 15, 2026 (Tomorrow by 2:00 PM)',
    farmerGroup: 'Kisan Ekta Cooperative (Nashik & MP)',
    deliveryAddress: 'Flat 402, Green Meadows Residency, Sector 14',
    deliverySlot: 'Morning (8:00 AM - 12:00 PM)',
    paymentMethod: 'UPI (Payment Verified)',
    status: 'Dispatched',
    totalWeightKg: 35,
    subtotalAmount: 1420,
    discountAmount: 100,
    deliveryFee: 0,
    finalAmount: 1320,
    items: [
      {
        produceId: 'prod-wheat-sharbati',
        name: 'Wheat (Sharbati Premium)',
        variety: 'MP Sharbati Grade A',
        quantityKg: 20,
        pricePerKg: 38,
        subtotal: 760
      },
      {
        produceId: 'prod-potato-desi',
        name: 'Farm-Fresh Potato',
        variety: 'Kufri Jyoti',
        quantityKg: 10,
        pricePerKg: 22,
        subtotal: 220
      },
      {
        produceId: 'prod-onion-nashik',
        name: 'Red Onion (Nashik Special)',
        variety: 'Garwa Dark Red',
        quantityKg: 5,
        pricePerKg: 32,
        subtotal: 160
      },
      {
        produceId: 'prod-tomato-vine',
        name: 'Vine-Ripened Tomato',
        variety: 'Desi Hybrid Red',
        quantityKg: 10,
        pricePerKg: 28,
        subtotal: 280
      }
    ],
    trackingSteps: [
      {
        step: 'Placed',
        label: 'Order Placed',
        description: 'Customer order logged & verified directly at farm dispatch node.',
        timestamp: 'Sep 13, 11:20 AM',
        completed: true,
        current: false
      },
      {
        step: 'Confirmed',
        label: 'Farmer Confirmed',
        description: 'Farmers harvested, weight checked & packed in breathable jute sacks.',
        timestamp: 'Sep 13, 03:45 PM',
        completed: true,
        current: false
      },
      {
        step: 'Dispatched',
        label: 'In Transit',
        description: 'Loaded onto refrigerated agro-logistics truck (Vehicle #DL-1L-8942). En route to regional hub.',
        timestamp: 'Sep 14, 05:15 AM',
        completed: true,
        current: true
      },
      {
        step: 'Delivered',
        label: 'Out for Delivery',
        description: 'Expected arrival at buyer doorstep with digital weigh-scale verification.',
        completed: false,
        current: false
      }
    ]
  },
  {
    id: 'ord-8790',
    orderNumber: 'AGR-2026-8790',
    orderDate: 'Sep 14, 2026, 08:05 AM',
    expectedDeliveryDate: 'Sep 16, 2026',
    farmerGroup: 'Haryana Basmati Growers FPO',
    deliveryAddress: 'Flat 402, Green Meadows Residency, Sector 14',
    deliverySlot: 'Evening (4:00 PM - 7:00 PM)',
    paymentMethod: 'Cash on Delivery (COD)',
    status: 'Confirmed',
    totalWeightKg: 25,
    subtotalAmount: 2125,
    discountAmount: 150,
    deliveryFee: 0,
    finalAmount: 1975,
    items: [
      {
        produceId: 'prod-rice-basmati',
        name: 'Basmati Rice (1121 Steam)',
        variety: 'Aged 12 Months',
        quantityKg: 25,
        pricePerKg: 85,
        subtotal: 2125
      }
    ],
    trackingSteps: [
      {
        step: 'Placed',
        label: 'Order Placed',
        description: 'Direct procurement request accepted by FPO coordinator.',
        timestamp: 'Sep 14, 08:05 AM',
        completed: true,
        current: false
      },
      {
        step: 'Confirmed',
        label: 'Quality Inspected',
        description: 'Grain moisture test passed (11.8%). Sealed in moisture-barrier bags.',
        timestamp: 'Sep 14, 10:30 AM',
        completed: true,
        current: true
      },
      {
        step: 'Dispatched',
        label: 'Awaiting Hub Pickup',
        description: 'Scheduled for regional logistics departure tonight.',
        completed: false,
        current: false
      },
      {
        step: 'Delivered',
        label: 'Doorstep Delivery',
        description: 'Scheduled delivery to customer.',
        completed: false,
        current: false
      }
    ]
  },
  {
    id: 'ord-8641',
    orderNumber: 'AGR-2026-8641',
    orderDate: 'Sep 02, 2026, 02:15 PM',
    expectedDeliveryDate: 'Delivered Sep 04, 2026',
    farmerGroup: 'Latur & Rajasthan Pulses Guild',
    deliveryAddress: 'Flat 402, Green Meadows Residency, Sector 14',
    deliverySlot: 'Delivered at 11:35 AM',
    paymentMethod: 'NetBanking (State Bank)',
    status: 'Delivered',
    totalWeightKg: 15,
    subtotalAmount: 1675,
    discountAmount: 75,
    deliveryFee: 0,
    finalAmount: 1600,
    items: [
      {
        produceId: 'prod-dal-toor',
        name: 'Desi Toor Dal (Unpolished)',
        variety: 'Organic Yellow',
        quantityKg: 10,
        pricePerKg: 145,
        subtotal: 1450
      },
      {
        produceId: 'prod-mustard-seeds',
        name: 'Yellow Mustard Seeds',
        variety: 'High Oil Content',
        quantityKg: 2,
        pricePerKg: 95,
        subtotal: 190
      },
      {
        produceId: 'prod-green-chilli',
        name: 'Green Chillies (Teja)',
        variety: 'Slender Green',
        quantityKg: 0.5,
        pricePerKg: 65,
        subtotal: 35
      }
    ],
    trackingSteps: [
      {
        step: 'Placed',
        label: 'Order Placed',
        description: 'Order confirmed Sep 02.',
        timestamp: 'Sep 02, 02:15 PM',
        completed: true,
        current: false
      },
      {
        step: 'Confirmed',
        label: 'Packaged',
        description: 'Grain quality certified.',
        timestamp: 'Sep 02, 06:00 PM',
        completed: true,
        current: false
      },
      {
        step: 'Dispatched',
        label: 'Dispatched',
        description: 'Transit completed.',
        timestamp: 'Sep 03, 08:30 AM',
        completed: true,
        current: false
      },
      {
        step: 'Delivered',
        label: 'Delivered',
        description: 'Successfully handed over to customer. Verified OTP #4912.',
        timestamp: 'Sep 04, 11:35 AM',
        completed: true,
        current: true
      }
    ]
  }
];

export const GUIDANCE_TOPICS: GuidanceTopic[] = [
  {
    id: 'pick-fresh-produce',
    title: 'How to Pick Farm-Fresh Produce',
    category: 'Freshness',
    badge: 'Selection Masterclass',
    iconName: 'Sparkles',
    summary: 'Master the sensory cues — firmness, skin tautness, stem vibrancy, and moisture indicators — to identify peak-fresh crops.',
    tips: [
      {
        heading: 'Tomatoes: The Stem and Shoulder Test',
        description: 'Look for tomatoes that feel heavy for their size with smooth, taut skin. Check the stem scar: a green, fragrant calyx indicates vine-ripening rather than artificial ethylene chamber ripening.',
        highlight: 'Vine-ripened tomatoes have 30% higher natural sugars and lycopene.'
      },
      {
        heading: 'Potatoes: Firmness and Sprout Absence',
        description: 'Choose firm, unyielding potatoes with smooth skins. Avoid any with greenish tint (solanine accumulation due to light exposure) or soft sunken eyes. Potatoes should smell cleanly of dry earth.',
        highlight: 'Never consume green potato patches; peel deeply or discard.'
      },
      {
        heading: 'Onions: Dry Papery Outer Scales & Tight Necks',
        description: 'Select onions with crackly, dry papery skins and completely closed, firm necks. A soft, thick neck indicates premature harvesting or internal rot. Heavy density signals high moisture retention inside.',
        highlight: 'Dry neck = 3x longer pantry shelf life.'
      },
      {
        heading: 'Grains & Pulses: Lustre and Uniformity',
        description: 'Grains should be free from chalkiness, mold powder, or insect webbing. Whole grains like Sharbati wheat should feel hard and snap cleanly when bitten, indicating proper curing below 12% moisture.',
        highlight: 'Low grain moisture (<12%) prevents internal weevil infestation.'
      }
    ]
  },
  {
    id: 'seasonal-calendar',
    title: 'Seasonal Buying Calendar (What is In Season Now)',
    category: 'Seasonal',
    badge: 'Harvest Timetable',
    iconName: 'Calendar',
    summary: 'Buy crops during their peak regional harvest window to maximize nutritional density, peak flavor, and farm-gate affordability.',
    tips: [
      {
        heading: 'Current Season (Autumn / September - Kharif Arrivals)',
        description: 'Early Kharif harvest begins: Fresh sweet corn, green chillies, early arrivals of new paddy/rice, fresh gourds, and vine tomatoes are at their lowest seasonal price points.',
        highlight: 'Best time for: Fresh vegetables, early corn, cold-pressed mustard seeds.'
      },
      {
        heading: 'Upcoming Season (Winter / Nov - Feb)',
        description: 'Prime season for root crops (carrots, radishes, beetroot), leafy cruciferous vegetables (spinach, cauliflower, cabbage, peas), and aged Basmati rice grain milling.',
        highlight: 'Expect 30–40% wholesale price dip for winter greens.'
      },
      {
        heading: 'Pre-Monsoon & Summer (March - June)',
        description: 'Golden wheat harvest (Sharbati, Lokwan) hits mandis across MP, Punjab, and UP. Best period to buy annual wheat stocks in bulk quintals at wholesale direct rates.',
        highlight: 'Annual wheat procurement window: March to May offers lowest annual prices.'
      },
      {
        heading: 'Monsoon Transition (July - August)',
        description: 'Avoid buying damp bulk grains during humid spells. Focus on monsoon gourds (bottle gourd, ridge gourd) and protected greenhouse tomatoes.',
        highlight: 'Always inspect rain-harvested crops for surface humidity.'
      }
    ]
  },
  {
    id: 'reduce-food-waste',
    title: 'Proper Storage to Drastically Reduce Food Waste',
    category: 'Waste Reduction',
    badge: 'Zero-Waste Storage',
    iconName: 'ShieldCheck',
    summary: 'Simple temperature, airflow, and ethylene-separation strategies that double the shelf life of your kitchen staples.',
    tips: [
      {
        heading: 'The Golden Rule: Never Store Potatoes with Onions',
        description: 'Onions emit ethylene gas and moisture which triggers rapid sprouting and black mold in potatoes. Keep them in separate ventilated baskets at least 3 feet apart.',
        highlight: 'Separating potatoes and onions increases potato life from 10 days to 6 weeks.'
      },
      {
        heading: 'Tomatoes Belong on the Counter, Not the Fridge',
        description: 'Chilling below 12°C permanently shuts down tomato flavor enzymes and causes mealy flesh texture. Store stem-side down at room temperature in a single layer away from direct sunlight.',
        highlight: 'Countertop storage preserves natural volatile aroma compounds.'
      },
      {
        heading: 'Herb and Green Chilli Longevity Protocol',
        description: 'Remove green chilli stems before storage (stems retain rot fungi). Store dry in an airtight glass container lined with a reusable cotton paper towel to absorb condensation.',
        highlight: 'Stem removal doubles chilli shelf life up to 4 weeks.'
      },
      {
        heading: 'Ventilated Jute Baskets for Root Crops',
        description: 'Plastic bags trap condensation and cause bacterial soft rot. Transfer market root vegetables into open wicker or jute baskets in a cool, dark, ventilated cabinet.',
        highlight: 'Breathability prevents sweat mold.'
      }
    ]
  },
  {
    id: 'bulk-buying-practices',
    title: 'Best Practices for Bulk & Quintal Buying',
    category: 'Bulk Buying',
    badge: 'Pantry Economics',
    iconName: 'Boxes',
    summary: 'How households and communities can procure 50kg to quintal batches directly from farmers safely without spoilage.',
    tips: [
      {
        heading: 'Food-Grade Stainless Steel or HDPE Drums for Grains',
        description: 'Transfer 50kg+ bags of wheat or rice into food-grade galvanised drums with rubber-gasket airtight lids to prevent rodent access and ambient air moisture infiltration.',
        highlight: 'Airtight drums protect grains for 18–24 months safely.'
      },
      {
        heading: 'Natural Sun-Dried Neem Leaves & Clove Treatment',
        description: 'Place clean, dried neem leaves and whole cloves inside cloth pouches distributed at the bottom, middle, and top of your grain drum. These act as powerful natural repellent against grain borers.',
        highlight: '100% organic, zero pesticide residue preservation.'
      },
      {
        heading: 'Moisture Testing Before Storage',
        description: 'Before sealing a large grain batch, verify moisture content by testing with a grain bite test or moisture meter. If grains feel slightly cold/soft, spread them in the afternoon sun on a clean cotton sheet for 4 hours.',
        highlight: 'Sun drying eliminates residual field moisture.'
      },
      {
        heading: 'Quintal Direct-Buy Cost Comparison',
        description: 'Buying wheat or pulses by the quintal directly from farmers cuts retail packaging markups, distributor margins, and store overheads, delivering 25% to 35% net annual household savings.',
        highlight: 'Average family saves ₹8,000–₹12,000 per year on grain staples.'
      }
    ]
  }
];

export const CONSUMER_SCHEMES: ConsumerScheme[] = [
  {
    id: 'offer-bulk-saver',
    type: 'offer',
    title: 'Direct-From-Farm Bulk Saver Discount',
    tag: 'Active Consumer Offer',
    shortDesc: 'Order 25kg+ produce to automatically save 8%; buy full quintal (100kg) to unlock up to 15% wholesale rebate.',
    highlightBenefit: 'Up to 15% Off on Quintal Procurements',
    eligibility: 'All registered consumer households, resident societies & community kitchens.',
    agencyOrSponsor: 'AgriDirect Farmer Cooperatives Guild',
    howToClaim: 'Discounts apply automatically in the cart when total weight reaches threshold tiers.',
    officialRef: 'Tiered Bulk Rebate Schedule #F2C-2026',
    code: 'BULKHARVEST'
  },
  {
    id: 'offer-zero-brokerage',
    type: 'offer',
    title: 'Zero-Middleman Cooperative Benefit',
    tag: 'Fair Price Guarantee',
    shortDesc: '100% of your produce payment goes directly to the farmer cooperative. Zero aggregator commissions or hidden packaging fees.',
    highlightBenefit: 'Fair Consumer Rates + Max Farmer Realization',
    eligibility: 'All orders placed via the AgriDirect Consumer Hub.',
    agencyOrSponsor: 'Ministry of Agriculture & Farmers Welfare Partnership',
    howToClaim: 'Built directly into transparent item price cards.',
    officialRef: 'National Direct Marketing Initiative'
  },
  {
    id: 'scheme-psf-bharat',
    type: 'scheme',
    title: 'Price Stabilization Fund (PSF) Initiatives',
    tag: 'Govt. Consumer Scheme',
    shortDesc: 'Central government market intervention providing essential food commodities like Bharat Atta, Bharat Dal (Chana), and subsidized onions during price spikes.',
    highlightBenefit: 'Bharat Atta at ₹27.50/kg & Chana Dal at ₹60/kg',
    eligibility: 'Open to all Indian consumers without ration card restriction through designated retail outlets and cooperative portals.',
    agencyOrSponsor: 'Department of Consumer Affairs, Govt. of India',
    howToClaim: 'Available at NAFED, NCCF, Kendriya Bhandar retail points and select cooperative online delivery hubs.',
    officialRef: 'https://consumeraffairs.nic.in/schemes/price-stabilization-fund'
  },
  {
    id: 'scheme-pds-pmgkay',
    type: 'scheme',
    title: 'Pradhan Mantri Garib Kalyan Anna Yojana (PMGKAY / PDS)',
    tag: 'National Food Security',
    shortDesc: 'Ensures free food grains (5kg per person/month) to priority households and Antyodaya Anna Yojana (AAY) beneficiaries nationwide.',
    highlightBenefit: 'Free monthly grain allocation for eligible beneficiaries',
    eligibility: 'Ration card holders under NFSA (National Food Security Act).',
    agencyOrSponsor: 'Ministry of Consumer Affairs, Food & Public Distribution',
    howToClaim: 'Collect from any Fair Price Shop (FPS) using Aadhaar biometric authentication.',
    officialRef: 'https://nfsa.gov.in'
  },
  {
    id: 'scheme-onorc',
    type: 'scheme',
    title: 'One Nation One Ration Card (ONORC) Portability',
    tag: 'Interstate Consumer Access',
    shortDesc: 'Enables migrant workers and citizens to claim their entitled subsidized grains from any Fair Price Shop anywhere in India seamlessly.',
    highlightBenefit: '100% Nationwide Portability across all 36 States/UTs',
    eligibility: 'All active NFSA ration card holders moving across state or district boundaries.',
    agencyOrSponsor: 'Department of Food & Public Distribution',
    howToClaim: 'Present existing ration card or Aadhaar number at any electronic Point of Sale (ePoS) enabled fair price shop.',
    officialRef: 'https://mera-ration.nic.in'
  },
  {
    id: 'scheme-enam-fpo',
    type: 'scheme',
    title: 'e-NAM Consumer & Bulk Buyer Procurement Window',
    tag: 'Direct Market Integration',
    shortDesc: 'Direct digital trading platform connecting consumers, housing societies, and bulk buyers directly to 1,300+ APMC mandis and verified Farmer Producer Organisations (FPOs).',
    highlightBenefit: 'Direct transparent electronic bidding & assaying certificates',
    eligibility: 'Individuals, residential welfare associations (RWAs), and institutional buyers.',
    agencyOrSponsor: 'Small Farmers Agri-Business Consortium (SFAC)',
    howToClaim: 'Register as consumer buyer on the national e-NAM portal to access farm-gate auction lots.',
    officialRef: 'https://enam.gov.in'
  }
];
