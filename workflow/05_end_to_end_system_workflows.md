# 🔄 KishanSetu - End-to-End System & User Workflows

This document maps out the end-to-end operational workflows for each user role, detailing exact interactions, state mutations, and reactive event flows across the **KishanSetu** ecosystem.

---

## 🌾 Workflow 1: Farmer Agricultural Operations & KYC Verification

```mermaid
sequenceDiagram
    autonumber
    actor Farmer as Farmer (Ramesh Patel)
    participant UI as Farmer Agricultural Hub
    participant KYCModal as FarmerVerificationModal
    participant AdminQueue as Admin Verification Desk
    actor Admin as Super Admin (Devon Vance)
    participant CloudDB as Supabase / Local Database

    Note over Farmer,UI: 1. Calculating MSP Harvest Returns
    Farmer->>UI: Enters harvest quantity: 50 Quintals of Wheat
    UI->>UI: GrainRatesPanel calculates: 50 × ₹2,275 = ₹1,13,750
    UI-->>Farmer: Displays breakdown & revenue projection

    Note over Farmer,KYCModal: 2. Submitting Aadhaar KYC for Official Kisan ID
    Farmer->>UI: Clicks "Upload Aadhaar & Farm Records"
    UI->>KYCModal: Opens submission form
    Farmer->>KYCModal: Enters Masked Aadhaar (XXXX-XXXX-8921), Land Acreage (4.5 Acres), Village (Rampur)
    Farmer->>KYCModal: Uploads digitized Land Jamabandi Record
    KYCModal->>CloudDB: INSERT INTO public.farmer_verifications (status = 'PENDING')
    CloudDB-->>KYCModal: Verification record created
    KYCModal-->>UI: Banner updates to "KYC UNDER REVIEW"

    Note over AdminQueue,Admin: 3. Administrative Inspection & Approval
    Admin->>AdminQueue: Opens Verification Queue in Admin Console
    AdminQueue->>CloudDB: SELECT * FROM farmer_verifications WHERE status = 'PENDING'
    AdminQueue-->>Admin: Displays Ramesh Patel's document side-by-side
    Admin->>AdminQueue: Clicks "Approve & Certify"
    AdminQueue->>CloudDB: UPDATE farmer_verifications SET status = 'VERIFIED', kisan_id = 'KS-UP-VNS-2026-0892'
    CloudDB-->>UI: Farmer status updates to "VERIFIED KISAN"
    UI-->>Farmer: Displays official green verified badge and certified Kisan ID
```

---

## ⚡ Workflow 2: Super Admin Real-Time Hot-Reloading Parameter Override

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Super Admin (Devon Vance)
    participant Tower as SuperAdminControlPanel
    participant ConfigService as platformConfigService
    participant EventBus as window CustomEvent ('kishansetu_config_changed')
    participant FarmerUI as Farmer Hub (GrainRatesPanel)
    participant StoreUI as Consumer Store (BrowseProducePanel)
    participant BulkUI as Bulk Buyer Desk (PricingSimulator)

    Admin->>Tower: Navigates to Admin Master Control Tower
    Admin->>Tower: Updates Wheat MSP: ₹2,275 -> ₹2,350 / Quintal
    Admin->>Tower: Updates Tier 1 Bulk Discount: 8% -> 10%
    Admin->>Tower: Toggles "Emergency Price Freeze" ON
    Tower->>ConfigService: updateFarmerMSP('wheat', 2350, 'Devon Vance')
    ConfigService->>ConfigService: Persist to localStorage & record audit trail
    ConfigService->>EventBus: dispatchEvent('kishansetu_config_changed')

    par Instant Cross-Module Reactive Re-renders
        EventBus-->>FarmerUI: Subscriber notified
        FarmerUI->>FarmerUI: Recomputes gross grain totals using ₹2,350/Q
        EventBus-->>StoreUI: Subscriber notified
        StoreUI->>StoreUI: Applies new 10% volume discount to shopping cart
        EventBus-->>BulkUI: Subscriber notified
        BulkUI->>BulkUI: Locks spot price sliders due to Emergency Freeze
    end

    Note over FarmerUI,BulkUI: All 5 modules reflect changes instantaneously without a page reload!
```

---

## 🛒 Workflow 3: Consumer Direct Farm-to-Table Ordering & Bulk Discount

```mermaid
sequenceDiagram
    autonumber
    actor Consumer as Consumer (Priya Sharma)
    participant Store as Consumer Store (BrowseProducePanel)
    participant Cart as Cart & Discount Calculation Engine
    participant Checkout as CheckoutModal
    participant DB as Orders Database
    participant Receipt as ReceiptModal

    Consumer->>Store: Adds 20 kg Organic Sharbati Wheat Flour (₹42/kg = ₹840)
    Consumer->>Store: Adds 10 kg Basmati Rice (₹85/kg = ₹850)
    Store->>Cart: Total Weight = 30 kg (Exceeds Tier 1 Threshold of 25 kg)
    Cart->>Cart: Automatically applies 8% Volume Savings (-₹135.20)
    Cart->>Cart: Subtotal > ₹499 -> Delivery Fee waived (₹0 Free Delivery)
    Consumer->>Store: Applies Promo Code "KISHAN10"
    Cart->>Cart: Additional 10% promotional coupon applied (-₹155.48)
    Store-->>Consumer: Cart Summary: ₹1,399.32 (Total Savings: ₹290.68)

    Consumer->>Checkout: Clicks "Proceed to Checkout"
    Consumer->>Checkout: Enters delivery address (Hazratganj, Lucknow) & selects UPI Payment
    Checkout->>DB: INSERT INTO public.orders (order_number: "KS-ORD-882190", payment: "PAID")
    DB-->>Checkout: Order confirmation ID generated
    Checkout->>Receipt: Opens Downloadable Tax Invoice
    Receipt-->>Consumer: Generates printable official GST receipt with farm origin timestamps
```

---

## 🏢 Workflow 4: B2B Wholesale Institutional Procurement Contract

```mermaid
sequenceDiagram
    autonumber
    actor Buyer as Institutional Buyer (Vikram Singhania)
    participant Portal as Bulk Buyer Wholesale Portal
    participant Simulator as Procurement Budget Simulator
    participant ContractEngine as Contract Pipeline
    participant DB as Contracts Table

    Buyer->>Portal: Selects Commodity: Premium Durum Wheat (Base: ₹2,400/Q)
    Buyer->>Simulator: Inputs procurement volume: 200 Quintals (20 Metric Tons)
    Simulator->>Simulator: Volume Tier 2 Applied (100–250 Q): 6% Volume Discount (-₹28,800)
    Simulator->>Simulator: Computes APMC Mandi Cess (1.5%): +₹6,768
    Simulator->>Simulator: Computes Transit Freight Insurance (0.8%): +₹3,609.60
    Simulator->>Simulator: Computes Platform Escrow Lock (0.5%): +₹2,256
    Simulator-->>Buyer: Net Total Payable: ₹4,63,833.60

    Buyer->>Portal: Clicks "Execute Procurement Agreement"
    Portal->>ContractEngine: Generates legal contract agreement with APMC Mandi terms
    ContractEngine->>DB: INSERT INTO public.contracts (status: "ACTIVE", contract_code: "KS-B2B-2026-0042")
    DB-->>ContractEngine: Agreement sealed
    ContractEngine-->>Buyer: Pipeline tracking activated: PO Generated -> Escrow Locked -> Mandi Gate Delivery
```

---

## 🤖 Workflow 5: Multilingual Voice Assistant & Real-Time Navigation

```mermaid
sequenceDiagram
    autonumber
    actor Farmer as Farmer (Speaking in Punjabi / Hindi)
    participant Audio as Device Microphone (Web Speech API)
    participant VoiceService as voiceAssistantService
    participant Server as server.ts (/api/ai/voice-command)
    participant Platform as PlatformShell (App.tsx)
    participant Speaker as Device Speaker (TTS)

    Farmer->>Audio: Speaks: "ਕਿਸਾਨ ਹਬ ਖੋਲ੍ਹੋ" (Open Farmer Hub)
    Audio->>VoiceService: Final text captured (lang: 'pa-IN')
    VoiceService->>Server: POST /api/ai/voice-command { transcript: "ਕਿਸਾਨ ਹਬ ਖੋਲ੍ਹੋ", language: "pa" }
    Server->>Server: parseLocalizedVoiceCommand matches target: 'farmer'
    Server-->>VoiceService: { action: 'NAVIGATE_MODULE', target: 'farmer', speechReply: 'ਕਿਸਾਨ ਹਬ ਖੋਲ੍ਹਿਆ ਜਾ ਰਿਹਾ ਹੈ।' }

    VoiceService->>Platform: onNavigateModule('farmer')
    Platform->>Platform: Switches activeModule to 'farmer'
    VoiceService->>Speaker: SpeechSynthesisUtterance plays native Punjabi audio reply
    Speaker-->>Farmer: Speaks: "ਕਿਸਾਨ ਹਬ ਖੋਲ੍ਹਿਆ ਜਾ ਰਿਹਾ ਹੈ।"
    Platform-->>Farmer: Farmer Agricultural Hub is displayed on screen
```
