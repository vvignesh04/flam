"use client";

import { useState, useEffect } from "react";

interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  uptime: number;
}

interface UsePerformanceDataReturn {
  data: PerformanceMetrics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePerformanceData(): UsePerformanceDataReturn {
  const [data, setData] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/data");
      if (!response.ok) {
        throw new Error("Failed to fetch performance data");
      }
      const result = await response.json();
      setData(result.metrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

