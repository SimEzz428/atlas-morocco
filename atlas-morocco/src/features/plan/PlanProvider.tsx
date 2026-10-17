"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { usePlan } from './usePlan';

type PlanContextType = ReturnType<typeof usePlan>;

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export function PlanProvider({ children }: { children: ReactNode }) {
  const planData = usePlan();

  return (
    <PlanContext.Provider value={planData}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlanContext() {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlanContext must be used within a PlanProvider');
  }
  return context;
}
