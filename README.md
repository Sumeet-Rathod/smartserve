# ⚡ SmartServe — Online Home & Lifestyle Service Booking Platform

> **Urban Company / UrbanClap for India** — A full-stack, real-time service booking web application built with React, Tailwind CSS, and Firebase Firestore & Authentication.

---

## 🌟 Key Highlights & Features

- **⚡ Brand & Design System**: Modern Indian fintech-inspired aesthetic using Google Fonts **Syne** (700/800 headings) and **Plus Jakarta Sans** (body), with Primary Navy (`#0B2545`), Accent Gold (`#E8A020`), and Background (`#F4F6FB`).
- **🛡️ 3 Distinct Role Dashboards with Strict Access Control**:
  1. **Customer**: Default on signup. Browse services, book verified pros, track real-time bookings with color-coded status badges, leave reviews with interactive star ratings, edit profile.
  2. **Provider**: Service professionals. View assigned bookings, change job status (`Start Job`, `Complete`, `Decline`), manage profile and rate card, configure weekly working days and hours schedule.
  3. **Admin** (`admin@smartserve.com` only): Overview KPIs, 6-month booking trends bar chart, service demand donut chart, user directory with activate/deactivate toggle, provider verification engine (Verify/Reject), bookings master table with status filters, horizontal service performance charts, and platform commission analytics. Blocked for all non-admins with a custom **403 Access Denied** page.
- **⚡ 3-Step Protected Booking Flow**:
  - **Step 1 — Choose Provider**: Verified providers filtered by service with rating, completed jobs, hourly rate, and full weekly availability grid.
  - **Step 2 — Date, Duration & Time**: Date picker (today to 30 days ahead), service duration slider, provider schedule enforcement (days off respected, past hours hidden for today). Highlighted **PEAK slots** in purple (9am–12pm & 4pm–7pm) and **Off-Peak slots** in green.
  - **LIVE PRICING PANEL**: Real-time updates as user selects duration or slots:
    * Base: `Provider Hourly Rate × Duration Hours`
    * Peak Hour Surcharge: `+25%` if 9am–12pm or 4pm–7pm
    * Weekend Surcharge: `+15%` if Saturday or Sunday
    * Same-Day Express: `+10%` if booking for today
    * Platform Escrow Fee: `5%` of subtotal
    * Smart Savings Tip displayed if peak or weekend surcharges apply!
  - **Step 3 — Review & Confirm**: Full appointment review, customer address input, special instructions notes, and celebratory confetti upon booking.
- **🔔 Real-Time Notifications System**:
  - Slide-in toasts from top-right with auto-dismiss after 4 seconds (success, info, booking, danger, warn).
  - Multi-stage booking confirmation:
    1. Instant slide-in toast: *"Booking BK-XXXXX confirmed!"*
    2. After 2 seconds: *"Provider [name] has been notified"*
    3. Added to persistent notification bell dropdown with unread badge counter and *"Clear all"* capability.
- **🔥 Firebase Firestore & Real-Time Sync**:
  - Pre-configured for real Firebase (`firebase.js`, `firestore.rules`, `firebase.json` for Firebase Hosting).
  - Built-in multi-tab reactive realtime engine ensures instant sync across tabs even before custom Firebase credentials are added.

---

## 🔑 Demo Personas & Credentials

The Sign In page includes a **One-Click Demo Access Box** with instant auto-fill buttons:

| Role | Email | Password | Access / Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@smartserve.com` | `Admin@123` | Platform Control, User Deactivation, Provider Verification, Analytics |
| **Provider** | `provider@smartserve.com` | `Provider@123` | Rajesh Kumar (Home Repair & Painting), Assigned Jobs, Availability Schedule |
| **Customer** | `user@smartserve.com` | `User@123` | Ananya Sharma, My Bookings, Live Scheduling, Review Submission |

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 6, Tailwind CSS 3, Lucide React Icons, Canvas Confetti
- **Backend & Database**: Firebase Firestore (real-time collections for `users`, `bookings`, `providers`, `reviews`, `services`, `notifications`)
- **Authentication**: Firebase Authentication (Email/Password with role claims)
- **Deployment**: Firebase Hosting (`firebase.json` pre-configured)

---

## 📂 Project Architecture

```
smartserve/
├── index.html                 # Google Fonts (Syne + Plus Jakarta Sans)
├── package.json               # Dependencies & scripts
├── tailwind.config.js         # Custom colors: navy (#0B2545), gold (#E8A020)
├── vite.config.js             # Vite configuration
├── firebase.json              # Firebase Hosting configuration
├── firestore.rules            # Firestore security rules
├── .env.example               # Firebase environment variables template
└── src/
    ├── main.jsx               # React entry point
    ├── index.css              # Custom scrollbars, animations, Tailwind
    ├── App.jsx                # App root, role routing & tab state
    ├── config/
    │   ├── firebase.js        # Universal Firebase SDK & Realtime Engine
    │   └── seedData.js        # Hardcoded providers, 6 services, seed bookings
    ├── context/
    │   ├── AuthContext.jsx    # Session state, login, signup, role enforcement
    │   ├── NotificationContext.jsx # Slide-in toasts & unread bell dropdown
    │   └── BookingContext.jsx # Realtime Firestore listeners & pricing math
    ├── components/
    │   ├── Navbar.jsx         # ⚡ SmartServe logo, role-gated admin link, bell, avatar
    │   ├── Footer.jsx         # Non-clickable legal & copyright footer
    │   ├── ToastContainer.jsx # Slide-in toast notifications (5 colored types)
    │   ├── NotificationDropdown.jsx # Dropdown with unread badge count
    │   ├── StarRating.jsx     # Interactive & display star ratings
    │   ├── AccessDenied.jsx   # 403 Access Denied screen for wrong roles
    │   └── ReviewModal.jsx    # Completed booking customer review modal
    └── pages/
        ├── HomePage.jsx       # Hero, stats, 4-step process, popular cards, transparent pricing, CTA
        ├── ServicesPage.jsx   # 6 services with search & category filters
        ├── BookingFlowPage.jsx # 3-step booking flow, provider availability grid, peak slots, live pricing
        ├── MyBookingsPage.jsx # Customer bookings with status badges & review button
        ├── CustomerDashboard.jsx # Customer stats, recent activity, profile editor
        ├── ProviderDashboard.jsx # Provider stats, job status actions, weekly availability editor
        ├── AdminDashboard.jsx # Overview, Users, Providers, Bookings, Services, Analytics
        └── AuthPage.jsx       # Sign in / Sign up with demo auto-fill box
```

---

## 🚀 Getting Started Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
```

---

## 🌐 Deploy to Firebase Hosting

```bash
# Login to Firebase CLI
npx firebase login

# Initialize or select project
npx firebase use --add

# Deploy to Firebase Hosting & Firestore rules
npx firebase deploy
```

---

## 📦 Push to GitHub

To push this repository to your GitHub account:

```bash
# 1. Create a repository on GitHub (e.g. smartserve)
# 2. Add remote and push:
git remote add origin https://github.com/<YOUR_USERNAME>/smartserve.git
git branch -M main
git push -u origin main
```
