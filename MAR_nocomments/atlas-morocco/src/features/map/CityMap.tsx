// inside CityMap.tsx (client)
import HeatOverlay from "./HeatOverlay";

export default function CityMap({
  center, // {lat, lon}
  places = [],
}: { center: { lat: number; lon: number }; places: Array<{ lat: number; lon: number }> }) {
  // ... your existing map initialization

  // simple projector (approx) – replace with your maplibre/leaflet project if available
  const project = (lat: number, lon: number) => {
    const x = (lon + 180) * (256 / 360);
    const y =
      (256 / Math.PI) *
      (Math.PI - Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)));
    return { x, y };
  };

  return (
    <div className="relative w-full h-[360px] rounded-2xl overflow-hidden border border-black/10 dark:border-white/10">
      {/* your map canvas here */}
      <HeatOverlay places={places} project={project} />
    </div>
  );
}