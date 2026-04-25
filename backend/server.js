import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import movieRoutes from './routes/movies.js';
import adminRoutes from './routes/admin.js';
import watchPartyRoutes from './routes/watch-party.js';
import { db } from './db/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/watch-party', watchPartyRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Sample data insertion (run once)
const insertSampleMovies = () => {
  const sampleMovies = [
    {
      title: 'Inception',
      description: 'A thief who steals corporate secrets through dream-sharing technology.',
      genre: 'Sci-Fi, Action',
      rating: 8.8,
      release_date: '2010-07-16',
      poster_url: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDMPS6QcYxNQWeSK0yQ.jpg',
      backdrop_url: 'https://image.tmdb.org/t/p/w1280/s3TBrLgO2YKsV44q88TXY5VRv9i.jpg',
      duration: 148,
      is_trending: 1
    },
    {
      title: 'The Dark Knight',
      description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological tests.',
      genre: 'Action, Crime, Drama',
      rating: 9.0,
      release_date: '2008-07-18',
      poster_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haI0xvwi.jpg',
      backdrop_url: 'https://image.tmdb.org/t/p/w1280/l8sR2m5OKWuR4KzMVsFnqDzhkhu.jpg',
      duration: 152,
      is_trending: 1
    },
    {
      title: 'Interstellar',
      description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
      genre: 'Adventure, Drama, Sci-Fi',
      rating: 8.6,
      release_date: '2014-11-07',
      poster_url: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCu244gwTeDd.jpg',
      backdrop_url: 'https://image.tmdb.org/t/p/w1280/xu9zaAevzQ4ضGF6hPFgsIlNln1.jpg',
      duration: 169,
      is_trending: 1
    }
  ];

  const checkAndInsert = () => {
    db.get('SELECT COUNT(*) as count FROM movies', (err, result) => {
      if (result.count === 0) {
        sampleMovies.forEach(movie => {
          db.run(
            `INSERT INTO movies (title, description, genre, rating, release_date, poster_url, backdrop_url, duration, is_trending)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [movie.title, movie.description, movie.genre, movie.rating, movie.release_date, movie.poster_url, movie.backdrop_url, movie.duration, movie.is_trending]
          );
        });
        console.log('✅ Sample movies inserted');
      }
    });
  };

  setTimeout(checkAndInsert, 1000);
};

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  insertSampleMovies();
});
