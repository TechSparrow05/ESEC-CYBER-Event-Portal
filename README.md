# 🎓 ESEC Fiesta 2026 - College Event Portal

A production-grade, full-stack event portal engineered for **Erode Sengunthar Engineering College (ESEC)**. Built with **Vite, React 18, TypeScript, Tailwind CSS, Node.js Express, Supabase, and Google Cloud Storage (GCS)**.

---

## 🎨 Design Tokens & Aesthetic System
- **Primary Palette**: `#0A0A0A` (Deep Obsidian Black) & `#FFFFFF` (Pure White)
- **Accent Radiance**: `#4F46E5` (Electric Indigo) & `#06B6D4` (High-Energy Cyan)
- **Surface Elevation**: `#121214` (Surface) & `#18181B` (Elevated Card)
- **Layout Philosophy**: Mobile-first responsive grid and flexbox alignment with glassmorphism (`backdrop-blur-xl`) and subtle micro-interactions.

---

## 🏗️ Architecture Overview

```
                                ┌──────────────────────────────────────────┐
                                │             Vite + React UI              │
                                │   - / (Home)      - /events              │
                                │   - /register     - /payment             │
                                │   - /invoice/:id                         │
                                └───────┬──────────────────────────┬───────┘
                                        │                          │
                        1. Direct GCS   │                          │ 2. Team, UTR &
                           Signed PUT   │                          │    Upload URL API
                                        ▼                          ▼
                   ┌────────────────────────────┐       ┌────────────────────────────┐
                   │    Google Cloud Storage    │       │     Node.js Express API    │
                   │   (Receipt Screenshots)    │◄──────┤   - GCS V4 Signed URLs     │
                   └────────────────────────────┘       │   - 12-Digit UTR Validator │
                                                        │   - Team Code Generator    │
                                                        └──────────────┬─────────────┘
                                                                       │
                                                                       ▼
                                                        ┌────────────────────────────┐
                                                        │      Supabase Postgres     │
                                                        │  - Trigger: EVT-2026-XXXX  │
                                                        │  - Category Constraint     │
                                                        │  - Row Level Security (RLS)│
                                                        └────────────────────────────┘
```

---

## ⚡ Core Features & Business Rules

### 1. Sequential Unique Participant Identifier (`EVT-2026-XXXX`)
- Integrated via PostgreSQL sequence `participant_id_seq` starting at `1001`.
- A database `BEFORE INSERT` trigger formats the ID automatically as `'EVT-2026-' || LPAD(nextval('participant_id_seq')::text, 4, '0')`.

### 2. Category Selection Hard Rule
- **Categories**: `Technical` and `Non-Technical`.
- **Enforcement**: A participant can select **at most 1 Technical event** and **at most 1 Non-Technical event**.
- Multiple selections in the same category are blocked in real-time on the client UI and validated via PostgreSQL database trigger `check_registration_event_categories()`.

### 3. Role-Based Squad Mechanics
- **Leader**: Initiates the squad registration and auto-generates a unique 6-character join code (e.g. `ESEC-7X2`).
- **Team Member**: Enters and validates the join code to link to the leader's team.
- **Solo**: Direct individual entry for single-participant tracks (e.g., Code Sprint, LensCraft Photography).

### 4. UPI Payment & GCS Signed URL Flow
1. **Dynamic QR Code**: Generates an instant UPI intent QR code (`upi://pay?pa=esecfest2026@okaxis...`) embedded with dynamic registration total.
2. **12-Digit UTR Validation**: Strict regex check (`^\d{12}$`) enforcing numeric 12-digit transaction references, with duplicate check prevention.
3. **Google Cloud Storage Integration**:
   - Client calls `POST /api/payments/upload-url`.
   - Node.js backend initializes `@google-cloud/storage` and produces a secure V4 Signed PUT URL.
   - Client uploads the screenshot directly to the GCS bucket (`image/jpeg`, `image/png`, `image/webp`).
   - If GCS credentials are not configured in local development, the backend automatically transitions to a mock storage handler so the workflow never breaks.

### 5. Invoicing & PDF Receipt Generation
- Confirmation screen (`/invoice/:id`) displaying:
  - Participant UID (`EVT-2026-XXXX`)
  - 12-Digit Bank UTR reference
  - Confirmed events with category constraint badges
  - Settlement summary
  - Desk verification QR Code
- **Vector PDF Generator**: Click "Download PDF Receipt" to generate an official print-ready receipt powered by `jsPDF` and `jspdf-autotable`.

---

## 📁 Modular Directory Structure

```
College-Event-ESEC/
├── client/                     # Vite + React 18 + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/         # Navbar, Footer, Badge, EventCard, ConstraintBanner
│   │   ├── context/            # AuthContext (UID), RegistrationContext (Rules)
│   │   ├── data/               # Seeded Technical & Non-Technical competitions
│   │   ├── pages/              # Home, Events, Register, Payment, Invoice
│   │   ├── services/           # Supabase client & Express API client
│   │   ├── types/              # Domain interfaces
│   │   ├── utils/              # jsPDF vector receipt generator
│   │   ├── App.tsx             # React Router routing
│   │   └── index.css           # Tailwind + Glassmorphism design tokens
│   ├── tailwind.config.js      # Palette tokens: #0A0A0A, #4F46E5, #06B6D4
│   └── vite.config.ts
├── server/                     # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── config/             # GCS & Supabase environment loader
│   │   ├── controllers/        # PaymentController, TeamController
│   │   ├── routes/             # /api/payments, /api/teams, /api/health
│   │   ├── services/           # GcsStorageService, PaymentService, TeamService
│   │   └── server.ts           # Express server entry point
│   ├── package.json
│   └── tsconfig.json
├── supabase/
│   └── migrations/
│       └── 20260923000000_init_schema.sql  # DDL, triggers, RLS & seed data
├── .env.example
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24.16.0)
- **npm**: v9+

### 2. Installation
Run the following from the root directory:
```bash
# Install client dependencies
npm install --prefix client

# Install server dependencies
npm install --prefix server
```

### 3. Environment Configuration
Copy `.env.example` to both `client/.env` and `server/.env`:
```bash
cp .env.example server/.env
cp client/.env.example client/.env
```

### 4. Run the Development Servers
In separate terminals:

```bash
# Start backend server (http://localhost:5000)
npm run dev:server

# Start frontend application (http://localhost:5173)
npm run dev:client
```

### 5. Supabase Setup (Optional for Live Production Database)
1. In your Supabase dashboard SQL editor, execute the migration script located at:
   `supabase/migrations/20260923000000_init_schema.sql`
2. Update `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `client/.env` and `server/.env`.
