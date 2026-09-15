# 🌾 KishanSetu (किसान सेतु)
### National Digital Agricultural Highway & Direct Farm Marketplace

[![React](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.1-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-3.8_Flash-4285f4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express)](https://expressjs.com/)

**KishanSetu** is an integrated, end-to-end digital agricultural ecosystem designed to bridge the gap between farmers, retail consumers, bulk B2B procurement enterprises, and administrative governance officers. The platform eliminates predatory middlemen, guarantees Minimum Support Price (MSP) benchmarks, facilitates farm-to-table consumer ordering, manages wholesale contracts, and provides AI-powered farming advisory with official Aadhaar KYC verification.

---

## 🏛️ System Architecture

KishanSetu brings together **5 distinct, specialized modules** under a unified Single Sign-On (SSO) gateway and shared session orchestrator:

```
                                  ┌────────────────────────┐
                                  │      KishanSetu        │
                                  │   Unified Platform     │
                                  │ (http://localhost:3000)│
                                  └───────────┬────────────┘
                                              │
                     ┌────────────────────────┴────────────────────────┐
                     │                                                 │
          ┌──────────▼──────────┐                           ┌──────────▼──────────┐
          │   Central Auth      │                           │  Kisan Sahayak AI   │
          │ & Identity Gateway  │                           │   Backend Engine    │
          │ (Role RBAC + 2FA)   │                           │   (/api/ai/ask)     │
          └──────────┬──────────┘                           └─────────────────────┘
                     │
     ┌───────────────┼───────────────────────────────┬───────────────────────────────┐
     │               │                               │                               │
┌────▼───────┐ ┌─────▼──────────┐             ┌──────▼────────┐             ┌────────▼────────┐
│   🌾       │ │   🛒           │             │   🏢          │             │   🛡️            │
│  Farmer    │ │  AgriDirect    │             │  Bulk Buyer   │             │  Admin Console  │
│ Dashboard  │ │ Consumer Store │             │  B2B Portal   │             │  & KYC Desk     │
└────────────┘ └────────────────┘             └───────────────┘             └─────────────────┘
```

---

## 📦 The 5 Integrated Modules

### 1. 🔐 User Login & Authentication (`user-login-&-authentication`)
The security and role-based access control (RBAC) gateway for the entire ecosystem.
- **Multi-Factor Authentication (MFA/2FA)**: Email OTP, SMS Passcodes, and TOTP Authenticator apps (Google Authenticator, 1Password, Authy).
- **Password Strength & Entropy Analyzer**: Real-time evaluation of password entropy, character sets, and vulnerability alerts.
- **Zero-Knowledge Recovery**: One-time recovery tokens and magic links with virtual test inbox drawer.
- **Live Security Audit Trail**: Real-time logging of authentication events, IP addresses, device agents, and timestamps.
- **One-Click Role Switcher**: Instant switching between simulated identities for rapid testing and demonstration.

### 2. 🌾 Farmer Agricultural Hub (`farmer-dashboard`)
The command center for farmers to maximize harvest value, access subsidies, and consult AI advisors.
- **MSP Grain Calculator**: Instant earnings projection for Wheat (₹2,275/Q), Paddy (₹2,183/Q), Mustard (₹5,650/Q), Maize, Gram, and Bajra.
- **Vegetable Mandi Benchmarks**: Live wholesale mandi prices across key agricultural hubs (Agra, Nashik, Kolar, Jabalpur, Guntur).
- **Scientific Production Guides**: Actionable guidance for Soil Prep, CRI Irrigation, Organic Pest Control (Neem oil 1500ppm), and Moisture Storage (<12%).
- **Government Welfare Schemes**: Direct portals for PM-KISAN (₹6,000/yr), PMFBY Crop Insurance, Kisan Credit Card (4% interest), and PM Krishi Sinchayee.
- **Official Aadhaar KYC Desk**: Document submission flow (Aadhaar front/back, Land Jamabandi) for government Kisan ID certification.
- **Kisan Sahayak (AI Farming Companion)**: Multilingual agricultural assistant powered by Google Gemini 3.8 Flash supporting **8 languages** (Hindi, Hinglish, Punjabi, Marathi, Gujarati, Bengali, Telugu, English) with comprehensive localized fallback.

### 3. 🛒 AgriDirect Consumer Hub (`agridirect-consumer-dashboard`)
Farm-to-fork direct retail marketplace connecting households directly to verified farmer cooperatives.
- **Produce Catalog**: Fresh seasonal produce with harvest timestamps, moisture indicators, and certified organic badges.
- **Dynamic Tiered Bulk Pricing**: Real-time cart calculation with automated volume savings (8% discount for ≥25kg, 15% discount for ≥100kg quintal bulk).
- **Order Tracking & Digital Receipts**: Step-by-step dispatch tracking from farm gate to consumer doorstep with downloadable tax receipts.
- **Storage & Shelf-Life Guidance**: Post-harvest storage protocols for root crops, leafy greens, and pulses.
- **Consumer Welfare Schemes**: Neighborhood cooperative bulk-buying pools, kitchen garden starter kits, and organic food vouchers.

### 4. 🏢 Bulk Buyer Wholesale Procurement (`bulk-buyer-dashboard`)
B2B procurement platform for institutional buyers, food processors, exporters, and retail chains.
- **Tiered Wholesale Contracts**: Dynamic rates tailored to procurement volume (50–100 Q, 100–250 Q, 250+ Q).
- **Live Contract Pipeline**: Status tracking from Purchase Order (PO Generated), Quality Assaying, Escrow Lock, Freight Dispatch, to Mandi Gate Delivery.
- **Trade Compliance & Standards**: Integrated APMC Mandi License verification, GSTIN clearance, FSSAI quality grades, and e-Way bill compliance.
- **Procurement Budget Simulator**: Instant calculation of base cost, volume savings, mandi cess (1.5%), transit insurance, and net payable.
- **Direct RFQ & Order Placement**: Modals to generate formal price quotes or execute binding procurement orders.

### 5. 🛡️ Platform Administration & Super Admin Tower (`admin-dashboard`)
The central supervisory console for platform operators, district agricultural officers, and Super Administrators.
- **⚡ Super Admin Master Control Tower**: Complete root clearance (Level 5 Authority) to configure, tune, and override parameters across **all 5 pages/modules** with instant cross-module reactivity.
- **🌾 Farmer Hub Governance**: Live Minimum Support Price (MSP) overrides, vegetable mandi benchmarks, welfare scheme ceilings, and AI Sahayak hyperparameters.
- **🛒 Consumer Catalog & Discount Engine**: Produce retail prices, dynamic bulk discount thresholds (25kg & 100kg tiers), delivery fee policies, and promotional coupons.
- **🏢 Bulk Procurement Rules**: Base quintal prices, 3-tier volume discounts, APMC Mandi Cess rates, and transit insurance fees.
- **🔐 Security & MFA Enforcement**: Mandate multi-factor authentication per role, configure lockout attempts, and enforce password complexity.
- **🌐 Global Broadcast & Emergency Kill-Switches**: Platform-wide announcement banners and Emergency Price Freezes for extreme market volatility.
- **📜 Parameter Audit Log & Factory Reset**: Complete change history with timestamped entries and one-click restoration to official government defaults.
- **KYC Verification Queue**: Document inspection desk for Farmer Aadhaar submissions and Corporate Mandi Licenses with side-by-side previews and one-click approve/reject workflows.
- **RBAC Roles & Permissions Matrix**: Dynamic privilege configuration across 4 platform tiers.

---

## ⚡ Super Admin Master Control Tower (Root Clearance)

The KishanSetu **Super Admin Master Control Tower** empowers system administrators (`Devon Vance`) with centralized, real-time authority over every operational parameter of the platform. Changes made in the Control Tower synchronize instantly to all active users without page reloads through the reactive `PlatformConfigService` engine.

```
                              ┌───────────────────────────────────────┐
                              │     ⚡ SUPER ADMIN CONTROL TOWER      │
                              │ (admin-dashboard / Level 5 Clearance) │
                              └───────────────────┬───────────────────┘
                                                  │
                                   platformConfigService.ts
                          (Reactive Pub/Sub + localStorage + CustomEvents)
                                                  │
             ┌───────────────────┬────────────────┴───────────────────┬───────────────────┐
             │                   │                                    │                   │
    ┌────────▼────────┐ ┌────────▼────────┐                  ┌────────▼────────┐ ┌────────▼────────┐
    │ 🌾 Farmer Hub   │ │ 🛒 Consumer     │                  │ 🏢 Bulk Buyer   │ │ 🔐 Security &   │
    │ - MSP Rates     │ │ - Retail Prices │                  │ - Base Quintal  │ │    Auth Gateway │
    │ - Mandi Prices  │ │ - Bulk Tiers    │                  │ - Volume Tiers  │ │ - MFA Policy    │
    │ - PM-KISAN Cap  │ │ - Delivery Fee  │                  │ - APMC Cess %   │ │ - Max Lockouts  │
    │ - AI Sahayak    │ │ - Promo Codes   │                  │ - Insurance %   │ │ - Password Rules│
    └─────────────────┘ └─────────────────┘                  └─────────────────┘ └─────────────────┘
                                                  │
                                      ┌───────────▼───────────┐
                                      │  🌐 Global Overrides  │
                                      │ - Emergency Freeze    │
                                      │ - Broadcast Banner    │
                                      │ - Maintenance Mode    │
                                      └───────────────────────┘
```

### Parameter Controls by Module

| Category | Controllable Parameters | Default Standard | Real-Time Consumer |
| :--- | :--- | :--- | :--- |
| **🌾 Farmer Hub** | MSP Rates (Wheat, Paddy, Mustard, Maize, Gram, Bajra)<br>Mandi Benchmark Prices (Potato, Onion, Tomato, etc.)<br>PM-KISAN annual cap & KCC credit ceiling<br>AI Sahayak temperature & system instruction | Wheat: ₹2,275/Q<br>Paddy: ₹2,183/Q<br>Mustard: ₹5,650/Q<br>PM-KISAN: ₹6,000/yr | Farmer MSP Calculator,<br>Mandi Benchmark Table,<br>Kisan AI Sahayak |
| **🛒 Consumer Store** | Retail produce prices per kg (Atta, Rice, Mustard Oil)<br>Bulk order discount tiers (Tier 1: 25kg, Tier 2: 100kg)<br>Free delivery threshold & express surcharge<br>Promo discount vouchers (e.g. `KISHAN10`, `FRESHFARM`) | Tier 1: 25kg @ 5%<br>Tier 2: 100kg @ 10%<br>Free Delivery: ≥₹499 | Consumer Store Catalog,<br>Cart Discount Engine,<br>Order Checkout |
| **🏢 Bulk Buyer** | Base mandi quintal rates<br>Volume tier discount matrix (50Q, 100Q, 250Q+)<br>APMC Mandi Cess percentage<br>Transit insurance surcharge | Cess: 1.5%<br>Insurance: 0.8%<br>Escrow Fee: 0.5% | B2B Procurement Table,<br>Volume Cost Calculator,<br>Order / Quote Modals |
| **🔐 Security Policy** | MFA mandate toggles per role (Farmer, Consumer, Buyer, Admin)<br>Max failed login attempts before lockout<br>Lockout duration in minutes<br>Password length & special character requirements | Buyer/Admin: Required<br>Max Failed: 4 attempts<br>Lockout: 15 mins | Login & MFA Gateways,<br>Password Evaluator,<br>Session Guardian |
| **🌐 Global System** | Emergency Price Freeze (APMC market panic lock)<br>Platform Broadcast Banner (text, visibility, severity)<br>Maintenance Mode with customizable alert | Freeze: Inactive<br>Banner: Active info<br>Severity: Info/Warning/Danger | Global Platform Header,<br>All 5 Active Portals |
| **📜 Audit Trail** | Timestamp, author, module category, parameter name, prior value, and updated value | Full chronological history | Admin Audit Drawer |

---

## ⚡ Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher (`v20.16.0` recommended)
- **npm**: v9.0.0 or higher (`10.8.1` recommended)

### 1. Installation
Clone the repository and install all dependencies in a single step from the root directory:
```bash
git clone <repository-url>
cd kishansetu
npm install
```

### 2. Environment Setup (Optional)
To enable real-time Gemini AI queries for the **Kisan Sahayak** assistant, create a `.env` file in the root directory:
```env
# Optional: If omitted, KishanSetu automatically runs on its rich built-in localized knowledge engine
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### 3. Run the Unified Platform
Launch the complete KishanSetu ecosystem with Vite middleware and the Express backend:
```bash
npm run dev
```
Open your browser and navigate to:
👉 **`http://localhost:3000`**

---

## 🏃 Standalone Module Execution

While the root application seamlessly runs the integrated platform, each module can still be run independently if isolated development is required:

| Module | Command | Port |
| :--- | :--- | :--- |
| **Unified KishanSetu Platform** | `npm run dev` | `http://localhost:3000` |
| **Farmer Agricultural Hub** | `npm run dev:farmer` | `http://localhost:3000` |
| **AgriDirect Consumer Store** | `npm run dev:consumer` | `http://localhost:3000` |
| **Bulk Buyer Wholesale Portal** | `npm run dev:bulk` | `http://localhost:3000` |
| **Admin Operations Console** | `npm run dev:admin` | `http://localhost:3000` |
| **User Login & Authentication** | `npm run dev:auth` | `http://localhost:3000` |

---

## 🔑 Demo Personas & Credentials

The platform comes pre-seeded with 4 verified persona accounts. You can sign in using credentials or switch instantly via the **Quick Persona Switcher** in the top navigation bar:

| Persona | Name | Role | Email | Password | Default 2FA |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 🌾 **Farmer** | Ramesh Patel | `farmer` | `ramesh.farmer@agriportal.in` | `FarmerHarvest#2025` | SMS Code |
| 🛒 **Consumer** | Priya Sharma | `consumer` | `priya.consumer@freshmart.in` | `ConsumerFresh#2025` | Email OTP |
| 🏢 **Bulk Buyer** | Vikram Singhania | `bulk_buyer` | `vikram.bulkbuyer@agritraders.com` | `BulkTrading#2025` | Email OTP |
| 🛡️ **Super Admin** | Devon Vance | `admin` | `admin.security@agriportal.gov` | `AgriAdmin#2025` | Authenticator |

*Note: In the demo environment, OTP codes can be viewed instantly in the "Virtual Security Inbox" drawer in the bottom right corner of the screen.*

## 🌓 Universal Light & Dark Mode Across All Pages

KishanSetu features a **seamless, universal theme engine** that allows any user to toggle between high-contrast **Light Mode** and sleek, modern **Dark Mode** on every page and module across the platform:

- **Global Theme Toggles**:
  - **Top Ecosystem Status Strip**: Quick pill button with Sun/Moon indicators beside the Persona Switcher.
  - **Main Navigation Header**: Dedicated Light/Dark switch button adjacent to user profile chip.
  - **Mobile Drawer Menu**: Full-width theme toggle for touch devices and small viewports.
  - **Module-Level Synchronizers**: Legacy module toggles (e.g., in Farmer Dashboard) sync bidirectionally with the platform root.
- **Cross-Module Color System**:
  - Automatically handles theme variants across all 5 modules via Tailwind CSS v4 `@custom-variant dark`.
  - Scoped overrides for Admin Master Console, Bulk Buyer B2B Procurement, and AgriDirect Consumer Store ensure 100% text contrast and legible cards in both modes without white-out or unreadable dark streaks.
  - Persisted in browser `localStorage` (`kishansetu_theme`) and reactive across tabs via `kishansetu_theme_changed` custom events.

---

## 🧪 Automated Verification & Test Suite

The platform includes a dedicated, end-to-end integration test suite verifying parameter tuning, subscriber reactivity, cross-module synchronization, audit logging, and factory resets:

```bash
# Run Super Admin parameter & reactivity test suite
npx tsx tests/platformConfig.test.ts

# Run static typecheck across all modules
npx tsc --noEmit

# Run production build
npm run build
```

---

## 📂 Project Directory Structure

```
kishansetu/
├── package.json                         # Unified platform dependencies and scripts
├── vite.config.ts                       # Vite 6 config with aliases for all 5 modules
├── tsconfig.json                        # TypeScript path mappings across modules
├── server.ts                            # Express backend with Gemini AI & Vite middleware
├── index.html                           # Main entry HTML with typography
├── README.md                            # Complete platform documentation
├── src/                                 # Unified Platform Orchestrator
│   ├── App.tsx                          # Master app with global navigation & role state
│   ├── main.tsx                         # Client bootstrap
│   └── index.css                        # Tailwind CSS v4 design system
│
├── farmer-dashboard/                    # Module 1: Agricultural Operations & AI
│   ├── server.ts                        # Module standalone server & AI backend
│   └── src/                             # Crop MSP, Mandi, KYC, Schemes & Kisan AI
│
├── agridirect-consumer-dashboard/       # Module 2: Farm-to-Table Marketplace
│   └── src/                             # Produce catalog, Cart calculations, Orders
│
├── bulk-buyer-dashboard/                # Module 3: B2B Wholesale Procurement
│   └── src/                             # Tiered pricing, Contracts pipeline, RFQs
│
├── admin-dashboard/                     # Module 4: Central Governance & SOC
│   └── src/                             # User management, KYC approval queue, RBAC
│
└── user-login-&-authentication/         # Module 5: Central Identity & Security Gateway
    └── src/                             # Role login, Password entropy, MFA, Audit logs
```

---

## 🛠️ Production Build

To bundle the client assets and compile the server for production deployment:

```bash
# 1. Build client bundle and bundle server with esbuild
npm run build

# 2. Start the production server
npm run start
```

---

## 📜 License

Distributed under the Apache 2.0 License. See `LICENSE` for more information.
