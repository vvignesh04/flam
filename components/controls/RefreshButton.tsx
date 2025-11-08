"use client";

import { useState } from "react";

interface RefreshButtonProps {
  onRefresh: () => void | Promise<void>;
  isLoading?: boolean;
}

export default function RefreshButton({
  onRefresh,
  isLoading = false,
}: RefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const loading = isLoading || isRefreshing;

  return (
    <button
      onClick={handleRefresh}
      disabled={loading}
      className="flex items-center gap-2 rounded-full border border-solid border-black/[.08] bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:border-transparent hover:bg-black/[.04] disabled:opacity-50 disabled:cursor-not-allowed dark:border-white/[.145] dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-[#1a1a1a]"
    >
      <svg
        className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m5 10H9a2 2 0 01-2-2v-1a2 2 0 012-2h2.586m1.414-4a2 2 0 112.828 2.828M15 11a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      {loading ? "Refreshing..." : "Refresh"}
    </button>
  );
}

