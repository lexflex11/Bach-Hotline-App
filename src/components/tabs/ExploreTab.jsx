import React, { useState } from 'react';
import { HOT, PUNCH, DARK, WHITE, SOFT, MID, BORDER } from '../../constants/colors.js';
import { BP, BG } from '../../constants/styles.js';
import { viatorUrl, opentableUrl } from '../../constants/api.js';

// ─── Category filters ──────────────────────────────────────────────────────
const CATS = [
  { id:"all",       label:"Popular",       icon:"⭐" },
  { id:"activity",  label:"Things to Do",  icon:"🎉" },
  { id:"food",      label:"Food & Drink",  icon:"🍾" },
  { id:"restaurant",label:"Restaurants",   icon:"🍽️" },
  { id:"bar",       label:"Bars",          icon:"🍸" },
  { id:"nightlife", label:"Nightlife",     icon:"🌙" },
  { id:"water",     label:"Boats & Water", icon:"⛵" },
  { id:"spa",       label:"Spa & Wellness",icon:"💆" },
];

// ─── Gradient palettes per category (app colors) ──────────────────────────
const GRAD = {
  activity:   ["#E66582","#C42050"],
  food:       ["#D52438","#E66582"],
  restaurant: ["#C42050","#8B1A2E"],
  bar:        ["#9B3070","#E66582"],
  nightlife:  ["#2D0A18","#9B3070"],
  water:      ["#006994","#00B4D8"],
  spa:        ["#C9778A","#E8A0B0"],
};

// ─── Experiences data ──────────────────────────────────────────────────────
const EXP = [
  // Miami
  { id:1,  city:"miami",     name:"Sunset Yacht Charter",       cat:"water",     emoji:"⛵", price:"$$$$", rating:5.0, vibe:"Private · Champagne · 3 hrs",    badge:"Experience", hot:true  },
  { id:2,  city:"miami",     name:"Drag Brunch Miami",           cat:"food",      emoji:"👑", price:"$$$",  rating:4.9, vibe:"Bottomless mimosas · Live show",  badge:"Brunch",     hot:true  },
  { id:3,  city:"miami",     name:"South Beach Bar Crawl",       cat:"bar",       emoji:"🍸", price:"$$",   rating:4.8, vibe:"5 bars · VIP entry · Free shots", badge:"Bar Crawl",  hot:false },
  { id:4,  city:"miami",     name:"Pole Dance Experience",       cat:"activity",  emoji:"💃", price:"$$",   rating:4.9, vibe:"Private class · 90 mins · BYOB", badge:"Activity",   hot:false },
  { id:5,  city:"miami",     name:"Rooftop Pool Party",          cat:"nightlife", emoji:"🏊", price:"$$$",  rating:4.7, vibe:"DJ · Bottle service · Views",    badge:"Nightlife",  hot:true  },
  { id:6,  city:"miami",     name:"Luxury Spa Day",              cat:"spa",       emoji:"💆", price:"$$$$", rating:4.9, vibe:"Full day · Massages · Facials",   badge:"Spa",        hot:false },

  // Nashville
  { id:7,  city:"nashville", name:"Broadway Bar Hop",            cat:"bar",       emoji:"🎸", price:"$$",   rating:4.9, vibe:"Honky tonks · Live music · BYOB",badge:"Bar Crawl",  hot:true  },
  { id:8,  city:"nashville", name:"Nashville Pedal Tavern",      cat:"activity",  emoji:"🚲", price:"$$",   rating:4.7, vibe:"90 mins · BYOB · 16 people",     badge:"Activity",   hot:true  },
  { id:9,  city:"nashville", name:"Hot Chicken Tasting Tour",    cat:"food",      emoji:"🌶️", price:"$$",  rating:4.8, vibe:"3 stops · Nashville staple",     badge:"Food Tour",  hot:false },
  { id:10, city:"nashville", name:"Rooftop Sunset Cocktails",    cat:"bar",       emoji:"🥂", price:"$$$",  rating:4.8, vibe:"Golden hour · Craft cocktails",   badge:"Bar",        hot:false },
  { id:11, city:"nashville", name:"Line Dancing Class",          cat:"activity",  emoji:"🤠", price:"$",    rating:4.7, vibe:"1 hour · Beginner friendly",      badge:"Activity",   hot:false },
  { id:12, city:"nashville", name:"VIP Live Country Show",       cat:"nightlife", emoji:"🎵", price:"$$$",  rating:4.9, vibe:"Front row · Dinner included",    badge:"Show",       hot:true  },

  // Las Vegas
  { id:13, city:"vegas",     name:"Magic Mike Live",             cat:"activity",  emoji:"💪", price:"$$$",  rating:5.0, vibe:"The show · Front row available", badge:"Show",       hot:true  },
  { id:14, city:"vegas",     name:"VIP Club Night",              cat:"nightlife", emoji:"🎰", price:"$$$$", rating:4.8, vibe:"Table service · Open bar",       badge:"Nightlife",  hot:true  },
  { id:15, city:"vegas",     name:"Drag Brunch Extravaganza",    cat:"food",      emoji:"✨", price:"$$$",  rating:5.0, vibe:"Unlimited mimosas · Crown ceremony",badge:"Brunch",   hot:true  },
  { id:16, city:"vegas",     name:"Spa at Aria",                 cat:"spa",       emoji:"💆", price:"$$$$", rating:4.9, vibe:"Full day · Award-winning spa",    badge:"Spa",        hot:false },
  { id:17, city:"vegas",     name:"Helicopter Canyon Tour",      cat:"activity",  emoji:"🚁", price:"$$$$", rating:4.8, vibe:"Grand Canyon · Sunrise option",  badge:"Experience", hot:false },
  { id:18, city:"vegas",     name:"High Roller Cocktail Hour",   cat:"bar",       emoji:"🎡", price:"$$$",  rating:4.7, vibe:"Open bar · 360° Strip views",    badge:"Bar",        hot:false },

  // New Orleans
  { id:19, city:"nola",      name:"Haunted Cocktail Tour",       cat:"bar",       emoji:"👻", price:"$$",   rating:4.8, vibe:"5 bars · Ghost stories · 2 hrs", badge:"Bar Tour",   hot:true  },
  { id:20, city:"nola",      name:"Jazz Brunch Experience",      cat:"food",      emoji:"🎷", price:"$$$",  rating:4.9, vibe:"Live jazz · Creole cuisine",      badge:"Brunch",     hot:true  },
  { id:21, city:"nola",      name:"Swamp & Gator Tour",          cat:"activity",  emoji:"🐊", price:"$$",   rating:4.7, vibe:"Boat tour · Wildlife · 2 hrs",   badge:"Activity",   hot:false },
  { id:22, city:"nola",      name:"Frenchmen Street Bar Night",  cat:"nightlife", emoji:"🎺", price:"$",    rating:4.9, vibe:"Live music every bar · No cover", badge:"Nightlife",  hot:false },
  { id:23, city:"nola",      name:"Voodoo & History Tour",       cat:"activity",  emoji:"🔮", price:"$$",   rating:4.8, vibe:"Walking tour · Mystical NOLA",   badge:"Tour",       hot:false },

  // Scottsdale
  { id:24, city:"scottsdale",name:"Desert Day Club Pool Party",  cat:"nightlife", emoji:"🏊", price:"$$$",  rating:4.8, vibe:"Cabanas · DJ · Bottle service",  badge:"Day Club",   hot:true  },
  { id:25, city:"scottsdale",name:"Sunset Jeep Desert Tour",     cat:"activity",  emoji:"🌵", price:"$$",   rating:4.9, vibe:"Saguaro sunset · 2 hrs",          badge:"Adventure",  hot:false },
  { id:26, city:"scottsdale",name:"Spa at Four Seasons",         cat:"spa",       emoji:"💆", price:"$$$$", rating:5.0, vibe:"Desert spa · Full day access",    badge:"Spa",        hot:true  },
  { id:27, city:"scottsdale",name:"Old Town Bar Crawl",          cat:"bar",       emoji:"🍹", price:"$$",   rating:4.7, vibe:"5 venues · Group perks",          badge:"Bar Crawl",  hot:false },

  // Austin
  { id:28, city:"austin",    name:"6th Street Bar Crawl",        cat:"bar",       emoji:"🎸", price:"$$",   rating:4.8, vibe:"Live music bars · No cover",      badge:"Bar Crawl",  hot:true  },
  { id:29, city:"austin",    name:"Lake Austin Boat Party",      cat:"water",     emoji:"🚤", price:"$$$",  rating:4.9, vibe:"Private boat · Swimming · BYOB",  badge:"Boat Party", hot:true  },
  { id:30, city:"austin",    name:"Texas BBQ Crawl",             cat:"food",      emoji:"🔥", price:"$$",   rating:4.9, vibe:"3 legendary spots · Guided",      badge:"Food Tour",  hot:false },
  { id:31, city:"austin",    name:"Rainey Street Night Out",     cat:"nightlife", emoji:"🌙", price:"$$",   rating:4.8, vibe:"Bungalow bars · Rooftop patios",  badge:"Nightlife",  hot:false },

  // Cabo
  { id:32, city:"cabo",      name:"Private Yacht Party",         cat:"water",     emoji:"🛥️", price:"$$$$", rating:5.0, vibe:"Open bar · Snorkeling · Sunset", badge:"Yacht",      hot:true  },
  { id:33, city:"cabo",      name:"Medano Beach Club",           cat:"activity",  emoji:"🏖️", price:"$$$",  rating:4.8, vibe:"VIP beds · Bottle service",      badge:"Beach Club", hot:true  },
  { id:34, city:"cabo",      name:"ATV Desert Adventure",        cat:"activity",  emoji:"🏜️", price:"$$",   rating:4.7, vibe:"Desert dunes · 2 hrs",            badge:"Adventure",  hot:false },
  { id:35, city:"cabo",      name:"Sunset Sailing Charter",      cat:"water",     emoji:"⛵", price:"$$$",  rating:4.9, vibe:"Champagne · Whale watching",      badge:"Sailing",    hot:false },

  // Mykonos
  { id:36, city:"mykonos",   name:"Nammos Beach Club",           cat:"nightlife", emoji:"🪩", price:"$$$$", rating:5.0, vibe:"World-famous · Bottle service",  badge:"Beach Club", hot:true  },
  { id:37, city:"mykonos",   name:"Windmill Sunset Cocktails",   cat:"bar",       emoji:"🌅", price:"$$$",  rating:4.9, vibe:"Iconic views · Golden hour",      badge:"Bar",        hot:true  },
  { id:38, city:"mykonos",   name:"Private Catamaran Cruise",    cat:"water",     emoji:"⛵", price:"$$$$", rating:5.0, vibe:"All-inclusive · Secluded beaches",badge:"Sailing",    hot:false },
  { id:39, city:"mykonos",   name:"Little Venice Wine Night",    cat:"bar",       emoji:"🥂", price:"$$$",  rating:4.8, vibe:"Seaside · Local wine · Sunset",   badge:"Wine Bar",   hot:false },
];

const CITIES = [
  { id:"all",        name:"All Cities" },
  { id:"miami",      name:"Miami" },
  { id:"nashville",  name:"Nashville" },
  { id:"vegas",      name:"Las Vegas" },
  { id:"nola",       name:"New Orleans" },
  { id:"scottsdale", name:"Scottsdale" },
  { id:"austin",     name:"Austin" },
  { id:"cabo",       name:"Cabo San Lucas" },
  { id:"mykonos",    name:"Mykonos" },
];

export default function ExploreTab({ groupSize }) {
  const [city, setCity]   = useState("all");
  const [cat,  setCat]    = useState("all");
  const [saved, setSaved] = useState(new Set());

  const toggleSave = id => setSaved(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const filtered = EXP
    .filter(e => city === "all" || e.city === city)
    .filter(e => cat  === "all" || e.cat  === cat);

  const cityName = CITIES.find(c => c.id === city)?.name || "All Cities";
  const grad = (e) => GRAD[e.cat] || [HOT, PUNCH];

  return (
    <div style={{ paddingBottom: 8 }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div style={{
        background: `linear-gradient(160deg, #2D0A18 0%, ${PUNCH} 50%, ${HOT} 100%)`,
        borderRadius: 20,
        padding: "32px 20px 28px",
        marginBottom: 16,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* decorative circles */}
        <div style={{ position:"absolute", top:-40, right:-40, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,0.06)" }} />
        <div style={{ position:"absolute", bottom:-30, left:-30, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,0.04)" }} />

        <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", fontFamily:"'DM Sans',sans-serif", fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", marginBottom:10 }}>
          Bach Hotline
        </div>
        <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:26, fontWeight:900, color:WHITE, margin:"0 0 6px", lineHeight:1.2 }}>
          Plan your next<br/><em style={{ color:"#FFD6E0" }}>epic bach trip</em>
        </h2>
        <p style={{ fontSize:12, color:"rgba(255,255,255,0.75)", fontFamily:"'DM Sans',sans-serif", margin:"0 0 20px" }}>
          Experiences · Restaurants · Bars · Activities
        </p>

        {/* City selector */}
        <div style={{ position:"relative", display:"inline-block", width:"100%", maxWidth:280 }}>
          <select
            value={city}
            onChange={e => setCity(e.target.value)}
            style={{
              width:"100%", padding:"14px 44px 14px 20px",
              borderRadius:50, border:"none",
              fontFamily:"'DM Sans',sans-serif", fontSize:15, fontWeight:700,
              color:DARK, background:WHITE, cursor:"pointer",
              appearance:"none", boxShadow:"0 4px 20px rgba(0,0,0,0.2)",
            }}
          >
            {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <span style={{ position:"absolute", right:16, top:"50%", transform:"translateY(-50%)", fontSize:16, pointerEvents:"none" }}>▾</span>
        </div>
      </div>

      {/* ── CATEGORY FILTER CHIPS ────────────────────────────────────────── */}
      <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:4, marginBottom:16, scrollbarWidth:"none" }}>
        {CATS.map(c => (
          <button key={c.id} onClick={() => setCat(c.id)} style={{
            flexShrink:0,
            display:"flex", flexDirection:"column", alignItems:"center", gap:4,
            padding:"10px 14px",
            background: cat===c.id ? SOFT : WHITE,
            border: cat===c.id ? `2px solid ${HOT}` : `1.5px solid ${BORDER}`,
            borderRadius:14, cursor:"pointer", transition:"all 0.15s",
            minWidth:72,
          }}>
            <span style={{ fontSize:20 }}>{c.icon}</span>
            <span style={{
              fontSize:10, fontWeight:700, fontFamily:"'DM Sans',sans-serif",
              color: cat===c.id ? HOT : "#888",
              whiteSpace:"nowrap",
              borderBottom: cat===c.id ? `2px solid ${HOT}` : "2px solid transparent",
              paddingBottom:1,
            }}>{c.label}</span>
          </button>
        ))}
      </div>

      {/* ── SECTION HEADER ───────────────────────────────────────────────── */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <div style={{ fontSize:18, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK }}>
          {cat === "all" ? `Best of ${cityName}` : `${CATS.find(c=>c.id===cat)?.label} · ${cityName}`}
        </div>
        <div style={{ fontSize:11, color:"#bbb", fontFamily:"'DM Sans',sans-serif" }}>{filtered.length} found</div>
      </div>

      {/* ── EXPERIENCE CARDS ─────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"40px 20px" }}>
          <div style={{ fontSize:32, marginBottom:10 }}>🔍</div>
          <div style={{ fontSize:14, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK }}>No experiences found</div>
          <div style={{ fontSize:12, color:"#bbb", fontFamily:"'DM Sans',sans-serif", marginTop:6 }}>Try a different city or category</div>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {filtered.map(e => {
            const [g1, g2] = grad(e);
            const isSaved  = saved.has(e.id);
            return (
              <div key={e.id} style={{
                borderRadius:18, overflow:"hidden",
                boxShadow:"0 4px 16px rgba(45,10,24,0.12)",
                background:WHITE,
                display:"flex", flexDirection:"column",
              }}>
                {/* Photo area — gradient + emoji */}
                <div style={{
                  background:`linear-gradient(140deg, ${g1}, ${g2})`,
                  height:110, position:"relative",
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  <span style={{ fontSize:42, filter:"drop-shadow(0 2px 6px rgba(0,0,0,0.25))" }}>{e.emoji}</span>

                  {/* Badge — top left */}
                  <div style={{
                    position:"absolute", top:10, left:10,
                    background:"rgba(0,0,0,0.45)", backdropFilter:"blur(6px)",
                    borderRadius:50, padding:"3px 10px",
                    fontSize:9, fontWeight:700, color:WHITE,
                    fontFamily:"'DM Sans',sans-serif", letterSpacing:"0.5px",
                    display:"flex", alignItems:"center", gap:4,
                  }}>
                    🎉 {e.badge}
                  </div>

                  {/* Heart — top right */}
                  <button onClick={() => toggleSave(e.id)} style={{
                    position:"absolute", top:8, right:8,
                    width:30, height:30, borderRadius:"50%",
                    background:isSaved ? HOT : "rgba(255,255,255,0.85)",
                    border:"none", cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:14, boxShadow:"0 2px 8px rgba(0,0,0,0.15)",
                    transition:"all 0.2s",
                  }}>
                    {isSaved ? "❤️" : "🤍"}
                  </button>

                  {/* Hot badge */}
                  {e.hot && (
                    <div style={{
                      position:"absolute", bottom:8, left:10,
                      background:PUNCH, borderRadius:50, padding:"2px 8px",
                      fontSize:8, fontWeight:800, color:WHITE,
                      fontFamily:"'DM Sans',sans-serif", letterSpacing:"0.5px",
                    }}>🔥 POPULAR</div>
                  )}
                </div>

                {/* Card body */}
                <div style={{ padding:"10px 12px 12px", flex:1, display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK, marginBottom:3, lineHeight:1.3 }}>{e.name}</div>
                    <div style={{ fontSize:10, color:HOT, fontFamily:"'DM Sans',sans-serif", opacity:0.8, marginBottom:6 }}>{e.vibe}</div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                      <span style={{ fontSize:10, color:"#888", fontFamily:"'DM Sans',sans-serif" }}>
                        {"⭐".repeat(Math.round(e.rating))} {e.rating}
                      </span>
                      <span style={{ fontSize:11, fontWeight:700, color:PUNCH, fontFamily:"'DM Sans',sans-serif" }}>{e.price}</span>
                    </div>
                  </div>
                  <a
                    href={e.cat === "restaurant" || e.cat === "food"
                      ? opentableUrl(e.name, CITIES.find(c=>c.id===e.city)?.name||"")
                      : viatorUrl(e.name, CITIES.find(c=>c.id===e.city)?.name||"")}
                    target="_blank" rel="noreferrer"
                    style={{ textDecoration:"none" }}
                  >
                    <button style={{ ...BP, width:"100%", fontSize:11, padding:"8px", borderRadius:10 }}>
                      Book Now →
                    </button>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── BOTTOM NOTE ──────────────────────────────────────────────────── */}
      <div style={{ textAlign:"center", padding:"20px 0 8px", fontSize:10, color:"#ccc", fontFamily:"'DM Sans',sans-serif" }}>
        {groupSize} in your group · Tap ❤️ to save favorites
      </div>
    </div>
  );
}
