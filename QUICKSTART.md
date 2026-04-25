# 🚀 Quick Start Guide - Netfill

Get up and running with Netfill in just 5 minutes!

## Prerequisites
- Node.js 20.19.0+ 
- npm installed

## Quick Setup

### 1. Install Dependencies
```bash
# From project root
npm run install-all
```

### 2. Start the Application
```bash
# From project root - This starts both frontend & backend
npm run dev
```

### 3. Access Netfill
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## Create Your First Account

1. Click **"Sign up now"** on the main page
2. Enter:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
3. Agree to terms and click **"Start Membership"**
4. You're in! 🎉

## Explore Features

### 🎬 Homepage
- View trending movies
- See your continue watching list
- Browse all available movies

### ❤️ Watchlist (`/watchlist`)
- Click the heart icon on any movie to add it
- View all your saved movies in one place
- Remove movies from your list anytime

### ⏱️ Continue Watching (`/continue-watching`)
- Auto-saves your watch progress
- Resume exactly where you left off
- Track all your in-progress movies

### ⚙️ Settings (`/settings`)
- **Theme**: Switch between Dark, Light, and Auto modes
- **Colors**: Choose from 4 color schemes
- **Language**: Select your preferred language
- **Notifications**: Toggle email notifications

### 🔍 Search
- Search for any movie by title
- Instant results as you type
- Click any result to view details

## API Endpoints

### Try Login/Signup Endpoints
```bash
# Sign Up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "user@example.com", 
    "password": "securepass"
  }'

# Sign In
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Database
- **Location**: `backend/db/netfill.db`
- **Type**: SQLite3
- **Sample Data**: Auto-loads 3 sample movies on first run

## Running Frontend & Backend Separately

### Terminal 1: Frontend
```bash
npm run frontend
```

### Terminal 2: Backend
```bash
npm run backend
```

## Troubleshooting

**Port 5000 already in use?**
```bash
# Find and kill the process
lsof -ti:5000 | xargs kill -9
```

**Can't connect to backend from frontend?**
- Verify backend is running on `http://localhost:5000`
- Check `.env.local` has correct `VITE_BACKEND_URL`

**Database errors?**
```bash
# Remove database and restart
rm backend/db/netfill.db
npm run backend
```

## Next Steps

1. **Customize branding** - Edit logo in `Sidebar.vue`
2. **Add more movies** - Insert into database via API
3. **Deploy** - See [BACKEND_SETUP.md](BACKEND_SETUP.md) for deployment guides
4. **Extend features** - Add ratings, reviews, recommendations, etc.

## Important Files

```
Netfill/
├── backend/server.js              ← Backend entry point
├── src/services/backend-api.js    ← API service
├── src/views/SettingsView.vue     ← Settings page
├── src/components/Sidebar.vue     ← Main navigation
└── .env.local                     ← Environment config
```

## Learn More

- [Full Backend Setup Guide](./BACKEND_SETUP.md)
- [Vue 3 Documentation](https://vuejs.org)
- [Express.js Guide](https://expressjs.com)
- [Tailwind CSS](https://tailwindcss.com)

---

**Happy streaming! 🍿🎬**
