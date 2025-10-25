export const CITY_THEMES: Record<string, { bg: string; ring: string; pill: string }> = {
  marrakech: { bg: "#fff7f3", ring: "rgba(255,98,0,.25)", pill: "#FF6200" },
  fes:       { bg: "#f4fbff", ring: "rgba(0,146,255,.25)", pill: "#0092FF" },
  essaouira:{ bg: "#f6fbf7", ring: "rgba(0,173,95,.25)", pill: "#00AD5F" },
};

export function getCityTheme(slug: string) {
  return CITY_THEMES[slug] ?? { bg: "transparent", ring: "transparent", pill: "#222" };
}