import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Sample performance data
    const data = {
      metrics: {
        responseTime: 245,
        throughput: 1250,
        errorRate: 0.02,
        uptime: 99.9,
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

