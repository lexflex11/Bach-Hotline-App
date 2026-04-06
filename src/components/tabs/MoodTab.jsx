import React, { useState } from 'react';
import { WHITE, SOFT, MID, HOT, PUNCH, DARK, BORDER } from '../../constants/colors.js';
import { C, BP, BG } from '../../constants/styles.js';
import { AESTHETICS, PRODUCTS } from '../../constants/data.js';
import SH from '../ui/SH.jsx';

export default function MoodTab() {
  const [selected, setSelected] = useState(null);
  const aesthetic = AESTHETICS.find(a => a.id === selected);

  return (
    <div>
      <SH title="Theme & Aesthetic" sub="Pick your aesthetic — outfits, décor, photos, hashtags" />

      {!selected ? (
        <div>
          <div style={{fontSize:13,color:HOT,fontFamily:"'DM Sans',sans-serif",marginBottom:14,opacity:0.8}}>
            Pick a theme and we'll give you the complete look — outfits, décor, photo inspo, and hashtags. 📸
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {AESTHETICS.map(a=>(
              <button key={a.id} onClick={()=>setSelected(a.id)} style={{background:WHITE,border:`1.5px solid ${BORDER}`,borderRadius:18,padding:"16px 14px",cursor:"pointer",textAlign:"left",transition:"all 0.2s",boxShadow:`0 2px 10px rgba(230,101,130,0.07)`}}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 6px 20px rgba(230,101,130,0.18)`;e.currentTarget.style.transform="translateY(-2px)"}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow=`0 2px 10px rgba(230,101,130,0.07)`;e.currentTarget.style.transform="translateY(0)"}}>
                <div style={{fontSize:28,marginBottom:8}}>{a.emoji}</div>
                <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:4}}>{a.name}</div>
                <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",lineHeight:1.4,opacity:0.8}}>{a.vibe}</div>
                {/* Color swatches */}
                <div style={{display:"flex",gap:4,marginTop:10}}>
                  {a.colors.map((c,i)=>(
                    <div key={i} style={{width:16,height:16,borderRadius:"50%",background:c,border:"1.5px solid rgba(255,255,255,0.8)",boxShadow:"0 1px 3px rgba(0,0,0,0.15)"}} />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <button onClick={()=>setSelected(null)} style={{...BG,marginBottom:16,fontSize:12,padding:"7px 14px"}}>← All Themes</button>

          {/* Hero */}
          <div style={{borderRadius:18,padding:"20px 16px",background:SOFT,border:`1.5px solid ${MID}`,marginBottom:14,textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:8}}>{aesthetic.emoji}</div>
            <div style={{fontSize:20,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>{aesthetic.name}</div>
            <div style={{fontSize:13,color:HOT,fontFamily:"'DM Sans',sans-serif",marginTop:6,lineHeight:1.5,fontStyle:"italic"}}>"{aesthetic.vibe}"</div>
            {/* Color palette */}
            <div style={{display:"flex",justifyContent:"center",gap:8,marginTop:14,flexWrap:"wrap"}}>
              {aesthetic.colors.map((c,i)=>(
                <div key={i} style={{textAlign:"center"}}>
                  <div style={{width:36,height:36,borderRadius:"50%",background:c,margin:"0 auto 4px",border:"2px solid white",boxShadow:"0 2px 8px rgba(0,0,0,0.15)"}} />
                  <div style={{fontSize:9,color:DARK,fontFamily:"'DM Sans',sans-serif",opacity:0.7}}>{aesthetic.palette[i]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Outfits */}
          <div style={{...C,marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:10}}>What to Wear</div>
            {aesthetic.outfits.map((item,i)=>(
              <div key={i} style={{display:"flex",gap:10,marginBottom:8,alignItems:"center"}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:aesthetic.colors[0],flexShrink:0}} />
                <div style={{fontSize:13,fontFamily:"'DM Sans',sans-serif",color:DARK}}>{item}</div>
              </div>
            ))}
          </div>

          {/* Décor */}
          <div style={{...C,marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:10}}>Décor Ideas</div>
            {aesthetic.decor.map((item,i)=>(
              <div key={i} style={{display:"flex",gap:10,marginBottom:8,alignItems:"center"}}>
                <span style={{color:HOT,fontSize:12}}>✦</span>
                <div style={{fontSize:13,fontFamily:"'DM Sans',sans-serif",color:DARK}}>{item}</div>
              </div>
            ))}
          </div>

          {/* Photo shots */}
          <div style={{...C,marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:10}}>Photo Moments</div>
            {aesthetic.shots.map((item,i)=>(
              <div key={i} style={{display:"flex",gap:10,marginBottom:8,alignItems:"center"}}>
                <span style={{fontSize:14}}>📷</span>
                <div style={{fontSize:13,fontFamily:"'DM Sans',sans-serif",color:DARK}}>{item}</div>
              </div>
            ))}
          </div>

          {/* Hashtags */}
          <div style={{...C,marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:10}}>Hashtag Pack</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {aesthetic.hashtags.map((tag,i)=>(
                <span key={i} style={{fontSize:11,padding:"4px 11px",borderRadius:50,background:SOFT,border:`1.5px solid ${MID}`,color:HOT,fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Shop this look */}
          <div style={{...C,background:SOFT,border:`1.5px solid ${MID}`}}>
            <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:12}}>Shop This Look</div>
            <div style={{display:"flex",gap:8}}>
              {aesthetic.shopItems.slice(0,3).map(id=>{
                const p = PRODUCTS.find(pr=>pr.id===id);
                if (!p) return null;
                return (
                  <a key={id} href={p.url} target="_blank" rel="noreferrer" style={{flex:1,textDecoration:"none"}}>
                    <div style={{background:WHITE,border:`1.5px solid ${BORDER}`,borderRadius:12,overflow:"hidden",textAlign:"center"}}>
                      <img src={p.image} alt={p.name} style={{width:"100%",aspectRatio:"1/1",objectFit:"cover",display:"block"}} />
                      <div style={{padding:"6px 8px"}}>
                        <div style={{fontSize:10,fontFamily:"'DM Sans',sans-serif",color:DARK,fontWeight:600,lineHeight:1.3}}>{p.name}</div>
                        <div style={{fontSize:11,color:PUNCH,fontFamily:"'DM Sans',sans-serif",fontWeight:700,marginTop:2}}>${p.price.toFixed(2)}</div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
            <a href="https://bachhotlinesupplies.etsy.com" target="_blank" rel="noreferrer" style={{...BP,display:"block",textAlign:"center",textDecoration:"none",marginTop:12,fontSize:12,padding:"10px"}}>
              Shop All 534 Items on Etsy 🛍️
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
