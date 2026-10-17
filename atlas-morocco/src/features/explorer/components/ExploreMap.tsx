"use client";

import dynamic from "next/dynamic";

// Leaflet touches `window`, so the map only renders in the browser.
const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-stone-100 flex items-center justify-center">
      <p className="text-stone-500 text-sm">Loading map…</p>
    </div>
  ),
});

export default MapView;
