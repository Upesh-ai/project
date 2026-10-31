# DIGITAL DARK SPOT
### AI-Assisted Information Gap Detection Platform
> **"Not just finding information, but knowing what to verify next."**

[![Shinchan Online Hackathon 2026](https://img.shields.io/badge/Shinchan%20Online%20Hackathon-2026-blue?style=for-the-badge)](https://github.com)
[![Presenter](https://img.shields.io/badge/Presented%20By-Upesh%20Chauhan-amber?style=for-the-badge)](https://github.com)
[![Roll No](https://img.shields.io/badge/Roll%20No-2404851520061-teal?style=for-the-badge)](https://github.com)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple?style=for-the-badge)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan?style=for-the-badge)](https://tailwindcss.com/)
[![Node.js Express](https://img.shields.io/badge/Backend-Express.js-emerald?style=for-the-badge)](https://expressjs.com/)

---

## 📖 Project Overview

**Digital Dark Spot** is an AI-assisted research and information gap detection platform built for the **Shinchan Online Hackathon 2026** by **Upesh Chauhan (Roll No.: 2404851520061)**.

When students, founders, researchers, or applicants review critical programs (scholarships, government grants, visas, legal agreements), standard LLMs often summarize what is *present* while silently hallucinating or ignoring what is *missing*.

**Digital Dark Spot** solves this problem by cross-analyzing multiple source documents to detect the **Dark Spots** in information:
1. **Scattered:** Synthesizes facts spread across disparate portals, PDFs, and handbooks.
2. **Outdated:** Flags expired deadlines and retired application cycles (e.g. 2023 vs 2026).
3. **Conflicting:** Highlights direct clashes between authoritative documents (e.g., $60k IRS 1040 vs $65k Bank Statements).
4. **Unanswered:** Uncovers omissions that were never covered (e.g., missing renewal requirements and appeal policies).
5. **Verify Next:** Generates a prioritized, interactive checklist where **every finding links back to its source evidence**.

---

## 🎯 Slide-by-Slide Implementation Mapping

This project is a 1-to-1 interactive realization of the 7-slide hackathon presentation:

| Slide # | Presentation Topic | Implemented Feature in Web Platform |
|---|---|---|
| **Slide 1** | **Title & Branding** | Platform branding with the iconic magnifying glass question mark badge, deep navy (`#1e3a8a`), gold (`#f59e0b`), and teal (`#0d9488`) theme. |
| **Slide 2** | **Why Information Has Dark Spots** | Interactive Hero Banner featuring the 4 problem pillars: *Scattered, Outdated, Conflicting, and Unanswered*. |
| **Slide 3** | **How It Works** | 5-stage analysis pipeline component with live scanning animations and source evidence attribution links. |
| **Slide 4** | **What It Delivers** | Dedicated dashboards for *Structured Summary, Information Gaps, Contradictions, Outdated Warnings, Verify Checklist, and Trust Dashboard*. |
| **Slide 5** | **Example: Scholarship Check** | Pre-loaded 1-click benchmark case with exact Gap, Conflict, Outdated warning, and Action checklist. |
| **Slide 6** | **Proposed Tech Stack** | **React + Tailwind** interface, **Express.js API**, **Cheerio URL scraper**, and **Semantic AI / Gemini Engine**. |
| **Slide 7** | **Know What's Missing** | **Trust Dashboard** visualizing the ratio of **Sourced (Teal) vs. AI-suggested (Blue) vs. Uncertain (Amber)**. |

---

## 🛠️ Tech Stack (Slide 6)

- **Frontend:**
  - React 18
  - Vite 5 (Lightning-fast HMR and bundle compilation)
  - Tailwind CSS 3 (Custom dark theme matching pitch deck colors)
  - Lucide React (Crisp iconography)
- **Backend API:**
  - Node.js & Express.js
  - Cheerio (Safe HTML parsing & text extraction from URLs)
  - Axios (Robust HTTP fetching)
  - CORS & Dotenv
- **AI & Gap Detection Engine:**
  - **Hybrid Semantic Analyzer:** Built-in high-precision NLP rules and heuristics (works 100% offline out-of-the-box).
  - **Optional Google Gemini LLM:** Users can provide a Gemini API key for deep LLM reasoning.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v24)
- **npm** v9+

### 2. Installation
Dependencies are already configured:
```bash
npm install
```

### 3. Running the Application

You can run both the frontend and backend with a single command:
```bash
npm run dev
```

Or run them individually:
```bash
# Terminal 1: Run Backend API (Port 5000)
npm run dev:backend

# Terminal 2: Run Frontend UI (Port 5173)
npm run dev:frontend
```

Once running:
- **Frontend Dashboard:** [http://localhost:5173](http://localhost:5173)
- **Backend Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 4. Building for Production
```bash
npm run build
npm run preview
```

---

## 🧪 Built-in Case Studies & Presets

1. **Scholarship Application (Slide 5 Example):**
   - *Student Asks:* "What should I verify before applying for this scholarship?"
   - *GAP:* Renewal requirements not found in the sources reviewed.
   - *CONFLICT:* Two sources list different income documents ($60k IRS 1040 vs $65k Bank Statements).
   - *OUTDATED:* One page refers to an earlier 2023-2024 application cycle.
   - *VERIFY:* Deadline, document list, renewal policy, apply link.

2. **DeepTech Innovation Grant 2026:**
   - Detects clashing equity warrant clauses (100% non-dilutive vs 2.5% safe warrants), outdated 2024 Trade Act compliance deadlines, and missing intellectual property transfer terms.

3. **International Student Visa & Study Abroad:**
   - Detects discrepancies between immigration maintenance funds ($12,006 over 28 days) and university sponsorship rules ($14,500 over 60 days).

4. **Custom Inquiries:**
   - Input any custom URL or text snippet and let the engine uncover dark spots.

---

## 📄 Export & Audit Report

Click the **Export** button in the header to:
- Generate a comprehensive Markdown audit report.
- Copy findings to clipboard.
- Print / Save as PDF.

---

## 👨‍💻 Author & Credits

- **Platform Name:** Digital Dark Spot
- **Presented by:** Upesh Chauhan
- **Roll No.:** 2404851520061
- **Event:** Shinchan Online Hackathon 2026
