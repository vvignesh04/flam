'use client';

import { createContext, useContext, useMemo, ReactNode } from 'react';
import { DataPoint, AggregationPeriod, FilterOptions } from '@/lib/types';

interface DataContextType {
  data: DataPoint[];
  aggregatedData: DataPoint[];
  aggregationPeriod: AggregationPeriod;
  filters: FilterOptions;
  setAggregationPeriod: (period: AggregationPeriod) => void;
  setFilters: (filters: FilterOptions) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useDataContext() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within DataProvider');
  }
  return context;
}

function aggregateData(
  data: DataPoint[],
  period: AggregationPeriod
): DataPoint[] {
  if (data.length === 0) return [];

  const buckets = new Map<number, DataPoint[]>();
  
  data.forEach((point) => {
    const bucketTime = Math.floor(point.timestamp / period.milliseconds) * period.milliseconds;
    if (!buckets.has(bucketTime)) {
      buckets.set(bucketTime, []);
    }
    buckets.get(bucketTime)!.push(point);
  });

  const aggregated: DataPoint[] = [];
  buckets.forEach((points, bucketTime) => {
    const avgValue = points.reduce((sum, p) => sum + p.value, 0) / points.length;
    aggregated.push({
      timestamp: bucketTime,
      value: avgValue,
      category: points[0]?.category,
    });
  });

  return aggregated.sort((a, b) => a.timestamp - b.timestamp);
}

function filterData(data: DataPoint[], filters: FilterOptions): DataPoint[] {
  let filtered = [...data];

  if (filters.dateRange) {
    filtered = filtered.filter(
      (point) =>
        point.timestamp >= filters.dateRange!.start &&
        point.timestamp <= filters.dateRange!.end
    );
  }

  if (filters.valueRange) {
    filtered = filtered.filter(
      (point) =>
        (!filters.valueRange!.min || point.value >= filters.valueRange!.min) &&
        (!filters.valueRange!.max || point.value <= filters.valueRange!.max)
    );
  }

  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter((point) =>
      point.category && filters.categories!.includes(point.category)
    );
  }

  return filtered;
}

interface DataProviderProps {
  children: ReactNode;
  data: DataPoint[];
  aggregationPeriod: AggregationPeriod;
  filters: FilterOptions;
  setAggregationPeriod: (period: AggregationPeriod) => void;
  setFilters: (filters: FilterOptions) => void;
}

export function DataProvider({
  children,
  data,
  aggregationPeriod,
  filters,
  setAggregationPeriod,
  setFilters,
}: DataProviderProps) {
  const filteredData = useMemo(() => filterData(data, filters), [data, filters]);

  const aggregatedData = useMemo(() => {
    return aggregateData(filteredData, aggregationPeriod);
  }, [filteredData, aggregationPeriod]);

  const value = useMemo(
    () => ({
      data: filteredData,
      aggregatedData,
      aggregationPeriod,
      filters,
      setAggregationPeriod,
      setFilters,
    }),
    [filteredData, aggregatedData, aggregationPeriod, filters, setAggregationPeriod, setFilters]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
