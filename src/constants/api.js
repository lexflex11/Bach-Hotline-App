// ─── YOUR ANTHROPIC API KEY ───────────────────────────────────────────────────
// Step 1: Go to console.anthropic.com → API Keys → Create Key
// Step 2: Paste your key between the quotes below (starts with sk-ant-)
// Step 3: Re-upload this file to GitHub — Vercel will rebuild automatically
// Cost: ~$10-30/month. You get $5 free credit to test with.
export const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_KEY || "";
// ─────────────────────────────────────────────────────────────────────────────

export const AFFILIATE = {
  // Your affiliate IDs — replace "YOUR_TAG" with your real ID after signing up
  expedia:  "YOUR_EXPEDIA_TAG",
  booking:  "YOUR_BOOKING_TAG",
  airbnb:   "YOUR_AIRBNB_TAG",
  vrbo:     "YOUR_VRBO_TAG",
  kayak:    "YOUR_KAYAK_TAG",
};

// ─── IMAGE PROXY ──────────────────────────────────────────────────────────────
export const px = url => `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=400&h=400&fit=cover&output=webp`;

// ─── AFFILIATE LINK BUILDERS ──────────────────────────────────────────────────
// These send users to real booking sites with search pre-filled.
// Replace the tag values with your actual affiliate IDs once approved.
// Sign up: partnerize.com/expedia | booking.com/affiliate | airbnb.com/d/affiliates | vrbo.com/affiliates

// Build a real Expedia flight search URL with destination pre-filled
export function flightUrl(to, date, groupSize) {
  // This sends users directly to Expedia flight search
  // Replace with your affiliate URL once you have your tag
  const dest = to.replace(" ", "-").toLowerCase();
  return `https://www.expedia.com/Flights-Search?leg1=from%3ANYC%2Cto%3A${encodeURIComponent(to)}&passengers=a${groupSize}&mode=search&trip=oneway`;
}

// Build a real Airbnb search URL
export function airbnbUrl(city, nights, guests) {
  const checkIn  = new Date(Date.now() + 90*24*60*60*1000).toISOString().split("T")[0];
  const checkOut = new Date(Date.now() + (90+nights)*24*60*60*1000).toISOString().split("T")[0];
  return `https://www.airbnb.com/s/${encodeURIComponent(city)}/homes?checkin=${checkIn}&checkout=${checkOut}&adults=${guests}&min_bedrooms=3`;
}

// Build a real Vrbo search URL
export function vrboUrl(city, nights, guests) {
  return `https://www.vrbo.com/search?destination=${encodeURIComponent(city)}&adults=${guests}&minSleeps=${guests}`;
}

// Build a real Booking.com hotel search URL
export function bookingUrl(city, nights, guests) {
  const checkIn  = new Date(Date.now() + 90*24*60*60*1000).toISOString().split("T")[0];
  const checkOut = new Date(Date.now() + (90+nights)*24*60*60*1000).toISOString().split("T")[0];
  return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city)}&checkin=${checkIn}&checkout=${checkOut}&group_adults=${guests}&group_children=0&no_rooms=1`;
}

export const opentableUrl = (name, city) =>
  `https://www.opentable.com/s?covers=8&query=${encodeURIComponent(name+" "+city)}`;

export const viatorUrl = (name, city) =>
  `https://www.viator.com/search/bachelorette?q=${encodeURIComponent(name+" "+city)}`;

export const gygUrl = (name, city) =>
  `https://www.getyourguide.com/s/?q=${encodeURIComponent(name+" "+city)}`;
