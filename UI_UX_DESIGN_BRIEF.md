# HomeLink — UI/UX Design Brief

**Document Version:** 2.0.0  
**Design Paradigm:** Modern Emerald Glassmorphism & High-Legibility Mobile-First System  
**Design Tokens Engine:** TailwindCSS v4 with CSS Custom Properties  
**Target Viewports:** 360px – 430px (Mobile Core), 768px (Tablet), 1024px – 1920px (Desktop Fullscreen)

---

## 1. Design Vision & Emotional Resonance

Renting a home in India is traditionally stressful, clouded by mistrust, high-pressure broker sales tactics, and ambiguous listings.

**HomeLink’s UI/UX is built to evoke:**
1. **Unconditional Trust:** Instant visual verification badges, real optical photo confidence metrics, and clear 0% brokerage guarantees.
2. **Effortless Clarity:** Clean card grids, digestible price per month badges, and zero raw markdown code symbols (eliminating `###`, `* `, and code-like formatting).
3. **Hyper-Local Warmth:** Friendly Indian context, Rupee (₹) formatting, neighborhood amenity discovery (gyms, barbers, tiffin), and conversational greeting tones.

---

## 2. Color System & Semantic Tokens

The color palette is built using tailored HSL values configured in CSS variables:

| Semantic Token | HSL / Hex Code | Role in Application |
| :--- | :--- | :--- |
| **Primary (Emerald Brand)** | `hsl(158, 64%, 42%)` / `#26a672` | Brand identity, primary CTAs, 0% brokerage badges, verified photo tags. |
| **Primary Container** | `hsl(158, 50%, 93%)` / `#e2f7ee` | Soft badge backgrounds, selected pill filters, active tab indicators. |
| **Secondary (Slate Navy)** | `hsl(215, 25%, 27%)` / `#344458` | Headers, sticky app bar titles, high-emphasis text, contrast cards. |
| **Surface Lowest** | `hsl(0, 0%, 100%)` / `#ffffff` | Elevated cards, modal dialogs, chat bubbles, bottom navigation bar. |
| **Surface Container** | `hsl(210, 20%, 98%)` / `#f8fafc` | Main screen background canvas, neutral filter chips, input wells. |
| **Surface High** | `hsl(210, 16%, 93%)` / `#eaeff4` | Card dividers, hover backgrounds, inactive tab wells. |
| **Accent (Warm Amber)** | `hsl(38, 92%, 50%)` / `#f59e0b` | Star ratings, unverified scan indicators, pending approval warnings. |
| **Danger / Flag (Rose)** | `hsl(354, 70%, 54%)` / `#e13b48` | AI-generated photo alert badges, price drop tags, deletion prompts. |

---

## 3. Typography & Text Presentation Standards

- **Primary Headings Font:** `Outfit`, sans-serif (Geometric, welcoming, authoritative).
- **Body & Numeric Font:** `Inter`, sans-serif (High legibility at micro scales for prices, amenities, and lease details).

### Strict Content Formatting Rules for AI & System Text:
- **No Raw Markdown Code Words:** The system strictly filters out markdown hashtags (`###`, `##`, `#`) and raw asterisks (`* `) before displaying responses.
- **Emoji Headers:** Sections use crisp contextual emojis (e.g., 📍 *Delhi NCR*, 🏋️ *Top Gyms*, 💈 *Barbers & Salons*, 🍲 *Homely Tiffin*).
- **Clean Bullet Dots:** Listing items use bullet dots (`• `) with indented descriptions.

---

## 4. Key UI Components & Layout Specs

### 4.1 Mobile-First Header & Navigation
- **Top App Bar:** Sticky header with HomeLink brand logo, dynamic city dropdown, live GPS auto-detect trigger, and notification bell.
- **Bottom Navigation Dock:** Fixed bottom navigation for primary tabs:
  - 🏠 **Rentals** (Discover rooms & flats)
  - 👥 **Roommates** (Co-living matching)
  - ➕ **List Room** (Host wizard)
  - ⚖️ **Compare** (Dynamic badge showing 0 to 3 items)
  - 👤 **Profile** (Account, settings & tenant safety)

### 4.2 Property Card Specification
- **Media Header:** 16:9 aspect ratio image with lazy loading, gradient scrim, price tag pill (`₹X,XXX/mo`), and verified photo authenticity badge (`Verified Real` or `AI Scan`).
- **Card Body:** Property title, locality + city, BHK type, furnished status, preferred tenant type, and walking distance indicators.
- **Card Actions:** Quick WhatsApp connect button, heart bookmark toggle, and compare check icon.

### 4.3 AI Assistant Floating Hub
- Persistent floating button in bottom-right with animated pulse glow.
- Slides out as an expansive bottom drawer on mobile and a sleek floating widget on desktop.
- Live typing indicator dynamically adapts to user input:
  - Text queries: *"AI Assistant is analyzing your query…"*
  - Gym/Barber queries: *"Searching neighborhood gyms, barbers & tiffin services…"*
  - Room photo attached: *"HomeLink AI is analyzing photo authenticity…"*

---

## 5. Micro-Interactions & Animation Guidelines

- **Touch Feedback:** All interactive buttons and cards include `active:scale-95 transition-all duration-150`.
- **Skeleton Shimmers:** Content loading states use pulsating neutral bone cards (`animate-pulse`).
- **Modal Backdrops:** Frosted glassmorphic blur backdrop (`backdrop-blur-md bg-black/40`).
- **Toast Notifications:** Slide-up from bottom with auto-dismiss after 3000ms.
