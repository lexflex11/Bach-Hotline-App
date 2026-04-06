import React, { useState } from 'react';
import { SOFT, MID, HOT, PUNCH, DARK, BORDER, WHITE } from '../../constants/colors.js';
import { C, BP, BS } from '../../constants/styles.js';
import { DESTS, STAYS, PLATFORMS } from '../../constants/data.js';
import { airbnbUrl, vrboUrl, bookingUrl } from '../../constants/api.js';
import SH from '../ui/SH.jsx';
import Chip from '../ui/Chip.jsx';
import Tag from '../ui/Tag.jsx';
import CommissionNote from '../ui/CommissionNote.jsx';

export default function StaysTab({ groupSize }) {
  const [nights, setNights] = useState(3);
  const [platformFilter, setPlatformFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [wishlist, setWishlist] = useState([]);

  const cities = ["all", ...Array.from(new Set(STAYS.map(s => s.city)))];
  const filtered = STAYS.filter(s =>
    (platformFilter==="all" || s.platform===platformFilter) &&
    (cityFilter==="all" || s.city===cityFilter)
  );

  const getBookingUrl = (stay) => {
    if (stay.platform==="airbnb")  return airbnbUrl(stay.city, nights, groupSize);
    if (stay.platform==="vrbo")    return vrboUrl(stay.city, nights, groupSize);
    if (stay.platform==="booking") return bookingUrl(stay.city, nights, groupSize);
    return "#";
  };

  const isWished = id => wishlist.includes(id);

  const SM = { background:SOFT, border:`1.5px solid ${MID}`, color:HOT, borderRadius:8, width:28, height:28, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:15, display:"flex", alignItems:"center", justifyContent:"center" };

  return (
    <div>
      <SH title="Stays — Airbnb, Vrbo & Hotels" sub="Tap to search real availability for your dates" />

      <CommissionNote platform="Airbnb, Vrbo & Booking.com affiliate programs" amount="3–4%" />

      {/* Nights + group */}
      <div style={{ ...C, marginBottom:14, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontSize:11, color:HOT, fontFamily:"'DM Sans',sans-serif", fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>Nights</div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:6 }}>
            <button onClick={()=>setNights(Math.max(1,nights-1))} style={SM}>−</button>
            <span style={{ fontWeight:900, color:PUNCH, fontSize:20, fontFamily:"'Playfair Display',Georgia,serif" }}>{nights}</span>
            <button onClick={()=>setNights(nights+1)} style={SM}>+</button>
          </div>
        </div>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:11, color:HOT, fontFamily:"'DM Sans',sans-serif", fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>Group</div>
          <div style={{ fontSize:20, fontWeight:900, color:PUNCH, fontFamily:"'Playfair Display',Georgia,serif", marginTop:4 }}>{groupSize} 👯</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:11, color:"#bbb", fontFamily:"'DM Sans',sans-serif" }}>{nights} nights</div>
          <div style={{ fontSize:11, color:"#bbb", fontFamily:"'DM Sans',sans-serif" }}>group of {groupSize}</div>
        </div>
      </div>

      {/* Platform filter pills */}
      <div style={{ marginBottom:10 }}>
        <div style={{ fontSize:10, color:HOT, fontFamily:"'DM Sans',sans-serif", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Filter by Platform</div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          <Chip label="All Platforms" active={platformFilter==="all"} onClick={()=>setPlatformFilter("all")} />
          {Object.entries(PLATFORMS).map(([key, p]) => (
            <button key={key} onClick={()=>setPlatformFilter(key)} style={{ flexShrink:0, padding:"6px 13px", borderRadius:50, border:platformFilter===key?`2px solid ${p.color}`:`1.5px solid ${BORDER}`, background:platformFilter===key?p.bg:WHITE, color:platformFilter===key?p.color:HOT, fontFamily:"'DM Sans',sans-serif", fontSize:10, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap", transition:"all 0.18s" }}>
              {p.emoji} {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* City filter */}
      <div style={{ display:"flex", gap:6, overflowX:"auto", marginBottom:16, paddingBottom:4, scrollbarWidth:"none" }}>
        {cities.map(c => <Chip key={c} label={c==="all"?"All Cities":c} active={cityFilter===c} onClick={()=>setCityFilter(c)} />)}
      </div>

      {/* Stay cards */}
      {filtered.map(s => {
        const plat = PLATFORMS[s.platform];
        return (
          <div key={s.id} style={{ ...C, marginBottom:14 }}>
            {/* Platform badge */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:14 }}>{s.img}</span>
                <span style={{ fontSize:9, fontWeight:700, padding:"3px 9px", borderRadius:20, background:plat.bg, color:plat.color, border:`1px solid ${plat.border}`, fontFamily:"'DM Sans',sans-serif" }}>
                  {plat.emoji} {plat.name} · {plat.label}
                </span>
              </div>
              <button
                onClick={()=>setWishlist(p => isWished(s.id)?p.filter(i=>i!==s.id):[...p,s.id])}
                style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, color:isWished(s.id)?PUNCH:"#ccc" }}
              >
                {isWished(s.id)?"♥":"♡"}
              </button>
            </div>

            {/* Stay info */}
            <div style={{ fontSize:16, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK }}>{s.name}</div>
            <div style={{ fontSize:12, color:HOT, fontFamily:"'DM Sans',sans-serif", marginTop:2, opacity:0.75 }}>
              📍 {s.city} · {s.rooms} bedrooms · sleeps {s.rooms*2}+
            </div>

            {/* Highlight banner */}
            <div style={{ background:SOFT, border:`1px solid ${MID}`, borderRadius:8, padding:"6px 10px", marginTop:8, fontSize:11, color:HOT, fontFamily:"'DM Sans',sans-serif", fontWeight:600 }}>
              ✨ {s.highlight}
            </div>

            <div style={{ fontSize:12, color:"#666", fontFamily:"'DM Sans',sans-serif", marginTop:8, lineHeight:1.5 }}>{s.desc}</div>

            {/* Tags */}
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:8 }}>
              {s.tags.map(t => <Tag key={t} label={t} />)}
            </div>

            {/* Pricing */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:10, padding:"10px 0", borderTop:`1px solid ${SOFT}`, borderBottom:`1px solid ${SOFT}` }}>
              <div>
                <div style={{ fontSize:11, color:"#bbb", fontFamily:"'DM Sans',sans-serif" }}>from</div>
                <div style={{ fontSize:22, fontWeight:900, color:HOT, fontFamily:"'Playfair Display',Georgia,serif" }}>${s.price}<span style={{ fontSize:12, fontWeight:400, color:"#bbb" }}>/night</span></div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:13, color:PUNCH, fontFamily:"'DM Sans',sans-serif", fontWeight:700 }}>${s.price*nights} est. {nights} nights</div>
                <div style={{ fontSize:11, color:HOT, fontFamily:"'DM Sans',sans-serif", opacity:0.75 }}>⭐ {s.rating} rating</div>
              </div>
            </div>

            {/* Real booking buttons */}
            <div style={{ display:"flex", gap:8, marginTop:12 }}>
              <a href={getBookingUrl(s)} target="_blank" rel="noreferrer" style={{ flex:2, textDecoration:"none" }}>
                <button style={{ ...BP, width:"100%", fontSize:12, padding:"11px", background:`linear-gradient(135deg,${plat.color},${plat.color}cc)`, boxShadow:`0 4px 16px ${plat.color}44` }}>
                  {plat.emoji} Search on {plat.name} →
                </button>
              </a>
              <a
                href={s.platform==="airbnb" ? airbnbUrl(s.city, nights, groupSize) : vrboUrl(s.city, nights, groupSize)}
                target="_blank" rel="noreferrer"
                style={{ flex:1, textDecoration:"none" }}
              >
                <button style={{ ...BS, width:"100%", fontSize:11, padding:"11px" }}>
                  Compare
                </button>
              </a>
            </div>

            <div style={{ fontSize:9, color:"#bbb", fontFamily:"'DM Sans',sans-serif", marginTop:6, textAlign:"center" }}>
              Prices shown are estimates · Real availability confirmed on {plat.name}
            </div>
          </div>
        );
      })}

      {/* Compare all platforms box */}
      <div style={{ ...C, background:SOFT, border:`1.5px solid ${MID}`, marginTop:6 }}>
        <div style={{ fontSize:13, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK, marginBottom:12 }}>
          🔍 Search All Platforms for {DESTS[0].name}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {Object.entries(PLATFORMS).map(([key, p]) => (
            <a key={key} href={key==="airbnb"?airbnbUrl("Nashville",nights,groupSize):key==="vrbo"?vrboUrl("Nashville",nights,groupSize):bookingUrl("Nashville",nights,groupSize)} target="_blank" rel="noreferrer" style={{ textDecoration:"none" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, background:p.bg, border:`1.5px solid ${p.border}`, borderRadius:12, padding:"11px 14px", cursor:"pointer" }}>
                <span style={{ fontSize:22 }}>{p.emoji}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, fontFamily:"'DM Sans',sans-serif", color:p.color }}>{p.name}</div>
                  <div style={{ fontSize:11, color:"#666", fontFamily:"'DM Sans',sans-serif" }}>{p.label} · Earn {p.commission} commission</div>
                </div>
                <span style={{ color:p.color, fontSize:16 }}>→</span>
              </div>
            </a>
          ))}
        </div>
        <div style={{ marginTop:14 }}>
          <div style={{ fontSize:11, fontWeight:700, color:HOT, fontFamily:"'DM Sans',sans-serif", textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>💰 Earn on every booking</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {Object.entries(PLATFORMS).map(([key, p]) => (
              <a key={key} href={p.signupUrl} target="_blank" rel="noreferrer" style={{ fontSize:11, padding:"6px 13px", borderRadius:50, background:p.bg, color:p.color, border:`1px solid ${p.border}`, fontFamily:"'DM Sans',sans-serif", fontWeight:700, textDecoration:"none", display:"inline-block" }}>
                Join {p.name} Affiliate →
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
