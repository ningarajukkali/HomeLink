# HomeLink — Technical Requirements Document (TRD)

**Document Version:** 2.0.0  
**Application Architecture:** Single Page Application (SPA) with Decoupled REST AI & Data Services  
**Frontend Framework:** React 19 (ESModules)  
**Build Tool:** Vite 8.3 with Rolldown Engine  
**Styling Framework:** TailwindCSS v4 with Custom Design Tokens & Modern Vanilla CSS Transitions

---

## 1. System Architecture Overview

HomeLink is engineered as a high-performance, mobile-first Single Page Application (SPA). The frontend decouples data presentation and user interaction from external AI providers via a unified service abstraction layer.

```
┌─────────────────────────────────────────────────────────────┐
│                       HomeLink Client                       │
│  (React 19 SPA + Vite + TailwindCSS Design Tokens)          │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
       REST / JSON APIs                 WebRTC / GPS
               │                              │
┌──────────────▼──────────────┐  ┌────────────▼──────────────┐
│       HomeLink Backend      │  │  Client Device Sensors     │
│  (Node.js / Express API)    │  │  - GPS Geolocation API     │
└──────────────┬──────────────┘  │  - MediaDevices Camera     │
               │                 └───────────────────────────┘
       Multi-Model AI Gateway
               │
┌──────────────▼──────────────────────────────────────────────┐
│               Google Gemini Vision & Text APIs              │
│   (gemini-2.5-flash-lite | gemini-3.6-flash | 2.5-flash)    │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Technology Stack & Dependencies

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Runtime / Library** | React | 19.x | Modern UI composition with Hooks and Context |
| **Bundler / Dev Server** | Vite | 8.3.x | Sub-second HMR, optimized production bundling |
| **Icons & Typography** | Google Material Symbols & Fonts | Outfit, Inter | Consistent mobile-first visual aesthetics |
| **Styling Engine** | TailwindCSS + CSS Custom Properties | 4.x | Design tokens for colors, surfaces, shadows, radii |
| **HTTP Client** | Native Fetch API | ES6+ | Lightweight, zero-dependency async network calls |
| **Location Services** | W3C Geolocation API | HTML5 | Live GPS coordinate acquisition & reverse geocoding |
| **Media Stream** | W3C MediaDevices (getUserMedia) | HTML5 | Real-time in-app camera capture for room verification |

---

## 3. Directory Structure & Modular Organization

The frontend codebase is organized according to domain-driven modular standards:

```
frontend/
├── public/
│   ├── favicon.svg
│   └── site.webmanifest
├── src/
│   ├── assets/                 # Brand logos, illustrations, default avatars
│   ├── components/             # Reusable UI component modules
│   │   ├── ai/                 # AIAssistant, AISearchBar
│   │   ├── cards/              # PropertyCard, RoommateCard
│   │   ├── common/             # AvailabilityBadge, DemoBadge, CompareToast
│   │   ├── modals/             # AuthModal, CameraCaptureModal, AIPhotoAuditModal
│   │   ├── navigation/         # Header, BottomNav
│   │   └── index.js            # Master component barrel export
│   ├── context/
│   │   └── AppContext.jsx      # Global state provider (Auth, Cities, Listings, Compare)
│   ├── data/
│   │   └── seedData.js         # Offline fallback seed properties and roommates
│   ├── services/               # API clients and offline fallback logic
│   │   ├── aiAssistantService.js # Local heuristic engine for AI fallback
│   │   ├── api.js              # REST endpoints client
│   │   ├── locationService.js  # GPS detection & reverse geocoding
│   │   └── index.js            # Master service barrel export
│   ├── views/                  # Primary screen and route view controllers
│   │   ├── owner/              # OwnerDashboardView, ListPropertyWizardView
│   │   ├── rentals/            # RentalsView, RentalDetailView, CompareView
│   │   ├── roommates/          # RoommatesView, RoommateDetailView, RoommateRequestsView
│   │   ├── user/               # ProfileView, SavedView, NotificationsView, ChatView
│   │   ├── welcome/            # WelcomeView, SafetyView
│   │   └── index.js            # Master views barrel export
│   ├── App.jsx                 # Route manager & top-level UI orchestration
│   ├── index.css               # Core styling variables, animations, scrollbar styles
│   └── main.jsx                # Application DOM entry point
├── package.json
└── vite.config.js
```

---

## 4. State Management Specifications (`AppContext.jsx`)

Global application state is orchestrated using React Context with persistent `localStorage` synchronization:

- **Authentication State (`user`, `token`):** Current authenticated user session, role (`tenant` vs `host`), and demo switcher.
- **Properties State (`properties`, `featuredProperties`):** Filtered listings cache with availability toggles.
- **Roommates State (`roommates`, `requests`):** Lifestyle matching profiles and roommate connection requests.
- **Saved Favorites (`savedPropertyIds`, `savedRoommateIds`):** Bookmarked stays stored persistently across browser reloads.
- **Comparison Bucket (`compareList`, max 3 items):** Property comparison bucket with floating comparison bar.
- **City & GPS Filter (`selectedCity`, `userLocation`):** Active browsing city and GPS reverse-geocoded neighborhood coordinates.

---

## 5. AI Forensic Vision & Chat Integration Pipeline

### 5.1 Text Chat Pipeline
1. **Instant Greeting Interceptor:** Client or backend identifies pure greeting tokens (`hi`, `hello`, `namaste`) and returns within `< 150ms` without blocking on cloud LLMs.
2. **Multi-Model LLM Execution:**
   - Primary: `gemini-2.5-flash-lite` (latency: ~1.5s)
   - Secondary Failover: `gemini-3.6-flash`
   - Tertiary Failover: `gemini-2.5-flash`
   - Strict Timeout: `AbortSignal.timeout(4500)`
3. **Local Domain Knowledge Fallback:** If cloud APIs time out, the intelligent local neighborhood dictionary provides instant answers for gyms, barbers, and tiffin services.

### 5.2 Photo Forensic Verification Pipeline
1. Image is loaded from user file input or in-app live camera capture.
2. Compressed to high-fidelity JPEG data URL via canvas buffer.
3. Payload analyzed by Gemini Vision model with optical forensic prompt.
4. Structured JSON response parsed into verdict (`VERIFIED_REAL`, `AI_GENERATED`, or `SYNTHETIC_OR_CGI`), confidence (0.0 to 1.0), authenticity score (0 to 100), and specific physical reasons.

---

## 6. Build & Performance Targets

- **Production Build Execution:** `< 1000ms` using Rolldown/Vite.
- **Gzip Output:** Total JavaScript footprint `< 120kB` (excluding vendor React chunks).
- **Core Web Vitals:**
  - Largest Contentful Paint (LCP): `< 1.2s`
  - First Input Delay (FID): `< 50ms`
  - Cumulative Layout Shift (CLS): `< 0.05`
