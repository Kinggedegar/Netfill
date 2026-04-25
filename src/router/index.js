import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // --- MAIN APP ---
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Home - NetFill' }
  },
  {
    path: '/movies',
    name: 'movies',
    component: () => import('@/views/CategoryView.vue'),
    meta: { title: 'Movies - NetFill' }
  },
  {
    path: '/tv-shows',
    name: 'tv-shows',
    component: () => import('@/views/CategoryView.vue'),
    meta: { title: 'TV Shows - NetFill' }
  },
  
  // --- DETAILS ---
  {
    path: '/movie/:id',
    name: 'movie-details',
    component: () => import('@/views/MovieDetails.vue'),
    meta: { title: 'Details - NetFill' }
  },

  // --- USER (Protected) ---
  {
    path: '/my-list',
    name: 'my-list',
    component: () => import('@/views/WatchlistView.vue'),
    meta: { requiresAuth: true, title: 'My List' }
  },
  {
    path: '/continue-watching',
    name: 'continue-watching',
    component: () => import('@/views/ContinueWatchingView.vue'),
    meta: { requiresAuth: true, title: 'Continue Watching' }
  },
  // NEW PROFILE ROUTE
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { requiresAuth: true, title: 'Edit Profile' }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: { requiresAuth: true, title: 'Settings' }
  },
  {
    path: '/watchlist',
    name: 'watchlist',
    component: () => import('@/views/WatchlistView.vue'),
    meta: { requiresAuth: true, title: 'My Watchlist' }
  },

  // --- AUTH (No Navbar/Footer) ---
  {
    path: '/signin',
    name: 'signin',
    component: () => import('@/views/SignIn.vue'),
    meta: { guest: true, hideNavbar: true, hideFooter: true, hideSidebar: true, title: 'Sign In' }
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@/views/SignUp.vue'),
    meta: { guest: true, hideNavbar: true, hideFooter: true, hideSidebar: true, title: 'Sign Up' }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/SignIn.vue'),
    meta: { guest: true, hideNavbar: true, hideFooter: true, hideSidebar: true, title: 'Login' }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/SignUp.vue'),
    meta: { guest: true, hideNavbar: true, hideFooter: true, hideSidebar: true, title: 'Sign Up' }
  },
  
  // --- ADMIN ---
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/AdminDashboard.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, title: 'Admin Dashboard' }
  },

  // --- SEARCH ---
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/SearchView.vue'),
    meta: { title: 'Search' }
  },

  // --- 404 ---
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/NotFound.vue'),
    meta: { hideNavbar: true, hideFooter: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0, behavior: 'smooth' }
  }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'NetFill';
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = localStorage.getItem('userRole') || user.role || 'user';
  const isAdmin = userRole === 'admin';

  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else if (to.meta.requiresAdmin && !isAdmin) {
    next({ name: 'home' });
  } else if (to.meta.guest && isLoggedIn) {
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router