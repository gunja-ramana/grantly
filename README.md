# GRANTLY — Student Opportunity Intelligence Platform

> **Tagline:** *Your future deserves funding.*  
> **Product Category:** Scholarship Discovery & Management Platform  
> **Built for:** Elite Competition & Hackathon Demonstration

---

## 1. Project Overview

**GRANTLY** transforms the fragmented scholarship journey into a connected, intelligent student lifecycle:

$$\text{DISCOVER} \longrightarrow \text{MATCH} \longrightarrow \text{UNDERSTAND} \longrightarrow \text{SAVE} \longrightarrow \text{PREPARE} \longrightarrow \text{APPLY} \longrightarrow \text{TRACK} \longrightarrow \text{SUCCEED}$$

Students struggle with complex eligibility rules, scattered documentation, overlapping deadlines, and financial uncertainty. GRANTLY solves this through a deterministic opportunity intelligence system built with React 18, TypeScript, and Vite.

---

## 2. Problem Statement

1. **Information Asymmetry:** Students miss millions in unclaimed awards because criteria are hidden in opaque PDFs.
2. **False Assumptions:** Students assume high GPAs or low incomes alone dictate awards without understanding composite criteria.
3. **Disorganized Portfolios:** Transcripts, recommendation letters, and essays are lost or out-of-date when deadlines arrive.
4. **Funding Blindness:** Students lack clarity on the net gap between estimated annual expenses and confirmed scholarship disbursements.

---

## 3. Product Solution

GRANTLY acts as an intelligent co-pilot across every phase of the scholarship pursuit:
- Transparent, deterministic eligibility matching without opaque third-party AI dependencies.
- Automatic cross-referencing between official requirements and verified documents in a local Document Vault.
- Ranked actionable priorities via Opportunity Radar.
- Visual financial simulation comparing total expenses against potential, applied, and received funds.
- Measurable progress metrics driven by real underlying application state.

---

## 4. Five Signature Innovations

### Innovation 1: Opportunity DNA
- Computes a multi-dimensional profile evaluating academic performance, financial need, first-generation status, underrepresented attributes, and discipline alignment.
- Unlocks merit and diversity badges (e.g. *High Honors Scholar*, *First-Generation Trailblazer*, *STEM Innovation Profile*).
- Identifies exact missing profile fields to unlock additional opportunities.

### Innovation 2: Smart Application Copilot
- Transforms any scholarship into an actionable preparation checklist.
- Detects missing documents by cross-referencing requirements with the student's Document Vault.
- Computes an authentic **Readiness Score (%)** based on verified items.
- Provides tailored personal statement brainstorming hooks connecting student goals to provider missions.

### Innovation 3: Opportunity Radar
- Prioritizes opportunities using deterministic multi-factor weighting:
  - **Eligibility Match (40 pts):** Based on rule satisfaction.
  - **Deadline Urgency (25 pts):** Dynamic countdown with urgent flags for deadlines $\le 14$ days.
  - **Award Value (20 pts):** Weighting by funding amount.
  - **Document Preparedness (15 pts):** Vault readiness alignment.
- Yields prioritized actionable cards with explicit explanations (e.g., *"Urgent: 8 days remaining with verified transcript in Vault"*).

### Innovation 4: Funding Gap Simulator
- Students input estimated education expenses (tuition, accommodation, living, books, commute, health).
- Compares total expenses against:
  - **Potential Funding:** Sum of all bookmarked opportunities.
  - **Applied Funding:** Applications in *Submitted* or *Under Review*.
  - **Approved Funding:** Officially granted awards.
  - **Received Funding:** Confirmed bursar disbursements.
- Allows interactive simulation of hypothetical award combinations with real-time net deficit calculations.
- Strict financial reporting policy: *Potential $\neq$ Applied $\neq$ Approved $\neq$ Received*.

### Innovation 5: Student Success Momentum
- Tracks quantifiable student progress driven 100% by underlying application data:
  - Profile completeness percentage.
  - Bookmarked opportunities.
  - Verified Vault documents.
  - Completed preparation tasks.
  - Submitted and approved applications.
- Dynamically classifies student velocity (*Starting Out*, *Building Momentum*, *Accelerating*, *Unstoppable*).

---

## 5. Technology Stack & Architectural Decisions

| Layer | Technology | Decision Rationalization |
|---|---|---|
| **UI Framework** | React 18 (Functional + Hooks) | Component reusability, declarative state synchronization |
| **Language** | Strict TypeScript 5 | Strict typing, zero `any`, centralized interfaces |
| **Tooling** | Vite 5 | Instant HMR, optimized multi-chunk Rollup bundling |
| **Styling** | Custom Design Tokens (Pure CSS) | Fintech/EdTech aesthetic, zero bloated CSS runtime |
| **Routing** | React Router DOM 6 | Seamless client-side routing across 9 primary views |
| **Visualizations**| Recharts 2 | Responsive SVG charts (Funding Pipeline, Category Donut) |
| **Icons** | Lucide React | High-legibility, accessible iconography |
| **Persistence** | Versioned localStorage | Client-side atomic persistence with corrupted-storage healing |

---

## 6. Project Structure

```text
grantly/
├── index.html                  # HTML entry point with Google Fonts (Manrope, Plus Jakarta Sans)
├── package.json                # Dependencies, scripts (dev, build, preview, test)
├── tsconfig.json               # Strict TypeScript configuration
├── vite.config.ts              # Vite bundle configuration with manual chunk splitting
├── scripts/
│   └── verify-journey.mjs      # 22-step autonomous test suite
└── src/
    ├── main.tsx                # React root mount
    ├── App.tsx                 # Route declarations & AppLayout integration
    ├── types/
    │   └── index.ts            # Centralized TypeScript definitions
    ├── styles/
    │   ├── design-tokens.css   # Color palette, radii, elevations, typography variables
    │   └── index.css           # Global layout classes, resets, utilities
    ├── data/
    │   ├── mockScholarships.ts # 10 rich, diverse scholarship specifications
    │   └── initialState.ts     # Realistic student baseline data
    ├── services/
    │   └── storage.ts          # Centralized localStorage manager with error recovery
    ├── context/
    │   └── AppContext.tsx      # Global state provider & atomic mutation handlers
    ├── features/
    │   ├── eligibility/        # Deterministic Eligibility & Opportunity DNA engines
    │   ├── opportunity-radar/  # Multi-factor priority ranking algorithm
    │   ├── copilot/            # Smart Application Copilot & brainstorming generator
    │   └── funding-simulator/  # Funding Gap Simulator & Success Momentum logic
    ├── components/
    │   ├── layout/             # AppLayout, Navbar, Sidebar
    │   ├── common/             # Badge, Button, Modal, ProgressBar, EmptyState, AlertBanner
    │   └── scholarships/       # ScholarshipCard, ScholarshipDetailModal
    └── pages/
        ├── DashboardPage.tsx       # Welcome hero, radar, KPIs, momentum, recommendations
        ├── DiscoverPage.tsx        # Search, faceted filters, sorting, grid/list view
        ├── ApplicationsPage.tsx    # Tracker with statuses, checklist management, notes
        ├── CalendarPage.tsx        # Month grid, deadline markers, urgency badges
        ├── DocumentVaultPage.tsx   # Verified documents, upload metadata, honest storage disclosure
        ├── AssistantPage.tsx       # Local deterministic guidance & prompt chips
        ├── FundingInsightsPage.tsx # Recharts pipeline, category distribution, gap simulator
        ├── ProfilePage.tsx         # Editable student profile & Opportunity DNA breakdown
        └── SettingsPage.tsx        # Local storage inspector, JSON export, reset controls
```

---

## 7. Installation & Running Instructions

### Prerequisites
- Node.js version 18 or higher (tested on Node v24)
- npm version 9 or higher

### 1. Clone or Open Workspace
```bash
cd "C:\Users\gunja\.gemini\antigravity\scratch\grantly"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Build for Production
```bash
npm run build
```
Generates an optimized production build in `dist/`.

### 5. Preview Production Build
```bash
npm run preview
```

### 6. Execute Automated Test Suite
```bash
npm test
```
Executes the comprehensive 22-step student journey test suite.

---

## 8. Verification & Quality Assurance Evidence

### Automated Journey Test Suite (22/22 Passing)
The test suite in `scripts/verify-journey.mjs` verifies:
1. Baseline profile and application loading.
2. Dashboard KPI calculations against underlying data.
3. Student profile editing and state propagation.
4. Opportunity DNA multi-dimensional scoring.
5. Discovery catalog availability (10 distinct programs).
6. Multi-attribute keyword search.
7. Faceted filters (STEM + Undergraduate).
8. Sorting by highest award value.
9. Comprehensive detail completeness.
10. Deterministic rule evaluation for eligibility.
11. Bookmark add/remove toggle and persistence.
12. Application initialization with Copilot checklist.
13. Vault document cross-referencing and readiness scoring.
14. Interactive task completion.
15. Application status lifecycle transitions.
16. Calendar countdown arithmetic.
17. Document Vault metadata integrity.
18. Funding Gap Simulator arithmetic.
19. Financial pipeline stage separation (*Potential $\neq$ Applied $\neq$ Received*).
20. Student Success Momentum score calculation.
21. LocalStorage atomic serialization.
22. Corrupted storage recovery fallback.

---

## 9. Privacy, Demo Limitations & Security
- **Zero Cloud Transmission:** Student financial records, transcripts, and contact information remain in browser localStorage.
- **Document Metadata Only:** The Document Vault avoids storing heavy base64 binary blobs to protect against storage quota exhaustion.
- **Deterministic Intelligence:** All recommendation, scoring, and brainstorming features run locally without external paid API dependencies.
