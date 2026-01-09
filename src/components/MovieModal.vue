<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

    <!-- Modal Content -->
    <div class="relative bg-[#181818] w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
      
      <!-- Close Button -->
      <button @click="$emit('close')" class="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black rounded-full p-2 text-white transition">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>

      <!-- Preview Image -->
      <div class="relative aspect-video w-full shrink-0">
        <img 
          :src="`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-[#181818] to-transparent"></div>
        
        <div class="absolute bottom-6 left-6 md:left-10">
          <h2 class="text-3xl md:text-5xl font-black text-white drop-shadow-lg mb-4">{{ movie.title || movie.name }}</h2>
          <div class="flex gap-3">
             <button 
                @click="goToDetails"
                class="bg-white text-black hover:bg-gray-200 px-6 py-2 rounded font-bold flex items-center gap-2 transition"
             >
               <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> Play
             </button>
             <button 
                @click="toggleList"
                class="border border-gray-400 hover:border-white text-white p-2 rounded-full transition bg-black/40"
             >
               <svg v-if="inList" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
               <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
             </button>
          </div>
        </div>
      </div>

      <!-- Scrollable Info -->
      <div class="p-6 md:p-10 overflow-y-auto text-gray-300 grid md:grid-cols-3 gap-8">
        <div class="md:col-span-2 space-y-4">
           <div class="flex items-center gap-3 text-sm">
             <span class="text-green-500 font-bold">{{ (movie.vote_average * 10).toFixed(0) }}% Match</span>
             <span>{{ (movie.release_date || movie.first_air_date || '').split('-')[0] }}</span>
             <span class="border border-gray-500 px-1 rounded text-xs">HD</span>
           </div>
           <p class="text-white text-base leading-relaxed">
             {{ movie.overview }}
           </p>
        </div>
        <div class="text-sm space-y-2">
           <p><span class="text-gray-500">Genres:</span> <span class="text-white">{{ movie.genre_ids?.join(', ') || 'Action, Drama' }}</span></p>
           <p><span class="text-gray-500">Language:</span> <span class="text-white uppercase">{{ movie.original_language }}</span></p>
           <p><span class="text-gray-500">Rating:</span> <span class="text-white">{{ movie.vote_average }}/10</span></p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps(['movie'])
const emit = defineEmits(['close'])
const router = useRouter()

const inList = ref(false) // Simplified for demo, connect to real localStorage logic if needed

const goToDetails = () => {
  emit('close')
  router.push(`/movie/${props.movie.id}`)
}

const toggleList = () => {
  inList.value = !inList.value
  // Add logic to save to localStorage
}
</script>

<style scoped>
.animate-scale-in { animation: scaleIn 0.2s ease-out; }
@keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
</style>