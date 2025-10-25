"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Trash2, 
  Eye, 
  Edit,
  Plus,
  ArrowRight,
  Star,
  Users,
  Navigation,
  Building,
  ShoppingBag,
  Mountain,
  UtensilsCrossed,
  Coffee,
  Eye as EyeIcon,
  Globe
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ToastProvider";

interface PlanItem {
  id: string;
  name: string;
  city: string;
  day: number;
  lat: number;
  lon: number;
  category: string;
  note?: string;
}

interface SavedPlan {
  id: string;
  title: string;
  citySlug?: string;
  createdAt: string;
  updatedAt: string;
  items: PlanItem[];
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'attraction':
    case 'landmark':
      return <Building className="h-4 w-4" />;
    case 'restaurant':
    case 'food':
      return <UtensilsCrossed className="h-4 w-4" />;
    case 'shopping':
    case 'market':
      return <ShoppingBag className="h-4 w-4" />;
    case 'nature':
    case 'outdoor':
      return <Mountain className="h-4 w-4" />;
    case 'cafe':
      return <Coffee className="h-4 w-4" />;
    case 'viewpoint':
      return <EyeIcon className="h-4 w-4" />;
    default:
      return <MapPin className="h-4 w-4" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'attraction':
    case 'landmark':
      return 'bg-blue-100 text-blue-700';
    case 'restaurant':
    case 'food':
      return 'bg-orange-100 text-orange-700';
    case 'shopping':
    case 'market':
      return 'bg-purple-100 text-purple-700';
    case 'nature':
    case 'outdoor':
      return 'bg-green-100 text-green-700';
    case 'cafe':
      return 'bg-yellow-100 text-yellow-700';
    case 'viewpoint':
      return 'bg-pink-100 text-pink-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export default function SavedPlansPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { addToast } = useToast();
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    fetchSavedPlans();
  }, [session, status, router]);

  const fetchSavedPlans = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/plans");
      if (response.ok) {
        const data = await response.json();
        setPlans(data.plans || []);
      } else {
        addToast({ type: "error", title: "Failed to load saved plans" });
      }
    } catch (error) {
      console.error("Error fetching saved plans:", error);
      addToast({ type: "error", title: "Failed to load saved plans" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm("Are you sure you want to delete this plan? This action cannot be undone.")) {
      return;
    }

    try {
      setDeletingPlanId(planId);
      const response = await fetch(`/api/plans?planId=${planId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPlans(prev => prev.filter(plan => plan.id !== planId));
        addToast({ type: "success", title: "Plan deleted successfully" });
      } else {
        addToast({ type: "error", title: "Failed to delete plan" });
      }
    } catch (error) {
      console.error("Error deleting plan:", error);
      addToast({ type: "error", title: "Failed to delete plan" });
    } finally {
      setDeletingPlanId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTotalDays = (items: PlanItem[]) => {
    return Math.max(...items.map(item => item.day), 0);
  };

  const getItemsByDay = (items: PlanItem[], day: number) => {
    return items.filter(item => item.day === day);
  };

  if (status === "loading" || isLoading) {
    return (
      <main className="container mx-auto max-w-6xl px-5 py-8">
        <div className="space-y-6">
          <div className="h-8 bg-slate-200 rounded animate-pulse" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-slate-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!session) {
    return null; // Will redirect to sign in
  }

  return (
    <main className="container mx-auto max-w-6xl px-5 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Saved Plans</h1>
            <p className="text-slate-600 mt-2">
              View and manage your saved travel plans
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/plan">
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                Create New Plan
              </Button>
            </Link>
            <Link href="/cities">
              <Button variant="secondary">
                <MapPin className="h-4 w-4" />
                Explore Cities
              </Button>
            </Link>
          </div>
        </div>

        {/* Plans Grid */}
        {plans.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Saved Plans Yet</h3>
              <p className="text-slate-600 mb-6">
                Start creating your first travel plan to see it here.
              </p>
              <Link href="/plan">
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                  <Plus className="h-4 w-4" />
                  Create Your First Plan
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                <div className="p-6">
                  {/* Plan Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">
                        {plan.title}
                      </h3>
                      {plan.citySlug && (
                        <Badge variant="accent" className="text-xs">
                          {plan.citySlug.charAt(0).toUpperCase() + plan.citySlug.slice(1)}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePlan(plan.id)}
                        disabled={deletingPlanId === plan.id}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Plan Stats */}
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{getTotalDays(plan.items)} days</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{plan.items.length} places</span>
                    </div>
                  </div>

                  {/* Plan Preview - First 3 items */}
                  <div className="space-y-2 mb-4">
                    {plan.items.slice(0, 3).map((item, index) => (
                      <div key={item.id} className="flex items-center gap-2 text-sm">
                        <div className={`p-1 rounded ${getCategoryColor(item.category)}`}>
                          {getCategoryIcon(item.category)}
                        </div>
                        <span className="text-slate-700 truncate">{item.name}</span>
                        <Badge variant="default" className="text-xs">
                          Day {item.day}
                        </Badge>
                      </div>
                    ))}
                    {plan.items.length > 3 && (
                      <div className="text-xs text-slate-500">
                        +{plan.items.length - 3} more places
                      </div>
                    )}
                  </div>

                  {/* Plan Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="text-xs text-slate-500">
                      Updated {formatDate(plan.updatedAt)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/plan?load=${plan.id}`}>
                        <Button variant="secondary" size="sm">
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/plan?edit=${plan.id}`}>
                        <Button variant="secondary" size="sm">
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Stats */}
        {plans.length > 0 && (
          <div className="bg-slate-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Travel Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{plans.length}</div>
                <div className="text-sm text-slate-600">Total Plans</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {plans.reduce((sum, plan) => sum + plan.items.length, 0)}
                </div>
                <div className="text-sm text-slate-600">Total Places</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {plans.reduce((sum, plan) => sum + getTotalDays(plan.items), 0)}
                </div>
                <div className="text-sm text-slate-600">Total Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {new Set(plans.map(plan => plan.citySlug).filter(Boolean)).size}
                </div>
                <div className="text-sm text-slate-600">Cities Visited</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
