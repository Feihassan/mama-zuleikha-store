import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

let db;

const initDatabase = async () => {
  try {
    db = await open({
      filename: path.join(process.cwd(), 'database.sqlite'),
      driver: sqlite3.Database
    });

    // Create users table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'customer',
        email_verified BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create products table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        image_url TEXT,
        category TEXT,
        stock_quantity INTEGER DEFAULT 0,
        seller_id INTEGER REFERENCES users(id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create orders table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        status TEXT DEFAULT 'pending',
        mpesa_checkout_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create order_items table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL
      )
    `);

    // Create user_activity table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS user_activity (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id),
        action TEXT NOT NULL,
        ip TEXT,
        user_agent TEXT,
        metadata TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('SQLite database initialized successfully');
    return db;
  } catch (error) {
    console.error('SQLite database initialization error:', error);
    throw error;
  }
};

// SQLite adapter to match PostgreSQL interface
const pool = {
  query: async (text, params = []) => {
    if (!db) {
      await initDatabase();
    }
    
    try {
      if (text.includes('RETURNING')) {
        // Handle RETURNING clause for INSERT statements
        const insertText = text.replace(/RETURNING.*$/, '');
        const result = await db.run(insertText, params);
        const returnedRow = await db.get('SELECT * FROM users WHERE id = ?', [result.lastID]);
        return { rows: [returnedRow] };
      } else if (text.trim().toUpperCase().startsWith('SELECT')) {
        const rows = await db.all(text, params);
        return { rows };
      } else {
        const result = await db.run(text, params);
        return { rows: [], rowCount: result.changes };
      }
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  },
  
  connect: async () => ({
    query: pool.query,
    release: () => {},
  })
};

export default pool;