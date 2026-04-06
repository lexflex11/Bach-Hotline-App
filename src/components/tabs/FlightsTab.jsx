import React, { useState } from 'react';
import { SOFT, MID, HOT, PUNCH, DARK, BORDER, WHITE, GREEN } from '../../constants/colors.js';
import { C, BP, BS, BG } from '../../constants/styles.js';
import { DESTS, FLIGHTS } from '../../constants/data.js';
import { flightUrl } from '../../constants/api.js';
import SH from '../ui/SH.jsx';
import Chip from '../ui/Chip.jsx';
import Tag from '../ui/Tag.jsx';
import CommissionNote from '../ui/CommissionNote.jsx';

export default function FlightsTab({ groupSize }) {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("price");
  const filtered = FLIGHTS
    .filter(f => filter==="all"||f.dest===filter)
    .sort((a,b) => sortBy==="price" ? a.price-b.price : b.seats-a.seats);

  return (
    <div>
      <SH title="Group Flight Deals" sub="Tap Book Now to search real flights for your group" />

      {/* Affiliate note */}
      <CommissionNote platform="Expedia Affiliate Network" amount="3–6%" />

      <div style={{ display:"flex", gap:6, overflowX:"auto", marginBottom:12, paddingBottom:4, scrollbarWidth:"none" }}>
        <Chip label="All" active={filter==="all"} onClick={()=>setFilter("all")} />
        {DESTS.map(d => <Chip key={d.id} label={d.name} active={filter===d.id} onClick={()=>setFilter(d.id)} />)}
      </div>

      <div style={{ display:"flex", gap:6, marginBottom:14 }}>
        <span style={{ fontSize:10, color:"#bbb", fontFamily:"'DM Sans',sans-serif", alignSelf:"center" }}>Sort:</span>
        {[["price","Lowest Price"],["seats","Most Seats"]].map(([k,v]) => (
          <button key={k} onClick={()=>setSortBy(k)} style={{ ...BG, fontSize:10, padding:"5px 12px", background:sortBy===k?SOFT:WHITE, color:sortBy===k?HOT:"#bbb", border:sortBy===k?`1.5px solid ${HOT}`:`1.5px solid ${BORDER}` }}>{v}</button>
        ))}
      </div>

      {filtered.map(f => (
        <div key={f.id} style={{ ...C, marginBottom:12 }}>
          <Tag label={f.tag} />
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginTop:8 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:18, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK }}>{f.from} → {f.to}</div>
              <div style={{ fontSize:12, color:HOT, fontFamily:"'DM Sans',sans-serif", marginTop:3, opacity:0.75 }}>{f.airline} · {f.date} · {f.seats} seats left</div>
              <div style={{ height:4, background:SOFT, borderRadius:2, marginTop:10, width:140 }}>
                <div style={{ height:"100%", width:`${(f.seats/20)*100}%`, background:f.seats<7?PUNCH:GREEN, borderRadius:2 }} />
              </div>
            </div>
            <div style={{ textAlign:"right", marginLeft:12 }}>
              <div style={{ fontSize:11, color:"#bbb", fontFamily:"'DM Sans',sans-serif" }}>from</div>
              <div style={{ fontSize:24, fontWeight:900, color:HOT, fontFamily:"'Playfair Display',Georgia,serif" }}>${f.price}</div>
              <div style={{ fontSize:10, color:"#bbb", fontFamily:"'DM Sans',sans-serif" }}>per person</div>
              <div style={{ fontSize:13, color:PUNCH, fontFamily:"'DM Sans',sans-serif", fontWeight:700, marginTop:3 }}>${f.price*groupSize} est. total</div>
            </div>
          </div>

          {/* Real booking buttons — open affiliate search */}
          <div style={{ display:"flex", gap:8, marginTop:12 }}>
            {/* Expedia — searches real flights */}
            <a
              href={flightUrl(f.toFull, f.date, groupSize)}
              target="_blank"
              rel="noreferrer"
              style={{ flex:2, textDecoration:"none" }}
            >
              <button style={{ ...BP, width:"100%", fontSize:12, padding:"10px" }}>
                ✈️ Search on Expedia →
              </button>
            </a>
            {/* Google Flights — free backup search */}
            <a
              href={`https://www.google.com/flights?hl=en#flt=NYC.${f.toFull}.${f.date};c:USD;e:1;sd:1;t:h`}
              target="_blank"
              rel="noreferrer"
              style={{ flex:1, textDecoration:"none" }}
            >
              <button style={{ ...BS, width:"100%", fontSize:11, padding:"10px" }}>
                Google ✈️
              </button>
            </a>
          </div>

          {/* Small disclaimer */}
          <div style={{ fontSize:9, color:"#bbb", fontFamily:"'DM Sans',sans-serif", marginTop:6, textAlign:"center" }}>
            Prices shown are estimates · Real prices confirmed on booking site
          </div>
        </div>
      ))}

      {/* Sign up CTA for operator */}
      <div style={{ ...C, marginTop:16, background:SOFT, border:`1.5px solid ${MID}` }}>
        <div style={{ fontSize:11, fontWeight:700, color:HOT, fontFamily:"'DM Sans',sans-serif", textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>💰 Earn Commission on Every Booking</div>
        <div style={{ fontSize:12, color:DARK, fontFamily:"'DM Sans',sans-serif", marginBottom:10, opacity:0.8 }}>
          Sign up for free affiliate accounts to earn 3–6% on every flight your users book. No cost, no inventory — just commissions.
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <a href="https://www.expedia.com/affiliate" target="_blank" rel="noreferrer" style={{ ...BP, fontSize:11, padding:"7px 14px", textDecoration:"none", display:"inline-block" }}>Expedia Affiliate →</a>
          <a href="https://www.kayak.com/affiliate" target="_blank" rel="noreferrer" style={{ ...BS, fontSize:11, padding:"7px 14px", textDecoration:"none", display:"inline-block" }}>Kayak Affiliate →</a>
        </div>
      </div>
    </div>
  );
}
