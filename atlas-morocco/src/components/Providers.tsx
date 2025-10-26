"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "./ToastProvider";
import { PlanProvider } from "@/features/plan/PlanProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <PlanProvider>
          {children}
        </PlanProvider>
      </ToastProvider>
    </SessionProvider>
  );
}

