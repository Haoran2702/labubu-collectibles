import express from 'express';
import { getCacheStats } from '../middleware/cache';
import logger from '../logger';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version
  });
});

// Performance metrics endpoint
router.get('/metrics', (req, res) => {
  const metrics = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    cache: getCacheStats(),
    environment: process.env.NODE_ENV || 'development'
  };
  
  res.json(metrics);
});

// Cache management endpoints
router.get('/cache/stats', (req, res) => {
  res.json(getCacheStats());
});

router.delete('/cache/clear', (req, res) => {
  // This would clear all cache - use with caution
  res.json({ message: 'Cache cleared', timestamp: new Date().toISOString() });
});

// System information endpoint
router.get('/system', (req, res) => {
  res.json({
    platform: process.platform,
    arch: process.arch,
    nodeVersion: process.version,
    pid: process.pid,
    title: process.title,
    argv: process.argv,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT
    }
  });
});

export default router; 