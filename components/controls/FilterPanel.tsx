'use client';

import { memo, useState, useCallback } from 'react';
import { FilterOptions } from '@/lib/types';

interface FilterPanelProps {
  onFilterChange: (filters: FilterOptions) => void;
  valueRange?: { min: number; max: number };
}

export const FilterPanel = memo(function FilterPanel({
  onFilterChange,
  valueRange,
}: FilterPanelProps) {
  const [minValue, setMinValue] = useState<string>('');
  const [maxValue, setMaxValue] = useState<string>('');

  const handleMinChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinValue(value);
    onFilterChange({
      valueRange: {
        min: value ? parseFloat(value) : undefined as any,
        max: maxValue ? parseFloat(maxValue) : undefined as any,
      },
    });
  }, [maxValue, onFilterChange]);

  const handleMaxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxValue(value);
    onFilterChange({
      valueRange: {
        min: minValue ? parseFloat(minValue) : undefined as any,
        max: value ? parseFloat(value) : undefined as any,
      },
    });
  }, [minValue, onFilterChange]);

  return (
    <div className="filter-panel">
      <h3 className="text-base md:text-lg font-semibold mb-4 text-black flex items-center gap-2">
        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
        Filter by Value
      </h3>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="block text-xs text-black mb-1">Minimum</label>
          <input
            type="number"
            placeholder="Min value"
            value={minValue}
            onChange={handleMinChange}
            className="input-field w-full"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-black mb-1">Maximum</label>
          <input
            type="number"
            placeholder="Max value"
            value={maxValue}
            onChange={handleMaxChange}
            className="input-field w-full"
          />
        </div>
      </div>
    </div>
  );
});

