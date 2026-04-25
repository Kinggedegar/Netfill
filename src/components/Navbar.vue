<template>
  <header 
    class="fixed top-0 w-full z-50 transition-all duration-400 ease-in-out"
    :class="isScrolled ? 'bg-[#141414]/95 backdrop-blur-md shadow-lg' : 'bg-gradient-to-b from-black/90 via-black/60 to-transparent'"
  >
    <div class="px-4 md:px-12 h-[70px] flex items-center justify-between">
      
      <!-- LEFT: Logo & Nav -->
      <div class="flex items-center gap-8">
        <router-link to="/" class="group">
          <h1 class="text-3xl md:text-4xl font-black text-red-600 tracking-widest uppercase transform group-hover:scale-105 transition duration-300 drop-shadow-md group-hover:drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]">
  NITE<span class="font-light text-white group-hover:text-red-100 transition">CHILL</span>
</h1>
        </router-link>

        <nav class="hidden lg:flex items-center gap-6 text-sm font-medium">
          <router-link 
            v-for="link in navLinks" 
            :key="link.path" 
            :to="link.path" 
            active-class="text-white font-bold cursor-default" 
            class="text-gray-300 hover:text-gray-100 hover:scale-105 transition-all duration-200"
          >
            {{ link.name }}
          </router-link>
          <!-- Admin Dashboard Link -->
          <router-link 
            v-if="userRole === 'admin'"
            to="/admin"
            active-class="text-red-500 font-bold cursor-default" 
            class="text-red-400 hover:text-red-200 hover:scale-105 transition-all duration-200 font-bold"
          >
            Admin
          </router-link>
        </nav>
      </div>

      <!-- RIGHT: Search & Profile -->
      <div class="flex items-center gap-2 md:gap-6 text-white">
        
        <!-- Search Bar -->
        <div class="relative flex items-center justify-end" ref="searchContainer">
          <button 
            @click="toggleSearch" 
            class="z-20 p-2 rounded-full hover:bg-white/10 transition duration-300"
            :class="{ 'text-red-500': showSearch }"
          >
            <svg class="w-6 h-6 shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </button>
          
          <input 
            v-model="searchQuery"
            @keyup.enter="performSearch"
            ref="searchInput"
            type="text" 
            placeholder="Titles, people, genres..."
            class="absolute right-0 bg-black/80 border border-gray-600 text-white text-sm rounded-none pl-10 pr-4 py-2 transition-all duration-300 ease-out focus:outline-none focus:border-white focus:bg-black/90 placeholder-gray-500 shadow-xl"
            :class="showSearch ? 'w-[200px] md:w-[280px] opacity-100' : 'w-0 opacity-0 pointer-events-none border-transparent'"
          />
        </div>

        <!-- Auth / Profile Section -->
        <div v-if="isLoggedIn" class="relative group z-10">
          <div class="flex items-center gap-3 cursor-pointer py-2">
            <!-- DYNAMIC USER PHOTO -->
            <div class="relative w-9 h-9 md:w-10 md:h-10 rounded-md overflow-hidden border-2 border-transparent group-hover:border-white transition duration-300">
               <img 
                :src="userAvatar" 
                class="w-full h-full object-cover" 
                alt="Profile"
              />
            </div>
            
            <svg class="w-4 h-4 transition-transform duration-300 group-hover:rotate-180 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
          
          <!-- Dropdown Menu -->
          <div class="absolute right-0 top-full pt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right transform group-hover:translate-y-0 translate-y-2">
            <div class="bg-black/95 border border-gray-700 rounded shadow-2xl overflow-hidden backdrop-blur-sm">
              
              <!-- Header inside dropdown -->
              <div class="px-4 py-3 border-b border-gray-700 bg-gray-900/50 flex items-center gap-3">
                 <img :src="userAvatar" class="w-10 h-10 rounded object-cover" />
                 <div class="overflow-hidden">
                    <p class="text-xs text-gray-400">Signed in as</p>
                    <p class="text-sm font-bold text-white truncate">{{ userName }}<span v-if="userRole === 'admin'" class="text-xs bg-red-600 text-white px-2 py-0.5 rounded ml-2">Admin</span><span v-else class="text-xs text-gray-400 ml-2">(User)</span></p>
                 </div>
              </div>

              <!-- Menu Links -->
              <div class="py-1">
                <!-- 1. Edit Profile -->
                <router-link to="/profile" class="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Edit Profile & Photo
                </router-link>
                
                <!-- 2. My Watchlist -->
                <router-link to="/my-list" class="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition">
                   <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                   My Watchlist
                </router-link>

                <!-- 3. Continue Watching (ADDED HERE) -->
                <router-link to="/continue-watching" class="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition">
                   <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   Continue Watching
                </router-link>

                <!-- 4. Admin Dashboard (for admins only) -->
                <router-link v-if="userRole === 'admin'" to="/admin" class="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-900/40 hover:text-red-200 transition border-t border-gray-700 mt-1">
                   <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m6 2a2 2 0 110 4m0-4a2 2 0 100 4m-6 2a2 2 0 110 4m0-4a2 2 0 100 4m-6-2a2 2 0 110 4m0-4a2 2 0 100 4" /></svg>
                   Admin Dashboard
                </router-link>
              </div>
              
              <!-- Logout -->
              <div class="border-t border-gray-700">
                <button @click="handleLogout" class="w-full text-left px-4 py-3 text-sm text-white hover:bg-red-600/90 hover:text-white transition flex items-center gap-3">
                   <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                   Sign out
                </button>
              </div>
            </div>
          </div>
        </div>

        <router-link v-else to="/login" class="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded text-sm font-bold shadow-lg transition transform hover:scale-105">
          Sign In
        </router-link>

        <button @click="mobileMenuOpen = true" class="lg:hidden ml-1 p-1 hover:text-gray-300 transition">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <Transition name="fade">
      <div v-if="mobileMenuOpen" class="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex flex-col">
        <div class="flex justify-end p-6">
          <button @click="mobileMenuOpen = false" class="p-2 rounded-full hover:bg-white/10 transition">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        
        <div class="flex flex-col items-center justify-center flex-grow space-y-8 px-6">
          <div v-if="isLoggedIn" class="flex flex-col items-center animate-slide-up">
            <img :src="userAvatar" class="w-24 h-24 rounded-full shadow-2xl border-4 border-red-600 mb-4 object-cover" />
            <span class="text-2xl font-bold tracking-wide">{{ userName }}</span>            <span v-if=\"userRole === 'admin'\" class=\"text-xs bg-red-600 text-white px-3 py-1 rounded mt-1\">Admin</span>
            <span v-else class=\"text-xs text-gray-400 mt-1\">(User)</span>            <router-link to="/profile" @click="mobileMenuOpen = false" class="text-sm text-gray-400 mt-2 underline hover:text-white">
              Change Photo
            </router-link>
          </div>

          <div class="flex flex-col items-center gap-6 text-xl font-medium animate-slide-up">
            <router-link v-for="link in navLinks" :key="link.path" :to="link.path" @click="mobileMenuOpen = false" class="text-gray-400 hover:text-white hover:scale-110 transition duration-300">
              {{ link.name }}
            </router-link>
            
            <!-- ADDED CONTINUE WATCHING TO MOBILE TOO -->
            <router-link to="/continue-watching" @click="mobileMenuOpen = false" class="text-gray-400 hover:text-white hover:scale-110 transition duration-300">
              Continue Watching
            </router-link>

            <!-- Admin Dashboard for admins -->
            <router-link v-if="userRole === 'admin'" to="/admin" @click="mobileMenuOpen = false" class="text-red-400 hover:text-red-200 hover:scale-110 transition duration-300 font-bold">
              Admin Dashboard
            </router-link>
          </div>
          
          <div class="mt-8 animate-slide-up">
            <button v-if="isLoggedIn" @click="handleLogout" class="text-lg font-bold text-red-500 hover:text-red-400 transition">
              Sign Out
            </button>
            <router-link v-else @click="mobileMenuOpen = false" to="/login" class="bg-red-600 text-white px-8 py-3 rounded font-bold hover:bg-red-700 transition shadow-lg">
              Sign In
            </router-link>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// State
const isScrolled = ref(false)
const showSearch = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)
const searchContainer = ref(null)
const mobileMenuOpen = ref(false)

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'TV Shows', path: '/tv-shows' },
  { name: 'Movies', path: '/movies' },
  { name: 'My List', path: '/my-list' }
]

// User State
const isLoggedIn = ref(false)
const userName = ref('Guest')
const userRole = ref('user')
const defaultAvatar = 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png'
const userAvatar = ref(defaultAvatar)

const loadUserData = () => {
  isLoggedIn.value = localStorage.getItem('isLoggedIn') === 'true'
  if (isLoggedIn.value) {
    userName.value = localStorage.getItem('userName') || 'ChillUser'
    userRole.value = localStorage.getItem('userRole') || 'user'
    const customPhoto = localStorage.getItem('userAvatar')
    userAvatar.value = customPhoto || defaultAvatar
  }
}

const handleStorageChange = (event) => {
  if (event.key === 'userAvatar' || event.key === 'userName' || event.key === 'userRole') {
    loadUserData()
  }
}

const handleScroll = () => { isScrolled.value = window.scrollY > 50 }
const toggleSearch = () => {
  showSearch.value = !showSearch.value
  if (showSearch.value) nextTick(() => searchInput.value?.focus())
}
const handleClickOutside = (e) => {
  if (showSearch.value && searchContainer.value && !searchContainer.value.contains(e.target)) {
    if (!searchQuery.value) showSearch.value = false
  }
}
const performSearch = () => {
  if (searchQuery.value.trim()) router.push({ path: '/search', query: { q: searchQuery.value } })
}
const handleLogout = () => {
  localStorage.removeItem('isLoggedIn')
  isLoggedIn.value = false
  mobileMenuOpen.value = false
  router.push('/login')
}

watch(() => route.path, loadUserData)

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('storage', handleStorageChange)
  window.addEventListener('profile-updated', loadUserData)
  loadUserData()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('storage', handleStorageChange)
  window.removeEventListener('profile-updated', loadUserData)
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-slide-up { animation: slideUp 0.5s forwards ease-out; opacity: 0; }
</style>