# BrandLens Frontend (`/client`)

> **Pre-publication Brand Governance Web Application**  
> Codex 48 Hackathon | Round 2 — The Build | Team D&A CODERS  
> Frontend Developer: **Divyanshu** | Assisted by **Google Antigravity**

---

## 📋 Overview

**BrandLens** is an automated brand governance platform that intercepts marketing copy before external publication. It guarantees that promotional drafts across all distribution channels (Social, Email, Web, Presentation Decks) rigorously adhere to stored brand voice guidelines, factual claims, and legal terminology.

### Key Capabilities
- **Dual-Engine Review**: Combines deterministic exact-rule matching (banned terminology, delivery thresholds, return windows, accessibility) with deep semantic AI review powered by Google Gemini.
- **Strict Closed-World Grounding**: Compliance findings can cite **only** what is stored in the company knowledge base. Findings include ground-truth clause text, fact values, confidence levels, and suggested fixes.
- **Non-Destructive Versioning**: The editor never modifies draft text automatically. Changes are applied solely when a user accepts or edits fixes, saving clean iterations as new versions (`v1`, `v2`, etc.) with interactive inline & split diff views.
- **Multi-Stage Role-Gated Approvals**: Enforces a strict two-stage sign-off pipeline:
  1. **Creator** drafts and submits copy (blocked if open blocking violations exist — HTTP 409 invariant).
  2. **Reviewer** approves Stage 1 (`in_review` $\to$ `reviewer_approved`), requests changes, or rejects with a mandatory rationale note.
  3. **Manager** grants final executive sign-off (`reviewer_approved` $\to$ `approved`).
- **Audit Trail & Governance Notes**: Immutable chronological compliance timeline and discussion threads tied to specific findings.
- **Executive Insights & Analytics**: Real-time aggregation of analyzed drafts, violation categories, resolution patterns, and top disputed brand clauses.

---

## 🛠️ Tech Stack

- **Core**: React 19, Vite 8, JavaScript (ESM)
- **Styling**: Tailwind CSS (Brand Tokens: Navy `#1F2A44`, Teal `#0E7C86`, Light `#EAF4F5`, Severity Tokens)
- **State Management**: Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **Routing**: React Router v7 (`react-router-dom`)
- **Networking**: Axios with custom request/response interceptors (envelope unwrapping `{ ok: true, data }`, JWT auto-attachment, 401 redirect)
- **Diffing**: `diff` (`diffWords`) for word-level Unified and Split diff comparison
- **Icons & Notifications**: `lucide-react`, `react-hot-toast`
- **Testing**: Node.js native test runner (`node --test`) for highlight span segmentation algorithms

---

## ⚙️ Environment Variables

Copy `.env.example` to create your local `.env`:

```bash
cp .env.example .env
```

| Variable | Type | Description | Default / Example |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | `string` | Base URL for backend Express API (no trailing slash) | `http://localhost:5000/api` |
| `VITE_USE_MOCK` | `boolean` | Set to `true` to run with full in-memory mock data; `false` to connect to live backend | `true` |

> 🔒 **Security Notice**: Zero API keys or secrets are stored in the client. External AI calls (Gemini) are strictly proxied through the authenticated backend.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+ (tested on Node v20 & v24)
- npm v9+

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run Automated Unit Tests
Validates span sorting, out-of-range checks, and non-overlapping text segmentation:
```bash
npm test
```

### 4. Build for Production
```bash
npm run build
```
Generates production assets in `/dist`.

### 5. Preview Production Build
```bash
npm run preview
```

---

## 📦 Project Structure

```
client/
├── public/
│   ├── favicon.svg             # Custom BrandLens shield-and-lens SVG favicon
│   └── icons.svg
├── src/
│   ├── api/
│   │   ├── axios.js            # Axios client, unwrap {ok, data}, JWT interceptor, 401 handler
│   │   ├── index.js            # Unified API facade switching on VITE_USE_MOCK
│   │   └── mock.js             # Section 4 compliant in-memory mock engine with seed dataset
│   ├── components/
│   │   ├── AiDisclosureBanner.jsx  # Transparent disclosure of Gemini/Antigravity AI usage
│   │   ├── ApprovalBar.jsx     # Role-adaptive governance bar (Creator submit, Reviewer/Manager decisions)
│   │   ├── AuditTimeline.jsx   # Immutable compliance audit log from GET /content/:id/audit
│   │   ├── CommentThread.jsx   # General and finding-tied discussion notes
│   │   ├── DiffView.jsx        # Unified inline and side-by-side word diff viewer
│   │   ├── EmptyState.jsx      # Accessible empty state card with action trigger
│   │   ├── ErrorMessage.jsx    # Accessible error alert with retry button
│   │   ├── FindingCard.jsx     # Finding card with Accept, Edit, Dispute, and Source chip popover
│   │   ├── FindingsPanel.jsx   # Severity-grouped finding cards with save version trigger
│   │   ├── HighlightedText.jsx # Interactive, focusable text spans mapped to findings
│   │   ├── Layout.jsx          # App shell, sticky navbar, API connectivity badge, user role pill
│   │   ├── Loading.jsx         # Accessible skeleton loading state
│   │   ├── ProtectedRoute.jsx  # Auth guard redirecting to /login
│   │   ├── RoleGate.jsx        # Role-based route guard redirecting to /not-allowed
│   │   ├── SeverityBadge.jsx   # Color-coded badge for Blocking, Should-Fix, Suggestion
│   │   ├── SourceChip.jsx      # Ground-truth citation chip displaying clause/fact popover
│   │   ├── StatusBadge.jsx     # Content draft lifecycle status badge
│   │   └── VersionPicker.jsx   # Version selector dropdown and diff toggle
│   ├── pages/
│   │   ├── Dashboard.jsx       # Draft list, status filter, and "Waiting for you" reviewer section
│   │   ├── HealthCheck.jsx     # GET /health verification & mock indicator
│   │   ├── Insights.jsx        # Analytics dashboard from GET /insights/summary
│   │   ├── Knowledge.jsx       # Guidelines, Facts, Terms, Palette tables & Admin AI toggle
│   │   ├── Login.jsx           # 4-button quick demo login (Creator, Reviewer, Manager, Admin)
│   │   ├── NewContent.jsx      # Draft creator with "Try sample draft" and AI toggle
│   │   ├── NotAllowed.jsx      # Friendly 403 screen with 1-click role switcher
│   │   └── ReviewContent.jsx   # Interactive editor, findings panel, diff, comments, audit
│   ├── store/
│   │   ├── authSlice.js        # User session, role, token persistence, and org settings
│   │   ├── contentSlice.js     # Drafts, review findings, patch findings, versioning, workflow
│   │   ├── index.js            # Redux store root configuration
│   │   └── knowledgeSlice.js   # Clauses, Facts, Terms CRUD thunks
│   ├── utils/
│   │   ├── constants.js        # Roles, severities, finding types, statuses, channels
│   │   ├── highlight.js        # Span overlap removal and text segmentation algorithms
│   │   ├── highlight.test.js   # Automated unit tests for span highlight logic
│   │   └── usePageTitle.js     # Accessible dynamic document title hook
│   ├── App.jsx                 # Provider, BrowserRouter, Toaster root
│   ├── index.css               # Tailwind CSS directives
│   ├── main.jsx                # React DOM entrypoint
│   └── routes.jsx              # Application route tree
├── .env.example                # Sample environment configuration
├── index.html                  # HTML entrypoint with metadata and favicon
├── tailwind.config.js          # Custom color palette and design tokens
├── vercel.json                 # SPA rewrite configuration for Vercel deployment
├── package.json
└── README.md
```

---

## ☕ Mock Mode & Pre-Seeded Dataset

When `VITE_USE_MOCK=true`, the client runs entirely offline with a realistic in-memory mock engine that adheres to the Section 4 API contract.

### Seed Organization: Nimbus Coffee Co.
- **Organization**: `Nimbus Coffee Co.` (`org_nimbus`) — Premium artisanal cold brew and whole bean roaster.
- **Pre-Seeded Personas**:
  1. `asha@nimbus.demo` (**Creator**): Drafts copy, resolves findings, submits for review.
  2. `rohan@nimbus.demo` (**Reviewer**): Stage 1 review; checks claim substantiations and tone.
  3. `dev@nimbus.demo` (**Manager**): Stage 2 executive sign-off; omnichannel publishing approval.
  4. `priya@nimbus.demo` (**Admin**): Full read/write over brand policies, facts, terms, and organization-wide AI toggle.
- **Pre-Seeded Guidelines & Facts**:
  - `CLM-3.1`: Claims & Superlatives policy (no unsubstantiated "world's best" or "guaranteed").
  - `TONE-2.1`: Tone of Voice policy (warm, calm, plain; avoid "CHEAPEST" and "!!!").
  - `A11Y-4.1`: Accessible Link Text policy (avoid vague "click here").
  - `f1`: Free delivery threshold fact (free delivery requires $\ge$ Rs 499 minimum).
  - `f2`: Return window fact (policy return window is 7 days, not 30 days).
  - `t1`: Banned term "cheap" / "cheapest" $\to$ preferred "most affordable".
- **Pre-Seeded Demo Draft**:
  - *"Get our CHEAPEST cold brew ever!!! Nimbus is the world's best coffee and guaranteed to boost your energy. Free delivery on all orders, and returns within 30 days. Click here to order: nimbus.example"*
  - Clicking **"Try sample draft"** on `/new` loads this draft immediately for testing.

---

## ☁️ Deployment to Vercel

1. Push your code to GitHub.
2. In Vercel, click **"Add New Project"** and select the repository.
3. Configure settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Environment Variables:
   - `VITE_API_URL`: Your live backend API URL (e.g. `https://brandlens-api.onrender.com/api`).
   - `VITE_USE_MOCK`: `false` (or `true` for standalone demo).
5. `client/vercel.json` provides SPA routing:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

---

## 🤖 AI-Use Disclosure

In accordance with hackathon guidelines:
- **Development Assistance**: Code architecture, component structuring, and paired refactoring were assisted by **Google Antigravity**.
- **Runtime Semantic Checking**: Natural language tone evaluation and superlative claim verification are executed via **Google Gemini 1.5 Pro** routed securely through the backend proxy.
- **Human-in-the-Loop Guarantee**: AI findings are purely advisory. No content is ever altered automatically. All copy changes require explicit human action (Accept fix, Edit inline, or Dispute) followed by creating a new version.
