"use client";

import { useSession } from "next-auth/react";
import { Cloud } from "lucide-react";

interface SyncStatusProps {
  isSyncing: boolean;
  lastSyncTime: Date | null;
}

export function SyncStatus({ isSyncing, lastSyncTime }: SyncStatusProps) {
  const { data: session } = useSession();

  if (isSyncing) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span>Syncing to cloud...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <Cloud className="h-4 w-4" />
      <span>
        {session ? 'Auto-synced to cloud' : 'Sign in to sync to cloud'}
        {lastSyncTime && (
          <span className="text-xs text-slate-500 ml-1">
            (Last sync: {lastSyncTime.toLocaleTimeString()})
          </span>
        )}
      </span>
    </div>
  );
}
