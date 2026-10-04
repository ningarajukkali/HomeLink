# HomeLink — Backend Schema & API Specification Document

**Document Version:** 2.0.0  
**Database Paradigm:** MongoDB (Document-Oriented NoSQL) with Mongoose ODM  
**Data Interchange:** RESTful JSON APIs with JWT Authentication

---

## 1. Entity Relationship & Data Model Architecture

The data architecture is structured around four primary collections and embedded subdocuments:

```
┌─────────────────┐       1:N       ┌─────────────────────┐
│      User       ├─────────────────►      Property       │
│  (Tenant/Host)  │                 │ (Listings & Rooms)  │
└────────┬────────┘                 └──────────┬──────────┘
         │ 1:1                                 │ 1:N
         ▼                                     ▼
┌─────────────────┐                 ┌─────────────────────┐
│    Roommate     │                 │   PhotoVerification │
│(Profile/Seeker) │                 │  (Forensic Scores)  │
└─────────────────┘                 └─────────────────────┘
```

---

## 2. Core Mongoose Schemas

### 2.1 User Collection (`User.js`)

```javascript
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  phone: { type: String, required: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { 
    type: String, 
    enum: ['tenant', 'owner', 'admin'], 
    default: 'tenant' 
  },
  avatar: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  city: { type: String, default: 'Delhi NCR' },
  savedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  savedRoommates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Roommate' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

---

### 2.2 Property Collection (`Property.js`)

```javascript
const PhotoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  isReal: { type: Boolean, default: true },
  isAiGenerated: { type: Boolean, default: false },
  isRenderOrCgi: { type: Boolean, default: false },
  authenticityScore: { type: Number, min: 0, max: 100, default: 85 },
  verdict: { 
    type: String, 
    enum: ['VERIFIED_REAL', 'AI_GENERATED', 'SYNTHETIC_OR_CGI', 'UNVERIFIED_SCAN'], 
    default: 'VERIFIED_REAL' 
  },
  badgeText: { type: String, default: 'Verified Real Photo' },
  badgeColor: { type: String, enum: ['emerald', 'rose', 'amber'], default: 'emerald' },
  reasons: [{ type: String }],
  verifiedAt: { type: Date, default: Date.now }
});

const PropertySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, index: true },
  description: { type: String, required: true },
  rent: { type: Number, required: true, min: 500, index: true },
  securityDeposit: { type: Number, required: true, default: 0 },
  propertyType: { 
    type: String, 
    enum: ['Single Room', '1 RK', '1 BHK', '2 BHK', '3 BHK', 'PG / Co-Living'], 
    required: true,
    index: true
  },
  furnished: { 
    type: String, 
    enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'], 
    default: 'Furnished' 
  },
  locality: { type: String, required: true, index: true },
  city: { type: String, required: true, index: true },
  state: { type: String, default: '' },
  coordinates: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 }
  },
  amenities: [{ 
    type: String,
    enum: [
      'WiFi', 'Air Conditioner', 'Power Backup', 'Sub-meter Electricity',
      'Geyser', 'RO Water', 'Refrigerator', 'Washing Machine', 'Attached Balcony',
      'Attached Washroom', '24/7 Security / CCTV', 'Bike Parking', 'Car Parking'
    ]
  }],
  preferredTenant: { 
    type: String, 
    enum: ['Students Only', 'Bachelors Only', 'Family Only', 'Anyone (All Welcome)'], 
    default: 'Anyone (All Welcome)' 
  },
  photos: [PhotoSchema],
  owner: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    isVerified: { type: Boolean, default: true }
  },
  availabilityStatus: { 
    type: String, 
    enum: ['available', 'rented', 'under_maintenance'], 
    default: 'available',
    index: true
  },
  viewsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
```

---

### 2.3 Roommate Profile Collection (`Roommate.js`)

```javascript
const RoommateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  age: { type: Number, required: true, min: 16, max: 99 },
  gender: { type: String, enum: ['Male', 'Female', 'Non-Binary'], required: true },
  occupation: { type: String, required: true }, // e.g. "Software Engineer @ Swiggy", "Student @ DU"
  city: { type: String, required: true, index: true },
  location: { type: String, required: true }, // Preferred locality
  budget: { type: String, required: true }, // e.g. "₹6,000 - ₹8,000/mo"
  lookingFor: { type: String, required: true }, // e.g. "Private Room in 2 BHK"
  lifestyle: {
    diet: { type: String, enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Eggetarian'], default: 'Vegetarian' },
    smoking: { type: Boolean, default: false },
    drinking: { type: Boolean, default: false },
    pets: { type: Boolean, default: false },
    sleepSchedule: { type: String, enum: ['Early Bird', 'Night Owl', 'Flexible'], default: 'Flexible' }
  },
  bio: { type: String, default: '' },
  avatar: { type: String, default: '' },
  phone: { type: String, required: true },
  isVerified: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
```

---

## 3. REST API Endpoint Specifications

### 3.1 Authentication Endpoints (`/api/auth`)
- `POST /api/auth/register` — Create new user account with hashed password.
- `POST /api/auth/login` — Authenticate and issue JWT bearer token.
- `GET /api/auth/me` — Fetch currently authenticated user profile.
- `POST /api/auth/logout` — Invalidate session cookies / client tokens.

### 3.2 Property Endpoints (`/api/properties`)
- `GET /api/properties/search` — Search properties with filters (`city`, `locality`, `minRent`, `maxRent`, `type`, `furnished`).
- `GET /api/properties/:id` — Retrieve full property details with owner info.
- `POST /api/properties` — Create new property listing (Authenticated).
- `PUT /api/properties/:id/toggle-rented` — Toggle availability between `available` and `rented`.
- `DELETE /api/properties/:id` — Delete a property listing.

### 3.3 Roommate Matchmaking Endpoints (`/api/roommates`)
- `GET /api/roommates/search` — Query roommate seekers filtered by city, budget, and lifestyle.
- `GET /api/roommates/:id` — View full roommate profile.
- `POST /api/roommates` — Create or update roommate seeker profile.

### 3.4 AI Assistant & Vision Endpoints (`/api/ai`)
- `POST /api/ai/chat`
  - **Payload:** `{ message: string, image?: string, history?: array, city?: string, context?: object }`
  - **Instant Route:** Pure greetings (`hi`, `hello`) return `< 150ms` with structured living guide.
  - **Gemini Route:** Complex queries routed to `gemini-2.5-flash-lite` with 4.5s timeout.
- `POST /api/ai/verify-photo`
  - **Payload:** `{ image: string (base64 data URL), propertyTitle?: string }`
  - **Response:** `{ isReal: bool, isAiGenerated: bool, authenticityScore: int, verdict: string, reasons: string[] }`
- `GET /api/health` — Microservice uptime and database connection status.
