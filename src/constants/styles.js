import { WHITE, SOFT, MID, HOT, PUNCH, DARK, BORDER } from './colors.js';

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
export const C  = { background:WHITE, border:`1.5px solid ${BORDER}`, borderRadius:18, padding:"14px 13px", boxShadow:`0 2px 10px rgba(230,101,130,0.07)` };
export const BP = { background:`linear-gradient(135deg,${HOT},${PUNCH})`, color:WHITE, border:"none", borderRadius:50, padding:"11px 22px", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:700, cursor:"pointer", boxShadow:`0 4px 16px rgba(213,36,56,0.25)`, transition:"transform .15s" };
export const BS = { background:SOFT, color:HOT, border:`1.5px solid ${MID}`, borderRadius:50, padding:"9px 18px", fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, cursor:"pointer" };
export const BG = { background:WHITE, color:HOT, border:`1.5px solid ${BORDER}`, borderRadius:50, padding:"6px 13px", fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700, cursor:"pointer" };
export const IN = { width:"100%", padding:"10px 14px", borderRadius:50, background:SOFT, border:`1.5px solid ${BORDER}`, color:DARK, fontFamily:"'DM Sans',sans-serif", fontSize:13, outline:"none", boxSizing:"border-box" };
export const SM = { background:SOFT, border:`1.5px solid ${MID}`, color:HOT, borderRadius:8, width:28, height:28, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:15, display:"flex", alignItems:"center", justifyContent:"center" };
