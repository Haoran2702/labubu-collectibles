import { Request, Response, NextFunction } from 'express';
import NodeCache from 'node-cache';

// Cache instance
const cache = new NodeCache({ 
  stdTTL: 300, // 5 minutes default
  checkperiod: 600, // Check for expired keys every 10 minutes
  maxKeys: 1000 // Maximum number of keys
});

// Cache middleware
export const cacheMiddleware = (duration: number = 300) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip cache for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `__cache__${req.originalUrl}`;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    // Store original send function
    const originalSend = res.json;

    // Override send function to cache response
    res.json = function(body: any) {
      cache.set(key, body, duration);
      return originalSend.call(this, body);
    };

    next();
  };
};

// Clear cache for specific patterns
export const clearCache = (pattern: string) => {
  const keys = cache.keys();
  const matchingKeys = keys.filter(key => key.includes(pattern));
  matchingKeys.forEach(key => cache.del(key));
};

// Cache statistics
export const getCacheStats = () => {
  return {
    keys: cache.keys().length,
    hits: cache.getStats().hits,
    misses: cache.getStats().misses,
    keyspace: cache.keys()
  };
};

// Product cache (longer duration for product data)
export const productCache = cacheMiddleware(1800); // 30 minutes

// User cache (shorter duration for user data)
export const userCache = cacheMiddleware(300); // 5 minutes

// Analytics cache (medium duration)
export const analyticsCache = cacheMiddleware(900); // 15 minutes 