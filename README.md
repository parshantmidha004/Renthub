# 🏠 RentHub — Apartment Rental Platform (Angular Assignment: Basics)

A fully functional apartment rental web application built with **Angular 21** as part of the
Nagarro **RentHub Basics** assignment.

Renters can browse, search, save favourites and ask landlords questions, while landlords can
publish detailed apartment listings — including photos, rent, amenities and contact details.

> 🔗 **GitHub repository:** https://github.com/parshantmidha004/Renthub
> 🌐 **Deployed application:** `https://<your-app>.netlify.app` _(replace with your deployment URL)_

---

## ✨ Features delivered (per the assignment requirements)

| Requirement | Status |
| --- | --- |
| User registration & authentication (login / register, auth guards) | ✅ |
| Apartment listings — create, update, delete, manage (draft or published) | ✅ |
| Comments with **reply** on every listing | ✅ |
| Search & filter on the Home screen (text, city, price range, amenities) | ✅ |
| Featured listings **carousel** + paginated listing grid | ✅ |
| Quick actions — **View Details** and **Mark as Favourites** | ✅ |
| Interest expression — favourites **and** direct inquiries to landlords | ✅ |
| **Form validation everywhere** (required, format, ranges, cross-field) | ✅ |
| Reactive forms + intuitive, responsive **Bootstrap 5** UI | ✅ |
| Unit tests for **1 component, 1 service and 1 module** | ✅ |
| Latest Angular CLI (21.x) + lazy-loaded routes | ✅ |

### 🎁 Bonus — attempted
- **Preview & Submit screen** for a new post (staged draft → summary → confirm & publish).
- **Draft posts** that can be saved and finished later from *My Posts*.
- Toasts, empty states, sticky filters, autoplaying carousel, "time ago" labels.

---

## 🔑 Demo credentials

| Role | Email | Password |
| --- | --- | --- |
| Landlord | `landlord@renthub.com` | `Demo@123` |
| Renter | `demo@renthub.com` | `Demo@123` |

> You can also register your own account from the **Register** page.

---

## 🚀 Running locally

```bash
npm install
npm start          # http://localhost:4200
npm run build      # production build → dist/renthub
npm test           # runs the Vitest unit tests
```

## 🧪 Tests

The suite covers the three required layers:

- **Component** — `listing-card.spec.ts` (rendering, favourite toggle)
- **Service** — `auth.service.spec.ts` & `listing.service.spec.ts` (auth + filter/pagination)
- **Module** — `shared.module.spec.ts` (NgModule that exports shared pipes)

## 🗂️ Project structure

```
src/app/
├─ core/            # models, services, guards, seed data
├─ features/
│  ├─ auth/         # login, register
│  ├─ home/         # carousel + search/filter/sort + pagination
│  ├─ listings/     # create/edit form, detail, comments, preview-submit (bonus)
│  ├─ profile/      # my posts + favourites
│  └─ not-found/
└─ shared/          # navbar, footer, listing-card, toasts, pipes, NgModule
```

## 🛠️ Tech stack

- Angular **21.2** (standalone components, signals, zoneless, view transitions)
- Bootstrap **5** + Bootstrap Icons
- Vitest (via `@angular/build:unit-test`) for unit testing
- Persistence is `localStorage` (demo app, no backend required)

---

*Submitted as the Nagarro "RentHub Basics" (L1) Angular assignment.*
