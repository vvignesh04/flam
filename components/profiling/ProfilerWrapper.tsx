'use client';

import { Profiler, ProfilerOnRenderCallback, ReactNode } from 'react';

interface ProfilerWrapperProps {
  id: string;
  children: ReactNode;
  onRender?: ProfilerOnRenderCallback;
}

/**
 * Wrapper component for React DevTools Profiler
 * Use this to measure performance of specific components
 * 
 * Usage:
 * <ProfilerWrapper id="Dashboard" onRender={onRender}>
 *   <Dashboard />
 * </ProfilerWrapper>
 */
export function ProfilerWrapper({ id, children, onRender }: ProfilerWrapperProps) {
  const defaultOnRender: ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions
  ) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Profiler:', {
        id,
        phase, // "mount" or "update"
        actualDuration, // Time spent rendering
        baseDuration, // Estimated time without memoization
        startTime,
        commitTime,
        interactions,
      });
    }
  };

  return (
    <Profiler id={id} onRender={onRender || defaultOnRender}>
      {children}
    </Profiler>
  );
}

