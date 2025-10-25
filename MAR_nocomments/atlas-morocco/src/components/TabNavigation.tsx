"use client";

import { useState } from "react";

interface TabNavigationProps {
  attractionsCount: number;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabNavigation({ attractionsCount, activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "places", label: `Places (${attractionsCount})` },
    { id: "itineraries", label: "Itineraries" },
    { id: "gallery", label: "Gallery" },
  ];

  return (
    <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 max-w-lg" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`${tab.id}-panel`}
          data-testid={`tab-${tab.id}`}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
            activeTab === tab.id
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
