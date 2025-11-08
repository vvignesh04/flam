"use client";

import { useState, useCallback } from "react";

interface UseDateRangeReturn {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  reset: () => void;
}

export function useDateRange(
  initialStartDate?: string,
  initialEndDate?: string
): UseDateRangeReturn {
  const getDefaultStartDate = () => {
    if (initialStartDate) return initialStartDate;
    const date = new Date();
    date.setDate(date.getDate() - 7); // Default to 7 days ago
    return date.toISOString().split("T")[0];
  };

  const getDefaultEndDate = () => {
    if (initialEndDate) return initialEndDate;
    return new Date().toISOString().split("T")[0];
  };

  const [startDate, setStartDate] = useState<string>(getDefaultStartDate());
  const [endDate, setEndDate] = useState<string>(getDefaultEndDate());

  const reset = useCallback(() => {
    setStartDate(getDefaultStartDate());
    setEndDate(getDefaultEndDate());
  }, []);

  return {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    reset,
  };
}

