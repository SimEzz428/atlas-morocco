"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { usePlan } from './usePlan';

interface PlanContextType {
  plan: ReturnType<typeof usePlan>['plan'];
  isSyncing: ReturnType<typeof usePlan>['isSyncing'];
  lastSyncTime: ReturnType<typeof usePlan>['lastSyncTime'];
  addPlace: ReturnType<typeof usePlan>['addPlace'];
  removePlace: ReturnType<typeof usePlan>['removePlace'];
  movePlace: ReturnType<typeof usePlan>['movePlace'];
  reorderItems: ReturnType<typeof usePlan>['reorderItems'];
  clear: ReturnType<typeof usePlan>['clear'];
  setMeta: ReturnType<typeof usePlan>['setMeta'];
  savePlan: ReturnType<typeof usePlan>['savePlan'];
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export function PlanProvider({ children }: { children: ReactNode }) {
  const planData = usePlan();
  
  console.log('PlanProvider rendering with planData:', planData);
  console.log('PlanProvider: addPlace function available:', !!planData.addPlace);
  
  return (
    <PlanContext.Provider value={planData}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlanContext() {
  const context = useContext(PlanContext);
  console.log('usePlanContext called, context:', context);
  if (context === undefined) {
    throw new Error('usePlanContext must be used within a PlanProvider');
  }
  return context;
}
