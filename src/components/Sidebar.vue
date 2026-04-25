<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside :class="[
      'fixed lg:relative left-0 top-0 h-screen w-64 transition-transform duration-300 z-40',
      isDarkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-200',
      isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]" class="border-r">
      <!-- Logo -->
      <div :class="isDarkMode ? 'border-gray-800' : 'border-gray-200'" class="p-6 border-b">
        <h1 class="text-2xl font-bold text-red-600 flex items-center gap-2">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4z"/>
          </svg>
          Netfill
        </h1>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <router-link 
          to="/" 
          @click="closeMobileMenu"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
            isActive('/') 
              ? 'bg-red-600 text-white' 
              : isDarkMode 
                ? 'text-gray-300 hover:bg-gray-800' 
                : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m-9-2l2-3m0 0l7-4 7 4"/>
          </svg>
          <span>Home</span>
        </router-link>

        <router-link 
          to="/search" 
          @click="closeMobileMenu"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
            isActive('/search') 
              ? 'bg-red-600 text-white' 
              : isDarkMode 
                ? 'text-gray-300 hover:bg-gray-800' 
                : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <span>Search</span>
        </router-link>

        <router-link 
          to="/watchlist" 
          @click="closeMobileMenu"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
            isActive('/watchlist') 
              ? 'bg-red-600 text-white' 
              : isDarkMode 
                ? 'text-gray-300 hover:bg-gray-800' 
                : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V5z"/>
          </svg>
          <span>My List</span>
        </router-link>

        <router-link 
          to="/continue-watching" 
          @click="closeMobileMenu"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
            isActive('/continue-watching') 
              ? 'bg-red-600 text-white' 
              : isDarkMode 
                ? 'text-gray-300 hover:bg-gray-800' 
                : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>Continue</span>
        </router-link>

        <hr :class="isDarkMode ? 'border-gray-800' : 'border-gray-200'" class="my-4">

        <router-link 
          to="/profile" 
          @click="closeMobileMenu"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
            isActive('/profile') 
              ? 'bg-red-600 text-white' 
              : isDarkMode 
                ? 'text-gray-300 hover:bg-gray-800' 
                : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          <span>Profile</span>
        </router-link>

        <router-link 
          to="/settings" 
          @click="closeMobileMenu"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
            isActive('/settings') 
              ? 'bg-red-600 text-white' 
              : isDarkMode 
                ? 'text-gray-300 hover:bg-gray-800' 
                : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span>Settings</span>
        </router-link>

        <router-link 
          v-if="isAdmin"
          to="/admin" 
          @click="closeMobileMenu"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
            isActive('/admin') 
              ? 'bg-red-600 text-white' 
              : isDarkMode 
                ? 'text-gray-300 hover:bg-gray-800' 
                : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          <span>Admin</span>
        </router-link>

        <button 
          @click="logout"
          :class="isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mt-4"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          <span>Logout</span>
        </button>
      </nav>
    </aside>

    <!-- Mobile Menu Toggle -->
    <button 
      @click="toggleMobileMenu"
      class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-red-600 text-white rounded-lg"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    </button>

    <!-- Overlay for mobile -->
    <div 
      v-if="isMobileOpen"
      @click="closeMobileMenu"
      class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const isMobileOpen = ref(false);

const isDarkMode = computed(() => {
  const theme = localStorage.getItem('theme') || 'dark'
  if (theme === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return theme !== 'light'
})

const isAdmin = computed(() => {
  // Check both userRole and user.role for compatibility
  const userRole = localStorage.getItem('userRole')
  if (userRole) return userRole === 'admin'
  
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  return user.role === 'admin'
})

const toggleMobileMenu = () => {
  isMobileOpen.value = !isMobileOpen.value;
};

const closeMobileMenu = () => {
  isMobileOpen.value = false;
};

const isActive = (path) => {
  return route.path === path;
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userName');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userAvatar');
  localStorage.removeItem('isLoggedIn');
  closeMobileMenu();
  router.push('/signin');
};
</script>

<style scoped>
/* Smooth sidebar animation */
@media (max-width: 1024px) {
  aside {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }
}
</style>
