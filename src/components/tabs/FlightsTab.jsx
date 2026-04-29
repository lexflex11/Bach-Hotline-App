import React, { useEffect } from 'react';
import { HOT, DARK, SOFT, MID, WHITE } from '../../constants/colors.js';
import SH from '../ui/SH.jsx';

const NUN = "'Plus Jakarta Sans',sans-serif";

function ExpediaWidget() {
  useEffect(() => {
    // Load Expedia widget script once
    if (!document.querySelector('.eg-widgets-script')) {
      const script = document.createElement('script');
      script.className = 'eg-widgets-script';
      script.src = 'https://creator.expediagroup.com/products/widgets/assets/eg-widgets.js';
      script.async = true;
      document.body.appendChild(script);
    } else {
      // Script already loaded — re-initialize widgets
      if (window.EGWidgets) window.EGWidgets.init();
    }
  }, []);

  return (
    <div
      className="eg-widget"
      data-widget="search"
      data-program="us-expedia"
      data-lobs="stays,flights"
      data-network="pz"
      data-camref="1011l4ma3h"
      data-pubref=""
    />
  );
}

export default function FlightsTab({ groupSize, initialDest }) {
  return (
    <div>
      <SH title="Group Flight Search" sub="Live prices powered by Expedia" />

      {/* Info strip */}
      <div style={{
        background: SOFT, border: `1.5px solid ${MID}`,
        borderRadius: 14, padding: "14px 16px", marginBottom: 20,
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: NUN, fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 2 }}>
            Search flights for your group
          </div>
          <div style={{ fontFamily: NUN, fontSize: 11, color: HOT, opacity: 0.85 }}>
            Enter your trip details below — real-time prices from hundreds of airlines
          </div>
        </div>
      </div>

      {/* Expedia Search Widget */}
      <ExpediaWidget />

      {/* Footer note */}
      <div style={{ fontFamily: NUN, fontSize: 10, color: "#bbb", textAlign: "center", marginTop: 16 }}>
        Flights and stays powered by Expedia. Booking handled securely on Expedia.com.
      </div>
    </div>
  );
}
