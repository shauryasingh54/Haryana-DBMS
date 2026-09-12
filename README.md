# Haryana DBMS — Modernization & Role-Based Access Strategy Platform

A modernized database management and inspection-to-billing reconciliation platform built for the **Public Works Department, Government of Haryana**. 

This system resolves operational disconnects, eliminates zero-value "orphaned deliverables," replaces fragmented desktop directory sprawl and manual Excel ledgers, provides external portal downtime resilience, and enforces a strict 4-Tier Role-Based Access Control (RBAC) hierarchy.

---

## 🌟 Key Features & 4-Tier RBAC Architecture

### 🔑 Tier 1: System Admin
- **Access Governance**: Provision users, assign permission tiers, and enforce district scopes.
- **Database Telemetry**: Monitor active connections, storage allocation, query latency, and automated backup status.
- **External Integration Manager**: Sync status for government/corporate portals, manual offline tracking toggles, and retry queue management.
- **Live Audit Trail**: Immutable ledger of system operations, zero-value resolutions, and portal sync events.

### 📊 Tier 2: Executive Management
- **Centralized Metrics & Cash Flow**: Real-time aggregated financial analytics (Total Invoiced, Certified Unbilled Balance, Pending Zero-Value Balance).
- **Integrated One-Tap Summary Generator**:
  - **One-Tap PDF Export**: Instantly export a formatted Executive Financial Summary report.
  - **One-Tap Excel Export**: Export a multi-sheet Excel dataset of district financial ledgers.
- **Visual Analytics**: Interactive Recharts bar and area charts for district comparisons and monthly cash flow growth.
- **Historical Inspection Ledger**: Filterable by district (Gurugram, Faridabad, Ambala, Hisar, Karnal, Rohtak).

### 📑 Tier 3: Billing & QA Specialist
- **Deliverable-to-Invoice Mapping Suite**: Multi-select orphan deliverables and batch map them into a single certified government invoice (`HR-PWD-2026-XXXX`).
- **Zero-Value Resolution Desk**: Review raw field deliverables, update zero-value statuses to certified amounts, and eliminate orphaned deliverables.
- **Offline Ledger Reconciliation**: Batch import legacy CSV/Excel records collected during portal outages.

### 👷 Tier 4: Field Engineer
- **District-Isolated Workspace**: Filtered view strictly scoped to the engineer's assigned district (hides non-relevant global enterprise data).
- **Raw Deliverable Upload Suite**: File dropzone supporting PDF, DWG, ZIP, XLSX with metadata & notes.
- **Financial Status Tracker**: Transparent status indicators (`PENDING_QA`, `ZERO_VALUE`, `CERTIFIED`, `INVOICED`).

---

## 📁 Repository Structure

```
Haryana DBMS/
├── server/
│   ├── index.js          # Express REST API & in-memory/JSON DB engine
│   └── data.json           # Pre-seeded database state & audit logs
├── src/
│   ├── components/
│   │   ├── Navbar.jsx               # Global shell & 4-Tier Role Switcher toolbar
│   │   ├── AdminPortal.jsx          # Tier 1 System Admin View
│   │   ├── ExecutiveDashboard.jsx   # Tier 2 Executive View with One-Tap Generator
│   │   ├── BillingQAPortal.jsx      # Tier 3 Invoice Mapping & Zero-Value Desk
│   │   └── FieldEngineerPortal.jsx  # Tier 4 District-Isolated Field Portal
│   ├── utils/
│   │   └── exportUtils.js           # One-Tap PDF (jsPDF) & Excel (XLSX) generators
│   ├── App.jsx                      # Main React component & state manager
│   ├── main.jsx                     # React entry point
│   └── index.css                    # Tailwind CSS imports & styles
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .gitignore
└── README.md
```

---

## 🛠️ Quick Start & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/YOUR_USERNAME/haryana-dbms.git
cd haryana-dbms
npm install
```

### 2. Run Application (Backend + Frontend)
```bash
npm run start
```

This will launch:
- **Frontend Dev Server**: `http://localhost:3000`
- **Backend API & DB Engine**: `http://localhost:5000`

---

## 🚀 Pushing to GitHub

To push this repository to your GitHub account:

```bash
# 1. Initialize Git (if not already initialized)
git init

# 2. Rename branch to main
git branch -M main

# 3. Add all files & commit
git add .
git commit -m "Initial commit: Haryana DBMS Modernization & 4-Tier RBAC Platform"

# 4. Link your remote GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/haryana-dbms.git

# 5. Push to GitHub
git push -u origin main
```

---

## 📄 License
Internal Public Works Department Software — Government of Haryana. All Rights Reserved.
