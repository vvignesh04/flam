export interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  uptime: number;
}

export interface ApiResponse {
  metrics: PerformanceMetrics;
  timestamp: string;
}

export async function fetchPerformanceData(): Promise<ApiResponse> {
  const response = await fetch("/api/data", {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });

  if (!response.ok) {
    throw new Error("Failed to fetch performance data");
  }

  return response.json();
}

export async function fetchPerformanceDataClient(): Promise<ApiResponse> {
  const response = await fetch("/api/data");

  if (!response.ok) {
    throw new Error("Failed to fetch performance data");
  }

  return response.json();
}

