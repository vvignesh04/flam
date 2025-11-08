'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useDataStream } from '@/hooks/useDataStream';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { DataProvider } from '@/components/providers/DataProvider';
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { ScatterPlot } from '@/components/charts/ScatterPlot';
import { Heatmap } from '@/components/charts/Heatmap';
import { FilterPanel } from '@/components/controls/FilterPanel';
import { TimeRangeSelector } from '@/components/controls/TimeRangeSelector';
import { DataTable } from '@/components/ui/DataTable';
import { PerformanceMonitor } from '@/components/ui/PerformanceMonitor';
import { useDataContext } from '@/components/providers/DataProvider';
import { AggregationPeriod, FilterOptions, ChartConfig } from '@/lib/types';
import { DataGenerator } from '@/lib/dataGenerator';
import { ProfilerWrapper } from '@/components/profiling/ProfilerWrapper';

const AGGREGATION_PERIODS: AggregationPeriod[] = [
  { label: '1 Minute', value: '1min', milliseconds: 60000 },
  { label: '5 Minutes', value: '5min', milliseconds: 300000 },
  { label: '1 Hour', value: '1hour', milliseconds: 3600000 },
];

const CHART_CONFIG: ChartConfig = {
  width: 800,
  height: 400,
  margin: { top: 20, right: 20, bottom: 40, left: 60 },
  showGrid: true,
  showLegend: false,
};

function DashboardContent() {
  const {
    data,
    aggregatedData,
    aggregationPeriod,
    filters,
    setAggregationPeriod,
    setFilters,
  } = useDataContext();

  const [chartType, setChartType] = useState<'line' | 'bar' | 'scatter' | 'heatmap'>('line');
  const [zoom, setZoom] = useState({ x: [0, 1], y: [0, 1] });
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartDimensions, setChartDimensions] = useState({ width: 800, height: 400 });
  const { metrics, measureRender } = usePerformanceMonitor(data.length);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = Math.min(containerRef.current.offsetWidth - 40, 1200);
        setChartDimensions({ width, height: 400 });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const chartConfig = useMemo(
    () => {
      if (data.length === 0) {
        return {
          ...CHART_CONFIG,
          ...chartDimensions,
        };
      }
      
      const timestamps = data.map(d => d.timestamp);
      const minTimestamp = Math.min(...timestamps);
      const maxTimestamp = Math.max(...timestamps);
      const range = maxTimestamp - minTimestamp;
      
      return {
        ...CHART_CONFIG,
        ...chartDimensions,
        xMin: zoom.x[0] !== 0 || zoom.x[1] !== 1 
          ? minTimestamp + (zoom.x[0] * range)
          : undefined,
        xMax: zoom.x[0] !== 0 || zoom.x[1] !== 1
          ? minTimestamp + (zoom.x[1] * range)
          : undefined,
      };
    },
    [chartDimensions, zoom, data]
  );

  const displayData = useMemo(() => {
    return aggregationPeriod.value !== '1min' ? aggregatedData : data;
  }, [data, aggregatedData, aggregationPeriod]);

  const heatmapData = useMemo(() => {
    if (chartType !== 'heatmap') return [];
    const generator = new DataGenerator();
    return generator.generateHeatmapData(20, 20, Date.now() - 3600000, 1000);
  }, [chartType]);

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters({ ...filters, ...newFilters });
  }, [filters, setFilters]);

  const handlePeriodChange = useCallback((period: AggregationPeriod) => {
    setAggregationPeriod(period);
  }, [setAggregationPeriod]);

  const handleDateRangeChange = useCallback((start: number, end: number) => {
    setFilters({ ...filters, dateRange: { start, end } });
  }, [filters, setFilters]);

  return (
    <div className="dashboard-container p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
          Performance Dashboard
        </h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setChartType('line')}
            className={`chart-type-btn ${chartType === 'line' ? 'active' : ''}`}
          >
            Line
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`chart-type-btn ${chartType === 'bar' ? 'active' : ''}`}
          >
            Bar
          </button>
          <button
            onClick={() => setChartType('scatter')}
            className={`chart-type-btn ${chartType === 'scatter' ? 'active' : ''}`}
          >
            Scatter
          </button>
          <button
            onClick={() => setChartType('heatmap')}
            className={`chart-type-btn ${chartType === 'heatmap' ? 'active' : ''}`}
          >
            Heatmap
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="lg:col-span-3">
          <div ref={containerRef} className="dashboard-card p-4 md:p-6">
            <div className="mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-black">
                {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart
              </h2>
              <p className="text-sm text-black">Real-time data visualization</p>
            </div>
            {chartType === 'line' && (
              <LineChart data={displayData} config={chartConfig} onRender={() => measureRender(() => {})} />
            )}
            {chartType === 'bar' && (
              <BarChart data={displayData} config={chartConfig} onRender={() => measureRender(() => {})} />
            )}
            {chartType === 'scatter' && (
              <ScatterPlot data={displayData} config={chartConfig} onRender={() => measureRender(() => {})} />
            )}
            {chartType === 'heatmap' && (
              <Heatmap
                width={20}
                height={20}
                data={heatmapData}
                config={chartConfig}
                onRender={() => measureRender(() => {})}
              />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <PerformanceMonitor metrics={metrics} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="dashboard-card p-4 md:p-6">
          <FilterPanel onFilterChange={handleFilterChange} />
        </div>
        <div className="dashboard-card p-4 md:p-6">
          <TimeRangeSelector
            onPeriodChange={handlePeriodChange}
            onDateRangeChange={handleDateRangeChange}
          />
        </div>
        <div className="dashboard-card p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold mb-4 text-black flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            Data Statistics
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span className="text-sm text-black">Total Points</span>
              <span className="font-semibold text-purple-600">{data.length.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span className="text-sm text-black">Displayed</span>
              <span className="font-semibold text-purple-600">{displayData.length.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span className="text-sm text-black">Aggregation</span>
              <span className="font-semibold text-purple-600">{aggregationPeriod.label}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-card p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-black flex items-center gap-2">
          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
          Data Table
        </h2>
        <DataTable data={displayData.slice(-100)} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data, isStreaming, start, stop, reset } = useDataStream({
    interval: 100,
    maxPoints: 10000,
    autoStart: true,
  });

  const [aggregationPeriod, setAggregationPeriod] = useState<AggregationPeriod>(
    AGGREGATION_PERIODS[0]
  );
  const [filters, setFilters] = useState<FilterOptions>({});

  return (
    <ProfilerWrapper id="DashboardPage">
      <DataProvider
        data={data}
        aggregationPeriod={aggregationPeriod}
        filters={filters}
        setAggregationPeriod={setAggregationPeriod}
        setFilters={setFilters}
      >
        <div className="min-h-screen">
        <div className="dashboard-card m-4 md:m-6 mb-0 p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={isStreaming ? stop : start}
              className={isStreaming ? 'btn-danger' : 'btn-success'}
            >
              {isStreaming ? '⏹ Stop Stream' : '▶ Start Stream'}
            </button>
            <button
              onClick={reset}
              className="btn-secondary"
            >
              🔄 Reset
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isStreaming ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
              <span className="text-sm md:text-base font-medium text-black">
                {isStreaming ? 'Streaming' : 'Stopped'}
              </span>
            </div>
            <div className="text-sm md:text-base text-black font-semibold">
              📊 {data.length.toLocaleString()} Points
            </div>
          </div>
        </div>
        <DashboardContent />
      </div>
    </DataProvider>
    </ProfilerWrapper>
  );
}
