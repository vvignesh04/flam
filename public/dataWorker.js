// Web Worker for data processing
self.onmessage = function (e) {
  const { type, payload } = e.data;

  switch (type) {
    case 'AGGREGATE': {
      const { data, period } = payload;
      const buckets = new Map();

      data.forEach((point) => {
        const bucketTime =
          Math.floor(point.timestamp / period.milliseconds) * period.milliseconds;
        if (!buckets.has(bucketTime)) {
          buckets.set(bucketTime, []);
        }
        buckets.get(bucketTime).push(point);
      });

      const aggregated = [];
      buckets.forEach((points, bucketTime) => {
        const avgValue =
          points.reduce((sum, p) => sum + p.value, 0) / points.length;
        aggregated.push({
          timestamp: bucketTime,
          value: avgValue,
          category: points[0]?.category,
        });
      });

      self.postMessage({
        type: 'AGGREGATE_RESULT',
        payload: aggregated.sort((a, b) => a.timestamp - b.timestamp),
      });
      break;
    }

    case 'FILTER': {
      const { data, filters } = payload;
      let filtered = [...data];

      if (filters.dateRange) {
        filtered = filtered.filter(
          (point) =>
            point.timestamp >= filters.dateRange.start &&
            point.timestamp <= filters.dateRange.end
        );
      }

      if (filters.valueRange) {
        filtered = filtered.filter(
          (point) =>
            (!filters.valueRange.min ||
              point.value >= filters.valueRange.min) &&
            (!filters.valueRange.max || point.value <= filters.valueRange.max)
        );
      }

      if (filters.categories && filters.categories.length > 0) {
        filtered = filtered.filter(
          (point) =>
            point.category && filters.categories.includes(point.category)
        );
      }

      self.postMessage({
        type: 'FILTER_RESULT',
        payload: filtered,
      });
      break;
    }

    default:
      break;
  }
};

