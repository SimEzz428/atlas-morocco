// Only follow same-site relative paths after sign-in, never absolute URLs from the query string.
export function safeCallbackUrl(value: string | null | undefined, fallback = "/plan"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/auth/")) return fallback;
  return value;
}
