<template>
  <div class="relative min-h-screen bg-[#141414] text-white font-sans selection:bg-yellow-500 selection:text-black overflow-x-hidden">
    
    <!-- LOADING -->
    <div v-if="loading" class="fixed inset-0 z-50 flex items-center justify-center bg-[#141414]">
      <div class="animate-pulse flex flex-col items-center gap-4">
        <div class="h-12 w-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-gray-500 text-sm font-semibold tracking-widest">LOADING CINEMA</p>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <div v-else class="relative animate-fade-in">
      
      <!-- HERO SECTION -->
      <section v-if="heroMovie" class="relative w-full h-[65vh] md:h-[95vh] overflow-hidden group/hero">
        
        <!-- Background -->
        <div class="absolute inset-0 w-full h-full">
          <transition enter-active-class="transition duration-1000 ease-in" enter-from-class="opacity-0" leave-active-class="transition duration-500" leave-to-class="opacity-0">
            <div v-if="showTrailer && trailerKey" class="absolute inset-0 w-full h-full z-0 pointer-events-none scale-[1.35] hidden md:block">
              <iframe
                :src="`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`"
                class="w-full h-full aspect-video"
                frameborder="0"
                allow="autoplay; encrypted-media"
                style="pointer-events: none;"
              ></iframe>
            </div>
          </transition>

          <img
            v-show="!showTrailer || !trailerKey"
            :src="`https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`"
            class="absolute inset-0 w-full h-full object-cover object-top opacity-100"
          />

          <!-- Gradients -->
          <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#141414] z-10"></div>
          <div class="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/10 to-transparent z-10"></div>
          <div class="absolute bottom-0 inset-x-0 h-24 md:h-40 bg-gradient-to-t from-[#141414] to-transparent z-10"></div>
        </div>

        <!-- Hero Content (Fixed Responsiveness) -->
        <div class="absolute bottom-0 left-0 z-20 w-full px-4 md:px-12 lg:px-16 pb-16 md:pb-32 flex flex-col items-start gap-3 md:gap-6">
          
          <!-- Title -->
          <h1 class="text-3xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none text-white drop-shadow-2xl max-w-4xl animate-slide-up">
            {{ heroMovie.title || heroMovie.name }}
          </h1>

          <!-- Meta -->
          <div class="flex items-center gap-3 text-xs md:text-sm font-semibold tracking-wide animate-slide-up" style="animation-delay: 100ms;">
            <span class="text-[#46d369] font-bold">{{ (heroMovie.vote_average * 10).toFixed(0) }}% Match</span>
            <span class="text-gray-300">{{ heroMovie.release_date?.split('-')[0] || '2025' }}</span>
            <span class="border border-gray-500 rounded px-1.5 py-0.5 text-[10px] md:text-xs text-gray-300 uppercase">HD</span>
          </div>

          <!-- Description (Hidden on very small screens, visible on md+) -->
          <p class="text-gray-200 text-sm md:text-lg line-clamp-2 md:line-clamp-3 max-w-xl drop-shadow-md animate-slide-up font-medium hidden sm:block" style="animation-delay: 200ms;">
            {{ heroMovie.overview }}
          </p>

          <!-- Responsive Buttons -->
          <div class="flex items-center gap-2 md:gap-3 mt-2 animate-slide-up w-full md:w-auto" style="animation-delay: 300ms;">
            <!-- Play -->
            <button
              @click="openPlayer(heroMovie, 'full')"
              class="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 px-4 py-2 md:px-8 md:py-3 rounded font-bold text-sm md:text-lg transition-all transform hover:scale-105"
            >
              <svg class="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              Play
            </button>
            
            <!-- More Info -->
            <button
              @click="openModal(heroMovie)"
              class="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-600/60 hover:bg-gray-600/80 backdrop-blur-md text-white px-4 py-2 md:px-8 md:py-3 rounded font-bold text-sm md:text-lg transition-all transform hover:scale-105"
            >
              <svg class="w-5 h-5 md:w-7 md:h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              More Info
            </button>

            <!-- Add to List -->
            <button 
              @click="toggleHeroWatchlist"
              class="w-10 h-10 md:w-[52px] md:h-[52px] flex-shrink-0 flex items-center justify-center rounded-full border-2 transition-all transform hover:scale-105 backdrop-blur-md"
              :class="isHeroInWatchlist ? 'border-green-500 text-green-500 bg-black/40' : 'border-gray-400 text-white bg-gray-500/30 hover:border-white'"
            >
              <svg v-if="isHeroInWatchlist" class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
              <svg v-else class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            </button>
          </div>
        </div>
      </section>

      <!-- ROWS SECTION -->
      <div class="relative z-20 pb-20 space-y-8 md:space-y-12 px-4 md:px-12 lg:px-16 -mt-16 md:-mt-32">
        <section v-for="(section, index) in sections" :key="index" class="group/section relative">
          
          <h2 class="text-lg md:text-2xl font-bold text-gray-100 mb-2 md:mb-3 px-1 group-hover/section:text-yellow-500 transition-colors">
            {{ section.title }}
          </h2>

          <div class="relative group/carousel">
            <!-- Left Arrow -->
            <button @click="scrollRow(index, 'left')" class="hidden md:flex absolute left-0 top-0 bottom-0 z-40 w-12 bg-black/50 hover:bg-black/70 items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all rounded-r-md">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7" /></svg>
            </button>

            <!-- Slider -->
            <div ref="sliderRefs" class="flex gap-3 md:gap-4 overflow-x-auto overflow-y-hidden pb-4 scrollbar-hide scroll-smooth">
              <div
                v-for="item in section.items"
                :key="item.id"
                @click="openModal(item)"
                class="flex-none w-[110px] md:w-[200px] transition-all duration-300 hover:scale-105 hover:z-30 cursor-pointer group/card"
              >
                <div class="relative aspect-[2/3] rounded bg-gray-800 shadow-xl overflow-hidden">
                  <img
                    :src="item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Poster'"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <!-- HD Badge -->
                  <div class="absolute top-2 right-2 bg-black/60 backdrop-blur-md border border-white/30 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">HD</div>
                </div>
                
                <!-- Title (Mobile Optimization) -->
                <div class="mt-2 px-1">
                   <h3 class="text-white text-[10px] md:text-sm font-bold truncate">{{ item.title || item.name }}</h3>
                </div>
              </div>
            </div>

            <!-- Right Arrow -->
            <button @click="scrollRow(index, 'right')" class="hidden md:flex absolute right-0 top-0 bottom-0 z-40 w-12 bg-black/50 hover:bg-black/70 items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all rounded-l-md">
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
        :initialMode="playerMode"
        @close="showPlayer = false"
      />
    </teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MovieModal from '@/components/MovieModal.vue'
import VideoPlayer from '@/components/VideoPlayer.vue'
import { MovieAPI, GENRES } from '@/services/api'

const router = useRouter()
const sliderRefs = ref([])
const loading = ref(true)

// Hero State
const heroMovie = ref(null)
const trailerKey = ref(null)
const showTrailer = ref(false)
const isHeroInWatchlist = ref(false)

// Player/Modal State
const selectedMovie = ref(null)
const showPlayer = ref(false)
const playerMovie = ref(null)
const playerMode = ref('full')

// Rows Config
const sections = ref([
  { title: 'Trending Movies', items: [] },
  { title: 'Popular TV Series', items: [] },
  { title: 'Action Movies', items: [] },
  { title: 'Sci-Fi & Fantasy', items: [] },
  { title: 'Comedy', items: [] },
  { title: 'Drama', items: [] },
])

const isLoggedIn = computed(() => localStorage.getItem('isLoggedIn') === 'true')

// --- ACTIONS ---

const openModal = (item) => {
  selectedMovie.value = item
}

const openPlayer = (item, mode) => {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }
  playerMovie.value = item
  playerMode.value = mode
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
const fetchTrailer = async (movieId) => {
  try {
    const videos = await MovieAPI.getMovieVideos(movieId)
    const trailer = videos.find(v => v.type === 'Trailer') || videos[0]
    if (trailer) {
      trailerKey.value = trailer.key
      setTimeout(() => { showTrailer.value = true }, 3000)
    }
  } catch (e) { console.error(e) }
}

onMounted(async () => {
  try {
    const [trending, tvPopular, action, scifiTv, comedy, drama] = await Promise.all([
      MovieAPI.fetchTrending(),
      MovieAPI.getTVShows(),
      MovieAPI.getMoviesByGenre(GENRES.ACTION),
      MovieAPI.getTVByGenre(GENRES.SCI_FI_FANTASY),
      MovieAPI.getMoviesByGenre(GENRES.COMEDY),
      MovieAPI.getMoviesByGenre(GENRES.DRAMA)
    ])

    sections.value[0].items = trending.results || []
    sections.value[1].items = tvPopular.results || []
    sections.value[2].items = action.results || []
    sections.value[3].items = scifiTv.results || []
    sections.value[4].items = comedy.results || []
    sections.value[5].items = drama.results || []

    if (sections.value[0].items.length > 0) {
      const candidates = sections.value[0].items.filter(m => m.backdrop_path && !m.adult)
      heroMovie.value = candidates.length > 0 ? candidates[0] : sections.value[0].items[0]
      const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]')
      isHeroInWatchlist.value = watchlist.some(i => i.id === heroMovie.value.id)
      await fetchTrailer(heroMovie.value.id)
    }
    
  } catch (e) {
    console.error("Home Load Error:", e)
  } finally {
    loading.value = false
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