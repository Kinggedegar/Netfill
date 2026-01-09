<template>
  <div class="min-h-screen bg-[#141414] text-white font-sans pb-20">
    
    <!-- LOADING STATE -->
    <div v-if="loading" class="fixed inset-0 flex items-center justify-center bg-[#141414] z-50">
      <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500"></div>
    </div>

    <!-- MAIN CONTENT -->
    <div v-else-if="movie" class="relative animate-fade-in">
      
      <!-- HERO SECTION -->
      <div class="relative w-full h-[70vh] md:h-[85vh]">
        <!-- Backdrop Image -->
        <div class="absolute inset-0">
          <img 
            :src="`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`"
            class="w-full h-full object-cover object-top"
          />
          <!-- Gradients -->
          <div class="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/50 to-transparent"></div>
          <div class="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/80 to-transparent"></div>
        </div>

        <!-- Content Overlay -->
        <div class="absolute bottom-0 left-0 w-full px-4 md:px-12 lg:px-16 pb-12 flex flex-col md:flex-row gap-6 md:gap-12 items-end">
          
          <!-- Poster (Hidden on mobile, visible on tablet+) -->
          <div class="hidden md:block w-56 lg:w-64 shadow-2xl rounded-lg overflow-hidden border border-white/10 transform rotate-1 flex-shrink-0">
            <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" class="w-full" />
          </div>

          <!-- Text Info -->
          <div class="flex-1 space-y-4 md:space-y-6 max-w-4xl">
            <h1 class="text-3xl md:text-5xl lg:text-6xl font-black leading-tight drop-shadow-lg">
              {{ movie.title || movie.name }}
            </h1>

            <!-- Meta Tags -->
            <div class="flex flex-wrap items-center gap-3 text-xs md:text-sm font-semibold text-gray-300">
              <span class="text-green-500 font-bold text-base">
                {{ Math.round(movie.vote_average * 10) }}% Match
              </span>
              <span>{{ (movie.release_date || movie.first_air_date || '').split('-')[0] }}</span>
              <span class="border border-gray-500 px-1.5 rounded text-[10px] md:text-xs">HD</span>
              <span v-if="movie.runtime">{{ formatRuntime(movie.runtime) }}</span>
              <span v-if="movie.number_of_seasons">{{ movie.number_of_seasons }} Seasons</span>
            </div>

            <!-- Genre Badges -->
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="genre in movie.genres" 
                :key="genre.id"
                class="text-[10px] md:text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition cursor-pointer"
              >
                {{ genre.name }}
              </span>
            </div>

            <!-- Overview -->
            <p class="text-gray-200 text-sm md:text-lg leading-relaxed line-clamp-4 max-w-2xl text-shadow">
              {{ movie.overview }}
            </p>

            <!-- Action Buttons -->
            <div class="flex items-center gap-2 md:gap-4 pt-2">
              <button 
                @click="playMovie('full')"
                class="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 px-6 py-2.5 md:px-8 md:py-3 rounded font-bold text-sm md:text-lg transition transform hover:scale-105"
              >
                <svg class="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                Play
              </button>

              <button 
                @click="playMovie('trailer')"
                class="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-600/60 hover:bg-gray-600/80 backdrop-blur text-white px-6 py-2.5 md:px-8 md:py-3 rounded font-bold text-sm md:text-lg transition"
              >
                Trailer
              </button>

              <button 
                @click="toggleWatchlist"
                class="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-full border-2 border-gray-400 hover:border-white flex items-center justify-center transition bg-black/20 backdrop-blur"
                :title="isInWatchlist ? 'Remove from List' : 'Add to List'"
              >
                <svg v-if="isInWatchlist" class="w-5 h-5 md:w-6 md:h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                <svg v-else class="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- DETAILS GRID SECTION -->
      <section class="px-4 md:px-12 lg:px-16 py-12 max-w-[1920px] mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <!-- LEFT COLUMN (2/3 width): Cast & Similar -->
          <div class="lg:col-span-2 space-y-12">
            
            <!-- Cast Section -->
            <div v-if="cast.length > 0">
              <h3 class="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2 border-l-4 border-yellow-500 pl-3">
                Top Cast
              </h3>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <div 
                  v-for="actor in cast.slice(0, 8)" 
                  :key="actor.id" 
                  class="bg-[#1f1f1f] rounded-lg p-3 flex items-center gap-3 hover:bg-[#2a2a2a] transition cursor-pointer"
                >
                  <img 
                    :src="actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : 'https://via.placeholder.com/100?text=User'" 
                    class="w-12 h-12 rounded-full object-cover border border-gray-600"
                  />
                  <div class="overflow-hidden">
                    <p class="font-bold text-sm text-white truncate">{{ actor.name }}</p>
                    <p class="text-xs text-gray-400 truncate">{{ actor.character }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Similar Movies Section -->
            <div v-if="similar.length > 0">
              <h3 class="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2 border-l-4 border-green-500 pl-3">
                More Like This
              </h3>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
                <div 
                  v-for="item in similar.slice(0, 6)" 
                  :key="item.id"
                  @click="goToMovie(item.id)"
                  class="cursor-pointer group relative aspect-video rounded-lg overflow-hidden bg-gray-800 shadow-lg hover:ring-2 hover:ring-white transition"
                >
                  <img 
                    :src="item.backdrop_path ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}` : item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x281'"
                    class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-300" 
                  />
                  <!-- Hover Play Button -->
                  <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40">
                    <div class="rounded-full border-2 border-white p-2 bg-black/50 backdrop-blur">
                      <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                  <!-- Title Overlay -->
                  <div class="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black to-transparent">
                    <p class="text-xs font-bold text-white truncate">{{ item.title || item.name }}</p>
                    <p class="text-[10px] text-gray-400">{{ (item.vote_average * 10).toFixed(0) }}% Match</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN (1/3 width): Info Sidebar -->
          <div class="space-y-6">
            <div class="bg-[#1f1f1f] p-6 rounded-xl border border-white/5 shadow-xl">
              <h3 class="text-gray-400 uppercase text-xs font-bold tracking-wider mb-4">About this Title</h3>
              
              <dl class="space-y-4 text-sm divide-y divide-gray-700">
                <div class="pt-2">
                  <dt class="text-gray-500 mb-1">Original Title</dt>
                  <dd class="text-white font-medium">{{ movie.original_title || movie.original_name }}</dd>
                </div>
                
                <div class="pt-2" v-if="movie.status">
                  <dt class="text-gray-500 mb-1">Status</dt>
                  <dd class="text-white font-medium">{{ movie.status }}</dd>
                </div>
                
                <div class="pt-2" v-if="movie.release_date">
                  <dt class="text-gray-500 mb-1">Release Date</dt>
                  <dd class="text-white font-medium">{{ new Date(movie.release_date).toLocaleDateString() }}</dd>
                </div>

                <div class="pt-2" v-if="movie.budget > 0">
                  <dt class="text-gray-500 mb-1">Budget</dt>
                  <dd class="text-white font-medium">${{ (movie.budget / 1000000).toFixed(1) }}M</dd>
                </div>

                <div class="pt-2" v-if="movie.revenue > 0">
                  <dt class="text-gray-500 mb-1">Revenue</dt>
                  <dd class="text-white font-medium">${{ (movie.revenue / 1000000).toFixed(1) }}M</dd>
                </div>
                
                <div class="pt-2" v-if="movie.production_companies?.length">
                  <dt class="text-gray-500 mb-1">Production</dt>
                  <dd class="text-white font-medium">
                    {{ movie.production_companies.map(c => c.name).slice(0, 2).join(', ') }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

        </div>
      </section>
    </div>

    <!-- Video Player Overlay -->
    <teleport to="body">
      <VideoPlayer 
        v-if="showPlayer" 
        :movie="movie" 
        :initialMode="playerMode" 
        @close="showPlayer = false" 
      />
    </teleport>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MovieAPI } from '@/services/api'
import VideoPlayer from '@/components/VideoPlayer.vue'

const route = useRoute()
const router = useRouter()

// State
const movie = ref(null)
const cast = ref([])
const similar = ref([])
const loading = ref(true)
const showPlayer = ref(false)
const playerMode = ref('full')

const isLoggedIn = computed(() => localStorage.getItem('isLoggedIn') === 'true')
const watchlist = ref(JSON.parse(localStorage.getItem('watchlist') || '[]'))
const isInWatchlist = computed(() => movie.value && watchlist.value.some(i => i.id === movie.value.id))

// Actions
const toggleWatchlist = () => {
  if (!isLoggedIn.value) return router.push('/login')
  if (isInWatchlist.value) {
    watchlist.value = watchlist.value.filter(i => i.id !== movie.value.id)
  } else {
    watchlist.value.push(movie.value)
  }
  localStorage.setItem('watchlist', JSON.stringify(watchlist.value))
}

const playMovie = (mode) => {
  if (!isLoggedIn.value) return router.push('/login')
  playerMode.value = mode
  showPlayer.value = true
}

const goToMovie = (id) => {
  router.push(`/movie/${id}`)
  window.scrollTo(0, 0)
}

const formatRuntime = (mins) => {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h}h ${m}m`
}

const loadData = async () => {
  loading.value = true
  const id = route.params.id
  
  try {
    // 1. Fetch Main Details
    // Note: If you support TV shows here, you might need getTVDetails based on a prop or logic
    let data = await MovieAPI.getMovieDetails(id)
    
    // 2. Fetch Credits & Similar Parallel
    const [creditsData, similarData] = await Promise.all([
      MovieAPI.getCredits(id),
      MovieAPI.getSimilarMovies(id)
    ])
    
    movie.value = data
    cast.value = creditsData.cast || []
    similar.value = similarData.results || []
    
  } catch (e) {
    console.error("Error loading movie details:", e)
    // Optional: router.replace('/not-found')
  } finally {
    loading.value = false
  }
}

watch(() => route.params.id, loadData)
onMounted(loadData)
</script>

<style scoped>
.text-shadow { text-shadow: 0 1px 3px rgba(0,0,0,0.8); }
.animate-fade-in { animation: fadeIn 0.5s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>