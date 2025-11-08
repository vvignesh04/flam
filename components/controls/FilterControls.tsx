"use client";

interface FilterControlsProps {
  filters: Record<string, string[]>;
  selectedFilters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
}

export default function FilterControls({
  filters,
  selectedFilters,
  onFilterChange,
}: FilterControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {Object.entries(filters).map(([key, options]) => (
        <div key={key} className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
          <select
            value={selectedFilters[key] || ""}
            onChange={(e) => onFilterChange(key, e.target.value)}
            aria-label={`Filter by ${key}`}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-50"
          >
            <option value="">All</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

