"use client";

interface BarChartProps {
  data: Array<{ label: string; value: number }>;
  title?: string;
  color?: string;
}

export default function BarChart({
  data,
  title,
  color = "black",
}: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-900">
        {title && (
          <h3 className="text-lg font-medium text-black dark:text-zinc-50 mb-4">
            {title}
          </h3>
        )}
        <div className="flex items-center justify-center h-32 text-zinc-500 dark:text-zinc-400">
          No data available
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));
  const normalizedMax = maxValue > 0 ? maxValue : 1;

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-900">
      {title && (
        <h3 className="text-lg font-medium text-black dark:text-zinc-50 mb-4">
          {title}
        </h3>
      )}
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-700 dark:text-zinc-300">
                {item.label}
              </span>
              <span className="font-medium text-black dark:text-zinc-50">
                {item.value}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(item.value / normalizedMax) * 100}%`,
                  backgroundColor: color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

