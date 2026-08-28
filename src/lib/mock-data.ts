import poster1 from "@/assets/poster-1.jpg";
import poster2 from "@/assets/poster-2.jpg";
import poster3 from "@/assets/poster-3.jpg";
import poster4 from "@/assets/poster-4.jpg";
import event1 from "@/assets/event-1.jpg";
import event2 from "@/assets/event-2.jpg";
import event3 from "@/assets/event-3.jpg";
import hero1 from "@/assets/hero-1.jpg";

export type Category = "Movies" | "Events" | "Plays" | "Sports" | "Stand-up Comedy";

export const categories: Category[] = [
  "Movies",
  "Events",
  "Plays",
  "Sports",
  "Stand-up Comedy",
];

export const cities = [
  "Mumbai",
  "Hyderabad",
  "Bangalore",
  "Delhi NCR",
  "Chennai",
  "Pune",
  "Kolkata",
  "Ahmedabad",
];

export type CastMember = { name: string; role: string; initials: string };

export type Title = {
  id: string;
  kind: "movie" | "event";
  category: Category;
  name: string;
  poster: string;
  backdrop: string;
  languages: string[];
  formats: string[];
  rating: number;
  votes: string;
  certification: string;
  duration: string;
  release: string;
  genres: string[];
  synopsis: string;
  cast: CastMember[];
  venue?: string;
  dateLabel?: string;
  priceFrom: number;
};

export const titles: Title[] = [
  {
    id: "nebula-protocol",
    kind: "movie",
    category: "Movies",
    name: "Nebula Protocol",
    poster: poster1,
    backdrop: hero1,
    languages: ["English", "Hindi", "Telugu"],
    formats: ["2D", "3D", "IMAX 3D"],
    rating: 8.9,
    votes: "142.3K",
    certification: "UA",
    duration: "2h 41m",
    release: "22 Aug, 2026",
    genres: ["Sci-Fi", "Action", "Thriller"],
    synopsis:
      "When a deep-space listening post picks up a signal that predates the solar system, Commander Ira Vance is pulled out of retirement for one last jump beyond the Kuiper belt. What her crew finds inside the crimson nebula is not a civilisation — it is a warning, encoded in the physics of the universe itself. As the protocol activates, Vance must decide whether humanity deserves the answer it has been screaming for.",
    cast: [
      { name: "Aria Menon", role: "Cmdr. Ira Vance", initials: "AM" },
      { name: "Dev Kapoor", role: "Lt. Rehan", initials: "DK" },
      { name: " Lucas Grey", role: "Dr. Holt", initials: "LG" },
      { name: "Sana Iyer", role: "Mission Control", initials: "SI" },
      { name: "Rohan Das", role: "Director", initials: "RD" },
    ],
    priceFrom: 190,
  },
  {
    id: "monsoon-letters",
    kind: "movie",
    category: "Movies",
    name: "Monsoon Letters",
    poster: poster2,
    backdrop: poster2,
    languages: ["Hindi", "Marathi"],
    formats: ["2D", "4K"],
    rating: 8.2,
    votes: "78.6K",
    certification: "UA",
    duration: "2h 12m",
    release: "15 Aug, 2026",
    genres: ["Romance", "Drama"],
    synopsis:
      "Two strangers keep missing each other across a rain-soaked Mumbai — until a stack of undelivered letters from 1994 begins to write their future. A tender, rain-lit story about timing, memory and the courage to stay.",
    cast: [
      { name: "Ishaan Rao", role: "Aditya", initials: "IR" },
      { name: "Meher Shah", role: "Naina", initials: "MS" },
      { name: "Kabir Sen", role: "Postmaster", initials: "KS" },
      { name: "Tara Nair", role: "Ruhi", initials: "TN" },
    ],
    priceFrom: 150,
  },
  {
    id: "crimson-alley",
    kind: "movie",
    category: "Movies",
    name: "Crimson Alley",
    poster: poster3,
    backdrop: poster3,
    languages: ["English", "Tamil", "Hindi"],
    formats: ["2D", "IMAX 3D"],
    rating: 7.8,
    votes: "54.1K",
    certification: "A",
    duration: "2h 05m",
    release: "29 Aug, 2026",
    genres: ["Crime", "Thriller", "Noir"],
    synopsis:
      "A burnt-out detective works a case the department closed twelve years ago. Every lead ends in the same neon alley, and every witness remembers a different man walking out of it.",
    cast: [
      { name: "Vikram Joshi", role: "Det. Salvi", initials: "VJ" },
      { name: "Nadia Khan", role: "Reyna", initials: "NK" },
      { name: "Arjun Pillai", role: "Informant", initials: "AP" },
    ],
    priceFrom: 170,
  },
  {
    id: "dragoon-tales",
    kind: "movie",
    category: "Movies",
    name: "Dragoon Tales",
    poster: poster4,
    backdrop: poster4,
    languages: ["English", "Hindi", "Telugu", "Kannada"],
    formats: ["2D", "3D"],
    rating: 8.5,
    votes: "96.4K",
    certification: "U",
    duration: "1h 46m",
    release: "08 Aug, 2026",
    genres: ["Animation", "Family", "Adventure"],
    synopsis:
      "A curious girl and a very anxious young dragon set out to return a stolen season to their valley. Warm, funny and impossibly pretty — a treat for the whole family.",
    cast: [
      { name: "Nira Bose", role: "Voice of Mira", initials: "NB" },
      { name: "Sam Antony", role: "Voice of Pip", initials: "SA" },
      { name: "Lea Fernandes", role: "Voice of Elder", initials: "LF" },
    ],
    priceFrom: 130,
  },
  {
    id: "sunburn-arena",
    kind: "event",
    category: "Events",
    name: "Sunburn Arena · Neon Nights",
    poster: event1,
    backdrop: event1,
    languages: ["English"],
    formats: ["Live"],
    rating: 9.1,
    votes: "31.2K",
    certification: "18+",
    duration: "5h",
    release: "12 Sep, 2026",
    genres: ["Music", "EDM", "Festival"],
    synopsis:
      "The biggest open-air electronic night of the year returns with a 360° stage, three arenas and a headline set that runs till sunrise.",
    cast: [
      { name: "DJ Halcyon", role: "Headliner", initials: "DH" },
      { name: "Nocturne", role: "Support", initials: "NO" },
      { name: "Aurea", role: "Opening", initials: "AU" },
    ],
    venue: "Mahalaxmi Race Course, Mumbai",
    dateLabel: "Sat, 12 Sep · 5:00 PM",
    priceFrom: 1499,
  },
  {
    id: "punchline-live",
    kind: "event",
    category: "Stand-up Comedy",
    name: "Punchline Live · Unfiltered",
    poster: event2,
    backdrop: event2,
    languages: ["Hindi", "English"],
    formats: ["Live"],
    rating: 8.7,
    votes: "12.8K",
    certification: "16+",
    duration: "1h 30m",
    release: "05 Sep, 2026",
    genres: ["Comedy", "Live Show"],
    synopsis:
      "A brand new hour of material, worked out on stage in front of you. No filter, no teleprompter, no mercy.",
    cast: [
      { name: "Rahul Vaid", role: "Performer", initials: "RV" },
      { name: "Simi Ghosh", role: "Opener", initials: "SG" },
    ],
    venue: "The Habitat, Khar West",
    dateLabel: "Fri, 05 Sep · 8:30 PM",
    priceFrom: 599,
  },
  {
    id: "premier-clash",
    kind: "event",
    category: "Sports",
    name: "Premier Clash · Final",
    poster: event3,
    backdrop: event3,
    languages: ["English", "Hindi"],
    formats: ["Live"],
    rating: 9.4,
    votes: "88.9K",
    certification: "U",
    duration: "4h",
    release: "20 Sep, 2026",
    genres: ["Cricket", "Sports"],
    synopsis:
      "The season finale under the lights. Two unbeaten sides, one trophy, and a stadium that has sold out every year for a decade.",
    cast: [
      { name: "Home XI", role: "Team", initials: "HX" },
      { name: "Challengers", role: "Team", initials: "CH" },
    ],
    venue: "Wankhede Stadium, Mumbai",
    dateLabel: "Sun, 20 Sep · 7:00 PM",
    priceFrom: 999,
  },
];

export const heroSlides = [
  {
    id: "nebula-protocol",
    image: hero1,
    tag: "Now Showing · IMAX 3D",
    title: "Nebula Protocol",
    subtitle: "The signal was never meant for us.",
  },
  {
    id: "sunburn-arena",
    image: event1,
    tag: "This September · Live",
    title: "Sunburn Arena",
    subtitle: "Neon Nights · Mumbai · 3 arenas",
  },
  {
    id: "premier-clash",
    image: event3,
    tag: "Sports · Final",
    title: "Premier Clash Final",
    subtitle: "Wankhede under the lights",
  },
];

export type Theater = {
  id: string;
  name: string;
  area: string;
  distance: string;
  cancellable: boolean;
  amenities: string[];
  shows: { time: string; format: string; status: "available" | "filling" | "almost"; price: number }[];
};

export const theaters: Theater[] = [
  {
    id: "pvr-icon",
    name: "PVR ICON: Phoenix Palladium",
    area: "Lower Parel",
    distance: "2.4 km",
    cancellable: true,
    amenities: ["Dolby Atmos", "Recliners", "Food Court"],
    shows: [
      { time: "09:15 AM", format: "2D", status: "available", price: 190 },
      { time: "12:40 PM", format: "IMAX 3D", status: "filling", price: 420 },
      { time: "04:20 PM", format: "3D", status: "available", price: 310 },
      { time: "07:50 PM", format: "IMAX 3D", status: "almost", price: 490 },
      { time: "11:10 PM", format: "2D", status: "available", price: 250 },
    ],
  },
  {
    id: "inox-atria",
    name: "INOX: Atria Mall",
    area: "Worli",
    distance: "4.1 km",
    cancellable: true,
    amenities: ["4K Laser", "Recliners", "Parking"],
    shows: [
      { time: "10:00 AM", format: "2D", status: "available", price: 160 },
      { time: "01:30 PM", format: "4K", status: "available", price: 220 },
      { time: "06:15 PM", format: "2D", status: "filling", price: 260 },
      { time: "09:45 PM", format: "4K", status: "almost", price: 330 },
    ],
  },
  {
    id: "cinepolis-vr",
    name: "Cinépolis: VR Mall",
    area: "Andheri West",
    distance: "8.7 km",
    cancellable: false,
    amenities: ["Dolby Atmos", "Food Court"],
    shows: [
      { time: "08:45 AM", format: "2D", status: "available", price: 140 },
      { time: "02:10 PM", format: "3D", status: "available", price: 240 },
      { time: "08:30 PM", format: "3D", status: "filling", price: 290 },
    ],
  },
  {
    id: "carnival-imax",
    name: "Carnival IMAX: Wadala",
    area: "Wadala",
    distance: "11.2 km",
    cancellable: true,
    amenities: ["IMAX", "Dolby Atmos", "Recliners", "Valet"],
    shows: [
      { time: "11:20 AM", format: "IMAX 3D", status: "available", price: 450 },
      { time: "03:55 PM", format: "IMAX 3D", status: "filling", price: 470 },
      { time: "10:30 PM", format: "IMAX 3D", status: "almost", price: 520 },
    ],
  },
];

export type FnbItem = {
  id: string;
  category: "Popcorn" | "Beverages" | "Combos" | "Snacks";
  name: string;
  description: string;
  price: number;
  emoji: string;
};

export const fnbItems: FnbItem[] = [
  { id: "p1", category: "Popcorn", name: "Salted Popcorn (Large)", description: "Freshly popped, lightly salted", price: 320, emoji: "🍿" },
  { id: "p2", category: "Popcorn", name: "Caramel Popcorn (Medium)", description: "Sweet caramel glaze", price: 280, emoji: "🍿" },
  { id: "p3", category: "Popcorn", name: "Cheese Popcorn (Large)", description: "Loaded cheddar dust", price: 350, emoji: "🧀" },
  { id: "b1", category: "Beverages", name: "Pepsi (Large)", description: "750 ml chilled", price: 260, emoji: "🥤" },
  { id: "b2", category: "Beverages", name: "Cold Coffee", description: "Double shot, whipped cream", price: 240, emoji: "☕" },
  { id: "b3", category: "Beverages", name: "Mineral Water", description: "500 ml", price: 60, emoji: "💧" },
  { id: "c1", category: "Combos", name: "Couple Combo", description: "2 popcorn tubs + 2 drinks", price: 749, emoji: "🎬" },
  { id: "c2", category: "Combos", name: "Family Feast", description: "Jumbo popcorn + 4 drinks + nachos", price: 1199, emoji: "🎉" },
  { id: "s1", category: "Snacks", name: "Loaded Nachos", description: "Salsa, cheese sauce, jalapeños", price: 330, emoji: "🌮" },
  { id: "s2", category: "Snacks", name: "Peri Peri Fries", description: "Crispy, spicy, addictive", price: 250, emoji: "🍟" },
  { id: "s3", category: "Snacks", name: "Veg Puff", description: "Flaky, hot from the oven", price: 120, emoji: "🥐" },
];

export const coupons = [
  { code: "FIRST150", label: "₹150 off on your first booking", discount: 150 },
  { code: "UPI50", label: "Flat ₹50 off paying via UPI", discount: 50 },
  { code: "WEEKEND100", label: "₹100 off on weekend shows", discount: 100 },
];

export const seatTiers = [
  { name: "Recliner", price: 690, rows: ["A", "B"], cols: 10 },
  { name: "Prime", price: 350, rows: ["C", "D", "E", "F"], cols: 16 },
  { name: "Classic", price: 210, rows: ["G", "H", "J", "K"], cols: 16 },
] as const;

/** Deterministic "sold" seats so the layout is stable across renders. */
export function isSeatSold(row: string, col: number) {
  const h = (row.charCodeAt(0) * 31 + col * 17) % 100;
  return h < 22;
}

export function getTitle(id: string) {
  return titles.find((t) => t.id === id);
}

export function inr(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}
