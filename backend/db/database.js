import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'netfill.db');

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('✅ Connected to SQLite database');
    initializeTables();
  }
});

export const initializeTables = () => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      avatar TEXT,
      theme TEXT DEFAULT 'dark',
      language TEXT DEFAULT 'en',
      notifications_enabled INTEGER DEFAULT 1,
      role TEXT DEFAULT 'user',
      payment_plan TEXT DEFAULT 'free',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Payment Plans table
  db.run(`
    CREATE TABLE IF NOT EXISTS payment_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      price REAL NOT NULL,
      features TEXT,
      max_screens INTEGER DEFAULT 1,
      video_quality TEXT DEFAULT 'SD',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // User Login Tracking table
  db.run(`
    CREATE TABLE IF NOT EXISTS user_logins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      ip_address TEXT,
      device TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Movies table
  db.run(`
    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tmdb_id INTEGER UNIQUE,
      title TEXT NOT NULL,
      description TEXT,
      genre TEXT,
      rating REAL,
      release_date TEXT,
      poster_url TEXT,
      backdrop_url TEXT,
      duration INTEGER,
      video_url TEXT,
      is_trending INTEGER DEFAULT 0,
      views INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Watchlist table
  db.run(`
    CREATE TABLE IF NOT EXISTS watchlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      movie_id INTEGER NOT NULL,
      added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (movie_id) REFERENCES movies(id),
      UNIQUE(user_id, movie_id)
    )
  `);

  // Continue Watching table
  db.run(`
    CREATE TABLE IF NOT EXISTS continue_watching (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      movie_id INTEGER NOT NULL,
      watch_duration INTEGER DEFAULT 0,
      total_duration INTEGER,
      last_watched DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (movie_id) REFERENCES movies(id),
      UNIQUE(user_id, movie_id)
    )
  `);

  // Ratings table
  db.run(`
    CREATE TABLE IF NOT EXISTS ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      movie_id INTEGER NOT NULL,
      rating INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (movie_id) REFERENCES movies(id),
      UNIQUE(user_id, movie_id)
    )
  `);

  // Pending Payments table
  db.run(`
    CREATE TABLE IF NOT EXISTS pending_payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      plan_name TEXT NOT NULL,
      amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      approved_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Watch Parties table
  db.run(`
    CREATE TABLE IF NOT EXISTS watch_parties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_code TEXT UNIQUE NOT NULL,
      creator_id INTEGER NOT NULL,
      movie_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      current_time INTEGER DEFAULT 0,
      is_playing INTEGER DEFAULT 0,
      max_participants INTEGER DEFAULT 10,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      ended_at DATETIME,
      FOREIGN KEY (creator_id) REFERENCES users(id),
      FOREIGN KEY (movie_id) REFERENCES movies(id)
    )
  `);

  // Watch Party Participants table
  db.run(`
    CREATE TABLE IF NOT EXISTS watch_party_participants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      party_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      left_at DATETIME,
      FOREIGN KEY (party_id) REFERENCES watch_parties(id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(party_id, user_id)
    )
  `);

  // Watch Party Messages (Chat + Reactions)
  db.run(`
    CREATE TABLE IF NOT EXISTS watch_party_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      party_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      message_type TEXT DEFAULT 'chat',
      content TEXT NOT NULL,
      timestamp INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (party_id) REFERENCES watch_parties(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  console.log('📊 Database tables initialized');
};

export const runQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const runInsert = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

export const runUpdate = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
};
