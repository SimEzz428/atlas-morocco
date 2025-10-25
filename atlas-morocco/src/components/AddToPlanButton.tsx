"use client";

import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { usePlanContext } from "@/features/plan/PlanProvider";
import { useToast } from "@/components/ToastProvider";

interface AddToPlanButtonProps {
  placeId: string;
  placeName: string;
  citySlug: string;
  lat: number;
  lon: number;
  category: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function AddToPlanButton({ 
  placeId, 
  placeName, 
  citySlug, 
  lat, 
  lon, 
  category,
  className = "",
  size = "md"
}: AddToPlanButtonProps) {
  const { plan, addPlace } = usePlanContext();
  const { addToast } = useToast();
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if this place is already in the plan
  const isInPlan = plan.items.some(item => item.id === `${citySlug}:${placeName}`);

  const handleAddToPlan = async () => {
    if (isInPlan || isLoading) return;
    
    setIsLoading(true);
    
    try {
      addPlace({
        name: placeName,
        city: citySlug,
        day: 1, // Default to day 1, user can move later
        lat,
        lon,
        category,
      });
      
      setIsAdded(true);
      addToast({
        type: 'success',
        title: 'Added to Plan',
        message: `${placeName} has been added to your trip plan`,
        duration: 3000
      });
      
      // Reset the "added" state after 2 seconds
      setTimeout(() => setIsAdded(false), 2000);
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to Add',
        message: `Could not add ${placeName} to your plan. Please try again.`,
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4", 
    lg: "h-5 w-5"
  };

  if (isInPlan) {
    return (
      <button
        disabled
        data-testid="add-to-plan"
        aria-label={`${placeName} is already in your trip plan`}
        className={`inline-flex items-center gap-2 bg-green-100 text-green-700 border border-green-200 font-medium rounded-lg transition-colors ${sizeClasses[size]} ${className}`}
      >
        <Check className={iconSizes[size]} aria-hidden="true" />
        In Plan
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToPlan}
      disabled={isLoading}
      data-testid="add-to-plan"
      aria-label={`Add ${placeName} to your trip plan`}
      className={`inline-flex items-center gap-2 bg-blue-600 text-white font-medium rounded-lg transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${className}`}
    >
      {isAdded ? (
        <>
          <Check className={iconSizes[size]} aria-hidden="true" />
          Added!
        </>
      ) : (
        <>
          <Plus className={iconSizes[size]} aria-hidden="true" />
          {isLoading ? "Adding..." : "Add to Plan"}
        </>
      )}
    </button>
  );
}
