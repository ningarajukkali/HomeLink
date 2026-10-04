# 🏠 HomeLink - Frontend & Product Documentation

> **100% Verified Housing • 0% Brokerage • AI Anti-Fraud Shield • Live GPS Auto-Detection**

HomeLink is a production-grade verified rental housing and flatmate matching application tailored for students and working bachelors across India (Delhi NCR, Bangalore, Mumbai, Hyderabad, Rewa, Pune, and Indore).

---

## 📚 Product & Engineering Documentation

Complete, production-grade product specifications and technical documentation:

| Document | Description |
| :--- | :--- |
| 📄 **[Product Requirements Document](PRODUCT_REQUIREMENTS_DOCUMENT.md)** | Product vision, target personas, problem statement, functional & non-functional requirements. |
| ⚙️ **[Technical Requirements Document](TECHNICAL_REQUIREMENTS_DOCUMENT.md)** | Architecture, tech stack (React 19, Vite, Tailwind CSS), AI integration pipeline & performance metrics. |
| 🗺️ **[App Flow Document](APP_FLOW_DOCUMENT.md)** | Route map, user journeys (Tenant, Roommate, Host, AI chat) and state machine diagrams. |
| 🎨 **[UI/UX Design Brief](UI_UX_DESIGN_BRIEF.md)** | Design tokens, HSL color palette, typography guidelines, micro-interactions, accessibility specs. |
| 🗄️ **[Backend Schema Document](BACKEND_SCHEMA_DOCUMENT.md)** | Database schemas (User, Property, Roommate, Verification), REST API contracts and data models. |
| 🚀 **[Implementation Plan](IMPLEMENTATION_PLAN.md)** | Phased engineering roadmap, delivery milestones, automated testing checklist & deployment plan. |
| 📊 **[Full Engineering Report](docs/IMPLEMENTATION_REPORT.md)** | Complete implementation audit, benchmarks, component breakdown, and migration details. |

---

## 🏛️ Frontend Codebase Structure

The frontend is built with **React 19 + Vite + TailwindCSS v4** and organized into clear, domain-driven modules:

```
frontend/
├── public/                            # Static web assets & manifest
├── src/
│   ├── assets/                        # Brand logos, avatars & icons
│   ├── components/                    # Reusable UI Component Modules
│   │   ├── ai/                        # AIAssistant, AISearchBar
│   │   ├── cards/                     # PropertyCard, RoommateCard
│   │   ├── modals/                    # CameraCaptureModal, AIPhotoAuditModal, AuthModal
│   │   ├── navigation/                # Header, BottomNav
│   │   ├── common/                    # Badges, Compare Toast, Floating Bar
│   │   └── index.js                   # Master components barrel export
│   ├── views/                         # Full-Page Domain Views
│   │   ├── welcome/                   # Onboarding & city selector
│   │   ├── rentals/                   # Rental discovery, details & comparison matrix
│   │   ├── roommates/                 # Flatmate matchmaking & requests
│   │   ├── owner/                     # Landlord listing wizard & dashboard
│   │   ├── user/                      # Tenant dashboard, saved & chat
│   │   └── index.js                   # Master views barrel export
│   ├── context/                       # Global state (Auth, GPS, Compare, Bookmarks)
│   ├── data/                          # Multi-city mock & fallback seed data
│   ├── services/                      # API clients, Geolocation, Local AI engine
│   ├── App.jsx                        # Root app layout & floating AI Assistant
│   ├── index.css                      # Tailwind CSS design system tokens
│   └── main.jsx                       # React 19 entry point
├── package.json                       # Dependencies & build scripts
└── vite.config.js                     # Vite build configuration
```

---

## ⚡ Quick Start Guide

### 1. Install Frontend Dependencies
```bash
npm --prefix frontend install
```

### 2. Launch Development Server
```bash
npm --prefix frontend run dev
```
The application will be live at `http://localhost:5173`.

### 3. Production Build
```bash
npm --prefix frontend run build
```

---

## 🔑 Key Features & Technologies

| Feature | Technology | Details |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + Vite | Ultra-fast client build (572ms) and Hot Module Replacement (HMR). |
| **Styling & Aesthetics** | Tailwind CSS v4 | Curated HSL color palette, dark mode accents, micro-animations, glassmorphism. |
| **AI Living Guide** | Gemini Flash + Heuristic Engine | Sub-150ms instant greeting, conversational living guide, nearby gym/barber distances. |
| **Photo Anti-Fraud Shield** | Gemini Vision | Forensic optical analysis detecting 3D renders, CGI, synthetic lighting, and Midjourney images. |
| **Live In-App Camera** | WebRTC getUserMedia | In-browser room photography capture with immediate real-time authenticity audit. |
| **Live GPS Auto-Detection** | Geolocation API | One-tap live GPS locating, reverse geocoding to neighborhood hubs, Haversine distance matrix. |
| **Zero Brokerage** | Direct Landlord Connection | Transparent pricing, direct owner phone numbers, zero commission. |

---

## 🛡️ License
Private & Proprietary — Developed for HomeLink Verified Rental Platform.
