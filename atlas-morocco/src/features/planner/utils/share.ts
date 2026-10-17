// Trip data embedded in /share/trip/<data> links: compact JSON, UTF-8, base64url (no "/" or "+" so it fits in one path segment).

export type SharedTrip = {
  title: string;
  duration: number;
  items: { name: string; category: string; city: string; day: number }[];
  stats?: { totalDistance: string; totalTime: string };
};

type Compact = { t: string; d: number; i: [string, string, string, number][]; s?: [string, string] };

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4));
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

export function encodeTrip(trip: SharedTrip): string {
  const compact: Compact = {
    t: trip.title,
    d: trip.duration,
    i: trip.items.map((item) => [item.name, item.category, item.city, item.day]),
    ...(trip.stats ? { s: [trip.stats.totalDistance, trip.stats.totalTime] } : {}),
  };
  return toBase64Url(new TextEncoder().encode(JSON.stringify(compact)));
}

export function decodeTrip(value: string): SharedTrip | null {
  try {
    const parsed = JSON.parse(new TextDecoder().decode(fromBase64Url(decodeURIComponent(value)))) as Partial<Compact>;
    if (typeof parsed.t !== "string" || !Array.isArray(parsed.i)) return null;
    const duration = Math.min(60, Math.max(1, Number(parsed.d) || 1));
    return {
      title: parsed.t.slice(0, 120),
      duration,
      items: parsed.i.slice(0, 200).map((row) => {
        const [name, category, city, day] = Array.isArray(row) ? row : [];
        return {
          name: String(name ?? ""),
          category: String(category ?? "attraction"),
          city: String(city ?? ""),
          day: Math.min(duration, Math.max(1, Number(day) || 1)),
        };
      }),
      stats: Array.isArray(parsed.s) ? { totalDistance: String(parsed.s[0]), totalTime: String(parsed.s[1]) } : undefined,
    };
  } catch {
    return null;
  }
}
