# Performance Optimization Guide

## Overview
This document outlines performance optimizations implemented in the GreenCart Logistics Management System.

## Backend Performance Optimizations

### Database Optimizations

#### 1. MongoDB Indexing
```javascript
// Driver collection indexes
db.drivers.createIndex({ "name": "text" })
db.drivers.createIndex({ "isActive": 1, "currentShiftHours": 1 })
db.drivers.createIndex({ "createdAt": -1 })

// Route collection indexes
db.routes.createIndex({ "routeId": 1 }, { unique: true })
db.routes.createIndex({ "isActive": 1, "trafficLevel": 1 })
db.routes.createIndex({ "startLocation": "text", "endLocation": "text" })

// Order collection indexes
db.orders.createIndex({ "orderId": 1 }, { unique: true })
db.orders.createIndex({ "status": 1, "createdAt": -1 })
db.orders.createIndex({ "assignedRoute": 1, "assignedDriver": 1 })
db.orders.createIndex({ "valueRs": 1, "isOnTime": 1 })
```

#### 2. Query Optimization
- Use lean() queries for read-only operations
- Implement pagination for large datasets
- Use aggregation pipelines for complex calculations
- Populate only required fields

#### 3. Connection Pooling
```javascript
mongoose.connect(mongoURI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false,
  bufferMaxEntries: 0
});
```

### API Performance

#### 1. Response Compression
```javascript
const compression = require('compression');
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));
```

#### 2. Caching Strategy
```javascript
const redis = require('redis');
const client = redis.createClient();

// Cache frequently accessed data
const cacheMiddleware = (duration) => {
  return async (req, res, next) => {
    const key = req.originalUrl;
    const cached = await client.get(key);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    res.sendResponse = res.json;
    res.json = (body) => {
      client.setex(key, duration, JSON.stringify(body));
      res.sendResponse(body);
    };
    
    next();
  };
};
```

#### 3. Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

### Memory Management

#### 1. Avoid Memory Leaks
- Remove event listeners properly
- Clear intervals and timeouts
- Properly close database connections
- Use WeakMap for object references

#### 2. Garbage Collection Optimization
```javascript
// Enable V8 garbage collection optimizations
node --optimize-for-size --max-old-space-size=1024 server.js
```

## Frontend Performance Optimizations

### React Optimizations

#### 1. Component Memoization
```jsx
import { memo, useMemo, useCallback } from 'react';

const DriverCard = memo(({ driver, onUpdate }) => {
  const status = useMemo(() => {
    return driver.currentShiftHours > 8 ? 'Fatigued' : 'Active';
  }, [driver.currentShiftHours]);

  const handleUpdate = useCallback(() => {
    onUpdate(driver.id);
  }, [driver.id, onUpdate]);

  return (
    <div className="driver-card">
      <h3>{driver.name}</h3>
      <p>Status: {status}</p>
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
});
```

#### 2. Lazy Loading
```jsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const Drivers = lazy(() => import('../pages/Drivers'));
const Simulation = lazy(() => import('../pages/Simulation'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/simulation" element={<Simulation />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
```

#### 3. Virtual Scrolling
```jsx
import { FixedSizeList as List } from 'react-window';

const DriverList = ({ drivers }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <DriverCard driver={drivers[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={drivers.length}
      itemSize={100}
      width="100%"
    >
      {Row}
    </List>
  );
};
```

### Bundle Optimization

#### 1. Code Splitting
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
          ui: ['bootstrap', 'react-bootstrap']
        }
      }
    }
  }
};
```

#### 2. Tree Shaking
```javascript
// Import only needed functions
import { debounce } from 'lodash/debounce';
import { format } from 'date-fns/format';
```

#### 3. Asset Optimization
```javascript
// vite.config.js
export default {
  build: {
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
};
```

### Network Optimizations

#### 1. API Request Optimization
```javascript
// Debounced search
const debouncedSearch = useCallback(
  debounce((searchTerm) => {
    fetchDrivers(searchTerm);
  }, 300),
  []
);

// Request cancellation
useEffect(() => {
  const controller = new AbortController();
  
  fetchData({ signal: controller.signal });
  
  return () => controller.abort();
}, []);
```

#### 2. Image Optimization
```jsx
// Lazy loading images
<img 
  src={imageSrc}
  loading="lazy"
  alt={imageAlt}
  onLoad={() => setImageLoaded(true)}
/>
```

#### 3. Prefetching
```jsx
// Prefetch critical routes
<link rel="prefetch" href="/api/dashboard/kpis" />
<link rel="preload" href="/fonts/roboto.woff2" as="font" type="font/woff2" />
```

## Database Performance

### MongoDB Optimization

#### 1. Schema Design
```javascript
// Embedded documents for frequently accessed data
const orderSchema = new mongoose.Schema({
  orderId: String,
  valueRs: Number,
  routeInfo: {
    routeId: String,
    distance: Number,
    trafficLevel: String
  },
  // Avoid deep nesting
  assignedRoute: { type: ObjectId, ref: 'Route' }
});
```

#### 2. Aggregation Pipelines
```javascript
// Optimized aggregation for dashboard stats
const getDriverStats = async () => {
  return await Driver.aggregate([
    {
      $facet: {
        total: [{ $count: "count" }],
        active: [
          { $match: { isActive: true } },
          { $count: "count" }
        ],
        fatigued: [
          { $match: { isFatigued: true } },
          { $count: "count" }
        ]
      }
    }
  ]);
};
```

#### 3. Connection Management
```javascript
// Connection pooling
mongoose.connect(uri, {
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 5000
});
```

## Monitoring and Metrics

### Performance Monitoring

#### 1. Response Time Tracking
```javascript
const responseTime = require('response-time');

app.use(responseTime((req, res, time) => {
  console.log(`${req.method} ${req.url} - ${time}ms`);
}));
```

#### 2. Memory Usage Monitoring
```javascript
setInterval(() => {
  const used = process.memoryUsage();
  console.log('Memory Usage:');
  for (let key in used) {
    console.log(`${key}: ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
  }
}, 30000);
```

#### 3. Database Query Performance
```javascript
mongoose.set('debug', (collection, method, query, doc) => {
  console.log(`${collection}.${method}`, JSON.stringify(query), doc);
});
```

## Production Deployment

### Server Configuration

#### 1. PM2 Process Manager
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'greencart-api',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log'
  }]
};
```

#### 2. Nginx Configuration
```nginx
upstream backend {
    least_conn;
    server backend1:5000;
    server backend2:5000;
}

server {
    listen 80;
    server_name your-domain.com;
    
    location /api/ {
        proxy_pass http://backend;
        proxy_cache api_cache;
        proxy_cache_valid 200 5m;
    }
}
```

### CDN and Caching

#### 1. Static Asset CDN
```javascript
// Configure CDN for static assets
const CDN_URL = process.env.CDN_URL || '';

app.use('/static', express.static('public', {
  setHeaders: (res, path) => {
    if (CDN_URL) {
      res.set('Cache-Control', 'public, max-age=31536000');
    }
  }
}));
```

#### 2. Browser Caching
```javascript
// Set cache headers
app.use((req, res, next) => {
  if (req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
  next();
});
```

## Performance Benchmarks

### Target Metrics
- **API Response Time**: < 200ms average
- **Database Query Time**: < 100ms average
- **Frontend Load Time**: < 2s initial load
- **Memory Usage**: < 512MB average
- **CPU Usage**: < 70% average

### Testing Tools
- **Backend**: Artillery, Apache Bench
- **Frontend**: Lighthouse, WebPageTest
- **Database**: MongoDB Profiler
- **Full Stack**: New Relic, Datadog

### Continuous Monitoring
- Set up alerts for performance degradation
- Regular performance audits
- Load testing in staging environment
- Monitor real user metrics (RUM)