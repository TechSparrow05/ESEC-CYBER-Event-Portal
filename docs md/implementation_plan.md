# Implementation Plan: Production-Ready College Event Portal

Build a production-grade, responsive College Event Portal adhering to modern architectural patterns, enterprise UI design tokens (#0A0A0A, #FFFFFF, #4F46E5 Indigo, #06B6D4 Cyan), strict business rules (at most 1 Technical and 1 Non-Technical event), sequential participant UID generation (`EVT-2026-XXXX`), UPI payment verification with unique 12-digit UTR validation, GCS signed-URL screenshot upload, and jsPDF invoice receipt generation.

---

## 1. System Architecture & Folder Structure

We organize the project into a modular monorepo structure with decoupled frontend (`client/`) and backend services (`server/`), plus database schema migrations (`supabase/`):

```
College-Event-ESEC/
├── client/                     # Vite + React 18 + TypeScript + Tailwind CSS
│   ├── public/                 # Static assets, logos, favicon
│   ├── src/
│   │   ├── assets/             # Icons, illustrations, badges
│   │   ├── components/         # Reusable UI components
│   │   │   ├── common/         # Navbar, Footer, Button, Card, Badge, Modal, Toast
│   │   │   ├── events/         # EventCard, EventFilter, ConstraintAlert
│   │   │   ├── register/       # StepIndicator, RoleSelect, EventPicker, TeamConfig, OrderSummary
│   │   │   └── payment/        # QRCodeDisplay, UtrInput, GcsUploader
│   │   ├── context/            # AuthContext, CartContext, RegistrationContext
│   │   ├── hooks/              # useAuth, useEvents, usePayment, useReceipt
│   │   ├── layouts/            # RootLayout, AuthLayout, DashboardLayout
│   │   ├── pages/              # 5 core pages
│   │   │   ├── Home.tsx        # Hero, interactive schedule, categories, contact, FAQ
│   │   │   ├── Events.tsx      # Catalogue with live constraints & badges
│   │   │   ├── Register.tsx    # Multi-step wizard (Role -> Events -> Review)
│   │   │   ├── Payment.tsx     # Dynamic UPI QR, VPA copy, UTR check, GCS upload
│   │   │   └── Invoice.tsx     # Receipt view + jsPDF generator
│   │   ├── services/           # Supabase client, API client, GCS uploader client
│   │   ├── types/              # Domain models, event types, registration types
│   │   ├── utils/              # PDF generator (jsPDF), formatting, validators
│   │   ├── App.tsx             # React Router routing setup
│   │   ├── index.css           # Tailwind directives, custom glassmorphism & typography
│   │   └── main.tsx            # Entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js      # Custom theme tokens: #0A0A0A, #4F46E5, #06B6D4
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/                     # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── config/             # Environment, Supabase admin, GCS bucket config
│   │   ├── controllers/        # PaymentController, UploadController, TeamController
│   │   ├── middleware/         # Auth verification, rate limiting, error handler
│   │   ├── routes/             # /api/payments, /api/teams, /api/health
│   │   ├── services/           # GcsStorageService, PaymentVerificationService
│   │   └── server.ts           # Express server entry
│   ├── package.json
│   └── tsconfig.json
├── supabase/
│   └── migrations/
│       └── 20260923000000_init_schema.sql  # SQL schema, RLS, triggers & sequences
├── .env.example                # Unified documentation for client & server keys
└── README.md                   # Setup guide, API documentation & architectural overview
```

---

## 2. Core Modules & Business Logic

### A. Database Schema & Supabase Configuration (`supabase/migrations/`)
1. **Sequential Participant ID**:
   - PostgreSQL sequence `participant_id_seq` starting at 1001.
   - Trigger `generate_participant_id` automatically sets `participant_id = 'EVT-2026-' || LPAD(nextval('participant_id_seq')::text, 4, '0')` upon user signup in `public.profiles`.
2. **Tables**:
   - `profiles`: `id (uuid, ref auth.users)`, `participant_id (text, unique)`, `full_name`, `email`, `phone`, `college`, `created_at`.
   - `events`: `id (uuid)`, `slug`, `title`, `category ('Technical' | 'Non-Technical')`, `description`, `fee`, `min_team_size`, `max_team_size`, `schedule_time`, `venue`, `rules_json`.
   - `teams`: `id (uuid)`, `team_code (varchar(8) unique)`, `event_id (uuid)`, `leader_id (uuid)`.
   - `team_members`: `id`, `team_id`, `user_id`, `joined_at`.
   - `registrations`: `id (uuid)`, `user_id (uuid)`, `technical_event_id (uuid, nullable)`, `non_technical_event_id (uuid, nullable)`, `role ('Leader' | 'Member')`, `team_id (uuid, nullable)`, `total_amount (numeric)`, `status ('pending' | 'verified' | 'rejected')`.
   - `payments`: `id (uuid)`, `registration_id (uuid)`, `upi_ref_id (varchar(12) unique)`, `screenshot_url (text)`, `amount (numeric)`, `status ('submitted' | 'verified')`, `created_at`.
3. **Hard Constraint Trigger**:
   - Enforce database constraint `CHECK`: a registration cannot have multiple technical events or multiple non-technical events.
4. **Row Level Security (RLS)**:
   - Users can read all published events.
   - Users can only read/update their own profile and registrations.
   - Public/authenticated validation for team codes and payment statuses.

### B. Backend API (`server/`)
1. **Google Cloud Storage Integration**:
   - `GcsStorageService`: Generates V4 Pre-Signed Upload URLs (`storage.bucket(bucketName).file(fileName).getSignedUrl(...)`) allowing direct, secure client-to-bucket uploads with UUID names and MIME type validation (`image/png`, `image/jpeg`).
   - Mock/Local fallback storage handler when GCP credentials are not yet populated in `.env`, enabling instant developer preview without broken workflows.
2. **Payment & UTR Verification**:
   - `POST /api/payments/upload-url`: Returns presigned URL and file path for screenshot.
   - `POST /api/payments/verify`: Validates 12-digit numeric format, checks unique UTR against existing payments, saves record to database, and transitions registration status.
3. **Team Management**:
   - `POST /api/teams/create`: Generates crypto-safe 6-character alphanumeric join code (e.g. `ESEC-7X2`).
   - `POST /api/teams/join`: Validates join code, checks team capacity constraints, and binds participant.

### C. Frontend Application (`client/`)
1. **Theme & Tokens**:
   - Tailored Tailwind palette:
     - `brand-dark`: `#0A0A0A`
     - `brand-surface`: `#121212` / `#18181B`
     - `brand-accent`: `#4F46E5` (Indigo)
     - `brand-cyan`: `#06B6D4` (Cyan)
     - Glassmorphism effects with subtle gradients and glowing borders.
2. **Page Implementations**:
   - `/` **(Home)**: High-impact hero section with dynamic particle/gradient backdrop, event countdown, stats counter, category showcase cards, interactive multi-track schedule timeline, FAQ accordion, and contact details.
   - `/events` **(Catalogue)**: Filterable grid (All, Technical, Non-Technical), search bar, dynamic category badge indicators showing constraints, live slot availability, and modal detail views.
   - `/register` **(Multi-Step Form)**:
     - Step 1: Role Selection ("Leader" creates team code / "Team Member" enters existing team code / "Individual Solo").
     - Step 2: Event Selection with real-time hard-rule enforcement (blocking selection if a 2nd Technical or 2nd Non-Technical event is picked, displaying active conflict alerts).
     - Step 3: Profile Confirmation & Order Summary with transparent fee breakdown.
   - `/payment` **(Payment & Verification)**:
     - Dynamic UPI QR Code (using `qrcode.react`) formatted with college UPI VPA (`esecfest2026@okaxis`), recipient name, and exact order total.
     - Click-to-copy VPA button.
     - 12-digit UTR input with immediate regex validation (`^\d{12}$`) and duplicate check.
     - Drag-and-drop screenshot uploader integrated with the backend signed URL flow.
   - `/invoice/:id` **(Printable Confirmation Receipt)**:
     - Visual receipt layout showing Participant UID (`EVT-2026-0001`), Event details, Team code, 12-digit UTR, Verification badge, and timestamp.
     - "Download PDF Receipt" button generating a clean vector PDF using `jspdf` and `jspdf-autotable`.

---

## 3. Implementation Steps

1. **Initialize Project Scaffolding**:
   - Setup `client/` using Vite + React + TypeScript + Tailwind CSS + Lucide Icons + React Router DOM + jsPDF.
   - Setup `server/` with Express + TypeScript + CORS + Dotenv + Google Cloud Storage client + Supabase JS.
2. **Database & Migrations**:
   - Create `supabase/migrations/20260923000000_init_schema.sql` with full DDL, RLS policies, trigger for sequential UID `EVT-2026-XXXX`, and seed events.
3. **Backend Development**:
   - Implement storage service (with GCP signed URL + development storage fallback).
   - Implement payment verification endpoints with 12-digit UTR validation.
   - Implement team code generator & validation.
4. **Frontend Development**:
   - Design system tokens in `tailwind.config.js` and `index.css`.
   - State management: `AuthContext`, `RegistrationContext`, mock data providers.
   - Develop Landing Page (`/`), Events Catalogue (`/events`), Multi-Step Registration (`/register`), Payment UI (`/payment`), and Invoice Receipt (`/invoice/:id`).
5. **Verification & Testing**:
   - Test build for both client (`npm run build`) and server (`npm run build`).
   - Validate navigation, event constraint validation (max 1 Tech + max 1 Non-Tech), team code flows, UTR check, and PDF generation.

---

## 4. Verification Plan

### Automated Build Verification:
- Client compilation: `cd client && npm run build`
- Server compilation: `cd server && npm run build`

### Functional Testing via Browser / API:
1. Verify `/`: Landing page hero, interactive schedule, and navigation links.
2. Verify `/events`: Filtering by Technical and Non-Technical categories.
3. Verify `/register`: Try selecting two Technical events -> Ensure UI prevents or alerts user, enforcing the rule of at most 1 Technical and 1 Non-Technical.
4. Verify `/payment`: Enter UPI UTR, verify 12-digit validation, test receipt routing.
5. Verify `/invoice/:id`: Render receipt with `EVT-2026-XXXX` participant ID and test "Download PDF Receipt" jsPDF generation.
