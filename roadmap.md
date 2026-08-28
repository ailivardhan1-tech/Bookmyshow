# bookgo — submission roadmap

## Day 1 — frontend (done)
- [x] `/auth` sign in + create account screen
- [x] Signed-out state on Profile with sign-in CTA
- [x] Sign-out from Profile header, session-aware bottom nav
- [x] Checkout requires sign-in before payment
- [x] Profile tabs: Upcoming / Cancelled
- [x] Booking cards link to the M-ticket
- [x] Cancel booking with confirmation dialog
- [x] Explore filters: category + language chips, empty state
- [x] Toast feedback (sign in, add snack, coupon, booking confirmed, seat limit)
- [x] Real site title and meta description (was the Lovable placeholder)
- [x] Search already existed in the top header

## Day 2 — backend (next)
- [ ] Enable Lovable Cloud
- [ ] Schema: profiles, titles, theaters, shows, bookings, booking_seats, fnb_items, booking_fnb
- [ ] RLS: public read on catalogue, per-user read/write on bookings
- [ ] Seed the existing mock catalogue as literal INSERTs
- [ ] Replace mock-data reads with database queries
- [ ] Real bookings written to the database, sold seats derived from booking_seats
- [ ] Swap the local auth store for Cloud auth (same interface)
- [ ] Publish
