# Architecture Documentation

## Server vs Client Component Strategy

### Current Implementation

**All Components are Client Components** (`'use client'`)

**Why:**
- Real-time dashboard requires browser APIs (Canvas, WebSocket, performance API)
- Interactive features need client-side state management
- Canvas rendering must happen in the browser

### Where Server Components Could Be Used

1. **Initial Data Loading:**
   ```typescript
   // app/dashboard/page.tsx (Server Component)
   export default async function DashboardPage() {
     const initialData = await fetchInitialDataFromDB();
     return <DashboardClient initialData={initialData} />;
   }
   ```

2. **Static Metadata:**
   ```typescript
   // app/dashboard/layout.tsx (Server Component)
   export const metadata = {
     title: 'Performance Dashboard',
     description: 'Real-time performance monitoring',
   };
   ```

3. **Server-Side Filtering:**
   ```typescript
   // For initial render, filter on server
   const filteredData = await filterDataOnServer(filters);
   ```

### Hybrid Approach (Recommended for Production)

```
┌─────────────────────────────────────┐
│  Server Component (layout.tsx)     │
│  - Metadata                         │
│  - Initial data fetch               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Client Component (page.tsx)        │
│  - Real-time updates                │
│  - Interactive features             │
│  - Canvas rendering                 │
└─────────────────────────────────────┘
```

## Performance Optimizations

### 1. React Concurrent Features

**startTransition:**
```typescript
// In useDataStream.ts
startTransition(() => {
  setData((prev) => [...prev, newPoint]);
});
```
- Marks updates as non-urgent
- Keeps UI responsive during updates
- Allows React to interrupt and prioritize user interactions

### 2. Memoization Strategy

**Component Memoization:**
```typescript
export const LineChart = memo(function LineChart({ ... }) {
  // Prevents re-render if props haven't changed
});
```

**Value Memoization:**
```typescript
const aggregatedData = useMemo(() => {
  return aggregateData(filteredData, aggregationPeriod);
}, [filteredData, aggregationPeriod]);
```

**Callback Memoization:**
```typescript
const handleFilterChange = useCallback((newFilters) => {
  setFilters(newFilters);
}, []);
```

### 3. Canvas Rendering

**Why Canvas:**
- No React reconciliation overhead
- Direct DOM manipulation
- Batch drawing operations
- Better performance for 10k+ points

**Optimization Techniques:**
- Only redraw changed regions
- Use requestAnimationFrame for smooth updates
- Batch multiple draw operations

### 4. Virtual Scrolling

**Implementation:**
- Only render visible rows (20-30 instead of 10,000)
- Calculate scroll position
- Render items on-demand

**Benefits:**
- Reduces DOM nodes dramatically
- Faster initial render
- Lower memory usage

## Scaling Strategies

### SSR Implementation

```typescript
// app/dashboard/page.tsx
export default async function DashboardPage() {
  // Fetch initial data on server
  const initialData = await getInitialData();
  
  return (
    <DashboardClient 
      initialData={initialData}
      // Client takes over for real-time updates
    />
  );
}
```

**Benefits:**
- Faster initial load
- SEO-friendly
- Better for slow networks

**Challenges:**
- Hydration complexity
- Real-time updates still need client-side
- Canvas must render client-side

### Offline Support

**Service Worker:**
```typescript
// public/sw.js
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/data')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
```

**IndexedDB:**
```typescript
// Store data locally
const db = await openDB('dashboard', 1);
await db.put('data', points);

// Sync when online
if (navigator.onLine) {
  await syncDataToServer();
}
```

### Real-time Collaboration

**WebSocket:**
```typescript
const ws = new WebSocket('wss://api.example.com/dashboard');

ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  // Handle real-time updates
  applyUpdate(update);
};
```

**Conflict Resolution:**
- Last-write-wins for simple cases
- Operational Transformation for complex edits
- CRDTs for distributed systems

## API Route Architecture

**Edge Runtime:**
```typescript
export const runtime = 'edge';
```

**Benefits:**
- Low latency (runs at edge locations)
- Auto-scaling
- Fast cold starts

**Limitations:**
- No Node.js APIs
- Limited execution time
- Smaller bundle size

## Data Flow

```
┌─────────────┐
│   API Route │ (Edge Runtime)
│  /api/data  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ useDataStream│ (Client Hook)
│  - Fetch    │
│  - Update   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ DataProvider│ (Context)
│  - State    │
│  - Filter   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Components │
│  - Charts   │
│  - Tables   │
└─────────────┘
```

