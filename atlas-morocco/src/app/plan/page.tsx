import type { Metadata } from "next";
import Planner from "@/features/planner/components/Planner";

export const metadata: Metadata = { title: "Trip Planner" };

export default function PlanPage() {
  return <Planner />;
}
