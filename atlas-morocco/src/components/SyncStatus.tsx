"use client";

import { useSession } from "next-auth/react";
import { Cloud, CloudOff } from "lucide-react";

interface SyncStatusProps {
  isSyncing: boolean;
  lastSyncTime: Date | null;
  isSaved: boolean;
}

export function SyncStatus({ isSyncing, lastSyncTime, isSaved }: SyncStatusProps) {
  const { status } = useSession();

  if (isSyncing) {
    return (
      <div className="flex items-center gap-2 text-sm text-stone-600" role="status">
        <div className="w-4 h-4 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
        <span>Saving to your account...</span>
      </div>
    );
  }

  if (status !== "authenticated") {
    return (
      <div className="flex items-center gap-2 text-sm text-stone-500" data-testid="sync-status">
        <CloudOff className="h-4 w-4" />
        <span>Saved on this device. Sign in to keep it in your account.</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-stone-600" data-testid="sync-status">
      <Cloud className="h-4 w-4 text-green-600" />
      <span>
        {isSaved ? "Changes are saved to your account automatically" : "Changes will be saved to your account automatically"}
        {lastSyncTime && <span className="text-xs text-stone-500 ml-1">(last saved {lastSyncTime.toLocaleTimeString()})</span>}
      </span>
    </div>
  );
}
