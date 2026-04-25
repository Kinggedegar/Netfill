import express from 'express';
import { db, runQuery, runInsert, runUpdate } from '../db/database.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// ===== SPECIFIC ROUTES (MUST COME FIRST) =====

// Get continue watching (MUST BE BEFORE the general GET /:id route)
router.get('/continue-watching', verifyToken, async (req, res) => {
  try {
    const movies = await runQuery(
      `SELECT m.*, cw.watch_duration, cw.total_duration, cw.last_watched
       FROM movies m
       INNER JOIN continue_watching cw ON m.id = cw.movie_id
       WHERE cw.user_id = ?
       ORDER BY cw.last_watched DESC`,
      [req.userId]
    );
    res.json({ movies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save continue watching progress (MUST BE BEFORE the general GET /:id route)
router.post('/continue-watching/:movieId', verifyToken, async (req, res) => {
  try {
    const { watch_duration, total_duration } = req.body;

    await runInsert(
      `INSERT INTO continue_watching (user_id, movie_id, watch_duration, total_duration)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(user_id, movie_id) DO UPDATE SET
       watch_duration = ?, last_watched = CURRENT_TIMESTAMP`,
      [req.userId, req.params.movieId, watch_duration, total_duration, watch_duration]
    );

    res.json({ message: 'Watch progress saved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get trending movies
router.get('/trending', async (req, res) => {
  try {
    const movies = await runQuery(
      'SELECT * FROM movies WHERE is_trending = 1 ORDER BY views DESC LIMIT 20'
    );
    res.json({ movies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get watchlist (MUST BE BEFORE the general GET /:id route)
router.get('/watchlist', verifyToken, async (req, res) => {
  try {
    const movies = await runQuery(
      `SELECT m.* FROM movies m 
       INNER JOIN watchlist w ON m.id = w.movie_id 
       WHERE w.user_id = ? 
       ORDER BY w.added_at DESC`,
      [req.userId]
    );
    res.json({ movies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search movies (MUST BE BEFORE the general GET /:id route)
router.get('/search/:query', async (req, res) => {
  try {
    const searchTerm = `%${req.params.query}%`;
    const movies = await runQuery(
      'SELECT * FROM movies WHERE title LIKE ? OR description LIKE ? LIMIT 20',
      [searchTerm, searchTerm]
    );
    res.json({ movies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== GENERAL ROUTES (COME AFTER SPECIFIC ONES) =====

// Get all movies with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const movies = await runQuery(
      'SELECT * FROM movies ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    const countResult = await runQuery('SELECT COUNT(*) as count FROM movies');
    const total = countResult[0].count;

    res.json({
      movies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get movie by ID
router.get('/:id', async (req, res) => {
  try {
    const movies = await runQuery('SELECT * FROM movies WHERE id = ?', [req.params.id]);
    if (movies.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    // Increment view count
    await runUpdate('UPDATE movies SET views = views + 1 WHERE id = ?', [req.params.id]);

    res.json({ movie: movies[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add movie to watchlist
router.post('/watchlist/:movieId', verifyToken, async (req, res) => {
  try {
    await runInsert(
      'INSERT INTO watchlist (user_id, movie_id) VALUES (?, ?)',
      [req.userId, req.params.movieId]
    );
    res.status(201).json({ message: 'Added to watchlist' });
  } catch (error) {
    if (error.message.includes('UNIQUE')) {
      return res.status(400).json({ error: 'Already in watchlist' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Remove from watchlist
router.delete('/watchlist/:movieId', verifyToken, async (req, res) => {
  try {
    await runUpdate(
      'DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?',
      [req.userId, req.params.movieId]
    );
    res.json({ message: 'Removed from watchlist' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rate movie
router.post('/rate/:movieId', verifyToken, async (req, res) => {
  try {
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 10) {
      return res.status(400).json({ error: 'Rating must be between 1 and 10' });
    }

    await runInsert(
      `INSERT INTO ratings (user_id, movie_id, rating)
       VALUES (?, ?, ?)
       ON CONFLICT(user_id, movie_id) DO UPDATE SET rating = ?`,
      [req.userId, req.params.movieId, rating, rating]
    );

    res.json({ message: 'Rating saved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
