# HomeLink — App Flow & User Journey Document

**Document Version:** 2.0.0  
**Scope:** Navigation Routes, User Decision Trees & Interaction State Transitions

---

## 1. Top-Level Route Map

The HomeLink application features a single-page state-driven routing system managed via `AppContext`:

| Route Identifier | View Component | Primary Purpose |
| :--- | :--- | :--- |
| `welcome` | `WelcomeView` | Platform onboarding, value proposition, quick city selector, 0% brokerage highlight. |
| `rentals` | `RentalsView` | Searchable listing directory with filters, sorting, and map/list view toggles. |
| `rental-detail` | `RentalDetailView` | Full property specs, photo gallery, owner verification badge, AI photo inspection, direct contact. |
| `roommates` | `RoommatesView` | Co-living roommate seeker cards with lifestyle filters (diet, smoking, budget). |
| `roommate-detail` | `RoommateDetailView`| Detailed profile of potential flatmate with bio and contact options. |
| `compare` | `CompareView` | Side-by-side comparison matrix for up to 3 shortlisted properties. |
| `add-property` | `ListPropertyWizardView`| 4-step wizard for hosts to publish properties with live camera capture & AI photo check. |
| `owner-dashboard` | `OwnerDashboardView` | Host property management, status toggles (Available / Rented), inquiry tracking. |
| `saved` | `SavedView` | User's bookmarked properties and favorite roommate profiles. |
| `profile` | `ProfileView` | User account settings, role switching (Tenant / Host demo modes), and safety guidelines. |

---

## 2. Primary User Journey Flows

### 2.1 Tenant Room Discovery Journey

```mermaid
flowchart TD
    A[Launch HomeLink] --> B[Welcome Screen or Direct Rentals]
    B --> C[Select City or Auto-Detect GPS Location]
    C --> D[Filter by Budget, BHK & Furnishing]
    D --> E[Browse Verified Property Cards]
    E --> F{User Action}
    F -->|Click Card| G[Open Rental Detail View]
    F -->|Tap Compare Icon| H[Add to Comparison Bucket max 3]
    F -->|Tap Heart Icon| I[Save to Bookmarks]
    G --> J[Inspect Photos & Tap 'Scan with AI']
    J --> K{AI Photo Verdict}
    K -->|Real Camera Photo| L[Proceed with Confidence]
    K -->|AI/3D Render Flagged| M[Display Warning Badge & Proof]
    L --> N[Contact Verified Owner via Call / WhatsApp]
    H --> O[Open Floating Compare Bar -> Compare View]
```

---

### 2.2 Roommate Matchmaking Journey

```mermaid
flowchart TD
    A[Navigate to 'Roommates' Tab] --> B[View Roommate Seeker Cards]
    B --> C[Filter by Diet Veg/Non-Veg, Budget, & Gender]
    C --> D[Open Roommate Detail View]
    D --> E[Review Compatibility: Work, Sleep Habits, Cleanliness]
    E --> F{Initiate Contact}
    F -->|Direct Message| G[Send In-App Chat Request]
    F -->|Phone / WhatsApp| H[Connect Directly with 0% Brokerage]
```

---

### 2.3 Property Owner Listing Wizard Flow

```mermaid
flowchart TD
    A[Click 'List Property' / 'Add Room'] --> B[Step 1: Basic Information]
    B -->|Title, Locality, City, Rent, Deposit| C[Step 2: Amenities & Specs]
    C -->|BHK, Furnishing, Power Backup, AC, WiFi| D[Step 3: Photos & Verification]
    D --> E{Photo Source}
    E -->|Upload Image| F[Select File from Device]
    E -->|Live Camera Capture| G[Open In-App WebRTC Camera Modal]
    G --> H[Capture Real-Time Room Photo]
    F --> I[Automatic AI Photo Authenticity Scan]
    G --> I
    I --> J{Authenticity Result}
    J -->|Pass: Real Photo| K[Green Verified Badge Applied]
    J -->|Fail: AI Render Flagged| L[Warning: Suggest Real Camera Photo]
    K --> M[Step 4: Contact & Review]
    L --> M
    M --> N[Publish Listing to Live Directory]
```

---

### 2.4 AI Assistant & Neighborhood Living Interaction

```mermaid
flowchart TD
    A[Click Floating AI Assistant Button] --> B[Open AI Chat Drawer]
    B --> C{User Input}
    C -->|Types 'hi' / 'hello' / 'namaste'| D[Instant Greeting Engine < 150ms]
    C -->|Clicks 'Auto-Detect Location'| E[Query Geolocation API -> Fetch Local Gyms, Barbers & Tiffins]
    C -->|Attaches Room Photo| F[Run Optical Forensic Scan with Gemini Vision]
    C -->|Asks Complex Query| G[Query Gemini LLM with 4.5s Timeout]
    G -->|Success| H[Display Formatted Response with Clean Emojis & Bullets]
    G -->|Timeout / Fail| I[Graceful Fallback to Local Knowledge Engine]
    D --> J[Display Suggested Quick Action Chips]
    E --> J
    H --> J
    I --> J
    J -->|Tap Chip| C
```

---

## 3. Modal & Overlay State Machine

- **AuthModal (`authMode`: 'login' | 'signup' | 'forgot'):** Handles credential entry, social login demos, and password recovery.
- **AIPhotoAuditModal (`auditImage`, `auditResult`):** Full-screen optical audit report showing authenticity score, sensor noise analysis, and verdict badge.
- **CameraCaptureModal (`isOpen`, `onCapture`):** Full-screen camera viewfinder with camera switcher (front/rear), flash indicator, and capture snapshot canvas.
- **MarkAsRentedModal (`propertyId`):** Allows hosts to toggle occupied status to prevent unwanted inquiries.
- **CompareToast / FloatingCompareBar:** Persistent dock when 1 to 3 properties are selected for comparison.
