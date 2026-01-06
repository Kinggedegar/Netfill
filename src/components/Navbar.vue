<template>
  <header
    class="fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b border-transparent"
    :class="headerClasses"
  >
    <div class="max-w-[1920px] mx-auto px-4 md:px-8 h-16 md:h-[72px] flex items-center justify-between">
      
      <!-- ================= LEFT: Logo & Mobile Toggle ================= -->
      <div class="flex items-center gap-4 lg:gap-8">
        <!-- Mobile Hamburger (Visible < lg) -->
        <button
          @click="openMenu"
          class="lg:hidden p-2 -ml-2 text-gray-300 hover:text-white rounded-full hover:bg-white/10 transition active:scale-95"
          aria-label="Open Menu"
        >
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </button>

        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-1 group relative z-10" @click="closeMenu">
          <div class="bg-[#F5C518] text-black font-extrabold text-[10px] px-1.5 py-0.5 rounded-[3px] mt-1 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_10px_rgba(245,197,24,0.4)]">
            PRO
          </div>
          <h1 class="text-white text-2xl md:text-3xl font-black tracking-tighter cursor-pointer">
            Net<span class="text-[#F5C518]">Fill</span>
          </h1>
        </router-link>

        <!-- Desktop Navigation Links (Visible >= lg) -->
        <nav class="hidden lg:flex items-center gap-6 xl:gap-8 ml-4">
          <router-link 
            v-for="link in navLinks" 
            :key="link.path" 
            :to="link.path"
            class="relative text-sm font-medium text-gray-300 hover:text-white transition-colors py-2"
            active-class="!text-white font-bold"
          >
            {{ link.name }}
            <span v-if="isActive(link.path)" class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#F5C518] rounded-full shadow-[0_0_8px_#F5C518]"></span>
          </router-link>
        </nav>
      </div>

      <!-- ================= CENTER/RIGHT: Search & Actions ================= -->
      <div class="flex items-center gap-2 md:gap-5">
        
        <!-- Desktop Search Bar -->
        <div class="hidden md:block relative group w-64 lg:w-80 transition-all duration-300 focus-within:w-96">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-4 w-4 text-gray-400 group-focus-within:text-[#F5C518] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            class="block w-full pl-10 pr-3 py-2 border border-transparent rounded-lg leading-5 bg-[#2A2A2A] text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-[#333] focus:border-[#F5C518]/50 focus:text-white focus:placeholder-gray-400 sm:text-sm transition-all shadow-inner"
            placeholder="Search movies, TV, actors..."
            @keydown.enter="handleSearch"
          />
          <button 
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <!-- Mobile Search Toggle -->
        <button 
          @click="isMobileSearchOpen = !isMobileSearchOpen"
          class="md:hidden p-2 text-gray-300 hover:text-white rounded-full hover:bg-white/10"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </button>

        <!-- VIP Button (Desktop) -->
        <button class="hidden sm:flex items-center gap-2 bg-[#F5C518] hover:bg-[#d4a910] text-black px-4 py-1.5 rounded-full font-bold text-xs transition shadow-lg shadow-yellow-500/20 transform hover:scale-105">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.516L20.297 19H3.703L12 5.516z"/></svg>
          VIP
        </button>

        <!-- AUTH SECTION (Desktop) -->
        
        <!-- Case 1: Not Logged In -->
        <router-link 
          v-if="!isLoggedIn" 
          to="/login"
          class="hidden md:block bg-[#333] hover:bg-white text-white hover:text-black px-5 py-2 rounded-full font-bold text-sm transition"
        >
          Sign In
        </router-link>

        <!-- Case 2: Logged In (Avatar + Dropdown) -->
        <div v-else class="relative group cursor-pointer">
          <div class="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden border border-gray-600 group-hover:border-[#F5C518] transition-all ring-2 ring-transparent group-hover:ring-white/20">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" class="w-full h-full object-cover" alt="Profile" />
          </div>
          <!-- Dropdown Arrow -->
          <div class="absolute -bottom-1 -right-1 bg-black rounded-full p-0.5 border border-gray-700">
            <svg class="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
          </div>

          <!-- Dropdown Menu -->
          <div class="absolute right-0 top-full mt-4 w-48 bg-[#1D1D1D] border border-gray-700 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50 overflow-hidden">
            <router-link to="/contact" class="block px-4 py-3 text-sm text-gray-300 hover:bg-[#2A2A2A] hover:text-[#F5C518]">
              Help Center
            </router-link>
            <router-link to="/my-list" class="block px-4 py-3 text-sm text-gray-300 hover:bg-[#2A2A2A] hover:text-[#F5C518]">
              My Watchlist
            </router-link>
            <div class="border-t border-gray-700"></div>
            <button @click="handleSignOut" class="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-[#2A2A2A] hover:text-white">
              Sign Out
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- ================= MOBILE SEARCH OVERLAY ================= -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="-translate-y-4 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-4 opacity-0"
    >
      <div v-if="isMobileSearchOpen" class="md:hidden absolute top-16 left-0 w-full bg-[#1D1D1D] border-b border-gray-700 p-4 shadow-xl z-40">
        <div class="relative">
          <input
            v-model="searchQuery"
            ref="mobileInput"
            type="text"
            class="w-full bg-[#2A2A2A] text-white rounded-lg pl-4 pr-10 py-3 focus:ring-1 focus:ring-[#F5C518] focus:outline-none"
            placeholder="Search titles..."
            @keydown.enter="handleSearch"
          />
          <button @click="handleSearch" class="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#F5C518]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
        </div>
      </div>
    </transition>

    <!-- ================= MOBILE MENU SIDEBAR (TELEPORTED) ================= -->
    <teleport to="body">
      <transition
        enter-active-class="transition-opacity duration-300 linear"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-300 linear"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="isMenuOpen" class="fixed inset-0 z-[9999]" @click="closeMenu">
          
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

          <!-- Sidebar -->
          <div 
            class="absolute left-0 top-0 bottom-0 w-[280px] bg-[#121212] shadow-2xl flex flex-col transform transition-transform duration-300 ease-out border-r border-gray-800"
            :class="isMenuOpen ? 'translate-x-0' : '-translate-x-full'"
            @click.stop
          >
            <!-- Sidebar Header: Dynamic User State -->
            <div class="p-6 border-b border-gray-800 flex items-center justify-between bg-[#1D1D1D]">
               <div class="flex items-center gap-3">
                 <div class="w-10 h-10 rounded-full overflow-hidden border border-[#F5C518] bg-gray-800">
                   <img v-if="isLoggedIn" src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" class="w-full h-full object-cover"/>
                   <div v-else class="w-full h-full flex items-center justify-center text-[#F5C518]">
                     <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                   </div>
                 </div>
                 <div>
                   <p class="text-white font-bold text-sm">{{ isLoggedIn ? 'Guest User' : 'Not Logged In' }}</p>
                   <p v-if="isLoggedIn" class="text-[#F5C518] text-xs">Free Plan</p>
                   <router-link v-else to="/login" @click="closeMenu" class="text-[#F5C518] text-xs hover:underline">Tap to Sign In</router-link>
                 </div>
               </div>
               <button @click="closeMenu" class="text-gray-400 hover:text-white transition">
                 <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>

            <!-- Sidebar Links -->
            <nav class="flex-1 overflow-y-auto py-4">
              <ul class="space-y-1 px-3">
                <li v-for="link in navLinks" :key="link.path">
                  <router-link
                    :to="link.path"
                    @click="closeMenu"
                    class="flex items-center gap-4 px-4 py-3.5 rounded-lg text-gray-400 hover:bg-[#2A2A2A] hover:text-white transition-all group"
                    active-class="bg-[#2A2A2A] text-white !font-bold"
                  >
                    <span class="w-1 h-5 rounded-full bg-gray-700 group-hover:bg-[#F5C518] transition-colors" :class="{ '!bg-[#F5C518]': isActive(link.path) }"></span>
                    {{ link.name }}
                  </router-link>
                </li>
              </ul>
              
              <div class="my-4 border-t border-gray-800 mx-6"></div>
              
              <div class="px-6 text-sm text-gray-500 font-medium space-y-4">
                <router-link to="/contact" @click="closeMenu" class="block hover:text-white">Contact & Support</router-link>
                <a href="#" class="block hover:text-white">Settings</a>
                
                <!-- Dynamic Sign Out / Sign In -->
                <button v-if="isLoggedIn" @click="handleSignOut" class="block hover:text-white w-full text-left">Sign Out</button>
                <router-link v-else to="/login" @click="closeMenu" class="block text-[#F5C518] hover:text-white">Sign In</router-link>
              </div>
            </nav>

            <!-- Sidebar Footer -->
            <div class="p-4 bg-[#1D1D1D] border-t border-gray-800">
              <button class="w-full bg-[#F5C518] hover:bg-[#d4a910] text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.516L20.297 19H3.703L12 5.516z"/></svg>
                Upgrade to VIP
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// ================= STATE =================
const isScrolled = ref(false)
const isMenuOpen = ref(false)
const isMobileSearchOpen = ref(false)
const searchQuery = ref('')
const mobileInput = ref(null)

// Simulation: Set to 'false' to see the Guest/Sign In view
const isLoggedIn = ref(true)

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Movies', path: '/movies' },
  { name: 'TV Shows', path: '/tv-shows' },
  { name: 'New & Popular', path: '/new-popular' },
  { name: 'My List', path: '/my-list' },
]

// ================= COMPUTED =================
const headerClasses = computed(() => {
  return isScrolled.value
    ? 'bg-[#1D1D1D]/95 backdrop-blur-xl shadow-lg shadow-black/50 py-0'
    : 'bg-gradient-to-b from-[#121212] via-[#121212]/80 to-transparent py-2'
})

const isActive = (path) => route.path === path

// ================= METHODS =================
const openMenu = () => {
  isMenuOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeMenu = () => {
  isMenuOpen.value = false
  document.body.style.overflow = ''
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value } })
    isMobileSearchOpen.value = false
  }
}

const handleSignOut = () => {
  // 1. Logic to clear token/state would go here
  isLoggedIn.value = false
  closeMenu()
  // 2. Redirect to Login
  router.push('/login')
}

// ================= WATCHERS & LIFECYCLE =================
const handleScroll = () => {
  requestAnimationFrame(() => {
    isScrolled.value = window.scrollY > 10
  })
}

watch(isMobileSearchOpen, (isOpen) => {
  if (isOpen) {
    nextTick(() => mobileInput.value?.focus())
  }
})

let debounceTimer = null
watch(searchQuery, (newVal) => {
  clearTimeout(debounceTimer)
  if (newVal.trim().length > 2) {
    debounceTimer = setTimeout(() => {
      router.replace({ path: '/search', query: { q: newVal } })
    }, 600)
  }
})

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
header {
  -webkit-font-smoothing: antialiased;
}
</style>