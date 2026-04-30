import React, { useEffect, useRef } from 'react';
import { DESTS } from '../../constants/data.js';
import SH from '../ui/SH.jsx';

function buildWidgetSrc(originCode, destCode, adults) {
  const params = new URLSearchParams({
    currency:         "usd",
    trs:              "523908",
    shmarker:         "723599",
    show_hotels:      "false",
    powered_by:       "false",
    locale:           "en_us",
    searchUrl:        "www.aviasales.com/search",
    primary_override: "#e66582",
    color_button:     "#e66582",
    color_icons:      "#e66582",
    dark:             "#2d0a18",
    light:            "#ffffff",
    secondary:        "#ffcfec",
    special:          "#ffe0f4",
    color_focused:    "#e66582",
    border_radius:    "8",
    plain:            "true",
    promo_id:         "7879",
    campaign_id:      "100",
  });

  if (originCode) params.set("origin",      originCode);
  if (destCode)   params.set("destination", destCode);
  if (adults > 1) params.set("adults",      String(adults));

  return `https://tpwgt.com/content?${params.toString()}`;
}

export default function FlightsTab({ groupSize, initialDest }) {
  const containerRef = useRef(null);

  const selectedDest = DESTS.find(d => d.id === initialDest);
  const destCode     = selectedDest?.airportCode || null;
  const originCode   = localStorage.getItem("bh_airport") || "IAH";

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear old widget before injecting new one
    containerRef.current.innerHTML = "";

    const script = document.createElement('script');
    script.src     = buildWidgetSrc(originCode, destCode, groupSize);
    script.async   = true;
    script.charset = 'utf-8';
    containerRef.current.appendChild(script);
  }, [originCode, destCode, groupSize]);

  return (
    <div>
      <SH title="Group Flight Search" sub="Search and book real-time flights for your group" />
      <div ref={containerRef} style={{ minHeight: 200, marginTop: 8 }} />
    </div>
  );
}
