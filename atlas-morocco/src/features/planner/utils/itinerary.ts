import { calculateTravelTime, haversineDistance } from "./geo";

type Stop = { id: string; lat: number; lon: number; visitTime?: number; cost?: string };

export const DEFAULT_VISIT_MINUTES = 60;

// Splits stops into `days` consecutive groups, keeping their order and spreading them as evenly as possible.
export function splitIntoDays<T>(items: T[], days: number): T[][] {
  const dayCount = Math.max(1, Math.floor(days));
  const groups: T[][] = Array.from({ length: dayCount }, () => []);
  const base = Math.floor(items.length / dayCount);
  const extra = items.length % dayCount;
  let index = 0;
  for (let day = 0; day < dayCount; day++) {
    const size = base + (day < extra ? 1 : 0);
    groups[day] = items.slice(index, index + size);
    index += size;
  }
  return groups;
}

// Returns a copy of the items with `day` set according to splitIntoDays.
export function assignDays<T extends object>(items: T[], days: number): (T & { day: number })[] {
  return splitIntoDays(items, days).flatMap((group, i) => group.map((item) => ({ ...item, day: i + 1 })));
}

// Rough entry cost in MAD from strings like "70 MAD", "Free (food 20-50 MAD)" or "100-200 MAD".
export function parseCostMad(cost?: string): number {
  if (!cost || /^free/i.test(cost.trim())) return 0;
  const match = cost.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

export function summarizeDay(stops: Stop[]) {
  let travelMinutes = 0;
  let distanceKm = 0;
  for (let i = 1; i < stops.length; i++) {
    travelMinutes += calculateTravelTime(stops[i - 1]!, stops[i]!);
    distanceKm += haversineDistance(stops[i - 1]!, stops[i]!);
  }
  const visitMinutes = stops.reduce((sum, s) => sum + (s.visitTime ?? DEFAULT_VISIT_MINUTES), 0);
  const costMad = stops.reduce((sum, s) => sum + parseCostMad(s.cost), 0);
  return { travelMinutes, distanceKm, visitMinutes, totalMinutes: visitMinutes + travelMinutes, costMad };
}
