# EventLogix (evinzoo)

> **Event Service & Logistics Management Web Application**  
> Converted from Stitch Project ID: `692636071627324383` (Event Service Manager / Executive Logistics)

---

## 🚀 Overview

**EventLogix** is a high-end corporate event service and logistics booking platform built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS**. It connects enterprise event planners with premier catering, executive ground transportation, concert-grade staging & AV, and professional event security providers.

---

## 📱 Features & Screens Implemented

1. **Landing Page (`LandingPage.tsx`)**:
   - High-impact search hero for services and locations.
   - High-demand category pills (*Catering*, *Transport*, *Staging & AV*, *Security*).
   - Staggered featured providers with rating badges, starting prices, and instant reservation modal.
   - Provider recruitment CTA and corporate footer.

2. **Marketplace / Service Discovery (`MarketplacePage.tsx`)**:
   - Filterable provider listings by category and search keyword.
   - Availability and verification indicators.
   - Instant booking flow.

3. **Provider Dashboard (`DashboardPage.tsx`)**:
   - Executive metrics: Gross Revenue (\$12.4k+), Total Bookings (184), Views (1.2k) with trend percentages.
   - Upcoming Bookings queue with quick status actions (Accept, Decline).
   - Weekly Earnings interactive overview chart.
   - Recent Activity feed.

4. **Booking Management (`BookingsPage.tsx`)**:
   - Multi-status tabbed filter: *All*, *Pending*, *Confirmed*, *In-Progress*.
   - Search bookings by client name or reference code.
   - Contract value display, scheduled date, and logistics notes.
   - Interactive Invoice modal with simulated receipt download.

5. **Service Catalog (`ServiceCatalogPage.tsx`)**:
   - Manage public service packages with pricing, billing units, and descriptions.
   - Clickable *Active* / *Draft* status toggles.
   - Edit package modal and floating action button (FAB) for adding new packages.

6. **Account & Operations Hub (`AccountPage.tsx`)**:
   - Provider identity header (*Elite Events Co.*, ID: 8842) with live marketplace toggle switch.
   - Profile management for administrator *Sarah Jenkins*.
   - Operations shortcuts (*Service Catalog*, *Bookings Queue*, *Earnings & Analytics*, *Staff Roster*, *Equipment Stock*, *Preferences*).
   - Sign out and role toggle.

7. **Authentication Flow (`LoginPage.tsx` & `SignupPage.tsx`)**:
   - Modern transactional login and sign-up pages.
   - One-click Google OAuth demo authentication.
   - Dummy login and signup that persist state to `localStorage`.

8. **Dual View Experience (Desktop & Mobile Simulation)**:
   - Fluid desktop responsive layout with navigation bar and footer.
   - **Mobile View (390px)** toggle in the top bar to preview the exact mobile viewport designed in Stitch.

---

## 🛠️ Technology Stack

- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with Stitch *Executive Logistics* design tokens (Deep Navy `#0f172a`, Emerald Green `#10b981`, Slate `#505f76`, and clean surface layers).
- **Typography & Icons**: Google Fonts ([Inter](https://fonts.google.com/specimen/Inter)) & [Material Symbols Outlined](https://fonts.google.com/icons).
- **Persistence**: Browser `localStorage` with initial mock data.

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Running Locally

1. Open a terminal in the project directory:
   ```bash
   cd "d:\Abhi Dev Projects\Web Projects\evinzoo"
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   *(On Windows PowerShell with script restriction, run: `npm.cmd run dev`)*

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Production Build

To compile a production bundle:
```bash
npm.cmd run build
```

To preview the production build locally:
```bash
npm.cmd run preview
```
