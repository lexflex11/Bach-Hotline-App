import React, { useState } from 'react';
import { SOFT, MID, HOT, PUNCH, DARK, BORDER, WHITE, GREEN } from '../../constants/colors.js';
import { C, BP, BS, IN } from '../../constants/styles.js';
import { DESTS } from '../../constants/data.js';
import SH from '../ui/SH.jsx';

export default function AlertsTab() {
  const [alerts, setAlerts] = useState([
    { id:1, label:"NYC → Nashville under $75",     current:67,  threshold:75,  triggered:true,  active:true, icon:"✈️" },
    { id:2, label:"NYC → Miami under $100",         current:89,  threshold:100, triggered:true,  active:true, icon:"✈️" },
    { id:3, label:"Nashville Airbnb under $300/night",current:280,threshold:300,triggered:true,  active:true, icon:"🏠" },
    { id:4, label:"NYC → Vegas under $90",           current:112, threshold:90,  triggered:false, active:true, icon:"✈️" },
  ]);
  const [showNew, setShowNew] = useState(false);
  const [newA, setNewA] = useState({ type:"flight", dest:"Nashville", threshold:"" });
  const [notif, setNotif] = useState(false);
  const toggle = id => setAlerts(p=>p.map(a=>a.id===id?{...a,active:!a.active}:a));
  const addAlert = () => {
    if (!newA.threshold) return;
    setAlerts(p=>[...p,{ id:Date.now(), label:`${newA.dest} ${newA.type} under $${newA.threshold}`, current:999, threshold:parseFloat(newA.threshold), triggered:false, active:true, icon:newA.type==="flight"?"✈️":newA.type==="airbnb"?"🏠":"🏡" }]);
    setNewA({ type:"flight", dest:"Nashville", threshold:"" });
    setShowNew(false);
  };
  const triggered = alerts.filter(a=>a.triggered&&a.active);
  const watching  = alerts.filter(a=>!a.triggered&&a.active);
  return (
    <div>
      <SH title="Deal Alerts" sub="Get notified when flight or stay prices drop" />
      {!notif&&(<div style={{ ...C, marginBottom:14, background:SOFT, border:`1.5px solid ${MID}` }}><div style={{ fontSize:11, color:HOT, fontFamily:"'DM Sans',sans-serif", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>🔔 Enable Push Notifications</div><div style={{ fontSize:12, color:DARK, fontFamily:"'DM Sans',sans-serif", opacity:0.75, marginBottom:12 }}>Turn on alerts so we ping you the moment a deal drops!</div><button onClick={()=>setNotif(true)} style={{ ...BP, width:"100%", padding:"11px", fontSize:13 }}>Enable Deal Alerts</button></div>)}
      {notif&&<div style={{ padding:"10px 14px", borderRadius:12, background:`rgba(46,125,50,0.08)`, border:"1px solid rgba(46,125,50,0.25)", marginBottom:14, fontFamily:"'DM Sans',sans-serif", fontSize:13, color:GREEN }}>✅ Push notifications enabled!</div>}
      {triggered.length>0&&(<div style={{ marginBottom:16 }}><div style={{ fontSize:11, fontWeight:700, color:PUNCH, fontFamily:"'DM Sans',sans-serif", textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>🚨 DEALS FOUND — Act Fast!</div>{triggered.map(a=>(<div key={a.id} style={{ ...C, marginBottom:10, background:`rgba(46,125,50,0.05)`, border:`2px solid rgba(46,125,50,0.3)`, position:"relative" }}><div style={{ position:"absolute", top:14, right:14, width:9, height:9, borderRadius:"50%", background:GREEN, animation:"pulse 1.5s infinite" }} /><div style={{ display:"flex", alignItems:"center", gap:12 }}><div style={{ fontSize:28 }}>{a.icon}</div><div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK }}>{a.label}</div><div style={{ display:"flex", gap:12, marginTop:5, fontFamily:"'DM Sans',sans-serif", fontSize:11 }}><span style={{ color:HOT }}>Target: ${a.threshold}</span><span style={{ color:GREEN, fontWeight:700 }}>Now: ${a.current} · Saving ${a.threshold-a.current}!</span></div></div></div><button style={{ ...BP, width:"100%", marginTop:12, fontSize:12, padding:"9px", background:`linear-gradient(135deg,${GREEN},#1b5e20)`, boxShadow:"none" }}>🔥 Search Now</button><style>{`@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.4)}}`}</style></div>))}</div>)}
      {watching.length>0&&(<div style={{ marginBottom:16 }}><div style={{ fontSize:11, fontWeight:700, color:HOT, fontFamily:"'DM Sans',sans-serif", textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>👀 Watching</div>{watching.map(a=>(<div key={a.id} style={{ ...C, marginBottom:8 }}><div style={{ display:"flex", alignItems:"center", gap:12 }}><div style={{ fontSize:26 }}>{a.icon}</div><div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK }}>{a.label}</div><div style={{ fontSize:11, color:HOT, fontFamily:"'DM Sans',sans-serif", marginTop:3, opacity:0.75 }}>Now: <span style={{ color:PUNCH }}>${a.current}</span> · Target: ${a.threshold}</div><div style={{ marginTop:6, height:4, background:SOFT, borderRadius:2 }}><div style={{ height:"100%", width:`${Math.min(100,(a.threshold/a.current)*100)}%`, background:`linear-gradient(90deg,${HOT},${PUNCH})`, borderRadius:2 }} /></div></div><button onClick={()=>toggle(a.id)} style={{ background:"none", border:"none", cursor:"pointer", color:HOT, fontSize:18 }}>⏸</button></div></div>))}</div>)}
      {showNew ? (
        <div style={{ ...C, border:`1.5px solid ${HOT}` }}>
          <div style={{ fontSize:14, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK, marginBottom:12 }}>🔔 New Alert</div>
          <div style={{ display:"flex", gap:6, marginBottom:10 }}>
            {[["flight","✈️ Flight"],["airbnb","🏠 Airbnb"],["vrbo","🏡 Vrbo"]].map(([t,l])=>(
              <button key={t} onClick={()=>setNewA(p=>({...p,type:t}))} style={{ flex:1, padding:"9px 4px", border:newA.type===t?`2px solid ${HOT}`:`1.5px solid ${BORDER}`, borderRadius:12, background:newA.type===t?SOFT:WHITE, cursor:"pointer", color:DARK, fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600 }}>{l}</button>
            ))}
          </div>
          <select value={newA.dest} onChange={e=>setNewA(p=>({...p,dest:e.target.value}))} style={{ ...IN, marginBottom:10 }}>
            {DESTS.map(d=><option key={d.id} value={d.name}>{d.emoji} {d.name}</option>)}
          </select>
          <input type="number" value={newA.threshold} onChange={e=>setNewA(p=>({...p,threshold:e.target.value}))} placeholder={`Alert when under $...`} style={{ ...IN, marginBottom:12 }} />
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>setShowNew(false)} style={{ ...BS, flex:1 }}>Cancel</button>
            <button onClick={addAlert} style={{ ...BP, flex:2 }}>🔔 Create Alert</button>
          </div>
        </div>
      ) : (
        <button onClick={()=>setShowNew(true)} style={{ ...BP, width:"100%", padding:"13px", fontSize:14 }}>+ Create New Alert</button>
      )}
    </div>
  );
}
