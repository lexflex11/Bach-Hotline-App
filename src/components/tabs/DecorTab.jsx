import React, { useState, useRef } from 'react';
import { SOFT, MID, HOT, PUNCH, DARK, BORDER, WHITE, GREEN } from '../../constants/colors.js';
import { C, BP, BG } from '../../constants/styles.js';
import { DECOR_THEMES } from '../../constants/data.js';
import { ANTHROPIC_API_KEY } from '../../constants/api.js';
import SH from '../ui/SH.jsx';

export default function DecorTab({ setTab }) {
  const [photo, setPhoto] = useState(null);
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileRef = useRef();
  const handleFile = e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setPhoto(ev.target.result); setResult(null); };
    reader.readAsDataURL(file);
  };
  const run = async () => {
    if (!photo||!theme) return;
    setLoading(true); setResult(null);
    const t = DECOR_THEMES.find(x=>x.id===theme);
    try {
      const b64=photo.split(",")[1]; const mime=photo.split(";")[0].split(":")[1];
      // Check API key
      if (!ANTHROPIC_API_KEY || ANTHROPIC_API_KEY === "YOUR_API_KEY_HERE") {
        setResult({ headline:"API Key Missing 🔑", vision:"Add your Anthropic API key to unlock AI décor. Go to console.anthropic.com — free to start!", keyPieces:["1. Go to console.anthropic.com","2. Sign up free and create an API key","3. Copy the key (starts with sk-ant-)","4. Paste it in ANTHROPIC_API_KEY at the very top of your .jsx file","5. Re-upload to GitHub — Vercel rebuilds in 2 mins!"], shoppingList:["$5 free credit to test","~$10-30/month when live","Unlocks both AI features"] });
        setLoading(false); return;
      }
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages:[{ role:"user", content:[
            { type:"image", source:{ type:"base64", media_type:mime, data:b64 } },
            { type:"text", text:`Bachelorette décor designer. Analyze this space for a "${t.name}" theme (${t.colors.join(", ")}). JSON only (no fences): {"headline":"punchy headline","vision":"2-3 sentences","keyPieces":["5 items with placement"],"lighting":"tip","photoMoment":"backdrop","shoppingList":["3 items"]}` }
          ]}]
        })
      });
      const data = await res.json();
      setResult(JSON.parse(data.content.map(i=>i.text||"").join("").replace(/```json|```/g,"").trim()));
    } catch(err) {
      console.error("Decor API error:", err);
      setResult({ headline:"Check your API key 🔑", vision:"Something went wrong. Most likely the API key needs to be added. Go to console.anthropic.com to get your free key.", keyPieces:["1. Go to console.anthropic.com","2. Create a free API key","3. Paste in ANTHROPIC_API_KEY at top of file","4. Re-upload to GitHub","5. Try again!"], shoppingList:["Key starts with sk-ant-...","$5 free credit included","~$10-30/month when live"] });
    }
    setLoading(false);
  };
  return (
    <div>
      <SH title="AI Décor Visualizer" sub="Upload your space · Pick a theme · See the magic" />
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display:"none" }} />
      <div style={{ ...C, marginBottom:12 }}>
        <div style={{ fontSize:13, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK, marginBottom:10 }}>Upload Your Party Space</div>
        {!photo?(<button onClick={()=>fileRef.current?.click()} style={{ ...BP, width:"100%", padding:"13px", borderRadius:14 }}>📷 Upload Photo</button>):(<div><img src={photo} alt="Space" style={{ width:"100%", borderRadius:12, maxHeight:170, objectFit:"cover", border:`1.5px solid ${MID}`, marginBottom:8 }} /><div style={{ display:"flex", justifyContent:"space-between", fontFamily:"'DM Sans',sans-serif", fontSize:13 }}><span style={{ color:GREEN }}>✅ Ready!</span><button onClick={()=>{setPhoto(null);setResult(null);}} style={{ ...BG, fontSize:12, padding:"4px 12px" }}>Change</button></div></div>)}
      </div>
      <div style={{ ...C, marginBottom:12 }}>
        <div style={{ fontSize:13, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK, marginBottom:12 }}>Pick Your Vibe</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {DECOR_THEMES.map(t=>(<button key={t.id} onClick={()=>setTheme(t.id)} style={{ background:theme===t.id?SOFT:WHITE, border:theme===t.id?`2px solid ${HOT}`:`1.5px solid ${BORDER}`, borderRadius:12, padding:"10px 8px", cursor:"pointer", color:DARK, textAlign:"left", transition:"all 0.2s" }}><div style={{ fontSize:20, marginBottom:4 }}>{t.emoji}</div><div style={{ fontSize:11, fontWeight:700, fontFamily:"'DM Sans',sans-serif", color:DARK }}>{t.name}</div><div style={{ display:"flex", gap:4, marginTop:6 }}>{t.colors.map((c,i)=><div key={i} style={{ width:11, height:11, borderRadius:"50%", background:c, border:"1px solid rgba(0,0,0,0.1)" }} />)}</div></button>))}
        </div>
      </div>
      <button onClick={run} disabled={!photo||!theme||loading} style={{ ...BP, width:"100%", padding:"13px", fontSize:14, borderRadius:14, marginBottom:16, opacity:(!photo||!theme)?0.4:1 }}>
        {loading?"Analyzing...":"Transform My Space"}
      </button>
      {loading&&<div style={{ textAlign:"center", padding:"28px", color:HOT, fontFamily:"'DM Sans',sans-serif" }}>✨<br/><br/>Transforming your space...</div>}
      {result&&(
        <div style={{ background:SOFT, border:`1.5px solid ${MID}`, borderRadius:18, padding:"18px 16px" }}>
          <div style={{ fontSize:18, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK, marginBottom:8 }}>{result.headline}</div>
          <p style={{ fontSize:13, lineHeight:1.6, color:DARK, fontFamily:"'DM Sans',sans-serif", marginBottom:14, opacity:0.85 }}>{result.vision}</p>
          {result.keyPieces?.length>0&&(<div style={{ marginBottom:12 }}>{result.keyPieces.map((p,i)=><div key={i} style={{ display:"flex", gap:8, marginBottom:6, fontFamily:"'DM Sans',sans-serif", fontSize:12 }}><span style={{ color:HOT }}>✦</span><span style={{ color:DARK, opacity:0.85 }}>{p}</span></div>)}</div>)}
          {result.shoppingList?.length>0&&(<div style={{ background:WHITE, border:`1.5px solid ${BORDER}`, borderRadius:12, padding:"11px 13px", marginBottom:12 }}><div style={{ fontSize:10, color:HOT, fontFamily:"'DM Sans',sans-serif", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>🛍️ Shopping List</div>{result.shoppingList.map((item,i)=><div key={i} style={{ fontSize:12, fontFamily:"'DM Sans',sans-serif", color:DARK, opacity:0.8, marginBottom:3 }}>• {item}</div>)}</div>)}
          <button onClick={()=>setTab("shop")} style={{ ...BP, width:"100%" }}>🛍️ Shop These Items</button>
        </div>
      )}
    </div>
  );
}
