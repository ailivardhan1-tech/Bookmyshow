# bookgo — 2-Day Submission Plan

## What already exists (frontend, mock data)

The booking journey is already built end-to-end on mock data:

| Screen | Route | State |
| --- | --- | --- |
| Home / hero carousel | `/` | Done |
| Explore + categories | `/explore` | Done |
| Title detail (cast, synopsis) | `/title/$id` | Done |
| Showtimes / theatre list | `/showtimes/$id` | Done |
| Seat selection | `/seats/$id` | Done |
| Food & beverages | `/fnb/$id` | Done |
| Checkout + coupons | `/checkout/$id` | Done |
| M-Ticket with QR | `/ticket/$ref` | Done |
| Profile / bookings | `/profile` | Done |

Everything lives in `src/lib/mock-data.ts` and an in-memory booking store, so data
resets on refresh and there are no user accounts.

## Frontend gaps to close first (Day 1)

These are the pieces a reviewer will look for that are currently missing.

### 1. Auth screens (highest priority — blocks backend work)
- `/auth` route with Sign in / Sign up tabs (email + password).
- Signed-out state on the Profile tab with a "Sign in" CTA.
- Logout button in the profile header.
- Protected area for bookings so tickets belong to a real user.

### 2. Search
- Search screen or sheet reachable from the top header.
- Filter by name, filter chips for category/language.
- Empty state when nothing matches.

### 3. Booking management
- Booking detail view from the profile list (currently the cards are not clickable).
- Cancel booking action with a confirm dialog.
- Tabs on Profile: Upcoming vs Completed/Cancelled.

### 4. Polish that reads as "finished"
- Loading skeletons on Home / Explore / Title.
- Toast feedback on add-to-cart, coupon applied, booking confirmed, errors.
- Not-found page for bad title ids.
- Seat-selection rules (max 10 seats, block the gap-of-one).

## Backend (Day 2)

Only after the frontend above is in place.

1. **Enable Lovable Cloud** — database, auth and storage in one step.
2. **Schema**
   - `profiles` (id → auth user, name, phone, avatar)
   - `titles`, `theaters`, `shows` (show = title + theatre + date + time + price)
   - `bookings` (user, show, total, status, reference)
   - `booking_seats` (booking, seat id) with a unique constraint per show so a
     seat cannot be double-booked
   - `fnb_items` and `booking_fnb`
   - Row-level security: public read on catalogue tables, per-user read/write on
     bookings.
3. **Seed** the existing mock titles, theatres, shows and F&B rows so the app
   looks populated the moment it loads.
4. **Wire the app** — replace `mock-data.ts` reads with database queries, make
   the booking store write real rows, and derive sold seats from
   `booking_seats` instead of the hash function.
5. **Real auth** — sign up / sign in / sign out against Cloud, profile row
   created automatically on signup.

## Suggested schedule

**Day 1 (Saturday)** — auth screens, search, booking management, polish.
**Day 2 (Sunday morning)** — Cloud, schema, seed data.
**Day 2 (Sunday afternoon)** — wire screens to the database, test the full
booking flow, publish.

## Cut list if time runs short

Drop these before dropping anything above: F&B persistence (keep it visual),
coupon validation server-side, avatar uploads, payment integration (keep the
mock payment step).
