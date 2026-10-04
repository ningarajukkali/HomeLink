# 🏠 HomeLink — Verified Student & Bachelor Housing Platform

> **100% Verified Housing • 0% Brokerage • AI Anti-Fraud Shield • Live GPS Auto-Detection**

HomeLink is a production-grade verified rental housing and flatmate matching monorepo tailored for students and working bachelors across India (Delhi NCR, Bangalore, Mumbai, Hyderabad, Rewa, Pune, and Indore).

---

## 📚 Complete Engineering & Product Documentation

Full product specifications, architectural designs, schemas, and user flows:

| Document | Description |
| :--- | :--- |
| 📚 **[Documentation Portal Hub](docs/README.md)** | Master index and architectural overview of all project documentation. |
| 📄 **[Product Requirements Document](docs/PRODUCT_REQUIREMENTS_DOCUMENT.md)** | Vision, target personas, problem statement, functional & non-functional requirements. |
| ⚙️ **[Technical Requirements Document](docs/TECHNICAL_REQUIREMENTS_DOCUMENT.md)** | Architecture, tech stack (React 19, Vite, Express, MongoDB), AI pipeline & performance metrics. |
| 🗺️ **[App Flow Document](docs/APP_FLOW_DOCUMENT.md)** | Route map, user journeys (Tenant, Roommate, Host, AI chat) and state machine diagrams. |
| 🎨 **[UI/UX Design Brief](docs/UI_UX_DESIGN_BRIEF.md)** | Design tokens, HSL color palette, typography guidelines, micro-interactions, accessibility specs. |
| 🗄️ **[Backend Schema Document](docs/BACKEND_SCHEMA_DOCUMENT.md)** | Database schemas (User, Property, Roommate, Verification), REST API contracts and data models. |
| 🚀 **[Implementation Plan](docs/IMPLEMENTATION_PLAN.md)** | Phased engineering roadmap, delivery milestones, automated testing checklist & deployment plan. |
| 📊 **[Full Engineering Report](docs/IMPLEMENTATION_REPORT.md)** | Complete implementation audit, benchmarks, component breakdown, and migration details. |

---

## 🏛️ Monorepo Codebase Structure

```
HomeLink/
├── frontend/                          # React 19 + Vite + TailwindCSS v4 Client
│   ├── public/                        # Static web assets & manifest
│   ├── src/
│   │   ├── components/                # Modular UI Components (ai, cards, modals, navigation, common)
│   │   ├── views/                     # Domain Views (rentals, roommates, owner, user, welcome)
│   │   ├── context/                   # Global state (Auth, GPS, Compare, Bookmarks)
│   │   ├── data/                      # Multi-city mock & seed data
│   │   ├── services/                  # API, Geolocation, Heuristics, Local AI engine
│   │   ├── App.jsx                    # Root app layout & AI Assistant
│   │   ├── index.css                  # Tailwind CSS design system tokens
│   │   └── main.jsx                   # React 19 entry point
│   ├── .env.example                   # Full Frontend Environment Variables Guide
│   ├── vercel.json                    # Vercel SPA Routing Configuration
│   ├── package.json                   # Frontend dependencies & scripts
│   └── vite.config.js                 # Vite bundler config with API proxy
│
├── backend/                           # Node.js + Express + MongoDB REST API Server
│   ├── src/
│   │   ├── config/                    # Database connection (MongoDB Atlas)
│   │   ├── controllers/               # AI Controller (Gemini Flash), Auth, Properties, Roommates
│   │   ├── models/                    # Mongoose Data Schemas (User, Property, Roommate)
│   │   ├── routes/                    # REST API Endpoints (/api/ai, /api/auth, /api/properties)
│   │   ├── middleware/                # Auth, Error handling & 404 middlewares
│   │   ├── data/                      # Seed data for initial database population
│   │   └── server.js                  # Express API Server Entry Point
│   ├── .env.example                   # Backend Environment Variables Template
│   ├── package.json                   # Backend dependencies & scripts
│   └── package-lock.json
│
├── docs/                              # Main Documentation Portal & Technical Specs
│   ├── README.md
│   ├── PRODUCT_REQUIREMENTS_DOCUMENT.md
│   ├── TECHNICAL_REQUIREMENTS_DOCUMENT.md
│   ├── APP_FLOW_DOCUMENT.md
│   ├── UI_UX_DESIGN_BRIEF.md
│   ├── BACKEND_SCHEMA_DOCUMENT.md
│   ├── IMPLEMENTATION_PLAN.md
│   └── IMPLEMENTATION_REPORT.md
│
├── .gitignore                         # Git exclusion rules (node_modules, .env, dist)
├── package.json                       # Monorepo root runner scripts
└── README.md                          # Master documentation portal
```

---

## ⚡ Quick Start Guide

### 1. Install All Dependencies
```bash
npm run install:all
```

### 2. Configure Environment Variables
- **Frontend:** Copy `frontend/.env.example` to `frontend/.env`
- **Backend:** Copy `backend/.env.example` to `backend/.env` and add your MongoDB URI & Google Gemini API Key

### 3. Run Development Servers
- **Run Frontend (Vite):**
  ```bash
  npm run dev
  # Live at: http://localhost:5173
  ```
- **Run Backend (Express API):**
  ```bash
  npm run dev:backend
  # Live at: http://localhost:5000/api
  ```

### 4. Build for Production
```bash
npm run build
```

---

## 🔑 Key Features & Technologies

| Feature | Technology | Details |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + Vite | Ultra-fast client build (572ms) and Hot Module Replacement (HMR). |
| **Backend Framework** | Node.js + Express | High-throughput REST API with rate-limiting, CORS, and modular routes. |
| **Database** | MongoDB Atlas + Mongoose | Cloud document database with offline seed fallback. |
| **AI Living Guide** | Gemini 3.6 / 2.5 Flash | Sub-150ms greeting engine, neighborhood guides for gyms, barbers, tiffins. |
| **Photo Anti-Fraud Shield** | Gemini Vision | Forensic optical analysis detecting 3D renders, CGI, synthetic lighting, and Midjourney images. |
| **Live In-App Camera** | WebRTC getUserMedia | In-browser room photography capture with immediate real-time authenticity audit. |
| **Live GPS Auto-Detection** | Geolocation API | One-tap live GPS locating, reverse geocoding to neighborhood hubs, Haversine distance matrix. |
| **Zero Brokerage** | Direct Landlord Connection | Transparent pricing, direct owner phone numbers, zero commission. |

---

## 🛡️ License
Private & Proprietary — Developed for HomeLink Verified Rental Platform.
