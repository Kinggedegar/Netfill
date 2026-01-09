<template>
  <div class="min-h-screen bg-[#141414] text-white pt-24 px-4 md:px-12 pb-12">
    
    <!-- Header -->
    <div class="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
      <div>
        <h1 class="text-3xl font-bold">Continue Watching</h1>
        <p class="text-gray-400 text-sm mt-1">
          {{ history.length }} {{ history.length === 1 ? 'title' : 'titles' }} in progress
        </p>
      </div>

      <button 
        v-if="history.length > 0"
        @click="clearAll"
        class="text-sm font-medium text-gray-400 hover:text-white border border-gray-600 hover:border-white px-4 py-2 rounded transition"
      >
        Clear History
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="history.length === 0" class="flex flex-col items-center justify-center py-32 text-center">
      <div class="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6 text-gray-500">
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      </div>
      <h2 class="text-xl font-bold mb-2">No incomplete titles</h2>
      <p class="text-gray-400 mb-6">Movies and TV shows you start watching will appear here.</p>
      <router-link to="/" class="bg-white text-black px-6 py-2.5 rounded font-bold hover:bg-gray-200 transition">
        Browse Home
      </router-link>
    </div>

    <!-- Content Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div 
        v-for="item in history" 
        :key="item.movieId"
        class="group relative bg-[#1f1f1f] rounded-md overflow-hidden hover:z-10 transition-transform duration-300 hover:scale-105 shadow-xl cursor-pointer"
        @click="resume(item)"
      >
        <!-- Backdrop Image -->
        <div class="aspect-video relative">
          <img 
            :src="`https://image.tmdb.org/t/p/w500${item.movie.backdrop_path || item.movie.poster_path}`" 
            class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
          />
          
          <!-- Play Overlay -->
          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40">
            <div class="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center bg-black/50 backdrop-blur">
              <svg class="w-6 h-6 text-white pl-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
            <!-- Simulated progress (random for demo, or based on real timestamp if available) -->
            <div class="h-full bg-red-600" :style="{ width: getProgressWidth(item) }"></div>
          </div>

          <!-- Remove Button -->
          <button 
            @click.stop="removeItem(item.movieId)"
            class="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-gray-300 hover:text-white hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
            title="Remove from history"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Info -->
        <div class="p-4">
          <h3 class="font-bold text-sm truncate">{{ item.movie.title || item.movie.name }}</h3>
          <p class="text-xs text-gray-400 mt-1">Last watched: {{ formatDate(item.timestamp) }}</p>
        </div>
      </div>
    </div>

    <!-- Player -->
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

const loadHistory = () => {
  history.value = JSON.parse(localStorage.getItem('continueWatching') || '[]')
}

const removeItem = (id) => {
  history.value = history.value.filter(i => i.movieId !== id)
  localStorage.setItem('continueWatching', JSON.stringify(history.value))
}

const clearAll = () => {
  if(confirm('Are you sure you want to clear your watch history?')) {
    history.value = []
    localStorage.removeItem('continueWatching')
  }
}

const resume = (item) => {
  selectedItem.value = item
  showPlayer.value = true
}

const formatDate = (ts) => {
  if (!ts) return 'Unknown'
  const date = new Date(ts)
  return date.toLocaleDateString()
}

// Simulate progress calculation (in a real app, you save seconds watched vs total duration)
const getProgressWidth = (item) => {
  // Use timestamp hash to generate a stable pseudo-random percentage between 10% and 90%
  const pct = (item.timestamp % 80) + 10
  return `${pct}%`
}

onMounted(loadHistory)
</script>