import React, { useState } from 'react';
import { SOFT, MID, HOT, PUNCH, DARK, BORDER, WHITE } from '../../constants/colors.js';
import { C, BP, BS, BG, IN } from '../../constants/styles.js';
import { PRODUCTS, SHOP_CATS } from '../../constants/data.js';
import SH from '../ui/SH.jsx';
import Chip from '../ui/Chip.jsx';

function ProductCard({ p, onAdd, inCart, onView }) {
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState(false);
  const catE = { "Party Accessories":"🎀","Balloons":"🎈","Apparel":"👙","Cups":"🥂","Curated Itineraries":"📋" };
  return (
    <div style={{ background:WHITE, border:`1.5px solid ${BORDER}`, borderRadius:18, overflow:"hidden", display:"flex", flexDirection:"column", position:"relative", boxShadow:`0 2px 10px rgba(230,101,130,0.08)`, transition:"all 0.2s" }}
      onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 6px 22px rgba(230,101,130,0.18)`;e.currentTarget.style.transform="translateY(-2px)"}}
      onMouseLeave={e=>{e.currentTarget.style.boxShadow=`0 2px 10px rgba(230,101,130,0.08)`;e.currentTarget.style.transform="translateY(0)"}}>
      <div style={{ position:"absolute", top:8, left:8, zIndex:3, display:"flex", flexDirection:"column", gap:3 }}>
        {p.bestseller && <div style={{ background:PUNCH, color:WHITE, borderRadius:6, fontSize:8, fontFamily:"'DM Sans',sans-serif", fontWeight:900, padding:"3px 8px", textTransform:"uppercase" }}>⭐ Best Seller</div>}
        {p.isDigital  && <div style={{ background:HOT,   color:WHITE, borderRadius:6, fontSize:8, fontFamily:"'DM Sans',sans-serif", fontWeight:900, padding:"3px 8px" }}>⚡ Digital</div>}
      </div>
      <button style={{ position:"absolute", top:8, right:8, zIndex:3, background:"rgba(255,255,255,0.9)", border:`1px solid ${BORDER}`, borderRadius:"50%", width:28, height:28, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:HOT }}>♡</button>
      <div onClick={onView} style={{ width:"100%", aspectRatio:"1/1", overflow:"hidden", cursor:"pointer", position:"relative", background:SOFT, flexShrink:0 }}>
        {!loaded && !err && <div style={{ position:"absolute", inset:0, background:`linear-gradient(90deg,${SOFT} 25%,${MID}66 50%,${SOFT} 75%)`, backgroundSize:"200% 100%", animation:"shimmer 1.4s infinite" }} />}
        {!err ? (
          <img src={p.image} alt={p.name} onLoad={()=>setLoaded(true)} onError={()=>setErr(true)}
            style={{ width:"100%", height:"100%", objectFit:"cover", opacity:loaded?1:0, transition:"opacity 0.4s, transform 0.3s", display:"block" }}
            onMouseEnter={e=>e.currentTarget.style.transform="scale(1.06)"}
            onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
        ) : (
          <div style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6 }}>
            <div style={{ fontSize:34 }}>{catE[p.category]||"🎀"}</div>
            <div style={{ fontSize:9, color:HOT, fontFamily:"'DM Sans',sans-serif", textAlign:"center", padding:"0 8px" }}>{p.name}</div>
          </div>
        )}
      </div>
      <div style={{ padding:"11px 12px 13px", flex:1, display:"flex", flexDirection:"column", background:WHITE }}>
        <div style={{ fontSize:9, color:HOT, fontFamily:"'DM Sans',sans-serif", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:3 }}>{p.category}</div>
        <div onClick={onView} style={{ fontSize:12, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK, lineHeight:1.35, marginBottom:6, cursor:"pointer", flex:1 }}>{p.name}</div>
        <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:8 }}>
          <span style={{ fontSize:10, color:HOT }}>{"★".repeat(Math.floor(p.rating))}</span>
          <span style={{ fontSize:9, color:"#bbb", fontFamily:"'DM Sans',sans-serif" }}>({p.reviews})</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:6 }}>
          <div>
            <div style={{ fontSize:15, fontWeight:900, color:inCart?HOT:PUNCH, fontFamily:"'Playfair Display',Georgia,serif" }}>${p.price.toFixed(2)}</div>
            {p.isDigital && <div style={{ fontSize:8, color:HOT, fontFamily:"'DM Sans',sans-serif" }}>Instant download</div>}
          </div>
          <button onClick={()=>onAdd(p)} style={{ background:inCart?SOFT:`linear-gradient(135deg,${HOT},${PUNCH})`, color:inCart?HOT:WHITE, border:inCart?`1.5px solid ${HOT}`:"none", borderRadius:50, padding:"7px 12px", fontFamily:"'DM Sans',sans-serif", fontSize:10, fontWeight:800, cursor:"pointer", transition:"all 0.2s", whiteSpace:"nowrap" }}>
            {inCart?"Added":"Add"}
          </button>
        </div>
      </div>
      <style>{`@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}`}</style>
    </div>
  );
}

function ProductModal({ p, onClose, onAdd, inCart }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  if (!p) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:500, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:`rgba(45,10,24,0.45)`, backdropFilter:"blur(6px)" }} />
      <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:430, background:WHITE, borderRadius:"26px 26px 0 0", border:`1.5px solid ${BORDER}`, borderBottom:"none", maxHeight:"90vh", overflowY:"auto", paddingBottom:36 }}>
        <div style={{ width:44, height:4, borderRadius:2, background:MID, margin:"14px auto 0" }} />
        <button onClick={onClose} style={{ position:"absolute", top:14, right:16, background:SOFT, border:`1px solid ${BORDER}`, borderRadius:"50%", width:32, height:32, cursor:"pointer", color:HOT, fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
        <div style={{ margin:"16px 16px 0", borderRadius:18, overflow:"hidden", aspectRatio:"1/1", background:SOFT, position:"relative" }}>
          {!imgLoaded && <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:48 }}>🎀</div>}
          <img src={p.image} alt={p.name} onLoad={()=>setImgLoaded(true)} style={{ width:"100%", height:"100%", objectFit:"cover", opacity:imgLoaded?1:0, transition:"opacity 0.4s" }} />
        </div>
        <div style={{ padding:"18px 18px 0" }}>
          <div style={{ display:"flex", gap:6, marginBottom:10, flexWrap:"wrap", alignItems:"center" }}>
            <span style={{ fontSize:10, color:HOT, fontFamily:"'DM Sans',sans-serif", fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>{p.category}</span>
            {p.bestseller && <span style={{ background:PUNCH, color:WHITE, borderRadius:7, fontSize:8, fontFamily:"'DM Sans',sans-serif", fontWeight:900, padding:"3px 8px" }}>⭐ Best Seller</span>}
            {p.isDigital && <span style={{ background:SOFT, color:HOT, borderRadius:7, fontSize:8, fontFamily:"'DM Sans',sans-serif", fontWeight:900, padding:"3px 8px", border:`1px solid ${MID}` }}>⚡ Digital</span>}
          </div>
          <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:18, fontWeight:700, color:DARK, marginBottom:8, lineHeight:1.3 }}>{p.fullName}</h2>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
            <span style={{ fontSize:13, color:HOT }}>{"★".repeat(Math.floor(p.rating))}</span>
            <span style={{ fontSize:11, color:"#bbb", fontFamily:"'DM Sans',sans-serif" }}>{p.rating} · {p.reviews} reviews</span>
          </div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:18 }}>
            {p.tags.map(t => <span key={t} style={{ fontSize:10, padding:"3px 10px", borderRadius:20, background:SOFT, border:`1px solid ${MID}`, color:HOT, fontFamily:"'DM Sans',sans-serif" }}>#{t}</span>)}
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <div style={{ fontSize:28, fontWeight:900, color:PUNCH, fontFamily:"'Playfair Display',Georgia,serif" }}>${p.price.toFixed(2)}</div>
            {p.isDigital && <div style={{ fontSize:12, color:HOT, fontFamily:"'DM Sans',sans-serif" }}>📥 Instant PDF</div>}
          </div>
          <div style={{ display:"flex", gap:10, marginBottom:14 }}>
            <button onClick={()=>{onAdd(p);onClose();}} style={{ ...BP, flex:2, padding:"13px", fontSize:14 }}>{inCart?"In Cart":"Add to Cart"}</button>
            <a href={p.url} target="_blank" rel="noreferrer" style={{ ...BS, flex:1, padding:"13px", fontSize:12, textDecoration:"none", display:"flex", alignItems:"center", justifyContent:"center" }}>🛍️ Etsy</a>
          </div>
          <div style={{ fontSize:11, color:"#bbb", fontFamily:"'DM Sans',sans-serif", textAlign:"center" }}>BachHotlineSupplies · Houston, TX · 420 sales · ⭐ 4.9</div>
        </div>
      </div>
    </div>
  );
}

export default function ShopTab({ cart, setCart }) {
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("featured");
  const [search, setSearch] = useState("");
  const [digitalOnly, setDig] = useState(false);
  const [selected, setSelected] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const inCart = id => cart.some(c=>c.id===id);
  const add    = p  => { if (!inCart(p.id)) setCart(prev=>[...prev,p]); };
  const remove = id => setCart(prev=>prev.filter(c=>c.id!==id));
  const total  = cart.reduce((s,i)=>s+i.price,0);
  const filtered = PRODUCTS.filter(p=>{
    const mc=cat==="all"||p.category===cat;
    const ms=!search||p.name.toLowerCase().includes(search.toLowerCase())||p.tags.some(t=>t.includes(search.toLowerCase()));
    const md=!digitalOnly||p.isDigital;
    return mc&&ms&&md;
  }).sort((a,b)=>{
    if(sort==="price_asc") return a.price-b.price;
    if(sort==="price_desc") return b.price-a.price;
    if(sort==="rating") return b.rating-a.rating;
    return (b.bestseller?1:0)-(a.bestseller?1:0);
  });
  return (
    <div>
      <div style={{ marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
          <div>
            <div style={{ fontSize:17, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK }}>🎀 Party Supply Shop</div>
            <div style={{ fontSize:10, color:HOT, fontFamily:"'DM Sans',sans-serif", marginTop:2, opacity:0.75 }}>bachhotlinesupplies.etsy.com · 534 products · ⭐ 4.9</div>
          </div>
          <button onClick={()=>setCartOpen(!cartOpen)} style={{ background:cart.length>0?`linear-gradient(135deg,${HOT},${PUNCH})`:SOFT, border:`1.5px solid ${cart.length>0?HOT:BORDER}`, borderRadius:50, padding:"8px 14px", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:700, color:cart.length>0?WHITE:HOT, display:"flex", alignItems:"center", gap:5 }}>
            🛒 {cart.length}{cart.length>0&&<span>${total.toFixed(0)}</span>}
          </button>
        </div>
        {cartOpen && (
          <div style={{ background:SOFT, border:`1.5px solid ${MID}`, borderRadius:16, padding:14, marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
              <div style={{ fontSize:14, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK }}>Your Cart ({cart.length})</div>
              <div style={{ fontSize:13, color:PUNCH, fontFamily:"'DM Sans',sans-serif", fontWeight:700 }}>${total.toFixed(2)}</div>
            </div>
            {cart.length===0 ? <div style={{ textAlign:"center", color:HOT, fontFamily:"'DM Sans',sans-serif", fontSize:13, opacity:0.65 }}>Your cart is empty 💔</div> : (
              <>
                {cart.map(item=>(
                  <div key={item.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10, paddingBottom:10, borderBottom:`1px solid ${MID}` }}>
                    <img src={item.image} alt={item.name} style={{ width:42, height:42, borderRadius:10, objectFit:"cover", border:`1px solid ${MID}`, flexShrink:0 }} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.name}</div>
                      <div style={{ fontSize:12, color:PUNCH, fontFamily:"'DM Sans',sans-serif", fontWeight:700 }}>${item.price.toFixed(2)}</div>
                    </div>
                    <button onClick={()=>remove(item.id)} style={{ background:`rgba(213,36,56,0.1)`, border:"none", borderRadius:"50%", width:26, height:26, cursor:"pointer", color:PUNCH, fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
                  </div>
                ))}
                <button style={{ ...BP, width:"100%", padding:"12px", fontSize:13 }}>Checkout — ${total.toFixed(2)}</button>
              </>
            )}
          </div>
        )}
        <div style={{ position:"relative", marginBottom:10 }}>
          <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:14, opacity:0.35, pointerEvents:"none" }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search 534 products..." style={{ ...IN, paddingLeft:38 }} />
          {search && <button onClick={()=>setSearch("")} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:HOT, fontSize:16 }}>×</button>}
        </div>
        <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:4, scrollbarWidth:"none" }}>
          {SHOP_CATS.map(c=><Chip key={c.id} label={`${c.emoji} ${c.label}`} active={cat===c.id} onClick={()=>setCat(c.id)} />)}
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10, flexWrap:"wrap" }}>
        <span style={{ fontSize:10, color:"#bbb", fontFamily:"'DM Sans',sans-serif" }}>Sort:</span>
        {[["featured","Featured"],["price_asc","Price ↑"],["price_desc","Price ↓"],["rating","Top Rated"]].map(([v,l])=>(
          <button key={v} onClick={()=>setSort(v)} style={{ ...BG, fontSize:10, padding:"5px 11px", background:sort===v?SOFT:WHITE, color:sort===v?HOT:"#bbb", border:sort===v?`1.5px solid ${HOT}`:`1.5px solid ${BORDER}` }}>{l}</button>
        ))}
        <button onClick={()=>setDig(!digitalOnly)} style={{ ...BG, fontSize:10, padding:"5px 11px", marginLeft:"auto", background:digitalOnly?SOFT:WHITE, color:digitalOnly?HOT:"#bbb", border:digitalOnly?`1.5px solid ${HOT}`:`1.5px solid ${BORDER}` }}>⚡ Digital</button>
      </div>
      {cat==="all"&&!search&&(
        <div onClick={()=>setSelected(PRODUCTS[8])} style={{ borderRadius:18, overflow:"hidden", position:"relative", cursor:"pointer", aspectRatio:"2.5/1", marginBottom:14, boxShadow:`0 4px 18px rgba(230,101,130,0.18)` }}>
          <img src={PRODUCTS[8].image} alt="Featured" style={{ width:"100%", height:"100%", objectFit:"cover", filter:"brightness(0.6)" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(90deg,rgba(45,10,24,0.88),transparent 65%)", display:"flex", alignItems:"center", padding:"0 18px" }}>
            <div>
              <div style={{ fontSize:9, color:MID, fontFamily:"'DM Sans',sans-serif", fontWeight:700, textTransform:"uppercase", letterSpacing:2, marginBottom:5 }}>🔥 Featured</div>
              <div style={{ fontSize:16, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:WHITE, marginBottom:5 }}>{PRODUCTS[8].name}</div>
              <div style={{ fontSize:20, fontWeight:900, color:MID, fontFamily:"'Playfair Display',Georgia,serif" }}>${PRODUCTS[8].price.toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {filtered.length>0 ? filtered.map(p=>(
          <ProductCard key={p.id} p={p} onAdd={add} inCart={inCart(p.id)} onView={()=>setSelected(p)} />
        )) : (
          <div style={{ gridColumn:"span 2", textAlign:"center", padding:"40px 20px" }}>
            <div style={{ fontSize:36, marginBottom:10 }}>🔍</div>
            <div style={{ fontSize:14, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK, marginBottom:6 }}>No products found</div>
            <button onClick={()=>{setSearch("");setCat("all");}} style={{ ...BS, marginTop:10, fontSize:12 }}>Clear filters</button>
          </div>
        )}
      </div>
      {filtered.length>0&&(
        <div style={{ padding:"22px 0 0", textAlign:"center" }}>
          <a href="https://bachhotlinesupplies.etsy.com" target="_blank" rel="noreferrer" style={{ ...BP, textDecoration:"none", display:"inline-block", fontSize:14, padding:"12px 26px" }}>View All 534 Products on Etsy</a>
          <div style={{ marginTop:10, fontSize:10, color:"#bbb", fontFamily:"'DM Sans',sans-serif" }}>bachhotlinesupplies.etsy.com · ⭐ 4.9 · 420 sales · Houston, TX</div>
        </div>
      )}
      <ProductModal p={selected} onClose={()=>setSelected(null)} onAdd={add} inCart={selected?inCart(selected.id):false} />
    </div>
  );
}
