# HomeLink — Product Requirements Document (PRD)

**Project Name:** HomeLink  
**Product Version:** 2.0.0  
**Platform Scope:** Responsive Web Application (Mobile-First, Desktop-Optimized)  
**Target Market:** India (Delhi NCR, Bangalore, Mumbai, Hyderabad, Rewa, Pune, Indore)  
**Primary Proposition:** 100% Zero-Brokerage Verified Student & Bachelor Housing Platform with AI-Powered Photo Forensic Verification & Local Neighborhood Intelligence.

---

## 1. Executive Summary & Vision

Finding rental accommodation across Indian urban hubs and university towns is fraught with exorbitant brokerage fees (often 15 to 30 days of rent), misleading synthetic or stock room photos, lack of transparent lease terms, and zero visibility into immediate daily living essentials (such as walking distance to student tiffin messes, gyms, and barbers).

**HomeLink** is built to dismantle the traditional brokerage barrier. It connects students and bachelor tenants directly with verified homeowners and flatmates with **0% brokerage commission**, backed by cutting-edge Gemini AI photo forensic inspection and localized neighborhood intelligence.

---

## 2. Target Audience & User Personas

### 2.1 Persona 1: University Student (e.g., DU North Campus, APSU Rewa, Christ Bangalore)
- **Pain Points:** Strict budget constraints (₹3,000 – ₹8,000/mo), vulnerable to deceptive brokers, urgent need for nearby food/tiffin mess and study-friendly environments.
- **Goals:** Find affordable, verified single rooms or shared PGs within walking distance of campus; connect with culturally compatible roommates.

### 2.2 Persona 2: Young Working Professional / Bachelor (e.g., Koramangala Bangalore, Gachibowli Hyderabad)
- **Pain Points:** High security deposit demands, fake property photos posted online, lack of time to inspect multiple flats.
- **Goals:** Move-in ready 1 BHK or private room in shared flat, walking proximity to Cult.fit gyms, corporate cafeterias, and metro stations.

### 2.3 Persona 3: Verified Property Owner / Host
- **Pain Points:** High tenant turnover, unresponsive broker middlemen, difficulty finding reliable, verified students or professionals.
- **Goals:** List properties directly with verified photos, manage occupancy status with one click, and receive direct inquiries without middleman interference.

---

## 3. Core Problem Statements & Value Proposition

| Traditional Rental Experience | HomeLink Solution |
| :--- | :--- |
| **Brokerage Extortion:** 15–30 days rent charged by middlemen. | **100% Zero Brokerage:** Direct peer-to-peer owner-tenant connection. |
| **Fake & Synthetic Photos:** Midjourney/Blender 3D renders passed as real rooms. | **AI Photo Forensic Inspector:** Instant vision check grading optical authenticity (0–100%). |
| **Neighborhood Blindspots:** No info on daily food, haircuts, or fitness centers. | **Tenant Living Intelligence:** Built-in guides for walking-distance gyms, barbers, and tiffins. |
| **Tedious Roommate Hunt:** Random social media posts with no filter on habits. | **Lifestyle Roommate Match:** Filter by diet, smoking, sleep schedule, and budget. |

---

## 4. Key Functional Requirements (FR)

### FR1: Multi-City Property Search & Discovery
- Search across top tier-1 and student hubs: Delhi NCR, Bangalore, Mumbai, Hyderabad, Rewa, Pune, and Indore.
- Filters: Price range (₹2,000 – ₹50,000+), BHK type (1 RK, 1 BHK, 2 BHK, 3 BHK, PG), Furnishing status, Preferred tenants (Students, Bachelors, Families, Anyone).
- Sort options: Price Low to High, Price High to Low, Rating, Newest.

### FR2: Roommate Matching Directory
- Dedicated directory of individuals seeking co-living flatmates.
- User cards displaying occupation, age, budget, cleanliness habits, dietary preference (Veg / Non-Veg / Vegan), and bio.
- One-click WhatsApp / Direct phone connect.

### FR3: HomeLink AI Assistant (Chatbot)
- 24/7 interactive real estate & tenant living assistant.
- **Instant Intent Classification:** Sub-150ms greeting and capability orientation for queries like "hi", "hello", "namaste".
- **Domain Restriction:** Politeness boundary strictly enforced for rental housing, tenant guidance, and neighborhood amenities.
- **Dynamic Context Indicator:** Shows accurate status ("Analyzing photo authenticity", "Finding nearby stays", "Searching gyms & barbers").

### FR4: AI Room Photo Authenticity Forensic Inspector
- Multi-model forensic scan powered by Google Gemini Vision.
- Analyzes lighting, sensor noise, material textures, and synthetic diffusion artifacts.
- Returns clear verdict: `VERIFIED_REAL` vs `AI_GENERATED / 3D RENDER` with an authenticity score (0–100%) and bulleted optical proof points.

### FR5: GPS Live Location Auto-Detection
- Browser Geolocation API integration with reverse geocoding.
- Automatically detects user's locality and city.
- Filters immediate neighborhood stays and injects hyper-local amenity listings (gyms, barbers, tiffin services).

### FR6: Side-by-Side Property Comparison Matrix
- Compare up to 3 selected properties simultaneously.
- Compares monthly rent, security deposit, furnishing, sub-meter electricity rates, lock-in period, and amenities checklist.

### FR7: 4-Step Property Listing Wizard
- Step 1: Basic Information (Title, City, Locality, Rent, Deposit, BHK).
- Step 2: Property Specifications & Amenities (Furnishing, AC, WiFi, Water, Power Backup).
- Step 3: Photo Upload with Live Camera Capture & Real-time AI Authenticity Verification.
- Step 4: Contact & Verification Review with instant listing publication.

---

## 5. Non-Functional Requirements (NFR)

- **Performance:** Initial page load under 1.5s; client-side route transitions under 100ms; instant AI greeting response under 150ms.
- **Responsive Design:** Mobile-first layout (360px to 430px smartphone viewports) with seamless scaling to tablets and 4K desktop screens.
- **Reliability & Fallback:** 100% uptime with graceful offline domain engine fallback if external cloud AI APIs experience latency.
- **Brand Consistency:** Professional emerald, slate, and warm surface palette with clean typography (Outfit / Inter) and zero raw markdown code artifacts.

---

## 6. Release Roadmap & Milestones

1. **Phase 1 (MVP — Delivered):** Core rental discovery, roommate matchmaking, zero-brokerage direct connections, responsive design system.
2. **Phase 2 (AI Intelligence — Delivered):** Gemini AI Assistant, Forensic Photo Authenticity Inspector, GPS Auto-Detection, Dynamic Typing Indicators.
3. **Phase 3 (Owner Ecosystem — Delivered):** Multi-step property wizard, in-app camera capture modal, one-click listing status manager.
4. **Phase 4 (Future Expansion):** Online digital rental agreement generator, biometric tenant e-KYC, and automated rent escrow payments.
