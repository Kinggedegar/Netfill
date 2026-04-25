<template>
  <div :class="isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'" class="relative w-full font-sans selection:bg-red-500 selection:text-white overflow-x-hidden">
    
    <!-- LOADING -->
    <div v-if="loading" class="fixed inset-0 z-50 flex items-center justify-center" :class="isDarkMode ? 'bg-black' : 'bg-white'">
      <div class="animate-pulse flex flex-col items-center gap-4">
        <div class="h-12 w-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'" class="text-sm font-semibold tracking-widest">LOADING MOVIES</p>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <div v-else class="relative animate-fade-in">
      
      <!-- Floating Premium Badge (Non-Admin Only) -->
      <div v-if="!isAdmin && isLoggedIn" class="fixed bottom-8 right-8 z-40 animate-bounce">
        <button
          @click="showPaymentModal = true"
          class="group relative flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-5 py-3 rounded-full font-bold shadow-2xl transition-all transform hover:scale-110 hover:shadow-red-500/50"
        >
          <svg class="w-5 h-5 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"></path>
          </svg>
          <span>Go Premium</span>
          <div class="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">
            Save 20%
          </div>
        </button>
        <div class="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-700 rounded-full blur opacity-20 group-hover:opacity-30 transition -z-10"></div>
      </div>

      <!-- Admin Dashboard Quick Link (Admin Only) -->
      <router-link 
        v-if="isAdmin"
        to="/admin"
        class="fixed bottom-8 right-8 z-40 flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-5 py-3 rounded-full font-bold shadow-2xl transition-all transform hover:scale-110 hover:shadow-red-500/50 animate-pulse"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 17v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clip-rule="evenodd"></path>
        </svg>
        <span>Dashboard</span>
      </router-link>
      
      <!-- HERO SECTION -->
      <section v-if="heroMovie" class="relative w-full h-[50vh] md:h-[85vh] overflow-hidden group/hero">
        
        <!-- Background -->
        <div class="absolute inset-0 w-full h-full">
          <img
            :src="heroMovie.backdrop_path ? `https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}` : 'https://via.placeholder.com/1920x1080?text=No+Image'"
            class="absolute inset-0 w-full h-full object-cover object-top"
          />

          <!-- Gradients -->
          <div :class="isDarkMode ? 'from-black/50 to-black' : 'from-white/50 to-white'" class="absolute inset-0 bg-gradient-to-b via-transparent z-10"></div>
          <div :class="isDarkMode ? 'from-black via-black/10 to-transparent' : 'from-white via-white/10 to-transparent'" class="absolute inset-0 bg-gradient-to-r z-10"></div>
          <div :class="isDarkMode ? 'from-black' : 'from-white'" class="absolute bottom-0 inset-x-0 h-24 md:h-40 bg-gradient-to-t to-transparent z-10"></div>
        </div>

        <!-- Hero Content -->
        <div class="absolute bottom-0 left-0 z-20 w-full px-4 md:px-12 lg:px-16 pb-16 md:pb-32 flex flex-col items-start gap-3 md:gap-6">
          
          <!-- Title -->
          <h1 class="text-3xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none drop-shadow-2xl max-w-4xl animate-slide-up" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
            {{ heroMovie.title || heroMovie.name }}
          </h1>

          <!-- Meta -->
          <div class="flex items-center gap-3 text-xs md:text-sm font-semibold tracking-wide animate-slide-up" style="animation-delay: 100ms;">
            <span class="text-green-500 font-bold">{{ Math.round(heroMovie.vote_average * 10) }}% Match</span>
            <span :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">{{ heroMovie.release_date?.split('-')[0] || '2025' }}</span>
            <span :class="isDarkMode ? 'border-gray-500 text-gray-300' : 'border-gray-400 text-gray-600'" class="border rounded px-1.5 py-0.5 text-[10px] md:text-xs uppercase">HD</span>
          </div>

          <!-- Description -->
          <p :class="isDarkMode ? 'text-gray-200' : 'text-gray-700'" class="text-sm md:text-lg line-clamp-2 md:line-clamp-3 max-w-xl drop-shadow-md animate-slide-up font-medium hidden sm:block" style="animation-delay: 200ms;">
            {{ heroMovie.overview }}
          </p>

          <!-- Buttons -->
          <div class="flex items-center gap-2 md:gap-3 mt-2 animate-slide-up w-full md:w-auto" style="animation-delay: 300ms;">
            <!-- Play -->
            <button
              @click="openPlayer(heroMovie)"
              class="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 md:px-8 md:py-3 rounded font-bold text-sm md:text-lg transition-all transform hover:scale-105"
            >
              <svg class="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              Play
            </button>
            
            <!-- More Info -->
            <button
              @click="openModal(heroMovie)"
              :class="isDarkMode ? 'bg-gray-600/60 hover:bg-gray-600/80' : 'bg-gray-400/60 hover:bg-gray-400/80'"
              class="flex-1 md:flex-none flex items-center justify-center gap-2 backdrop-blur-md text-white px-4 py-2 md:px-8 md:py-3 rounded font-bold text-sm md:text-lg transition-all transform hover:scale-105"
            >
              <svg class="w-5 h-5 md:w-7 md:h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              More Info
            </button>

            <!-- Add to List -->
            <button 
              @click="toggleHeroWatchlist"
              class="w-10 h-10 md:w-[52px] md:h-[52px] flex-shrink-0 flex items-center justify-center rounded-full border-2 transition-all transform hover:scale-105 backdrop-blur-md"
              :class="isHeroInWatchlist ? 'border-green-500 text-green-500 bg-black/40' : isDarkMode ? 'border-gray-400 text-white bg-gray-500/30 hover:border-white' : 'border-gray-500 text-gray-700 bg-white/30 hover:border-gray-700'"
            >
              <svg v-if="isHeroInWatchlist" class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
              <svg v-else class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            </button>
          </div>
        </div>
      </section>

      <!-- ROWS SECTION -->
      <div :class="isDarkMode ? 'bg-black' : 'bg-white'" class="relative z-20 pb-20 space-y-8 md:space-y-12 px-4 md:px-12 lg:px-16 -mt-16 md:-mt-32">
        <section v-for="(section, index) in sections" :key="index" class="group/section relative">
          
          <h2 :class="isDarkMode ? 'text-gray-100 group-hover/section:text-red-500' : 'text-gray-900 group-hover/section:text-red-600'" class="text-lg md:text-2xl font-bold mb-2 md:mb-3 px-1 transition-colors">
            {{ section.title }}
          </h2>

          <div v-if="section.items.length === 0" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="text-center py-8">
            No movies available
          </div>

          <div v-else class="relative group/carousel">
            <!-- Left Arrow -->
            <button @click="scrollRow(index, 'left')" :class="isDarkMode ? 'bg-black/50 hover:bg-black/70' : 'bg-white/50 hover:bg-white/70'" class="hidden md:flex absolute left-0 top-0 bottom-0 z-40 w-12 items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all rounded-r-md">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7" /></svg>
            </button>

            <!-- Slider -->
            <div :ref="el => sliderRefs[index] = el" class="flex gap-3 md:gap-4 overflow-x-auto overflow-y-hidden pb-4 scrollbar-hide scroll-smooth">
              <div
                v-for="item in section.items"
                :key="item.id"
                @click="openModal(item)"
                class="flex-none w-[110px] md:w-[200px] transition-all duration-300 hover:scale-105 hover:z-30 cursor-pointer group/card"
              >
                <div :class="isDarkMode ? 'bg-gray-800' : 'bg-gray-200'" class="relative aspect-[2/3] rounded shadow-xl overflow-hidden">
                  <img
                    :src="item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Poster'"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <!-- HD Badge -->
                  <div :class="isDarkMode ? 'bg-black/60 border-white/30' : 'bg-white/60 border-gray-400/30'" class="absolute top-2 right-2 backdrop-blur-md border text-white text-[9px] font-bold px-1.5 py-0.5 rounded">HD</div>
                </div>
                
                <!-- Title -->
                <div class="mt-2 px-1">
                   <h3 :class="isDarkMode ? 'text-white' : 'text-gray-900'" class="text-[10px] md:text-sm font-bold truncate">{{ item.title || item.name }}</h3>
                </div>
              </div>
            </div>

            <!-- Right Arrow -->
            <button @click="scrollRow(index, 'right')" :class="isDarkMode ? 'bg-black/50 hover:bg-black/70' : 'bg-white/50 hover:bg-white/70'" class="hidden md:flex absolute right-0 top-0 bottom-0 z-40 w-12 items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all rounded-l-md">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </section>
      </div>
    </div>

    <!-- MODALS -->
    <teleport to="body">
      <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <MovieModal v-if="selectedMovie" :movie="selectedMovie" @close="selectedMovie = null" />
      </transition>
    </teleport>

    <teleport to="body">
      <VideoPlayer 
        v-if="showPlayer && playerMovie" 
        :movie="playerMovie"
        @close="showPlayer = false"
      />
    </teleport>

    <teleport to="body">
      <PaymentModal
        :is-open="showPaymentModal"
        @close="showPaymentModal = false"
      />
    </teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MovieModal from '@/components/MovieModal.vue'
import VideoPlayer from '@/components/VideoPlayer.vue'
import PaymentModal from '@/components/PaymentModal.vue'
import { TMDBAPI } from '@/services/backend-api'

const router = useRouter()
const sliderRefs = ref([])
const loading = ref(true)

// Theme
const isDarkMode = computed(() => {
  const theme = localStorage.getItem('theme') || 'dark'
  if (theme === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return theme !== 'light'
})

// Hero State
const heroMovie = ref(null)
const isHeroInWatchlist = ref(false)

// Player/Modal State
const selectedMovie = ref(null)
const showPlayer = ref(false)
const playerMovie = ref(null)
const showPaymentModal = ref(false)

// Rows Config
const sections = ref([
  { title: 'Trending This Week', items: [] },
  { title: 'Popular Movies', items: [] },
  { title: 'Top Rated Movies', items: [] },
  { title: 'Trending TV Shows', items: [] },
  { title: 'Popular TV Shows', items: [] },
  { title: 'Top Rated TV Shows', items: [] },
])

const isLoggedIn = computed(() => localStorage.getItem('isLoggedIn') === 'true')

const isAdmin = computed(() => {
  const userRole = localStorage.getItem('userRole')
  if (userRole) return userRole === 'admin'
  
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  return user.role === 'admin'
})

const userName = computed(() => localStorage.getItem('userName') || 'User')

const movieCount = ref(0)
const userCount = ref(250)

// --- ACTIONS ---

const openModal = (item) => {
  selectedMovie.value = item
}

const openPlayer = (item) => {
  if (!isLoggedIn.value) {
    router.push('/signin')
    return
  }
  playerMovie.value = item
  showPlayer.value = true
}

const toggleHeroWatchlist = () => {
  if (!heroMovie.value) return
  let watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]')
  
  if (isHeroInWatchlist.value) {
    watchlist = watchlist.filter(i => i.id !== heroMovie.value.id)
    isHeroInWatchlist.value = false
  } else {
    watchlist.push(heroMovie.value)
    isHeroInWatchlist.value = true
  }
  localStorage.setItem('watchlist', JSON.stringify(watchlist))
}

const scrollRow = (index, direction) => {
  const slider = sliderRefs.value[index]
  if (slider) {
    const amount = window.innerWidth * 0.75
    slider.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
  }
}

// --- DATA FETCHING ---
const SAMPLE_MOVIES = [
  { id: 1, title: 'Inception', name: 'Inception', overview: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.', poster_path: '/9gk7adHYeDMPS6QcYxNQWeSK0yQ.jpg', backdrop_path: '/s3TBrLgO2YKsV44q88TXY5VRv9i.jpg', vote_average: 8.8, release_date: '2010-07-16', media_type: 'movie' },
  { id: 2, title: 'The Dark Knight', name: 'The Dark Knight', overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological tests.', poster_path: '/qJ2tW6WMUDux911r6m7haI0xvwi.jpg', backdrop_path: '/l8sR2m5OKWuR4KzMVsFnqDzhkhu.jpg', vote_average: 9.0, release_date: '2008-07-18', media_type: 'movie' },
  { id: 3, title: 'Interstellar', name: 'Interstellar', overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival.', poster_path: '/gEU2QniE6E77NI6lCu244gwTeDd.jpg', backdrop_path: '/xu9zaAevzQ4GGf6hPFgsIlNln1.jpg', vote_average: 8.6, release_date: '2014-11-07', media_type: 'movie' },
  { id: 4, title: 'Avatar', name: 'Avatar', overview: 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders.', poster_path: '/jRXYjXNq0Cs2aecAy4ceqENZ2eg.jpg', backdrop_path: '/4d7PerspZF0XdMXRyVeFbw8r3w9.jpg', vote_average: 7.8, release_date: '2009-12-18', media_type: 'movie' },
  { id: 5, title: 'Shutter Island', name: 'Shutter Island', overview: 'Two detectives, one FBI, one Boston police, arrive at a hospital on Shutter Island to investigate.', poster_path: '/zr3tPCCfDdlgXQqMJVVYJxVy1l0.jpg', backdrop_path: '/2MdwVppVwPyVKk4CKDsvSRzfG4x.jpg', vote_average: 8.2, release_date: '2010-02-19', media_type: 'movie' },
  { id: 6, title: 'The Matrix', name: 'The Matrix', overview: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.', poster_path: '/vIqmV0Ym4p4gNQMfXLn9CKaIYYa.jpg', backdrop_path: '/xAKMj8MTvfbhnrllqx5vHHADFkV.jpg', vote_average: 8.7, release_date: '1999-03-31', media_type: 'movie' },
  { id: 7, title: 'The Prestige', name: 'The Prestige', overview: 'After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion.', poster_path: '/mXLOHHW92Zp0ZSzkSdH91Yq8At9.jpg', backdrop_path: '/dMXKKEkC3yApDx7hoxEBZt8aEKO.jpg', vote_average: 8.5, release_date: '2006-10-17', media_type: 'movie' },
  { id: 8, title: 'Muriel\'s Wedding', name: 'Muriel\'s Wedding', overview: 'A young woman, recently released from a mental hospital, gets a fresh start in Sydney.', poster_path: '/anHwj8IeF8nDy0UCM0gDL6nvAT7.jpg', backdrop_path: '/xfxzQMVGsirGwBNJB8snL4YJTT6.jpg', vote_average: 7.1, release_date: '1994-04-14', media_type: 'movie' },
]

onMounted(async () => {
  try {
    const [trending, popular, topRated, tvTrending, tvPopular, tvTopRated] = await Promise.all([
      TMDBAPI.fetchTrending(),
      TMDBAPI.getPopularMovies(),
      TMDBAPI.getTopRatedMovies(),
      TMDBAPI.getTVTrending(),
      TMDBAPI.getPopularTV(),
      TMDBAPI.getTopRatedTV()
    ])

    sections.value[0].items = trending.results?.length > 0 ? trending.results : SAMPLE_MOVIES
    sections.value[1].items = popular.results?.length > 0 ? popular.results : SAMPLE_MOVIES
    sections.value[2].items = topRated.results?.length > 0 ? topRated.results : SAMPLE_MOVIES
    sections.value[3].items = tvTrending.results?.length > 0 ? tvTrending.results : SAMPLE_MOVIES
    sections.value[4].items = tvPopular.results?.length > 0 ? tvPopular.results : SAMPLE_MOVIES
    sections.value[5].items = tvTopRated.results?.length > 0 ? tvTopRated.results : SAMPLE_MOVIES

    if (sections.value[0].items.length > 0) {
      const candidates = sections.value[0].items.filter(m => m.backdrop_path && m.media_type !== 'person')
      heroMovie.value = candidates.length > 0 ? candidates[0] : sections.value[0].items[0]
      const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]')
      isHeroInWatchlist.value = watchlist.some(i => i.id === heroMovie.value.id)
    }
    
  } catch (e) {
    console.error("Home Load Error:", e)
    // Use sample movies if API fails
    sections.value.forEach(section => {
      section.items = SAMPLE_MOVIES
    })
    if (SAMPLE_MOVIES.length > 0) {
      heroMovie.value = SAMPLE_MOVIES[0]
    }
  } finally {
    loading.value = false
    // Calculate total movies for admin dashboard
    movieCount.value = sections.value.reduce((total, section) => total + section.items.length, 0)
  }
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.animate-fade-in { animation: fadeIn 0.8s ease-out; }
.animate-slide-up { animation: slideUp 0.8s ease-out backwards; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>