<template>
  <div 
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-0 md:p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-[#121212] w-full max-w-6xl rounded-none md:rounded-xl overflow-hidden shadow-2xl h-full md:h-[90vh] flex flex-col relative">
      
      <!-- ============================================= -->
      <!-- 1. ACTIVE PLAYER (Only shows when playing)    -->
      <!-- ============================================= -->
      <div v-if="isPlaying" class="absolute inset-0 z-50 bg-black flex flex-col animate-fade-in">
        <div class="flex items-center justify-between p-4 bg-[#121212]">
          <h3 class="text-white font-bold truncate">{{ movie.title || movie.name }}</h3>
          <button @click="isPlaying = false" class="text-red-500 font-bold hover:text-red-400">Close Player ✕</button>
        </div>
        <div class="flex-1 relative">
          <iframe
            v-if="videoKey"
            :src="`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&showinfo=0&modestbranding=1&controls=1`"
            class="absolute inset-0 w-full h-full"
            frameborder="0"
            allow="autoplay; encrypted-media; fullscreen"
            allowfullscreen
          ></iframe>
          <div v-else class="absolute inset-0 flex items-center justify-center text-white">
            <p>Video source unavailable</p>
          </div>
        </div>
      </div>

      <!-- ============================================= -->
      <!-- 2. DETAILS VIEW (Shows initially)             -->
      <!-- ============================================= -->
      <div v-else class="flex flex-col h-full">
        <!-- Close Button -->
        <button 
          @click="$emit('close')"
          class="absolute top-4 right-4 z-40 bg-black/60 text-white p-2 rounded-full hover:bg-[#F5C518] hover:text-black transition"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <!-- Header / Backdrop -->
        <div class="relative w-full h-[40vh] md:h-[50vh] bg-black shrink-0">
          <!-- Muted Autoplay Background (Preview) -->
          <iframe
            v-if="videoKey"
            :src="`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoKey}&showinfo=0&rel=0`"
            class="absolute inset-0 w-full h-full opacity-60 pointer-events-none scale-125"
            frameborder="0"
            allow="autoplay; encrypted-media"
          ></iframe>
          
          <img 
            v-else
            :src="`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`" 
            class="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          
          <!-- Gradient -->
          <div class="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/20 to-transparent"></div>
          
          <!-- Play Button Overlay -->
          <div class="absolute inset-0 flex items-center justify-center z-10">
            <button 
              @click="isPlaying = true"
              class="group flex items-center justify-center w-20 h-20 rounded-full bg-[#F5C518]/90 hover:bg-[#F5C518] hover:scale-110 transition shadow-lg shadow-yellow-500/30"
            >
              <svg class="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </button>
          </div>
        </div>

        <!-- Info & Cast Section -->
        <div class="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 -mt-10 relative z-20">
          <div class="flex flex-col lg:flex-row gap-10">
            
            <!-- LEFT: Movie Info -->
            <div class="flex-1 space-y-5">
              <h2 class="text-4xl md:text-5xl font-black text-white leading-none">
                {{ movie.title || movie.name }}
              </h2>
              
              <div class="flex items-center gap-4 text-sm font-medium">
                <span class="text-[#F5C518] border border-[#F5C518] px-2 py-0.5 rounded">VIP</span>
                <span class="text-green-500">{{ movie.vote_average?.toFixed(1) }} Rating</span>
                <span class="text-gray-400">{{ getYear(movie) }}</span>
                <span class="text-gray-400">{{ movie.original_language?.toUpperCase() }}</span>
              </div>

              <p class="text-gray-300 text-lg leading-relaxed">
                {{ movie.overview }}
              </p>
              
              <div class="flex gap-4 pt-2">
                 <button @click="isPlaying = true" class="bg-white text-black px-8 py-3 rounded font-bold hover:bg-gray-200 transition">
                   Play Now
                 </button>
                 <button class="bg-gray-800 text-white px-8 py-3 rounded font-bold hover:bg-gray-700 transition">
                   + My List
                 </button>
              </div>
            </div>

            <!-- RIGHT: Cast List (Fixed) -->
            <div class="w-full lg:w-[350px] bg-[#1a1a1a] p-5 rounded-xl border border-gray-800 h-fit">
              <h3 class="text-white font-bold mb-4 border-l-4 border-[#F5C518] pl-3">Top Cast</h3>
              
              <div v-if="cast.length > 0" class="flex flex-col gap-4">
                <div v-for="actor in cast.slice(0, 6)" :key="actor.id" class="flex items-center gap-3 group cursor-pointer">
                  <!-- Actor Image -->
                  <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex-shrink-0 border border-transparent group-hover:border-[#F5C518] transition">
                    <img 
                      v-if="actor.profile_path" 
                      :src="`https://image.tmdb.org/t/p/w185${actor.profile_path}`" 
                      class="w-full h-full object-cover"
                      alt="Actor"
                    >
                    <div v-else class="w-full h-full flex items-center justify-center text-xs text-gray-500">?</div>
                  </div>
                  
                  <!-- Actor Info -->
                  <div class="flex flex-col">
                    <span class="text-white text-sm font-semibold group-hover:text-[#F5C518] transition">{{ actor.name }}</span>
                    <span class="text-gray-500 text-xs line-clamp-1">as {{ actor.character }}</span>
                  </div>
                </div>
              </div>
              
              <div v-else class="text-gray-500 text-sm py-4 text-center">
                Cast information loading...
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { MovieAPI } from '@/services/api' // Ensure this path is correct

const props = defineProps({ movie: Object })
defineEmits(['close'])

const videoKey = ref(null)
const cast = ref([])
const isPlaying = ref(false)

const getYear = (m) => (m.release_date || m.first_air_date || '').split('-')[0]

onMounted(async () => {
  if (!props.movie?.id) return

  // 1. Fetch Video
  try {
    const videos = await MovieAPI.getMovieVideos(props.movie.id)
    // Find trailer, fallback to any youtube video
    const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube') || videos[0]
    if (trailer) videoKey.value = trailer.key
  } catch (e) { console.error("Video error", e) }

  // 2. Fetch Cast
  try {
    const credits = await MovieAPI.getCredits(props.movie.id)
    if (credits && credits.cast) {
      cast.value = credits.cast
    }
  } catch (e) { console.error("Cast error", e) }
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #121212; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in { animation: fade-in 0.3s ease-out; }
</style>