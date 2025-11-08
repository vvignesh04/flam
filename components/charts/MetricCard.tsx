"use client";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
}

export default function MetricCard({
  title,
  value,
  unit,
  trend,
  icon,
}: MetricCardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-900">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {title}
        </h3>
        {icon && <div className="text-zinc-400">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-semibold text-black dark:text-zinc-50">
          {value}
        </span>
        {unit && (
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {unit}
          </span>
        )}
      </div>
      {trend && (
        <div
          className={`mt-2 text-sm ${
            trend.isPositive
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
        </div>
      )}
    </div>
  );
}

