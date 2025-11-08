export interface Point {
  x: number;
  y: number;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) {
      throw new Error('Failed to get 2d context');
    }
    this.ctx = ctx;
    this.width = canvas.width;
    this.height = canvas.height;
    this.setupContext();
  }

  private setupContext(): void {
    const dpr = window.devicePixelRatio || 1;
    this.ctx.scale(dpr, dpr);
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  drawLine(
    points: Point[],
    color: string = '#000',
    lineWidth: number = 2
  ): void {
    if (points.length < 2) return;

    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }
    this.ctx.stroke();
  }

  drawPath(
    points: Point[],
    color: string = '#000',
    lineWidth: number = 2,
    fill?: string
  ): void {
    if (points.length < 2) return;

    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }

    if (fill) {
      this.ctx.lineTo(points[points.length - 1].x, this.height);
      this.ctx.lineTo(points[0].x, this.height);
      this.ctx.closePath();
      this.ctx.fillStyle = fill;
      this.ctx.fill();
    }

    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.stroke();
  }

  drawRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    fill: boolean = true
  ): void {
    if (fill) {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(x, y, width, height);
    } else {
      this.ctx.strokeStyle = color;
      this.ctx.strokeRect(x, y, width, height);
    }
  }

  drawCircle(x: number, y: number, radius: number, color: string, fill: boolean = true): void {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    if (fill) {
      this.ctx.fillStyle = color;
      this.ctx.fill();
    } else {
      this.ctx.strokeStyle = color;
      this.ctx.stroke();
    }
  }

  drawGrid(
    bounds: Bounds,
    xTicks: number,
    yTicks: number,
    color: string = '#e0e0e0',
    lineWidth: number = 1
  ): void {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;

    const xStep = bounds.width / xTicks;
    const yStep = bounds.height / yTicks;

    // Vertical lines
    for (let i = 0; i <= xTicks; i++) {
      const x = bounds.x + i * xStep;
      this.ctx.beginPath();
      this.ctx.moveTo(x, bounds.y);
      this.ctx.lineTo(x, bounds.y + bounds.height);
      this.ctx.stroke();
    }

    // Horizontal lines
    for (let i = 0; i <= yTicks; i++) {
      const y = bounds.y + i * yStep;
      this.ctx.beginPath();
      this.ctx.moveTo(bounds.x, y);
      this.ctx.lineTo(bounds.x + bounds.width, y);
      this.ctx.stroke();
    }
  }

  drawText(
    text: string,
    x: number,
    y: number,
    color: string = '#000',
    fontSize: number = 12,
    align: 'left' | 'center' | 'right' = 'left'
  ): void {
    this.ctx.fillStyle = color;
    this.ctx.font = `${fontSize}px sans-serif`;
    this.ctx.textAlign = align;
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, x, y);
  }

  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }
}

export function scaleValue(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  if (inMax === inMin) return outMin;
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

export function getDomain(points: Array<{ x: number; y: number }>): { x: [number, number]; y: [number, number] } {
  if (points.length === 0) {
    return { x: [0, 1], y: [0, 1] };
  }

  let xMin = points[0].x;
  let xMax = points[0].x;
  let yMin = points[0].y;
  let yMax = points[0].y;

  for (const point of points) {
    xMin = Math.min(xMin, point.x);
    xMax = Math.max(xMax, point.x);
    yMin = Math.min(yMin, point.y);
    yMax = Math.max(yMax, point.y);
  }

  const xPadding = (xMax - xMin) * 0.05;
  const yPadding = (yMax - yMin) * 0.05;

  return {
    x: [xMin - xPadding, xMax + xPadding],
    y: [yMin - yPadding, yMax + yPadding],
  };
}

