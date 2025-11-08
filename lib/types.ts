export interface DataPoint {
  timestamp: number;
  value: number;
  category?: string;
  metadata?: Record<string, any>;
}

export interface ChartData {
  id: string;
  name: string;
  data: DataPoint[];
  color?: string;
}

export interface ChartConfig {
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  showGrid?: boolean;
  showLegend?: boolean;
}

export interface AggregationPeriod {
  label: string;
  value: '1min' | '5min' | '1hour';
  milliseconds: number;
}

export interface FilterOptions {
  categories?: string[];
  dateRange?: { start: number; end: number };
  valueRange?: { min: number; max: number };
}

export interface PerformanceMetrics {
  fps: number;
  renderTime: number;
  memoryUsage: number;
  dataPointCount: number;
}

