<template>
  <div class="min-h-screen bg-[#141414] text-white">
    
    <!-- 1. Sticky Search Header -->
    <div class="sticky top-0 z-40 bg-[#141414]/90 backdrop-blur-md border-b border-gray-800 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div class="relative max-w-2xl mx-auto">
          <input 
            v-model="searchInput"
            @keyup.enter="handleSearch"
            type="text" 
            placeholder="Search for movies, series, or people..." 
            class="w-full bg-gray-800 text-white pl-12 pr-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600 transition-all shadow-lg placeholder-gray-500"
          />
          <!-- Search Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-4 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          <!-- Clear Icon (only shows if typing) -->
          <button v-if="searchInput" @click="clearSearch" class="absolute right-4 top-3.5 text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="max-w-7xl mx-auto px-4 md:px-8 py-8">
      
      <!-- Search Context Title -->
      <div v-if="query && !loading" class="mb-8 flex items-end gap-2">
        <h1 class="text-xl md:text-2xl text-gray-400">
          Results for: <span class="text-white font-bold text-2xl md:text-3xl">"{{ query }}"</span>
        </h1>
        <span class="text-gray-600 text-sm mb-1">({{ results.length }} items)</span>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-32 space-y-4">
         <div class="animate-spin h-12 w-12 border-4 border-red-600 border-t-transparent rounded-full"></div>
         <p class="text-gray-500 animate-pulse">Searching the database...</p>
      </div>

      <!-- Results Grid -->
      <div v-else>
        <TransitionGroup 
          name="list" 
          tag="div" 
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8"
        >
          <div v-for="item in results" :key="item.id" 
            class="group cursor-pointer flex flex-col relative"
            @click="handleClick(item)"
          >
            <!-- Card Image Wrapper -->
            <div class="relative aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition duration-300 group-hover:scale-105 group-hover:shadow-red-900/20 group-hover:ring-2 ring-transparent group-hover:ring-red-600/50">
              
              <img 
                :src="getImage(item)" 
                class="w-full h-full object-cover transition duration-500 group-hover:opacity-80"
                loading="lazy"
                @error="$event.target.src='https://via.placeholder.com/300x450/1f1f1f/ffffff?text=No+Image'"
              />
              
              <!-- Gradient Overlay (for better text readability if we put text inside) -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <!-- Badges -->
              <div class="absolute top-2 left-2 flex gap-1">
                <span class="bg-black/60 backdrop-blur-sm border border-white/10 text-[10px] font-bold px-2 py-1 rounded text-white uppercase tracking-wide">
                  {{ item.media_type === 'tv' ? 'Series' : item.media_type }}
                </span>
              </div>

              <!-- Rating Badge -->
              <div v-if="item.vote_average" class="absolute top-2 right-2">
                 <div :class="getRatingColor(item.vote_average)" class="text-[11px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                   {{ item.vote_average.toFixed(1) }}
                 </div>
              </div>
            </div>
            
            <!-- Content Info (Below Image) -->
            <div class="mt-3 px-1">
              <h3 class="font-medium text-sm md:text-base leading-tight text-gray-100 group-hover:text-red-500 transition-colors line-clamp-1">
                {{ item.title || item.name }}
              </h3>
              <div class="flex items-center justify-between mt-1 text-xs text-gray-500">
                <span>{{ getYear(item) }}</span>
                <!-- Optional: Add extra info like language or icon here -->
              </div>
            </div>
          </div>
        </TransitionGroup>

        <!-- No Results State -->
        <div v-if="results.length === 0 && !loading && query" class="text-center py-20">
          <div class="bg-gray-800/50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">No matches found</h3>
          <p class="text-gray-400">We couldn't find anything for "{{ query }}". Try searching for something else.</p>
        </div>

        <!-- Empty State (No Search Yet) -->
        <div v-if="!query && !loading" class="text-center py-32 text-gray-600">
          <p>Type above to start searching...</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MovieAPI } from '@/services/api' // Assuming this path is correct

const route = useRoute()
const router = useRouter()

const results = ref([])
const loading = ref(false)
const searchInput = ref('') // Local state for the input box

// Sync URL query to local input
const query = computed(() => route.query.q || '')

// Helper: Parse Year
const getYear = (item) => {
  const date = item.release_date || item.first_air_date
  return date ? date.split('-')[0] : 'Unknown'
}

// Helper: Dynamic Color for Ratings
const getRatingColor = (rating) => {
  if (rating >= 7) return 'bg-green-600 text-white'
  if (rating >= 5) return 'bg-yellow-500 text-black'
  return 'bg-red-600 text-white'
}

const getImage = (item) => {
  const path = item.profile_path || item.poster_path
  if (!path) return 'https://via.placeholder.com/300x450/1f1f1f/888888?text=No+Image'
  return `https://image.tmdb.org/t/p/w500${path}`
}

const handleClick = (item) => {
  if (item.media_type === 'person') return 
  router.push(`/movie/${item.id}`)
}

// Update URL when user presses Enter
const handleSearch = () => {
  if (!searchInput.value.trim()) return
  router.push({ query: { q: searchInput.value } })
}

// Clear search
const clearSearch = () => {
  searchInput.value = ''
  router.push({ query: {} })
  results.value = []
}

// API Call
const performSearch = async () => {
  if (!query.value) {
    results.value = []
    searchInput.value = '' // Clear input if URL is empty
    return
  }
  
  // Sync input with URL if user navigated via back button
  searchInput.value = query.value
  
  loading.value = true
  try {
    const data = await MovieAPI.searchContent(query.value)
    results.value = (data.results || []).filter(i => i.poster_path || i.profile_path)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

watch(query, performSearch)
onMounted(performSearch)
</script>

<style scoped>
/* Smooth fade animation for list items */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>