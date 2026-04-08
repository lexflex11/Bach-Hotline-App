import React, { useState } from 'react';
import { SOFT, MID, HOT, PUNCH, DARK, BORDER, WHITE } from '../../constants/colors.js';
import { C, BP, SM } from '../../constants/styles.js';
import { DESTS, BRIDE_TYPES } from '../../constants/data.js';
import { ANTHROPIC_API_KEY, flightUrl, airbnbUrl, viatorUrl } from '../../constants/api.js';
import SH from '../ui/SH.jsx';

export default function PlanTab({ groupSize }) {
  const [dest, setDest] = useState(null);
  const [days, setDays] = useState(3);
  const [bt, setBt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const tEmoji = { morning:"🌅", afternoon:"☀️", evening:"🌆", nightlife:"🌙" };
  const selectedBride = BRIDE_TYPES.find(b => b.id===bt);

  const generate = async () => {
    if (!dest || !bt) return;
    setLoading(true); setResult(null);
    const d = DESTS.find(x => x.id===dest);
    const b = BRIDE_TYPES.find(x => x.id===bt);
    try {
      // Check if API key is configured
      if (!ANTHROPIC_API_KEY || ANTHROPIC_API_KEY === "YOUR_API_KEY_HERE") {
        setResult({ title:"API Key Missing 🔑", tagline:"Almost there!", brideMessage:"Add your Anthropic API key to the top of this file to unlock AI itineraries. Go to console.anthropic.com to get your free key.", days:[], mustPack:["1. Go to console.anthropic.com","2. Create an API key","3. Paste it in the ANTHROPIC_API_KEY line at the top of bach-hotline-v3.jsx"], proTip:"Once your key is added, the AI will generate a fully personalized itinerary based on your bride's personality!", estimatedBudget:"Free to start — $5 credit included" });
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
          model: "claude-sonnet-4-20250514", max_tokens: 1200,
          messages: [{ role:"user", content:
            `Create a ${days}-day bachelorette itinerary for ${groupSize} ladies in ${d.name}.\n\nBRIDE TYPE: ${b.label} — ${b.desc}\nVIBE: ${b.vibe}\nACTIVITIES TO INCLUDE: ${b.activities}\nDESTINATION VIBE: ${d.vibe}\n\nTailor EVERYTHING to this exact bride personality. JSON only (no fences):\n{"title":"fun title matching personality","tagline":"one punchy vibe line","brideMessage":"personal hype message to the bride 1-2 sentences","days":[{"day":1,"theme":"day theme","morning":{"activity":"name","tip":"tip","cost":"$XX/person","bookingTip":"how to book this"},"afternoon":{"activity":"name","tip":"tip","cost":"$XX/person","bookingTip":"how to book"},"evening":{"activity":"name","tip":"tip","cost":"$XX/person","bookingTip":"how to book"},"nightlife":{"activity":"name","tip":"tip","cost":"$XX/person","bookingTip":"how to book"}}],"mustPack":["3 items for this bride type"],"proTip":"amazing tip for this personality+destination","estimatedBudget":"$XXX–$XXX per person"}`
          }]
        })
      });
      const data = await res.json();
      setResult(JSON.parse(data.content.map(i=>i.text||"").join("").replace(/```json|```/g,"").trim()));
    } catch(err) {
      console.error("API error:", err);
      setResult({
        title:"Oops — something went wrong 😅",
        tagline:"Don't worry, here's what to check:",
        brideMessage:"Most likely your API key needs to be added or the key has expired. Check the console for details.",
        days:[],
        mustPack:["✓ Check your API key at console.anthropic.com","✓ Make sure the key starts with sk-ant-","✓ Check you have billing set up (need a payment method after free credits)"],
        proTip:"Open your browser's developer tools (F12) → Console tab to see the exact error message.",
        estimatedBudget:""
      });
    }
    setLoading(false);
  };

  return (
    <div>
      <SH title="AI Trip Planner" sub="Pick your bride's personality — get a custom itinerary" />

      {/* Step 1 — Bride Type */}
      <div style={{...C, marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:4}}>What kind of bride is she?</div>
        <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",opacity:0.8,marginBottom:12}}>Every personality gets a completely different itinerary ✨</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {BRIDE_TYPES.map(b=>(
            <button key={b.id} onClick={()=>setBt(b.id)} style={{background:bt===b.id?b.bg:WHITE,border:bt===b.id?`2px solid ${b.color}`:`1.5px solid ${BORDER}`,borderRadius:14,padding:"12px 10px",cursor:"pointer",textAlign:"left",transition:"all 0.2s",boxShadow:bt===b.id?`0 3px 12px ${b.color}33`:"none"}}>
              <div style={{fontSize:24,marginBottom:5}}>{b.emoji}</div>
              <div style={{fontSize:12,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:bt===b.id?b.color:DARK}}>{b.label}</div>
              <div style={{fontSize:10,color:"#888",fontFamily:"'DM Sans',sans-serif",marginTop:3,lineHeight:1.3}}>{b.desc}</div>
            </button>
          ))}
        </div>
        {selectedBride&&(
          <div style={{marginTop:12,padding:"10px 12px",borderRadius:12,background:selectedBride.bg,border:`1.5px solid ${selectedBride.border}`}}>
            <div style={{fontSize:11,fontWeight:700,color:selectedBride.color,fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:1}}>Planning for: {selectedBride.label}</div>
            <div style={{fontSize:11,color:"#555",fontFamily:"'DM Sans',sans-serif",marginTop:4}}>Activities: <em>{selectedBride.activities}</em></div>
          </div>
        )}
      </div>

      {/* Step 2 — Destination */}
      <div style={{...C,marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:12}}>Where are you going?</div>

        {/* US destinations */}
        <div style={{fontSize:10,fontWeight:700,color:HOT,fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>🇺🇸 United States</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
          {DESTS.filter(d=>!d.international).map(d=>(
            <button key={d.id} onClick={()=>setDest(d.id)} style={{background:dest===d.id?SOFT:WHITE,border:dest===d.id?`2px solid ${HOT}`:`1.5px solid ${BORDER}`,borderRadius:12,padding:"10px",cursor:"pointer",color:DARK,textAlign:"left",transition:"all 0.2s"}}>
              <div style={{fontSize:20,marginBottom:3}}>{d.emoji}</div>
              <div style={{fontSize:12,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>{d.name}</div>
              <div style={{fontSize:10,color:HOT,fontFamily:"'DM Sans',sans-serif",opacity:0.75}}>{d.vibe}</div>
            </button>
          ))}
        </div>

        {/* International destinations */}
        <div style={{fontSize:10,fontWeight:700,color:HOT,fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>🌍 International</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {DESTS.filter(d=>d.international).map(d=>(
            <button key={d.id} onClick={()=>setDest(d.id)} style={{background:dest===d.id?SOFT:WHITE,border:dest===d.id?`2px solid ${HOT}`:`1.5px solid ${BORDER}`,borderRadius:12,padding:"10px",cursor:"pointer",color:DARK,textAlign:"left",transition:"all 0.2s"}}>
              <div style={{fontSize:20,marginBottom:3}}>{d.emoji}</div>
              <div style={{fontSize:12,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>{d.name}</div>
              <div style={{fontSize:10,color:HOT,fontFamily:"'DM Sans',sans-serif",opacity:0.75}}>{d.vibe}</div>
              <div style={{fontSize:9,color:"#aaa",fontFamily:"'DM Sans',sans-serif",marginTop:4}}>{d.trend}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Step 3 — Days */}
      <div style={{...C,marginBottom:14,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>How many days?</div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>setDays(Math.max(1,days-1))} style={SM}>−</button>
          <span style={{fontWeight:900,color:HOT,fontSize:20,minWidth:28,textAlign:"center"}}>{days}</span>
          <button onClick={()=>setDays(Math.min(5,days+1))} style={SM}>+</button>
        </div>
      </div>

      <button onClick={generate} disabled={!dest||!bt||loading} style={{...BP,width:"100%",padding:"13px",fontSize:14,borderRadius:14,marginBottom:16,opacity:(!dest||!bt)?0.4:1}}>
        {loading?`✨ Planning the perfect ${selectedBride?.label||""} trip...`:"Generate My Itinerary"}
      </button>
      {(!dest||!bt)&&<div style={{textAlign:"center",fontSize:12,color:"#bbb",fontFamily:"'DM Sans',sans-serif",marginBottom:16}}>{!bt?"👆 Pick your bride's personality first":"👆 Now pick a destination"}</div>}

      {loading&&(
        <div style={{textAlign:"center",padding:"32px"}}>

          <div style={{fontSize:14,color:HOT,fontFamily:"'DM Sans',sans-serif",fontWeight:700,marginBottom:6}}>Creating the perfect {selectedBride?.label} trip...</div>
          <div style={{fontSize:12,color:"#bbb",fontFamily:"'DM Sans',sans-serif"}}>Tailoring every detail to her vibe ✨</div>
        </div>
      )}

      {result?.days?.length>0&&(
        <div>
          {/* Result hero */}
          <div style={{borderRadius:18,padding:"20px 18px",marginBottom:14,background:selectedBride?.bg||SOFT,border:`1.5px solid ${selectedBride?.border||MID}`}}>

            <div style={{fontSize:19,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>{result.title}</div>
            <div style={{fontSize:13,color:selectedBride?.color||HOT,fontFamily:"'DM Sans',sans-serif",marginTop:5}}>{result.tagline}</div>
            {result.brideMessage&&(
              <div style={{marginTop:12,padding:"10px 12px",background:WHITE,borderRadius:10,border:`1px solid ${selectedBride?.border||MID}`}}>
                <div style={{fontSize:10,color:selectedBride?.color||HOT,fontFamily:"'DM Sans',sans-serif",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>💌 Message to the bride</div>
                <div style={{fontSize:13,color:DARK,fontFamily:"'DM Sans',sans-serif",fontStyle:"italic",lineHeight:1.5}}>"{result.brideMessage}"</div>
              </div>
            )}
            <div style={{display:"flex",gap:16,marginTop:12,fontFamily:"'DM Sans',sans-serif",fontSize:12,flexWrap:"wrap"}}>
              <span><span style={{color:"#bbb"}}>Group: </span><span style={{color:PUNCH,fontWeight:700}}>{groupSize} ladies</span></span>
              <span><span style={{color:"#bbb"}}>Days: </span><span style={{color:PUNCH,fontWeight:700}}>{days}</span></span>
              {result.estimatedBudget&&<span><span style={{color:"#bbb"}}>Budget: </span><span style={{color:selectedBride?.color||HOT,fontWeight:700}}>{result.estimatedBudget}</span></span>}
            </div>
          </div>

          {/* Day cards */}
          {result.days.map((day,di)=>(
            <div key={di} style={{...C,marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                <div style={{width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${HOT},${PUNCH})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,fontFamily:"'DM Sans',sans-serif",color:WHITE,flexShrink:0}}>D{day.day}</div>
                <div style={{fontSize:15,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>{day.theme}</div>
              </div>
              {["morning","afternoon","evening","nightlife"].map(slot=>{
                const item=day[slot]; if(!item)return null;
                return(
                  <div key={slot} style={{marginBottom:12,paddingBottom:12,borderBottom:slot!=="nightlife"?`1px solid ${SOFT}`:"none"}}>
                    <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                      <div style={{fontSize:16,flexShrink:0,marginTop:2}}>{tEmoji[slot]}</div>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                          <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>{item.activity}</div>
                          <div style={{fontSize:12,color:PUNCH,fontFamily:"'DM Sans',sans-serif",fontWeight:700,flexShrink:0,marginLeft:8}}>{item.cost}</div>
                        </div>
                        <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",marginTop:3,fontStyle:"italic",opacity:0.8}}>💡 {item.tip}</div>
                        {item.bookingTip&&<div style={{fontSize:10,color:"#888",fontFamily:"'DM Sans',sans-serif",marginTop:5,background:"#fdf5fa",border:`1px solid ${BORDER}`,borderRadius:8,padding:"4px 9px",display:"inline-block"}}>🔗 {item.bookingTip}</div>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Must pack */}
          {result.mustPack?.length>0&&(
            <div style={{...C,marginBottom:12}}>
              <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:10}}>Must-Pack for the {selectedBride?.label}</div>
              {result.mustPack.map((item,i)=>(
                <div key={i} style={{display:"flex",gap:8,marginBottom:6,fontFamily:"'DM Sans',sans-serif",fontSize:12}}>
                  <span style={{color:selectedBride?.color||HOT}}>✦</span>
                  <span style={{color:DARK,opacity:0.85}}>{item}</span>
                </div>
              ))}
            </div>
          )}

          {/* Pro tip */}
          {result.proTip&&(
            <div style={{padding:"14px 16px",borderRadius:14,background:selectedBride?.bg||SOFT,border:`1.5px solid ${selectedBride?.border||MID}`,marginBottom:14}}>
              <div style={{fontSize:10,color:selectedBride?.color||PUNCH,fontFamily:"'DM Sans',sans-serif",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>✨ Pro Tip</div>
              <div style={{fontSize:13,color:DARK,fontFamily:"'DM Sans',sans-serif",lineHeight:1.55}}>{result.proTip}</div>
            </div>
          )}

          {/* Book CTA */}
          <div style={{...C,background:SOFT,border:`1.5px solid ${MID}`}}>
            <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:12}}>🔗 Book this trip now</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <a href={flightUrl(DESTS.find(d=>d.id===dest)?.toFull||"",groupSize)} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
                <button style={{...BP,width:"100%",fontSize:13,padding:"11px"}}>✈️ Search Flights on Expedia</button>
              </a>
              <a href={airbnbUrl(DESTS.find(d=>d.id===dest)?.name||"",groupSize)} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
                <button style={{width:"100%",background:"linear-gradient(135deg,#FF5A5F,#FF3D42)",color:WHITE,border:"none",borderRadius:50,padding:"11px",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:700,cursor:"pointer"}}>🏠 Search Airbnbs for {groupSize}</button>
              </a>
              <a href={viatorUrl("bachelorette",DESTS.find(d=>d.id===dest)?.name||"")} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
                <button style={{width:"100%",background:"linear-gradient(135deg,#00B0A0,#008F82)",color:WHITE,border:"none",borderRadius:50,padding:"11px",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:700,cursor:"pointer"}}>🎯 Browse Activities on Viator</button>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
