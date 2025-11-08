import { NextRequest, NextResponse } from 'next/server';
import { DataGenerator } from '@/lib/dataGenerator';
import { DataPoint } from '@/lib/types';

const dataGenerator = new DataGenerator(100, 0.1, 10);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const count = parseInt(searchParams.get('count') || '100');
  const startTime = parseInt(searchParams.get('startTime') || String(Date.now()));
  const interval = parseInt(searchParams.get('interval') || '1000');

  const data: DataPoint[] = dataGenerator.generateBatch(
    parseInt(startTime.toString()),
    count,
    interval
  );

  return NextResponse.json({
    data,
    timestamp: Date.now(),
    count: data.length,
  });
}

export const runtime = 'edge';
