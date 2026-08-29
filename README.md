# Remix of Remix of Remix of Showtime Hub

Build a modern, production-ready, mobile-first movie and event booking web app inspired by BookMyShow, designed as a full-featured web app suitable for PWA/APK wrapping.



### Design System & Styling

- Theme: Sleek, dark-mode first UI (deep charcoal `#0F172A` background, card surfaces `#1E293B`, vibrant crimson/red accents `#E11D48`, neutral crisp text).

- Aesthetics: Clean card layouts, rounded corners (rounded-2xl), subtle border glows, high-contrast typography, crisp Lucide icons, and micro-animations for button presses and tab switches.

- Layout: Mobile viewport optimized (app container view on desktop with option to view responsive desktop version).



### Core Features & Screens



1. Top Navigation & Header:

   - Location Selector dropdown modal (e.g., Mumbai, Hyderabad, Bangalore, Delhi) with search input.

   - Search Bar modal with instant search filter across movies, events, and venues.

   - Notification Bell icon and User Profile avatar button.



2. Home Screen:

   - Top Category Filter Bar: Movies, Events, Plays, Sports, Stand-up Comedy.

   - Hero Featured Banner Carousel: Auto-sliding high-res event/movie banners with "Book Now" buttons.

   - "Recommended Movies" Section: Horizontal/Grid view showing poster, movie title, language tags (Hindi, English, Telugu, etc.), format badges (2D, 3D, IMAX 3D), rating score (e.g., 8.5/10 with star), and vote count.

   - "Events & Outdoor Experiences" Section: Card layout with date, venue, and price starting range.



3. Movie / Event Detail Page:

   - Full-width hero cover backdrop with video trailer preview launcher modal.

   - Metadata overlay: Title, certification badge (UA, A), duration, release date, genre tags.

   - Synopsis accordion / read-more expansion.

   - Cast & Crew horizontal scroll cards with photos and role names.

   - Ratings & User Reviews summary card with write-a-review button.

   - Fixed Bottom Bar: Prominent "Book Tickets" CTA button triggering venue/showtime selection.



4. Showtime & Theater Selection Screen:

   - Sticky Horizontal Date Picker (e.g., Today, Tomorrow, Fri 28 Aug, Sat 29 Aug).

   - Filter Chips: Formats (IMAX 3D, 2D, 4K), Price range, Show timings (Morning, Afternoon, Evening, Night).

   - Theater List Cards: Cinema name, distance/neighborhood, cancellation policy indicator, amenities badges (Dolby Atmos, Recliners, Food Court).

   - Interactive Showtime Chips: Color-coded availability (Green = Available, Orange = Filling Fast, Red = Almost Full).



5. Interactive Seat Layout Selector:

   - Visual Screen Bar indicator ("Screen This Way" curved graphic).

   - Multi-tier seat layout grid: Recliner (Top tier), Prime (Middle tier), Classic (Bottom tier).

   - Interactive Seat State Toggle: Available, Selected (highlighted accent color), Sold/Booked (disabled grayed out).

   - Legend bar showing pricing tiers and status colors.

   - Live Bottom Drawer Summary: Selected seat numbers (e.g., Row F 10, F 11), seat count, total subtotal, and "Proceed to F&B" CTA button.



6. Food & Beverages (F&B) Add-on Screen:

   - Tabbed Categories: Popcorn, Beverages, Combos, Snacks.

   - Item Cards with image, item name, price, description, and + / - counter controls.

   - "Skip" option at top right and "Proceed to Checkout" sticky bottom bar.



7. Checkout & Payment Summary Screen:

   - Booking Details Card: Movie name, poster thumbnail, theater name, date, time, screen number, seats.

   - Price Breakdown Dropdown: Ticket total, Convenience Fee, F&B total, Taxes.

   - Promo Code / Offers Section: Input field with apply button + list of available discount coupons.

   - Payment Option Selector: UPI (Google Pay, PhonePe, Paytm), Credit/Debit Card form, Net Banking, Digital Wallets.

   - Timer Countdown banner ("Complete payment in 09:59").



8. Digital Ticket / M-Ticket Screen (Post Payment):

   - Ticket Pass Card with generated QR Code and Barcode for venue scanning.

   - Booking Reference ID, auditorium number, seat numbers, gate entry info.

   - Action Buttons: "Add to Google Wallet/Calendar", "Download PDF", "Share Ticket", "Get Directions to Theater".



9. User Profile & Booking History:

   - "My Bookings" tab showing upcoming active tickets and past booking history with "View Ticket" modals.

   - Saved Payment Methods & Preferred Cinema settings.



### Interactive Mock Data & State

- Populate all screens with rich sample movie data (posters, descriptions, cast, showtimes) and realistic theater seat layouts so the flow from discovery to ticket generation is fully playable.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/699e3689-23c3-4625-bc30-a4126ddf50bc).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
