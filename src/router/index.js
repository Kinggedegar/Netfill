import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  // 1. Core Pages
  { 
    path: '/', 
    name: 'home', 
    component: () => import('../views/HomeView.vue') 
  },
  { 
    path: '/search', 
    name: 'search', 
    component: () => import('../views/SearchView.vue') 
  },

  // 2. Category Pages (Reusing CategoryView)
  { 
    path: '/tv-shows', 
    name: 'tv-shows', 
    component: () => import('../views/CategoryView.vue') 
  },
  { 
    path: '/movies', 
    name: 'movies', 
    component: () => import('../views/CategoryView.vue') 
  },
  { 
    path: '/new-popular', 
    name: 'new-popular', 
    component: () => import('../views/CategoryView.vue') 
  },
  { 
    path: '/my-list', 
    name: 'my-list', 
    component: () => import('../views/CategoryView.vue') 
  },

  // 3. Auth & Support Pages (NEW)
  { 
    path: '/login', 
    name: 'login', 
    component: () => import('../views/SignIn.vue') 
  },
  { 
    path: '/register', 
    name: 'register', 
    component: () => import('../views/SignUp.vue') 
  },
  { 
    path: '/contact', 
    name: 'contact', 
    component: () => import('../views/Contact.vue') 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Professional Touch: Scroll to top on every page navigation
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

export default router;