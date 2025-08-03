import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../.env' });
import express, { Application } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from './logger';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
import authRouter from './routes/auth';
import paymentsRouter from './routes/payments';
import supportRouter from './routes/support';
import privacyRouter from './routes/privacy';
import forecastingRouter from './routes/forecasting';
import analyticsRouter from './routes/analytics';
import reviewsRouter from './routes/reviews';
import marketingRouter from './routes/marketing';

import currencyRouter from './routes/currency';
import fraudRouter from './routes/fraud';
import monitoringRouter from './routes/monitoring';
import { AppError } from './errors';
import { sanitizeInput } from './middleware/validation';
import { initDb } from './db';

const app: Application = express();

// Initialize database on startup
async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    await initDb();
    console.log('Database initialized successfully');
    
    // Test database connection and check products
    const { openDb } = await import('./db');
    const db = await openDb();
    console.log('Database connection test successful');
    
    // Check if products table exists and has data
    const tableCheck = await db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='products'");
    console.log('Products table exists:', !!tableCheck);
    
    let shouldSeed = false;
    if (tableCheck) {
      const productCount = await db.get("SELECT COUNT(*) as count FROM products");
      console.log('Number of products in database:', productCount.count);
      shouldSeed = productCount.count === 0;
    } else {
      shouldSeed = true;
    }
    
    await db.close();
    
    // Only seed if database is empty
    if (shouldSeed) {
      console.log('Seeding database with products...');
      const { seedDatabase } = await import('./seed-data');
      await seedDatabase();
      console.log('Database seeded successfully');
    } else {
      console.log('Database already has products, skipping seeding');
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
    // Don't exit the process, just log the error
    console.log('Continuing with application startup...');
  }
}

// Initialize database
initializeDatabase();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://labubu-collectibles.com', 'https://www.labubu-collectibles.com']
    : true, // Allow all origins in development
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Add CORS headers manually for development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });
}

// Enable compression
app.use(compression());

// Replace morgan logger with winston integration
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Apply input sanitization
app.use(sanitizeInput);

// Apply rate limiting to all routes
app.use(limiter);

// Enhanced security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      connectSrc: ["'self'", "https://api.stripe.com", "https://www.paypal.com"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/auth', authRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/support', supportRouter);
app.use('/api/privacy', privacyRouter);
app.use('/api/forecasting', forecastingRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/marketing', marketingRouter);

app.use('/api/currency', currencyRouter);
app.use('/api/fraud', fraudRouter);
app.use('/api/monitoring', monitoringRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // If the error is an instance of AppError, use its status and message
  if (err instanceof AppError) {
    logger.error(err);
    res.status(err.statusCode).json({
      error: err.message,
      code: err.statusCode,
      ...(process.env.NODE_ENV === 'development' && err.stack ? { stack: err.stack } : {})
    });
    return;
  }
  // For other errors, log and return generic message
  logger.error(err.stack || err);
  res.status(500).json({
    error: 'Something went wrong!',
    code: 500,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && err.stack ? { stack: err.stack } : {})
  });
});

// 404 handler
app.use('*', (req: express.Request, res: express.Response) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app; // Railway deployment fix
// Render deployment trigger
// Force redeploy
