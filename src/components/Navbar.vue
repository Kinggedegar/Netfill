<template>
  <header 
    class="fixed top-0 w-full z-40 transition-colors duration-300"
    :class="isScrolled ? 'bg-[#141414] shadow-md' : 'bg-gradient-to-b from-black/80 to-transparent'"
  >
    <div class="px-4 md:px-12 h-[68px] flex items-center justify-between">
      
      <!-- LEFT: Logo & Nav -->
      <div class="flex items-center gap-8">
        <router-link to="/" class="text-3xl font-black text-red-600 tracking-tighter cursor-pointer hover:scale-105 transition">
          NETFILL
        </router-link>

        <nav class="hidden lg:flex items-center gap-5 text-sm font-medium">
          <router-link to="/" active-class="text-white font-bold" class="text-gray-300 hover:text-white transition">Home</router-link>
          <router-link to="/tv-shows" active-class="text-white font-bold" class="text-gray-300 hover:text-white transition">TV Shows</router-link>
          <router-link to="/movies" active-class="text-white font-bold" class="text-gray-300 hover:text-white transition">Movies</router-link>
          <router-link to="/my-list" active-class="text-white font-bold" class="text-gray-300 hover:text-white transition">My List</router-link>
        </nav>
      </div>

      <!-- RIGHT: Search & Profile -->
      <div class="flex items-center gap-4 text-white">
        
        <!-- Search Bar (Desktop) -->
        <div class="relative flex items-center">
          <button @click="showSearch = !showSearch" class="p-1 hover:text-gray-300 transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </button>
          
          <input 
            v-if="showSearch"
            v-model="searchQuery"
            @keyup.enter="performSearch"
            ref="searchInput"
            type="text" 
            placeholder="Titles, people, genres"
            class="absolute right-8 bg-black/80 border border-white/50 pl-3 pr-4 py-1.5 w-60 rounded text-sm focus:outline-none focus:border-white animate-expand"
          />
        </div>

        <!-- Auth / Profile -->
        <div v-if="isLoggedIn" class="relative group">
          <div class="flex items-center gap-2 cursor-pointer">
            <!-- DYNAMIC AVATAR IMAGE -->
            <img :src="userAvatar" class="w-8 h-8 rounded object-cover border border-transparent group-hover:border-white transition" />
            <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
          
          <!-- Dropdown -->
          <div class="absolute right-0 top-full mt-2 w-48 bg-black border border-gray-700 rounded shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right">
            
            <div class="px-4 py-2 border-b border-gray-700 text-xs text-gray-400">
              Hi, <span class="text-white font-bold">{{ userName }}</span>
            </div>

            <router-link to="/profile" class="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-800 transition">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              Edit Profile
            </router-link>

            <router-link to="/my-list" class="block px-4 py-2.5 text-sm hover:bg-gray-800">My Watchlist</router-link>
            <router-link to="/continue-watching" class="block px-4 py-2.5 text-sm hover:bg-gray-800">Continue Watching</router-link>
            
            <button @click="handleLogout" class="block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-800 border-t border-gray-700 mt-2">
              Sign out
            </button>
          </div>
        </div>

        <router-link v-else to="/login" class="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded font-semibold text-sm transition">
          Sign In
        </router-link>

        <!-- Mobile Menu Toggle -->
        <button @click="mobileMenuOpen = true" class="lg:hidden ml-2">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <div v-if="mobileMenuOpen" class="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center space-y-8 animate-fade-in">
      <button @click="mobileMenuOpen = false" class="absolute top-6 right-6 p-2">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
      
      <!-- Mobile Profile Info -->
      <div v-if="isLoggedIn" class="flex flex-col items-center mb-4">
        <img :src="userAvatar" class="w-16 h-16 rounded-full border-2 border-white mb-2 object-cover" />
        <span class="text-xl font-bold">{{ userName }}</span>
        <router-link to="/profile" @click="mobileMenuOpen = false" class="text-sm text-gray-400 mt-1 underline">Edit Profile</router-link>
      </div>

      <router-link @click="mobileMenuOpen = false" to="/" class="text-2xl font-bold text-gray-300 hover:text-white">Home</router-link>
      <router-link @click="mobileMenuOpen = false" to="/tv-shows" class="text-2xl font-bold text-gray-300 hover:text-white">TV Shows</router-link>
      <router-link @click="mobileMenuOpen = false" to="/movies" class="text-2xl font-bold text-gray-300 hover:text-white">Movies</router-link>
      <router-link @click="mobileMenuOpen = false" to="/my-list" class="text-2xl font-bold text-gray-300 hover:text-white">My List</router-link>
      
      <button v-if="isLoggedIn" @click="handleLogout" class="text-xl font-bold text-red-500 mt-8">Sign Out</button>
      <router-link v-else @click="mobileMenuOpen = false" to="/login" class="text-xl font-bold text-red-500 mt-8">Sign In</router-link>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isScrolled = ref(false)
const showSearch = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)
const mobileMenuOpen = ref(false)

// User State
const isLoggedIn = ref(false)
const userName = ref('User')
const userAvatar = ref('https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png')

const loadUserData = () => {
  isLoggedIn.value = localStorage.getItem('isLoggedIn') === 'true'
  if (isLoggedIn.value) {
    userName.value = localStorage.getItem('userName') || 'User'
    userAvatar.value = localStorage.getItem('userAvatar') || 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png'
  }
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 30
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value } })
    showSearch.value = false
  }
}

const handleLogout = () => {
  localStorage.removeItem('isLoggedIn')
  // We keep the username/avatar in storage for next login "remember me" feel, or clear it if strict privacy needed
  isLoggedIn.value = false
  mobileMenuOpen.value = false
  router.push('/login')
}

// Watch for route changes to refresh user data (in case Profile was updated)
watch(() => route.path, () => {
  loadUserData()
})

watch(showSearch, (val) => {
  if (val) nextTick(() => searchInput.value?.focus())
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  loadUserData()
})

onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.animate-expand { animation: expand 0.2s ease-out; transform-origin: right; }
@keyframes expand { from { transform: scaleX(0); opacity: 0; } to { transform: scaleX(1); opacity: 1; } }
.animate-fade-in { animation: fadeIn 0.2s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>