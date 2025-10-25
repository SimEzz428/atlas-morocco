"use client";

import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { User } from "lucide-react";

interface SyncStatusCardProps {
  lastSyncTime: Date | null;
}

export function SyncStatusCard({ lastSyncTime }: SyncStatusCardProps) {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <Card className="mb-6">
      <div className="card-pad-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <User className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-slate-900">Signed in as {session.user?.email}</p>
              <p className="text-sm text-slate-600">
                {lastSyncTime 
                  ? `Last synced: ${lastSyncTime.toLocaleString()}`
                  : "Not synced yet"
                }
              </p>
            </div>
          </div>
          <Badge variant={lastSyncTime ? "brand" : "default"}>
            {lastSyncTime ? "Synced" : "Local Only"}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
