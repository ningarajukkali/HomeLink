# 📚 HomeLink — Documentation Hub

Welcome to the **HomeLink Master Documentation Section**. This directory contains the complete product, design, architectural, schema, and implementation specifications for the HomeLink platform.

---

## 🗂️ Main Documents Directory

| Document | File Link | Focus Area |
| :--- | :--- | :--- |
| **Product Requirements Document (PRD)** | [PRODUCT_REQUIREMENTS_DOCUMENT.md](PRODUCT_REQUIREMENTS_DOCUMENT.md) | Vision, target audience, personas, core value propositions, functional & non-functional requirements. |
| **Technical Requirements Document (TRD)** | [TECHNICAL_REQUIREMENTS_DOCUMENT.md](TECHNICAL_REQUIREMENTS_DOCUMENT.md) | Architecture, frontend stack (React 19, Vite 8.3), AI pipeline, camera integration, and performance targets. |
| **App Flow & User Journeys** | [APP_FLOW_DOCUMENT.md](APP_FLOW_DOCUMENT.md) | Navigation route map, Mermaid flowcharts for tenants, roommates, hosts, and AI Assistant interactions. |
| **UI/UX Design Brief** | [UI_UX_DESIGN_BRIEF.md](UI_UX_DESIGN_BRIEF.md) | Design tokens, HSL palette (Emerald & Slate Navy), typography, clean formatting rules, micro-interactions. |
| **Backend Schema & API Specs** | [BACKEND_SCHEMA_DOCUMENT.md](BACKEND_SCHEMA_DOCUMENT.md) | Mongoose collection schemas (`User`, `Property`, `PhotoVerification`, `Roommate`), and REST API specifications. |
| **Technical Implementation Plan** | [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) | Phased engineering milestones, validation checklist, latency optimization benchmarks, and release readiness. |
| **Full Implementation Audit Report** | [IMPLEMENTATION_REPORT.md](IMPLEMENTATION_REPORT.md) | Complete codebase audit, monorepo refactoring summary, build metrics, and verification benchmarks. |

---

## 🏛️ System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                       HomeLink Client                       │
│     (React 19 + Vite + TailwindCSS v4 Design Tokens)        │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
       REST / JSON APIs                 WebRTC / GPS
               │                              │
┌──────────────▼──────────────┐  ┌────────────▼──────────────┐
│       HomeLink Backend      │  │   Device Sensor Streams   │
│  (Node.js / Express API)    │  │   - GPS Geolocation API   │
└──────────────┬──────────────┘  │   - In-App Camera Stream  │
               │                 └───────────────────────────┘
       Multi-Model AI Gateway
               │
┌──────────────▼──────────────────────────────────────────────┐
│               Google Gemini Vision & Text APIs              │
│   (gemini-2.5-flash-lite | gemini-3.6-flash | 2.5-flash)    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Architectural Pillars

1. **100% Zero-Brokerage Direct Model:** Eliminates broker commissions by connecting tenants directly with verified hosts.
2. **AI Forensic Anti-Fraud Shield:** Multi-model optical analysis detecting 3D renders, synthetic lighting, and Midjourney concepts with confidence scoring.
3. **Local Neighborhood Tenant Intelligence:** Sub-150ms instant greeting engine and local neighborhood guides (gyms, barbers, student tiffins).
4. **Live GPS Auto-Detection:** One-tap geolocation with reverse geocoding to identify immediate neighborhood stays and amenities.
5. **Side-by-Side Comparison:** 3-way rental comparison matrix across pricing, deposit, furnishing, sub-meter power, and amenities.
