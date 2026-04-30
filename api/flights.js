// Vercel serverless function — proxies Travelpayouts Flight API
// Token stays server-side, never exposed to the browser

const MARKER = "523908";

const AIRLINE_NAMES = {
  WN:"Southwest", AA:"American Airlines", DL:"Delta", UA:"United",
  B6:"JetBlue", NK:"Spirit", F9:"Frontier", AS:"Alaska Airlines",
  G4:"Allegiant", SY:"Sun Country", HA:"Hawaiian", VX:"Virgin America",
  AC:"Air Canada", WS:"WestJet", AM:"Aeromexico", MX:"Breeze",
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { from, to, date, returnDate, adults = "1" } = req.query;

  if (!from || !to) {
    return res.status(400).json({ error: "Missing params: from, to" });
  }

  const token = process.env.TP_API_TOKEN;
  if (!token) {
    return res.status(500).json({ error: "Missing TP_API_TOKEN — add it in Vercel Environment Variables" });
  }

  try {
    const numAdults = Math.max(1, Math.min(9, parseInt(adults) || 1));
    const fromCode  = from.toUpperCase();
    const toCode    = to.toUpperCase();

    const params = new URLSearchParams({
      origin:      fromCode,
      destination: toCode,
      currency:    "usd",
      token,
      limit:       "20",
    });

    // Use month format (YYYY-MM) for the cheap prices API
    if (date)       params.set("depart_date", date.substring(0, 7));
    if (returnDate) params.set("return_date",  returnDate.substring(0, 7));

    const response = await fetch(
      `https://api.travelpayouts.com/v1/prices/cheap?${params}`
    );
    const data = await response.json();

    if (!response.ok || !data.success) {
      return res.status(500).json({ error: data.message || "Flight search failed" });
    }

    // API returns data keyed by destination code, then by index "0","1",...
    const destData = data.data?.[toCode] || {};

    const flights = Object.values(destData).map((f, i) => {
      const dep = f.departure_at ? new Date(f.departure_at) : null;
      const ret = f.return_at    ? new Date(f.return_at)    : null;

      // Build Aviasales deep link with affiliate marker
      const depPart = dep
        ? `${String(dep.getDate()).padStart(2,"0")}${String(dep.getMonth()+1).padStart(2,"0")}`
        : "0101";
      const retPart = ret
        ? `${String(ret.getDate()).padStart(2,"0")}${String(ret.getMonth()+1).padStart(2,"0")}`
        : null;

      const bookingUrl = retPart
        ? `https://www.aviasales.com/search/${fromCode}${depPart}/${toCode}${retPart}/${numAdults}1?marker=${MARKER}`
        : `https://www.aviasales.com/search/${fromCode}${depPart}/${toCode}${numAdults}1?marker=${MARKER}`;

      return {
        id:          i,
        airline:     AIRLINE_NAMES[f.airline] || f.airline || "Unknown Airline",
        airlineCode: f.airline || "??",
        price:       Math.round(f.price),
        totalPrice:  Math.round(f.price * numAdults),
        stops:       f.transfers ?? 0,
        departureAt: dep ? dep.toISOString() : null,
        returnAt:    ret ? ret.toISOString() : null,
        bookingUrl,
      };
    }).sort((a, b) => a.price - b.price);

    return res.status(200).json({ flights, groupSize: numAdults });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
