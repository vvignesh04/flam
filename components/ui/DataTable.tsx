'use client';

import { memo, useMemo, useRef, useEffect } from 'react';
import { useVirtualization } from '@/hooks/useVirtualization';
import { DataPoint } from '@/lib/types';

interface DataTableProps {
  data: DataPoint[];
  columns?: Array<{ key: keyof DataPoint; label: string }>;
}

const defaultColumns: Array<{ key: keyof DataPoint; label: string }> = [
  { key: 'timestamp', label: 'Timestamp' },
  { key: 'value', label: 'Value' },
  { key: 'category', label: 'Category' },
];

export const DataTable = memo(function DataTable({
  data,
  columns = defaultColumns,
}: DataTableProps) {
  const itemHeight = 40;
  const containerHeight = 400;

  const { containerRef, visibleItems, totalHeight } = useVirtualization(data, {
    itemHeight,
    containerHeight,
    overscan: 5,
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Map<number, HTMLTableRowElement>>(new Map());

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.setProperty('--table-height', `${totalHeight}px`);
    }
  }, [totalHeight]);

  useEffect(() => {
    visibleItems.forEach(({ index, offset }) => {
      const row = rowRefs.current.get(index);
      if (row) {
        row.style.setProperty('--row-top', `${offset}px`);
        row.style.setProperty('--row-height', `${itemHeight}px`);
      }
    });
  }, [visibleItems, itemHeight]);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatValue = (value: any) => {
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return value ?? '-';
  };

  return (
    <div className="data-table">
      <div className="overflow-auto border rounded data-table-container" ref={containerRef}>
        <div 
          className="data-table-content" 
          ref={contentRef}
        >
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-100 z-10 border-b-2 border-gray-300">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-2 text-left font-semibold text-black">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleItems.map(({ item, index, offset }) => (
                <tr
                  key={index}
                  ref={(el) => {
                    if (el) rowRefs.current.set(index, el);
                    else rowRefs.current.delete(index);
                  }}
                  className="data-table-row border-b border-gray-200 hover:bg-gray-50"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-2 text-black">
                      {col.key === 'timestamp'
                        ? formatTimestamp(item.timestamp)
                        : formatValue(item[col.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="text-sm text-black mt-3 font-medium">
        Showing {visibleItems.length} of {data.length} items
      </div>
    </div>
  );
});

