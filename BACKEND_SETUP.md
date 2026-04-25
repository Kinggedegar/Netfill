# Netfill - Full-Stack Movie Streaming Platform

A modern, Netflix-like movie streaming application built with **Vue 3**, **Vite**, **Express.js**, and **SQLite3**.

## Features

### 🎬 Core Features
- **User Authentication**: Secure sign-up and sign-in with JWT tokens
- **Movie Database**: SQLite3 database with user and movie management
- **Watchlist Management**: Add/remove movies to your personal watchlist
- **Continue Watching**: Resume watching from where you left off
- **Movie Ratings**: Rate movies from 1-10
- **Search Functionality**: Search through movies by title or description

### 🎨 UI/UX Features
- **Sidebar Navigation**: Modern sidebar menu with quick navigation
- **Theme Support**: Dark, Light, and Auto theme modes
- **Color Customization**: Choose from 4 color schemes (Red, Blue, Purple, Green)
- **Responsive Design**: Mobile-friendly with Tailwind CSS
- **Settings Panel**: Comprehensive user settings and preferences
- **Smooth Transitions**: Beautiful page transitions and animations

### 🔐 Security
- Password hashing with bcryptjs
- JWT authentication tokens with 7-day expiration
- Protected API routes requiring authentication
- Environment-based configuration

## Project Structure

```
Netfill/
├── backend/                    # Express.js backend
│   ├── db/
│   │   └── database.js        # SQLite3 database initialization
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js            # Authentication endpoints
│   │   └── movies.js          # Movie management endpoints
│   ├── server.js              # Express server entry point
│   ├── package.json           # Backend dependencies
│   └── .env                   # Backend environment variables
├── src/                       # Vue 3 frontend
│   ├── components/
│   │   ├── Sidebar.vue        # Main navigation sidebar
│   │   ├── Navbar.vue         # Top navbar
│   │   ├── MovieCard.vue      # Movie card component
│   │   └── ...
│   ├── views/
│   │   ├── HomeView.vue
│   │   ├── SettingsView.vue   # Theme and user settings
│   │   ├── SignIn.vue         # Modern sign-in page
│   │   ├── SignUp.vue         # Modern sign-up page
│   │   ├── WatchlistView.vue
│   │   └── ...
│   ├── services/
│   │   └── backend-api.js     # API service for backend communication
│   ├── router/
│   │   └── index.js           # Vue Router configuration
│   ├── App.vue                # Root component
│   └── main.js                # Vue app entry point
├── package.json               # Frontend dependencies
├── .env.local                 # Frontend environment variables
└── vite.config.js             # Vite configuration
```

## Installation & Setup

### Prerequisites
- Node.js 20.19.0+ or 22.12.0+
- npm or yarn

### Step 1: Clone and Install

```bash
# Navigate to project directory
cd Netfill

# Install all dependencies (frontend and backend)
npm run install-all

# Or manually:
npm install
cd backend
npm install
cd ..
```

### Step 2: Environment Configuration

#### Backend (.env)
Create/update `/backend/.env`:
```bash
PORT=5000
JWT_SECRET=your_secret_key_change_this_in_production
NODE_ENV=development
```

#### Frontend (.env.local)
Create/update `/.env.local`:
```bash
VITE_BACKEND_URL=http://localhost:5000/api
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

### Step 3: Run the Application

#### Option 1: Run Both Frontend and Backend Together
```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

#### Option 2: Run Separately
```bash
# Terminal 1: Frontend
npm run frontend

# Terminal 2: Backend
npm run backend
```

## API Documentation

### Authentication Endpoints

#### Sign Up
```
POST /api/auth/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword"
}

Response: { token, user }
```

#### Sign In
```
POST /api/auth/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}

Response: { token, user }
```

#### Get Profile
```
GET /api/auth/profile
Authorization: Bearer <token>

Response: { user }
```

#### Update Settings
```
PUT /api/auth/settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "theme": "dark",
  "language": "en",
  "notifications_enabled": true
}

Response: { message }
```

### Movies Endpoints

#### Get All Movies
```
GET /api/movies?page=1&limit=20

Response: { movies, pagination }
```

#### Get Trending Movies
```
GET /api/movies/trending

Response: { movies }
```

#### Get Movie Details
```
GET /api/movies/:id

Response: { movie }
```

#### Search Movies
```
GET /api/movies/search/:query

Response: { movies }
```

#### Add to Watchlist
```
POST /api/movies/watchlist/:movieId
Authorization: Bearer <token>

Response: { message }
```

#### Get Watchlist
```
GET /api/movies/watchlist
Authorization: Bearer <token>

Response: { movies }
```

#### Continue Watching
```
POST /api/movies/continue-watching/:movieId
Authorization: Bearer <token>
Content-Type: application/json

{
  "watch_duration": 3600,
  "total_duration": 7200
}

Response: { message }
```

#### Rate Movie
```
POST /api/movies/rate/:movieId
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 8
}

Response: { message }
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  avatar TEXT,
  theme TEXT DEFAULT 'dark',
  language TEXT DEFAULT 'en',
  notifications_enabled INTEGER DEFAULT 1,
  created_at DATETIME,
  updated_at DATETIME
)
```

### Movies Table
```sql
CREATE TABLE movies (
  id INTEGER PRIMARY KEY,
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
  created_at DATETIME
)
```

### Watchlist Table
```sql
CREATE TABLE watchlist (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  movie_id INTEGER NOT NULL,
  added_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (movie_id) REFERENCES movies(id),
  UNIQUE(user_id, movie_id)
)
```

### Continue Watching Table
```sql
CREATE TABLE continue_watching (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  movie_id INTEGER NOT NULL,
  watch_duration INTEGER,
  total_duration INTEGER,
  last_watched DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (movie_id) REFERENCES movies(id),
  UNIQUE(user_id, movie_id)
)
```

### Ratings Table
```sql
CREATE TABLE ratings (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  movie_id INTEGER NOT NULL,
  rating INTEGER,
  created_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (movie_id) REFERENCES movies(id),
  UNIQUE(user_id, movie_id)
)
```

## Configuration & Customization

### Themes
Themes can be managed in `SettingsView.vue`. Users can choose:
- **Dark Mode**: Traditional dark theme
- **Light Mode**: Bright, modern theme
- **Auto**: System preference-based theme switching

### Color Schemes
Primary colors available:
- Red (default - #DC2626)
- Blue (#2563EB)
- Purple (#9333EA)
- Green (#16A34A)

### Languages
Supported languages configured in settings:
- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Portuguese (pt)
- Japanese (ja)

## Technologies Used

### Frontend
- **Vue 3**: Reactive UI framework
- **Vite**: Lightning-fast build tool
- **Vue Router 4**: Client-side routing
- **Tailwind CSS 4**: Utility-first CSS framework

### Backend
- **Express.js**: Node.js web framework
- **SQLite3**: Lightweight database
- **JWT**: Secure token-based authentication
- **bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing

## Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the dist/ folder
```

### Backend (Heroku/Railway/Railway)
```bash
# Ensure Procfile exists
# Commit and push to deploy
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Database Errors
```bash
# Remove and regenerate database
rm backend/db/netfill.db
npm run backend
```

### CORS Errors
Ensure `VITE_BACKEND_URL` in `.env.local` matches the backend URL.

## Testing Test Accounts

### Sample Login
```
Email: test@example.com
Password: password123
```

### Creating New Accounts
1. Click "Sign Up Now" on the Sign In page
2. Fill in username, email, and password
3. Agree to terms and create account
4. You'll be automatically logged in and redirected to home

## Future Enhancements

- [ ] Video streaming integration
- [ ] Social features (likes, comments)
- [ ] Recommendation engine
- [ ] Multiple user profiles
- [ ] Subscription management
- [ ] Android/iOS native apps
- [ ] Advanced filtering and sorting
- [ ] User-generated watchlists
- [ ] Newsletter subscription
- [ ] Analytics dashboard

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please open an issue on GitHub or contact the development team.

---

**Happy streaming! Enjoy Netfill! 🎬🍿**
