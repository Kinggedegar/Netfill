<template>
  <div class="min-h-screen bg-[#141414] text-white pt-24 px-4 md:px-12 pb-20 animate-fade-in">
    
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-gray-800 pb-6 gap-4">
      <div>
        <h1 class="text-3xl md:text-4xl font-black tracking-wide">Continue Watching</h1>
        <p class="text-gray-400 text-sm mt-2 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-red-600"></span>
          {{ history.length }} {{ history.length === 1 ? 'title' : 'titles' }} in progress
        </p>
      </div>

      <button 
        v-if="history.length > 0"
        @click="clearAll"
        class="text-xs font-bold text-gray-400 hover:text-white border border-gray-600 hover:border-white px-5 py-2.5 rounded uppercase tracking-wider transition duration-300"
      >
        Clear History
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="history.length === 0" class="flex flex-col items-center justify-center py-32 text-center animate-slide-up">
      <div class="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mb-6 text-gray-600 border border-gray-700">
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      </div>
      <h2 class="text-2xl font-bold mb-3">No incomplete titles</h2>
      <p class="text-gray-400 mb-8 max-w-md">Movies and TV shows you start watching will appear here so you can pick up exactly where you left off.</p>
      <router-link to="/" class="bg-red-600 text-white px-8 py-3 rounded font-bold hover:bg-red-700 transition shadow-lg hover:shadow-red-900/40">
        Browse Movies
      </router-link>
    </div>

    <!-- Content Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      
      <div 
        v-for="item in history" 
        :key="item.movieId"
        class="group relative bg-[#1f1f1f] rounded-lg overflow-hidden hover:z-10 transition-all duration-300 hover:scale-105 shadow-xl cursor-pointer ring-1 ring-white/5 hover:ring-white/30"
        @click="resume(item)"
      >
        <!-- 16:9 Thumbnail (Use Backdrop for "Landscape" feel) -->
        <div class="aspect-video relative overflow-hidden">
          <img 
            :src="getImage(item.movie)" 
            class="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition duration-500 transform group-hover:scale-110"
            @error="$event.target.src='https://via.placeholder.com/640x360?text=No+Preview'"
          />
          
          <!-- Dark Gradient Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

          <!-- Centered Play Button (Hidden by default, shows on hover) -->
          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black/30 backdrop-blur-[2px]">
            <div class="w-14 h-14 rounded-full border-2 border-white/80 flex items-center justify-center bg-black/60 shadow-lg transform group-hover:scale-110 transition">
              <svg class="w-6 h-6 text-white pl-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>

          <!-- Progress Bar Section -->
          <div class="absolute bottom-0 left-0 right-0">
             <!-- Metadata line above bar -->
             <div class="px-3 mb-2 flex justify-between items-end">
                <span class="text-[10px] font-bold uppercase tracking-wider text-gray-300 bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-md">
                   {{ getTimeLeft(item) }} left
                </span>
                <span class="text-white/80 hover:text-white transition p-1 rounded-full hover:bg-white/20" @click.stop="removeItem(item.movieId)">
                   <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </span>
             </div>

             <!-- The Bar Track -->
             <div class="h-1 bg-gray-700/50 w-full">
               <!-- The Bar Fill -->
               <div class="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.7)]" :style="{ width: getProgressPercent(item) }"></div>
             </div>
          </div>
        </div>

        <!-- Card Info Body -->
        <div class="p-4 bg-[#181818] relative">
          <h3 class="font-bold text-base truncate text-gray-100 group-hover:text-white transition">
            {{ item.movie.title || item.movie.name }}
          </h3>
          
          <div class="flex items-center justify-between mt-2">
             <div class="flex items-center gap-2 text-xs text-gray-400">
               <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               <span>Watched {{ formatDate(item.timestamp) }}</span>
             </div>
             
             <!-- Play Icon Small -->
             <svg class="w-5 h-5 text-red-600 opacity-0 group-hover:opacity-100 transition transform translate-x-[-10px] group-hover:translate-x-0" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Video Player Overlay -->
    <teleport to="body">
      <VideoPlayer 
        v-if="showPlayer" 
        :movie="selectedItem.movie" 
        :initialMode="selectedItem.mode" 
        @close="showPlayer = false"
      />
    </teleport>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import VideoPlayer from '@/components/VideoPlayer.vue'

const history = ref([])
const showPlayer = ref(false)
const selectedItem = ref(null)

// 1. Load Data
const loadHistory = () => {
  const data = JSON.parse(localStorage.getItem('continueWatching') || '[]')
  // Sort by most recently watched
  history.value = data.sort((a, b) => b.timestamp - a.timestamp)
}

// 2. Remove Specific Item
const removeItem = (id) => {
  if(!confirm('Remove this title from your history?')) return
  history.value = history.value.filter(i => i.movieId !== id)
  localStorage.setItem('continueWatching', JSON.stringify(history.value))
}

// 3. Clear Everything
const clearAll = () => {
  if(confirm('Are you sure you want to clear your entire watch history?')) {
    history.value = []
    localStorage.removeItem('continueWatching')
  }
}

// 4. Play Movie
const resume = (item) => {
  selectedItem.value = item
  showPlayer.value = true
}

// Helper: Get best image (Backdrop preferred for 16:9 look)
const getImage = (movie) => {
  const path = movie.backdrop_path || movie.poster_path
  if (!path) return 'https://via.placeholder.com/640x360?text=No+Image'
  return `https://image.tmdb.org/t/p/w500${path}`
}

// Helper: Format Date (e.g., "Today", "Yesterday", or "Oct 12")
const formatDate = (ts) => {
  if (!ts) return 'Recently'
  const date = new Date(ts)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) 
  
  if (diffDays <= 1) return 'Today'
  if (diffDays === 2) return 'Yesterday'
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

// Helper: Calculate Percentage
const getProgressPercent = (item) => {
  // If your player saves 'percentage' or 'currentTime'/'duration', use that.
  // Fallback: Use the timestamp hash to make a realistic-looking persistent random bar for demo.
  if (item.percentage) return `${item.percentage}%`
  
  // Demo Logic: Create a stable number based on ID so it doesn't change on refresh
  const idNum = item.movieId.toString().split('').reduce((a,b) => a + b.charCodeAt(0), 0)
  const pct = (idNum % 70) + 15 // Between 15% and 85%
  return `${pct}%`
}

// Helper: Simulate "45m left"
const getTimeLeft = (item) => {
  // Demo Logic: 
  const totalDuration = 120 // Assume 2 hours movies for demo
  const pct = parseFloat(getProgressPercent(item))
  const minsLeft = Math.floor(totalDuration * (1 - (pct/100)))
  return `${minsLeft}m`
}

onMounted(loadHistory)
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.6s ease-out; }
.animate-slide-up { animation: slideUp 0.6s ease-out; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>