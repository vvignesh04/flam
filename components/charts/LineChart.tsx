"use client";

interface LineChartProps {
  data: Array<{ label: string; value: number }>;
  title?: string;
  color?: string;
}

export default function LineChart({
  data,
  title,
  color = "black",
}: LineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-900">
        {title && (
          <h3 className="text-lg font-medium text-black dark:text-zinc-50 mb-4">
            {title}
          </h3>
        )}
        <div className="flex items-center justify-center h-64 text-zinc-500 dark:text-zinc-400">
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
      <div className="h-64 flex items-end justify-between gap-2">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex-1 flex flex-col items-center gap-2"
          >
            <div
              className="w-full rounded-t transition-all hover:opacity-80"
              style={{
                height: `${(item.value / normalizedMax) * 100}%`,
                backgroundColor: color,
              }}
            />
            <span className="text-xs text-zinc-600 dark:text-zinc-400">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

