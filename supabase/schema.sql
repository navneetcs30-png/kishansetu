-- ==============================================================================
-- 🌾 KISHANSETU (किसान सेतु) - SUPABASE POSTGRESQL SCHEMA & INITIAL SEED
-- ==============================================================================
-- Execute this entire file in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. USERS & PROFILES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('admin', 'farmer', 'consumer', 'bulk_buyer')),
    password_hash TEXT,
    salt TEXT,
    role_meta JSONB DEFAULT '{}'::jsonb,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user lookup by username or email
CREATE INDEX IF NOT EXISTS idx_users_username_email ON public.users (username, email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users (role);

-- ------------------------------------------------------------------------------
-- 2. FARMER VERIFICATIONS TABLE (Aadhaar / Land Records / Kisan ID KYC)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.farmer_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    farmer_name TEXT NOT NULL,
    aadhaar_masked TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    village TEXT NOT NULL,
    land_size_acres NUMERIC(8, 2) NOT NULL DEFAULT 0.0,
    crops_grown TEXT[] DEFAULT '{}',
    kisan_id TEXT UNIQUE,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    documents JSONB DEFAULT '[]'::jsonb,
    reviewer_notes TEXT,
    verified_by TEXT,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_farmer_verif_status ON public.farmer_verifications (status);
CREATE INDEX IF NOT EXISTS idx_farmer_verif_kisan_id ON public.farmer_verifications (kisan_id);

-- ------------------------------------------------------------------------------
-- 3. CROPS MSP BENCHMARKS TABLE (Central Govt Minimum Support Prices)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crops_msp (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_name TEXT NOT NULL,
    hindi_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Grain', 'Pulse', 'Oilseed', 'Cash Crop', 'Vegetable')),
    msp_rate NUMERIC(10, 2) NOT NULL,
    unit TEXT NOT NULL DEFAULT 'Quintal (100 kg)',
    effective_year TEXT NOT NULL DEFAULT '2025-26',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. MANDI SPOT RATES TABLE (Real-time APMC Mandi Wholesale Rates)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mandi_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    commodity TEXT NOT NULL,
    hindi_name TEXT,
    market_name TEXT NOT NULL,
    state TEXT NOT NULL,
    min_price NUMERIC(10, 2) NOT NULL,
    modal_price NUMERIC(10, 2) NOT NULL,
    max_price NUMERIC(10, 2) NOT NULL,
    unit TEXT NOT NULL DEFAULT '₹/Quintal',
    price_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mandi_commodity ON public.mandi_rates (commodity, market_name);

-- ------------------------------------------------------------------------------
-- 5. PRODUCE LISTINGS TABLE (Farmer Direct-to-Consumer & B2B Catalog)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.produce_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    farmer_name TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    quantity_available NUMERIC(10, 2) NOT NULL,
    unit TEXT NOT NULL DEFAULT 'kg',
    price_per_unit NUMERIC(10, 2) NOT NULL,
    location TEXT NOT NULL,
    harvest_date DATE,
    organic_certified BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SOLD_OUT', 'UNLISTED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. ORDERS TABLE (Retail & Direct Consumer Transactions)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    buyer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    buyer_name TEXT NOT NULL,
    order_type TEXT NOT NULL DEFAULT 'RETAIL_CONSUMER' CHECK (order_type IN ('RETAIL_CONSUMER', 'BULK_CONTRACT')),
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_amount NUMERIC(12, 2) NOT NULL,
    delivery_address JSONB NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
    delivery_status TEXT NOT NULL DEFAULT 'PLACED' CHECK (delivery_status IN ('PLACED', 'CONFIRMED', 'DISPATCHED', 'DELIVERED', 'CANCELLED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_buyer ON public.orders (buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (delivery_status, payment_status);

-- ------------------------------------------------------------------------------
-- 7. CONTRACT FARMING AGREEMENTS TABLE (Bulk Buyers & Farmers)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_code TEXT UNIQUE NOT NULL,
    buyer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    buyer_name TEXT NOT NULL,
    farmer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    farmer_name TEXT NOT NULL,
    crop_name TEXT NOT NULL,
    quantity_metric_tons NUMERIC(10, 2) NOT NULL,
    agreed_price_per_ton NUMERIC(10, 2) NOT NULL,
    total_contract_value NUMERIC(12, 2) NOT NULL,
    advance_paid NUMERIC(12, 2) DEFAULT 0.0,
    delivery_deadline DATE NOT NULL,
    quality_specs TEXT,
    terms TEXT,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'FULFILLED', 'DISPUTED', 'CANCELLED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. AUDIT LOGS TABLE (Administrative Actions & Security Trail)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL,
    actor TEXT NOT NULL,
    details TEXT NOT NULL,
    ip_address TEXT,
    status TEXT NOT NULL CHECK (status IN ('SUCCESS', 'FAILED', 'WARNING')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs (created_at DESC);

-- ==============================================================================
-- 🔒 ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops_msp ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mandi_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produce_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read of MSP rates, Mandi prices, and Produce catalog
CREATE POLICY "Public can view MSP rates" ON public.crops_msp FOR SELECT USING (true);
CREATE POLICY "Public can view Mandi prices" ON public.mandi_rates FOR SELECT USING (true);
CREATE POLICY "Public can view active produce listings" ON public.produce_listings FOR SELECT USING (status = 'ACTIVE');

-- Authenticated / anon read access for KishanSetu web platform
CREATE POLICY "Allow platform service read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow platform service update users" ON public.users FOR ALL USING (true);
CREATE POLICY "Allow platform verifications access" ON public.farmer_verifications FOR ALL USING (true);
CREATE POLICY "Allow platform orders access" ON public.orders FOR ALL USING (true);
CREATE POLICY "Allow platform contracts access" ON public.contracts FOR ALL USING (true);
CREATE POLICY "Allow platform audit logs access" ON public.audit_logs FOR ALL USING (true);

-- ==============================================================================
-- 🌱 INITIAL SEED DATA
-- ==============================================================================

-- 1. Default Users (Super Admin, Farmer, Consumer, Bulk Buyer)
INSERT INTO public.users (id, username, email, name, phone, role, role_meta, mfa_enabled)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'admin',
    'admin@kishansetu.in',
    'Super Admin Devon Vance',
    '+91-9876543210',
    'admin',
    '{"organization": "AgriPortal Central Security & Governance Council", "badgeTitle": "Super Administrator", "clearanceLevel": "Root Clearance (Level 5)"}'::jsonb,
    TRUE
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'ramesh.farmer',
    'ramesh.farmer@agriportal.in',
    'Ramesh Patel',
    '+91-9811122334',
    'farmer',
    '{"village": "Rampur", "district": "Varanasi", "state": "Uttar Pradesh", "farmAcreage": 4.5}'::jsonb,
    TRUE
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'priya.consumer',
    'priya.consumer@freshmart.in',
    'Priya Sharma',
    '+91-9822233445',
    'consumer',
    '{"city": "Lucknow", "membershipType": "KishanDirect Gold"}'::jsonb,
    FALSE
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'vikram.bulkbuyer',
    'vikram.bulkbuyer@agritraders.com',
    'Vikram Singhania',
    '+91-9833344556',
    'bulk_buyer',
    '{"companyName": "AgriCore Global Logistics Ltd.", "licenseNumber": "FSSAI-UP-884920"}'::jsonb,
    TRUE
  )
ON CONFLICT (username) DO NOTHING;

-- 2. Initial Farmer Verifications
INSERT INTO public.farmer_verifications (
  user_id, farmer_name, aadhaar_masked, state, district, village, land_size_acres, crops_grown, kisan_id, status, reviewer_notes, verified_by, verified_at
)
VALUES
  (
    '00000000-0000-0000-0000-000000000002',
    'Ramesh Patel',
    'XXXX-XXXX-8921',
    'Uttar Pradesh',
    'Varanasi',
    'Rampur Kalan',
    4.50,
    ARRAY['Wheat', 'Paddy', 'Mustard'],
    'KS-UP-VNS-2026-0892',
    'VERIFIED',
    'Land revenue record 7/12 matched and verified with state portal.',
    'Devon Vance (Admin)',
    NOW() - INTERVAL '2 days'
  ),
  (
    NULL,
    'Sukhwinder Singh',
    'XXXX-XXXX-4512',
    'Punjab',
    'Ludhiana',
    'Samrala',
    8.25,
    ARRAY['Wheat', 'Paddy', 'Maize'],
    'KS-PB-LDH-2026-4512',
    'VERIFIED',
    'Farmer digitized land certificate valid.',
    'Devon Vance (Admin)',
    NOW() - INTERVAL '5 days'
  ),
  (
    NULL,
    'Gopal Sharma',
    'XXXX-XXXX-3341',
    'Madhya Pradesh',
    'Indore',
    'Sanwer',
    3.00,
    ARRAY['Soybean', 'Wheat', 'Gram'],
    NULL,
    'PENDING',
    'Documents queued for inspection by Block Agriculture Officer.',
    NULL,
    NULL
  )
ON CONFLICT DO NOTHING;

-- 3. Central Govt MSP Benchmarks (2025-26 Season)
INSERT INTO public.crops_msp (crop_name, hindi_name, category, msp_rate, unit, effective_year)
VALUES
  ('Wheat', 'गेहूं', 'Grain', 2275.00, 'Quintal (100 kg)', '2025-26'),
  ('Paddy (Common)', 'धान (सामान्य)', 'Grain', 2183.00, 'Quintal (100 kg)', '2025-26'),
  ('Paddy (Grade A)', 'धान (ग्रेड-ए)', 'Grain', 2203.00, 'Quintal (100 kg)', '2025-26'),
  ('Mustard / Rapeseed', 'सरसों', 'Oilseed', 5650.00, 'Quintal (100 kg)', '2025-26'),
  ('Gram (Chana)', 'चना', 'Pulse', 5440.00, 'Quintal (100 kg)', '2025-26'),
  ('Maize', 'मक्का', 'Grain', 2090.00, 'Quintal (100 kg)', '2025-26'),
  ('Bajra', 'बाजरा', 'Grain', 2500.00, 'Quintal (100 kg)', '2025-26')
ON CONFLICT DO NOTHING;

-- 4. Mandi Rates Sample Benchmarks
INSERT INTO public.mandi_rates (commodity, hindi_name, market_name, state, min_price, modal_price, max_price, unit)
VALUES
  ('Potato', 'आलू', 'Agra Mandi', 'Uttar Pradesh', 1300.00, 1450.00, 1600.00, '₹/Quintal'),
  ('Onion', 'प्याज', 'Lasalgaon Mandi', 'Maharashtra', 1900.00, 2100.00, 2350.00, '₹/Quintal'),
  ('Tomato', 'टमाटर', 'Kolar Mandi', 'Karnataka', 1600.00, 1850.00, 2100.00, '₹/Quintal'),
  ('Green Peas', 'हरी मटर', 'Jabalpur Mandi', 'Madhya Pradesh', 3200.00, 3600.00, 4000.00, '₹/Quintal'),
  ('Green Chilli', 'हरी मिर्च', 'Guntur Mandi', 'Andhra Pradesh', 3800.00, 4200.00, 4700.00, '₹/Quintal'),
  ('Cauliflower', 'फूलगोभी', 'Hapur Mandi', 'Uttar Pradesh', 1400.00, 1600.00, 1850.00, '₹/Quintal')
ON CONFLICT DO NOTHING;

-- 5. Sample Audit Log
INSERT INTO public.audit_logs (action, actor, details, status)
VALUES
  ('SYSTEM_BOOT', 'SYSTEM', 'Supabase Database schema initialized successfully for KishanSetu.', 'SUCCESS');
