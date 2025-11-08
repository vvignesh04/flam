'use client';

import { memo, useState, useCallback } from 'react';
import { AggregationPeriod } from '@/lib/types';

const AGGREGATION_PERIODS: AggregationPeriod[] = [
  { label: '1 Minute', value: '1min', milliseconds: 60000 },
  { label: '5 Minutes', value: '5min', milliseconds: 300000 },
  { label: '1 Hour', value: '1hour', milliseconds: 3600000 },
];

interface TimeRangeSelectorProps {
  onPeriodChange: (period: AggregationPeriod) => void;
  onDateRangeChange?: (start: number, end: number) => void;
}

export const TimeRangeSelector = memo(function TimeRangeSelector({
  onPeriodChange,
  onDateRangeChange,
}: TimeRangeSelectorProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<AggregationPeriod>(AGGREGATION_PERIODS[0]);

  const handlePeriodChange = useCallback((period: AggregationPeriod) => {
    setSelectedPeriod(period);
    onPeriodChange(period);
  }, [onPeriodChange]);

  const handleQuickRange = useCallback((hours: number) => {
    const end = Date.now();
    const start = end - hours * 3600000;
    onDateRangeChange?.(start, end);
  }, [onDateRangeChange]);

  return (
    <div className="time-range-selector">
      <h3 className="text-base md:text-lg font-semibold mb-4 text-black flex items-center gap-2">
        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
        Time Range
      </h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {AGGREGATION_PERIODS.map((period) => (
          <button
            key={period.value}
            onClick={() => handlePeriodChange(period)}
            className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
              selectedPeriod.value === period.value
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 text-black hover:bg-gray-200'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>
      <div>
        <label className="block text-xs text-black mb-2">Quick Range</label>
        <div className="flex gap-2">
          <button
            onClick={() => handleQuickRange(1)}
            className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors text-black"
          >
            1H
          </button>
          <button
            onClick={() => handleQuickRange(6)}
            className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors text-black"
          >
            6H
          </button>
          <button
            onClick={() => handleQuickRange(24)}
            className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors text-black"
          >
            24H
          </button>
        </div>
      </div>
    </div>
  );
});

