import React, { useState, useEffect } from 'react';
import { HOT, DARK, WHITE, BORDER, SOFT, MID } from '../../constants/colors.js';
import { C } from '../../constants/styles.js';
import { DESTS } from '../../constants/data.js';
import SH from '../ui/SH.jsx';

const NUN = "'Plus Jakarta Sans',sans-serif";

const AIRPORTS = [
  { code:"IAH", label:"Houston, TX (IAH)" },
  { code:"HOU", label:"Houston Hobby, TX (HOU)" },
  { code:"DFW", label:"Dallas, TX (DFW)" },
  { code:"ATL", label:"Atlanta, GA (ATL)" },
  { code:"JFK", label:"New York, NY (JFK)" },
  { code:"LGA", label:"New York LaGuardia (LGA)" },
  { code:"ORD", label:"Chicago, IL (ORD)" },
  { code:"LAX", label:"Los Angeles, CA (LAX)" },
  { code:"MIA", label:"Miami, FL (MIA)" },
  { code:"SFO", label:"San Francisco, CA (SFO)" },
  { code:"DEN", label:"Denver, CO (DEN)" },
  { code:"PHX", label:"Phoenix, AZ (PHX)" },
  { code:"SEA", label:"Seattle, WA (SEA)" },
  { code:"BOS", label:"Boston, MA (BOS)" },
  { code:"DCA", label:"Washington DC (DCA)" },
  { code:"CLT", label:"Charlotte, NC (CLT)" },
  { code:"TPA", label:"Tampa, FL (TPA)" },
  { code:"MSY", label:"New Orleans, LA (MSY)" },
  { code:"AUS", label:"Austin, TX (AUS)" },
  { code:"SAT", label:"San Antonio, TX (SAT)" },
  { code:"MSP", label:"Minneapolis, MN (MSP)" },
  { code:"DTW", label:"Detroit, MI (DTW)" },
  { code:"PHL", label:"Philadelphia, PA (PHL)" },
  { code:"BWI", label:"Baltimore/DC (BWI)" },
  { code:"SAN", label:"San Diego, CA (SAN)" },
  { code:"PDX", label:"Portland, OR (PDX)" },
  { code:"BNA", label:"Nashville, TN (BNA)" },
  { code:"RDU", label:"Raleigh-Durham, NC (RDU)" },
  { code:"SLC", label:"Salt Lake City, UT (SLC)" },
  { code:"STL", label:"St. Louis, MO (STL)" },
];

const label = {
  fontFamily: NUN, fontSize: 10, fontWeight: 700,
  color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6,
};

function fmt(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { weekday:"short", month:"short", day:"numeric" });
}

function StopBadge({ stops }) {
  const text  = stops === 0 ? "Nonstop" : stops === 1 ? "1 Stop" : `${stops} Stops`;
  const color = stops === 0 ? "#2e7d32" : stops === 1 ? "#c9612a" : HOT;
  return (
    <span style={{ fontFamily:NUN, fontSize:10, fontWeight:700, color,
      background: stops === 0 ? "#e8f5e9" : stops === 1 ? "#fff3e0" : "#ffe7f9",
      padding:"2px 8px", borderRadius:20 }}>
      {text}
    </span>
  );
}

function FlightCard({ f, groupSize }) {
  return (
    <div style={{ border:`1.5px solid ${BORDER}`, borderRadius:16, padding:"16px 16px 14px", marginBottom:12, background:WHITE }}>
      {/* Airline + price row */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <div>
          <div style={{ fontFamily:NUN, fontSize:14, fontWeight:800, color:DARK }}>{f.airline}</div>
          <div style={{ marginTop:4 }}><StopBadge stops={f.stops} /></div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontFamily:NUN, fontSize:20, fontWeight:900, color:HOT }}>${f.price}<span style={{ fontSize:11, fontWeight:600, color:"#aaa" }}>/person</span></div>
          <div style={{ fontFamily:NUN, fontSize:10, color:"#999", marginTop:2 }}>Total for {groupSize}: <strong style={{ color:DARK }}>${f.totalPrice}</strong></div>
        </div>
      </div>

      {/* Dates */}
      {f.departureAt && (
        <div style={{ fontFamily:NUN, fontSize:11, color:"#888", marginBottom:12 }}>
          Departs {fmt(f.departureAt)}{f.returnAt ? ` · Returns ${fmt(f.returnAt)}` : ""}
        </div>
      )}

      <button
        onClick={() => window.open(f.bookingUrl, "_blank")}
        style={{
          width:"100%", padding:"12px", borderRadius:50,
          background:`linear-gradient(135deg,#f472b0,${HOT})`,
          color:WHITE, border:"none", fontFamily:NUN,
          fontSize:13, fontWeight:800, cursor:"pointer",
          boxShadow:"0 3px 12px rgba(230,101,130,0.4)",
        }}
      >
        Book This Flight
      </button>
    </div>
  );
}

export default function FlightsTab({ groupSize, initialDest }) {
  const [fromCode,       setFromCode]       = useState(() => localStorage.getItem("bh_airport") || "IAH");
  const [dest,           setDest]           = useState(initialDest || null);
  const [showDestPicker, setShowDestPicker] = useState(!initialDest);
  const [depDate,        setDepDate]        = useState("");
  const [retDate,        setRetDate]        = useState("");
  const [flights,        setFlights]        = useState(null);
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState(null);

  const selectedDest = DESTS.find(d => d.id === dest);
  const minDate      = new Date().toISOString().split("T")[0];

  const usDests   = DESTS.filter(d => !d.international);
  const intlDests = DESTS.filter(d =>  d.international);

  async function search() {
    if (!selectedDest) return;
    setLoading(true);
    setError(null);
    setFlights(null);
    try {
      const params = new URLSearchParams({
        from:   fromCode,
        to:     selectedDest.airportCode,
        adults: String(groupSize),
      });
      if (depDate)  params.set("date",       depDate);
      if (retDate)  params.set("returnDate",  retDate);

      const res  = await fetch(`/api/flights?${params}`);
      const data = await res.json();

      if (data.error) { setError(data.error); return; }
      setFlights(data.flights || []);
    } catch (e) {
      setError("Could not load flights. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <SH title="Group Flight Search" sub="Real-time flights for your crew" />

      {/* From */}
      <div style={{ ...C, marginBottom:12 }}>
        <div style={label}>Flying from</div>
        <select
          value={fromCode}
          onChange={e => { setFromCode(e.target.value); localStorage.setItem("bh_airport", e.target.value); }}
          style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${BORDER}`, fontFamily:NUN, fontSize:13, color:DARK, background:WHITE, appearance:"none", cursor:"pointer" }}
        >
          {AIRPORTS.map(a => <option key={a.code} value={a.code}>{a.label}</option>)}
        </select>
      </div>

      {/* To */}
      <div style={{ ...C, marginBottom:12 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
          <div style={label}>Flying to</div>
          {dest && !showDestPicker && (
            <button onClick={() => setShowDestPicker(true)} style={{ fontSize:11, color:HOT, fontFamily:NUN, background:"none", border:"none", cursor:"pointer", textDecoration:"underline", padding:0 }}>Change</button>
          )}
        </div>
        {dest && !showDestPicker ? (
          <div style={{ padding:"10px 12px", borderRadius:10, border:`1.5px solid ${HOT}`, background:SOFT }}>
            <div style={{ fontFamily:NUN, fontSize:13, fontWeight:700, color:DARK }}>{selectedDest?.name}</div>
            <div style={{ fontFamily:NUN, fontSize:10, color:HOT, opacity:0.8, marginTop:2 }}>{groupSize} travelers</div>
          </div>
        ) : (
          <select
            value={dest || ""}
            onChange={e => { setDest(e.target.value || null); setShowDestPicker(false); setFlights(null); }}
            style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${BORDER}`, fontFamily:NUN, fontSize:13, color:DARK, background:WHITE, appearance:"none", cursor:"pointer" }}
          >
            <option value="">Choose a destination…</option>
            <optgroup label="US Cities">{usDests.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</optgroup>
            <optgroup label="International">{intlDests.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</optgroup>
          </select>
        )}
      </div>

      {/* Dates */}
      <div style={{ ...C, marginBottom:14, display:"flex", gap:10 }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ ...label, marginBottom:6 }}>Departure</div>
          <input type="date" value={depDate} min={minDate}
            onChange={e => { setDepDate(e.target.value); if (retDate && e.target.value >= retDate) setRetDate(""); }}
            style={{ width:"100%", padding:"10px 8px", borderRadius:10, border:`1.5px solid ${depDate?HOT:BORDER}`, fontFamily:NUN, fontSize:13, color:DARK, background:WHITE, boxSizing:"border-box", display:"block" }}
          />
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ ...label, marginBottom:6 }}>Return <span style={{ textTransform:"none", fontWeight:400, color:"#ccc" }}>(opt)</span></div>
          <input type="date" value={retDate} min={depDate || minDate}
            onChange={e => setRetDate(e.target.value)}
            style={{ width:"100%", padding:"10px 8px", borderRadius:10, border:`1.5px solid ${retDate?HOT:BORDER}`, fontFamily:NUN, fontSize:13, color:DARK, background:WHITE, boxSizing:"border-box", display:"block" }}
          />
        </div>
      </div>

      {/* Search button */}
      <button
        onClick={search}
        disabled={!selectedDest || loading}
        style={{
          width:"100%", padding:"15px", borderRadius:50, marginBottom:20,
          background: selectedDest ? `linear-gradient(135deg,#f472b0,${HOT})` : "#eee",
          color: selectedDest ? WHITE : "#aaa",
          border:"none", fontFamily:NUN, fontSize:15, fontWeight:800,
          cursor: selectedDest ? "pointer" : "not-allowed",
          boxShadow: selectedDest ? "0 4px 16px rgba(244,114,176,0.4)" : "none",
        }}
      >
        {loading ? "Searching…" : "Search Flights"}
      </button>

      {/* Error */}
      {error && (
        <div style={{ ...C, background:"#fff3f3", border:`1.5px solid #ffcdd2`, marginBottom:14 }}>
          <div style={{ fontFamily:NUN, fontSize:13, color:"#c62828" }}>{error}</div>
        </div>
      )}

      {/* Results */}
      {flights !== null && (
        flights.length === 0 ? (
          <div style={{ textAlign:"center", padding:"24px 0" }}>
            <div style={{ fontFamily:NUN, fontSize:14, fontWeight:700, color:DARK }}>No flights found</div>
            <div style={{ fontFamily:NUN, fontSize:12, color:"#999", marginTop:4 }}>Try different dates or a nearby airport</div>
          </div>
        ) : (
          <>
            <div style={{ fontFamily:NUN, fontSize:13, fontWeight:700, color:DARK, marginBottom:12 }}>
              {flights.length} flights found · {fromCode} → {selectedDest?.name}
            </div>
            {flights.map(f => <FlightCard key={f.id} f={f} groupSize={groupSize} />)}
            <div style={{ fontFamily:NUN, fontSize:10, color:"#bbb", textAlign:"center", marginTop:4, marginBottom:8 }}>
              Prices per person · Booking completed securely on Aviasales
            </div>
          </>
        )
      )}
    </div>
  );
}
