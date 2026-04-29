import React, { useState, useEffect } from 'react';
import { SOFT, MID, HOT, DARK, BORDER, WHITE } from '../../constants/colors.js';
import { C } from '../../constants/styles.js';
import { DESTS } from '../../constants/data.js';
import SH from '../ui/SH.jsx';

const NUN = "'Plus Jakarta Sans',sans-serif";
const CAMREF = "1011l4ma3h";

const AIRPORTS = [
  { code:"IAH", label:"Houston, TX (IAH)",           lat:29.9902, lng:-95.3368 },
  { code:"HOU", label:"Houston Hobby, TX (HOU)",     lat:29.6454, lng:-95.2789 },
  { code:"DFW", label:"Dallas, TX (DFW)",            lat:32.8998, lng:-97.0403 },
  { code:"ATL", label:"Atlanta, GA (ATL)",           lat:33.6407, lng:-84.4277 },
  { code:"JFK", label:"New York, NY (JFK)",          lat:40.6413, lng:-73.7781 },
  { code:"LGA", label:"New York LaGuardia (LGA)",    lat:40.7772, lng:-73.8726 },
  { code:"ORD", label:"Chicago, IL (ORD)",           lat:41.9742, lng:-87.9073 },
  { code:"LAX", label:"Los Angeles, CA (LAX)",       lat:33.9425, lng:-118.4081 },
  { code:"MIA", label:"Miami, FL (MIA)",             lat:25.7959, lng:-80.2870 },
  { code:"SFO", label:"San Francisco, CA (SFO)",     lat:37.6213, lng:-122.3790 },
  { code:"DEN", label:"Denver, CO (DEN)",            lat:39.8561, lng:-104.6737 },
  { code:"PHX", label:"Phoenix, AZ (PHX)",           lat:33.4373, lng:-112.0078 },
  { code:"SEA", label:"Seattle, WA (SEA)",           lat:47.4502, lng:-122.3088 },
  { code:"BOS", label:"Boston, MA (BOS)",            lat:42.3656, lng:-71.0096 },
  { code:"DCA", label:"Washington DC (DCA)",         lat:38.8521, lng:-77.0377 },
  { code:"CLT", label:"Charlotte, NC (CLT)",         lat:35.2140, lng:-80.9431 },
  { code:"TPA", label:"Tampa, FL (TPA)",             lat:27.9755, lng:-82.5332 },
  { code:"MSY", label:"New Orleans, LA (MSY)",       lat:29.9934, lng:-90.2580 },
  { code:"AUS", label:"Austin, TX (AUS)",            lat:30.1975, lng:-97.6664 },
  { code:"SAT", label:"San Antonio, TX (SAT)",       lat:29.5337, lng:-98.4698 },
  { code:"MSP", label:"Minneapolis, MN (MSP)",       lat:44.8848, lng:-93.2223 },
  { code:"DTW", label:"Detroit, MI (DTW)",           lat:42.2162, lng:-83.3554 },
  { code:"PHL", label:"Philadelphia, PA (PHL)",      lat:39.8744, lng:-75.2424 },
  { code:"BWI", label:"Baltimore/DC (BWI)",          lat:39.1754, lng:-76.6682 },
  { code:"SAN", label:"San Diego, CA (SAN)",         lat:32.7338, lng:-117.1933 },
  { code:"PDX", label:"Portland, OR (PDX)",          lat:45.5898, lng:-122.5951 },
  { code:"STL", label:"St. Louis, MO (STL)",         lat:38.7487, lng:-90.3700 },
  { code:"BNA", label:"Nashville, TN (BNA)",         lat:36.1245, lng:-86.6782 },
  { code:"RDU", label:"Raleigh-Durham, NC (RDU)",    lat:35.8776, lng:-78.7875 },
  { code:"SLC", label:"Salt Lake City, UT (SLC)",    lat:40.7884, lng:-111.9778 },
];

function getNearestAirport(lat, lng) {
  let nearest = AIRPORTS[0], minDist = Infinity;
  for (const a of AIRPORTS) {
    const d = Math.hypot(a.lat - lat, a.lng - lng);
    if (d < minDist) { minDist = d; nearest = a; }
  }
  return nearest.code;
}

function buildExpediaUrl(from, to, depDate, retDate, adults) {
  const base = "https://www.expedia.com/Flights-Search";
  const p = new URLSearchParams({
    trip:    retDate ? "roundtrip" : "oneway",
    mode:    "search",
    adults:  String(adults),
    origin1: from,
    destination1: to,
    camref:  CAMREF,
  });
  if (depDate) p.set("departuredate1", depDate);
  if (retDate) p.set("returndate",     retDate);
  return `${base}?${p}`;
}

const usDests   = DESTS.filter(d => !d.international);
const intlDests = DESTS.filter(d =>  d.international);

export default function FlightsTab({ groupSize, initialDest }) {
  const [fromCode,       setFromCode]       = useState(() => localStorage.getItem("bh_airport") || "IAH");
  const [depDate,        setDepDate]        = useState("");
  const [retDate,        setRetDate]        = useState("");
  const [dest,           setDest]           = useState(initialDest || null);
  const [showDestPicker, setShowDestPicker] = useState(!initialDest);

  const selectedDest = DESTS.find(d => d.id === dest);
  const minDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (localStorage.getItem("bh_airport")) return;
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const code = getNearestAirport(coords.latitude, coords.longitude);
      setFromCode(code);
      localStorage.setItem("bh_airport", code);
    }, () => {});
  }, []);

  function search() {
    if (!selectedDest) return;
    window.open(buildExpediaUrl(fromCode, selectedDest.airportCode, depDate, retDate, groupSize), "_blank");
  }

  const field = {
    border: `1.5px solid ${BORDER}`, borderRadius: 12,
    padding: "12px 14px", marginBottom: 10,
  };
  const label = {
    fontFamily: NUN, fontSize: 10, fontWeight: 700,
    color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5,
  };

  return (
    <div>
      <SH title="Group Flight Search" sub="Search live prices on Expedia" />

      {/* ── From ── */}
      <div style={{ ...C, marginBottom: 12 }}>
        <div style={{ ...label, marginBottom: 8 }}>Flying from</div>
        <select
          value={fromCode}
          onChange={e => { setFromCode(e.target.value); localStorage.setItem("bh_airport", e.target.value); }}
          style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${BORDER}`, fontFamily:NUN, fontSize:13, color:DARK, background:WHITE, appearance:"none", cursor:"pointer" }}
        >
          {AIRPORTS.map(a => <option key={a.code} value={a.code}>{a.label}</option>)}
        </select>
      </div>

      {/* ── Destination ── */}
      <div style={{ ...C, marginBottom: 12 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: 8 }}>
          <div style={label}>Flying to</div>
          {dest && !showDestPicker && (
            <button onClick={() => setShowDestPicker(true)} style={{ fontSize:11, color:HOT, fontFamily:NUN, background:"none", border:"none", cursor:"pointer", textDecoration:"underline", padding:0 }}>Change</button>
          )}
        </div>
        {dest && !showDestPicker ? (
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:10, border:`1.5px solid ${HOT}`, background:SOFT }}>
            <div>
              <div style={{ fontFamily:NUN, fontSize:13, fontWeight:700, color:DARK }}>{selectedDest?.name}</div>
              <div style={{ fontFamily:NUN, fontSize:10, color:HOT, opacity:0.8 }}>{groupSize} travelers</div>
            </div>
          </div>
        ) : (
          <select
            value={dest || ""}
            onChange={e => { setDest(e.target.value || null); setShowDestPicker(false); }}
            style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${BORDER}`, fontFamily:NUN, fontSize:13, color:DARK, background:WHITE, appearance:"none", cursor:"pointer" }}
          >
            <option value="">Choose a destination…</option>
            <optgroup label="US Cities">{usDests.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</optgroup>
            <optgroup label="International">{intlDests.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</optgroup>
          </select>
        )}
      </div>

      {/* ── Dates ── */}
      <div style={{ ...C, marginBottom: 14, display:"flex", gap:10 }}>
        <div style={{ flex:1, minWidth:0, overflow:"hidden" }}>
          <div style={{ ...label, marginBottom:6 }}>Departure</div>
          <div style={{ overflow:"hidden", borderRadius:10 }}>
            <input type="date" value={depDate} min={minDate}
              onChange={e => { setDepDate(e.target.value); if (retDate && e.target.value >= retDate) setRetDate(""); }}
              style={{ width:"100%", padding:"10px 8px", borderRadius:10, border:`1.5px solid ${depDate?HOT:BORDER}`, fontFamily:NUN, fontSize:13, color:DARK, background:WHITE, boxSizing:"border-box", display:"block" }}
            />
          </div>
        </div>
        <div style={{ flex:1, minWidth:0, overflow:"hidden" }}>
          <div style={{ ...label, marginBottom:6 }}>Return <span style={{ textTransform:"none", fontWeight:400, color:"#ccc" }}>(opt)</span></div>
          <div style={{ overflow:"hidden", borderRadius:10 }}>
            <input type="date" value={retDate} min={depDate || minDate}
              onChange={e => setRetDate(e.target.value)}
              style={{ width:"100%", padding:"10px 8px", borderRadius:10, border:`1.5px solid ${retDate?HOT:BORDER}`, fontFamily:NUN, fontSize:13, color:DARK, background:WHITE, boxSizing:"border-box", display:"block" }}
            />
          </div>
        </div>
      </div>

      {/* ── Search CTA ── */}
      <div style={{ ...C, background:SOFT, border:`1.5px solid ${MID}`, marginBottom:14 }}>
        {selectedDest ? (
          <>
            <div style={{ fontFamily:NUN, fontSize:14, fontWeight:700, color:DARK, marginBottom:4 }}>
              {fromCode} → {selectedDest.name}
            </div>
            <div style={{ fontFamily:NUN, fontSize:11, color:HOT, marginBottom:16, opacity:0.85 }}>
              {groupSize} travelers · {depDate || "flexible dates"}{retDate ? ` → ${retDate}` : ""}
            </div>
            <button onClick={search} style={{
              width:"100%", padding:"15px", borderRadius:50,
              background:`linear-gradient(135deg,#f472b0,${HOT})`,
              color:WHITE, border:"none", fontFamily:NUN,
              fontSize:15, fontWeight:800, cursor:"pointer",
              letterSpacing:"0.2px",
              boxShadow:"0 4px 16px rgba(244,114,176,0.4)",
            }}>
              Search Flights
            </button>
            <div style={{ fontFamily:NUN, fontSize:10, color:"#bbb", marginTop:10, textAlign:"center" }}>
              Real-time prices · Booking handled securely on Expedia.com
            </div>
          </>
        ) : (
          <div style={{ textAlign:"center", padding:"8px 0" }}>
            <div style={{ fontFamily:NUN, fontSize:13, fontWeight:700, color:DARK }}>Select a destination above</div>
            <div style={{ fontFamily:NUN, fontSize:11, color:HOT, marginTop:4, opacity:0.75 }}>Then we'll pull up live flights for your group</div>
          </div>
        )}
      </div>

      {/* Expedia branding */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginTop:8 }}>
        <div style={{ fontFamily:NUN, fontSize:11, color:"#bbb" }}>Powered by</div>
        <div style={{ fontFamily:NUN, fontSize:13, fontWeight:800, color:"#003087" }}>expedia</div>
      </div>
    </div>
  );
}
