"use client"
import { useEffect, useSyncExternalStore } from "react"

function subscribe(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

// Removes the old caching service worker (see public/sw.js) and shows an offline banner.
export default function ServiceWorker() {
  const isOnline = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations()
        .then((registrations) => Promise.all(registrations.map((r) => r.unregister())))
        .catch(() => {});
    }
    if ("caches" in window) {
      caches.keys()
        .then((keys) => Promise.all(keys.filter((k) => k.startsWith("atlas-morocco")).map((k) => caches.delete(k))))
        .catch(() => {});
    }
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[1200]" role="status">
      <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
        <div className="w-2 h-2 bg-white rounded-full"></div>
        <span className="text-sm font-medium">You&apos;re offline</span>
      </div>
    </div>
  );
}
