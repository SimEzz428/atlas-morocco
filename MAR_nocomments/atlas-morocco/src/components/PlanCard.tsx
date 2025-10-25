// src/components/PlanCard.tsx

export default function PlanCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border p-4 shadow-sm bg-white dark:bg-neutral-900">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="text-sm text-neutral-600 dark:text-neutral-300">
        {children}
      </div>
    </div>
  );
}