# 🎬 Netfill - Start Running Now!

Everything is set up! Here's how to start:

## Quick Start

```bash
# Make sure you're in the project directory
cd /home/retr0/Netfill

# Run both frontend and backend together
npm run dev
```

**That's it!** Both will start automatically.

### Access the App
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

---

## What's New ✨

✅ **Sidebar Only Navigation** - No navbar, clean sidebar with hamburger menu on mobile  
✅ **Real Time Movies** - Fetching live data from TMDB API  
✅ **Dark/Light Theme** - Global theme switching that works on all pages  
✅ **Better Profile Page** - Full profile management with avatar upload  
✅ **Responsive Design** - Perfect on desktop, tablet, and mobile  

---

## Test Account (Optional)

If you want to use the backend login:
```
Email: test@example.com
Password: password123
```

Or just **sign up with any credentials** - quick and easy!

---

## Features You Can Try

### 🎯 On Home Page
- See **trending movies** from TMDB
- Browse **popular**, **top-rated**, and **TV shows**
- Click on any movie to see details
- Add movies to your watchlist

### ⚙️ Settings Page (`/settings`)
- **Dark Mode** - Click the dark button to see the magic
- **Light Mode** - Everything turns white/gray
- **Color Themes** - Try red, blue, purple, or green
- **Language** - Select your language

### 👤 Profile Page (`/profile`)
- Upload a profile picture
- View your account info
- Change password (demo button)
- Manage devices
- Logout or delete account

### ❤️ Watchlist & Continue Watching
- Heart icon on movies to save them
- View your saved movies in `/watchlist`
- Track progress in `/continue-watching`

### 🔍 Search
- Search for any movie by title
- Real-time results

---

## Mobile Experience

The sidebar automatically becomes a **hamburger menu** on small screens:
1. Click the menu icon (top-left)
2. All navigation items appear
3. Click a link to navigate
4. Menu closes automatically

---

## Theme Switching

### How to Test Themes:
1. Go to **Settings** → **Appearance**
2. Click on theme buttons
3. Watch the entire page transform!

### Available Themes:
- **Dark** - Black background (default)
- **Light** - White background
- **Auto** - Follows your system preference

---

## Movies Display

All movies are **fetched in real-time** from TMDB API:
- Trending movies this week
- Popular movies & TV shows
- Top-rated content
- Real posters and descriptions

---

## Backend API (Optional to Test)

If you want to test the backend API with curl:

```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "myuser",
    "email": "my@email.com",
    "password": "password123"
  }'

# Sign in
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "my@email.com",
    "password": "password123"
  }'
```

---

## Troubleshooting

**Port 5173 already in use?**
```bash
lsof -ti:5173 | xargs kill -9
```

**Port 5000 already in use?**
```bash
lsof -ti:5000 | xargs kill -9
```

**Movies not showing?**
- Make sure you added YOUR TMDB API key to `.env.local`
- Check browser console for errors
- Verify internet connection

**Theme not changing?**
- Hard refresh the page (Ctrl+Shift+R)
- Clear localStorage: `localStorage.clear()`
- Check Settings page

---

## Next Steps

1. **Customize colors** - Change the red theme color in Sidebar.vue
2. **Add more features** - Ratings, reviews, recommendations
3. **Deploy** - Upload to Vercel (frontend) and Heroku (backend)
4. **Add video player** - Integrate video streaming

---

## File Structure (Quick Reference)

```
src/
├── components/
│   └── Sidebar.vue          ← Main navigation
├── views/
│   ├── HomeView.vue         ← Shows real movies
│   ├── SettingsView.vue     ← Theme & preferences
│   ├── ProfileView.vue      ← User profile
│   ├── SignIn/SignUp.vue    ← Auth pages
│   └── WatchlistView.vue    ← Saved movies
└── App.vue                  ← Root component (handles theme)
```

---

## Keyboard Shortcuts (Future)

- `H` - Go to Home
- `S` - Go to Settings
- `P` - Go to Profile
- `Q` - Logout

---

## Performance Tips

- Movies are **lazy-loaded** with images
- Sidebar toggles smoothly on mobile
- Theme changes are instant with CSS
- No unnecessary API calls

---

**You're all set! Enjoy Netfill! 🍿🎬**

Questions? Check the files or run:
```bash
npm run dev  # See console output for any issues
```
