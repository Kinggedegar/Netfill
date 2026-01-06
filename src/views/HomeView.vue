<template>
  <div class="relative min-h-screen bg-[#121212] text-white font-sans selection:bg-[#F5C518] selection:text-black">
    
    <!-- HERO / BILLBOARD SECTION -->
    <section v-if="heroMovie" class="relative w-full h-[85vh] md:h-[95vh] overflow-hidden group">
      
      <!-- Background: Video or Image -->
      <div class="absolute inset-0 w-full h-full">
        <!-- Video Player (Active Background) -->
        <div v-if="showTrailer && trailerKey" class="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
          <iframe
            :src="`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`"
            class="w-[300%] h-[300%] -ml-[100%] -mt-[100%] opacity-60 scale-125"
            frameborder="0"
            allow="autoplay; encrypted-media"
          ></iframe>
        </div>

        <!-- Fallback Backdrop Image (Displays before video loads or if no video) -->
        <transition enter-active-class="transition duration-1000" enter-from-class="opacity-0" leave-active-class="transition duration-1000" leave-to-class="opacity-0">
          <img
            v-if="!showTrailer || !trailerKey"
            :src="`https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`"
            alt="Hero Backdrop"
            class="absolute inset-0 w-full h-full object-cover object-top opacity-70"
          />
        </transition>

        <!-- Premium Gradient Overlay (Bottom Fade) -->
        <div class="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-[#121212]/90 via-[#121212]/20 to-transparent"></div>
      </div>

      <!-- Hero Content -->
      <div class="absolute bottom-0 left-0 z-20 w-full px-4 md:px-12 lg:px-16 pb-20 md:pb-24 flex flex-col items-start gap-4 md:gap-6">
        
        <!-- Metadata Tags -->
        <div class="flex items-center gap-3 text-xs md:text-sm font-semibold tracking-wide">
          <span class="text-[#F5C518] flex items-center gap-1">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            {{ heroMovie.vote_average?.toFixed(1) || '7.5' }}
          </span>
          <span class="text-gray-300">{{ heroMovie.release_date?.split('-')[0] || '2025' }}</span>
          <span class="border border-white/30 rounded px-1.5 py-0.5 text-[10px] text-gray-300">HD</span>
          <span class="bg-[#F5C518] text-black px-1.5 py-0.5 rounded-[3px] text-[10px] font-bold">IMDb</span>
        </div>

        <!-- Title -->
        <h1 class="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none text-white drop-shadow-lg max-w-4xl">
          {{ heroMovie.title || heroMovie.name }}
        </h1>

        <!-- Overview -->
        <p class="text-gray-300 text-sm md:text-lg line-clamp-3 md:line-clamp-2 max-w-xl lg:max-w-2xl drop-shadow-md">
          {{ heroMovie.overview }}
        </p>

        <!-- Buttons -->
        <div class="flex items-center gap-4 mt-2">
          <!-- Play Button (MovieBox Yellow) -->
          <button
            @click="openModal(heroMovie)"
            class="flex items-center gap-2 bg-[#F5C518] text-black hover:bg-[#d4a000] px-8 py-3.5 rounded-full font-bold text-lg transition-transform transform hover:scale-105 shadow-lg shadow-yellow-500/20"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            Play Now
          </button>
          
          <!-- More Info (Glassmorphism) -->
          <button
            @click="openModal(heroMovie)"
            class="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-3.5 rounded-full font-bold text-lg transition-all"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            More Info
          </button>
        </div>
      </div>
    </section>

    <!-- ROWS SECTION -->
    <div class="relative z-20 -mt-16 pb-20 space-y-12 px-4 md:px-12 lg:px-16">
      <section v-for="(section, index) in sections" :key="index" class="group/section">
        <!-- Section Header -->
        <div class="flex items-center justify-between mb-4 px-2">
          <h2 class="text-xl md:text-2xl font-bold text-white border-l-4 border-[#F5C518] pl-3">
            {{ section.title }}
          </h2>
          <button class="text-xs text-[#F5C518] font-semibold hover:underline opacity-0 group-hover/section:opacity-100 transition-opacity">
            View All
          </button>
        </div>

        <!-- Carousel -->
        <div class="relative group/carousel">
          <!-- Scroll Container -->
          <div 
            class="flex gap-4 overflow-x-auto overflow-y-hidden pb-4 scrollbar-hide scroll-smooth snap-x snap-mandatory"
            style="scrollbar-width: none; -ms-overflow-style: none;"
          >
            <MovieCard
              v-for="movie in section.movies"
              :key="movie.id"
              :movie="movie"
              @select="openModal"
              class="snap-start flex-none w-[160px] md:w-[220px] transition-transform duration-300 hover:scale-105 hover:z-30 cursor-pointer"
            />
          </div>
        </div>
      </section>
    </div>

    <!-- MOVIE MODAL (Teleport) -->
    <teleport to="body">
      <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <MovieModal v-if="selectedMovie" :movie="selectedMovie" @close="selectedMovie = null" />
      </transition>
    </teleport>

  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import MovieCard from '@/components/MovieCard.vue'
import MovieModal from '@/components/MovieModal.vue'
import { MovieAPI } from '@/services/api' // Ensure your API service is correctly linked

// State
const heroMovie = ref(null)
const trailerKey = ref(null)
const showTrailer = ref(false)
const selectedMovie = ref(null)

const sections = ref([
  { title: 'Trending Now', movies: [] },
  { title: 'Top Rated Movies', movies: [] },
  { title: 'Box Office Hits', movies: [] },
  { title: 'Upcoming', movies: [] },
])

// Actions
const openModal = (movie) => {
  selectedMovie.value = movie
}

// Helper: Fetch Trailer for Hero
const fetchTrailer = async (movieId) => {
  try {
    // Assuming API has a method like getMovieVideos(id). If not, adjust accordingly.
    // Standard TMDB endpoint: /movie/{id}/videos
    const response = await MovieAPI.getMovieVideos(movieId)
    const videos = response.results || response
    
    // Find a YouTube trailer
    const officialTrailer = videos.find(v => v.site === 'YouTube' && v.type === 'Trailer')
    const anyClip = videos.find(v => v.site === 'YouTube')
    
    if (officialTrailer || anyClip) {
      trailerKey.value = (officialTrailer || anyClip).key
      // Delay playing slightly to let image load first
      setTimeout(() => { showTrailer.value = true }, 2500)
    }
  } catch (e) {
    console.warn("Could not load trailer for hero:", e)
  }
}

onMounted(async () => {
  try {
    // 1. Fetch Data in Parallel
    const [trending, topRated, popular, upcoming] = await Promise.all([
      MovieAPI.fetchTrending(),
      MovieAPI.getTopRated(),
      MovieAPI.getPopular(),
      MovieAPI.getUpcoming ? MovieAPI.getUpcoming() : MovieAPI.getPopular() // Fallback if no upcoming
    ])

    // 2. Populate Sections
    sections.value[0].movies = trending.results || trending
    sections.value[1].movies = topRated.results || topRated
    sections.value[2].movies = popular.results || popular
    sections.value[3].movies = upcoming.results || upcoming

    // 3. Set Hero Movie (First item of trending with a backdrop)
    const heroCandidate = (trending.results || trending).find(m => m.backdrop_path)
    if (heroCandidate) {
      heroMovie.value = heroCandidate
      // 4. Trigger Background Video Fetch
      await fetchTrailer(heroCandidate.id)
    }

  } catch (error) {
    console.error('Homepage Initialization Error:', error)
  }
})
</script>

<style scoped>
/* Hiding scrollbars for Chrome/Safari/Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
/* Hiding scrollbars for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

/* Enhancing Shadow Gradients */
.drop-shadow-lg {
  filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.5));
}

/* Smooth Background Image Transition */
img {
  transition: opacity 0.5s ease-in-out;
}
</style>