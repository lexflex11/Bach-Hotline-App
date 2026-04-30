import React, { useEffect, useRef } from 'react';
import SH from '../ui/SH.jsx';

// Brand colors: HOT=#e66582, SOFT=#ffe7f9, MID=#ffcfec, DARK=#2d0a18
const WIDGET_SRC = "https://tpwgt.com/content?currency=usd&trs=523908&shmarker=723599&show_hotels=false&powered_by=true&locale=en_us&searchUrl=www.aviasales.com%2Fsearch&primary_override=%23e66582&color_button=%23e66582&color_icons=%23e66582&dark=%232d0a18&light=%23ffffff&secondary=%23ffcfec&special=%23ffe0f4&color_focused=%23e66582&border_radius=8&plain=false&promo_id=7879&campaign_id=100";

export default function FlightsTab({ groupSize }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Remove any previously injected script to avoid duplicates on re-mount
    const existing = containerRef.current.querySelector('script');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.src = WIDGET_SRC;
    script.async = true;
    script.charset = 'utf-8';
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div>
      <SH title="Group Flight Search" sub="Search and book real-time flights for your group" />
      <div ref={containerRef} style={{ minHeight: 200, marginTop: 8 }} />
    </div>
  );
}
