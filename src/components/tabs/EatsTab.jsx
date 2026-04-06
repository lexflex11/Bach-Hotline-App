import React, { useState } from 'react';
import { HOT, PUNCH, DARK, GOLD } from '../../constants/colors.js';
import { C, BP } from '../../constants/styles.js';
import { EATS } from '../../constants/data.js';
import SH from '../ui/SH.jsx';
import Chip from '../ui/Chip.jsx';

export default function EatsTab() {
  const [filter, setFilter] = useState("All");
  const types = ["All","Restaurant","Brunch","Activity","Show","Bar Tour"];
  return (
    <div>
      <SH title="Eats & Experiences 🍾" sub="Curated for bachelorette parties" />
      <div style={{ display:"flex", gap:6, overflowX:"auto", marginBottom:14, paddingBottom:4, scrollbarWidth:"none" }}>
        {types.map(t => <Chip key={t} label={t} active={filter===t} onClick={()=>setFilter(t)} />)}
      </div>
      {EATS.filter(e => filter==="All"||e.type===filter).map(e => (
        <div key={e.id} style={{ ...C, marginBottom:10, display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ fontSize:34, flexShrink:0 }}>{e.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <div style={{ fontSize:14, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK }}>{e.name}</div>
              <span style={{ fontSize:12, fontFamily:"'DM Sans',sans-serif", color:"#bbb" }}>{e.price}</span>
            </div>
            <div style={{ fontSize:11, color:HOT, fontFamily:"'DM Sans',sans-serif", marginTop:2, opacity:0.75 }}>{e.type} · {e.city}</div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:8 }}>
              <span style={{ fontSize:12, fontFamily:"'DM Sans',sans-serif", color:GOLD }}>⭐ {e.rating}</span>
              <button style={{ ...BP, padding:"5px 14px", fontSize:11 }}>+ Add to Trip</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
