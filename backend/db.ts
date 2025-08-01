import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Open a database connection
import path from 'path';

export async function openDb() {
  const isProduction = process.env.NODE_ENV === 'production';
  const dbPath = isProduction ? '/tmp/database.sqlite' : path.join(__dirname, 'database.sqlite');
  
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
}

// Initialize the products, suppliers, orders, order_items, and users tables
export async function initDb() {
  console.log("Initializing database...");
  const db = await openDb();
  
  // Enable foreign keys
  await db.exec('PRAGMA foreign_keys = ON;');
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      resetPasswordToken TEXT,
      resetPasswordExpires INTEGER
    );
    CREATE TABLE IF NOT EXISTS suppliers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      contactInfo TEXT,
      website TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      imageUrl TEXT,
      collection TEXT,
      stock INTEGER DEFAULT 0,
      sku TEXT UNIQUE,
      weight REAL,
      dimensions TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      userId INTEGER,
      total REAL NOT NULL,
      shipping_info TEXT NOT NULL,
      order_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      payment_intent_id TEXT,
      payment_status TEXT DEFAULT 'pending',
      tracking_number TEXT,
      estimated_delivery TEXT,
      actual_delivery TEXT,
      cancellation_reason TEXT,
      modification_history TEXT,
      notification_sent TEXT DEFAULT '[]',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
    );
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId TEXT NOT NULL,
      productId INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (productId) REFERENCES products(id) ON DELETE SET NULL
    );
    CREATE TABLE IF NOT EXISTS order_status_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId TEXT NOT NULL,
      status TEXT NOT NULL,
      reason TEXT,
      updatedBy TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS addresses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      label TEXT,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT,
      zip TEXT NOT NULL,
      country TEXT NOT NULL,
      phone TEXT NOT NULL,
      isDefault INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
    
    CREATE TABLE IF NOT EXISTS stock_reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      sessionId TEXT NOT NULL,
      expiresAt TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
    );
    
    CREATE TABLE IF NOT EXISTS stock_movements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      movementType TEXT NOT NULL,
      reason TEXT,
      orderId TEXT,
      userId INTEGER,
      previousStock INTEGER NOT NULL,
      newStock INTEGER NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE SET NULL,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
    );
    
    CREATE TABLE IF NOT EXISTS inventory_forecasts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId INTEGER NOT NULL,
      forecastDate TEXT NOT NULL,
      predictedDemand INTEGER NOT NULL,
      confidenceLevel REAL NOT NULL,
      forecastType TEXT NOT NULL,
      algorithm TEXT NOT NULL,
      historicalDataPoints INTEGER NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
    );
    
    CREATE TABLE IF NOT EXISTS email_campaigns (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      subject TEXT NOT NULL,
      content TEXT NOT NULL,
      targetAudience TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      sentCount INTEGER DEFAULT 0,
      openRate REAL DEFAULT 0,
      clickRate REAL DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS discount_codes (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL,
      value REAL NOT NULL,
      minOrderAmount REAL DEFAULT 0,
      maxUses INTEGER DEFAULT 0,
      usedCount INTEGER DEFAULT 0,
      validFrom TEXT NOT NULL,
      validUntil TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active'
    );
    
    CREATE TABLE IF NOT EXISTS automation_rules (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      triggerType TEXT NOT NULL,
      conditions TEXT NOT NULL,
      actions TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      triggeredCount INTEGER DEFAULT 0,
      convertedCount INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS email_signups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("email_signups table created or already exists.");
  } catch (err) {
    console.error("Error creating email_signups table:", err);
  }
  await db.close();
}

// Ensure initDb runs if this file is executed directly
if (require.main === module) {
  initDb().then(() => {
    console.log("Database initialization complete.");
    process.exit(0);
  });
} 