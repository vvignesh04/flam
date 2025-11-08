import { DataPoint } from './types';

export class DataGenerator {
  private baseValue: number;
  private trend: number;
  private noise: number;
  private categoryIndex: number = 0;
  private readonly categories = ['A', 'B', 'C', 'D', 'E'];

  constructor(
    baseValue: number = 100,
    trend: number = 0.1,
    noise: number = 10
  ) {
    this.baseValue = baseValue;
    this.trend = trend;
    this.noise = noise;
  }

  generatePoint(timestamp: number, index: number = 0): DataPoint {
    // Generate realistic time-series data with trend and noise
    const timeFactor = (timestamp % 86400000) / 86400000; // Daily cycle
    const trendFactor = this.trend * index;
    const noiseFactor = (Math.random() - 0.5) * this.noise;
    const seasonalFactor = Math.sin(timeFactor * Math.PI * 2) * 5;

    const value = this.baseValue + trendFactor + noiseFactor + seasonalFactor;

    return {
      timestamp,
      value: Math.max(0, Math.round(value * 100) / 100),
      category: this.categories[this.categoryIndex % this.categories.length],
      metadata: {
        index,
        timeFactor,
      },
    };
  }

  generateBatch(startTime: number, count: number, interval: number = 1000): DataPoint[] {
    const points: DataPoint[] = [];
    for (let i = 0; i < count; i++) {
      points.push(this.generatePoint(startTime + i * interval, i));
    }
    this.categoryIndex++;
    return points;
  }

  generateHeatmapData(
    width: number,
    height: number,
    startTime: number,
    interval: number = 1000
  ): Array<{ x: number; y: number; value: number; timestamp: number }> {
    const data: Array<{ x: number; y: number; value: number; timestamp: number }> = [];
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const timestamp = startTime + x * interval;
        const point = this.generatePoint(timestamp, x * height + y);
        data.push({
          x,
          y,
          value: point.value,
          timestamp,
        });
      }
    }
    return data;
  }

  reset(): void {
    this.categoryIndex = 0;
  }
}

