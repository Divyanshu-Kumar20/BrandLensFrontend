# BrandLens Client (Frontend)

Pre-publication brand-governance web app built for Codex 48 Round 2.
Built by **Divyanshu** (Team D&A CODERS) using **Antigravity**.

---

## 🛠️ Stack
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS (Navy `#1F2A44`, Teal `#0E7C86`, Light `#EAF4F5`)
- **State Management**: Redux Toolkit & React-Redux
- **Routing**: React Router v7
- **HTTP Client**: Axios (custom envelope unwrapping, JWT interceptor, 401 redirect)
- **Icons & UI**: Lucide React, react-hot-toast, diff package

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL for backend Express API (no trailing slash) | `http://localhost:5000/api` |
| `VITE_USE_MOCK` | Toggle in-memory mock mode (`true` or `false`) | `true` |

> 🔒 **Security Notice**: No API keys are ever stored in the client. The client communicates exclusively through `VITE_API_URL`.

---

## 🚀 Local Development

1. **Install dependencies**:
   ```bash
   cd client
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

---

## ☁️ Deployment to Vercel

### Step 1: Push Repository to GitHub
Ensure the repo root contains `/client`, `/server`, and `/docs`.

### Step 2: Import Project in Vercel
1. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
2. Select your `Brandlens` repository.
3. Configure the Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client` *(Click 'Edit' and select `client`)*
   - **Build Command**: `npm run build` (or `vite build`)
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 3: Configure Environment Variables in Vercel
Under the **Environment Variables** section, add:
- `VITE_API_URL`: Your teammate's live Render backend URL ending in `/api` (e.g. `https://brandlens-api.onrender.com/api`).
- `VITE_USE_MOCK`: `false` (set to `true` if backend is not yet live).

### Step 4: SPA Routing Support
`client/vercel.json` contains the rewrite rule:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
This ensures direct navigation to React Router paths (e.g., `/knowledge`, `/login`) loads without 404 errors.

---

## 🤖 AI Disclosure
In accordance with hackathon rules, this application's development was assisted by Google Antigravity. Gemini is accessed through the backend API for AI findings and verification.
